import {
  orbeOnlineHabilitado,
  supabaseOrbe,
} from "./supabaseOrbe.js";

function exigirSocialOnline() {
  if (!orbeOnlineHabilitado() || !supabaseOrbe) {
    throw new Error("Os recursos sociais estão disponíveis somente no modo online.");
  }
  return supabaseOrbe;
}

async function obterUsuarioId(cliente) {
  const {
    data: { user },
    error,
  } = await cliente.auth.getUser();
  if (error || !user?.id) {
    throw new Error("Sua sessão expirou. Entre novamente para usar o social do ORBE.");
  }
  return user.id;
}

function normalizarMensagem(registro = {}) {
  return {
    id: registro.id,
    autorId: registro.autor_id,
    amizadeId: registro.amizade_id || "",
    conteudo: registro.conteudo || "",
    criadoEm: registro.created_at,
    autor: registro.autor || null,
  };
}

function normalizarAmizade(registro = {}, usuarioId = "") {
  const souSolicitante = registro.solicitante_id === usuarioId;
  return {
    id: registro.id,
    solicitanteId: registro.solicitante_id,
    destinatarioId: registro.destinatario_id,
    status: registro.status,
    criadoEm: registro.created_at,
    recebida: registro.destinatario_id === usuarioId,
    perfil: souSolicitante ? registro.destinatario : registro.solicitante,
  };
}

export async function buscarPessoasOrbe(termo) {
  const cliente = exigirSocialOnline();
  const pesquisa = String(termo || "").trim();
  if (pesquisa.length < 2) return [];
  const { data, error } = await cliente.rpc("buscar_perfis_orbe", {
    termo: pesquisa,
  });
  if (error) throw error;
  return data || [];
}

export async function solicitarAmizadeOrbe(usuarioDestinoId) {
  const cliente = exigirSocialOnline();
  const { data, error } = await cliente.rpc("solicitar_amizade_orbe", {
    usuario_destino: String(usuarioDestinoId),
  });
  if (error) throw error;
  return data;
}

export async function responderAmizadeOrbe(amizadeId, aceitar) {
  const cliente = exigirSocialOnline();
  const { error } = await cliente.rpc("responder_amizade_orbe", {
    amizade_informada: String(amizadeId),
    aceitar: Boolean(aceitar),
  });
  if (error) throw error;
}

export async function listarAmizadesOrbe() {
  const cliente = exigirSocialOnline();
  const usuarioId = await obterUsuarioId(cliente);
  const { data, error } = await cliente
    .from("amizades_orbe")
    .select(`
      id,
      solicitante_id,
      destinatario_id,
      status,
      created_at,
      solicitante:perfis_orbe!amizades_orbe_solicitante_id_fkey(id,nome,usuario),
      destinatario:perfis_orbe!amizades_orbe_destinatario_id_fkey(id,nome,usuario)
    `)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((item) => normalizarAmizade(item, usuarioId));
}

export async function listarMensagensGeraisOrbe() {
  const cliente = exigirSocialOnline();
  const { data, error } = await cliente
    .from("mensagens_gerais_orbe")
    .select(`
      id,
      autor_id,
      conteudo,
      created_at,
      autor:perfis_orbe!mensagens_gerais_orbe_autor_id_fkey(id,nome,usuario)
    `)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data || []).reverse().map(normalizarMensagem);
}

export async function enviarMensagemGeralOrbe(conteudo) {
  const cliente = exigirSocialOnline();
  const usuarioId = await obterUsuarioId(cliente);
  const texto = String(conteudo || "").trim();
  if (!texto) throw new Error("Escreva uma mensagem.");
  const { data, error } = await cliente
    .from("mensagens_gerais_orbe")
    .insert({ autor_id: usuarioId, conteudo: texto.slice(0, 500) })
    .select(`
      id,
      autor_id,
      conteudo,
      created_at,
      autor:perfis_orbe!mensagens_gerais_orbe_autor_id_fkey(id,nome,usuario)
    `)
    .single();
  if (error) throw error;
  return normalizarMensagem(data);
}

export async function listarMensagensPrivadasOrbe(amizadeId) {
  const cliente = exigirSocialOnline();
  const { data, error } = await cliente
    .from("mensagens_privadas_orbe")
    .select(`
      id,
      amizade_id,
      autor_id,
      conteudo,
      created_at,
      autor:perfis_orbe!mensagens_privadas_orbe_autor_id_fkey(id,nome,usuario)
    `)
    .eq("amizade_id", String(amizadeId))
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data || []).reverse().map(normalizarMensagem);
}

export async function enviarMensagemPrivadaOrbe(amizadeId, conteudo) {
  const cliente = exigirSocialOnline();
  const usuarioId = await obterUsuarioId(cliente);
  const texto = String(conteudo || "").trim();
  if (!texto) throw new Error("Escreva uma mensagem.");
  const { data, error } = await cliente
    .from("mensagens_privadas_orbe")
    .insert({
      amizade_id: String(amizadeId),
      autor_id: usuarioId,
      conteudo: texto.slice(0, 1000),
    })
    .select(`
      id,
      amizade_id,
      autor_id,
      conteudo,
      created_at,
      autor:perfis_orbe!mensagens_privadas_orbe_autor_id_fkey(id,nome,usuario)
    `)
    .single();
  if (error) throw error;
  return normalizarMensagem(data);
}

export function assinarSocialOrbe(callbacks = {}) {
  if (!orbeOnlineHabilitado() || !supabaseOrbe) return () => {};
  const sufixo =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
  const canal = supabaseOrbe
    .channel(`orbe-social:${sufixo}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "amizades_orbe" },
      () => callbacks.aoAmizades?.(),
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "mensagens_gerais_orbe" },
      () => callbacks.aoMensagensGerais?.(),
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "mensagens_privadas_orbe" },
      () => callbacks.aoMensagensPrivadas?.(),
    )
    .subscribe((_status, erro) => {
      if (erro) callbacks.aoErro?.(erro);
    });

  return () => {
    void supabaseOrbe.removeChannel(canal);
  };
}
