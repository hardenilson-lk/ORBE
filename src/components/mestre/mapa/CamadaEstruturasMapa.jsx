import { useState } from "react";

function pontoDoEvento(evento, largura, altura) {
  const area = evento.currentTarget.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(largura, ((evento.clientX - area.left) / Math.max(1, area.width)) * largura)),
    y: Math.max(0, Math.min(altura, ((evento.clientY - area.top) / Math.max(1, area.height)) * altura)),
  };
}

function CamadaEstruturasMapa({ ativa, largura, altura, paredes, portas, papelAtual, aoCriar }) {
  const [rascunho, setRascunho] = useState(null);
  return (
    <svg
      className={ativa ? "camada-estruturas-mapa camada-estruturas-mapa--ativa" : "camada-estruturas-mapa"}
      viewBox={`0 0 ${largura} ${altura}`}
      aria-label="Paredes e portas do mapa"
      onPointerDown={(evento) => {
        if (!ativa || evento.button !== 0) return;
        evento.preventDefault(); evento.stopPropagation();
        evento.currentTarget.setPointerCapture(evento.pointerId);
        const ponto = pontoDoEvento(evento, largura, altura);
        setRascunho({ inicio: ponto, fim: ponto });
      }}
      onPointerMove={(evento) => {
        if (!rascunho) return;
        evento.preventDefault(); evento.stopPropagation();
        const fim = pontoDoEvento(evento, largura, altura);
        setRascunho((anterior) => ({ ...anterior, fim }));
      }}
      onPointerUp={(evento) => {
        if (!rascunho) return;
        evento.preventDefault(); evento.stopPropagation();
        const fim = pontoDoEvento(evento, largura, altura);
        aoCriar(rascunho.inicio, fim);
        setRascunho(null);
      }}
      onPointerCancel={() => setRascunho(null)}
    >
      {paredes.filter((item) => papelAtual === "mestre" || !item.oculta).map((parede) => (
        <line className="camada-estruturas-mapa__parede" key={parede.id} x1={parede.inicio.x} y1={parede.inicio.y} x2={parede.fim.x} y2={parede.fim.y} />
      ))}
      {portas.filter((item) => papelAtual === "mestre" || !item.oculta).map((porta) => (
        <g key={porta.id} className={porta.aberta ? "camada-estruturas-mapa__porta camada-estruturas-mapa__porta--aberta" : "camada-estruturas-mapa__porta"}>
          <line x1={porta.inicio.x} y1={porta.inicio.y} x2={porta.fim.x} y2={porta.fim.y} />
        </g>
      ))}
      {rascunho ? <line className="camada-estruturas-mapa__rascunho" x1={rascunho.inicio.x} y1={rascunho.inicio.y} x2={rascunho.fim.x} y2={rascunho.fim.y} /> : null}
    </svg>
  );
}

export default CamadaEstruturasMapa;
