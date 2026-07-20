import { useEffect, useRef } from "react";

import "./interacoesTokensMapa.css";

function MenuContextualToken({
  token,
  posicao,
  podeAdministrar = true,
  podeControlar = true,
  aoAbrirFicha,
  aoGirarEsquerda,
  aoGirarDireita,
  aoEditarToken,
  aoDuplicar,
  aoRemover,
  aoAlternarOculto,
  aoAlternarBloqueado,
  aoTrazerFrente,
  aoEnviarTras,
  aoFechar,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    function fecharFora(evento) {
      if (!menuRef.current?.contains(evento.target)) {
        aoFechar();
      }
    }

    function fecharEscape(evento) {
      if (evento.key === "Escape") {
        aoFechar();
      }
    }

    document.addEventListener("pointerdown", fecharFora);
    document.addEventListener("keydown", fecharEscape);

    return () => {
      document.removeEventListener("pointerdown", fecharFora);
      document.removeEventListener("keydown", fecharEscape);
    };
  }, [aoFechar]);

  if (!token || !posicao) {
    return null;
  }

  return (
    <section
      ref={menuRef}
      className="menu-contextual-token"
      role="menu"
      aria-label={`Ações do token ${token.nome || "selecionado"}`}
      style={{ left: posicao.x, top: posicao.y }}
      onPointerDown={(evento) => evento.stopPropagation()}
    >
      <button type="button" role="menuitem" onClick={aoAbrirFicha}>
        Abrir ficha
      </button>
      {podeControlar ? <div className="menu-contextual-token__rotacao" role="group" aria-label="Orientação do token">
        <button type="button" role="menuitem" onClick={aoGirarEsquerda} aria-label="Girar token para a esquerda">
          ↶ Esquerda
        </button>
        <button type="button" role="menuitem" onClick={aoGirarDireita} aria-label="Girar token para a direita">
          Direita ↷
        </button>
      </div> : null}
      {podeAdministrar ? <button type="button" role="menuitem" onClick={aoEditarToken}>
        Editar token
      </button> : null}
      {podeAdministrar && token.tipo === "npc" ? (
        <button type="button" role="menuitem" onClick={aoDuplicar}>
          Duplicar NPC
        </button>
      ) : null}
      {podeAdministrar ? <button type="button" role="menuitem" onClick={aoAlternarOculto}>
        {token.oculto ? "Revelar" : "Ocultar"}
      </button> : null}
      {podeAdministrar ? <button type="button" role="menuitem" onClick={aoAlternarBloqueado}>
        {token.bloqueado ? "Desbloquear" : "Bloquear"}
      </button> : null}
      {podeAdministrar ? <button type="button" role="menuitem" onClick={aoTrazerFrente}>
        Trazer para frente
      </button> : null}
      {podeAdministrar ? <button type="button" role="menuitem" onClick={aoEnviarTras}>
        Enviar para trás
      </button> : null}
      {podeAdministrar ? <button
        className="menu-contextual-token__perigo"
        type="button"
        role="menuitem"
        onClick={aoRemover}
      >
        Remover do grid
      </button> : null}
    </section>
  );
}

export default MenuContextualToken;
