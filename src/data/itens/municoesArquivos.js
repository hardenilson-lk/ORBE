const DADOS_PADRAO_MUNICAO = {
  tipo: "Munição",
  quantidade: 1,
  volume: 1,
  ativo: true,
  consumivel: true,
  unidadeControle: "Pacote",
};

function criarMunicao(dados) {
  return {
    ...DADOS_PADRAO_MUNICAO,
    ...dados,
  };
}

export const MUNICOES_ARQUIVOS = [
  criarMunicao({
    id: "balas-curtas",
    nome: "Balas Curtas",

    categoria:
      "Munição para armas de fogo",

    categoriaNumerica: 0,

    duracaoUso:
      "Duas cenas",

    usosMaximos: 2,

    armasCompativeis: [
      "pistola",
      "revolver",
      "submetralhadora",
    ],

    imagem: "balas-curtas",

    propriedades: [
      "Categoria 0",
      "Ocupa 1 espaço",
      "Pacote de munição",
      "Dura duas cenas",
      "Pistolas",
      "Revólveres",
      "Submetralhadoras",
    ],

    efeito:
      "Um pacote de balas curtas permite utilizar pistolas, revólveres e submetralhadoras durante duas cenas. Após ser utilizado pelo total de cenas indicado, o pacote é consumido.",

    descricao:
      "Uma caixa compacta contendo munição de menor calibre, apropriada para armas curtas e submetralhadoras. O pacote representa não apenas as balas disponíveis, mas também carregadores, perdas durante a movimentação, disparos de cobertura e possíveis falhas ocorridas no caos de um confronto. Por isso, não é necessário controlar cada projétil individualmente.",

    comentario:
      "Duas cenas parecem bastante, até alguém descobrir que o plano inteiro consiste em atirar até alguma coisa parar de se mover.",
  }),

  criarMunicao({
    id: "balas-longas",
    nome: "Balas Longas",

    categoria:
      "Munição para armas de fogo",

    categoriaNumerica: 1,

    duracaoUso:
      "Uma cena",

    usosMaximos: 1,

    armasCompativeis: [
      "fuzil-de-caca",
      "fuzil-de-assalto",
      "fuzil-de-precisao",
      "metralhadora",
    ],

    imagem: "balas-longas",

    propriedades: [
      "Categoria I",
      "Ocupa 1 espaço",
      "Pacote de munição",
      "Dura uma cena",
      "Fuzis",
      "Metralhadoras",
    ],

    efeito:
      "Um pacote de balas longas permite utilizar fuzis e metralhadoras durante uma cena. Após ser utilizado nessa cena, o pacote é consumido.",

    descricao:
      "Munição maior e mais potente, desenvolvida para armas longas e armamentos militares. Seus projéteis suportam cargas de pólvora superiores e mantêm energia por distâncias maiores. O pacote inclui munição suficiente para os vários disparos realizados durante uma cena de combate, mas o alto ritmo de fogo dessas armas faz com que seja consumido rapidamente.",

    comentario:
      "O alcance é maior, o impacto é maior e a velocidade com que a caixa fica vazia também.",
  }),

  criarMunicao({
    id: "cartuchos",
    nome: "Cartuchos",

    categoria:
      "Munição para espingarda",

    categoriaNumerica: 1,

    duracaoUso:
      "Uma cena",

    usosMaximos: 1,

    armasCompativeis: [
      "espingarda",
    ],

    imagem: "cartuchos",

    propriedades: [
      "Categoria I",
      "Ocupa 1 espaço",
      "Pacote de munição",
      "Dura uma cena",
      "Usado em espingardas",
      "Esferas de chumbo",
    ],

    efeito:
      "Um pacote de cartuchos permite utilizar uma espingarda durante uma cena. Após ser utilizado nessa cena, o pacote é consumido.",

    descricao:
      "Um conjunto de cartuchos carregados com múltiplas esferas de chumbo. Quando disparadas por uma espingarda, elas se espalham conforme percorrem a distância, tornando a arma especialmente perigosa contra alvos próximos. A caixa também inclui cartuchos perdidos, deformados ou utilizados em disparos que não chegam a ser representados individualmente durante a cena.",

    comentario:
      "Em alcance curto, a espingarda não precisa que você seja preciso. Ela só precisa que você esteja apontando para o problema certo.",
  }),

  criarMunicao({
    id: "combustivel",
    nome: "Combustível",

    categoria:
      "Munição para lança-chamas",

    categoriaNumerica: 1,

    duracaoUso:
      "Uma cena",

    usosMaximos: 1,

    armasCompativeis: [
      "lanca-chamas",
    ],

    imagem: "combustivel",

    propriedades: [
      "Categoria I",
      "Ocupa 1 espaço",
      "Tanque de combustível",
      "Dura uma cena",
      "Usado em lança-chamas",
      "Material inflamável",
    ],

    efeito:
      "Um tanque de combustível permite utilizar um lança-chamas durante uma cena. Após ser utilizado nessa cena, o tanque é consumido.",

    descricao:
      "Um recipiente reforçado contendo uma mistura altamente inflamável preparada para uso em lança-chamas. O tanque possui válvulas, mangueiras e mecanismos de segurança que reduzem o risco de vazamentos, embora carregar combustível pressurizado durante uma investigação paranormal continue sendo uma decisão questionável em vários níveis.",

    comentario:
      "Tecnicamente é munição. Emocionalmente é carregar um incêndio nas costas.",
  }),

  criarMunicao({
    id: "flechas",
    nome: "Flechas",

    categoria:
      "Munição para armas de disparo",

    categoriaNumerica: 0,

    duracaoUso:
      "Uma missão inteira",

    duracaoMissao: true,

    armasCompativeis: [
      "arco",
      "besta",
      "arco-composto",
      "balestra",
    ],

    imagem: "flechas",

    propriedades: [
      "Categoria 0",
      "Ocupa 1 espaço",
      "Pacote de munição",
      "Dura uma missão inteira",
      "Flechas reaproveitáveis",
      "Arcos e bestas",
    ],

    efeito:
      "Um pacote de flechas permite utilizar arcos, bestas, arcos compostos e balestras durante uma missão inteira. As flechas podem ser recuperadas e reaproveitadas após os confrontos.",

    descricao:
      "Uma aljava com flechas preparadas para armas de disparo. As hastes podem variar em tamanho e material conforme a arma utilizada, mas normalmente são resistentes o bastante para serem recuperadas depois de um confronto. O pacote representa flechas perdidas, quebradas ou impossíveis de alcançar sem exigir que o jogador controle cada projétil separadamente.",

    comentario:
      "Silenciosas, reutilizáveis e quase elegantes, até chegar o momento de explicar por que há uma flecha presa no teto.",
  }),

  criarMunicao({
    id: "foguete",
    nome: "Foguete",

    categoria:
      "Munição para arma pesada",

    categoriaNumerica: 1,

    duracaoUso:
      "Um único disparo",

    usosMaximos: 1,

    disparosPorPacote: 1,

    armasCompativeis: [
      "bazuca",
    ],

    imagem: "foguete",

    propriedades: [
      "Categoria I",
      "Ocupa 1 espaço",
      "Um único disparo",
      "Usado em bazucas",
      "Projétil explosivo",
      "Cada unidade conta separadamente",
    ],

    efeito:
      "Cada foguete permite realizar apenas um disparo com uma bazuca. Para realizar vários ataques, o personagem precisa carregar vários foguetes, e cada unidade ocupa espaço e conta separadamente no inventário.",

    descricao:
      "Um projétil explosivo de grande porte desenvolvido para ser disparado por uma bazuca. Possui sistema próprio de propulsão e uma carga capaz de destruir veículos, estruturas e criaturas resistentes. Diferentemente das outras munições, não representa um pacote para várias cenas: cada foguete é uma unidade completa e deixa de existir imediatamente após o disparo.",

    comentario:
      "Um disparo, uma explosão e uma excelente oportunidade para descobrir se o mestre preparou um mapa de incêndio.",
  }),
];

export const MUNICOES_CATEGORIA_ZERO_ARQUIVOS =
  MUNICOES_ARQUIVOS.filter(
    (municao) =>
      municao.categoriaNumerica ===
      0,
  );

export const MUNICOES_CATEGORIA_UM_ARQUIVOS =
  MUNICOES_ARQUIVOS.filter(
    (municao) =>
      municao.categoriaNumerica ===
      1,
  );

export default MUNICOES_ARQUIVOS;