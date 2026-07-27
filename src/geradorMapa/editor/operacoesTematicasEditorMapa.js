import { marcarEdicao } from "./operacoesEditorMapa.js";
import { obterTipoSalaHospital, TIPOS_SALA_HOSPITAL } from "../temas/arquivos/tiposSalaHospital.js";
import { obterObjetoHospital } from "../temas/arquivos/objetosHospital.js";
import { obterLuzHospital } from "../temas/arquivos/luzesHospital.js";
import {
  gerarObjetosTematicos,
  validarPosicaoObjeto,
} from "../core/gerarObjetosTematicos.js";
import { gerarIluminacaoTematica } from "../core/gerarIluminacaoTematica.js";
import { corrigirMapaTematico, validarMapaTematico } from "../core/validarMapaTematico.js";
import { distribuirTiposSalaTematicos } from "../core/gerarTiposSalaTematicos.js";

function proximoManual(lista, prefixo) {
  const maior = lista.reduce((maximo, { id }) => {
    const numero = Number(String(id).match(new RegExp(`^${prefixo}-(\\d+)$`))?.[1] || 0);
    return Math.max(maximo, numero);
  }, 0);
  return `${prefixo}-${maior + 1}`;
}

function resumirObjetos(objetos) {
  return {
    total: objetos.length,
    decoracoes: objetos.filter(({ decorativo }) => decorativo).length,
    bloqueadores: objetos.filter(({ bloqueiaMovimento }) => bloqueiaMovimento).length,
  };
}

function resumirLuzes(mapa, luzes) {
  return {
    total: luzes.length,
    ativas: luzes.filter(({ ativa }) => ativa).length,
    inativas: luzes.filter(({ ativa }) => !ativa).length,
    salasSemIluminacao: mapa.salas.filter((sala) => !luzes.some((luz) => luz.salaId === sala.id && luz.ativa)).length,
  };
}

function renumerarTipoSalas(salas) {
  const totais = salas.reduce((acc, sala) => ({ ...acc, [sala.tipoTematico]: (acc[sala.tipoTematico] || 0) + 1 }), {});
  const contadores = {};
  return salas.map((sala) => {
    const tipo = obterTipoSalaHospital(sala.tipoTematico);
    contadores[sala.tipoTematico] = (contadores[sala.tipoTematico] || 0) + 1;
    return {
      ...sala,
      nome: totais[sala.tipoTematico] > 1 ? `${tipo?.nome || "Sala"} ${contadores[sala.tipoTematico]}` : (tipo?.nome || "Sala comum"),
      perfilObjetos: tipo?.objetos || ["comum"],
      perfilIluminacao: tipo?.luz || "media",
    };
  });
}

export function redistribuirTiposEditor(mapa) {
  return {
    sucesso: true,
    mapa: marcarEdicao(distribuirTiposSalaTematicos(mapa)),
    selecao: null,
    descricao: "Tipos de sala redistribuídos",
    aviso: "Objetos anteriores foram removidos e a iluminação precisa ser regenerada.",
  };
}

export function alterarTipoSalaTematico(mapa, salaId, tipoId) {
  const sala = mapa.salas.find(({ id }) => id === salaId);
  const tipo = obterTipoSalaHospital(tipoId);
  if (!sala || !tipo) return { sucesso: false, erro: "Tipo de sala inválido." };
  const salas = renumerarTipoSalas(mapa.salas.map((item) => item.id === salaId ? { ...item, tipoTematico: tipo.id } : item));
  const objetos = (mapa.objetos || []).filter((objeto) => objeto.salaId !== salaId);
  const luzes = (mapa.luzes || []).filter((luz) => luz.salaId !== salaId);
  const avisos = [];
  if (sala.largura < tipo.min[0] || sala.altura < tipo.min[1]) avisos.push(`${tipo.nome} foi aplicado a uma sala menor que o recomendado.`);
  if (salaId === mapa.salaInicialId && !tipo.inicial) avisos.push(`${tipo.nome} não é recomendado como sala inicial.`);
  if (salaId === mapa.salaFinalId && !tipo.final) avisos.push(`${tipo.nome} não é recomendado como sala final.`);
  return {
    sucesso: true,
    mapa: marcarEdicao({
      ...mapa,
      salas,
      objetos,
      luzes,
      resumoObjetos: resumirObjetos(objetos),
      resumoIluminacao: resumirLuzes(mapa, luzes),
      objetosDesatualizados: true,
      iluminacaoTematicaDesatualizada: true,
      validacaoTematica: null,
    }),
    selecao: { tipo: "sala", id: salaId },
    descricao: `${salaId} agora é ${tipo.nome}`,
    aviso: avisos.join(" ") || "Objetos e iluminação desta sala precisam ser regenerados.",
  };
}

export function regenerarObjetosEditor(mapa, salaId = null) {
  const atualizado = gerarObjetosTematicos(mapa, salaId);
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizado),
    selecao: salaId ? { tipo: "sala", id: salaId } : null,
    descricao: salaId ? `Objetos de ${salaId} regenerados` : "Objetos do mapa regenerados",
  };
}

export function limparObjetosSala(mapa, salaId) {
  const objetos = (mapa.objetos || []).filter((objeto) => objeto.salaId !== salaId);
  const ids = new Set(objetos.map(({ id }) => id));
  const luzes = (mapa.luzes || []).filter(({ objetoOrigemId }) => !objetoOrigemId || ids.has(objetoOrigemId));
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, objetos, luzes, resumoObjetos: resumirObjetos(objetos), resumoIluminacao: resumirLuzes(mapa, luzes), validacaoTematica: null }),
    selecao: { tipo: "sala", id: salaId },
    descricao: `Objetos de ${salaId} removidos`,
  };
}

export function criarObjetoManual(mapa, tipoId, ponto) {
  const catalogo = obterObjetoHospital(tipoId);
  const sala = mapa.salas.find((item) => ponto.x >= item.x && ponto.x < item.x + item.largura && ponto.y >= item.y && ponto.y < item.y + item.altura);
  if (!catalogo || !sala) return { sucesso: false, erro: "Clique dentro de uma sala e escolha um objeto válido." };
  const objeto = {
    id: proximoManual(mapa.objetos || [], "objeto-manual"),
    tipo: catalogo.id,
    nome: catalogo.nome,
    categoria: catalogo.categoria,
    salaId: sala.id,
    x: Math.round(ponto.x),
    y: Math.round(ponto.y),
    largura: catalogo.largura,
    altura: catalogo.altura,
    rotacao: 0,
    bloqueiaMovimento: catalogo.bloqueiaMovimento,
    bloqueiaVisao: catalogo.bloqueiaVisao,
    decorativo: ["decoracao", "sinalizacao"].includes(catalogo.categoria),
    interativo: false,
    tema: mapa.tema,
    origem: "manual",
  };
  const erro = validarPosicaoObjeto(mapa, objeto);
  if (erro) return { sucesso: false, erro };
  const objetos = [...(mapa.objetos || []), objeto];
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, objetos, resumoObjetos: resumirObjetos(objetos), validacaoTematica: null }),
    selecao: { tipo: "objeto", id: objeto.id },
    descricao: `${catalogo.nome} criado`,
  };
}

export function alterarObjetoManual(mapa, objetoId, alteracoes) {
  const atual = (mapa.objetos || []).find(({ id }) => id === objetoId);
  if (!atual) return { sucesso: false, erro: "Objeto não encontrado." };
  const proximo = {
    ...atual,
    ...alteracoes,
    x: Math.round(alteracoes.x ?? atual.x),
    y: Math.round(alteracoes.y ?? atual.y),
  };
  const erro = validarPosicaoObjeto(mapa, proximo, mapa.objetos, objetoId);
  if (erro) return { sucesso: false, erro };
  const objetos = mapa.objetos.map((objeto) => objeto.id === objetoId ? proximo : objeto);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, objetos, resumoObjetos: resumirObjetos(objetos), validacaoTematica: null }),
    selecao: { tipo: "objeto", id: objetoId },
    descricao: `${objetoId} alterado`,
  };
}

export function alterarTipoObjetoManual(mapa, objetoId, tipoId) {
  const atual = (mapa.objetos || []).find(({ id }) => id === objetoId);
  const catalogo = obterObjetoHospital(tipoId);
  if (!atual || !catalogo) return { sucesso: false, erro: "Objeto ou tipo não encontrado." };
  return alterarObjetoManual(mapa, objetoId, {
    tipo: catalogo.id,
    nome: catalogo.nome,
    categoria: catalogo.categoria,
    largura: catalogo.largura,
    altura: catalogo.altura,
    bloqueiaMovimento: catalogo.bloqueiaMovimento,
    bloqueiaVisao: catalogo.bloqueiaVisao,
    decorativo: ["decoracao", "sinalizacao"].includes(catalogo.categoria),
  });
}

export function rotacionarObjetoManual(mapa, objetoId) {
  const atual = (mapa.objetos || []).find(({ id }) => id === objetoId);
  return atual ? alterarObjetoManual(mapa, objetoId, { rotacao: (atual.rotacao + 90) % 360 }) : { sucesso: false, erro: "Objeto não encontrado." };
}

export function excluirObjetoManual(mapa, objetoId) {
  const objetos = (mapa.objetos || []).filter(({ id }) => id !== objetoId);
  const luzes = (mapa.luzes || []).filter(({ objetoOrigemId }) => objetoOrigemId !== objetoId);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, objetos, luzes, resumoObjetos: resumirObjetos(objetos), resumoIluminacao: resumirLuzes(mapa, luzes), validacaoTematica: null }),
    selecao: null,
    descricao: `${objetoId} excluído`,
  };
}

export function regenerarIluminacaoEditor(mapa, salaId = null) {
  const atualizado = gerarIluminacaoTematica(mapa, salaId);
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizado),
    selecao: salaId ? { tipo: "sala", id: salaId } : null,
    descricao: salaId ? `Iluminação de ${salaId} regenerada` : "Iluminação do mapa regenerada",
  };
}

export function limparLuzesSala(mapa, salaId) {
  const luzes = (mapa.luzes || []).filter((luz) => luz.salaId !== salaId);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, luzes, resumoIluminacao: resumirLuzes(mapa, luzes), validacaoTematica: null }),
    selecao: { tipo: "sala", id: salaId },
    descricao: `Luzes de ${salaId} removidas`,
  };
}

export function criarLuzManual(mapa, tipoId, ponto) {
  const catalogo = obterLuzHospital(tipoId);
  if (!catalogo || ponto.x < 0 || ponto.y < 0 || ponto.x >= mapa.largura || ponto.y >= mapa.altura) return { sucesso: false, erro: "Posição ou tipo de luz inválido." };
  const sala = mapa.salas.find((item) => ponto.x >= item.x && ponto.x < item.x + item.largura && ponto.y >= item.y && ponto.y < item.y + item.altura);
  const luz = {
    id: proximoManual(mapa.luzes || [], "luz-manual"),
    tipo: catalogo.id,
    nome: catalogo.nome,
    x: Math.round(ponto.x),
    y: Math.round(ponto.y),
    salaId: sala?.id || null,
    corredorId: null,
    alcance: catalogo.alcance,
    intensidade: catalogo.intensidade,
    ativa: true,
    piscando: false,
    bloqueadaPorParedes: true,
    tema: mapa.tema,
    origem: "manual",
    objetoOrigemId: null,
    cor: catalogo.cor,
  };
  const luzes = [...(mapa.luzes || []), luz];
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, luzes, resumoIluminacao: resumirLuzes(mapa, luzes), validacaoTematica: null }),
    selecao: { tipo: "luz", id: luz.id },
    descricao: `${catalogo.nome} criada`,
  };
}

export function alterarLuzManual(mapa, luzId, alteracoes) {
  const atual = (mapa.luzes || []).find(({ id }) => id === luzId);
  if (!atual) return { sucesso: false, erro: "Luz não encontrada." };
  const catalogo = alteracoes.tipo ? obterLuzHospital(alteracoes.tipo) : null;
  if (alteracoes.tipo && !catalogo) return { sucesso: false, erro: "Tipo de luz inválido." };
  const proxima = {
    ...atual,
    ...alteracoes,
    nome: alteracoes.nome ?? catalogo?.nome ?? atual.nome,
    cor: catalogo?.cor ?? atual.cor,
    x: Math.round(alteracoes.x ?? atual.x),
    y: Math.round(alteracoes.y ?? atual.y),
    alcance: Math.max(1, Math.min(20, Number(alteracoes.alcance ?? atual.alcance))),
    intensidade: Math.max(0, Math.min(1, Number(alteracoes.intensidade ?? atual.intensidade))),
  };
  if (proxima.x < 0 || proxima.y < 0 || proxima.x >= mapa.largura || proxima.y >= mapa.altura) return { sucesso: false, erro: "A luz precisa permanecer dentro do mapa." };
  const sala = mapa.salas.find((item) => proxima.x >= item.x && proxima.x < item.x + item.largura && proxima.y >= item.y && proxima.y < item.y + item.altura);
  proxima.salaId = sala?.id || null;
  const luzes = mapa.luzes.map((luz) => luz.id === luzId ? proxima : luz);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, luzes, resumoIluminacao: resumirLuzes(mapa, luzes), validacaoTematica: null }),
    selecao: { tipo: "luz", id: luzId },
    descricao: `${luzId} alterada`,
  };
}

export function excluirLuzManual(mapa, luzId) {
  const luzes = (mapa.luzes || []).filter(({ id }) => id !== luzId);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, luzes, resumoIluminacao: resumirLuzes(mapa, luzes), validacaoTematica: null }),
    selecao: null,
    descricao: `${luzId} excluída`,
  };
}

export function validarTematicaEditor(mapa) {
  const validacaoTematica = validarMapaTematico(mapa);
  return { ...mapa, validacaoTematica };
}

export function corrigirTematicaEditor(mapa) {
  const corrigido = corrigirMapaTematico(mapa);
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...corrigido.mapa, validacaoTematica: corrigido.validacao }),
    selecao: null,
    descricao: "Correções temáticas seguras aplicadas",
  };
}

export { TIPOS_SALA_HOSPITAL };
