const BASE_RITUAL_2_CIRCULO = {
  tipo: "Ritual",
  circulo: 2,
  nexMinimo: 25,
  custo: "3 PE",
};

const RITUAIS_BASE_2_CIRCULO = [
  {
    id: "aprimorar-fisico",
    nome: "Aprimorar Físico",
    elemento: "Sangue",
    resumo:
      "Bônus em Agilidade ou Força.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "cena",
    descricaoCompleta:
      "O alvo tem seus músculos tonificados e seus ligamentos reforçados, recebendo +1 em Agilidade ou Força, à escolha dele.",
    discenteCusto: "+3 PE",
    discente:
      "Muda o bônus para +2. Requer 3º círculo.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Muda o bônus para +3. Requer 4º círculo e afinidade.",
  },
  {
    id: "aprimorar-mente",
    nome: "Aprimorar Mente",
    elemento: "Conhecimento",
    resumo:
      "Fornece bônus em Intelecto ou Presença.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "cena",
    descricaoCompleta:
      "O alvo tem sua mente energizada por fagulhos do Conhecimento. Ele recebe +1 em Intelecto ou Presença, à escolha dele.",
    discenteCusto: "+3 PE",
    discente:
      "Muda o bônus para +2. Requer 3º círculo.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Muda o bônus para +3. Requer 4º círculo e afinidade.",
  },
  {
    id: "chamas-do-caos",
    nome: "Chamas do Caos",
    elemento: "Energia",
    resumo:
      "Controla o fogo de diferentes maneiras.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "veja a descrição",
    duracao: "cena",
    resistencia:
      "Reflexos reduz à metade, quando aplicável",
    descricaoCompleta:
      "Você manipula o calor e o fogo. Ao conjurar o ritual, escolha um efeito. Chamejar: uma arma corpo a corpo causa +1d6 de dano de fogo. Esquentar: um objeto sofre 1d6 de dano de fogo por rodada e causa esse dano a quem o estiver segurando ou vestindo. Extinguir: apaga uma chama de tamanho Grande ou menor e cria uma nuvem de fumaça. Modelar: permite movimentar uma chama e causar 3d6 de dano de fogo em seres atravessados por ela.",
    discenteCusto: "+3 PE",
    discente:
      "Muda a duração para sustentada. Uma vez por rodada, você pode gastar uma ação de movimento para projetar uma labareda contra um alvo em alcance curto, causando 4d6 de dano de Energia. Reflexos reduz à metade.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Como Discente, mas aumenta o dano para 8d6. Requer 3º círculo.",
  },
  {
    id: "contencao-fantasmagorica",
    nome: "Contenção Fantasmagórica",
    elemento: "Energia",
    resumo:
      "Laços de Energia prendem o alvo.",
    execucao: "padrão",
    alcance: "médio",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Reflexos anula",
    descricaoCompleta:
      "Três laços de Energia surgem do chão e se enroscam no alvo, deixando-o agarrado. O alvo pode gastar uma ação padrão e fazer um teste de Atletismo contra a DT do ritual para destruir os laços. Cada laço tem Defesa 10, 10 PV, RD 5 e imunidade a Energia. Os laços também afetam criaturas incorpóreas.",
    discenteCusto: "+3 PE",
    discente:
      "Aumenta o número de laços para seis. Você pode dividir os laços entre diferentes alvos, com pelo menos dois laços em cada alvo. Requer 3º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Como Discente. Cada laço destruído libera uma onda de choque que causa 2d6+2 de dano de Energia no alvo agarrado. Requer 3º círculo e afinidade.",
  },
  {
    id: "desacelerar-impacto",
    nome: "Desacelerar Impacto",
    elemento: "Morte",
    resumo:
      "Evita dano de queda e reduz o dano de projéteis.",
    execucao: "reação",
    alcance: "curto",
    alvo:
      "1 ser ou objetos somando até 10 espaços",
    duracao:
      "até chegar ao solo ou o fim da cena",
    descricaoCompleta:
      "O alvo cai lentamente, com velocidade máxima de 18m por rodada, evitando dano de queda. Como é conjurado como uma reação, pode salvar você ou um aliado de uma queda inesperada. Se usado em um projétil ou objeto em queda, reduz o dano causado por ele à metade.",
    verdadeiroCusto: "+3 PE",
    verdadeiro:
      "Aumenta o limite para seres ou objetos somando até 100 espaços.",
  },
  {
    id: "descarnar",
    nome: "Descarnar",
    elemento: "Sangue",
    resumo:
      "Dilacera a pele e os órgãos do alvo.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "Lacerações se manifestam na pele e nos órgãos do alvo. Ele sofre 6d8 de dano, metade de corte e metade de Sangue, e fica com uma hemorragia severa. No início de cada turno, deve fazer um teste de Fortitude. Se falhar, sofre 2d8 de dano de Sangue. Dois sucessos seguidos encerram a hemorragia. Se passar na resistência inicial, sofre metade do dano e não fica com hemorragia.",
    discenteCusto: "+3 PE",
    discente:
      "Aumenta o dano inicial para 10d8 e o dano da hemorragia para 4d8. Requer 3º círculo.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Muda o alvo para você e a duração para sustentada. Seus ataques corpo a corpo causam +4d8 de dano de Sangue e provocam hemorragia. Requer 3º círculo e afinidade.",
  },
  {
    id: "deteccao-de-ameacas",
    nome: "Detecção de Ameaças",
    elemento: "Conhecimento",
    resumo:
      "Detecta seres hostis e armadilhas.",
    execucao: "padrão",
    alcance: "pessoal",
    area: "esfera de 18m de raio",
    duracao: "cena",
    descricaoCompleta:
      "Você recebe uma percepção sobrenatural sobre perigos próximos. Quando um ser hostil ou uma armadilha entra na área, você sente o perigo. Pode gastar uma ação de movimento e fazer um teste de Percepção com DT 20. Se passar, descobre a direção e a distância do perigo.",
    discenteCusto: "+3 PE",
    discente:
      "Você não fica desprevenido contra perigos detectados e recebe +5 em testes de resistência contra armadilhas. Requer 3º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda a duração para um dia e concede os benefícios da versão Discente. Requer 4º círculo.",
  },
  {
    id: "dissonancia-acustica",
    nome: "Dissonância Acústica",
    elemento: "Energia",
    resumo:
      "Cria uma área em que nenhum som pode ser ouvido.",
    execucao: "padrão",
    alcance: "médio",
    area: "esfera com 6m de raio",
    duracao: "sustentada",
    descricaoCompleta:
      "Você manipula as vibrações do ar e cria uma área de dissonância sonora. Todos os seres dentro da área ficam surdos. A dissonância também impede que seres dentro da área conjurem rituais.",
    discenteCusto: "+1 PE",
    discente:
      "Muda a área para um objeto. O objeto emana silêncio em um raio de 3m. Um ser involuntário que esteja segurando o objeto pode fazer um teste de Vontade para anular o efeito.",
    verdadeiroCusto: "+3 PE",
    verdadeiro:
      "Muda a duração para cena. Nenhum som pode sair da área, mas os seres dentro dela podem falar, ouvir e conjurar rituais normalmente. Requer 3º círculo.",
  },
  {
    id: "eco-espiral",
    nome: "Eco Espiral",
    elemento: "Morte",
    resumo:
      "Acumula e repete o dano sofrido pelo alvo.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "2 rodadas",
    resistencia:
      "Fortitude reduz à metade",
    descricaoCompleta:
      "Você manifesta uma pequena cópia do alvo feita de cinzas. No turno seguinte, deve gastar uma ação padrão para se concentrar. No segundo turno, deve gastar uma ação padrão para descarregar o ritual. A cópia explode e o alvo sofre dano de Morte igual ao dano que sofreu durante a rodada em que você se concentrou. Se não mantiver as ações necessárias, o ritual se dissipa sem efeito.",
    discenteCusto: "+3 PE",
    discente:
      "Muda o alvo para até cinco seres.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Muda a duração para até três rodadas. Você pode se concentrar nas duas primeiras rodadas e descarregar o dano na terceira. Requer 4º círculo e afinidade.",
  },
  {
    id: "esconder-dos-olhos",
    nome: "Esconder dos Olhos",
    elemento: "Conhecimento",
    resumo:
      "Torna você e seus equipamentos invisíveis.",
    execucao: "livre",
    alcance: "pessoal",
    alvo: "você",
    duracao: "1 rodada",
    descricaoCompleta:
      "Você e seus equipamentos ficam invisíveis, recebendo camuflagem total e +15 em testes de Furtividade. Seres que não conseguem vê-lo ficam desprevenidos contra seus ataques. O efeito termina quando você realiza um ataque ou utiliza uma habilidade hostil. Objetos soltos voltam a ficar visíveis, enquanto objetos carregados por você ficam invisíveis.",
    discenteCusto: "+3 PE",
    discente:
      "Muda a duração para sustentada. Você cria uma esfera de invisibilidade com 3m ao seu redor. Você e os aliados dentro da esfera ficam invisíveis até realizarem uma ação hostil ou saírem da área. Requer 3º círculo.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Muda a execução para padrão, o alcance para toque, o alvo para um ser e a duração para sustentada. O efeito não termina quando o alvo realiza uma ação hostil. Requer 4º círculo e afinidade.",
  },
  {
    id: "flagelo-de-sangue",
    nome: "Flagelo de Sangue",
    elemento: "Sangue",
    resumo:
      "Marca o alvo e o pune caso desobedeça uma ordem.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "cena",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "Você grava uma marca escarificada no alvo enquanto profere uma ordem. Sempre que o alvo desobedece, a marca causa 10d6 de dano de Sangue e o deixa enjoado durante a rodada. Um teste de Fortitude reduz o dano à metade e evita a condição. Se o alvo passar no teste em dois turnos consecutivos, a marca desaparece.",
    discenteCusto: "+3 PE",
    discente:
      "Muda o alvo para um ser, exceto criaturas de Sangue. Requer 3º círculo.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Como Discente, mas muda a duração para um dia. Requer 4º círculo e afinidade.",
  },
  {
    id: "hemofagia",
    nome: "Hemofagia",
    elemento: "Sangue",
    resumo:
      "Causa dano e recupera seus PV.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia:
      "Fortitude reduz à metade",
    descricaoCompleta:
      "Você arranca o sangue do corpo do alvo através da pele, causando 6d6 de dano de Sangue. Em seguida, absorve esse sangue e recupera PV iguais à metade do dano causado.",
    discenteCusto: "+3 PE",
    discente:
      "Remove o teste de resistência. Como parte da execução, você faz um ataque corpo a corpo. Se acertar, causa o dano do ataque e do ritual e recupera PV iguais à metade do dano total.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Muda o alcance para pessoal, o alvo para você e a duração para cena. Uma vez por rodada, você pode gastar uma ação padrão para tocar um ser, causar 4d6 de dano de Sangue e recuperar metade do dano como PV. Requer 4º círculo.",
  },
  {
    id: "invadir-mente",
    nome: "Invadir Mente",
    elemento: "Conhecimento",
    resumo:
      "Causa uma rajada mental ou cria uma ligação telepática.",
    execucao: "padrão",
    alcance: "médio ou toque",
    alvo:
      "1 ser ou 2 pessoas voluntárias",
    duracao:
      "instantânea ou 1 dia",
    resistencia:
      "Vontade parcial ou nenhuma",
    descricaoCompleta:
      "Escolha um efeito. Rajada Mental: o alvo sofre 6d6 de dano de Conhecimento e fica atordoado por uma rodada. Se passar em Vontade, sofre metade do dano e evita a condição. Ligação Telepática: cria um elo mental entre duas pessoas voluntárias, que podem se comunicar independentemente da distância durante um dia.",
    discenteCusto: "+3 PE",
    discente:
      "Rajada Mental causa 10d6 de dano. Na Ligação Telepática, você pode gastar uma ação de movimento para ver e ouvir através dos sentidos do alvo. Um alvo involuntário pode fazer Vontade para suprimir o efeito por uma hora. Requer 3º círculo.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Rajada Mental afeta seres escolhidos. A Ligação Telepática pode conectar até cinco pessoas. Requer 4º círculo.",
  },
  {
    id: "localizacao",
    nome: "Localização",
    elemento: "Conhecimento",
    resumo:
      "Indica a direção e a distância de uma pessoa ou objeto.",
    execucao: "padrão",
    alcance: "pessoal",
    area: "círculo com 90m de raio",
    duracao: "cena",
    descricaoCompleta:
      "O ritual encontra uma pessoa ou objeto dentro da área. Você pode procurar algo geral, como um policial ou objeto metálico, ou algo específico, como uma determinada pessoa ou uma chave. O ritual indica a direção e a distância do alvo mais próximo correspondente. Procurar algo específico exige que você possua uma imagem mental precisa. Uma camada fina de chumbo bloqueia o ritual.",
    discenteCusto: "+3 PE",
    discente:
      "Muda o alcance para toque, o alvo para uma pessoa e a duração para uma hora. A pessoa tocada descobre o caminho mais direto para entrar ou sair de um local. Requer 3º círculo.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Aumenta a área para um círculo com 1km de raio. Requer 4º círculo.",
  },
  {
    id: "miasma-entropico",
    nome: "Miasma Entrópico",
    elemento: "Morte",
    resumo:
      "Cria uma nuvem tóxica que causa dano e enjoo.",
    execucao: "padrão",
    alcance: "médio",
    area: "nuvem com 6m de raio",
    duracao: "instantânea",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "Você cria uma explosão de emanações tóxicas. Seres na área sofrem 4d8 de dano químico e ficam enjoados por uma rodada. Quem passar no teste de resistência sofre metade do dano e não fica enjoado.",
    discenteCusto: "+3 PE",
    discente:
      "Muda o dano para 6d8 de Morte.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Como Discente, mas muda a duração para três rodadas. Um ser que iniciar seu turno dentro da área sofre o dano novamente. Requer 3º círculo.",
  },
  {
    id: "paradoxo",
    nome: "Paradoxo",
    elemento: "Morte",
    resumo:
      "Cria uma distorção temporal que causa dano.",
    execucao: "padrão",
    alcance: "médio",
    area: "esfera com 6m de raio",
    duracao: "instantânea",
    resistencia:
      "Fortitude reduz à metade",
    descricaoCompleta:
      "Você cria uma implosão de distorção temporal contraditória que causa 6d6 de dano de Morte em todos os seres dentro da área.",
    discenteCusto: "+3 PE",
    discente:
      "Muda o efeito para uma esfera com 1,5m de diâmetro e a duração para cena. A esfera causa 4d6 de dano de Morte a qualquer ser no mesmo espaço e pode ser movimentada 9m com uma ação de movimento.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Aumenta o dano para 13d6. Seres reduzidos a 0 PV devem fazer um teste de Fortitude. Se falharem, são reduzidos a cinzas e morrem imediatamente. Requer 4º círculo.",
  },
  {
    id: "protecao-contra-rituais",
    nome: "Proteção contra Rituais",
    elemento: "Medo",
    resumo:
      "Protege contra dano e efeitos paranormais.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "cena",
    descricaoCompleta:
      "Você canaliza uma aura de Medo puro que protege o alvo contra o paranormal. Ele recebe resistência a dano paranormal 5 e +5 em testes de resistência contra rituais e habilidades de criaturas paranormais.",
    discenteCusto: "+3 PE",
    discente:
      "Muda o alvo para até cinco seres tocados. Requer 3º círculo.",
    verdadeiroCusto: "+6 PE",
    verdadeiro:
      "Muda o alvo para até cinco seres tocados, aumenta a resistência a dano paranormal para 10 e o bônus em testes de resistência para +10. Requer 4º círculo.",
  },
  {
    id: "rejeitar-nevoa",
    nome: "Rejeitar Névoa",
    elemento: "Medo",
    resumo:
      "Enfraquece a conjuração de rituais dentro da área.",
    execucao: "padrão",
    alcance: "curto",
    area: "nuvem com 6m de raio",
    duracao: "cena",
    descricaoCompleta:
      "Você manifesta um redemoinho de névoa. Rituais conjurados na área custam +2 PE por círculo e têm sua execução aumentada em um passo: livre para movimento, movimento para padrão, padrão para completa e completa para duas rodadas. Rejeitar Névoa também neutraliza os efeitos de Cinerária, conforme a manutenção dos dois rituais.",
    discenteCusto: "+2 PE",
    discente:
      "A DT dos testes de resistência contra rituais realizados na área diminui em 5.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Como Discente. Todo dano causado por rituais dentro da névoa utiliza os resultados mínimos possíveis.",
  },
  {
    id: "sopro-do-caos",
    nome: "Sopro do Caos",
    elemento: "Energia",
    resumo:
      "Manipula correntes de ar de formas caóticas.",
    execucao: "padrão",
    alcance: "médio",
    area: "varia",
    duracao: "sustentada",
    resistencia: "veja a descrição",
    descricaoCompleta:
      "Escolha um efeito. Ascender: cria uma corrente de ar que ergue um ser ou objeto Médio. Você pode subir ou descer o alvo em até 6m por rodada, até 30m de altura. Sopro: cria uma lufada em um cone de 4,5m, permitindo realizar uma manobra empurrar com Ocultismo contra os seres atingidos. Vento: cria ou intensifica uma área de vento forte dentro do alcance. Manter cada efeito exige ações durante seus turnos.",
    discenteCusto: "+3 PE",
    discente:
      "Passa a afetar alvos Grandes.",
    verdadeiroCusto: "+9 PE",
    verdadeiro:
      "Passa a afetar alvos Enormes.",
  },
  {
    id: "tela-de-ruido",
    nome: "Tela de Ruído",
    elemento: "Energia",
    resumo:
      "Cria uma película protetora que absorve dano.",
    execucao: "padrão ou reação",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena ou instantânea",
    descricaoCompleta:
      "Uma película de Energia recobre seu corpo e absorve energia cinética. Você recebe 30 PV temporários contra dano balístico, corte, impacto e perfuração. Alternativamente, pode conjurar o ritual como uma reação ao sofrer dano, recebendo resistência 15 apenas contra aquele dano.",
    discenteCusto: "+3 PE",
    discente:
      "Aumenta os PV temporários para 60 e a resistência para 30.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Muda o alcance para curto e o alvo para um ser ou objeto Enorme ou menor. Cria uma esfera imóvel que impede a passagem de seres, objetos e efeitos de dano. O alvo pode fazer Reflexos para evitar ser aprisionado. Requer 4º círculo.",
  },
  {
    id: "transfusao-vital",
    nome: "Transfusão Vital",
    elemento: "Sangue",
    resumo:
      "Transfere seus PV para curar outro ser.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    descricaoCompleta:
      "Você toca outro ser e transfere sua própria energia vital para ele. Pode perder até 30 PV para que o alvo recupere a mesma quantidade. Este ritual nunca pode reduzir você a menos de 1 PV.",
    discenteCusto: "+3 PE",
    discente:
      "Permite transferir até 50 PV. Requer 3º círculo.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Permite transferir até 100 PV. Requer 4º círculo.",
  },
  {
    id: "velocidade-mortal",
    nome: "Velocidade Mortal",
    elemento: "Morte",
    resumo:
      "Acelera o alvo e concede uma ação adicional.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "sustentada",
    descricaoCompleta:
      "Você distorce a passagem do tempo ao redor do alvo, tornando-o extremamente veloz. Ele recebe uma ação de movimento adicional por turno. Essa ação adicional não pode ser usada para conjurar rituais.",
    discenteCusto: "+3 PE",
    discente:
      "Em vez de uma ação de movimento, o alvo recebe uma ação padrão adicional por turno.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Muda o alvo para seres escolhidos. Requer 4º círculo e afinidade.",
  },
];

export const RITUAIS_2_CIRCULO =
  RITUAIS_BASE_2_CIRCULO.map(
    (ritual) => ({
      ...BASE_RITUAL_2_CIRCULO,
      ...ritual,
    }),
  );

export default RITUAIS_2_CIRCULO;