import { criarGeradorAleatorio } from "../utils/geradorAleatorioSeed.js";
import {
  TIPOS_OBRIGATORIOS_HOSPITAL,
  TIPOS_SALA_HOSPITAL,
  obterTipoSalaHospital,
} from "../temas/arquivos/tiposSalaHospital.js";
import {
  obterCatalogoTematicoMapa,
  obterTipoSalaDoTema,
} from "../temas/catalogoTematicoMapa.js";

const distancia = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const area = (sala) => sala.largura * sala.altura;

function acessosDaSala(mapa, salaId) {
  return mapa.corredores.filter(({ salaOrigemId, salaDestinoId }) => (
    salaOrigemId === salaId || salaDestinoId === salaId
  )).length;
}

function pontuarSala(mapa, sala, tipo, aleatorio) {
  const entrada = mapa.entrada || { x: 0, y: 0 };
  const longeEntrada = distancia({ x: sala.centroX, y: sala.centroY }, entrada);
  const borda = Math.min(sala.x, sala.y, mapa.largura - sala.x - sala.largura, mapa.altura - sala.y - sala.altura);
  const acessos = acessosDaSala(mapa, sala.id);
  let pontos = aleatorio() * 2 + Math.min(area(sala), 30) / 10;
  if (sala.largura >= tipo.min[0] && sala.altura >= tipo.min[1]) pontos += 8;
  else pontos -= 8;
  if (tipo.id === "recepcao") pontos += 18 - longeEntrada + acessos * 2;
  if (["necroterio", "sala-ritual", "area-interditada"].includes(tipo.id)) pontos += longeEntrada;
  if (tipo.id === "banheiro") pontos -= area(sala) / 3;
  if (tipo.id === "sala-maquinas") pontos += 8 - borda * 2 - acessos;
  if (sala.id === mapa.salaInicialId) pontos += tipo.inicial ? 30 : -30;
  if (sala.id === mapa.salaFinalId) pontos += tipo.final ? 30 : -30;
  if (mapa.salasSecretasIds?.includes(sala.id)) pontos += tipo.secreta ? 30 : -30;
  return pontos;
}

function atribuirMelhor(mapa, salasLivres, tipo, aleatorio) {
  const permitidas = salasLivres.filter((sala) => {
    if (sala.id === mapa.salaInicialId && !tipo.inicial) return false;
    if (sala.id === mapa.salaFinalId && !tipo.final) return false;
    if (mapa.salasSecretasIds?.includes(sala.id) && !tipo.secreta) return false;
    return true;
  });
  const candidatas = permitidas.length ? permitidas : salasLivres;
  return candidatas
    .map((sala) => ({ sala, pontos: pontuarSala(mapa, sala, tipo, aleatorio) }))
    .sort((a, b) => b.pontos - a.pontos || a.sala.id.localeCompare(b.sala.id))[0]?.sala;
}

function numerarNomes(salas, temaId) {
  const totais = salas.reduce((acc, sala) => {
    acc[sala.tipoTematico] = (acc[sala.tipoTematico] || 0) + 1;
    return acc;
  }, {});
  const contadores = {};
  return salas.map((sala) => {
    const tipo = obterTipoSalaDoTema(temaId, sala.tipoTematico);
    contadores[sala.tipoTematico] = (contadores[sala.tipoTematico] || 0) + 1;
    return {
      ...sala,
      nome: totais[sala.tipoTematico] > 1
        ? `${tipo?.nome || "Sala"} ${contadores[sala.tipoTematico]}`
        : (tipo?.nome || "Sala comum"),
      perfilObjetos: tipo?.objetos || ["comum"],
      perfilIluminacao: tipo?.luz || "media",
    };
  });
}

export function validarTiposSalaDoMapa(mapa) {
  const catalogo = obterCatalogoTematicoMapa(mapa?.tema);
  const idsConhecidos = new Set(catalogo.tiposSala.map(({ id }) => id));
  const salas = Array.isArray(mapa?.salas) ? mapa.salas : [];
  const salasSemTipo = salas
    .filter(({ tipoTematico }) => !String(tipoTematico || "").trim())
    .map(({ id }) => id);
  const tiposDesconhecidos = salas
    .filter(({ tipoTematico }) => tipoTematico && !idsConhecidos.has(tipoTematico))
    .map(({ id, tipoTematico }) => ({ salaId: id, tipoTematico }));
  const nomesAusentes = salas
    .filter(({ nome }) => !String(nome || "").trim())
    .map(({ id }) => id);
  const inicial = salas.find(({ id }) => id === mapa?.salaInicialId);
  const final = salas.find(({ id }) => id === mapa?.salaFinalId);
  const inicialValida = Boolean(inicial && idsConhecidos.has(inicial.tipoTematico));
  const finalValida = Boolean(final && idsConhecidos.has(final.tipoTematico));
  return {
    valido: salas.length > 0
      && salasSemTipo.length === 0
      && tiposDesconhecidos.length === 0
      && nomesAusentes.length === 0
      && inicialValida
      && finalValida,
    salasSemTipo,
    tiposDesconhecidos,
    nomesAusentes,
    inicialValida,
    finalValida,
    usouFallback: !catalogo.especializado,
  };
}

function distribuirTiposCatalogo(mapa) {
  const catalogo = obterCatalogoTematicoMapa(mapa.tema);
  const tipos = catalogo.tiposSala;
  const aleatorio = criarGeradorAleatorio(`${mapa.seed}-TIPOS-CATALOGO-${mapa.tema}`);
  const secretas = new Set(mapa.salasSecretasIds || []);
  const contagens = {};
  const escolher = (sala, candidatas) => {
    const dentroLimite = candidatas.filter((tipo) => (contagens[tipo.id] || 0) < (tipo.max || 99));
    const dimensionadas = dentroLimite.filter((tipo) => (
      sala.largura >= (tipo.min?.[0] || 1) && sala.altura >= (tipo.min?.[1] || 1)
    ));
    const lista = dimensionadas.length ? dimensionadas : dentroLimite.length ? dentroLimite : tipos;
    const total = lista.reduce((soma, tipo) => soma + (tipo.peso || 1), 0);
    let sorteio = aleatorio() * total;
    return lista.find((tipo) => {
      sorteio -= tipo.peso || 1;
      return sorteio <= 0;
    }) || lista[0];
  };
  const salasTipadas = mapa.salas.map((sala) => {
    let candidatas = tipos;
    if (sala.id === mapa.salaInicialId) candidatas = tipos.filter(({ inicial }) => inicial);
    else if (secretas.has(sala.id)) candidatas = tipos.filter(({ secreta }) => secreta);
    else if (sala.id === mapa.salaFinalId) candidatas = tipos.filter(({ final }) => final);
    else {
      const comuns = tipos.filter(({ secreta }) => !secreta);
      if (comuns.length) candidatas = comuns;
    }
    if (!candidatas.length) candidatas = tipos;
    const tipo = escolher(sala, candidatas);
    contagens[tipo.id] = (contagens[tipo.id] || 0) + 1;
    return { ...sala, tipoEstrutural: sala.tipoEstrutural || "comum", tipoTematico: tipo.id };
  });
  return numerarNomes(salasTipadas, mapa.tema);
}

export function distribuirTiposSalaTematicos(mapa) {
  if (mapa.tema !== "hospital-abandonado") {
    const catalogo = obterCatalogoTematicoMapa(mapa.tema);
    const usaFallback = !catalogo.especializado;
    const atualizado = {
      ...mapa,
      salas: distribuirTiposCatalogo(mapa),
      objetos: [],
      luzes: [],
      tiposSalaDistribuidos: true,
      fallbackTematico: usaFallback,
      tiposSalaComFallback: usaFallback,
      objetosDesatualizados: true,
      iluminacaoTematicaDesatualizada: true,
      validacaoTematica: null,
    };
    return { ...atualizado, validacaoTiposSala: validarTiposSalaDoMapa(atualizado) };
  }
  const aleatorio = criarGeradorAleatorio(`${mapa.seed}-TIPOS-SALA`);
  const atribuicoes = new Map();
  let livres = [...mapa.salas];

  const inicial = mapa.salas.find(({ id }) => id === mapa.salaInicialId);
  if (inicial) {
    atribuicoes.set(inicial.id, "recepcao");
    livres = livres.filter(({ id }) => id !== inicial.id);
  }
  const final = mapa.salas.find(({ id }) => id === mapa.salaFinalId);
  if (final && !atribuicoes.has(final.id)) {
    const preferencias = ["necroterio", "centro-cirurgico", "sala-maquinas", "sala-ritual", "area-interditada"];
    const tipoFinal = preferencias.map(obterTipoSalaHospital).find((tipo) => (
      final.largura >= tipo.min[0] && final.altura >= tipo.min[1]
    )) || obterTipoSalaHospital("necroterio");
    atribuicoes.set(final.id, tipoFinal.id);
    livres = livres.filter(({ id }) => id !== final.id);
  }

  const grupos = TIPOS_OBRIGATORIOS_HOSPITAL.slice(1, Math.min(TIPOS_OBRIGATORIOS_HOSPITAL.length, mapa.salas.length));
  grupos.forEach((grupo) => {
    if (!livres.length || grupo.some((id) => [...atribuicoes.values()].includes(id))) return;
    const tipos = grupo.map(obterTipoSalaHospital);
    const tipo = tipos.find((item) => livres.some((sala) => sala.largura >= item.min[0] && sala.altura >= item.min[1])) || tipos[0];
    const sala = atribuirMelhor(mapa, livres, tipo, aleatorio);
    if (sala) {
      atribuicoes.set(sala.id, tipo.id);
      livres = livres.filter(({ id }) => id !== sala.id);
    }
  });

  const contagens = [...atribuicoes.values()].reduce((acc, id) => ({ ...acc, [id]: (acc[id] || 0) + 1 }), {});
  livres.forEach((sala) => {
    const candidatas = TIPOS_SALA_HOSPITAL.filter((tipo) => (
      (contagens[tipo.id] || 0) < tipo.max
      && (sala.id !== mapa.salaInicialId || tipo.inicial)
      && (sala.id !== mapa.salaFinalId || tipo.final)
      && (!mapa.salasSecretasIds?.includes(sala.id) || tipo.secreta)
    ));
    const adequadas = candidatas.filter((tipo) => sala.largura >= tipo.min[0] && sala.altura >= tipo.min[1]);
    const lista = adequadas.length ? adequadas : [obterTipoSalaHospital("sala-comum")];
    const total = lista.reduce((soma, tipo) => soma + tipo.peso, 0);
    let sorteio = aleatorio() * total;
    const escolhido = lista.find((tipo) => {
      sorteio -= tipo.peso;
      return sorteio <= 0;
    }) || lista[lista.length - 1];
    atribuicoes.set(sala.id, escolhido.id);
    contagens[escolhido.id] = (contagens[escolhido.id] || 0) + 1;
  });

  return {
    ...mapa,
    salas: numerarNomes(mapa.salas.map((sala) => ({
      ...sala,
      tipoEstrutural: sala.tipoEstrutural || "comum",
      tipoTematico: atribuicoes.get(sala.id) || "sala-comum",
    })), mapa.tema),
    objetos: [],
    luzes: [],
    tiposSalaDistribuidos: true,
    fallbackTematico: false,
    objetosDesatualizados: true,
    iluminacaoTematicaDesatualizada: true,
    validacaoTematica: null,
    validacaoTiposSala: null,
  };
}
