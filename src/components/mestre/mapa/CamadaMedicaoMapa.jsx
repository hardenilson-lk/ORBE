function obterPonto(evento, largura, altura) {
  const retangulo = evento.currentTarget.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(largura, ((evento.clientX - retangulo.left) / Math.max(1, retangulo.width)) * largura)),
    y: Math.max(0, Math.min(altura, ((evento.clientY - retangulo.top) / Math.max(1, retangulo.height)) * altura)),
  };
}

function CamadaMedicaoMapa({ ativa, largura, altura, medicao, texto, aoIniciar, aoMover, aoFinalizar }) {
  return (
    <svg
      className={ativa ? "camada-medicao-mapa camada-medicao-mapa--ativa" : "camada-medicao-mapa"}
      viewBox={`0 0 ${largura} ${altura}`}
      aria-label="Régua do mapa"
      onPointerDown={(evento) => {
        if (!ativa || evento.button !== 0) return;
        evento.preventDefault();
        evento.stopPropagation();
        evento.currentTarget.setPointerCapture(evento.pointerId);
        aoIniciar(obterPonto(evento, largura, altura));
      }}
      onPointerMove={(evento) => {
        if (!ativa || !medicao?.medindo) return;
        evento.preventDefault();
        evento.stopPropagation();
        aoMover(obterPonto(evento, largura, altura));
      }}
      onPointerUp={(evento) => {
        if (!ativa || !medicao?.medindo) return;
        evento.preventDefault();
        evento.stopPropagation();
        aoFinalizar(obterPonto(evento, largura, altura));
      }}
      onPointerCancel={() => medicao?.medindo && aoFinalizar(medicao.fim)}
    >
      {medicao ? (
        <g>
          <line className="camada-medicao-mapa__sombra" x1={medicao.inicio.x} y1={medicao.inicio.y} x2={medicao.fim.x} y2={medicao.fim.y} />
          <line className="camada-medicao-mapa__linha" x1={medicao.inicio.x} y1={medicao.inicio.y} x2={medicao.fim.x} y2={medicao.fim.y} />
          <circle className="camada-medicao-mapa__ponto" cx={medicao.inicio.x} cy={medicao.inicio.y} r="6" />
          <circle className="camada-medicao-mapa__ponto" cx={medicao.fim.x} cy={medicao.fim.y} r="6" />
          <g transform={`translate(${(medicao.inicio.x + medicao.fim.x) / 2}, ${(medicao.inicio.y + medicao.fim.y) / 2 - 14})`}>
            <rect className="camada-medicao-mapa__etiqueta" x="-70" y="-14" width="140" height="28" rx="4" />
            <text className="camada-medicao-mapa__texto" textAnchor="middle" dominantBaseline="middle">{texto}</text>
          </g>
        </g>
      ) : null}
    </svg>
  );
}

export default CamadaMedicaoMapa;
