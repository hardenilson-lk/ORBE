import {
  useMemo,
  useState,
} from "react";

import {
  criarHabilidadeManualArquivos,
  obterHabilidadesAutomaticasArquivos,
  obterHabilidadesDisponiveisArquivos,
} from "../../data/habilidadesArquivos.js";

const MARCOS_PODER_CLASSE = [
  15,
  30,
  45,
  60,
  75,
  90,
];

function criarIdHabilidade() {
  return `habilidade-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function lerValorNex(valor) {
  const encontrado =
    String(valor || "").match(
      /\d+/,
    );

  return Math.max(
    0,
    Number(
      encontrado?.[0],
    ) || 5,
  );
}

function obterLimitePoderesClasse(
  ficha = {},
) {
  const nex =
    lerValorNex(
      ficha.nex,
    );

  const poderesPorNex =
    MARCOS_PODER_CLASSE.filter(
      (marco) =>
        nex >= marco,
    ).length;

  const bonusVersatilidade =
    nex >= 50 &&
    (
      ficha.versatilidadePoder ===
        true ||
      ficha.versatilidadeEscolha ===
        "poder"
    )
      ? 1
      : 0;

  return (
    poderesPorNex +
    bonusVersatilidade
  );
}

function habilidadeContaComoPoder(
  habilidade = {},
) {
  if (
    !habilidade ||
    typeof habilidade !==
      "object"
  ) {
    return false;
  }

  if (
    habilidade.automatica ===
    true
  ) {
    return false;
  }

  const tipo =
    normalizarTexto(
      habilidade.tipo,
    );

  if (
    tipo ===
    "poder de origem"
  ) {
    return false;
  }

  return (
    tipo === "poder" ||
    tipo ===
      "poder de combatente" ||
    tipo ===
      "poder de especialista" ||
    tipo ===
      "poder de ocultista" ||
    tipo ===
      "poder de classe" ||
    tipo.startsWith(
      "poder escolhido",
    )
  );
}

function criarChaveHabilidade(
  habilidade = {},
) {
  return [
    normalizarTexto(
      habilidade.id,
    ),
    normalizarTexto(
      habilidade.nome,
    ),
  ].join(":");
}

function removerHabilidadesRepetidas(
  habilidades = [],
) {
  const idsEncontrados =
    new Set();

  const nomesEncontrados =
    new Set();

  return habilidades.filter(
    (habilidade) => {
      const id =
        normalizarTexto(
          habilidade?.id,
        );

      const nome =
        normalizarTexto(
          habilidade?.nome,
        );

      if (
        id &&
        idsEncontrados.has(id)
      ) {
        return false;
      }

      if (
        nome &&
        nomesEncontrados.has(nome)
      ) {
        return false;
      }

      if (id) {
        idsEncontrados.add(id);
      }

      if (nome) {
        nomesEncontrados.add(
          nome,
        );
      }

      return true;
    },
  );
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
        ...habilidade,

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

        automatica:
          habilidade?.automatica ===
          true,
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
        id:
          criarIdHabilidade(),

        nome:
          linha,

        descricao:
          "",

        automatica:
          false,
      }),
    );
}

function habilidadePodeSerExibida(
  habilidade,
) {
  const tiposInformativos =
    new Set([
      "Origem escolhida",
      "Classe escolhida",
      "Trilha escolhida",
      "Marco de NEX",
    ]);

  if (
    tiposInformativos.has(
      habilidade?.tipo,
    )
  ) {
    return false;
  }

  /*
   * Escolhido pelo Outro Lado já
   * representa a capacidade do
   * Ocultista de aprender e conjurar
   * rituais.
   */
  if (
    habilidade?.id ===
    "conjurar-ritual"
  ) {
    return false;
  }

  return true;
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
    mensagemLimite,
    setMensagemLimite,
  ] = useState("");

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
        ).filter(
          (habilidade) =>
            habilidade.automatica !==
            true,
        ),
      [habilidades],
    );

  const habilidadesAutomaticas =
    useMemo(
      () =>
        removerHabilidadesRepetidas(
          obterHabilidadesAutomaticasArquivos(
            ficha,
          )
            .filter(
              habilidadePodeSerExibida,
            )
            .map(
              (habilidade) => ({
                ...habilidade,
                automatica: true,
              }),
            ),
        ),
      [ficha],
    );

  const poderesEscolhidos =
    useMemo(
      () =>
        habilidadesAdicionadas.filter(
          habilidadeContaComoPoder,
        ),
      [habilidadesAdicionadas],
    );

  const limitePoderes =
    obterLimitePoderesClasse(
      ficha,
    );

  const quantidadePoderes =
    poderesEscolhidos.length;

  const poderesExcedentes =
    Math.max(
      0,
      quantidadePoderes -
        limitePoderes,
    );

  const limitePoderesAtingido =
    quantidadePoderes >=
    limitePoderes;

  const habilidadesLiberadas =
    useMemo(() => {
      const habilidadesJaPresentes = [
        ...habilidadesAutomaticas,
        ...habilidadesAdicionadas,
      ];

      const idsPresentes =
        new Set(
          habilidadesJaPresentes
            .map(
              (habilidade) =>
                normalizarTexto(
                  habilidade.id,
                ),
            )
            .filter(Boolean),
        );

      const nomesPresentes =
        new Set(
          habilidadesJaPresentes
            .map(
              (habilidade) =>
                normalizarTexto(
                  habilidade.nome,
                ),
            )
            .filter(Boolean),
        );

      return removerHabilidadesRepetidas(
        obterHabilidadesDisponiveisArquivos(
          ficha,
        )
          .filter(
            habilidadePodeSerExibida,
          )
          .filter(
            (habilidade) => {
              const id =
                normalizarTexto(
                  habilidade.id,
                );

              const nome =
                normalizarTexto(
                  habilidade.nome,
                );

              if (
                id &&
                idsPresentes.has(id)
              ) {
                return false;
              }

              if (
                nome &&
                nomesPresentes.has(
                  nome,
                )
              ) {
                return false;
              }

              return true;
            },
          ),
      );
    }, [
      ficha,
      habilidadesAutomaticas,
      habilidadesAdicionadas,
    ]);

  const habilidadeSelecionadaCompleta =
    habilidadesLiberadas.find(
      (habilidade) =>
        habilidade.id ===
        habilidadeSelecionada,
    ) || null;

  const selecaoContaComoPoder =
    habilidadeContaComoPoder(
      habilidadeSelecionadaCompleta,
    );

  const selecaoBloqueadaPorLimite =
    selecaoContaComoPoder &&
    limitePoderesAtingido;

  const habilidadesExibidas =
    useMemo(
      () =>
        removerHabilidadesRepetidas([
          ...habilidadesAutomaticas,
          ...habilidadesAdicionadas,
        ]),
      [
        habilidadesAutomaticas,
        habilidadesAdicionadas,
      ],
    );

  function enviarHabilidades(
    novaLista,
  ) {
    if (
      typeof aoAlterarHabilidades !==
      "function"
    ) {
      return;
    }

    const habilidadesManuais =
      normalizarHabilidadesFicha(
        novaLista,
      ).filter(
        (habilidade) =>
          habilidade.automatica !==
          true,
      );

    aoAlterarHabilidades(
      habilidadesManuais,
    );
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

    if (
      habilidadeContaComoPoder(
        habilidade,
      ) &&
      limitePoderesAtingido
    ) {
      setMensagemLimite(
        limitePoderes === 0
          ? `A classe ${ficha.classe || "selecionada"} ainda não recebeu uma escolha de poder neste NEX.`
          : `O limite de ${limitePoderes} poder(es) para o NEX ${ficha.nex || "5%"} já foi atingido.`,
      );

      return;
    }

    const habilidadeAdicionada =
      criarHabilidadeManualArquivos({
        ...habilidade,

        automatica:
          false,

        adicionadaPelasRegras:
          true,
      });

    enviarHabilidades([
      ...habilidadesAdicionadas,
      habilidadeAdicionada,
    ]);

    setHabilidadeSelecionada(
      "",
    );

    setMensagemLimite(
      "",
    );
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

  function adicionarManual() {
    const nome =
      novaHabilidade.nome.trim();

    if (!nome) {
      return;
    }

    const habilidadeManual =
      criarHabilidadeManualArquivos({
        nome,

        tipo:
          novaHabilidade.tipo.trim() ||
          "Habilidade manual",

        descricao:
          novaHabilidade.descricao.trim(),

        automatica:
          false,
      });

    if (
      habilidadeContaComoPoder(
        habilidadeManual,
      ) &&
      limitePoderesAtingido
    ) {
      setMensagemLimite(
        limitePoderes === 0
          ? "Esta ficha ainda não possui uma escolha de poder liberada pelo NEX."
          : `O limite de ${limitePoderes} poder(es) já foi atingido.`,
      );

      return;
    }

    enviarHabilidades([
      ...habilidadesAdicionadas,
      habilidadeManual,
    ]);

    setNovaHabilidade({
      nome: "",
      tipo: "Habilidade manual",
      descricao: "",
    });

    setMostrarFormulario(
      false,
    );

    setMensagemLimite(
      "",
    );
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

    setMensagemLimite(
      "",
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
          .painel-habilidades__limite {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 9px 12px;
            border: 1px solid
              rgba(83, 59, 35, 0.46);
            background:
              rgba(255, 249, 234, 0.46);
            color: #463525;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.68rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .ficha-arquivos
          .painel-habilidades__limite strong {
            color: #633d18;
            font-size: 0.76rem;
          }

          .ficha-arquivos
          .painel-habilidades__limite--erro {
            border-color: #922c27;
            background:
              rgba(146, 44, 39, 0.12);
            color: #7b211e;
          }

          .ficha-arquivos
          .painel-habilidades__limite--erro strong {
            color: #922c27;
          }

          .ficha-arquivos
          .painel-habilidades__aviso {
            margin: 0;
            padding: 10px 12px;
            border: 1px dashed #922c27;
            background:
              rgba(146, 44, 39, 0.1);
            color: #7b211e;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.68rem;
            font-weight: 900;
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
          .painel-habilidades__cartao--automatica {
            border-left-color: #8b6a22;
            background:
              linear-gradient(
                90deg,
                rgba(180, 137, 46, 0.15),
                transparent 40px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(83, 57, 32, 0.035)
                0 1px,
                transparent 1px 7px
              ),
              rgba(250, 242, 224, 0.78);
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
          .painel-habilidades__selo-automatico {
            width: fit-content;
            padding: 2px 6px;
            border: 1px solid
              rgba(111, 78, 22, 0.55);
            background:
              rgba(190, 147, 53, 0.16);
            color: #62460e;
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
          .painel-habilidades__detalhes {
            padding-top: 6px;
            border-top: 1px dashed
              rgba(77, 53, 34, 0.3);
            color: #725a40 !important;
            font-size: 0.62rem !important;
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

            .ficha-arquivos
            .painel-habilidades__limite {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>

      <section
        className="painel-habilidades"
        data-assistente="ficha-habilidades"
      >
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

        <div
          className={
            poderesExcedentes > 0
              ? "painel-habilidades__limite painel-habilidades__limite--erro"
              : "painel-habilidades__limite"
          }
        >
          <span>
            Poderes escolhidos pelo NEX
          </span>

          <strong>
            {quantidadePoderes} /{" "}
            {limitePoderes}
          </strong>
        </div>

        {poderesExcedentes > 0 ? (
          <p className="painel-habilidades__aviso">
            Remova{" "}
            {poderesExcedentes}{" "}
            {poderesExcedentes === 1
              ? "poder"
              : "poderes"}{" "}
            para regularizar a ficha.
          </p>
        ) : null}

        {mensagemLimite ? (
          <p
            className="painel-habilidades__aviso"
            role="status"
          >
            {mensagemLimite}
          </p>
        ) : null}

        {habilidadesLiberadas.length >
        0 ? (
          <div className="painel-habilidades__catalogo">
            <label>
              Habilidade liberada pelas regras

              <select
                value={
                  habilidadeSelecionada
                }
                onChange={(evento) => {
                  setHabilidadeSelecionada(
                    evento.target.value,
                  );

                  setMensagemLimite(
                    "",
                  );
                }}
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
                        criarChaveHabilidade(
                          habilidade,
                        )
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
                !habilidadeSelecionada ||
                selecaoBloqueadaPorLimite
              }
              onClick={
                adicionarDoCatalogo
              }
            >
              {selecaoBloqueadaPorLimite
                ? "Limite atingido"
                : "Adicionar habilidade"}
            </button>
          </div>
        ) : null}

        {mostrarFormulario ? (
          <div className="painel-habilidades__formulario">
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

            <button
              type="button"
              onClick={
                adicionarManual
              }
            >
              Salvar habilidade
            </button>
          </div>
        ) : null}

        <div className="painel-habilidades__lista">
          {habilidadesExibidas.map(
            (habilidade) => {
              const automatica =
                habilidade.automatica ===
                true;

              return (
                <article
                  className={
                    automatica
                      ? "painel-habilidades__cartao painel-habilidades__cartao--automatica"
                      : "painel-habilidades__cartao"
                  }
                  key={
                    criarChaveHabilidade(
                      habilidade,
                    )
                  }
                >
                  <header>
                    <div>
                      <strong>
                        {habilidade.nome}
                      </strong>

                      <span>
                        {habilidade.tipo}
                      </span>

                      {automatica ? (
                        <span className="painel-habilidades__selo-automatico">
                          Concedida automaticamente
                        </span>
                      ) : null}
                    </div>

                    {!automatica ? (
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
                    ) : null}
                  </header>

                  <p>
                    {habilidade.descricao ||
                      "Nenhuma descrição informada."}
                  </p>

                  {habilidade.detalhes ? (
                    <p className="painel-habilidades__detalhes">
                      {habilidade.detalhes}
                    </p>
                  ) : null}
                </article>
              );
            },
          )}
        </div>

        {habilidadesExibidas.length ===
        0 ? (
          <p className="painel-habilidades__vazio">
            Nenhuma habilidade disponível
            para esta ficha.
          </p>
        ) : null}
      </section>
    </>
  );
}

export default PainelHabilidades;