import { HOSPITAL_ABANDONADO } from "./arquivos/hospitalAbandonado.js";

const TEMAS = new Map([
  [HOSPITAL_ABANDONADO.id, HOSPITAL_ABANDONADO],
]);

export function obterTemaVisualMapa(temaId) {
  return TEMAS.get(temaId) || HOSPITAL_ABANDONADO;
}

export function listarTemasVisuaisMapa(sistema = "arquivos") {
  return [...TEMAS.values()].filter((tema) => tema.sistema === sistema);
}

