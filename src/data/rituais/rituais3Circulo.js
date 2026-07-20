const BASE_RITUAL_3_CIRCULO = {
  tipo: "Ritual",
  circulo: 3,
  nexMinimo: 55,
  custo: "6 PE",
};

const RITUAIS_BASE_3_CIRCULO = [
  {
    id: "alterar-memoria",
    nome: "Alterar Memória",
    elemento: "Conhecimento",
    resumo:
      "Apaga ou modifica memórias recentes do alvo.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "instantânea",
    resistencia: "Vontade anula",
    descricaoCompleta:
      "Você invade a mente do alvo e altera ou apaga memórias de até uma hora atrás. Ao alterar uma lembrança, pode modificar detalhes de acontecimentos recentes, como a identidade de alguém encontrado ou o endereço de um lugar visitado, mas não pode reescrever completamente o evento. As memórias originais retornam após 1d4 dias.",
    verdadeiroCusto: "+4 PE",
    verdadeiro:
      "Permite alterar ou apagar memórias de até 24 horas atrás. Requer 4º círculo.",
  },
  {
    id: "ancora-temporal",
    nome: "Âncora Temporal",
    elemento: "Morte",
    resumo:
      "Impede o alvo de se deslocar durante seus turnos.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Vontade parcial",
    descricaoCompleta:
      "Uma aura em espiral surge sobre o alvo. No início de cada turno, ele faz um teste de Vontade. Se falhar, não pode se deslocar naquele turno, embora ainda possa realizar suas outras ações. O efeito termina quando o alvo passa nesse teste em dois turnos consecutivos.",
    verdadeiroCusto: "+4 PE",
    verdadeiro:
      "Muda o alvo para seres escolhidos. Requer 4º círculo.",
  },
  {
    id: "contato-paranormal",
    nome: "Contato Paranormal",
    elemento: "Conhecimento",
    resumo:
      "Barganha com o Outro Lado para receber dados de auxílio.",
    execucao: "completa",
    alcance: "pessoal",
    alvo: "você",
    duracao: "1 dia",
    descricaoCompleta:
      "Você barganha com uma entidade de Conhecimento para receber auxílio durante o dia, oferecendo sua Sanidade em troca. Ao conjurar o ritual, recebe seis dados d6. Sempre que fizer um teste de perícia, pode gastar um desses dados, rolá-lo e somar o resultado ao teste. Sempre que um desses dados mostrar 6, a entidade consome 2 pontos de sua Sanidade. O ritual termina quando os dados acabam ou quando sua Sanidade chega a zero.",
    discenteCusto: "+4 PE",
    discente:
      "Os dados de auxílio passam a ser d8. Sempre que um deles mostrar 8, a entidade consome 3 pontos de Sanidade. Requer 4º círculo.",
    verdadeiroCusto: "+9 PE",
    verdadeiro:
      "Os dados de auxílio passam a ser d12. Sempre que um deles mostrar 12, a entidade consome 5 pontos de Sanidade. Requer 4º círculo e afinidade.",
  },
  {
    id: "convocacao-instantanea",
    nome: "Convocação Instantânea",
    elemento: "Energia",
    resumo:
      "Transporta para suas mãos um objeto previamente marcado.",
    execucao: "padrão",
    alcance: "ilimitado",
    alvo: "1 objeto de até 2 espaços",
    duracao: "instantânea",
    resistencia: "Vontade anula",
    descricaoCompleta:
      "Você invoca para suas mãos um objeto que esteja em qualquer lugar. O objeto precisa ter sido preparado anteriormente com o símbolo do ritual e pode ocupar no máximo 2 espaços. Caso esteja sendo segurado por outra pessoa, ela pode fazer um teste de Vontade para impedir a convocação. Mesmo nesse caso, você descobre onde o objeto está e quem o carrega, ou ao menos a aparência dessa pessoa. Durante uma hora após convocá-lo, pode gastar uma ação de movimento para devolver o objeto ao local de origem.",
    discenteCusto: "+4 PE",
    discente:
      "Muda o alvo para um objeto de até 10 espaços.",
    verdadeiroCusto: "+9 PE",
    verdadeiro:
      "Muda o alvo para um recipiente Médio, como mala ou caixote, contendo itens que somem até 10 espaços, e a duração para permanente. O recipiente fica escondido no Outro Lado e pode ser convocado para um espaço livre adjacente ou enviado de volta com uma ação padrão. É necessária uma miniatura do recipiente, usada como utensílio de categoria II. Ao conjurar esta versão, você perde 1 PE permanentemente.",
  },
  {
    id: "dissipar-ritual",
    nome: "Dissipar Ritual",
    elemento: "Medo",
    resumo:
      "Encerra rituais ativos em um alvo ou em uma área.",
    execucao: "padrão",
    alcance: "médio",
    alvoOuArea:
      "1 ser ou objeto, ou esfera com 3m de raio",
    duracao: "instantânea",
    descricaoCompleta:
      "Você encerra rituais ativos como se a duração deles tivesse terminado. Efeitos instantâneos não podem ser dissipados depois de acontecerem. Faça um teste de Ocultismo; todo ritual ativo no alvo ou na área cuja DT seja igual ou menor que o resultado é anulado. Também pode usar este ritual em um item amaldiçoado para fazê-lo perder seus poderes durante um dia. Se o item estiver em posse de alguém, seu usuário pode fazer um teste de Vontade para impedir o efeito.",
  },
  {
    id: "ferver-sangue",
    nome: "Ferver Sangue",
    elemento: "Sangue",
    resumo:
      "Faz o sangue do alvo ferver, causando dano e fraqueza.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "sustentada",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "O sangue do alvo aquece até entrar em ebulição. Quando o ritual é conjurado e no início de cada turno do alvo, ele faz um teste de Fortitude. Se falhar, sofre 4d8 pontos de dano de Sangue e fica fraco durante aquela rodada. Se passar, sofre metade do dano e não fica fraco. O efeito termina quando o alvo passa no teste em dois turnos consecutivos.",
    verdadeiroCusto: "+4 PE",
    verdadeiro:
      "Muda o alvo para seres escolhidos. Requer 4º círculo e afinidade.",
  },
  {
    id: "forma-monstruosa",
    nome: "Forma Monstruosa",
    elemento: "Sangue",
    resumo:
      "Transforma você em uma criatura brutal de Sangue.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    descricaoCompleta:
      "Seu corpo assume uma forma monstruosa ligada a Sangue. Roupas e proteção se fundem à carne e objetos empunhados se transformam em garras. Seu equipamento fica inacessível, mas seus bônus continuam valendo. Seu tamanho passa a Grande, você recebe +5 em testes de ataque e rolagens de dano corpo a corpo e ganha 30 PV temporários. Enquanto estiver transformado, não pode falar nem conjurar rituais e deve atacar o ser mais próximo em cada rodada. Se o ser mais próximo for um aliado, pode fazer um teste de Vontade contra a DT do ritual para escolher outro alvo naquele turno.",
    discenteCusto: "+3 PE",
    discente:
      "Além do efeito normal, você fica imune a atordoamento, fadiga, sangramento, sono e veneno.",
    verdadeiroCusto: "+9 PE",
    verdadeiro:
      "Os bônus em testes de ataque e rolagens de dano passam para +10, e os PV temporários passam para 50. Requer 4º círculo e afinidade.",
  },
  {
    id: "mergulho-mental",
    nome: "Mergulho Mental",
    elemento: "Conhecimento",
    resumo:
      "Vasculha a mente do alvo e força respostas verdadeiras.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "sustentada",
    resistencia: "Vontade parcial",
    descricaoCompleta:
      "Você mergulha nos pensamentos do alvo para descobrir informações. Enquanto sustenta o ritual, fica desprevenido e precisa continuar tocando o alvo. No início de cada um de seus turnos, o alvo faz um teste de Vontade. Se falhar, deve responder honestamente a uma pergunta que possa ser respondida com sim ou não. As informações obtidas dependem das perguntas feitas e podem revelar pistas sem necessariamente expor tudo o que o alvo sabe.",
    verdadeiroCusto: "+4 PE",
    verdadeiro:
      "Muda a execução para 1 dia e o alcance para ilimitado. Exige uma cuba de ouro cheia de água e uma máscara, tratadas como acessório de categoria II. Você realiza o mergulho à distância, submergindo o rosto mascarado enquanto mentaliza o alvo. É necessário conhecer alguma informação sobre ele e possuir um objeto pessoal ou fotografia. Requer 4º círculo.",
  },
  {
    id: "poeira-da-podridao",
    nome: "Poeira da Podridão",
    elemento: "Morte",
    resumo:
      "Cria uma nuvem que apodrece seres e objetos.",
    execucao: "padrão",
    alcance: "médio",
    area: "nuvem com 6m de raio",
    duracao: "sustentada",
    resistencia: "Fortitude reduz à metade",
    descricaoCompleta:
      "Você manifesta uma nuvem de poeira que apodrece tudo dentro dela. Ao conjurar o ritual e no início de cada um de seus turnos, seres e objetos na área sofrem 4d8 pontos de dano de Morte. Um teste de Fortitude reduz o dano à metade. Quem falhar no teste também não pode recuperar PV de nenhuma forma durante uma rodada.",
    verdadeiroCusto: "+4 PE",
    verdadeiro:
      "Muda o dano para 4d8+16.",
  },
  {
    id: "purgatorio",
    nome: "Purgatório",
    elemento: "Sangue",
    resumo:
      "Cria uma área de sangue que torna inimigos vulneráveis e dificulta a fuga.",
    execucao: "padrão",
    alcance: "curto",
    area: "círculo com 6m de raio",
    duracao: "sustentada",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "Você faz brotar uma poça de sangue pegajoso. Inimigos na área ficam vulneráveis a dano balístico, corte, impacto e perfuração. Quando um alvo tenta sair da área, sofre 6d6 pontos de dano de Sangue e faz um teste de Fortitude. Se passar, consegue sair. Se falhar, a dor impede o movimento e ele perde a ação de movimento usada na tentativa.",
  },
  {
    id: "salto-fantasma",
    nome: "Salto Fantasma",
    elemento: "Energia",
    resumo:
      "Teletransporta você para um ponto conhecido dentro do alcance.",
    execucao: "padrão",
    alcance: "médio",
    alvo: "você",
    duracao: "instantânea",
    descricaoCompleta:
      "Seu corpo se converte momentaneamente em Energia e reaparece em outro ponto. Você não precisa enxergar nem ter linha de efeito até o destino, mas precisa conhecer o local por observação direta, fotografia ou vídeo. Assim, pode atravessar uma porta fechada ao saltar para um ponto conhecido do outro lado. Depois do transporte, não pode realizar outras ações até o fim do turno. Caso o destino esteja ocupado por matéria sólida, você aparece no espaço livre mais próximo.",
    discenteCusto: "+2 PE",
    discente:
      "Muda a execução para reação. Você salta para um espaço adjacente e recebe +10 na Defesa e em testes de Reflexos contra um ataque ou efeito prestes a atingi-lo.",
    verdadeiroCusto: "+4 PE",
    verdadeiro:
      "Muda o alcance para longo e permite transportar você e até dois outros seres voluntários que esteja tocando.",
  },
  {
    id: "tentaculos-de-lodo",
    nome: "Tentáculos de Lodo",
    elemento: "Morte",
    resumo:
      "Tentáculos de Lodo agarram e esmagam seres na área.",
    execucao: "padrão",
    alcance: "médio",
    area: "círculo com 6m de raio",
    duracao: "cena",
    descricaoCompleta:
      "Uma fenda sombria se abre no chão e libera tentáculos feitos de Lodo da Morte. Ao conjurar o ritual e no início de cada um de seus turnos, faça um teste da manobra agarrar usando Ocultismo no lugar de Luta contra cada alvo na área. Se vencer, o alvo fica agarrado. Se ele já estava agarrado, é esmagado e sofre 4d6 pontos de dano, metade de impacto e metade de Morte. A área é terreno difícil e os tentáculos são imunes a dano.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Aumenta o raio da área para 9m e o dano dos tentáculos para 6d6.",
  },
  {
    id: "transfigurar-agua",
    nome: "Transfigurar Água",
    elemento: "Energia",
    resumo:
      "Manipula água e gelo de maneiras paranormais.",
    execucao: "padrão",
    alcance: "longo",
    area: "esfera com 30m de raio",
    duracao: "cena",
    resistencia: "veja a descrição",
    descricaoCompleta:
      "Você canaliza Energia sobre um corpo de água e escolhe um efeito. Congelar transforma água mundana em gelo e prende seres que estejam nadando, que precisam gastar uma ação padrão e passar em Atletismo contra a DT do ritual para escapar. Derreter transforma gelo mundano em água e encerra o ritual. Enchente eleva o nível da água em até 4,5m ou concede +6m de deslocamento a uma embarcação. Evaporar elimina água e gelo e causa 5d8 pontos de dano de Energia a seres vivos na área, com Fortitude reduzindo à metade. Partir diminui o nível da água em até 4,5m, abrindo um caminho em águas rasas ou criando um redemoinho em águas profundas; uma embarcação pode escapar com Pilotagem contra a DT do ritual.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Aumenta o bônus de deslocamento de Enchente para +12m e o dano de Evaporar para 10d8.",
  },
  {
    id: "transfigurar-terra",
    nome: "Transfigurar Terra",
    elemento: "Energia",
    resumo:
      "Molda, amolece ou solidifica terra e pedra.",
    execucao: "padrão",
    alcance: "longo",
    area: "9 cubos com 1,5m de lado",
    duracao: "instantânea",
    resistencia: "veja a descrição",
    descricaoCompleta:
      "Você imbui terra, pedra, lama, argila ou areia com Energia e escolhe um efeito. Amolecer pode derrubar teto, coluna ou suporte, causando 10d6 pontos de dano de impacto, com Reflexos reduzindo à metade, ou transformar um piso em terreno difícil. Modelar permite criar objetos simples de tamanho Enorme ou menor, abrir passagens ou levantar paredes com cobertura total, RD 8 e 50 PV para cada trecho de 3m. Solidificar transforma lama ou areia em terra ou pedra e deixa agarrados os seres com os pés na superfície; eles podem escapar gastando uma ação padrão e passando em Atletismo contra a DT do ritual.",
    discenteCusto: "+3 PE",
    discente:
      "Muda a área para 15 cubos com 1,5m de lado.",
    verdadeiroCusto: "+7 PE",
    verdadeiro:
      "Também permite afetar todos os tipos de minerais e metais. Requer 4º círculo.",
  },
  {
    id: "videncia",
    nome: "Vidência",
    elemento: "Conhecimento",
    resumo:
      "Permite observar e ouvir um alvo a qualquer distância.",
    execucao: "completa",
    alcance: "ilimitado",
    alvo: "1 ser",
    duracao: "5 rodadas",
    resistencia: "Vontade anula",
    descricaoCompleta:
      "Usando uma superfície reflexiva, como espelho, água ou uma tela desligada, você vê e ouve o alvo e seus arredores em cerca de 6m. No início de cada turno, o alvo pode fazer um teste de Vontade para bloquear a observação naquela rodada. Se passar em dois testes consecutivos, o ritual termina e ele fica imune a esta Vidência por uma semana. Você precisa conhecer alguma informação sobre o alvo, como nome ou fotografia. O teste recebe modificadores conforme seu conhecimento: +10 se sabe muito pouco; +5 se possui algumas informações ou já o viu; nenhum modificador se o conhece bem; -5 se possui um objeto pessoal ou roupa; -10 se possui parte do corpo, como cabelo ou unhas.",
  },
  {
    id: "vomitar-pestes",
    nome: "Vomitar Pestes",
    elemento: "Sangue",
    resumo:
      "Cria um enxame de criaturas de Sangue.",
    execucao: "padrão",
    alcance: "médio",
    efeito:
      "1 enxame Grande, quadrado de 3m",
    duracao: "sustentada",
    resistencia: "Reflexos reduz à metade",
    descricaoCompleta:
      "Você vomita um enxame de pequenas criaturas de Sangue em um ponto adjacente escolhido. O enxame pode atravessar o espaço de outros seres e não impede que entrem em seu espaço. No fim de cada um de seus turnos, causa 5d12 pontos de dano de Sangue a qualquer ser em seu espaço, com Reflexos reduzindo à metade. Você pode gastar uma ação de movimento para mover o enxame com deslocamento de 12m.",
    discenteCusto: "+2 PE",
    discente:
      "Um alvo que falhar em Reflexos também fica agarrado pelo enxame. Ele pode gastar uma ação padrão e passar em Acrobacia ou Atletismo para escapar. Se o enxame for movido, o alvo é libertado.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "O enxame passa a Enorme, ocupando um cubo de 6m de lado, e recebe deslocamento de voo de 18m.",
  },
  {
    id: "zerar-entropia",
    nome: "Zerar Entropia",
    elemento: "Morte",
    resumo:
      "Paralisa o alvo ou o deixa lento.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 pessoa",
    duracao: "cena",
    resistencia: "Vontade parcial",
    descricaoCompleta:
      "Você interrompe a entropia do alvo em relação ao ambiente, deixando-o paralisado. Caso passe no teste de resistência, ele fica lento em vez de paralisado. No início de cada turno, o alvo pode gastar uma ação completa para repetir o teste de Vontade. Se passar, o efeito termina.",
    discenteCusto: "+4 PE",
    discente:
      "Muda o alvo para 1 ser. Requer 4º círculo.",
    verdadeiroCusto: "+11 PE",
    verdadeiro:
      "Muda o alvo para seres escolhidos. Requer 4º círculo e afinidade.",
  },
];

export const RITUAIS_3_CIRCULO =
  RITUAIS_BASE_3_CIRCULO.map(
    (ritual) => ({
      ...BASE_RITUAL_3_CIRCULO,

      alvo: "",
      area: "",
      alvoOuArea: "",
      efeito: "",
      resistencia: "",
      discenteCusto: "",
      discente: "",
      verdadeiroCusto: "",
      verdadeiro: "",

      ...ritual,
    }),
  );

export default RITUAIS_3_CIRCULO;