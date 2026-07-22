import { useEffect, useRef } from "react";

import "./interacoesTokensMapa.css";

function limitarNumero(valor, minimo, maximo) {
  const numero = Number(valor) || 0;
  return Math.min(maximo, Math.max(minimo, numero));
}

function MiniFichaToken({ ficha, tipo = "jogador", embutida = false, aoAlterar, aoFechar }) {
  const dialogoRef = useRef(null);
  const aoFecharRef = useRef(aoFechar);

  useEffect(() => {
    aoFecharRef.current = aoFechar;
  }, [aoFechar]);

  useEffect(() => {
    dialogoRef.current?.focus();

    function fecharEscape(evento) {
      if (evento.key === "Escape") {
        aoFecharRef.current();
      }
    }

    document.addEventListener("keydown", fecharEscape);
    return () => document.removeEventListener("keydown", fecharEscape);
  }, []);

  if (!ficha) {
    return null;
  }

  function atualizarTexto(campo, valor) {
    aoAlterar({ [campo]: valor });
  }

  function atualizarNumero(campo, valor, minimo = 0) {
    aoAlterar({ [campo]: limitarNumero(valor, minimo, 9999) });
  }

  return (
    <div
      className={embutida ? "mini-ficha-token__encaixe" : "mini-ficha-token__fundo"}
      onPointerDown={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <section
        ref={dialogoRef}
        className="mini-ficha-token"
        role="dialog"
        aria-modal={embutida ? undefined : "true"}
        aria-labelledby="mini-ficha-token-titulo"
        tabIndex="-1"
      >
        <header>
          <div>
            <span>{tipo === "npc" ? "NPC" : "Agente vinculado"}</span>
            <h2 id="mini-ficha-token-titulo">{ficha.nome || "Mini ficha"}</h2>
          </div>
          <button type="button" aria-label="Fechar mini ficha" onClick={aoFechar}>×</button>
        </header>

        <div className="mini-ficha-token__identidade">
          {ficha.foto ? <img src={ficha.foto} alt="" draggable="false" /> : <span>ARQ</span>}
          <label>
            Nome
            <input value={ficha.nome || ""} onChange={(evento) => atualizarTexto("nome", evento.target.value)} />
          </label>
        </div>

        <div className="mini-ficha-token__grade">
          <label>PV atual<input type="number" min="0" value={ficha.pvAtual ?? 0} onChange={(evento) => atualizarNumero("pvAtual", evento.target.value)} /></label>
          <label>PV máximo<input type="number" min="1" value={ficha.pvMaximo ?? 1} onChange={(evento) => atualizarNumero("pvMaximo", evento.target.value, 1)} /></label>
          <label>PE atual<input type="number" min="0" value={ficha.peAtual ?? 0} onChange={(evento) => atualizarNumero("peAtual", evento.target.value)} /></label>
          <label>PE máximo<input type="number" min="1" value={ficha.peMaximo ?? 1} onChange={(evento) => atualizarNumero("peMaximo", evento.target.value, 1)} /></label>
          <label>SAN atual<input type="number" min="0" value={ficha.sanAtual ?? 0} onChange={(evento) => atualizarNumero("sanAtual", evento.target.value)} /></label>
          <label>SAN máxima<input type="number" min="1" value={ficha.sanMaximo ?? 1} onChange={(evento) => atualizarNumero("sanMaximo", evento.target.value, 1)} /></label>
          <label>Defesa<input type="number" min="0" value={ficha.defesa ?? 0} onChange={(evento) => atualizarNumero("defesa", evento.target.value)} /></label>
          <label>Tipo<input value={ficha.tipo || ""} onChange={(evento) => atualizarTexto("tipo", evento.target.value)} /></label>
        </div>

        <p>
          {tipo === "npc"
            ? "Alterações atualizam a mini ficha do NPC e todas as instâncias vinculadas."
            : "Alterações atualizam a ficha original do personagem."}
        </p>
      </section>
    </div>
  );
}

export default MiniFichaToken;
