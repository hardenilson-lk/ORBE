const DESCRICOES_CATEGORIAS = {
  0: "Itens comuns e básicos.",
  1: "Equipamentos simples, armas e recursos de fácil acesso para agentes.",
  2: "Itens mais caros, especializados ou modificados.",
  3: "Equipamentos avançados e poderosos.",
  4: "Itens extremamente raros, experimentais ou muito poderosos.",
};

const LIMITES_POR_PATENTE = {
  recruta: {
    nome: "Recruta",
    categorias: { 1: 2, 2: 0, 3: 0, 4: 0 },
  },
  operador: {
    nome: "Operador",
    categorias: { 1: 3, 2: 1, 3: 0, 4: 0 },
  },
  "agente especial": {
    nome: "Agente Especial",
    categorias: { 1: 3, 2: 2, 3: 1, 4: 0 },
  },
  "oficial de operacoes": {
    nome: "Oficial de Operações",
    categorias: { 1: 3, 2: 3, 3: 2, 4: 1 },
  },
  "agente de elite": {
    nome: "Agente de Elite",
    categorias: { 1: 3, 2: 3, 3: 3, 4: 2 },
  },
};

export const CATEGORIAS_INVENTARIO_ARQUIVOS = [0, 1, 2, 3, 4];

export const ROTULOS_CATEGORIAS_INVENTARIO = {
  0: "0",
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
};

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function numeroNaoNegativo(valor, padrao = 0) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? Math.max(0, numero) : padrao;
}

function criarListaSegura(valor) {
  return Array.isArray(valor) ? valor : [];
}

export function obterCategoriaNumericaItem(item = {}) {
  const categoriaInformada = Number(item.categoriaNumerica);

  if (Number.isFinite(categoriaInformada)) {
    return Math.min(4, Math.max(0, Math.trunc(categoriaInformada)));
  }

  const categoriaTexto = normalizarTexto(item.categoria);
  const correspondencias = [
    ["iv", 4],
    ["iii", 3],
    ["ii", 2],
    ["i", 1],
  ];

  const encontrada = correspondencias.find(([romano]) =>
    new RegExp(`(?:categoria\\s*)?${romano}(?:\\b|$)`, "i").test(categoriaTexto),
  );

  return encontrada?.[1] ?? 0;
}

export function obterRotuloCategoriaNumerica(categoria) {
  return ROTULOS_CATEGORIAS_INVENTARIO[
    Math.min(4, Math.max(0, Number(categoria) || 0))
  ];
}

export function obterDescricaoCategoriaInventario(categoria) {
  return DESCRICOES_CATEGORIAS[
    Math.min(4, Math.max(0, Number(categoria) || 0))
  ];
}

export function obterRegraPatenteInventario(patente) {
  return (
    LIMITES_POR_PATENTE[normalizarTexto(patente)] ||
    LIMITES_POR_PATENTE.recruta
  );
}

export function calcularCapacidadeCargaBase(forca) {
  const forcaSegura = numeroNaoNegativo(forca);
  return forcaSegura === 0 ? 2 : forcaSegura * 5;
}

export function calcularResumoInventario(ficha = {}, inventarioRecebido) {
  const inventario = criarListaSegura(
    inventarioRecebido ?? ficha.inventario,
  );
  const regraPatente = obterRegraPatenteInventario(ficha.patente);
  const usadosPorCategoria = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

  let cargaAtual = 0;
  let bonusCarga = 0;

  inventario.forEach((item) => {
    if (!item) return;

    const quantidade = numeroNaoNegativo(item.quantidade, 1);
    const volume = numeroNaoNegativo(item.volume);
    const categoria = obterCategoriaNumericaItem(item);

    cargaAtual += volume * quantidade;
    usadosPorCategoria[categoria] += quantidade;

    if (item.ativo !== false) {
      bonusCarga += numeroNaoNegativo(item.bonusCarga);
    }
  });

  const cargaMaxima =
    calcularCapacidadeCargaBase(ficha.forca) + bonusCarga;
  const limitesPorCategoria = {
    0: Number.POSITIVE_INFINITY,
    ...regraPatente.categorias,
  };
  const categoriasExcedidas = [1, 2, 3, 4].filter(
    (categoria) =>
      usadosPorCategoria[categoria] > limitesPorCategoria[categoria],
  );

  return {
    patente: regraPatente.nome,
    cargaAtual,
    cargaMaxima,
    cargaExcedida: cargaAtual > cargaMaxima,
    usadosPorCategoria,
    limitesPorCategoria,
    categoriasExcedidas,
    valido: cargaAtual <= cargaMaxima && categoriasExcedidas.length === 0,
  };
}

export function validarInventarioArquivos(ficha = {}, inventarioRecebido) {
  const resumo = calcularResumoInventario(ficha, inventarioRecebido);

  if (resumo.cargaExcedida) {
    return {
      permitido: false,
      resumo,
      mensagem:
        `Limite de carga excedido: ${resumo.cargaAtual}/${resumo.cargaMaxima} espaços. ` +
        "Reduza a quantidade, o volume ou remova outro item.",
    };
  }

  const categoriaExcedida = resumo.categoriasExcedidas[0];

  if (categoriaExcedida) {
    const rotulo = obterRotuloCategoriaNumerica(categoriaExcedida);
    return {
      permitido: false,
      resumo,
      mensagem:
        `A patente ${resumo.patente} permite ${resumo.limitesPorCategoria[categoriaExcedida]} ` +
        `item(ns) de categoria ${rotulo}; o inventário ficaria com ` +
        `${resumo.usadosPorCategoria[categoriaExcedida]}.`,
    };
  }

  return {
    permitido: true,
    resumo,
    mensagem: "Inventário dentro dos limites da patente e da carga.",
  };
}

