import {
  CLASSES_CATALOGO_ARQUIVOS,
  ORIGENS_ARQUIVOS,
  TRILHAS_ARQUIVOS,
} from "./catalogoArquivos.js";

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

  return Math.max(
    0,
    Number(
      encontrado?.[0],
    ) || 5,
  );
}

function criarId(texto) {
  return normalizarTexto(texto)
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

export const HABILIDADES_CATALOGO_ARQUIVOS = [
  {
    id: "olhos-abertos",
    nome: "Olhos Abertos",
    tipo: "Talento de origem",
    origem: "Batedor",
    descricao:
      "Ajuda a notar emboscadas, rastros e sinais de perigo.",
  },
  {
    id: "saber-e-poder",
    nome: "Saber e Poder",
    tipo: "Talento de origem",
    origem: "Acadêmico",
    descricao:
      "Usa estudo e pesquisa para preparar respostas melhores.",
  },
  {
    id: "faro-para-pistas",
    nome: "Faro para Pistas",
    tipo: "Talento de origem",
    origem: "Investigador",
    descricao:
      "Facilita encontrar pistas relevantes em cenas complicadas.",
  },
  {
    id: "para-bellum",
    nome: "Para Bellum",
    tipo: "Talento de origem",
    origem: "Militar",
    descricao:
      "A experiência de combate ajuda em situações armadas.",
  },
  {
    id: "ferramentas-de-trabalho",
    nome: "Ferramentas de Trabalho",
    tipo: "Talento de origem",
    origem: "Operário",
    descricao:
      "Permite aproveitar ferramentas comuns de forma eficiente.",
  },

  {
    id: "ataque-especial",
    nome: "Ataque Especial",
    tipo: "Habilidade de classe",
    classe: "Combatente",
    nexMinimo: 5,
    automatica: true,
    descricao:
      "Permite gastar energia para melhorar ataques, aumentando a chance de acerto ou o impacto.",
  },
  {
    id: "protecao-pesada",
    nome: "Proteção Pesada",
    tipo: "Poder de Combatente",
    classe: "Combatente",
    nexMinimo: 15,
    descricao:
      "Permite usar proteções mais robustas, em troca de maior peso e limitações.",
  },

  {
    id: "ecletico",
    nome: "Eclético",
    tipo: "Habilidade de classe",
    classe: "Especialista",
    nexMinimo: 5,
    automatica: true,
    descricao:
      "Permite se virar em várias perícias, mesmo quando não possui o treinamento ideal.",
  },
  {
    id: "perito",
    nome: "Perito",
    tipo: "Habilidade de classe",
    classe: "Especialista",
    nexMinimo: 5,
    automatica: true,
    descricao:
      "Melhora testes de perícias importantes, representando conhecimento prático refinado.",
  },
  {
    id: "engenhosidade",
    nome: "Engenhosidade",
    tipo: "Habilidade de classe",
    classe: "Especialista",
    nexMinimo: 40,
    automatica: true,
    descricao:
      "Usa Intelecto e improviso para resolver problemas técnicos ou táticos.",
  },

  {
    id: "escolhido-pelo-outro-lado",
    nome: "Escolhido pelo Outro Lado",
    tipo: "Habilidade de classe",
    classe: "Ocultista",
    nexMinimo: 5,
    automatica: true,
    descricao:
      "Conecta o personagem ao paranormal e habilita o uso de rituais.",
  },
  {
    id: "conjurar-ritual",
    nome: "Conjurar Ritual",
    tipo: "Habilidade de classe",
    classe: "Ocultista",
    nexMinimo: 5,
    automatica: true,
    descricao:
      "Permite usar rituais conhecidos durante investigação e combate.",
  },
  {
    id: "camuflar-ocultismo",
    nome: "Camuflar Ocultismo",
    tipo: "Poder de Ocultista",
    classe: "Ocultista",
    nexMinimo: 15,
    descricao:
      "Ajuda a esconder sinais de rituais e atividades paranormais.",
  },

  {
    id: "favorita",
    nome: "Favorita",
    tipo: "Habilidade de trilha",
    classe: "Combatente",
    trilha: "Aniquilador",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Escolhe uma arma principal e reduz o custo para aprimorá-la.",
  },
  {
    id: "inspirar-aliados",
    nome: "Inspirar Aliados",
    tipo: "Habilidade de trilha",
    classe: "Combatente",
    trilha: "Comandante de Campo",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Usa comando tático para apoiar as jogadas dos aliados.",
  },
  {
    id: "mao-pesada",
    nome: "Mão Pesada",
    tipo: "Habilidade de trilha",
    classe: "Combatente",
    trilha: "Guerreiro",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Pressiona o inimigo no corpo a corpo com golpes brutais.",
  },
  {
    id: "iniciativa-aprimorada",
    nome: "Iniciativa Aprimorada",
    tipo: "Habilidade de trilha",
    classe: "Combatente",
    trilha: "Operações Especiais",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Age rapidamente e ganha vantagem no começo dos confrontos.",
  },
  {
    id: "casca-grossa",
    nome: "Casca Grossa",
    tipo: "Habilidade de trilha",
    classe: "Combatente",
    trilha: "Tropa de Choque",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Absorve mais castigo e permanece protegendo a equipe.",
  },

  {
    id: "ataque-furtivo",
    nome: "Ataque Furtivo",
    tipo: "Habilidade de trilha",
    classe: "Especialista",
    trilha: "Infiltrador",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Causa mais impacto quando age escondido ou pega o alvo desprevenido.",
  },
  {
    id: "paramedico",
    nome: "Paramédico",
    tipo: "Habilidade de trilha",
    classe: "Especialista",
    trilha: "Médico de Campo",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Melhora o atendimento emergencial e a recuperação durante a missão.",
  },
  {
    id: "eloquencia",
    nome: "Eloquência",
    tipo: "Habilidade de trilha",
    classe: "Especialista",
    trilha: "Negociador",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Usa fala e leitura social para conduzir conflitos.",
  },
  {
    id: "remendao",
    nome: "Remendão",
    tipo: "Habilidade de trilha",
    classe: "Especialista",
    trilha: "Técnico",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Improvisa consertos e usa equipamentos com mais eficiência.",
  },

  {
    id: "ampliar-ritual",
    nome: "Ampliar Ritual",
    tipo: "Habilidade de trilha",
    classe: "Ocultista",
    trilha: "Conduíte",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Aumenta o controle sobre o alcance e a intensidade dos rituais.",
  },
  {
    id: "poder-do-sacrificio",
    nome: "Poder do Sacrifício",
    tipo: "Habilidade de trilha",
    classe: "Ocultista",
    trilha: "Flagelador",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Converte dor em força paranormal quando a situação exige.",
  },
  {
    id: "grimorio",
    nome: "Grimório",
    tipo: "Habilidade de trilha",
    classe: "Ocultista",
    trilha: "Graduado",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Organiza o conhecimento ocultista e amplia as opções de ritual.",
  },
  {
    id: "pressentimento",
    nome: "Pressentimento",
    tipo: "Habilidade de trilha",
    classe: "Ocultista",
    trilha: "Intuitivo",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Sente ameaças paranormais e resiste melhor a efeitos ocultos.",
  },
  {
    id: "lamina-maldita",
    nome: "Lâmina Maldita",
    tipo: "Habilidade de trilha",
    classe: "Ocultista",
    trilha: "Lâmina Paranormal",
    nexMinimo: 10,
    automatica: true,
    descricao:
      "Usa energia paranormal para fortalecer ataques realizados com uma arma.",
  },

  {
    id: "afortunado",
    nome: "Afortunado",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Permite refazer testes em momentos importantes, representando sorte acima do normal.",
  },
  {
    id: "calejado",
    nome: "Calejado",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Aumenta a resistência do personagem, ajudando a suportar ferimentos e pressões físicas.",
  },
  {
    id: "discreto",
    nome: "Discreto",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Facilita agir sem chamar atenção, esconder rastros e se mover com cautela.",
  },
  {
    id: "inventario-otimizado",
    nome: "Inventário Otimizado",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Melhora o aproveitamento da carga e dos espaços para carregar equipamentos.",
  },
  {
    id: "ninja-urbano",
    nome: "Ninja Urbano",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Ajuda em mobilidade, furtividade e ações rápidas em ambientes urbanos.",
  },
  {
    id: "potencial-aprimorado",
    nome: "Potencial Aprimorado",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Aumenta a reserva de energia para usar habilidades especiais com mais frequência.",
  },
  {
    id: "reflexos-defensivos",
    nome: "Reflexos Defensivos",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Melhora a reação defensiva e ajuda a evitar ataques.",
  },
  {
    id: "saque-rapido",
    nome: "Saque Rápido",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Facilita preparar, sacar ou trocar equipamentos durante cenas de ação.",
  },
  {
    id: "treinamento-em-pericia",
    nome: "Treinamento em Perícia",
    tipo: "Poder",
    nexMinimo: 15,
    descricao:
      "Concede treinamento adicional em perícias escolhidas.",
  },
];

export const MARCOS_NEX_ARQUIVOS = [
  {
    id: "aumento-atributo-20",
    nome: "Aumento de Atributo",
    tipo: "Marco de NEX",
    nexMinimo: 20,
    descricao:
      "No NEX 20%, aumente um atributo em 1 ponto.",
  },
  {
    id: "grau-treinamento-35",
    nome: "Grau de Treinamento",
    tipo: "Marco de NEX",
    nexMinimo: 35,
    descricao:
      "No NEX 35%, aumente o grau de treinamento das perícias permitidas pela classe.",
  },
  {
    id: "aumento-atributo-50",
    nome: "Aumento de Atributo",
    tipo: "Marco de NEX",
    nexMinimo: 50,
    descricao:
      "No NEX 50%, aumente um atributo em 1 ponto.",
  },
  {
    id: "versatilidade-50",
    nome: "Versatilidade",
    tipo: "Marco de NEX",
    nexMinimo: 50,
    descricao:
      "No NEX 50%, escolha um poder da classe ou a primeira habilidade de outra trilha da mesma classe.",
  },
  {
    id: "grau-treinamento-70",
    nome: "Grau de Treinamento",
    tipo: "Marco de NEX",
    nexMinimo: 70,
    descricao:
      "No NEX 70%, aumente novamente o grau de treinamento das perícias permitidas.",
  },
  {
    id: "aumento-atributo-80",
    nome: "Aumento de Atributo",
    tipo: "Marco de NEX",
    nexMinimo: 80,
    descricao:
      "No NEX 80%, aumente um atributo em 1 ponto.",
  },
  {
    id: "aumento-atributo-95",
    nome: "Aumento de Atributo",
    tipo: "Marco de NEX",
    nexMinimo: 95,
    descricao:
      "No NEX 95%, aumente um atributo em 1 ponto.",
  },
];

function removerRepetidos(lista) {
  const encontrados =
    new Set();

  return lista.filter(
    (habilidade) => {
      const chave =
        `${normalizarTexto(
          habilidade.tipo,
        )}:${normalizarTexto(
          habilidade.nome,
        )}`;

      if (
        encontrados.has(chave)
      ) {
        return false;
      }

      encontrados.add(chave);

      return true;
    },
  );
}

function buscarOrigem(nomeOrigem) {
  return (
    ORIGENS_ARQUIVOS.find(
      (origem) =>
        normalizarTexto(
          origem.nome,
        ) ===
        normalizarTexto(
          nomeOrigem,
        ),
    ) || null
  );
}

function buscarClasse(nomeClasse) {
  return (
    CLASSES_CATALOGO_ARQUIVOS.find(
      (classe) =>
        normalizarTexto(
          classe.nome,
        ) ===
        normalizarTexto(
          nomeClasse,
        ),
    ) || null
  );
}

function buscarTrilha(nomeTrilha) {
  return (
    TRILHAS_ARQUIVOS.find(
      (trilha) =>
        normalizarTexto(
          trilha.nome,
        ) ===
        normalizarTexto(
          nomeTrilha,
        ),
    ) || null
  );
}

function buscarHabilidadePorNome(
  nomeHabilidade,
) {
  return (
    HABILIDADES_CATALOGO_ARQUIVOS.find(
      (habilidade) =>
        normalizarTexto(
          habilidade.nome,
        ) ===
        normalizarTexto(
          nomeHabilidade,
        ),
    ) || null
  );
}

export function obterHabilidadesAutomaticasArquivos(
  ficha = {},
) {
  const nex =
    lerValorNex(ficha.nex);

  const origem =
    buscarOrigem(
      ficha.origem,
    );

  const classe =
    buscarClasse(
      ficha.classe,
    );

  const trilha =
    buscarTrilha(
      ficha.trilha,
    );

  const automaticas = [];

  if (origem) {
    automaticas.push({
      id:
        `origem-${origem.id}`,
      nome: origem.nome,
      tipo: "Origem escolhida",
      descricao:
        origem.descricao,
      detalhes:
        `Perícias: ${origem.pericias.join(
          " e ",
        )}.`,
      automatica: true,
    });

    if (origem.talento) {
      const talentoCatalogado =
        buscarHabilidadePorNome(
          origem.talento,
        );

      automaticas.push(
        talentoCatalogado
          ? {
              ...talentoCatalogado,
              automatica: true,
            }
          : {
              id:
                `talento-${origem.id}`,
              nome:
                origem.talento,
              tipo:
                "Talento de origem",
              origem:
                origem.nome,
              descricao:
                `Talento concedido pela origem ${origem.nome}.`,
              detalhes:
                `Perícias da origem: ${origem.pericias.join(
                  " e ",
                )}.`,
              automatica: true,
            },
      );
    }
  }

  if (classe) {
    automaticas.push({
      id:
        `classe-${classe.id}`,
      nome: classe.nome,
      tipo: "Classe escolhida",
      descricao:
        classe.descricao,
      automatica: true,
    });
  }

  if (trilha) {
    automaticas.push({
      id:
        `trilha-${trilha.id}`,
      nome: trilha.nome,
      tipo: "Trilha escolhida",
      classe:
        trilha.classe,
      descricao:
        trilha.descricao,
      automatica: true,
    });
  }

  const habilidadesDaFicha =
    HABILIDADES_CATALOGO_ARQUIVOS.filter(
      (habilidade) => {
        if (
          habilidade.automatica !==
          true
        ) {
          return false;
        }

        if (
          nex <
          Number(
            habilidade.nexMinimo ||
              0,
          )
        ) {
          return false;
        }

        if (
          habilidade.classe &&
          normalizarTexto(
            habilidade.classe,
          ) !==
            normalizarTexto(
              ficha.classe,
            )
        ) {
          return false;
        }

        if (
          habilidade.trilha &&
          normalizarTexto(
            habilidade.trilha,
          ) !==
            normalizarTexto(
              ficha.trilha,
            )
        ) {
          return false;
        }

        return true;
      },
    );

  const marcosLiberados =
    MARCOS_NEX_ARQUIVOS.filter(
      (marco) =>
        nex >= marco.nexMinimo,
    ).map((marco) => ({
      ...marco,
      automatica: true,
    }));

  return removerRepetidos([
    ...automaticas,
    ...habilidadesDaFicha,
    ...marcosLiberados,
  ]);
}

export function obterHabilidadesDisponiveisArquivos(
  ficha = {},
) {
  const nex =
    lerValorNex(ficha.nex);

  return HABILIDADES_CATALOGO_ARQUIVOS.filter(
    (habilidade) => {
      if (
        habilidade.automatica ===
        true
      ) {
        return false;
      }

      if (
        nex <
        Number(
          habilidade.nexMinimo ||
            0,
        )
      ) {
        return false;
      }

      if (
        habilidade.origem &&
        normalizarTexto(
          habilidade.origem,
        ) !==
          normalizarTexto(
            ficha.origem,
          )
      ) {
        return false;
      }

      if (
        habilidade.classe &&
        normalizarTexto(
          habilidade.classe,
        ) !==
          normalizarTexto(
            ficha.classe,
          )
      ) {
        return false;
      }

      if (
        habilidade.trilha &&
        normalizarTexto(
          habilidade.trilha,
        ) !==
          normalizarTexto(
            ficha.trilha,
          )
      ) {
        return false;
      }

      return true;
    },
  );
}

export function criarHabilidadeManualArquivos(
  valoresIniciais = {},
) {
  const agora =
    Date.now();

  const nome =
    String(
      valoresIniciais.nome ||
        "Nova habilidade",
    );

  return {
    id:
      valoresIniciais.id ||
      `habilidade-${agora}-${criarId(
        nome,
      )}`,
    nome,
    tipo:
      valoresIniciais.tipo ||
      "Habilidade manual",
    descricao:
      valoresIniciais.descricao ||
      "",
    automatica: false,
    ...valoresIniciais,
  };
}

const habilidadesArquivos = {
  catalogo:
    HABILIDADES_CATALOGO_ARQUIVOS,
  marcos:
    MARCOS_NEX_ARQUIVOS,
  obterAutomaticas:
    obterHabilidadesAutomaticasArquivos,
  obterDisponiveis:
    obterHabilidadesDisponiveisArquivos,
  criarManual:
    criarHabilidadeManualArquivos,
};

export default habilidadesArquivos;