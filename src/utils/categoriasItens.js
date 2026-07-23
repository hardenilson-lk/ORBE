function normalizarCategoria(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function obterCategoriaVisualItem(item = {}) {
  const texto = normalizarCategoria(
    [
      item.tipo,
      item.categoria,
      item.grupo,
      item.tipoDano,
      item.nome,
    ].join(" "),
  );

  if (
    texto.includes("arma de fogo") ||
    texto.includes("disparo") ||
    texto.includes("balistico")
  ) {
    return "fogo";
  }

  if (
    texto.includes("corte") ||
    /faca|katana|machete|lamina|espada/.test(texto)
  ) {
    return "corte";
  }

  if (
    texto.includes("impacto") ||
    /bastao|martelo|marreta/.test(texto)
  ) {
    return "impacto";
  }

  if (
    texto.includes("perfuracao") ||
    /punhal|lanca/.test(texto)
  ) {
    return "perfuracao";
  }

  if (
    texto.includes("protecao") ||
    texto.includes("escudo")
  ) {
    return "protecao";
  }

  if (
    texto.includes("explosivo") ||
    texto.includes("granada")
  ) {
    return "explosivo";
  }

  if (
    texto.includes("medico") ||
    texto.includes("consumivel")
  ) {
    return "consumivel";
  }

  if (
    texto.includes("tecnologia") ||
    texto.includes("ferramenta")
  ) {
    return "ferramenta";
  }

  return "geral";
}

export function obterClasseVisualItem(item = {}) {
  return `item-cor--${obterCategoriaVisualItem(item)}`;
}

export function obterRotuloCategoriaItem(item = {}) {
  return (
    String(item.categoria || "").trim() ||
    String(item.tipo || "").trim() ||
    "Item geral"
  );
}
