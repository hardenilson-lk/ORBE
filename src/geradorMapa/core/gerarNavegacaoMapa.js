import { consolidarCelulasChao } from "./consolidarCelulasChao.js";
import {
  escolherSalaFinal,
  escolherSalaInicial,
  listarPontosBordaSala,
} from "./selecionarEntradaSaida.js";
import { validarCaminhoEntradaSaida } from "./validarCaminhoEntradaSaida.js";

const LIMITE_CANDIDATOS_POR_PONTO = 8;

function criarPontoEspecial(ponto, salaId, tipo) {
  return {
    x: ponto.x,
    y: ponto.y,
    salaId,
    lado: ponto.lado,
    tipo,
  };
}

export function adicionarNavegacaoAoMapa(mapa) {
  if (mapa.salas.length < 2) {
    throw new Error("A estrutura precisa possuir pelo menos duas salas.");
  }

  const celulasChao = mapa.celulasChao?.length
    ? mapa.celulasChao
    : consolidarCelulasChao(mapa.salas, mapa.corredores);
  const salaInicial = escolherSalaInicial(mapa.salas, mapa.largura, mapa.altura);
  const resultadoFinal = escolherSalaFinal(salaInicial, mapa.salas, mapa.conexoes);

  if (!salaInicial || !resultadoFinal.salaFinal) {
    throw new Error("Não foi possível identificar salas inicial e final distintas.");
  }

  const candidatosEntrada = listarPontosBordaSala({
    sala: salaInicial,
    larguraMapa: mapa.largura,
    alturaMapa: mapa.altura,
    celulasCorredores: mapa.celulasCorredores,
  }).slice(0, LIMITE_CANDIDATOS_POR_PONTO);
  let resultadoValido = null;

  for (const candidatoEntrada of candidatosEntrada) {
    const entrada = criarPontoEspecial(candidatoEntrada, salaInicial.id, "entrada");
    const candidatosSaida = listarPontosBordaSala({
      sala: resultadoFinal.salaFinal,
      larguraMapa: mapa.largura,
      alturaMapa: mapa.altura,
      celulasCorredores: mapa.celulasCorredores,
      pontoReferencia: entrada,
    }).slice(0, LIMITE_CANDIDATOS_POR_PONTO);

    for (const candidatoSaida of candidatosSaida) {
      const saida = criarPontoEspecial(candidatoSaida, resultadoFinal.salaFinal.id, "saida");
      if (entrada.x === saida.x && entrada.y === saida.y) continue;
      const caminho = validarCaminhoEntradaSaida(celulasChao, entrada, saida);
      if (caminho.valido) {
        resultadoValido = { entrada, saida, caminho };
        break;
      }
    }

    if (resultadoValido) break;
  }

  if (!resultadoValido) {
    throw new Error("Não foi possível criar um caminho válido entre a entrada e a saída.");
  }

  return {
    ...mapa,
    celulasChao,
    salaInicialId: salaInicial.id,
    salaFinalId: resultadoFinal.salaFinal.id,
    entrada: resultadoValido.entrada,
    saida: resultadoValido.saida,
    navegacao: {
      conectado: resultadoValido.caminho.valido,
      distanciaEntradaSaida: resultadoValido.caminho.distanciaEmCelulas,
      celulasVisitadas: resultadoValido.caminho.celulasVisitadas,
      distanciaConexoes: resultadoFinal.distanciaConexoes,
      minimoConexoesIdeal: resultadoFinal.minimoIdeal,
      distanciaCurta: resultadoFinal.distanciaCurta,
      avisoDistancia: resultadoFinal.distanciaCurta
        ? "A sala final ficou próxima da entrada devido ao tamanho da estrutura."
        : "",
    },
    paredes: [],
    portas: [],
    salasSecretasIds: [],
    resumoPortas: null,
    avisosPortas: [],
    validacaoEstrutural: null,
    correcoesAutomaticas: [],
  };
}
