const DADOS_PADRAO_MALDICAO_PROTECAO = {
  tipo: "Maldição de proteção",

  alvo:
    "Proteção Leve, Proteção Pesada ou Escudo",

  protecoesPermitidas: [
    "protecao-leve",
    "protecao-pesada",
    "escudo",
  ],

  aumentoCategoriaPrimeira: 2,
  aumentoCategoriaAdicional: 1,

  repetivel: false,
};

function criarMaldicaoProtecao(
  dados,
) {
  return {
    ...DADOS_PADRAO_MALDICAO_PROTECAO,
    ...dados,
  };
}

export const MALDICOES_PROTECOES_CONHECIMENTO_ARQUIVOS = [
  criarMaldicaoProtecao({
    id: "abascanta",

    nome: "Abascanta",

    elemento: "Conhecimento",

    bonusResistenciaRituais: 5,

    limiteReflexao:
      "Uma vez por cena",

    acaoReflexao: "Reação",

    custoPeReflexao:
      "Igual ao custo do ritual",

    propriedades: [
      "Resistência contra rituais +5",
      "Reflete um ritual uma vez por cena",
      "Refletir exige uma reação",
      "Custo em PE igual ao ritual",
      "As características do ritual são mantidas",
    ],

    efeito:
      "Você recebe +5 em testes de resistência contra rituais. Uma vez por cena, quando é alvo de um ritual, pode gastar uma reação e uma quantidade de PE igual ao custo do ritual para refleti-lo de volta ao conjurador. As características originais do ritual, como efeitos e DT, são mantidas, mas você toma quaisquer decisões exigidas por ele.",

    descricao:
      "Símbolos de Conhecimento cobrem a superfície da proteção e se reorganizam sempre que um ritual se aproxima. As inscrições parecem compreender a estrutura do fenômeno, desmontá-la por um instante e reconstruí-la na direção de quem a conjurou. Quando o poder é ativado, letras e sigilos deixam o equipamento como páginas arrancadas por um vento invisível, cercando o ritual e obrigando-o a percorrer o caminho de volta.",

    comentario:
      "O conjurador enviou um ritual. A proteção educadamente marcou como remetente e devolveu.",
  }),

  criarMaldicaoProtecao({
    id: "profetica",

    nome: "Profética",

    elemento: "Conhecimento",

    resistenciaElemento: {
      elemento: "Conhecimento",
      valor: 10,
    },

    custoPeRepetirTeste: 2,

    propriedades: [
      "Resistência a Conhecimento 10",
      "Custo de 2 PE",
      "Permite repetir um teste de resistência",
      "A segunda rolagem substitui a primeira",
    ],

    efeito:
      "Você recebe resistência a Conhecimento 10. Sempre que fizer um teste de resistência, pode gastar 2 PE para rolar o teste novamente.",

    descricao:
      "A proteção concede breves vislumbres de futuros possíveis. O portador pode enxergar por um instante o golpe antes que ele aconteça, sentir o gosto de um veneno antes de respirá-lo ou ouvir palavras que ainda não foram pronunciadas. Essas previsões são rápidas, incompletas e frequentemente acompanhadas por imagens de futuros nos quais a reação do usuário não foi suficiente.",

    comentario:
      "Ela mostrou exatamente como você morreria. Felizmente, também mostrou uma segunda opção um pouco menos definitiva.",
  }),

  criarMaldicaoProtecao({
    id: "sombria",

    nome: "Sombria",

    elemento: "Conhecimento",

    bonusFurtividade: 5,

    ignoraPenalidadeCargaFurtividade:
      true,

    acaoDisfarce:
      "Ação de movimento",

    custoPeDisfarce: 1,

    aparenciaDisfarce:
      "Roupa comum",

    propriedadesMantidasNoDisfarce:
      true,

    propriedades: [
      "Furtividade +5",
      "Ignora penalidade de carga em Furtividade",
      "Custo de 1 PE",
      "Disfarce exige uma ação de movimento",
      "Pode assumir a aparência de roupa comum",
      "Mantém todas as propriedades originais",
    ],

    efeito:
      "Você recebe +5 em Furtividade e ignora a penalidade de carga em testes dessa perícia. Além disso, pode gastar uma ação de movimento e 1 PE para fazer a proteção assumir a aparência de uma roupa comum. Essa transformação altera apenas a aparência do item; seus bônus, espaços ocupados, penalidades e demais propriedades continuam funcionando normalmente.",

    descricao:
      "A superfície da proteção parece absorver luz, som e atenção. Mesmo uma armadura pesada pode passar despercebida quando observada rapidamente, como se os olhos recusassem registrar seus detalhes. Quando a transformação é ativada, placas, fivelas e camadas rígidas desaparecem sob a aparência de uma roupa comum, embora continuem fisicamente presentes e tão pesadas quanto antes.",

    comentario:
      "Parece apenas um casaco comum. Um casaco comum que pesa como uma geladeira e para balas.",
  }),
];

export const MALDICOES_PROTECOES_ENERGIA_ARQUIVOS = [
  criarMaldicaoProtecao({
    id: "cinetica",

    nome: "Cinética",

    elemento: "Energia",

    bonusDefesa: 2,

    resistenciaDanoPorProtecao: {
      "protecao-leve": 2,
      escudo: 2,
      "protecao-pesada": 5,
    },

    propriedades: [
      "Defesa +2",
      "Proteção Leve: resistência a dano 2",
      "Escudo: resistência a dano 2",
      "Proteção Pesada: resistência a dano 5",
      "Barreira cinética invisível",
    ],

    efeito:
      "A proteção produz uma barreira invisível que desvia ataques, fornecendo +2 na Defesa. Se aplicada a uma Proteção Leve ou Escudo, também fornece resistência a dano 2. Se aplicada a uma Proteção Pesada, fornece resistência a dano 5.",

    descricao:
      "Uma camada invisível de Energia envolve o equipamento e reage violentamente à aproximação de ataques. Projéteis alteram levemente sua trajetória, lâminas são empurradas para o lado e golpes perdem parte da força antes de atingir o usuário. A barreira não permanece estável: ela ondula, estala e produz pequenas distorções no ar sempre que absorve um impacto.",

    comentario:
      "O ataque acertou em cheio. Só esqueceu de combinar isso com a barreira.",
  }),

  criarMaldicaoProtecao({
    id: "lepida",

    nome: "Lépida",

    elemento: "Energia",

    bonusAtletismo: 10,

    bonusDeslocamento: 3,

    custoPeMovimentoSobrenatural: 2,

    duracaoMovimentoSobrenatural:
      "Até o final do turno",

    ignoraTerrenoDificil: true,

    deslocamentoEscalada:
      "Igual ao deslocamento terrestre",

    imunidadeQuedaAte: 9,

    propriedades: [
      "Atletismo +10",
      "Deslocamento +3m",
      "Custo de 2 PE",
      "Ignora terreno difícil até o fim do turno",
      "Deslocamento de escalada igual ao terrestre",
      "Imunidade a quedas de até 9m",
    ],

    efeito:
      "Você recebe +10 em testes de Atletismo e aumenta seu deslocamento em 3 metros. Pode gastar 2 PE para mover-se de maneira sobrenatural. Até o final do turno, ignora terreno difícil, recebe deslocamento de escalada igual ao seu deslocamento terrestre e fica imune ao dano causado por quedas de até 9 metros.",

    descricao:
      "A proteção pulsa com Energia e acompanha os movimentos do portador como se não possuísse peso. Corridas deixam rastros luminosos, saltos alcançam distâncias improváveis e superfícies verticais parecem oferecer apoio onde não existe nenhum. Durante a ativação, o usuário pode avançar por escombros, paredes e desníveis com uma velocidade que desafia tanto a gravidade quanto a prudência.",

    comentario:
      "A física ainda se aplica. Ela apenas precisa preencher um formulário antes de tentar impedir você.",
  }),

  criarMaldicaoProtecao({
    id: "voltaica",

    nome: "Voltaica",

    elemento: "Energia",

    resistenciaElemento: {
      elemento: "Energia",
      valor: 10,
    },

    acaoAtivacao:
      "Ação de movimento",

    custoPeAtivacao: 2,

    duracao:
      "Até o final da cena",

    danoAdjacente: "2d6",

    tipoDanoAdjacente:
      "Energia",

    momentoDano:
      "No final de cada turno do portador",

    propriedades: [
      "Resistência a Energia 10",
      "Custo de 2 PE",
      "Ativação com ação de movimento",
      "Duração até o fim da cena",
      "Causa 2d6 de Energia em seres adjacentes",
      "O dano ocorre no fim de cada turno",
    ],

    efeito:
      "Você recebe resistência a Energia 10. Pode gastar uma ação de movimento e 2 PE para fazer a proteção emitir arcos elétricos até o final da cena. Enquanto estiver ativa, no final de cada um de seus turnos, a proteção causa 2d6 pontos de dano de Energia em todos os seres adjacentes.",

    descricao:
      "Descargas percorrem a proteção, saltando entre placas, tecidos e partes metálicas. Quando ativada, a maldição transforma o portador no centro de uma tempestade elétrica compacta. Os arcos atingem tudo que permanece próximo por tempo demais, produzindo cheiro de ozônio, espasmos musculares e uma quantidade preocupante de aparelhos eletrônicos inutilizados.",

    comentario:
      "Abraços ficam temporariamente proibidos. O último voluntário ainda está soltando fumaça.",
  }),
];

export const MALDICOES_PROTECOES_MORTE_ARQUIVOS = [
  criarMaldicaoProtecao({
    id: "letargica",

    nome: "Letárgica",

    elemento: "Morte",

    bonusDefesa: 2,

    chanceIgnorarDanoExtra: {
      "protecao-leve": 25,
      escudo: 25,
      "protecao-pesada": 50,
    },

    danosExtrasAfetados: [
      "Acerto crítico",
      "Ataque furtivo",
    ],

    propriedades: [
      "Defesa +2",
      "Proteção Leve: 25% de chance",
      "Escudo: 25% de chance",
      "Proteção Pesada: 50% de chance",
      "Pode ignorar dano adicional de críticos",
      "Pode ignorar dano adicional de ataques furtivos",
    ],

    efeito:
      "A proteção fornece +2 na Defesa. Além disso, quando você sofre um acerto crítico ou ataque furtivo, possui uma chance de ignorar o dano adicional desse efeito: 25% se estiver usando Proteção Leve ou Escudo, e 50% se estiver usando Proteção Pesada. O dano normal do ataque ainda é sofrido.",

    descricao:
      "Uma névoa escura envolve o equipamento e desacelera ataques especialmente perigosos. No instante em que uma lâmina encontra uma abertura ou um projétil segue para uma área vital, o tempo ao redor do impacto parece engrossar. Algumas vezes, a fração mais destrutiva do ataque simplesmente perde força antes de alcançar o portador.",

    comentario:
      "O golpe crítico chegou perfeitamente no lugar certo. Infelizmente para ele, chegou alguns segundos tarde demais.",
  }),

  criarMaldicaoProtecao({
    id: "repulsiva",

    nome: "Repulsiva",

    elemento: "Morte",

    resistenciaElemento: {
      elemento: "Morte",
      valor: 10,
    },

    acaoAtivacao:
      "Ação de movimento",

    custoPeAtivacao: 2,

    duracao:
      "Até o final da cena",

    danoRetaliacao: "2d8",

    tipoDanoRetaliacao:
      "Morte",

    gatilhoRetaliacao:
      "Ser que atacar o portador em corpo a corpo",

    propriedades: [
      "Resistência a Morte 10",
      "Custo de 2 PE",
      "Ativação com ação de movimento",
      "Duração até o fim da cena",
      "Causa 2d8 de Morte em atacantes corpo a corpo",
    ],

    efeito:
      "Você recebe resistência a Morte 10. Pode gastar uma ação de movimento e 2 PE para cobrir o corpo com uma camada de Lodo preto até o final da cena. Enquanto o efeito estiver ativo, qualquer ser que atacar você em combate corpo a corpo sofre 2d8 pontos de dano de Morte.",

    descricao:
      "Um Lodo negro e viscoso escorre de dentro da proteção e se espalha sobre o portador sem limitar seus movimentos. Qualquer criatura que se aproxima sente o próprio corpo envelhecer, enfraquecer e perder calor. Ataques corpo a corpo atravessam a substância apenas por um instante, mas isso já é suficiente para que a Morte acompanhe o agressor de volta.",

    comentario:
      "Bater em você continua sendo possível. Só não é mais uma experiência de mão única.",
  }),
];

export const MALDICOES_PROTECOES_SANGUE_ARQUIVOS = [
  criarMaldicaoProtecao({
    id: "regenerativa",

    nome: "Regenerativa",

    elemento: "Sangue",

    resistenciaElemento: {
      elemento: "Sangue",
      valor: 10,
    },

    acaoCura:
      "Ação de movimento",

    custoPeCura: 1,

    cura: "1d12",

    recursoRecuperado:
      "Pontos de Vida",

    propriedades: [
      "Resistência a Sangue 10",
      "Custo de 1 PE",
      "Cura exige uma ação de movimento",
      "Recupera 1d12 PV",
    ],

    efeito:
      "Você recebe resistência a Sangue 10. Pode gastar uma ação de movimento e 1 PE para recuperar 1d12 pontos de vida.",

    descricao:
      "A proteção se conecta ao corpo do portador por pequenos filamentos, espinhos ou veias que desaparecem sob a pele. Quando alimentada com esforço paranormal, ela força carne, músculos e vasos a se reconstruírem rapidamente. O processo fecha ferimentos em segundos, mas é acompanhado por calor, pressão e a sensação de que alguma coisa está remodelando o corpo sem pedir autorização.",

    comentario:
      "A ferida fechou completamente. Tente não pensar demais sobre de onde veio a carne nova.",
  }),

  criarMaldicaoProtecao({
    id: "sadica",

    nome: "Sádica",

    elemento: "Sangue",

    intervaloDano: 10,

    bonusPorIntervalo: 1,

    bonusAplicados: [
      "Testes de ataque",
      "Rolagens de dano",
    ],

    momentoCalculo:
      "No início do turno",

    periodoDanoConsiderado:
      "Desde o final do turno anterior",

    arredondamento:
      "Para baixo",

    propriedades: [
      "Calculada no início do turno",
      "+1 para cada 10 pontos de dano sofridos",
      "Aumenta testes de ataque",
      "Aumenta rolagens de dano",
      "Considera o dano sofrido desde o fim do último turno",
    ],

    efeito:
      "No início de seu turno, você recebe +1 em testes de ataque e rolagens de dano para cada 10 pontos de dano que sofreu desde o final de seu turno anterior. Frações são ignoradas. Por exemplo, se sofreu 45 pontos de dano nesse período, recebe +4 nos testes de ataque e nas rolagens de dano durante o turno.",

    descricao:
      "A proteção reage ao sofrimento do portador, pulsando e apertando-se ao redor de seus ferimentos. Quanto mais dano recebe, mais força, agressividade e precisão ela injeta em seus movimentos. A maldição não protege o usuário da dor — ela a preserva, amplifica e transforma em combustível para o próximo ataque.",

    comentario:
      "Ela não quer impedir que você se machuque. Ela quer garantir que isso valha a pena.",
  }),
];

export const MALDICOES_PROTECOES_ARQUIVOS = [
  ...MALDICOES_PROTECOES_CONHECIMENTO_ARQUIVOS,

  ...MALDICOES_PROTECOES_ENERGIA_ARQUIVOS,

  ...MALDICOES_PROTECOES_MORTE_ARQUIVOS,

  ...MALDICOES_PROTECOES_SANGUE_ARQUIVOS,
];

export function obterMaldicoesProtecoesPorElemento(
  elemento,
) {
  return MALDICOES_PROTECOES_ARQUIVOS.filter(
    (maldicao) =>
      maldicao.elemento ===
      elemento,
  );
}

export default MALDICOES_PROTECOES_ARQUIVOS;