const objeto = (id, nome, categoria, salas, opcoes = {}) => {
  const tipoObstaculo = opcoes.tipoObstaculo
    || (opcoes.bloqueiaVisao ? "alto" : opcoes.bloqueiaMovimento ? "baixo" : "chao");
  const padroes = {
    alto: { bloqueiaMovimento: true, bloqueiaVisao: true },
    baixo: { bloqueiaMovimento: true, bloqueiaVisao: false },
    chao: { bloqueiaMovimento: false, bloqueiaVisao: false },
    transparente: { bloqueiaMovimento: true, bloqueiaVisao: false },
    personalizado: { bloqueiaMovimento: false, bloqueiaVisao: false },
  }[tipoObstaculo] || { bloqueiaMovimento: false, bloqueiaVisao: false };
  return {
    id,
    nome,
    categoria,
    salas,
    largura: 1,
    altura: 1,
    ...padroes,
    tipoObstaculo,
    formaColisao: "retangulo",
    larguraColisao: null,
    alturaColisao: null,
    deslocamentoColisaoX: 0,
    deslocamentoColisaoY: 0,
    preferencia: "livre",
    simbolo: nome.slice(0, 1).toUpperCase(),
    peso: 2,
    ...opcoes,
  };
};

const QUALQUER_SALA = ["*"];

export const OBJETOS_HOSPITAL = [
  objeto("balcao-recepcao", "Balcão de recepção", "movel", ["recepcao", "administracao"], { largura: 2, bloqueiaMovimento: true, preferencia: "centro", simbolo: "B" }),
  objeto("cadeira", "Cadeira", "movel", QUALQUER_SALA, { bloqueiaMovimento: true, simbolo: "c", peso: 6 }),
  objeto("banco", "Banco", "movel", ["recepcao", "corredor-principal", "sala-comum"], { largura: 2, bloqueiaMovimento: true, preferencia: "parede" }),
  objeto("mesa", "Mesa", "movel", ["consultorio", "administracao", "sala-comum"], { largura: 2, bloqueiaMovimento: true }),
  objeto("armario", "Armário", "movel", QUALQUER_SALA, { bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede", peso: 4 }),
  objeto("estante", "Estante", "movel", ["arquivo-medico", "almoxarifado", "farmacia", "administracao"], { largura: 2, bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede" }),
  objeto("arquivo-metal", "Arquivo de metal", "movel", ["arquivo-medico", "administracao", "recepcao"], { bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede" }),
  objeto("maca-hospitalar", "Maca hospitalar", "movel", ["enfermaria", "centro-cirurgico", "isolamento", "sala-comum", "necroterio"], { largura: 2, bloqueiaMovimento: true, preferencia: "parede", simbolo: "M", peso: 5 }),
  objeto("cama-hospitalar", "Cama hospitalar", "movel", ["enfermaria", "isolamento"], { largura: 2, bloqueiaMovimento: true, preferencia: "parede", simbolo: "C", peso: 5 }),
  objeto("biombo", "Biombo", "estrutura", ["enfermaria", "centro-cirurgico", "isolamento"], { largura: 2, bloqueiaMovimento: true, bloqueiaVisao: true }),
  objeto("mesa-cirurgica", "Mesa cirúrgica", "movel", ["centro-cirurgico"], { largura: 2, bloqueiaMovimento: true, preferencia: "centro", simbolo: "+" }),
  objeto("armario-medicamentos", "Armário de medicamentos", "movel", ["farmacia", "enfermaria", "centro-cirurgico", "consultorio"], { bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede" }),
  objeto("bancada-laboratorio", "Bancada de laboratório", "estrutura", ["laboratorio-clinico"], { largura: 2, bloqueiaMovimento: true, preferencia: "parede" }),
  objeto("prateleira", "Prateleira", "movel", ["almoxarifado", "farmacia", "sala-maquinas"], { largura: 2, bloqueiaMovimento: true, preferencia: "parede" }),
  objeto("carrinho-hospitalar", "Carrinho hospitalar", "movel", ["enfermaria", "centro-cirurgico", "corredor-principal"], { bloqueiaMovimento: true }),
  objeto("pia", "Pia", "estrutura", ["banheiro", "consultorio", "centro-cirurgico", "laboratorio-clinico"], { bloqueiaMovimento: true, preferencia: "parede" }),
  objeto("vaso-sanitario", "Vaso sanitário", "estrutura", ["banheiro"], { bloqueiaMovimento: true, preferencia: "parede", simbolo: "V" }),
  objeto("gerador", "Gerador", "estrutura", ["sala-maquinas", "area-interditada"], { largura: 2, bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede", geraLuz: "gerador", simbolo: "G" }),
  objeto("painel-eletrico", "Painel elétrico", "estrutura", ["sala-maquinas", "area-interditada", "corredor-principal"], { bloqueiaMovimento: true, preferencia: "parede", geraLuz: "painel-eletrico", simbolo: "⚡" }),
  objeto("freezer-mortuario", "Freezer mortuário", "estrutura", ["necroterio"], { largura: 2, bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede", simbolo: "F" }),
  objeto("gaveta-mortuaria", "Gaveta mortuária", "estrutura", ["necroterio"], { largura: 2, bloqueiaMovimento: true, bloqueiaVisao: true, preferencia: "parede", peso: 5 }),
  objeto("computador-antigo", "Computador antigo", "equipamento", ["recepcao", "administracao", "consultorio", "arquivo-medico", "laboratorio-clinico"], { geraLuz: "monitor", simbolo: "▣" }),
  objeto("monitor-medico", "Monitor médico", "equipamento", ["enfermaria", "centro-cirurgico", "isolamento"], { geraLuz: "monitor", simbolo: "♥" }),
  objeto("suporte-soro", "Suporte de soro", "equipamento", ["enfermaria", "centro-cirurgico", "isolamento"], { bloqueiaMovimento: true, simbolo: "I" }),
  objeto("cilindro", "Cilindro", "equipamento", ["enfermaria", "centro-cirurgico", "almoxarifado"], { bloqueiaMovimento: true }),
  objeto("equipamento-cirurgico", "Equipamento cirúrgico", "equipamento", ["centro-cirurgico"], { bloqueiaMovimento: true, geraLuz: "luz-cirurgica" }),
  objeto("telefone", "Telefone", "equipamento", ["recepcao", "administracao", "consultorio"], { simbolo: "☎" }),
  objeto("camera-seguranca", "Câmera de segurança", "equipamento", ["recepcao", "corredor-principal", "area-interditada"], { preferencia: "parede", simbolo: "◉" }),
  objeto("extintor", "Extintor", "sinalizacao", QUALQUER_SALA, { preferencia: "parede", simbolo: "E" }),
  objeto("lixeira", "Lixeira hospitalar", "movel", QUALQUER_SALA, { bloqueiaMovimento: true }),
  objeto("papel-espalhado", "Papel espalhado", "decoracao", QUALQUER_SALA, { simbolo: "≋", peso: 6 }),
  objeto("entulho", "Entulho", "entulho", ["area-interditada", "sala-maquinas", "sala-comum"], { bloqueiaMovimento: true, simbolo: "▴", peso: 4 }),
  objeto("vidro-quebrado", "Vidro quebrado", "decoracao", QUALQUER_SALA, { simbolo: "◇", peso: 4 }),
  objeto("mancha", "Mancha", "decoracao", QUALQUER_SALA, { simbolo: "●", peso: 7 }),
  objeto("umidade", "Umidade", "decoracao", QUALQUER_SALA, { preferencia: "parede", simbolo: "≈", peso: 5 }),
  objeto("fita-isolamento", "Fita de isolamento", "sinalizacao", ["area-interditada", "corredor-principal", "necroterio"], { largura: 2, simbolo: "×" }),
  objeto("placa-caida", "Placa caída", "sinalizacao", QUALQUER_SALA, { simbolo: "!" }),
  objeto("simbolo-ritual", "Símbolo ritualístico", "ritual", ["sala-ritual", "area-interditada", "necroterio"], { simbolo: "✦", peso: 5 }),
  objeto("marca-arrasto", "Marca de arrasto", "decoracao", QUALQUER_SALA, { simbolo: "〰", peso: 4 }),
  objeto("sujeira", "Sujeira", "decoracao", QUALQUER_SALA, { simbolo: "·", peso: 8 }),
  objeto("vegetacao", "Vegetação invadindo", "decoracao", ["area-interditada", "sala-comum", "recepcao"], { simbolo: "♧" }),
  objeto("azulejo-quebrado", "Azulejo quebrado", "decoracao", QUALQUER_SALA, { simbolo: "▧", peso: 5 }),
];

export const OBJETOS_PRINCIPAIS_POR_SALA = {
  recepcao: ["balcao-recepcao", "cadeira", "computador-antigo"],
  enfermaria: ["cama-hospitalar", "maca-hospitalar", "suporte-soro"],
  "centro-cirurgico": ["mesa-cirurgica", "equipamento-cirurgico", "armario-medicamentos"],
  necroterio: ["gaveta-mortuaria", "maca-hospitalar", "freezer-mortuario"],
  "arquivo-medico": ["arquivo-metal", "estante", "papel-espalhado"],
  "sala-maquinas": ["gerador", "painel-eletrico", "entulho"],
  banheiro: ["vaso-sanitario", "pia"],
  "sala-ritual": ["simbolo-ritual", "mancha", "marca-arrasto"],
};

export function obterObjetoHospital(tipoId) {
  return OBJETOS_HOSPITAL.find(({ id }) => id === tipoId) || null;
}

export function listarObjetosCompativeisHospital(tipoSala) {
  return OBJETOS_HOSPITAL.filter(({ salas }) => salas.includes("*") || salas.includes(tipoSala));
}
