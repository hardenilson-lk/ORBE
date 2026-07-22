import { EXTENSOES_AUDIO_ACEITAS, ORIGENS_SOM, SOM_VAZIO } from "../constants/mesaSonoraConstants.js";
import { validarUrlSpotify } from "./spotifyUtils.js";
import { validarUrlYouTube } from "./youtubeUtils.js";

export function criarIdMesa(prefixo) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizarAtalho(evento) {
  const tecla = evento.key.length === 1 ? evento.key.toUpperCase() : evento.key;
  if (["Control", "Alt", "Shift", "Meta"].includes(tecla)) return "";
  return [evento.ctrlKey && "Ctrl", evento.altKey && "Alt", evento.shiftKey && "Shift", tecla]
    .filter(Boolean)
    .join("+");
}

export function atalhoEhReservado(atalho = "") {
  return ["Ctrl+R", "Ctrl+T", "Ctrl+W", "Ctrl+L", "Ctrl+N", "F5"].includes(atalho);
}

export function elementoAceitaDigitacao(elemento) {
  return ["INPUT", "TEXTAREA", "SELECT"].includes(elemento?.tagName) || elemento?.isContentEditable;
}

export function validarArquivoAudio(arquivo) {
  const extensao = arquivo?.name?.split(".").pop()?.toLowerCase();
  return EXTENSOES_AUDIO_ACEITAS.includes(extensao || "");
}

export function validarSom(formulario, arquivo, sons, idEdicao) {
  if (!formulario.nome.trim()) return "Informe um nome para o som.";
  const categoria = formulario.categoria === "Personalizada" ? formulario.categoriaPersonalizada.trim() : formulario.categoria;
  if (!categoria) return "Informe a categoria personalizada.";
  if (formulario.origem === ORIGENS_SOM.LOCAL && !arquivo && !idEdicao) return "Selecione um arquivo MP3, WAV, OGG ou M4A.";
  if (arquivo && !validarArquivoAudio(arquivo)) return "Formato local não aceito. Use MP3, WAV, OGG ou M4A.";
  if (formulario.origem === ORIGENS_SOM.YOUTUBE && !validarUrlYouTube(formulario.url)) return "Link do YouTube inválido. Use watch, youtu.be ou shorts.";
  if (formulario.origem === ORIGENS_SOM.SPOTIFY && !validarUrlSpotify(formulario.url)) return "Link oficial do Spotify inválido.";
  if (formulario.atalho && sons.some((som) => som.id !== idEdicao && som.atalho === formulario.atalho)) return "Esse atalho já pertence a outro som.";
  if (atalhoEhReservado(formulario.atalho)) return "Esse atalho é reservado pelo navegador.";
  return "";
}

export function formularioDoSom(som) {
  return som ? { ...SOM_VAZIO, ...som, categoriaPersonalizada: "" } : { ...SOM_VAZIO };
}

export function serializarMesa(mesa) {
  return {
    ...mesa,
    sons: mesa.sons.map((som) => ({
      id: som.id,
      nome: som.nome,
      origem: som.origem,
      categoria: som.categoria,
      cor: som.cor,
      icone: som.icone,
      volume: som.volume,
      loop: som.loop,
      fadeIn: som.fadeIn,
      fadeOut: som.fadeOut,
      tocarJunto: som.tocarJunto,
      pararOutros: som.pararOutros,
      atalho: som.atalho,
      url: som.origem === ORIGENS_SOM.LOCAL ? "" : som.url,
      nomeArquivo: som.nomeArquivo,
      precisaArquivo: som.origem === ORIGENS_SOM.LOCAL,
    })),
  };
}
