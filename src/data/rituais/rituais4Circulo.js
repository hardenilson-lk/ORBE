const BASE_RITUAL_4_CIRCULO = {
  tipo: "Ritual",
  circulo: 4,
  nexMinimo: 85,
  custo: "10 PE",
};

const RITUAIS_BASE_4_CIRCULO = [
  {
    id: "alterar-destino",
    nome: "Alterar Destino",
    elemento: "Energia",
    resumo:
      "Antecipa possibilidades futuras para melhorar uma defesa ou resistência.",
    execucao: "reação",
    alcance: "pessoal",
    alvo: "você",
    duracao: "instantânea",
    descricaoCompleta:
      "Você observa incontáveis possibilidades do futuro próximo e escolhe aquela que oferece a melhor chance de sobrevivência. Ao conjurar este ritual, recebe +15 em um teste de resistência ou na Defesa contra um único ataque.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alcance para curto e permite aplicar o efeito em um aliado à sua escolha.",
  },
  {
    id: "canalizar-o-medo",
    nome: "Canalizar o Medo",
    elemento: "Medo",
    resumo:
      "Transfere temporariamente um ritual conhecido para outra pessoa.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao:
      "permanente até o ritual transferido ser usado",
    descricaoCompleta:
      "Você transfere parte de sua conexão paranormal para outra pessoa. Escolha um ritual conhecido de até 3º círculo. O alvo poderá conjurar a forma básica desse ritual uma vez sem pagar o custo-base em PE. Ele ainda pode pagar os custos adicionais de formas avançadas. Enquanto o ritual transferido não for conjurado, seus PE máximos diminuem em uma quantidade igual ao custo-base dele.",
  },
  {
    id: "capturar-o-coracao",
    nome: "Capturar o Coração",
    elemento: "Sangue",
    resumo:
      "Cria uma paixão obsessiva que faz o alvo tentar ajudá-lo.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 pessoa",
    duracao: "cena",
    resistencia: "Vontade parcial",
    descricaoCompleta:
      "Você desperta no alvo uma paixão sobrenatural e obsessiva. No início de cada turno, ele faz um teste de Vontade. Se falhar, deve agir naquele turno para ajudá-lo da melhor forma possível, mesmo que isso o coloque contra antigos aliados. O efeito termina quando o alvo passa em dois testes de Vontade consecutivos.",
  },
  {
    id: "conhecendo-o-medo",
    nome: "Conhecendo o Medo",
    elemento: "Medo",
    resumo:
      "Manifesta medo absoluto e pode destruir completamente a Sanidade do alvo.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "instantânea",
    resistencia: "Vontade parcial",
    descricaoCompleta:
      "Você manifesta o conceito de medo absoluto diretamente na mente do alvo. Se ele falhar no teste de resistência, sua Sanidade é reduzida a zero e ele fica enlouquecendo. Se passar, sofre 10d6 pontos de dano mental e fica apavorado por uma rodada. Uma pessoa que fique insana devido a este ritual pode se transformar em uma criatura paranormal, conforme decisão do mestre.",
  },
  {
    id: "controle-mental",
    nome: "Controle Mental",
    elemento: "Conhecimento",
    resumo:
      "Domina a mente do alvo e o obriga a seguir seus comandos.",
    execucao: "padrão",
    alcance: "médio",
    alvo: "1 pessoa ou animal",
    duracao: "sustentada",
    resistencia: "Vontade parcial",
    descricaoCompleta:
      "Você assume o controle da mente do alvo. Enquanto o ritual for sustentado, ele obedece aos seus comandos, exceto ordens diretamente suicidas. No final de cada um de seus turnos, o alvo pode repetir o teste de Vontade para encerrar o efeito. Ao passar no teste, fica pasmo por uma rodada, mas um mesmo ser só sofre essa condição uma vez por cena por causa deste ritual.",
    discenteCusto: "+5 PE",
    discente:
      "Muda o alvo para até cinco pessoas ou animais.",
    verdadeiroCusto: "+10 PE",
    verdadeiro:
      "Muda o alvo para até dez pessoas ou animais. Requer afinidade com Conhecimento.",
  },
  {
    id: "convocar-o-algoz",
    nome: "Convocar o Algoz",
    elemento: "Morte",
    resumo:
      "Materializa o maior medo do alvo para persegui-lo até derrubá-lo.",
    execucao: "padrão",
    alcance: "1,5m",
    alvo: "1 pessoa",
    duracao: "sustentada",
    resistencia:
      "Vontade parcial e Fortitude parcial",
    descricaoCompleta:
      "Você utiliza os medos mais profundos do alvo para criar um algoz feito de Morte. Apenas a vítima consegue enxergar sua forma com clareza; os demais veem um vulto sombrio. O algoz surge adjacente a você e, no final de cada um de seus turnos, desloca-se 12m em direção ao alvo. Se terminar o turno em alcance curto, o alvo faz Vontade e fica abalado se falhar. Se o algoz terminar adjacente ao alvo, ele faz Fortitude. Se falhar, fica com 0 PV; se passar, sofre 6d6 de dano de Morte, que não pode reduzi-lo abaixo de 1 PV. O algoz é incorpóreo, imune a dano e continua perseguindo a vítima mesmo fora do alcance do ritual.",
  },
  {
    id: "deflagracao-de-energia",
    nome: "Deflagração de Energia",
    elemento: "Energia",
    resumo:
      "Libera uma explosão devastadora de Energia e desativa equipamentos tecnológicos.",
    execucao: "completa",
    alcance: "pessoal",
    area: "explosão com 15m de raio",
    duracao: "instantânea",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "Você acumula uma quantidade imensa de Energia e a libera em uma explosão ao seu redor. Todos os outros seres na área sofrem 3d10 multiplicado por 10 pontos de dano de Energia. Armas de fogo, acessórios, utensílios e outros equipamentos tecnológicos atingidos param de funcionar e são considerados quebrados. Você não é afetado. Alvos que passam no teste sofrem metade do dano e seus equipamentos voltam a funcionar após 1d4 rodadas.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "A explosão passa a afetar apenas os alvos escolhidos por você.",
  },
  {
    id: "distorcao-temporal",
    nome: "Distorção Temporal",
    elemento: "Morte",
    resumo:
      "Cria um bolsão temporal no qual você pode agir isoladamente.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "3 rodadas",
    descricaoCompleta:
      "Você distorce o fluxo do tempo ao seu redor e cria um pequeno bolsão temporal que dura três rodadas. Durante esse período, pode realizar ações, mas não pode sair do lugar nem interagir diretamente com outros seres ou objetos. Efeitos contínuos externos deixam de afetá-lo temporariamente, e ações realizadas por você não afetam o restante da cena até o bolsão acabar. Efeitos de área que ainda estiverem ativos voltarão a agir normalmente quando o tempo se estabilizar.",
  },
  {
    id: "fim-inevitavel",
    nome: "Fim Inevitável",
    elemento: "Morte",
    resumo:
      "Cria um vácuo semelhante a um buraco negro que puxa tudo ao redor.",
    execucao: "completa",
    alcance: "extremo",
    efeito:
      "buraco negro com 1,5m de diâmetro",
    duracao: "4 rodadas",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "Você cria um vácuo em um espaço desocupado dentro do alcance. No início de cada um de seus quatro turnos seguintes, todos os seres a até 90m, incluindo você, fazem um teste de Fortitude. Quem falhar fica caído e é puxado 30m na direção do vácuo. Objetos soltos também são atraídos. Um ser pode gastar uma ação de movimento para se segurar em algo fixo e receber +5 no teste. Seres e objetos que iniciarem o turno tocando o vácuo sofrem 100 pontos de dano de Morte.",
    discenteCusto: "+5 PE",
    discente:
      "Aumenta a duração para cinco rodadas e faz com que você não seja afetado. Requer afinidade.",
    verdadeiroCusto: "+10 PE",
    verdadeiro:
      "Aumenta a duração para seis rodadas e permite escolher seres dentro do alcance que não serão afetados. Requer afinidade.",
  },
  {
    id: "inexistir",
    nome: "Inexistir",
    elemento: "Conhecimento",
    resumo:
      "Desmonta a existência física e mental do alvo.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia: "Vontade parcial",
    descricaoCompleta:
      "Você tenta apagar o alvo da própria existência. Informações sobre sua vida surgem como textos sobre seu corpo enquanto sua estrutura física e mental é desfeita. O alvo sofre 10d12+10 pontos de dano de Conhecimento. Se passar na resistência, sofre apenas 2d12 e fica debilitado por uma rodada. Independentemente do resultado do teste, se esse dano reduzir seus PV a zero ou menos, ele é completamente apagado, sem deixar corpo ou vestígios.",
    discenteCusto: "+5 PE",
    discente:
      "Aumenta o dano principal para 15d12+15 e o dano sofrido em caso de resistência para 3d12.",
    verdadeiroCusto: "+10 PE",
    verdadeiro:
      "Aumenta o dano principal para 20d12+20 e o dano sofrido em caso de resistência para 4d12. Requer afinidade.",
  },
  {
    id: "involucro-de-carne",
    nome: "Invólucro de Carne",
    elemento: "Sangue",
    resumo:
      "Cria uma cópia física sua com as mesmas capacidades.",
    execucao: "padrão",
    alcance: "curto",
    efeito: "1 clone seu",
    duracao: "cena",
    descricaoCompleta:
      "Você manifesta uma poça de sangue da qual emerge uma cópia perfeita de seu corpo. O clone possui as mesmas estatísticas e cópias de todo o equipamento mundano que você carregava. Ele não tem consciência própria e só age quando recebe uma ordem. Você pode gastar uma ação de movimento para ordenar uma tarefa, que será realizada no final de seu turno. Também pode assumir o controle direto do clone no início de seu turno, entrando em transe e utilizando os sentidos dele como se fossem seus. Um observador pode fazer Percepção contra a DT do ritual para perceber que se trata de uma cópia. O clone se desfaz ao chegar a 0 PV ou sair do alcance.",
  },
  {
    id: "lamina-do-medo",
    nome: "Lâmina do Medo",
    elemento: "Medo",
    resumo:
      "Cria uma fenda na Realidade capaz de derrubar imediatamente um alvo.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia: "Fortitude parcial",
    requisito:
      "Aprender este ritual exige um poder específico de trilha.",
    descricaoCompleta:
      "Você manifesta uma lâmina impossível, semelhante a uma ruptura na própria Realidade, e golpeia um alvo adjacente. Se ele falhar no teste de Fortitude, seus PV são reduzidos a zero e ele fica morrendo. Se passar, sofre 10d8 pontos de dano de Medo que ignora resistências e fica apavorado por uma rodada. Uma pessoa que sobreviva após ficar morrendo por este ritual permanece com uma ferida paranormal que nunca cicatriza completamente.",
  },
  {
    id: "medo-tangivel",
    nome: "Medo Tangível",
    elemento: "Medo",
    resumo:
      "Transforma seu corpo em Medo e concede resistência extrema a efeitos mundanos.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    descricaoCompleta:
      "Seu corpo se transforma em uma manifestação de Medo. Você fica imune às condições atordoado, cego, debilitado, enjoado, envenenado, exausto, fatigado, fraco, lento, ofuscado e paralisado, além de doenças e venenos. Também não sofre dano adicional de acertos críticos ou ataques furtivos. Dano balístico, de corte, impacto ou perfuração não pode reduzir seus PV abaixo de 1.",
  },
  {
    id: "possessao",
    nome: "Possessão",
    elemento: "Conhecimento",
    resumo:
      "Transfere sua consciência para o corpo de outra pessoa.",
    execucao: "padrão",
    alcance: "longo",
    alvo: "1 pessoa viva ou morta",
    duracao: "1 dia",
    resistencia: "Vontade anula",
    descricaoCompleta:
      "Você projeta sua consciência no corpo do alvo. Ao possuir uma pessoa viva, a consciência dela é transferida para seu corpo, que permanece desacordado. Você continua usando sua própria ficha, mas utiliza Agilidade, Força, Vigor e deslocamento do corpo possuído. Se o alvo passar no teste, percebe a tentativa e fica imune ao ritual por um dia. Caso um dos corpos envolvidos morra, a consciência sobrevivente fica presa permanentemente no novo corpo até conseguir usar o ritual novamente. Retornar voluntariamente para o corpo original é uma ação livre.",
  },
  {
    id: "presenca-do-medo",
    nome: "Presença do Medo",
    elemento: "Medo",
    resumo:
      "Transforma você em um receptáculo que emana sofrimento e pavor.",
    execucao: "padrão",
    alcance: "pessoal",
    area: "emanação com 9m de raio",
    duracao: "sustentada",
    resistencia: "Vontade reduz à metade",
    descricaoCompleta:
      "Você se torna um receptáculo de Medo puro. Seres na área quando o ritual é conjurado ou que iniciem seus turnos nela sofrem 5d8 pontos de dano mental e 5d8 pontos de dano de Medo. Um teste de Vontade reduz ambos os danos à metade. Quem falhar também fica atordoado por uma rodada, mas cada ser só pode sofrer o atordoamento deste ritual uma vez por cena.",
  },
  {
    id: "teletransporte",
    nome: "Teletransporte",
    elemento: "Energia",
    resumo:
      "Transporta você e outros seres para um local distante.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "até 5 seres voluntários",
    duracao: "instantânea",
    descricaoCompleta:
      "O ritual converte os corpos e equipamentos dos alvos em Energia e os transporta para um lugar escolhido a até 1.000km. Faça um teste de Ocultismo. A DT é 25 para um local visitado frequentemente, 30 para um lugar visitado pelo menos uma vez e 35 para um lugar nunca visitado, mas descrito por alguém que esteve lá. Não é possível escolher um destino desconhecido sem uma descrição confiável. Em caso de sucesso, os alvos chegam ao destino. Em caso de falha, aparecem em um lugar parecido ou a até 1d10 vezes 10km de distância. Se falhar por 5 ou mais, o ritual não transporta ninguém e você fica atordoado por 1d4 rodadas.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Permite transportar os alvos para qualquer lugar da Terra.",
  },
  {
    id: "vinculo-de-sangue",
    nome: "Vínculo de Sangue",
    elemento: "Sangue",
    resumo:
      "Divide o dano sofrido entre você e outro ser.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Fortitude anula",
    descricaoCompleta:
      "Você manifesta símbolos de Sangue em seu corpo e no corpo do alvo. Sempre que você sofre dano, o alvo faz um teste de Fortitude. Se falhar, você sofre apenas metade do dano e ele sofre a outra metade. Ao conjurar o ritual, pode inverter o vínculo para receber metade de todo dano que seria sofrido pelo alvo. Um alvo voluntário não precisa fazer o teste de resistência.",
  },
];

export const RITUAIS_4_CIRCULO =
  RITUAIS_BASE_4_CIRCULO.map(
    (ritual) => ({
      ...BASE_RITUAL_4_CIRCULO,

      alvo: "",
      area: "",
      alvoOuArea: "",
      efeito: "",
      resistencia: "",
      requisito: "",
      discenteCusto: "",
      discente: "",
      verdadeiroCusto: "",
      verdadeiro: "",

      ...ritual,
    }),
  );

export default RITUAIS_4_CIRCULO;