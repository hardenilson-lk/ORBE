import { gerarCelulasDoSegmento } from "../core/gerarCorredores.js";
import { gerarParedes, normalizarSegmentoParede } from "../core/gerarParedes.js";
import { marcarEdicao, proximoId } from "./operacoesEditorMapa.js";

export function recriarParedesAutomaticas(mapa) {
  const manuais = mapa.paredes.filter(({ origemManual }) => origemManual);
  const gerado = gerarParedes({ ...mapa, paredes: [], portas: [] });
  const chaves = new Set(gerado.paredes.map(({ chave }) => chave));
  const preservadas = manuais.filter(({ chave }) => !chaves.has(chave));
  let paredes = [...gerado.paredes, ...preservadas];
  const paredesPorChave = new Map(paredes.map((parede) => [parede.chave, parede]));
  const portas = mapa.portas.flatMap((porta) => {
    const parede = paredesPorChave.get(porta.chave);
    if (!parede) return [];
    const preservada = {
      ...porta,
      paredeId: parede.id,
      inicio: parede.inicio,
      fim: parede.fim,
      x: parede.inicio.x,
      y: parede.inicio.y,
      orientacao: parede.orientacao,
      salaIds: [...(parede.salaIds || [])],
      corredorIds: [...(parede.corredorIds || [])],
    };
    paredes = paredes.map((item) => item.id === parede.id
      ? {
        ...item,
        tipo: "porta",
        portaId: preservada.id,
        bloqueiaMovimento: preservada.bloqueiaMovimento,
        bloqueiaVisao: preservada.bloqueiaVisao,
      }
      : item);
    return [preservada];
  });
  const descartadas = mapa.portas.length - portas.length;
  const portaEntrada = portas.find(({ tipoEspecial }) => tipoEspecial === "entrada");
  const portaSaida = portas.find(({ tipoEspecial }) => tipoEspecial === "saida");
  return {
    sucesso: true,
    mapa: marcarEdicao({
      ...gerado,
      paredes,
      portas,
      salasSecretasIds: [...(mapa.salasSecretasIds || [])],
      entrada: portaEntrada
        ? { ...gerado.entrada, paredeId: portaEntrada.paredeId, portaId: portaEntrada.id }
        : gerado.entrada,
      saida: portaSaida
        ? { ...gerado.saida, paredeId: portaSaida.paredeId, portaId: portaSaida.id }
        : gerado.saida,
      validacaoEditorDesatualizada: true,
    }),
    selecao: null,
    descricao: "Paredes automáticas recriadas",
    aviso: descartadas
      ? `${descartadas} porta(s) conflitante(s) não puderam ser preservadas.`
      : "Paredes e portas válidas foram preservadas.",
  };
}

export function criarParedeManual(mapa, inicioBruto, fimBruto) {
  const inicio = { x: Math.round(Number(inicioBruto.x)), y: Math.round(Number(inicioBruto.y)) };
  const fim = { x: Math.round(Number(fimBruto.x)), y: Math.round(Number(fimBruto.y)) };
  if (inicio.x !== fim.x && inicio.y !== fim.y) return { sucesso: false, erro: "A parede deve ser horizontal ou vertical." };
  if (inicio.x === fim.x && inicio.y === fim.y) return { sucesso: false, erro: "A parede precisa possuir comprimento." };
  if ([inicio, fim].some((ponto) => ponto.x < 0 || ponto.y < 0 || ponto.x > mapa.largura || ponto.y > mapa.altura)) {
    return { sucesso: false, erro: "A parede precisa permanecer dentro do mapa." };
  }
  const pontos = gerarCelulasDoSegmento(inicio, fim);
  const segmentos = pontos.slice(0, -1).map((ponto, indice) => ({ inicio: ponto, fim: pontos[indice + 1] }));
  const chavesExistentes = new Set(mapa.paredes.map(({ chave }) => chave));
  if (segmentos.some((segmento) => chavesExistentes.has(normalizarSegmentoParede(segmento.inicio, segmento.fim)))) {
    return { sucesso: false, erro: "Já existe uma parede em parte deste traçado." };
  }
  const paredes = [];
  segmentos.forEach((segmento) => {
    const id = proximoId([...mapa.paredes, ...paredes], "parede-manual");
    paredes.push({
      id,
      ...segmento,
      orientacao: segmento.inicio.y === segmento.fim.y ? "horizontal" : "vertical",
      chave: normalizarSegmentoParede(segmento.inicio, segmento.fim),
      tipo: "comum",
      bloqueiaMovimento: true,
      bloqueiaVisao: true,
      salaIds: [],
      corredorIds: [],
      tiposEspeciais: [],
      origemManual: true,
    });
  });
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, paredes: [...mapa.paredes, ...paredes] }),
    selecao: { tipo: "parede", id: paredes[0].id },
    descricao: `${paredes.length} segmento(s) de parede criado(s)`,
  };
}

export function alterarTipoParede(mapa, paredeId, tipo) {
  const comportamentos = {
    comum: { bloqueiaMovimento: true, bloqueiaVisao: true, secreta: false },
    abertura: { bloqueiaMovimento: false, bloqueiaVisao: false, secreta: false },
    secreta: { bloqueiaMovimento: true, bloqueiaVisao: true, secreta: true },
  };
  if (!comportamentos[tipo]) return { sucesso: false, erro: "Tipo de parede inválido." };
  const paredes = mapa.paredes.map((parede) => parede.id === paredeId ? { ...parede, tipo, ...comportamentos[tipo] } : parede);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, paredes }),
    selecao: { tipo: "parede", id: paredeId },
    descricao: `Tipo de ${paredeId} alterado`,
  };
}

export function excluirParede(mapa, paredeId, transformarEmAbertura = false) {
  const parede = mapa.paredes.find(({ id }) => id === paredeId);
  if (!parede) return { sucesso: false, erro: "Parede não encontrada." };
  if (mapa.portas.some((item) => item.paredeId === paredeId)) {
    return { sucesso: false, erro: "Remova ou mova a porta antes de excluir esta parede." };
  }
  const paredes = transformarEmAbertura
    ? mapa.paredes.map((item) => item.id === paredeId ? { ...item, tipo: "abertura", bloqueiaMovimento: false, bloqueiaVisao: false } : item)
    : mapa.paredes.filter(({ id }) => id !== paredeId);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, paredes }),
    selecao: null,
    descricao: `${paredeId} ${transformarEmAbertura ? "transformada em abertura" : "excluída"}`,
  };
}
