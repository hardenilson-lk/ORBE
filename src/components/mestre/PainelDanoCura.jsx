import {
  useMemo,
  useState,
} from "react";

function numeroSeguro(
  valor,
  valorPadrao = 0,
) {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : valorPadrao;
}

function limitarValor(
  valor,
  minimo,
  maximo,
) {
  return Math.min(
    maximo,
    Math.max(
      minimo,
      valor,
    ),
  );
}

function PainelDanoCura({
  pvAtual = 0,
  pvMaximo = 0,
  peAtual = 0,
  peMaximo = 0,
  sanAtual = 0,
  sanMaximo = 0,
  aoAlterarPvAtual,
  aoAlterarPeAtual,
  aoAlterarSanAtual,
}) {
  const [
    quantidades,
    setQuantidades,
  ] = useState({
    pv: "",
    pe: "",
    san: "",
  });

  const recursos =
    useMemo(
      () =>
        [
          {
            id: "pv",
            sigla: "PV",
            nome: "Pontos de vida",
            atual: Math.max(
              0,
              numeroSeguro(
                pvAtual,
                0,
              ),
            ),
            maximo: Math.max(
              0,
              numeroSeguro(
                pvMaximo,
                0,
              ),
            ),
            aoAlterar:
              aoAlterarPvAtual,
            classe:
              "painel-dano-cura__recurso--pv",
            textoReduzir:
              "Aplicar dano",
            textoRecuperar:
              "Aplicar cura",
          },
          {
            id: "pe",
            sigla: "PE",
            nome: "Pontos de esforço",
            atual: Math.max(
              0,
              numeroSeguro(
                peAtual,
                0,
              ),
            ),
            maximo: Math.max(
              0,
              numeroSeguro(
                peMaximo,
                0,
              ),
            ),
            aoAlterar:
              aoAlterarPeAtual,
            classe:
              "painel-dano-cura__recurso--pe",
            textoReduzir:
              "Gastar PE",
            textoRecuperar:
              "Recuperar PE",
          },
          {
            id: "san",
            sigla: "SAN",
            nome: "Sanidade",
            atual: Math.max(
              0,
              numeroSeguro(
                sanAtual,
                0,
              ),
            ),
            maximo: Math.max(
              0,
              numeroSeguro(
                sanMaximo,
                0,
              ),
            ),
            aoAlterar:
              aoAlterarSanAtual,
            classe:
              "painel-dano-cura__recurso--san",
            textoReduzir:
              "Perder SAN",
            textoRecuperar:
              "Recuperar SAN",
          },
        ].filter(
          (recurso) =>
            recurso.atual > 0 ||
            recurso.maximo > 0 ||
            typeof recurso.aoAlterar ===
              "function",
        ),
      [
        pvAtual,
        pvMaximo,
        peAtual,
        peMaximo,
        sanAtual,
        sanMaximo,
        aoAlterarPvAtual,
        aoAlterarPeAtual,
        aoAlterarSanAtual,
      ],
    );

  function atualizarQuantidade(
    recursoId,
    valor,
  ) {
    setQuantidades(
      (valoresAnteriores) => ({
        ...valoresAnteriores,
        [recursoId]: valor,
      }),
    );
  }

  function obterQuantidade(
    recursoId,
  ) {
    return Math.max(
      0,
      Math.floor(
        numeroSeguro(
          quantidades[
            recursoId
          ],
          0,
        ),
      ),
    );
  }

  function enviarNovoValor(
    recurso,
    novoValor,
  ) {
    if (
      typeof recurso.aoAlterar !==
      "function"
    ) {
      return;
    }

    recurso.aoAlterar(
      limitarValor(
        novoValor,
        0,
        recurso.maximo,
      ),
    );

    atualizarQuantidade(
      recurso.id,
      "",
    );
  }

  function reduzirRecurso(
    recurso,
  ) {
    const quantidade =
      obterQuantidade(
        recurso.id,
      );

    if (quantidade <= 0) {
      return;
    }

    enviarNovoValor(
      recurso,
      recurso.atual -
        quantidade,
    );
  }

  function recuperarRecurso(
    recurso,
  ) {
    const quantidade =
      obterQuantidade(
        recurso.id,
      );

    if (quantidade <= 0) {
      return;
    }

    enviarNovoValor(
      recurso,
      recurso.atual +
        quantidade,
    );
  }

  return (
    <>
      <style>
        {`
          .ficha-arquivos
          .painel-dano-cura {
            display: grid;
            gap: 8px;
            padding: 10px 12px;
            border: 1px solid #6c5740;
            background:
              rgba(242, 232, 211, 0.42);
            box-shadow:
              inset 0 0 0 2px
              rgba(255, 251, 239, 0.18);
          }

          .ficha-arquivos
          .painel-dano-cura__cabecalho {
            display: flex;
            justify-content:
              space-between;
            align-items: center;
            gap: 10px;
          }

          .ficha-arquivos
          .painel-dano-cura__cabecalho h3 {
            width: fit-content;
            margin: 0;
            padding: 5px 14px;
            background: #17120e;
            color: #f5ead6;
            font-family:
              Georgia,
              "Times New Roman",
              serif;
            font-size: 0.92rem;
            letter-spacing: 0.3px;
            text-transform: uppercase;
          }

          .ficha-arquivos
          .painel-dano-cura__cabecalho p {
            margin: 0;
            color: #6a5139;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.56rem;
            line-height: 1.4;
          }

          .ficha-arquivos
          .painel-dano-cura__lista {
            display: grid;
            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );
            gap: 8px;
          }

          .ficha-arquivos
          .painel-dano-cura__recurso {
            --recurso-cor: #6c5740;
            --recurso-escura: #2e2117;
            --recurso-media: #59402d;
            --recurso-clara: #d6c2a0;
            --recurso-fundo:
              rgba(
                91,
                66,
                44,
                0.1
              );

            display: grid;
            gap: 7px;
            min-width: 0;
            padding: 9px;
            border: 1px solid
              var(--recurso-cor);
            border-left: 5px solid
              var(--recurso-cor);
            background:
              linear-gradient(
                135deg,
                var(--recurso-fundo),
                rgba(
                  255,
                  250,
                  237,
                  0.38
                )
              );
            box-shadow:
              inset 0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.16
              );
          }

          .ficha-arquivos
          .painel-dano-cura__recurso--pv {
            --recurso-cor: #9b3d37;
            --recurso-escura: #4b1715;
            --recurso-media: #7b2925;
            --recurso-clara: #d56a61;
            --recurso-fundo:
              rgba(
                155,
                61,
                55,
                0.13
              );
          }

          .ficha-arquivos
          .painel-dano-cura__recurso--pe {
            --recurso-cor: #3f6598;
            --recurso-escura: #172d4c;
            --recurso-media: #294d7a;
            --recurso-clara: #6f9bd3;
            --recurso-fundo:
              rgba(
                63,
                101,
                152,
                0.13
              );
          }

          .ficha-arquivos
          .painel-dano-cura__recurso--san {
            --recurso-cor: #705082;
            --recurso-escura: #2e1839;
            --recurso-media: #513363;
            --recurso-clara: #a77bbb;
            --recurso-fundo:
              rgba(
                112,
                80,
                130,
                0.14
              );
          }

          .ficha-arquivos
          .painel-dano-cura__recurso-cabecalho {
            display: flex;
            justify-content:
              space-between;
            align-items: center;
            gap: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid
              var(--recurso-cor);
          }

          .ficha-arquivos
          .painel-dano-cura__recurso-cabecalho div {
            display: grid;
            gap: 2px;
          }

          .ficha-arquivos
          .painel-dano-cura__recurso-cabecalho strong {
            color:
              var(--recurso-media);
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.78rem;
            font-weight: 900;
            text-shadow:
              0 1px 0
              rgba(
                255,
                255,
                255,
                0.4
              );
          }

          .ficha-arquivos
          .painel-dano-cura__recurso-cabecalho small {
            color: #765d43;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.5rem;
            font-weight: 700;
            text-transform: uppercase;
          }

          .ficha-arquivos
          .painel-dano-cura__valor {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 9px;
            border: 1px solid
              var(--recurso-cor);
            background:
              linear-gradient(
                180deg,
                rgba(
                  255,
                  252,
                  241,
                  0.75
                ),
                var(--recurso-fundo)
              );
            color:
              var(--recurso-escura);
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.7rem;
            font-weight: 900;
            white-space: nowrap;
          }

          .ficha-arquivos
          .painel-dano-cura__valor strong {
            color:
              var(--recurso-media);
            font-size: 0.77rem;
          }

          .ficha-arquivos
          .painel-dano-cura__controle {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              auto
              auto;
            gap: 6px;
            align-items: end;
          }

          .ficha-arquivos
          .painel-dano-cura__controle label {
            display: grid;
            gap: 3px;
            color:
              var(--recurso-media);
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.5rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .ficha-arquivos
          .painel-dano-cura__controle input {
            width: 100%;
            min-width: 0;
            min-height: 31px;
            padding: 5px 7px;
            border: 1px solid
              var(--recurso-cor);
            border-radius: 0;
            background:
              rgba(
                255,
                252,
                241,
                0.8
              );
            color:
              var(--recurso-escura);
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.65rem;
            font-weight: 900;
            outline: none;
          }

          .ficha-arquivos
          .painel-dano-cura__controle input:focus {
            border-color:
              var(--recurso-clara);
            box-shadow:
              0 0 0 2px
              var(--recurso-fundo);
          }

          .ficha-arquivos
          .painel-dano-cura__controle button {
            min-width: 67px;
            min-height: 31px;
            padding: 5px 7px;
            border-radius: 0;
            color: #fff7ea;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.48rem;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
          }

          .ficha-arquivos
          .painel-dano-cura__reduzir {
            border: 1px solid
              var(--recurso-escura);
            background:
              linear-gradient(
                180deg,
                var(--recurso-media),
                var(--recurso-escura)
              );
          }

          .ficha-arquivos
          .painel-dano-cura__reduzir:hover {
            border-color:
              var(--recurso-clara);
            background:
              linear-gradient(
                180deg,
                var(--recurso-cor),
                var(--recurso-media)
              );
          }

          .ficha-arquivos
          .painel-dano-cura__recuperar {
            border: 1px solid
              var(--recurso-media);
            background:
              linear-gradient(
                180deg,
                var(--recurso-clara),
                var(--recurso-media)
              );
            color:
              #fffaf2;
          }

          .ficha-arquivos
          .painel-dano-cura__recuperar:hover {
            border-color:
              var(--recurso-clara);
            background:
              linear-gradient(
                180deg,
                var(--recurso-clara),
                var(--recurso-cor)
              );
          }

          @media (max-width: 1050px) {
            .ficha-arquivos
            .painel-dano-cura__lista {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 700px) {
            .ficha-arquivos
            .painel-dano-cura__cabecalho {
              align-items: flex-start;
              flex-direction: column;
            }

            .ficha-arquivos
            .painel-dano-cura__controle {
              grid-template-columns:
                repeat(
                  2,
                  minmax(0, 1fr)
                );
            }

            .ficha-arquivos
            .painel-dano-cura__controle label {
              grid-column: 1 / -1;
            }

            .ficha-arquivos
            .painel-dano-cura__controle button {
              width: 100%;
              min-width: 0;
            }
          }
        `}
      </style>

      <section className="painel-dano-cura" data-assistente="ficha-dano-cura">
        <header className="painel-dano-cura__cabecalho">
          <h3>
            Ajuste rápido de recursos
          </h3>

          <p>
            Os valores ficam entre zero
            e o limite máximo.
          </p>
        </header>

        <div className="painel-dano-cura__lista">
          {recursos.map(
            (recurso) => (
              <article
                className={
                  `painel-dano-cura__recurso ${recurso.classe}`
                }
                key={recurso.id}
              >
                <header className="painel-dano-cura__recurso-cabecalho">
                  <div>
                    <strong>
                      {recurso.sigla}
                    </strong>

                    <small>
                      {recurso.nome}
                    </small>
                  </div>

                  <span className="painel-dano-cura__valor">
                    <strong>
                      {recurso.atual}
                    </strong>

                    <span>/</span>

                    <strong>
                      {recurso.maximo}
                    </strong>
                  </span>
                </header>

                <div className="painel-dano-cura__controle">
                  <label>
                    Quantidade

                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Valor"
                      value={
                        quantidades[
                          recurso.id
                        ]
                      }
                      onChange={(evento) =>
                        atualizarQuantidade(
                          recurso.id,
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <button
                    className="painel-dano-cura__reduzir"
                    type="button"
                    onClick={() =>
                      reduzirRecurso(
                        recurso,
                      )
                    }
                  >
                    {recurso.textoReduzir}
                  </button>

                  <button
                    className="painel-dano-cura__recuperar"
                    type="button"
                    onClick={() =>
                      recuperarRecurso(
                        recurso,
                      )
                    }
                  >
                    {recurso.textoRecuperar}
                  </button>
                </div>
              </article>
            ),
          )}
        </div>
      </section>
    </>
  );
}

export default PainelDanoCura;
