function escapar(valor) {
  return String(valor).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function svgMapa(mapa) {
  const largura = Math.max(1, Number(mapa?.largura) || 1);
  const altura = Math.max(1, Number(mapa?.altura) || 1);
  const salas = (mapa?.salas || []).map((sala) => `<rect x="${sala.x}" y="${sala.y}" width="${sala.largura}" height="${sala.altura}" rx="2" fill="#50545b" stroke="#1b1d21" stroke-width="0.35"/>`).join("");
  const corredores = (mapa?.corredores || []).map((corredor) => `<path d="M ${corredor.inicio?.x || 0} ${corredor.inicio?.y || 0} L ${corredor.fim?.x || 0} ${corredor.fim?.y || 0}" stroke="#676b72" stroke-width="${Math.max(1, Number(corredor.largura) || 1)}"/>`).join("");
  const paredes = (mapa?.paredes || []).map((parede) => `<path d="M ${parede.inicio?.x || 0} ${parede.inicio?.y || 0} L ${parede.fim?.x || 0} ${parede.fim?.y || 0}" stroke="#111318" stroke-width="0.55"/>`).join("");
  const portas = (mapa?.portas || []).map((porta) => `<path d="M ${porta.inicio?.x || 0} ${porta.inicio?.y || 0} L ${porta.fim?.x || 0} ${porta.fim?.y || 0}" stroke="#b33b35" stroke-width="0.7"/>`).join("");
  const objetos = (mapa?.objetos || []).map((objeto) => `<rect x="${objeto.x}" y="${objeto.y}" width="${objeto.largura}" height="${objeto.altura}" fill="#2b2e34" opacity="0.86"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 ${escapar(largura)} ${escapar(altura)}"><rect width="100%" height="100%" fill="#17191d"/>${salas}${corredores}${paredes}${portas}${objetos}</svg>`;
}

export async function prepararImagemBaseMapa(mapa) {
  const svg = svgMapa(mapa);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const imagem = new Image();
    imagem.src = url;
    await new Promise((resolve, reject) => { imagem.onload = resolve; imagem.onerror = reject; });
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const contexto = canvas.getContext("2d");
    contexto.drawImage(imagem, 0, 0, 512, 512);
    return await new Promise((resolve) => canvas.toBlob((resultado) => resolve(resultado), "image/png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}
