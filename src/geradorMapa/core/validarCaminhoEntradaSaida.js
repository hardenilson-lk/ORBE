export function validarCaminhoEntradaSaida(celulasChao, entrada, saida) {
  const caminhaveis = new Set(celulasChao.map(({ x, y }) => `${x}:${y}`));
  const chaveEntrada = `${entrada.x}:${entrada.y}`;
  const chaveSaida = `${saida.x}:${saida.y}`;

  if (!caminhaveis.has(chaveEntrada) || !caminhaveis.has(chaveSaida)) {
    return {
      valido: false,
      distanciaEmCelulas: 0,
      celulasVisitadas: 0,
      entradaCaminhavel: caminhaveis.has(chaveEntrada),
      saidaCaminhavel: caminhaveis.has(chaveSaida),
    };
  }

  const fila = [{ x: entrada.x, y: entrada.y, distancia: 0 }];
  const visitadas = new Set();
  const direcoes = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let indice = 0;

  while (indice < fila.length) {
    const atual = fila[indice];
    indice += 1;
    const chave = `${atual.x}:${atual.y}`;
    if (visitadas.has(chave)) continue;
    visitadas.add(chave);

    if (chave === chaveSaida) {
      return {
        valido: true,
        distanciaEmCelulas: atual.distancia,
        celulasVisitadas: visitadas.size,
        entradaCaminhavel: true,
        saidaCaminhavel: true,
      };
    }

    direcoes.forEach(([dx, dy]) => {
      const vizinha = { x: atual.x + dx, y: atual.y + dy };
      const chaveVizinha = `${vizinha.x}:${vizinha.y}`;
      if (!visitadas.has(chaveVizinha) && caminhaveis.has(chaveVizinha)) {
        fila.push({ ...vizinha, distancia: atual.distancia + 1 });
      }
    });
  }

  return {
    valido: false,
    distanciaEmCelulas: 0,
    celulasVisitadas: visitadas.size,
    entradaCaminhavel: true,
    saidaCaminhavel: true,
  };
}
