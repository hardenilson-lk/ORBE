const DADOS_PADRAO_PROTECAO = {
  tipo: "Proteção",
  quantidade: 1,
  ativo: true,
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

    proficiencia:
      "Proteções leves",

    volume: 2,
    defesa: 5,

    empunhadura: "Vestida",

    imagem: "colete",

    propriedades: [
      "Vestida",
      "Proteção leve",
      "Defesa +5",
      "Ocupa 2 espaços",
    ],

    efeito:
      "Enquanto estiver corretamente vestida e ativa, fornece +5 na Defesa. Um personagem sem proficiência com proteções leves sofre penalidade nos testes baseados em Força e Agilidade enquanto utiliza este equipamento.",

    descricao:
      "Uma proteção relativamente discreta, normalmente representada por uma jaqueta reforçada, um colete de kevlar ou um conjunto semelhante utilizado sob roupas comuns. É bastante usada por policiais, seguranças e agentes que precisam enfrentar perigo sem abrir mão da mobilidade. Suas camadas resistentes ajudam a absorver impactos e proteger áreas vitais, mas não transformam o usuário em uma muralha. Quando vestida, aumenta a Defesa em +5, ocupa 2 espaços no inventário e exige proficiência com proteções leves para ser utilizada sem penalidades.",

    comentario:
      "Não vai parar um caminhão. Mas talvez faça o monstro precisar morder duas vezes.",
  }),

  criarProtecao({
    id: "protecao-pesada",
    nome: "Proteção Pesada",

    categoria: "Proteção pesada",
    categoriaNumerica: 2,

    proficiencia:
      "Proteções pesadas",

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
      "Ocupa 5 espaços",
    ],

    efeito:
      "Enquanto estiver corretamente vestida e ativa, fornece +10 na Defesa e resistência 2 contra dano balístico, de corte, de impacto e de perfuração. Por causa de seu peso e rigidez, impõe –5 nos testes de perícias afetadas por penalidade de carga.",

    descricao:
      "Um conjunto completo de proteção utilizado por forças militares, tropas especiais e agentes preparados para confrontos intensos. Normalmente inclui capacete, ombreiras, joelheiras, caneleiras e diversas camadas de fibras resistentes e placas rígidas. Sua estrutura oferece excelente proteção contra disparos, lâminas, golpes e perfurações, mas limita movimentos delicados e torna longas caminhadas bastante cansativas. Quando vestida, fornece +10 na Defesa, reduz em 2 os danos físicos indicados, ocupa 5 espaços e exige proficiência com proteções pesadas.",

    comentario:
      "Você talvez não consiga correr do monstro. A boa notícia é que ele também vai demorar para atravessar tudo isso.",
  }),

  criarProtecao({
    id: "escudo",
    nome: "Escudo",

    categoria: "Escudo",
    categoriaNumerica: 1,

    proficiencia:
      "Proteções pesadas",

    volume: 2,
    defesa: 2,

    empunhadura: "Uma mão",

    imagem: "escudo",

    propriedades: [
      "Empunhado",
      "Ocupa uma mão",
      "Defesa +2",
      "Acumula com proteção",
      "Conta como proteção pesada",
      "Ocupa 2 espaços",
    ],

    efeito:
      "Precisa permanecer empunhado em uma das mãos para fornecer +2 na Defesa. Esse bônus acumula com a Defesa concedida por uma Proteção Leve ou Pesada. Para efeitos de proficiência e penalidades, o escudo é considerado uma proteção pesada. Não é possível receber o benefício de dois escudos ao mesmo tempo.",

    descricao:
      "Um escudo medieval, balístico ou moderno, como os utilizados por tropas de choque. Sua estrutura é feita para bloquear golpes, projéteis e ataques direcionados, criando uma barreira móvel entre o agente e aquilo que pretende matá-lo. O escudo ocupa uma das mãos enquanto estiver sendo utilizado, impedindo que essa mão empunhe outro item. Quando ativo, fornece +2 na Defesa, ocupa 2 espaços e pode ser combinado com uma proteção vestida.",

    comentario:
      "É basicamente uma porta portátil. Uma porta que você leva para lugares onde claramente deveria ter ficado em casa.",
  }),
];

export const MODIFICACOES_PROTECOES_ARQUIVOS = [
  {
    id: "antibombas",
    nome: "Antibombas",

    tipo:
      "Modificação de proteção",

    aumentoCategoria: 1,

    protecoesPermitidas: [
      "protecao-pesada",
    ],

    propriedades: [
      "Somente Proteção Pesada",
      "Categoria +I",
      "Resistência contra explosões +5",
    ],

    efeito:
      "Fornece +5 em testes de resistência contra explosões e outros efeitos de área enquanto a proteção estiver corretamente vestida.",

    descricao:
      "A proteção recebe tratamento resistente ao calor, camadas internas capazes de reduzir impactos, preenchimento contra estilhaços e um capacete com viseira preparada para diminuir luz intensa, ruído e ondas de choque. A modificação é pesada e especializada, podendo ser aplicada apenas em uma Proteção Pesada.",

    comentario:
      "Caso você tenha ouvido o clique, este é um excelente momento para lembrar se marcou mesmo esta modificação.",
  },

  {
    id: "blindada",
    nome: "Blindada",

    tipo:
      "Modificação de proteção",

    aumentoCategoria: 1,
    aumentoVolume: 1,

    protecoesPermitidas: [
      "protecao-pesada",
    ],

    resistenciaDano: 5,

    propriedades: [
      "Somente Proteção Pesada",
      "Categoria +I",
      "Espaços +1",
      "Resistência física 5",
    ],

    efeito:
      "Aumenta para 5 a resistência contra dano balístico, de corte, de impacto e de perfuração concedida pela Proteção Pesada. A proteção também passa a ocupar 1 espaço adicional.",

    descricao:
      "Placas adicionais de aço e cerâmica são instaladas entre as camadas resistentes da proteção. O reforço distribui melhor a força dos ataques e aumenta significativamente a capacidade de absorver impactos, mas também torna o equipamento mais pesado, rígido e difícil de transportar. Pode ser aplicada apenas em uma Proteção Pesada.",

    comentario:
      "Mais placas, mais segurança e uma chance consideravelmente menor de o elevador aceitar sua presença.",
  },

  {
    id: "discreta",
    nome: "Discreta",

    tipo:
      "Modificação de proteção",

    aumentoCategoria: 1,
    reducaoVolume: 1,
    bonusOcultar: 5,

    protecoesPermitidas: [
      "protecao-leve",
    ],

    modificacoesIncompativeis: [
      "reforcada",
    ],

    propriedades: [
      "Somente Proteção Leve",
      "Categoria +I",
      "Espaços –1",
      "Crime +5 para ocultar",
      "Incompatível com Reforçada",
    ],

    efeito:
      "Reduz em 1 o espaço ocupado pela Proteção Leve e fornece +5 em testes de Crime para escondê-la. O personagem pode realizar esse teste mesmo que não seja treinado em Crime. Não pode ser combinada com a modificação Reforçada.",

    descricao:
      "A proteção é produzida com materiais compactos e densos, costurados ou instalados de forma que possam permanecer escondidos sob roupas comuns. Suas placas são menores e melhor distribuídas, reduzindo o volume sem eliminar completamente a proteção. É ideal para missões em que aparecer usando equipamento militar levantaria perguntas demais.",

    comentario:
      "A melhor proteção é aquela que ninguém percebe até o momento em que alguma coisa ricocheteia.",
  },

  {
    id: "reforcada",
    nome: "Reforçada",

    tipo:
      "Modificação de proteção",

    aumentoCategoria: 1,
    aumentoDefesa: 2,
    aumentoVolume: 1,

    protecoesPermitidas: [
      "protecao-leve",
      "protecao-pesada",
      "escudo",
    ],

    propriedades: [
      "Categoria +I",
      "Defesa +2",
      "Espaços +1",
      "Proteção Leve: incompatível com Discreta",
    ],

    efeito:
      "Aumenta em +2 a Defesa fornecida pela proteção e faz com que o equipamento passe a ocupar 1 espaço adicional. Uma Proteção Leve não pode possuir simultaneamente as modificações Reforçada e Discreta.",

    descricao:
      "Camadas extras, placas adicionais, rebites, estruturas internas e materiais mais resistentes são instalados no equipamento. O resultado é uma proteção mais espessa e difícil de transportar, mas capaz de oferecer cobertura superior durante confrontos perigosos. Pode ser aplicada em Proteção Leve, Proteção Pesada ou Escudo.",

    comentario:
      "Quando alguém diz que provavelmente vai aguentar, esta é a modificação que transforma o provavelmente em uma estratégia.",
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