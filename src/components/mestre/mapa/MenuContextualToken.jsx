import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  aoAlterarVisibilidade,
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

  const menu = (
    <div
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
      {podeAdministrar ? <div className="menu-contextual-token__visibilidade" role="group" aria-label="Visibilidade para jogadores">
        <small>Visibilidade</small>
        <button type="button" onClick={() => aoAlterarVisibilidade("oculto")} aria-pressed={token.modoVisibilidade === "oculto"}>Oculto</button>
        <button type="button" onClick={() => aoAlterarVisibilidade("proximidade")} aria-pressed={token.modoVisibilidade === "proximidade"}>Proximidade</button>
        <button type="button" onClick={() => aoAlterarVisibilidade("visivel")} aria-pressed={token.modoVisibilidade === "visivel"}>Visível</button>
      </div> : null}
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
    </div>
  );

  // O menu precisa ficar fora da arvore visual do mapa. Dentro do painel ele
  // pode herdar regras de layout das secoes e acabar abrindo uma faixa vazia
  // que empurra o grid para baixo.
  return typeof document !== "undefined" ? createPortal(menu, document.body) : null;
}

export default MenuContextualToken;
