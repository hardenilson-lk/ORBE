import { useCallback, useEffect, useRef, useState } from "react";

import { criarIdentidadeParticipante, criarNomeSala, LIVEKIT_URL, TOPICO_COMUNICACAO, validarConfiguracaoComunicacao } from "../config/comunicacaoConfig.js";
import { criarClienteLiveKit, lerDadosRecebidos, publicarDados, RoomEvent, Track } from "../services/livekitClient.js";
import { definirSalaComunicacao, limparSalaComunicacao } from "../services/comunicacaoRoomStore.js";
import { solicitarTokenLiveKit } from "../services/tokenService.js";
import { NOME_FAIXA_MESA_SONORA } from "../../components/mestre/mesaSonora/livekit/mesaSonoraLiveKitConstants.js";

function metadados(participante) {
  try { return JSON.parse(participante?.metadata || "{}"); } catch { return {}; }
}

function mensagemErroMicrofone(erro) {
  if (erro?.name === "NotAllowedError" || erro?.name === "PermissionDeniedError") return "O acesso ao microfone foi negado. Libere a permissão do navegador e tente novamente.";
  if (erro?.name === "NotFoundError" || erro?.name === "DevicesNotFoundError") return "Nenhum microfone foi encontrado neste dispositivo.";
  if (!navigator.mediaDevices?.getUserMedia) return "Este navegador não oferece suporte ao microfone.";
  return "Não foi possível ativar o microfone. Verifique o dispositivo e tente novamente.";
}

function mensagemErroConexao(erro) {
  const detalhe = String(erro?.message || "").toLowerCase();
  if (detalhe.includes("token") || detalhe.includes("unauthorized") || detalhe.includes("401") || detalhe.includes("403")) return "O acesso à sala foi recusado. Solicite um novo token e tente novamente.";
  if (detalhe.includes("room") || detalhe.includes("sala")) return "A sala de comunicação está indisponível no momento.";
  if (detalhe.includes("server") || detalhe.includes("servidor") || detalhe.includes("signal") || detalhe.includes("websocket")) return "Não foi possível alcançar o serviço de comunicação.";
  return "Não foi possível conectar à sala. Verifique sua internet e tente novamente.";
}

export default function useComunicacaoMesa({ mesaId, identidadeLocal, nomeLocal, papelLocal, audiosRef }) {
  const [conectado, setConectado] = useState(false);
  const [conectando, setConectando] = useState(false);
  const [microfoneMudo, setMicrofoneMudo] = useState(false);
  const [audioSilenciado, setAudioSilenciado] = useState(false);
  const [estado, setEstado] = useState("Voz desconectada");
  const [estadoConexao, setEstadoConexao] = useState("desconectado");
  const [participantes, setParticipantes] = useState([]);
  const [falando, setFalando] = useState(new Set());
  const [pacoteRecebido, setPacoteRecebido] = useState(null);
  const roomRef = useRef(null);
  const entrandoRef = useRef(false);
  const audioSilenciadoRef = useRef(false);
  audioSilenciadoRef.current = audioSilenciado;

  const atualizarParticipantes = useCallback((room = roomRef.current) => {
    if (!room) return setParticipantes([]);
    const mapear = (participante, local = false) => {
      const meta = metadados(participante);
      return {
        id: participante.identity,
        nome: participante.name || meta.nome || participante.identity || "Participante",
        papel: meta.papel || "Jogador",
        local,
        mudo: !participante.isMicrophoneEnabled,
      };
    };
    setParticipantes([mapear(room.localParticipant, true), ...[...room.remoteParticipants.values()].map((item) => mapear(item))]);
  }, []);

  const desconectar = useCallback(async (mensagem = "Voz desconectada") => {
    const room = roomRef.current;
    roomRef.current = null;
    entrandoRef.current = false;
    if (room) {
      limparSalaComunicacao(mesaId, room);
      try { await room.localParticipant.setMicrophoneEnabled(false); } catch (erro) { console.warn("[Comunicação] Microfone já estava encerrado.", erro); }
      room.removeAllListeners();
      await room.disconnect();
    }
    audiosRef.current?.replaceChildren();
    setConectado(false);
    setConectando(false);
    setMicrofoneMudo(false);
    setAudioSilenciado(false);
    setParticipantes([]);
    setFalando(new Set());
    setEstadoConexao("desconectado");
    setEstado(mensagem);
  }, [audiosRef, mesaId]);

  const entrar = useCallback(async () => {
    if (entrandoRef.current || roomRef.current) {
      setEstado("Você já está entrando ou conectado à sala.");
      return;
    }
    const erroConfig = validarConfiguracaoComunicacao();
    if (erroConfig) { setEstado(erroConfig); setEstadoConexao("erro"); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setEstado("Este navegador não oferece suporte ao microfone."); setEstadoConexao("erro"); return; }
    entrandoRef.current = true;
    setConectando(true);
    setEstadoConexao("conectando");
    setEstado("Solicitando entrada segura na sala...");
    const sala = criarNomeSala(mesaId);
    const identidade = criarIdentidadeParticipante(identidadeLocal);
    const room = criarClienteLiveKit();
    roomRef.current = room;
    definirSalaComunicacao(mesaId, { room, conectado: false, papel: papelLocal, identidade });

    room.on(RoomEvent.ParticipantConnected, () => atualizarParticipantes(room));
    room.on(RoomEvent.ParticipantDisconnected, () => atualizarParticipantes(room));
    room.on(RoomEvent.TrackMuted, () => atualizarParticipantes(room));
    room.on(RoomEvent.TrackUnmuted, () => atualizarParticipantes(room));
    room.on(RoomEvent.LocalTrackPublished, () => atualizarParticipantes(room));
    room.on(RoomEvent.LocalTrackUnpublished, () => atualizarParticipantes(room));
    room.on(RoomEvent.TrackSubscribed, (track, publicacao) => {
      if (publicacao?.name === NOME_FAIXA_MESA_SONORA) return;
      if (track.kind !== Track.Kind.Audio || !audiosRef.current) return;
      const elemento = track.attach();
      elemento.autoplay = true;
      elemento.muted = audioSilenciadoRef.current;
      audiosRef.current.appendChild(elemento);
      elemento.play().catch((erro) => console.warn("[Comunicação] Reprodução aguardando interação.", erro));
    });
    room.on(RoomEvent.TrackUnsubscribed, (track) => track.detach().forEach((elemento) => elemento.remove()));
    room.on(RoomEvent.ActiveSpeakersChanged, (ativos) => setFalando(new Set(ativos.map((item) => item.identity))));
    room.on(RoomEvent.DataReceived, (payload, participante, _tipo, topico) => {
      if (topico !== TOPICO_COMUNICACAO) return;
      const dados = lerDadosRecebidos(payload);
      if (dados) setPacoteRecebido({ ...dados, recebidoDe: participante?.identity, recebidoEm: Date.now() });
    });
    room.on(RoomEvent.Reconnecting, () => { setEstadoConexao("reconectando"); setEstado("Conexão perdida. Tentando restabelecer a sala..."); });
    room.on(RoomEvent.Reconnected, () => {
      const meta = metadados(room.localParticipant);
      definirSalaComunicacao(mesaId, { room, conectado: true, papel: meta.papel || papelLocal, identidade: room.localParticipant.identity });
      setEstadoConexao("conectado");
      setEstado("Conexão restabelecida.");
      atualizarParticipantes(room);
    });
    room.on(RoomEvent.Disconnected, () => {
      if (roomRef.current === room) void desconectar("A conexão com a sala foi encerrada.");
    });

    let token;
    try {
      token = await solicitarTokenLiveKit({ sala, identidade, nome: nomeLocal, papel: papelLocal });
    } catch (erro) {
      console.error("[Comunicação] Não foi possível obter autorização.", erro);
      await desconectar(erro.message || "O servidor não conseguiu autorizar sua entrada na sala.");
      setEstadoConexao("erro");
      return;
    }

    try {
      setEstado("Conectando ao LiveKit...");
      await room.connect(LIVEKIT_URL, token, { autoSubscribe: true });
      await room.startAudio();
      setEstado("Solicitando acesso ao microfone...");
      await room.localParticipant.setMicrophoneEnabled(true, { echoCancellation: true, noiseSuppression: true, autoGainControl: true });
      entrandoRef.current = false;
      setConectando(false);
      setConectado(true);
      setEstadoConexao("conectado");
      setEstado("Você está na voz da mesa.");
      const meta = metadados(room.localParticipant);
      definirSalaComunicacao(mesaId, { room, conectado: true, papel: meta.papel || papelLocal, identidade: room.localParticipant.identity });
      atualizarParticipantes(room);
    } catch (erro) {
      console.error("[Comunicação] Não foi possível entrar na sala.", erro);
      const falhaMicrofone = ["NotAllowedError", "PermissionDeniedError", "NotFoundError", "DevicesNotFoundError"].includes(erro?.name);
      const mensagem = falhaMicrofone ? mensagemErroMicrofone(erro) : mensagemErroConexao(erro);
      await desconectar(mensagem);
      setEstadoConexao("erro");
    }
  }, [atualizarParticipantes, audiosRef, desconectar, identidadeLocal, mesaId, nomeLocal, papelLocal]);

  async function alternarMicrofone() {
    const room = roomRef.current;
    if (!room || !conectado) return setEstado("Entre na voz antes de controlar o microfone.");
    const proximoMudo = !microfoneMudo;
    try {
      await room.localParticipant.setMicrophoneEnabled(!proximoMudo);
      setMicrofoneMudo(proximoMudo);
      setEstado(proximoMudo ? "Seu microfone está silenciado." : "Seu microfone está ativo.");
      atualizarParticipantes(room);
    } catch (erro) { console.error("[Comunicação] Falha ao alternar microfone.", erro); setEstado(mensagemErroMicrofone(erro)); }
  }

  function alternarAudio() {
    if (!conectado) return setEstado("Entre na voz antes de controlar o áudio da mesa.");
    const proximo = !audioSilenciado;
    audiosRef.current?.querySelectorAll("audio").forEach((audio) => { audio.muted = proximo; });
    setAudioSilenciado(proximo);
    setEstado(proximo ? "O áudio da mesa foi silenciado somente para você." : "Você voltou a ouvir a mesa.");
  }

  async function enviarDados(dados) {
    if (!roomRef.current || !conectado) throw new Error("Comunicação desconectada.");
    await publicarDados(roomRef.current, dados, TOPICO_COMUNICACAO);
  }

  function obterFaixaMicrofone() {
    const publicacao = roomRef.current?.localParticipant.getTrackPublication(Track.Source.Microphone);
    return publicacao?.track?.mediaStreamTrack || null;
  }

  useEffect(() => () => { void desconectar(); }, [desconectar]);
  return { conectado, conectando, microfoneMudo, audioSilenciado, estado, estadoConexao, participantes, falando, pacoteRecebido, entrar, sair: desconectar, alternarMicrofone, alternarAudio, enviarDados, obterFaixaMicrofone, definirEstado: setEstado };
}
