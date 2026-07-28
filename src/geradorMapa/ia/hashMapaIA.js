function serializar(valor) {
  if (Array.isArray(valor)) return `[${valor.map(serializar).join(",")}]`;
  if (!valor || typeof valor !== "object") return JSON.stringify(valor);
  return `{${Object.keys(valor).sort().map((chave) => `${JSON.stringify(chave)}:${serializar(valor[chave])}`).join(",")}}`;
}

export async function calcularHashEstruturalMapa(mapa) {
  const estrutural = {
    largura: mapa?.largura,
    altura: mapa?.altura,
    salas: mapa?.salas,
    corredores: mapa?.corredores,
    paredes: mapa?.paredes,
    portas: mapa?.portas,
    objetos: mapa?.objetos,
  };
  const texto = serializar(estrutural);
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(texto);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return texto.length.toString(16).padStart(16, "0");
}
