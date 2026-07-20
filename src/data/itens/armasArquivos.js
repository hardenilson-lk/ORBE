const DADOS_PADRAO_ARMA = {
  tipo: "Arma",
  quantidade: 1,
  defesa: 0,
  protecao: 0,
  bonusCarga: 0,
  penalidadeMovimento: 0,
  ativo: true,
  municao: "",
  propriedades: [],
  efeito: "",
};

function criarArma(dados) {
  return {
    ...DADOS_PADRAO_ARMA,
    ...dados,
  };
}

export const ARMAS_ARQUIVOS = [
  criarArma({
    id: "faca",
    nome: "Faca",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo: "Corpo a corpo — leve",
    proficiencia: "Simples",
    empunhadura: "Leve",
    funcionamento:
      "Corpo a corpo e arremesso",
    volume: 1,
    dano: "1d4",
    critico: "19/x2",
    alcance: "Curto",
    tipoDano: "Corte",
    agil: true,
    imagem: "faca",
    propriedades: [
      "Ágil",
      "Arremessável",
    ],
    efeito:
      "Pode usar Agilidade no lugar de Força nos testes de ataque e nas rolagens de dano. Também pode ser arremessada em alcance curto.",
    descricao:
      "Uma lâmina curta, leve e fácil de esconder. Além de servir como arma em confrontos próximos, pode ser utilizada para cortar cordas, abrir embalagens, improvisar ferramentas e realizar outras tarefas de campo. Por ser uma arma ágil, o usuário pode aplicar Agilidade no lugar de Força ao atacar e causar dano. Também pode ser arremessada contra um alvo em alcance curto.",
  }),

  criarArma({
    id: "martelo",
    nome: "Martelo",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo: "Corpo a corpo — leve",
    proficiencia: "Simples",
    empunhadura: "Leve",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d6",
    critico: "20/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Impacto",
    imagem: "martelo",
    descricao:
      "Um martelo comum de trabalho, encontrado em oficinas, caixas de ferramentas e locais de construção. Não foi projetado especificamente para combate, mas sua cabeça metálica pode causar ferimentos consideráveis. É simples de manejar, ocupa pouco espaço e também pode ser usado em tarefas de reparo, para pregar, quebrar objetos frágeis ou improvisar soluções.",
  }),

  criarArma({
    id: "punhal",
    nome: "Punhal",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo: "Corpo a corpo — leve",
    proficiencia: "Simples",
    empunhadura: "Leve",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d4",
    critico: "20/x3",
    alcance: "Corpo a corpo",
    tipoDano: "Perfuração",
    agil: true,
    imagem: "punhal",
    propriedades: [
      "Ágil",
    ],
    efeito:
      "Pode usar Agilidade no lugar de Força nos testes de ataque e nas rolagens de dano.",
    descricao:
      "Uma lâmina estreita, longa e pontiaguda, feita para perfurar profundamente. É frequentemente associada a cerimônias antigas, cultistas e rituais, mas também pode ser usada como uma arma discreta. Seu dano básico é baixo, porém seus golpes críticos são especialmente perigosos. Por ser uma arma ágil, permite usar Agilidade no lugar de Força.",
  }),

  criarArma({
    id: "bastao",
    nome: "Bastão",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo:
      "Corpo a corpo — uma mão",
    proficiencia: "Simples",
    empunhadura: "Uma mão",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d6/1d8",
    critico: "20/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Impacto",
    imagem: "bastao",
    propriedades: [
      "Versátil",
    ],
    efeito:
      "Causa 1d6 de dano quando usado com uma mão ou 1d8 quando empunhado com as duas mãos.",
    descricao:
      "Um bastão resistente de madeira, metal ou material sintético. Pode representar um cassetete policial, um taco reforçado ou qualquer objeto semelhante. Quando usado com uma mão, é mais fácil manter a outra mão livre. Ao ser empunhado com as duas mãos, seus golpes ganham mais força e o dano aumenta para 1d8.",
  }),

  criarArma({
    id: "machete",
    nome: "Machete",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo:
      "Corpo a corpo — uma mão",
    proficiencia: "Simples",
    empunhadura: "Uma mão",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d6",
    critico: "19/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    imagem: "machete",
    descricao:
      "Uma lâmina larga e pesada, utilizada principalmente para abrir caminho em vegetação fechada. Em combate funciona como uma arma de corte confiável, capaz de causar ferimentos profundos. Também pode ser útil durante explorações para cortar galhos, cipós, plantas densas, cordas e materiais semelhantes.",
  }),

  criarArma({
    id: "lanca",
    nome: "Lança",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo:
      "Corpo a corpo — uma mão",
    proficiencia: "Simples",
    empunhadura: "Uma mão",
    funcionamento:
      "Corpo a corpo e arremesso",
    volume: 1,
    dano: "1d6",
    critico: "20/x2",
    alcance: "Curto",
    tipoDano: "Perfuração",
    imagem: "lanca",
    propriedades: [
      "Arremessável",
    ],
    efeito:
      "Pode ser usada em combate corpo a corpo ou arremessada contra um alvo em alcance curto.",
    descricao:
      "Uma haste comprida com uma ponta afiada, normalmente metálica. Apesar de sua origem antiga, ainda é utilizada em treinamentos marciais e pode ser improvisada com materiais encontrados em campo. Serve tanto para atacar oponentes próximos quanto para ser arremessada contra alvos em alcance curto.",
  }),

  criarArma({
    id: "cajado",
    nome: "Cajado",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo:
      "Corpo a corpo — duas mãos",
    proficiencia: "Simples",
    empunhadura: "Duas mãos",
    funcionamento:
      "Corpo a corpo",
    volume: 2,
    dano: "1d6/1d6",
    critico: "20/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Impacto",
    agil: true,
    imagem: "cajado",
    propriedades: [
      "Ágil",
      "Dupla",
    ],
    efeito:
      "É uma arma dupla e ágil. Permite usar Agilidade no lugar de Força nos ataques e no dano.",
    descricao:
      "Uma haste longa utilizada para apoio, treinamento e combate. Seu comprimento permite golpes com ambas as extremidades, sendo representada como uma arma dupla. O cajado exige as duas mãos, mas é leve e equilibrado o bastante para permitir que um combatente use Agilidade no lugar de Força em seus ataques e rolagens de dano.",
  }),

  criarArma({
    id: "arco",
    nome: "Arco",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo:
      "Arma de disparo — duas mãos",
    proficiencia: "Simples",
    empunhadura: "Duas mãos",
    funcionamento: "Disparo",
    volume: 2,
    dano: "1d6",
    critico: "20/x3",
    alcance: "Médio",
    tipoDano: "Perfuração",
    municao: "Flechas",
    imagem: "arco",
    propriedades: [
      "Requer flechas",
    ],
    efeito:
      "Usa um pacote de flechas. Recarregar e disparar exige o uso das duas mãos.",
    descricao:
      "Uma arma de disparo silenciosa que utiliza a tensão de uma corda para lançar flechas. Pode alcançar alvos a uma distância média e não produz o estrondo de uma arma de fogo, sendo útil em situações furtivas. Exige as duas mãos e um pacote de flechas para funcionar.",
  }),

  criarArma({
    id: "besta",
    nome: "Besta",
    categoria: "Arma simples",
    categoriaNumerica: 0,
    grupo:
      "Arma de disparo — duas mãos",
    proficiencia: "Simples",
    empunhadura: "Duas mãos",
    funcionamento: "Disparo",
    volume: 2,
    dano: "1d8",
    critico: "19/x2",
    alcance: "Médio",
    tipoDano: "Perfuração",
    municao: "Flechas",
    imagem: "besta",
    propriedades: [
      "Requer flechas",
    ],
    efeito:
      "Usa um pacote de flechas. Recarregar exige as duas mãos.",
    descricao:
      "Uma arma de disparo formada por um arco montado sobre uma estrutura rígida. É mais fácil de manter preparada do que um arco comum e lança seus projéteis com força considerável. Possui alcance médio, causa dano de perfuração e utiliza pacotes de flechas.",
  }),

  criarArma({
    id: "pistola",
    nome: "Pistola",
    categoria: "Arma simples",
    categoriaNumerica: 1,
    grupo:
      "Arma de fogo — leve",
    proficiencia: "Simples",
    empunhadura: "Leve",
    funcionamento: "Fogo",
    volume: 1,
    dano: "1d12",
    critico: "18/x2",
    alcance: "Curto",
    tipoDano: "Balístico",
    municao: "Balas curtas",
    imagem: "pistola",
    propriedades: [
      "Arma de fogo",
      "Usa balas curtas",
    ],
    descricao:
      "Uma arma de fogo curta, comum entre policiais, militares e agentes de segurança. Seu carregador permite recargas práticas e sua estrutura compacta facilita o transporte. Possui uma margem de ameaça elevada, funcionando bem em confrontos de curta distância. Utiliza pacotes de balas curtas.",
  }),

  criarArma({
    id: "revolver",
    nome: "Revólver",
    categoria: "Arma simples",
    categoriaNumerica: 1,
    grupo:
      "Arma de fogo — leve",
    proficiencia: "Simples",
    empunhadura: "Leve",
    funcionamento: "Fogo",
    volume: 1,
    dano: "2d6",
    critico: "19/x3",
    alcance: "Curto",
    tipoDano: "Balístico",
    municao: "Balas curtas",
    imagem: "revolver",
    propriedades: [
      "Arma de fogo",
      "Usa balas curtas",
    ],
    descricao:
      "Uma das armas de fogo mais conhecidas e confiáveis. Seu tambor possui capacidade limitada, mas o mecanismo simples reduz a possibilidade de falhas. É fácil de transportar, causa bom dano em alcance curto e possui um multiplicador de crítico elevado. Utiliza pacotes de balas curtas.",
  }),

  criarArma({
    id: "fuzil-de-caca",
    nome: "Fuzil de Caça",
    categoria: "Arma simples",
    categoriaNumerica: 1,
    grupo:
      "Arma de fogo — duas mãos",
    proficiencia: "Simples",
    empunhadura: "Duas mãos",
    funcionamento: "Fogo",
    volume: 2,
    dano: "2d8",
    critico: "19/x3",
    alcance: "Médio",
    tipoDano: "Balístico",
    municao: "Balas longas",
    imagem: "fuzil",
    propriedades: [
      "Arma de fogo",
      "Usa balas longas",
    ],
    descricao:
      "Uma arma longa popular entre caçadores, fazendeiros e praticantes de tiro esportivo. Foi projetada para disparos precisos em distâncias maiores do que armas curtas. Exige as duas mãos, possui alcance médio e utiliza pacotes de balas longas.",
  }),

  criarArma({
    id: "machadinha",
    nome: "Machadinha",
    categoria: "Arma tática",
    categoriaNumerica: 0,
    grupo:
      "Corpo a corpo — leve",
    proficiencia: "Tática",
    empunhadura: "Leve",
    funcionamento:
      "Corpo a corpo e arremesso",
    volume: 1,
    dano: "1d6",
    critico: "20/x3",
    alcance: "Curto",
    tipoDano: "Corte",
    imagem: "machadinha",
    propriedades: [
      "Arremessável",
    ],
    efeito:
      "Pode ser usada em combate corpo a corpo ou arremessada em alcance curto.",
    descricao:
      "Uma pequena ferramenta de corte muito comum em fazendas, acampamentos e construções. É eficaz para partir madeira, abrir passagens e quebrar materiais leves. Em combate causa ferimentos de corte e pode ser arremessada contra um alvo em alcance curto.",
  }),

  criarArma({
    id: "nunchaku",
    nome: "Nunchaku",
    categoria: "Arma tática",
    categoriaNumerica: 0,
    grupo:
      "Corpo a corpo — leve",
    proficiencia: "Tática",
    empunhadura: "Leve",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d8",
    critico: "20/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Impacto",
    agil: true,
    imagem: "nunchaku",
    propriedades: [
      "Ágil",
    ],
    efeito:
      "Pode usar Agilidade no lugar de Força nos testes de ataque e nas rolagens de dano.",
    descricao:
      "Dois bastões curtos conectados por uma corrente ou corda. O nunchaku exige treinamento para ser utilizado com segurança, mas permite ataques rápidos e imprevisíveis. É uma arma ágil, permitindo aplicar Agilidade no lugar de Força nos ataques e no dano.",
  }),

  criarArma({
    id: "corrente",
    nome: "Corrente",
    categoria: "Arma tática",
    categoriaNumerica: 0,
    grupo:
      "Corpo a corpo — uma mão",
    proficiencia: "Tática",
    empunhadura: "Uma mão",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d8",
    critico: "20/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Impacto",
    imagem: "corrente",
    descricao:
      "Uma corrente metálica pesada, utilizada como arma flexível de impacto. Seus movimentos são difíceis de prever e ela pode contornar parcialmente obstáculos pequenos, mas exige treinamento para não atingir o próprio usuário. Também pode ser usada para prender, amarrar ou bloquear objetos, conforme a situação e a decisão do mestre.",
  }),

  criarArma({
    id: "espada",
    nome: "Espada",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — uma mão",
    proficiencia: "Tática",
    empunhadura: "Uma mão",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d8/1d10",
    critico: "19/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    imagem: "espada",
    propriedades: [
      "Versátil",
    ],
    efeito:
      "Causa 1d8 de dano com uma mão ou 1d10 quando empunhada com as duas mãos.",
    descricao:
      "Uma lâmina equilibrada e versátil, desenvolvida especificamente para combate. Pode ser utilizada com uma mão, mantendo a outra livre, ou empunhada com as duas mãos para aplicar golpes mais fortes. Quando usada com as duas mãos, seu dano aumenta para 1d10.",
  }),

  criarArma({
    id: "florete",
    nome: "Florete",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — uma mão",
    proficiencia: "Tática",
    empunhadura: "Uma mão",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d6",
    critico: "18/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    agil: true,
    imagem: "florete",
    propriedades: [
      "Ágil",
    ],
    efeito:
      "Pode usar Agilidade no lugar de Força nos testes de ataque e nas rolagens de dano.",
    descricao:
      "Uma espada fina, leve e muito equilibrada, voltada para golpes rápidos e precisos. Seu dano básico é menor do que o de outras espadas, mas sua margem de ameaça é excelente. Por ser uma arma ágil, permite usar Agilidade no lugar de Força nos ataques e no dano.",
  }),

  criarArma({
    id: "machado",
    nome: "Machado",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — uma mão",
    proficiencia: "Tática",
    empunhadura: "Uma mão",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "1d8",
    critico: "20/x3",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    imagem: "machado",
    descricao:
      "Uma ferramenta pesada de corte, utilizada por lenhadores, bombeiros e equipes de resgate. Em combate, sua lâmina concentra muita força em uma área pequena, tornando seus golpes críticos especialmente destrutivos. Também pode ser usado para derrubar portas, cortar madeira e abrir passagens.",
  }),

  criarArma({
    id: "maca",
    nome: "Maça",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — uma mão",
    proficiencia: "Tática",
    empunhadura: "Uma mão",
    funcionamento:
      "Corpo a corpo",
    volume: 1,
    dano: "2d4",
    critico: "20/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Impacto",
    imagem: "maca",
    descricao:
      "Uma arma de impacto formada por um cabo resistente e uma cabeça pesada, frequentemente reforçada com saliências metálicas. Seus golpes distribuem o dano em múltiplos pontos e são eficazes contra alvos protegidos ou objetos frágeis. Exige treinamento por causa de seu peso e equilíbrio.",
  }),

  criarArma({
    id: "acha",
    nome: "Acha",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento:
      "Corpo a corpo",
    volume: 2,
    dano: "1d12",
    critico: "20/x3",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    imagem: "acha",
    descricao:
      "Um enorme machado de guerra projetado para ser empunhado com as duas mãos. Sua cabeça pesada produz golpes lentos, mas extremamente violentos. A arma ocupa bastante espaço, exige força e treinamento, porém possui grande potencial de dano e críticos devastadores.",
  }),

  criarArma({
    id: "gadanho",
    nome: "Gadanho",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento:
      "Corpo a corpo",
    volume: 2,
    dano: "2d4",
    critico: "20/x4",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    imagem: "gadanho",
    descricao:
      "Uma grande ferramenta agrícola criada para cortar cereais e vegetação em movimentos largos. Sua lâmina curva também pode causar ferimentos terríveis quando utilizada como arma. O dano normal é moderado, mas seu multiplicador de crítico é um dos maiores entre as armas comuns.",
  }),

  criarArma({
    id: "katana",
    nome: "Katana",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento:
      "Corpo a corpo",
    volume: 2,
    dano: "1d10",
    critico: "19/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    agil: true,
    imagem: "katana",
    propriedades: [
      "Ágil",
      "Uso com uma mão por veterano",
    ],
    efeito:
      "Pode usar Agilidade no lugar de Força. Um personagem veterano em Luta pode empunhá-la com apenas uma mão.",
    descricao:
      "Uma espada japonesa longa, levemente curvada e cuidadosamente equilibrada. É uma arma ágil, permitindo usar Agilidade no lugar de Força nos ataques e no dano. Normalmente exige as duas mãos, mas um personagem veterano em Luta possui técnica suficiente para utilizá-la com apenas uma mão.",
  }),

  criarArma({
    id: "marreta",
    nome: "Marreta",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento:
      "Corpo a corpo",
    volume: 2,
    dano: "3d4",
    critico: "20/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Impacto",
    imagem: "marreta",
    descricao:
      "Uma ferramenta de demolição com uma grande cabeça metálica presa a um cabo longo. Exige as duas mãos e bastante espaço para ser movimentada. É especialmente apropriada para destruir portas, paredes frágeis, móveis, obstáculos e outros objetos, além de causar dano pesado em combate.",
  }),

  criarArma({
    id: "montante",
    nome: "Montante",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento:
      "Corpo a corpo",
    volume: 2,
    dano: "2d6",
    critico: "19/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    imagem: "montante",
    descricao:
      "Uma espada enorme, com aproximadamente um metro e meio de comprimento. Foi criada para aplicar golpes amplos e poderosos, exigindo as duas mãos e treinamento especializado. Seu tamanho dificulta o transporte e o uso em corredores apertados, mas oferece excelente dano em combate aberto.",
  }),

  criarArma({
    id: "motosserra",
    nome: "Motosserra",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Corpo a corpo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento:
      "Corpo a corpo",
    volume: 2,
    dano: "3d6",
    critico: "20/x2",
    alcance: "Corpo a corpo",
    tipoDano: "Corte",
    imagem: "motosserra",
    propriedades: [
      "Desajeitada",
      "Dano explosivo",
      "Precisa ser ligada",
    ],
    efeito:
      "Ligar a motosserra exige uma ação de movimento. O usuário sofre –1 dado no teste de ataque. Sempre que um dado de dano mostrar 6, role outro dado de dano adicional; novos resultados 6 continuam gerando dados adicionais.",
    descricao:
      "Uma ferramenta motorizada criada para cortar madeira, mas capaz de provocar ferimentos profundos. Antes de ser usada, precisa ser ligada com uma ação de movimento. É pesada, barulhenta e difícil de controlar, impondo uma penalidade de um dado nos testes de ataque. Quando qualquer dado de dano apresentar resultado 6, role um dado adicional do mesmo tipo, repetindo o processo caso esse novo dado também resulte em 6.",
  }),

  criarArma({
    id: "arco-composto",
    nome: "Arco Composto",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Arma de disparo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento: "Disparo",
    volume: 2,
    dano: "1d10",
    critico: "20/x3",
    alcance: "Médio",
    tipoDano: "Perfuração",
    municao: "Flechas",
    imagem: "arco-composto",
    propriedades: [
      "Requer flechas",
    ],
    descricao:
      "Uma versão moderna do arco, construída com polias e materiais resistentes para aumentar a força e a estabilidade do disparo. Causa mais dano do que um arco simples, mantém alcance médio e continua sendo relativamente silencioso. Exige as duas mãos e utiliza pacotes de flechas.",
  }),

  criarArma({
    id: "balestra",
    nome: "Balestra",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Arma de disparo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento: "Disparo",
    volume: 2,
    dano: "1d12",
    critico: "19/x2",
    alcance: "Médio",
    tipoDano: "Perfuração",
    municao: "Flechas",
    imagem: "balestra",
    propriedades: [
      "Requer flechas",
    ],
    descricao:
      "Uma besta maior e mais potente, equipada com mecanismos que acumulam grande tensão. Seus disparos causam dano elevado e podem perfurar proteções leves. Entretanto, a arma é volumosa, exige as duas mãos e precisa de um pacote de flechas para continuar sendo utilizada.",
  }),

  criarArma({
    id: "submetralhadora",
    nome: "Submetralhadora",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Arma de fogo — uma mão",
    proficiencia: "Tática",
    empunhadura: "Uma mão",
    funcionamento: "Fogo",
    volume: 1,
    dano: "2d6",
    critico: "19/x3",
    alcance: "Curto",
    tipoDano: "Balístico",
    municao: "Balas curtas",
    automatica: true,
    imagem: "submetralhadora",
    propriedades: [
      "Automática",
      "Usa balas curtas",
    ],
    efeito:
      "Pode disparar uma rajada: o ataque sofre –1 dado, mas causa um dado de dano adicional do mesmo tipo.",
    descricao:
      "Uma arma de fogo automática compacta, desenvolvida para combates em ambientes fechados e curtas distâncias. Pode ser empunhada com apenas uma mão, embora seu recuo dificulte o controle durante rajadas. Ao disparar em modo automático, o teste perde um dado, mas o dano recebe um dado adicional. Utiliza balas curtas.",
  }),

  criarArma({
    id: "espingarda",
    nome: "Espingarda",
    categoria: "Arma tática",
    categoriaNumerica: 1,
    grupo:
      "Arma de fogo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento: "Fogo",
    volume: 2,
    dano: "4d6",
    critico: "20/x3",
    alcance: "Curto",
    tipoDano: "Balístico",
    municao: "Cartuchos",
    imagem: "espingarda",
    propriedades: [
      "Arma de fogo",
      "Usa cartuchos",
    ],
    descricao:
      "Uma arma de fogo de grande impacto projetada para espalhar múltiplos projéteis em curta distância. É extremamente perigosa contra alvos próximos, mas perde eficiência rapidamente conforme a distância aumenta. Exige as duas mãos e utiliza pacotes de cartuchos.",
  }),

  criarArma({
    id: "fuzil-de-assalto",
    nome: "Fuzil de Assalto",
    categoria: "Arma tática",
    categoriaNumerica: 2,
    grupo:
      "Arma de fogo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento: "Fogo",
    volume: 2,
    dano: "2d10",
    critico: "19/x3",
    alcance: "Médio",
    tipoDano: "Balístico",
    municao: "Balas longas",
    automatica: true,
    imagem: "fuzil-assalto",
    propriedades: [
      "Automática",
      "Usa balas longas",
    ],
    efeito:
      "Pode disparar uma rajada: o ataque sofre –1 dado, mas causa um dado de dano adicional do mesmo tipo.",
    descricao:
      "O armamento padrão de diversas forças militares modernas. Combina alcance médio, grande poder de fogo e capacidade de disparar rajadas. Quando utilizado no modo automático, o ataque sofre a perda de um dado, mas recebe um dado adicional de dano. Exige as duas mãos e utiliza balas longas.",
  }),

  criarArma({
    id: "fuzil-de-precisao",
    nome: "Fuzil de Precisão",
    categoria: "Arma tática",
    categoriaNumerica: 3,
    grupo:
      "Arma de fogo — duas mãos",
    proficiencia: "Tática",
    empunhadura: "Duas mãos",
    funcionamento: "Fogo",
    volume: 2,
    dano: "2d10",
    critico: "19/x3",
    alcance: "Longo",
    tipoDano: "Balístico",
    municao: "Balas longas",
    imagem: "fuzil-precisao",
    propriedades: [
      "Precisão",
      "Usa balas longas",
    ],
    efeito:
      "Quando um personagem veterano em Pontaria usa a ação Mirar com esta arma, recebe +5 na margem de ameaça do ataque.",
    descricao:
      "Uma arma militar criada para disparos longos e extremamente precisos. Seu uso ideal exige preparação, estabilidade e conhecimento de Pontaria. Quando um personagem veterano em Pontaria mira antes de atirar, recebe um bônus de +5 na margem de ameaça do ataque. Utiliza balas longas.",
  }),

  criarArma({
    id: "bazuca",
    nome: "Bazuca",
    categoria: "Arma pesada",
    categoriaNumerica: 3,
    grupo:
      "Arma de fogo — duas mãos",
    proficiencia: "Pesada",
    empunhadura: "Duas mãos",
    funcionamento: "Fogo",
    volume: 2,
    dano: "10d8",
    critico: "20/x2",
    alcance: "Médio",
    tipoDano: "Impacto",
    municao: "Foguete",
    imagem: "bazuca",
    propriedades: [
      "Arma pesada",
      "Usa foguete",
      "Explosiva",
    ],
    descricao:
      "Um lançador de foguetes portátil desenvolvido para destruir veículos, fortificações e alvos de grande porte. Seu disparo causa uma quantidade devastadora de dano de impacto e exige munição específica. É extremamente chamativa, pesada, perigosa em ambientes fechados e restrita a agentes com treinamento em armas pesadas.",
  }),

  criarArma({
    id: "lanca-chamas",
    nome: "Lança-Chamas",
    categoria: "Arma pesada",
    categoriaNumerica: 3,
    grupo:
      "Arma de fogo — duas mãos",
    proficiencia: "Pesada",
    empunhadura: "Duas mãos",
    funcionamento: "Fogo",
    volume: 2,
    dano: "6d6",
    critico: "20/x2",
    alcance: "Curto",
    tipoDano: "Fogo",
    municao: "Combustível",
    imagem: "lanca-chamas",
    propriedades: [
      "Arma pesada",
      "Área em linha",
      "Incendiária",
    ],
    efeito:
      "Atinge todos os seres em uma linha de 1,5 metro de largura com alcance curto. Faça um único teste de ataque e compare com a Defesa de todos os alvos. Seres atingidos também ficam em chamas.",
    descricao:
      "Um equipamento militar que lança combustível inflamável em uma linha contínua. O ataque alcança todos os seres em uma linha de 1,5 metro de largura dentro do alcance curto. Um único teste é comparado à Defesa de cada alvo. Além do dano de fogo, as criaturas atingidas ficam em chamas. Exige um pacote de combustível.",
  }),

  criarArma({
    id: "metralhadora",
    nome: "Metralhadora",
    categoria: "Arma pesada",
    categoriaNumerica: 2,
    grupo:
      "Arma de fogo — duas mãos",
    proficiencia: "Pesada",
    empunhadura: "Duas mãos",
    funcionamento: "Fogo",
    volume: 2,
    dano: "2d12",
    critico: "19/x3",
    alcance: "Médio",
    tipoDano: "Balístico",
    municao: "Balas longas",
    automatica: true,
    imagem: "metralhadora",
    propriedades: [
      "Arma pesada",
      "Automática",
      "Requer suporte ou Força 4",
    ],
    efeito:
      "Para atacar sem penalidade, o usuário precisa ter Força 4 ou maior, ou gastar uma ação de movimento para apoiar a arma em um tripé ou suporte. Caso contrário, sofre –5 no ataque. Em uma rajada, perde 1 dado no teste e causa 1 dado adicional de dano.",
    descricao:
      "Uma arma de fogo pesada de uso militar, criada para manter fogo contínuo sobre uma área. Para utilizá-la adequadamente, o agente precisa ter Força 4 ou maior ou gastar uma ação de movimento para apoiá-la em um tripé ou suporte apropriado. Sem cumprir uma dessas condições, sofre –5 nos ataques. É automática e utiliza balas longas.",
  }),
];

export const ARMAS_SIMPLES_ARQUIVOS =
  ARMAS_ARQUIVOS.filter(
    (arma) =>
      arma.proficiencia ===
      "Simples",
  );

export const ARMAS_TATICAS_ARQUIVOS =
  ARMAS_ARQUIVOS.filter(
    (arma) =>
      arma.proficiencia ===
      "Tática",
  );

export const ARMAS_PESADAS_ARQUIVOS =
  ARMAS_ARQUIVOS.filter(
    (arma) =>
      arma.proficiencia ===
      "Pesada",
  );

export default ARMAS_ARQUIVOS;