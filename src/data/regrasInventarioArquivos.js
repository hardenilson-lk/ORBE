const CATEGORIAS_VALIDAS = [
  "0",
  "I",
  "II",
  "III",
  "IV",
];

const CATEGORIAS_POR_NUMERO = {
  0: "0",
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
};

const LIMITES_POR_PATENTE = {
  Recruta: {
    I: 2,
    II: 0,
    III: 0,
    IV: 0,
  },

  Operador: {
    I: 3,
    II: 1,
    III: 0,
    IV: 0,
  },

  "Agente Especial": {
    I: 3,
    II: 2,
    III: 1,
    IV: 0,
  },

  "Oficial de Operações": {
    I: 3,
    II: 3,
    III: 2,
    IV: 1,
  },

  "Agente de Elite": {
    I: 3,
    II: 3,
    III: 3,
    IV: 2,
  },
};

export const CATEGORIAS_ITENS_ARQUIVOS = [
  ...CATEGORIAS_VALIDAS,
];

export const PATENTES_INVENTARIO_ARQUIVOS =
  Object.keys(
    LIMITES_POR_PATENTE,
  );

function criarListaSegura(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
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

function numeroInteiroPositivo(
  valor,
) {
  return Math.max(
    0,
    Math.floor(
      numeroSeguro(valor),
    ),
  );
}

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[_-]+/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .toLowerCase()
    .trim();
}

function extrairNumero(
  valor,
) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return null;
  }

  if (
    typeof valor === "number" ||
    typeof valor === "string"
  ) {
    const numero = Number(valor);

    return Number.isFinite(numero)
      ? numero
      : null;
  }

  if (
    typeof valor === "object"
  ) {
    const possibilidades = [
      valor.valor,
      valor.atual,
      valor.total,
      valor.base,
      valor.pontos,
      valor.nivel,
    ];

    for (
      const possibilidade
      of possibilidades
    ) {
      const numero =
        Number(possibilidade);

      if (
        Number.isFinite(numero)
      ) {
        return numero;
      }
    }
  }

  return null;
}

function obterNumeroCategoria(
  valor,
) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  if (
    typeof valor === "number"
  ) {
    return Number.isFinite(valor)
      ? Math.floor(valor)
      : null;
  }

  const texto =
    normalizarTexto(valor)
      .replace(
        /^categoria\s+/,
        "",
      )
      .trim();

  const mapa = {
    "0": 0,
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
  };

  return Object.prototype
    .hasOwnProperty.call(
      mapa,
      texto,
    )
    ? mapa[texto]
    : null;
}

function contarModificacoesItem(
  item = {},
) {
  if (
    item.categoriaIncluiModificacoes ===
    true
  ) {
    return 0;
  }

  return criarListaSegura(
    item.modificacoes,
  ).filter(Boolean).length;
}

export function normalizarCategoriaItem(
  valor,
) {
  const numero =
    obterNumeroCategoria(
      valor,
    );

  return (
    CATEGORIAS_POR_NUMERO[
      numero
    ] || ""
  );
}

export function obterCategoriaNumericaItem(
  item = {},
) {
  const categoriaEfetiva =
    obterNumeroCategoria(
      item.categoriaEfetiva ??
        item.categoriaFinal,
    );

  if (
    categoriaEfetiva !== null
  ) {
    return categoriaEfetiva;
  }

  const categoriaBase =
    obterNumeroCategoria(
      item.categoriaNumerica ??
        item.categoriaOficial ??
        item.categoria,
    );

  if (
    categoriaBase === null
  ) {
    return null;
  }

  return (
    categoriaBase +
    contarModificacoesItem(
      item,
    )
  );
}

export function obterCategoriaItem(
  item = {},
) {
  const numero =
    obterCategoriaNumericaItem(
      item,
    );

  return (
    CATEGORIAS_POR_NUMERO[
      numero
    ] || ""
  );
}

export function formatarCategoriaItem(
  categoria,
) {
  const categoriaNormalizada =
    normalizarCategoriaItem(
      categoria,
    );

  if (!categoriaNormalizada) {
    return "Sem categoria";
  }

  return `Categoria ${categoriaNormalizada}`;
}

export function normalizarPatente(
  valor,
) {
  const texto =
    normalizarTexto(valor);

  const patentes = {
    recruta: "Recruta",

    operador: "Operador",

    "agente especial":
      "Agente Especial",

    "oficial de operacoes":
      "Oficial de Operações",

    "agente de elite":
      "Agente de Elite",
  };

  return patentes[texto] || "";
}

function obterPontosPrestigioFicha(
  ficha = {},
) {
  const possibilidades = [
    ficha.pontosPrestigio,
    ficha.pontosDePrestigio,
    ficha.prestigio,
    ficha.pp,

    ficha.progressao
      ?.pontosPrestigio,

    ficha.progressao
      ?.prestigio,

    ficha.dados
      ?.pontosPrestigio,

    ficha.payload
      ?.pontosPrestigio,

    ficha.personagem
      ?.pontosPrestigio,
  ];

  for (
    const possibilidade
    of possibilidades
  ) {
    const numero =
      extrairNumero(
        possibilidade,
      );

    if (numero !== null) {
      return Math.max(
        0,
        numero,
      );
    }
  }

  return null;
}

function obterPatentePorPrestigio(
  pontos,
) {
  if (pontos >= 200) {
    return "Agente de Elite";
  }

  if (pontos >= 100) {
    return "Oficial de Operações";
  }

  if (pontos >= 50) {
    return "Agente Especial";
  }

  if (pontos >= 20) {
    return "Operador";
  }

  return "Recruta";
}

export function obterPatenteFicha(
  ficha = {},
) {
  const possibilidades = [
    ficha.patente,
    ficha.patenteAtual,
    ficha.patenteId,

    ficha.progressao
      ?.patente,

    ficha.dados
      ?.patente,

    ficha.payload
      ?.patente,

    ficha.personagem
      ?.patente,
  ];

  for (
    const possibilidade
    of possibilidades
  ) {
    const patente =
      normalizarPatente(
        possibilidade,
      );

    if (patente) {
      return patente;
    }
  }

  const pontosPrestigio =
    obterPontosPrestigioFicha(
      ficha,
    );

  if (
    pontosPrestigio !== null
  ) {
    return obterPatentePorPrestigio(
      pontosPrestigio,
    );
  }

  return "Recruta";
}

export function obterForcaFicha(
  ficha = {},
) {
  const possibilidades = [
    ficha.forca,
    ficha.atributoForca,

    ficha.atributos?.forca,
    ficha.atributos?.for,
    ficha.atributos?.FOR,

    ficha.atributos
      ?.fisicos
      ?.forca,

    ficha.atributosFisicos
      ?.forca,

    ficha.dados
      ?.atributos
      ?.forca,

    ficha.dados
      ?.atributos
      ?.fisicos
      ?.forca,

    ficha.payload
      ?.atributos
      ?.forca,

    ficha.payload
      ?.atributos
      ?.fisicos
      ?.forca,

    ficha.personagem
      ?.atributos
      ?.forca,

    ficha.personagem
      ?.atributos
      ?.fisicos
      ?.forca,
  ];

  for (
    const possibilidade
    of possibilidades
  ) {
    const numero =
      extrairNumero(
        possibilidade,
      );

    if (numero !== null) {
      return numeroInteiroPositivo(
        numero,
      );
    }
  }

  return 0;
}

export function calcularCargaBase(
  forca,
) {
  const forcaSegura =
    numeroInteiroPositivo(
      forca,
    );

  if (forcaSegura === 0) {
    return 2;
  }

  return forcaSegura * 5;
}

export function obterLimitesCategoria(
  patente,
) {
  const patenteNormalizada =
    normalizarPatente(
      patente,
    ) || "Recruta";

  const limites =
    LIMITES_POR_PATENTE[
      patenteNormalizada
    ] ||
    LIMITES_POR_PATENTE.Recruta;

  return {
    "0": Infinity,
    I: limites.I,
    II: limites.II,
    III: limites.III,
    IV: limites.IV,
  };
}

export function calcularEspacosItem(
  item = {},
) {
  const quantidade =
    numeroInteiroPositivo(
      item.quantidade ?? 1,
    );

  const espacosPorUnidade =
    Math.max(
      0,
      numeroSeguro(
        item.volume ??
          item.espacos,
      ),
    );

  return (
    quantidade *
    espacosPorUnidade
  );
}

export function calcularEspacosUsados(
  itens = [],
) {
  return criarListaSegura(
    itens,
  ).reduce(
    (
      total,
      item,
    ) =>
      total +
      calcularEspacosItem(
        item,
      ),
    0,
  );
}

export function calcularBonusCarga(
  itens = [],
) {
  return criarListaSegura(
    itens,
  ).reduce(
    (
      total,
      item,
    ) => {
      if (
        item?.ativo === false
      ) {
        return total;
      }

      const quantidade =
        numeroInteiroPositivo(
          item?.quantidade ?? 1,
        );

      const bonusPorUnidade =
        Math.max(
          0,
          numeroSeguro(
            item?.bonusCarga,
          ),
        );

      return (
        total +
        bonusPorUnidade *
          quantidade
      );
    },
    0,
  );
}

function criarContagemCategorias() {
  return {
    "0": 0,
    I: 0,
    II: 0,
    III: 0,
    IV: 0,
  };
}

export function contarItensPorCategoria(
  itens = [],
) {
  const contagem =
    criarContagemCategorias();

  const itensSemCategoria = [];

  const itensAcimaCategoriaIV =
    [];

  criarListaSegura(
    itens,
  ).forEach(
    (item) => {
      const quantidade =
        numeroInteiroPositivo(
          item?.quantidade ?? 1,
        );

      if (quantidade <= 0) {
        return;
      }

      const categoriaNumerica =
        obterCategoriaNumericaItem(
          item,
        );

      if (
        categoriaNumerica === null
      ) {
        itensSemCategoria.push({
          id:
            item?.id || "",

          nome:
            item?.nome ||
            "Item sem nome",

          quantidade,
        });

        return;
      }

      if (
        categoriaNumerica > 4
      ) {
        itensAcimaCategoriaIV.push({
          id:
            item?.id || "",

          nome:
            item?.nome ||
            "Item sem nome",

          quantidade,

          categoriaNumerica,
        });

        return;
      }

      const categoria =
        CATEGORIAS_POR_NUMERO[
          categoriaNumerica
        ];

      if (!categoria) {
        itensSemCategoria.push({
          id:
            item?.id || "",

          nome:
            item?.nome ||
            "Item sem nome",

          quantidade,
        });

        return;
      }

      contagem[categoria] +=
        quantidade;
    },
  );

  const totalSemCategoria =
    itensSemCategoria.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.quantidade,
      0,
    );

  const totalAcimaCategoriaIV =
    itensAcimaCategoriaIV.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.quantidade,
      0,
    );

  return {
    contagem,

    itensSemCategoria,
    totalSemCategoria,

    itensAcimaCategoriaIV,
    totalAcimaCategoriaIV,
  };
}

export function calcularResumoInventario({
  ficha = {},
  itens = [],
} = {}) {
  const lista =
    criarListaSegura(
      itens,
    );

  const forca =
    obterForcaFicha(
      ficha,
    );

  const patente =
    obterPatenteFicha(
      ficha,
    );

  const cargaBase =
    calcularCargaBase(
      forca,
    );

  const bonusCarga =
    calcularBonusCarga(
      lista,
    );

  const limiteCarga =
    cargaBase +
    bonusCarga;

  const limiteAbsoluto =
    limiteCarga * 2;

  const espacosUsados =
    calcularEspacosUsados(
      lista,
    );

  const {
    contagem,
    itensSemCategoria,
    totalSemCategoria,
    itensAcimaCategoriaIV,
    totalAcimaCategoriaIV,
  } =
    contarItensPorCategoria(
      lista,
    );

  const limitesCategorias =
    obterLimitesCategoria(
      patente,
    );

  const categoriasExcedidas =
    [
      "I",
      "II",
      "III",
      "IV",
    ]
      .filter(
        (categoria) =>
          contagem[categoria] >
          limitesCategorias[
            categoria
          ],
      )
      .map(
        (categoria) => ({
          categoria,

          quantidade:
            contagem[categoria],

          limite:
            limitesCategorias[
              categoria
            ],
        }),
      );

  let situacaoCarga =
    "normal";

  if (
    espacosUsados >
    limiteAbsoluto
  ) {
    situacaoCarga =
      "limite-excedido";
  } else if (
    espacosUsados >
    limiteCarga
  ) {
    situacaoCarga =
      "sobrecarregado";
  }

  return {
    forca,
    patente,

    cargaBase,
    bonusCarga,

    espacosUsados,
    limiteCarga,
    limiteAbsoluto,

    situacaoCarga,

    sobrecarregado:
      situacaoCarga ===
      "sobrecarregado",

    cargaExcedida:
      situacaoCarga ===
      "limite-excedido",

    penalidadeDefesa:
      situacaoCarga ===
      "normal"
        ? 0
        : -5,

    penalidadePericias:
      situacaoCarga ===
      "normal"
        ? 0
        : -5,

    penalidadeMovimento:
      situacaoCarga ===
      "normal"
        ? 0
        : -3,

    contagemCategorias:
      contagem,

    limitesCategorias,
    categoriasExcedidas,

    itensSemCategoria,
    totalSemCategoria,

    itensAcimaCategoriaIV,
    totalAcimaCategoriaIV,
  };
}

export function validarAlteracaoInventario({
  ficha = {},
  itensAtuais = [],
  itensPropostos = [],
} = {}) {
  const resumoAtual =
    calcularResumoInventario({
      ficha,
      itens:
        itensAtuais,
    });

  const resumoProposto =
    calcularResumoInventario({
      ficha,
      itens:
        itensPropostos,
    });

  const motivos = [];

  const aumentouCarga =
    resumoProposto
      .espacosUsados >
    resumoAtual
      .espacosUsados;

  if (
    aumentouCarga &&
    resumoProposto
      .espacosUsados >
      resumoProposto
        .limiteAbsoluto
  ) {
    motivos.push(
      `A carga máxima absoluta é de ${resumoProposto.limiteAbsoluto} espaços. Este inventário chegaria a ${resumoProposto.espacosUsados} espaços.`,
    );
  }

  [
    "I",
    "II",
    "III",
    "IV",
  ].forEach(
    (categoria) => {
      const quantidadeAtual =
        resumoAtual
          .contagemCategorias[
            categoria
          ];

      const quantidadeProposta =
        resumoProposto
          .contagemCategorias[
            categoria
          ];

      const limite =
        resumoProposto
          .limitesCategorias[
            categoria
          ];

      const aumentouCategoria =
        quantidadeProposta >
        quantidadeAtual;

      if (
        aumentouCategoria &&
        quantidadeProposta >
          limite
      ) {
        motivos.push(
          `A patente ${resumoProposto.patente} permite até ${limite} item(ns) de categoria ${categoria}.`,
        );
      }
    },
  );

  if (
    resumoProposto
      .totalSemCategoria >
    resumoAtual
      .totalSemCategoria
  ) {
    motivos.push(
      "Todo item precisa ter uma categoria oficial: 0, I, II, III ou IV.",
    );
  }

  if (
    resumoProposto
      .totalAcimaCategoriaIV >
    resumoAtual
      .totalAcimaCategoriaIV
  ) {
    motivos.push(
      "A categoria final do item não pode ultrapassar a categoria IV.",
    );
  }

  return {
    permitido:
      motivos.length === 0,

    motivos,

    mensagem:
      motivos[0] || "",

    resumoAtual,
    resumoProposto,
  };
}

export function obterTextoSituacaoCarga(
  situacao,
) {
  if (
    situacao ===
    "limite-excedido"
  ) {
    return "Limite máximo excedido";
  }

  if (
    situacao ===
    "sobrecarregado"
  ) {
    return "Sobrecarregado";
  }

  return "Carga normal";
}