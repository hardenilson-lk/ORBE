const DADOS_PADRAO_MALDICAO_ACESSORIO = {
  tipo: "Maldição de acessório",

  alvo:
    "Utensílio ou Vestimenta",

  acessoriosPermitidos: [
    "utensilio",
    "vestimenta",
  ],

  aumentoCategoriaPrimeira: 2,

  aumentoCategoriaAdicional: 1,

  repetivel: false,
};

function criarMaldicaoAcessorio(
  dados,
) {
  return {
    ...DADOS_PADRAO_MALDICAO_ACESSORIO,

    ...dados,
  };
}

export const MALDICOES_ACESSORIOS_CONHECIMENTO_ARQUIVOS = [
  criarMaldicaoAcessorio({
    id: "carisma",

    nome: "Carisma",

    elemento: "Conhecimento",

    atributoAumentado:
      "Presença",

    bonusAtributo: 1,

    forneceRecursosDerivados:
      false,

    propriedades: [
      "Presença +1",
      "Não fornece PE adicionais",
      "Aura de autoconfiança",
    ],

    efeito:
      "O acessório fornece +1 em Presença. Esse aumento não concede pontos de esforço adicionais.",

    descricao:
      "O acessório gera uma aura quase imperceptível que modifica a forma como o portador é percebido. Sua postura parece mais segura, suas palavras soam mais convincentes e pequenos gestos ganham uma importância difícil de ignorar. A maldição não altera fisicamente o usuário, mas faz com que outras pessoas prestem atenção nele mesmo quando prefeririam não fazê-lo.",

    comentario:
      "Todos na sala querem ouvir o que você tem a dizer. Até aqueles que sabem que isso é uma péssima ideia.",
  }),

  criarMaldicaoAcessorio({
    id: "conjuracao",

    nome: "Conjuração",

    elemento: "Conhecimento",

    exigeEscolhaRitual: true,

    circuloRitual: 1,

    ritualSelecionado: null,

    precisaEmpunhar: true,

    permiteConjurarComoConhecido:
      true,

    reducaoCustoSeConhece: 1,

    propriedades: [
      "Escolha um ritual de 1º círculo",
      "O acessório deve estar empunhado",
      "Permite conjurar o ritual escolhido",
      "Custo –1 PE se o portador já conhecer o ritual",
    ],

    efeito:
      "Ao aplicar esta maldição, escolha um ritual de 1º círculo. Enquanto estiver empunhando o acessório, você pode conjurar esse ritual como se o conhecesse. Caso já conheça o ritual escolhido, seu custo diminui em 1 PE.",

    descricao:
      "Sigilos ligados a um ritual específico surgem na superfície do acessório. Ao ser empunhado, o objeto transmite ao usuário o conhecimento necessário para reproduzir aquela manifestação paranormal. As instruções não chegam como palavras ou lembranças, mas como uma certeza invasiva sobre quais movimentos, pensamentos e símbolos devem ser utilizados.",

    comentario:
      "Você não aprendeu o ritual. O objeto apenas colocou as instruções diretamente em um lugar da mente que você não sabia que existia.",
  }),

  criarMaldicaoAcessorio({
    id: "escudo-mental",

    nome: "Escudo Mental",

    elemento: "Conhecimento",

    resistenciaMental: 10,

    propriedades: [
      "Resistência mental 10",
      "Barreira psíquica permanente",
      "Funciona enquanto o acessório estiver em uso",
    ],

    efeito:
      "O acessório gera uma barreira psíquica e fornece resistência mental 10.",

    descricao:
      "Uma camada invisível de símbolos e pensamentos organizados se forma ao redor da mente do portador. Influências paranormais encontram dificuldade para atravessar essa estrutura, como se cada ideia invasora precisasse decifrar um labirinto antes de alcançar seu alvo. Durante ataques mentais, o usuário pode ouvir sussurros, páginas virando ou frases sendo repetidas em idiomas desconhecidos.",

    comentario:
      "As vozes continuam falando. Agora precisam gritar do lado de fora.",
  }),

  criarMaldicaoAcessorio({
    id: "reflexao",

    nome: "Reflexão",

    elemento: "Conhecimento",

    limitePorRodada: 1,

    gatilho:
      "Quando o portador é alvo de um ritual",

    custoPe:
      "Igual ao custo do ritual refletido",

    alvoReflexao:
      "Conjurador original",

    mantemCaracteristicasRitual:
      true,

    portadorTomaDecisoes:
      true,

    propriedades: [
      "Uma vez por rodada",
      "Ativa quando o portador é alvo de um ritual",
      "Custo em PE igual ao custo do ritual",
      "Reflete o ritual para o conjurador",
      "Mantém efeitos e DT originais",
    ],

    efeito:
      "Uma vez por rodada, quando você é alvo de um ritual, pode gastar uma quantidade de PE igual ao custo dele para refleti-lo de volta ao conjurador. As características do ritual, como efeitos e DT, são mantidas, mas você toma quaisquer decisões exigidas pelo ritual.",

    descricao:
      "O acessório identifica a estrutura do ritual no instante em que ela tenta alcançar o portador. Os sigilos presentes no objeto se reorganizam, copiam a manifestação e invertem seu sentido. O fenômeno retorna ao conjurador com a mesma intensidade, embora agora obedeça às decisões de quem deveria ter sido sua vítima.",

    comentario:
      "O ritual chegou corretamente. O acessório marcou o endereço como incorreto e devolveu ao remetente.",
  }),

  criarMaldicaoAcessorio({
    id: "sagacidade",

    nome: "Sagacidade",

    elemento: "Conhecimento",

    atributoAumentado:
      "Intelecto",

    bonusAtributo: 1,

    fornecePericias:
      false,

    forneceGrausTreinamento:
      false,

    propriedades: [
      "Intelecto +1",
      "Não fornece perícias adicionais",
      "Não fornece graus de treinamento adicionais",
      "Acelera os processos mentais",
    ],

    efeito:
      "O acessório fornece +1 em Intelecto. Esse aumento não concede perícias ou graus de treinamento adicionais.",

    descricao:
      "O Conhecimento presente no acessório acelera o raciocínio e organiza informações com velocidade sobrenatural. Problemas complexos parecem se dividir em partes menores, lembranças surgem no instante necessário e padrões antes invisíveis tornam-se evidentes. O efeito pode ser desconfortável, pois a mente continua processando detalhes mesmo quando o portador deseja apenas descansar.",

    comentario:
      "Você finalmente percebeu todas as pistas. Inclusive aquelas que teria preferido continuar ignorando.",
  }),
];

export const MALDICOES_ACESSORIOS_ENERGIA_ARQUIVOS = [
  criarMaldicaoAcessorio({
    id: "defesa",

    nome: "Defesa",

    elemento: "Energia",

    bonusDefesa: 5,

    propriedades: [
      "Defesa +5",
      "Barreira de Energia invisível",
      "Funciona enquanto o acessório estiver em uso",
    ],

    efeito:
      "O acessório gera uma barreira de Energia invisível que fornece +5 na Defesa.",

    descricao:
      "Uma película instável de Energia envolve o portador. A barreira não pode ser vista enquanto está parada, mas se manifesta em distorções coloridas sempre que um ataque se aproxima. Golpes são desviados por impulsos repentinos, projéteis mudam levemente de direção e superfícies próximas podem produzir faíscas sem causa aparente.",

    comentario:
      "O tiro não errou. A realidade apenas decidiu empurrá-lo alguns centímetros para o lado.",
  }),

  criarMaldicaoAcessorio({
    id: "destreza",

    nome: "Destreza",

    elemento: "Energia",

    atributoAumentado:
      "Agilidade",

    bonusAtributo: 1,

    propriedades: [
      "Agilidade +1",
      "Aprimora coordenação",
      "Aumenta a velocidade corporal",
    ],

    efeito:
      "O acessório aprimora a coordenação e a velocidade do portador, fornecendo +1 em Agilidade.",

    descricao:
      "Pequenas descargas percorrem os músculos e o sistema nervoso do usuário. Movimentos são iniciados antes mesmo que o pensamento consciente termine de formulá-los, permitindo reações rápidas e precisas. A sensação pode ser comparada a estar sempre um passo à frente do próprio corpo — ou a ser puxado por algo que conhece seus movimentos antes de você.",

    comentario:
      "Seus reflexos ficaram mais rápidos. Seu bom senso continua na velocidade normal.",
  }),

  criarMaldicaoAcessorio({
    id: "potencia",

    nome: "Potência",

    elemento: "Energia",

    bonusDt: 1,

    aplicaEm: [
      "Habilidades",
      "Poderes",
      "Rituais",
    ],

    propriedades: [
      "DT de habilidades +1",
      "DT de poderes +1",
      "DT de rituais +1",
      "Amplifica manifestações do portador",
    ],

    efeito:
      "O acessório aumenta em +1 a DT para resistir às suas habilidades, poderes e rituais.",

    descricao:
      "A Energia presente no objeto amplifica qualquer manifestação produzida pelo portador. Rituais tornam-se mais intensos, habilidades exercem maior pressão sobre seus alvos e efeitos paranormais resistem com mais força às tentativas de serem anulados. Durante o uso, o acessório pode vibrar, aquecer ou emitir luzes que seguem o ritmo das ativações.",

    comentario:
      "O fenômeno continua sendo o mesmo. Agora ele está mais alto, mais brilhante e muito menos disposto a aceitar um não.",
  }),
];

export const MALDICOES_ACESSORIOS_MORTE_ARQUIVOS = [
  criarMaldicaoAcessorio({
    id: "esforco-adicional",

    nome: "Esforço Adicional",

    elemento: "Morte",

    bonusPe: 5,

    tempoParaAtivar:
      "Um dia de uso",

    perdeBonusAoRemover:
      true,

    propriedades: [
      "Pontos de esforço +5",
      "Ativa após um dia de uso",
      "O bônus não é imediato",
    ],

    efeito:
      "O acessório fornece +5 pontos de esforço. Esse efeito só é ativado após o item permanecer em uso durante um dia.",

    descricao:
      "O objeto altera lentamente a relação do portador com o próprio esforço. Movimentos, pensamentos e manifestações passam a consumir menos de sua energia aparente, como se alguns segundos fossem repetidos e reaproveitados. A adaptação exige um dia completo, período no qual o acessório sincroniza seu fluxo temporal ao do usuário.",

    comentario:
      "Você não ganhou mais energia. Apenas começou a gastar a mesma energia mais de uma vez.",
  }),
];

export const MALDICOES_ACESSORIOS_SANGUE_ARQUIVOS = [
  criarMaldicaoAcessorio({
    id: "disposicao",

    nome: "Disposição",

    elemento: "Sangue",

    atributoAumentado:
      "Vigor",

    bonusAtributo: 1,

    propriedades: [
      "Vigor +1",
      "Aumenta resistência física",
      "Fortalece o organismo",
    ],

    efeito:
      "O poder do Sangue fortalece o organismo do portador, fornecendo +1 em Vigor.",

    descricao:
      "O acessório acelera o coração, fortalece músculos internos e mantém o corpo em constante estado de preparação. O portador resiste melhor ao desgaste físico e sente uma vitalidade intensa percorrendo suas veias. Em momentos de tensão, o objeto pode pulsar junto ao corpo como se possuísse uma circulação própria.",

    comentario:
      "Seu coração está mais forte. O segundo batimento que acompanha o primeiro provavelmente não merece investigação.",
  }),

  criarMaldicaoAcessorio({
    id: "pujanca",

    nome: "Pujança",

    elemento: "Sangue",

    atributoAumentado:
      "Força",

    bonusAtributo: 1,

    propriedades: [
      "Força +1",
      "Amplifica potência muscular",
      "Fortalece movimentos físicos",
    ],

    efeito:
      "O acessório aumenta a potência muscular do portador, fornecendo +1 em Força.",

    descricao:
      "Filamentos invisíveis de Sangue se conectam aos músculos e reforçam cada contração. O usuário sente o corpo responder com uma força superior àquela que deveria possuir, embora movimentos intensos possam ser acompanhados por estalos, veias escurecidas ou uma pressão desconfortável sob a pele.",

    comentario:
      "Você consegue levantar muito mais peso. O acessório não parece particularmente preocupado com a opinião dos seus tendões.",
  }),

  criarMaldicaoAcessorio({
    id: "vitalidade",

    nome: "Vitalidade",

    elemento: "Sangue",

    bonusPv: 15,

    tempoParaAtivar:
      "Um dia de uso",

    perdeBonusAoRemover:
      true,

    propriedades: [
      "Pontos de vida +15",
      "Ativa após um dia de uso",
      "O bônus não é imediato",
    ],

    efeito:
      "O acessório fornece +15 pontos de vida. Esse efeito só é ativado após o item permanecer em uso durante um dia.",

    descricao:
      "Durante um dia inteiro, o objeto modifica lentamente o organismo do portador. A circulação se intensifica, tecidos tornam-se mais densos e o corpo desenvolve uma resistência anormal a ferimentos. O processo não é necessariamente confortável: alguns usuários relatam febre, coceira sob a pele e a sensação de que seus órgãos estão sendo reorganizados.",

    comentario:
      "Você está mais difícil de matar. O acessório nunca prometeu que continuaria completamente humano.",
  }),
];

export const MALDICOES_ACESSORIOS_VARIAVEIS_ARQUIVOS = [
  criarMaldicaoAcessorio({
    id: "protecao-elemental",

    nome: "Proteção Elemental",

    elemento: "Variável",

    exigeEscolhaElemento: true,

    elementosPermitidos: [
      "Conhecimento",
      "Energia",
      "Morte",
      "Sangue",
    ],

    resistenciaElemental: 10,

    contaComoElementoEscolhido:
      true,

    propriedades: [
      "Escolha um elemento",
      "Resistência 10 ao elemento escolhido",
      "O acessório passa a contar como item desse elemento",
    ],

    efeito:
      "Ao aplicar esta maldição, escolha Conhecimento, Energia, Morte ou Sangue. O acessório fornece resistência 10 contra o elemento escolhido e passa a contar como um item desse elemento.",

    descricao:
      "O acessório é impregnado com uma força paranormal específica e cria uma barreira contra manifestações da mesma natureza. Sua aparência muda conforme a escolha: sigilos podem cobrir sua superfície, faíscas podem percorrê-lo, Lodo pode surgir em suas bordas ou pequenas veias podem pulsar em seu interior. O elemento escolhido também determina o preço da maldição sofrido pelo portador.",

    comentario:
      "Ele protege você do elemento escolhido. Isso não significa que o elemento tenha concordado em ajudar gratuitamente.",
  }),
];

export const MALDICOES_ACESSORIOS_ARQUIVOS = [
  ...MALDICOES_ACESSORIOS_CONHECIMENTO_ARQUIVOS,

  ...MALDICOES_ACESSORIOS_ENERGIA_ARQUIVOS,

  ...MALDICOES_ACESSORIOS_MORTE_ARQUIVOS,

  ...MALDICOES_ACESSORIOS_SANGUE_ARQUIVOS,

  ...MALDICOES_ACESSORIOS_VARIAVEIS_ARQUIVOS,
];

export function obterMaldicoesAcessoriosPorElemento(
  elemento,
) {
  return MALDICOES_ACESSORIOS_ARQUIVOS.filter(
    (maldicao) =>
      maldicao.elemento ===
      elemento,
  );
}

export default MALDICOES_ACESSORIOS_ARQUIVOS;