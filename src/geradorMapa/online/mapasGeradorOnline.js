import { supabaseOrbe } from "../../services/supabaseOrbe.js";
import {
  calcularHashMapa,
  criarVisaoJogadorDoMapa,
  migrarMapaGerador,
  normalizarMapaParaPersistencia,
} from "../persistencia/formatoMapaGerador.js";
import { adaptarMapaGeradoParaGrid } from "../integracao/adaptarMapaGeradoParaGrid.js";

function exigirClienteOnline() {
  if (!supabaseOrbe) throw new Error("A sincronização online do ORBE não está disponível.");
  return supabaseOrbe;
}

async function exigirUsuario() {
  const cliente = exigirClienteOnline();
  const {
    data: { user },
    error,
  } = await cliente.auth.getUser();
  if (error || !user?.id) {
    throw new Error("Sua sessão expirou. Entre novamente para sincronizar o mapa.");
  }
  return { cliente, user };
}

function normalizarRegistroMapa(registro = {}) {
  return {
    id: String(registro.id || ""),
    mesaId: String(registro.mesa_id || ""),
    nome: String(registro.nome || "Mapa sem nome"),
    descricao: String(registro.descricao || ""),
    sistema: String(registro.sistema_regra || "arquivos"),
    tema: String(registro.tema || ""),
    seed: String(registro.seed || ""),
    status: String(registro.status || "rascunho"),
    versaoFormato: Number(registro.versao_formato || 1),
    revisao: Number(registro.revisao || 1),
    hash: String(registro.hash_mapa || ""),
    mapa: registro.dados_mapa ? migrarMapaGerador(registro.dados_mapa) : null,
    criadoPor: String(registro.criado_por || ""),
    atualizadoPor: String(registro.atualizado_por || ""),
    criadoEm: registro.created_at || null,
    atualizadoEm: registro.updated_at || null,
  };
}

export function erroMapaOnline(falha) {
  const codigo = String(falha?.code || "");
  const mensagem = String(falha?.message || "");
  if (codigo === "40001" || /conflito|revis[aã]o/i.test(mensagem)) {
    const erro = new Error("O mapa online foi alterado em outra aba. Recarregue a versão atual ou salve uma cópia.");
    erro.tipo = "conflito";
    erro.causa = falha;
    return erro;
  }
  if (codigo === "42501" || /permission|permiss[aã]o|rls/i.test(mensagem)) {
    const erro = new Error("Sua conta não possui permissão para alterar este mapa.");
    erro.tipo = "permissao";
    erro.causa = falha;
    return erro;
  }
  return falha instanceof Error ? falha : new Error(mensagem || "Falha na persistência online do mapa.");
}

export async function listarRascunhosOnline(mesaId) {
  const { cliente } = await exigirUsuario();
  const { data, error } = await cliente
    .from("mapas_gerador_orbe")
    .select("id,mesa_id,nome,descricao,sistema_regra,tema,seed,status,versao_formato,revisao,hash_mapa,criado_por,atualizado_por,created_at,updated_at")
    .eq("mesa_id", String(mesaId))
    .in("status", ["rascunho", "aplicado", "arquivado"])
    .order("updated_at", { ascending: false });
  if (error) throw erroMapaOnline(error);
  return (data || []).map(normalizarRegistroMapa);
}

export async function carregarMapaOnline(mapaId) {
  const { cliente } = await exigirUsuario();
  const { data, error } = await cliente
    .from("mapas_gerador_orbe")
    .select("*")
    .eq("id", String(mapaId))
    .single();
  if (error) throw erroMapaOnline(error);
  return normalizarRegistroMapa(data);
}

export async function salvarRascunhoOnline({
  id = null,
  mesaId,
  nome,
  descricao = "",
  mapa,
  revisaoEsperada = null,
}) {
  const { cliente } = await exigirUsuario();
  const normalizado = normalizarMapaParaPersistencia(mapa);
  const { data, error } = await cliente.rpc("salvar_rascunho_mapa_orbe", {
    mapa_id_informado: id || null,
    mesa_id_informada: String(mesaId),
    nome_informado: String(nome || "Mapa sem nome").slice(0, 120),
    descricao_informada: String(descricao || "").slice(0, 500),
    sistema_informado: normalizado.sistema,
    tema_informado: normalizado.tema || null,
    seed_informada: normalizado.seed || null,
    versao_formato_informada: normalizado.versaoFormato,
    hash_informado: calcularHashMapa(normalizado),
    mapa_informado: normalizado,
    configuracoes_informadas: normalizado.configuracoes || {},
    validacao_informada: {
      estrutural: normalizado.validacaoEstrutural || null,
      tematica: normalizado.validacaoTematica || null,
    },
    revisao_esperada: revisaoEsperada,
  });
  if (error) throw erroMapaOnline(error);
  const registro = Array.isArray(data) ? data[0] : data;
  return normalizarRegistroMapa(registro);
}

export async function aplicarMapaOnline({
  mapaId,
  mesaId,
  mapa,
  mapaGridAtual = {},
  revisaoEsperada,
  descricao = "Mapa aplicado pelo mestre",
}) {
  const { cliente } = await exigirUsuario();
  const normalizado = normalizarMapaParaPersistencia(mapa);
  const visaoJogador = criarVisaoJogadorDoMapa(normalizado);
  const gridMestre = adaptarMapaGeradoParaGrid(normalizado, mapaGridAtual);
  const gridJogador = adaptarMapaGeradoParaGrid(visaoJogador, mapaGridAtual, { visaoJogador: true });
  const { data, error } = await cliente.rpc("aplicar_mapa_gerador_orbe", {
    mapa_id_informado: String(mapaId),
    mesa_id_informada: String(mesaId),
    revisao_esperada: Number(revisaoEsperada),
    hash_informado: calcularHashMapa(normalizado),
    mapa_mestre_informado: normalizado,
    mapa_jogador_informado: visaoJogador,
    grid_mestre_informado: gridMestre,
    grid_jogador_informado: gridJogador,
    descricao_informada: String(descricao || "Mapa aplicado").slice(0, 500),
  });
  if (error) throw erroMapaOnline(error);
  const registro = Array.isArray(data) ? data[0] : data;
  return {
    mapaOnline: normalizarRegistroMapa(registro),
    gridMestre,
    gridJogador,
  };
}

export async function carregarMapaAplicadoDaMesa(mesaId) {
  const cliente = exigirClienteOnline();
  const { data, error } = await cliente
    .from("mapas_aplicados_orbe")
    .select("mesa_id,mapa_id,revisao,hash_mapa,versao_formato,dados_jogador,grid_jogador,updated_at")
    .eq("mesa_id", String(mesaId))
    .maybeSingle();
  if (error) throw erroMapaOnline(error);
  if (!data) return null;
  return {
    mesaId: String(data.mesa_id),
    mapaId: String(data.mapa_id),
    revisao: Number(data.revisao || 0),
    hash: String(data.hash_mapa || ""),
    versaoFormato: Number(data.versao_formato || 1),
    mapa: data.dados_jogador ? migrarMapaGerador(data.dados_jogador) : null,
    grid: data.grid_jogador || null,
    atualizadoEm: data.updated_at,
  };
}

export async function listarVersoesMapaOnline(mapaId) {
  const { cliente } = await exigirUsuario();
  const { data, error } = await cliente
    .from("mapa_versoes_orbe")
    .select("id,mapa_id,mesa_id,numero_versao,descricao,hash_mapa,versao_formato,tamanho_bytes,criado_por,created_at")
    .eq("mapa_id", String(mapaId))
    .order("numero_versao", { ascending: false })
    .limit(20);
  if (error) throw erroMapaOnline(error);
  return data || [];
}

export async function restaurarVersaoMapaOnline({ versaoId, mesaId, revisaoEsperada }) {
  const { cliente } = await exigirUsuario();
  const { data, error } = await cliente.rpc("restaurar_versao_mapa_orbe", {
    versao_id_informada: String(versaoId),
    mesa_id_informada: String(mesaId),
    revisao_esperada: Number(revisaoEsperada),
  });
  if (error) throw erroMapaOnline(error);
  const registro = Array.isArray(data) ? data[0] : data;
  return normalizarRegistroMapa(registro);
}

export function assinarMapaAplicadoRealtime(mesaId, callbacks = {}) {
  if (!supabaseOrbe || !mesaId || mesaId === "local") return () => {};
  let maiorRevisao = Number(callbacks.revisaoInicial || 0);
  const canal = supabaseOrbe
    .channel(`orbe-mapa-aplicado:${String(mesaId)}:${Date.now()}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "mapas_aplicados_orbe",
        filter: `mesa_id=eq.${String(mesaId)}`,
      },
      (evento) => {
        if (evento.eventType === "DELETE") {
          callbacks.aoRemover?.();
          return;
        }
        const registro = evento.new || {};
        const revisao = Number(registro.revisao || 0);
        if (revisao <= maiorRevisao) return;
        maiorRevisao = revisao;
        callbacks.aoMapa?.({
          mesaId: String(registro.mesa_id || ""),
          mapaId: String(registro.mapa_id || ""),
          revisao,
          hash: String(registro.hash_mapa || ""),
          grid: registro.grid_jogador || null,
          atualizadoEm: registro.updated_at,
        });
      },
    )
    .subscribe((status, erro) => {
      callbacks.aoStatus?.(status);
      if (erro) callbacks.aoErro?.(erro);
    });
  return () => {
    void supabaseOrbe.removeChannel(canal);
  };
}
