export function obterCentroSala(sala) {
  return {
    x: sala.x + sala.largura / 2,
    y: sala.y + sala.altura / 2,
  };
}

export function obterBordasSala(sala) {
  return {
    esquerda: sala.x,
    direita: sala.x + sala.largura,
    topo: sala.y,
    base: sala.y + sala.altura,
  };
}
