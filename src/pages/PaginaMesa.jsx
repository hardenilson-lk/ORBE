import {
  Link,
  useParams,
} from "react-router";

import Cabecalho from "../components/Cabecalho.jsx";

import {
  lerMesasSalvas,
} from "../utils/mesas.js";

function PaginaMesa() {
  const { mesaId } = useParams();

  const mesa = lerMesasSalvas().find(
    (item) => item.id === mesaId,
  );

  if (!mesa) {
    return (
      <div className="pagina">
        <Cabecalho />

        <main className="mesa-nao-encontrada">
          <span>
            Arquivo indisponível
          </span>

          <h1>Mesa não encontrada</h1>

          <p>
            Este arquivo pode ter sido removido ou não
            existe neste navegador.
          </p>

          <Link to="/arquivos/minhas-mesas">
            Voltar para Minhas mesas
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="pagina">
      <Cabecalho />

      <main className="painel-mesa">
        <section className="painel-mesa__cabecalho">
          <div>
            <span className="painel-mesa__etiqueta">
              Arquivo ativo
            </span>

            <h1>{mesa.nomeCampanha}</h1>

            <p>
              {mesa.descricao ||
                "Nenhuma descrição foi adicionada."}
            </p>
          </div>

          <div className="painel-mesa__identificacao">
            <span>Identificação</span>

            <strong>
              {mesa.arquivoInicial}
            </strong>
          </div>
        </section>

        <section className="painel-mesa__grade">
          <article className="modulo-mesa">
            <span className="modulo-mesa__numero">
              01
            </span>

            <div className="modulo-mesa__icone">
              A
            </div>

            <span className="modulo-mesa__tipo">
              Sessões
            </span>

            <h2>Arquivos da campanha</h2>

            <p>
              Organize cada sessão como um novo arquivo
              da investigação.
            </p>

            <button type="button">
              Abrir arquivos
            </button>
          </article>

          <article className="modulo-mesa">
            <span className="modulo-mesa__numero">
              02
            </span>

            <div className="modulo-mesa__icone">
              J
            </div>

            <span className="modulo-mesa__tipo">
              Participantes
            </span>

            <h2>Jogadores</h2>

            <p>
              Consulte os investigadores e gerencie os
              convites da mesa.
            </p>

            <button type="button">
              Gerenciar jogadores
            </button>
          </article>

          <article className="modulo-mesa">
            <span className="modulo-mesa__numero">
              03
            </span>

            <div className="modulo-mesa__icone">
              F
            </div>

            <span className="modulo-mesa__tipo">
              Personagens
            </span>

            <h2>Fichas</h2>

            <p>
              Crie e consulte as fichas vinculadas a
              esta campanha.
            </p>

            <button type="button">
              Abrir fichas
            </button>
          </article>

          <article className="modulo-mesa">
            <span className="modulo-mesa__numero">
              04
            </span>

            <div className="modulo-mesa__icone">
              G
            </div>

            <span className="modulo-mesa__tipo">
              Sessão virtual
            </span>

            <h2>Grid</h2>

            <p>
              Prepare mapas, tokens, iluminação e cenas
              da investigação.
            </p>

            <button type="button">
              Abrir grid
            </button>
          </article>
        </section>

        <Link
          className="voltar-inicio"
          to="/arquivos/minhas-mesas"
        >
          ← Voltar para Minhas mesas
        </Link>
      </main>
    </div>
  );
}

export default PaginaMesa;