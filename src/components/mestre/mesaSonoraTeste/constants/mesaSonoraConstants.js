export const CHAVE_MESA_SONORA = "orbe:mesa-sonora";
export const CHAVE_MESA_SONORA_LEGADA = "orbe:teste:mesa-sonora";

export const CATEGORIAS_INICIAIS = [
  "Ambiente",
  "Combate",
  "Terror",
  "Efeitos",
  "Música",
  "Outros",
];

export const ORIGENS_SOM = {
  LOCAL: "local",
  YOUTUBE: "youtube",
  SPOTIFY: "spotify",
};

export const ROTULOS_ORIGEM = {
  local: "Arquivo local",
  youtube: "YouTube",
  spotify: "Spotify",
};

export const ESTADOS_SOM = {
  NORMAL: "normal",
  CARREGANDO: "carregando",
  TOCANDO: "tocando",
  PAUSADO: "pausado",
  ERRO: "erro",
};

export const EXTENSOES_AUDIO_ACEITAS = ["mp3", "wav", "ogg", "m4a"];
export const MIME_AUDIO_ACEITOS = "audio/mpeg,audio/wav,audio/ogg,audio/mp4,.mp3,.wav,.ogg,.m4a";
export const VOLUME_MINIMO = 0;
export const VOLUME_MAXIMO = 100;

export const CORES_SOM = [
  "#8b302b",
  "#a76528",
  "#345f52",
  "#58437d",
  "#315c78",
  "#6b532e",
];

export const SOM_VAZIO = {
  nome: "",
  origem: ORIGENS_SOM.LOCAL,
  categoria: CATEGORIAS_INICIAIS[0],
  categoriaPersonalizada: "",
  cor: CORES_SOM[0],
  icone: "♪",
  volume: 80,
  loop: false,
  fadeIn: 0,
  fadeOut: 0,
  tocarJunto: true,
  pararOutros: false,
  atalho: "",
  url: "",
};

export const ESTADO_INICIAL_MESA = {
  sons: [],
  cenas: [],
  categorias: CATEGORIAS_INICIAIS,
  volumeGeral: 80,
};
