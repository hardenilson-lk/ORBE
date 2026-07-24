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
    id: "pilotagem",
    nome: "Pilotagem",
    atributo: "AGI",
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
    id: "profissao",
    nome: "Profissão",
    atributo: "INT",
    grupo: "mentais",
  },
  {
    id: "sobrevivencia",
    nome: "Sobrevivência",
    atributo: "INT",
    grupo: "mentais",
  },
  {
    id: "tatica",
    nome: "Tática",
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
    id: "religiao",
    nome: "Religião",
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

const FONTES_TREINO_VALIDAS = [
  "escolha",
  "origem",
  "classe",
];

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function listaUnica(valor) {
  return Array.from(
    new Set(
      Array.isArray(valor)
        ? valor.filter(Boolean)
        : [],
    ),
  );
}

function normalizarFontesTreino(
  valorAnterior = {},
  treino = 0,
) {
  const fontes = listaUnica(
    valorAnterior.fontesTreino,
  ).filter((fonte) =>
    FONTES_TREINO_VALIDAS.includes(
      fonte,
    ),
  );

  if (
    valorAnterior.treinoOrigem ===
      true &&
    !fontes.includes("origem")
  ) {
    fontes.push("origem");
  }

  if (
    valorAnterior.treinoClasse ===
      true &&
    !fontes.includes("classe")
  ) {
    fontes.push("classe");
  }

  if (
    fontes.length === 0 &&
    treino > 0
  ) {
    fontes.push("escolha");
  }

  return fontes;
}

function obterTreinoMinimoFontes(
  fontes = [],
) {
  return fontes.some(
    (fonte) =>
      fonte === "origem" ||
      fonte === "classe",
  )
    ? 5
    : 0;
}

export function obterPericiaArquivos(
  nomeOuId,
) {
  const procurado =
    normalizarTexto(
      nomeOuId,
    );

  return (
    TODAS_PERICIAS_ARQUIVOS.find(
      (pericia) =>
        normalizarTexto(
          pericia.id,
        ) === procurado ||
        normalizarTexto(
          pericia.nome,
        ) === procurado,
    ) || null
  );
}

export function obterIdPericiaArquivos(
  nomeOuId,
) {
  return (
    obterPericiaArquivos(
      nomeOuId,
    )?.id || ""
  );
}

export function criarValoresPericiasArquivos(
  valoresIniciais = {},
) {
  return TODAS_PERICIAS_ARQUIVOS.reduce(
    (resultado, pericia) => {
      const valorAnterior =
        valoresIniciais[
          pericia.id
        ] || {};

      const treinoInformado =
        Number(
          valorAnterior.treino,
        ) || 0;

      const fontesTreino =
        normalizarFontesTreino(
          valorAnterior,
          treinoInformado,
        );

      const treinoMinimo =
        obterTreinoMinimoFontes(
          fontesTreino,
        );

      const treino = Math.max(
        treinoMinimo,
        treinoInformado,
      );

      const outros =
        Number(
          valorAnterior.outros,
        ) || 0;

      resultado[pericia.id] = {
        treino,
        outros,

        total:
          treino + outros,

        fontesTreino,
        treinoMinimo,
      };

      return resultado;
    },
    {},
  );
}

export function aplicarFonteTreinoPericiasArquivos(
  valoresIniciais = {},
  periciasRecebidas = [],
  fonte = "escolha",
) {
  if (
    !FONTES_TREINO_VALIDAS.includes(
      fonte,
    )
  ) {
    return criarValoresPericiasArquivos(
      valoresIniciais,
    );
  }

  const valores =
    criarValoresPericiasArquivos(
      valoresIniciais,
    );

  periciasRecebidas.forEach(
    (nomeOuId) => {
      const periciaId =
        obterIdPericiaArquivos(
          nomeOuId,
        );

      if (!periciaId) {
        return;
      }

      const valorAtual =
        valores[periciaId];

      const fontesTreino =
        listaUnica([
          ...valorAtual.fontesTreino,
          fonte,
        ]);

      const treinoMinimo =
        obterTreinoMinimoFontes(
          fontesTreino,
        );

      const treino = Math.max(
        valorAtual.treino,
        treinoMinimo,
      );

      valores[periciaId] = {
        ...valorAtual,

        treino,

        total:
          treino +
          valorAtual.outros,

        fontesTreino,
        treinoMinimo,
      };
    },
  );

  return valores;
}

export function removerFonteTreinoPericiasArquivos(
  valoresIniciais = {},
  fonte,
) {
  const valores =
    criarValoresPericiasArquivos(
      valoresIniciais,
    );

  Object.keys(valores).forEach(
    (periciaId) => {
      const valorAtual =
        valores[periciaId];

      const tinhaFonte =
        valorAtual.fontesTreino.includes(
          fonte,
        );

      const fontesTreino =
        valorAtual.fontesTreino.filter(
          (item) =>
            item !== fonte,
        );

      const treinoMinimo =
        obterTreinoMinimoFontes(
          fontesTreino,
        );

      let treino =
        valorAtual.treino;

      if (
        tinhaFonte &&
        fontesTreino.length === 0 &&
        treino <= 5
      ) {
        treino = 0;
      }

      treino = Math.max(
        treino,
        treinoMinimo,
      );

      valores[periciaId] = {
        ...valorAtual,

        treino,

        total:
          treino +
          valorAtual.outros,

        fontesTreino,
        treinoMinimo,
      };
    },
  );

  return valores;
}

export function substituirPericiasOrigemArquivos(
  valoresIniciais = {},
  periciasOrigem = [],
) {
  const semOrigem =
    removerFonteTreinoPericiasArquivos(
      valoresIniciais,
      "origem",
    );

  return aplicarFonteTreinoPericiasArquivos(
    semOrigem,
    periciasOrigem,
    "origem",
  );
}

const periciasArquivos = {
  grupos:
    GRUPOS_PERICIAS_ARQUIVOS,

  todas:
    TODAS_PERICIAS_ARQUIVOS,

  criarValores:
    criarValoresPericiasArquivos,

  obter:
    obterPericiaArquivos,

  obterId:
    obterIdPericiaArquivos,

  aplicarFonte:
    aplicarFonteTreinoPericiasArquivos,

  removerFonte:
    removerFonteTreinoPericiasArquivos,

  substituirOrigem:
    substituirPericiasOrigemArquivos,
};

export default periciasArquivos;