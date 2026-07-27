import {
  calcularHashMapa,
  clonarMapaSeguro,
  migrarMapaGerador,
  normalizarMapaParaPersistencia,
} from "./formatoMapaGerador.js";
import { gerarMiniaturaMapa } from "./miniaturaMapaGerador.js";

const CHAVE_RASCUNHOS = "orbe:gerador-mapas:rascunhos:v1";
const LIMITE_RASCUNHOS = 20;

function armazenamentoDisponivel() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function lerTodos() {
  if (!armazenamentoDisponivel()) return [];
  try {
    const dados = JSON.parse(window.localStorage.getItem(CHAVE_RASCUNHOS) || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function gravarTodos(rascunhos) {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.setItem(CHAVE_RASCUNHOS, JSON.stringify(rascunhos.slice(0, LIMITE_RASCUNHOS)));
}

export function listarRascunhosLocais(mesaId = "") {
  return lerTodos()
    .filter((item) => !mesaId || String(item.mesaId || "") === String(mesaId))
    .map(({ mapa: _mapa, ...resumo }) => resumo);
}

export function salvarRascunhoLocal({ id, mesaId, nome, descricao = "", mapa }) {
  const normalizado = normalizarMapaParaPersistencia(mapa);
  const agora = new Date().toISOString();
  const rascunhoId = String(id || `rascunho-${Date.now()}`);
  const anterior = lerTodos().find((item) => item.id === rascunhoId);
  const registro = {
    id: rascunhoId,
    mesaId: String(mesaId || "local"),
    nome: String(nome || "Mapa sem nome").slice(0, 120),
    descricao: String(descricao || "").slice(0, 500),
    sistema: normalizado.sistema,
    seed: normalizado.seed,
    tema: normalizado.tema,
    largura: normalizado.largura,
    altura: normalizado.altura,
    quantidadeSalas: normalizado.salas?.length || 0,
    miniatura: gerarMiniaturaMapa({ ...normalizado, nome }),
    status: anterior?.status || "rascunho",
    aplicadoNaMesaId: anterior?.aplicadoNaMesaId || "",
    aplicacaoAtualId: anterior?.aplicacaoAtualId || "",
    versaoFormato: normalizado.versaoFormato,
    hash: calcularHashMapa(normalizado),
    criadoEm: anterior?.criadoEm || agora,
    atualizadoEm: agora,
    mapa: normalizado,
  };
  gravarTodos([registro, ...lerTodos().filter((item) => item.id !== rascunhoId)]);
  return clonarMapaSeguro(registro);
}

export function carregarRascunhoLocal(id) {
  const registro = lerTodos().find((item) => item.id === String(id));
  return registro ? { ...registro, mapa: migrarMapaGerador(registro.mapa) } : null;
}

export function removerRascunhoLocal(id) {
  gravarTodos(lerTodos().filter((item) => item.id !== String(id)));
}

export function atualizarIdentidadeRascunhoLocal(id, alteracoes = {}) {
  const atual = lerTodos().find((item) => item.id === String(id));
  if (!atual) return null;
  const agora = new Date().toISOString();
  const nome = Object.hasOwn(alteracoes, "nome")
    ? String(alteracoes.nome || "").trim().slice(0, 80)
    : atual.nome;
  if (!nome) throw new Error("Informe um nome para o mapa.");
  const atualizado = {
    ...atual,
    ...alteracoes,
    id: atual.id,
    nome,
    atualizadoEm: agora,
    miniatura: gerarMiniaturaMapa({ ...atual.mapa, nome }),
  };
  gravarTodos([atualizado, ...lerTodos().filter((item) => item.id !== atual.id)]);
  return clonarMapaSeguro(atualizado);
}

export function duplicarRascunhoLocal(id) {
  const atual = lerTodos().find((item) => item.id === String(id));
  if (!atual) return null;
  const agora = new Date().toISOString();
  const novoId = `mapa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const nome = `${atual.nome} — Cópia`.slice(0, 80);
  const mapa = migrarMapaGerador({
    ...atual.mapa,
    id: novoId,
    tokens: [],
    npcs: [],
  });
  const duplicado = {
    ...atual,
    id: novoId,
    nome,
    status: "rascunho",
    aplicadoNaMesaId: "",
    aplicacaoAtualId: "",
    criadoEm: agora,
    atualizadoEm: agora,
    hash: calcularHashMapa(mapa),
    miniatura: gerarMiniaturaMapa({ ...mapa, nome }),
    mapa,
  };
  gravarTodos([duplicado, ...lerTodos()]);
  return clonarMapaSeguro(duplicado);
}
