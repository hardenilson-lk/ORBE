import { useState } from "react";

function pontoDoEvento(evento, largura, altura) {
  const area = evento.currentTarget.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(largura, ((evento.clientX - area.left) / Math.max(1, area.width)) * largura)),
    y: Math.max(0, Math.min(altura, ((evento.clientY - area.top) / Math.max(1, area.height)) * altura)),
  };
}

function AcaoEstrutura({ x, y, simbolo, titulo, desabilitada = false, aoAtivar }) {
  return (
    <g
      className={`camada-estruturas-mapa__acao${desabilitada ? " camada-estruturas-mapa__acao--desabilitada" : ""}`}
      role="button"
      tabIndex={desabilitada ? -1 : 0}
      aria-label={titulo}
      transform={`translate(${x} ${y})`}
      onPointerDown={(evento) => evento.stopPropagation()}
      onClick={(evento) => {
        evento.preventDefault();
        evento.stopPropagation();
        if (!desabilitada) aoAtivar();
      }}
      onKeyDown={(evento) => {
        if (!desabilitada && (evento.key === "Enter" || evento.key === " ")) {
          evento.preventDefault();
          aoAtivar();
        }
      }}
    >
      <title>{titulo}</title>
      <circle r="13" />
      <text textAnchor="middle" dominantBaseline="central">{simbolo}</text>
    </g>
  );
}

function EstruturaInterativa({ estrutura, papelAtual, aoAlternarAbertura, aoAlternarTranca }) {
  const tipo = estrutura.tipoEstrutura === "janela" ? "janela" : "porta";
  const meioX = (estrutura.inicio.x + estrutura.fim.x) / 2;
  const meioY = (estrutura.inicio.y + estrutura.fim.y) / 2;
  const classe = [
    "camada-estruturas-mapa__estrutura",
    `camada-estruturas-mapa__${tipo}`,
    estrutura.aberta ? "camada-estruturas-mapa__estrutura--aberta" : "",
    estrutura.trancada ? "camada-estruturas-mapa__estrutura--trancada" : "",
  ].filter(Boolean).join(" ");
  const tituloAbertura = estrutura.trancada && papelAtual !== "mestre"
    ? "Trancada pelo mestre"
    : estrutura.aberta ? `Fechar ${tipo}` : `Abrir ${tipo}`;

  return (
    <g className={classe}>
      <line
        className="camada-estruturas-mapa__alvo"
        x1={estrutura.inicio.x} y1={estrutura.inicio.y}
        x2={estrutura.fim.x} y2={estrutura.fim.y}
        onPointerDown={(evento) => evento.stopPropagation()}
        onDoubleClick={(evento) => {
          evento.preventDefault();
          evento.stopPropagation();
          aoAlternarAbertura(estrutura);
        }}
      />
      <line
        className="camada-estruturas-mapa__traco"
        x1={estrutura.inicio.x} y1={estrutura.inicio.y}
        x2={estrutura.fim.x} y2={estrutura.fim.y}
      />
      <g className="camada-estruturas-mapa__controles">
        <AcaoEstrutura
          x={meioX - (papelAtual === "mestre" && tipo === "porta" ? 15 : 0)}
          y={meioY - 22}
          simbolo={estrutura.aberta ? "×" : tipo === "janela" ? "▤" : "↗"}
          titulo={tituloAbertura}
          desabilitada={estrutura.trancada && papelAtual !== "mestre"}
          aoAtivar={() => aoAlternarAbertura(estrutura)}
        />
        {papelAtual === "mestre" && tipo === "porta" ? (
          <AcaoEstrutura
            x={meioX + 15}
            y={meioY - 22}
            simbolo={estrutura.trancada ? "●" : "○"}
            titulo={estrutura.trancada ? "Destrancar porta" : "Trancar porta"}
            aoAtivar={() => aoAlternarTranca(estrutura)}
          />
        ) : estrutura.trancada ? (
          <g className="camada-estruturas-mapa__cadeado" transform={`translate(${meioX + 15} ${meioY - 22})`}>
            <circle r="11" /><text textAnchor="middle" dominantBaseline="central">●</text>
          </g>
        ) : null}
      </g>
    </g>
  );
}

function CamadaEstruturasMapa({ ativa, largura, altura, paredes, portas, papelAtual, aoCriar, aoAlternarAbertura, aoAlternarTranca }) {
  const [rascunho, setRascunho] = useState(null);
  const estruturasVisiveis = portas.filter((estrutura) => papelAtual === "mestre" || !estrutura.oculta);
  return (
    <svg
      className={ativa ? "camada-estruturas-mapa camada-estruturas-mapa--ativa" : "camada-estruturas-mapa"}
      viewBox={`0 0 ${largura} ${altura}`}
      aria-label="Paredes, portas e janelas do mapa"
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
      {papelAtual === "mestre" ? paredes.map((parede) => (
        <line className="camada-estruturas-mapa__parede" key={parede.id} x1={parede.inicio.x} y1={parede.inicio.y} x2={parede.fim.x} y2={parede.fim.y} />
      )) : null}
      {estruturasVisiveis.map((estrutura) => (
        <EstruturaInterativa
          key={estrutura.id}
          estrutura={estrutura}
          papelAtual={papelAtual}
          aoAlternarAbertura={aoAlternarAbertura}
          aoAlternarTranca={aoAlternarTranca}
        />
      ))}
      {rascunho ? <line className="camada-estruturas-mapa__rascunho" x1={rascunho.inicio.x} y1={rascunho.inicio.y} x2={rascunho.fim.x} y2={rascunho.fim.y} /> : null}
    </svg>
  );
}

export default CamadaEstruturasMapa;
