import { TIPOS_OBRIGATORIOS_HOSPITAL } from "../temas/arquivos/tiposSalaHospital.js";
import {
  obterLuzDoTema,
  obterObjetoDoTema,
  obterTipoSalaDoTema,
} from "../temas/catalogoTematicoMapa.js";
import {
  celulasDoObjeto,
  validarNavegacaoComObjetos,
  validarPosicaoObjeto,
} from "./gerarObjetosTematicos.js";

const problema = (codigo, mensagem) => ({ codigo, mensagem });

export function validarMapaTematico(mapa) {
  const erros = [];
  const avisos = [];
  const idsObjetos = new Set();
  const idsLuzes = new Set();

  mapa.salas.forEach((sala) => {
    const tipo = obterTipoSalaDoTema(mapa.tema, sala.tipoTematico);
    if (!tipo) erros.push(problema("tipo-sala", `${sala.id} possui tipo temático inexistente.`));
    if (!sala.nome) erros.push(problema("nome-sala", `${sala.id} não possui nome temático.`));
    if (tipo && (sala.largura < tipo.min[0] || sala.altura < tipo.min[1])) avisos.push(problema("tamanho-sala", `${sala.nome} é menor que o recomendado para ${tipo.nome}.`));
    if (sala.id === mapa.salaInicialId && tipo && !tipo.inicial) avisos.push(problema("tipo-inicial", `${tipo.nome} não é recomendado como sala inicial.`));
    if (sala.id === mapa.salaFinalId && tipo && !tipo.final) avisos.push(problema("tipo-final", `${tipo.nome} não é recomendado como sala final.`));
  });
  if (mapa.tema === "hospital-abandonado") TIPOS_OBRIGATORIOS_HOSPITAL.forEach((grupo) => {
    if (mapa.salas.length >= 4 && !mapa.salas.some(({ tipoTematico }) => grupo.includes(tipoTematico))) {
      avisos.push(problema("tipo-recomendado", `O hospital não possui ${grupo.map((id) => obterTipoSalaDoTema(mapa.tema, id)?.nome).join(" ou ")}.`));
    }
  });

  (mapa.objetos || []).forEach((objeto) => {
    if (!objeto.id || idsObjetos.has(objeto.id)) erros.push(problema("objeto-id", `Objeto com id ausente ou duplicado: ${objeto.id || "sem id"}.`));
    idsObjetos.add(objeto.id);
    if (!obterObjetoDoTema(mapa.tema, objeto.tipo)) erros.push(problema("objeto-tipo", `${objeto.id} possui tipo inexistente.`));
    const erro = validarPosicaoObjeto(mapa, objeto, mapa.objetos, objeto.id);
    if (erro) erros.push(problema("objeto-posicao", `${objeto.id}: ${erro}`));
    if (celulasDoObjeto(objeto).some(({ x, y }) => x < 0 || y < 0 || x >= mapa.largura || y >= mapa.altura)) erros.push(problema("objeto-limites", `${objeto.id} está fora do mapa.`));
  });
  const navegacaoObjetosValida = mapa.entrada && mapa.saida ? validarNavegacaoComObjetos(mapa, mapa.objetos || []) : false;
  if (!navegacaoObjetosValida) erros.push(problema("navegacao-objetos", "A decoração bloqueia o caminho principal."));

  (mapa.luzes || []).forEach((luz) => {
    if (!luz.id || idsLuzes.has(luz.id)) erros.push(problema("luz-id", `Luz com id ausente ou duplicado: ${luz.id || "sem id"}.`));
    idsLuzes.add(luz.id);
    if (!obterLuzDoTema(mapa.tema, luz.tipo)) erros.push(problema("luz-tipo", `${luz.id} possui tipo inexistente.`));
    if (![luz.x, luz.y].every(Number.isInteger) || luz.x < 0 || luz.y < 0 || luz.x >= mapa.largura || luz.y >= mapa.altura) erros.push(problema("luz-limites", `${luz.id} possui posição inválida.`));
    if (luz.alcance < 1 || luz.alcance > 20) erros.push(problema("luz-alcance", `${luz.id} possui alcance inválido.`));
    if (luz.intensidade < 0 || luz.intensidade > 1) erros.push(problema("luz-intensidade", `${luz.id} possui intensidade inválida.`));
    if (luz.salaId && !mapa.salas.some(({ id }) => id === luz.salaId)) erros.push(problema("luz-sala", `${luz.id} referencia sala inexistente.`));
    if (luz.objetoOrigemId && !(mapa.objetos || []).some(({ id }) => id === luz.objetoOrigemId)) erros.push(problema("luz-objeto", `${luz.id} referencia objeto inexistente.`));
  });
  return {
    valido: erros.length === 0,
    erros,
    avisos,
    navegacaoObjetosValida,
    corrigiveis: [...new Set(erros.filter(({ codigo }) => ["objeto-id", "objeto-posicao", "luz-limites", "luz-alcance", "luz-intensidade", "luz-objeto"].includes(codigo)).map(({ codigo }) => codigo))],
  };
}

export function corrigirMapaTematico(mapa) {
  const ids = new Set();
  const objetos = (mapa.objetos || []).filter((objeto) => {
    if (ids.has(objeto.id) || validarPosicaoObjeto(mapa, objeto, mapa.objetos, objeto.id)) return false;
    ids.add(objeto.id);
    return true;
  });
  const luzes = (mapa.luzes || []).filter((luz, indice, lista) => (
    luz.x >= 0 && luz.y >= 0 && luz.x < mapa.largura && luz.y < mapa.altura
    && (!luz.objetoOrigemId || objetos.some(({ id }) => id === luz.objetoOrigemId))
    && lista.findIndex(({ id }) => id === luz.id) === indice
  )).map((luz) => ({
    ...luz,
    alcance: Math.max(1, Math.min(20, Math.round(luz.alcance))),
    intensidade: Math.max(0, Math.min(1, Number(luz.intensidade))),
  }));
  const corrigido = { ...mapa, objetos, luzes };
  return { mapa: corrigido, validacao: validarMapaTematico(corrigido) };
}
