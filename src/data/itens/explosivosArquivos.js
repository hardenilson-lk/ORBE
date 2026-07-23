const DADOS_PADRAO_EXPLOSIVO = {
  tipo: "Explosivo",
  quantidade: 1,
  volume: 1,
  ativo: true,
  consumivel: true,
  usos: 1,
  usosMaximos: 1,
};

function criarExplosivo(dados) {
  return {
    ...DADOS_PADRAO_EXPLOSIVO,
    ...dados,
  };
}

export const GRANADAS_ARQUIVOS = [
  criarExplosivo({
    id: "granada-de-atordoamento",
    nome: "Granada de Atordoamento",

    categoria: "Granada",
    categoriaNumerica: 0,

    alcance: "Médio",
    area: "Raio de 6m",

    acaoUso: "Ação padrão",
    resistencia: "Fortitude",
    atributoDt: "Agilidade",

    imagem: "granada-atordoamento",

    propriedades: [
      "Consumível",
      "Arremessável",
      "Alcance médio",
      "Área de 6m",
      "Atordoamento",
      "Clarão e ruído intensos",
    ],

    efeito:
      "Para utilizar esta granada, o personagem precisa empunhá-la e gastar uma ação padrão para arremessá-la em um ponto dentro de alcance médio. Todos os seres em um raio de 6 metros ficam atordoados por 1 rodada. Um sucesso em Fortitude contra a DT baseada na Agilidade do usuário reduz o efeito: o alvo fica ofuscado e surdo por 1 rodada.",

    descricao:
      "Também conhecida como flash-bang, esta granada produz um clarão extremamente intenso acompanhado por uma explosão ensurdecedora. Ela foi desenvolvida para desorientar pessoas em ambientes fechados e permitir invasões rápidas, resgates ou capturas. Apesar de não depender de estilhaços para causar seu efeito, ainda pode provocar lesões, queimaduras ou danos auditivos quando utilizada de maneira imprudente ou em uma distância muito curta.",

    comentario:
      "Quando o plano precisa de uma entrada dramática, mas a equipe ainda quer encontrar as paredes depois.",
  }),

  criarExplosivo({
    id: "granada-de-fragmentacao",
    nome: "Granada de Fragmentação",

    categoria: "Granada",
    categoriaNumerica: 1,

    volume: 1,

    dano: "8d6",
    tipoDano: "Perfuração",

    alcance: "Médio",
    area: "Raio de 6m",

    acaoUso: "Ação padrão",
    resistencia: "Reflexos",
    atributoDt: "Agilidade",
    efeitoResistencia:
      "Reduz o dano à metade",

    imagem: "granada-fragmentacao",

    propriedades: [
      "Consumível",
      "Arremessável",
      "Alcance médio",
      "Área de 6m",
      "Dano de perfuração",
      "Reflexos reduz à metade",
    ],

    efeito:
      "Para utilizar esta granada, o personagem precisa empunhá-la e gastar uma ação padrão para arremessá-la em um ponto dentro de alcance médio. A explosão espalha fragmentos metálicos em um raio de 6 metros. Todos os seres na área sofrem 8d6 pontos de dano de perfuração. Um sucesso em Reflexos contra a DT baseada na Agilidade do usuário reduz o dano à metade.",

    descricao:
      "Uma granada militar construída com uma carga explosiva envolvida por uma estrutura metálica preparada para se partir em diversos fragmentos. Quando detonada, transforma a área próxima em uma tempestade de estilhaços rápidos o bastante para atravessar roupas, madeira fina e carne. É eficiente contra grupos, mas seu raio de ação não distingue inimigos, aliados, reféns ou o agente que calculou mal a distância.",

    comentario:
      "Puxe o pino, jogue longe e tente não descobrir pessoalmente por que o alcance está escrito no manual.",
  }),

  criarExplosivo({
    id: "granada-de-fumaca",
    nome: "Granada de Fumaça",

    categoria: "Granada",
    categoriaNumerica: 0,

    alcance: "Médio",
    area: "Raio de 6m",

    duracao: "2 rodadas",
    acaoUso: "Ação padrão",

    imagem: "granada-fumaca",

    propriedades: [
      "Consumível",
      "Arremessável",
      "Alcance médio",
      "Área de 6m",
      "Camuflagem total",
      "Duração de 2 rodadas",
    ],

    efeito:
      "Para utilizar esta granada, o personagem precisa empunhá-la e gastar uma ação padrão para arremessá-la em um ponto dentro de alcance médio. Ela libera uma fumaça espessa em um raio de 6 metros. Os seres dentro da área ficam cegos e sob camuflagem total. A fumaça permanece durante 2 rodadas.",

    descricao:
      "Um cilindro preparado para liberar rapidamente uma grande quantidade de fumaça escura e densa. É utilizado para bloquear linhas de visão, cobrir retiradas, atravessar áreas vigiadas ou confundir adversários. A fumaça também prejudica os próprios agentes, portanto entrar na nuvem sem planejamento costuma transformar uma operação tática em várias pessoas esbarrando umas nas outras.",

    comentario:
      "Excelente para desaparecer misteriosamente. Menos excelente quando ninguém da equipe sabe para qual lado fica a saída.",
  }),

  criarExplosivo({
    id: "granada-incendiaria",
    nome: "Granada Incendiária",

    categoria: "Granada",
    categoriaNumerica: 1,

    dano: "6d6",
    tipoDano: "Fogo",

    alcance: "Médio",
    area: "Raio de 6m",

    acaoUso: "Ação padrão",
    resistencia: "Reflexos",
    atributoDt: "Agilidade",
    efeitoResistencia:
      "Reduz o dano à metade e evita a condição em chamas",

    imagem: "granada-incendiaria",

    propriedades: [
      "Consumível",
      "Arremessável",
      "Alcance médio",
      "Área de 6m",
      "Dano de fogo",
      "Pode deixar em chamas",
    ],

    efeito:
      "Para utilizar esta granada, o personagem precisa empunhá-la e gastar uma ação padrão para arremessá-la em um ponto dentro de alcance médio. Ela espalha labaredas em um raio de 6 metros. Todos os seres na área sofrem 6d6 pontos de dano de fogo e ficam em chamas. Um sucesso em Reflexos contra a DT baseada na Agilidade do usuário reduz o dano à metade e evita a condição em chamas.",

    descricao:
      "Uma granada carregada com substâncias capazes de produzir e espalhar fogo intenso no momento da detonação. As chamas aderem a roupas, superfícies e materiais inflamáveis, tornando o equipamento especialmente perigoso em construções de madeira, depósitos, veículos e locais fechados. Além dos alvos atingidos diretamente, o incêndio resultante pode continuar alterando o cenário muito depois da explosão.",

    comentario:
      "Todo problema parece menor quando o prédio inteiro vira um problema maior.",
  }),
];

export const MINAS_ARQUIVOS = [
  criarExplosivo({
    id: "mina-antipessoal",
    nome: "Mina Antipessoal",

    categoria: "Mina",
    categoriaNumerica: 1,

    dano: "12d6",
    tipoDano: "Perfuração",

    area: "Cone de 6m",
    alcanceControle: "Longo",

    acaoInstalacao: "Ação completa",
    periciaInstalacao: "Tática",
    dtInstalacao: 15,

    acaoDetonacao: "Ação padrão",
    ativacao: "Controle remoto",

    resistencia: "Reflexos",
    atributoDt: "Intelecto",
    efeitoResistencia:
      "Reduz o dano à metade",

    imagem: "mina-antipessoal",

    propriedades: [
      "Consumível",
      "Instalação com Tática DT 15",
      "Detonação remota",
      "Controle em alcance longo",
      "Cone de 6m",
      "Reflexos reduz à metade",
    ],

    efeito:
      "Instalar a mina no chão exige uma ação completa e um teste de Tática DT 15. Em caso de falha, a mina é gasta, mas não funciona. Ao instalá-la, o personagem escolhe a direção de seu cone. Enquanto estiver a até alcance longo da mina, pode gastar uma ação padrão para detoná-la por controle remoto. A explosão dispara centenas de bolas de aço em um cone de 6 metros, causando 12d6 pontos de dano de perfuração em todos os seres na área. Um sucesso em Reflexos contra a DT baseada no Intelecto do instalador reduz o dano à metade. Encontrar a mina exige um teste de Percepção com DT igual ao resultado obtido no teste usado para instalá-la.",

    descricao:
      "Um dispositivo explosivo direcional preparado para lançar uma grande quantidade de projéteis metálicos contra uma área específica. Diferentemente de uma mina acionada simplesmente por pressão, este modelo utiliza controle remoto, permitindo que o agente escolha o momento da detonação. A direção precisa ser definida durante a instalação, o que transforma posicionamento e preparação em partes fundamentais de seu uso.",

    comentario:
      "Uma armadilha muito eficiente, desde que alguém anote onde ela foi instalada.",
  }),
];

export const EXPLOSIVOS_ARQUIVOS = [
  ...GRANADAS_ARQUIVOS,
  ...MINAS_ARQUIVOS,
];

export default EXPLOSIVOS_ARQUIVOS;