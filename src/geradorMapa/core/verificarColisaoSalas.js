import { obterBordasSala } from "../utils/coordenadasSala.js";

export function salasColidem(salaA, salaB, margem = 1) {
  const a = obterBordasSala(salaA);
  const b = obterBordasSala(salaB);

  return !(
    a.direita + margem <= b.esquerda
    || b.direita + margem <= a.esquerda
    || a.base + margem <= b.topo
    || b.base + margem <= a.topo
  );
}

export function salaEstaDentroDoMapa(sala, larguraMapa, alturaMapa) {
  return (
    sala.x >= 0
    && sala.y >= 0
    && sala.largura > 0
    && sala.altura > 0
    && sala.x + sala.largura <= larguraMapa
    && sala.y + sala.altura <= alturaMapa
  );
}
