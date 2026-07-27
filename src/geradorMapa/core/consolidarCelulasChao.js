export function gerarCelulasSala(sala) {
  const celulas = [];
  for (let y = sala.y; y < sala.y + sala.altura; y += 1) {
    for (let x = sala.x; x < sala.x + sala.largura; x += 1) {
      celulas.push({ x, y });
    }
  }
  return celulas;
}

function obterOuCriarCelula(mapa, x, y) {
  const chave = `${x}:${y}`;
  if (!mapa.has(chave)) {
    mapa.set(chave, {
      x,
      y,
      tipo: "vazio",
      salaIds: [],
      corredorIds: [],
    });
  }
  return mapa.get(chave);
}

function atualizarTipo(celula) {
  const possuiSala = celula.salaIds.length > 0;
  const possuiCorredor = celula.corredorIds.length > 0;
  if (possuiSala && possuiCorredor) return "sala-corredor";
  if (possuiSala) return "sala";
  return "corredor";
}

export function consolidarCelulasChao(salas, corredores) {
  const consolidadas = new Map();

  salas.forEach((sala) => {
    gerarCelulasSala(sala).forEach(({ x, y }) => {
      const celula = obterOuCriarCelula(consolidadas, x, y);
      if (!celula.salaIds.includes(sala.id)) celula.salaIds.push(sala.id);
    });
  });

  corredores.forEach((corredor) => {
    corredor.celulas.forEach(({ x, y }) => {
      const celula = obterOuCriarCelula(consolidadas, x, y);
      if (!celula.corredorIds.includes(corredor.id)) celula.corredorIds.push(corredor.id);
    });
  });

  return [...consolidadas.values()]
    .map((celula) => ({
      ...celula,
      tipo: atualizarTipo(celula),
      salaId: celula.salaIds[0] || null,
      corredorId: celula.corredorIds[0] || null,
    }))
    .sort((a, b) => a.y - b.y || a.x - b.x);
}

export function obterLadosExpostosCelula(celula, conjuntoChao) {
  const lados = {
    superior: !conjuntoChao.has(`${celula.x}:${celula.y - 1}`),
    inferior: !conjuntoChao.has(`${celula.x}:${celula.y + 1}`),
    esquerda: !conjuntoChao.has(`${celula.x - 1}:${celula.y}`),
    direita: !conjuntoChao.has(`${celula.x + 1}:${celula.y}`),
  };

  return {
    ...lados,
    expostos: Object.entries(lados)
      .filter(([, exposto]) => exposto)
      .map(([lado]) => lado),
  };
}
