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
  if (!data.session?.user) throw new Error("O servidor não iniciou uma sessão válida. Tente entrar novamente.");
  return carregarOuCriarPerfil(cliente, data.session.user);
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
    exigeAprovacaoConvite:
      registro.exigir_aprovacao_convite !== false,
    statusEntrada:
      registro.status_entrada || "ativo",
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
    ownerId: registro.owner_id || registro.dados?.ownerId || "",
    editLocked: registro.edit_locked === true,
    atualizadoEm: registro.updated_at || registro.dados?.atualizadoEm,
    remoto: true,
  };
}

export function normalizarFichaPessoalRemota(registro = {}) {
  return {
    ...(registro.dados || {}),
    id: String(registro.id || registro.dados?.id || ""),
    nome: registro.nome || registro.dados?.nome || "Agente",
    jogadorId: registro.owner_id || registro.responsavel_id || "",
    mesaSolicitadaId: registro.mesa_solicitada_id || "",
    statusMigracao: registro.status_migracao || "",
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

export async function listarFichasPessoaisRemotas() {
  const cliente = exigirCliente();
  const {
    data: { user },
    error: erroUsuario,
  } = await cliente.auth.getUser();
  if (erroUsuario || !user) {
    throw new Error("Sua sessÃ£o expirou. Entre novamente para acessar suas fichas.");
  }

  const { data, error } = await cliente
    .from("fichas_orbe")
    .select("*")
    .eq("owner_id", user.id)
    .is("mesa_id", null)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizarFichaPessoalRemota);
}

export async function salvarFichaPessoalRemota(ficha) {
  const cliente = exigirCliente();
  const {
    data: { user },
    error: erroUsuario,
  } = await cliente.auth.getUser();
  if (erroUsuario || !user) {
    throw new Error("Sua sessÃ£o expirou. Entre novamente para salvar a ficha.");
  }

  const { data, error } = await cliente.rpc("salvar_ficha_pessoal_orbe", {
    ficha_id_informada: String(ficha.id),
    nome_informado: ficha.nome || "Agente",
    dados_informados: {
      ...ficha,
      jogadorId: user.id,
      origemFicha: "pessoal",
    },
  });
  if (error) throw error;
  const registro = Array.isArray(data) ? data[0] : data;
  return normalizarFichaPessoalRemota(registro);
}

export async function solicitarMigracaoFichaRemota(fichaId, mesaId) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.rpc("solicitar_migracao_ficha_orbe", {
    ficha_id_informada: String(fichaId),
    mesa_id_informada: String(mesaId),
  });
  if (error) throw error;
  const registro = Array.isArray(data) ? data[0] : data;
  return registro ? normalizarFichaPessoalRemota(registro) : null;
}

export async function listarSolicitacoesMigracaoFichaRemotas(mesaId) {
  const cliente = exigirCliente();
  const { data, error } = await cliente
    .from("fichas_orbe")
    .select("*")
    .eq("mesa_solicitada_id", String(mesaId))
    .eq("status_migracao", "pendente")
    .order("updated_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizarFichaPessoalRemota);
}

export async function revisarMigracaoFichaRemota(fichaId, aceitar) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.rpc("revisar_migracao_ficha_orbe", {
    ficha_id_informada: String(fichaId),
    aceitar: Boolean(aceitar),
  });
  if (error) throw error;
  const registro = Array.isArray(data) ? data[0] : data;
  return registro ? normalizarFichaRemota(registro) : null;
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

export async function buscarMinhaAssociacaoMesaRemota(mesaId) {
  const cliente = exigirCliente();
  const {
    data: { user },
    error: erroUsuario,
  } = await cliente.auth.getUser();

  if (erroUsuario) throw erroUsuario;
  if (!user?.id) throw new Error("Sua sessão expirou. Entre novamente.");

  const { data, error } = await cliente
    .from("mesa_membros_orbe")
    .select("mesa_id,user_id,papel,status,created_at")
    .eq("mesa_id", String(mesaId))
    .eq("user_id", String(user.id))
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listarSolicitacoesEntradaRemotas(mesaId) {
  const cliente = exigirCliente();
  const { data: solicitacoes, error } = await cliente
    .from("mesa_membros_orbe")
    .select("mesa_id,user_id,papel,status,created_at")
    .eq("mesa_id", String(mesaId))
    .eq("status", "pendente")
    .order("created_at", { ascending: true });
  if (error) throw error;

  const ids = (solicitacoes || []).map((item) => item.user_id);
  if (!ids.length) return [];

  const { data: perfis, error: erroPerfis } = await cliente
    .from("perfis_orbe")
    .select("id,nome,usuario")
    .in("id", ids);
  if (erroPerfis) throw erroPerfis;

  const perfisPorId = new Map((perfis || []).map((perfil) => [perfil.id, perfil]));
  return (solicitacoes || []).map((solicitacao) => ({
    ...solicitacao,
    perfil: perfisPorId.get(solicitacao.user_id) || null,
  }));
}

export async function responderSolicitacaoEntradaRemota(
  mesaId,
  usuarioId,
  aprovar,
) {
  const cliente = exigirCliente();
  const { data, error } = await cliente
    .from("mesa_membros_orbe")
    .update({ status: aprovar ? "ativo" : "recusado" })
    .eq("mesa_id", String(mesaId))
    .eq("user_id", String(usuarioId))
    .eq("status", "pendente")
    .select("mesa_id,user_id,status")
    .single();
  if (error) throw error;
  return data;
}

export async function moderarMembroMesaRemoto(mesaId, usuarioId, acao) {
  const cliente = exigirCliente();
  const mesa = String(mesaId || "");
  const usuario = String(usuarioId || "");

  if (!mesa || !usuario) {
    throw new Error("Participante inválido.");
  }

  if (acao === "expulsar") {
    const { data, error } = await cliente
      .from("mesa_membros_orbe")
      .delete()
      .eq("mesa_id", mesa)
      .eq("user_id", usuario)
      .neq("papel", "mestre")
      .select("mesa_id,user_id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Somente jogadores podem ser expulsos.");
    return { mesaId: mesa, usuarioId: usuario, status: "expulso" };
  }

  if (acao === "banir") {
    const { data, error } = await cliente
      .from("mesa_membros_orbe")
      .update({ status: "banido" })
      .eq("mesa_id", mesa)
      .eq("user_id", usuario)
      .neq("papel", "mestre")
      .select("mesa_id,user_id,status")
      .single();
    if (error) throw error;
    return data;
  }

  throw new Error("Ação de moderação inválida.");
}

export async function configurarAprovacaoConvitesRemota(mesaId, exigir) {
  const cliente = exigirCliente();
  const { data, error } = await cliente
    .from("mesas_orbe")
    .update({ exigir_aprovacao_convite: Boolean(exigir) })
    .eq("id", String(mesaId))
    .select()
    .single();
  if (error) throw error;
  return normalizarMesaRemota(data);
}

export function assinarSolicitacoesEntradaRealtime(mesaId, aoAlterar, aoErro) {
  if (!supabaseOrbe || !mesaId || mesaId === "local") return () => {};
  const canal = supabaseOrbe
    .channel(nomeCanal("orbe-solicitacoes", mesaId))
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "mesa_membros_orbe",
        filter: `mesa_id=eq.${mesaId}`,
      },
      () => aoAlterar?.(),
    )
    .subscribe((_status, erro) => {
      if (erro) aoErro?.(erro);
    });

  return () => {
    void supabaseOrbe.removeChannel(canal);
  };
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

const canaisMesaRealtime = new Map();

function topicoMesaRealtime(mesaId) {
  return `orbe-mesa:${String(mesaId)}`;
}

function topicoPresencaMesa(mesaId) {
  return `orbe-presenca:${String(mesaId)}`;
}

function normalizarPresencas(estado = {}) {
  return Object.entries(estado).flatMap(([chave, presencas]) =>
    (Array.isArray(presencas) ? presencas : []).map((presenca) => ({
      ...presenca,
      user_id: String(presenca?.user_id || chave),
      mesa_id: String(presenca?.mesa_id || ""),
      ficha_id: presenca?.ficha_id ? String(presenca.ficha_id) : "",
    })),
  );
}

export async function assinarPresencaMesaOrbe(
  mesaId,
  dadosPresenca = {},
  callbacks = {},
) {
  if (!supabaseOrbe || !mesaId || mesaId === "local") {
    return {
      atualizar: async () => false,
      remover: () => {},
    };
  }

  const {
    data: { user },
    error,
  } = await supabaseOrbe.auth.getUser();

  if (error) throw error;
  if (!user?.id) throw new Error("Sua sessão expirou. Entre novamente na mesa.");

  let dadosAtuais = { ...dadosPresenca };
  let inscrito = false;
  const usuarioId = String(user.id);
  const canal = supabaseOrbe
    .channel(topicoPresencaMesa(mesaId), {
      config: {
        presence: {
          key: usuarioId,
        },
      },
    })
    .on("presence", { event: "sync" }, () => {
      callbacks.aoAlterar?.(normalizarPresencas(canal.presenceState()));
    })
    .on("presence", { event: "join" }, () => {
      callbacks.aoAlterar?.(normalizarPresencas(canal.presenceState()));
    })
    .on("presence", { event: "leave" }, () => {
      callbacks.aoAlterar?.(normalizarPresencas(canal.presenceState()));
    });

  async function rastrear() {
    const resultado = await canal.track({
      user_id: usuarioId,
      nome:
        String(dadosAtuais.nome || user.user_metadata?.nome || user.email || "Investigador"),
      mesa_id: String(mesaId),
      ficha_id: dadosAtuais.fichaId ? String(dadosAtuais.fichaId) : "",
      papel: String(dadosAtuais.papel || "jogador").toLowerCase(),
      online_at: new Date().toISOString(),
    });
    return resultado === "ok";
  }

  canal.subscribe((status, erroCanal) => {
    callbacks.aoStatus?.(status);
    if (erroCanal) callbacks.aoErro?.(erroCanal);
    if (status === "SUBSCRIBED") {
      inscrito = true;
      void rastrear().catch((falha) => callbacks.aoErro?.(falha));
    }
    if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
      inscrito = false;
    }
  });

  return {
    atualizar: async (proximosDados = {}) => {
      dadosAtuais = {
        ...dadosAtuais,
        ...proximosDados,
      };
      if (!inscrito) return false;
      return rastrear();
    },
    remover: () => {
      void canal
        .untrack()
        .catch(() => {})
        .finally(() => {
          void supabaseOrbe.removeChannel(canal);
        });
    },
  };
}

export async function publicarRolagemMesaRealtime(mesaId, rolagem) {
  if (!supabaseOrbe || !mesaId || mesaId === "local" || !rolagem?.id) {
    return false;
  }

  const canal = canaisMesaRealtime.get(String(mesaId));
  if (!canal) return false;

  const resultado = await canal.send({
    type: "broadcast",
    event: "rolagem_dados",
    payload: rolagem,
  });

  return resultado === "ok";
}

export async function publicarInicioRolagemMesaRealtime(mesaId, configuracao) {
  if (!supabaseOrbe || !mesaId || mesaId === "local" || !configuracao?.id) {
    return false;
  }

  const canal = canaisMesaRealtime.get(String(mesaId));
  if (!canal) return false;

  const resultado = await canal.send({
    type: "broadcast",
    event: "inicio_rolagem_dados",
    payload: configuracao,
  });

  return resultado === "ok";
}

export async function publicarTokensMesaRealtime(mesaId, tokens = []) {
  if (!supabaseOrbe || !mesaId || mesaId === "local") {
    return false;
  }

  const canal = canaisMesaRealtime.get(String(mesaId));
  if (!canal) return false;

  const resultado = await canal.send({
    type: "broadcast",
    event: "tokens_mapa",
    payload: {
      tokens: Array.isArray(tokens) ? tokens : [],
      atualizadoEm: new Date().toISOString(),
    },
  });

  return resultado === "ok";
}

export function assinarMesaOrbeRealtime(mesaId, callbacks = {}) {
  if (!supabaseOrbe || !mesaId || mesaId === "local") return () => {};

  let construtorCanal = supabaseOrbe
    .channel(topicoMesaRealtime(mesaId), {
      config: {
        broadcast: { self: false },
      },
    })
    .on("broadcast", { event: "rolagem_dados" }, (evento) => {
      callbacks.aoRolagem?.(evento.payload);
    })
    .on("broadcast", { event: "inicio_rolagem_dados" }, (evento) => {
      callbacks.aoInicioRolagem?.(evento.payload);
    })
    .on("broadcast", { event: "tokens_mapa" }, (evento) => {
      callbacks.aoTokens?.(evento.payload);
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "mesas_orbe", filter: `id=eq.${mesaId}` }, (evento) => {
      callbacks.aoMesa?.(evento.eventType === "DELETE" ? null : normalizarMesaRemota(evento.new));
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "fichas_orbe", filter: `mesa_id=eq.${mesaId}` }, () => {
      callbacks.aoFichasAlteradas?.();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "fichas_orbe", filter: `mesa_solicitada_id=eq.${mesaId}` }, () => {
      callbacks.aoSolicitacoesFichasAlteradas?.();
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
  canaisMesaRealtime.set(String(mesaId), canal);

  return () => {
    if (canaisMesaRealtime.get(String(mesaId)) === canal) {
      canaisMesaRealtime.delete(String(mesaId));
    }
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
  return normalizarMesaRemota(data);
}

export async function criarMesaRemota(mesa) {
  const cliente = exigirCliente();
  const {
    data: { session },
    error: erroSessao,
  } = await cliente.auth.getSession();
  const {
    data: { user },
    error: erroUsuario,
  } = await cliente.auth.getUser();

  const possuiSessao = !erroSessao && Boolean(session?.access_token);
  const userId = user?.id || null;

  if (!possuiSessao || erroUsuario || !userId) {
    throw new Error("Sua sessão expirou. Entre novamente para criar a mesa.");
  }

  const dadosPermitidosDaMesa = {
    id: mesa.id,
    nome: mesa.nomeCampanha || mesa.nome || "Campanha",
    codigo_convite: mesa.codigoConvite || `ORBE-${String(mesa.id).slice(-6).toUpperCase()}`,
    sistema: "arquivos",
    dados: mesa,
    updated_at: new Date().toISOString(),
  };
  const payload = {
    ...dadosPermitidosDaMesa,
    owner_id: user.id,
  };

  const { data, error } = await cliente
    .from("mesas_orbe")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return normalizarMesaRemota(data);
}

export async function entrarMesaRemota(codigoConvite) {
  const cliente = exigirCliente();
  const codigoNormalizado = String(codigoConvite || "").trim().toUpperCase();
  const { data, error } = await cliente.rpc("entrar_mesa_por_codigo", {
    codigo_informado: codigoNormalizado,
  });
  if (error) throw error;
  const registro = Array.isArray(data) ? data[0] : data;
  if (!registro?.id) throw new Error("A mesa foi localizada, mas o servidor não retornou seus dados.");
  return normalizarMesaRemota(registro);
}

export function mensagemErroConviteOrbe(falha) {
  const codigoErro = String(falha?.code || "").toUpperCase();
  const detalhe = String(falha?.message || "").toLowerCase();

  if (detalhe.includes("banido")) {
    return "Você foi banido desta mesa e não pode reenviar a solicitação.";
  }
  if (codigoErro === "P0002" || detalhe.includes("não encontrado") || detalhe.includes("nao encontrado")) {
    return "Código de convite não encontrado.";
  }
  if (codigoErro === "28000" || detalhe.includes("faça login") || detalhe.includes("jwt")) {
    return "Sua sessão expirou. Entre novamente antes de usar o convite.";
  }
  if (codigoErro === "42501" || detalhe.includes("permission") || detalhe.includes("permissão")) {
    return "Sua conta não tem permissão para entrar nesta mesa.";
  }
  if (codigoErro === "42883" || detalhe.includes("entrar_mesa_por_codigo")) {
    return "A atualização do convite online ainda não foi aplicada no Supabase.";
  }
  return falha?.message || "Não foi possível entrar na mesa online.";
}

export async function salvarFichaRemota(
  mesaId,
  ficha,
  { responsavelId, usarUsuarioAutenticadoComoResponsavel = false } = {},
) {
  const cliente = exigirCliente();
  const {
    data: { session },
    error: erroSessao,
  } = await cliente.auth.getSession();
  const {
    data: { user },
    error: erroUsuario,
  } = await cliente.auth.getUser();

  if (erroSessao || !session?.user || erroUsuario || !user) {
    throw new Error("Sua sessão expirou. Entre novamente para salvar a ficha.");
  }

  const responsavelFinal = usarUsuarioAutenticadoComoResponsavel
    ? user.id
    : responsavelId ?? ficha.jogadorId ?? null;
  const dadosPermitidos = {
    nome: ficha.nome || "Agente",
    dados: {
      ...ficha,
      jogadorId: responsavelFinal || "",
    },
  };
  const payload = {
    ...dadosPermitidos,
    id: String(ficha.id),
    mesa_id: String(mesaId),
    owner_id: responsavelFinal || user.id,
    responsavel_id: responsavelFinal || null,
    edit_locked: Boolean(ficha.editLocked),
  };

  let { data, error } = await cliente
    .from("fichas_orbe")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  const colunaOwnerAusente =
    error &&
    /owner_id/i.test(String(error.message || "")) &&
    /(column|coluna|schema cache|does not exist|not found)/i.test(
      String(error.message || ""),
    );

  if (colunaOwnerAusente) {
    const { owner_id: _ownerId, ...payloadLegado } = payload;
    const resultadoLegado = await cliente
      .from("fichas_orbe")
      .upsert(payloadLegado, { onConflict: "id" })
      .select()
      .single();
    data = resultadoLegado.data;
    error = resultadoLegado.error;
  }

  if (error) throw error;
  return normalizarFichaRemota(data);
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
  return {
    ...(data?.dados || {}),
    atualizadoEm: data?.updated_at || data?.dados?.atualizadoEm,
  };
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

export async function sincronizarSessaoPublicaAgora(mesaId, sessao) {
  clearTimeout(sincronizacoesPendentes.get(mesaId));
  sincronizacoesPendentes.delete(mesaId);
  return salvarSessaoPublicaRemota(mesaId, sessao);
}
