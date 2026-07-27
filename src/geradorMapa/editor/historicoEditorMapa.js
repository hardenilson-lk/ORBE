import { clonarMapaSeguro } from "../persistencia/formatoMapaGerador.js";

export const LIMITE_HISTORICO_EDITOR = 50;

export function criarHistoricoEditor(mapaInicial) {
  return {
    entradas: [{ descricao: "Geração original", mapa: clonarMapaSeguro(mapaInicial) }],
    indice: 0,
  };
}

export function registrarNoHistorico(historico, mapa, descricao) {
  const entradas = historico.entradas
    .slice(0, historico.indice + 1)
    .concat({ descricao, mapa: clonarMapaSeguro(mapa) })
    .slice(-LIMITE_HISTORICO_EDITOR);
  return { entradas, indice: entradas.length - 1 };
}

export function desfazerHistorico(historico) {
  if (historico.indice <= 0) return null;
  const indice = historico.indice - 1;
  return {
    historico: { ...historico, indice },
    mapa: clonarMapaSeguro(historico.entradas[indice].mapa),
  };
}

export function refazerHistorico(historico) {
  if (historico.indice >= historico.entradas.length - 1) return null;
  const indice = historico.indice + 1;
  return {
    historico: { ...historico, indice },
    mapa: clonarMapaSeguro(historico.entradas[indice].mapa),
  };
}
