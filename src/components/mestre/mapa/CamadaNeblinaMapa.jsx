import { useState } from "react";

function pontoDoEvento(evento, largura, altura) {
  const area = evento.currentTarget.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(largura, ((evento.clientX - area.left) / Math.max(1, area.width)) * largura)),
    y: Math.max(0, Math.min(altura, ((evento.clientY - area.top) / Math.max(1, area.height)) * altura)),
  };
}

function FormaRevelada({ area, classe = "" }) {
  if (area.tipo === "circulo") {
    const raio = Math.hypot(area.fim.x - area.inicio.x, area.fim.y - area.inicio.y);
    return <circle className={classe} cx={area.inicio.x} cy={area.inicio.y} r={raio} />;
  }
  if (area.tipo === "livre") {
    return <polyline className={classe} points={(area.pontos || []).map((ponto) => `${ponto.x},${ponto.y}`).join(" ")} />;
  }
  const x = Math.min(area.inicio.x, area.fim.x);
  const y = Math.min(area.inicio.y, area.fim.y);
  return <rect className={classe} x={x} y={y} width={Math.abs(area.fim.x - area.inicio.x)} height={Math.abs(area.fim.y - area.inicio.y)} />;
}

function CamadaNeblinaMapa({ ativa, ferramenta, largura, altura, neblina, papelAtual, aoAdicionar }) {
  const [rascunho, setRascunho] = useState(null);
  const editando = ativa && Boolean(ferramenta) && papelAtual === "mestre";
  const areas = neblina.areasReveladas || [];
  const opacidade = papelAtual === "mestre" && !neblina.previsualizarJogador ? Math.min(0.48, neblina.opacidade) : neblina.opacidade;
  return (
    <svg
      className={editando ? "camada-neblina-mapa camada-neblina-mapa--ativa" : "camada-neblina-mapa"}
      viewBox={`0 0 ${largura} ${altura}`}
      aria-label="Neblina de guerra do mapa"
      onPointerDown={(evento) => {
        if (!editando || evento.button !== 0) return;
        evento.preventDefault(); evento.stopPropagation(); evento.currentTarget.setPointerCapture(evento.pointerId);
        const ponto = pontoDoEvento(evento, largura, altura);
        setRascunho({ tipo: ferramenta, inicio: ponto, fim: ponto, pontos: [ponto] });
      }}
      onPointerMove={(evento) => {
        if (!rascunho) return;
        const ponto = pontoDoEvento(evento, largura, altura);
        setRascunho((anterior) => ({ ...anterior, fim: ponto, pontos: anterior.tipo === "livre" ? [...anterior.pontos, ponto] : anterior.pontos }));
      }}
      onPointerUp={(evento) => {
        if (!rascunho) return;
        const fim = pontoDoEvento(evento, largura, altura);
        aoAdicionar({ ...rascunho, fim, pontos: rascunho.tipo === "livre" ? [...rascunho.pontos, fim] : rascunho.pontos });
        setRascunho(null);
      }}
      onPointerCancel={() => setRascunho(null)}
    >
      <defs>
        <mask id="mascara-neblina-orbe">
          <rect width={largura} height={altura} fill="white" />
          {areas.map((area) => <FormaRevelada key={area.id} area={area} classe="camada-neblina-mapa__recorte" />)}
        </mask>
      </defs>
      <rect className="camada-neblina-mapa__escuro" width={largura} height={altura} opacity={opacidade} mask="url(#mascara-neblina-orbe)" />
      {papelAtual === "mestre" ? areas.map((area) => <FormaRevelada key={`contorno-${area.id}`} area={area} classe="camada-neblina-mapa__contorno" />) : null}
      {rascunho ? <FormaRevelada area={rascunho} classe="camada-neblina-mapa__rascunho" /> : null}
    </svg>
  );
}

export default CamadaNeblinaMapa;
