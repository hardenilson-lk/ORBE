const tipo = (id, nome, opcoes = {}) => ({
  id,
  nome,
  descricao: "Ambiente contemporâneo genérico.",
  min: [2, 2],
  max: 99,
  peso: 3,
  inicial: true,
  final: true,
  secreta: false,
  objetos: ["comum"],
  luz: "media",
  ...opcoes,
});

export const TIPOS_SALA_FALLBACK = [
  tipo("entrada", "Entrada", { max: 1, peso: 5, final: false }),
  tipo("sala-comum", "Sala comum", { peso: 7 }),
  tipo("area-administrativa", "Área administrativa", { objetos: ["administracao"] }),
  tipo("deposito", "Depósito", { objetos: ["estoque"], luz: "baixa" }),
  tipo("area-servico", "Área de serviço", { objetos: ["servico"] }),
  tipo("corredor-principal", "Corredor principal", { objetos: ["circulacao"] }),
  tipo("sala-tecnica", "Sala técnica", { objetos: ["tecnica"], luz: "baixa" }),
  tipo("sala-objetivo", "Sala de objetivo", { max: 1, inicial: false, peso: 5 }),
  tipo("area-interditada", "Área interditada", { inicial: false, objetos: ["interditada"], luz: "escura" }),
  tipo("sala-secreta", "Sala secreta", { inicial: false, secreta: true, luz: "baixa" }),
];

const objeto = (id, nome, categoria, salas = ["*"], opcoes = {}) => ({
  id,
  nome,
  categoria,
  salas,
  largura: 1,
  altura: 1,
  bloqueiaMovimento: false,
  bloqueiaVisao: false,
  preferencia: "livre",
  simbolo: nome.slice(0, 1).toUpperCase(),
  peso: 3,
  ...opcoes,
});

export const OBJETOS_FALLBACK = [
  objeto("mesa", "Mesa", "movel", ["sala-comum", "area-administrativa"], { largura: 2, bloqueiaMovimento: true }),
  objeto("cadeira", "Cadeira", "movel", ["*"], { bloqueiaMovimento: true, peso: 6 }),
  objeto("banco", "Banco", "movel", ["entrada", "corredor-principal"], { largura: 2, bloqueiaMovimento: true, preferencia: "parede" }),
  objeto("armario", "Armário", "movel", ["*"], { bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede" }),
  objeto("estante", "Estante", "movel", ["deposito", "area-administrativa"], { largura: 2, bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede" }),
  objeto("arquivo", "Arquivo", "movel", ["area-administrativa", "deposito"], { bloqueiaMovimento: true, preferencia: "parede" }),
  objeto("caixa", "Caixa", "estoque", ["deposito", "area-servico", "area-interditada"], { bloqueiaMovimento: true, peso: 6 }),
  objeto("pallet", "Pallet", "estoque", ["deposito", "area-servico"], { largura: 2, bloqueiaMovimento: true }),
  objeto("computador", "Computador", "equipamento", ["area-administrativa", "sala-tecnica"], { simbolo: "▣" }),
  objeto("telefone", "Telefone", "equipamento", ["entrada", "area-administrativa"], { simbolo: "☎" }),
  objeto("lixeira", "Lixeira", "movel", ["*"], { bloqueiaMovimento: true }),
  objeto("papel", "Papel espalhado", "decoracao", ["*"], { simbolo: "≋", peso: 7 }),
  objeto("entulho", "Entulho", "entulho", ["area-interditada", "area-servico"], { bloqueiaMovimento: true, simbolo: "▴" }),
  objeto("sujeira", "Sujeira", "decoracao", ["*"], { simbolo: "·", peso: 8 }),
  objeto("mancha", "Mancha", "decoracao", ["*"], { simbolo: "●", peso: 6 }),
  objeto("luminaria", "Luminária", "equipamento", ["*"], { geraLuz: "luz-teto", preferencia: "parede" }),
  objeto("painel-eletrico", "Painel elétrico", "estrutura", ["sala-tecnica", "area-servico"], { bloqueiaMovimento: true, preferencia: "parede", geraLuz: "painel-eletrico", simbolo: "⚡" }),
  objeto("fita-isolamento", "Fita de isolamento", "sinalizacao", ["area-interditada", "corredor-principal"], { largura: 2, simbolo: "×" }),
];

export const OBJETOS_PRINCIPAIS_FALLBACK = {
  entrada: ["banco", "telefone"],
  "area-administrativa": ["mesa", "cadeira", "computador", "arquivo"],
  deposito: ["estante", "caixa", "pallet"],
  "area-servico": ["armario", "painel-eletrico", "lixeira"],
  "sala-tecnica": ["painel-eletrico", "computador", "caixa"],
  "area-interditada": ["entulho", "fita-isolamento", "mancha"],
  "sala-objetivo": ["mesa", "armario", "papel"],
};

export const LUZES_FALLBACK = [
  { id: "luz-teto", nome: "Luz de teto", alcance: 5, intensidade: 0.7, cor: "#f1e8c8" },
  { id: "lampada", nome: "Lâmpada", alcance: 4, intensidade: 0.6, cor: "#ffe0a0" },
  { id: "emergencia", nome: "Luz de emergência", alcance: 3, intensidade: 0.55, cor: "#ff5f4d" },
  { id: "painel-eletrico", nome: "Painel elétrico", alcance: 2, intensidade: 0.35, cor: "#ffc342" },
  { id: "luz-externa", nome: "Iluminação externa", alcance: 6, intensidade: 0.6, cor: "#b7cfff" },
];

export const PERFIS_LUZ_FALLBACK = {
  entrada: ["luz-externa", "luz-teto"],
  deposito: ["lampada"],
  "sala-tecnica": ["emergencia", "painel-eletrico"],
  "area-interditada": ["emergencia"],
  padrao: ["luz-teto"],
};
