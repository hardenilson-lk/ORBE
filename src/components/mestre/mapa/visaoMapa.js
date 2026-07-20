function intersecaoRaioSegmento(origem, angulo, segmento) {
  const dx = Math.cos(angulo);
  const dy = Math.sin(angulo);
  const sx = segmento.fim.x - segmento.inicio.x;
  const sy = segmento.fim.y - segmento.inicio.y;
  const divisor = dx * sy - dy * sx;
  if (Math.abs(divisor) < 0.00001) return null;
  const ox = segmento.inicio.x - origem.x;
  const oy = segmento.inicio.y - origem.y;
  const t = (ox * sy - oy * sx) / divisor;
  const u = (ox * dy - oy * dx) / divisor;
  return t >= 0 && u >= 0 && u <= 1 ? t : null;
}

export function calcularPoligonoVisao(origem, raio, barreiras = [], passos = 128, configuracao = {}) {
  const circuloCompleto = Math.PI * 2;
  const anguloCentral = Number(configuracao.angulo);
  const amplitudeConfigurada = Number(configuracao.amplitude);
  const amplitude = Number.isFinite(amplitudeConfigurada)
    ? Math.min(circuloCompleto, Math.max(Math.PI / 12, amplitudeConfigurada))
    : circuloCompleto;
  const direcional = Number.isFinite(anguloCentral) && amplitude < circuloCompleto - 0.001;
  const quantidade = direcional ? Math.max(18, Math.round(passos * (amplitude / circuloCompleto))) : passos;
  const anguloInicial = direcional ? anguloCentral - amplitude / 2 : 0;
  const pontos = Array.from({ length: direcional ? quantidade + 1 : quantidade }, (_, indice) => {
    const angulo = anguloInicial + (indice / quantidade) * amplitude;
    const limite = barreiras.reduce((menor, segmento) => {
      const distancia = intersecaoRaioSegmento(origem, angulo, segmento);
      return distancia == null ? menor : Math.min(menor, distancia);
    }, raio);
    return { x: origem.x + Math.cos(angulo) * limite, y: origem.y + Math.sin(angulo) * limite };
  });
  return direcional ? [origem, ...pontos] : pontos;
}
