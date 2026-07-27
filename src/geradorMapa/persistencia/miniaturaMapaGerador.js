function escaparSvg(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function retanguloSala(sala) {
  const classe = sala.secreta ? "secreta" : sala.tipoTematico === "corredor-principal" ? "corredor" : "sala";
  return `<rect class="${classe}" x="${sala.x}" y="${sala.y}" width="${sala.largura}" height="${sala.altura}" rx=".18"/>`;
}

function linhaEstrutura(estrutura, classe) {
  return `<line class="${classe}" x1="${estrutura.inicio?.x || 0}" y1="${estrutura.inicio?.y || 0}" x2="${estrutura.fim?.x || 0}" y2="${estrutura.fim?.y || 0}"/>`;
}

export function gerarMiniaturaMapa(mapa) {
  const largura = Math.max(1, Number(mapa?.largura) || 1);
  const altura = Math.max(1, Number(mapa?.altura) || 1);
  const salas = (mapa?.salas || []).map(retanguloSala).join("");
  const corredores = (mapa?.celulasCorredores || [])
    .map((celula) => `<rect class="corredor" x="${celula.x}" y="${celula.y}" width="1" height="1"/>`)
    .join("");
  const paredes = (mapa?.paredes || []).map((item) => linhaEstrutura(item, "parede")).join("");
  const portas = (mapa?.portas || [])
    .filter((item) => !item.secreta || item.revelada)
    .map((item) => linhaEstrutura(item, "porta"))
    .join("");
  const objetos = (mapa?.objetos || [])
    .filter((item) => item.visivelJogador !== false)
    .slice(0, 180)
    .map((item) => `<rect class="objeto" x="${item.x}" y="${item.y}" width="${Math.max(.25, item.largura || 1)}" height="${Math.max(.25, item.altura || 1)}"/>`)
    .join("");
  const luzes = (mapa?.luzes || [])
    .filter((item) => item.ativa !== false)
    .slice(0, 80)
    .map((item) => `<circle class="luz" cx="${Number(item.x || 0) + .5}" cy="${Number(item.y || 0) + .5}" r=".45"/>`)
    .join("");
  const titulo = escaparSvg(mapa?.nome || mapa?.seed || "Mapa ORBE");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="${titulo}">
    <style>.fundo{fill:#27322f}.sala{fill:#b5aa8b}.corredor{fill:#8f876f}.secreta{fill:#70675d}.parede{stroke:#30251c;stroke-width:.34;stroke-linecap:square}.porta{stroke:#b88735;stroke-width:.42}.objeto{fill:#5c4a37}.luz{fill:#f0c76a;opacity:.55}</style>
    <rect class="fundo" width="${largura}" height="${altura}"/>${salas}${corredores}${paredes}${portas}${objetos}${luzes}
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

