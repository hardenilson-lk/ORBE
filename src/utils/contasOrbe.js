import {
  criarContaRemota,
  entrarContaRemota,
  orbeOnlineHabilitado,
  processarRetornoAutenticacaoRemota,
  reenviarConfirmacaoRemota,
  sairContaRemota,
} from "../services/supabaseOrbe.js";

const CHAVE_CONTAS = "orbe:portal:contas";
const CHAVE_SESSAO = "orbe:portal:sessao";

function lerJson(chave, fallback) {
  try {
    const valor = window.localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : fallback;
  } catch {
    return fallback;
  }
}

function normalizarIdentificador(valor) {
  return String(valor || "").trim().toLocaleLowerCase("pt-BR");
}

function gerarId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `usuario-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function listarContasOrbe() {
  const contas = lerJson(CHAVE_CONTAS, []);
  return Array.isArray(contas) ? contas : [];
}

export function lerUsuarioAtual() {
  const sessao = lerJson(CHAVE_SESSAO, null);
  if (!sessao?.id) return null;
  return listarContasOrbe().find((conta) => conta.id === sessao.id) || null;
}

export function limparSessaoLocalOrbe() {
  window.localStorage.removeItem(CHAVE_SESSAO);
}

function limparAutenticacaoOnlineLocalOrbe() {
  limparSessaoLocalOrbe();
  const contasLocais = listarContasOrbe().filter((conta) => !conta.remoto);
  window.localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contasLocais));
}

export function criarContaOrbe({ nome, usuario, senha }) {
  const nomeFinal = String(nome || usuario || "").trim();
  const usuarioFinal = String(usuario || "").trim();
  const senhaFinal = String(senha || "");
  if (!nomeFinal || !usuarioFinal || senhaFinal.length < 4) {
    throw new Error("Informe nome, usuário e uma senha com pelo menos 4 caracteres.");
  }

  const contas = listarContasOrbe();
  const identificador = normalizarIdentificador(usuarioFinal);
  if (contas.some((conta) => normalizarIdentificador(conta.usuario) === identificador)) {
    throw new Error("Este usuário já está cadastrado.");
  }

  const novaConta = {
    id: gerarId(),
    nome: nomeFinal,
    usuario: usuarioFinal,
    senha: senhaFinal,
    criadoEm: new Date().toISOString(),
  };
  window.localStorage.setItem(CHAVE_CONTAS, JSON.stringify([...contas, novaConta]));
  window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ id: novaConta.id }));
  return novaConta;
}

export function entrarContaOrbe(usuario, senha) {
  const identificador = normalizarIdentificador(usuario);
  const conta = listarContasOrbe().find((item) =>
    normalizarIdentificador(item.usuario) === identificador && item.senha === String(senha || ""),
  );
  if (!conta) throw new Error("Usuário ou senha incorretos.");
  window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ id: conta.id }));
  return conta;
}

export async function sairContaOrbe() {
  const online = orbeOnlineHabilitado();
  try {
    if (online) await sairContaRemota();
  } finally {
    if (online) limparAutenticacaoOnlineLocalOrbe();
    else limparSessaoLocalOrbe();
  }
}

function armazenarEspelhoConta(conta) {
  const contas = listarContasOrbe();
  const espelho = {
    id: conta.id,
    nome: conta.nome || conta.user_metadata?.nome || conta.email || "Jogador",
    usuario: conta.usuario || conta.user_metadata?.usuario || conta.email || "jogador",
    email: conta.email || "",
    senha: "",
    remoto: true,
    criadoEm: conta.created_at || new Date().toISOString(),
  };
  const atualizadas = [...contas.filter((item) => item.id !== espelho.id), espelho];
  window.localStorage.setItem(CHAVE_CONTAS, JSON.stringify(atualizadas));
  window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ id: espelho.id }));
  return espelho;
}

export async function criarContaOrbeConectada(dados) {
  if (!orbeOnlineHabilitado()) return criarContaOrbe(dados);
  if (!String(dados.email || "").includes("@")) throw new Error("Informe um e-mail válido para criar a conta online.");
  const conta = await criarContaRemota(dados);
  if (conta?.confirmacaoPendente) return conta;
  return armazenarEspelhoConta({ ...conta, nome: dados.nome, usuario: dados.usuario });
}

export async function entrarContaOrbeConectada(identificador, senha) {
  if (!orbeOnlineHabilitado()) return entrarContaOrbe(identificador, senha);
  if (!String(identificador || "").includes("@")) throw new Error("No modo online, entre usando o e-mail da conta.");
  return armazenarEspelhoConta(await entrarContaRemota(identificador, senha));
}

export async function reenviarConfirmacaoOrbe(email) {
  if (!orbeOnlineHabilitado()) throw new Error("O reenvio de confirmação está disponível apenas no modo online.");
  return reenviarConfirmacaoRemota(email);
}

export async function processarRetornoAutenticacaoOrbe() {
  if (!orbeOnlineHabilitado()) return null;
  const conta = await processarRetornoAutenticacaoRemota();
  return conta ? armazenarEspelhoConta(conta) : null;
}

export function nomeCurtoUsuario(usuario = lerUsuarioAtual()) {
  return String(usuario?.nome || usuario?.usuario || "Investigador").trim();
}
