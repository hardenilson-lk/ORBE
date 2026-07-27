import { obterLadosExpostosCelula } from "./consolidarCelulasChao.js";

export function normalizarSegmentoParede(inicio, fim) {
  const pontos = [inicio, fim].sort((a, b) => a.x - b.x || a.y - b.y);
  return `${pontos[0].x}:${pontos[0].y}-${pontos[1].x}:${pontos[1].y}`;
}

export function criarSegmentoLadoCelula(celula, lado) {
  const segmentos = {
    superior: [{ x: celula.x, y: celula.y }, { x: celula.x + 1, y: celula.y }],
    inferior: [{ x: celula.x, y: celula.y + 1 }, { x: celula.x + 1, y: celula.y + 1 }],
    esquerda: [{ x: celula.x, y: celula.y }, { x: celula.x, y: celula.y + 1 }],
    direita: [{ x: celula.x + 1, y: celula.y }, { x: celula.x + 1, y: celula.y + 1 }],
  };
  const [inicio, fim] = segmentos[lado];
  return {
    inicio,
    fim,
    orientacao: inicio.y === fim.y ? "horizontal" : "vertical",
    chave: normalizarSegmentoParede(inicio, fim),
  };
}

function obterLadoAcesso(salaOrigem, salaDestino) {
  const diferencaX = salaDestino.centroX - salaOrigem.centroX;
  const diferencaY = salaDestino.centroY - salaOrigem.centroY;
  if (Math.abs(diferencaX) >= Math.abs(diferencaY)) {
    return diferencaX >= 0 ? "direita" : "esquerda";
  }
  return diferencaY >= 0 ? "inferior" : "superior";
}

function adicionarSegmento(mapa, dados) {
  const existente = mapa.get(dados.chave);
  if (!existente) {
    mapa.set(dados.chave, {
      ...dados,
      salaIds: [...(dados.salaIds || [])],
      corredorIds: [...(dados.corredorIds || [])],
      tiposEspeciais: [...(dados.tiposEspeciais || [])],
    });
    return;
  }

  existente.salaIds = [...new Set([...existente.salaIds, ...(dados.salaIds || [])])];
  existente.corredorIds = [...new Set([...existente.corredorIds, ...(dados.corredorIds || [])])];
  existente.tiposEspeciais = [...new Set([...existente.tiposEspeciais, ...(dados.tiposEspeciais || [])])];
  if (dados.tipo === "abertura") {
    existente.tipo = "abertura";
    existente.bloqueiaMovimento = false;
    existente.bloqueiaVisao = false;
    existente.lado = dados.lado || existente.lado;
  }
}

function criarParedeComum(celula, lado) {
  return {
    ...criarSegmentoLadoCelula(celula, lado),
    celulaChao: { x: celula.x, y: celula.y },
    lado,
    tipo: "comum",
    bloqueiaMovimento: true,
    bloqueiaVisao: true,
    salaIds: [...celula.salaIds],
    corredorIds: [...celula.corredorIds],
    tiposEspeciais: [],
  };
}

function adicionarAcessosCorredores(mapaParedes, mapa) {
  const salasPorId = new Map(mapa.salas.map((sala) => [sala.id, sala]));

  mapa.corredores.forEach((corredor) => {
    const origem = salasPorId.get(corredor.salaOrigemId);
    const destino = salasPorId.get(corredor.salaDestinoId);
    [
      { sala: origem, outra: destino, celula: corredor.inicio },
      { sala: destino, outra: origem, celula: corredor.fim },
    ].forEach(({ sala, outra, celula }) => {
      const lado = obterLadoAcesso(sala, outra);
      adicionarSegmento(mapaParedes, {
        ...criarSegmentoLadoCelula(celula, lado),
        celulaChao: { x: celula.x, y: celula.y },
        lado,
        tipo: "abertura",
        bloqueiaMovimento: false,
        bloqueiaVisao: false,
        salaIds: [sala.id],
        corredorIds: [corredor.id],
        tiposEspeciais: [],
      });
    });
  });
}

function adicionarPontoEspecial(mapaParedes, ponto) {
  adicionarSegmento(mapaParedes, {
    ...criarSegmentoLadoCelula(ponto, ponto.lado),
    celulaChao: { x: ponto.x, y: ponto.y },
    lado: ponto.lado,
    tipo: "abertura",
    bloqueiaMovimento: false,
    bloqueiaVisao: false,
    salaIds: [ponto.salaId],
    corredorIds: [],
    tiposEspeciais: [ponto.tipo],
  });
}

export function gerarParedes(mapa) {
  const chavesChao = new Set(mapa.celulasChao.map(({ x, y }) => `${x}:${y}`));
  const segmentos = new Map();

  mapa.celulasChao.forEach((celula) => {
    const lados = obterLadosExpostosCelula(celula, chavesChao);
    lados.expostos.forEach((lado) => {
      adicionarSegmento(segmentos, criarParedeComum(celula, lado));
    });
  });

  adicionarAcessosCorredores(segmentos, mapa);
  adicionarPontoEspecial(segmentos, mapa.entrada);
  adicionarPontoEspecial(segmentos, mapa.saida);

  const paredes = [...segmentos.values()]
    .sort((a, b) => a.chave.localeCompare(b.chave))
    .map((parede, indice) => ({
      ...parede,
      id: `parede-${indice + 1}`,
    }));
  const paredeEntrada = paredes.find((parede) => parede.tiposEspeciais.includes("entrada"));
  const paredeSaida = paredes.find((parede) => parede.tiposEspeciais.includes("saida"));

  return {
    ...mapa,
    entrada: { ...mapa.entrada, paredeId: paredeEntrada?.id || null, portaId: null },
    saida: { ...mapa.saida, paredeId: paredeSaida?.id || null, portaId: null },
    paredes,
    portas: [],
    salasSecretasIds: [],
    resumoPortas: null,
    validacaoEstrutural: null,
  };
}
