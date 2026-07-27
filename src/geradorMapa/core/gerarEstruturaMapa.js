import { criarConexoesEntreSalas } from "./criarConexoesSalas.js";
import { criarMapaBase } from "./criarMapaBase.js";
import { gerarCorredores } from "./gerarCorredores.js";
import { adicionarNavegacaoAoMapa } from "./gerarNavegacaoMapa.js";
import { gerarParedes } from "./gerarParedes.js";
import { gerarPortas } from "./gerarPortas.js";
import { validarMapaEstrutural } from "./validarMapaEstrutural.js";
import { corrigirMapaEstrutural } from "./corrigirMapaEstrutural.js";
import { validarConectividadeMapa } from "./validarConectividadeMapa.js";

export function adicionarCorredoresAoMapa({
  mapa,
  larguraCorredores,
  complexidade,
  seed,
}) {
  const resultadoConexoes = criarConexoesEntreSalas({
    salas: mapa.salas,
    complexidade,
    seed,
  });
  const resultadoCorredores = gerarCorredores({
    conexoes: resultadoConexoes.conexoes,
    salas: mapa.salas,
    seed,
    largura: larguraCorredores,
    larguraMapa: mapa.largura,
    alturaMapa: mapa.altura,
  });
  const mapaComCorredores = {
    ...mapa,
    configuracoes: {
      ...mapa.configuracoes,
      complexidade,
      larguraCorredores,
    },
    conexoes: resultadoConexoes.conexoes,
    corredores: resultadoCorredores.corredores,
    celulasCorredores: resultadoCorredores.celulasCorredores,
    resumoConexoes: {
      minimas: resultadoConexoes.conexoesMinimas,
      extras: resultadoConexoes.conexoesExtras,
      total: resultadoConexoes.conexoes.length,
    },
    celulasChao: [],
    salaInicialId: null,
    salaFinalId: null,
    entrada: null,
    saida: null,
    navegacao: null,
    paredes: [],
    portas: [],
    salasSecretasIds: [],
    resumoPortas: null,
    avisosPortas: [],
    validacaoEstrutural: null,
    correcoesAutomaticas: [],
  };
  const validacao = validarConectividadeMapa(mapaComCorredores);

  return {
    ...mapaComCorredores,
    validacao,
    validacaoConectividade: validacao,
  };
}

export function adicionarParedesAoMapa(mapa) {
  return gerarParedes(mapa);
}

export function adicionarPortasAoMapa({ mapa, seed, configuracoes }) {
  return gerarPortas({
    mapa,
    seed,
    complexidade: configuracoes.complexidade,
    quantidadeSalasSecretas: Number(configuracoes.salasSecretas) || 0,
  });
}

export function validarEFinalizarMapa(mapa, corrigirAutomaticamente = true) {
  const validacaoInicial = validarMapaEstrutural(mapa);
  const validado = {
    ...mapa,
    validacao: validacaoInicial,
    validacaoEstrutural: validacaoInicial,
    correcoesAutomaticas: [],
  };

  if (
    corrigirAutomaticamente
    && !validacaoInicial.valido
    && validacaoInicial.corrigiveis.length > 0
  ) {
    return corrigirMapaEstrutural(validado).mapa;
  }

  return validado;
}

export function criarMapaEstrutural(parametros) {
  const { mapa, resultadoSalas } = criarMapaBase(parametros);
  const mapaComCorredores = adicionarCorredoresAoMapa({
    mapa,
    larguraCorredores: parametros.configuracoes.larguraCorredores,
    complexidade: parametros.configuracoes.complexidade,
    seed: parametros.seed,
  });
  const mapaComNavegacao = adicionarNavegacaoAoMapa(mapaComCorredores);
  const mapaComParedes = adicionarParedesAoMapa(mapaComNavegacao);
  const mapaComPortas = adicionarPortasAoMapa({
    mapa: mapaComParedes,
    seed: parametros.seed,
    configuracoes: parametros.configuracoes,
  });
  const mapaCompleto = validarEFinalizarMapa(mapaComPortas);

  return { mapa: mapaCompleto, resultadoSalas };
}
