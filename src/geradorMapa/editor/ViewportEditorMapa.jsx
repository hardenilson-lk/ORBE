import { useEffect, useRef, useState } from "react";

const TAMANHO_CELULA = 18;

function classeSelecionada(selecao, tipo, id) {
  return selecao?.tipo === tipo && selecao.id === id ? " editor-mapa__selecionado" : "";
}

function pontoNoMapa(evento, svg, vertices = false) {
  const ponto = new DOMPoint(evento.clientX, evento.clientY).matrixTransform(svg.getScreenCTM().inverse());
  return {
    x: vertices ? Math.round(ponto.x) : Math.floor(ponto.x),
    y: vertices ? Math.round(ponto.y) : Math.floor(ponto.y),
  };
}

function retanguloEntre(inicio, fim) {
  const x = Math.min(inicio.x, fim.x);
  const y = Math.min(inicio.y, fim.y);
  return {
    x,
    y,
    largura: Math.max(1, Math.abs(fim.x - inicio.x) + 1),
    altura: Math.max(1, Math.abs(fim.y - inicio.y) + 1),
  };
}

function rotaOrtogonal(inicio, fim) {
  return `${inicio.x + .5},${inicio.y + .5} ${fim.x + .5},${inicio.y + .5} ${fim.x + .5},${fim.y + .5}`;
}

function dimensoesObjeto(objeto) {
  return objeto.rotacao % 180 === 0
    ? { largura: objeto.largura, altura: objeto.altura }
    : { largura: objeto.altura, altura: objeto.largura };
}

export default function ViewportEditorMapa({
  mapa,
  camadas,
  ferramenta,
  selecao,
  zoom,
  modoVisual,
  intensidadeGrid,
  modoMestre,
  aoSelecionar,
  aoAlterarZoom,
  aoAcaoGeometrica,
  sinalAjuste,
}) {
  const viewportRef = useRef(null);
  const svgRef = useRef(null);
  const arrasteRef = useRef(null);
  const gestoRef = useRef(null);
  const [gesto, setGesto] = useState(null);

  function atualizarGesto(proximo) {
    gestoRef.current = proximo;
    setGesto(proximo);
  }

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const escala = Math.min(
      (viewport.clientWidth - 28) / (mapa.largura * TAMANHO_CELULA),
      (viewport.clientHeight - 28) / (mapa.altura * TAMANHO_CELULA),
    );
    aoAlterarZoom(Math.max(25, Math.min(300, Math.floor((escala * 100) / 25) * 25)));
    viewport.scrollTo({ left: 0, top: 0 });
  }, [mapa.altura, mapa.largura, sinalAjuste, aoAlterarZoom]);

  function selecionar(evento, tipo, id) {
    evento.stopPropagation();
    if (ferramenta === "apagar") {
      aoSelecionar({ tipo, id });
      aoAcaoGeometrica("apagar", { tipo, id });
    } else if (ferramenta === "selecionar") {
      aoSelecionar({ tipo, id });
    }
  }

  function iniciarSala(evento, sala) {
    evento.stopPropagation();
    if (ferramenta === "criar-objeto" || ferramenta === "criar-luz") {
      aoAcaoGeometrica(ferramenta, pontoNoMapa(evento, svgRef.current));
      return;
    }
    if (ferramenta === "criar-corredor" || ferramenta === "criar-parede") {
      const ponto = pontoNoMapa(evento, svgRef.current, ferramenta === "criar-parede");
      atualizarGesto({ tipo: ferramenta, inicio: ponto, atual: ponto });
      svgRef.current.setPointerCapture(evento.pointerId);
      return;
    }
    if (ferramenta !== "selecionar") {
      selecionar(evento, "sala", sala.id);
      return;
    }
    aoSelecionar({ tipo: "sala", id: sala.id });
    const ponto = pontoNoMapa(evento, svgRef.current);
    atualizarGesto({ tipo: "mover-sala", inicio: ponto, atual: ponto, sala });
    svgRef.current.setPointerCapture(evento.pointerId);
  }

  function iniciarCorredor(evento, corredor) {
    if (ferramenta === "criar-luz") {
      evento.stopPropagation();
      aoAcaoGeometrica("criar-luz", pontoNoMapa(evento, svgRef.current));
      return;
    }
    selecionar(evento, "corredor", corredor.id);
  }

  function iniciarResize(evento, sala, canto) {
    evento.stopPropagation();
    const ponto = pontoNoMapa(evento, svgRef.current, true);
    atualizarGesto({ tipo: "redimensionar-sala", inicio: ponto, atual: ponto, sala, canto });
    svgRef.current.setPointerCapture(evento.pointerId);
  }

  function iniciarItem(evento, tipo, item) {
    evento.stopPropagation();
    if (ferramenta === "apagar") return selecionar(evento, tipo, item.id);
    if (ferramenta !== "selecionar") return;
    aoSelecionar({ tipo, id: item.id });
    const ponto = pontoNoMapa(evento, svgRef.current);
    atualizarGesto({ tipo: `mover-${tipo}`, inicio: ponto, atual: ponto, item });
    svgRef.current.setPointerCapture(evento.pointerId);
  }

  function iniciarAcaoMapa(evento) {
    if (evento.target !== evento.currentTarget && evento.target.dataset.fundo !== "true") return;
    if (ferramenta === "selecionar") {
      aoSelecionar(null);
      return;
    }
    if (ferramenta === "mover") {
      const viewport = viewportRef.current;
      arrasteRef.current = {
        x: evento.clientX, y: evento.clientY,
        esquerda: viewport.scrollLeft, topo: viewport.scrollTop,
      };
      viewport.setPointerCapture(evento.pointerId);
      return;
    }
    if (["criar-sala", "criar-corredor", "criar-parede"].includes(ferramenta)) {
      const vertices = ferramenta === "criar-parede";
      const ponto = pontoNoMapa(evento, svgRef.current, vertices);
      atualizarGesto({ tipo: ferramenta, inicio: ponto, atual: ponto });
      svgRef.current.setPointerCapture(evento.pointerId);
    } else if (ferramenta === "criar-objeto" || ferramenta === "criar-luz") {
      const ponto = pontoNoMapa(evento, svgRef.current);
      aoAcaoGeometrica(ferramenta, ponto);
    }
  }

  function moverAcao(evento) {
    if (arrasteRef.current) {
      const viewport = viewportRef.current;
      viewport.scrollLeft = arrasteRef.current.esquerda - (evento.clientX - arrasteRef.current.x);
      viewport.scrollTop = arrasteRef.current.topo - (evento.clientY - arrasteRef.current.y);
    }
    if (gestoRef.current) {
      const atual = gestoRef.current;
      atualizarGesto({
        ...atual,
        atual: pontoNoMapa(
          evento,
          svgRef.current,
          atual.tipo === "criar-parede" || atual.tipo === "redimensionar-sala",
        ),
      });
    }
  }

  function finalizarAcao() {
    arrasteRef.current = null;
    const finalizado = gestoRef.current;
    if (!finalizado) return;
    if (finalizado.tipo === "criar-sala") aoAcaoGeometrica("criar-sala", retanguloEntre(finalizado.inicio, finalizado.atual));
    if (finalizado.tipo === "criar-corredor") aoAcaoGeometrica("criar-corredor", { inicio: finalizado.inicio, fim: finalizado.atual });
    if (finalizado.tipo === "criar-parede") aoAcaoGeometrica("criar-parede", { inicio: finalizado.inicio, fim: finalizado.atual });
    if (finalizado.tipo === "mover-sala") {
      if (finalizado.atual.x === finalizado.inicio.x && finalizado.atual.y === finalizado.inicio.y) {
        atualizarGesto(null);
        return;
      }
      aoAcaoGeometrica("mover-sala", {
        salaId: finalizado.sala.id,
        x: finalizado.sala.x + finalizado.atual.x - finalizado.inicio.x,
        y: finalizado.sala.y + finalizado.atual.y - finalizado.inicio.y,
      });
    }
    if (finalizado.tipo === "mover-objeto" || finalizado.tipo === "mover-luz") {
      if (finalizado.atual.x !== finalizado.inicio.x || finalizado.atual.y !== finalizado.inicio.y) {
        aoAcaoGeometrica(finalizado.tipo, {
          id: finalizado.item.id,
          x: finalizado.item.x + finalizado.atual.x - finalizado.inicio.x,
          y: finalizado.item.y + finalizado.atual.y - finalizado.inicio.y,
        });
      }
    }
    if (finalizado.tipo === "redimensionar-sala") {
      const { sala, canto, atual } = finalizado;
      const direita = sala.x + sala.largura;
      const base = sala.y + sala.altura;
      const x = canto.includes("o") ? Math.min(atual.x, direita - 3) : sala.x;
      const y = canto.startsWith("n") ? Math.min(atual.y, base - 3) : sala.y;
      const novaDireita = canto.includes("l") ? Math.max(atual.x, sala.x + 3) : direita;
      const novaBase = canto.startsWith("s") ? Math.max(atual.y, sala.y + 3) : base;
      aoAcaoGeometrica("redimensionar-sala", {
        salaId: sala.id, x, y, largura: novaDireita - x, altura: novaBase - y,
      });
    }
    atualizarGesto(null);
  }

  function clicarParede(evento, parede) {
    evento.stopPropagation();
    if (ferramenta === "criar-porta" || ferramenta === "mover-porta") {
      aoAcaoGeometrica(ferramenta, { paredeId: parede.id });
    } else selecionar(evento, "parede", parede.id);
  }

  const salaSelecionada = selecao?.tipo === "sala"
    ? mapa.salas.find(({ id }) => id === selecao.id)
    : null;
  const classeTema = modoVisual === "tematico" ? " tema-mapa--hospital-abandonado" : "";
  const opacidadeGrid = { baixa: .18, media: .35, alta: .62 }[intensidadeGrid] || .35;

  return (
    <div
      ref={viewportRef}
      className={`editor-mapa__viewport editor-mapa__viewport--${ferramenta}${classeTema}`}
      onPointerMove={moverAcao}
      onPointerUp={finalizarAcao}
      onPointerCancel={() => { arrasteRef.current = null; atualizarGesto(null); }}
      aria-label="Área de edição do mapa"
    >
      <svg
        ref={svgRef}
        className="editor-mapa__planta"
        style={{ width: mapa.largura * TAMANHO_CELULA * (zoom / 100), height: mapa.altura * TAMANHO_CELULA * (zoom / 100) }}
        viewBox={`0 0 ${mapa.largura} ${mapa.altura}`}
        onPointerDown={iniciarAcaoMapa}
      >
        <defs>
          <pattern id="grade-editor-mapa" width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M 1 0 L 0 0 0 1" className="editor-mapa__grade" style={{ opacity: opacidadeGrid }} />
          </pattern>
          <pattern id="hospital-piso-salas" width="2" height="2" patternUnits="userSpaceOnUse">
            <rect width="2" height="2" fill="#aeb9b4" />
            <path d="M0 1H2M1 0V2" stroke="#87938e" strokeWidth=".035" />
            <circle cx=".35" cy=".42" r=".09" fill="#737e79" opacity=".28" />
          </pattern>
          <pattern id="hospital-piso-corredor" width="4" height="2" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="#7f918c" />
            <path d="M0 1H4" stroke="#c3ccc8" strokeWidth=".09" opacity=".45" />
            <path d="M0 .15H4M0 1.85H4" stroke="#54645f" strokeWidth=".05" />
          </pattern>
        </defs>
        <rect data-fundo="true" width={mapa.largura} height={mapa.altura} className="editor-mapa__fundo" />
        {camadas.chao ? mapa.celulasChao.map((celula) => <rect x={celula.x} y={celula.y} width="1" height="1" className="editor-mapa__chao" key={`chao-${celula.x}-${celula.y}`} />) : null}
        {camadas.corredores ? mapa.corredores.map((corredor) => (
          <g className={`editor-mapa__corredor${classeSelecionada(selecao, "corredor", corredor.id)}`} onPointerDown={(evento) => iniciarCorredor(evento, corredor)} key={corredor.id}>
            {corredor.celulas.map((celula) => <rect x={celula.x} y={celula.y} width="1" height="1" key={`${corredor.id}-${celula.x}-${celula.y}`} />)}
          </g>
        )) : null}
        {camadas.salas ? mapa.salas.map((sala) => (
          <rect x={sala.x} y={sala.y} width={sala.largura} height={sala.altura} className={`editor-mapa__sala${classeSelecionada(selecao, "sala", sala.id)}`} onPointerDown={(evento) => iniciarSala(evento, sala)} key={sala.id} />
        )) : null}
        {camadas.grid ? <rect data-fundo="true" width={mapa.largura} height={mapa.altura} fill="url(#grade-editor-mapa)" className="editor-mapa__grade-camada" /> : null}
        {modoVisual === "tematico" && camadas.iluminacao ? <rect data-fundo="true" width={mapa.largura} height={mapa.altura} className="editor-mapa__escuridao" /> : null}
        {camadas.iluminacao && camadas.alcanceLuzes ? (mapa.luzes || []).filter(({ ativa }) => ativa).map((luz) => (
          <circle cx={luz.x + .5} cy={luz.y + .5} r={luz.alcance} className={`editor-mapa__alcance-luz editor-mapa__alcance-luz--${modoVisual}`} style={{ "--cor-luz": luz.cor, opacity: Math.max(.12, luz.intensidade * .38) }} key={`alcance-${luz.id}`} />
        )) : null}
        {camadas.iluminacao ? (mapa.luzes || []).map((luz) => (
          <g className={`editor-mapa__luz${luz.ativa ? "" : " editor-mapa__luz--inativa"}${luz.piscando ? " editor-mapa__luz--piscando" : ""}${classeSelecionada(selecao, "luz", luz.id)}`} onPointerDown={(evento) => iniciarItem(evento, "luz", luz)} key={luz.id}>
            <circle cx={luz.x + .5} cy={luz.y + .5} r=".28" style={{ fill: luz.cor }} />
            <text x={luz.x + .5} y={luz.y + .5}>✦</text>
          </g>
        )) : null}
        {camadas.objetos ? (mapa.objetos || []).map((objeto) => {
          const dimensoes = dimensoesObjeto(objeto);
          return (
            <g className={`editor-mapa__objeto editor-mapa__objeto--${objeto.categoria}${classeSelecionada(selecao, "objeto", objeto.id)}`} onPointerDown={(evento) => iniciarItem(evento, "objeto", objeto)} key={objeto.id}>
              <rect x={objeto.x + .08} y={objeto.y + .08} width={Math.max(.2, dimensoes.largura - .16)} height={Math.max(.2, dimensoes.altura - .16)} rx=".08" />
              <text x={objeto.x + dimensoes.largura / 2} y={objeto.y + dimensoes.altura / 2}>{objeto.nome.slice(0, 1)}</text>
            </g>
          );
        }) : null}
        {camadas.paredes ? mapa.paredes.map((parede) => (
          <line x1={parede.inicio.x} y1={parede.inicio.y} x2={parede.fim.x} y2={parede.fim.y} className={`editor-mapa__parede editor-mapa__parede--${parede.tipo}${classeSelecionada(selecao, "parede", parede.id)}`} onClick={(evento) => clicarParede(evento, parede)} key={parede.id} />
        )) : null}
        {camadas.marcacoes && mapa.entrada && mapa.saida ? (
          <>
            <g className={`editor-mapa__marcacao editor-mapa__marcacao--entrada${classeSelecionada(selecao, "entrada", "entrada")}`} onClick={(evento) => selecionar(evento, "entrada", "entrada")}><circle cx={mapa.entrada.x + .5} cy={mapa.entrada.y + .5} r=".45" /><text x={mapa.entrada.x + .5} y={mapa.entrada.y + .5}>E</text></g>
            <g className={`editor-mapa__marcacao editor-mapa__marcacao--saida${classeSelecionada(selecao, "saida", "saida")}`} onClick={(evento) => selecionar(evento, "saida", "saida")}><circle cx={mapa.saida.x + .5} cy={mapa.saida.y + .5} r=".45" /><text x={mapa.saida.x + .5} y={mapa.saida.y + .5}>S</text></g>
          </>
        ) : null}
        {camadas.portas ? mapa.portas.map((porta) => (
          <g className={`editor-mapa__porta editor-mapa__porta--${porta.estado}${classeSelecionada(selecao, "porta", porta.id)}`} onClick={(evento) => selecionar(evento, "porta", porta.id)} key={porta.id}>
            <line x1={porta.inicio.x} y1={porta.inicio.y} x2={porta.fim.x} y2={porta.fim.y} />
            {(porta.trancada || (porta.secreta && modoMestre)) ? <text x={(porta.inicio.x + porta.fim.x) / 2} y={(porta.inicio.y + porta.fim.y) / 2}>{porta.trancada ? "T" : "?"}</text> : null}
          </g>
        )) : null}
        {camadas.textos ? mapa.salas.map((sala, indice) => <text x={sala.centroX} y={sala.centroY} className="editor-mapa__texto" key={`texto-${sala.id}`}>{modoVisual === "tematico" ? (sala.nome || indice + 1) : (modoMestre ? indice + 1 : "")}</text>) : null}
        {salaSelecionada && ferramenta === "selecionar" ? (
          <g className="editor-mapa__alcas">
            {[["no", salaSelecionada.x, salaSelecionada.y], ["nl", salaSelecionada.x + salaSelecionada.largura, salaSelecionada.y], ["so", salaSelecionada.x, salaSelecionada.y + salaSelecionada.altura], ["sl", salaSelecionada.x + salaSelecionada.largura, salaSelecionada.y + salaSelecionada.altura]].map(([canto, x, y]) => (
              <circle key={canto} cx={x} cy={y} r=".23" onPointerDown={(evento) => iniciarResize(evento, salaSelecionada, canto)} />
            ))}
          </g>
        ) : null}
        {gesto?.tipo === "criar-sala" ? <rect {...retanguloEntre(gesto.inicio, gesto.atual)} className="editor-mapa__preview-acao" /> : null}
        {gesto?.tipo === "criar-corredor" ? <polyline points={rotaOrtogonal(gesto.inicio, gesto.atual)} className="editor-mapa__preview-linha" /> : null}
        {gesto?.tipo === "criar-parede" ? <line x1={gesto.inicio.x} y1={gesto.inicio.y} x2={gesto.atual.x} y2={gesto.atual.y} className="editor-mapa__preview-linha" /> : null}
      </svg>
    </div>
  );
}
