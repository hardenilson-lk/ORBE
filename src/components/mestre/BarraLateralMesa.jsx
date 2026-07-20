import {
  useEffect,
  useState,
} from "react";

import "./BarraLateralMesa.css";

function BarraLateralMesa({
  nomeCampanha = "Campanha sem nome",
  arquivoAtual = "ARQUIVO 0001",
  codigoConvite = "ORBE-0001",
  jogadores = [],
  mestreOnline = true,
  aoCopiarConvite,
  aoAbrirConfiguracoes,
  aoEncerrarSessao,
}) {
  const [copiado, setCopiado] =
    useState(false);

  useEffect(() => {
    if (!copiado) {
      return undefined;
    }

    const temporizador = setTimeout(
      () => {
        setCopiado(false);
      },
      1800,
    );

    return () => {
      clearTimeout(temporizador);
    };
  }, [copiado]);

  async function copiarConvite() {
    if (
      typeof aoCopiarConvite ===
      "function"
    ) {
      aoCopiarConvite(
        codigoConvite,
      );
    }

    try {
      if (
        navigator?.clipboard
          ?.writeText
      ) {
        await navigator.clipboard.writeText(
          codigoConvite,
        );
      }

      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  const jogadoresSeguros =
    Array.isArray(jogadores)
      ? jogadores
      : [];

  const jogadoresOnline =
    jogadoresSeguros.filter(
      (jogador) =>
        jogador.online !== false,
    ).length;

  return (
    <aside className="barra-lateral-mesa">
      <header className="barra-lateral-mesa__cabecalho">
        <span>
          Sala de investigação
        </span>

        <h2>{nomeCampanha}</h2>

        <p>{arquivoAtual}</p>
      </header>

      <section className="barra-lateral-mesa__bloco">
        <div className="barra-lateral-mesa__titulo">
          <span aria-hidden="true">
            ◉
          </span>

          <h3>Status da mesa</h3>
        </div>

        <div className="barra-lateral-mesa__status">
          <div>
            <span>Mestre</span>

            <strong>
              {mestreOnline
                ? "Online"
                : "Offline"}
            </strong>
          </div>

          <div>
            <span>Jogadores</span>

            <strong>
              {jogadoresOnline}/
              {jogadoresSeguros.length}
            </strong>
          </div>
        </div>
      </section>

      <section className="barra-lateral-mesa__bloco">
        <div className="barra-lateral-mesa__titulo">
          <span aria-hidden="true">
            ⌘
          </span>

          <h3>Código de convite</h3>
        </div>

        <div className="barra-lateral-mesa__convite">
          <strong>
            {codigoConvite}
          </strong>

          <button
            type="button"
            onClick={copiarConvite}
          >
            {copiado
              ? "Copiado"
              : "Copiar código"}
          </button>
        </div>

        <p className="barra-lateral-mesa__aviso">
          Envie este código apenas para
          os jogadores da campanha.
        </p>
      </section>

      <section className="barra-lateral-mesa__bloco">
        <div className="barra-lateral-mesa__titulo">
          <span aria-hidden="true">
            ☷
          </span>

          <h3>Participantes</h3>
        </div>

        {jogadoresSeguros.length === 0 ? (
          <p className="barra-lateral-mesa__vazio">
            Nenhum jogador entrou na
            mesa.
          </p>
        ) : (
          <div className="barra-lateral-mesa__jogadores">
            {jogadoresSeguros.map(
              (jogador, indice) => {
                const nome =
                  jogador.nome ||
                  `Jogador ${indice + 1}`;

                const estaOnline =
                  jogador.online !==
                  false;

                return (
                  <article
                    className="barra-lateral-mesa__jogador"
                    key={
                      jogador.id ||
                      `${nome}-${indice}`
                    }
                  >
                    <div className="barra-lateral-mesa__avatar">
                      {nome
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {nome}
                      </strong>

                      <span>
                        {jogador.personagem ||
                          "Sem ficha vinculada"}
                      </span>
                    </div>

                    <small
                      className={
                        estaOnline
                          ? "barra-lateral-mesa__online"
                          : "barra-lateral-mesa__offline"
                      }
                    >
                      {estaOnline
                        ? "Online"
                        : "Offline"}
                    </small>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>

      <footer className="barra-lateral-mesa__acoes">
        <button
          type="button"
          onClick={
            aoAbrirConfiguracoes
          }
        >
          Configurações
        </button>

        <button
          className="barra-lateral-mesa__encerrar"
          type="button"
          onClick={aoEncerrarSessao}
        >
          Encerrar sessão
        </button>
      </footer>
    </aside>
  );
}

export default BarraLateralMesa;