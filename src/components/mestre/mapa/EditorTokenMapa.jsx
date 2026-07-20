import { useEffect, useRef } from "react";

import "./interacoesTokensMapa.css";

function EditorTokenMapa({ token, ficha, grid, aoAlterar, aoAlterarTamanho, aoFechar }) {
  const dialogoRef = useRef(null);
  const aoFecharRef = useRef(aoFechar);

  useEffect(() => {
    aoFecharRef.current = aoFechar;
  }, [aoFechar]);

  useEffect(() => {
    dialogoRef.current?.focus();
    function fecharEscape(evento) {
      if (evento.key === "Escape") aoFecharRef.current();
    }
    document.addEventListener("keydown", fecharEscape);
    return () => document.removeEventListener("keydown", fecharEscape);
  }, []);

  if (!token) return null;

  return (
    <div
      className="editor-token-mapa__fundo"
      onPointerDown={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <section
        ref={dialogoRef}
        className="editor-token-mapa"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-token-mapa-titulo"
        tabIndex="-1"
      >
        <header>
          <div>
            <span>{token.tipo === "npc" ? "Instância de NPC" : "Token de jogador"}</span>
            <h2 id="editor-token-mapa-titulo">Editar token</h2>
          </div>
          <button type="button" aria-label="Fechar editor do token" onClick={aoFechar}>×</button>
        </header>

        <div className="editor-token-mapa__resumo">
          {ficha?.foto || token.foto ? <img src={ficha?.foto || token.foto} alt="" draggable="false" /> : <span>ARQ</span>}
          <div>
            <strong>{ficha?.nome || token.nome || "Token"}</strong>
            <small>Posição {Math.round(token.x)} × {Math.round(token.y)} px · casa {token.coluna + 1}, {token.linha + 1}</small>
          </div>
        </div>

        <div className="editor-token-mapa__grade">
          <label>
            Tamanho em casas
            <select value={token.tamanho} onChange={(evento) => aoAlterarTamanho(evento.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((numero) => <option key={numero} value={numero}>{numero}</option>)}
            </select>
          </label>
          <label>
            Rotação
            <input type="number" min="-360" max="360" value={token.rotacao || 0} onChange={(evento) => aoAlterar({ rotacao: Number(evento.target.value) || 0 })} />
          </label>
          <label>
            Posição X
            <input type="number" min="0" max={grid.colunas * grid.tamanhoCelula} value={Math.round(token.x)} onChange={(evento) => aoAlterar({ x: Number(evento.target.value) || 0 })} />
          </label>
          <label>
            Posição Y
            <input type="number" min="0" max={grid.linhas * grid.tamanhoCelula} value={Math.round(token.y)} onChange={(evento) => aoAlterar({ y: Number(evento.target.value) || 0 })} />
          </label>
        </div>

        <div className="editor-token-mapa__opcoes">
          <label><input type="checkbox" checked={token.mostrarNome} onChange={(evento) => aoAlterar({ mostrarNome: evento.target.checked })} /> Mostrar nome</label>
          <label><input type="checkbox" checked={token.mostrarPv} onChange={(evento) => aoAlterar({ mostrarPv: evento.target.checked })} /> Mostrar PV, PE e SAN</label>
        </div>

        <p>A ficha continua sendo a fonte do nome, imagem e recursos. Este editor altera apenas a instância no grid.</p>
      </section>
    </div>
  );
}

export default EditorTokenMapa;
