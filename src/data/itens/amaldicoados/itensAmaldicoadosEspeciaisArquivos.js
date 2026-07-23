const CATEGORIAS_ROMANAS = {
  0: "0",
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
};

export function criarItemAmaldicoadoEspecial(
  item = {},
) {
  const categoriaNumerica =
    Number.isFinite(
      Number(
        item.categoriaNumerica,
      ),
    )
      ? Number(
          item.categoriaNumerica,
        )
      : 2;

  return {
    tipo: "Item especial",
    categoria:
      "Item amaldiçoado especial",
    categoriaNumerica,
    categoriaOficial:
      CATEGORIAS_ROMANAS[
        categoriaNumerica
      ] || "II",
    quantidade: 1,
    volume: 1,
    ativo: true,
    amaldicoado: true,
    itemAmaldicoadoEspecial: true,
    numeroMaldicoes: 1,
    patenteMinima:
      "Agente Especial",
    ...item,
    categoriaNumerica,
    categoriaOficial:
      CATEGORIAS_ROMANAS[
        categoriaNumerica
      ] || "II",
  };
}

export const ITENS_AMALDICOADOS_ESPECIAIS_SANGUE_ARQUIVOS =
  [
    criarItemAmaldicoadoEspecial({
      id: "coracao-pulsante",
      nome: "Coração Pulsante",
      elemento: "Sangue",
      grupo: "Sangue",
      imagem: "coracao-pulsante",
      empunhadura: "Uma mão",
      acao: "Reação",
      teste:
        "Fortitude, DT 15 + 5 por uso adicional no mesmo dia",
      propriedades: [
        "Reduz dano pela metade",
        "Pode ser destruído",
        "Precisa ser drenado diariamente",
      ],
      efeito:
        "Quando estiver empunhando o coração e sofrer dano, o usuário pode gastar uma reação para apertá-lo e reduzir esse dano pela metade. Após cada ativação, deve realizar um teste de Fortitude com DT 15, aumentada em 5 para cada uso adicional no mesmo dia. Se falhar, o coração é destruído.",
      descricao:
        "Um coração humano coberto pelo elemento de Sangue, que continua pulsando mesmo fora de um corpo. Seu interior produz Sangue paranormal continuamente. Qualquer mochila, caixa ou compartimento utilizado para transportá-lo precisa ser drenado uma vez por dia. Caso isso não aconteça, o líquido pode vazar e danificar os outros objetos armazenados no mesmo local.",
      comentario:
        "Ele continua batendo mesmo quando ninguém está por perto. O problema é descobrir por quem.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "coroa-de-espinhos",
      nome: "Coroa de Espinhos",
      elemento: "Sangue",
      grupo: "Sangue",
      imagem: "coroa-de-espinhos",
      empunhadura: "Vestido",
      acao: "Reação",
      propriedades: [
        "Transforma dano mental",
        "Uma vez por rodada",
        "Exige uma semana de uso",
      ],
      efeito:
        "Uma vez por rodada, o usuário pode gastar uma reação para transformar o dano mental que sofreria em dano de Sangue. Enquanto estiver usando a coroa, não recupera Sanidade através de descanso.",
      descricao:
        "Pode assumir a forma de uma coroa, colar ou pulseira feita de um material semelhante a espinhos de roseira banhados em Sangue. O item precisa permanecer vestido durante uma semana para que sua ligação com o usuário seja estabelecida e seus efeitos comecem a funcionar.",
      comentario:
        "Ela protege a mente transformando pensamentos dolorosos em feridas muito mais fáceis de enxergar.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "frasco-de-vitalidade",
      nome: "Frasco de Vitalidade",
      elemento: "Sangue",
      grupo: "Sangue",
      imagem: "frasco-de-vitalidade",
      acao:
        "1 minuto para encher; ação padrão para beber",
      teste: "Fortitude, DT 20",
      armazenamentoMaximo: 20,
      propriedades: [
        "Armazena até 20 PV",
        "Mantém sangue fresco",
        "Pode causar enjoo",
      ],
      efeito:
        "O usuário pode gastar 1 minuto e sofrer até 20 pontos de dano para armazenar a mesma quantidade de sangue no frasco. Depois, pode gastar uma ação padrão para beber seu conteúdo e recuperar uma quantidade de PV igual à armazenada. Após beber, deve passar em Fortitude DT 20 ou fica enjoado por uma rodada.",
      descricao:
        "Um pequeno recipiente de vidro com uma tampa metálica marcada por um selo de Sangue. O sangue colocado dentro dele permanece fresco indefinidamente, mantendo a vitalidade retirada do usuário até o momento em que seja consumido.",
      comentario:
        "É um banco de sangue portátil, com a pequena diferença de que o doador sempre sabe exatamente quanto aquilo custou.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "perola-de-sangue",
      nome: "Pérola de Sangue",
      elemento: "Sangue",
      grupo: "Sangue",
      imagem: "perola-de-sangue",
      acao: "Movimento",
      duracao: "Cena",
      consumivel: true,
      usos: 1,
      usosMaximos: 1,
      teste: "Fortitude, DT 20",
      propriedades: [
        "+5 em Agilidade",
        "+5 em Força",
        "+5 em Vigor",
        "Pode causar parada cardíaca",
      ],
      efeito:
        "O usuário gasta uma ação de movimento para pressionar a pérola contra a pele e absorvê-la. Até o fim da cena, recebe +5 em testes de Agilidade, Força, Vigor e em testes baseados nesses atributos. Ao final da cena, realiza Fortitude DT 20. Se falhar, fica fatigado até o fim do dia. Se falhar por 5 ou mais, sofre uma parada cardíaca e fica morrendo.",
      descricao:
        "Uma esfera lisa, brilhante e vermelho-vivo com aproximadamente dois centímetros de diâmetro. Quando absorvida, libera uma descarga extrema de adrenalina paranormal. Caso o usuário morra devido ao efeito da pérola, seu corpo pode se transformar em uma criatura de Sangue com VD semelhante ao seu NEX, escolhida pelo mestre.",
      comentario:
        "A força vem imediatamente. A cobrança espera até a adrenalina acabar.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "punhos-enraivecidos",
      nome: "Punhos Enraivecidos",
      elemento: "Sangue",
      grupo: "Sangue",
      imagem: "punhos-enraivecidos",
      empunhadura:
        "Vestidos nas mãos",
      danoAdicional: "1d8 de Sangue",
      propriedades: [
        "Ataques desarmados letais",
        "+1d8 de Sangue",
        "Ataques adicionais",
      ],
      efeito:
        "Os ataques desarmados do usuário causam +1d8 pontos de dano de Sangue e tornam-se letais. Sempre que acertar um ataque desarmado, o usuário pode fazer outro ataque contra o mesmo alvo. O primeiro ataque adicional custa 2 PE, o segundo custa mais 4 PE, o terceiro mais 6 PE e assim por diante. A sequência termina quando um ataque erra ou o usuário deixa de pagar o custo.",
      descricao:
        "Um par de soqueiras fabricadas com metal vermelho-vivo e cobertas por símbolos de Sangue. O item intensifica a violência de cada golpe e alimenta o usuário com o desejo de continuar atacando, mesmo depois que o alvo já deveria ter caído.",
      comentario:
        "Elas não querem que você vença a luta. Querem que você continue socando.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "seringa-de-transfiguracao",
      nome:
        "Seringa de Transfiguração",
      elemento: "Sangue",
      grupo: "Sangue",
      imagem:
        "seringa-de-transfiguracao",
      empunhadura: "Uma mão",
      acao: "Padrão",
      duracao: "1 dia",
      propriedades: [
        "Armazena sangue de um alvo",
        "Altera aparência",
        "Pode causar perda permanente de PV",
      ],
      efeito:
        "O usuário pode gastar uma ação padrão para retirar sangue de um alvo adjacente. Caso o alvo não seja voluntário, é necessário acertar um ataque corpo a corpo. Com sangue armazenado, o usuário pode gastar outra ação padrão para injetá-lo em uma pessoa adjacente. O alvo assume a aparência do dono do sangue como pelo ritual Distorcer Aparência, durante um dia.",
      descricao:
        "A seringa é feita de um material orgânico coberto por pequenas veias pulsantes. Quando a transformação termina, o alvo deve rolar 1d6. Em resultado 1, o retorno à aparência original danifica músculos e órgãos, fazendo o alvo perder permanentemente 1 PV.",
      comentario:
        "Ela não copia apenas o rosto. Por alguns instantes, parece lembrar como aquele corpo deveria existir.",
    }),
  ];

export const ITENS_AMALDICOADOS_ESPECIAIS_MORTE_ARQUIVOS =
  [
    criarItemAmaldicoadoEspecial({
      id: "amarras-mortais",
      nome: "Amarras Mortais",
      elemento: "Morte",
      grupo: "Morte",
      imagem: "amarras-mortais",
      empunhadura:
        "Vestidas nos antebraços",
      acao: "Padrão",
      custoPE: 2,
      alcance: "Curto",
      propriedades: [
        "Agarrar à distância",
        "+10 no teste oposto",
        "Puxa o alvo",
      ],
      efeito:
        "Uma vez por rodada, o usuário pode gastar uma ação padrão e 2 PE para realizar a manobra agarrar contra um alvo Grande ou menor em alcance curto, recebendo +10 no teste oposto. Enquanto o alvo estiver agarrado, o usuário pode gastar uma ação de movimento para puxá-lo até ficar adjacente.",
      descricao:
        "Um par de correntes feitas de ferro negro que se enrolam nos antebraços como braceletes. Quando ativadas, elas se estendem de maneira impossível, prendendo o alvo e arrastando seu tempo até o usuário.",
      comentario:
        "As correntes não se esticam. O espaço entre você e o alvo é que parece desistir.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "casaco-de-lodo",
      nome: "Casaco de Lodo",
      elemento: "Morte",
      grupo: "Morte",
      imagem: "casaco-de-lodo",
      empunhadura: "Vestido",
      resistencia:
        "Corte, impacto, Morte e perfuração 5",
      vulnerabilidade:
        "Balístico e Energia",
      propriedades: [
        "Resistência física 5",
        "Resistência a Morte 5",
        "Vulnerabilidade a balístico",
        "Vulnerabilidade a Energia",
      ],
      efeito:
        "O usuário recebe resistência 5 contra dano de corte, impacto, Morte e perfuração. Entretanto, torna-se vulnerável a dano balístico e de Energia.",
      descricao:
        "Um sobretudo preto fosco cuja superfície parece absorver completamente a luz. A vestimenta é formada por Lodo ativo, que se movimenta para amortecer golpes antes que eles alcancem o corpo do usuário.",
      comentario:
        "A roupa absorve impactos, luz e, pouco a pouco, a impressão de que ainda está completamente seca.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "coletora",
      nome: "Coletora",
      elemento: "Morte",
      grupo: "Morte",
      imagem: "coletora",
      empunhadura: "Uma mão",
      armaBase: "Punhal",
      acao: "Completa",
      armazenamentoMaximo: 20,
      propriedades: [
        "Mata alvos morrendo",
        "Armazena 1d8 PE",
        "Máximo de 20 PE",
        "Impede descanso adequado",
      ],
      efeito:
        "O usuário pode gastar uma ação completa para apunhalar uma pessoa que esteja morrendo. A vítima é morta e a Coletora absorve 1d8 PE de seu tempo de vida restante. A arma armazena até 20 PE, que podem ser gastos pelo portador como se fossem seus após ele carregar a adaga durante pelo menos uma semana.",
      descricao:
        "Um punhal com lâmina completamente negra e empunhadura em espiral. Enquanto portar a Coletora, o usuário sofre pesadelos com os momentos finais de suas vítimas e sempre possui condições ruins de descanso, independentemente do local onde dormir.",
      comentario:
        "Toda energia guardada nela já pertenceu a alguém que precisava de mais alguns segundos.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "cranio-espiral",
      nome: "Crânio Espiral",
      elemento: "Morte",
      grupo: "Morte",
      imagem: "cranio-espiral",
      empunhadura: "Uma mão",
      acao: "Livre",
      teste:
        "Vontade, DT 15 + 5 por uso adicional no mesmo dia",
      propriedades: [
        "Uma vez por rodada",
        "Concede ação padrão adicional",
        "Pode envelhecer o usuário",
      ],
      efeito:
        "Uma vez por rodada, enquanto estiver empunhando o crânio, o usuário pode gastar uma ação livre para receber uma ação padrão adicional. Depois de cada ativação, realiza Vontade com DT 15, aumentada em 5 por uso adicional no mesmo dia. Se falhar, ainda recebe a ação, mas envelhece 1d4 anos e não pode ativar o crânio novamente naquele dia.",
      descricao:
        "Um crânio envelhecido, apodrecido e retorcido em formato de espiral. Lodo escorre constantemente de suas órbitas vazias. Ao ser ativado, ele acelera o tempo particular do usuário durante alguns instantes.",
      comentario:
        "Você ganha alguns segundos. O crânio decide de qual parte da sua vida eles serão retirados.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "frasco-de-lodo",
      nome: "Frasco de Lodo",
      elemento: "Morte",
      grupo: "Morte",
      imagem: "frasco-de-lodo",
      acao: "Padrão",
      consumivel: true,
      usos: 1,
      usosMaximos: 1,
      propriedades: [
        "Cura ferimento recente",
        "Efeito instável em ferimento antigo",
        "Uso único",
      ],
      efeito:
        "Aplicar o Lodo em um ferimento exige uma ação padrão. Em um ferimento sofrido até uma rodada atrás, recupera 6d8+20 PV. Em uma ferida mais antiga, role qualquer dado. Em resultado par, recupera 3d8+10 PV. Em resultado ímpar, a ferida infecciona e o alvo sofre 3d8+10 pontos de dano de Morte.",
      descricao:
        "Um pequeno frasco contendo Lodo puro da Morte. A substância consegue reverter momentaneamente um ferimento recente, mas pode acelerar a degradação de tecidos que já começaram seu processo natural de recuperação. O conteúdo é suficiente para uma única aplicação.",
      comentario:
        "Ele não cura exatamente. Apenas convence a ferida de que ainda não chegou a hora de existir.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "vislumbre-do-fim",
      nome: "Vislumbre do Fim",
      elemento: "Morte",
      grupo: "Morte",
      imagem: "vislumbre-do-fim",
      empunhadura: "Vestido",
      acao: "Movimento",
      alcance: "Visual",
      propriedades: [
        "Revela previsão de morte",
        "Identifica pior resistência",
        "Identifica vulnerabilidades",
      ],
      efeito:
        "O usuário pode gastar uma ação de movimento para se concentrar em um ser que consiga enxergar. Em pessoas comuns, vê uma estimativa de quanto tempo falta para a morte daquele indivíduo. Em Marcados e criaturas, descobre qual é a pior resistência do alvo entre Fortitude, Reflexos e Vontade, além de todas as vulnerabilidades que ele possui.",
      descricao:
        "Um par de óculos escuros cuja armação metálica é coberta por símbolos e espirais. A previsão mostrada para pessoas comuns pode mudar quando as ações de um Marcado alteram o futuro.",
      comentario:
        "Os números mudam. O fato de existir um número nunca muda.",
    }),
  ];

export const ITENS_AMALDICOADOS_ESPECIAIS_CONHECIMENTO_ARQUIVOS =
  [
    criarItemAmaldicoadoEspecial({
      id: "aneis-do-elo-mental",
      nome: "Anéis do Elo Mental",
      elemento: "Conhecimento",
      grupo: "Conhecimento",
      imagem: "aneis-do-elo-mental",
      empunhadura:
        "Vestidos por duas pessoas",
      propriedades: [
        "Ligação telepática",
        "Compartilha melhor Vontade",
        "Compartilha dano mental",
        "Compartilha condições mentais",
      ],
      efeito:
        "Os anéis precisam ser usados por duas pessoas durante 24 horas para serem ativados. Enquanto ambas estiverem usando os anéis, permanecem conectadas por uma ligação telepática. As duas fazem testes de Vontade usando a melhor quantidade de dados e o melhor bônus existentes entre elas.",
      descricao:
        "Um par de anéis dourados, cada um marcado com parte dos símbolos de Ligação Telepática. Todo dano mental sofrido por uma das pessoas também é sofrido pela outra. Condições mentais ou de medo que afetem uma delas afetam automaticamente a outra.",
      comentario:
        "Duas mentes se tornam mais fortes juntas. Infelizmente, a dor também aprende o caminho entre elas.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "lanterna-reveladora",
      nome: "Lanterna Reveladora",
      elemento: "Conhecimento",
      grupo: "Conhecimento",
      imagem: "lanterna-reveladora",
      empunhadura: "Uma mão",
      acao: "Padrão",
      custoPE: 1,
      duracao: "Cena",
      propriedades: [
        "Luz de Terceiro Olho",
        "Revela o paranormal",
        "Atrai criaturas de Sangue",
      ],
      efeito:
        "O usuário pode gastar uma ação padrão e 1 PE para ligar a lanterna durante uma cena. Sua luz possui as propriedades do ritual Terceiro Olho, permitindo perceber manifestações paranormais reveladas pela iluminação.",
      descricao:
        "Uma lanterna dourada decorada com sigilos do Outro Lado. Sua luz incomoda criaturas de Sangue. Uma criatura de Sangue iluminada pela lanterna dará prioridade ao portador sobre outros alvos que estejam na mesma categoria de alcance.",
      comentario:
        "Ela revela o que estava escondido e, ao mesmo tempo, avisa àquilo que foi revelado exatamente onde você está.",
    }),

    criarItemAmaldicoadoEspecial({
      id:
        "mascara-das-pessoas-nas-sombras",
      nome:
        "Máscara das Pessoas nas Sombras",
      elemento: "Conhecimento",
      grupo: "Conhecimento",
      imagem:
        "mascara-pessoas-sombras",
      empunhadura: "Vestida",
      acao: "Movimento",
      custoPE: 2,
      alcance: "Médio",
      resistencia:
        "Conhecimento 10",
      propriedades: [
        "Resistência a Conhecimento 10",
        "Teleporte entre sombras",
        "Pode atrair a Seita das Máscaras",
      ],
      efeito:
        "O usuário recebe resistência 10 contra Conhecimento. Pode gastar uma ação de movimento e 2 PE para entrar em uma sombra adjacente e surgir instantaneamente em outra sombra que consiga enxergar em alcance médio.",
      descricao:
        "Uma das principais ferramentas e símbolos da Seita das Máscaras. Mesmo quando utilizada por alguém que não pertence à Seita, conserva parte do poder de sua consciência coletiva. Vestir a máscara pode chamar a atenção das Pessoas nas Sombras e gerar consequências determinadas pelo mestre.",
      comentario:
        "A máscara permite entrar nas sombras. O difícil é garantir que apenas você saia delas.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "municao-jurada",
      nome: "Munição Jurada",
      elemento: "Conhecimento",
      grupo: "Conhecimento",
      imagem: "municao-jurada",
      tipo: "Consumível",
      consumivel: true,
      usos: 1,
      usosMaximos: 1,
      acaoPreparacao: "1 hora",
      danoAdicional:
        "6d12 de Conhecimento",
      propriedades: [
        "+10 no ataque contra o alvo jurado",
        "Dobra a margem de ameaça",
        "+6d12 de Conhecimento",
        "Penalidade contra outros alvos",
      ],
      efeito:
        "Após um ritual de uma hora, a bala é vinculada a um ser conhecido pelo usuário. Quando disparada contra esse ser, fornece +10 no teste de ataque, dobra a margem de ameaça da arma e causa +6d12 pontos de dano de Conhecimento.",
      descricao:
        "Uma única bala de arma de fogo gravada com um sigilo. Enquanto possuir a munição, o usuário fica obcecado em eliminar o alvo jurado, sofrendo –2 em Defesa e em testes de ataque realizados contra qualquer outro alvo.",
      comentario:
        "A bala já sabe quem deve morrer. Carregá-la por tempo demais pode fazer você esquecer qualquer outro propósito.",
    }),

    criarItemAmaldicoadoEspecial({
      id:
        "pergaminho-da-pertinacia",
      nome:
        "Pergaminho da Pertinácia",
      elemento: "Conhecimento",
      grupo: "Conhecimento",
      imagem:
        "pergaminho-da-pertinacia",
      empunhadura: "Uma mão",
      acao: "Padrão",
      teste:
        "Ocultismo, DT 15 + 5 por uso adicional no mesmo dia",
      propriedades: [
        "Concede 5 PE temporários",
        "Dura até o fim da cena",
        "Pode ser destruído",
      ],
      efeito:
        "O usuário pode gastar uma ação padrão para encarar os sigilos do pergaminho e receber 5 PE temporários até o fim da cena. Depois de cada ativação, realiza Ocultismo com DT 15, aumentada em 5 por uso adicional no mesmo dia. Se falhar, o pergaminho se desfaz.",
      descricao:
        "Um pergaminho antigo e amarelado. Mesmo enrolado, deixa escapar a luz dourada dos sigilos registrados em seu interior. A leitura força a mente do usuário a continuar agindo além de seus limites normais.",
      comentario:
        "Os sigilos dizem que você ainda consegue continuar. O seu corpo pode ter uma opinião diferente.",
    }),
  ];

export const ITENS_AMALDICOADOS_ESPECIAIS_ENERGIA_ARQUIVOS =
  [
    criarItemAmaldicoadoEspecial({
      id: "arcabuz-dos-moretti",
      nome: "Arcabuz dos Moretti",
      elemento: "Energia",
      grupo: "Energia",
      imagem: "arcabuz-moretti",
      tipo: "Arma",
      proficiencia: "Simples",
      funcionamento: "Fogo",
      empunhadura: "Uma mão",
      alcance: "Curto",
      critico: "20/x3",
      tipoDano: "Energia",
      bonusAtaque: 2,
      municao: "Não utiliza",
      propriedades: [
        "+2 em testes de ataque",
        "Dano aleatório",
        "Crítico x3",
        "Não utiliza munição",
      ],
      efeito:
        "A arma fornece +2 em testes de ataque e causa dano de Energia. Em cada disparo, role 1d6 para determinar o dano básico: resultado 1 causa 2d4; 2 causa 2d6; 3 causa 2d8; 4 causa 2d10; 5 causa 2d12; e 6 causa 2d20. Possui alcance curto, crítico x3 e não precisa de munição.",
      descricao:
        "Uma arma muito antiga, semelhante aos arcabuzes do século XV. Apesar de estar coberta por rachaduras, continua funcionando perfeitamente. Uma luz rosada escapa pelas fissuras e a letra M está gravada em sua empunhadura de madeira.",
      comentario:
        "O disparo sempre funciona. O que ninguém consegue prever é quanto da realidade será levado junto com o projétil.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "bateria-reversa",
      nome: "Bateria Reversa",
      elemento: "Energia",
      grupo: "Energia",
      imagem: "bateria-reversa",
      empunhadura: "Uma mão",
      acao: "Padrão",
      custoPE: 2,
      alcance: "Curto",
      teste:
        "Ocultismo, DT 15 + 5 por uso adicional no mesmo dia",
      propriedades: [
        "Drena dispositivos",
        "Recarrega dispositivos",
        "Pode explodir",
      ],
      efeito:
        "O usuário pode gastar uma ação padrão e 2 PE para retirar toda a carga de um dispositivo eletrônico em alcance curto, deixando-o descarregado. Se a bateria estiver cheia, pode gastar uma ação padrão para transferir a carga para outro dispositivo descarregado em alcance curto.",
      descricao:
        "Uma pequena bateria coberta por sigilos paranormais. Após cada utilização, o usuário deve realizar Ocultismo com DT 15, aumentada em 5 por uso adicional no mesmo dia. Se falhar, a bateria explode e causa 12d6 pontos de dano de Energia em todos os seres a até 3 metros.",
      comentario:
        "Ela resolve qualquer problema de bateria. Às vezes criando um problema de explosão muito maior.",
    }),

    criarItemAmaldicoadoEspecial({
      id:
        "peitoral-da-segunda-chance",
      nome:
        "Peitoral da Segunda Chance",
      elemento: "Energia",
      grupo: "Energia",
      imagem:
        "peitoral-segunda-chance",
      empunhadura: "Vestido",
      ativacao: "Automática",
      custoPE: 5,
      cura: "4d10 PV",
      propriedades: [
        "Ativa ao chegar a 0 PV",
        "Recupera 4d10 PV",
        "Pode matar instantaneamente",
      ],
      efeito:
        "Quando o usuário é reduzido a 0 PV, o peitoral tenta gastar automaticamente 5 PE para reanimá-lo com 4d10 PV. A ativação falha se o usuário não possuir PE suficiente. Sempre que o item é ativado, role 1d10. Em resultado 1, a descarga mata o usuário instantaneamente.",
      descricao:
        "Um pequeno colete com uma peça central montada sobre o coração, composta por circuitos, fios entrelaçados e partes eletrônicas. Quando ocorre a falha fatal, o corpo e todos os equipamentos do usuário são transformados em plasma de Energia pura, restando apenas o peitoral.",
      comentario:
        "A segunda chance é garantida. A qualidade dessa segunda chance não é.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "relogio-de-arnaldo",
      nome: "Relógio de Arnaldo",
      elemento: "Energia",
      grupo: "Energia",
      imagem: "relogio-arnaldo",
      empunhadura: "Vestido",
      acao: "Livre",
      custoPE: 1,
      unico: true,
      propriedades: [
        "Item único",
        "Uma vez por rodada",
        "Rerrola resultado 1",
        "Custo crescente por dia",
      ],
      efeito:
        "Uma vez por rodada, o usuário pode gastar 1 PE para rolar novamente qualquer dado cujo resultado tenha sido 1. O custo aumenta em +1 PE para cada ativação adicional realizada no mesmo dia.",
      descricao:
        "Um relógio de ouro manchado e levemente queimado. Em seu interior existe a fotografia de um homem de barba e óculos ao lado de uma criança, que também segura um relógio dourado. É um item único, portanto apenas um agente pode escolhê-lo.",
      comentario:
        "Por um instante, o relógio faz o erro não ter acontecido. Mas ele nunca esquece quantas vezes precisou corrigir você.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "talisma-da-sorte",
      nome: "Talismã da Sorte",
      elemento: "Energia",
      grupo: "Energia",
      imagem: "talisma-da-sorte",
      empunhadura: "Vestido",
      acao: "Reação",
      custoPE: 3,
      propriedades: [
        "Pode evitar todo o dano",
        "Pode ser destruído",
        "Pode dobrar o dano sofrido",
      ],
      efeito:
        "Quando sofrer dano, o usuário pode gastar uma reação e 3 PE para rolar 1d4. Em resultado 2 ou 3, evita completamente o dano. Em resultado 4, evita o dano, mas o talismã se transforma em cinzas. Em resultado 1, sofre o dobro do dano original e o talismã também é destruído.",
      descricao:
        "Pode ser uma moeda, um pé de coelho ou qualquer pequeno objeto considerado um símbolo de sorte. O ritual aplicado ao objeto torna a sorte concreta, mas mantém sua natureza imprevisível.",
      comentario:
        "Na maioria das vezes ele traz sorte. Essa frase se torna bem menos tranquilizadora quando sua vida depende da minoria.",
    }),

    criarItemAmaldicoadoEspecial({
      id:
        "teclado-de-conexao-neural",
      nome:
        "Teclado de Conexão Neural",
      elemento: "Energia",
      grupo: "Energia",
      imagem:
        "teclado-conexao-neural",
      acao: "Movimento",
      propriedades: [
        "+10 para hackear",
        "Ignora barreiras de idioma",
        "Localiza arquivos mais rápido",
        "Causa dano mental",
      ],
      efeito:
        "Conectar o teclado a um computador exige uma ação de movimento. Enquanto estiver conectado, o usuário utiliza a máquina sem impedimentos tecnológicos ou de idioma, recebe +10 em testes para hackear e gasta metade do tempo normal para localizar arquivos.",
      descricao:
        "Um teclado USB coberto por glifos de Energia. Ele transmite os sinais do computador diretamente para as sinapses do usuário. A conexão sobrecarrega o cérebro, causando 1d6 pontos de dano mental por rodada em que o teclado for utilizado.",
      comentario:
        "Não existe senha impossível quando a máquina conversa diretamente com seu cérebro. Também não existe botão para abaixar o volume.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "tela-do-pesadelo",
      nome: "Tela do Pesadelo",
      elemento: "Energia",
      grupo: "Energia",
      imagem: "tela-do-pesadelo",
      acao: "Padrão",
      custoPE: 2,
      dano: "4d6 mental",
      resistencia:
        "Vontade, DT do usuário +5",
      propriedades: [
        "Armadilha em uma tela",
        "Causa 4d6 de dano mental",
        "Pode atordoar",
        "Pode levar à loucura",
      ],
      efeito:
        "O usuário gasta uma ação padrão e 2 PE para preparar a tela. A próxima pessoa que tocá-la deve fazer Vontade contra a DT do usuário aumentada em 5. Se falhar, fica atordoada, sofre 4d6 de dano mental e repete o teste na rodada seguinte. O efeito continua até passar no teste, enlouquecer ou a tela ser destruída.",
      descricao:
        "Um celular, tablet, televisor ou outro dispositivo cuja borda está coberta por sigilos minúsculos. Quando ativado, projeta uma imagem ilusória que parece sair da tela e atacar a vítima. Depois de gerar o efeito, o aparelho fica inerte até ser ativado novamente.",
      comentario:
        "A imagem não é real. O trauma, a dor e os gritos continuam sendo bastante reais.",
    }),

    criarItemAmaldicoadoEspecial({
      id: "veiculo-energizado",
      nome: "Veículo Energizado",
      elemento: "Energia",
      grupo: "Energia",
      imagem: "veiculo-energizado",
      acao: "Reação",
      teste: "Pilotagem, DT 25",
      veiculo: true,
      propriedades: [
        "Não precisa de combustível",
        "Pode atravessar objetos",
        "Protege os ocupantes de colisões",
      ],
      efeito:
        "O veículo não necessita de combustível. Quando estiver prestes a colidir, o motorista pode gastar uma reação e realizar Pilotagem DT 25. Se passar, o veículo e todos os ocupantes transformam-se em Energia pura por um instante e atravessam o obstáculo como se fossem incorpóreos.",
      descricao:
        "O motor e diversas partes do veículo foram modificados por Energia paranormal. Durante a transformação, passageiros, bagagens e estrutura tornam-se uma descarga luminosa que recupera sua forma normal após atravessar o objeto.",
      comentario:
        "O manual diz que ele atravessa paredes. Não diz o que acontece quando alguém abre a porta durante o processo.",
    }),
  ];

export const ITENS_AMALDICOADOS_ESPECIAIS_MEDO_ARQUIVOS =
  [
    criarItemAmaldicoadoEspecial({
      id: "jaqueta-de-verissimo",
      nome: "Jaqueta de Veríssimo",
      elemento: "Medo",
      grupo: "Medo",
      categoriaNumerica: 4,
      imagem: "jaqueta-verissimo",
      empunhadura: "Vestida",
      resistencia:
        "Dano paranormal 15",
      acao: "Reação",
      custoPE: 2,
      unico: true,
      precoEspecial:
        "Determinado pelo mestre",
      propriedades: [
        "Item único",
        "Categoria IV",
        "Resistência paranormal 15",
        "Protege aliados adjacentes",
      ],
      efeito:
        "O usuário recebe resistência 15 contra dano paranormal. Quando um aliado adjacente estiver prestes a sofrer qualquer tipo de dano, pode gastar uma reação e 2 PE para se tornar o alvo desse dano no lugar do aliado.",
      descricao:
        "Uma jaqueta de aviador feita de couro marrom, com a gola revestida por pele branca. Foi usada por diversos agentes importantes da Ordem e testemunhou incontáveis batalhas e sacrifícios. É um item único de categoria IV, portanto apenas um agente pode escolhê-la.",
      comentario:
        "A jaqueta não torna alguém imortal. Apenas ajuda seu portador a decidir quem terá mais uma chance de continuar vivo.",
    }),
  ];

const DEDO_DECEPADO_ARQUIVOS =
  criarItemAmaldicoadoEspecial({
    id: "dedo-decepado",
    nome: "Dedo Decepado",
    elemento: "Variável",
    grupo: "Variável",
    imagem: "dedo-decepado",
    empunhadura: "Vestido",
    propriedades: [
      "Concede um poder paranormal",
      "Elemento variável",
      "Pode impedir recuperação",
      "Penalidade social",
    ],
    efeito:
      "O usuário recebe um poder paranormal que pertencia ao antigo dono do dedo. O elemento desse poder determina o elemento da maldição. O item precisa ser usado durante uma semana antes de começar a funcionar.",
    descricao:
      "Sempre que o usuário realizar as ações dormir ou relaxar durante um interlúdio, deve rolar 1d4. Em resultado 1, é assombrado pelas memórias do antigo dono e não recupera PV, PE nem Sanidade. Ser visto usando o dedo impõe –10 em Diplomacia e pode provocar reações severas de NPCs.",
    comentario:
      "O poder ainda está preso ao dedo. Algumas das lembranças do antigo dono também.",
  });

function criarSeloParanormal({
  circulo,
  categoriaNumerica,
}) {
  return criarItemAmaldicoadoEspecial({
    id:
      `selo-paranormal-${circulo}-circulo`,
    nome:
      `Selo Paranormal — ${circulo}º Círculo`,
    nomeBase: "Selos Paranormais",
    elemento: "Variável",
    grupo: "Variável",
    categoriaNumerica,
    imagem: "selo-paranormal",
    empunhadura: "Uma mão",
    tipo: "Consumível",
    consumivel: true,
    usos: 1,
    usosMaximos: 1,
    circuloRitual: circulo,
    propriedades: [
      `Contém ritual de ${circulo}º círculo`,
      `Categoria ${CATEGORIAS_ROMANAS[categoriaNumerica]}`,
      "Uso único",
      "Não exige componentes",
    ],
    efeito:
      "Para ativar o selo, o usuário deve empunhá-lo e ler os sigilos em voz alta. Isso exige uma ação padrão ou o tempo de execução do ritual, o que for maior. Também deve conhecer o ritual armazenado ou passar em Ocultismo com DT igual a 20 mais o custo em PE do ritual.",
    descricao:
      "Quando o selo é ativado, o ritual é conjurado e o objeto se desfaz em cinzas. O usuário sofre os efeitos do Custo do Paranormal e de Invocando o Medo, quando aplicáveis, e toma todas as decisões do ritual. Caso conheça o ritual, pode aplicar suas habilidades e usar versões avançadas pagando apenas o custo adicional. O selo não exige componentes ritualísticos.",
    comentario:
      "O objeto guarda uma frase escrita na linguagem do Outro Lado. Depois de pronunciada, só restam cinzas e consequências.",
  });
}

export const SELOS_PARANORMAIS_ARQUIVOS =
  [
    criarSeloParanormal({
      circulo: 1,
      categoriaNumerica: 1,
    }),

    criarSeloParanormal({
      circulo: 2,
      categoriaNumerica: 2,
    }),

    criarSeloParanormal({
      circulo: 3,
      categoriaNumerica: 3,
    }),

    criarSeloParanormal({
      circulo: 4,
      categoriaNumerica: 4,
    }),
  ];

export const ITENS_AMALDICOADOS_ESPECIAIS_VARIAVEIS_ARQUIVOS =
  [
    DEDO_DECEPADO_ARQUIVOS,
    ...SELOS_PARANORMAIS_ARQUIVOS,
  ];

export const ITENS_AMALDICOADOS_ESPECIAIS_POR_ELEMENTO_ARQUIVOS =
  {
    sangue:
      ITENS_AMALDICOADOS_ESPECIAIS_SANGUE_ARQUIVOS,

    morte:
      ITENS_AMALDICOADOS_ESPECIAIS_MORTE_ARQUIVOS,

    conhecimento:
      ITENS_AMALDICOADOS_ESPECIAIS_CONHECIMENTO_ARQUIVOS,

    energia:
      ITENS_AMALDICOADOS_ESPECIAIS_ENERGIA_ARQUIVOS,

    medo:
      ITENS_AMALDICOADOS_ESPECIAIS_MEDO_ARQUIVOS,

    variavel:
      ITENS_AMALDICOADOS_ESPECIAIS_VARIAVEIS_ARQUIVOS,
  };

export const ITENS_AMALDICOADOS_ESPECIAIS_ARQUIVOS =
  [
    ...ITENS_AMALDICOADOS_ESPECIAIS_SANGUE_ARQUIVOS,
    ...ITENS_AMALDICOADOS_ESPECIAIS_MORTE_ARQUIVOS,
    ...ITENS_AMALDICOADOS_ESPECIAIS_CONHECIMENTO_ARQUIVOS,
    ...ITENS_AMALDICOADOS_ESPECIAIS_ENERGIA_ARQUIVOS,
    ...ITENS_AMALDICOADOS_ESPECIAIS_MEDO_ARQUIVOS,
    ...ITENS_AMALDICOADOS_ESPECIAIS_VARIAVEIS_ARQUIVOS,
  ];

export default
  ITENS_AMALDICOADOS_ESPECIAIS_ARQUIVOS;