import {
  criarVisaoJogadorDoMapa,
  normalizarMapaParaPersistencia,
} from "../persistencia/formatoMapaGerador.js";

const TAMANHO_CELULA_PADRAO = 64;

function pontoEmPixels(ponto, tamanhoCelula) {
  return {
    x: Math.round((Number(ponto?.x) || 0) * tamanhoCelula),
    y: Math.round((Number(ponto?.y) || 0) * tamanhoCelula),
  };
}

function metadadosAplicacao(mapaId, aplicacaoId) {
  return {
    origem: "gerador-mapas",
    mapaId,
    aplicacaoId,
  };
}

function adaptarEstruturas(mapa, tamanhoCelula, aplicacaoId) {
  const meta = metadadosAplicacao(mapa.id, aplicacaoId);
  const idsPortas = new Set((mapa.portas || []).map((porta) => String(porta.paredeId || "")));
  const paredes = (mapa.paredes || [])
    .filter((parede) => !idsPortas.has(String(parede.id)))
    .map((parede) => ({
      id: `gerador-${parede.id}`,
      tipoEstrutura: "parede",
      inicio: pontoEmPixels(parede.inicio, tamanhoCelula),
      fim: pontoEmPixels(parede.fim, tamanhoCelula),
      aberta: false,
      trancada: false,
      oculta: false,
      bloqueiaMovimento: true,
      bloqueiaVisao: true,
      camada: "paredes",
      visivelJogador: true,
      funcao: "colisao-visao",
      ...meta,
      origemGeradorId: parede.id,
    }));
  const portas = (mapa.portas || []).map((porta) => {
    const aberta = porta.estado === "aberta";
    return {
      id: `gerador-${porta.id}`,
      tipoEstrutura: porta.tipoEspecial === "janela" ? "janela" : "porta",
      inicio: pontoEmPixels(porta.inicio, tamanhoCelula),
      fim: pontoEmPixels(porta.fim, tamanhoCelula),
      aberta,
      trancada: porta.estado === "trancada" || porta.trancada === true,
      oculta: porta.secreta === true && porta.revelada !== true,
      bloqueiaMovimento: !aberta,
      bloqueiaVisao: !aberta,
      camada: "paredes",
      visivelJogador: true,
      funcao: "colisao-visao",
      ...meta,
      origemGeradorId: porta.id,
    };
  });
  return { paredes, portas };
}

function adaptarLuzes(mapa, tamanhoCelula, aplicacaoId) {
  const meta = metadadosAplicacao(mapa.id, aplicacaoId);
  return (mapa.luzes || []).map((luz) => ({
    id: `gerador-${luz.id}`,
    nome: String(luz.nome || "Luz"),
    x: Math.round(((Number(luz.x) || 0) + 0.5) * tamanhoCelula),
    y: Math.round(((Number(luz.y) || 0) + 0.5) * tamanhoCelula),
    raio: Math.max(tamanhoCelula, Math.round((Number(luz.alcance) || 1) * tamanhoCelula)),
    intensidade: luz.ativa === false ? 0 : Math.max(0, Math.min(1, Number(luz.intensidade) || 0)),
    cor: String(luz.cor || "#ffd36a"),
    ativa: luz.ativa !== false,
    piscando: luz.piscando === true,
    camada: "efeitos",
    ...meta,
    origemGeradorId: luz.id,
  }));
}

function adaptarObjetos(mapa, tamanhoCelula, aplicacaoId) {
  const meta = metadadosAplicacao(mapa.id, aplicacaoId);
  return (mapa.objetos || []).map((objeto) => ({
    id: `gerador-${objeto.id}`,
    nome: String(objeto.nome || "Objeto"),
    tipo: String(objeto.tipo || "objeto"),
    categoria: String(objeto.categoria || "objeto"),
    x: Math.round((Number(objeto.x) || 0) * tamanhoCelula),
    y: Math.round((Number(objeto.y) || 0) * tamanhoCelula),
    largura: Math.max(1, Number(objeto.largura) || 1) * tamanhoCelula,
    altura: Math.max(1, Number(objeto.altura) || 1) * tamanhoCelula,
    rotacao: Number(objeto.rotacao) || 0,
    bloqueiaMovimento: objeto.bloqueiaMovimento === true,
    bloqueiaVisao: objeto.bloqueiaVisao === true,
    visivelJogador: objeto.visivelJogador !== false,
    camada: "objetos",
    ...meta,
    origemGeradorId: objeto.id,
  }));
}

export function adaptarMapaGeradoParaGrid(
  mapaGerado,
  mapaAtual = {},
  { visaoJogador = false } = {},
) {
  const normalizado = visaoJogador
    ? criarVisaoJogadorDoMapa(mapaGerado)
    : normalizarMapaParaPersistencia(mapaGerado);
  const tamanhoCelula = Math.max(24, Number(mapaAtual?.grid?.tamanhoCelula) || TAMANHO_CELULA_PADRAO);
  const aplicacaoId = `aplicacao-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const estruturas = adaptarEstruturas(normalizado, tamanhoCelula, aplicacaoId);
  const preservarManual = (lista) => (Array.isArray(lista) ? lista : [])
    .filter((item) => item?.origem !== "gerador-mapas" && !item?.origemGeradorId);
  const arquiteturaVisual = {
    ...metadadosAplicacao(normalizado.id, aplicacaoId),
    tema: normalizado.tema,
    largura: normalizado.largura,
    altura: normalizado.altura,
    salas: normalizado.salas || [],
    corredores: normalizado.celulasCorredores || [],
    paredes: normalizado.paredes || [],
    portas: normalizado.portas || [],
  };

  return {
    ...(mapaAtual || {}),
    versao: Math.max(3, Number(mapaAtual?.versao) || 3),
    grid: {
      ...(mapaAtual?.grid || {}),
      colunas: normalizado.largura,
      linhas: normalizado.altura,
      tamanhoCelula,
    },
    paredes: [...preservarManual(mapaAtual?.paredes), ...estruturas.paredes],
    portas: [...preservarManual(mapaAtual?.portas), ...estruturas.portas],
    objetosCenario: [...preservarManual(mapaAtual?.objetosCenario), ...adaptarObjetos(normalizado, tamanhoCelula, aplicacaoId)],
    luzes: [...preservarManual(mapaAtual?.luzes), ...adaptarLuzes(normalizado, tamanhoCelula, aplicacaoId)],
    arquiteturaVisual,
    mapaAplicadoId: normalizado.id,
    aplicacaoMapaId: aplicacaoId,
    versaoMapaAplicada: normalizado.versaoFormato,
    geradorMapa: {
      id: normalizado.id,
      seed: normalizado.seed,
      tema: normalizado.tema,
      versaoFormato: normalizado.versaoFormato,
      nome: normalizado.nome || normalizado.seed || "Mapa gerado",
      aplicacaoId,
      visao: visaoJogador ? "jogador" : "mestre",
    },
    tokens: Array.isArray(mapaAtual?.tokens) ? mapaAtual.tokens : [],
    npcs: Array.isArray(mapaAtual?.npcs) ? mapaAtual.npcs : [],
  };
}

export function removerMapaGeradoDoGrid(
  mapaAtual = {},
  { removerTokens = false, removerNpcs = false } = {},
) {
  const aplicacaoId = mapaAtual.aplicacaoMapaId || mapaAtual.geradorMapa?.aplicacaoId;
  const pertenceAplicacao = (item) => item?.origem === "gerador-mapas"
    && (!aplicacaoId || item.aplicacaoId === aplicacaoId);
  const semGerados = (lista) => (Array.isArray(lista) ? lista : [])
    .filter((item) => !pertenceAplicacao(item) && !item?.origemGeradorId);
  return {
    ...mapaAtual,
    paredes: semGerados(mapaAtual.paredes),
    portas: semGerados(mapaAtual.portas),
    objetosCenario: semGerados(mapaAtual.objetosCenario),
    luzes: semGerados(mapaAtual.luzes),
    areas: semGerados(mapaAtual.areas),
    arquiteturaVisual: null,
    geradorMapa: null,
    mapaAplicadoId: "",
    aplicacaoMapaId: "",
    versaoMapaAplicada: null,
    tokens: removerTokens ? [] : (mapaAtual.tokens || []),
    npcs: removerNpcs ? [] : (mapaAtual.npcs || []),
  };
}
