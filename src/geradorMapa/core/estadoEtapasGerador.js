import {
  ETAPA_AFETADA_POR_CONFIGURACAO,
  ORDEM_ETAPAS,
} from "../data/etapasGeradorMapa.js";

export function criarEstadosIniciaisEtapas() {
  return Object.fromEntries(ORDEM_ETAPAS.map((id, indice) => [
    id,
    indice === 0 ? "disponivel" : "bloqueada",
  ]));
}

export function concluirEtapa(estados, etapaId, status = "concluida") {
  const indice = ORDEM_ETAPAS.indexOf(etapaId);
  const proximos = { ...estados, [etapaId]: status };
  const proxima = ORDEM_ETAPAS[indice + 1];
  if (proxima) proximos[proxima] = "disponivel";
  return proximos;
}

export function marcarEtapaProcessando(estados, etapaId) {
  return { ...estados, [etapaId]: "processando" };
}

export function marcarErroEtapa(estados, etapaId) {
  return { ...estados, [etapaId]: "erro" };
}

export function invalidarEtapasAPartirDe(estados, etapaId) {
  const indice = ORDEM_ETAPAS.indexOf(etapaId);
  if (indice < 0) return estados;
  const proximos = { ...estados };
  ORDEM_ETAPAS.forEach((id, posicao) => {
    if (posicao < indice) return;
    proximos[id] = posicao === indice ? "desatualizada" : "bloqueada";
  });
  return proximos;
}

export function invalidarPorConfiguracao(estados, campo) {
  const etapa = ETAPA_AFETADA_POR_CONFIGURACAO[campo];
  return etapa ? invalidarEtapasAPartirDe(estados, etapa) : estados;
}

export function estadosDoMapa(mapa) {
  const estados = criarEstadosIniciaisEtapas();
  if (!mapa?.salas?.length) return estados;
  estados.salas = "concluida";
  estados.corredores = mapa.corredores?.length ? "concluida" : "disponivel";
  if (!mapa.corredores?.length) return estados;
  estados.navegacao = mapa.entrada && mapa.saida ? "concluida" : "disponivel";
  if (!mapa.entrada || !mapa.saida) return estados;
  estados.paredes = mapa.paredes?.length ? "concluida" : "disponivel";
  if (!mapa.paredes?.length) return estados;
  estados.portas = mapa.portas?.length ? "concluida" : "disponivel";
  if (!mapa.portas?.length) return estados;
  estados.tipos = mapa.tiposSalaDistribuidos
    ? (mapa.validacaoTiposSala?.usouFallback ? "concluida-fallback" : "concluida")
    : "disponivel";
  if (!mapa.tiposSalaDistribuidos) return estados;
  estados.objetos = mapa.resumoObjetos
    ? mapa.resumoObjetos.decoracaoDesativada
      ? "ignorada"
      : mapa.resumoObjetos.fallback
        ? "concluida-fallback"
        : mapa.resumoObjetos.ignorados > 0
          ? "concluida-avisos"
          : "concluida"
    : "disponivel";
  if (!mapa.resumoObjetos) return estados;
  estados.iluminacao = mapa.resumoIluminacao ? "concluida" : "disponivel";
  if (!mapa.resumoIluminacao) return estados;
  estados.validacao = mapa.validacaoEstrutural ? "concluida" : "disponivel";
  return estados;
}
