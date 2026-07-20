import {
  useMemo,
  useState,
} from "react";

import {
  criarHabilidadeManualArquivos,
  obterHabilidadesAutomaticasArquivos,
  obterHabilidadesDisponiveisArquivos,
} from "../../data/habilidadesArquivos.js";

function criarIdHabilidade() {
  return `habilidade-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function normalizarHabilidadesFicha(
  habilidadesRecebidas,
) {
  if (
    Array.isArray(
      habilidadesRecebidas,
    )
  ) {
    return habilidadesRecebidas.map(
      (habilidade) => ({
        id:
          habilidade?.id ||
          criarIdHabilidade(),
        nome:
          habilidade?.nome ||
          "Habilidade sem nome",
        tipo:
          habilidade?.tipo ||
          "Habilidade manual",
        descricao:
          habilidade?.descricao ||
          "",
        automatica: false,
        ...habilidade,
        automatica: false,
      }),
    );
  }

  const texto =
    String(
      habilidadesRecebidas || "",
    ).trim();

  if (!texto) {
    return [];
  }

  return texto
    .split("\n")
    .map((linha) =>
      linha.trim(),
    )
    .filter(Boolean)
    .map((linha) =>
      criarHabilidadeManualArquivos({
        id: criarIdHabilidade(),
        nome: linha,
        descricao: "",
        automatica: false,
      }),
    );
}

function habilidadePodeSerEscolhida(
  habilidade,
) {
  const tiposQueNaoSaoHabilidades =
    new Set([
      "Origem escolhida",
      "Classe escolhida",
      "Trilha escolhida",
      "Marco de NEX",
    ]);

  return !tiposQueNaoSaoHabilidades.has(
    habilidade.tipo,
  );
}

function PainelHabilidades({
  ficha = {},
  habilidades = [],
  aoAlterarHabilidades,
}) {
  const [
    habilidadeSelecionada,
    setHabilidadeSelecionada,
  ] = useState("");

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false);

  const [
    novaHabilidade,
    setNovaHabilidade,
  ] = useState({
    nome: "",
    tipo: "Habilidade manual",
    descricao: "",
  });

  const habilidadesAdicionadas =
    useMemo(
      () =>
        normalizarHabilidadesFicha(
          habilidades,
        ),
      [habilidades],
    );

  const habilidadesLiberadas =
    useMemo(() => {
      const habilidadesDasRegras = [
        ...obterHabilidadesAutomaticasArquivos(
          ficha,
        ),
        ...obterHabilidadesDisponiveisArquivos(
          ficha,
        ),
      ].filter(
        habilidadePodeSerEscolhida,
      );

      const idsAdicionados =
        new Set(
          habilidadesAdicionadas.map(
            (habilidade) =>
              habilidade.id,
          ),
        );

      const nomesAdicionados =
        new Set(
          habilidadesAdicionadas.map(
            (habilidade) =>
              String(
                habilidade.nome || "",
              )
                .toLowerCase()
                .trim(),
          ),
        );

      const idsEncontrados =
        new Set();

      return habilidadesDasRegras.filter(
        (habilidade) => {
          const nomeNormalizado =
            String(
              habilidade.nome || "",
            )
              .toLowerCase()
              .trim();

          if (
            idsEncontrados.has(
              habilidade.id,
            )
          ) {
            return false;
          }

          idsEncontrados.add(
            habilidade.id,
          );

          if (
            idsAdicionados.has(
              habilidade.id,
            )
          ) {
            return false;
          }

          if (
            nomesAdicionados.has(
              nomeNormalizado,
            )
          ) {
            return false;
          }

          return true;
        },
      );
    }, [
      ficha,
      habilidadesAdicionadas,
    ]);

  function enviarHabilidades(
    novaLista,
  ) {
    if (
      typeof aoAlterarHabilidades ===
      "function"
    ) {
      aoAlterarHabilidades(
        novaLista,
      );
    }
  }

  function adicionarDoCatalogo() {
    const habilidade =
      habilidadesLiberadas.find(
        (item) =>
          item.id ===
          habilidadeSelecionada,
      );

    if (!habilidade) {
      return;
    }

    const habilidadeAdicionada =
      criarHabilidadeManualArquivos({
        ...habilidade,
        automatica: false,
      });

    enviarHabilidades([
      ...habilidadesAdicionadas,
      habilidadeAdicionada,
    ]);

    setHabilidadeSelecionada("");
  }

  function atualizarCampoManual(
    campo,
    valor,
  ) {
    setNovaHabilidade(
      (anterior) => ({
        ...anterior,
        [campo]: valor,
      }),
    );
  }

  function adicionarManual(
    evento,
  ) {
    evento.preventDefault();

    const nome =
      novaHabilidade.nome.trim();

    if (!nome) {
      return;
    }

    enviarHabilidades([
      ...habilidadesAdicionadas,
      criarHabilidadeManualArquivos({
        nome,
        tipo:
          novaHabilidade.tipo.trim() ||
          "Habilidade manual",
        descricao:
          novaHabilidade.descricao.trim(),
        automatica: false,
      }),
    ]);

    setNovaHabilidade({
      nome: "",
      tipo: "Habilidade manual",
      descricao: "",
    });

    setMostrarFormulario(false);
  }

  function removerHabilidade(
    habilidadeId,
  ) {
    enviarHabilidades(
      habilidadesAdicionadas.filter(
        (habilidade) =>
          habilidade.id !==
          habilidadeId,
      ),
    );
  }

  return (
    <>
      <style>
        {`
          .ficha-arquivos .painel-habilidades {
            display: grid;
            gap: 14px;
            padding: 12px;
            border: 1px solid #6c5740;
            background:
              repeating-linear-gradient(
                0deg,
                rgba(80, 56, 33, 0.04) 0 1px,
                transparent 1px 7px
              ),
              rgba(242, 232, 211, 0.58);
            box-shadow:
              inset 0 0 0 3px
              rgba(255, 251, 239, 0.22);
          }

          .ficha-arquivos
          .painel-habilidades__cabecalho {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
          }

          .ficha-arquivos
          .painel-habilidades__cabecalho h3 {
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
          .painel-habilidades__cabecalho button,
          .ficha-arquivos
          .painel-habilidades__catalogo button,
          .ficha-arquivos
          .painel-habilidades__formulario button {
            min-height: 32px;
            padding: 5px 12px;
            border: 1px solid #24170e;
            border-radius: 0;
            background:
              linear-gradient(
                180deg,
                #3b291d,
                #1d120b
              );
            color: #fff1d5;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.62rem;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
          }

          .ficha-arquivos
          .painel-habilidades__cabecalho button:hover,
          .ficha-arquivos
          .painel-habilidades__catalogo button:hover,
          .ficha-arquivos
          .painel-habilidades__formulario button:hover {
            background: #922c27;
          }

          .ficha-arquivos
          .painel-habilidades__catalogo {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              auto;
            gap: 10px;
            align-items: end;
            padding: 12px;
            border: 1px dashed
              rgba(65, 45, 28, 0.5);
            background:
              rgba(255, 249, 234, 0.34);
          }

          .ficha-arquivos
          .painel-habilidades__catalogo button:disabled {
            cursor: not-allowed;
            opacity: 0.45;
          }

          .ficha-arquivos
          .painel-habilidades__formulario {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              minmax(0, 1fr);
            gap: 10px;
            padding: 12px;
            border: 1px dashed
              rgba(65, 45, 28, 0.55);
            background:
              rgba(255, 249, 234, 0.4);
          }

          .ficha-arquivos
          .painel-habilidades__descricao {
            grid-column: 1 / -1;
          }

          .ficha-arquivos
          .painel-habilidades__formulario button {
            grid-column: 1 / -1;
            justify-self: end;
          }

          .ficha-arquivos
          .painel-habilidades__lista {
            display: grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
            gap: 10px;
          }

          .ficha-arquivos
          .painel-habilidades__cartao {
            display: grid;
            align-content: start;
            gap: 8px;
            min-width: 0;
            padding: 12px;
            border: 1px solid
              rgba(75, 54, 35, 0.56);
            border-left: 4px solid
              #7b2824;
            background:
              linear-gradient(
                90deg,
                rgba(146, 44, 39, 0.1),
                transparent 35px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(83, 57, 32, 0.035)
                0 1px,
                transparent 1px 7px
              ),
              rgba(250, 242, 224, 0.7);
          }

          .ficha-arquivos
          .painel-habilidades__cartao header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
            padding-bottom: 7px;
            border-bottom: 1px solid
              rgba(77, 53, 34, 0.36);
          }

          .ficha-arquivos
          .painel-habilidades__cartao header > div {
            display: grid;
            gap: 3px;
          }

          .ficha-arquivos
          .painel-habilidades__cartao strong {
            color: #271b12;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.76rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .ficha-arquivos
          .painel-habilidades__cartao span {
            color: #725a40;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.58rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .ficha-arquivos
          .painel-habilidades__cartao p {
            margin: 0;
            color: #463525;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.7rem;
            line-height: 1.55;
          }

          .ficha-arquivos
          .painel-habilidades__cartao header button {
            min-height: 27px;
            padding: 3px 7px;
            border: 1px solid #24170e;
            border-radius: 0;
            background:
              linear-gradient(
                180deg,
                #3b291d,
                #1d120b
              );
            color: #fff1d5;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.52rem;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
          }

          .ficha-arquivos
          .painel-habilidades__cartao header button:hover {
            background: #922c27;
          }

          .ficha-arquivos
          .painel-habilidades__vazio {
            margin: 0;
            padding: 16px;
            border: 1px dashed
              rgba(66, 46, 29, 0.5);
            color: #624c36;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.72rem;
          }

          @media (max-width: 800px) {
            .ficha-arquivos
            .painel-habilidades__lista {
              grid-template-columns: 1fr;
            }

            .ficha-arquivos
            .painel-habilidades__catalogo {
              grid-template-columns: 1fr;
            }

            .ficha-arquivos
            .painel-habilidades__catalogo button {
              width: 100%;
            }

            .ficha-arquivos
            .painel-habilidades__formulario {
              grid-template-columns: 1fr;
            }

            .ficha-arquivos
            .painel-habilidades__descricao,
            .ficha-arquivos
            .painel-habilidades__formulario button {
              grid-column: auto;
            }
          }
        `}
      </style>

      <section className="painel-habilidades" data-assistente="ficha-habilidades">
        <header className="painel-habilidades__cabecalho">
          <h3>
            Talentos / Habilidades
          </h3>

          <button
            type="button"
            onClick={() =>
              setMostrarFormulario(
                (valorAtual) =>
                  !valorAtual,
              )
            }
          >
            Adicionar manual
          </button>
        </header>

        {habilidadesLiberadas.length >
        0 ? (
          <div className="painel-habilidades__catalogo">
            <label>
              Habilidade liberada pelas regras

              <select
                value={
                  habilidadeSelecionada
                }
                onChange={(evento) =>
                  setHabilidadeSelecionada(
                    evento.target.value,
                  )
                }
              >
                <option value="">
                  Escolha uma habilidade
                </option>

                {habilidadesLiberadas.map(
                  (habilidade) => (
                    <option
                      value={
                        habilidade.id
                      }
                      key={
                        habilidade.id
                      }
                    >
                      {habilidade.nome} —{" "}
                      {habilidade.tipo}
                    </option>
                  ),
                )}
              </select>
            </label>

            <button
              type="button"
              disabled={
                !habilidadeSelecionada
              }
              onClick={
                adicionarDoCatalogo
              }
            >
              Adicionar habilidade
            </button>
          </div>
        ) : null}

        {mostrarFormulario ? (
          <form
            className="painel-habilidades__formulario"
            onSubmit={adicionarManual}
          >
            <label>
              Nome

              <input
                type="text"
                maxLength={70}
                value={
                  novaHabilidade.nome
                }
                onChange={(evento) =>
                  atualizarCampoManual(
                    "nome",
                    evento.target.value,
                  )
                }
              />
            </label>

            <label>
              Tipo

              <input
                type="text"
                maxLength={50}
                value={
                  novaHabilidade.tipo
                }
                onChange={(evento) =>
                  atualizarCampoManual(
                    "tipo",
                    evento.target.value,
                  )
                }
              />
            </label>

            <label className="painel-habilidades__descricao">
              Descrição

              <textarea
                rows="3"
                maxLength={500}
                value={
                  novaHabilidade.descricao
                }
                onChange={(evento) =>
                  atualizarCampoManual(
                    "descricao",
                    evento.target.value,
                  )
                }
              />
            </label>

            <button type="submit">
              Salvar habilidade
            </button>
          </form>
        ) : null}

        <div className="painel-habilidades__lista">
          {habilidadesAdicionadas.map(
            (habilidade) => (
              <article
                className="painel-habilidades__cartao"
                key={habilidade.id}
              >
                <header>
                  <div>
                    <strong>
                      {habilidade.nome}
                    </strong>

                    <span>
                      {habilidade.tipo}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removerHabilidade(
                        habilidade.id,
                      )
                    }
                  >
                    Remover
                  </button>
                </header>

                <p>
                  {habilidade.descricao ||
                    "Nenhuma descrição informada."}
                </p>
              </article>
            ),
          )}
        </div>

        {habilidadesAdicionadas.length ===
        0 ? (
          <p className="painel-habilidades__vazio">
            Nenhuma habilidade adicionada.
            Escolha uma habilidade liberada
            pelas regras e pressione
            “Adicionar habilidade”.
          </p>
        ) : null}
      </section>
    </>
  );
}

export default PainelHabilidades;
