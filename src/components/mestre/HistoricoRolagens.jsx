import "./HistoricoRolagens.css";

function formatarHorario(data) {
  if (!data) {
    return "";
  }

  const horario = new Date(data);

  if (Number.isNaN(horario.getTime())) {
    return "";
  }

  return horario.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function HistoricoRolagens({
  rolagens = [],
  limite = 12,
  aoLimparHistorico,
}) {
  const listaSegura =
    Array.isArray(rolagens)
      ? rolagens
      : [];

  const historicoVisivel =
    listaSegura.slice(0, limite);

  const ultimaRolagem =
    historicoVisivel[0] || null;

  return (
    <section className="historico-rolagens">
      <header className="historico-rolagens__cabecalho">
        <div>
          <span>
            Registro da mesa
          </span>

          <h2>
            Histórico de rolagens
          </h2>
        </div>

        {historicoVisivel.length > 0 && (
          <button
            type="button"
            onClick={aoLimparHistorico}
          >
            Limpar
          </button>
        )}
      </header>

      {ultimaRolagem ? (
        <article className="historico-rolagens__ultima">
          <span>
            Última rolagem
          </span>

          <strong>
            {ultimaRolagem.total ??
              ultimaRolagem.resultado ??
              "—"}
          </strong>

          <p>
            {ultimaRolagem.nome ||
              ultimaRolagem.tipo ||
              "Rolagem de dado"}
          </p>
        </article>
      ) : (
        <div className="historico-rolagens__vazio">
          <span aria-hidden="true">
            ◇
          </span>

          <p>
            Nenhuma rolagem realizada
            nesta sessão.
          </p>
        </div>
      )}

      {historicoVisivel.length > 0 && (
        <div className="historico-rolagens__lista">
          {historicoVisivel.map(
            (rolagem, indice) => {
              const identificador =
                rolagem.id ||
                `${rolagem.tipo || "dado"}-${indice}`;

              const resultado =
                rolagem.total ??
                rolagem.resultado ??
                "—";

              const quantidade =
                rolagem.quantidade || 1;

              const tipo =
                rolagem.tipo ||
                rolagem.dado ||
                "dado";

              return (
                <article
                  className="historico-rolagens__item"
                  key={identificador}
                >
                  <div className="historico-rolagens__dado">
                    <span>
                      {quantidade}×
                    </span>

                    <strong>
                      {tipo}
                    </strong>
                  </div>

                  <div className="historico-rolagens__informacoes">
                    <strong>
                      {rolagem.nome ||
                        "Rolagem"}
                    </strong>

                    {Array.isArray(
                      rolagem.valores,
                    ) &&
                      rolagem.valores
                        .length > 0 && (
                        <small>
                          Dados:{" "}
                          {rolagem.valores.join(
                            ", ",
                          )}
                        </small>
                      )}

                    {rolagem.modificador !==
                      undefined &&
                      Number(
                        rolagem.modificador,
                      ) !== 0 && (
                        <small>
                          Modificador:{" "}
                          {Number(
                            rolagem.modificador,
                          ) > 0
                            ? "+"
                            : ""}
                          {
                            rolagem.modificador
                          }
                        </small>
                      )}

                    {rolagem.criadoEm && (
                      <small>
                        {formatarHorario(
                          rolagem.criadoEm,
                        )}
                      </small>
                    )}
                  </div>

                  <div className="historico-rolagens__resultado">
                    <span>
                      Resultado
                    </span>

                    <strong>
                      {resultado}
                    </strong>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}

export default HistoricoRolagens;