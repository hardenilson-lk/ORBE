const DADOS_PADRAO_EQUIPAMENTO = {
  tipo: "Equipamento",
  categoria: "Item operacional",
  categoriaNumerica: 0,
  quantidade: 1,
  volume: 1,
  dano: "",
  critico: "",
  alcance: "",
  tipoDano: "",
  defesa: 0,
  protecao: 0,
  bonusCarga: 0,
  penalidadeMovimento: 0,
  empunhadura: "",
  pericia: "",
  bonusPericia: 0,
  resistencia: "",
  usos: 0,
  usosMaximos: 0,
  consumivel: false,
  ativo: true,
  imagem: "",
  propriedades: [],
  efeito: "",
  descricao: "",
};

function criarEquipamento(dados) {
  return {
    ...DADOS_PADRAO_EQUIPAMENTO,
    ...dados,
  };
}

export const ACESSORIOS_ARQUIVOS = [
  criarEquipamento({
    id: "kit-de-pericia",
    nome: "Kit de Perícia",
    categoria: "Acessório",
    categoriaNumerica: 0,
    volume: 1,
    empunhadura:
      "Usado durante o teste",
    imagem: "kit",
    propriedades: [
      "Escolha uma perícia",
      "Ferramentas específicas",
      "Evita penalidade de –5",
    ],
    efeito:
      "Ao adicionar o item, escolha uma perícia ou uso de perícia que exija ferramentas. Possuir o kit apropriado evita a penalidade de –5 aplicada quando o personagem tenta realizar esse teste sem as ferramentas necessárias.",
    descricao:
      "Um conjunto de ferramentas preparado para uma atividade específica. Pode representar um kit médico, uma maleta de investigação, ferramentas de mecânica, instrumentos científicos, materiais de disfarce ou qualquer outro conjunto exigido por uma perícia. Existe um kit diferente para cada perícia ou atividade que necessite de equipamento próprio. O kit não fornece um bônus direto, mas permite realizar o teste sem a penalidade causada pela falta das ferramentas adequadas.",
  }),

  criarEquipamento({
    id: "utensilio",
    nome: "Utensílio",
    categoria: "Acessório",
    categoriaNumerica: 1,
    volume: 1,
    empunhadura:
      "Precisa ser empunhado",
    pericia:
      "Escolhida ao adicionar",
    bonusPericia: 2,
    imagem: "utensilio",
    propriedades: [
      "Perícia escolhida",
      "Bônus de +2",
      "Precisa ser empunhado",
      "Não afeta Luta ou Pontaria",
    ],
    efeito:
      "Ao adicionar o utensílio, escolha uma perícia que não seja Luta ou Pontaria. Enquanto o item estiver sendo empunhado e for apropriado para a ação realizada, ele fornece +2 nos testes dessa perícia. A escolha precisa ser aprovada pelo mestre.",
    descricao:
      "Um objeto comum adaptado para auxiliar uma tarefa específica. Pode ser um smartphone usado para pesquisa, um notebook preparado para invadir sistemas, uma lupa para examinar evidências, um canivete multifuncional ou qualquer aparelho semelhante. O objeto precisa fazer sentido dentro da ação realizada e deve permanecer empunhado durante o uso para conceder seu bônus.",
  }),

  criarEquipamento({
    id: "vestimenta",
    nome: "Vestimenta",
    categoria: "Acessório",
    categoriaNumerica: 1,
    volume: 1,
    empunhadura: "Vestida",
    pericia:
      "Escolhida ao adicionar",
    bonusPericia: 2,
    imagem: "vestimenta",
    propriedades: [
      "Perícia escolhida",
      "Bônus de +2",
      "Precisa estar vestida",
      "Não afeta Luta ou Pontaria",
      "Limite de duas vestimentas",
    ],
    efeito:
      "Ao adicionar a vestimenta, escolha uma perícia que não seja Luta ou Pontaria. Enquanto estiver vestida e for adequada à situação, fornece +2 nessa perícia. Um personagem pode receber benefícios de no máximo duas vestimentas ao mesmo tempo. Vestir ou retirar o item exige uma ação completa.",
    descricao:
      "Uma peça de roupa preparada para favorecer determinada atividade. Botas militares podem ajudar em Atletismo, um traje elegante pode auxiliar Diplomacia e um manto coberto por símbolos pode favorecer Ocultismo. O bônus depende da utilidade da roupa na situação e deve ser aprovado pelo mestre.",
  }),

  criarEquipamento({
    id: "smartphone",
    nome: "Smartphone",
    categoria: "Acessório — Utensílio",
    categoriaNumerica: 1,
    volume: 1,
    empunhadura:
      "Precisa ser empunhado",
    pericia: "Ciências",
    bonusPericia: 2,
    imagem: "celular",
    propriedades: [
      "Utensílio",
      "Ciências +2",
      "Comunicação",
      "Registro digital",
    ],
    efeito:
      "Quando usado para acessar informações, realizar pesquisas ou consultar dados apropriados, fornece +2 em Ciências. Como todo utensílio, precisa ser empunhado e o bônus não se acumula com outro item que beneficie a mesma perícia.",
    descricao:
      "Um telefone moderno com acesso a comunicação, câmera, mapas, gravação e pesquisa. Pode registrar provas, fotografar símbolos, armazenar documentos e manter contato com aliados. O funcionamento pode ser comprometido por falta de sinal, bloqueadores, danos físicos ou interferências paranormais.",
  }),

  criarEquipamento({
    id: "notebook",
    nome: "Notebook",
    categoria: "Acessório — Utensílio",
    categoriaNumerica: 1,
    volume: 1,
    empunhadura:
      "Precisa ser utilizado",
    pericia: "Tecnologia",
    bonusPericia: 2,
    imagem: "notebook",
    propriedades: [
      "Utensílio",
      "Tecnologia +2",
      "Computador portátil",
    ],
    efeito:
      "Quando preparado com os programas e recursos adequados, fornece +2 em testes de Tecnologia. Precisa estar sendo utilizado durante o teste.",
    descricao:
      "Um computador portátil equipado com programas de análise, ferramentas de rede e armazenamento de dados. Pode ser usado para acessar sistemas, examinar arquivos, controlar dispositivos e organizar informações encontradas durante uma investigação.",
  }),

  criarEquipamento({
    id: "camera",
    nome: "Câmera",
    categoria: "Acessório — Utensílio",
    categoriaNumerica: 1,
    volume: 1,
    empunhadura:
      "Precisa ser empunhada",
    pericia: "Artes",
    bonusPericia: 2,
    imagem: "camera",
    propriedades: [
      "Utensílio",
      "Artes +2",
      "Registra imagens",
    ],
    efeito:
      "Quando usada para fotografia, filmagem ou produção visual, fornece +2 em Artes. O mestre pode permitir que seus registros auxiliem outras perícias quando forem relevantes para a investigação.",
    descricao:
      "Uma câmera fotográfica ou filmadora de boa qualidade. Permite registrar cenas, documentos, ferimentos, criaturas, símbolos e fenômenos para análise posterior. Os arquivos produzidos podem servir como provas ou revelar detalhes que não foram percebidos no momento da gravação.",
  }),
];

export const ITENS_OPERACIONAIS_ARQUIVOS = [
  criarEquipamento({
    id: "algemas",
    nome: "Algemas",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 1,
    empunhadura:
      "Uma mão durante o uso",
    imagem: "algemas",
    propriedades: [
      "Contenção",
      "Acrobacia DT 30 para escapar",
      "Impede conjuração",
    ],
    efeito:
      "Para algemar uma pessoa que não esteja indefesa, o usuário precisa empunhar as algemas, agarrar o alvo e vencer outro teste de agarrar. Prender os dois pulsos impõe –5 em testes que dependam das mãos e impede conjuração. Também é possível prender um pulso a um objeto imóvel adjacente, impedindo o deslocamento. Escapar sem a chave exige Acrobacia DT 30.",
    descricao:
      "Um par de algemas de aço acompanhado por uma chave. São usadas para conter suspeitos, criminosos ou outros seres humanoides dominados. Mesmo uma pessoa algemada ainda pode tentar reagir, falar, correr ou atacar de formas que não exijam as mãos, dependendo de como foi presa.",
  }),

  criarEquipamento({
    id: "arpeu",
    nome: "Arpéu",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 1,
    alcance: "Curto",
    empunhadura:
      "Usado com uma corda",
    imagem: "arpeu",
    propriedades: [
      "Exploração",
      "Pontaria DT 15",
      "Atletismo +5 para subir",
    ],
    efeito:
      "Pode ser amarrado a uma corda e lançado contra um muro, janela, parapeito ou estrutura semelhante. Fixá-lo corretamente exige um teste de Pontaria DT 15. Quando preso, subir com a ajuda da corda fornece +5 em Atletismo.",
    descricao:
      "Um gancho de aço resistente, normalmente equipado com várias pontas para aumentar a chance de prender em uma superfície. É útil para alcançar andares elevados, atravessar obstáculos, criar pontos de apoio e acessar rotas que seriam impossíveis por meios normais.",
  }),

  criarEquipamento({
    id: "bandoleira",
    nome: "Bandoleira",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 1,
    empunhadura: "Vestida",
    imagem: "bandoleira",
    propriedades: [
      "Acesso rápido",
      "Uma vez por rodada",
      "Sacar ou guardar como ação livre",
    ],
    efeito:
      "Uma vez por rodada, o personagem pode sacar ou guardar um item de seu inventário como uma ação livre.",
    descricao:
      "Um cinto ou conjunto de alças com bolsos e presilhas para manter equipamentos importantes sempre ao alcance. É especialmente útil para agentes que precisam alternar rapidamente entre armas, ferramentas, componentes e itens médicos durante uma cena.",
  }),

  criarEquipamento({
    id: "binoculos",
    nome: "Binóculos",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 1,
    empunhadura:
      "Precisa ser empunhado",
    pericia: "Percepção",
    bonusPericia: 5,
    imagem: "binoculos",
    propriedades: [
      "Observação distante",
      "Percepção +5",
    ],
    efeito:
      "Enquanto forem usados para observar objetos, pessoas, movimentações ou detalhes distantes, fornecem +5 em testes de Percepção.",
    descricao:
      "Binóculos militares com lentes de ampliação e estrutura reforçada. Permitem realizar reconhecimento sem se aproximar do alvo, vigiar entradas, acompanhar veículos e identificar movimentações em terrenos abertos.",
  }),

  criarEquipamento({
    id: "bloqueador-de-sinal",
    nome: "Bloqueador de Sinal",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 1,
    alcance: "Médio",
    imagem: "bloqueador",
    propriedades: [
      "Tecnológico",
      "Interferência",
      "Área de alcance médio",
    ],
    efeito:
      "Enquanto estiver ligado, impede que celulares e aparelhos semelhantes dentro de alcance médio se conectem normalmente às redes de comunicação.",
    descricao:
      "Um dispositivo compacto que transmite interferências nas frequências usadas por telefones e outros aparelhos sem fio. Pode impedir chamadas, mensagens e rastreamento, mas também corta a comunicação dos próprios agentes enquanto permanecer ativo.",
  }),

  criarEquipamento({
    id: "cicatrizante",
    nome: "Cicatrizante",
    tipo: "Consumível",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 1,
    alcance: "Adjacente",
    usos: 1,
    usosMaximos: 1,
    consumivel: true,
    imagem: "medkit",
    propriedades: [
      "Consumível",
      "Ação padrão",
      "Cura 2d8+2 PV",
    ],
    efeito:
      "O usuário pode gastar uma ação padrão e consumir o item para recuperar 2d8+2 PV de si mesmo ou de um ser adjacente.",
    descricao:
      "Um spray médico contendo substâncias de forte ação cicatrizante. Ele fecha rapidamente ferimentos, reduz sangramentos e permite que um agente continue ativo em campo, mas é totalmente consumido após uma aplicação.",
  }),

  criarEquipamento({
    id: "corda",
    nome: "Corda",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 1,
    empunhadura:
      "Rolo com 10 metros",
    imagem: "corda",
    propriedades: [
      "10 metros",
      "Atletismo +5 em descidas",
      "Amarras",
      "Resgate",
    ],
    efeito:
      "Fornece +5 em testes de Atletismo realizados para descer buracos, paredes, edifícios ou situações semelhantes nas quais a corda seja útil. Também pode ser usada para amarrar pessoas inconscientes, prender objetos e criar pontos de segurança.",
    descricao:
      "Um rolo com dez metros de corda resistente. É um dos itens mais versáteis em uma missão, servindo para escalada, descida, resgate, amarração, travessias, improvisação de armadilhas e transporte de objetos.",
  }),

  criarEquipamento({
    id: "equipamento-de-sobrevivencia",
    nome: "Equipamento de Sobrevivência",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 2,
    pericia: "Sobrevivência",
    bonusPericia: 5,
    imagem: "sobrevivencia",
    propriedades: [
      "Sobrevivência +5",
      "Permite testes sem treinamento",
      "Acampamento",
      "Orientação",
    ],
    efeito:
      "Fornece +5 em testes de Sobrevivência realizados para acampar e orientar-se. Também permite fazer esses testes mesmo que o personagem não seja treinado em Sobrevivência.",
    descricao:
      "Uma mochila de campo com saco de dormir, utensílios de cozinha, ferramentas básicas, GPS e outros recursos úteis fora de áreas urbanas. Ajuda o grupo a encontrar caminhos, preparar abrigo e permanecer em segurança durante viagens prolongadas.",
  }),

  criarEquipamento({
    id: "lanterna-tatica",
    nome: "Lanterna Tática",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 1,
    alcance: "Curto",
    empunhadura:
      "Precisa ser empunhada",
    imagem: "lanterna",
    propriedades: [
      "Cone de luz de 9 metros",
      "Pode ofuscar",
      "Ação de movimento",
    ],
    efeito:
      "Ilumina um cone de 9 metros. O usuário pode gastar uma ação de movimento para apontar a luz contra os olhos de um ser em alcance curto. O alvo fica ofuscado por uma rodada e depois se torna imune a novas tentativas dessa lanterna até o fim da cena.",
    descricao:
      "Uma fonte de luz resistente, com estrutura reforçada para uso policial e militar. É útil para explorar locais escuros, procurar pistas, sinalizar posições e temporariamente atrapalhar a visão de um inimigo próximo.",
  }),

  criarEquipamento({
    id: "mascara-de-gas",
    nome: "Máscara de Gás",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 1,
    empunhadura: "Vestida",
    resistencia:
      "Fortitude contra efeitos respiratórios +10",
    imagem: "mascara",
    propriedades: [
      "Proteção respiratória",
      "Fortitude +10",
      "Precisa cobrir o rosto",
    ],
    efeito:
      "Enquanto estiver corretamente vestida, fornece +10 em testes de Fortitude contra efeitos que dependam da respiração, como fumaça, gases e certas toxinas inaladas.",
    descricao:
      "Uma máscara que cobre todo o rosto e utiliza filtros para reduzir a entrada de partículas e substâncias perigosas. Ela precisa ser colocada antes da exposição e não protege contra efeitos que atravessem a pele ou atuem por outros meios.",
  }),

  criarEquipamento({
    id: "mochila-militar",
    nome: "Mochila Militar",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 0,
    bonusCarga: 2,
    empunhadura: "Vestida",
    imagem: "mochila",
    propriedades: [
      "Não ocupa espaço",
      "Capacidade de carga +2",
      "Apenas uma mochila",
    ],
    efeito:
      "Não ocupa espaço no inventário e aumenta a capacidade de carga do personagem em 2 espaços. O benefício não se acumula com outra mochila militar.",
    descricao:
      "Uma mochila leve, resistente e organizada para facilitar o transporte de equipamento. Possui divisórias, presilhas e alças reforçadas que distribuem melhor o peso, permitindo carregar mais itens sem comprometer tanto a mobilidade.",
  }),

  criarEquipamento({
    id: "oculos-de-visao-termica",
    nome: "Óculos de Visão Térmica",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 1,
    empunhadura: "Vestido",
    imagem: "visao-termica",
    propriedades: [
      "Visão térmica",
      "Ignora penalidade de camuflagem",
    ],
    efeito:
      "Enquanto estiver usando os óculos, o personagem elimina penalidades em testes causadas por camuflagem.",
    descricao:
      "Óculos eletrônicos que exibem diferenças de temperatura no ambiente. Permitem localizar corpos e fontes de calor mesmo quando estão parcialmente ocultos por escuridão, fumaça leve, vegetação ou outros tipos de camuflagem.",
  }),

  criarEquipamento({
    id: "pe-de-cabra",
    nome: "Pé de Cabra",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 1,
    empunhadura: "Uma mão",
    pericia: "Força",
    bonusPericia: 5,
    dano: "1d6/1d8",
    alcance: "Corpo a corpo",
    tipoDano: "Impacto",
    imagem: "pe-de-cabra",
    propriedades: [
      "Força +5 para arrombar",
      "Pode ser usado como bastão",
    ],
    efeito:
      "Fornece +5 em testes de Força feitos para arrombar portas. Em combate, pode ser usado com as mesmas estatísticas de um bastão.",
    descricao:
      "Uma barra de ferro curvada utilizada para abrir caixas, remover pregos, levantar objetos e forçar fechaduras ou portas. Sua estrutura pesada também permite utilizá-la como uma arma improvisada de impacto.",
  }),

  criarEquipamento({
    id: "pistola-de-dardos",
    nome: "Pistola de Dardos",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 1,
    alcance: "Curto",
    empunhadura: "Leve",
    usos: 2,
    usosMaximos: 2,
    imagem: "pistola-dardos",
    propriedades: [
      "Dois dardos",
      "Sonífero",
      "Ataque à distância",
    ],
    efeito:
      "Para atingir um ser, faça um ataque à distância em alcance curto. Se acertar, o alvo fica inconsciente até o fim da cena. Um sucesso em Fortitude contra a DT baseada na Agilidade do usuário reduz o efeito: o alvo fica desprevenido e lento por uma rodada. A pistola começa com dois dardos.",
    descricao:
      "Uma arma leve que lança pequenos dardos carregados com um forte sonífero. É usada para capturar alvos vivos ou evitar confrontos prolongados. Criaturas imunes a venenos, sono ou efeitos químicos podem não ser afetadas, conforme decisão do mestre.",
  }),

  criarEquipamento({
    id: "caixa-de-dardos",
    nome: "Caixa de Dardos",
    tipo: "Consumível",
    categoria: "Munição operacional",
    categoriaNumerica: 0,
    volume: 1,
    quantidade: 2,
    usos: 2,
    usosMaximos: 2,
    consumivel: true,
    imagem: "dardos",
    propriedades: [
      "Dois dardos",
      "Munição para pistola de dardos",
    ],
    efeito:
      "Recarrega dois usos da Pistola de Dardos.",
    descricao:
      "Uma pequena caixa protegida contendo dois dardos preparados com sonífero. Os dardos devem ser armazenados com cuidado para evitar vazamentos ou aplicação acidental.",
  }),

  criarEquipamento({
    id: "pistola-sinalizadora",
    nome: "Pistola Sinalizadora",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 1,
    dano: "2d6",
    alcance: "Curto",
    tipoDano: "Fogo",
    empunhadura: "Leve",
    usos: 2,
    usosMaximos: 2,
    imagem: "pistola-sinalizadora",
    propriedades: [
      "Dois sinalizadores",
      "Fonte de luz",
      "Pode causar dano de fogo",
    ],
    efeito:
      "Pode disparar um sinal luminoso para indicar a localização do grupo. Também pode ser utilizada como uma arma de disparo leve em alcance curto, causando 2d6 pontos de dano de fogo. Começa com duas cargas.",
    descricao:
      "Uma pistola de emergência que lança sinalizadores brilhantes a grande altura. É utilizada para pedir resgate, marcar posições ou iluminar áreas abertas. Em situações extremas, o projétil em chamas pode ser disparado diretamente contra um alvo.",
  }),

  criarEquipamento({
    id: "caixa-de-sinalizadores",
    nome: "Caixa de Sinalizadores",
    tipo: "Consumível",
    categoria: "Munição operacional",
    categoriaNumerica: 0,
    volume: 1,
    quantidade: 2,
    usos: 2,
    usosMaximos: 2,
    consumivel: true,
    imagem: "sinalizadores",
    propriedades: [
      "Duas cargas",
      "Munição para pistola sinalizadora",
    ],
    efeito:
      "Recarrega dois usos da Pistola Sinalizadora.",
    descricao:
      "Uma caixa resistente contendo duas cargas luminosas para pistola sinalizadora. As cargas produzem luz intensa e devem ser mantidas longe de fogo e fontes de calor.",
  }),

  criarEquipamento({
    id: "soqueira",
    nome: "Soqueira",
    categoria: "Item operacional",
    categoriaNumerica: 0,
    volume: 1,
    empunhadura: "Vestida na mão",
    bonusDanoDesarmado: 1,
    imagem: "soqueira",
    propriedades: [
      "Dano desarmado +1",
      "Ataques desarmados letais",
      "Aceita modificações de armas",
    ],
    efeito:
      "Enquanto estiver sendo usada, fornece +1 nas rolagens de dano desarmado e transforma esse dano em letal. Pode receber modificações e maldições permitidas para armas corpo a corpo, aplicando os efeitos aos ataques desarmados.",
    descricao:
      "Uma peça metálica encaixada nos dedos para tornar socos mais perigosos. É pequena e fácil de transportar, mas pode causar ferimentos graves. Por funcionar junto aos ataques desarmados, não substitui completamente uma arma empunhada.",
  }),

  criarEquipamento({
    id: "spray-de-pimenta",
    nome: "Spray de Pimenta",
    tipo: "Consumível",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 1,
    alcance: "Adjacente",
    empunhadura: "Uma mão",
    usos: 2,
    usosMaximos: 2,
    consumivel: true,
    imagem: "spray",
    propriedades: [
      "Dois usos",
      "Ação padrão",
      "Pode causar cegueira",
    ],
    efeito:
      "O usuário pode gastar uma ação padrão para atingir um ser adjacente. O alvo fica cego por 1d4 rodadas. Um sucesso em Fortitude contra a DT baseada na Agilidade do usuário evita o efeito. A carga possui dois usos.",
    descricao:
      "Um pequeno recipiente pressurizado com um composto químico que provoca dor intensa, irritação e lacrimejamento. É eficiente para contenção de pessoas, mas pode ter pouco ou nenhum efeito contra criaturas sem olhos ou imunes a agentes químicos.",
  }),

  criarEquipamento({
    id: "taser",
    nome: "Taser",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 1,
    dano: "1d6",
    alcance: "Adjacente",
    tipoDano: "Eletricidade",
    empunhadura: "Uma mão",
    usos: 2,
    usosMaximos: 2,
    imagem: "taser",
    propriedades: [
      "Dois usos",
      "Ação padrão",
      "Pode atordoar",
    ],
    efeito:
      "O usuário pode gastar uma ação padrão para atingir um ser adjacente. O alvo sofre 1d6 pontos de dano de eletricidade e fica atordoado por uma rodada. Um sucesso em Fortitude contra a DT baseada na Agilidade do usuário evita a condição de atordoado. A bateria dura dois usos.",
    descricao:
      "Um dispositivo de eletrochoque desenvolvido para incapacitar alvos sem o uso de munição letal. A descarga pode interromper temporariamente os movimentos de uma pessoa, mas criaturas resistentes à eletricidade podem reduzir ou ignorar seu efeito.",
  }),

  criarEquipamento({
    id: "traje-hazmat",
    nome: "Traje Hazmat",
    categoria: "Item operacional",
    categoriaNumerica: 1,
    volume: 2,
    empunhadura: "Vestido",
    resistencia: "Químico 10",
    imagem: "hazmat",
    propriedades: [
      "Resistência a químico 10",
      "Testes contra efeitos ambientais +5",
      "Corpo inteiro",
    ],
    efeito:
      "Enquanto estiver corretamente vestido, fornece +5 em testes de resistência contra efeitos ambientais e resistência 10 contra dano químico.",
    descricao:
      "Uma roupa impermeável que cobre o corpo inteiro e reduz o contato com materiais tóxicos, substâncias contaminadas e ambientes perigosos. Inclui luvas, botas e proteção para a cabeça, mas precisa permanecer completamente fechada para conceder seus benefícios.",
  }),
];

export const MODIFICACOES_ACESSORIOS_ARQUIVOS = [
  {
    id: "aprimorado",
    nome: "Aprimorado",
    tipo:
      "Modificação de acessório",
    aumentoCategoria: 1,
    efeito:
      "Aumenta para +5 um dos bônus em perícia fornecidos pelo acessório.",
    descricao:
      "O item recebe materiais, programas ou acabamento de qualidade superior. Caso possua uma função adicional, esta modificação pode ser aplicada novamente para aprimorar o bônus dessa segunda função.",
  },

  {
    id: "discreto",
    nome: "Discreto",
    tipo:
      "Modificação de acessório",
    aumentoCategoria: 1,
    reducaoVolume: 1,
    bonusOcultar: 5,
    efeito:
      "Reduz o espaço ocupado em 1 e fornece +5 em testes de Crime para ocultar o acessório. Permite realizar esse teste mesmo sem treinamento.",
    descricao:
      "O item é miniaturizado ou disfarçado como um objeto comum, como um relógio, caneta ou peça de roupa, tornando mais difícil perceber sua verdadeira função.",
  },

  {
    id: "funcao-adicional",
    nome: "Função Adicional",
    tipo:
      "Modificação de acessório",
    aumentoCategoria: 1,
    efeito:
      "O acessório passa a fornecer +2 em uma perícia adicional escolhida pelo personagem e aprovada pelo mestre.",
    descricao:
      "O objeto recebe uma nova ferramenta, aplicativo ou adaptação que permite utilizá-lo em outra área de conhecimento.",
  },

  {
    id: "instrumental",
    nome: "Instrumental",
    tipo:
      "Modificação de acessório",
    aumentoCategoria: 1,
    efeito:
      "O acessório também passa a funcionar como um kit de perícia escolhido quando a modificação é aplicada.",
    descricao:
      "O equipamento recebe todas as ferramentas necessárias para substituir um kit específico, evitando a penalidade causada pela ausência desse kit.",
  },
];

export const EQUIPAMENTOS_ARQUIVOS = [
  ...ACESSORIOS_ARQUIVOS,
  ...ITENS_OPERACIONAIS_ARQUIVOS,
];

export default EQUIPAMENTOS_ARQUIVOS;