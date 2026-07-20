import { createClient } from "@supabase/supabase-js";

const url = String(import.meta.env.VITE_SUPABASE_URL || "").trim();
const chave = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();
const habilitado = import.meta.env.VITE_ORBE_ONLINE_ENABLED === "true" && Boolean(url && chave);

export const supabaseOrbe = habilitado
  ? createClient(url, chave, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export function orbeOnlineHabilitado() {
  return Boolean(supabaseOrbe);
}

function exigirCliente() {
  if (!supabaseOrbe) throw new Error("O modo online ainda não foi ativado neste ambiente.");
  return supabaseOrbe;
}

export async function criarContaRemota({ nome, usuario, email, senha }) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.auth.signUp({
    email: String(email || "").trim(),
    password: String(senha || ""),
    options: { data: { nome: String(nome || "").trim(), usuario: String(usuario || "").trim() } },
  });
  if (error) throw error;
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

export async function entrarContaRemota(email, senha) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.auth.signInWithPassword({
    email: String(email || "").trim(),
    password: String(senha || ""),
  });
  if (error) throw error;
  const { data: perfil, error: erroPerfil } = await cliente.from("perfis_orbe").select("*").eq("id", data.user.id).single();
  if (erroPerfil) throw erroPerfil;
  return { ...perfil, id: data.user.id, email: data.user.email };
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
  return data || [];
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
