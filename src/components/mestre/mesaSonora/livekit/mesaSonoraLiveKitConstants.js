export const NOME_FAIXA_MESA_SONORA = "orbe-mesa-sonora";
export const TOPICO_ESTADO_MESA_SONORA = "orbe:mesa-sonora:estado";
export const CHAVE_MEU_VOLUME = "orbe:mesa-sonora:meu-volume";
export const VOLUME_LOCAL_PADRAO = 70;
export const VOLUME_MINIMO = 0;
export const VOLUME_MAXIMO = 100;

export const ESTADOS_TRANSMISSAO = {
  DESCONECTADO: "desconectado",
  PRONTO: "pronto",
  PUBLICANDO: "publicando",
  TRANSMITINDO: "transmitindo",
  INTERROMPIDO: "interrompido",
  ERRO: "erro",
};

export const ESTADO_REMOTO_INICIAL = {
  somAtual: "",
  cenaAtual: "",
  tocando: false,
  pausado: false,
  iniciadoEm: null,
  volumeSala: 80,
  botaoId: "",
  cenaId: "",
};
