export const TAMANHOS_MAPA = {
  pequeno: { nome: "Pequeno", largura: 20, altura: 15 },
  medio: { nome: "Médio", largura: 30, altura: 20 },
  grande: { nome: "Grande", largura: 40, altura: 30 },
  "muito-grande": { nome: "Muito grande", largura: 50, altura: 40 },
  personalizado: { nome: "Personalizado", largura: null, altura: null },
};

export const LIMITES_DIMENSOES_MAPA = {
  largura: { minimo: 10, maximo: 60 },
  altura: { minimo: 10, maximo: 60 },
};

export const CONFIGURACOES_INICIAIS_MAPA = {
  modo: "automatico",
  tema: "hospital-abandonado",
  tamanho: "medio",
  largura: 30,
  altura: 20,
  complexidade: "media",
  quantidadeSalas: 8,
  larguraCorredores: 1,
  decoracao: "media",
  iluminacao: "baixa",
  desgaste: "medio",
  sujeira: "media",
  presencaParanormal: "discreta",
  salasSecretas: 0,
};

export function limitarDimensaoMapa(valor, tipo) {
  const limites = LIMITES_DIMENSOES_MAPA[tipo];
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return limites.minimo;
  return Math.min(limites.maximo, Math.max(limites.minimo, Math.round(numero)));
}
