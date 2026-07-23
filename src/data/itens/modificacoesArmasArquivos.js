const DADOS_PADRAO_MODIFICACAO = {
  aumentoCategoria: 1,
  repetivel: false,
};

function criarModificacaoArma(
  dados,
) {
  return {
    ...DADOS_PADRAO_MODIFICACAO,

    tipo:
      "Modificação de arma",

    ...dados,
  };
}

function criarModificacaoMunicao(
  dados,
) {
  return {
    ...DADOS_PADRAO_MODIFICACAO,

    tipo:
      "Modificação de munição",

    ...dados,
  };
}

export const MODIFICACOES_ARMAS_ARQUIVOS = [
  criarModificacaoArma({
    id: "certeira",
    nome: "Certeira",

    categoria:
      "Arma corpo a corpo ou de disparo",

    aplicacoes: [
      "corpo-a-corpo",
      "disparo",
    ],

    bonusAtaque: 2,

    propriedades: [
      "Categoria +I",
      "Ataque +2",
      "Armas corpo a corpo",
      "Armas de disparo",
      "Não pode ser repetida",
    ],

    efeito:
      "A arma fornece +2 nos testes de ataque realizados com ela. Pode ser aplicada em armas corpo a corpo e armas de disparo.",

    descricao:
      "A arma é fabricada, ajustada ou balanceada para responder com maior precisão aos movimentos do usuário. Em uma lâmina, isso pode representar melhor distribuição do peso, empunhadura remodelada e alinhamento cuidadoso do fio. Em um arco ou besta, pode incluir braços calibrados, corda de melhor qualidade e mecanismos que reduzem pequenas variações durante o disparo. A melhoria não aumenta diretamente o dano, mas torna mais fácil colocar cada golpe ou projétil exatamente onde deve atingir.",

    comentario:
      "Não torna o agente mais talentoso. Apenas diminui a quantidade de desculpas depois que ele erra.",
  }),

  criarModificacaoArma({
    id: "cruel",
    nome: "Cruel",

    categoria:
      "Arma corpo a corpo ou de disparo",

    aplicacoes: [
      "corpo-a-corpo",
      "disparo",
    ],

    bonusDano: 2,

    propriedades: [
      "Categoria +I",
      "Dano +2",
      "Armas corpo a corpo",
      "Armas de disparo",
      "Não pode ser repetida",
    ],

    efeito:
      "A arma fornece +2 nas rolagens de dano realizadas com ela. Pode ser aplicada em armas corpo a corpo e armas de disparo.",

    descricao:
      "A parte ofensiva da arma é preparada para produzir ferimentos mais graves. Lâminas recebem um fio excepcionalmente agressivo, armas de impacto utilizam materiais mais densos e projéteis podem ganhar pontas ou estruturas desenvolvidas para transferir mais força ao alvo. A modificação transforma pequenos acertos em lesões mais sérias e deixa marcas que dificilmente serão confundidas com um acidente comum.",

    comentario:
      "A diferença entre uma arma e uma arma cruel costuma ser percebida primeiro pelo médico-legista.",
  }),

  criarModificacaoArma({
    id: "discreta",
    nome: "Discreta",

    categoria:
      "Arma corpo a corpo, de disparo ou de fogo",

    aplicacoes: [
      "corpo-a-corpo",
      "disparo",
      "fogo",
    ],

    bonusOcultar: 5,
    reducaoVolume: 1,

    permiteOcultarSemTreino:
      true,

    propriedades: [
      "Categoria +I",
      "Crime +5 para ocultar",
      "Permite ocultar sem treinamento",
      "Espaços –1",
      "Mínimo de 0 espaços",
      "Não pode ser repetida",
    ],

    efeito:
      "A arma fornece +5 em testes de Crime para ser ocultada e permite realizar esse teste mesmo sem treinamento na perícia. Também reduz em 1 o número de espaços ocupados, até o mínimo de 0.",

    descricao:
      "A arma recebe alterações para chamar menos atenção e ocupar menos espaço durante o transporte. Uma arma de fogo pode ser desmontável, possuir peças dobráveis ou ter formato disfarçado; um bastão pode se tornar retrátil; uma lâmina pode ganhar bainha interna, cabo removível ou construção compacta. O objetivo não é tornar a arma invisível, mas permitir que ela atravesse uma inspeção apressada ou permaneça escondida até o momento em que a missão deixa de ser discreta.",

    comentario:
      "Cabe sob o casaco, dentro da bolsa e, segundo o relatório, definitivamente não estava ali durante a revista.",
  }),

  criarModificacaoArma({
    id: "perigosa",
    nome: "Perigosa",

    categoria:
      "Arma corpo a corpo ou de disparo",

    aplicacoes: [
      "corpo-a-corpo",
      "disparo",
    ],

    bonusMargemAmeaca: 2,

    propriedades: [
      "Categoria +I",
      "Margem de ameaça +2",
      "Armas corpo a corpo",
      "Armas de disparo",
      "Não pode ser repetida",
    ],

    efeito:
      "Aumenta em +2 a margem de ameaça da arma. Pode ser aplicada em armas corpo a corpo e armas de disparo.",

    descricao:
      "A arma é preparada para transformar bons golpes em impactos devastadores. Uma lâmina pode ser afiada como uma navalha, uma ponta pode receber geometria capaz de penetrar mais profundamente e uma arma de impacto pode ser construída com materiais especialmente maciços. A modificação não garante que o ataque acerte, mas aumenta a chance de um acerto bem colocado atingir uma área vital ou produzir um efeito muito pior do que o esperado.",

    comentario:
      "O fabricante chama de melhoria de desempenho. O alvo provavelmente usaria outro nome.",
  }),

  criarModificacaoArma({
    id: "tatica",
    nome: "Tática",

    categoria:
      "Arma corpo a corpo, de disparo ou de fogo",

    aplicacoes: [
      "corpo-a-corpo",
      "disparo",
      "fogo",
    ],

    saqueComoAcaoLivre:
      true,

    propriedades: [
      "Categoria +I",
      "Saque como ação livre",
      "Empunhadura aprimorada",
      "Não pode ser repetida",
    ],

    efeito:
      "A arma pode ser sacada como uma ação livre.",

    descricao:
      "A arma recebe cabo texturizado, bandoleira, presilhas, bainha de saque rápido ou outros acessórios que facilitam seu manuseio. Cada detalhe é organizado para reduzir movimentos desnecessários e permitir que o agente coloque a arma em uso quase imediatamente. A melhoria é especialmente valiosa quando a conversa termina de forma abrupta e ninguém teve a educação de anunciar o início do combate.",

    comentario:
      "Porque o monstro raramente espera você terminar de procurar a arma no fundo da mochila.",
  }),

  criarModificacaoArma({
    id: "alongada",
    nome: "Alongada",

    categoria: "Arma de fogo",

    aplicacoes: [
      "fogo",
    ],

    bonusAtaque: 2,

    propriedades: [
      "Categoria +I",
      "Ataque +2",
      "Somente armas de fogo",
      "Cano alongado",
      "Não pode ser repetida",
    ],

    efeito:
      "A arma fornece +2 nos testes de ataque realizados com ela. Só pode ser aplicada em armas de fogo.",

    descricao:
      "A arma recebe um cano mais longo e ajustes que estabilizam melhor a trajetória do projétil. A extensão aumenta a precisão dos disparos, mas também torna o equipamento mais chamativo e menos confortável em corredores, veículos ou espaços muito apertados. É uma modificação feita para quem prefere resolver o problema antes que ele chegue perto o bastante para apresentar-se.",

    comentario:
      "Mais precisão, mais comprimento e menos chance de passar pela porta sem bater o cano no batente.",
  }),

  criarModificacaoArma({
    id: "calibre-grosso",
    nome: "Calibre Grosso",

    categoria: "Arma de fogo",

    aplicacoes: [
      "fogo",
    ],

    aumentoDadosDano: 1,

    exigeMunicaoCalibreGrosso:
      true,

    propriedades: [
      "Categoria +I",
      "Dano +1 dado do mesmo tipo",
      "Somente armas de fogo",
      "Exige munição de calibre grosso",
      "Não pode ser repetida",
    ],

    efeito:
      "Aumenta o dano da arma em mais um dado do mesmo tipo. Uma arma com esta modificação precisa utilizar munição específica de calibre grosso. Essa munição possui a mesma categoria da munição normal correspondente, mas não pode ser usada em armas sem esta modificação.",

    descricao:
      "O mecanismo, o cano e a câmara da arma são alterados para suportar munição de maior calibre. O resultado é um disparo com impacto muito superior, acompanhado por mais recuo, ruído e desgaste das peças. Um revólver que normalmente causa 2d6 passa a causar 3d6, enquanto um fuzil de precisão que causa 2d10 passa a causar 3d10. A mudança exige munição própria e deixa claro, desde o primeiro tiro, que discrição já não faz parte do plano.",

    comentario:
      "Quando alguém pergunta se era realmente necessário usar uma bala maior, a resposta costuma estar no tamanho do buraco.",
  }),

  criarModificacaoArma({
    id: "compensador",
    nome: "Compensador",

    categoria:
      "Arma de fogo automática",

    aplicacoes: [
      "fogo",
    ],

    exigeArmaAutomatica: true,

    anulaPenalidadeRajada:
      true,

    propriedades: [
      "Categoria +I",
      "Somente armas automáticas",
      "Anula a penalidade por rajada",
      "Controle de recuo",
      "Não pode ser repetida",
    ],

    efeito:
      "Anula a penalidade nos testes de ataque causada por disparar uma rajada. Só pode ser aplicada em armas automáticas.",

    descricao:
      "Um sistema de amortecimento, contrapesos e direcionamento de gases reduz o coice produzido por disparos sucessivos. A arma continua liberando uma quantidade assustadora de munição, mas o cano permanece mais estável e permite que o usuário mantenha a rajada próxima do alvo pretendido. O compensador não torna o disparo silencioso nem econômico; ele apenas faz o caos apontar para uma direção um pouco mais útil.",

    comentario:
      "A rajada continua exagerada. Agora ela só está exagerada com controle profissional.",
  }),

  criarModificacaoArma({
    id: "ferrolho-automatico",
    nome: "Ferrolho Automático",

    categoria: "Arma de fogo",

    aplicacoes: [
      "fogo",
    ],

    tornaAutomatica: true,

    propriedades: [
      "Categoria +I",
      "Somente armas de fogo",
      "A arma se torna automática",
      "Permite disparar rajadas",
      "Não pode ser repetida",
    ],

    efeito:
      "O mecanismo da arma é alterado para disparar várias vezes em sequência. A arma se torna automática e passa a poder utilizar a regra de rajadas.",

    descricao:
      "O conjunto de ação e alimentação é modificado para permitir disparos sucessivos enquanto o gatilho permanece pressionado. A alteração aumenta drasticamente a cadência de tiro e transforma uma arma comum em um equipamento capaz de lançar rajadas. Também aumenta o consumo de munição, o recuo e a possibilidade de o agente perceber tarde demais que apertou o gatilho por tempo demais.",

    comentario:
      "O armeiro removeu a pausa entre os disparos. O bom senso continua sendo vendido separadamente.",
  }),

  criarModificacaoArma({
    id: "mira-laser",
    nome: "Mira Laser",

    categoria: "Arma de fogo",

    aplicacoes: [
      "fogo",
    ],

    bonusMargemAmeaca: 2,

    propriedades: [
      "Categoria +I",
      "Margem de ameaça +2",
      "Somente armas de fogo",
      "Retículo luminoso",
      "Não pode ser repetida",
    ],

    efeito:
      "Aumenta em +2 a margem de ameaça da arma. Só pode ser aplicada em armas de fogo.",

    descricao:
      "Um emissor interno projeta um ponto luminoso alinhado ao cano, oferecendo ao atirador uma referência rápida para posicionar disparos em áreas vulneráveis. O laser facilita ajustes durante movimentos curtos e confrontos tensos, embora o ponto visível possa denunciar que alguém está sendo cuidadosamente escolhido como próximo alvo.",

    comentario:
      "O pequeno ponto vermelho é uma forma muito eficiente de informar ao alvo que a negociação terminou.",
  }),

  criarModificacaoArma({
    id: "mira-telescopica",
    nome: "Mira Telescópica",

    categoria: "Arma de fogo",

    aplicacoes: [
      "fogo",
    ],

    aumentoAlcanceCategorias:
      1,

    permiteAtaqueFurtivoQualquerAlcance:
      true,

    propriedades: [
      "Categoria +I",
      "Aumenta o alcance em uma categoria",
      "Ataque Furtivo em qualquer alcance",
      "Somente armas de fogo",
      "Não pode ser repetida",
    ],

    efeito:
      "Aumenta o alcance da arma em uma categoria: de curto para médio, de médio para longo ou de longo para extremo. Também permite utilizar a habilidade Ataque Furtivo em qualquer alcance.",

    descricao:
      "Uma luneta com lentes de ampliação, marcações de distância e ajustes de precisão é instalada sobre a arma. O equipamento permite identificar detalhes e realizar disparos muito além da distância confortável de uma mira comum. A ampliação aproxima visualmente o alvo, mas também revela com clareza desconfortável aquilo que está observando de volta.",

    comentario:
      "Tudo parece menos assustador de longe, até a mira mostrar que a criatura está olhando diretamente para você.",
  }),

  criarModificacaoArma({
    id: "silenciador",
    nome: "Silenciador",

    categoria: "Arma de fogo",

    aplicacoes: [
      "fogo",
    ],

    reducaoPenalidadeFurtividadeDados:
      2,

    propriedades: [
      "Categoria +I",
      "Somente armas de fogo",
      "Reduz em 2 dados a penalidade de Furtividade após atacar",
      "Não elimina completamente o som",
      "Não pode ser repetida",
    ],

    efeito:
      "Reduz em 2 dados a penalidade em Furtividade para se esconder no mesmo turno em que o personagem atacou com a arma de fogo.",

    descricao:
      "Um dispositivo preso ao cano reduz parte do ruído e do clarão produzidos pelo disparo. Apesar do nome popular, a arma não se torna completamente silenciosa; o estampido apenas fica menos intenso e mais difícil de localizar imediatamente. A modificação ajuda o atirador a abandonar sua posição antes que todos no local descubram exatamente de onde veio o tiro.",

    comentario:
      "Não faz 'puf'. Faz um estrondo mais educado e com melhores chances de negar envolvimento.",
  }),

  criarModificacaoArma({
    id: "visao-de-calor",
    nome: "Visão de Calor",

    categoria: "Arma de fogo",

    aplicacoes: [
      "fogo",
    ],

    ignoraCamuflagem: true,

    propriedades: [
      "Categoria +I",
      "Somente armas de fogo",
      "Ignora camuflagem do alvo",
      "Imagem térmica",
      "Não pode ser repetida",
    ],

    efeito:
      "Ao disparar com a arma, o usuário ignora qualquer camuflagem do alvo.",

    descricao:
      "A mira eletrônica combina imagens visíveis e infravermelhas, destacando diferenças de temperatura e criando contraste entre corpos, superfícies e o ambiente. A tecnologia permite acompanhar alvos através de escuridão, fumaça leve e outras formas de camuflagem. Contudo, algumas manifestações paranormais aparecem frias demais, quentes demais ou simplesmente sem qualquer temperatura que faça sentido.",

    comentario:
      "A boa notícia é que a mira encontrou a criatura. A ruim é que ela aparece como um vazio onde o calor deveria existir.",
  }),
];

export const MODIFICACOES_MUNICOES_ARQUIVOS = [
  criarModificacaoMunicao({
    id: "dum-dum",
    nome: "Dum Dum",

    categoria:
      "Modificação para balas",

    municoesPermitidas: [
      "balas-curtas",
      "balas-longas",
    ],

    aumentoMultiplicadorCritico:
      1,

    propriedades: [
      "Categoria +I",
      "Somente balas curtas ou longas",
      "Multiplicador de crítico +1",
      "Munição expansiva",
      "Não pode ser repetida",
    ],

    efeito:
      "Aumenta em +1 o multiplicador de crítico dos ataques realizados com a munição. Só pode ser aplicada em balas curtas ou balas longas.",

    descricao:
      "Os projéteis são preparados para expandir durante o impacto, deformando-se dentro do alvo e produzindo ferimentos muito mais extensos. A munição não aumenta necessariamente a chance de um acerto crítico, mas torna esses acertos consideravelmente mais destrutivos. Cada pacote modificado continua seguindo a duração normal da munição correspondente.",

    comentario:
      "A bala entra pequena e toma decisões terríveis depois que chega.",
  }),

  criarModificacaoMunicao({
    id: "explosiva",
    nome: "Explosiva",

    categoria:
      "Modificação para balas",

    municoesPermitidas: [
      "balas-curtas",
      "balas-longas",
    ],

    danoAdicional: "2d6",

    propriedades: [
      "Categoria +I",
      "Somente balas curtas ou longas",
      "Dano adicional +2d6",
      "Projétil explosivo",
      "Não pode ser repetida",
    ],

    efeito:
      "Aumenta em +2d6 o dano causado pelos ataques realizados com a munição. Só pode ser aplicada em balas curtas ou balas longas.",

    descricao:
      "Cada projétil recebe uma pequena quantidade de material reativo, como mercúrio ou glicerina, preparada para detonar quando a bala atinge o alvo. O impacto inicial é seguido por uma explosão localizada que amplia severamente o ferimento. A modificação é poderosa, instável e pouco apropriada para qualquer situação em que a palavra 'discrição' ainda tenha algum significado.",

    comentario:
      "Porque aparentemente acertar o alvo não era dramático o bastante.",
  }),
];

export const MODIFICACOES_ARMAS_CORPO_A_CORPO_E_DISPARO_ARQUIVOS =
  MODIFICACOES_ARMAS_ARQUIVOS.filter(
    (modificacao) =>
      modificacao.aplicacoes.includes(
        "corpo-a-corpo",
      ) ||
      modificacao.aplicacoes.includes(
        "disparo",
      ),
  );

export const MODIFICACOES_ARMAS_DE_FOGO_ARQUIVOS =
  MODIFICACOES_ARMAS_ARQUIVOS.filter(
    (modificacao) =>
      modificacao.aplicacoes.includes(
        "fogo",
      ),
  );

export const TODAS_MODIFICACOES_ARMAS_E_MUNICOES_ARQUIVOS = [
  ...MODIFICACOES_ARMAS_ARQUIVOS,
  ...MODIFICACOES_MUNICOES_ARQUIVOS,
];

export default MODIFICACOES_ARMAS_ARQUIVOS;