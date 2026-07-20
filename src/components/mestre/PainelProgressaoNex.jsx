import {
  useMemo,
} from "react";

import {
  obterFormulaProgressaoClasseArquivos,
  obterGanhosVisiveisMarcoArquivos,
  obterLinhaRecursosMarcoArquivos,
  obterMarcoAtualNexArquivos,
  obterProximoMarcoNexArquivos,
} from "../../data/progressaoNexArquivos.js";

function PainelProgressaoNex({
  ficha = {},
}) {
  const marcoAtual =
    useMemo(
      () =>
        obterMarcoAtualNexArquivos(
          ficha,
        ),
      [ficha],
    );

  const proximoMarco =
    useMemo(
      () =>
        obterProximoMarcoNexArquivos(
          marcoAtual,
        ),
      [marcoAtual],
    );

  const linhaRecursosAtual =
    useMemo(
      () =>
        obterLinhaRecursosMarcoArquivos(
          ficha,
          marcoAtual,
        ),
      [
        ficha,
        marcoAtual,
      ],
    );

  const ganhosAtuais =
    useMemo(
      () =>
        obterGanhosVisiveisMarcoArquivos(
          marcoAtual,
        ),
      [marcoAtual],
    );

  const ganhosProximoMarco =
    useMemo(
      () =>
        proximoMarco
          ? obterGanhosVisiveisMarcoArquivos(
              proximoMarco,
            )
          : [],
      [proximoMarco],
    );

  const formulaClasse =
    useMemo(
      () =>
        obterFormulaProgressaoClasseArquivos(
          ficha,
        ),
      [ficha],
    );

  return (
    <>
      <style>
        {`
          .ficha-arquivos
          .painel-progressao-nex {
            display: grid;
            gap: 14px;
            padding: 12px;
            border: 1px solid #6c5740;
            background:
              repeating-linear-gradient(
                0deg,
                rgba(80, 56, 33, 0.04)
                0 1px,
                transparent 1px 7px
              ),
              rgba(242, 232, 211, 0.58);
            box-shadow:
              inset 0 0 0 3px
              rgba(255, 251, 239, 0.22);
          }

          .ficha-arquivos
          .painel-progressao-nex__cabecalho {
            display: flex;
            justify-content:
              space-between;
            align-items: center;
            gap: 14px;
          }

          .ficha-arquivos
          .painel-progressao-nex__cabecalho h3 {
            width: fit-content;
            margin: 0;
            padding: 7px 20px;
            background: #17120e;
            color: #f5ead6;
            box-shadow:
              7px 5px 0
              rgba(89, 66, 44, 0.24);
            font-family:
              Georgia,
              "Times New Roman",
              serif;
            font-size: 1.15rem;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }

          .ficha-arquivos
          .painel-progressao-nex__nivel {
            display: grid;
            place-items: center;
            min-width: 88px;
            min-height: 54px;
            padding: 7px 14px;
            border: 2px solid #842d28;
            background:
              linear-gradient(
                180deg,
                rgba(146, 44, 39, 0.13),
                rgba(79, 29, 25, 0.05)
              );
            color: #842d28;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 1.2rem;
            font-weight: 900;
            transform: rotate(-2deg);
          }

          .ficha-arquivos
          .painel-progressao-nex__grade {
            display: grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
            gap: 12px;
          }

          .ficha-arquivos
          .painel-progressao-nex__cartao {
            display: grid;
            align-content: start;
            gap: 10px;
            min-width: 0;
            padding: 14px;
            border: 1px solid
              rgba(75, 54, 35, 0.5);
            background:
              repeating-linear-gradient(
                0deg,
                rgba(83, 57, 32, 0.035)
                0 1px,
                transparent 1px 7px
              ),
              rgba(250, 242, 224, 0.72);
          }

          .ficha-arquivos
          .painel-progressao-nex__cartao--atual {
            border-left: 5px solid
              #842d28;
            background:
              linear-gradient(
                90deg,
                rgba(132, 45, 40, 0.1),
                transparent 55px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(83, 57, 32, 0.035)
                0 1px,
                transparent 1px 7px
              ),
              rgba(250, 242, 224, 0.76);
          }

          .ficha-arquivos
          .painel-progressao-nex__cartao--proximo {
            border-left: 5px solid
              #94712d;
            background:
              linear-gradient(
                90deg,
                rgba(148, 113, 45, 0.1),
                transparent 55px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(83, 57, 32, 0.035)
                0 1px,
                transparent 1px 7px
              ),
              rgba(250, 242, 224, 0.76);
          }

          .ficha-arquivos
          .painel-progressao-nex__cartao header {
            display: flex;
            justify-content:
              space-between;
            align-items: center;
            gap: 12px;
            padding-bottom: 9px;
            border-bottom: 1px solid
              rgba(77, 53, 34, 0.35);
          }

          .ficha-arquivos
          .painel-progressao-nex__cartao h4 {
            margin: 0;
            color: #2c1e14;
            font-family:
              Georgia,
              "Times New Roman",
              serif;
            font-size: 1rem;
            text-transform: uppercase;
          }

          .ficha-arquivos
          .painel-progressao-nex__marco {
            flex: 0 0 auto;
            padding: 5px 9px;
            border: 1px solid
              rgba(70, 45, 28, 0.52);
            background: #2a1b12;
            color: #f4e4c5;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.7rem;
            font-weight: 900;
          }

          .ficha-arquivos
          .painel-progressao-nex__recursos {
            margin: 0;
            padding: 10px;
            border-left: 4px solid
              #842d28;
            background:
              rgba(132, 45, 40, 0.07);
            color: #4b3727;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.7rem;
            font-weight: 700;
            line-height: 1.6;
          }

          .ficha-arquivos
          .painel-progressao-nex__lista {
            display: grid;
            gap: 7px;
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .ficha-arquivos
          .painel-progressao-nex__lista li {
            position: relative;
            padding: 8px 8px 8px 24px;
            border: 1px solid
              rgba(77, 53, 34, 0.2);
            background:
              rgba(255, 251, 239, 0.42);
            color: #443223;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.69rem;
            line-height: 1.5;
          }

          .ficha-arquivos
          .painel-progressao-nex__lista li::before {
            content: "◆";
            position: absolute;
            top: 8px;
            left: 8px;
            color: #842d28;
            font-size: 0.58rem;
          }

          .ficha-arquivos
          .painel-progressao-nex__cartao--proximo
          .painel-progressao-nex__lista li::before {
            color: #94712d;
          }

          .ficha-arquivos
          .painel-progressao-nex__sem-marco {
            margin: 0;
            padding: 14px;
            border: 1px dashed
              rgba(66, 46, 29, 0.5);
            color: #624c36;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.72rem;
            line-height: 1.55;
          }

          .ficha-arquivos
          .painel-progressao-nex__formula {
            margin: 0;
            padding: 12px;
            border: 1px dashed
              rgba(65, 45, 28, 0.5);
            background:
              rgba(255, 249, 234, 0.36);
            color: #5a4430;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.67rem;
            line-height: 1.6;
          }

          .ficha-arquivos
          .painel-progressao-nex__formula strong {
            color: #2c1e14;
            text-transform: uppercase;
          }

          @media (max-width: 800px) {
            .ficha-arquivos
            .painel-progressao-nex__grade {
              grid-template-columns: 1fr;
            }

            .ficha-arquivos
            .painel-progressao-nex__cabecalho {
              align-items: flex-start;
            }
          }
        `}
      </style>

      <section className="painel-progressao-nex" data-assistente="ficha-progressao">
        <header className="painel-progressao-nex__cabecalho">
          <h3>
            Progressão de NEX
          </h3>

          <strong className="painel-progressao-nex__nivel">
            NEX {marcoAtual.nex}%
          </strong>
        </header>

        <div className="painel-progressao-nex__grade">
          <article className="painel-progressao-nex__cartao painel-progressao-nex__cartao--atual">
            <header>
              <h4>
                Marco atual
              </h4>

              <span className="painel-progressao-nex__marco">
                {marcoAtual.nex}%
              </span>
            </header>

            <p className="painel-progressao-nex__recursos">
              {linhaRecursosAtual}
            </p>

            {ganhosAtuais.length > 0 ? (
              <ul className="painel-progressao-nex__lista">
                {ganhosAtuais.map(
                  (ganho) => (
                    <li key={ganho}>
                      {ganho}
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="painel-progressao-nex__sem-marco">
                Este marco não possui outra
                escolha manual registrada.
              </p>
            )}
          </article>

          <article className="painel-progressao-nex__cartao painel-progressao-nex__cartao--proximo">
            <header>
              <h4>
                Próximo marco
              </h4>

              <span className="painel-progressao-nex__marco">
                {proximoMarco
                  ? `${proximoMarco.nex}%`
                  : "Limite"}
              </span>
            </header>

            {proximoMarco ? (
              ganhosProximoMarco.length >
              0 ? (
                <ul className="painel-progressao-nex__lista">
                  {ganhosProximoMarco.map(
                    (ganho) => (
                      <li key={ganho}>
                        {ganho}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="painel-progressao-nex__sem-marco">
                  O próximo marco atualiza os
                  recursos máximos da ficha.
                </p>
              )
            ) : (
              <p className="painel-progressao-nex__sem-marco">
                A ficha já está no último
                marco de NEX cadastrado.
              </p>
            )}
          </article>
        </div>

        <p className="painel-progressao-nex__formula">
          <strong>
            Crescimento da classe:
          </strong>{" "}
          {formulaClasse}
        </p>
      </section>
    </>
  );
}

export default PainelProgressaoNex;
