const BASE_PUBLICA =
  String(
    import.meta.env.BASE_URL ||
      "/",
  ).replace(
    /\/+$/,
    "",
  );

const CATEGORIAS_PACK = [
  "pisos",
  "paredes",
  "portas",
  "objetos",
  "decoracoes",
  "luzes",
];

function normalizarParteCaminho(
  valor,
) {
  return String(
    valor ||
      "",
  )
    .trim()
    .replace(
      /^\/+|\/+$/g,
      "",
    );
}

function criarCaminhoPublico(
  ...partes
) {
  const caminho =
    partes
      .flat()
      .map(
        normalizarParteCaminho,
      )
      .filter(
        Boolean,
      )
      .join(
        "/",
      );

  return `${BASE_PUBLICA}/${caminho}`;
}

export function normalizarIdAssetMapa(
  valor,
) {
  return String(
    valor ||
      "",
  )
    .normalize(
      "NFD",
    )
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function criarPackVisual({
  id,
  nome,
  ambiente = "interno",
  paleta,
}) {
  const pastaRaiz =
    criarCaminhoPublico(
      "assets",
      "mapas",
      id,
    );

  return {
    id,
    nome,
    ambiente,

    versao: 1,

    pastaRaiz,

    pastas:
      Object.fromEntries(
        CATEGORIAS_PACK.map(
          (categoria) => [
            categoria,
            `${pastaRaiz}/${categoria}`,
          ],
        ),
      ),

    arquivos: {
      pisos: {
        sala:
          "piso-sala.webp",

        corredor:
          "piso-corredor.webp",

        especial:
          "piso-especial.webp",
      },

      paredes: {
        horizontal:
          "parede-horizontal.webp",

        vertical:
          "parede-vertical.webp",

        canto:
          "parede-canto.webp",
      },

      portas: {
        aberta:
          "porta-aberta.webp",

        fechada:
          "porta-fechada.webp",

        trancada:
          "porta-trancada.webp",

        secreta:
          "porta-secreta.webp",
      },
    },

    paleta,

    capacidades: {
      pisos: true,
      paredes: true,
      portas: true,
      objetos: true,
      decoracoes: true,
      luzes: true,
      finalizacaoIa: true,
    },
  };
}

const PACK_GENERICO =
  criarPackVisual({
    id: "generico-arquivos",

    nome:
      "Arquivos contemporâneo",

    paleta: {
      fundo:
        "#252a28",

      pisoSala:
        "#8f8d7f",

      pisoCorredor:
        "#74776f",

      parede:
        "#2d211d",

      detalheParede:
        "#5d4b3e",

      porta:
        "#b5893f",

      portaTrancada:
        "#a53b35",

      luz:
        "#f2d48b",

      sombra:
        "#080a09",
    },
  });

export const PACKS_VISUAIS_MAPA =
  Object.freeze({
    "generico-arquivos":
      PACK_GENERICO,

    "hospital-abandonado":
      criarPackVisual({
        id:
          "hospital-abandonado",

        nome:
          "Hospital abandonado",

        paleta: {
          fundo:
            "#1d2422",

          pisoSala:
            "#a8aa9d",

          pisoCorredor:
            "#858b82",

          parede:
            "#36312d",

          detalheParede:
            "#777166",

          porta:
            "#a8834a",

          portaTrancada:
            "#a43d38",

          luz:
            "#eee5b4",

          sombra:
            "#080b0a",
        },
      }),

    armazem:
      criarPackVisual({
        id:
          "armazem",

        nome:
          "Armazém",

        paleta: {
          fundo:
            "#202322",

          pisoSala:
            "#77766e",

          pisoCorredor:
            "#64655f",

          parede:
            "#302b27",

          detalheParede:
            "#6d6559",

          porta:
            "#c18b32",

          portaTrancada:
            "#a43b32",

          luz:
            "#e2c277",

          sombra:
            "#070807",
        },
      }),

    escola:
      criarPackVisual({
        id:
          "escola",

        nome:
          "Escola",

        paleta: {
          fundo:
            "#252824",

          pisoSala:
            "#aaa182",

          pisoCorredor:
            "#878c78",

          parede:
            "#37332d",

          detalheParede:
            "#7a715f",

          porta:
            "#97683f",

          portaTrancada:
            "#a53d36",

          luz:
            "#efe2ac",

          sombra:
            "#090a08",
        },
      }),

    delegacia:
      criarPackVisual({
        id:
          "delegacia",

        nome:
          "Delegacia",

        paleta: {
          fundo:
            "#202527",

          pisoSala:
            "#8e9797",

          pisoCorredor:
            "#737d7f",

          parede:
            "#2a3033",

          detalheParede:
            "#647074",

          porta:
            "#9a7a4e",

          portaTrancada:
            "#a73d36",

          luz:
            "#dce6d5",

          sombra:
            "#070909",
        },
      }),

    laboratorio:
      criarPackVisual({
        id:
          "laboratorio",

        nome:
          "Laboratório",

        paleta: {
          fundo:
            "#192326",

          pisoSala:
            "#b4bfba",

          pisoCorredor:
            "#859a98",

          parede:
            "#253337",

          detalheParede:
            "#62797b",

          porta:
            "#78939b",

          portaTrancada:
            "#b8433f",

          luz:
            "#d9f2ee",

          sombra:
            "#05090a",
        },
      }),

    mansao:
      criarPackVisual({
        id:
          "mansao",

        nome:
          "Mansão",

        paleta: {
          fundo:
            "#211a18",

          pisoSala:
            "#816044",

          pisoCorredor:
            "#684b39",

          parede:
            "#2d211d",

          detalheParede:
            "#6e5141",

          porta:
            "#8f6038",

          portaTrancada:
            "#87332f",

          luz:
            "#e9bd72",

          sombra:
            "#090605",
        },
      }),

    "instalacao-subterranea":
      criarPackVisual({
        id:
          "instalacao-subterranea",

        nome:
          "Instalação subterrânea",

        paleta: {
          fundo:
            "#151a1c",

          pisoSala:
            "#596164",

          pisoCorredor:
            "#434c50",

          parede:
            "#20272a",

          detalheParede:
            "#586267",

          porta:
            "#9a7137",

          portaTrancada:
            "#b83b35",

          luz:
            "#d5d8bd",

          sombra:
            "#040607",
        },
      }),

    floresta:
      criarPackVisual({
        id:
          "floresta",

        nome:
          "Floresta",

        ambiente:
          "aberto",

        paleta: {
          fundo:
            "#172019",

          pisoSala:
            "#526344",

          pisoCorredor:
            "#665942",

          parede:
            "#323b2b",

          detalheParede:
            "#687657",

          porta:
            "#7e6340",

          portaTrancada:
            "#893a31",

          luz:
            "#d5bf78",

          sombra:
            "#050805",
        },
      }),

    acampamento:
      criarPackVisual({
        id:
          "acampamento",

        nome:
          "Acampamento",

        ambiente:
          "aberto",

        paleta: {
          fundo:
            "#1d241c",

          pisoSala:
            "#6c654c",

          pisoCorredor:
            "#62513b",

          parede:
            "#3b3226",

          detalheParede:
            "#756348",

          porta:
            "#8c643a",

          portaTrancada:
            "#913b32",

          luz:
            "#e3a94f",

          sombra:
            "#070705",
        },
      }),

    "local-ritual":
      criarPackVisual({
        id:
          "local-ritual",

        nome:
          "Local de ritual",

        paleta: {
          fundo:
            "#171416",

          pisoSala:
            "#5e5354",

          pisoCorredor:
            "#493f43",

          parede:
            "#261d22",

          detalheParede:
            "#644950",

          porta:
            "#87593b",

          portaTrancada:
            "#aa3038",

          luz:
            "#b66ae3",

          sombra:
            "#050304",
        },
      }),
  });

export function obterPackVisualMapa(
  temaId,
) {
  const identificador =
    normalizarIdAssetMapa(
      temaId,
    );

  return (
    PACKS_VISUAIS_MAPA[
      identificador
    ] ||
    PACK_GENERICO
  );
}

export function obterCaminhoAssetPack({
  temaId,
  categoria,
  arquivo,
}) {
  const pack =
    obterPackVisualMapa(
      temaId,
    );

  const categoriaNormalizada =
    normalizarIdAssetMapa(
      categoria,
    );

  const arquivoNormalizado =
    normalizarParteCaminho(
      arquivo,
    );

  if (
    !CATEGORIAS_PACK.includes(
      categoriaNormalizada,
    ) ||
    !arquivoNormalizado
  ) {
    return "";
  }

  return `${pack.pastas[categoriaNormalizada]}/${arquivoNormalizado}`;
}

export function obterCaminhoPisoPack(
  temaId,
  tipo = "sala",
) {
  const pack =
    obterPackVisualMapa(
      temaId,
    );

  const arquivo =
    pack.arquivos.pisos[
      tipo
    ] ||
    pack.arquivos.pisos.sala;

  return obterCaminhoAssetPack({
    temaId:
      pack.id,

    categoria:
      "pisos",

    arquivo,
  });
}

export function obterCaminhoParedePack(
  temaId,
  orientacao = "horizontal",
) {
  const pack =
    obterPackVisualMapa(
      temaId,
    );

  const arquivo =
    pack.arquivos.paredes[
      orientacao
    ] ||
    pack.arquivos.paredes.horizontal;

  return obterCaminhoAssetPack({
    temaId:
      pack.id,

    categoria:
      "paredes",

    arquivo,
  });
}

export function obterCaminhoPortaPack(
  temaId,
  estado = "fechada",
) {
  const pack =
    obterPackVisualMapa(
      temaId,
    );

  const arquivo =
    pack.arquivos.portas[
      estado
    ] ||
    pack.arquivos.portas.fechada;

  return obterCaminhoAssetPack({
    temaId:
      pack.id,

    categoria:
      "portas",

    arquivo,
  });
}

export function obterCaminhoObjetoPack(
  temaId,
  objeto,
) {
  const identificador =
    normalizarIdAssetMapa(
      objeto?.assetId ||
        objeto?.tipo ||
        objeto?.nome ||
        "objeto",
    );

  const extensao =
    identificador === "caixa"
      ? "svg"
      : "webp";

  return obterCaminhoAssetPack({
    temaId,

    categoria:
      "objetos",

    arquivo:
      `${identificador}.${extensao}`,
  });
}

export function obterCaminhoDecoracaoPack(
  temaId,
  decoracao,
) {
  const identificador =
    normalizarIdAssetMapa(
      decoracao?.assetId ||
        decoracao?.tipo ||
        decoracao?.nome ||
        "decoracao",
    );

  return obterCaminhoAssetPack({
    temaId,

    categoria:
      "decoracoes",

    arquivo:
      `${identificador}.webp`,
  });
}

export default PACKS_VISUAIS_MAPA;