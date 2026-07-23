export const ELEMENTOS_ITENS_PARANORMAIS = [
  "Sangue",
  "Morte",
  "Conhecimento",
  "Energia",
];

const DADOS_PADRAO_ITEM_PARANORMAL = {
  tipo: "Item paranormal",
  quantidade: 1,
  volume: 1,
  ativo: true,
};

function criarItemParanormal(
  dados,
) {
  return {
    ...DADOS_PADRAO_ITEM_PARANORMAL,
    ...dados,
  };
}

export const ITENS_PARANORMAIS_ARQUIVOS = [
  criarItemParanormal({
    id: "amarras-de-elemento",
    nome: "Amarras de Elemento",

    categoria:
      "Item paranormal — Amarras",

    categoriaNumerica: 2,

    grupo:
      "Contenção paranormal",

    elemento:
      "Escolhido ao adicionar",

    elementosPermitidos: [
      ...ELEMENTOS_ITENS_PARANORMAIS,
    ],

    exigeEscolhaElemento: true,

    imagem:
      "amarras-paranormais",

    propriedades: [
      "Categoria II",
      "Ocupa 1 espaço",
      "Escolha um elemento",
      "Armadilha ou laço",
      "Especial contra criaturas vulneráveis ao elemento",
    ],

    modosUso: [
      {
        id: "armadilha",
        nome: "Armadilha",

        acao:
          "Ação completa",

        custoPe: 2,

        area: "3m x 3m",

        resistencia:
          "Reflexos",

        atributoDt:
          "Intelecto",

        consomeItem: true,

        efeito:
          "O usuário gasta as amarras, uma ação completa e 2 PE para preparar uma armadilha de 3m por 3m. Uma criatura que atravesse esse espaço pela primeira vez em seu turno deve fazer um teste de Reflexos contra a DT baseada no Intelecto do usuário. Se falhar, fica imóvel até o final da cena. Mesmo que passe, considera o espaço ocupado pela armadilha como terreno difícil.",
      },

      {
        id: "lacar",
        nome: "Laçar",

        acao:
          "Ação padrão",

        custoPe: 1,

        alcance: "Curto",

        resistencia:
          "Vontade",

        atributoDt:
          "Agilidade",

        custoManutencaoPe: 1,

        efeito:
          "O usuário gasta uma ação padrão e 1 PE para escolher uma criatura em alcance curto. Se o alvo falhar em um teste de Vontade contra a DT baseada na Agilidade do usuário, fica paralisado até o início de seu próximo turno, quando pode repetir o teste. Manter a criatura enlaçada exige o gasto de 1 PE por rodada.",
      },
    ],

    efeito:
      "Cordas ou correntes formadas a partir de um elemento paranormal específico. São especialmente preparadas para conter criaturas do Outro Lado vulneráveis ao elemento escolhido. Podem ser usadas para preparar uma armadilha ou para laçar diretamente uma criatura.",

    descricao:
      "As amarras parecem cordas, cabos ou correntes comuns à primeira vista, mas cada elo ou fibra apresenta características do elemento utilizado em sua criação. Amarras de Sangue podem parecer úmidas e pulsantes; as de Morte acumulam poeira e envelhecem aquilo que tocam; as de Conhecimento exibem sigilos que mudam quando não estão sendo observados; e as de Energia estalam com descargas irregulares. O equipamento foi desenvolvido para restringir manifestações que normalmente não seriam contidas por materiais mundanos.",

    comentario:
      "Se a criatura começou a rir depois de ser amarrada, talvez você tenha escolhido o elemento errado.",
  }),

  criarItemParanormal({
    id: "camera-de-aura-paranormal",
    nome:
      "Câmera de Aura Paranormal",

    categoria:
      "Item paranormal — Investigação",

    categoriaNumerica: 2,

    grupo:
      "Detecção paranormal",

    elementosRelacionados: [
      "Energia",
      "Conhecimento",
    ],

    acaoUso:
      "Ação padrão",

    custoPe: 1,

    empunhadura:
      "Precisa ser empunhada",

    imagem:
      "camera-aura-paranormal",

    propriedades: [
      "Categoria II",
      "Ocupa 1 espaço",
      "Ação padrão",
      "Custo de 1 PE",
      "Revela auras paranormais",
      "Fotografia instantânea",
    ],

    efeito:
      "Tirar uma fotografia com esta câmera exige uma ação padrão e o gasto de 1 PE. A imagem é revelada instantaneamente e mostra a presença de auras paranormais em pessoas e objetos. Cada aura aparece na cor associada ao respectivo elemento paranormal.",

    descricao:
      "Uma câmera amaldiçoada com Energia e coberta por sigilos de Conhecimento. Sua estrutura mistura peças fotográficas antigas, circuitos modernos e inscrições que parecem mudar de posição dentro da lente. As fotografias reveladas pelo aparelho registram marcas, contaminações e influências paranormais invisíveis aos olhos humanos. Uma pessoa aparentemente normal pode surgir cercada por uma aura intensa, enquanto um objeto comum pode aparecer tomado por cores que não existiam no ambiente.",

    comentario:
      "A fotografia ficou ótima. O problema é a segunda pessoa na imagem, porque ninguém se lembra de ela estar na sala.",
  }),

  criarItemParanormal({
    id: "componentes-ritualisticos-de-elemento",
    nome:
      "Componentes Ritualísticos de Elemento",

    categoria:
      "Item paranormal — Componentes",

    categoriaNumerica: 0,

    grupo:
      "Conjuração de rituais",

    elemento:
      "Escolhido ao adicionar",

    elementosPermitidos: [
      ...ELEMENTOS_ITENS_PARANORMAIS,
    ],

    exigeEscolhaElemento: true,

    imagem:
      "componentes-ritualisticos",

    propriedades: [
      "Categoria 0",
      "Ocupa 1 espaço",
      "Escolha um elemento",
      "Necessário para conjurar rituais",
      "Não existem componentes de Medo",
    ],

    exemplosPorElemento: {
      Energia: [
        "Eletricidade",
        "Dispositivos tecnológicos",
        "Circuitos eletrônicos",
        "Fontes de calor e luz",
        "Pilhas e baterias",
        "Cabos de cobre ou prata",
        "Pólvora",
        "Moedas",
        "Dados",
        "Ímãs",
      ],

      Sangue: [
        "Órgãos",
        "Carne",
        "Sangue",
        "Animais vivos para sacrifício",
        "Navalhas",
        "Agulhas",
        "Arame farpado",
        "Correntes",
        "Metal enferrujado",
        "Fluidos corporais",
      ],

      Morte: [
        "Ossos",
        "Dentes",
        "Cinzas",
        "Fios de cabelo",
        "Cristais pretos",
        "Relógios",
        "Galhos e folhas secas",
        "Plantas mortas",
        "Raízes",
        "Areia",
        "Poeira",
        "Lodo",
      ],

      Conhecimento: [
        "Escrituras",
        "Papéis",
        "Livros",
        "Pergaminhos",
        "Instrumentos de escrita",
        "Pedras preciosas",
        "Ouro",
        "Cordas",
        "Tecidos",
        "Cristais brancos",
        "Vidro",
        "Máscaras",
      ],
    },

    efeito:
      "Ao adicionar este item, escolha Sangue, Morte, Conhecimento ou Energia. Os componentes são necessários para a conjuração de rituais do elemento escolhido. Não existem componentes ritualísticos de Medo.",

    descricao:
      "Uma coleção de materiais com significado simbólico e afinidade com determinado elemento paranormal. O conjunto pode assumir formas muito diferentes conforme o elemento escolhido: objetos tecnológicos e condutores para Energia, matéria orgânica e instrumentos de dor para Sangue, restos envelhecidos e materiais ligados ao tempo para Morte ou textos, símbolos e objetos de valor para Conhecimento. O ocultista organiza esses elementos para criar uma conexão entre a realidade e o Outro Lado durante a execução de um ritual.",

    comentario:
      "Organizar componentes ritualísticos é como arrumar uma caixa de ferramentas, exceto pela parte em que algumas ferramentas ainda estão respirando.",
  }),

  criarItemParanormal({
    id: "emissor-de-pulsos-paranormais",
    nome:
      "Emissor de Pulsos Paranormais",

    categoria:
      "Item paranormal — Emissor",

    categoriaNumerica: 2,

    grupo:
      "Atração e repulsão paranormal",

    acaoUso:
      "Ação completa",

    custoPe: 1,

    elemento:
      "Escolhido ao ativar",

    elementosPermitidos: [
      ...ELEMENTOS_ITENS_PARANORMAIS,
    ],

    imagem:
      "emissor-pulsos-paranormais",

    propriedades: [
      "Categoria II",
      "Ocupa 1 espaço",
      "Ação completa",
      "Custo de 1 PE",
      "Escolha um elemento ao ativar",
      "Atrai criaturas do mesmo elemento",
      "Afasta criaturas do elemento oposto",
    ],

    resistencia:
      "Vontade",

    atributoDt:
      "Presença",

    efeito:
      "Ativar o emissor exige uma ação completa e o gasto de 1 PE. O usuário escolhe um elemento paranormal, e a caixa emite um pulso correspondente. Criaturas do mesmo elemento são atraídas pelo sinal, enquanto criaturas do elemento oposto são afastadas. As criaturas afetadas podem fazer um teste de Vontade contra a DT baseada na Presença do usuário para evitar o efeito.",

    descricao:
      "Uma pequena caixa coberta por sigilos, fios, placas metálicas e componentes que não deveriam funcionar juntos. Foi criada para servir como uma espécie de isca paranormal, reproduzindo sinais associados aos elementos do Outro Lado. Quando ativada, vibra em uma frequência que não é exatamente sonora e provoca reações instintivas em criaturas paranormais. Seu uso pode afastar uma ameaça ou chamar algo que estava muito melhor permanecendo longe.",

    comentario:
      "A função atrair criaturas foi testada com sucesso. A função desligar antes de elas chegarem continua em análise.",
  }),

  criarItemParanormal({
    id: "escuta-de-ruidos-paranormais",
    nome:
      "Escuta de Ruídos Paranormais",

    categoria:
      "Item paranormal — Escuta",

    categoriaNumerica: 2,

    grupo:
      "Investigação paranormal",

    acaoUso:
      "Ação completa",

    custoPe: 2,

    duracaoGravacao:
      "Até 24 horas",

    pericia: "Ocultismo",
    bonusPericia: 5,

    imagem:
      "escuta-ruidos-paranormais",

    propriedades: [
      "Categoria II",
      "Ocupa 1 espaço",
      "Ação completa",
      "Custo de 2 PE",
      "Grava por até 24 horas",
      "Ocultismo +5 para identificar criatura",
    ],

    efeito:
      "Ativar a escuta exige uma ação completa e o gasto de 2 PE. Depois de ativada, ela pode gravar ruídos durante até 24 horas. Ouvir o conteúdo registrado fornece +5 em testes de Ocultismo realizados para identificar uma criatura paranormal.",

    descricao:
      "Um microfone modificado para captar frequências, vibrações e manifestações sonoras produzidas pelo Outro Lado. O aparelho pode registrar vozes, arranhões, respirações e outros ruídos que não eram audíveis durante a gravação. Os registros ajudam especialistas a reconhecer padrões associados a criaturas paranormais, embora ouvir repetidamente certos áudios possa ser uma experiência profundamente desagradável.",

    comentario:
      "O aparelho gravou uma voz dizendo seu nome. O relatório técnico recomenda não responder.",
  }),

  criarItemParanormal({
    id: "medidor-de-estabilidade-da-membrana",
    nome:
      "Medidor de Estabilidade da Membrana",

    categoria:
      "Item paranormal — Medidor",

    categoriaNumerica: 2,

    grupo:
      "Análise da Membrana",

    periciaNecessaria:
      "Ocultismo treinado",

    imagem:
      "medidor-estabilidade-membrana",

    propriedades: [
      "Categoria II",
      "Ocupa 1 espaço",
      "Exige treinamento em Ocultismo",
      "Avalia o estado da Membrana",
      "As leituras não são conclusivas",
    ],

    efeito:
      "Um personagem treinado em Ocultismo pode usar o medidor para avaliar o estado da Membrana em uma área. Leituras racionais e constantes ao longo de algumas horas indicam menor possibilidade de uma manifestação perigosa. Valores inexplicáveis ou que variam intensamente podem indicar uma entidade ou atividade paranormal. O resultado é apenas um indicativo e não fornece uma resposta definitiva.",

    descricao:
      "Um dispositivo complexo composto por medidores de temperatura, campo magnético, dilatação temporal e outras grandezas que a ciência comum não reconhece completamente. Ele compara diversas leituras para estimar a estabilidade da Membrana em um local. Um ambiente danificado pode ainda não ter produzido uma manifestação, enquanto uma área aparentemente protegida pode esconder uma criatura poderosa trazida de outro lugar. Por isso, nenhuma leitura deve ser interpretada como garantia de segurança.",

    comentario:
      "Quando todos os ponteiros começam a girar ao mesmo tempo, o aparelho não está quebrado. Essa é a parte ruim.",
  }),

  criarItemParanormal({
    id: "scanner-de-manifestacao-paranormal-de-elemento",
    nome:
      "Scanner de Manifestação Paranormal de Elemento",

    categoria:
      "Item paranormal — Scanner",

    categoriaNumerica: 2,

    grupo:
      "Rastreamento paranormal",

    elemento:
      "Escolhido ao adicionar",

    elementosPermitidos: [
      ...ELEMENTOS_ITENS_PARANORMAIS,
    ],

    exigeEscolhaElemento: true,

    acaoAtivacao:
      "Ação padrão",

    custoPePorRodada: 1,

    alcance: "Longo",

    imagem:
      "scanner-manifestacao-paranormal",

    propriedades: [
      "Categoria II",
      "Ocupa 1 espaço",
      "Escolha um elemento",
      "Ação padrão para ativar",
      "Consome 1 PE por rodada",
      "Detecta manifestações em alcance longo",
      "Indica a direção das manifestações",
    ],

    efeito:
      "Ativar o scanner exige uma ação padrão. Enquanto permanecer ligado, consome 1 PE por rodada do usuário. O portador sempre sabe a direção de todas as manifestações paranormais ativas do elemento escolhido em alcance longo, incluindo rituais, criaturas e itens amaldiçoados. Uma criatura cujo elemento principal seja diferente também é detectada caso possua o elemento escolhido como complemento.",

    descricao:
      "Um dispositivo conectado a pequenos objetos amaldiçoados ligados a uma entidade específica e coberto por uma série de sigilos. Cada scanner é calibrado para Sangue, Morte, Conhecimento ou Energia. Quando ativado, reage às manifestações daquele elemento e aponta continuamente sua direção, embora não informe exatamente a distância, a quantidade ou a natureza do que foi encontrado. O aparelho pode conduzir o agente até um ritual ativo, uma criatura escondida ou um objeto que preferia não ser localizado.",

    comentario:
      "O scanner aponta para a parede desde que a equipe chegou. Ninguém teve coragem de verificar o outro lado.",
  }),
];

export const AMARRAS_PARANORMAIS_ARQUIVOS =
  ITENS_PARANORMAIS_ARQUIVOS.filter(
    (item) =>
      item.id ===
      "amarras-de-elemento",
  );

export const COMPONENTES_RITUALISTICOS_ARQUIVOS =
  ITENS_PARANORMAIS_ARQUIVOS.filter(
    (item) =>
      item.id ===
      "componentes-ritualisticos-de-elemento",
  );

export const SCANNERS_PARANORMAIS_ARQUIVOS =
  ITENS_PARANORMAIS_ARQUIVOS.filter(
    (item) =>
      item.id ===
      "scanner-de-manifestacao-paranormal-de-elemento",
  );

export default ITENS_PARANORMAIS_ARQUIVOS;