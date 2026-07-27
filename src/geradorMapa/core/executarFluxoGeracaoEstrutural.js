import { ORDEM_ETAPAS } from "../data/etapasGeradorMapa.js";
import { corrigirMapaEstrutural } from "./corrigirMapaEstrutural.js";
import { executarEtapaGerador } from "./executarEtapaGerador.js";

export function executarFluxoGeracaoEstrutural(parametros, aoAtualizarEtapa) {
  const relatorio = {
    etapasExecutadas: [],
    etapaAtual: null,
    etapaFalha: null,
    avisos: [],
    erros: [],
    correcoes: [],
  };
  let mapa = null;
  let resultadoSalas = null;

  for (const etapa of ORDEM_ETAPAS) {
    relatorio.etapaAtual = etapa;
    aoAtualizarEtapa?.(etapa, "processando", { ...relatorio });
    const resultado = executarEtapaGerador(etapa, { mapa, parametros });
    relatorio.avisos.push(...resultado.avisos);
    if (!resultado.sucesso) {
      if (etapa === "validacao" && resultado.mapaAtualizado?.validacaoEstrutural?.corrigiveis.length) {
        const corrigido = corrigirMapaEstrutural(resultado.mapaAtualizado);
        relatorio.correcoes.push(...corrigido.correcoes);
        if (corrigido.validacao.valido) {
          mapa = corrigido.mapa;
          relatorio.etapasExecutadas.push(etapa);
          aoAtualizarEtapa?.(etapa, "concluida", { ...relatorio });
          continue;
        }
      }
      relatorio.etapaFalha = etapa;
      relatorio.erros.push(...resultado.erros);
      aoAtualizarEtapa?.(etapa, "erro", { ...relatorio });
      return { sucesso: false, mapa: null, resultadoSalas, relatorio };
    }
    mapa = resultado.mapaAtualizado;
    if (etapa === "salas") resultadoSalas = resultado.resumo;
    relatorio.etapasExecutadas.push(etapa);
    const statusConclusao = resultado.resumo?.fallback
      ? "concluida-fallback"
      : resultado.resumo?.decoracaoDesativada
        ? "ignorada"
        : resultado.avisos.length
          ? "concluida-avisos"
          : "concluida";
    aoAtualizarEtapa?.(etapa, statusConclusao, { ...relatorio });
  }

  relatorio.etapaAtual = null;
  return { sucesso: true, mapa, resultadoSalas, relatorio };
}
