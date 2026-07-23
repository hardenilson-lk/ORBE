import {
  useEffect,
  useState,
} from "react";

import {
  CLASSES_ARQUIVOS,
  NIVEIS_NEX,
  ORIGENS_ARQUIVOS,
  PATENTES_ARQUIVOS,
  TRILHAS_ARQUIVOS,
} from "../../data/catalogoArquivos.js";

import {
  ITENS_ARQUIVOS,
  criarItemArquivos,
} from "../../data/itensArquivos.js";

import {
  criarValoresPericiasArquivos,
} from "../../data/periciasArquivos.js";

import {
  obterRegraAtributos,
  obterRegraPericias,
  podeAlterarAtributo,
  podeAlterarTreinoPericia,
} from "../../data/regrasCriacaoFichaArquivos.js";

import {
  criarFichaArquivosVazia,
  recalcularFichaArquivos,
} from "../../utils/fichasArquivos.js";

import {
  obterClasseVisualItem,
  obterRotuloCategoriaItem,
} from "../../utils/categoriasItens.js";

import PainelDanoCura from "./PainelDanoCura.jsx";

import PainelHabilidades, {
  normalizarHabilidadesFicha,
} from "./PainelHabilidades.jsx";

import PainelProgressaoNex from "./PainelProgressaoNex.jsx";

import PainelRetrato from "./PainelRetrato.jsx";

import PainelRituais, {
  normalizarRituaisFicha,
} from "./PainelRituais.jsx";

import {
  normalizarAtaquesFicha,
} from "./TabelaAtaques.jsx";

import TabelaPericias from "./TabelaPericias.jsx";

import "./PainelFichas.css";

const CAMPOS_QUE_RECALCULAM =
  new Set([
    "classe",
    "nex",
    "agilidade",
    "forca",
    "intelecto",
    "presenca",
    "vigor",
    "pericias",
  ]);

function criarListaSegura(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}

function normalizarBusca(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function prepararFichaParaTela(
  fichaRecebida = {},
) {
  const fichaBase =
    recalcularFichaArquivos(
      criarFichaArquivosVazia(
        fichaRecebida,
      ),
    );

  const periciasAnteriores =
    fichaBase.pericias &&
    typeof fichaBase.pericias ===
      "object" &&
    !Array.isArray(
      fichaBase.pericias,
    )
      ? fichaBase.pericias
      : {};

  return recalcularFichaArquivos({
    ...fichaBase,

    pericias:
      criarValoresPericiasArquivos(
        periciasAnteriores,
      ),

    ataques:
      normalizarAtaquesFicha(
        fichaBase.ataques,
      ),

    habilidades:
      normalizarHabilidadesFicha(
        fichaBase.habilidades,
      ),

    rituais:
      normalizarRituaisFicha(
        fichaBase.rituais,
      ),
  });
}

function criarFichaNova() {
  return prepararFichaParaTela();
}

function PainelFichas({
  fichas = [],
  fichaSelecionada = null,
  aoSalvarFicha,
  aoCriarFicha,
  aoSelecionarFicha,
  permitirNovaFicha = true,
}) {
  const [ficha, setFicha] =
    useState(() =>
      criarFichaNova(),
    );

  const [
    catalogoEquipamentosAberto,
    setCatalogoEquipamentosAberto,
  ] = useState(false);

  const [
    buscaEquipamento,
    setBuscaEquipamento,
  ] = useState("");

  const [
    equipamentoSelecionadoId,
    setEquipamentoSelecionadoId,
  ] = useState("");

  const [mensagemDistribuicao, setMensagemDistribuicao] = useState("");

  useEffect(() => {
    if (fichaSelecionada) {
      setFicha(
        prepararFichaParaTela(
          fichaSelecionada,
        ),
      );

      return;
    }

    setFicha(
      criarFichaNova(),
    );
  }, [fichaSelecionada]);

  const trilhasDisponiveis =
    TRILHAS_ARQUIVOS.filter(
      (trilha) =>
        trilha.classe ===
        ficha.classe,
    );

  const itensInventario =
    criarListaSegura(
      ficha.inventario,
    );

  const buscaNormalizada =
    normalizarBusca(
      buscaEquipamento,
    );

  const itensCatalogoFiltrados =
    ITENS_ARQUIVOS.filter(
      (item) => {
        if (!buscaNormalizada) {
          return true;
        }

        const textoItem =
          normalizarBusca(
            [
              item.nome,
              item.tipo,
              item.categoria,
              item.descricao,
            ].join(" "),
          );

        return textoItem.includes(
          buscaNormalizada,
        );
      },
    );

  const equipamentoSelecionado =
    ITENS_ARQUIVOS.find(
      (item) =>
        item.id ===
        equipamentoSelecionadoId,
    ) || null;

  const regraAtributos = obterRegraAtributos(ficha);
  const regraPericias = obterRegraPericias(ficha);

  function atualizarCampo(
    nomeCampo,
    valor,
  ) {
    setFicha(
      (fichaAnterior) => {
        const fichaAtualizada = {
          ...fichaAnterior,
          [nomeCampo]: valor,
        };

        if (
          CAMPOS_QUE_RECALCULAM.has(
            nomeCampo,
          )
        ) {
          return recalcularFichaArquivos(
            fichaAtualizada,
          );
        }

        return fichaAtualizada;
      },
    );
  }

  function atualizarClasse(
    novaClasse,
  ) {
    setFicha(
      (fichaAnterior) => {
        const trilhaAtualValida =
          TRILHAS_ARQUIVOS.some(
            (trilha) =>
              trilha.classe ===
                novaClasse &&
              trilha.nome ===
                fichaAnterior.trilha,
          );

        return recalcularFichaArquivos({
          ...fichaAnterior,

          classe:
            novaClasse,

          trilha:
            trilhaAtualValida
              ? fichaAnterior.trilha
              : "",
        });
      },
    );
  }

  function atualizarNumero(
    nomeCampo,
    valor,
  ) {
    atualizarCampo(
      nomeCampo,
      Number(valor) || 0,
    );
  }

  function atualizarAtributo(nomeCampo, valor) {
    const resultado = podeAlterarAtributo(ficha, nomeCampo, valor);
    setMensagemDistribuicao(resultado.mensagem);
    if (!resultado.permitido) return;

    setFicha((fichaAnterior) =>
      recalcularFichaArquivos({
        ...fichaAnterior,
        [nomeCampo]: resultado.valor,
      }),
    );
  }

  function atualizarPericia(
    periciaId,
    campo,
    valor,
  ) {
    const resultadoTreino = campo === "treino"
      ? podeAlterarTreinoPericia(ficha, periciaId, valor)
      : { permitido: true, valor: Number(valor) || 0, mensagem: "" };

    setMensagemDistribuicao(resultadoTreino.mensagem);
    if (!resultadoTreino.permitido) return;

    setFicha(
      (fichaAnterior) => {
        const periciasAtuais = criarValoresPericiasArquivos(
          fichaAnterior.pericias,
        );

        const periciaAnterior =
          periciasAtuais[
            periciaId
          ] || {
            treino: 0,
            outros: 0,
            total: 0,
          };

        const proximaPericia = {
          ...periciaAnterior,

          [campo]:
            resultadoTreino.valor,
        };

        proximaPericia.total =
          Number(
            proximaPericia.treino,
          ) +
          Number(
            proximaPericia.outros,
          );

        const fichaAtualizada = {
          ...fichaAnterior,

          pericias: {
            ...periciasAtuais,

            [periciaId]:
              proximaPericia,
          },
        };

        return recalcularFichaArquivos(
          fichaAtualizada,
        );
      },
    );
  }

  function atualizarHabilidades(
    novasHabilidades,
  ) {
    setFicha(
      (fichaAnterior) => ({
        ...fichaAnterior,

        habilidades:
          normalizarHabilidadesFicha(
            novasHabilidades,
          ),
      }),
    );
  }

  function atualizarRituais(
    novosRituais,
  ) {
    setFicha(
      (fichaAnterior) => ({
        ...fichaAnterior,

        rituais:
          normalizarRituaisFicha(
            novosRituais,
          ),
      }),
    );
  }

  function atualizarPvAtual(
    novoPv,
  ) {
    atualizarCampo(
      "pvAtual",
      Number(novoPv) || 0,
    );
  }

  function atualizarPeAtual(
    novoPe,
  ) {
    atualizarCampo(
      "peAtual",
      Number(novoPe) || 0,
    );
  }

  function atualizarSanAtual(
    novaSanidade,
  ) {
    atualizarCampo(
      "sanAtual",
      Number(novaSanidade) || 0,
    );
  }

  function atualizarFoto(
    novaFoto,
  ) {
    atualizarCampo(
      "foto",
      novaFoto,
    );
  }

  function abrirCatalogoEquipamentos() {
    setBuscaEquipamento("");
    setEquipamentoSelecionadoId("");
    setCatalogoEquipamentosAberto(
      true,
    );
  }

  function fecharCatalogoEquipamentos() {
    setCatalogoEquipamentosAberto(
      false,
    );

    setBuscaEquipamento("");
    setEquipamentoSelecionadoId("");
  }

  function adicionarEquipamentoSelecionado() {
    if (!equipamentoSelecionado) {
      return;
    }

    const novoItem =
      criarItemArquivos(
        equipamentoSelecionado,
      );

    const fichaAtualizada =
      recalcularFichaArquivos({
        ...ficha,

        id:
          ficha.id ||
          `ficha-${Date.now()}`,

        inventario: [
          novoItem,
          ...itensInventario,
        ],
      });

    setFicha(
      fichaAtualizada,
    );

    if (
      typeof aoSalvarFicha ===
      "function"
    ) {
      aoSalvarFicha(
        fichaAtualizada,
      );
    }

    fecharCatalogoEquipamentos();
  }

  function salvarFicha(evento) {
    evento.preventDefault();

    const atributosAntesDeSalvar = obterRegraAtributos(ficha);
    const periciasAntesDeSalvar = obterRegraPericias(ficha);
    if (atributosAntesDeSalvar.excedentes || periciasAntesDeSalvar.excedentes) {
      setMensagemDistribuicao("Corrija os pontos acima do limite antes de salvar. Você pode reduzir atributos ou o Treino das perícias para devolver pontos.");
      return;
    }

    const fichaParaSalvar =
      recalcularFichaArquivos({
        ...ficha,

        pericias:
          criarValoresPericiasArquivos(
            ficha.pericias,
          ),

        ataques:
          normalizarAtaquesFicha(
            ficha.ataques,
          ),

        habilidades:
          normalizarHabilidadesFicha(
            ficha.habilidades,
          ),

        rituais:
          normalizarRituaisFicha(
            ficha.rituais,
          ),

        id:
          ficha.id ||
          `ficha-${Date.now()}`,
      });

    setFicha(
      fichaParaSalvar,
    );

    if (
      typeof aoSalvarFicha ===
      "function"
    ) {
      aoSalvarFicha(
        fichaParaSalvar,
      );
    }
  }

  function criarNovaFicha() {
    setFicha(
      criarFichaNova(),
    );

    if (
      typeof aoCriarFicha ===
      "function"
    ) {
      aoCriarFicha();
    }
  }

  function selecionarFicha(item) {
    const fichaAberta =
      prepararFichaParaTela(
        item,
      );

    setFicha(
      fichaAberta,
    );

    if (
      typeof aoSelecionarFicha ===
      "function"
    ) {
      aoSelecionarFicha(item);
    }
  }

  return (
    <section className="painel-fichas">
      <header className="painel-fichas__cabecalho" data-assistente="ficha-inicio">
        <div>
          <span>
            Departamento de agentes
          </span>

          <h2>
            Ficha do personagem
          </h2>
        </div>

        <div className="painel-fichas__acoes-cabecalho">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("orbinho:iniciar-tutorial", { detail: { id: "fichaPersonagem", reiniciar: true } }))}
          >
            Orbinho: montar ficha
          </button>
          {permitirNovaFicha ? (
            <button
              type="button"
              onClick={criarNovaFicha}
            >
              Nova ficha
            </button>
          ) : null}
        </div>
      </header>

      {mensagemDistribuicao ? <p className="ficha-arquivos__aviso-distribuicao" role="status">{mensagemDistribuicao}</p> : null}

      <section className="painel-fichas__mesa" data-assistente="ficha-lista">
        <h3>
          Personagens vinculados à mesa
        </h3>

        {fichas.length === 0 ? (
          <p className="painel-fichas__vazio">
            Nenhuma ficha vinculada à
            campanha.
          </p>
        ) : (
          <div className="painel-fichas__lista">
            {fichas.map((item) => {
              const estaSelecionada =
                ficha.id === item.id;

              return (
                <button
                  className={
                    estaSelecionada
                      ? "painel-fichas__cartao painel-fichas__cartao--ativo"
                      : "painel-fichas__cartao"
                  }
                  type="button"
                  key={item.id}
                  onClick={() =>
                    selecionarFicha(item)
                  }
                >
                  <strong>
                    {item.nome ||
                      "Agente sem nome"}
                  </strong>

                  <span>
                    {item.classe ||
                      "Classe não definida"}
                  </span>

                  <small>
                    NEX{" "}
                    {item.nex || "5%"}
                  </small>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <form
        className="ficha-arquivos"
        onSubmit={salvarFicha}
      >
        <div className="ficha-arquivos__grade-principal">
          <div className="ficha-arquivos__coluna-personagem">
            <section className="ficha-arquivos__identificacao" data-assistente="ficha-identificacao">
              <PainelRetrato
                nome={ficha.nome}
                foto={ficha.foto}
                aoAlterarFoto={
                  atualizarFoto
                }
              />

              <div className="ficha-arquivos__campos-principais">
                <label>
                  Nome do agente

                  <input
                    type="text"
                    maxLength={36}
                    value={ficha.nome}
                    onChange={(evento) =>
                      atualizarCampo(
                        "nome",
                        evento.target
                          .value,
                      )
                    }
                  />
                </label>

                <label>
                  Jogador

                  <input
                    type="text"
                    maxLength={36}
                    value={ficha.jogador}
                    onChange={(evento) =>
                      atualizarCampo(
                        "jogador",
                        evento.target
                          .value,
                      )
                    }
                  />
                </label>

                <label>
                  Origem

                  <select
                    value={ficha.origem}
                    onChange={(evento) =>
                      atualizarCampo(
                        "origem",
                        evento.target
                          .value,
                      )
                    }
                  >
                    <option value="">
                      Selecione a origem
                    </option>

                    {ORIGENS_ARQUIVOS.map(
                      (origem) => (
                        <option
                          value={
                            origem.nome
                          }
                          key={
                            origem.id
                          }
                        >
                          {origem.nome}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>
            </section>

            <section className="ficha-arquivos__tres-colunas" data-assistente="ficha-classe-nex">
              <label>
                Classe

                <select
                  value={ficha.classe}
                  onChange={(evento) =>
                    atualizarClasse(
                      evento.target
                        .value,
                    )
                  }
                >
                  {CLASSES_ARQUIVOS.map(
                    (classe) => (
                      <option
                        value={classe}
                        key={classe}
                      >
                        {classe}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label>
                Trilha

                <select
                  value={ficha.trilha}
                  onChange={(evento) =>
                    atualizarCampo(
                      "trilha",
                      evento.target
                        .value,
                    )
                  }
                >
                  <option value="">
                    Selecione a trilha
                  </option>

                  {trilhasDisponiveis.map(
                    (trilha) => (
                      <option
                        value={
                          trilha.nome
                        }
                        key={
                          trilha.id
                        }
                      >
                        {trilha.nome}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label>
                NEX

                <select
                  value={ficha.nex}
                  onChange={(evento) =>
                    atualizarCampo(
                      "nex",
                      evento.target
                        .value,
                    )
                  }
                >
                  {NIVEIS_NEX.map(
                    (nivel) => (
                      <option
                        value={nivel}
                        key={nivel}
                      >
                        {nivel}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </section>

            <section className="ficha-arquivos__tres-colunas">
              <label>
                Patente

                <select
                  value={ficha.patente}
                  onChange={(evento) =>
                    atualizarCampo(
                      "patente",
                      evento.target
                        .value,
                    )
                  }
                >
                  {PATENTES_ARQUIVOS.map(
                    (patente) => (
                      <option
                        value={patente}
                        key={patente}
                      >
                        {patente}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label>
                Deslocamento

                <input
                  type="number"
                  value={
                    ficha.deslocamento
                  }
                  readOnly
                />
              </label>

              <label>
                PE por rodada

                <input
                  type="number"
                  value={
                    ficha.peRodada
                  }
                  readOnly
                />
              </label>
            </section>

            <section className="ficha-arquivos__atributos" data-assistente="ficha-atributos">
              <div className="ficha-arquivos__titulo-com-saldo">
                <div>
                  <h3>Atributos</h3>
                  <small>Todos começam em 1. Distribua 4 pontos; os marcos 20%, 50%, 80% e 95% concedem +1.</small>
                </div>
                <strong className={regraAtributos.excedentes ? "saldo-pontos saldo-pontos--erro" : regraAtributos.restantes ? "saldo-pontos" : "saldo-pontos saldo-pontos--completo"}>
                  {regraAtributos.excedentes ? `${regraAtributos.excedentes} acima do limite` : `${regraAtributos.restantes} ponto(s) restante(s)`}
                </strong>
              </div>

              <p className="ficha-arquivos__cola-regra">NEX {regraAtributos.nex}% · total permitido {regraAtributos.limiteTotal} · máximo {regraAtributos.limitePorAtributo} por atributo. Reduzir um valor devolve o ponto.</p>

              <div className="ficha-arquivos__atributos-lista">
                <label>
                  <span>AGI</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      ficha.agilidade
                    }
                    onChange={(evento) =>
                      atualizarAtributo(
                        "agilidade",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <small>
                    Agilidade
                  </small>
                </label>

                <label>
                  <span>FOR</span>

                  <input
                    type="number"
                    min="0"
                    value={ficha.forca}
                    onChange={(evento) =>
                      atualizarAtributo(
                        "forca",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <small>
                    Força
                  </small>
                </label>

                <label>
                  <span>INT</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      ficha.intelecto
                    }
                    onChange={(evento) =>
                      atualizarAtributo(
                        "intelecto",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <small>
                    Intelecto
                  </small>
                </label>

                <label>
                  <span>PRE</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      ficha.presenca
                    }
                    onChange={(evento) =>
                      atualizarAtributo(
                        "presenca",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <small>
                    Presença
                  </small>
                </label>

                <label>
                  <span>VIG</span>

                  <input
                    type="number"
                    min="0"
                    value={ficha.vigor}
                    onChange={(evento) =>
                      atualizarAtributo(
                        "vigor",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <small>
                    Vigor
                  </small>
                </label>
              </div>
            </section>

            <section className="ficha-arquivos__recursos" data-assistente="ficha-recursos">
              <h3>Recursos</h3>

              <div className="ficha-arquivos__recurso ficha-arquivos__recurso--pv">
                <strong>PV</strong>

                <input
                  type="number"
                  min="0"
                  aria-label="PV atual"
                  value={
                    ficha.pvAtual
                  }
                  onChange={(evento) =>
                    atualizarNumero(
                      "pvAtual",
                      evento.target
                        .value,
                    )
                  }
                />

                <span>/</span>

                <input
                  type="number"
                  aria-label="PV máximo"
                  value={
                    ficha.pvMaximo
                  }
                  readOnly
                />
              </div>

              <div className="ficha-arquivos__recurso ficha-arquivos__recurso--pe">
                <strong>PE</strong>

                <input
                  type="number"
                  min="0"
                  aria-label="PE atual"
                  value={
                    ficha.peAtual
                  }
                  onChange={(evento) =>
                    atualizarNumero(
                      "peAtual",
                      evento.target
                        .value,
                    )
                  }
                />

                <span>/</span>

                <input
                  type="number"
                  aria-label="PE máximo"
                  value={
                    ficha.peMaximo
                  }
                  readOnly
                />
              </div>

              <div className="ficha-arquivos__recurso ficha-arquivos__recurso--san">
                <strong>SAN</strong>

                <input
                  type="number"
                  min="0"
                  aria-label="SAN atual"
                  value={
                    ficha.sanAtual
                  }
                  onChange={(evento) =>
                    atualizarNumero(
                      "sanAtual",
                      evento.target
                        .value,
                    )
                  }
                />

                <span>/</span>

                <input
                  type="number"
                  aria-label="SAN máxima"
                  value={
                    ficha.sanMaximo
                  }
                  readOnly
                />
              </div>
            </section>

            <section className="ficha-arquivos__tres-colunas" data-assistente="ficha-defesa">
              <label>
                Defesa

                <input
                  type="number"
                  value={ficha.defesa}
                  readOnly
                />
              </label>

              <label>
                Proteção

                <input
                  type="number"
                  value={
                    ficha.protecao ??
                    ficha.bloqueio ??
                    0
                  }
                  readOnly
                />
              </label>

              <label>
                Esquiva

                <input
                  type="number"
                  value={ficha.esquiva}
                  readOnly
                />
              </label>
            </section>

            <section className="ficha-arquivos__tres-colunas">
              <label>
                Carga atual

                <input
                  type="number"
                  value={
                    ficha.cargaAtual ||
                    0
                  }
                  readOnly
                />
              </label>

              <label>
                Carga máxima

                <input
                  type="number"
                  value={
                    ficha.cargaMaxima ||
                    0
                  }
                  readOnly
                />
              </label>

              <label>
                Bloqueio

                <input
                  type="number"
                  value={
                    ficha.bloqueio ||
                    0
                  }
                  readOnly
                />
              </label>
            </section>
          </div>

          <TabelaPericias
            valores={ficha.pericias}
            regra={regraPericias}
            aoAlterarPericia={
              atualizarPericia
            }
          />
        </div>

        <PainelDanoCura
          pvAtual={ficha.pvAtual}
          pvMaximo={ficha.pvMaximo}
          peAtual={ficha.peAtual}
          peMaximo={ficha.peMaximo}
          sanAtual={ficha.sanAtual}
          sanMaximo={ficha.sanMaximo}
          aoAlterarPvAtual={
            atualizarPvAtual
          }
          aoAlterarPeAtual={
            atualizarPeAtual
          }
          aoAlterarSanAtual={
            atualizarSanAtual
          }
        />

        <div className="ficha-arquivos__habilidades-equipamentos">
          <PainelHabilidades
            ficha={ficha}
            habilidades={
              ficha.habilidades
            }
            aoAlterarHabilidades={
              atualizarHabilidades
            }
          />

          <section className="equipamentos-resumo" data-assistente="ficha-equipamentos">
            <header className="equipamentos-resumo__cabecalho">
              <h3>Equipamentos</h3>

              <div className="equipamentos-resumo__acoes">
                <span>
                  {itensInventario.length}{" "}
                  {itensInventario.length ===
                  1
                    ? "item"
                    : "itens"}
                </span>

                <button
                  type="button"
                  onClick={
                    abrirCatalogoEquipamentos
                  }
                >
                  Adicionar
                </button>
              </div>
            </header>

            {itensInventario.length ===
            0 ? (
              <p className="equipamentos-resumo__vazio">
                Nenhum equipamento
                registrado no inventário.
              </p>
            ) : (
              <div className="equipamentos-resumo__lista">
                {itensInventario.map(
                  (item, indice) => {
                    const estaAtivo =
                      item?.ativo !==
                      false;

                    const quantidade =
                      Number(
                        item?.quantidade,
                      ) || 0;

                    const volume =
                      Number(
                        item?.volume,
                      ) || 0;

                    return (
                      <article
                        className={
                          estaAtivo
                            ? "equipamentos-resumo__item equipamentos-resumo__item--ativo"
                            : "equipamentos-resumo__item"
                        }
                        key={
                          item?.id ||
                          `equipamento-${indice}`
                        }
                      >
                        <header>
                          <div>
                            <strong>
                              {item?.nome ||
                                "Item sem nome"}
                            </strong>

                            <span>
                              {item?.tipo ||
                                "Equipamento"}
                            </span>
                          </div>

                          <small>
                            {estaAtivo
                              ? "Em uso"
                              : "Guardado"}
                          </small>
                        </header>

                        <div className="equipamentos-resumo__dados">
                          <span>
                            Qtd.{" "}
                            <strong>
                              {quantidade}
                            </strong>
                          </span>

                          <span>
                            Volume{" "}
                            <strong>
                              {volume}
                            </strong>
                          </span>

                          {item?.dano ? (
                            <span>
                              Dano{" "}
                              <strong>
                                {
                                  item.dano
                                }
                              </strong>
                            </span>
                          ) : null}

                          {item?.alcance ? (
                            <span>
                              Alcance{" "}
                              <strong>
                                {
                                  item.alcance
                                }
                              </strong>
                            </span>
                          ) : null}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </section>
        </div>

        <PainelProgressaoNex
          ficha={ficha}
        />

        <PainelRituais
          ficha={ficha}
          rituais={ficha.rituais}
          aoAlterarRituais={
            atualizarRituais
          }
        />

        <label className="ficha-arquivos__campo-grande" data-assistente="ficha-anotacoes">
          Anotações

          <textarea
            rows="5"
            placeholder="Pistas, condições, traumas e informações importantes..."
            value={ficha.anotacoes}
            onChange={(evento) =>
              atualizarCampo(
                "anotacoes",
                evento.target.value,
              )
            }
          />
        </label>

        <footer className="ficha-arquivos__acoes" data-assistente="ficha-salvar">
          <button
            className="ficha-arquivos__salvar"
            type="submit"
          >
            Salvar ficha
          </button>

          <button
            type="button"
            onClick={criarNovaFicha}
          >
            Limpar ficha
          </button>
        </footer>
      </form>

      {catalogoEquipamentosAberto ? (
        <div
          className="catalogo-equipamentos__fundo"
          onMouseDown={(evento) => {
            if (
              evento.target ===
              evento.currentTarget
            ) {
              fecharCatalogoEquipamentos();
            }
          }}
        >
          <section
            className="catalogo-equipamentos"
            role="dialog"
            aria-modal="true"
            aria-label="Catálogo de equipamentos"
          >
            <header className="catalogo-equipamentos__cabecalho">
              <div>
                <span>
                  Catálogo de campo
                </span>

                <h2>
                  Equipamentos
                </h2>

                <p>
                  Escolha um item para
                  adicionar ao inventário
                  da ficha.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  fecharCatalogoEquipamentos
                }
              >
                Fechar
              </button>
            </header>

            <input
              className="catalogo-equipamentos__busca"
              type="search"
              placeholder="Buscar por nome, tipo ou categoria..."
              value={buscaEquipamento}
              onChange={(evento) =>
                setBuscaEquipamento(
                  evento.target.value,
                )
              }
            />

            <div className="catalogo-equipamentos__corpo">
              <div className="catalogo-equipamentos__lista">
                {itensCatalogoFiltrados.length ===
                0 ? (
                  <p className="catalogo-equipamentos__vazio">
                    Nenhum equipamento
                    encontrado.
                  </p>
                ) : (
                  itensCatalogoFiltrados.map(
                    (item) => (
                      <button
                        className={`catalogo-equipamentos__item ${obterClasseVisualItem(item)} ${
                          equipamentoSelecionadoId ===
                          item.id
                            ? "catalogo-equipamentos__item--ativo"
                            : ""
                        }`}
                        type="button"
                        key={item.id}
                        onClick={() =>
                          setEquipamentoSelecionadoId(
                            item.id,
                          )
                        }
                      >
                        <span
                          className="catalogo-equipamentos__icone"
                          aria-hidden="true"
                        >
                          {item.tipo ===
                          "Arma"
                            ? "⚔"
                            : item.tipo ===
                                "Proteção"
                              ? "⬟"
                              : item.tipo ===
                                  "Explosivo"
                                ? "✹"
                                : "▣"}
                        </span>

                        <strong>
                          {item.nome}
                        </strong>

                        <small>
                          {obterRotuloCategoriaItem(
                            item,
                          )}
                        </small>
                      </button>
                    ),
                  )
                )}
              </div>

              <section className="catalogo-equipamentos__detalhes">
                {!equipamentoSelecionado ? (
                  <>
                    <h3>
                      Selecione uma opção
                    </h3>

                    <p>
                      As informações
                      resumidas do item
                      aparecerão aqui antes
                      de adicionar.
                    </p>
                  </>
                ) : (
                  <>
                    <span
                      className={`catalogo-equipamentos__categoria ${obterClasseVisualItem(
                        equipamentoSelecionado,
                      )}`}
                    >
                      {
                        obterRotuloCategoriaItem(
                          equipamentoSelecionado,
                        )
                      }
                    </span>

                    <h3>
                      {
                        equipamentoSelecionado.nome
                      }
                    </h3>

                    <dl>
                      <div>
                        <dt>
                          Categoria
                        </dt>

                        <dd>
                          {equipamentoSelecionado
                            .categoria ||
                            "—"}
                        </dd>
                      </div>

                      <div>
                        <dt>
                          Volume
                        </dt>

                        <dd>
                          {equipamentoSelecionado
                            .volume ?? 0}
                        </dd>
                      </div>

                      <div>
                        <dt>Dano</dt>

                        <dd>
                          {equipamentoSelecionado
                            .dano ||
                            "—"}
                        </dd>
                      </div>

                      <div>
                        <dt>
                          Alcance
                        </dt>

                        <dd>
                          {equipamentoSelecionado
                            .alcance ||
                            "—"}
                        </dd>
                      </div>
                    </dl>

                    <p>
                      {
                        equipamentoSelecionado.descricao
                      }
                    </p>
                  </>
                )}
              </section>
            </div>

            <footer className="catalogo-equipamentos__rodape">
              <button
                type="button"
                onClick={
                  fecharCatalogoEquipamentos
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={
                  !equipamentoSelecionado
                }
                onClick={
                  adicionarEquipamentoSelecionado
                }
              >
                Adicionar selecionado
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </section>
  );
}

export default PainelFichas;
