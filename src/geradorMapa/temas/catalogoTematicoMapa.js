import {
  LUZES_HOSPITAL,
  PERFIS_LUZ_HOSPITAL,
} from "./arquivos/luzesHospital.js";
import {
  OBJETOS_HOSPITAL,
  OBJETOS_PRINCIPAIS_POR_SALA,
} from "./arquivos/objetosHospital.js";
import { TIPOS_SALA_HOSPITAL } from "./arquivos/tiposSalaHospital.js";
import {
  LUZES_FALLBACK,
  OBJETOS_FALLBACK,
  OBJETOS_PRINCIPAIS_FALLBACK,
  PERFIS_LUZ_FALLBACK,
  TIPOS_SALA_FALLBACK,
} from "./arquivos/fallbackContemporaneo.js";
import { CATALOGOS_TEMATICOS_ARQUIVOS } from "./arquivos/catalogosTematicosArquivos.js";

const HOSPITAL = {
  especializado: true,
  tiposSala: TIPOS_SALA_HOSPITAL,
  objetos: OBJETOS_HOSPITAL,
  objetosPrincipais: OBJETOS_PRINCIPAIS_POR_SALA,
  luzes: LUZES_HOSPITAL,
  perfisLuz: PERFIS_LUZ_HOSPITAL,
};

const FALLBACK = {
  especializado: false,
  tiposSala: TIPOS_SALA_FALLBACK,
  objetos: OBJETOS_FALLBACK,
  objetosPrincipais: OBJETOS_PRINCIPAIS_FALLBACK,
  luzes: LUZES_FALLBACK,
  perfisLuz: PERFIS_LUZ_FALLBACK,
};

export function obterCatalogoTematicoMapa(temaId) {
  if (temaId === "hospital-abandonado") return HOSPITAL;
  return CATALOGOS_TEMATICOS_ARQUIVOS[temaId] || FALLBACK;
}

export function obterTipoSalaDoTema(temaId, tipoId) {
  return obterCatalogoTematicoMapa(temaId).tiposSala.find(({ id }) => id === tipoId) || null;
}

export function obterObjetoDoTema(temaId, objetoId) {
  return obterCatalogoTematicoMapa(temaId).objetos.find(({ id }) => id === objetoId) || null;
}

export function obterLuzDoTema(temaId, luzId) {
  return obterCatalogoTematicoMapa(temaId).luzes.find(({ id }) => id === luzId) || null;
}

export function listarObjetosCompativeisDoTema(temaId, tipoSala) {
  return obterCatalogoTematicoMapa(temaId).objetos
    .filter(({ salas }) => salas.includes("*") || salas.includes(tipoSala));
}
