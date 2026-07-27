export const MODOS_GERACAO_MAPA = [
  {
    id: "automatico",
    nome: "Automático",
    descricao: "Prepara toda a estrutura em uma única geração.",
  },
  {
    id: "por-partes",
    nome: "Por partes",
    descricao: "Organiza a criação em etapas acompanhadas pelo mestre.",
  },
  {
    id: "gerar-editar",
    nome: "Gerar e editar",
    descricao: "Prepara o resultado para continuar no editor manual.",
  },
];

export const ETAPAS_GERACAO_POR_PARTES = [
  "Salas",
  "Corredores",
  "Entrada e saída",
  "Paredes",
  "Portas",
  "Validação",
  "Iluminação",
  "Decoração",
];
