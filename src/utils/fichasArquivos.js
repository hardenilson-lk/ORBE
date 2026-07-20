import { removerFichaRemota, salvarFichaRemota } from "../services/supabaseOrbe.js";

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
    .toLowerCase()
    .trim();
}

function lerValorNex(valor) {
  const encontrado =
    String(valor || "").match(
      /\d+/,
    );

  return numeroPositivo(
    encontrado?.[0],
    5,
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
      pePorEtapa: 1,
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
      peInicial: 3,
      pePorEtapa: 1,
      sanInicial: 20,
      sanPorEtapa: 5,
      deslocamento: 9,
    };
  }

  return {
    pvInicial: 16,
    pvPorEtapa: 3,
    peInicial: 2,
    pePorEtapa: 1,
    sanInicial: 16,
    sanPorEtapa: 4,
    deslocamento: 9,
  };
}

function obterBonusReflexos(
  pericias,
) {
  if (
    pericias &&
    typeof pericias === "object" &&
    !Array.isArray(pericias)
  ) {
    const valorReflexos =
      pericias.Reflexos ??
      pericias.reflexos;

    return numeroSeguro(
      valorReflexos,
      0,
    );
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

  const linhaReflexos =
    partes.find((parte) =>
      normalizarTexto(
        parte,
      ).includes(
        "reflexos",
      ),
    );

  if (!linhaReflexos) {
    return 0;
  }

  const numeroEncontrado =
    linhaReflexos.match(
      /[+-]?\d+/,
    );

  return numeroSeguro(
    numeroEncontrado?.[0],
    0,
  );
}

function calcularBonusInventario(
  inventario,
) {
  const itens =
    Array.isArray(inventario)
      ? inventario
      : [];

  return itens.reduce(
    (resultado, item) => {
      if (
        !item ||
        item.ativo === false
      ) {
        return resultado;
      }

      const quantidade =
        numeroPositivo(
          item.quantidade,
          1,
        );

      const volume =
        numeroPositivo(
          item.volume,
          0,
        );

      const defesa =
        numeroPositivo(
          item.defesa,
          0,
        );

      const protecaoInformada =
        numeroPositivo(
          item.protecao,
          0,
        );

      const nomeNormalizado =
        normalizarTexto(
          item.nome,
        );

      const descricaoNormalizada =
        normalizarTexto(
          item.descricao,
        );

      resultado.cargaAtual +=
        volume * quantidade;

      resultado.defesa +=
        defesa;

      if (
        protecaoInformada > 0
      ) {
        resultado.bloqueio +=
          protecaoInformada;
      } else if (defesa > 0) {
        resultado.bloqueio +=
          nomeNormalizado.includes(
            "pesada",
          )
            ? 5
            : 2;
      }

      let penalidadeMovimento =
        numeroPositivo(
          item.penalidadeMovimento,
          0,
        );

      if (
        penalidadeMovimento === 0 &&
        nomeNormalizado.includes(
          "protecao pesada",
        )
      ) {
        penalidadeMovimento = 1;
      }

      resultado.penalidadeMovimento +=
        penalidadeMovimento;

      let bonusCarga =
        numeroPositivo(
          item.bonusCarga,
          0,
        );

      if (
        bonusCarga === 0 &&
        (
          nomeNormalizado.includes(
            "mochila militar",
          ) ||
          descricaoNormalizada.includes(
            "aumenta carga",
          )
        )
      ) {
        bonusCarga = 5;
      }

      resultado.bonusCarga +=
        bonusCarga;

      return resultado;
    },
    {
      defesa: 0,
      bloqueio: 0,
      bonusCarga: 0,
      cargaAtual: 0,
      penalidadeMovimento: 0,
    },
  );
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

  return Math.max(0, atual);
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

  const etapasNex =
    Math.max(
      0,
      Math.floor(nex / 5) - 1,
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

  const bonusInventario =
    calcularBonusInventario(
      ficha.inventario,
    );

  const reflexos =
    obterBonusReflexos(
      ficha.pericias,
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

  const defesa =
    Math.max(
      0,
      10 +
        agilidade +
        bonusInventario.defesa,
    );

  const esquiva =
    Math.max(
      defesa,
      defesa + reflexos,
    );

  const deslocamento =
    Math.max(
      3,
      baseClasse.deslocamento -
        bonusInventario
          .penalidadeMovimento,
    );

  const peRodada =
    Math.max(
      1,
      1 +
        Math.floor(
          nex / 20,
        ),
    );

  const cargaMaxima =
    Math.max(
      1,
      forca * 5 +
        bonusInventario.bonusCarga,
    );

  return {
    ...ficha,
    agilidade,
    forca,
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
    defesa,
    bloqueio:
      bonusInventario.bloqueio,
    protecao:
      bonusInventario.bloqueio,
    esquiva,
    deslocamento,
    peRodada,
    cargaAtual:
      bonusInventario.cargaAtual,
    cargaMaxima,
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
    pvAtual: 16,
    pvMaximo: 16,
    peAtual: 2,
    peMaximo: 2,
    sanAtual: 12,
    sanMaximo: 12,
    defesa: 10,
    bloqueio: 0,
    protecao: 0,
    esquiva: 0,
    cargaAtual: 0,
    cargaMaxima: 5,
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

  void salvarFichaRemota(mesaId, fichaNormalizada).catch((falha) =>
    console.warn("Ficha salva localmente, mas não sincronizada.", falha),
  );

  return fichaNormalizada;
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

  void removerFichaRemota(fichaId).catch((falha) =>
    console.warn("Ficha removida localmente, mas não sincronizada.", falha),
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
