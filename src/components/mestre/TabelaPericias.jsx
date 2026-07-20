import {
  GRUPOS_PERICIAS_ARQUIVOS,
} from "../../data/periciasArquivos.js";

function numeroSeguro(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}

function TabelaPericias({
  valores = {},
  aoAlterarPericia,
  aoRolarPericia,
}) {
  function obterValores(periciaId) {
    const valorSalvo =
      valores?.[periciaId] || {};

    const treino =
      numeroSeguro(
        valorSalvo.treino,
      );

    const outros =
      numeroSeguro(
        valorSalvo.outros,
      );

    return {
      treino,
      outros,
      total: treino + outros,
    };
  }

  function alterarValor(
    periciaId,
    campo,
    valor,
  ) {
    if (
      typeof aoAlterarPericia !==
      "function"
    ) {
      return;
    }

    aoAlterarPericia(
      periciaId,
      campo,
      numeroSeguro(valor),
    );
  }

  function rolarPericia(
    pericia,
    valoresPericia,
  ) {
    if (
      typeof aoRolarPericia !==
      "function"
    ) {
      return;
    }

    aoRolarPericia({
      ...pericia,
      treino:
        valoresPericia.treino,
      outros:
        valoresPericia.outros,
      total:
        valoresPericia.total,
    });
  }

  return (
    <section className="tabela-pericias" data-assistente="ficha-pericias">
      <header className="tabela-pericias__titulo">
        <h3>Perícias</h3>
      </header>

      {GRUPOS_PERICIAS_ARQUIVOS.map(
        (grupo) => (
          <section
            className="tabela-pericias__grupo"
            key={grupo.id}
          >
            <h4>{grupo.nome}</h4>

            <div className="tabela-pericias__cabecalho">
              <span>Perícia</span>
              <span>Atr.</span>
              <span>Treino</span>
              <span>Bônus</span>
              <span>Outros</span>
              <span aria-hidden="true">
                Ação
              </span>
            </div>

            <div className="tabela-pericias__linhas">
              {grupo.pericias.map(
                (pericia) => {
                  const valoresPericia =
                    obterValores(
                      pericia.id,
                    );

                  const sinalBonus =
                    valoresPericia.total >
                    0
                      ? "+"
                      : "";

                  return (
                    <div
                      className="tabela-pericias__linha"
                      key={pericia.id}
                    >
                      <strong>
                        {pericia.nome}
                      </strong>

                      <span>
                        {pericia.atributo}
                      </span>

                      <input
                        type="number"
                        aria-label={`Treino de ${pericia.nome}`}
                        value={
                          valoresPericia.treino
                        }
                        onChange={(
                          evento,
                        ) =>
                          alterarValor(
                            pericia.id,
                            "treino",
                            evento.target
                              .value,
                          )
                        }
                      />

                      <output>
                        {sinalBonus}
                        {
                          valoresPericia.total
                        }
                      </output>

                      <input
                        type="number"
                        aria-label={`Outros bônus de ${pericia.nome}`}
                        value={
                          valoresPericia.outros
                        }
                        onChange={(
                          evento,
                        ) =>
                          alterarValor(
                            pericia.id,
                            "outros",
                            evento.target
                              .value,
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          rolarPericia(
                            pericia,
                            valoresPericia,
                          )
                        }
                      >
                        Rolar
                      </button>
                    </div>
                  );
                },
              )}
            </div>
          </section>
        ),
      )}
    </section>
  );
}

export default TabelaPericias;
