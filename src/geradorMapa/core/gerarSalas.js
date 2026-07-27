import { criarGeradorAleatorio, sortearInteiro } from "../utils/geradorAleatorioSeed.js";
import { obterCentroSala } from "../utils/coordenadasSala.js";
import { salaEstaDentroDoMapa, salasColidem } from "./verificarColisaoSalas.js";

const PERFIS_COMPLEXIDADE = {
  baixa: { larguraMinima: 5, larguraMaxima: 8, alturaMinima: 4, alturaMaxima: 7 },
  media: { larguraMinima: 3, larguraMaxima: 8, alturaMinima: 3, alturaMaxima: 7 },
  alta: { larguraMinima: 3, larguraMaxima: 6, alturaMinima: 3, alturaMaxima: 5 },
};

function obterLimitesSalas(larguraMapa, alturaMapa, complexidade) {
  const perfil = PERFIS_COMPLEXIDADE[complexidade] || PERFIS_COMPLEXIDADE.media;

  return {
    larguraMinima: Math.min(perfil.larguraMinima, larguraMapa),
    larguraMaxima: Math.max(1, Math.min(perfil.larguraMaxima, larguraMapa)),
    alturaMinima: Math.min(perfil.alturaMinima, alturaMapa),
    alturaMaxima: Math.max(1, Math.min(perfil.alturaMaxima, alturaMapa)),
  };
}

export function gerarSalas({
  seed,
  larguraMapa,
  alturaMapa,
  quantidadeSalas,
  complexidade,
  margem = 1,
}) {
  const aleatorio = criarGeradorAleatorio(seed);
  const limites = obterLimitesSalas(larguraMapa, alturaMapa, complexidade);
  const limiteTentativas = quantidadeSalas * 100;
  const salas = [];
  let tentativas = 0;

  while (salas.length < quantidadeSalas && tentativas < limiteTentativas) {
    tentativas += 1;
    const largura = sortearInteiro(aleatorio, limites.larguraMinima, limites.larguraMaxima);
    const altura = sortearInteiro(aleatorio, limites.alturaMinima, limites.alturaMaxima);
    const x = sortearInteiro(aleatorio, 0, larguraMapa - largura);
    const y = sortearInteiro(aleatorio, 0, alturaMapa - altura);
    const centro = obterCentroSala({ x, y, largura, altura });
    const candidata = {
      id: `sala-${salas.length + 1}`,
      x,
      y,
      largura,
      altura,
      tipo: "comum",
      centroX: centro.x,
      centroY: centro.y,
    };

    const colide = salas.some((sala) => salasColidem(candidata, sala, margem));
    if (!colide && salaEstaDentroDoMapa(candidata, larguraMapa, alturaMapa)) {
      salas.push(candidata);
    }
  }

  return {
    salas,
    solicitadas: quantidadeSalas,
    tentativas,
    limiteTentativas,
    margem,
    completa: salas.length === quantidadeSalas,
  };
}
