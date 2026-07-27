function criarAdjacencias(salas, conexoes) {
  const adjacencias = new Map(salas.map((sala) => [sala.id, new Set()]));
  conexoes.forEach((conexao) => {
    adjacencias.get(conexao.salaOrigemId)?.add(conexao.salaDestinoId);
    adjacencias.get(conexao.salaDestinoId)?.add(conexao.salaOrigemId);
  });
  return adjacencias;
}

export function validarConectividadeSalas(salas, conexoes) {
  if (salas.length === 0) {
    return { valido: true, salasConectadas: 0, totalSalas: 0, salasIsoladas: [] };
  }

  const adjacencias = criarAdjacencias(salas, conexoes);
  const visitadas = new Set();
  const fila = [salas[0].id];

  while (fila.length > 0) {
    const atual = fila.shift();
    if (visitadas.has(atual)) continue;
    visitadas.add(atual);
    adjacencias.get(atual)?.forEach((vizinha) => {
      if (!visitadas.has(vizinha)) fila.push(vizinha);
    });
  }

  const salasIsoladas = salas
    .filter((sala) => !visitadas.has(sala.id))
    .map((sala) => sala.id);

  return {
    valido: salasIsoladas.length === 0,
    salasConectadas: visitadas.size,
    totalSalas: salas.length,
    salasIsoladas,
  };
}

function adicionarCelulasSalas(celulas, salas) {
  salas.forEach((sala) => {
    for (let y = sala.y; y < sala.y + sala.altura; y += 1) {
      for (let x = sala.x; x < sala.x + sala.largura; x += 1) {
        celulas.add(`${x}:${y}`);
      }
    }
  });
}

function obterCelulaCentral(sala) {
  return {
    x: Math.floor(sala.centroX),
    y: Math.floor(sala.centroY),
  };
}

export function validarConectividadeFisica(salas, celulasCorredores) {
  if (salas.length === 0) {
    return { valido: true, salasAlcancaveis: 0, totalSalas: 0, salasInalcancaveis: [] };
  }

  const transitaveis = new Set();
  adicionarCelulasSalas(transitaveis, salas);
  celulasCorredores.forEach((celula) => transitaveis.add(`${celula.x}:${celula.y}`));

  const inicial = obterCelulaCentral(salas[0]);
  const fila = [inicial];
  const visitadas = new Set();
  const direcoes = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (fila.length > 0) {
    const atual = fila.shift();
    const chave = `${atual.x}:${atual.y}`;
    if (visitadas.has(chave) || !transitaveis.has(chave)) continue;
    visitadas.add(chave);

    direcoes.forEach(([dx, dy]) => {
      const vizinha = { x: atual.x + dx, y: atual.y + dy };
      const chaveVizinha = `${vizinha.x}:${vizinha.y}`;
      if (!visitadas.has(chaveVizinha) && transitaveis.has(chaveVizinha)) {
        fila.push(vizinha);
      }
    });
  }

  const salasInalcancaveis = salas
    .filter((sala) => {
      const centro = obterCelulaCentral(sala);
      return !visitadas.has(`${centro.x}:${centro.y}`);
    })
    .map((sala) => sala.id);

  return {
    valido: salasInalcancaveis.length === 0,
    salasAlcancaveis: salas.length - salasInalcancaveis.length,
    totalSalas: salas.length,
    salasInalcancaveis,
  };
}

export function validarConectividadeMapa(mapa) {
  const grafo = validarConectividadeSalas(mapa.salas, mapa.conexoes);
  const fisica = validarConectividadeFisica(mapa.salas, mapa.celulasCorredores);

  return {
    valido: grafo.valido && fisica.valido,
    grafo,
    fisica,
  };
}
