const CONFIGURACAO_PADRAO = Object.freeze({
  escala: 1.08,

  deslocamentoX: 0,
  deslocamentoY: 0,

  rotacaoAdicional: 0,

  opacidade: 1,

  sombra: true,

  zIndex: 5,
});

const CONFIGURACOES_ASSETS = Object.freeze({
  caixa: {
    escala: 1.08,
  },

  pallet: {
    escala: 1.14,
  },

  engradado: {
    escala: 1.08,
  },

  "estante-industrial": {
    escala: 1.16,
  },

  empilhadeira: {
    escala: 1.48,

    deslocamentoY: -0.04,

    zIndex: 7,
  },

  "carrinho-de-carga": {
    escala: 1.3,

    zIndex: 6,
  },

  extintor: {
    escala: 0.84,

    zIndex: 7,
  },

  "painel-eletrico": {
    escala: 0.92,
  },

  camera: {
    escala: 0.76,

    zIndex: 8,
  },

  mesa: {
    escala: 1.16,
  },

  armario: {
    escala: 1.06,
  },

  computador: {
    escala: 0.9,

    zIndex: 7,
  },
});

const ALIASES_ASSETS = Object.freeze({
  palete: "pallet",
  paletes: "pallet",
  pallets: "pallet",

  caixas: "caixa",

  "caixa-de-madeira": "caixa",
  "caixa-industrial": "caixa",

  "carrinho-carga": "carrinho-de-carga",
  carrinho: "carrinho-de-carga",

  "estante-de-metal": "estante-industrial",
  estante: "estante-industrial",

  "painel-eletrico-industrial":
    "painel-eletrico",

  "camera-de-seguranca":
    "camera",

  "computador-de-mesa":
    "computador",
});

export function normalizarIdAssetVisual(
  valor,
) {
  return String(
    valor || "",
  )
    .normalize("NFD")
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

export function resolverAliasAssetVisual(
  valor,
) {
  const identificador =
    normalizarIdAssetVisual(
      valor,
    );

  return (
    ALIASES_ASSETS[
      identificador
    ] ||
    identificador
  );
}

export function obterConfiguracaoAssetVisual(
  assetId,
) {
  const identificador =
    resolverAliasAssetVisual(
      assetId,
    );

  const configuracaoEspecifica =
    CONFIGURACOES_ASSETS[
      identificador
    ] ||
    {};

  return {
    ...CONFIGURACAO_PADRAO,
    ...configuracaoEspecifica,

    assetId:
      identificador,
  };
}

export function obterEscalaAssetVisual(
  assetId,
) {
  return obterConfiguracaoAssetVisual(
    assetId,
  ).escala;
}

export function obterDeslocamentoAssetVisual(
  assetId,
) {
  const configuracao =
    obterConfiguracaoAssetVisual(
      assetId,
    );

  return {
    x:
      configuracao.deslocamentoX,

    y:
      configuracao.deslocamentoY,
  };
}

export {
  ALIASES_ASSETS,
  CONFIGURACOES_ASSETS,
  CONFIGURACAO_PADRAO,
};

export default CONFIGURACOES_ASSETS;