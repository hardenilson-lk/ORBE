export const ETAPAS_ESTRUTURAIS = [
  { id: "salas", nome: "Salas", dependeDe: null },
  { id: "corredores", nome: "Corredores", dependeDe: "salas" },
  { id: "navegacao", nome: "Entrada e saída", dependeDe: "corredores" },
  { id: "paredes", nome: "Paredes", dependeDe: "navegacao" },
  { id: "portas", nome: "Portas", dependeDe: "paredes" },
  { id: "tipos", nome: "Tipos de sala", dependeDe: "portas" },
  { id: "objetos", nome: "Objetos e decoração", dependeDe: "tipos" },
  { id: "iluminacao", nome: "Iluminação", dependeDe: "objetos" },
  { id: "validacao", nome: "Validação", dependeDe: "iluminacao" },
];

export const ORDEM_ETAPAS = ETAPAS_ESTRUTURAIS.map(({ id }) => id);

export const ETAPA_AFETADA_POR_CONFIGURACAO = {
  seed: "salas",
  largura: "salas",
  altura: "salas",
  quantidadeSalas: "salas",
  complexidade: "salas",
  larguraCorredores: "corredores",
  salasSecretas: "portas",
  tema: "tipos",
  decoracao: "objetos",
  iluminacao: "iluminacao",
};

export const ROTULOS_STATUS_ETAPA = {
  bloqueada: "Bloqueada",
  disponivel: "Disponível",
  processando: "Processando",
  concluida: "Concluída",
  "concluida-fallback": "Concluída com fallback",
  "concluida-avisos": "Concluída com avisos",
  ignorada: "Ignorada",
  desatualizada: "Desatualizada",
  erro: "Erro",
};
