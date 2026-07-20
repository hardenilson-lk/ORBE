import RITUAIS_1_CIRCULO from "./rituais/rituais1Circulo.js";
import RITUAIS_2_CIRCULO from "./rituais/rituais2Circulo.js";
import RITUAIS_3_CIRCULO from "./rituais/rituais3Circulo.js";
import RITUAIS_4_CIRCULO from "./rituais/rituais4Circulo.js";

const CUSTO_POR_CIRCULO = {
  1: "1 PE",
  2: "3 PE",
  3: "6 PE",
  4: "10 PE",
};

const NEX_POR_CIRCULO = {
  1: 5,
  2: 25,
  3: 55,
  4: 85,
};

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
  const valorEncontrado =
    String(valor || "").match(
      /\d+/,
    );

  const numero =
    Number(
      valorEncontrado?.[0],
    );

  return Number.isFinite(numero)
    ? numero
    : 5;
}

function criarIdRitual() {
  return `ritual-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function obterNomesHabilidades(
  habilidades,
) {
  if (Array.isArray(habilidades)) {
    return habilidades.map(
      (habilidade) =>
        normalizarTexto(
          habilidade?.nome ||
            habilidade,
        ),
    );
  }

  return String(habilidades || "")
    .split(
      /[\n,;]+/,
    )
    .map((habilidade) =>
      normalizarTexto(
        habilidade,
      ),
    )
    .filter(Boolean);
}

function montarTextoCompleto(
  ritual = {},
) {
  const partes = [];

  if (ritual.descricaoCompleta) {
    partes.push(
      ritual.descricaoCompleta,
    );
  }

  if (ritual.discente) {
    const tituloDiscente =
      ritual.discenteCusto
        ? `Discente (${ritual.discenteCusto})`
        : "Discente";

    partes.push(
      `${tituloDiscente}: ${ritual.discente}`,
    );
  }

  if (ritual.verdadeiro) {
    const tituloVerdadeiro =
      ritual.verdadeiroCusto
        ? `Verdadeiro (${ritual.verdadeiroCusto})`
        : "Verdadeiro";

    partes.push(
      `${tituloVerdadeiro}: ${ritual.verdadeiro}`,
    );
  }

  return partes.join("\n\n");
}

function normalizarRitualCatalogo(
  ritual = {},
) {
  const circulo =
    Math.min(
      4,
      Math.max(
        1,
        Number(
          ritual.circulo,
        ) || 1,
      ),
    );

  const resumo =
    String(
      ritual.resumo ||
        ritual.descricao ||
        "",
    );

  const descricaoCompleta =
    String(
      ritual.descricaoCompleta ||
        ritual.descricao ||
        resumo,
    );

  const ritualNormalizado = {
    tipo: "Ritual",

    id:
      String(
        ritual.id || "",
      ),

    nome:
      String(
        ritual.nome ||
          "Ritual sem nome",
      ),

    circulo,

    nexMinimo:
      Number(
        ritual.nexMinimo,
      ) ||
      NEX_POR_CIRCULO[
        circulo
      ] ||
      5,

    custo:
      String(
        ritual.custo ||
          CUSTO_POR_CIRCULO[
            circulo
          ] ||
          "1 PE",
      ),

    elemento:
      String(
        ritual.elemento || "",
      ),

    resumo,

    descricao: resumo,

    execucao:
      String(
        ritual.execucao || "",
      ),

    alcance:
      String(
        ritual.alcance || "",
      ),

    alvo:
      String(
        ritual.alvo || "",
      ),

    area:
      String(
        ritual.area || "",
      ),

    alvoOuArea:
      String(
        ritual.alvoOuArea || "",
      ),

    efeito:
      String(
        ritual.efeito || "",
      ),

    duracao:
      String(
        ritual.duracao || "",
      ),

    resistencia:
      String(
        ritual.resistencia || "",
      ),

    requisito:
      String(
        ritual.requisito || "",
      ),

    descricaoCompleta,

    discenteCusto:
      String(
        ritual.discenteCusto || "",
      ),

    discente:
      String(
        ritual.discente || "",
      ),

    verdadeiroCusto:
      String(
        ritual.verdadeiroCusto || "",
      ),

    verdadeiro:
      String(
        ritual.verdadeiro || "",
      ),

    automatico:
      ritual.automatico !==
      false,
  };

  return {
    ...ritualNormalizado,

    textoCompleto:
      montarTextoCompleto(
        ritualNormalizado,
      ),
  };
}

const TODOS_RITUAIS_ARQUIVOS = [
  ...RITUAIS_1_CIRCULO,
  ...RITUAIS_2_CIRCULO,
  ...RITUAIS_3_CIRCULO,
  ...RITUAIS_4_CIRCULO,
];

export const RITUAIS_ARQUIVOS =
  TODOS_RITUAIS_ARQUIVOS
    .map(
      normalizarRitualCatalogo,
    )
    .sort(
      (
        primeiroRitual,
        segundoRitual,
      ) => {
        if (
          primeiroRitual.circulo !==
          segundoRitual.circulo
        ) {
          return (
            primeiroRitual.circulo -
            segundoRitual.circulo
          );
        }

        return primeiroRitual.nome.localeCompare(
          segundoRitual.nome,
          "pt-BR",
        );
      },
    );

export function obterCirculoMaximoRituaisArquivos(
  fichaOuNex,
) {
  const valorNex =
    fichaOuNex &&
    typeof fichaOuNex ===
      "object"
      ? fichaOuNex.nex
      : fichaOuNex;

  const nex =
    lerValorNex(
      valorNex,
    );

  if (nex >= 85) {
    return 4;
  }

  if (nex >= 55) {
    return 3;
  }

  if (nex >= 25) {
    return 2;
  }

  if (nex >= 5) {
    return 1;
  }

  return 0;
}

export function fichaPodeUsarRituaisArquivos(
  ficha = {},
) {
  const classe =
    normalizarTexto(
      ficha.classe,
    );

  if (classe === "ocultista") {
    return true;
  }

  const nomesHabilidades =
    obterNomesHabilidades(
      ficha.habilidades,
    );

  return nomesHabilidades.some(
    (nome) =>
      nome.includes(
        "conjurar ritual",
      ) ||
      nome.includes(
        "escolhido pelo outro lado",
      ),
  );
}

export function ritualEstaLiberadoArquivos(
  ritual = {},
  fichaOuNex,
) {
  const circuloMaximo =
    obterCirculoMaximoRituaisArquivos(
      fichaOuNex,
    );

  const circuloRitual =
    Number(
      ritual.circulo,
    ) || 1;

  return (
    circuloRitual <=
    circuloMaximo
  );
}

export function obterRituaisLiberadosArquivos(
  ficha = {},
) {
  if (
    !fichaPodeUsarRituaisArquivos(
      ficha,
    )
  ) {
    return [];
  }

  return RITUAIS_ARQUIVOS.filter(
    (ritual) =>
      ritualEstaLiberadoArquivos(
        ritual,
        ficha,
      ),
  );
}

export function obterRituaisDisponiveisArquivos(
  ficha = {},
  rituaisAdicionados = [],
) {
  if (
    !fichaPodeUsarRituaisArquivos(
      ficha,
    )
  ) {
    return [];
  }

  const listaAdicionada =
    Array.isArray(
      rituaisAdicionados,
    )
      ? rituaisAdicionados
      : [];

  const idsAdicionados =
    new Set(
      listaAdicionada
        .map(
          (ritual) =>
            ritual?.id,
        )
        .filter(Boolean),
    );

  const nomesAdicionados =
    new Set(
      listaAdicionada
        .map(
          (ritual) =>
            normalizarTexto(
              ritual?.nome,
            ),
        )
        .filter(Boolean),
    );

  return RITUAIS_ARQUIVOS.filter(
    (ritual) => {
      if (
        !ritualEstaLiberadoArquivos(
          ritual,
          ficha,
        )
      ) {
        return false;
      }

      if (
        idsAdicionados.has(
          ritual.id,
        )
      ) {
        return false;
      }

      if (
        nomesAdicionados.has(
          normalizarTexto(
            ritual.nome,
          ),
        )
      ) {
        return false;
      }

      return true;
    },
  );
}

export function criarRitualManualArquivos(
  dados = {},
) {
  const circulo =
    Math.min(
      4,
      Math.max(
        1,
        Number(
          dados.circulo,
        ) || 1,
      ),
    );

  const resumo =
    String(
      dados.resumo ||
        dados.descricao ||
        "",
    );

  const ritualManual = {
    id:
      dados.id ||
      criarIdRitual(),

    nome:
      String(
        dados.nome ||
          "Ritual sem nome",
      ),

    tipo:
      String(
        dados.tipo ||
          "Ritual",
      ),

    circulo,

    nexMinimo:
      Number(
        dados.nexMinimo,
      ) ||
      NEX_POR_CIRCULO[
        circulo
      ] ||
      5,

    custo:
      String(
        dados.custo ||
          CUSTO_POR_CIRCULO[
            circulo
          ] ||
          "1 PE",
      ),

    elemento:
      String(
        dados.elemento || "",
      ),

    resumo,

    descricao: resumo,

    execucao:
      String(
        dados.execucao || "",
      ),

    alcance:
      String(
        dados.alcance || "",
      ),

    alvo:
      String(
        dados.alvo || "",
      ),

    area:
      String(
        dados.area || "",
      ),

    alvoOuArea:
      String(
        dados.alvoOuArea || "",
      ),

    efeito:
      String(
        dados.efeito || "",
      ),

    duracao:
      String(
        dados.duracao || "",
      ),

    resistencia:
      String(
        dados.resistencia || "",
      ),

    requisito:
      String(
        dados.requisito || "",
      ),

    descricaoCompleta:
      String(
        dados.descricaoCompleta ||
          dados.descricao ||
          resumo,
      ),

    discenteCusto:
      String(
        dados.discenteCusto || "",
      ),

    discente:
      String(
        dados.discente || "",
      ),

    verdadeiroCusto:
      String(
        dados.verdadeiroCusto || "",
      ),

    verdadeiro:
      String(
        dados.verdadeiro || "",
      ),

    automatico: false,
  };

  return {
    ...ritualManual,

    textoCompleto:
      String(
        dados.textoCompleto ||
          montarTextoCompleto(
            ritualManual,
          ),
      ),
  };
}

const rituaisArquivos = {
  catalogo:
    RITUAIS_ARQUIVOS,

  podeUsar:
    fichaPodeUsarRituaisArquivos,

  circuloMaximo:
    obterCirculoMaximoRituaisArquivos,

  estaLiberado:
    ritualEstaLiberadoArquivos,

  liberados:
    obterRituaisLiberadosArquivos,

  disponiveis:
    obterRituaisDisponiveisArquivos,

  criarManual:
    criarRitualManualArquivos,
};

export default rituaisArquivos;