import {
  caminhoCruzaFormaColisao,
  obterFormaColisaoObjeto,
  normalizarObjetoCenario,
} from "./geometriaObjetosCenario.js";

export function segmentoCruzaBarreiraMapa(origem, destino, barreira) {
  const rx = destino.x - origem.x;
  const ry = destino.y - origem.y;
  const sx = barreira.fim.x - barreira.inicio.x;
  const sy = barreira.fim.y - barreira.inicio.y;
  const divisor = rx * sy - ry * sx;
  if (Math.abs(divisor) < 0.00001) return false;
  const qpx = barreira.inicio.x - origem.x;
  const qpy = barreira.inicio.y - origem.y;
  const t = (qpx * sy - qpy * sx) / divisor;
  const u = (qpx * ry - qpy * rx) / divisor;
  return t > 0.025 && t <= 1 && u >= 0 && u <= 1;
}

function caminhoCruzaObjeto(origem, destino, objeto, tamanhoCelula) {
  const forma = obterFormaColisaoObjeto(normalizarObjetoCenario(objeto));
  return caminhoCruzaFormaColisao(origem, destino, forma, tamanhoCelula / 2, Math.max(8, tamanhoCelula / 3));
}

export function avaliarMovimentoTokenMapa({
  papelAtual,
  possuiPermissao,
  token,
  origem,
  destino,
  mapa,
}) {
  if (!possuiPermissao) return { permitido: false, motivo: "sem-permissao" };
  if (token?.bloqueado) return { permitido: false, motivo: "token-bloqueado" };
  if (papelAtual === "mestre") {
    return { permitido: true, atravessouBarreira: false, modo: "mestre-livre" };
  }

  const tamanhoCelula = Math.max(1, Number(mapa?.grid?.tamanhoCelula) || 64);
  const metade = Math.max(1, Number(token?.tamanho) || 1) * tamanhoCelula / 2;
  const centroOrigem = { x: origem.x + metade, y: origem.y + metade };
  const centroDestino = { x: destino.x + metade, y: destino.y + metade };
  const larguraMundo = Math.max(1, Number(mapa?.grid?.colunas) || 1) * tamanhoCelula;
  const alturaMundo = Math.max(1, Number(mapa?.grid?.linhas) || 1) * tamanhoCelula;

  if (
    destino.x < 0
    || destino.y < 0
    || destino.x + metade * 2 > larguraMundo
    || destino.y + metade * 2 > alturaMundo
  ) {
    return { permitido: false, motivo: "limite-mapa" };
  }

  const barreiras = [
    ...(mapa?.paredes || []).filter((item) => item.bloqueiaMovimento !== false),
    ...(mapa?.portas || []).filter((item) => item.bloqueiaMovimento === true),
  ];
  if (barreiras.some((barreira) => segmentoCruzaBarreiraMapa(centroOrigem, centroDestino, barreira))) {
    return { permitido: false, motivo: "estrutura" };
  }

  const objetos = (mapa?.objetosCenario || []).filter((item) => item.bloqueiaMovimento === true);
  if (objetos.some((objeto) => caminhoCruzaObjeto(centroOrigem, centroDestino, objeto, tamanhoCelula))) {
    return { permitido: false, motivo: "objeto" };
  }

  const terrenos = (mapa?.areas || []).filter((item) => item.bloqueiaMovimento === true);
  if (terrenos.some((area) => caminhoCruzaObjeto(centroOrigem, centroDestino, area, tamanhoCelula))) {
    return { permitido: false, motivo: "terreno" };
  }

  return { permitido: true, modo: "movimento-limitado" };
}
