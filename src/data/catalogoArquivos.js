export const CLASSES_ARQUIVOS = [
  "Combatente",
  "Especialista",
  "Ocultista",
];

export const CLASSES_CATALOGO_ARQUIVOS = [
  {
    id: "combatente",
    nome: "Combatente",
    tipo: "Classe",
    descricao:
      "Foco em combate direto, resistência e proteção do grupo.",
  },
  {
    id: "especialista",
    nome: "Especialista",
    tipo: "Classe",
    descricao:
      "Foco em perícias, investigação, suporte técnico e soluções práticas.",
  },
  {
    id: "ocultista",
    nome: "Ocultista",
    tipo: "Classe",
    descricao:
      "Foco em rituais, conhecimento paranormal e efeitos sobrenaturais.",
  },
];

function criarOrigem(dados) {
  return {
    tipo: "Origem",
    ...dados,

    talento:
      dados?.poder?.nome ||
      dados?.talento ||
      "",
  };
}

export const ORIGENS_ARQUIVOS = [
  criarOrigem({
    id: "academico",
    nome: "Acadêmico",

    descricao:
      "Você dedicou parte da vida ao estudo, à pesquisa e à produção de conhecimento.",

    pericias: [
      "Ciências",
      "Investigação",
    ],

    poder: {
      nome: "Saber é Poder",
      tipo: "ativado",
      custoPe: 2,

      descricao:
        "Ao realizar um teste baseado em Intelecto, você pode gastar 2 PE para receber +5 nesse teste.",

      efeitos: {
        bonusTesteIntelecto: 5,
      },
    },
  }),

  criarOrigem({
    id: "agente-de-saude",
    nome: "Agente de Saúde",

    descricao:
      "Você trabalhou cuidando de pessoas, tratando ferimentos e lidando com emergências.",

    pericias: [
      "Intuição",
      "Medicina",
    ],

    poder: {
      nome: "Técnica Medicinal",
      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Sempre que cura uma pessoa, você soma seu Intelecto ao total de PV recuperados.",

      efeitos: {
        intelectoNaCura: true,
      },
    },
  }),

  criarOrigem({
    id: "amnesico",
    nome: "Amnésico",

    descricao:
      "Você não se recorda claramente de quem era antes de entrar em contato com a Ordem.",

    pericias: [],

    periciasEspeciais: {
      quantidade: 2,
      escolha: "mestre",

      descricao:
        "O mestre escolhe duas perícias relacionadas ao passado esquecido do personagem.",
    },

    poder: {
      nome: "Vislumbres do Passado",
      tipo: "condicional",
      custoPe: 0,

      descricao:
        "Uma vez por sessão, você pode tentar reconhecer algo ligado ao seu passado. Em caso de sucesso, recebe uma informação útil e PE temporários conforme a regra da origem.",

      efeitos: {
        usosPorSessao: 1,
        peTemporarios: "1d4",
      },
    },
  }),

  criarOrigem({
    id: "artista",
    nome: "Artista",

    descricao:
      "Você viveu de apresentações, criação artística ou exposição pública.",

    pericias: [
      "Artes",
      "Enganação",
    ],

    poder: {
      nome: "Magnum Opus",
      tipo: "condicional",
      custoPe: 0,

      descricao:
        "Uma vez por missão, determine que uma pessoa reconhece sua obra. Você recebe +5 em testes de Presença e de perícias baseadas em Presença contra essa pessoa.",

      efeitos: {
        bonusPresencaContraFa: 5,
        usosPorMissao: 1,
      },
    },
  }),

  criarOrigem({
    id: "atleta",
    nome: "Atleta",

    descricao:
      "Você treinou o corpo para competir, superar limites e reagir sob pressão.",

    pericias: [
      "Acrobacia",
      "Atletismo",
    ],

    poder: {
      nome: "110%",
      tipo: "ativado",
      custoPe: 2,

      descricao:
        "Ao realizar um teste de perícia baseado em Força ou Agilidade, exceto Luta e Pontaria, você pode gastar 2 PE para receber +5.",

      efeitos: {
        bonusTesteFisico: 5,
      },
    },
  }),

  criarOrigem({
    id: "chef",
    nome: "Chef",

    descricao:
      "Você aprendeu a preparar refeições capazes de recuperar o corpo e o ânimo de uma equipe.",

    pericias: [
      "Fortitude",
      "Profissão",
    ],

    detalhePericias: {
      profissao: "Cozinheiro",
    },

    poder: {
      nome: "Ingrediente Secreto",
      tipo: "condicional",
      custoPe: 0,

      descricao:
        "Durante um interlúdio, ao preparar uma refeição, você e os personagens que comerem recebem o benefício de dois pratos. Benefícios iguais podem se acumular.",

      efeitos: {
        beneficiosPrato: 2,
      },
    },
  }),

  criarOrigem({
    id: "criminoso",
    nome: "Criminoso",

    descricao:
      "Você sobreviveu usando contatos ilegais, furtividade e métodos pouco oficiais.",

    pericias: [
      "Crime",
      "Furtividade",
    ],

    poder: {
      nome: "O Crime Compensa",
      tipo: "escolha",
      custoPe: 0,

      descricao:
        "Ao fim de uma missão, escolha um item encontrado. Na missão seguinte, você pode levá-lo sem que ele conte no limite de itens por patente.",

      efeitos: {
        itemIgnoraLimitePatente: 1,
      },
    },
  }),

  criarOrigem({
    id: "cultista-arrependido",
    nome: "Cultista Arrependido",

    descricao:
      "Você participou de práticas ocultistas antes de reconhecer o perigo do Outro Lado.",

    pericias: [
      "Ocultismo",
      "Religião",
    ],

    poder: {
      nome: "Traços do Outro Lado",
      tipo: "escolha",
      custoPe: 0,

      descricao:
        "Você começa com um poder paranormal à sua escolha, mas inicia com metade da Sanidade inicial normal da sua classe.",

      efeitos: {
        escolherPoderParanormal: 1,
        sanidadeInicialMetade: true,
      },
    },
  }),

  criarOrigem({
    id: "desgarrado",
    nome: "Desgarrado",

    descricao:
      "Você viveu em condições difíceis e desenvolveu resistência acima do normal.",

    pericias: [
      "Fortitude",
      "Sobrevivência",
    ],

    poder: {
      nome: "Calejado",
      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Você recebe +1 PV para cada 5% de NEX.",

      efeitos: {
        pvPorNivelExposicao: 1,
      },
    },
  }),

  criarOrigem({
    id: "engenheiro",
    nome: "Engenheiro",

    descricao:
      "Você aprendeu a projetar, adaptar e utilizar equipamentos especializados.",

    pericias: [
      "Profissão",
      "Tecnologia",
    ],

    poder: {
      nome: "Ferramenta Favorita",
      tipo: "escolha",
      custoPe: 0,

      descricao:
        "Escolha um item que não seja uma arma. Para você, esse item conta como uma categoria abaixo.",

      efeitos: {
        reducaoCategoriaItemEscolhido: 1,
        proibeArma: true,
      },
    },
  }),

  criarOrigem({
    id: "executivo",
    nome: "Executivo",

    descricao:
      "Você trabalhou administrando equipes, documentos, recursos e processos.",

    pericias: [
      "Diplomacia",
      "Profissão",
    ],

    poder: {
      nome: "Processo Otimizado",
      tipo: "ativado",
      custoPe: 2,

      descricao:
        "Ao realizar um teste durante um teste estendido ou ao analisar documentos físicos ou digitais, você pode gastar 2 PE para receber +5.",

      efeitos: {
        bonusProcesso: 5,
      },
    },
  }),

  criarOrigem({
    id: "investigador",
    nome: "Investigador",

    descricao:
      "Você está acostumado a examinar cenas, entrevistar pessoas e relacionar evidências.",

    pericias: [
      "Investigação",
      "Percepção",
    ],

    poder: {
      nome: "Faro para Pistas",
      tipo: "ativado",
      custoPe: 1,

      descricao:
        "Uma vez por cena, ao procurar pistas, você pode gastar 1 PE para receber +5 no teste.",

      efeitos: {
        bonusProcurarPistas: 5,
        usosPorCena: 1,
      },
    },
  }),

  criarOrigem({
    id: "lutador",
    nome: "Lutador",

    descricao:
      "Você aprendeu a vencer confrontos usando técnica, impacto e resistência.",

    pericias: [
      "Luta",
      "Reflexos",
    ],

    poder: {
      nome: "Mão Pesada",
      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Você recebe +2 nas rolagens de dano corpo a corpo.",

      efeitos: {
        bonusDanoCorpoACorpo: 2,
      },
    },
  }),

  criarOrigem({
    id: "magnata",
    nome: "Magnata",

    descricao:
      "Você possui influência financeira, patrimônio ou acesso privilegiado a recursos.",

    pericias: [
      "Diplomacia",
      "Pilotagem",
    ],

    poder: {
      nome: "Patrocinador da Ordem",
      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Seu limite de crédito é considerado um nível acima.",

      efeitos: {
        aumentoNivelCredito: 1,
      },
    },
  }),

  criarOrigem({
    id: "mercenario",
    nome: "Mercenário",

    descricao:
      "Você foi pago para lutar, proteger pessoas ou cumprir missões perigosas.",

    pericias: [
      "Iniciativa",
      "Intimidação",
    ],

    poder: {
      nome: "Posição de Combate",
      tipo: "ativado",
      custoPe: 2,

      descricao:
        "No primeiro turno de uma cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.",

      efeitos: {
        acaoMovimentoPrimeiroTurno: 1,
      },
    },
  }),

  criarOrigem({
    id: "militar",
    nome: "Militar",

    descricao:
      "Você recebeu treinamento de combate, disciplina e uso de armamento.",

    pericias: [
      "Pontaria",
      "Tática",
    ],

    poder: {
      nome: "Para Bellum",
      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Você recebe +2 nas rolagens de dano com armas de fogo.",

      efeitos: {
        bonusDanoArmaFogo: 2,
      },
    },
  }),

  criarOrigem({
    id: "operario",
    nome: "Operário",

    descricao:
      "Você trabalhou com esforço físico, ferramentas e atividades práticas.",

    pericias: [
      "Fortitude",
      "Profissão",
    ],

    poder: {
      nome: "Ferramenta de Trabalho",
      tipo: "escolha",
      custoPe: 0,

      descricao:
        "Escolha uma arma simples ou tática relacionada à sua profissão. Você sabe usá-la e recebe +1 nos testes de ataque, +1 nas rolagens de dano e +1 na margem de ameaça com ela.",

      efeitos: {
        bonusAtaqueArmaEscolhida: 1,
        bonusDanoArmaEscolhida: 1,
        bonusMargemAmeacaArmaEscolhida: 1,
      },
    },
  }),

  criarOrigem({
    id: "policial",
    nome: "Policial",

    descricao:
      "Você foi treinado para patrulhar, observar ameaças e reagir a confrontos.",

    pericias: [
      "Percepção",
      "Pontaria",
    ],

    poder: {
      nome: "Patrulha",
      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Você recebe +2 na Defesa.",

      efeitos: {
        defesa: 2,
      },
    },
  }),

  criarOrigem({
    id: "religioso",
    nome: "Religioso",

    descricao:
      "Você aprendeu a oferecer orientação, consolo e apoio espiritual.",

    pericias: [
      "Religião",
      "Vontade",
    ],

    poder: {
      nome: "Acalentar",
      tipo: "condicional",
      custoPe: 0,

      descricao:
        "Você recebe +5 em Religião para acalmar uma pessoa. Quem for acalmado recupera 1d6 + sua Presença de Sanidade.",

      efeitos: {
        bonusReligiaoAcalmar: 5,
        recuperacaoSanidade:
          "1d6 + Presença",
      },
    },
  }),

  criarOrigem({
    id: "servidor-publico",
    nome: "Servidor Público",

    descricao:
      "Você trabalhou atendendo pessoas e fazendo a máquina pública funcionar.",

    pericias: [
      "Intuição",
      "Vontade",
    ],

    poder: {
      nome: "Espírito Cívico",
      tipo: "ativado",
      custoPe: 1,

      descricao:
        "Ao realizar um teste para ajudar, você pode gastar 1 PE para aumentar em +2 o bônus concedido.",

      efeitos: {
        bonusAjudaAdicional: 2,
      },
    },
  }),

  criarOrigem({
    id: "teorico-da-conspiracao",
    nome: "Teórico da Conspiração",

    descricao:
      "Você passou anos investigando explicações escondidas e fenômenos que ninguém queria levar a sério.",

    pericias: [
      "Investigação",
      "Ocultismo",
    ],

    poder: {
      nome: "Eu Já Sabia",
      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Você recebe resistência a dano mental igual ao seu Intelecto.",

      efeitos: {
        resistenciaMentalIgualIntelecto:
          true,
      },
    },
  }),

  criarOrigem({
    id: "ti",
    nome: "T.I.",

    descricao:
      "Você trabalhou com computadores, redes, bancos de dados e pesquisa digital.",

    pericias: [
      "Investigação",
      "Tecnologia",
    ],

    poder: {
      nome: "Motor de Busca",
      tipo: "ativado",
      custoPe: 2,

      descricao:
        "Quando possuir acesso à internet e o mestre permitir, você pode gastar 2 PE para substituir um teste de perícia por um teste de Tecnologia.",

      efeitos: {
        substituirTestePorTecnologia:
          true,
      },
    },
  }),

  criarOrigem({
    id: "trabalhador-rural",
    nome: "Trabalhador Rural",

    descricao:
      "Você aprendeu a sobreviver longe das cidades, lidar com animais e atravessar terrenos difíceis.",

    pericias: [
      "Adestramento",
      "Sobrevivência",
    ],

    poder: {
      nome: "Desbravador",
      tipo: "ativado",
      custoPe: 2,

      descricao:
        "Você pode gastar 2 PE para receber +5 em Adestramento ou Sobrevivência e não sofre redução de deslocamento causada por terreno difícil.",

      efeitos: {
        bonusAdestramentoSobrevivencia:
          5,

        ignoraTerrenoDificil:
          true,
      },
    },
  }),

  criarOrigem({
    id: "trambiqueiro",
    nome: "Trambiqueiro",

    descricao:
      "Você aprendeu a sobreviver usando lábia, disfarces e golpes.",

    pericias: [
      "Crime",
      "Enganação",
    ],

    poder: {
      nome: "Impostor",
      tipo: "ativado",
      custoPe: 2,

      descricao:
        "Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia por um teste de Enganação.",

      efeitos: {
        substituirTestePorEnganacao:
          true,

        usosPorCena: 1,
      },
    },
  }),

  criarOrigem({
    id: "universitario",
    nome: "Universitário",

    descricao:
      "Você ainda está em formação, mas compensa a pouca experiência com estudo e dedicação.",

    pericias: [
      "Atualidades",
      "Investigação",
    ],

    poder: {
      nome: "Dedicação",
      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Você recebe +1 PE em NEX 5% e +1 PE adicional a cada NEX ímpar seguinte. Seu limite de PE por turno aumenta em +1.",

      efeitos: {
        peExtraInicial: 1,
        peExtraACadaDezNex: 1,
        limitePePorTurno: 1,
      },
    },
  }),

  criarOrigem({
    id: "vitima",
    nome: "Vítima",

    descricao:
      "Você sobreviveu a um evento traumático e carrega cicatrizes que fortaleceram sua mente.",

    pericias: [
      "Reflexos",
      "Vontade",
    ],

    poder: {
      nome:
        "Cicatrizes Psicológicas",

      tipo: "automatico",
      custoPe: 0,

      descricao:
        "Você recebe +1 de Sanidade para cada 5% de NEX.",

      efeitos: {
        sanidadePorNivelExposicao:
          1,
      },
    },
  }),
];

export const TRILHAS_ARQUIVOS = [
  {
    id: "aniquilador",
    nome: "Aniquilador",
    classe: "Combatente",
    tipo: "Trilha",

    descricao:
      "Especialização em causar dano alto com armas favoritas.",
  },
  {
    id: "comandante-de-campo",
    nome: "Comandante de Campo",
    classe: "Combatente",
    tipo: "Trilha",

    descricao:
      "Coordena aliados, melhora posicionamento e abre oportunidades táticas.",
  },
  {
    id: "guerreiro",
    nome: "Guerreiro",
    classe: "Combatente",
    tipo: "Trilha",

    descricao:
      "Domina combate corpo a corpo e pressiona inimigos de perto.",
  },
  {
    id: "operacoes-especiais",
    nome: "Operações Especiais",
    classe: "Combatente",
    tipo: "Trilha",

    descricao:
      "Combate ágil, movimento rápido e respostas eficientes em crise.",
  },
  {
    id: "tropa-de-choque",
    nome: "Tropa de Choque",
    classe: "Combatente",
    tipo: "Trilha",

    descricao:
      "Aguenta dano, segura a linha de frente e protege o time.",
  },
  {
    id: "infiltrador",
    nome: "Infiltrador",
    classe: "Especialista",
    tipo: "Trilha",

    descricao:
      "Furtividade, ataques precisos e acesso a lugares protegidos.",
  },
  {
    id: "medico-de-campo",
    nome: "Médico de Campo",
    classe: "Especialista",
    tipo: "Trilha",

    descricao:
      "Mantém aliados vivos e estabiliza ferimentos durante a missão.",
  },
  {
    id: "negociador",
    nome: "Negociador",
    classe: "Especialista",
    tipo: "Trilha",

    descricao:
      "Resolve conflitos com fala, leitura social e pressão psicológica.",
  },
  {
    id: "tecnico",
    nome: "Técnico",
    classe: "Especialista",
    tipo: "Trilha",

    descricao:
      "Carrega recursos, conserta problemas e improvisa ferramentas.",
  },
  {
    id: "conduite",
    nome: "Conduíte",
    classe: "Ocultista",
    tipo: "Trilha",

    descricao:
      "Canaliza rituais com mais alcance, foco e controle.",
  },
  {
    id: "flagelador",
    nome: "Flagelador",
    classe: "Ocultista",
    tipo: "Trilha",

    descricao:
      "Transforma dor e sacrifício em energia paranormal.",
  },
  {
    id: "graduado",
    nome: "Graduado",
    classe: "Ocultista",
    tipo: "Trilha",

    descricao:
      "Estuda rituais com profundidade e amplia o repertório ocultista.",
  },
  {
    id: "intuitivo",
    nome: "Intuitivo",
    classe: "Ocultista",
    tipo: "Trilha",

    descricao:
      "Sente o paranormal antes de entender, resistindo melhor a seus efeitos.",
  },
  {
    id: "lamina-paranormal",
    nome: "Lâmina Paranormal",
    classe: "Ocultista",
    tipo: "Trilha",

    descricao:
      "Mistura rituais e armas para lutar de forma sobrenatural.",
  },
];

export const PATENTES_ARQUIVOS = [
  "Recruta",
  "Operador",
  "Agente Especial",
  "Oficial de Operações",
  "Agente de Elite",
];

export const NIVEIS_NEX = [
  "5%",
  "10%",
  "15%",
  "20%",
  "25%",
  "30%",
  "35%",
  "40%",
  "45%",
  "50%",
  "55%",
  "60%",
  "65%",
  "70%",
  "75%",
  "80%",
  "85%",
  "90%",
  "95%",
  "99%",
];

export const ATRIBUTOS_ARQUIVOS = [
  {
    id: "agilidade",
    sigla: "AGI",
    nome: "Agilidade",
  },
  {
    id: "forca",
    sigla: "FOR",
    nome: "Força",
  },
  {
    id: "intelecto",
    sigla: "INT",
    nome: "Intelecto",
  },
  {
    id: "presenca",
    sigla: "PRE",
    nome: "Presença",
  },
  {
    id: "vigor",
    sigla: "VIG",
    nome: "Vigor",
  },
];

export const PERICIAS_ARQUIVOS = [
  "Acrobacia",
  "Adestramento",
  "Artes",
  "Atletismo",
  "Atualidades",
  "Ciências",
  "Crime",
  "Diplomacia",
  "Enganação",
  "Fortitude",
  "Furtividade",
  "Iniciativa",
  "Intimidação",
  "Intuição",
  "Investigação",
  "Luta",
  "Medicina",
  "Ocultismo",
  "Percepção",
  "Pilotagem",
  "Pontaria",
  "Profissão",
  "Reflexos",
  "Religião",
  "Sobrevivência",
  "Tática",
  "Tecnologia",
  "Vontade",
];

export const TIPOS_ITEM_ARQUIVOS = [
  "Equipamento",
  "Arma",
  "Proteção",
  "Consumível",
  "Explosivo",
  "Item especial",
];

export const ELEMENTOS_RITUAL_ARQUIVOS = [
  "Conhecimento",
  "Energia",
  "Morte",
  "Sangue",
  "Medo",
];

export const CIRCULOS_RITUAL_ARQUIVOS = [
  {
    valor: 1,
    texto: "1º círculo",
  },
  {
    valor: 2,
    texto: "2º círculo",
  },
  {
    valor: 3,
    texto: "3º círculo",
  },
  {
    valor: 4,
    texto: "4º círculo",
  },
];

export const STATUS_MISSAO_ARQUIVOS = [
  {
    valor: "ativa",
    texto: "Ativa",
  },
  {
    valor: "pendente",
    texto: "Pendente",
  },
  {
    valor: "concluida",
    texto: "Concluída",
  },
  {
    valor: "falhou",
    texto: "Falhou",
  },
];

export const PRIORIDADES_MISSAO_ARQUIVOS = [
  {
    valor: "baixa",
    texto: "Baixa",
  },
  {
    valor: "normal",
    texto: "Normal",
  },
  {
    valor: "alta",
    texto: "Alta",
  },
  {
    valor: "critica",
    texto: "Crítica",
  },
];

export const STATUS_ARQUIVO_CAMPANHA = [
  {
    valor: "aberto",
    texto: "Aberto",
  },
  {
    valor: "andamento",
    texto: "Em andamento",
  },
  {
    valor: "encerrado",
    texto: "Encerrado",
  },
  {
    valor: "arquivado",
    texto: "Arquivado",
  },
];

const catalogoArquivos = {
  classes:
    CLASSES_ARQUIVOS,

  classesDetalhadas:
    CLASSES_CATALOGO_ARQUIVOS,

  origens:
    ORIGENS_ARQUIVOS,

  trilhas:
    TRILHAS_ARQUIVOS,

  patentes:
    PATENTES_ARQUIVOS,

  nex:
    NIVEIS_NEX,

  atributos:
    ATRIBUTOS_ARQUIVOS,

  pericias:
    PERICIAS_ARQUIVOS,

  tiposItem:
    TIPOS_ITEM_ARQUIVOS,

  elementosRitual:
    ELEMENTOS_RITUAL_ARQUIVOS,

  circulosRitual:
    CIRCULOS_RITUAL_ARQUIVOS,

  statusMissao:
    STATUS_MISSAO_ARQUIVOS,

  prioridadesMissao:
    PRIORIDADES_MISSAO_ARQUIVOS,

  statusArquivo:
    STATUS_ARQUIVO_CAMPANHA,
};

export default catalogoArquivos;