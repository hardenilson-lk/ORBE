import { useId, useRef } from "react";

import "./MiniMapaNavegacao.css";

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function FormaNeblinaMiniatura({ area, preenchimento }) {
  if (area.tipo === "circulo") {
    const raio = Math.hypot(area.fim.x - area.inicio.x, area.fim.y - area.inicio.y);
    return <circle cx={area.inicio.x} cy={area.inicio.y} r={raio} fill={preenchimento} />;
  }
  if (area.tipo === "livre") {
    return <polyline points={(area.pontos || []).map((ponto) => `${ponto.x},${ponto.y}`).join(" ")} fill="none" stroke={preenchimento} strokeWidth="40" />;
  }
  const x = Math.min(area.inicio.x, area.fim.x);
  const y = Math.min(area.inicio.y, area.fim.y);
  return <rect x={x} y={y} width={Math.abs(area.fim.x - area.inicio.x)} height={Math.abs(area.fim.y - area.inicio.y)} fill={preenchimento} />;
}

function MiniMapaNavegacao({
  larguraMundo,
  alturaMundo,
  larguraViewport,
  alturaViewport,
  margemHorizontal = 0,
  margemVertical = 0,
  tamanhoCelula = 64,
  grid,
  camera,
  limitesCamera = null,
  fundos = [],
  arquitetura = null,
  tokens = [],
  paredes = [],
  portas = [],
  luzes = [],
  neblina = null,
  aoNavegar,
  aoAlterarZoom,
}) {
  const svgRef = useRef(null);
  const arrastandoRef = useRef(false);
  const idRecorte = `mini-mapa-${useId().replaceAll(":", "")}`;
  const idGrid = `${idRecorte}-grid`;
  const idGridPrincipal = `${idRecorte}-grid-principal`;
  const idMascaraNeblina = `${idRecorte}-neblina`;
  const zoom = Math.max(0.01, Number(camera?.zoom) || 1);
  const larguraRolagem = Math.max(0, Number(limitesCamera?.larguraRolagem) || 0);
  const alturaRolagem = Math.max(0, Number(limitesCamera?.alturaRolagem) || 0);
  const larguraCliente = Math.max(0, Number(limitesCamera?.larguraCliente) || larguraViewport);
  const alturaCliente = Math.max(0, Number(limitesCamera?.alturaCliente) || alturaViewport);
  const rolagemMaximaX = Math.max(0, larguraRolagem - larguraCliente);
  const rolagemMaximaY = Math.max(0, alturaRolagem - alturaCliente);
  const usaLimitesReaisX = larguraRolagem > 0 && larguraCliente > 0;
  const usaLimitesReaisY = alturaRolagem > 0 && alturaCliente > 0;
  const larguraVisivel = usaLimitesReaisX
    ? larguraMundo * Math.min(1, larguraCliente / larguraRolagem)
    : Math.min(larguraMundo, larguraViewport / zoom);
  const alturaVisivel = usaLimitesReaisY
    ? alturaMundo * Math.min(1, alturaCliente / alturaRolagem)
    : Math.min(alturaMundo, alturaViewport / zoom);
  const cameraX = usaLimitesReaisX
    ? (larguraMundo - larguraVisivel) * limitar((Number(camera?.x) || 0) / Math.max(1, rolagemMaximaX), 0, 1)
    : limitar(
        ((Number(camera?.x) || 0) - margemHorizontal) / zoom,
        0,
        Math.max(0, larguraMundo - larguraVisivel),
      );
  const cameraY = usaLimitesReaisY
    ? (alturaMundo - alturaVisivel) * limitar((Number(camera?.y) || 0) / Math.max(1, rolagemMaximaY), 0, 1)
    : limitar(
        ((Number(camera?.y) || 0) - margemVertical) / zoom,
        0,
        Math.max(0, alturaMundo - alturaVisivel),
      );

  function navegarPeloPonteiro(evento) {
    const svg = svgRef.current;
    if (!svg) return;
    const retangulo = svg.getBoundingClientRect();
    const x = limitar(
      ((evento.clientX - retangulo.left) / Math.max(1, retangulo.width)) * larguraMundo,
      0,
      larguraMundo,
    );
    const y = limitar(
      ((evento.clientY - retangulo.top) / Math.max(1, retangulo.height)) * alturaMundo,
      0,
      alturaMundo,
    );
    aoNavegar?.(x, y);
  }

  function iniciarNavegacao(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    arrastandoRef.current = true;
    evento.currentTarget.setPointerCapture?.(evento.pointerId);
    navegarPeloPonteiro(evento);
  }

  function moverNavegacao(evento) {
    if (!arrastandoRef.current) return;
    evento.preventDefault();
    evento.stopPropagation();
    navegarPeloPonteiro(evento);
  }

  function terminarNavegacao(evento) {
    if (!arrastandoRef.current) return;
    arrastandoRef.current = false;
    evento.preventDefault();
    evento.stopPropagation();
    navegarPeloPonteiro(evento);
  }

  return (
    <aside
      className="mini-mapa-navegacao"
      aria-label="Minimapa de navegação"
      onPointerDown={(evento) => evento.stopPropagation()}
      onClick={(evento) => evento.stopPropagation()}
    >
      <header>
        <div>
          <span>Guia da câmera</span>
          <strong>Minimapa</strong>
        </div>
        <div className="mini-mapa-navegacao__zoom">
          <button type="button" aria-label="Diminuir zoom" onClick={() => aoAlterarZoom?.(zoom - 0.1)}>−</button>
          <button type="button" title="Restaurar zoom em 100%" onClick={() => aoAlterarZoom?.(1)}>{Math.round(zoom * 100)}%</button>
          <button type="button" aria-label="Aumentar zoom" onClick={() => aoAlterarZoom?.(zoom + 0.1)}>+</button>
        </div>
      </header>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${larguraMundo} ${alturaMundo}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Visão geral clicável do mapa"
        onPointerDown={iniciarNavegacao}
        onPointerMove={moverNavegacao}
        onPointerUp={terminarNavegacao}
        onPointerCancel={terminarNavegacao}
      >
        <defs>
          <clipPath id={idRecorte}>
            <rect width={larguraMundo} height={alturaMundo} />
          </clipPath>
          <pattern id={idGrid} width={tamanhoCelula} height={tamanhoCelula} patternUnits="userSpaceOnUse">
            <path d={`M ${tamanhoCelula} 0 L 0 0 0 ${tamanhoCelula}`} className="mini-mapa-navegacao__linha-grid" />
          </pattern>
          <pattern
            id={idGridPrincipal}
            width={tamanhoCelula * Math.max(1, Number(grid?.linhaGrossaCada) || 5)}
            height={tamanhoCelula * Math.max(1, Number(grid?.linhaGrossaCada) || 5)}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${tamanhoCelula * Math.max(1, Number(grid?.linhaGrossaCada) || 5)} 0 L 0 0 0 ${tamanhoCelula * Math.max(1, Number(grid?.linhaGrossaCada) || 5)}`}
              className="mini-mapa-navegacao__linha-grid-principal"
            />
          </pattern>
          <mask id={idMascaraNeblina}>
            <rect width={larguraMundo} height={alturaMundo} fill="white" />
            {(neblina?.areasReveladas || []).map((area) => (
              <FormaNeblinaMiniatura key={area.id} area={area} preenchimento="black" />
            ))}
          </mask>
        </defs>
        <g clipPath={`url(#${idRecorte})`}>
          <rect className="mini-mapa-navegacao__base" width={larguraMundo} height={alturaMundo} />
          {fundos.map((fundo) => fundo.imagem ? (
            <image
              key={fundo.id}
              href={fundo.imagem}
              x={fundo.x}
              y={fundo.y}
              width={fundo.largura}
              height={fundo.altura}
              opacity={fundo.opacidade}
              preserveAspectRatio="none"
            />
          ) : null)}
          {arquitetura ? (
            <g className="mini-mapa-navegacao__arquitetura">
              {(arquitetura.salas || []).map((sala) => (
                <rect
                  key={sala.id}
                  x={sala.x * tamanhoCelula}
                  y={sala.y * tamanhoCelula}
                  width={sala.largura * tamanhoCelula}
                  height={sala.altura * tamanhoCelula}
                  className="mini-mapa-navegacao__sala"
                />
              ))}
              {(arquitetura.corredores || []).map((celula, indice) => (
                <rect
                  key={`${celula.x}-${celula.y}-${indice}`}
                  x={celula.x * tamanhoCelula}
                  y={celula.y * tamanhoCelula}
                  width={tamanhoCelula}
                  height={tamanhoCelula}
                  className="mini-mapa-navegacao__corredor"
                />
              ))}
              {(arquitetura.paredes || []).map((parede) => (
                <line
                  key={parede.id}
                  className="mini-mapa-navegacao__parede-visual"
                  x1={(parede.inicio?.x || 0) * tamanhoCelula}
                  y1={(parede.inicio?.y || 0) * tamanhoCelula}
                  x2={(parede.fim?.x || 0) * tamanhoCelula}
                  y2={(parede.fim?.y || 0) * tamanhoCelula}
                />
              ))}
              {(arquitetura.portas || []).filter((porta) => !porta.secreta || porta.revelada).map((porta) => (
                <line
                  key={porta.id}
                  className="mini-mapa-navegacao__porta-visual"
                  x1={(porta.inicio?.x || 0) * tamanhoCelula}
                  y1={(porta.inicio?.y || 0) * tamanhoCelula}
                  x2={(porta.fim?.x || 0) * tamanhoCelula}
                  y2={(porta.fim?.y || 0) * tamanhoCelula}
                />
              ))}
            </g>
          ) : null}
          <rect width={larguraMundo} height={alturaMundo} fill={`url(#${idGrid})`} />
          {Number(grid?.linhaGrossaCada) > 0 ? (
            <rect width={larguraMundo} height={alturaMundo} fill={`url(#${idGridPrincipal})`} />
          ) : null}
          {luzes.map((luz) => (
            <circle
              className="mini-mapa-navegacao__luz"
              key={luz.id}
              cx={luz.x}
              cy={luz.y}
              r={luz.raio}
              style={{ color: luz.cor }}
              opacity={Math.max(0.1, Number(luz.intensidade) || 1)}
            />
          ))}
          {paredes.map((parede) => (
            <line
              className="mini-mapa-navegacao__parede"
              key={parede.id}
              x1={parede.inicio.x}
              y1={parede.inicio.y}
              x2={parede.fim.x}
              y2={parede.fim.y}
            />
          ))}
          {portas.map((porta) => (
            <line
              className={[
                "mini-mapa-navegacao__abertura",
                porta.tipoEstrutura === "janela" ? "mini-mapa-navegacao__abertura--janela" : "",
                porta.aberta ? "mini-mapa-navegacao__abertura--aberta" : "",
              ].filter(Boolean).join(" ")}
              key={porta.id}
              x1={porta.inicio.x}
              y1={porta.inicio.y}
              x2={porta.fim.x}
              y2={porta.fim.y}
            />
          ))}
          {tokens.map((token) => (
            <circle
              className={token.tipo === "npc" ? "mini-mapa-navegacao__token mini-mapa-navegacao__token--npc" : "mini-mapa-navegacao__token"}
              key={token.id}
              cx={token.x + ((Number(token.tamanho) || 1) * tamanhoCelula) / 2}
              cy={token.y + ((Number(token.tamanho) || 1) * tamanhoCelula) / 2}
              r={Math.max(12, Math.min(larguraMundo, alturaMundo) * 0.012)}
              opacity={token.opacidadeMiniMapa ?? 1}
            />
          ))}
          {neblina?.ativa ? (
            <rect
              className="mini-mapa-navegacao__neblina"
              width={larguraMundo}
              height={alturaMundo}
              opacity={neblina.opacidade}
              mask={`url(#${idMascaraNeblina})`}
            />
          ) : null}
          <rect
            className="mini-mapa-navegacao__visao"
            x={cameraX}
            y={cameraY}
            width={Math.max(1, larguraVisivel)}
            height={Math.max(1, alturaVisivel)}
          />
          <line className="mini-mapa-navegacao__mira" x1={cameraX + larguraVisivel / 2} y1={cameraY} x2={cameraX + larguraVisivel / 2} y2={cameraY + alturaVisivel} />
          <line className="mini-mapa-navegacao__mira" x1={cameraX} y1={cameraY + alturaVisivel / 2} x2={cameraX + larguraVisivel} y2={cameraY + alturaVisivel / 2} />
        </g>
      </svg>
      <small>Clique ou arraste para navegar</small>
    </aside>
  );
}

export default MiniMapaNavegacao;
