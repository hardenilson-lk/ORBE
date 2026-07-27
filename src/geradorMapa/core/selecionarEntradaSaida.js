const ORDEM_LADOS = ["esquerda", "inferior", "superior", "direita"];

function obterDistanciasBordas(sala, larguraMapa, alturaMapa) {
  return {
    esquerda: sala.x,
    direita: larguraMapa - (sala.x + sala.largura),
    superior: sala.y,
    inferior: alturaMapa - (sala.y + sala.altura),
  };
}

export function escolherSalaInicial(salas, larguraMapa, alturaMapa) {
  return [...salas].sort((a, b) => {
    const bordasA = obterDistanciasBordas(a, larguraMapa, alturaMapa);
    const bordasB = obterDistanciasBordas(b, larguraMapa, alturaMapa);
    const preferencialA = Math.min(bordasA.esquerda, bordasA.inferior);
    const preferencialB = Math.min(bordasB.esquerda, bordasB.inferior);
    const geralA = Math.min(...Object.values(bordasA));
    const geralB = Math.min(...Object.values(bordasB));
    return preferencialA - preferencialB || geralA - geralB || a.id.localeCompare(b.id);
  })[0] || null;
}

export function calcularDistanciasNoGrafo(salaInicialId, salas, conexoes) {
  const adjacencias = new Map(salas.map((sala) => [sala.id, []]));
  conexoes.forEach((conexao) => {
    adjacencias.get(conexao.salaOrigemId)?.push(conexao.salaDestinoId);
    adjacencias.get(conexao.salaDestinoId)?.push(conexao.salaOrigemId);
  });
  adjacencias.forEach((vizinhas) => vizinhas.sort());

  const distancias = new Map([[salaInicialId, 0]]);
  const fila = [salaInicialId];
  let indice = 0;

  while (indice < fila.length) {
    const atual = fila[indice];
    indice += 1;
    for (const vizinha of adjacencias.get(atual) || []) {
      if (distancias.has(vizinha)) continue;
      distancias.set(vizinha, distancias.get(atual) + 1);
      fila.push(vizinha);
    }
  }

  return distancias;
}

function distanciaManhattan(salaA, salaB) {
  return Math.abs(salaA.centroX - salaB.centroX)
    + Math.abs(salaA.centroY - salaB.centroY);
}

export function escolherSalaFinal(salaInicial, salas, conexoes) {
  const distancias = calcularDistanciasNoGrafo(salaInicial.id, salas, conexoes);
  const candidatas = salas
    .filter((sala) => sala.id !== salaInicial.id && distancias.has(sala.id))
    .sort((a, b) => (
      distancias.get(b.id) - distancias.get(a.id)
      || distanciaManhattan(salaInicial, b) - distanciaManhattan(salaInicial, a)
      || a.id.localeCompare(b.id)
    ));
  const salaFinal = candidatas[0] || null;
  const distanciaConexoes = salaFinal ? distancias.get(salaFinal.id) : 0;
  const minimoIdeal = salas.length <= 5 ? 2 : salas.length <= 10 ? 3 : 0;

  return {
    salaFinal,
    distanciaConexoes,
    minimoIdeal,
    distanciaCurta: minimoIdeal > 0 && distanciaConexoes < minimoIdeal,
  };
}

function listarValoresBorda(inicio, tamanho) {
  const fim = inicio + tamanho - 1;
  const centro = Math.floor(inicio + (tamanho - 1) / 2);
  const valores = [];
  for (let valor = inicio; valor <= fim; valor += 1) valores.push(valor);
  return valores.sort((a, b) => {
    const cantoA = a === inicio || a === fim ? 1 : 0;
    const cantoB = b === inicio || b === fim ? 1 : 0;
    return cantoA - cantoB || Math.abs(a - centro) - Math.abs(b - centro) || a - b;
  });
}

function criarPontosDoLado(sala, lado) {
  if (lado === "esquerda" || lado === "direita") {
    const x = lado === "esquerda" ? sala.x : sala.x + sala.largura - 1;
    return listarValoresBorda(sala.y, sala.altura).map((y) => ({ x, y, lado }));
  }

  const y = lado === "superior" ? sala.y : sala.y + sala.altura - 1;
  return listarValoresBorda(sala.x, sala.largura).map((x) => ({ x, y, lado }));
}

export function listarPontosBordaSala({
  sala,
  larguraMapa,
  alturaMapa,
  celulasCorredores,
  pontoReferencia = null,
}) {
  const distancias = obterDistanciasBordas(sala, larguraMapa, alturaMapa);
  const chavesCorredores = new Set(celulasCorredores.map(({ x, y }) => `${x}:${y}`));
  const lados = [...ORDEM_LADOS].sort((a, b) => (
    distancias[a] - distancias[b] || ORDEM_LADOS.indexOf(a) - ORDEM_LADOS.indexOf(b)
  ));
  const pontos = lados.flatMap((lado) => criarPontosDoLado(sala, lado).map((ponto, indice) => ({
    ...ponto,
    distanciaBordaMapa: distancias[lado],
    usaCorredor: chavesCorredores.has(`${ponto.x}:${ponto.y}`),
    ordemNoLado: indice,
    distanciaReferencia: pontoReferencia
      ? Math.abs(ponto.x - pontoReferencia.x) + Math.abs(ponto.y - pontoReferencia.y)
      : 0,
  })));

  return pontos.sort((a, b) => (
    a.distanciaBordaMapa - b.distanciaBordaMapa
    || Number(a.usaCorredor) - Number(b.usaCorredor)
    || b.distanciaReferencia - a.distanciaReferencia
    || a.ordemNoLado - b.ordemNoLado
    || ORDEM_LADOS.indexOf(a.lado) - ORDEM_LADOS.indexOf(b.lado)
  ));
}
