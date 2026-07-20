export function podeControlarTokenMapa({ token, papelAtual = "mestre", jogadorAtualId = "" }) {
  if (!token) return false;
  if (papelAtual === "mestre") return true;
  if (!jogadorAtualId || token.bloqueado || token.permissoes?.jogadores !== true) return false;

  const identificador = String(jogadorAtualId);
  const controladores = Array.isArray(token.permissoes?.controladores)
    ? token.permissoes.controladores.map(String)
    : [];

  return (
    String(token.proprietario || "") === identificador ||
    String(token.fichaId || "") === identificador ||
    controladores.includes(identificador)
  );
}
