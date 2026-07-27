import { criarSegmentoLadoCelula, normalizarSegmentoParede } from "./gerarParedes.js";
import { validarMapaEstrutural } from "./validarMapaEstrutural.js";

function copiarMapa(mapa) {
  return JSON.parse(JSON.stringify(mapa));
}

function deduplicarCelulas(celulas, correcoes) {
  const unicas = new Map();
  celulas.forEach((celula) => {
    const chave = `${celula.x}:${celula.y}`;
    if (!unicas.has(chave)) {
      unicas.set(chave, { ...celula });
      return;
    }
    const existente = unicas.get(chave);
    existente.salaIds = [...new Set([...(existente.salaIds || []), ...(celula.salaIds || [])])];
    existente.corredorIds = [...new Set([...(existente.corredorIds || []), ...(celula.corredorIds || [])])];
    correcoes.add("Células de chão duplicadas foram consolidadas.");
  });
  return [...unicas.values()].sort((a, b) => a.y - b.y || a.x - b.x);
}

function deduplicarParedes(paredes, correcoes) {
  const unicas = new Map();
  paredes.forEach((parede) => {
    const chave = normalizarSegmentoParede(parede.inicio, parede.fim);
    const existente = unicas.get(chave);
    if (!existente || (existente.tipo === "comum" && parede.tipo !== "comum")) {
      unicas.set(chave, { ...parede, chave });
    }
    if (existente) correcoes.add("Paredes duplicadas foram removidas.");
  });
  return [...unicas.values()]
    .sort((a, b) => a.chave.localeCompare(b.chave))
    .map((parede, indice) => ({ ...parede, id: `parede-${indice + 1}` }));
}

function liberarPontoEspecial(paredes, ponto, correcoes) {
  if (!ponto) return paredes;
  const chave = criarSegmentoLadoCelula(ponto, ponto.lado).chave;
  return paredes.map((parede) => {
    if (parede.chave !== chave || parede.tipo !== "comum") return parede;
    correcoes.add(`A parede comum sobre a ${ponto.tipo} foi convertida em abertura.`);
    return {
      ...parede,
      tipo: "abertura",
      bloqueiaMovimento: false,
      bloqueiaVisao: false,
      tiposEspeciais: [...new Set([...(parede.tiposEspeciais || []), ponto.tipo])],
    };
  });
}

function deduplicarPortas(portas, correcoes) {
  const unicas = new Map();
  portas.forEach((porta) => {
    const chave = porta.chave || normalizarSegmentoParede(porta.inicio, porta.fim);
    if (!unicas.has(chave)) unicas.set(chave, { ...porta, chave });
    else correcoes.add("Portas duplicadas foram removidas.");
  });
  return [...unicas.values()].sort((a, b) => a.chave.localeCompare(b.chave));
}

function sincronizarPortasComParedes(mapa, correcoes) {
  const paredesPorChave = new Map(mapa.paredes.map((parede) => [parede.chave, parede]));
  mapa.portas.forEach((porta, indice) => {
    porta.id = `porta-${indice + 1}`;
    let parede = paredesPorChave.get(porta.chave);
    if (!parede) {
      parede = {
        id: `parede-${mapa.paredes.length + 1}`,
        chave: porta.chave,
        inicio: porta.inicio,
        fim: porta.fim,
        orientacao: porta.orientacao,
        tipo: "porta",
        salaIds: [...(porta.salaIds || [])],
        corredorIds: [...(porta.corredorIds || [])],
        tiposEspeciais: porta.tipoEspecial ? [porta.tipoEspecial] : [],
      };
      mapa.paredes.push(parede);
      paredesPorChave.set(porta.chave, parede);
      correcoes.add("Uma porta sem parede recebeu um segmento correspondente.");
    }
    parede.tipo = "porta";
    parede.portaId = porta.id;
    parede.bloqueiaMovimento = porta.bloqueiaMovimento;
    parede.bloqueiaVisao = porta.bloqueiaVisao;
    porta.paredeId = parede.id;
  });
  const portaEntrada = mapa.portas.find((porta) => porta.tipoEspecial === "entrada");
  const portaSaida = mapa.portas.find((porta) => porta.tipoEspecial === "saida");
  if (portaEntrada) {
    mapa.entrada = { ...mapa.entrada, paredeId: portaEntrada.paredeId, portaId: portaEntrada.id };
  }
  if (portaSaida) {
    mapa.saida = { ...mapa.saida, paredeId: portaSaida.paredeId, portaId: portaSaida.id };
  }
}

export function corrigirMapaEstrutural(mapa) {
  const corrigido = copiarMapa(mapa);
  const correcoes = new Set();

  corrigido.celulasChao = deduplicarCelulas(corrigido.celulasChao, correcoes);
  corrigido.paredes = deduplicarParedes(corrigido.paredes, correcoes);
  corrigido.paredes = liberarPontoEspecial(corrigido.paredes, corrigido.entrada, correcoes);
  corrigido.paredes = liberarPontoEspecial(corrigido.paredes, corrigido.saida, correcoes);
  corrigido.portas = deduplicarPortas(corrigido.portas, correcoes);
  sincronizarPortasComParedes(corrigido, correcoes);

  const validacao = validarMapaEstrutural(corrigido);
  corrigido.validacao = validacao;
  corrigido.validacaoEstrutural = validacao;
  corrigido.correcoesAutomaticas = [...correcoes];

  return {
    mapa: corrigido,
    validacao,
    correcoes: [...correcoes],
  };
}
