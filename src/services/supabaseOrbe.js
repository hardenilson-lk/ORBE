import { createClient } from "@supabase/supabase-js";
import { obterUrlBaseAplicativo } from "../utils/urlAplicativo.js";

const url = String(import.meta.env.VITE_SUPABASE_URL || "").trim();
const chave = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();
const habilitado = import.meta.env.VITE_ORBE_ONLINE_ENABLED === "true" && Boolean(url && chave);
const retornoAutenticacaoInicial = typeof window !== "undefined"
  && /(?:^|[?#&])(access_token|refresh_token|code|error|error_description)=/i.test(`${window.location.search}${window.location.hash}`);

export const supabaseOrbe = habilitado
  ? createClient(url, chave, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export function orbeOnlineHabilitado() {
  return Boolean(supabaseOrbe);
}

export async function verificarServidorOrbe() {
  if (!habilitado) {
    return {
      online: false,
      modo: "local",
      mensagem: "Servidor online desativado. O acesso local continua disponível.",
    };
  }

  const controlador = new AbortController();
  const temporizador = window.setTimeout(() => controlador.abort(), 4500);

  try {
    const resposta = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      method: "GET",
      headers: { apikey: chave },
      cache: "no-store",
      signal: controlador.signal,
    });

    if (!resposta.ok) throw new Error(`Health check respondeu ${resposta.status}.`);

    return {
      online: true,
      modo: "online",
      mensagem: "Servidor conectado e pronto para autenticar.",
    };
  } catch (erro) {
    console.warn("Não foi possível confirmar o servidor do ORBE.", erro);
    return {
      online: false,
      modo: "offline",
      mensagem: "Servidor indisponível. Tente novamente em alguns instantes.",
    };
  } finally {
    window.clearTimeout(temporizador);
  }
}

function exigirCliente() {
  if (!supabaseOrbe) throw new Error("O modo online ainda não foi ativado neste ambiente.");
  return supabaseOrbe;
}

async function carregarOuCriarPerfil(cliente, usuarioAutenticado) {
  const { data: perfil, error: erroPerfil } = await cliente
    .from("perfis_orbe")
    .select("*")
    .eq("id", usuarioAutenticado.id)
    .maybeSingle();
  if (erroPerfil) throw erroPerfil;

  if (perfil) return { ...perfil, id: usuarioAutenticado.id, email: usuarioAutenticado.email };

  const perfilInicial = {
    id: usuarioAutenticado.id,
    nome: usuarioAutenticado.user_metadata?.nome || usuarioAutenticado.email?.split("@")[0] || "Investigador",
    usuario: usuarioAutenticado.user_metadata?.usuario || usuarioAutenticado.email?.split("@")[0] || "jogador",
    email: usuarioAutenticado.email,
  };
  const { data: perfilCriado, error: erroCriacao } = await cliente
    .from("perfis_orbe")
    .upsert(perfilInicial)
    .select()
    .single();
  if (erroCriacao) throw erroCriacao;
  return perfilCriado;
}

export async function criarContaRemota({ nome, usuario, email, senha }) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.auth.signUp({
    email: String(email || "").trim(),
    password: String(senha || ""),
    options: {
      emailRedirectTo: obterUrlBaseAplicativo(),
      data: { nome: String(nome || "").trim(), usuario: String(usuario || "").trim() },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error("O servidor não devolveu os dados da nova conta.");
  if (!data.session) return { ...data.user, confirmacaoPendente: true };
  if (data.user && data.session) {
    const { error: erroPerfil } = await cliente.from("perfis_orbe").upsert({
      id: data.user.id,
      nome: String(nome || "").trim(),
      usuario: String(usuario || "").trim(),
      email: String(email || "").trim().toLowerCase(),
    });
    if (erroPerfil) throw erroPerfil;
  }
  return data.user;
}

export async function reenviarConfirmacaoRemota(email) {
  const cliente = exigirCliente();
  const emailNormalizado = String(email || "").trim().toLowerCase();
  if (!emailNormalizado.includes("@")) throw new Error("Informe o e-mail usado no cadastro.");

  const { data, error } = await cliente.auth.resend({
    type: "signup",
    email: emailNormalizado,
    options: {
      emailRedirectTo: obterUrlBaseAplicativo(),
    },
  });
  if (error) throw error;
  return data;
}

export async function processarRetornoAutenticacaoRemota() {
  if (!supabaseOrbe || typeof window === "undefined") return null;

  const parametros = `${window.location.search}${window.location.hash}`;
  const possuiRetorno = retornoAutenticacaoInicial
    || /(?:^|[?#&])(access_token|refresh_token|code|error|error_description)=/i.test(parametros);
  if (!possuiRetorno) return null;

  const { data, error } = await supabaseOrbe.auth.getSession();
  if (error) throw error;

  if (!data.session?.user) {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const mensagem = hash.get("error_description") || hash.get("error");
    if (mensagem) throw new Error(mensagem);
    return null;
  }

  const perfil = await carregarOuCriarPerfil(supabaseOrbe, data.session.user);
  const urlLimpa = new URL(obterUrlBaseAplicativo());
  window.history.replaceState(window.history.state, document.title, `${urlLimpa.pathname}${urlLimpa.search}`);
  return perfil;
}

export async function entrarContaRemota(email, senha) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.auth.signInWithPassword({
    email: String(email || "").trim(),
    password: String(senha || ""),
  });
  if (error) throw error;
  return carregarOuCriarPerfil(cliente, data.user);
}

export async function sairContaRemota() {
  if (!supabaseOrbe) return;
  const { error } = await supabaseOrbe.auth.signOut();
  if (error) throw error;
}

export async function listarMesasRemotas() {
  const cliente = exigirCliente();
  const { data, error } = await cliente.from("mesas_orbe").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizarMesaRemota);
}

export function normalizarMesaRemota(registro = {}) {
  return {
    ...(registro.dados || {}),
    id: registro.id,
    ownerId: registro.owner_id,
    nome: registro.nome,
    nomeCampanha: registro.dados?.nomeCampanha || registro.nome,
    codigoConvite: registro.codigo_convite,
    sistema: registro.sistema || "arquivos",
    atualizadoEm: registro.updated_at,
    remoto: true,
  };
}

export function normalizarFichaRemota(registro = {}) {
  return {
    ...(registro.dados || {}),
    id: String(registro.id || registro.dados?.id || ""),
    nome: registro.nome || registro.dados?.nome || "Agente",
    jogadorId: registro.responsavel_id || registro.dados?.jogadorId || "",
    editLocked: registro.edit_locked === true,
    atualizadoEm: registro.updated_at || registro.dados?.atualizadoEm,
    remoto: true,
  };
}

export async function buscarMesaRemota(mesaId) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.from("mesas_orbe").select("*").eq("id", String(mesaId)).maybeSingle();
  if (error) throw error;
  return data ? normalizarMesaRemota(data) : null;
}

export async function listarFichasRemotas(mesaId) {
  const cliente = exigirCliente();
  const { data, error } = await cliente
    .from("fichas_orbe")
    .select("*")
    .eq("mesa_id", String(mesaId))
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizarFichaRemota);
}

export async function carregarSessaoPublicaRemota(mesaId) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.from("sessoes_orbe").select("*").eq("mesa_id", String(mesaId)).maybeSingle();
  if (error) throw error;
  return data ? { ...(data.dados || {}), atualizadoEm: data.updated_at || data.dados?.atualizadoEm } : null;
}

export async function carregarSegredosMestreRemotos(mesaId) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.from("segredos_mestre_orbe").select("*").eq("mesa_id", String(mesaId)).maybeSingle();
  if (error) throw error;
  return data?.dados || null;
}

export async function listarMembrosMesaRemotos(mesaId) {
  const cliente = exigirCliente();
  const { data: membros, error } = await cliente
    .from("mesa_membros_orbe")
    .select("mesa_id,user_id,papel,status,created_at")
    .eq("mesa_id", String(mesaId))
    .eq("status", "ativo");
  if (error) throw error;

  const ids = (membros || []).map((membro) => membro.user_id).filter(Boolean);
  let perfis = [];
  if (ids.length) {
    const { data, error: erroPerfis } = await cliente
      .from("perfis_orbe")
      .select("id,nome,usuario,updated_at")
      .in("id", ids);
    if (erroPerfis) throw erroPerfis;
    perfis = data || [];
  }

  const perfisPorId = new Map(perfis.map((perfil) => [perfil.id, perfil]));
  return (membros || []).map((membro) => {
    const perfil = perfisPorId.get(membro.user_id) || {};
    return {
      id: membro.user_id,
      nome: perfil.nome || perfil.usuario || "Investigador",
      usuario: perfil.usuario || "",
      papel: membro.papel,
      status: membro.status,
      membroDesde: membro.created_at,
      atualizadoEm: perfil.updated_at || membro.created_at,
    };
  });
}

export async function carregarEstadoMesaRemoto(mesaId, { incluirSegredos = false } = {}) {
  if (!supabaseOrbe) return null;
  const [mesa, fichas, sessao, membros, segredos] = await Promise.all([
    buscarMesaRemota(mesaId),
    listarFichasRemotas(mesaId),
    carregarSessaoPublicaRemota(mesaId),
    listarMembrosMesaRemotos(mesaId),
    incluirSegredos ? carregarSegredosMestreRemotos(mesaId) : Promise.resolve(null),
  ]);
  return { mesa, fichas, sessao, membros, segredos };
}

function nomeCanal(prefixo, identificador) {
  const sufixo = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefixo}:${identificador}:${sufixo}`;
}

export function assinarMesaOrbeRealtime(mesaId, callbacks = {}) {
  if (!supabaseOrbe || !mesaId || mesaId === "local") return () => {};

  let construtorCanal = supabaseOrbe
    .channel(nomeCanal("orbe-mesa", mesaId))
    .on("postgres_changes", { event: "*", schema: "public", table: "mesas_orbe", filter: `id=eq.${mesaId}` }, (evento) => {
      callbacks.aoMesa?.(evento.eventType === "DELETE" ? null : normalizarMesaRemota(evento.new));
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "fichas_orbe", filter: `mesa_id=eq.${mesaId}` }, () => {
      callbacks.aoFichasAlteradas?.();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "sessoes_orbe", filter: `mesa_id=eq.${mesaId}` }, (evento) => {
      callbacks.aoSessao?.(evento.eventType === "DELETE" ? null : {
        ...(evento.new?.dados || {}),
        atualizadoEm: evento.new?.updated_at || evento.new?.dados?.atualizadoEm,
      });
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "mesa_membros_orbe", filter: `mesa_id=eq.${mesaId}` }, () => {
      callbacks.aoMembrosAlterados?.();
    });

  if (callbacks.aoSegredos) {
    construtorCanal = construtorCanal.on("postgres_changes", { event: "*", schema: "public", table: "segredos_mestre_orbe", filter: `mesa_id=eq.${mesaId}` }, (evento) => {
      callbacks.aoSegredos?.(evento.eventType === "DELETE" ? null : evento.new?.dados || null);
    });
  }

  const canal = construtorCanal.subscribe((status, erro) => {
      callbacks.aoStatus?.(status);
      if (erro) callbacks.aoErro?.(erro);
    });

  return () => {
    void supabaseOrbe.removeChannel(canal);
  };
}

export async function assinarMesasUsuarioRealtime(aoAlterar, aoStatus, aoErro) {
  if (!supabaseOrbe) return () => {};
  const { data } = await supabaseOrbe.auth.getUser();
  const usuarioId = data.user?.id;
  if (!usuarioId) return () => {};

  const canal = supabaseOrbe
    .channel(nomeCanal("orbe-mesas-usuario", usuarioId))
    .on("postgres_changes", { event: "*", schema: "public", table: "mesas_orbe" }, () => aoAlterar?.())
    .on("postgres_changes", { event: "*", schema: "public", table: "mesa_membros_orbe", filter: `user_id=eq.${usuarioId}` }, () => aoAlterar?.())
    .on("postgres_changes", { event: "*", schema: "public", table: "fichas_orbe" }, () => aoAlterar?.())
    .subscribe((status, erro) => {
      aoStatus?.(status);
      if (erro) aoErro?.(erro);
    });

  return () => {
    void supabaseOrbe.removeChannel(canal);
  };
}

export async function salvarMesaRemota(mesa) {
  if (!supabaseOrbe) return null;
  const { data: autenticacao } = await supabaseOrbe.auth.getUser();
  if (!autenticacao.user) return null;
  const { data, error } = await supabaseOrbe.from("mesas_orbe").upsert({
    id: mesa.id,
    owner_id: autenticacao.user.id,
    nome: mesa.nomeCampanha || mesa.nome || "Campanha",
    codigo_convite: mesa.codigoConvite || `ORBE-${String(mesa.id).slice(-6).toUpperCase()}`,
    sistema: "arquivos",
    dados: mesa,
    updated_at: new Date().toISOString(),
  }).select().single();
  if (error) throw error;
  return data;
}

export async function entrarMesaRemota(codigoConvite) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.rpc("entrar_mesa_orbe", { codigo_informado: String(codigoConvite || "").trim().toUpperCase() });
  if (error) throw error;
  return data;
}

export async function salvarFichaRemota(mesaId, ficha) {
  if (!supabaseOrbe) return null;
  const { data: autenticacao } = await supabaseOrbe.auth.getUser();
  if (!autenticacao.user) return null;
  const { data, error } = await supabaseOrbe.from("fichas_orbe").upsert({
    id: String(ficha.id),
    mesa_id: mesaId,
    responsavel_id: ficha.jogadorId || null,
    nome: ficha.nome || "Agente",
    edit_locked: ficha.editLocked === true,
    dados: ficha,
    updated_at: new Date().toISOString(),
  }).select().single();
  if (error) throw error;
  return data;
}

export async function removerFichaRemota(fichaId) {
  if (!supabaseOrbe) return;
  const { error } = await supabaseOrbe.from("fichas_orbe").delete().eq("id", String(fichaId));
  if (error) throw error;
}

export async function salvarSessaoPublicaRemota(mesaId, sessao) {
  if (!supabaseOrbe) return null;
  const { anotacoesMestre: _segredo, ...dadosPublicos } = sessao || {};
  const { data, error } = await supabaseOrbe.from("sessoes_orbe").upsert({
    mesa_id: mesaId,
    dados: dadosPublicos,
    updated_at: new Date().toISOString(),
  }).select().single();
  if (error) throw error;
  return data;
}

export async function salvarSegredosMestreRemotos(mesaId, anotacoesMestre) {
  if (!supabaseOrbe) return null;
  const { data, error } = await supabaseOrbe.from("segredos_mestre_orbe").upsert({
    mesa_id: mesaId,
    dados: { anotacoesMestre: String(anotacoesMestre || "") },
    updated_at: new Date().toISOString(),
  }).select().single();
  if (error) throw error;
  return data;
}

const sincronizacoesPendentes = new Map();

export function agendarSessaoPublicaRemota(mesaId, sessao) {
  if (!supabaseOrbe) return;
  clearTimeout(sincronizacoesPendentes.get(mesaId));
  sincronizacoesPendentes.set(mesaId, setTimeout(() => {
    sincronizacoesPendentes.delete(mesaId);
    void salvarSessaoPublicaRemota(mesaId, sessao).catch((erro) => {
      console.warn("Não foi possível sincronizar a sessão pública.", erro);
    });
  }, 650));
}
