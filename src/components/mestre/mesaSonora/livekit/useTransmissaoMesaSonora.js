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
  const capturaExternaRef = useRef(null);
  const estadoAtualRef = useRef({ somAtual: "", cenaAtual: "", tocando: false, pausado: false });
  const [estadoTransmissao, setEstadoTransmissao] = useState(ESTADOS_TRANSMISSAO.DESCONECTADO);
  const [erroTransmissao, setErroTransmissao] = useState("");
  const [capturandoAudioExterno, setCapturandoAudioExterno] = useState(false);
  const [iniciandoAudioExterno, setIniciandoAudioExterno] = useState(false);
  const [erroAudioExterno, setErroAudioExterno] = useState("");
  const [nivelAudioExterno, setNivelAudioExterno] = useState(0);

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

  const pararCapturaExternaAtual = useCallback((pararTracks = true) => {
    const captura = capturaExternaRef.current;
    capturaExternaRef.current = null;

    if (captura?.fonte) {
      try {
        captura.fonte.disconnect();
      } catch {
        // A fonte já pode ter sido encerrada pelo navegador.
      }
    }
    if (captura?.analisador) {
      try {
        captura.analisador.disconnect();
      } catch {
        // O analisador já pode ter sido desconectado.
      }
    }
    if (captura?.medidorId) cancelAnimationFrame(captura.medidorId);

    if (captura?.stream) {
      captura.stream.getTracks().forEach((track) => {
        track.onended = null;
        if (pararTracks) track.stop();
      });
    }

    setCapturandoAudioExterno(false);
    setIniciandoAudioExterno(false);
    setNivelAudioExterno(0);
  }, []);

  const encerrarCapturaAudioExterno = useCallback(async () => {
    pararCapturaExternaAtual(true);
    setErroAudioExterno("");
    try {
      await publicarEstado({ somAtual: "", tocando: false, pausado: false });
    } catch {
      // A sala pode ter sido desconectada ao mesmo tempo.
    }
  }, [pararCapturaExternaAtual, publicarEstado]);

  const iniciarCapturaAudioExterno = useCallback(async () => {
    if (!podeTransmitir) {
      setErroAudioExterno("Entre na voz como mestre antes de transmitir áudio externo.");
      return false;
    }
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setErroAudioExterno("Este navegador não permite capturar o áudio de uma aba.");
      return false;
    }
    if (capturaExternaRef.current) return true;

    setIniciandoAudioExterno(true);
    setErroAudioExterno("");
    let stream;

    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
        preferCurrentTab: true,
        selfBrowserSurface: "include",
        systemAudio: "include",
        surfaceSwitching: "include",
      });

      const faixaAudio = stream.getAudioTracks()[0];
      if (!faixaAudio) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("Nenhum áudio foi compartilhado. Escolha uma aba e marque “Compartilhar áudio”.");
      }

      const mixer = obterMixer();
      await mixer.contexto.resume();
      await publicarFaixa();

      const streamAudio = new MediaStream([faixaAudio]);
      const fonte = mixer.contexto.createMediaStreamSource(streamAudio);
      const analisador = mixer.contexto.createAnalyser();
      analisador.fftSize = 256;
      analisador.smoothingTimeConstant = 0.72;

      // Envia a aba somente para a sala. O mestre já ouve o áudio na aba original.
      fonte.connect(analisador);
      analisador.connect(mixer.ganhoSala);

      const amostras = new Uint8Array(analisador.fftSize);
      let ultimaAtualizacao = 0;
      const captura = { stream, fonte, analisador, medidorId: 0 };
      const medirAudio = (agora) => {
        if (capturaExternaRef.current !== captura) return;
        analisador.getByteTimeDomainData(amostras);
        let somaQuadrados = 0;
        for (let indice = 0; indice < amostras.length; indice += 1) {
          const amostra = (amostras[indice] - 128) / 128;
          somaQuadrados += amostra * amostra;
        }
        if (agora - ultimaAtualizacao >= 80) {
          const rms = Math.sqrt(somaQuadrados / amostras.length);
          setNivelAudioExterno(Math.min(100, Math.round(rms * 420)));
          ultimaAtualizacao = agora;
        }
        captura.medidorId = requestAnimationFrame(medirAudio);
      };
      capturaExternaRef.current = captura;
      captura.medidorId = requestAnimationFrame(medirAudio);

      const finalizarPeloNavegador = () => {
        pararCapturaExternaAtual(true);
        publicarEstado({ somAtual: "", tocando: false, pausado: false }).catch(() => {});
      };
      stream.getTracks().forEach((track) => {
        track.onended = finalizarPeloNavegador;
      });

      setCapturandoAudioExterno(true);
      setIniciandoAudioExterno(false);
      await publicarEstado({
        somAtual: "Áudio externo da aba",
        tocando: true,
        pausado: false,
        iniciadoEm: Date.now(),
      });
      return true;
    } catch (erro) {
      pararCapturaExternaAtual(true);
      if (stream) stream.getTracks().forEach((track) => track.stop());
      const cancelado = erro?.name === "NotAllowedError" || erro?.name === "AbortError";
      setErroAudioExterno(
        cancelado
          ? "O compartilhamento foi cancelado. Tente novamente e selecione uma aba com áudio."
          : erro?.message || "Não foi possível transmitir o áudio da aba.",
      );
      setIniciandoAudioExterno(false);
      setCapturandoAudioExterno(false);
      return false;
    }
  }, [obterMixer, pararCapturaExternaAtual, podeTransmitir, publicarEstado, publicarFaixa]);

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
    pararCapturaExternaAtual(true);
    canaisRef.current.forEach((canal) => { canal.encerramentoManual = true; try { canal.source.stop(); } catch { /* encerrada */ } });
    canaisRef.current.clear();
    const publicacao = publicacaoRef.current;
    publicacaoRef.current = null;
    roomPublicadaRef.current = null;
    if (room && publicacao?.track) await room.localParticipant.unpublishTrack(publicacao.track, false);
    setEstadoTransmissao(podeTransmitir ? ESTADOS_TRANSMISSAO.PRONTO : ESTADOS_TRANSMISSAO.DESCONECTADO);
    await publicarEstado({ somAtual: "", cenaAtual: "", tocando: false, pausado: false });
  }, [pararCapturaExternaAtual, podeTransmitir, publicarEstado, room]);

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
    if (!conectado) {
      pararCapturaExternaAtual(true);
      publicacaoRef.current = null;
      roomPublicadaRef.current = null;
      setEstadoTransmissao(ESTADOS_TRANSMISSAO.DESCONECTADO);
    }
    else if (podeTransmitir) setEstadoTransmissao((atual) => atual === ESTADOS_TRANSMISSAO.TRANSMITINDO ? atual : ESTADOS_TRANSMISSAO.PRONTO);
  }, [conectado, pararCapturaExternaAtual, podeTransmitir, room]);

  useEffect(() => () => {
    pararCapturaExternaAtual(true);
  }, [pararCapturaExternaAtual]);

  return {
    podeTransmitir,
    estadoTransmissao,
    erroTransmissao,
    capturandoAudioExterno,
    iniciandoAudioExterno,
    erroAudioExterno,
    nivelAudioExterno,
    criarControleArquivo,
    publicarFaixa,
    encerrarFaixa,
    publicarEstado,
    iniciarCapturaAudioExterno,
    encerrarCapturaAudioExterno,
  };
}
