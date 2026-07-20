export const LIVEKIT_URL = String(import.meta.env.VITE_LIVEKIT_URL || "").trim();
export const TOKEN_URL = String(import.meta.env.VITE_COMMUNICATION_TOKEN_URL || "http://localhost:3001/api/livekit-token").trim();
export const TOPICO_COMUNICACAO = "orbe-comunicacao-v1";
export const LIMITE_MENSAGEM = 500;

function limparIdentificador(valor, fallback) {
  const seguro = String(valor || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 96);
  return seguro || fallback;
}

export function criarNomeSala(mesaId) {
  return `orbe-mesa-${limparIdentificador(mesaId, "local")}`.slice(0, 120);
}

export function criarIdentidadeParticipante(identidadeInformada) {
  const chave = "orbe:comunicacao:sessao";
  let sessao = sessionStorage.getItem(chave);
  if (!sessao) {
    sessao = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    sessionStorage.setItem(chave, sessao);
  }
  const usuario = limparIdentificador(identidadeInformada, "participante");
  return limparIdentificador(`${usuario}-${sessao}`, "participante");
}

export function validarConfiguracaoComunicacao() {
  if (!LIVEKIT_URL) return "A URL pública do LiveKit não foi configurada.";
  if (!/^wss?:\/\//i.test(LIVEKIT_URL)) return "A URL do LiveKit precisa começar com wss:// ou ws://.";
  if (!TOKEN_URL) return "O endereço do servidor de token não foi configurado.";
  return "";
}
