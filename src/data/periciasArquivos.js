export const PERICIAS_FISICAS_ARQUIVOS = [
  {
    id: "acrobacia",
    nome: "Acrobacia",
    atributo: "AGI",
    grupo: "fisicas",
  },
  {
    id: "atletismo",
    nome: "Atletismo",
    atributo: "FOR",
    grupo: "fisicas",
  },
  {
    id: "crime",
    nome: "Crime",
    atributo: "AGI",
    grupo: "fisicas",
  },
  {
    id: "fortitude",
    nome: "Fortitude",
    atributo: "VIG",
    grupo: "fisicas",
  },
  {
    id: "furtividade",
    nome: "Furtividade",
    atributo: "AGI",
    grupo: "fisicas",
  },
  {
    id: "iniciativa",
    nome: "Iniciativa",
    atributo: "AGI",
    grupo: "fisicas",
  },
  {
    id: "luta",
    nome: "Luta",
    atributo: "FOR",
    grupo: "fisicas",
  },
  {
    id: "pontaria",
    nome: "Pontaria",
    atributo: "AGI",
    grupo: "fisicas",
  },
  {
    id: "reflexos",
    nome: "Reflexos",
    atributo: "AGI",
    grupo: "fisicas",
  },
];

export const PERICIAS_MENTAIS_ARQUIVOS = [
  {
    id: "atualidades",
    nome: "Atualidades",
    atributo: "INT",
    grupo: "mentais",
  },
  {
    id: "ciencias",
    nome: "Ciências",
    atributo: "INT",
    grupo: "mentais",
  },
  {
    id: "investigacao",
    nome: "Investigação",
    atributo: "INT",
    grupo: "mentais",
  },
  {
    id: "medicina",
    nome: "Medicina",
    atributo: "INT",
    grupo: "mentais",
  },
  {
    id: "ocultismo",
    nome: "Ocultismo",
    atributo: "INT",
    grupo: "mentais",
  },
  {
    id: "tecnologia",
    nome: "Tecnologia",
    atributo: "INT",
    grupo: "mentais",
  },
];

export const PERICIAS_SOCIAIS_ARQUIVOS = [
  {
    id: "adestramento",
    nome: "Adestramento",
    atributo: "PRE",
    grupo: "sociais",
  },
  {
    id: "artes",
    nome: "Artes",
    atributo: "PRE",
    grupo: "sociais",
  },
  {
    id: "diplomacia",
    nome: "Diplomacia",
    atributo: "PRE",
    grupo: "sociais",
  },
  {
    id: "enganacao",
    nome: "Enganação",
    atributo: "PRE",
    grupo: "sociais",
  },
  {
    id: "intimidacao",
    nome: "Intimidação",
    atributo: "PRE",
    grupo: "sociais",
  },
  {
    id: "intuicao",
    nome: "Intuição",
    atributo: "PRE",
    grupo: "sociais",
  },
  {
    id: "percepcao",
    nome: "Percepção",
    atributo: "PRE",
    grupo: "sociais",
  },
  {
    id: "vontade",
    nome: "Vontade",
    atributo: "PRE",
    grupo: "sociais",
  },
];

export const GRUPOS_PERICIAS_ARQUIVOS = [
  {
    id: "fisicas",
    nome: "Físicas",
    pericias:
      PERICIAS_FISICAS_ARQUIVOS,
  },
  {
    id: "mentais",
    nome: "Mentais",
    pericias:
      PERICIAS_MENTAIS_ARQUIVOS,
  },
  {
    id: "sociais",
    nome: "Sociais",
    pericias:
      PERICIAS_SOCIAIS_ARQUIVOS,
  },
];

export const TODAS_PERICIAS_ARQUIVOS = [
  ...PERICIAS_FISICAS_ARQUIVOS,
  ...PERICIAS_MENTAIS_ARQUIVOS,
  ...PERICIAS_SOCIAIS_ARQUIVOS,
];

export function criarValoresPericiasArquivos(
  valoresIniciais = {},
) {
  return TODAS_PERICIAS_ARQUIVOS.reduce(
    (resultado, pericia) => {
      const valorAnterior =
        valoresIniciais[
          pericia.id
        ] || {};

      const treino =
        Number(
          valorAnterior.treino,
        ) || 0;

      const outros =
        Number(
          valorAnterior.outros,
        ) || 0;

      resultado[pericia.id] = {
        treino,
        outros,
        total:
          treino + outros,
      };

      return resultado;
    },
    {},
  );
}

const periciasArquivos = {
  grupos:
    GRUPOS_PERICIAS_ARQUIVOS,
  todas:
    TODAS_PERICIAS_ARQUIVOS,
  criarValores:
    criarValoresPericiasArquivos,
};

export default periciasArquivos;