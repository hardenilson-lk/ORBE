import { criarMapaBase } from "./criarMapaBase.js";
import {
  adicionarCorredoresAoMapa,
  adicionarParedesAoMapa,
  adicionarPortasAoMapa,
  validarEFinalizarMapa,
} from "./gerarEstruturaMapa.js";
import { adicionarNavegacaoAoMapa } from "./gerarNavegacaoMapa.js";
import {
  distribuirTiposSalaTematicos,
  validarTiposSalaDoMapa,
} from "./gerarTiposSalaTematicos.js";
import { gerarObjetosTematicos } from "./gerarObjetosTematicos.js";
import { gerarIluminacaoTematica } from "./gerarIluminacaoTematica.js";
import { corrigirMapaTematico, validarMapaTematico } from "./validarMapaTematico.js";
import { clonarMapaSeguro } from "../persistencia/formatoMapaGerador.js";

function copiar(mapa) {
  return mapa ? clonarMapaSeguro(mapa) : null;
}

function resposta(etapa, mapaAtualizado, resumo = {}, avisos = []) {
  return { sucesso: true, etapa, mapaAtualizado, avisos, erros: [], resumo };
}

function falha(etapa, erro, mapaAnterior = null, codigo = "ERRO_ETAPA") {
  return {
    sucesso: false,
    etapa,
    mapaAtualizado: mapaAnterior,
    avisos: [],
    erros: [erro instanceof Error ? erro.message : String(erro)],
    detalhesErros: [{
      codigo,
      mensagem: erro instanceof Error ? erro.message : String(erro),
    }],
    resumo: {},
  };
}

export function executarEtapaGerador(etapa, { mapa, parametros }) {
  try {
    if (etapa === "salas") {
      const { mapa: criado, resultadoSalas } = criarMapaBase(parametros);
      if (!criado.salas.length) return falha(etapa, "Nenhuma sala pôde ser gerada.");
      return resposta(etapa, criado, resultadoSalas, resultadoSalas.completa
        ? []
        : [`Foram geradas ${criado.salas.length} das ${resultadoSalas.solicitadas} salas solicitadas.`]);
    }
    const entrada = copiar(mapa);
    if (!entrada) return falha(etapa, "A etapa anterior ainda não foi gerada.");
    if (etapa === "corredores") {
      if (!entrada.salas?.length) return falha(etapa, "Gere salas válidas antes dos corredores.");
      const atualizado = adicionarCorredoresAoMapa({
        mapa: entrada,
        larguraCorredores: parametros.configuracoes.larguraCorredores,
        complexidade: parametros.configuracoes.complexidade,
        seed: parametros.seed,
      });
      if (!atualizado.validacao.valido) return falha(etapa, "Não foi possível conectar todas as salas.");
      return resposta(etapa, atualizado, atualizado.resumoConexoes);
    }
    if (etapa === "navegacao") {
      if (!entrada.corredores?.length) return falha(etapa, "Gere corredores válidos antes da entrada e saída.");
      const atualizado = adicionarNavegacaoAoMapa(entrada);
      if (!atualizado.navegacao?.conectado) return falha(etapa, "Não existe caminho entre a entrada e a saída.");
      return resposta(etapa, atualizado, atualizado.navegacao);
    }
    if (etapa === "paredes") {
      if (!entrada.entrada || !entrada.saida || !entrada.celulasChao?.length) return falha(etapa, "Defina entrada, saída e chão antes das paredes.");
      const atualizado = adicionarParedesAoMapa(entrada);
      return resposta(etapa, atualizado, { paredes: atualizado.paredes.length });
    }
    if (etapa === "portas") {
      if (!entrada.paredes?.length) return falha(etapa, "Gere as paredes antes das portas.");
      const atualizado = adicionarPortasAoMapa({
        mapa: entrada,
        seed: parametros.seed,
        configuracoes: parametros.configuracoes,
      });
      return resposta(etapa, atualizado, atualizado.resumoPortas, atualizado.avisosPortas);
    }
    if (etapa === "tipos") {
      if (!entrada.salas?.length || !entrada.entrada || !entrada.saida) return falha(etapa, "Gere a geometria e os acessos antes dos tipos de sala.");
      const atualizado = distribuirTiposSalaTematicos(entrada);
      const validacaoTipos = validarTiposSalaDoMapa(atualizado);
      if (!validacaoTipos.valido) {
        const quantidade = validacaoTipos.salasSemTipo.length
          + validacaoTipos.tiposDesconhecidos.length
          + validacaoTipos.nomesAusentes.length;
        return falha(
          etapa,
          `Existem ${quantidade} inconsistências nos tipos temáticos das salas.`,
          entrada,
          "TIPOS_SALA_INVALIDOS",
        );
      }
      const mapaValidado = { ...atualizado, validacaoTiposSala: validacaoTipos };
      return resposta(
        etapa,
        mapaValidado,
        {
          atribuidos: mapaValidado.salas.length,
          fallback: validacaoTipos.usouFallback,
        },
        validacaoTipos.usouFallback
          ? ["Tema ainda sem catálogo especializado. Tipos contemporâneos de fallback foram utilizados."]
          : [],
      );
    }
    if (etapa === "objetos") {
      const validacaoTipos = validarTiposSalaDoMapa(entrada);
      if (!entrada.tiposSalaDistribuidos || !validacaoTipos.valido) {
        return falha(etapa, "Os tipos temáticos das salas estão ausentes ou inválidos.", entrada, "TIPOS_SALA_AUSENTES");
      }
      const atualizado = gerarObjetosTematicos(entrada);
      const avisos = [];
      if (atualizado.resumoObjetos?.fallback) {
        avisos.push("Catálogo contemporâneo de fallback utilizado para objetos e decoração.");
      }
      if (atualizado.resumoObjetos?.ignorados > 0) {
        avisos.push(`${atualizado.resumoObjetos.ignorados} objetos foram ignorados por falta de espaço.`);
      }
      if (atualizado.resumoObjetos?.decoracaoDesativada) {
        avisos.push("Decoração desativada.");
      }
      return resposta(etapa, atualizado, atualizado.resumoObjetos, avisos);
    }
    if (etapa === "iluminacao") {
      if (!entrada.tiposSalaDistribuidos) return falha(etapa, "Distribua os tipos de sala antes da iluminação.");
      const atualizado = gerarIluminacaoTematica(entrada);
      return resposta(etapa, atualizado, atualizado.resumoIluminacao);
    }
    if (etapa === "validacao") {
      if (!entrada.portas?.length) return falha(etapa, "Gere as portas antes da validação.");
      const estrutural = validarEFinalizarMapa(entrada, false);
      let validacaoTematica = validarMapaTematico(estrutural);
      let atualizado = { ...estrutural, validacaoTematica };
      if (!validacaoTematica.valido && validacaoTematica.corrigiveis.length) {
        const corrigido = corrigirMapaTematico(atualizado);
        atualizado = { ...corrigido.mapa, validacaoTematica: corrigido.validacao };
        validacaoTematica = corrigido.validacao;
      }
      if (!atualizado.validacaoEstrutural.valido) {
        return {
          ...falha(etapa, "A validação estrutural encontrou inconsistências."),
          mapaAtualizado: atualizado,
          avisos: atualizado.validacaoEstrutural.avisos,
          erros: atualizado.validacaoEstrutural.erros.map(({ mensagem }) => mensagem),
        };
      }
      if (!validacaoTematica.valido) {
        return {
          ...falha(etapa, "A validação temática encontrou inconsistências."),
          mapaAtualizado: atualizado,
          avisos: validacaoTematica.avisos,
          erros: validacaoTematica.erros.map(({ mensagem }) => mensagem),
        };
      }
      return resposta(etapa, atualizado, {
        estrutural: atualizado.validacaoEstrutural,
        tematica: validacaoTematica,
      }, [...atualizado.validacaoEstrutural.avisos, ...validacaoTematica.avisos]);
    }
    return falha(etapa, `Etapa desconhecida: ${etapa}.`);
  } catch (erro) {
    return falha(etapa, erro);
  }
}
