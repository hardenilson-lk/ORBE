import { criarGeradorAleatorio } from "../utils/geradorAleatorioSeed.js";
import {
  obterCatalogoTematicoMapa,
  obterLuzDoTema,
} from "../temas/catalogoTematicoMapa.js";

const configuracaoNivel = {
  clara: { quantidade: 2, ativa: .9, alcance: 1.25, corredor: 5 },
  media: { quantidade: 1.5, ativa: .75, alcance: 1, corredor: 7 },
  baixa: { quantidade: 1, ativa: .5, alcance: .8, corredor: 9 },
  escura: { quantidade: .5, ativa: .35, alcance: .65, corredor: 14 },
  apagada: { quantidade: .25, ativa: 0, alcance: .5, corredor: 99 },
};

function criarLuz(catalogo, dados, tema) {
  return {
    id: dados.id,
    tipo: catalogo.id,
    nome: catalogo.nome,
    x: Math.round(dados.x),
    y: Math.round(dados.y),
    salaId: dados.salaId || null,
    corredorId: dados.corredorId || null,
    alcance: Math.max(1, Math.min(20, Math.round(catalogo.alcance * dados.alcance))),
    intensidade: Math.max(0, Math.min(1, catalogo.intensidade * dados.alcance)),
    ativa: dados.ativa,
    piscando: dados.piscando || false,
    bloqueadaPorParedes: true,
    tema,
    origem: dados.origem || "gerada",
    objetoOrigemId: dados.objetoOrigemId || null,
    cor: catalogo.cor,
  };
}

export function gerarLuzesDaSala(mapa, sala, luzes, nivel, aleatorio) {
  const catalogoTema = obterCatalogoTematicoMapa(mapa.tema);
  const perfil = catalogoTema.perfisLuz[sala.tipoTematico] || catalogoTema.perfisLuz.padrao;
  const quantidade = Math.max(1, Math.round((sala.largura * sala.altura) / 28 * nivel.quantidade));
  for (let indice = 0; indice < quantidade; indice += 1) {
    const tipoId = perfil[indice % perfil.length];
    const catalogo = obterLuzDoTema(mapa.tema, tipoId);
    if (!catalogo) continue;
    const deslocamento = indice - (quantidade - 1) / 2;
    const x = Math.max(sala.x, Math.min(sala.x + sala.largura - 1, Math.floor(sala.centroX + deslocamento * 2)));
    const y = Math.max(sala.y, Math.min(sala.y + sala.altura - 1, Math.floor(sala.centroY)));
    const especial = tipoId === "ritualistica" || tipoId === "emergencia";
    luzes.push(criarLuz(catalogo, {
      id: `luz-${sala.id}-${indice + 1}`,
      x,
      y,
      salaId: sala.id,
      alcance: nivel.alcance,
      ativa: especial || aleatorio() < nivel.ativa,
      piscando: tipoId === "fluorescente" && aleatorio() < .25,
    }, mapa.tema));
  }
}

export function gerarIluminacaoTematica(mapa, salaId = null) {
  const nivelId = mapa.configuracoes.iluminacao || "baixa";
  const nivel = configuracaoNivel[nivelId] || configuracaoNivel.baixa;
  const aleatorio = criarGeradorAleatorio(`${mapa.seed}-ILUMINACAO${salaId ? `-${salaId}` : ""}-${nivelId}`);
  const luzes = salaId ? (mapa.luzes || []).filter((luz) => luz.salaId !== salaId) : [];
  const salas = salaId ? mapa.salas.filter(({ id }) => id === salaId) : mapa.salas;
  salas.forEach((sala) => gerarLuzesDaSala(mapa, sala, luzes, nivel, aleatorio));

  if (!salaId && nivelId !== "apagada") {
    mapa.corredores.forEach((corredor) => {
      const intervalo = nivel.corredor;
      corredor.celulas.filter((_, indice) => indice % intervalo === Math.floor(intervalo / 2)).forEach((celula, indice) => {
        const tipoCorredor = obterLuzDoTema(mapa.tema, "fluorescente")
          || obterLuzDoTema(mapa.tema, "luz-teto");
        if (!tipoCorredor) return;
        luzes.push(criarLuz(tipoCorredor, {
          id: `luz-${corredor.id}-${indice + 1}`,
          x: celula.x,
          y: celula.y,
          corredorId: corredor.id,
          alcance: nivel.alcance,
          ativa: aleatorio() < nivel.ativa,
          piscando: aleatorio() < .15,
        }, mapa.tema));
      });
    });
  }

  const idsObjetosJaVinculados = new Set(luzes.map(({ objetoOrigemId }) => objetoOrigemId).filter(Boolean));
  (mapa.objetos || []).filter(({ id, salaId: objetoSala }) => (
    !idsObjetosJaVinculados.has(id) && (!salaId || objetoSala === salaId)
  )).forEach((objeto) => {
    const tipoLuzDesejado = {
      gerador: "gerador",
      "painel-eletrico": "painel-eletrico",
      "computador-antigo": "monitor",
      "monitor-medico": "monitor",
      "equipamento-cirurgico": "luz-cirurgica",
      luminaria: "luz-teto",
      computador: "painel-eletrico",
    }[objeto.tipo];
    if (!tipoLuzDesejado) return;
    const catalogo = obterLuzDoTema(mapa.tema, tipoLuzDesejado);
    if (!catalogo) return;
    luzes.push(criarLuz(catalogo, {
      id: `luz-objeto-${objeto.id}`,
      x: objeto.x,
      y: objeto.y,
      salaId: objeto.salaId,
      alcance: nivel.alcance,
      ativa: nivelId !== "apagada",
      objetoOrigemId: objeto.id,
    }, mapa.tema));
  });

  return {
    ...mapa,
    luzes,
    iluminacaoTematicaDesatualizada: false,
    validacaoTematica: null,
    resumoIluminacao: {
      total: luzes.length,
      ativas: luzes.filter(({ ativa }) => ativa).length,
      inativas: luzes.filter(({ ativa }) => !ativa).length,
      salasSemIluminacao: mapa.salas.filter((sala) => !luzes.some((luz) => luz.salaId === sala.id && luz.ativa)).length,
    },
  };
}
