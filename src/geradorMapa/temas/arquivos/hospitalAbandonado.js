import { TIPOS_SALA_HOSPITAL } from "./tiposSalaHospital.js";
import { OBJETOS_HOSPITAL } from "./objetosHospital.js";
import { LUZES_HOSPITAL } from "./luzesHospital.js";

export const HOSPITAL_ABANDONADO = {
  id: "hospital-abandonado",
  nome: "Hospital abandonado",
  sistema: "arquivos",
  classe: "tema-mapa--hospital-abandonado",
  tiposSala: TIPOS_SALA_HOSPITAL,
  objetos: OBJETOS_HOSPITAL,
  luzes: LUZES_HOSPITAL,
  densidades: {
    decoracao: ["nenhuma", "baixa", "media", "alta"],
    iluminacao: ["clara", "media", "baixa", "escura", "apagada"],
  },
  visual: {
    fundo: "Instalação hospitalar escurecida",
    chaoSala: "Piso cerâmico claro e envelhecido",
    chaoCorredor: "Piso institucional contínuo",
    parede: "Parede fria com desgaste discreto",
    porta: "Porta hospitalar metálica",
    grid: "Grade técnica integrada",
    entrada: "Acesso seguro",
    saida: "Objetivo de evacuação",
  },
};
