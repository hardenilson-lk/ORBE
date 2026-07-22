import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage, Transformer } from "react-konva";
import TokenKonvaTeste from "./TokenKonvaTeste.jsx";
import useImagemKonva from "./useImagemKonva.js";
import {
  CAMERA_KONVA_PADRAO,
  atualizarFundoCompatibilidade,
  construirTokensKonva,
  encaixarTokenNoGrid,
  lerImagemComoDataUrl,
  limitarNumero,
  normalizarFundoKonva,
  normalizarGridKonva,
} from "./mapaKonvaUtils.js";
import "./PainelMapaKonvaTeste.css";

const ZOOM_MINIMO = 0.25;
const ZOOM_MAXIMO = 3;

export default function PainelMapaKonvaTeste({
  arquivoInicial = "ARQUIVO 0001",
  mapa = {},
  fichas = [],
  aoAlterarMapa,
  aoAlterarMensagem,
}) {
  const areaRef = useRef(null);
  const stageRef = useRef(null);
  const imagemRef = useRef(null);
  const transformerRef = useRef(null);
  const arquivoRef = useRef(null);
  const mapaRef = useRef(mapa || {});
  const [tamanhoArea, setTamanhoArea] = useState({ largura: 900, altura: 560 });
  const [grid, setGrid] = useState(() => normalizarGridKonva(mapa?.grid));
  const [fundo, setFundo] = useState(() => normalizarFundoKonva(mapa, normalizarGridKonva(mapa?.grid)));
  const [camera, setCamera] = useState(CAMERA_KONVA_PADRAO);
  const [tokenSelecionadoId, setTokenSelecionadoId] = useState("");
  const [imagemSelecionada, setImagemSelecionada] = useState(false);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const imagem = useImagemKonva(fundo.imagem);

  useEffect(() => {
    mapaRef.current = mapa || {};
    const gridAtual = normalizarGridKonva(mapa?.grid);
    setGrid(gridAtual);
    setFundo(normalizarFundoKonva(mapa, gridAtual));
  }, [mapa]);

  useEffect(() => {
    if (!areaRef.current) return undefined;
    const observar = new ResizeObserver(([entrada]) => {
      setTamanhoArea({
        largura: Math.max(320, Math.floor(entrada.contentRect.width)),
        altura: Math.max(430, Math.floor(entrada.contentRect.height)),
      });
    });
    observar.observe(areaRef.current);
    return () => observar.disconnect();
  }, []);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;
    if (imagemSelecionada && !fundo.bloqueado && imagemRef.current) {
      transformer.nodes([imagemRef.current]);
    } else {
      transformer.nodes([]);
    }
    transformer.getLayer()?.batchDraw();
  }, [imagemSelecionada, fundo.bloqueado, imagem]);

  const larguraMundo = grid.colunas * grid.tamanhoCelula;
  const alturaMundo = grid.linhas * grid.tamanhoCelula;
  const tokens = useMemo(
    () => construirTokensKonva(Array.isArray(fichas) ? fichas : [], mapa?.tokens, grid),
    [fichas, mapa?.tokens, grid],
  );

  function avisar(mensagem) {
    aoAlterarMensagem?.(mensagem);
  }

  function salvarMapa(proximoMapa, mensagem) {
    mapaRef.current = proximoMapa;
    aoAlterarMapa?.(proximoMapa);
    if (mensagem) avisar(mensagem);
  }

  function atualizarGrid(campo, valor) {
    const proximoGrid = normalizarGridKonva({ ...grid, [campo]: valor });
    setGrid(proximoGrid);
    salvarMapa({
      ...mapaRef.current,
      grid: { ...(mapaRef.current.grid || {}), ...proximoGrid },
    }, "Grid do teste Konva atualizado.");
  }

  function salvarFundo(proximoFundo, mensagem = "Imagem do teste Konva atualizada.") {
    setFundo(proximoFundo);
    salvarMapa(atualizarFundoCompatibilidade(mapaRef.current, proximoFundo), mensagem);
  }

  async function carregarImagem(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    setCarregandoImagem(true);
    try {
      const origem = await lerImagemComoDataUrl(arquivo);
      const proximoFundo = {
        ...fundo,
        imagem: origem,
        nome: arquivo.name,
        x: 0,
        y: 0,
        largura: larguraMundo,
        altura: alturaMundo,
        opacidade: 1,
        bloqueado: false,
      };
      setImagemSelecionada(true);
      salvarFundo(proximoFundo, "Imagem adicionada ao teste Konva.");
    } catch (falha) {
      console.warn("Falha ao carregar imagem no teste Konva.", falha);
      avisar(falha.message);
    } finally {
      setCarregandoImagem(false);
    }
  }

  function ajustarImagemAoGrid() {
    salvarFundo({ ...fundo, x: 0, y: 0, largura: larguraMundo, altura: alturaMundo }, "Imagem ajustada ao tamanho do grid.");
  }

  function centralizarImagem() {
    salvarFundo({ ...fundo, x: (larguraMundo - fundo.largura) / 2, y: (alturaMundo - fundo.altura) / 2 }, "Imagem centralizada.");
  }

  function removerImagem() {
    setImagemSelecionada(false);
    salvarFundo({ ...fundo, imagem: "", nome: "", bloqueado: true }, "Imagem removida do teste Konva.");
  }

  function concluirTransformacaoImagem() {
    const no = imagemRef.current;
    if (!no) return;
    const largura = Math.max(40, no.width() * no.scaleX());
    const altura = Math.max(40, no.height() * no.scaleY());
    no.scaleX(1);
    no.scaleY(1);
    salvarFundo({ ...fundo, x: no.x(), y: no.y(), largura, altura }, "Imagem redimensionada no teste Konva.");
  }

  function atualizarToken(token, posicao) {
    const encaixado = encaixarTokenNoGrid(posicao, token, grid);
    const tokensAtuais = Array.isArray(mapaRef.current.tokens) ? mapaRef.current.tokens : [];
    const existe = tokensAtuais.some((item) => String(item.id) === String(token.id));
    const tokenAtualizado = { ...token, ...encaixado };
    const tokensAtualizados = existe
      ? tokensAtuais.map((item) => String(item.id) === String(token.id) ? { ...item, ...tokenAtualizado } : item)
      : [...tokensAtuais, tokenAtualizado];
    salvarMapa({ ...mapaRef.current, tokens: tokensAtualizados }, `Token movido para coluna ${encaixado.coluna + 1}, linha ${encaixado.linha + 1}.`);
  }

  function aplicarZoom(novoZoom, ponto = { x: tamanhoArea.largura / 2, y: tamanhoArea.altura / 2 }) {
    const zoom = limitarNumero(novoZoom, 1, ZOOM_MINIMO, ZOOM_MAXIMO);
    const mundoNoPonto = { x: (ponto.x - camera.x) / camera.zoom, y: (ponto.y - camera.y) / camera.zoom };
    setCamera({
      zoom,
      x: ponto.x - mundoNoPonto.x * zoom,
      y: ponto.y - mundoNoPonto.y * zoom,
    });
  }

  function controlarRoda(evento) {
    evento.evt.preventDefault();
    const ponto = stageRef.current?.getPointerPosition();
    if (!ponto) return;
    aplicarZoom(camera.zoom * (evento.evt.deltaY > 0 ? 0.9 : 1.1), ponto);
  }

  function voltarCemPorCento() {
    setCamera({ zoom: 1, x: (tamanhoArea.largura - larguraMundo) / 2, y: (tamanhoArea.altura - alturaMundo) / 2 });
  }

  function ajustarTela() {
    const zoom = limitarNumero(Math.min((tamanhoArea.largura - 32) / larguraMundo, (tamanhoArea.altura - 32) / alturaMundo), 1, ZOOM_MINIMO, ZOOM_MAXIMO);
    setCamera({ zoom, x: (tamanhoArea.largura - larguraMundo * zoom) / 2, y: (tamanhoArea.altura - alturaMundo * zoom) / 2 });
  }

  const linhasVerticais = Array.from({ length: grid.colunas + 1 }, (_, indice) => indice * grid.tamanhoCelula);
  const linhasHorizontais = Array.from({ length: grid.linhas + 1 }, (_, indice) => indice * grid.tamanhoCelula);

  return (
    <section className="mapa-konva-teste">
      <header className="mapa-konva-teste__cabecalho">
        <div><span>Prova de conceito isolada</span><h2>Mapa React Konva</h2><small>{arquivoInicial} · não substitui o mapa atual</small></div>
        <strong>TESTE</strong>
      </header>

      <div className="mapa-konva-teste__controles">
        <fieldset>
          <legend>Grid</legend>
          <label>Colunas<input aria-label="Colunas do grid Konva" type="number" min="1" max="200" value={grid.colunas} onChange={(e) => atualizarGrid("colunas", e.target.value)} /></label>
          <label>Linhas<input aria-label="Linhas do grid Konva" type="number" min="1" max="200" value={grid.linhas} onChange={(e) => atualizarGrid("linhas", e.target.value)} /></label>
          <label>Casa<input aria-label="Tamanho da casa Konva" type="number" min="24" max="160" value={grid.tamanhoCelula} onChange={(e) => atualizarGrid("tamanhoCelula", e.target.value)} /></label>
          <label>Cor<input aria-label="Cor do grid Konva" type="color" value={grid.cor} onChange={(e) => atualizarGrid("cor", e.target.value)} /></label>
          <label>Opacidade<input aria-label="Opacidade do grid Konva" type="range" min="0" max="1" step="0.05" value={grid.opacidade} onChange={(e) => atualizarGrid("opacidade", e.target.value)} /></label>
          <label className="mapa-konva-teste__check"><input aria-label="Mostrar grid Konva" type="checkbox" checked={grid.visivel} onChange={(e) => atualizarGrid("visivel", e.target.checked)} /> Mostrar grid</label>
        </fieldset>

        <fieldset>
          <legend>Câmera</legend>
          <button type="button" aria-label="Diminuir zoom Konva" onClick={() => aplicarZoom(camera.zoom - 0.1)}>−</button>
          <output>{Math.round(camera.zoom * 100)}%</output>
          <button type="button" aria-label="Aumentar zoom Konva" onClick={() => aplicarZoom(camera.zoom + 0.1)}>+</button>
          <button type="button" onClick={voltarCemPorCento}>Voltar a 100%</button>
          <button type="button" onClick={ajustarTela}>Ajustar tela</button>
        </fieldset>

        <fieldset>
          <legend>Imagem de fundo</legend>
          <input ref={arquivoRef} type="file" accept="image/*" hidden onChange={carregarImagem} />
          <button type="button" disabled={carregandoImagem} onClick={() => arquivoRef.current?.click()}>{carregandoImagem ? "Carregando..." : "Escolher imagem"}</button>
          <button type="button" disabled={!fundo.imagem} onClick={() => salvarFundo({ ...fundo, bloqueado: !fundo.bloqueado }, fundo.bloqueado ? "Imagem destravada." : "Imagem travada.")}>{fundo.bloqueado ? "Destravar" : "Travar"}</button>
          <button type="button" disabled={!fundo.imagem} onClick={ajustarImagemAoGrid}>Ajustar ao grid</button>
          <button type="button" disabled={!fundo.imagem} onClick={centralizarImagem}>Centralizar</button>
          <button className="mapa-konva-teste__perigo" type="button" disabled={!fundo.imagem} onClick={removerImagem}>Remover</button>
        </fieldset>
      </div>

      {fundo.imagem ? (
        <div className="mapa-konva-teste__fundo-campos">
          <label>X<input aria-label="Posição X da imagem Konva" type="number" value={Math.round(fundo.x)} onChange={(e) => salvarFundo({ ...fundo, x: Number(e.target.value) })} /></label>
          <label>Y<input aria-label="Posição Y da imagem Konva" type="number" value={Math.round(fundo.y)} onChange={(e) => salvarFundo({ ...fundo, y: Number(e.target.value) })} /></label>
          <label>Largura<input aria-label="Largura da imagem Konva" type="number" min="40" value={Math.round(fundo.largura)} onChange={(e) => salvarFundo({ ...fundo, largura: Math.max(40, Number(e.target.value)) })} /></label>
          <label>Altura<input aria-label="Altura da imagem Konva" type="number" min="40" value={Math.round(fundo.altura)} onChange={(e) => salvarFundo({ ...fundo, altura: Math.max(40, Number(e.target.value)) })} /></label>
          <label>Opacidade<input aria-label="Opacidade da imagem Konva" type="range" min="0" max="1" step="0.05" value={fundo.opacidade} onChange={(e) => salvarFundo({ ...fundo, opacidade: Number(e.target.value) })} /></label>
          <span>{fundo.nome} · {fundo.bloqueado ? "travada" : "editável"}</span>
        </div>
      ) : null}

      <div className="mapa-konva-teste__area" ref={areaRef}>
        <Stage
          ref={stageRef}
          width={tamanhoArea.largura}
          height={tamanhoArea.altura}
          x={camera.x}
          y={camera.y}
          scaleX={camera.zoom}
          scaleY={camera.zoom}
          draggable
          onWheel={controlarRoda}
          onDragEnd={(evento) => {
            if (evento.target === stageRef.current) setCamera((atual) => ({ ...atual, x: evento.target.x(), y: evento.target.y() }));
          }}
          onPointerDown={(evento) => {
            if (evento.target === stageRef.current) {
              setTokenSelecionadoId("");
              setImagemSelecionada(false);
            }
          }}
        >
          <Layer listening={!fundo.bloqueado}>
            <Group>
              {imagem ? <KonvaImage ref={imagemRef} image={imagem} x={fundo.x} y={fundo.y} width={fundo.largura} height={fundo.altura} opacity={fundo.opacidade} draggable={!fundo.bloqueado} onPointerDown={(e) => { e.cancelBubble = true; setImagemSelecionada(true); setTokenSelecionadoId(""); }} onDragEnd={(e) => salvarFundo({ ...fundo, x: e.target.x(), y: e.target.y() })} onTransformEnd={concluirTransformacaoImagem} /> : <Rect width={larguraMundo} height={alturaMundo} fill="#15120f" />}
            </Group>
          </Layer>

          <Layer listening={false} visible={grid.visivel}>
            {linhasVerticais.map((x) => <Line key={`v-${x}`} points={[x, 0, x, alturaMundo]} stroke={grid.cor} opacity={grid.opacidade} strokeWidth={1} />)}
            {linhasHorizontais.map((y) => <Line key={`h-${y}`} points={[0, y, larguraMundo, y]} stroke={grid.cor} opacity={grid.opacidade} strokeWidth={1} />)}
          </Layer>

          <Layer>
            {tokens.map((token) => <TokenKonvaTeste key={token.id} token={token} tamanhoCelula={grid.tamanhoCelula} selecionado={token.id === tokenSelecionadoId} aoSelecionar={(id) => { setTokenSelecionadoId(id); setImagemSelecionada(false); }} aoMover={atualizarToken} />)}
          </Layer>

          <Layer>
            <Transformer ref={transformerRef} rotateEnabled={false} flipEnabled={false} keepRatio={false} enabledAnchors={["top-left", "top-center", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-center", "bottom-right"]} boundBoxFunc={(antiga, nova) => nova.width < 40 || nova.height < 40 ? antiga : nova} />
          </Layer>
        </Stage>
      </div>

      <footer><span>Arraste o vazio para mover a câmera · use a roda para zoom</span><span>Câmera: {Math.round(camera.x)}, {Math.round(camera.y)} · Tokens: {tokens.length} · Mundo: {larguraMundo} × {alturaMundo}px</span></footer>
    </section>
  );
}
