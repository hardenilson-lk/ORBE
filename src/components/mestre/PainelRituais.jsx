import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  RITUAIS_ARQUIVOS,
  criarRitualManualArquivos,
  fichaPodeUsarRituaisArquivos,
  obterCirculoMaximoRituaisArquivos,
  obterRituaisDisponiveisArquivos,
} from "../../data/rituaisArquivos.js";

function criarIdRitual() {
  return `ritual-${Date.now()}-${Math.random()
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

function textoPreenchido(valor) {
  return String(valor || "").trim();
}

function encontrarRitualCatalogo(
  ritual = {},
) {
  const id = String(
    ritual?.id || "",
  );

  const nome = normalizarTexto(
    ritual?.nome || ritual,
  );

  return (
    RITUAIS_ARQUIVOS.find(
      (item) =>
        id &&
        item.id === id,
    ) ||
    RITUAIS_ARQUIVOS.find(
      (item) =>
        normalizarTexto(
          item.nome,
        ) === nome,
    ) ||
    null
  );
}

function enriquecerRitualSalvo(
  ritual = {},
) {
  const ritualCatalogo =
    encontrarRitualCatalogo(
      ritual,
    );

  if (!ritualCatalogo) {
    return ritual;
  }

  const ritualEnriquecido = {
    ...ritualCatalogo,
    ...ritual,
  };

  const camposTexto = [
    "tipo",
    "custo",
    "elemento",
    "resumo",
    "descricao",
    "execucao",
    "alcance",
    "alvo",
    "area",
    "alvoOuArea",
    "efeito",
    "duracao",
    "resistencia",
    "requisito",
    "descricaoCompleta",
    "discenteCusto",
    "discente",
    "verdadeiroCusto",
    "verdadeiro",
    "textoCompleto",
  ];

  camposTexto.forEach(
    (campo) => {
      if (
        !textoPreenchido(
          ritual?.[campo],
        ) &&
        textoPreenchido(
          ritualCatalogo?.[campo],
        )
      ) {
        ritualEnriquecido[campo] =
          ritualCatalogo[campo];
      }
    },
  );

  return ritualEnriquecido;
}

export function normalizarRituaisFicha(
  rituaisRecebidos,
) {
  if (
    Array.isArray(
      rituaisRecebidos,
    )
  ) {
    return rituaisRecebidos.map(
      (ritual) => {
        if (
          typeof ritual ===
          "string"
        ) {
          const ritualCatalogo =
            encontrarRitualCatalogo(
              ritual,
            );

          return criarRitualManualArquivos({
            ...(ritualCatalogo ||
              {}),

            id:
              ritualCatalogo?.id ||
              criarIdRitual(),

            nome: ritual,

            automatico: false,
          });
        }

        const ritualEnriquecido =
          enriquecerRitualSalvo(
            ritual,
          );

        return criarRitualManualArquivos({
          ...ritualEnriquecido,

          id:
            ritual?.id ||
            ritualEnriquecido?.id ||
            criarIdRitual(),

          automatico: false,
        });
      },
    );
  }

  const texto = String(
    rituaisRecebidos || "",
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
    .map((linha) => {
      const ritualCatalogo =
        encontrarRitualCatalogo(
          linha,
        );

      return criarRitualManualArquivos({
        ...(ritualCatalogo ||
          {}),

        id:
          ritualCatalogo?.id ||
          criarIdRitual(),

        nome: linha,

        automatico: false,
      });
    });
}

function obterAlvoAreaOuEfeito(
  ritual = {},
) {
  return (
    textoPreenchido(
      ritual.alvoOuArea,
    ) ||
    textoPreenchido(
      ritual.alvo,
    ) ||
    textoPreenchido(
      ritual.area,
    ) ||
    textoPreenchido(
      ritual.efeito,
    ) ||
    "Não informado"
  );
}

function obterResumoRitual(
  ritual = {},
) {
  return (
    textoPreenchido(
      ritual.resumo,
    ) ||
    textoPreenchido(
      ritual.descricao,
    ) ||
    "Nenhum resumo informado."
  );
}

function obterDescricaoCompleta(
  ritual = {},
) {
  return (
    textoPreenchido(
      ritual.descricaoCompleta,
    ) ||
    textoPreenchido(
      ritual.textoCompleto,
    ) ||
    textoPreenchido(
      ritual.descricao,
    ) ||
    textoPreenchido(
      ritual.resumo,
    ) ||
    "Nenhuma descrição informada."
  );
}

function MetadadosRitual({
  ritual,
  completo = false,
}) {
  const dados = completo
    ? [
        [
          "Custo",
          ritual.custo,
        ],
        [
          "Execução",
          ritual.execucao,
        ],
        [
          "Alcance",
          ritual.alcance,
        ],
        [
          "Alvo / área / efeito",
          obterAlvoAreaOuEfeito(
            ritual,
          ),
        ],
        [
          "Duração",
          ritual.duracao,
        ],
        [
          "Resistência",
          ritual.resistencia,
        ],
      ]
    : [
        [
          "Custo",
          ritual.custo,
        ],
        [
          "Efeito",
          ritual.efeito ||
            obterResumoRitual(
              ritual,
            ),
        ],
      ];

  return (
    <dl className="painel-rituais__metadados">
      {dados.map(
        ([
          titulo,
          valor,
        ]) => (
          <div key={titulo}>
            <dt>
              {titulo}
            </dt>

            <dd>
              {textoPreenchido(
                valor,
              ) ||
                "Não informado"}
            </dd>
          </div>
        ),
      )}
    </dl>
  );
}

function VersaoRitual({
  titulo,
  custo,
  texto,
}) {
  if (
    !textoPreenchido(
      texto,
    )
  ) {
    return null;
  }

  return (
    <section className="painel-rituais__versao">
      <header>
        <strong>
          {titulo}
        </strong>

        {textoPreenchido(
          custo,
        ) ? (
          <span>
            {custo}
          </span>
        ) : null}
      </header>

      <p>{texto}</p>
    </section>
  );
}

function PainelRituais({
  ficha = null,
  fichaAtiva = null,
  rituais = [],
  aoAlterarRituais,
  aoAdicionarRitual,
  aoRemoverRitual,
  modoCompleto = null,
}) {
  const [
    catalogoAberto,
    setCatalogoAberto,
  ] = useState(false);

  const [
    busca,
    setBusca,
  ] = useState("");

  const [
    ritualSelecionado,
    setRitualSelecionado,
  ] = useState("");

  const [
    modoManual,
    setModoManual,
  ] = useState(false);

  const [
    novoRitual,
    setNovoRitual,
  ] = useState({
    nome: "",
    circulo: 1,
    custo: "",
    elemento: "",
    execucao: "",
    alcance: "",
    alvoOuArea: "",
    duracao: "",
    resistencia: "",
    efeito: "",
    requisito: "",
    resumo: "",
    descricaoCompleta: "",
  });

  const fichaEmUso =
    ficha ||
    fichaAtiva ||
    {};

  const exibirCompleto =
    modoCompleto === null
      ? Boolean(
          fichaAtiva &&
            !ficha,
        )
      : Boolean(
          modoCompleto,
        );

  const rituaisAdicionados =
    useMemo(
      () =>
        normalizarRituaisFicha(
          rituais,
        ),
      [rituais],
    );

  const podeUsarRituais =
    useMemo(
      () =>
        fichaPodeUsarRituaisArquivos(
          fichaEmUso,
        ),
      [fichaEmUso],
    );

  const circuloMaximo =
    useMemo(
      () =>
        obterCirculoMaximoRituaisArquivos(
          fichaEmUso,
        ),
      [fichaEmUso],
    );

  const rituaisVisiveis =
    useMemo(
      () =>
        podeUsarRituais
          ? rituaisAdicionados.filter(
              (ritual) =>
                Number(
                  ritual.circulo,
                ) <=
                circuloMaximo,
            )
          : [],
      [
        podeUsarRituais,
        rituaisAdicionados,
        circuloMaximo,
      ],
    );

  const rituaisLiberados =
    useMemo(
      () =>
        obterRituaisDisponiveisArquivos(
          fichaEmUso,
          rituaisAdicionados,
        ),
      [
        fichaEmUso,
        rituaisAdicionados,
      ],
    );

  const rituaisFiltrados =
    useMemo(() => {
      const buscaNormalizada =
        normalizarTexto(
          busca,
        );

      if (
        !buscaNormalizada
      ) {
        return rituaisLiberados;
      }

      return rituaisLiberados.filter(
        (ritual) => {
          const textoDoRitual =
            normalizarTexto(
              [
                ritual.nome,
                ritual.tipo,
                ritual.elemento,
                ritual.resumo,
                ritual.efeito,
                ritual.execucao,
                ritual.alcance,
                ritual.alvo,
                ritual.area,
                ritual.alvoOuArea,
                ritual.duracao,
                ritual.resistencia,
                ritual.descricao,
                ritual.descricaoCompleta,
                ritual.discente,
                ritual.verdadeiro,
              ].join(" "),
            );

          return textoDoRitual.includes(
            buscaNormalizada,
          );
        },
      );
    }, [
      busca,
      rituaisLiberados,
    ]);

  const ritualEmDestaque =
    useMemo(
      () =>
        rituaisLiberados.find(
          (ritual) =>
            ritual.id ===
            ritualSelecionado,
        ) || null,
      [
        ritualSelecionado,
        rituaisLiberados,
      ],
    );

  const circulosDisponiveis =
    useMemo(
      () =>
        Array.from(
          {
            length:
              Math.max(
                1,
                circuloMaximo,
              ),
          },
          (
            _,
            indice,
          ) =>
            indice + 1,
        ),
      [circuloMaximo],
    );

  useEffect(() => {
    if (
      !catalogoAberto ||
      typeof document ===
        "undefined"
    ) {
      return undefined;
    }

    const overflowAnterior =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        overflowAnterior;
    };
  }, [catalogoAberto]);

  function abrirCatalogo() {
    setBusca("");
    setRitualSelecionado("");
    setModoManual(false);
    setCatalogoAberto(true);
  }

  function fecharCatalogo() {
    setCatalogoAberto(false);
    setBusca("");
    setRitualSelecionado("");
    setModoManual(false);
  }

  function atualizarCampoManual(
    campo,
    valor,
  ) {
    setNovoRitual(
      (anterior) => ({
        ...anterior,
        [campo]: valor,
      }),
    );
  }

  function enviarRitualAdicionado(
    ritual,
  ) {
    if (
      typeof aoAlterarRituais ===
      "function"
    ) {
      aoAlterarRituais([
        ...rituaisAdicionados,
        ritual,
      ]);

      return;
    }

    if (
      typeof aoAdicionarRitual ===
      "function"
    ) {
      aoAdicionarRitual(
        ritual,
      );
    }
  }

  function adicionarDoCatalogo() {
    if (
      !ritualEmDestaque
    ) {
      return;
    }

    const ritualAdicionado =
      criarRitualManualArquivos({
        ...ritualEmDestaque,
        automatico: false,
      });

    enviarRitualAdicionado(
      ritualAdicionado,
    );

    fecharCatalogo();
  }

  function adicionarManual() {
    const nome =
      novoRitual.nome.trim();

    if (
      !podeUsarRituais ||
      !nome
    ) {
      return;
    }

    const ritualManual =
      criarRitualManualArquivos({
        ...novoRitual,

        nome,

        circulo:
          Number(
            novoRitual.circulo,
          ) || 1,

        descricao:
          novoRitual.resumo.trim(),

        automatico: false,
      });

    enviarRitualAdicionado(
      ritualManual,
    );

    setNovoRitual({
      nome: "",
      circulo: 1,
      custo: "",
      elemento: "",
      execucao: "",
      alcance: "",
      alvoOuArea: "",
      duracao: "",
      resistencia: "",
      efeito: "",
      requisito: "",
      resumo: "",
      descricaoCompleta: "",
    });

    fecharCatalogo();
  }

  function removerRitual(
    ritual,
  ) {
    if (
      typeof aoAlterarRituais ===
      "function"
    ) {
      aoAlterarRituais(
        rituaisAdicionados.filter(
          (item) =>
            item.id !==
            ritual.id,
        ),
      );

      return;
    }

    if (
      typeof aoRemoverRitual ===
      "function"
    ) {
      aoRemoverRitual(
        ritual,
      );
    }
  }

  const modalCatalogo =
    catalogoAberto &&
    typeof document !==
      "undefined"
      ? createPortal(
          <div
            className="painel-rituais__modal-fundo"
            onMouseDown={(
              evento,
            ) => {
              if (
                evento.target ===
                evento.currentTarget
              ) {
                fecharCatalogo();
              }
            }}
          >
            <section
              className="painel-rituais__modal"
              role="dialog"
              aria-modal="true"
              aria-label="Catálogo de rituais"
            >
              <header className="painel-rituais__modal-cabecalho">
                <div>
                  <h4>
                    Rituais
                  </h4>

                  <p>
                    Somente os círculos
                    liberados pelo NEX
                    atual aparecem nesta
                    lista.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    fecharCatalogo
                  }
                >
                  Fechar
                </button>
              </header>

              {!modoManual ? (
                <input
                  className="painel-rituais__busca"
                  type="search"
                  placeholder="Buscar por nome, elemento, execução ou descrição..."
                  value={busca}
                  onChange={(
                    evento,
                  ) =>
                    setBusca(
                      evento.target
                        .value,
                    )
                  }
                />
              ) : (
                <div />
              )}

              <div className="painel-rituais__modal-conteudo">
                {!modoManual ? (
                  <>
                    <div className="painel-rituais__opcoes">
                      {rituaisFiltrados.map(
                        (ritual) => (
                          <button
                            className={
                              ritualSelecionado ===
                              ritual.id
                                ? "painel-rituais__opcao painel-rituais__opcao--ativa"
                                : "painel-rituais__opcao"
                            }
                            type="button"
                            key={
                              ritual.id
                            }
                            onClick={() =>
                              setRitualSelecionado(
                                ritual.id,
                              )
                            }
                          >
                            <span className="painel-rituais__opcao-icone">
                              ✦
                            </span>

                            <strong>
                              {
                                ritual.nome
                              }
                            </strong>

                            <small>
                              {
                                ritual.circulo
                              }
                              º círculo
                            </small>
                          </button>
                        ),
                      )}

                      {rituaisFiltrados.length ===
                      0 ? (
                        <p className="painel-rituais__vazio">
                          Nenhum ritual
                          encontrado.
                        </p>
                      ) : null}
                    </div>

                    <div className="painel-rituais__detalhes">
                      {ritualEmDestaque ? (
                        <>
                          <div className="painel-rituais__detalhes-topo">
                            <span className="painel-rituais__opcao-icone">
                              ✦
                            </span>

                            <div>
                              <h5>
                                {
                                  ritualEmDestaque.nome
                                }
                              </h5>

                              <span>
                                {
                                  ritualEmDestaque.circulo
                                }
                                º círculo —{" "}
                                {ritualEmDestaque.elemento ||
                                  "Elemento não informado"}
                              </span>
                            </div>
                          </div>

                          <MetadadosRitual
                            ritual={
                              ritualEmDestaque
                            }
                            completo
                          />

                          {ritualEmDestaque.requisito ? (
                            <p className="painel-rituais__requisito">
                              <strong>
                                Requisito:
                              </strong>{" "}
                              {
                                ritualEmDestaque.requisito
                              }
                            </p>
                          ) : null}

                          <p className="painel-rituais__detalhes-texto">
                            {obterDescricaoCompleta(
                              ritualEmDestaque,
                            )}
                          </p>

                          <VersaoRitual
                            titulo="Discente"
                            custo={
                              ritualEmDestaque.discenteCusto
                            }
                            texto={
                              ritualEmDestaque.discente
                            }
                          />

                          <VersaoRitual
                            titulo="Verdadeiro"
                            custo={
                              ritualEmDestaque.verdadeiroCusto
                            }
                            texto={
                              ritualEmDestaque.verdadeiro
                            }
                          />
                        </>
                      ) : (
                        <div className="painel-rituais__detalhes-vazio">
                          <h5>
                            Selecione uma
                            opção
                          </h5>

                          <p>
                            A ficha
                            completa do
                            ritual
                            aparecerá aqui
                            antes de ele
                            ser
                            adicionado.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="painel-rituais__detalhes painel-rituais__formulario-largo">
                    <h5>
                      Adicionar ritual
                      manualmente
                    </h5>

                    <div className="painel-rituais__formulario-manual">
                      <label>
                        Nome

                        <input
                          type="text"
                          maxLength={70}
                          value={
                            novoRitual.nome
                          }
                          onChange={(
                            evento,
                          ) =>
                            atualizarCampoManual(
                              "nome",
                              evento
                                .target
                                .value,
                            )
                          }
                        />
                      </label>

                      <label>
                        Círculo

                        <select
                          value={
                            novoRitual.circulo
                          }
                          onChange={(
                            evento,
                          ) =>
                            atualizarCampoManual(
                              "circulo",
                              Number(
                                evento
                                  .target
                                  .value,
                              ),
                            )
                          }
                        >
                          {circulosDisponiveis.map(
                            (
                              circulo,
                            ) => (
                              <option
                                value={
                                  circulo
                                }
                                key={
                                  circulo
                                }
                              >
                                {
                                  circulo
                                }
                                º círculo
                              </option>
                            ),
                          )}
                        </select>
                      </label>

                      {[
                        [
                          "custo",
                          "Custo",
                        ],
                        [
                          "elemento",
                          "Elemento",
                        ],
                        [
                          "execucao",
                          "Execução",
                        ],
                        [
                          "alcance",
                          "Alcance",
                        ],
                        [
                          "alvoOuArea",
                          "Alvo / área / efeito",
                        ],
                        [
                          "duracao",
                          "Duração",
                        ],
                        [
                          "resistencia",
                          "Resistência",
                        ],
                      ].map(
                        ([
                          campo,
                          titulo,
                        ]) => (
                          <label
                            key={
                              campo
                            }
                          >
                            {
                              titulo
                            }

                            <input
                              type="text"
                              maxLength={
                                180
                              }
                              value={
                                novoRitual[
                                  campo
                                ]
                              }
                              onChange={(
                                evento,
                              ) =>
                                atualizarCampoManual(
                                  campo,
                                  evento
                                    .target
                                    .value,
                                )
                              }
                            />
                          </label>
                        ),
                      )}

                      <label className="painel-rituais__formulario-largo">
                        Efeito resumido

                        <input
                          type="text"
                          maxLength={180}
                          value={
                            novoRitual.efeito
                          }
                          onChange={(
                            evento,
                          ) =>
                            atualizarCampoManual(
                              "efeito",
                              evento
                                .target
                                .value,
                            )
                          }
                        />
                      </label>

                      <label className="painel-rituais__formulario-largo">
                        Requisito

                        <textarea
                          rows="2"
                          maxLength={400}
                          value={
                            novoRitual.requisito
                          }
                          onChange={(
                            evento,
                          ) =>
                            atualizarCampoManual(
                              "requisito",
                              evento
                                .target
                                .value,
                            )
                          }
                        />
                      </label>

                      <label className="painel-rituais__formulario-largo">
                        Resumo para a
                        ficha

                        <textarea
                          rows="2"
                          maxLength={400}
                          value={
                            novoRitual.resumo
                          }
                          onChange={(
                            evento,
                          ) =>
                            atualizarCampoManual(
                              "resumo",
                              evento
                                .target
                                .value,
                            )
                          }
                        />
                      </label>

                      <label className="painel-rituais__formulario-largo">
                        Descrição completa

                        <textarea
                          rows="6"
                          maxLength={3000}
                          value={
                            novoRitual
                              .descricaoCompleta
                          }
                          onChange={(
                            evento,
                          ) =>
                            atualizarCampoManual(
                              "descricaoCompleta",
                              evento
                                .target
                                .value,
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <footer className="painel-rituais__modal-rodape">
                {!modoManual ? (
                  <button
                    type="button"
                    onClick={() => {
                      setModoManual(
                        true,
                      );

                      setRitualSelecionado(
                        "",
                      );
                    }}
                  >
                    Adicionar
                    manualmente
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setModoManual(
                        false,
                      )
                    }
                  >
                    Voltar ao catálogo
                  </button>
                )}

                {!modoManual ? (
                  <button
                    className="painel-rituais__adicionar-selecionado"
                    type="button"
                    disabled={
                      !ritualEmDestaque
                    }
                    onClick={
                      adicionarDoCatalogo
                    }
                  >
                    Adicionar
                    selecionado
                  </button>
                ) : (
                  <button
                    className="painel-rituais__adicionar-selecionado"
                    type="button"
                    disabled={
                      !novoRitual.nome.trim()
                    }
                    onClick={
                      adicionarManual
                    }
                  >
                    Salvar ritual manual
                  </button>
                )}
              </footer>
            </section>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <style>
        {`
          .painel-rituais,
          .painel-rituais__modal-fundo {
            --ritual-roxo-escuro: #1b0d22;
            --ritual-roxo: #432052;
            --ritual-violeta: #6c3281;
            --ritual-claro: #f1dcf7;
            --ritual-brilho: #c67ade;
            --ritual-vermelho: #842d38;
          }

          .painel-rituais {
            display: grid;
            gap: 14px;
            min-width: 0;
            padding: 12px;
            border: 1px solid #6c5740;
            color: #2e2015;
            background:
              repeating-linear-gradient(
                0deg,
                rgba(80, 56, 33, 0.04) 0 1px,
                transparent 1px 7px
              ),
              rgba(242, 232, 211, 0.72);
            box-shadow:
              inset 0 0 0 3px
              rgba(255, 251, 239, 0.22);
          }

          .painel-rituais--completo {
            padding: 18px;
          }

          .painel-rituais__cabecalho {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
          }

          .painel-rituais__cabecalho h3 {
            width: fit-content;
            margin: 0;
            padding: 7px 20px;
            border-left: 4px solid
              var(--ritual-brilho);
            background:
              linear-gradient(
                180deg,
                #24102c,
                #130918
              );
            color: var(--ritual-claro);
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

          .painel-rituais__botao,
          .painel-rituais__modal-fundo button,
          .painel-rituais__cartao > header button {
            min-height: 32px;
            padding: 5px 12px;
            border: 1px solid #8b4aa0;
            border-radius: 0;
            background:
              linear-gradient(
                180deg,
                var(--ritual-violeta),
                var(--ritual-roxo-escuro)
              );
            color: var(--ritual-claro);
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.62rem;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
          }

          .painel-rituais__botao:hover,
          .painel-rituais__modal-fundo button:hover,
          .painel-rituais__cartao > header button:hover {
            border-color:
              var(--ritual-brilho);
            background:
              linear-gradient(
                180deg,
                #87459c,
                #32143e
              );
          }

          .painel-rituais__modal-fundo button:disabled {
            cursor: not-allowed;
            opacity: 0.42;
          }

          .painel-rituais__acesso {
            margin: 0;
            padding: 13px;
            border-left: 4px solid
              var(--ritual-violeta);
            background:
              rgba(71, 32, 84, 0.08);
            color: #5e4030;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.7rem;
            font-weight: 700;
            line-height: 1.5;
          }

          .painel-rituais__lista {
            display: grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
            gap: 10px;
          }

          .painel-rituais--completo
          .painel-rituais__lista {
            grid-template-columns:
              1fr;
          }

          .painel-rituais__cartao {
            display: grid;
            align-content: start;
            gap: 10px;
            min-width: 0;
            padding: 12px;
            border: 1px solid
              rgba(75, 54, 35, 0.56);
            border-left: 4px solid
              var(--ritual-violeta);
            background:
              linear-gradient(
                90deg,
                rgba(88, 39, 105, 0.12),
                transparent 45px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(83, 57, 32, 0.035) 0 1px,
                transparent 1px 7px
              ),
              rgba(250, 242, 224, 0.76);
          }

          .painel-rituais__cartao > header {
            display: flex;
            justify-content:
              space-between;
            align-items: flex-start;
            gap: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid
              rgba(77, 53, 34, 0.36);
          }

          .painel-rituais__cartao > header > div {
            display: grid;
            gap: 3px;
          }

          .painel-rituais__cartao > header strong {
            color: #271b12;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.78rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-rituais__cartao > header span {
            color: #725a40;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.59rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-rituais__cartao > header button {
            border-color: #6e2732;
            background:
              linear-gradient(
                180deg,
                #873642,
                #42151c
              );
          }

          .painel-rituais__metadados {
            display: grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
            gap: 6px;
            margin: 0;
          }

          .painel-rituais--completo
          .painel-rituais__metadados,
          .painel-rituais__detalhes
          .painel-rituais__metadados {
            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );
          }

          .painel-rituais__metadados div {
            display: grid;
            gap: 3px;
            min-width: 0;
            padding: 7px;
            border: 1px solid
              rgba(77, 53, 34, 0.22);
            background:
              rgba(255, 250, 238, 0.38);
          }

          .painel-rituais__metadados dt {
            color: #765c42;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.52rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-rituais__metadados dd {
            margin: 0;
            overflow-wrap: anywhere;
            color: #332317;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.66rem;
            font-weight: 700;
            line-height: 1.4;
          }

          .painel-rituais__texto,
          .painel-rituais__detalhes-texto {
            margin: 0;
            white-space: pre-line;
            color: #463525;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.72rem;
            line-height: 1.62;
          }

          .painel-rituais--completo
          .painel-rituais__texto {
            font-size: 0.8rem;
            line-height: 1.72;
          }

          .painel-rituais__requisito {
            margin: 0;
            padding: 9px;
            border-left: 3px solid
              var(--ritual-violeta);
            background:
              rgba(88, 39, 105, 0.08);
            color: #5a3e2e;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.68rem;
            line-height: 1.5;
          }

          .painel-rituais__versao {
            display: grid;
            gap: 7px;
            margin-top: 2px;
            padding: 10px;
            border: 1px solid
              rgba(108, 50, 129, 0.36);
            background:
              rgba(108, 50, 129, 0.07);
          }

          .painel-rituais__versao header {
            display: flex;
            justify-content:
              space-between;
            gap: 10px;
          }

          .painel-rituais__versao strong,
          .painel-rituais__versao span {
            color:
              var(--ritual-violeta);
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.66rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-rituais__versao p {
            margin: 0;
            color: #483524;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.72rem;
            line-height: 1.58;
          }

          .painel-rituais__vazio {
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

          .painel-rituais__modal-fundo {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: grid;
            place-items: center;
            padding: 24px;
            background:
              rgba(9, 5, 11, 0.88);
            backdrop-filter:
              blur(4px);
          }

          .painel-rituais__modal {
            display: grid;
            grid-template-rows:
              auto auto
              minmax(0, 1fr)
              auto;
            gap: 12px;
            width:
              min(
                980px,
                calc(
                  100vw - 34px
                )
              );
            height:
              min(
                720px,
                calc(
                  100vh - 34px
                )
              );
            padding: 16px;
            overflow: hidden;
            border: 2px solid
              #684275;
            border-radius: 12px;
            background:
              repeating-linear-gradient(
                0deg,
                rgba(91, 62, 35, 0.05) 0 1px,
                transparent 1px 7px
              ),
              #eadbc0;
            box-shadow:
              0 30px 90px
                rgba(0, 0, 0, 0.88),
              0 0 35px
                rgba(114, 51, 135, 0.35),
              inset 0 0 0 4px
                rgba(255, 249, 232, 0.42);
            color: #2e2015;
          }

          .painel-rituais__modal-cabecalho,
          .painel-rituais__modal-rodape {
            display: flex;
            justify-content:
              space-between;
            align-items: center;
            gap: 12px;
          }

          .painel-rituais__modal-cabecalho h4 {
            margin: 0;
            color:
              var(--ritual-roxo-escuro);
            font-family:
              Georgia,
              "Times New Roman",
              serif;
            font-size: 1.65rem;
            text-transform: uppercase;
          }

          .painel-rituais__modal-cabecalho p {
            margin: 2px 0 0;
            color: #70593f;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.75rem;
          }

          .painel-rituais__busca {
            width: 100%;
            min-height: 40px;
            padding: 9px 11px;
            border: 1px solid
              var(--ritual-violeta);
            border-radius: 0;
            background:
              rgba(255, 252, 240, 0.88);
            color: #2e2015;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
          }

          .painel-rituais__modal-conteudo {
            display: grid;
            grid-template-columns:
              minmax(
                280px,
                0.82fr
              )
              minmax(
                0,
                1.3fr
              );
            gap: 14px;
            min-height: 0;
          }

          .painel-rituais__opcoes {
            display: grid;
            align-content: start;
            gap: 6px;
            min-height: 0;
            padding-right: 6px;
            overflow-y: auto;
          }

          .painel-rituais__opcao {
            display: grid;
            grid-template-columns:
              44px
              minmax(0, 1fr)
              auto;
            align-items: center;
            gap: 10px;
            width: 100%;
            min-height: 49px;
            padding: 5px 9px;
            border: 1px solid
              #744489;
            background:
              linear-gradient(
                90deg,
                #291331,
                #160b1b
              );
            color:
              var(--ritual-claro);
            text-align: left;
            cursor: pointer;
          }

          .painel-rituais__opcao:hover,
          .painel-rituais__opcao--ativa {
            border-color: #d595e7;
            background:
              linear-gradient(
                90deg,
                #74328a,
                #35143f
              );
          }

          .painel-rituais__opcao-icone {
            display: grid;
            place-items: center;
            width: 40px;
            height: 40px;
            border: 1px solid
              rgba(240, 203, 250, 0.35);
            background:
              radial-gradient(
                circle,
                #8e4ba3,
                #371642 72%
              );
            color: #fff0ff;
            font-size: 1.35rem;
          }

          .painel-rituais__opcao strong {
            color: #fff1ff;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.74rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-rituais__opcao small {
            color: #e3a8f2;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.56rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-rituais__detalhes {
            min-width: 0;
            min-height: 0;
            padding: 16px;
            overflow-y: auto;
            border: 1px solid
              rgba(84, 61, 39, 0.46);
            background:
              rgba(255, 250, 236, 0.62);
          }

          .painel-rituais__detalhes h5 {
            margin: 0 0 12px;
            color:
              var(--ritual-roxo-escuro);
            font-family:
              Georgia,
              "Times New Roman",
              serif;
            font-size: 1.35rem;
          }

          .painel-rituais__detalhes-topo {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid
              rgba(77, 53, 34, 0.3);
          }

          .painel-rituais__detalhes-topo h5 {
            margin: 0;
          }

          .painel-rituais__detalhes-topo span {
            color:
              var(--ritual-violeta);
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.68rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-rituais__detalhes-topo
          .painel-rituais__opcao-icone {
            flex: 0 0 auto;
            width: 54px;
            height: 54px;
            font-size: 1.7rem;
          }

          .painel-rituais__detalhes-vazio p {
            margin: 0;
            color: #59432f;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.8rem;
            line-height: 1.7;
          }

          .painel-rituais__formulario-manual {
            display: grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
            gap: 10px;
          }

          .painel-rituais__formulario-manual label {
            display: grid;
            gap: 5px;
            color: #513b28;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.65rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-rituais__formulario-manual input,
          .painel-rituais__formulario-manual select,
          .painel-rituais__formulario-manual textarea {
            width: 100%;
            min-width: 0;
            padding: 8px;
            border: 1px solid
              var(--ritual-violeta);
            border-radius: 0;
            background:
              rgba(255, 252, 241, 0.86);
            color: #302116;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
          }

          .painel-rituais__formulario-largo {
            grid-column: 1 / -1;
          }

          @media (max-width: 900px) {
            .painel-rituais__lista,
            .painel-rituais__metadados,
            .painel-rituais--completo
            .painel-rituais__metadados,
            .painel-rituais__detalhes
            .painel-rituais__metadados {
              grid-template-columns:
                1fr;
            }

            .painel-rituais__modal-fundo {
              padding: 10px;
            }

            .painel-rituais__modal {
              width:
                calc(
                  100vw - 20px
                );
              height:
                calc(
                  100vh - 20px
                );
            }

            .painel-rituais__modal-conteudo {
              grid-template-columns:
                1fr;
              overflow-y: auto;
            }

            .painel-rituais__opcoes {
              max-height: 220px;
            }

            .painel-rituais__formulario-manual {
              grid-template-columns:
                1fr;
            }

            .painel-rituais__formulario-largo {
              grid-column: auto;
            }

            .painel-rituais__modal-rodape,
            .painel-rituais__cabecalho {
              align-items: stretch;
              flex-direction: column;
            }

            .painel-rituais__modal-rodape button,
            .painel-rituais__cabecalho button {
              width: 100%;
            }
          }
        `}
      </style>

      <section
        data-assistente="ficha-rituais"
        className={
          exibirCompleto
            ? "painel-rituais painel-rituais--completo"
            : "painel-rituais painel-rituais--resumo"
        }
      >
        <header className="painel-rituais__cabecalho">
          <h3>
            Rituais conhecidos
          </h3>

          {podeUsarRituais ? (
            <button
              className="painel-rituais__botao"
              type="button"
              onClick={
                abrirCatalogo
              }
            >
              Adicionar
            </button>
          ) : null}
        </header>

        {!podeUsarRituais ? (
          <p className="painel-rituais__acesso">
            Esta ficha ainda não possui
            acesso a rituais. Escolha a
            classe Ocultista ou adicione
            uma habilidade que permita
            conjurar rituais.
          </p>
        ) : (
          <p className="painel-rituais__acesso">
            Círculo máximo liberado pelo
            NEX atual:{" "}
            <strong>
              {circuloMaximo}º círculo
            </strong>
            . Rituais acima desse limite
            permanecem salvos, mas ficam
            escondidos até o NEX permitir.
          </p>
        )}

        <div className="painel-rituais__lista">
          {rituaisVisiveis.map(
            (ritual) => (
              <article
                className="painel-rituais__cartao"
                key={ritual.id}
              >
                <header>
                  <div>
                    <strong>
                      {ritual.nome}
                    </strong>

                    <span>
                      {ritual.circulo}º
                      círculo —{" "}
                      {ritual.elemento ||
                        "Elemento não informado"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removerRitual(
                        ritual,
                      )
                    }
                  >
                    Remover
                  </button>
                </header>

                <MetadadosRitual
                  ritual={ritual}
                  completo={
                    exibirCompleto
                  }
                />

                {exibirCompleto &&
                ritual.requisito ? (
                  <p className="painel-rituais__requisito">
                    <strong>
                      Requisito:
                    </strong>{" "}
                    {
                      ritual.requisito
                    }
                  </p>
                ) : null}

                <p className="painel-rituais__texto">
                  {exibirCompleto
                    ? obterDescricaoCompleta(
                        ritual,
                      )
                    : obterResumoRitual(
                        ritual,
                      )}
                </p>

                {exibirCompleto ? (
                  <>
                    <VersaoRitual
                      titulo="Discente"
                      custo={
                        ritual.discenteCusto
                      }
                      texto={
                        ritual.discente
                      }
                    />

                    <VersaoRitual
                      titulo="Verdadeiro"
                      custo={
                        ritual.verdadeiroCusto
                      }
                      texto={
                        ritual.verdadeiro
                      }
                    />
                  </>
                ) : null}
              </article>
            ),
          )}
        </div>

        {podeUsarRituais &&
        rituaisVisiveis.length ===
          0 ? (
          <p className="painel-rituais__vazio">
            Nenhum ritual liberado foi
            adicionado. Pressione
            “Adicionar” para abrir o
            catálogo permitido pelo NEX.
          </p>
        ) : null}
      </section>

      {modalCatalogo}
    </>
  );
}

export default PainelRituais;
