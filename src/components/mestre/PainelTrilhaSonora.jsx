import {
  useEffect,
  useState,
} from "react";

import "./PaineisDossie.css";

const TRILHA_VAZIA = {
  nome: "",
  url: "",
};

function PainelTrilhaSonora({
  trilhas = [],
  volumeInicial = 70,
  aoAdicionarTrilha,
  aoRemoverTrilha,
  aoSelecionarTrilha,
  aoAlterarVolume,
}) {
  const [novaTrilha, setNovaTrilha] =
    useState(TRILHA_VAZIA);

  const [trilhasLocais, setTrilhasLocais] =
    useState(trilhas);

  const [trilhaAtiva, setTrilhaAtiva] =
    useState(null);

  const [volume, setVolume] =
    useState(volumeInicial);

  useEffect(() => {
    setTrilhasLocais(
      Array.isArray(trilhas)
        ? trilhas
        : [],
    );
  }, [trilhas]);

  useEffect(() => {
    setVolume(
      Number(volumeInicial) || 0,
    );
  }, [volumeInicial]);

  function atualizarCampo(
    nomeCampo,
    valor,
  ) {
    setNovaTrilha(
      (trilhaAnterior) => ({
        ...trilhaAnterior,
        [nomeCampo]: valor,
      }),
    );
  }

  function adicionarTrilha(evento) {
    evento.preventDefault();

    const urlLimpa =
      novaTrilha.url.trim();

    if (!urlLimpa) {
      return;
    }

    const trilhaCriada = {
      id: `trilha-${Date.now()}`,
      nome:
        novaTrilha.nome.trim() ||
        "Trilha sem nome",
      url: urlLimpa,
    };

    setTrilhasLocais(
      (listaAnterior) => [
        trilhaCriada,
        ...listaAnterior,
      ],
    );

    setNovaTrilha({
      ...TRILHA_VAZIA,
    });

    if (
      typeof aoAdicionarTrilha ===
      "function"
    ) {
      aoAdicionarTrilha(
        trilhaCriada,
      );
    }
  }

  function selecionarTrilha(trilha) {
    setTrilhaAtiva(trilha);

    if (
      typeof aoSelecionarTrilha ===
      "function"
    ) {
      aoSelecionarTrilha(trilha);
    }
  }

  function removerTrilha(trilha) {
    setTrilhasLocais(
      (listaAnterior) =>
        listaAnterior.filter(
          (trilhaAtual) =>
            trilhaAtual.id !==
            trilha.id,
        ),
    );

    if (
      trilhaAtiva?.id ===
      trilha.id
    ) {
      setTrilhaAtiva(null);
    }

    if (
      typeof aoRemoverTrilha ===
      "function"
    ) {
      aoRemoverTrilha(trilha);
    }
  }

  function alterarVolume(evento) {
    const novoVolume =
      Number(evento.target.value) || 0;

    setVolume(novoVolume);

    if (
      typeof aoAlterarVolume ===
      "function"
    ) {
      aoAlterarVolume(
        novoVolume,
      );
    }
  }

  return (
    <section className="painel-dossie">
      <header className="painel-dossie__cabecalho">
        <div>
          <span>
            Ambiente da sessão
          </span>

          <h2>Trilha sonora</h2>

          <p>
            Organize músicas e efeitos
            para a campanha.
          </p>
        </div>

        <div className="painel-dossie__resumo">
          <span>
            Trilhas salvas
          </span>

          <strong>
            {trilhasLocais.length}
          </strong>
        </div>
      </header>

      <form
        className="painel-dossie__formulario"
        onSubmit={adicionarTrilha}
      >
        <h3>Adicionar trilha</h3>

        <div className="painel-dossie__campos">
          <label>
            Nome da trilha

            <input
              type="text"
              maxLength={60}
              placeholder="Ex.: Tema da investigação"
              value={novaTrilha.nome}
              onChange={(evento) =>
                atualizarCampo(
                  "nome",
                  evento.target.value,
                )
              }
            />
          </label>

          <label className="painel-dossie__campo-grande">
            Link da música ou áudio

            <input
              type="url"
              placeholder="YouTube, Spotify ou áudio direto"
              value={novaTrilha.url}
              onChange={(evento) =>
                atualizarCampo(
                  "url",
                  evento.target.value,
                )
              }
            />
          </label>
        </div>

        <button
          className="painel-dossie__botao-principal"
          type="submit"
        >
          Adicionar trilha
        </button>
      </form>

      <section className="painel-dossie__conteudo">
        <h3>Controle da mesa</h3>

        <div className="trilha-sonora__controle">
          <label>
            Volume da mesa

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={alterarVolume}
            />
          </label>

          <strong>
            {volume}%
          </strong>
        </div>

        <div className="trilha-sonora__reprodutor">
          {trilhaAtiva ? (
            <>
              <span>
                Tocando agora
              </span>

              <strong>
                {trilhaAtiva.nome}
              </strong>

              <a
                href={trilhaAtiva.url}
                target="_blank"
                rel="noreferrer"
              >
                Abrir trilha
              </a>
            </>
          ) : (
            <p>
              Nenhuma trilha selecionada.
            </p>
          )}
        </div>
      </section>

      <section className="painel-dossie__conteudo">
        <h3>Biblioteca de trilhas</h3>

        {trilhasLocais.length === 0 ? (
          <p className="painel-dossie__vazio">
            Nenhuma trilha adicionada
            para esta campanha.
          </p>
        ) : (
          <div className="trilha-sonora__lista">
            {trilhasLocais.map(
              (trilha) => {
                const estaAtiva =
                  trilhaAtiva?.id ===
                  trilha.id;

                return (
                  <article
                    className={
                      estaAtiva
                        ? "trilha-sonora__item trilha-sonora__item--ativo"
                        : "trilha-sonora__item"
                    }
                    key={trilha.id}
                  >
                    <div>
                      <span>
                        Trilha da campanha
                      </span>

                      <strong>
                        {trilha.nome}
                      </strong>

                      <small>
                        {trilha.url}
                      </small>
                    </div>

                    <div className="trilha-sonora__acoes">
                      <button
                        type="button"
                        onClick={() =>
                          selecionarTrilha(
                            trilha,
                          )
                        }
                      >
                        Selecionar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removerTrilha(
                            trilha,
                          )
                        }
                      >
                        Remover
                      </button>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>
    </section>
  );
}

export default PainelTrilhaSonora;