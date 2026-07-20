export const RITUAIS_1_CIRCULO = [
  {
    id: "amaldicoar-arma",
    nome: "Amaldiçoar Arma",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Variável",
    resumo: "Arma causa mais dano.",
    execucao: "padrão",
    alcance: "toque",
    alvo:
      "1 arma corpo a corpo ou pacote de munição",
    duracao: "cena",
    descricaoCompleta:
      "Quando aprender este ritual, escolha um elemento entre Conhecimento, Energia, Morte e Sangue. Este ritual passa a ser do elemento escolhido. Você imbui a arma ou munições com o elemento, fazendo com que causem +1d6 de dano do tipo do elemento.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o bônus de dano para +2d6. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o bônus de dano para +4d6. Requer 3º círculo e afinidade.",
  },
  {
    id: "amaldicoar-tecnologia",
    nome: "Amaldiçoar Tecnologia",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Energia",
    resumo: "Aprimora um item.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 acessório ou arma de fogo",
    duracao: "cena",
    descricaoCompleta:
      "Você imbui o alvo com Energia, fazendo-o funcionar acima de sua capacidade. O item recebe uma modificação a sua escolha.",
    discenteCusto: "+2 PE",
    discente:
      "Muda para duas modificações. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda para três modificações. Requer 3º círculo e afinidade.",
  },
  {
    id: "arma-atroz",
    nome: "Arma Atroz",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Sangue",
    resumo:
      "Arma corpo a corpo recebe bônus em testes de ataque e margem de ameaça.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 arma corpo a corpo",
    duracao: "sustentada",
    descricaoCompleta:
      "A arma é recoberta por veias carmesim e passa a exalar uma aura de violência. Ela fornece +2 em testes de ataque e +1 na margem de ameaça.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o bônus para +5 em testes de ataque. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o bônus para +5 em testes de ataque e +2 na margem de ameaça e no multiplicador de crítico. Requer 3º círculo e afinidade.",
  },
  {
    id: "armadura-de-sangue",
    nome: "Armadura de Sangue",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Sangue",
    resumo:
      "Recobre o corpo com placas de sangue endurecido.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    descricaoCompleta:
      "Seu sangue escorre para fora do corpo, cobrindo-o sob a forma de uma carapaça que fornece +5 em Defesa. Esse bônus é cumulativo com outros rituais, mas não com bônus fornecido por equipamento.",
    discenteCusto: "+5 PE",
    discente:
      "Muda o efeito para fornecer +10 na Defesa e resistência a balístico, corte, impacto e perfuração 5. Requer 3º círculo.",
    verdadeiroCusto: "+9 PE",
    verdadeiro:
      "Muda o efeito para fornecer +15 na Defesa e resistência a balístico, corte, impacto e perfuração 10. Requer 4º círculo e afinidade.",
  },
  {
    id: "cicatrizacao",
    nome: "Cicatrização",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Morte",
    resumo:
      "Acelera a regeneração de um ferimento.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    descricaoCompleta:
      "Você acelera o tempo ao redor das feridas do alvo, que cicatrizam instantaneamente. O alvo recupera 3d8+3 PV, mas envelhece 1 ano automaticamente.",
    discenteCusto: "+2 PE",
    discente:
      "Aumenta a cura para 5d8+5 PV. Requer 2º círculo.",
    verdadeiroCusto: "+9 PE",
    verdadeiro:
      "Muda o alcance para curto, o alvo para seres escolhidos e aumenta a cura para 7d8+7 PV. Requer 4º círculo e afinidade com Morte.",
  },
  {
    id: "cineraria",
    nome: "Cinerária",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Medo",
    resumo:
      "Névoa fortalece rituais na área.",
    execucao: "padrão",
    alcance: "curto",
    area: "nuvem de 6m de raio",
    duracao: "cena",
    descricaoCompleta:
      "Você manifesta uma névoa carregada de essência paranormal. Rituais conjurados dentro da névoa têm sua DT aumentada em +5.",
    discenteCusto: "+2 PE",
    discente:
      "Além do normal, rituais conjurados dentro da névoa custam -2 PE.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Além do normal, rituais conjurados dentro da névoa causam dano maximizado.",
  },
  {
    id: "coincidencia-forcada",
    nome: "Coincidência Forçada",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Energia",
    resumo: "Recebe bônus em testes.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    descricaoCompleta:
      "Você manipula os caminhos do caos para que o alvo tenha mais sorte. O alvo recebe +2 em testes de perícias.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o alvo para aliados à sua escolha. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alvo para aliados à sua escolha e o bônus para +5. Requer 3º círculo e afinidade.",
  },
  {
    id: "compreensao-paranormal",
    nome: "Compreensão Paranormal",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Conhecimento",
    resumo:
      "Você entende qualquer linguagem escrita ou falada.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser ou objeto",
    duracao: "cena",
    resistencia:
      "Vontade anula, veja o texto",
    descricaoCompleta:
      "O ritual confere a você compreensão sobrenatural da linguagem. Se tocar um objeto contendo informação, como um livro ou dispositivo com uma gravação, você entende as palavras mesmo que não conheça seu idioma, contanto que seja um idioma humano. O efeito não funciona com símbolos ou sigilos paranormais. Se tocar uma pessoa, pode se comunicar com ela como se falassem um idioma em comum. Se tocar um ser não inteligente, como um animal, pode perceber seus sentimentos básicos, como medo ou felicidade. Um alvo involuntário tem direito a um teste de Vontade.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o alcance para curto e o alvo para alvos escolhidos. Você pode entender todos os alvos afetados. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alcance para pessoal e o alvo para você. Em vez do normal, você pode falar, entender e escrever qualquer idioma humano. Requer 3º círculo.",
  },
  {
    id: "consumir-manancial",
    nome: "Consumir Manancial",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Morte",
    resumo:
      "Suga o tempo de vida de seres próximos, recebendo PV temporários.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "instantânea",
    descricaoCompleta:
      "Você suga uma pequena porção do tempo de vida de plantas, insetos e até mesmo do solo ao redor, gerando Lodo e recebendo 3d6 pontos de vida temporários. Os PV temporários desaparecem ao final da cena.",
    discenteCusto: "+2 PE",
    discente:
      "Muda os PV temporários recebidos para 6d6. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alvo para uma esfera com 6m de raio centrada em você e a resistência para Fortitude reduz à metade. Em vez do normal, você suga energia de todos os seres vivos na área, causando 3d6 pontos de dano de Morte em cada um e recebendo PV temporários iguais ao dano total causado até o final da cena. Requer 3º círculo e afinidade.",
  },
  {
    id: "corpo-adaptado",
    nome: "Corpo Adaptado",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Sangue",
    resumo:
      "Ignora frio e calor e permite respirar debaixo d'água.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa ou animal",
    duracao: "cena",
    descricaoCompleta:
      "Este ritual modifica a biologia do alvo para permitir a sobrevivência em ambientes hostis. O alvo fica imune a calor e frio extremos, pode respirar na água se respirar ar ou vice-versa e não sufoca em fumaça densa.",
    discenteCusto: "+2 PE",
    discente:
      "Muda a duração para 1 dia.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alcance para curto e o alvo para pessoas ou animais escolhidos.",
  },
  {
    id: "decadencia",
    nome: "Decadência",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Morte",
    resumo:
      "Acelera o envelhecimento dos órgãos internos do alvo.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia:
      "Fortitude reduz à metade",
    descricaoCompleta:
      "Espirais de trevas envolvem sua mão e definham o alvo, que sofre 2d8+2 pontos de dano de Morte.",
    discenteCusto: "+2 PE",
    discente:
      "Muda a resistência para nenhuma e o dano para 3d8+3. Como parte da execução do ritual, você transfere as espirais para uma arma e faz um ataque corpo a corpo contra o alvo com esta arma. Se acertar, causa o dano da arma e do ritual, somados.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alcance para pessoal, o alvo para uma explosão com 6m de raio e o dano para 8d8+8. As espirais afetam todos os seres na área. Requer 3º círculo.",
  },
  {
    id: "definhar",
    nome: "Definhar",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Morte",
    resumo:
      "O alvo fica fatigado ou vulnerável.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "Você dispara uma lufada de cinzas que drena as forças do alvo. O alvo fica fatigado. Se passar no teste de resistência, em vez disso fica vulnerável.",
    discenteCusto: "+2 PE",
    discente:
      "Em vez do normal, o alvo fica exausto. Se passar na resistência, fica fatigado. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Como discente, mas muda o alvo para até 5 seres. Requer 3º círculo e afinidade com Morte.",
  },
  {
    id: "distorcer-aparencia",
    nome: "Distorcer Aparência",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Sangue",
    resumo:
      "Muda a aparência de um ou mais alvos.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia:
      "Vontade desacredita",
    descricaoCompleta:
      "Você modifica sua aparência para se parecer com outra pessoa. Isso inclui altura, peso, tom de pele, cor de cabelo, timbre de voz, impressão digital, córnea e outros detalhes. Você recebe +10 em testes de Enganação para disfarce, mas não recebe habilidades da nova forma nem modifica suas demais estatísticas.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o alcance para curto e o alvo para 1 ser. Um alvo involuntário pode anular o efeito com um teste de Vontade.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Como em Discente, mas muda o alvo para seres escolhidos. Requer 3º círculo.",
  },
  {
    id: "eletrocussao",
    nome: "Eletrocussão",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Energia",
    resumo:
      "Corrente voltaica eletrocuta o alvo.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser ou objeto",
    duracao: "instantânea",
    resistencia: "Fortitude parcial",
    descricaoCompleta:
      "Você manifesta e dispara uma corrente elétrica contra o alvo, que sofre 3d6 pontos de dano de eletricidade e fica vulnerável por uma rodada. Se passar no teste de resistência, sofre apenas metade do dano e evita a condição. Se usado contra objetos eletrônicos, este ritual causa o dobro de dano e ignora resistência.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o alvo para uma linha de 30m. Você dispara um poderoso raio que causa 6d6 pontos de dano de Energia em todos os seres e objetos livres na área. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alvo para alvos escolhidos. Em vez do normal, você dispara vários relâmpagos, um para cada alvo escolhido, causando 8d6 pontos de dano de Energia em cada. Requer 3º círculo.",
  },
  {
    id: "embaralhar",
    nome: "Embaralhar",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Energia",
    resumo:
      "Cria duplicatas para confundir inimigos e aumentar a Defesa.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    descricaoCompleta:
      "Você cria três cópias ilusórias suas, como hologramas extremamente realistas. As cópias ficam ao seu redor e imitam suas ações, tornando difícil para um inimigo saber quem é o verdadeiro. Você recebe +6 na Defesa. Cada vez que um ataque contra você erra, uma das imagens desaparece e o bônus na Defesa diminui em 2. Um oponente deve ver as cópias para ser confundido. Se você estiver invisível ou o atacante fechar os olhos, você não recebe o bônus, mas o atacante sofre as penalidades normais por não enxergar.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o número de cópias para 5 e o bônus na Defesa para +10. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o número de cópias para 8 e o bônus na Defesa para +16. Além do normal, toda vez que uma cópia é destruída, emite um clarão de luz. O ser que destruiu a cópia fica ofuscado por uma rodada. Requer 3º círculo.",
  },
  {
    id: "enfeiticar",
    nome: "Enfeitiçar",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Conhecimento",
    resumo: "O alvo se torna prestativo.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 pessoa",
    duracao: "cena",
    resistencia: "Vontade anula",
    descricaoCompleta:
      "Este ritual torna o alvo prestativo. Ele não fica sob seu controle, mas percebe suas palavras e ações da maneira mais favorável possível. Você recebe +10 em testes de Diplomacia com ele. Um alvo hostil ou envolvido em combate recebe +5 em seu teste de resistência. Se você ou seus aliados tomarem qualquer ação hostil contra o alvo, o efeito é dissipado e o alvo retorna à atitude que tinha antes, ou a uma atitude pior, de acordo com o mestre.",
    discenteCusto: "+2 PE",
    discente:
      "Em vez do normal, você sugere uma ação para o alvo e ele obedece. A sugestão deve parecer aceitável, a critério do mestre. Quando o alvo executa a ação, o efeito termina. Você pode determinar uma condição específica para a sugestão. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Afeta todos os alvos dentro do alcance. Requer 3º círculo.",
  },
  {
    id: "espirais-da-perdicao",
    nome: "Espirais da Perdição",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Morte",
    resumo:
      "O alvo sofre penalidade em testes de ataque.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    descricaoCompleta:
      "Espirais surgem no corpo do alvo, tornando seus movimentos lentos. O alvo sofre -1d20 em testes de ataque.",
    discenteCusto: "+2 PE",
    discente:
      "Muda a penalidade para -2d20. Requer 2º círculo.",
    verdadeiroCusto: "+8 PE",
    verdadeiro:
      "Muda a penalidade para -3d20 e o alvo para seres escolhidos. Requer 3º círculo.",
  },
  {
    id: "fortalecimento-sensorial",
    nome: "Fortalecimento Sensorial",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Sangue",
    resumo:
      "Melhora seus sentidos e sua percepção.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    descricaoCompleta:
      "Você potencializa seus sentidos, recebendo +1d20 em Investigação, Luta, Percepção e Pontaria.",
    discenteCusto: "+2 PE",
    discente:
      "Além do normal, seus inimigos sofrem -1d20 em testes de ataque contra você. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Além do normal, você apura seus sentidos para perceber perigo. Você fica imune às condições surpreendido e desprevenido e recebe +10 em Defesa e Reflexos. Requer 4º círculo e afinidade.",
  },
  {
    id: "luz",
    nome: "Luz",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Energia",
    resumo:
      "Um objeto brilha como uma lâmpada.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 objeto",
    duracao: "cena",
    resistencia:
      "Vontade anula, veja o texto",
    descricaoCompleta:
      "O alvo emite luz de cores alternadas e brilhantes, mas não produz calor, em uma área com 9m de raio. O objeto pode ser guardado para interromper a luz, que voltará a funcionar caso o objeto seja revelado. Se o alvo for um objeto em posse de uma pessoa involuntária, ela tem direito a um teste de Vontade para anular o efeito.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o alcance para longo e o efeito para 4 esferas brilhantes. Cria esferas flutuantes de pura luz com 10cm de diâmetro, que você pode posicionar onde quiser dentro do alcance. Uma vez por rodada, você pode mover as esferas com uma ação livre. Cada esfera ilumina uma área de 6m de raio. Se uma esfera ocupar o espaço de um ser, ele fica ofuscado e sua silhueta pode ser vista claramente. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "A luz é cálida como a do sol. Dentro da área, seus aliados recebem +1d20 em testes de Vontade e seus inimigos ficam ofuscados. Requer 3º círculo.",
  },
  {
    id: "nuvem-de-cinzas",
    nome: "Nuvem de Cinzas",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Morte",
    resumo:
      "Uma nuvem fornece camuflagem.",
    execucao: "padrão",
    alcance: "curto",
    efeito:
      "nuvem com 6m de raio e 6m de altura",
    duracao: "cena",
    descricaoCompleta:
      "Uma nuvem de fuligem espessa eleva-se de um ponto a sua escolha, obscurecendo toda a visão. Seres a até 1,5m têm camuflagem leve e seres a partir de 3m têm camuflagem total. Um vento forte dispersa a nuvem em 4 rodadas e um vendaval a dispersa em 1 rodada. A nuvem não funciona sob a água.",
    discenteCusto: "+2 PE",
    discente:
      "Você pode escolher seres no alcance ao conjurar o ritual; eles enxergam através do efeito. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Além do normal, a nuvem fica espessa, quase sólida. Qualquer ser dentro dela tem seu deslocamento reduzido para 3m e sofre -2 em testes de ataque. Requer 3º círculo.",
  },
  {
    id: "odio-incontrolavel",
    nome: "Ódio Incontrolável",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Sangue",
    resumo:
      "Aumenta o combate corpo a corpo, mas impede calma e concentração.",
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "cena",
    descricaoCompleta:
      "O alvo entra em um frenesi, aumentando sua agressividade e capacidade de luta. Ele recebe +2 em testes de ataque e rolagens de dano corpo a corpo e resistência a balístico, corte, impacto e perfuração 5. Enquanto o efeito durar, o alvo não pode fazer nenhuma ação que exija calma e concentração, como usar Furtividade ou conjurar rituais, e deve sempre atacar um alvo em sua rodada, mesmo que seja um aliado se ele for o único a seu alcance.",
    discenteCusto: "+2 PE",
    discente:
      "Além do normal, sempre que o alvo usar a ação agredir, pode fazer um ataque corpo a corpo adicional contra o mesmo alvo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o bônus de ataque e dano para +5 e o alvo passa a sofrer apenas metade do dano balístico, de corte, impacto e perfuração. Requer 3º círculo e afinidade.",
  },
  {
    id: "ouvir-os-sussurros",
    nome: "Ouvir os Sussurros",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Conhecimento",
    resumo:
      "Consulta vozes do Outro Lado para receber informações.",
    execucao: "completa",
    alcance: "pessoal",
    alvo: "você",
    duracao: "instantânea",
    descricaoCompleta:
      "O ritual conecta você com os sussurros, memórias ecoadas pelo Outro Lado, que podem ser consultadas para receber conhecimento proibido sobre uma ação que será tomada em breve. Faça uma pergunta sobre um evento da mesma cena que possa ser respondida com sim ou não. O mestre rola 1d6 em segredo. Com um resultado de 2 a 6, o ritual funciona e você recebe uma resposta: sim, não ou sim e não. Com resultado 1, o ritual falha e oferece a resposta não. Não há como saber se a resposta foi dada porque o ritual falhou. Conjurar este ritual várias vezes sobre o mesmo assunto gera sempre o primeiro resultado.",
    discenteCusto: "+2 PE",
    discente:
      "Muda a execução para 1 minuto. Você pode consultar os ecos fazendo uma pergunta sobre um evento que poderá acontecer até um dia no futuro. O mestre rola a chance de falha. Em caso de sucesso, você recebe uma resposta, desde uma frase simples até uma profecia ou enigma. Em caso de falha, não recebe resposta. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda a execução para 10 minutos e a duração para 5 rodadas. Você consulta os ecos, podendo fazer uma pergunta por rodada, desde que possa ser respondida com sim, não ou ninguém sabe. O mestre rola a chance de falha para cada pergunta. Em caso de falha, a resposta também é ninguém sabe. Requer 3º círculo.",
  },
  {
    id: "perturbacao",
    nome: "Perturbação",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Conhecimento",
    resumo:
      "Força o alvo a obedecer a uma ordem.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 pessoa",
    duracao: "1 rodada",
    resistencia: "Vontade anula",
    descricaoCompleta:
      "Você dá uma ordem que o alvo deve ser capaz de ouvir, mas não precisa entender. Se falhar na resistência, ele deve obedecer à ordem em seu próprio turno da melhor maneira possível. As ordens básicas são: Fuja, Largue, Pare, Sente-se e Venha.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o alvo para 1 ser e adiciona o comando Sofra. O alvo é acometido de dor aguda, sofre 3d8 pontos de dano de Conhecimento e fica abalado por uma rodada.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alvo para até 5 seres ou adiciona o comando Ataque. O alvo deve fazer a ação agredir contra outro alvo a sua escolha em alcance médio, com todas as suas capacidades. Requer 3º círculo e afinidade.",
  },
  {
    id: "polarizacao-caotica",
    nome: "Polarização Caótica",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Energia",
    resumo:
      "Objetos metálicos são atraídos ou repelidos.",
    execucao: "padrão",
    alcance: "curto",
    alvo: "você",
    duracao: "sustentada",
    resistencia:
      "Vontade anula, quando aplicável",
    descricaoCompleta:
      "Você gera uma aura magnética sobrenatural. Ao usar Atrair, pode gastar uma ação de movimento para puxar um objeto metálico de espaço 2 ou menor dentro do alcance. Se o objeto estiver livre, ele voa para suas mãos ou seus pés. Ao usar Repelir, você repele objetos de espaço 2 ou menor, incluindo quase todos os projéteis e armas de arremesso, recebendo resistência a balístico, corte, impacto e perfuração 5.",
    discenteCusto: "+2 PE",
    discente:
      "Muda a duração para instantânea. A energia magnética é expelida de uma vez e arremessa até 10 objetos, ou um total de 10 espaços. Objetos arremessados podem atingir seres em seu caminho. Seres atingidos têm direito a um teste de Reflexos para reduzir o dano à metade. Seres e objetos segurados podem resistir com Vontade.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Muda o alcance para médio e a duração para instantânea. Você pode usar uma ação de movimento para levitar e mover um ser ou objeto de espaço 10 ou menor por até 9m em qualquer direção dentro do alcance. Um ser pode anular o efeito sobre si ou sobre um objeto que possua passando em um teste de Vontade.",
  },
  {
    id: "tecer-ilusao",
    nome: "Tecer Ilusão",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Conhecimento",
    resumo:
      "Cria uma ilusão visual ou sonora.",
    execucao: "padrão",
    alcance: "médio",
    efeito:
      "ilusão em até 4 cubos de 1,5m",
    duracao: "cena",
    resistencia:
      "Vontade desacredita",
    descricaoCompleta:
      "Este ritual cria uma ilusão visual, como uma pessoa ou parede, ou uma ilusão sonora, como um grito ou uivo. O ritual cria apenas imagens ou sons simples. Não é possível criar cheiros, texturas, temperaturas ou sons complexos. Seres e objetos atravessam a ilusão sem sofrer dano, mas o efeito pode esconder uma armadilha ou emboscada. A ilusão é dissipada se você sair do alcance.",
    discenteCusto: "+2 PE",
    discente:
      "Muda o efeito para até 8 cubos de 1,5m e a duração para sustentada. Você pode combinar imagem e som e criar sons complexos, odores, sensações térmicas e táteis. Seres não conseguem atravessar a ilusão sem passar em Vontade. Você pode mover ou alterar a ilusão com uma ação livre. Requer 2º círculo.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Você cria a ilusão de um perigo mortal. Um alvo interagindo com a ilusão deve fazer um teste de Vontade. Se falhar, acredita que a ilusão é real e sofre 6d6 pontos de dano de Conhecimento. Se passar em dois testes seguidos, o efeito é anulado para ele. Requer 3º círculo.",
  },
  {
    id: "terceiro-olho",
    nome: "Terceiro Olho",
    tipo: "Ritual",
    circulo: 1,
    nexMinimo: 5,
    custo: "1 PE",
    elemento: "Conhecimento",
    resumo:
      "Você vê manifestações paranormais.",
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    descricaoCompleta:
      "Seus olhos se enchem de sigilos e você passa a enxergar auras paranormais em alcance longo. Rituais, itens amaldiçoados e criaturas emitem auras. Você sabe o elemento da aura e seu poder aproximado. Também pode gastar uma ação de movimento para descobrir se um ser que possa ver em alcance médio tem poderes paranormais, se é capaz de conjurar rituais e de quais elementos.",
    discenteCusto: "+2 PE",
    discente:
      "Muda a duração para 1 dia.",
    verdadeiroCusto: "+5 PE",
    verdadeiro:
      "Também permite enxergar objetos e seres invisíveis, que aparecem como formas translúcidas.",
  },
];

export default RITUAIS_1_CIRCULO;