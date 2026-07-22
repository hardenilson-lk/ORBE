import { lerValorNexArquivos } from "./progressaoNexArquivos.js";

const ATRIBUTOS = ["agilidade", "forca", "intelecto", "presenca", "vigor"];
const MARCOS_ATRIBUTO = [20, 50, 80, 95];

const PERICIAS_INICIAIS_POR_CLASSE = {
  Combatente: 5,
  Especialista: 9,
  Ocultista: 7,
};

const MELHORIAS_PERICIA_POR_CLASSE = {
  Combatente: 2,
  Especialista: 5,
  Ocultista: 3,
};

function numeroInteiro(valor, padrao = 0) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? Math.trunc(numero) : padrao;
}

export function obterRegraAtributos(ficha = {}) {
  const nex = lerValorNexArquivos(ficha.nex);
  const pontosIniciais = 4;
  const pontosDeNex = MARCOS_ATRIBUTO.filter((marco) => nex >= marco).length;
  const limiteTotal = ATRIBUTOS.length + pontosIniciais + pontosDeNex;
  const totalAtual = ATRIBUTOS.reduce((total, atributo) => total + Math.max(0, numeroInteiro(ficha[atributo], 1)), 0);
  const limitePorAtributo = nex < 20 ? 3 : nex < 50 ? 4 : 5;

  return {
    nex,
    pontosIniciais,
    pontosDeNex,
    limiteTotal,
    limitePorAtributo,
    totalAtual,
    restantes: Math.max(0, limiteTotal - totalAtual),
    excedentes: Math.max(0, totalAtual - limiteTotal),
  };
}

export function podeAlterarAtributo(ficha, atributo, novoValor) {
  const regra = obterRegraAtributos(ficha);
  const atual = Math.max(0, numeroInteiro(ficha?.[atributo], 1));
  const proximo = Math.max(0, numeroInteiro(novoValor));
  const totalProposto = regra.totalAtual - atual + proximo;
  const estaReduzindo = proximo <= atual;

  if (!estaReduzindo && proximo > regra.limitePorAtributo) {
    return { permitido: false, valor: atual, mensagem: `No NEX ${regra.nex}%, cada atributo pode chegar no máximo a ${regra.limitePorAtributo}.` };
  }
  if (!estaReduzindo && totalProposto > regra.limiteTotal) {
    return { permitido: false, valor: atual, mensagem: "Todos os pontos de atributo já foram distribuídos. Reduza outro atributo para trocar a distribuição." };
  }
  return { permitido: true, valor: proximo, mensagem: "" };
}

export function obterRegraPericias(ficha = {}) {
  const nex = lerValorNexArquivos(ficha.nex);
  const intelecto = Math.max(0, numeroInteiro(ficha.intelecto, 1));
  const baseClasse = PERICIAS_INICIAIS_POR_CLASSE[ficha.classe] ?? PERICIAS_INICIAIS_POR_CLASSE.Combatente;
  const melhoriasClasse = MELHORIAS_PERICIA_POR_CLASSE[ficha.classe] ?? MELHORIAS_PERICIA_POR_CLASSE.Combatente;
  const pontosIniciais = baseClasse + intelecto;
  const pontosVeterano = nex >= 35 ? melhoriasClasse + intelecto : 0;
  const pontosExpert = nex >= 70 ? melhoriasClasse + intelecto : 0;
  const limitePontos = pontosIniciais + pontosVeterano + pontosExpert;
  const grauMaximo = nex >= 70 ? 15 : nex >= 35 ? 10 : 5;
  const pontosUsados = Object.values(ficha.pericias || {}).reduce((total, pericia) => {
    const treino = Math.max(0, numeroInteiro(pericia?.treino));
    return total + Math.ceil(treino / 5);
  }, 0);

  return {
    nex,
    intelecto,
    pontosIniciais,
    pontosVeterano,
    pontosExpert,
    limitePontos,
    grauMaximo,
    pontosUsados,
    restantes: Math.max(0, limitePontos - pontosUsados),
    excedentes: Math.max(0, pontosUsados - limitePontos),
  };
}

export function podeAlterarTreinoPericia(ficha, periciaId, novoValor) {
  const regra = obterRegraPericias(ficha);
  const atual = Math.max(0, numeroInteiro(ficha?.pericias?.[periciaId]?.treino));
  const proximo = Math.max(0, Math.round(numeroInteiro(novoValor) / 5) * 5);
  const usadosPropostos = regra.pontosUsados - Math.ceil(atual / 5) + Math.ceil(proximo / 5);
  const estaReduzindo = proximo <= atual;

  if (!estaReduzindo && proximo > regra.grauMaximo) {
    return { permitido: false, valor: atual, mensagem: `No NEX ${regra.nex}%, o maior grau de treinamento disponível é +${regra.grauMaximo}.` };
  }
  if (!estaReduzindo && usadosPropostos > regra.limitePontos) {
    return { permitido: false, valor: atual, mensagem: "Todos os pontos de perícia já foram usados. Remova treinamento de outra perícia para fazer a troca." };
  }
  return { permitido: true, valor: proximo, mensagem: "" };
}

export const REGRAS_CRIACAO_FICHA_ARQUIVOS = {
  atributos: ATRIBUTOS,
  marcosAtributo: MARCOS_ATRIBUTO,
  periciasIniciaisPorClasse: PERICIAS_INICIAIS_POR_CLASSE,
  melhoriasPericiaPorClasse: MELHORIAS_PERICIA_POR_CLASSE,
};

