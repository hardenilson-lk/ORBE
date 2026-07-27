function criarHashString(texto) {
  let hash = 2166136261;

  for (let indice = 0; indice < texto.length; indice += 1) {
    hash ^= texto.charCodeAt(indice);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function criarGeradorAleatorio(seed) {
  let estado = criarHashString(String(seed ?? ""));

  return function proximoNumero() {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let resultado = estado;
    resultado = Math.imul(resultado ^ (resultado >>> 15), resultado | 1);
    resultado ^= resultado + Math.imul(resultado ^ (resultado >>> 7), resultado | 61);
    return ((resultado ^ (resultado >>> 14)) >>> 0) / 4294967296;
  };
}

export function sortearInteiro(aleatorio, minimo, maximo) {
  if (maximo <= minimo) return minimo;
  return minimo + Math.floor(aleatorio() * (maximo - minimo + 1));
}
