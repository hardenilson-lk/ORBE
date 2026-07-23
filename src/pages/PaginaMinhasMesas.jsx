import { Link } from "react-router";

import useAutenticacaoOrbe from "../autenticacao/useAutenticacaoOrbe.js";
import Cabecalho from "../components/Cabecalho.jsx";
import useMesasOrbe from "../hooks/useMesasOrbe.js";
import { lerUsuarioAtual } from "../utils/contasOrbe.js";

import {
  formatarData,
  usuarioPodeAdministrarMesa,
} from "../utils/mesas.js";

function PaginaMinhasMesas() {
  const [mesas] = useMesasOrbe();
  const { usuario } =
    useAutenticacaoOrbe();
  const usuarioId =
    usuario?.id ||
    lerUsuarioAtual()?.id ||
    "";

  return (
    <div className="pagina">
      <Cabecalho />

      <main className="minhas-mesas">
        <section className="minhas-mesas__cabecalho">
          <span className="minhas-mesas__etiqueta">
            Arquivos registrados
          </span>

          <h1>Minhas mesas</h1>

          <p>
            Campanhas salvas neste navegador.
          </p>
        </section>

        {mesas.length === 0 ? (
          <section className="minhas-mesas__vazio">
            <span>
              Nenhum arquivo encontrado
            </span>

            <h2>
              Você ainda não criou uma mesa.
            </h2>

            <p>
              Crie sua primeira investigação para que
              ela apareça nesta área.
            </p>

            <Link
              className="minhas-mesas__criar"
              to="/arquivos/nova-mesa"
            >
              Criar primeira mesa
            </Link>
          </section>
        ) : (
          <section className="lista-mesas">
            {mesas.map((mesa, indice) => (
              <article
                className="mesa-salva"
                key={mesa.id}
              >
                <div className="mesa-salva__topo">
                  <span>
                    {String(indice + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span>
                    {formatarData(
                      mesa.criadaEm,
                    )}
                  </span>
                </div>

                <div className="mesa-salva__simbolo">
                  A
                </div>

                <span className="mesa-salva__tipo">
                  {mesa.arquivoInicial}
                </span>

                <h2>{mesa.nomeCampanha}</h2>

                <p>
                  {mesa.descricao ||
                    "Nenhuma descrição foi adicionada."}
                </p>

                {usuarioPodeAdministrarMesa(
                  mesa,
                  usuarioId,
                ) ? (
                  <Link
                    className="mesa-salva__abrir"
                    to={`/arquivos/mesa/${mesa.id}`}
                  >
                    Abrir como mestre
                  </Link>
                ) : null}

                <Link
                  className="mesa-salva__jogador"
                  to={`/arquivos/jogador/${mesa.id}`}
                >
                  Entrar como jogador
                </Link>
              </article>
            ))}
          </section>
        )}

        <div className="minhas-mesas__acoes">
          <Link
            className="minhas-mesas__nova"
            to="/arquivos/nova-mesa"
          >
            + Criar nova mesa
          </Link>

          <Link
            className="voltar-inicio"
            to="/arquivos"
          >
            ← Voltar para a Central de Arquivos
          </Link>
        </div>
      </main>
    </div>
  );
}

export default PaginaMinhasMesas;
