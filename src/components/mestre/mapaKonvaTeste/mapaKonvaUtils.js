export const GRID_KONVA_PADRAO = {
  colunas: 32,
  linhas: 17,
  tamanhoCelula: 64,
  cor: "#d8b96f",
  opacidade: 0.46,
  visivel: true,
};

export const CAMERA_KONVA_PADRAO = { x: 0, y: 0, zoom: 1 };

export function limitarNumero(valor, padrao, minimo, maximo) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? Math.min(maximo, Math.max(minimo, numero)) : padrao;
}

export function normalizarGridKonva(gridRecebido = {}) {
  return {
    ...GRID_KONVA_PADRAO,
    ...gridRecebido,
    colunas: Math.round(limitarNumero(gridRecebido.colunas, 32, 1, 200)),
    linhas: Math.round(limitarNumero(gridRecebido.linhas, 17, 1, 200)),
    tamanhoCelula: Math.round(limitarNumero(gridRecebido.tamanhoCelula, 64, 24, 160)),
    cor: String(gridRecebido.cor || GRID_KONVA_PADRAO.cor),
    opacidade: limitarNumero(gridRecebido.opacidade, GRID_KONVA_PADRAO.opacidade, 0, 1),
    visivel: gridRecebido.visivel !== false,
  };
}

export function obterFundoAtivo(mapa = {}) {
  const mapas = Array.isArray(mapa.mapas) ? mapa.mapas : [];
  return mapas.find((item) => String(item.id) === String(mapa.fundoAtivoId)) || mapa.fundo || {};
}

export function atualizarFundoCompatibilidade(mapa = {}, fundoAtualizado) {
  const mapas = Array.isArray(mapa.mapas) ? mapa.mapas : [];
  const idAtivo = String(mapa.fundoAtivoId || fundoAtualizado.id || "mapa-0");
  const fundo = { ...fundoAtualizado, id: fundoAtualizado.id || idAtivo };
  const indice = mapas.findIndex((item) => String(item.id) === String(fundo.id));
  const mapasAtualizados = indice >= 0
    ? mapas.map((item, posicao) => posicao === indice ? { ...item, ...fundo } : item)
    : fundo.imagem ? [...mapas, fundo] : mapas;

  return { ...mapa, fundo, mapas: mapasAtualizados, fundoAtivoId: fundo.id };
}

export function normalizarFundoKonva(mapa = {}, grid) {
  const fundo = obterFundoAtivo(mapa);
  return {
    ...fundo,
    id: String(fundo.id || mapa.fundoAtivoId || "mapa-0"),
    imagem: String(fundo.imagem || ""),
    nome: String(fundo.nome || "Imagem do mapa"),
    x: limitarNumero(fundo.x, 0, -100000, 100000),
    y: limitarNumero(fundo.y, 0, -100000, 100000),
    largura: limitarNumero(fundo.largura, grid.colunas * grid.tamanhoCelula, 40, 50000),
    altura: limitarNumero(fundo.altura, grid.linhas * grid.tamanhoCelula, 40, 50000),
    opacidade: limitarNumero(fundo.opacidade, 1, 0, 1),
    bloqueado: fundo.bloqueado !== false,
  };
}

export function obterIniciais(nome) {
  const partes = String(nome || "Agente").trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  return partes.length === 1
    ? partes[0].slice(0, 2).toUpperCase()
    : `${partes[0][0]}${partes.at(-1)[0]}`.toUpperCase();
}

export function calcularPorcentagem(atual, maximo) {
  const limite = Math.max(1, Number(maximo) || 1);
  return limitarNumero((Number(atual) || 0) / limite, 0, 0, 1);
}

export function encaixarTokenNoGrid(posicao, token, grid) {
  const tamanho = Math.max(1, Math.round(Number(token.tamanho) || 1));
  const coluna = Math.min(
    Math.max(0, grid.colunas - tamanho),
    Math.max(0, Math.round(posicao.x / grid.tamanhoCelula)),
  );
  const linha = Math.min(
    Math.max(0, grid.linhas - tamanho),
    Math.max(0, Math.round(posicao.y / grid.tamanhoCelula)),
  );
  return {
    coluna,
    linha,
    x: coluna * grid.tamanhoCelula,
    y: linha * grid.tamanhoCelula,
  };
}

export function construirTokensKonva(fichas = [], tokensRecebidos = [], grid) {
  const tokens = Array.isArray(tokensRecebidos) ? tokensRecebidos : [];
  return fichas.map((ficha, indice) => {
    const existente = tokens.find((token) => String(token.fichaId) === String(ficha.id));
    const colunaInicial = indice % Math.max(1, Math.min(grid.colunas, 8));
    const linhaInicial = Math.floor(indice / Math.max(1, Math.min(grid.colunas, 8)));
    const token = {
      ...(existente || {}),
      id: existente?.id || `token-${ficha.id}`,
      fichaId: ficha.id,
      nome: existente?.nome || ficha.nome || "Agente",
      foto: existente?.foto || ficha.foto || "",
      tamanho: Math.max(1, Math.round(Number(existente?.tamanho) || 1)),
      coluna: Number.isFinite(Number(existente?.coluna)) ? Number(existente.coluna) : colunaInicial,
      linha: Number.isFinite(Number(existente?.linha)) ? Number(existente.linha) : linhaInicial,
      pvAtual: ficha.pvAtual,
      pvMaximo: ficha.pvMaximo,
      peAtual: ficha.peAtual,
      peMaximo: ficha.peMaximo,
      sanAtual: ficha.sanAtual,
      sanMaximo: ficha.sanMaximo,
    };
    return { ...token, ...encaixarTokenNoGrid({ x: token.coluna * grid.tamanhoCelula, y: token.linha * grid.tamanhoCelula }, token, grid) };
  });
}

export function lerImagemComoDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result || ""));
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    leitor.readAsDataURL(arquivo);
  });
}
