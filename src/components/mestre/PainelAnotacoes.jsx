import {
  useEffect,
  useState,
} from "react";

import "./PaineisDossie.css";

const ANOTACAO_VAZIA = {
  titulo: "",
  categoria: "Geral",
  conteudo: "",
  privada: false,
};

function PainelAnotacoes({
  anotacoes = [],
  aoAdicionarAnotacao,
  aoAtualizarAnotacao,
  aoRemoverAnotacao,
}) {
  const [novaAnotacao, setNovaAnotacao] =
    useState(ANOTACAO_VAZIA);

  const [anotacoesLocais, setAnotacoesLocais] =
    useState(anotacoes);

  useEffect(() => {
    setAnotacoesLocais(
      Array.isArray(anotacoes)
        ? anotacoes
        : [],
    );
  }, [anotacoes]);

  function atualizarCampo(
    nomeCampo,
    valor,
  ) {
    setNovaAnotacao(
      (anotacaoAnterior) => ({
        ...anotacaoAnterior,
        [nomeCampo]: valor,
      }),
    );
  }

  function adicionarAnotacao(evento) {
    evento.preventDefault();

    if (
      !novaAnotacao.titulo.trim() &&
      !novaAnotacao.conteudo.trim()
    ) {
      return;
    }

    const anotacaoCriada = {
      ...novaAnotacao,
      id: `anotacao-${Date.now()}`,
      titulo:
        novaAnotacao.titulo.trim() ||
        "Anotação sem título",
      conteudo:
        novaAnotacao.conteudo.trim(),
      criadaEm:
        new Date().toLocaleString(
          "pt-BR",
        ),
    };

    setAnotacoesLocais(
      (listaAnterior) => [
        anotacaoCriada,
        ...listaAnterior,
      ],
    );

    setNovaAnotacao({
      ...ANOTACAO_VAZIA,
    });

    if (
      typeof aoAdicionarAnotacao ===
      "function"
    ) {
      aoAdicionarAnotacao(
        anotacaoCriada,
      );
    }
  }

  function alterarAnotacao(
    anotacao,
    nomeCampo,
    valor,
  ) {
    const anotacaoAtualizada = {
      ...anotacao,
      [nomeCampo]: valor,
    };

    setAnotacoesLocais(
      (listaAnterior) =>
        listaAnterior.map(
          (anotacaoAtual) =>
            anotacaoAtual.id ===
            anotacao.id
              ? anotacaoAtualizada
              : anotacaoAtual,
        ),
    );

    if (
      typeof aoAtualizarAnotacao ===
      "function"
    ) {
      aoAtualizarAnotacao(
        anotacaoAtualizada,
      );
    }
  }

  function removerAnotacao(anotacao) {
    setAnotacoesLocais(
      (listaAnterior) =>
        listaAnterior.filter(
          (anotacaoAtual) =>
            anotacaoAtual.id !==
            anotacao.id,
        ),
    );

    if (
      typeof aoRemoverAnotacao ===
      "function"
    ) {
      aoRemoverAnotacao(anotacao);
    }
  }

  return (
    <section className="painel-dossie">
      <header className="painel-dossie__cabecalho">
        <div>
          <span>
            Registro da investigação
          </span>

          <h2>Anotações</h2>

          <p>
            Guarde observações, pistas e
            informações da campanha.
          </p>
        </div>

        <div className="painel-dossie__resumo">
          <span>
            Registros salvos
          </span>

          <strong>
            {anotacoesLocais.length}
          </strong>
        </div>
      </header>

      <form
        className="painel-dossie__formulario"
        onSubmit={adicionarAnotacao}
      >
        <h3>Nova anotação</h3>

        <div className="painel-dossie__campos">
          <label>
            Título

            <input
              type="text"
              maxLength={70}
              placeholder="Ex.: Símbolo encontrado"
              value={novaAnotacao.titulo}
              onChange={(evento) =>
                atualizarCampo(
                  "titulo",
                  evento.target.value,
                )
              }
            />
          </label>

          <label>
            Categoria

            <select
              value={novaAnotacao.categoria}
              onChange={(evento) =>
                atualizarCampo(
                  "categoria",
                  evento.target.value,
                )
              }
            >
              <option value="Geral">
                Geral
              </option>

              <option value="Pista">
                Pista
              </option>

              <option value="NPC">
                NPC
              </option>

              <option value="Local">
                Local
              </option>

              <option value="Suspeito">
                Suspeito
              </option>

              <option value="Paranormal">
                Paranormal
              </option>
            </select>
          </label>

          <label>
            Visibilidade

            <select
              value={
                novaAnotacao.privada
                  ? "privada"
                  : "publica"
              }
              onChange={(evento) =>
                atualizarCampo(
                  "privada",
                  evento.target.value ===
                    "privada",
                )
              }
            >
              <option value="publica">
                Visível para a mesa
              </option>

              <option value="privada">
                Somente mestre
              </option>
            </select>
          </label>
        </div>

        <label className="painel-dossie__campo-grande">
          Conteúdo

          <textarea
            rows="6"
            maxLength={1200}
            placeholder="Escreva os detalhes da anotação..."
            value={novaAnotacao.conteudo}
            onChange={(evento) =>
              atualizarCampo(
                "conteudo",
                evento.target.value,
              )
            }
          />
        </label>

        <button
          className="painel-dossie__botao-principal"
          type="submit"
        >
          Salvar anotação
        </button>
      </form>

      <section className="painel-dossie__conteudo">
        <h3>Anotações registradas</h3>

        {anotacoesLocais.length === 0 ? (
          <p className="painel-dossie__vazio">
            Nenhuma anotação registrada
            nesta campanha.
          </p>
        ) : (
          <div className="anotacoes-arquivos">
            {anotacoesLocais.map(
              (anotacao) => (
                <article
                  className="anotacoes-arquivos__item"
                  key={anotacao.id}
                >
                  <header>
                    <div>
                      <span>
                        {anotacao.categoria}
                      </span>

                      <h4>
                        {anotacao.titulo}
                      </h4>

                      <small>
                        {anotacao.criadaEm}
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removerAnotacao(
                          anotacao,
                        )
                      }
                    >
                      Remover
                    </button>
                  </header>

                  <textarea
                    rows="5"
                    aria-label={`Conteúdo de ${anotacao.titulo}`}
                    value={
                      anotacao.conteudo
                    }
                    onChange={(evento) =>
                      alterarAnotacao(
                        anotacao,
                        "conteudo",
                        evento.target.value,
                      )
                    }
                  />

                  <label className="anotacoes-arquivos__privada">
                    <input
                      type="checkbox"
                      checked={
                        anotacao.privada ===
                        true
                      }
                      onChange={(evento) =>
                        alterarAnotacao(
                          anotacao,
                          "privada",
                          evento.target
                            .checked,
                        )
                      }
                    />

                    Somente o mestre pode ver
                  </label>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </section>
  );
}

export default PainelAnotacoes;