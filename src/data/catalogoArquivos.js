export const CLASSES_ARQUIVOS = [
  "Combatente",
  "Especialista",
  "Ocultista",
];

export const CLASSES_CATALOGO_ARQUIVOS = [
  {
    id: "combatente",
    nome: "Combatente",
    tipo: "Classe",
    descricao:
      "Foco em combate direto, resistência e proteção do grupo.",
  },
  {
    id: "especialista",
    nome: "Especialista",
    tipo: "Classe",
    descricao:
      "Foco em perícias, investigação, suporte técnico e soluções práticas.",
  },
  {
    id: "ocultista",
    nome: "Ocultista",
    tipo: "Classe",
    descricao:
      "Foco em rituais, conhecimento paranormal e efeitos sobrenaturais.",
  },
];

export const ORIGENS_ARQUIVOS = [
  {
    id: "academico",
    nome: "Acadêmico",
    tipo: "Origem",
    descricao:
      "Personagem ligado a estudo, pesquisa e análise. Favorece cenas de investigação e conhecimento.",
    pericias: [
      "Ciências",
      "Investigação",
    ],
    talento: "Saber e Poder",
  },
  {
    id: "agente-de-saude",
    nome: "Agente de Saúde",
    tipo: "Origem",
    descricao:
      "Treinado para lidar com ferimentos, emergência e cuidado em campo.",
    pericias: [
      "Medicina",
      "Vontade",
    ],
    talento: "Técnica Medicinal",
  },
  {
    id: "artista",
    nome: "Artista",
    tipo: "Origem",
    descricao:
      "Usa expressão, presença e sensibilidade para influenciar pessoas e ler ambientes.",
    pericias: [
      "Artes",
      "Diplomacia",
    ],
    talento: "Magnum Opus",
  },
  {
    id: "atleta",
    nome: "Atleta",
    tipo: "Origem",
    descricao:
      "Foco em preparo físico, explosão, resistência e movimento.",
    pericias: [
      "Atletismo",
      "Fortitude",
    ],
    talento: "110%",
  },
  {
    id: "batedor",
    nome: "Batedor",
    tipo: "Origem",
    descricao:
      "Especialista em seguir pistas, reconhecer terreno e se mover antes do perigo chegar.",
    pericias: [
      "Percepção",
      "Sobrevivência",
    ],
    talento: "Olhos Abertos",
  },
  {
    id: "criminoso",
    nome: "Criminoso",
    tipo: "Origem",
    descricao:
      "Conhece ruas, risco, contatos ilegais e métodos pouco oficiais.",
    pericias: [
      "Crime",
      "Furtividade",
    ],
    talento: "O Crime Compensa",
  },
  {
    id: "cultista-arrependido",
    nome: "Cultista Arrependido",
    tipo: "Origem",
    descricao:
      "Carrega contato prévio com o paranormal e marcas de escolhas antigas.",
    pericias: [
      "Ocultismo",
      "Religião",
    ],
    talento:
      "Traços do Outro Lado",
  },
  {
    id: "investigador",
    nome: "Investigador",
    tipo: "Origem",
    descricao:
      "Acostumado a levantar provas, ligar pistas e seguir pessoas suspeitas.",
    pericias: [
      "Investigação",
      "Percepção",
    ],
    talento:
      "Faro para Pistas",
  },
  {
    id: "militar",
    nome: "Militar",
    tipo: "Origem",
    descricao:
      "Treinamento tático, disciplina e uso de armas em situações de combate.",
    pericias: [
      "Pontaria",
      "Tática",
    ],
    talento: "Para Bellum",
  },
  {
    id: "operario",
    nome: "Operário",
    tipo: "Origem",
    descricao:
      "Experiência prática com ferramentas, esforço físico e improviso.",
    pericias: [
      "Fortitude",
      "Profissão",
    ],
    talento:
      "Ferramentas de Trabalho",
  },
  {
    id: "religioso",
    nome: "Religioso",
    tipo: "Origem",
    descricao:
      "Apoio emocional, fé e contato com comunidades de crença.",
    pericias: [
      "Religião",
      "Vontade",
    ],
    talento: "Acalentar",
  },
  {
    id: "universitario",
    nome: "Universitário",
    tipo: "Origem",
    descricao:
      "Aprendizado amplo e vida acadêmica ainda em formação.",
    pericias: [
      "Atualidades",
      "Investigação",
    ],
    talento: "Dedicação",
  },
  {
    id: "vitima",
    nome: "Vítima",
    tipo: "Origem",
    descricao:
      "Sobreviveu a algo terrível e transformou trauma em instinto de sobrevivência.",
    pericias: [
      "Reflexos",
      "Vontade",
    ],
    talento:
      "Cicatrizes Psicológicas",
  },
];

export const TRILHAS_ARQUIVOS = [
  {
    id: "aniquilador",
    nome: "Aniquilador",
    classe: "Combatente",
    tipo: "Trilha",
    descricao:
      "Especialização em causar dano alto com armas favoritas.",
  },
  {
    id: "comandante-de-campo",
    nome: "Comandante de Campo",
    classe: "Combatente",
    tipo: "Trilha",
    descricao:
      "Coordena aliados, melhora posicionamento e abre oportunidades táticas.",
  },
  {
    id: "guerreiro",
    nome: "Guerreiro",
    classe: "Combatente",
    tipo: "Trilha",
    descricao:
      "Domina combate corpo a corpo e pressiona inimigos de perto.",
  },
  {
    id: "operacoes-especiais",
    nome: "Operações Especiais",
    classe: "Combatente",
    tipo: "Trilha",
    descricao:
      "Combate ágil, movimento rápido e respostas eficientes em crise.",
  },
  {
    id: "tropa-de-choque",
    nome: "Tropa de Choque",
    classe: "Combatente",
    tipo: "Trilha",
    descricao:
      "Aguenta dano, segura a linha de frente e protege o time.",
  },
  {
    id: "infiltrador",
    nome: "Infiltrador",
    classe: "Especialista",
    tipo: "Trilha",
    descricao:
      "Furtividade, ataques precisos e acesso a lugares protegidos.",
  },
  {
    id: "medico-de-campo",
    nome: "Médico de Campo",
    classe: "Especialista",
    tipo: "Trilha",
    descricao:
      "Mantém aliados vivos e estabiliza ferimentos durante a missão.",
  },
  {
    id: "negociador",
    nome: "Negociador",
    classe: "Especialista",
    tipo: "Trilha",
    descricao:
      "Resolve conflitos com fala, leitura social e pressão psicológica.",
  },
  {
    id: "tecnico",
    nome: "Técnico",
    classe: "Especialista",
    tipo: "Trilha",
    descricao:
      "Carrega recursos, conserta problemas e improvisa ferramentas.",
  },
  {
    id: "conduite",
    nome: "Conduíte",
    classe: "Ocultista",
    tipo: "Trilha",
    descricao:
      "Canaliza rituais com mais alcance, foco e controle.",
  },
  {
    id: "flagelador",
    nome: "Flagelador",
    classe: "Ocultista",
    tipo: "Trilha",
    descricao:
      "Transforma dor e sacrifício em energia paranormal.",
  },
  {
    id: "graduado",
    nome: "Graduado",
    classe: "Ocultista",
    tipo: "Trilha",
    descricao:
      "Estuda rituais com profundidade e amplia o repertório ocultista.",
  },
  {
    id: "intuitivo",
    nome: "Intuitivo",
    classe: "Ocultista",
    tipo: "Trilha",
    descricao:
      "Sente o paranormal antes de entender, resistindo melhor a seus efeitos.",
  },
  {
    id: "lamina-paranormal",
    nome: "Lâmina Paranormal",
    classe: "Ocultista",
    tipo: "Trilha",
    descricao:
      "Mistura rituais e armas para lutar de forma sobrenatural.",
  },
];

export const PATENTES_ARQUIVOS = [
  "Recruta",
  "Operador",
  "Agente Especial",
  "Oficial de Operações",
  "Agente de Elite",
];

export const NIVEIS_NEX = [
  "5%",
  "10%",
  "15%",
  "20%",
  "25%",
  "30%",
  "35%",
  "40%",
  "45%",
  "50%",
  "55%",
  "60%",
  "65%",
  "70%",
  "75%",
  "80%",
  "85%",
  "90%",
  "95%",
  "99%",
];

export const ATRIBUTOS_ARQUIVOS = [
  {
    id: "agilidade",
    sigla: "AGI",
    nome: "Agilidade",
  },
  {
    id: "forca",
    sigla: "FOR",
    nome: "Força",
  },
  {
    id: "intelecto",
    sigla: "INT",
    nome: "Intelecto",
  },
  {
    id: "presenca",
    sigla: "PRE",
    nome: "Presença",
  },
  {
    id: "vigor",
    sigla: "VIG",
    nome: "Vigor",
  },
];

export const PERICIAS_ARQUIVOS = [
  "Acrobacia",
  "Adestramento",
  "Artes",
  "Atletismo",
  "Atualidades",
  "Ciências",
  "Crime",
  "Diplomacia",
  "Enganação",
  "Fortitude",
  "Furtividade",
  "Iniciativa",
  "Intimidação",
  "Intuição",
  "Investigação",
  "Luta",
  "Medicina",
  "Ocultismo",
  "Percepção",
  "Pilotagem",
  "Pontaria",
  "Profissão",
  "Reflexos",
  "Religião",
  "Sobrevivência",
  "Tática",
  "Tecnologia",
  "Vontade",
];

export const TIPOS_ITEM_ARQUIVOS = [
  "Equipamento",
  "Arma",
  "Proteção",
  "Consumível",
  "Explosivo",
  "Item especial",
];

export const ELEMENTOS_RITUAL_ARQUIVOS = [
  "Conhecimento",
  "Energia",
  "Morte",
  "Sangue",
  "Medo",
];

export const CIRCULOS_RITUAL_ARQUIVOS = [
  {
    valor: 1,
    texto: "1º círculo",
  },
  {
    valor: 2,
    texto: "2º círculo",
  },
  {
    valor: 3,
    texto: "3º círculo",
  },
  {
    valor: 4,
    texto: "4º círculo",
  },
];

export const STATUS_MISSAO_ARQUIVOS = [
  {
    valor: "ativa",
    texto: "Ativa",
  },
  {
    valor: "pendente",
    texto: "Pendente",
  },
  {
    valor: "concluida",
    texto: "Concluída",
  },
  {
    valor: "falhou",
    texto: "Falhou",
  },
];

export const PRIORIDADES_MISSAO_ARQUIVOS = [
  {
    valor: "baixa",
    texto: "Baixa",
  },
  {
    valor: "normal",
    texto: "Normal",
  },
  {
    valor: "alta",
    texto: "Alta",
  },
  {
    valor: "critica",
    texto: "Crítica",
  },
];

export const STATUS_ARQUIVO_CAMPANHA = [
  {
    valor: "aberto",
    texto: "Aberto",
  },
  {
    valor: "andamento",
    texto: "Em andamento",
  },
  {
    valor: "encerrado",
    texto: "Encerrado",
  },
  {
    valor: "arquivado",
    texto: "Arquivado",
  },
];

const catalogoArquivos = {
  classes: CLASSES_ARQUIVOS,
  classesDetalhadas:
    CLASSES_CATALOGO_ARQUIVOS,
  origens: ORIGENS_ARQUIVOS,
  trilhas: TRILHAS_ARQUIVOS,
  patentes: PATENTES_ARQUIVOS,
  nex: NIVEIS_NEX,
  atributos: ATRIBUTOS_ARQUIVOS,
  pericias: PERICIAS_ARQUIVOS,
  tiposItem: TIPOS_ITEM_ARQUIVOS,
  elementosRitual:
    ELEMENTOS_RITUAL_ARQUIVOS,
  circulosRitual:
    CIRCULOS_RITUAL_ARQUIVOS,
  statusMissao:
    STATUS_MISSAO_ARQUIVOS,
  prioridadesMissao:
    PRIORIDADES_MISSAO_ARQUIVOS,
  statusArquivo:
    STATUS_ARQUIVO_CAMPANHA,
};

export default catalogoArquivos;