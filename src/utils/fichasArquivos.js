import {
  listarFichasRemotas,
  orbeOnlineHabilitado,
  removerFichaRemota,
  salvarFichaRemota,
} from "../services/supabaseOrbe.js";

import {
  calcularResumoInventario,
} from "./regrasInventarioArquivos.js";

const PREFIXO_STORAGE =
  "orbe:arquivos:fichas";

function criarChaveStorage(mesaId) {
  const identificador =
    String(mesaId || "local").trim() ||
    "local";

  return `${PREFIXO_STORAGE}:${identificador}`;
}

function storageDisponivel() {
  return (
    typeof window !== "undefined" &&
    window.localStorage
  );
}

function lerListaSalva(chave) {
  if (!storageDisponivel()) {
    return [];
  }

  try {
    const conteudo =
      window.localStorage.getItem(chave);

    if (!conteudo) {
      return [];
    }

    const lista = JSON.parse(conteudo);

    return Array.isArray(lista)
      ? lista
      : [];
  } catch {
    return [];
  }
}

function gravarLista(chave, lista) {
  if (!storageDisponivel()) {
    return false;
  }

  try {
    window.localStorage.setItem(
      chave,
      JSON.stringify(lista),
    );

    return true;
  } catch {
    return false;
  }
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

function lerValorNex(valor) {
  const encontrado =
    String(valor || "").match(
      /\d+/,
    );

  const nex =
    numeroPositivo(
      encontrado?.[0],
      5,
    );

  return nex >= 99
    ? 99
    : Math.max(5, nex);
}

function obterNiveisExposicao(
  nex,
) {
  if (nex >= 99) {
    return 20;
  }

  return Math.max(
    1,
    Math.floor(nex / 5),
  );
}

function obterBaseClasse(classe) {
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
      pePorEtapa: 2,

      sanInicial: 12,
      sanPorEtapa: 3,

      deslocamento: 9,
    };
  }

  if (
    classeNormalizada ===
    "ocultista"
  ) {
    return {
      pvInicial: 12,
      pvPorEtapa: 2,

      peInicial: 4,
      pePorEtapa: 4,

      sanInicial: 20,
      sanPorEtapa: 5,

      deslocamento: 9,
    };
  }

  return {
    pvInicial: 16,
    pvPorEtapa: 3,

    peInicial: 3,
    pePorEtapa: 3,

    sanInicial: 16,
    sanPorEtapa: 4,

    deslocamento: 9,
  };
}

function obterValorPericia(
  pericias,
  nomePericia,
) {
  const nomeNormalizado =
    normalizarTexto(
      nomePericia,
    );

  if (
    pericias &&
    typeof pericias === "object" &&
    !Array.isArray(pericias)
  ) {
    const chave =
      Object.keys(
        pericias,
      ).find(
        (nome) =>
          normalizarTexto(
            nome,
          ) ===
          nomeNormalizado,
      );

    const valor =
      chave
        ? pericias[chave]
        : undefined;

    if (
      typeof valor === "number" ||
      typeof valor === "string"
    ) {
      return numeroSeguro(
        valor,
        0,
      );
    }

    if (
      valor &&
      typeof valor === "object"
    ) {
      const totalInformado =
        Number(
          valor.total ??
            valor.valorTotal,
        );

      if (
        Number.isFinite(
          totalInformado,
        )
      ) {
        return totalInformado;
      }

      return (
        numeroSeguro(
          valor.treino,
          0,
        ) +
        numeroSeguro(
          valor.outros,
          0,
        ) +
        numeroSeguro(
          valor.bonus,
          0,
        )
      );
    }

    return 0;
  }

  const partes =
    String(pericias || "")
      .split(
        /[\n,;]+/,
      )
      .map((parte) =>
        parte.trim(),
      )
      .filter(Boolean);

  const linha =
    partes.find((parte) =>
      normalizarTexto(
        parte,
      ).includes(
        nomeNormalizado,
      ),
    );

  if (!linha) {
    return 0;
  }

  const numeroEncontrado =
    linha.match(
      /[+-]?\d+/,
    );

  return numeroSeguro(
    numeroEncontrado?.[0],
    0,
  );
}

function obterBonusOrigem({
  origem,
  nex,
  niveisExposicao,
  intelecto,
}) {
  const origemNormalizada =
    normalizarTexto(origem);

  const bonus = {
    pvMaximo: 0,
    peMaximo: 0,
    sanMaximo: 0,

    defesa: 0,
    limitePePorTurno: 0,

    resistenciaMental: 0,

    bonusDanoCorpoACorpo: 0,
    bonusDanoArmaFogo: 0,

    cultistaArrependido: false,
    escolhaPoderParanormal: false,
  };

  if (
    origemNormalizada ===
    "desgarrado"
  ) {
    bonus.pvMaximo =
      niveisExposicao;
  }

  if (
    origemNormalizada ===
    "universitario"
  ) {
    bonus.peMaximo =
      1 +
      Math.floor(
        Math.max(
          0,
          nex - 5,
        ) / 10,
      );

    bonus.limitePePorTurno =
      1;
  }

  if (
    origemNormalizada ===
    "vitima"
  ) {
    bonus.sanMaximo =
      niveisExposicao;
  }

  if (
    origemNormalizada ===
    "policial"
  ) {
    bonus.defesa = 2;
  }

  if (
    origemNormalizada ===
    "teorico da conspiracao"
  ) {
    bonus.resistenciaMental =
      intelecto;
  }

  if (
    origemNormalizada ===
    "lutador"
  ) {
    bonus.bonusDanoCorpoACorpo =
      2;
  }

  if (
    origemNormalizada ===
    "militar"
  ) {
    bonus.bonusDanoArmaFogo =
      2;
  }

  if (
    origemNormalizada ===
    "cultista arrependido"
  ) {
    bonus.cultistaArrependido =
      true;

    bonus.escolhaPoderParanormal =
      true;
  }

  return bonus;
}

function calcularBonusEquipamentos(
  inventario,
) {
  const itens =
    Array.isArray(inventario)
      ? inventario
      : [];

  const resultado = {
    defesaProtecao: 0,
    defesaEscudo: 0,
    defesaOutros: 0,

    resistenciaDanoFisico: 0,
    tiposResistidos: [],

    penalidadePericiasProtecao: 0,
  };

  itens.forEach((item) => {
    if (
      !item ||
      item.ativo === false
    ) {
      return;
    }

    const nome =
      normalizarTexto(
        item.nome,
      );

    const id =
      normalizarTexto(
        item.id,
      );

    const tipo =
      normalizarTexto(
        item.tipo,
      );

    const categoria =
      normalizarTexto(
        item.categoria,
      );

    const defesa =
      numeroPositivo(
        item.defesa,
        0,
      );

    const resistencia =
      Math.max(
        numeroPositivo(
          item.resistenciaDano,
          0,
        ),
        numeroPositivo(
          item.protecao,
          0,
        ),
      );

    const ehEscudo =
      id === "escudo" ||
      nome === "escudo" ||
      categoria === "escudo";

    const ehProtecao =
      ehEscudo ||
      tipo.includes(
        "protecao",
      ) ||
      categoria.includes(
        "protecao",
      );

    if (ehEscudo) {
      resultado.defesaEscudo =
        Math.max(
          resultado.defesaEscudo,
          defesa,
        );
    } else if (ehProtecao) {
      resultado.defesaProtecao =
        Math.max(
          resultado.defesaProtecao,
          defesa,
        );

      resultado.resistenciaDanoFisico =
        Math.max(
          resultado.resistenciaDanoFisico,
          resistencia,
        );

      const penalidade =
        Math.min(
          0,
          numeroSeguro(
            item.penalidadeCarga,
            0,
          ),
        );

      resultado.penalidadePericiasProtecao =
        Math.min(
          resultado.penalidadePericiasProtecao,
          penalidade,
        );

      if (
        resistencia >
        0 &&
        Array.isArray(
          item.tiposResistidos,
        )
      ) {
        resultado.tiposResistidos =
          Array.from(
            new Set([
              ...resultado.tiposResistidos,
              ...item.tiposResistidos,
            ]),
          );
      }
    } else {
      resultado.defesaOutros +=
        defesa;
    }
  });

  return {
    ...resultado,

    defesaTotal:
      resultado.defesaProtecao +
      resultado.defesaEscudo +
      resultado.defesaOutros,
  };
}

function preservarValorAtual(
  valorAtual,
  maximoAnterior,
  novoMaximo,
) {
  const atual =
    Number(valorAtual);

  const maximoAntigo =
    Number(maximoAnterior);

  if (
    !Number.isFinite(atual) ||
    atual > novoMaximo
  ) {
    return novoMaximo;
  }

  if (
    Number.isFinite(maximoAntigo) &&
    atual === maximoAntigo
  ) {
    return novoMaximo;
  }

  return Math.max(
    0,
    atual,
  );
}

export function recalcularFichaArquivos(
  fichaRecebida = {},
) {
  const ficha = {
    ...fichaRecebida,

    inventario:
      Array.isArray(
        fichaRecebida.inventario,
      )
        ? fichaRecebida.inventario
        : [],

    rituais:
      Array.isArray(
        fichaRecebida.rituais,
      )
        ? fichaRecebida.rituais
        : [],
  };

  const baseClasse =
    obterBaseClasse(
      ficha.classe,
    );

  const nex =
    lerValorNex(
      ficha.nex,
    );

  const niveisExposicao =
    obterNiveisExposicao(
      nex,
    );

  const etapasNex =
    Math.max(
      0,
      niveisExposicao - 1,
    );

  const agilidade =
    numeroPositivo(
      ficha.agilidade,
      1,
    );

  const forca =
    numeroPositivo(
      ficha.forca,
      1,
    );

  const intelecto =
    numeroPositivo(
      ficha.intelecto,
      1,
    );

  const presenca =
    numeroPositivo(
      ficha.presenca,
      1,
    );

  const vigor =
    numeroPositivo(
      ficha.vigor,
      1,
    );

  const bonusOrigem =
    obterBonusOrigem({
      origem: ficha.origem,
      nex,
      niveisExposicao,
      intelecto,
    });

  const bonusEquipamentos =
    calcularBonusEquipamentos(
      ficha.inventario,
    );

  const resumoInventario =
    calcularResumoInventario(
      {
        ...ficha,
        forca,
      },
      ficha.inventario,
    );

  const reflexos =
    obterValorPericia(
      ficha.pericias,
      "Reflexos",
    );

  const fortitude =
    obterValorPericia(
      ficha.pericias,
      "Fortitude",
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
          ) +
        bonusOrigem.pvMaximo,
    );

  const peMaximo =
    Math.max(
      1,
      baseClasse.peInicial +
        presenca +
        etapasNex *
          (
            baseClasse.pePorEtapa +
            presenca
          ) +
        bonusOrigem.peMaximo,
    );

  const sanInicial =
    bonusOrigem
      .cultistaArrependido
      ? Math.floor(
          baseClasse.sanInicial /
            2,
        )
      : baseClasse.sanInicial;

  const sanMaximo =
    Math.max(
      1,
      sanInicial +
        etapasNex *
          baseClasse.sanPorEtapa +
        bonusOrigem.sanMaximo,
    );

  const defesaSemPenalidade =
    Math.max(
      0,
      10 +
        agilidade +
        bonusEquipamentos
          .defesaTotal +
        bonusOrigem.defesa,
    );

  const defesa =
    Math.max(
      0,
      defesaSemPenalidade +
        resumoInventario
          .penalidadeDefesa,
    );

  const esquiva =
    Math.max(
      defesa,
      defesa + reflexos,
    );

  const bloqueio =
    Math.max(
      0,
      fortitude,
    );

  const deslocamento =
    Math.max(
      0,
      baseClasse.deslocamento +
        resumoInventario
          .penalidadeMovimento,
    );

  const peRodada =
    Math.max(
      1,
      niveisExposicao +
        bonusOrigem
          .limitePePorTurno,
    );

  const penalidadePericiasCarga =
    Math.min(
      0,
      resumoInventario
        .penalidadePericias,
    );

  const penalidadePericiasProtecao =
    Math.min(
      0,
      bonusEquipamentos
        .penalidadePericiasProtecao,
    );

  const penalidadePericiasAfetadas =
    Math.min(
      penalidadePericiasCarga,
      penalidadePericiasProtecao,
    );

  return {
    ...ficha,

    nex:
      nex === 99
        ? "99%"
        : `${nex}%`,

    niveisExposicao,

    agilidade,
    forca,
    intelecto,
    presenca,
    vigor,

    pvAtual:
      preservarValorAtual(
        ficha.pvAtual,
        ficha.pvMaximo,
        pvMaximo,
      ),

    pvMaximo,

    peAtual:
      preservarValorAtual(
        ficha.peAtual,
        ficha.peMaximo,
        peMaximo,
      ),

    peMaximo,

    sanAtual:
      preservarValorAtual(
        ficha.sanAtual,
        ficha.sanMaximo,
        sanMaximo,
      ),

    sanMaximo,

    defesaBase:
      10 + agilidade,

    defesaSemPenalidade,

    defesa,

    bloqueio,

    protecao:
      bonusEquipamentos
        .resistenciaDanoFisico,

    resistenciaDano:
      bonusEquipamentos
        .resistenciaDanoFisico,

    tiposResistidos:
      bonusEquipamentos
        .tiposResistidos,

    esquiva,

    deslocamento,

    peRodada,

    cargaAtual:
      resumoInventario
        .cargaAtual,

    cargaMaxima:
      resumoInventario
        .cargaMaxima,

    limiteCargaAbsoluto:
      resumoInventario
        .limiteAbsoluto,

    situacaoCarga:
      resumoInventario
        .situacaoCarga,

    sobrecarregado:
      resumoInventario
        .sobrecarregado,

    cargaExcedida:
      resumoInventario
        .cargaExcedida,

    penalidadeDefesaCarga:
      resumoInventario
        .penalidadeDefesa,

    penalidadePericiasCarga,

    penalidadePericiasProtecao,

    penalidadePericiasAfetadas,

    resistenciaMental:
      bonusOrigem
        .resistenciaMental,

    bonusDanoCorpoACorpo:
      bonusOrigem
        .bonusDanoCorpoACorpo,

    bonusDanoArmaFogo:
      bonusOrigem
        .bonusDanoArmaFogo,

    escolhaPoderParanormalOrigem:
      bonusOrigem
        .escolhaPoderParanormal,

    bonusOrigemAplicado:
      bonusOrigem,
  };
}

export function criarFichaArquivosVazia(
  valoresIniciais = {},
) {
  const fichaBase = {
    id: "",
    nome: "",
    jogador: "",
    foto: "",

    origem: "",
    classe: "Combatente",
    trilha: "",
    nex: "5%",
    patente: "Recruta",

    deslocamento: 9,
    peRodada: 1,

    agilidade: 1,
    forca: 1,
    intelecto: 1,
    presenca: 1,
    vigor: 1,

    pvAtual: 21,
    pvMaximo: 21,

    peAtual: 3,
    peMaximo: 3,

    sanAtual: 12,
    sanMaximo: 12,

    defesa: 11,
    bloqueio: 0,
    protecao: 0,
    resistenciaDano: 0,
    esquiva: 11,

    cargaAtual: 0,
    cargaMaxima: 5,
    limiteCargaAbsoluto: 10,
    situacaoCarga: "normal",
    sobrecarregado: false,
    cargaExcedida: false,

    resistenciaMental: 0,
    bonusDanoCorpoACorpo: 0,
    bonusDanoArmaFogo: 0,

    pericias: "",
    ataques: "",
    habilidades: "",

    anotacoes: "",
    aparencia: "",
    personalidade: "",
    historico: "",
    objetivo: "",

    inventario: [],
    rituais: [],

    criadoEm: "",
    atualizadoEm: "",

    ...valoresIniciais,
  };

  return recalcularFichaArquivos(
    fichaBase,
  );
}

export function listarFichasArquivos(
  mesaId,
) {
  const chave =
    criarChaveStorage(mesaId);

  const fichas =
    lerListaSalva(chave);

  return fichas.map(
    (ficha) =>
      criarFichaArquivosVazia(
        ficha,
      ),
  );
}

export function buscarFichaArquivos(
  mesaId,
  fichaId,
) {
  const fichas =
    listarFichasArquivos(
      mesaId,
    );

  return (
    fichas.find(
      (ficha) =>
        ficha.id === fichaId,
    ) || null
  );
}

export function salvarListaFichasArquivos(
  mesaId,
  fichas,
) {
  const chave =
    criarChaveStorage(mesaId);

  const listaSegura =
    Array.isArray(fichas)
      ? fichas.map(
          (ficha) =>
            criarFichaArquivosVazia(
              ficha,
            ),
        )
      : [];

  gravarLista(
    chave,
    listaSegura,
  );

  return listaSegura;
}

export function salvarFichaArquivos(
  mesaId,
  fichaRecebida,
) {
  const fichas =
    listarFichasArquivos(
      mesaId,
    );

  const agora =
    new Date().toISOString();

  const fichaNormalizada =
    criarFichaArquivosVazia({
      ...fichaRecebida,

      id:
        fichaRecebida?.id ||
        `ficha-${Date.now()}`,

      criadoEm:
        fichaRecebida?.criadoEm ||
        agora,

      atualizadoEm: agora,
    });

  const indiceExistente =
    fichas.findIndex(
      (ficha) =>
        ficha.id ===
        fichaNormalizada.id,
    );

  let listaAtualizada;

  if (indiceExistente >= 0) {
    listaAtualizada =
      fichas.map(
        (ficha, indice) =>
          indice ===
          indiceExistente
            ? fichaNormalizada
            : ficha,
      );
  } else {
    listaAtualizada = [
      fichaNormalizada,
      ...fichas,
    ];
  }

  salvarListaFichasArquivos(
    mesaId,
    listaAtualizada,
  );

  return fichaNormalizada;
}

export async function salvarFichaArquivosConectada(
  mesaId,
  fichaRecebida,
  opcoes = {},
) {
  const agora =
    new Date().toISOString();

  const fichaNormalizada =
    criarFichaArquivosVazia({
      ...fichaRecebida,

      id:
        fichaRecebida?.id ||
        `ficha-${Date.now()}`,

      criadoEm:
        fichaRecebida?.criadoEm ||
        agora,

      atualizadoEm: agora,
    });

  if (!orbeOnlineHabilitado()) {
    return salvarFichaArquivos(
      mesaId,
      fichaNormalizada,
    );
  }

  const fichaConfirmada =
    await salvarFichaRemota(
      mesaId,
      fichaNormalizada,
      opcoes,
    );

  return salvarFichaArquivos(
    mesaId,
    fichaConfirmada,
  );
}

export async function carregarFichasArquivosConectadas(
  mesaId,
) {
  if (!orbeOnlineHabilitado()) {
    return listarFichasArquivos(
      mesaId,
    );
  }

  const fichasRemotas =
    await listarFichasRemotas(
      mesaId,
    );

  return salvarListaFichasArquivos(
    mesaId,
    fichasRemotas,
  );
}

export function removerFichaArquivos(
  mesaId,
  fichaId,
) {
  const fichas =
    listarFichasArquivos(
      mesaId,
    );

  const listaAtualizada =
    fichas.filter(
      (ficha) =>
        ficha.id !== fichaId,
    );

  salvarListaFichasArquivos(
    mesaId,
    listaAtualizada,
  );

  void removerFichaRemota(
    fichaId,
  ).catch((falha) =>
    console.warn(
      "Ficha removida localmente, mas não sincronizada.",
      falha,
    ),
  );

  return listaAtualizada;
}

export function limparFichasArquivos(
  mesaId,
) {
  const chave =
    criarChaveStorage(mesaId);

  if (!storageDisponivel()) {
    return false;
  }

  try {
    window.localStorage.removeItem(
      chave,
    );

    return true;
  } catch {
    return false;
  }
}

const fichasArquivos = {
  criarFichaVazia:
    criarFichaArquivosVazia,

  recalcular:
    recalcularFichaArquivos,

  listar:
    listarFichasArquivos,

  buscar:
    buscarFichaArquivos,

  salvarLista:
    salvarListaFichasArquivos,

  salvar:
    salvarFichaArquivos,

  remover:
    removerFichaArquivos,

  limpar:
    limparFichasArquivos,
};

export default fichasArquivos;