import { gerarSalas } from "./gerarSalas.js";

const NOMES_HOSPITAL = [
  "Hospital Santa Helena",
  "Hospital Municipal Aurora",
  "Instituto Médico Vale Sereno",
  "Clínica São Gabriel",
  "Unidade Hospitalar 07",
  "Hospital Regional Abandonado",
];

function indiceDeterministico(seed, limite) {
  let valor = 0;
  for (const letra of String(seed || "")) valor = ((valor * 31) + letra.charCodeAt(0)) >>> 0;
  return valor % Math.max(1, limite);
}

function criarNomeInicial(seed, tema) {
  if (tema === "hospital-abandonado") {
    return NOMES_HOSPITAL[indiceDeterministico(seed, NOMES_HOSPITAL.length)];
  }
  return `Mapa ${String(tema || "investigação").replaceAll("-", " ")}`;
}

export function criarMapaBase({
  seed,
  sistema,
  tema,
  largura,
  altura,
  configuracoes,
}) {
  const resultadoSalas = gerarSalas({
    seed,
    larguraMapa: largura,
    alturaMapa: altura,
    quantidadeSalas: configuracoes.quantidadeSalas,
    complexidade: configuracoes.complexidade,
  });

  return {
    mapa: {
      id: `mapa-${indiceDeterministico(`${seed}:${tema}:${largura}x${altura}`, 0x7fffffff).toString(36)}`,
      nome: criarNomeInicial(seed, tema),
      versaoFormato: 1,
      seed,
      sistema,
      tema,
      largura,
      altura,
      configuracoes: {
        complexidade: configuracoes.complexidade,
        quantidadeSalas: configuracoes.quantidadeSalas,
        larguraCorredores: configuracoes.larguraCorredores,
        salasSecretas: configuracoes.salasSecretas || 0,
        decoracao: configuracoes.decoracao || "media",
        iluminacao: configuracoes.iluminacao || "baixa",
        desgaste: configuracoes.desgaste || "medio",
        sujeira: configuracoes.sujeira || "media",
        presencaParanormal: configuracoes.presencaParanormal || "discreta",
      },
      salas: resultadoSalas.salas,
      conexoes: [],
      corredores: [],
      celulasCorredores: [],
      resumoConexoes: {
        minimas: 0,
        extras: 0,
        total: 0,
      },
      validacao: null,
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
      objetos: [],
      luzes: [],
      resumoObjetos: null,
      resumoIluminacao: null,
      validacaoTematica: null,
      validacaoEstrutural: null,
      correcoesAutomaticas: [],
    },
    resultadoSalas,
  };
}
