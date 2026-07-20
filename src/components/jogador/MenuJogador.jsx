import { Link } from "react-router";

import "./MenuJogador.css";

const ITENS = [
  ["mapa", "▣", "Mapa"],
  ["ficha", "☷", "Minha ficha"],
  ["inventario", "▤", "Inventário"],
  ["anotacoes", "✎", "Anotações"],
  ["missoes", "◎", "Missões"],
  ["arquivos", "⌘", "Arquivos"],
];

function MenuJogador({
  nomeCampanha,
  arquivoAtual,
  menuAtivo,
  ficha,
  aoSelecionarMenu,
  aoTrocarPersonagem,
  aoAtualizar,
}) {
  return (
    <aside className="menu-jogador">
      <header className="menu-jogador__marca">
        <span>ARQ</span>
        <div>
          <h1>arquivos</h1>
          <p>Campanha: {nomeCampanha}</p>
          <p>Arquivo atual: {arquivoAtual}</p>
        </div>
      </header>

      <div className="menu-jogador__acesso">Nível de acesso: Agente</div>

      {ficha ? (
        <section className="menu-jogador__agente">
          {ficha.foto ? <img src={ficha.foto} alt="" /> : <span>{String(ficha.nome || "AG").slice(0, 2).toUpperCase()}</span>}
          <div>
            <small>Agente vinculado</small>
            <strong>{ficha.nome || "Sem identificação"}</strong>
            <p>{ficha.classe || "Classe indefinida"} · NEX {ficha.nex || "5%"}</p>
          </div>
        </section>
      ) : null}

      <nav aria-label="Menu do jogador">
        {ITENS.map(([id, icone, rotulo]) => (
          <button
            type="button"
            className={menuAtivo === id ? "ativo" : ""}
            key={id}
            onClick={() => aoSelecionarMenu(id)}
          >
            <span aria-hidden="true">{icone}</span>
            {rotulo}
          </button>
        ))}

        <Link to="/mesas"><span aria-hidden="true">↩</span> Portal</Link>
      </nav>

      <footer>
        <button type="button" onClick={aoAtualizar}><span aria-hidden="true">↻</span> Atualizar campanha</button>
        <button type="button" onClick={aoTrocarPersonagem}><span aria-hidden="true">⇄</span> Trocar personagem</button>
      </footer>
    </aside>
  );
}

export default MenuJogador;
