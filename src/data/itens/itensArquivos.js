import {
  ARMAS_ARQUIVOS,
  ARMAS_PESADAS_ARQUIVOS,
  ARMAS_SIMPLES_ARQUIVOS,
  ARMAS_TATICAS_ARQUIVOS,
} from "./itens/armasArquivos.js";

import {
  MODIFICACOES_PROTECOES_ARQUIVOS,
  PROTECOES_ARQUIVOS,
  PROTECOES_LEVES_ARQUIVOS,
  PROTECOES_PESADAS_ARQUIVOS,
} from "./itens/protecoesArquivos.js";

import {
  ACESSORIOS_ARQUIVOS,
  EQUIPAMENTOS_ARQUIVOS,
  ITENS_OPERACIONAIS_ARQUIVOS,
  MODIFICACOES_ACESSORIOS_ARQUIVOS,
} from "./itens/equipamentosArquivos.js";

import {
  EXPLOSIVOS_ARQUIVOS,
  GRANADAS_ARQUIVOS,
  MINAS_ARQUIVOS,
} from "./itens/explosivosArquivos.js";

function criarListaSegura(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}

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

function criarIdItem() {
  return `item-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export {
  ARMAS_ARQUIVOS,
  ARMAS_PESADAS_ARQUIVOS,
  ARMAS_SIMPLES_ARQUIVOS,
  ARMAS_TATICAS_ARQUIVOS,
  PROTECOES_ARQUIVOS,
  PROTECOES_LEVES_ARQUIVOS,
  PROTECOES_PESADAS_ARQUIVOS,
  MODIFICACOES_PROTECOES_ARQUIVOS,
  ACESSORIOS_ARQUIVOS,
  ITENS_OPERACIONAIS_ARQUIVOS,
  EQUIPAMENTOS_ARQUIVOS,
  MODIFICACOES_ACESSORIOS_ARQUIVOS,
  EXPLOSIVOS_ARQUIVOS,
  GRANADAS_ARQUIVOS,
  MINAS_ARQUIVOS,
};

export const ITENS_ARQUIVOS = [
  ...ARMAS_ARQUIVOS,
  ...PROTECOES_ARQUIVOS,
  ...EQUIPAMENTOS_ARQUIVOS,
  ...EXPLOSIVOS_ARQUIVOS,
];

export const MODIFICACOES_ITENS_ARQUIVOS = [
  ...MODIFICACOES_PROTECOES_ARQUIVOS,
  ...MODIFICACOES_ACESSORIOS_ARQUIVOS,
];

export const GRUPOS_ITENS_ARQUIVOS = [
  {
    id: "armas",
    nome: "Armas",
    itens: ARMAS_ARQUIVOS,
  },

  {
    id: "protecoes",
    nome: "Proteções",
    itens: PROTECOES_ARQUIVOS,
  },

  {
    id: "acessorios",
    nome: "Acessórios",
    itens: ACESSORIOS_ARQUIVOS,
  },

  {
    id: "itens-operacionais",
    nome: "Itens Operacionais",
    itens:
      ITENS_OPERACIONAIS_ARQUIVOS,
  },

  {
    id: "explosivos",
    nome: "Explosivos",
    itens: EXPLOSIVOS_ARQUIVOS,
  },
];

export function obterItemCatalogoArquivos(
  itemId,
) {
  const identificador =
    String(itemId || "").trim();

  if (!identificador) {
    return null;
  }

  return (
    ITENS_ARQUIVOS.find(
      (item) =>
        item.id === identificador,
    ) || null
  );
}

export function buscarItensArquivos(
  termo,
  listaRecebida = ITENS_ARQUIVOS,
) {
  const lista =
    criarListaSegura(
      listaRecebida,
    );

  const busca =
    normalizarTexto(
      termo,
    );

  if (!busca) {
    return lista;
  }

  return lista.filter(
    (item) => {
      const textoItem =
        normalizarTexto(
          [
            item.nome,
            item.tipo,
            item.categoria,
            item.grupo,
            item.proficiencia,
            item.empunhadura,
            item.funcionamento,
            item.dano,
            item.critico,
            item.alcance,
            item.tipoDano,
            item.municao,
            item.pericia,
            item.resistencia,
            item.efeito,
            item.descricao,
            ...criarListaSegura(
              item.propriedades,
            ),
          ].join(" "),
        );

      return textoItem.includes(
        busca,
      );
    },
  );
}

export function obterItensPorTipoArquivos(
  tipo,
) {
  const tipoNormalizado =
    normalizarTexto(
      tipo,
    );

  if (!tipoNormalizado) {
    return ITENS_ARQUIVOS;
  }

  return ITENS_ARQUIVOS.filter(
    (item) =>
      normalizarTexto(
        item.tipo,
      ) === tipoNormalizado,
  );
}

export function criarItemArquivos(
  itemCatalogo = {},
) {
  const itemSeguro =
    itemCatalogo &&
    typeof itemCatalogo ===
      "object"
      ? itemCatalogo
      : {};

  const quantidade =
    Math.max(
      1,
      Number(
        itemSeguro.quantidade,
      ) || 1,
    );

  return {
    ...itemSeguro,

    id: criarIdItem(),

    itemCatalogoId:
      itemSeguro.itemCatalogoId ||
      itemSeguro.id ||
      "",

    quantidade,

    ativo:
      itemSeguro.ativo !== false,

    modificacoes:
      criarListaSegura(
        itemSeguro.modificacoes,
      ).map(
        (modificacao) => ({
          ...modificacao,
        }),
      ),

    criadoEm:
      new Date().toISOString(),
  };
}

export function criarItemManualArquivos(
  dadosRecebidos = {},
) {
  return criarItemArquivos({
    tipo:
      "Equipamento manual",

    categoria:
      "Personalizado",

    categoriaNumerica: 0,

    quantidade: 1,
    volume: 1,

    dano: "",
    critico: "",
    alcance: "",
    tipoDano: "",

    defesa: 0,
    protecao: 0,
    bonusCarga: 0,
    penalidadeMovimento: 0,

    ativo: true,
    propriedades: [],
    efeito: "",
    descricao: "",

    ...dadosRecebidos,

    itemCatalogoId: "",
  });
}

export default ITENS_ARQUIVOS;