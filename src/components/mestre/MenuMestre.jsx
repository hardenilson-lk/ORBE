import { Link } from "react-router";

import "./MenuMestre.css";

const ITENS_MENU = [
  {
    id: "mapa",
    simbolo: "▣",
    texto: "Mapa",
  },
  {
    id: "gerenciar-fichas",
    simbolo: "☰",
    texto: "Gerenciar fichas",
  },
  {
    id: "fichas",
    simbolo: "☷",
    texto: "Ficha do personagem",
  },
  {
    id: "inventario",
    simbolo: "▤",
    texto: "Inventário",
  },
  {
    id: "rituais",
    simbolo: "✦",
    texto: "Rituais",
  },
  {
    id: "trilha-sonora",
    simbolo: "♫",
    texto: "Trilha sonora",
  },
  {
    id: "anotacoes",
    simbolo: "✎",
    texto: "Anotações",
  },
  {
    id: "missoes",
    simbolo: "◎",
    texto: "Missões",
  },
  {
    id: "arquivos",
    simbolo: "⌘",
    texto: "Arquivos",
  },
];

const ASSISTENTE_POR_MENU = {
  mapa: "menu-mapa",
  fichas: "menu-fichas",
  inventario: "menu-inventario",
  rituais: "menu-rituais",
  "trilha-sonora": "menu-trilha-sonora",
  anotacoes: "menu-anotacoes",
  missoes: "menu-missoes",
  arquivos: "menu-arquivos",
};

function MenuMestre({
  nomeCampanha = "Campanha",
  arquivoInicial = "ARQUIVO 0001",
  menuAtivo = "mapa",
  aoSelecionarMenu,
  aoAtualizarCampanha,
  aoSalvarArquivo,
}) {
  function selecionarMenu(menuId) {
    if (typeof aoSelecionarMenu === "function") {
      aoSelecionarMenu(menuId);
    }
  }

  return (
    <aside className="menu-mestre">
      <header className="menu-mestre__marca">
        <span className="menu-mestre__carimbo">
          ARQ
        </span>

        <div>
          <h1>arquivos</h1>

          <p>
            Campanha: {nomeCampanha}
          </p>

          <p>
            Arquivo atual: {arquivoInicial}
          </p>

          <span className="menu-mestre__acesso">
            Nível de acesso: Mestre
          </span>
        </div>
      </header>

      <nav
        className="menu-mestre__navegacao"
        aria-label="Menu da campanha"
      >
        {ITENS_MENU.map((item) => {
          const estaAtivo =
            menuAtivo === item.id;

          return (
            <button
              className={
                estaAtivo
                  ? "menu-mestre__botao menu-mestre__botao--ativo"
                  : "menu-mestre__botao"
              }
              type="button"
              key={item.id}
              data-assistente={
                ASSISTENTE_POR_MENU[item.id]
              }
              aria-current={
                estaAtivo
                  ? "page"
                  : undefined
              }
              onClick={() =>
                selecionarMenu(item.id)
              }
            >
              <span aria-hidden="true">
                {item.simbolo}
              </span>

              {item.texto}
            </button>
          );
        })}

        <Link
          className="menu-mestre__botao menu-mestre__link"
          to="/mesas"
        >
          <span aria-hidden="true">
            ↩
          </span>

          Portal
        </Link>
      </nav>

      <section className="menu-mestre__acoes">
        <button
          type="button"
          onClick={aoAtualizarCampanha}
        >
          <span aria-hidden="true">
            ↻
          </span>

          Atualizar campanha
        </button>

        <button
          type="button"
          onClick={aoSalvarArquivo}
        >
          <span aria-hidden="true">
            ✓
          </span>

          Salvar arquivo
        </button>
      </section>
    </aside>
  );
}

export default MenuMestre;
