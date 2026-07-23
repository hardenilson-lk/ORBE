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

import * as MODULO_MUNICOES from "./itens/municoesArquivos.js";

import * as MODULO_ITENS_PARANORMAIS from "./itens/itensParanormaisArquivos.js";

import * as MODULO_MODIFICACOES_ARMAS from "./itens/modificacoesArmasArquivos.js";

import * as MODULO_MALDICOES_ARMAS from "./itens/amaldicoados/maldicoesArmasArquivos.js";

import * as MODULO_MALDICOES_PROTECOES from "./itens/amaldicoados/maldicoesProtecoesArquivos.js";

import * as MODULO_MALDICOES_ACESSORIOS from "./itens/amaldicoados/maldicoesAcessoriosArquivos.js";

import * as MODULO_ITENS_AMALDICOADOS_ESPECIAIS from "./itens/amaldicoados/itensAmaldicoadosEspeciaisArquivos.js";

function criarListaSegura(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}

function obterListaModulo(
  modulo,
  nomeExportacao,
) {
  const listaNomeada =
    modulo?.[nomeExportacao];

  if (Array.isArray(listaNomeada)) {
    return listaNomeada;
  }

  if (Array.isArray(modulo?.default)) {
    return modulo.default;
  }

  return [];
}

function combinarListasUnicas(
  ...listas
) {
  const resultado = [];
  const identificadores =
    new Set();

  listas.forEach(
    (listaRecebida) => {
      criarListaSegura(
        listaRecebida,
      ).forEach(
        (item) => {
          if (
            !item ||
            typeof item !== "object"
          ) {
            return;
          }

          const identificador =
            String(
              item.id || "",
            ).trim();

          if (
            identificador &&
            identificadores.has(
              identificador,
            )
          ) {
            return;
          }

          if (identificador) {
            identificadores.add(
              identificador,
            );
          }

          resultado.push(item);
        },
      );
    },
  );

  return resultado;
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

function transformarEmTextoBusca(
  valor,
) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return "";
  }

  if (Array.isArray(valor)) {
    return valor
      .map(
        transformarEmTextoBusca,
      )
      .join(" ");
  }

  if (
    typeof valor === "object"
  ) {
    return Object.values(valor)
      .map(
        transformarEmTextoBusca,
      )
      .join(" ");
  }

  return String(valor);
}

function criarIdItem() {
  return `item-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export const MUNICOES_ARQUIVOS =
  obterListaModulo(
    MODULO_MUNICOES,
    "MUNICOES_ARQUIVOS",
  );

export const ITENS_PARANORMAIS_ARQUIVOS =
  obterListaModulo(
    MODULO_ITENS_PARANORMAIS,
    "ITENS_PARANORMAIS_ARQUIVOS",
  );

export const MODIFICACOES_ARMAS_ARQUIVOS =
  obterListaModulo(
    MODULO_MODIFICACOES_ARMAS,
    "MODIFICACOES_ARMAS_ARQUIVOS",
  );

export const MODIFICACOES_MUNICOES_ARQUIVOS =
  obterListaModulo(
    MODULO_MODIFICACOES_ARMAS,
    "MODIFICACOES_MUNICOES_ARQUIVOS",
  );

export const MALDICOES_ARMAS_ARQUIVOS =
  obterListaModulo(
    MODULO_MALDICOES_ARMAS,
    "MALDICOES_ARMAS_ARQUIVOS",
  );

export const MALDICOES_PROTECOES_ARQUIVOS =
  obterListaModulo(
    MODULO_MALDICOES_PROTECOES,
    "MALDICOES_PROTECOES_ARQUIVOS",
  );

export const MALDICOES_ACESSORIOS_ARQUIVOS =
  obterListaModulo(
    MODULO_MALDICOES_ACESSORIOS,
    "MALDICOES_ACESSORIOS_ARQUIVOS",
  );

export const ITENS_AMALDICOADOS_ESPECIAIS_ARQUIVOS =
  obterListaModulo(
    MODULO_ITENS_AMALDICOADOS_ESPECIAIS,
    "ITENS_AMALDICOADOS_ESPECIAIS_ARQUIVOS",
  );

export const PRECO_MALDICAO_POR_ELEMENTO =
  MODULO_MALDICOES_ARMAS
    ?.PRECO_MALDICAO_POR_ELEMENTO ||
  {};

export const ITENS_AMALDICOADOS_ESPECIAIS_POR_ELEMENTO_ARQUIVOS =
  MODULO_ITENS_AMALDICOADOS_ESPECIAIS
    ?.ITENS_AMALDICOADOS_ESPECIAIS_POR_ELEMENTO_ARQUIVOS ||
  {};

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

export const ITENS_ARQUIVOS =
  combinarListasUnicas(
    ARMAS_ARQUIVOS,
    MUNICOES_ARQUIVOS,
    PROTECOES_ARQUIVOS,
    EQUIPAMENTOS_ARQUIVOS,
    EXPLOSIVOS_ARQUIVOS,
    ITENS_PARANORMAIS_ARQUIVOS,
    ITENS_AMALDICOADOS_ESPECIAIS_ARQUIVOS,
  );

export const MODIFICACOES_ITENS_ARQUIVOS =
  combinarListasUnicas(
    MODIFICACOES_ARMAS_ARQUIVOS,
    MODIFICACOES_MUNICOES_ARQUIVOS,
    MODIFICACOES_PROTECOES_ARQUIVOS,
    MODIFICACOES_ACESSORIOS_ARQUIVOS,
  );

export const MALDICOES_ITENS_ARQUIVOS =
  combinarListasUnicas(
    MALDICOES_ARMAS_ARQUIVOS,
    MALDICOES_PROTECOES_ARQUIVOS,
    MALDICOES_ACESSORIOS_ARQUIVOS,
  );

export const TODOS_RECURSOS_ITENS_ARQUIVOS =
  combinarListasUnicas(
    ITENS_ARQUIVOS,
    MODIFICACOES_ITENS_ARQUIVOS,
    MALDICOES_ITENS_ARQUIVOS,
  );

export const GRUPOS_ITENS_ARQUIVOS = [
  {
    id: "armas",
    nome: "Armas",
    itens: ARMAS_ARQUIVOS,
  },

  {
    id: "municoes",
    nome: "Munições",
    itens: MUNICOES_ARQUIVOS,
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

  {
    id: "itens-paranormais",
    nome: "Itens Paranormais",
    itens:
      ITENS_PARANORMAIS_ARQUIVOS,
  },

  {
    id:
      "itens-amaldicoados-especiais",

    nome:
      "Itens Amaldiçoados Especiais",

    itens:
      ITENS_AMALDICOADOS_ESPECIAIS_ARQUIVOS,
  },
];

export const GRUPOS_MODIFICACOES_ITENS_ARQUIVOS =
  [
    {
      id:
        "modificacoes-armas",

      nome:
        "Modificações de Armas",

      itens:
        MODIFICACOES_ARMAS_ARQUIVOS,
    },

    {
      id:
        "modificacoes-municoes",

      nome:
        "Modificações de Munições",

      itens:
        MODIFICACOES_MUNICOES_ARQUIVOS,
    },

    {
      id:
        "modificacoes-protecoes",

      nome:
        "Modificações de Proteções",

      itens:
        MODIFICACOES_PROTECOES_ARQUIVOS,
    },

    {
      id:
        "modificacoes-acessorios",

      nome:
        "Modificações de Acessórios",

      itens:
        MODIFICACOES_ACESSORIOS_ARQUIVOS,
    },
  ];

export const GRUPOS_MALDICOES_ITENS_ARQUIVOS =
  [
    {
      id:
        "maldicoes-armas",

      nome:
        "Maldições de Armas",

      itens:
        MALDICOES_ARMAS_ARQUIVOS,
    },

    {
      id:
        "maldicoes-protecoes",

      nome:
        "Maldições de Proteções",

      itens:
        MALDICOES_PROTECOES_ARQUIVOS,
    },

    {
      id:
        "maldicoes-acessorios",

      nome:
        "Maldições de Acessórios",

      itens:
        MALDICOES_ACESSORIOS_ARQUIVOS,
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
        String(item?.id || "") ===
        identificador,
    ) || null
  );
}

export function obterModificacaoCatalogoArquivos(
  modificacaoId,
) {
  const identificador =
    String(
      modificacaoId || "",
    ).trim();

  if (!identificador) {
    return null;
  }

  return (
    MODIFICACOES_ITENS_ARQUIVOS.find(
      (modificacao) =>
        String(
          modificacao?.id || "",
        ) === identificador,
    ) || null
  );
}

export function obterMaldicaoCatalogoArquivos(
  maldicaoId,
) {
  const identificador =
    String(
      maldicaoId || "",
    ).trim();

  if (!identificador) {
    return null;
  }

  return (
    MALDICOES_ITENS_ARQUIVOS.find(
      (maldicao) =>
        String(
          maldicao?.id || "",
        ) === identificador,
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
    normalizarTexto(termo);

  if (!busca) {
    return lista;
  }

  return lista.filter(
    (item) => {
      const textoItem =
        normalizarTexto(
          transformarEmTextoBusca({
            nome: item?.nome,
            tipo: item?.tipo,
            categoria:
              item?.categoria,
            categoriaOficial:
              item?.categoriaOficial,
            categoriaNumerica:
              item?.categoriaNumerica,
            grupo: item?.grupo,
            elemento: item?.elemento,
            proficiencia:
              item?.proficiencia,
            empunhadura:
              item?.empunhadura,
            funcionamento:
              item?.funcionamento,
            dano: item?.dano,
            danoAdicional:
              item?.danoAdicional,
            critico: item?.critico,
            alcance: item?.alcance,
            tipoDano:
              item?.tipoDano,
            municao: item?.municao,
            pericia: item?.pericia,
            resistencia:
              item?.resistencia,
            efeito: item?.efeito,
            descricao:
              item?.descricao,
            comentario:
              item?.comentario,
            propriedades:
              item?.propriedades,
            patenteMinima:
              item?.patenteMinima,
          }),
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
    normalizarTexto(tipo);

  if (!tipoNormalizado) {
    return ITENS_ARQUIVOS;
  }

  return ITENS_ARQUIVOS.filter(
    (item) =>
      normalizarTexto(
        item?.tipo,
      ) === tipoNormalizado,
  );
}

export function obterItensPorGrupoArquivos(
  grupoId,
) {
  const identificador =
    normalizarTexto(
      grupoId,
    );

  if (!identificador) {
    return ITENS_ARQUIVOS;
  }

  const grupoEncontrado =
    GRUPOS_ITENS_ARQUIVOS.find(
      (grupo) =>
        normalizarTexto(
          grupo.id,
        ) === identificador ||
        normalizarTexto(
          grupo.nome,
        ) === identificador,
    );

  return grupoEncontrado
    ? criarListaSegura(
        grupoEncontrado.itens,
      )
    : [];
}

export function obterItensPorElementoArquivos(
  elemento,
) {
  const elementoNormalizado =
    normalizarTexto(
      elemento,
    );

  if (!elementoNormalizado) {
    return ITENS_ARQUIVOS;
  }

  return ITENS_ARQUIVOS.filter(
    (item) =>
      normalizarTexto(
        item?.elemento,
      ) === elementoNormalizado,
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

    guardado:
      itemSeguro.guardado === true,

    modificacoes:
      criarListaSegura(
        itemSeguro.modificacoes,
      ).map(
        (modificacao) => ({
          ...modificacao,
        }),
      ),

    maldicoes:
      criarListaSegura(
        itemSeguro.maldicoes,
      ).map(
        (maldicao) => ({
          ...maldicao,
        }),
      ),

    propriedades:
      criarListaSegura(
        itemSeguro.propriedades,
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
    categoriaOficial: "0",

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
    guardado: false,

    propriedades: [],
    modificacoes: [],
    maldicoes: [],

    efeito: "",
    descricao: "",
    comentario: "",

    ...dadosRecebidos,

    itemCatalogoId: "",
  });
}

export default ITENS_ARQUIVOS;