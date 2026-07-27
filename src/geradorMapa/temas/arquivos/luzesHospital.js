export const LUZES_HOSPITAL = [
  { id: "luz-teto", nome: "Luz de teto", alcance: 5, intensidade: .7, cor: "#e8f2df" },
  { id: "fluorescente", nome: "Luz fluorescente", alcance: 6, intensidade: .75, cor: "#d9fff0" },
  { id: "emergencia", nome: "Luz de emergência", alcance: 3, intensidade: .55, cor: "#ff5f4d" },
  { id: "monitor", nome: "Monitor", alcance: 2, intensidade: .3, cor: "#69dfff" },
  { id: "painel-eletrico", nome: "Painel elétrico", alcance: 2, intensidade: .35, cor: "#ffc342" },
  { id: "gerador", nome: "Gerador", alcance: 4, intensidade: .5, cor: "#f2ba52" },
  { id: "luz-cirurgica", nome: "Luz cirúrgica", alcance: 7, intensidade: 1, cor: "#f5fff8" },
  { id: "luz-externa", nome: "Luz externa", alcance: 6, intensidade: .6, cor: "#b7cfff" },
  { id: "ritualistica", nome: "Luz ritualística", alcance: 5, intensidade: .65, cor: "#9b5cff" },
];

export const PERFIS_LUZ_HOSPITAL = {
  recepcao: ["luz-teto", "emergencia"],
  enfermaria: ["luz-teto", "fluorescente"],
  "centro-cirurgico": ["luz-cirurgica"],
  necroterio: ["fluorescente"],
  "sala-maquinas": ["emergencia", "painel-eletrico"],
  "sala-ritual": ["ritualistica"],
  "area-interditada": ["emergencia"],
  padrao: ["luz-teto"],
};

export function obterLuzHospital(tipoId) {
  return LUZES_HOSPITAL.find(({ id }) => id === tipoId) || null;
}
