const PREFIXO_RASCUNHO = "orbe:rascunho:v1";

function criarChaveRascunho({ usuarioId, mesaId, escopo }) {
  return [
    PREFIXO_RASCUNHO,
    encodeURIComponent(String(usuarioId || "anonimo")),
    encodeURIComponent(String(mesaId || "local")),
    encodeURIComponent(String(escopo || "geral")),
  ].join(":");
}

export function lerRascunhoOrbe(chave) {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const conteudo = window.localStorage.getItem(chave);
    if (!conteudo) return null;
    const rascunho = JSON.parse(conteudo);
    return rascunho?.valor === undefined ? null : rascunho;
  } catch {
    return null;
  }
}

export function salvarRascunhoOrbe(chave, valor) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(
      chave,
      JSON.stringify({ versao: 1, salvoEm: new Date().toISOString(), valor }),
    );
  } catch {
    // O salvamento remoto continua sendo a fonte principal.
  }
}

export function removerRascunhoOrbe(chave) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.removeItem(chave);
  } catch {
    // A limpeza local nao deve interromper o salvamento confirmado.
  }
}

export { criarChaveRascunho };
