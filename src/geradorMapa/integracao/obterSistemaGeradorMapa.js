const SISTEMAS_ARQUIVOS = new Set([
  "arquivo",
  "arquivos",
  "ordem",
  "ordem-paranormal",
  "ordem paranormal",
]);

export function obterSistemaGeradorMapa(valorSistema) {
  const valorOriginal = String(valorSistema || "arquivos").trim();
  const identificador = valorOriginal.toLowerCase();

  if (SISTEMAS_ARQUIVOS.has(identificador)) {
    return {
      original: valorOriginal,
      id: "arquivos",
      nome: "Arquivos",
      disponivel: true,
    };
  }

  return {
    original: valorOriginal,
    id: identificador || "arquivos",
    nome: valorOriginal || "Arquivos",
    disponivel: false,
  };
}
