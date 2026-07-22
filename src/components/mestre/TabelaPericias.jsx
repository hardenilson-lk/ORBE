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
  regra = null,
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
        <div>
          <h3>Perícias</h3>
          <small>Cada ponto adiciona +5 em Treino. “Outros” fica livre para bônus de item, condição ou habilidade.</small>
        </div>
        {regra ? (
          <strong className={regra.excedentes ? "saldo-pontos saldo-pontos--erro" : regra.restantes ? "saldo-pontos" : "saldo-pontos saldo-pontos--completo"}>
            {regra.excedentes ? `${regra.excedentes} acima do limite` : `${regra.restantes} ponto(s) restante(s)`}
          </strong>
        ) : null}
      </header>

      {regra ? (
        <p className="tabela-pericias__cola-regra">
          NEX {regra.nex}% · {regra.limitePontos} ponto(s) disponíveis · treino máximo +{regra.grauMaximo}. No 35% libera Veterano (+10) e no 70% Expert (+15).
        </p>
      ) : null}

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
                        min="0"
                        max={regra?.grauMaximo || 15}
                        step="5"
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
