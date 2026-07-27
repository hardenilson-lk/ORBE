import { TEMAS_ARQUIVOS } from "../temas/arquivos/temasArquivos.js";

export const TEMAS_POR_SISTEMA = {
  arquivos: TEMAS_ARQUIVOS,
  dnd5e: [],
};

export function obterTemasDoSistema(sistemaNormalizado) {
  return TEMAS_POR_SISTEMA[sistemaNormalizado] || [];
}
