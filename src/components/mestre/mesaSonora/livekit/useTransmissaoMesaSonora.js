import { useCallback, useEffect, useRef, useState } from "react";
import { RoomEvent, Track } from "livekit-client";
import { ESTADOS_TRANSMISSAO, NOME_FAIXA_MESA_SONORA, TOPICO_ESTADO_MESA_SONORA } from "./mesaSonoraLiveKitConstants.js";
import { criarPacoteEstadoMesaSonora, participanteEhMestre, volumeNormalizado } from "./mesaSonoraLiveKitUtils.js";

function criarAudioContext() {
  const Contexto = window.AudioContext || window.webkitAudioContext;
  if (!Contexto) throw new Error("Este navegador não oferece Web Audio API.");
  return new Contexto({ latencyHint: "interactive" });
}

export default function useTransmissaoMesaSonora({ room, conectado, volumeSala, meuVolumeEfetivo }) {
  const mixerRef = useRef(null);
  const publicacaoRef = useRef(null);
  const roomPublicadaRef = useRef(null);
  const canaisRef = useRef(new Map());
  const buffersRef = useRef(new Map());
  const estadoAtualRef = useRef({ somAtual: "", cenaAtual: "", tocando: false, pausado: false });
  const [estadoTransmissao, setEstadoTransmissao] = useState(ESTADOS_TRANSMISSAO.DESCONECTADO);
  const [erroTransmissao, setErroTransmissao] = useState("");

  const podeTransmitir = Boolean(room && conectado && participanteEhMestre(room.localParticipant));

  const obterMixer = useCallback(() => {
    if (mixerRef.current) return mixerRef.current;
    const contexto = criarAudioContext();
    const mistura = contexto.createGain();
    const ganhoSala = contexto.createGain();
    const ganhoMonitor = contexto.createGain();
    const destino = contexto.createMediaStreamDestination();
    mistura.connect(ganhoSala);
    ganhoSala.connect(destino);
    mistura.connect(ganhoMonitor);
    ganhoMonitor.connect(contexto.destination);
    ganhoSala.gain.value = volumeNormalizado(volumeSala);
    ganhoMonitor.gain.value = volumeNormalizado(meuVolumeEfetivo);
    destino.channelCount = 2;
    mixerRef.current = { contexto, mistura, ganhoSala, ganhoMonitor, destino };
    return mixerRef.current;
  }, [meuVolumeEfetivo, volumeSala]);

  const publicarFaixa = useCallback(async () => {
    if (!podeTransmitir) throw new Error("Entre na comunicação como mestre antes de transmitir a Mesa Sonora.");
    if (publicacaoRef.current && roomPublicadaRef.current === room) return publicacaoRef.current;
    const mixer = obterMixer();
    const faixa = mixer.destino.stream.getAudioTracks()[0];
    setEstadoTransmissao(ESTADOS_TRANSMISSAO.PUBLICANDO);
    const publicacao = await room.localParticipant.publishTrack(faixa, {
      name: NOME_FAIXA_MESA_SONORA,
      source: Track.Source.ScreenShareAudio,
      forceStereo: true,
      dtx: false,
      red: false,
    });
    publicacaoRef.current = publicacao;
    roomPublicadaRef.current = room;
    setEstadoTransmissao(ESTADOS_TRANSMISSAO.TRANSMITINDO);
    setErroTransmissao("");
    return publicacao;
  }, [obterMixer, podeTransmitir, room]);

  const publicarEstado = useCallback(async (estado) => {
    if (!podeTransmitir) return false;
    const pacote = criarPacoteEstadoMesaSonora({ ...estadoAtualRef.current, ...estado, volumeSala });
    estadoAtualRef.current = pacote;
    await room.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(pacote)), { reliable: true, topic: TOPICO_ESTADO_MESA_SONORA });
    return true;
  }, [podeTransmitir, room, volumeSala]);

  useEffect(() => {
    if (!room || !podeTransmitir) return undefined;
    const sincronizarParticipanteNovo = () => { void publicarEstado(estadoAtualRef.current); };
    room.on(RoomEvent.ParticipantConnected, sincronizarParticipanteNovo);
    return () => room.off(RoomEvent.ParticipantConnected, sincronizarParticipanteNovo);
  }, [podeTransmitir, publicarEstado, room]);

  const obterBuffer = useCallback(async (som) => {
    const salvo = buffersRef.current.get(som.id);
    if (salvo?.url === som.urlObjeto) return salvo.buffer;
    const mixer = obterMixer();
    const resposta = await fetch(som.urlObjeto);
    if (!resposta.ok) throw new Error("O arquivo local não pôde ser lido.");
    const buffer = await mixer.contexto.decodeAudioData(await resposta.arrayBuffer());
    buffersRef.current.set(som.id, { url: som.urlObjeto, buffer });
    return buffer;
  }, [obterMixer]);

  const iniciarCanal = useCallback(async (som, eventos, offset = 0) => {
    if (!podeTransmitir) throw new Error("A comunicação do mestre precisa estar conectada.");
    const mixer = obterMixer();
    await mixer.contexto.resume();
    await publicarFaixa();
    const buffer = await obterBuffer(som);
    const anterior = canaisRef.current.get(som.id);
    if (anterior?.source) { anterior.encerramentoManual = true; anterior.source.stop(); }
    const source = mixer.contexto.createBufferSource();
    const ganho = mixer.contexto.createGain();
    source.buffer = buffer;
    source.loop = Boolean(som.loop);
    source.connect(ganho);
    ganho.connect(mixer.mistura);
    const volume = volumeNormalizado(som.volume);
    ganho.gain.setValueAtTime(som.fadeIn > 0 ? 0 : volume, mixer.contexto.currentTime);
    if (som.fadeIn > 0) ganho.gain.linearRampToValueAtTime(volume, mixer.contexto.currentTime + Number(som.fadeIn));
    const canal = { source, ganho, buffer, offset, iniciadoEm: mixer.contexto.currentTime, pausado: false, encerramentoManual: false, som, eventos };
    canaisRef.current.set(som.id, canal);
    source.onended = () => {
      if (canal.encerramentoManual || source.loop) return;
      canaisRef.current.delete(som.id);
      eventos.aoFinalizar?.();
    };
    source.start(0, Math.min(offset, Math.max(0, buffer.duration - 0.01)));
    eventos.aoTocar?.();
    await publicarEstado({ somAtual: som.nome, tocando: true, pausado: false, iniciadoEm: Date.now(), botaoId: som.id });
  }, [obterBuffer, obterMixer, podeTransmitir, publicarEstado, publicarFaixa]);

  const criarControleArquivo = useCallback((som, eventos = {}) => ({
    async tocar() {
      try {
        const canal = canaisRef.current.get(som.id);
        await iniciarCanal(som, eventos, canal?.pausado ? canal.offset : 0);
      } catch (erro) {
        setEstadoTransmissao(ESTADOS_TRANSMISSAO.ERRO);
        setErroTransmissao(erro.message);
        eventos.aoErro?.(erro.message);
      }
    },
    pausar() {
      const mixer = mixerRef.current;
      const canal = canaisRef.current.get(som.id);
      if (!mixer || !canal?.source) return;
      canal.offset = (canal.offset + mixer.contexto.currentTime - canal.iniciadoEm) % canal.buffer.duration;
      canal.pausado = true;
      canal.encerramentoManual = true;
      canal.source.stop();
      eventos.aoPausar?.();
      void publicarEstado({ somAtual: som.nome, tocando: false, pausado: true, botaoId: som.id });
    },
    parar() {
      const mixer = mixerRef.current;
      const canal = canaisRef.current.get(som.id);
      if (!mixer || !canal) return;
      canal.encerramentoManual = true;
      const concluir = () => { try { canal.source.stop(); } catch { /* já encerrada */ } canaisRef.current.delete(som.id); eventos.aoParar?.(); };
      if (som.fadeOut > 0) { canal.ganho.gain.linearRampToValueAtTime(0, mixer.contexto.currentTime + Number(som.fadeOut)); window.setTimeout(concluir, Number(som.fadeOut) * 1000); }
      else concluir();
      void publicarEstado({ somAtual: "", tocando: false, pausado: false, botaoId: som.id });
    },
    async reiniciar() { this.parar(); await iniciarCanal(som, eventos, 0); },
    destruir() {
      const canal = canaisRef.current.get(som.id);
      if (canal) { canal.encerramentoManual = true; try { canal.source.stop(); } catch { /* encerrada */ } }
      canaisRef.current.delete(som.id);
      buffersRef.current.delete(som.id);
    },
  }), [iniciarCanal, publicarEstado]);

  const encerrarFaixa = useCallback(async () => {
    canaisRef.current.forEach((canal) => { canal.encerramentoManual = true; try { canal.source.stop(); } catch { /* encerrada */ } });
    canaisRef.current.clear();
    const publicacao = publicacaoRef.current;
    publicacaoRef.current = null;
    roomPublicadaRef.current = null;
    if (room && publicacao?.track) await room.localParticipant.unpublishTrack(publicacao.track, false);
    setEstadoTransmissao(podeTransmitir ? ESTADOS_TRANSMISSAO.PRONTO : ESTADOS_TRANSMISSAO.DESCONECTADO);
    await publicarEstado({ somAtual: "", cenaAtual: "", tocando: false, pausado: false });
  }, [podeTransmitir, publicarEstado, room]);

  useEffect(() => {
    const mixer = mixerRef.current;
    if (mixer) mixer.ganhoSala.gain.setTargetAtTime(volumeNormalizado(volumeSala), mixer.contexto.currentTime, 0.02);
    void publicarEstado({ volumeSala });
  }, [publicarEstado, volumeSala]);

  useEffect(() => {
    const mixer = mixerRef.current;
    if (mixer) mixer.ganhoMonitor.gain.setTargetAtTime(volumeNormalizado(meuVolumeEfetivo), mixer.contexto.currentTime, 0.02);
  }, [meuVolumeEfetivo]);

  useEffect(() => {
    if (!conectado) { publicacaoRef.current = null; roomPublicadaRef.current = null; setEstadoTransmissao(ESTADOS_TRANSMISSAO.DESCONECTADO); }
    else if (podeTransmitir) setEstadoTransmissao((atual) => atual === ESTADOS_TRANSMISSAO.TRANSMITINDO ? atual : ESTADOS_TRANSMISSAO.PRONTO);
  }, [conectado, podeTransmitir, room]);

  return { podeTransmitir, estadoTransmissao, erroTransmissao, criarControleArquivo, publicarFaixa, encerrarFaixa, publicarEstado };
}
