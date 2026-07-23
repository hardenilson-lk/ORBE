export const PRECO_MALDICAO_POR_ELEMENTO = {
  Conhecimento: {
    atributos: [
      "Intelecto",
    ],

    perdaSanidadePorMaldicao: 2,

    descricao:
      "Sempre que o portador falha em um teste baseado em Intelecto, perde 2 pontos de Sanidade para cada maldição de Conhecimento presente em seus itens.",
  },

  Energia: {
    atributos: [
      "Agilidade",
    ],

    perdaSanidadePorMaldicao: 2,

    descricao:
      "Sempre que o portador falha em um teste baseado em Agilidade, perde 2 pontos de Sanidade para cada maldição de Energia presente em seus itens.",
  },

  Morte: {
    atributos: [
      "Presença",
    ],

    perdaSanidadePorMaldicao: 2,

    descricao:
      "Sempre que o portador falha em um teste baseado em Presença, perde 2 pontos de Sanidade para cada maldição de Morte presente em seus itens.",
  },

  Sangue: {
    atributos: [
      "Força",
      "Vigor",
    ],

    perdaSanidadePorMaldicao: 2,

    descricao:
      "Sempre que o portador falha em um teste baseado em Força ou Vigor, perde 2 pontos de Sanidade para cada maldição de Sangue presente em seus itens.",
  },
};

const DADOS_PADRAO_MALDICAO_ARMA = {
  tipo: "Maldição de arma",

  alvo:
    "Arma de qualquer tipo",

  aumentoCategoriaPrimeira: 2,

  aumentoCategoriaAdicional: 1,

  repetivel: false,
};

function criarMaldicaoArma(
  dados,
) {
  return {
    ...DADOS_PADRAO_MALDICAO_ARMA,
    ...dados,
  };
}

export const MALDICOES_ARMAS_CONHECIMENTO_ARQUIVOS = [
  criarMaldicaoArma({
    id: "antielemento",

    nome: "Antielemento",

    elemento: "Conhecimento",

    exigeEscolhaElemento: true,

    elementosPermitidos: [
      "Conhecimento",
      "Energia",
      "Morte",
      "Sangue",
    ],

    custoPe: 2,

    danoAdicional: "4d8",

    ativacao:
      "Ao realizar um ataque",

    propriedades: [
      "Escolha um elemento",
      "Custo de 2 PE",
      "Dano adicional de 4d8",
      "Ativa contra criaturas do elemento escolhido",
    ],

    efeito:
      "Ao receber esta maldição, escolha Conhecimento, Energia, Morte ou Sangue. Quando atacar uma criatura do elemento escolhido, você pode gastar 2 PE. Se o ataque acertar, causa +4d8 pontos de dano.",

    descricao:
      "Sigilos de Conhecimento são gravados por toda a arma e reorganizam sua forma conforme o elemento escolhido. A maldição não torna o equipamento igualmente perigoso contra qualquer inimigo: ela foi criada para reconhecer uma natureza paranormal específica e destruí-la com precisão. Quando ativada, os símbolos se acendem e conduzem a força do golpe até a fraqueza elemental da criatura.",

    comentario:
      "A arma não odeia todo mundo. Ela é profissional e mantém uma lista bem específica.",
  }),

  criarMaldicaoArma({
    id: "ritualistica",

    nome: "Ritualística",

    elemento: "Conhecimento",

    capacidadeRituais: 1,

    ativacao:
      "Armazenar antes e descarregar ao acertar",

    descargaComoAcaoLivre: true,

    propriedades: [
      "Armazena um ritual",
      "O ritual deve ter um ser como alvo ou afetar uma área",
      "Descarrega como ação livre após acertar",
      "O ser atingido vira o alvo ou centro da área",
    ],

    efeito:
      "Você pode armazenar na arma um ritual que tenha como alvo um ser ou que afete uma área, pagando os PE normalmente. O ritual não produz efeito no momento em que é armazenado. Quando acerta um ataque com a arma, você pode descarregá-lo como uma ação livre; o ser atingido se torna o alvo do ritual ou o centro de sua área. Depois da descarga, outro ritual pode ser armazenado.",

    descricao:
      "A superfície da arma é coberta por inscrições capazes de aprisionar temporariamente a estrutura de um ritual. Enquanto está carregada, pequenas alterações denunciam o que existe em seu interior: o metal pode pulsar, emitir ruídos distantes, perder temperatura ou refletir símbolos que não foram gravados ali. O ataque rompe o selo e libera o fenômeno exatamente sobre a vítima.",

    comentario:
      "É uma arma, um selo ritualístico e uma péssima surpresa ocupando o mesmo espaço.",
  }),

  criarMaldicaoArma({
    id: "senciente",

    nome: "Senciente",

    elemento: "Conhecimento",

    acaoAtivacao:
      "Ação de movimento",

    custoPeAtivacao: 2,

    custoPeManutencao: 1,

    frequenciaAtaque:
      "Uma vez por rodada",

    alcanceAtaque:
      "Curto ou o alcance da arma, o que for maior",

    propriedades: [
      "A arma flutua ao lado do portador",
      "Ataca uma vez por rodada",
      "Usa as mesmas estatísticas do portador",
      "Custa 1 PE por turno para manter",
    ],

    efeito:
      "Você pode gastar uma ação de movimento e 2 PE para imbuir a arma com uma fagulha de sua consciência. Ela flutua ao seu lado e, uma vez por rodada, ataca um ser escolhido em alcance curto ou no alcance normal da arma, o que for maior, usando as mesmas estatísticas que teria se estivesse empunhada. No início de cada turno, você deve gastar 1 PE para manter o efeito; caso contrário, a arma cai. Apanhá-la no ar exige uma ação de movimento, e soltá-la para que volte a flutuar durante a ativação é uma ação livre.",

    descricao:
      "A arma recebe uma fração deformada da consciência do portador. Ela acompanha seus movimentos sem precisar ser segurada, gira para encarar ameaças e reage a intenções antes mesmo que sejam expressas. Não chega a possuir uma personalidade completa, mas demonstra preferências, impaciência e uma perturbadora capacidade de permanecer apontada para pessoas que ainda não fizeram nada.",

    comentario:
      "Ela não fala, mas o jeito como continua apontando para seu aliado já diz bastante.",
  }),
];

export const MALDICOES_ARMAS_ENERGIA_ARQUIVOS = [
  criarMaldicaoArma({
    id: "empuxo",

    nome: "Empuxo",

    elemento: "Energia",

    alvo:
      "Arma corpo a corpo",

    somenteCorpoACorpo: true,

    alcanceArremesso: "Curto",

    aumentaAlcanceSeArremessavel: 1,

    aumentoDadosDanoArremesso: 1,

    retornaAoPortador: true,

    acaoParaPegar: "Reação",

    propriedades: [
      "Somente arma corpo a corpo",
      "Pode ser arremessada",
      "Dano +1 dado quando arremessada",
      "Retorna no mesmo turno",
    ],

    efeito:
      "A arma pode ser arremessada em alcance curto. Se já era arremessável, seu alcance aumenta em uma categoria. Quando usada dessa forma, causa mais um dado de dano do mesmo tipo. Depois do ataque, retorna voando ao portador no mesmo turno; pegá-la exige uma reação.",

    descricao:
      "Descargas de Energia se acumulam no equipamento e explodem no instante do arremesso. A arma acelera além do que seria possível pela força do usuário, corrige sua trajetória com movimentos bruscos e retorna envolta por faíscas. O voo não é elegante nem previsível, mas parece obedecer a uma regra caótica que sempre termina com a arma buscando a mão de seu dono.",

    comentario:
      "Jogar a arma era a parte fácil. Confiar que ela vai voltar é onde começa a fé.",
  }),

  criarMaldicaoArma({
    id: "energetica",

    nome: "Energética",

    elemento: "Energia",

    custoPePorAtaque: 2,

    bonusAtaque: 5,

    ignoraResistenciaDano: true,

    converteDanoPara:
      "Energia",

    propriedades: [
      "Custo de 2 PE por ataque",
      "Ataque +5",
      "Ignora resistência a dano",
      "Converte todo o dano em Energia",
    ],

    efeito:
      "Antes de realizar um ataque, você pode gastar 2 PE para transformar a parte ofensiva da arma — ou a munição disparada — em Energia pura. Nesse ataque, recebe +5 no teste de ataque, ignora resistência a dano e converte todo o dano causado para Energia. Armas corpo a corpo emanam luz intensa, enquanto projéteis assumem uma forma plasmática brilhante.",

    descricao:
      "O material da arma perde consistência por alguns instantes e se transforma em um contorno luminoso, instável e impossível de tocar sem sentir estática. A manifestação atravessa proteções mundanas como se procurasse diretamente a energia do alvo. Depois do golpe, o equipamento retorna à matéria comum, normalmente acompanhado pelo cheiro de ozônio e por aparelhos próximos reiniciando sem motivo.",

    comentario:
      "Quando a lâmina vira luz, discutir se ela está afiada deixa de ser a principal preocupação.",
  }),

  criarMaldicaoArma({
    id: "vibrante",

    nome: "Vibrante",

    elemento: "Energia",

    habilidadeConcedida:
      "Ataque Extra",

    trilhaOrigemHabilidade:
      "Operações Especiais",

    reducaoCustoSeJaPossui: 1,

    propriedades: [
      "Concede Ataque Extra",
      "Se já possuir, reduz o custo em 1 PE",
      "Fluxo constante de Energia",
    ],

    efeito:
      "Enquanto empunha a arma, você recebe a habilidade Ataque Extra da trilha Operações Especiais do Combatente. Se já possuir essa habilidade, o custo para utilizá-la diminui em 1 PE.",

    descricao:
      "A arma vibra em uma frequência que acelera os reflexos e conduz o movimento do portador. Cada ataque parece preparar automaticamente o seguinte, como se o equipamento recusasse qualquer pausa entre um golpe e outro. A sensação é estimulante, quase viciante, e torna difícil perceber quando o próprio corpo já deveria ter parado.",

    comentario:
      "A arma quer atacar de novo. Ela sempre quer atacar de novo.",
  }),
];

export const MALDICOES_ARMAS_MORTE_ARQUIVOS = [
  criarMaldicaoArma({
    id: "consumidora",

    nome: "Consumidora",

    elemento: "Morte",

    condicaoPassiva: "Lento",

    duracaoCondicaoPassiva:
      "Até o fim da cena",

    custoPe: 2,

    condicaoAtivada: "Imóvel",

    duracaoCondicaoAtivada:
      "Uma rodada",

    propriedades: [
      "Alvos atingidos ficam lentos",
      "Custo de 2 PE para imobilizar",
      "A imobilização dura uma rodada",
    ],

    efeito:
      "Todo ser atingido pela arma fica lento até o fim da cena. Quando realiza um ataque, você pode gastar 2 PE; se o ataque acertar, o alvo também fica imóvel por uma rodada.",

    descricao:
      "A arma suga movimento, calor e impulso de tudo que toca. Ferimentos causados por ela parecem envelhecer imediatamente, e os músculos ao redor perdem força como se tivessem sido usados por anos em poucos segundos. Mesmo um alvo ainda capaz de lutar passa a se mover com atraso, enquanto uma ativação mais intensa pode fixá-lo completamente no lugar.",

    comentario:
      "A vítima não para porque foi presa. Ela para porque o tempo decidiu deixá-la para trás.",
  }),

  criarMaldicaoArma({
    id: "erosiva",

    nome: "Erosiva",

    elemento: "Morte",

    danoAdicional: "1d8",

    tipoDanoAdicional:
      "Morte",

    custoPe: 2,

    danoPersistente: "2d4",

    rodadasDanoPersistente: 2,

    propriedades: [
      "Dano adicional de 1d8 de Morte",
      "Custo de 2 PE para aplicar erosão",
      "Dano persistente de 2d4 por duas rodadas",
    ],

    efeito:
      "A arma causa +1d8 pontos de dano de Morte. Quando realiza um ataque, você pode gastar 2 PE; se acertar, o alvo sofre 2d4 pontos de dano de Morte no início de cada um de seus turnos pelas próximas duas rodadas.",

    descricao:
      "O contato com a arma acelera a degradação da matéria. Metal perde brilho, madeira resseca e carne envelhece ao redor do ferimento. Quando a maldição é alimentada com esforço, a erosão continua mesmo depois do ataque, avançando em ondas escuras que consomem lentamente aquilo que foi atingido.",

    comentario:
      "O corte fecha. O problema é que tudo ao redor dele continua envelhecendo.",
  }),

  criarMaldicaoArma({
    id: "repulsora",

    nome: "Repulsora",

    elemento: "Morte",

    bonusDefesaEmpunhada: 2,

    custoPeBloqueio: 2,

    bonusDefesaBloqueio: 5,

    propriedades: [
      "Defesa +2 enquanto empunhada",
      "Custo de 2 PE durante um bloqueio",
      "Defesa adicional +5 no bloqueio",
    ],

    efeito:
      "Enquanto estiver empunhada, a arma fornece +2 na Defesa. Quando você realiza um bloqueio, pode gastar 2 PE para receber +5 adicionais na Defesa contra aquele ataque.",

    descricao:
      "Uma névoa espiralada acompanha o equipamento e rouba velocidade de ataques que se aproximam. Golpes parecem atravessar uma distância maior do que deveriam, projéteis perdem impulso e lâminas chegam atrasadas ao ponto de impacto. Durante um bloqueio, a fumaça se adensa e transforma um instante em uma longa oportunidade para desviar ou aparar.",

    comentario:
      "O ataque não errou. Ele apenas envelheceu no caminho.",
  }),
];

export const MALDICOES_ARMAS_SANGUE_ARQUIVOS = [
  criarMaldicaoArma({
    id: "lancinante",

    nome: "Lancinante",

    elemento: "Sangue",

    danoAdicional: "1d8",

    tipoDanoAdicional:
      "Sangue",

    multiplicaNoCritico: true,

    propriedades: [
      "Dano adicional de 1d8 de Sangue",
      "O dado adicional é multiplicado em críticos",
    ],

    efeito:
      "A arma causa +1d8 pontos de dano de Sangue. Esse dado adicional é multiplicado em acertos críticos. Por exemplo, com crítico x3, o dano adicional da maldição se torna +3d8.",

    descricao:
      "A arma se contorce discretamente quando sente carne próxima e produz ferimentos maiores do que seu formato permitiria. O dano paranormal acompanha a violência do golpe, abrindo cortes internos, rompendo vasos e transformando acertos críticos em lesões difíceis de compreender por meios médicos comuns.",

    comentario:
      "O ferimento é maior por dentro. Essa frase nunca termina bem.",
  }),

  criarMaldicaoArma({
    id: "predadora",

    nome: "Predadora",

    elemento: "Sangue",

    ignoraCamuflagemLeve: true,

    ignoraCoberturaLeve: true,

    aumentaAlcanceArmaDistancia: 1,

    multiplicaMargemAmeaca: 2,

    ordemCalculoMargem:
      "A duplicação ocorre antes de aumentos fixos",

    propriedades: [
      "Ignora camuflagem leve",
      "Ignora cobertura leve",
      "Armas à distância aumentam o alcance em uma categoria",
      "Duplica a margem de ameaça",
    ],

    efeito:
      "A arma ignora penalidades causadas por camuflagem e cobertura leves. Se for uma arma de ataque à distância, seu alcance aumenta em uma categoria. Além disso, sua margem de ameaça é duplicada; essa duplicação é aplicada antes de efeitos que aumentem a margem de ameaça por valores fixos.",

    descricao:
      "A arma desenvolve uma fome direcionada e parece conduzir ataques até pontos vulneráveis. Ela corrige pequenos desvios, acompanha movimentos atrás de obstáculos incompletos e reage à presença de sangue mesmo quando o alvo não está claramente visível. Quanto mais próxima está de ferir alguém, mais difícil se torna apontá-la para outro lugar.",

    comentario:
      "Você escolhe o alvo. A arma decide o quanto vai insistir.",
  }),

  criarMaldicaoArma({
    id: "sanguinaria",

    nome: "Sanguinária",

    elemento: "Sangue",

    aplicaSangramento: true,

    danoSangramentoPorAcerto:
      "1d6 por rodada",

    sangramentoCumulativo: true,

    efeitoCriticoAlvo: "Fraco",

    vidaTemporariaCritico:
      "2d10",

    propriedades: [
      "Todo acerto causa sangramento",
      "O sangramento é cumulativo",
      "Críticos deixam o alvo fraco",
      "Críticos concedem 2d10 PV temporários",
    ],

    efeito:
      "Todo ser atingido pela arma fica sangrando. O sangramento é cumulativo: cada acerto acrescenta 1d6 ao dano sofrido por rodada. Quando você consegue um acerto crítico, a arma também deixa o alvo fraco e concede a você 2d10 pontos de vida temporários.",

    descricao:
      "O equipamento absorve parte do sangue derramado e o conduz de volta ao portador como vigor roubado. Os ferimentos provocados continuam se abrindo depois do impacto, como se algo dentro deles puxasse a carne em direções diferentes. Em um golpe particularmente brutal, a arma enfraquece a vítima e pulsa satisfeita nas mãos de quem a empunha.",

    comentario:
      "Ela não precisa ser limpa. De algum modo, nunca sobra sangue na lâmina.",
  }),
];

export const MALDICOES_ARMAS_ARQUIVOS = [
  ...MALDICOES_ARMAS_CONHECIMENTO_ARQUIVOS,

  ...MALDICOES_ARMAS_ENERGIA_ARQUIVOS,

  ...MALDICOES_ARMAS_MORTE_ARQUIVOS,

  ...MALDICOES_ARMAS_SANGUE_ARQUIVOS,
];

export function obterMaldicoesArmasPorElemento(
  elemento,
) {
  return MALDICOES_ARMAS_ARQUIVOS.filter(
    (maldicao) =>
      maldicao.elemento ===
      elemento,
  );
}

export default MALDICOES_ARMAS_ARQUIVOS;