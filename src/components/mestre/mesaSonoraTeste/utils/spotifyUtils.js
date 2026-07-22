const TIPOS_SPOTIFY = new Set(["track", "album", "playlist", "episode"]);

export function extrairRecursoSpotify(valor = "") {
  try {
    const url = new URL(valor.trim());
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "open.spotify.com") return null;
    const [tipo, id] = url.pathname.split("/").filter(Boolean);
    if (!TIPOS_SPOTIFY.has(tipo) || !/^[a-zA-Z0-9]+$/.test(id || "")) return null;
    return { tipo, id };
  } catch {
    return null;
  }
}

export function validarUrlSpotify(valor) {
  return Boolean(extrairRecursoSpotify(valor));
}

export function criarUrlEmbedSpotify(valor) {
  const recurso = extrairRecursoSpotify(valor);
  return recurso ? `https://open.spotify.com/embed/${recurso.tipo}/${recurso.id}?utm_source=generator` : "";
}
