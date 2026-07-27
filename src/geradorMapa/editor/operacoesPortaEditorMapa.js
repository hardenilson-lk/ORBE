import { gerarPortas } from "../core/gerarPortas.js";
import { marcarEdicao, proximoId } from "./operacoesEditorMapa.js";

function criarPortaBase(parede, id, anterior = {}) {
  return {
    id,
    paredeId: parede.id,
    chave: parede.chave,
    inicio: parede.inicio,
    fim: parede.fim,
    x: parede.inicio.x,
    y: parede.inicio.y,
    orientacao: parede.orientacao,
    salaIds: [...(parede.salaIds || [])],
    corredorIds: [...(parede.corredorIds || [])],
    conexaoIds: [],
    estado: anterior.estado || "fechada",
    trancada: anterior.trancada || false,
    secreta: anterior.secreta || false,
    bloqueiaMovimento: anterior.bloqueiaMovimento ?? true,
    bloqueiaVisao: anterior.bloqueiaVisao ?? true,
    tipoEspecial: anterior.tipoEspecial || null,
    obrigatoria: anterior.obrigatoria || false,
    origemManual: true,
  };
}

export function criarOuMoverPorta(mapa, paredeId, portaId = null) {
  const parede = mapa.paredes.find(({ id }) => id === paredeId);
  if (!parede) return { sucesso: false, erro: "Crie a porta sobre uma parede válida." };
  if (mapa.portas.some((porta) => porta.paredeId === paredeId && porta.id !== portaId)) {
    return { sucesso: false, erro: "Já existe uma porta neste segmento." };
  }
  const anterior = portaId ? mapa.portas.find(({ id }) => id === portaId) : null;
  if (anterior?.paredeId === paredeId) return { sucesso: false, erro: "Escolha outro segmento para mover a porta." };
  const id = anterior?.id || proximoId(mapa.portas, "porta-manual");
  const porta = criarPortaBase(parede, id, anterior || {});
  const paredes = mapa.paredes.map((item) => {
    if (anterior && item.id === anterior.paredeId) {
      return { ...item, tipo: "comum", portaId: null, bloqueiaMovimento: true, bloqueiaVisao: true };
    }
    if (item.id === paredeId) {
      return { ...item, tipo: "porta", portaId: id, bloqueiaMovimento: porta.bloqueiaMovimento, bloqueiaVisao: porta.bloqueiaVisao };
    }
    return item;
  });
  const portas = anterior
    ? mapa.portas.map((item) => item.id === id ? porta : item)
    : [...mapa.portas, porta];
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, paredes, portas }),
    selecao: { tipo: "porta", id },
    descricao: anterior ? `${id} movida` : `${id} criada`,
  };
}

export function alterarPorta(mapa, portaId, alteracoes) {
  const atual = mapa.portas.find(({ id }) => id === portaId);
  if (!atual) return { sucesso: false, erro: "Porta não encontrada." };
  const estado = alteracoes.estado || atual.estado;
  const regras = {
    aberta: { trancada: false, secreta: false, bloqueiaMovimento: false, bloqueiaVisao: false },
    fechada: { trancada: false, secreta: false, bloqueiaMovimento: true, bloqueiaVisao: true },
    trancada: { trancada: true, secreta: false, bloqueiaMovimento: true, bloqueiaVisao: true },
    secreta: { trancada: false, secreta: true, bloqueiaMovimento: true, bloqueiaVisao: true },
  };
  if (!regras[estado]) return { sucesso: false, erro: "Estado de porta inválido." };
  const tipoEspecial = alteracoes.tipoEspecial === undefined ? atual.tipoEspecial : alteracoes.tipoEspecial;
  const portas = mapa.portas.map((item) => {
    if (item.id === portaId) return { ...atual, ...alteracoes, tipoEspecial, estado, ...regras[estado] };
    if (tipoEspecial && item.tipoEspecial === tipoEspecial) return { ...item, tipoEspecial: null };
    return item;
  });
  const porta = portas.find(({ id }) => id === portaId);
  const paredes = mapa.paredes.map((parede) => parede.id === porta.paredeId
    ? { ...parede, bloqueiaMovimento: porta.bloqueiaMovimento, bloqueiaVisao: porta.bloqueiaVisao }
    : parede);
  let entrada = mapa.entrada;
  let saida = mapa.saida;
  let salaInicialId = mapa.salaInicialId;
  let salaFinalId = mapa.salaFinalId;
  if (tipoEspecial === "entrada") entrada = { ...entrada, x: porta.x, y: porta.y, paredeId: porta.paredeId, portaId: porta.id, salaId: porta.salaIds[0] || entrada?.salaId };
  if (tipoEspecial === "saida") saida = { ...saida, x: porta.x, y: porta.y, paredeId: porta.paredeId, portaId: porta.id, salaId: porta.salaIds[0] || saida?.salaId };
  if (tipoEspecial === "entrada" && porta.salaIds[0]) salaInicialId = porta.salaIds[0];
  if (tipoEspecial === "saida" && porta.salaIds[0]) salaFinalId = porta.salaIds[0];
  if (!tipoEspecial && atual.tipoEspecial === "entrada") entrada = { ...entrada, portaId: null };
  if (!tipoEspecial && atual.tipoEspecial === "saida") saida = { ...saida, portaId: null };
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, portas, paredes, entrada, saida, salaInicialId, salaFinalId }),
    selecao: { tipo: "porta", id: portaId },
    descricao: `Estado de ${portaId} alterado`,
  };
}

export function excluirPorta(mapa, portaId, destino = "parede") {
  const porta = mapa.portas.find(({ id }) => id === portaId);
  if (!porta) return { sucesso: false, erro: "Porta não encontrada." };
  if (porta.tipoEspecial) return { sucesso: false, erro: "Defina outra entrada/saída antes de excluir esta porta." };
  const abertura = destino === "abertura";
  const paredes = mapa.paredes.map((parede) => parede.id === porta.paredeId
    ? { ...parede, tipo: abertura ? "abertura" : "comum", portaId: null, bloqueiaMovimento: !abertura, bloqueiaVisao: !abertura }
    : parede);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, paredes, portas: mapa.portas.filter(({ id }) => id !== portaId) }),
    selecao: null,
    descricao: `${portaId} excluída`,
  };
}

export function gerarPortasAutomaticasEditor(mapa) {
  const atualizado = gerarPortas({
    mapa,
    seed: mapa.seed,
    complexidade: mapa.configuracoes.complexidade,
    quantidadeSalasSecretas: mapa.configuracoes.salasSecretas || 0,
  });
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizado),
    selecao: null,
    descricao: "Portas automáticas recriadas",
  };
}
