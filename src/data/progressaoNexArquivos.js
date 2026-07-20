export const PROGRESSAO_NEX_ARQUIVOS = [
  {
    nex: 5,
    ganhos: [
      "Início da ficha: origem, classe e trilha escolhidas.",
      "Recursos base da classe entram na ficha.",
      "Conjuradores liberam rituais de 1º círculo.",
    ],
  },
  {
    nex: 10,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Habilidade inicial de trilha, quando aplicável pela mesa.",
      "O catálogo passa a considerar o NEX 10%.",
    ],
  },
  {
    nex: 15,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Escolha 1 poder da sua classe, se a classe permitir.",
      "O catálogo de poderes filtra por classe e NEX.",
    ],
  },
  {
    nex: 20,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Aumento de atributo: +1 ponto em um atributo permitido.",
      "PE por rodada aumenta em +1.",
    ],
  },
  {
    nex: 25,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Conjuradores liberam rituais de 2º círculo.",
      "Novas opções de classe podem aparecer no catálogo.",
    ],
  },
  {
    nex: 30,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Novo poder ou melhoria de classe conforme a classe e o catálogo.",
      "Revise ataques, perícias e itens ativos.",
    ],
  },
  {
    nex: 35,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Grau de treinamento: melhore perícias conforme a regra da mesa.",
      "O recálculo de bônus de perícia fica disponível.",
    ],
  },
  {
    nex: 40,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Habilidade de trilha.",
      "PE por rodada aumenta em +1.",
    ],
  },
  {
    nex: 45,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Novo poder ou melhoria de classe conforme a classe e o catálogo.",
      "Recálculo completo de PV, PE, SAN, defesa e esquiva.",
    ],
  },
  {
    nex: 50,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Versatilidade: escolha um recurso de outra trilha conforme a regra da mesa.",
      "Atualize as habilidades e os talentos da ficha.",
    ],
  },
  {
    nex: 55,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Conjuradores liberam rituais de 3º círculo.",
      "Os rituais disponíveis são filtrados pelo novo limite.",
    ],
  },
  {
    nex: 60,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Novo poder ou melhoria de classe conforme a classe e o catálogo.",
      "PE por rodada aumenta em +1.",
    ],
  },
  {
    nex: 65,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Habilidade superior de trilha.",
      "Atualize ataques, rituais e itens que dependem da trilha.",
    ],
  },
  {
    nex: 70,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Recálculo do limite de sobrevivência da ficha.",
      "Revise proteção, carga e equipamentos ativos.",
    ],
  },
  {
    nex: 75,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Novo poder ou melhoria de classe conforme a classe e o catálogo.",
      "O catálogo libera opções de NEX alto.",
    ],
  },
  {
    nex: 80,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "PE por rodada aumenta em +1.",
      "Marco alto: revise efeitos ativos e consequências narrativas.",
    ],
  },
  {
    nex: 85,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Conjuradores liberam rituais de 4º círculo.",
      "Rituais extremos entram no catálogo se a ficha puder conjurar.",
    ],
  },
  {
    nex: 90,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Novo poder ou melhoria de classe conforme a classe e o catálogo.",
      "Atualize os poderes finais e a preparação de combate.",
    ],
  },
  {
    nex: 95,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Marco final antes do limite.",
      "Revise toda a ficha: perícias, recursos, inventário e rituais.",
    ],
  },
  {
    nex: 99,
    ganhos: [
      "Ganha os pontos de recurso do marco.",
      "Habilidade final de classe ou trilha, quando aplicável.",
      "Ocultistas podem acessar Canalizar o Medo quando aplicável.",
    ],
  },
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

function numeroSeguro(
  valor,
  valorPadrao = 0,
) {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : valorPadrao;
}

function numeroPositivo(
  valor,
  valorPadrao = 0,
) {
  return Math.max(
    0,
    numeroSeguro(
      valor,
      valorPadrao,
    ),
  );
}

export function lerValorNexArquivos(
  valor,
) {
  const encontrado =
    String(valor || "").match(
      /\d+/,
    );

  return numeroPositivo(
    encontrado?.[0],
    5,
  );
}

export function obterBaseProgressaoClasseArquivos(
  classe,
) {
  const classeNormalizada =
    normalizarTexto(classe);

  if (
    classeNormalizada ===
    "combatente"
  ) {
    return {
      pvInicial: 20,
      pvPorEtapa: 4,
      peInicial: 2,
      pePorEtapa: 1,
      sanInicial: 12,
      sanPorEtapa: 3,
    };
  }

  if (
    classeNormalizada ===
    "ocultista"
  ) {
    return {
      pvInicial: 12,
      pvPorEtapa: 2,
      peInicial: 3,
      pePorEtapa: 1,
      sanInicial: 20,
      sanPorEtapa: 5,
    };
  }

  return {
    pvInicial: 16,
    pvPorEtapa: 3,
    peInicial: 2,
    pePorEtapa: 1,
    sanInicial: 16,
    sanPorEtapa: 4,
  };
}

export function calcularRecursosNoNexArquivos(
  ficha = {},
  valorNex = ficha.nex,
) {
  const baseClasse =
    obterBaseProgressaoClasseArquivos(
      ficha.classe,
    );

  const nex =
    lerValorNexArquivos(
      valorNex,
    );

  const etapasNex =
    Math.max(
      0,
      Math.floor(nex / 5) - 1,
    );

  const vigor =
    numeroPositivo(
      ficha.vigor,
      1,
    );

  const presenca =
    numeroPositivo(
      ficha.presenca,
      1,
    );

  const pvMaximo =
    Math.max(
      1,
      baseClasse.pvInicial +
        vigor +
        etapasNex *
          (
            baseClasse.pvPorEtapa +
            vigor
          ),
    );

  const peMaximo =
    Math.max(
      1,
      baseClasse.peInicial +
        presenca +
        etapasNex *
          baseClasse.pePorEtapa,
    );

  const sanMaximo =
    Math.max(
      1,
      baseClasse.sanInicial +
        etapasNex *
          baseClasse.sanPorEtapa,
    );

  const peRodada =
    Math.max(
      1,
      1 +
        Math.floor(
          nex / 20,
        ),
    );

  return {
    nex,
    pvMaximo,
    peMaximo,
    sanMaximo,
    peRodada,
  };
}

export function obterFormulaProgressaoClasseArquivos(
  ficha = {},
) {
  const baseClasse =
    obterBaseProgressaoClasseArquivos(
      ficha.classe,
    );

  return (
    `Por marco de +5% após 5%: ` +
    `+${baseClasse.pvPorEtapa} + VIG em PV máximo, ` +
    `+${baseClasse.pePorEtapa} PE máximo e ` +
    `+${baseClasse.sanPorEtapa} SAN máximo. ` +
    `Base em 5%: PV ${baseClasse.pvInicial} + VIG, ` +
    `PE ${baseClasse.peInicial} + PRE e ` +
    `SAN ${baseClasse.sanInicial}.`
  );
}

export function obterMarcoAtualNexArquivos(
  fichaOuNex,
) {
  const valorNex =
    fichaOuNex &&
    typeof fichaOuNex ===
      "object"
      ? fichaOuNex.nex
      : fichaOuNex;

  const nexAtual =
    lerValorNexArquivos(
      valorNex,
    );

  return (
    PROGRESSAO_NEX_ARQUIVOS.find(
      (marco) =>
        marco.nex === nexAtual,
    ) ||
    [
      ...PROGRESSAO_NEX_ARQUIVOS,
    ]
      .reverse()
      .find(
        (marco) =>
          marco.nex <= nexAtual,
      ) ||
    PROGRESSAO_NEX_ARQUIVOS[0]
  );
}

export function obterProximoMarcoNexArquivos(
  fichaOuMarco,
) {
  const marcoAtual =
    fichaOuMarco &&
    typeof fichaOuMarco ===
      "object" &&
    Array.isArray(
      fichaOuMarco.ganhos,
    )
      ? fichaOuMarco
      : obterMarcoAtualNexArquivos(
          fichaOuMarco,
        );

  return (
    PROGRESSAO_NEX_ARQUIVOS.find(
      (marco) =>
        marco.nex >
        marcoAtual.nex,
    ) || null
  );
}

export function obterMarcoAnteriorNexArquivos(
  marcoOuNex,
) {
  const valorNex =
    marcoOuNex &&
    typeof marcoOuNex ===
      "object"
      ? marcoOuNex.nex
      : marcoOuNex;

  const nex =
    lerValorNexArquivos(
      valorNex,
    );

  const indice =
    PROGRESSAO_NEX_ARQUIVOS.findIndex(
      (marco) =>
        marco.nex === nex,
    );

  if (indice <= 0) {
    return null;
  }

  return (
    PROGRESSAO_NEX_ARQUIVOS[
      indice - 1
    ] || null
  );
}

export function obterLinhaRecursosMarcoArquivos(
  ficha = {},
  marcoOuNex,
) {
  const marco =
    marcoOuNex &&
    typeof marcoOuNex ===
      "object"
      ? marcoOuNex
      : obterMarcoAtualNexArquivos(
          marcoOuNex,
        );

  const recursosAtuais =
    calcularRecursosNoNexArquivos(
      ficha,
      marco.nex,
    );

  const marcoAnterior =
    obterMarcoAnteriorNexArquivos(
      marco,
    );

  if (!marcoAnterior) {
    return (
      `Totais em ${marco.nex}%: ` +
      `PV ${recursosAtuais.pvMaximo}, ` +
      `PE ${recursosAtuais.peMaximo}, ` +
      `SAN ${recursosAtuais.sanMaximo} e ` +
      `PE por rodada ${recursosAtuais.peRodada}.`
    );
  }

  const recursosAnteriores =
    calcularRecursosNoNexArquivos(
      ficha,
      marcoAnterior.nex,
    );

  const ganhoPv =
    recursosAtuais.pvMaximo -
    recursosAnteriores.pvMaximo;

  const ganhoPe =
    recursosAtuais.peMaximo -
    recursosAnteriores.peMaximo;

  const ganhoSan =
    recursosAtuais.sanMaximo -
    recursosAnteriores.sanMaximo;

  const ganhoPeRodada =
    recursosAtuais.peRodada -
    recursosAnteriores.peRodada;

  const textoPeRodada =
    ganhoPeRodada > 0
      ? `, +${ganhoPeRodada} PE por rodada`
      : "";

  return (
    `Ganha neste marco: ` +
    `+${ganhoPv} PV máximo, ` +
    `+${ganhoPe} PE máximo, ` +
    `+${ganhoSan} SAN máximo` +
    `${textoPeRodada}. ` +
    `Totais: PV ${recursosAtuais.pvMaximo}, ` +
    `PE ${recursosAtuais.peMaximo}, ` +
    `SAN ${recursosAtuais.sanMaximo} e ` +
    `PE por rodada ${recursosAtuais.peRodada}.`
  );
}

export function obterGanhosVisiveisMarcoArquivos(
  marco,
) {
  const ganhos =
    Array.isArray(
      marco?.ganhos,
    )
      ? marco.ganhos
      : [];

  return ganhos.filter(
    (ganho) =>
      !/origem|classe|trilha|habilidade|poder|ritual|catálogo|catalogo|conjurador/i.test(
        ganho,
      ),
  );
}

const progressaoNexArquivos = {
  marcos:
    PROGRESSAO_NEX_ARQUIVOS,

  lerNex:
    lerValorNexArquivos,

  baseClasse:
    obterBaseProgressaoClasseArquivos,

  calcularRecursos:
    calcularRecursosNoNexArquivos,

  formulaClasse:
    obterFormulaProgressaoClasseArquivos,

  marcoAtual:
    obterMarcoAtualNexArquivos,

  proximoMarco:
    obterProximoMarcoNexArquivos,

  marcoAnterior:
    obterMarcoAnteriorNexArquivos,

  linhaRecursos:
    obterLinhaRecursosMarcoArquivos,

  ganhosVisiveis:
    obterGanhosVisiveisMarcoArquivos,
};

export default progressaoNexArquivos;