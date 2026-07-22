import { Track } from "livekit-client";
import { NOME_FAIXA_MESA_SONORA, VOLUME_MAXIMO, VOLUME_MINIMO } from "./mesaSonoraLiveKitConstants.js";

export function lerMetadadosParticipante(participante) {
  try { return JSON.parse(participante?.metadata || "{}"); }
  catch { return {}; }
}

export function papelParticipante(participante) {
  return String(lerMetadadosParticipante(participante).papel || "").trim().toLocaleLowerCase("pt-BR");
}

export function participanteEhMestre(participante) {
  return papelParticipante(participante) === "mestre";
}

export function publicacaoEhMesaSonora(publicacao, track) {
  return publicacao?.name === NOME_FAIXA_MESA_SONORA && (track?.kind === Track.Kind.Audio || publicacao?.kind === Track.Kind.Audio);
}

export function faixaMesaSonoraValida(track, publicacao, participante) {
  return publicacaoEhMesaSonora(publicacao, track) && participanteEhMestre(participante);
}

export function limitarVolume(valor) {
  return Math.max(VOLUME_MINIMO, Math.min(VOLUME_MAXIMO, Number(valor) || 0));
}

export function volumeNormalizado(valor) {
  return limitarVolume(valor) / 100;
}

export function criarPacoteEstadoMesaSonora(estado = {}) {
  return {
    tipo: "estado-mesa-sonora",
    somAtual: String(estado.somAtual || "").slice(0, 100),
    cenaAtual: String(estado.cenaAtual || "").slice(0, 100),
    tocando: Boolean(estado.tocando),
    pausado: Boolean(estado.pausado),
    iniciadoEm: Number(estado.iniciadoEm) || null,
    volumeSala: limitarVolume(estado.volumeSala ?? 80),
    botaoId: String(estado.botaoId || "").slice(0, 120),
    cenaId: String(estado.cenaId || "").slice(0, 120),
  };
}

export function lerPacoteEstadoMesaSonora(payload) {
  try {
    const pacote = JSON.parse(new TextDecoder().decode(payload));
    return pacote?.tipo === "estado-mesa-sonora" ? criarPacoteEstadoMesaSonora(pacote) : null;
  } catch {
    return null;
  }
}
