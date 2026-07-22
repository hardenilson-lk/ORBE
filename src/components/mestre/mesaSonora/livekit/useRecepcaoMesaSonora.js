import { useCallback, useEffect, useRef, useState } from "react";
import { RoomEvent } from "livekit-client";
import { CHAVE_MEU_VOLUME, ESTADO_REMOTO_INICIAL, ESTADOS_TRANSMISSAO, NOME_FAIXA_MESA_SONORA, TOPICO_ESTADO_MESA_SONORA, VOLUME_LOCAL_PADRAO } from "./mesaSonoraLiveKitConstants.js";
import { faixaMesaSonoraValida, lerPacoteEstadoMesaSonora, limitarVolume, participanteEhMestre, volumeNormalizado } from "./mesaSonoraLiveKitUtils.js";

function carregarVolume(mesaId) {
  const valor = Number(localStorage.getItem(`${CHAVE_MEU_VOLUME}:${mesaId}`));
  return Number.isFinite(valor) ? limitarVolume(valor) : VOLUME_LOCAL_PADRAO;
}

export default function useRecepcaoMesaSonora({ mesaId, room, conectado }) {
  const [meuVolume, setMeuVolume] = useState(() => carregarVolume(mesaId));
  const [silenciado, setSilenciado] = useState(false);
  const [audioBloqueado, setAudioBloqueado] = useState(false);
  const [estadoRemoto, setEstadoRemoto] = useState(ESTADO_REMOTO_INICIAL);
  const [estadoRecepcao, setEstadoRecepcao] = useState(ESTADOS_TRANSMISSAO.DESCONECTADO);
  const trackRef = useRef(null);
  const elementosRef = useRef(null);
  const meuVolumeEfetivo = silenciado ? 0 : meuVolume;
  const meuVolumeEfetivoRef = useRef(meuVolumeEfetivo);
  meuVolumeEfetivoRef.current = meuVolumeEfetivo;

  const aplicarVolume = useCallback((track = trackRef.current, volume = meuVolumeEfetivoRef.current) => {
    track?.setVolume?.(volumeNormalizado(volume));
  }, []);

  const soltarFaixa = useCallback(() => {
    const track = trackRef.current;
    if (track) track.detach().forEach((elemento) => elemento.remove());
    trackRef.current = null;
    elementosRef.current?.replaceChildren();
    setEstadoRecepcao(conectado ? ESTADOS_TRANSMISSAO.PRONTO : ESTADOS_TRANSMISSAO.DESCONECTADO);
  }, [conectado]);

  const anexarFaixa = useCallback((track, publicacao, participante) => {
    if (!faixaMesaSonoraValida(track, publicacao, participante)) return false;
    soltarFaixa();
    trackRef.current = track;
    aplicarVolume(track);
    const elemento = track.attach();
    elemento.autoplay = true;
    elemento.playsInline = true;
    elementosRef.current?.appendChild(elemento);
    elemento.play().catch(() => setAudioBloqueado(true));
    setEstadoRecepcao(ESTADOS_TRANSMISSAO.TRANSMITINDO);
    return true;
  }, [aplicarVolume, soltarFaixa]);

  useEffect(() => {
    localStorage.setItem(`${CHAVE_MEU_VOLUME}:${mesaId}`, String(meuVolume));
    aplicarVolume(trackRef.current, meuVolumeEfetivo);
  }, [aplicarVolume, mesaId, meuVolume, meuVolumeEfetivo]);

  useEffect(() => {
    if (!room || !conectado) {
      soltarFaixa();
      setEstadoRemoto(ESTADO_REMOTO_INICIAL);
      return undefined;
    }

    setEstadoRecepcao(ESTADOS_TRANSMISSAO.PRONTO);
    const aoAssinar = (track, publicacao, participante) => anexarFaixa(track, publicacao, participante);
    const aoDesassinar = (track, publicacao) => {
      if (track === trackRef.current || publicacao?.name === NOME_FAIXA_MESA_SONORA) {
        soltarFaixa();
        setEstadoRemoto(ESTADO_REMOTO_INICIAL);
      }
    };
    const aoDados = (payload, participante, _tipo, topico) => {
      if (topico !== TOPICO_ESTADO_MESA_SONORA || !participante) return;
      if (!participanteEhMestre(participante)) return;
      const pacote = lerPacoteEstadoMesaSonora(payload);
      if (pacote) setEstadoRemoto(pacote);
    };
    const aoAutoplay = () => setAudioBloqueado(!room.canPlaybackAudio);
    const aoDesconectar = () => { soltarFaixa(); setEstadoRemoto(ESTADO_REMOTO_INICIAL); setEstadoRecepcao(ESTADOS_TRANSMISSAO.INTERROMPIDO); };

    room.on(RoomEvent.TrackSubscribed, aoAssinar);
    room.on(RoomEvent.TrackUnsubscribed, aoDesassinar);
    room.on(RoomEvent.DataReceived, aoDados);
    room.on(RoomEvent.AudioPlaybackStatusChanged, aoAutoplay);
    room.on(RoomEvent.Reconnecting, aoDesconectar);
    room.on(RoomEvent.Disconnected, aoDesconectar);

    room.remoteParticipants.forEach((participante) => participante.trackPublications.forEach((publicacao) => {
      if (publicacao.track) anexarFaixa(publicacao.track, publicacao, participante);
    }));
    aoAutoplay();

    return () => {
      room.off(RoomEvent.TrackSubscribed, aoAssinar);
      room.off(RoomEvent.TrackUnsubscribed, aoDesassinar);
      room.off(RoomEvent.DataReceived, aoDados);
      room.off(RoomEvent.AudioPlaybackStatusChanged, aoAutoplay);
      room.off(RoomEvent.Reconnecting, aoDesconectar);
      room.off(RoomEvent.Disconnected, aoDesconectar);
      soltarFaixa();
    };
  }, [anexarFaixa, conectado, room, soltarFaixa]);

  async function ativarAudio() {
    if (!room) return;
    await room.startAudio();
    setAudioBloqueado(!room.canPlaybackAudio);
    elementosRef.current?.querySelectorAll("audio").forEach((audio) => void audio.play());
  }

  return {
    meuVolume, setMeuVolume: (valor) => setMeuVolume(limitarVolume(valor)), silenciado, setSilenciado,
    meuVolumeEfetivo, audioBloqueado, ativarAudio, estadoRemoto, estadoRecepcao, elementosRef,
  };
}
