const DADOS_PADRAO_PROTECAO = {
  tipo: "Proteção",
  quantidade: 1,
  dano: "",
  critico: "",
  alcance: "",
  tipoDano: "",
  bonusCarga: 0,
  penalidadeMovimento: 0,
  ativo: true,
  propriedades: [],
  efeito: "",
};

function criarProtecao(dados) {
  return {
    ...DADOS_PADRAO_PROTECAO,
    ...dados,
  };
}

export const PROTECOES_ARQUIVOS = [
  criarProtecao({
    id: "protecao-leve",
    nome: "Proteção Leve",
    categoria: "Proteção leve",
    categoriaNumerica: 1,
    proficiencia: "Proteções leves",
    volume: 2,
    defesa: 5,
    protecao: 0,
    resistenciaDano: 0,
    penalidadeCarga: 0,
    empunhadura: "Vestida",
    imagem: "colete",
    propriedades: [
      "Vestida",
      "Proteção leve",
      "Defesa +5",
    ],
    efeito:
      "Enquanto estiver vestida e ativa, fornece +5 na Defesa. Um personagem sem proficiência em proteções leves sofre penalidade nos testes baseados em Força e Agilidade.",
    descricao:
      "Uma proteção relativamente discreta, representada por uma jaqueta reforçada, colete de kevlar ou conjunto semelhante. É comum entre policiais, seguranças e agentes que esperam enfrentar perigo, mas ainda precisam manter mobilidade. Quando vestida, aumenta a Defesa em +5. Ocupa 2 espaços no inventário e exige proficiência com proteções leves para ser usada sem penalidades.",
  }),

  criarProtecao({
    id: "protecao-pesada",
    nome: "Proteção Pesada",
    categoria: "Proteção pesada",
    categoriaNumerica: 2,
    proficiencia: "Proteções pesadas",
    volume: 5,
    defesa: 10,
    protecao: 2,
    resistenciaDano: 2,
    tiposResistidos: [
      "Balístico",
      "Corte",
      "Impacto",
      "Perfuração",
    ],
    penalidadeCarga: -5,
    empunhadura: "Vestida",
    imagem: "armadura",
    propriedades: [
      "Vestida",
      "Proteção pesada",
      "Defesa +10",
      "Resistência física 2",
      "Penalidade de carga –5",
    ],
    efeito:
      "Enquanto estiver vestida e ativa, fornece +10 na Defesa e resistência 2 contra dano balístico, corte, impacto e perfuração. Impõe –5 em perícias afetadas por penalidade de carga.",
    descricao:
      "Um conjunto completo usado por equipes militares, forças especiais e tropas preparadas para confrontos intensos. Normalmente inclui capacete, ombreiras, joelheiras, caneleiras e diversas camadas de material resistente. Quando vestida, fornece +10 na Defesa e reduz em 2 o dano balístico, de corte, de impacto e de perfuração. Por ser pesada, desconfortável e volumosa, impõe –5 nos testes de perícias que sofrem penalidade de carga. Ocupa 5 espaços e exige proficiência com proteções pesadas.",
  }),

  criarProtecao({
    id: "escudo",
    nome: "Escudo",
    categoria: "Escudo",
    categoriaNumerica: 1,
    proficiencia: "Proteções pesadas",
    volume: 2,
    defesa: 2,
    protecao: 0,
    resistenciaDano: 0,
    penalidadeCarga: 0,
    empunhadura: "Uma mão",
    imagem: "escudo",
    propriedades: [
      "Empunhado",
      "Ocupa uma mão",
      "Defesa +2",
      "Acumula com proteção",
    ],
    efeito:
      "Precisa ser empunhado em uma mão para fornecer +2 na Defesa. Esse bônus acumula com a Defesa de uma proteção vestida. Para proficiência, conta como proteção pesada.",
    descricao:
      "Um escudo medieval, balístico ou moderno, como os utilizados por tropas de choque. Precisa permanecer empunhado em uma das mãos para conceder seu benefício, impedindo que essa mão seja usada para outro item. Enquanto estiver ativo, fornece +2 na Defesa. Esse bônus pode ser somado ao de uma Proteção Leve ou Pesada, mas não é permitido utilizar dois escudos simultaneamente. Para efeitos de proficiência e penalidades, o escudo é considerado uma proteção pesada.",
  }),
];

export const MODIFICACOES_PROTECOES_ARQUIVOS = [
  {
    id: "antibombas",
    nome: "Antibombas",
    tipo: "Modificação de proteção",
    aumentoCategoria: 1,
    protecoesPermitidas: [
      "protecao-pesada",
    ],
    efeito:
      "Fornece +5 em testes de resistência contra explosões e outros efeitos de área.",
    descricao:
      "A proteção recebe tratamento resistente ao calor, preenchimento contra estilhaços e um capacete com viseira que reduz luz intensa, impacto e ruído. Pode ser aplicada apenas em Proteção Pesada.",
  },

  {
    id: "blindada",
    nome: "Blindada",
    tipo: "Modificação de proteção",
    aumentoCategoria: 1,
    protecoesPermitidas: [
      "protecao-pesada",
    ],
    aumentoVolume: 1,
    resistenciaDano: 5,
    efeito:
      "Aumenta a resistência a dano da Proteção Pesada para 5 e aumenta seu espaço ocupado em 1.",
    descricao:
      "Placas de aço e cerâmica são adicionadas entre as camadas resistentes da proteção. O reforço melhora bastante a redução de dano, mas torna o conjunto ainda mais pesado e volumoso. Pode ser aplicada apenas em Proteção Pesada.",
  },

  {
    id: "discreta",
    nome: "Discreta",
    tipo: "Modificação de proteção",
    aumentoCategoria: 1,
    protecoesPermitidas: [
      "protecao-leve",
    ],
    reducaoVolume: 1,
    bonusOcultar: 5,
    efeito:
      "Reduz o espaço ocupado pela Proteção Leve em 1 e fornece +5 em testes de Crime para escondê-la.",
    descricao:
      "A proteção é produzida com material compacto e denso, reduzindo seu volume e tornando mais fácil escondê-la sob roupas comuns. Permite realizar o teste para ocultá-la mesmo sem treinamento em Crime. Não pode ser combinada com a modificação Reforçada.",
  },

  {
    id: "reforcada",
    nome: "Reforçada",
    tipo: "Modificação de proteção",
    aumentoCategoria: 1,
    protecoesPermitidas: [
      "protecao-leve",
      "protecao-pesada",
      "escudo",
    ],
    aumentoDefesa: 2,
    aumentoVolume: 1,
    efeito:
      "Aumenta a Defesa fornecida pela proteção em +2 e aumenta seu espaço ocupado em 1.",
    descricao:
      "Camadas extras, placas ou estruturas resistentes são adicionadas ao equipamento. A proteção se torna mais difícil de transportar, mas oferece cobertura superior. Uma Proteção Leve não pode possuir simultaneamente as modificações Reforçada e Discreta.",
  },
];

export const PROTECOES_LEVES_ARQUIVOS =
  PROTECOES_ARQUIVOS.filter(
    (protecao) =>
      protecao.proficiencia ===
      "Proteções leves",
  );

export const PROTECOES_PESADAS_ARQUIVOS =
  PROTECOES_ARQUIVOS.filter(
    (protecao) =>
      protecao.proficiencia ===
      "Proteções pesadas",
  );

export default PROTECOES_ARQUIVOS;