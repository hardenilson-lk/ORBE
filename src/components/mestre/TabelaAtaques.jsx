function criarIdAtaque() {
  return `ataque-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function criarAtaqueVazio(
  valoresIniciais = {},
) {
  return {
    id: criarIdAtaque(),
    nome: "",
    teste: "1d20",
    dano: "1d4",
    critico: "20",
    alcance: "Curto",
    especial: "",
    ...valoresIniciais,
  };
}

export function normalizarAtaquesFicha(
  ataquesRecebidos,
) {
  if (Array.isArray(ataquesRecebidos)) {
    return ataquesRecebidos.map(
      (ataque) =>
        criarAtaqueVazio({
          ...ataque,
          id:
            ataque?.id ||
            criarIdAtaque(),
        }),
    );
  }

  const texto =
    String(
      ataquesRecebidos || "",
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
      const partes =
        linha
          .split("|")
          .map((parte) =>
            parte.trim(),
          );

      return criarAtaqueVazio({
        nome:
          partes[0] ||
          linha,
        teste:
          partes[1] ||
          "1d20",
        dano:
          partes[2] ||
          "1d4",
        critico:
          partes[3] ||
          "20",
        alcance:
          partes[4] ||
          "Curto",
        especial:
          partes[5] ||
          "",
      });
    });
}

function TabelaAtaques({
  ataques = [],
  aoAlterarAtaques,
  aoRolarAtaque,
}) {
  const listaAtaques =
    normalizarAtaquesFicha(
      ataques,
    );

  function enviarLista(
    novaLista,
  ) {
    if (
      typeof aoAlterarAtaques ===
      "function"
    ) {
      aoAlterarAtaques(
        novaLista,
      );
    }
  }

  function adicionarAtaque() {
    enviarLista([
      ...listaAtaques,
      criarAtaqueVazio({
        nome: "Novo ataque",
      }),
    ]);
  }

  function atualizarAtaque(
    ataqueId,
    campo,
    valor,
  ) {
    const novaLista =
      listaAtaques.map(
        (ataque) =>
          ataque.id ===
          ataqueId
            ? {
                ...ataque,
                [campo]: valor,
              }
            : ataque,
      );

    enviarLista(novaLista);
  }

  function removerAtaque(
    ataqueId,
  ) {
    const novaLista =
      listaAtaques.filter(
        (ataque) =>
          ataque.id !==
          ataqueId,
      );

    enviarLista(novaLista);
  }

  function rolarAtaque(
    ataque,
  ) {
    if (
      typeof aoRolarAtaque !==
      "function"
    ) {
      return;
    }

    aoRolarAtaque(ataque);
  }

  return (
    <section className="tabela-ataques" data-assistente="ficha-ataques">
      <header className="tabela-ataques__cabecalho">
        <h3>Ataques</h3>

        <button
          type="button"
          onClick={adicionarAtaque}
        >
          Novo ataque
        </button>
      </header>

      <div className="tabela-ataques__rolagem">
        <div className="tabela-ataques__titulos">
          <span>
            Nome do ataque
          </span>

          <span>Teste</span>

          <span>Dano</span>

          <span>Crítico</span>

          <span>Alcance</span>

          <span>Especial</span>

          <span aria-hidden="true">
            Ações
          </span>
        </div>

        {listaAtaques.length ===
        0 ? (
          <p className="tabela-ataques__vazio">
            Nenhum ataque cadastrado.
          </p>
        ) : (
          <div className="tabela-ataques__linhas">
            {listaAtaques.map(
              (ataque) => (
                <div
                  className="tabela-ataques__linha"
                  key={ataque.id}
                >
                  <input
                    type="text"
                    aria-label="Nome do ataque"
                    value={ataque.nome}
                    onChange={(evento) =>
                      atualizarAtaque(
                        ataque.id,
                        "nome",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <input
                    type="text"
                    aria-label={`Teste de ${ataque.nome}`}
                    value={ataque.teste}
                    onChange={(evento) =>
                      atualizarAtaque(
                        ataque.id,
                        "teste",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <input
                    type="text"
                    aria-label={`Dano de ${ataque.nome}`}
                    value={ataque.dano}
                    onChange={(evento) =>
                      atualizarAtaque(
                        ataque.id,
                        "dano",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <input
                    type="text"
                    aria-label={`Crítico de ${ataque.nome}`}
                    value={
                      ataque.critico
                    }
                    onChange={(evento) =>
                      atualizarAtaque(
                        ataque.id,
                        "critico",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <input
                    type="text"
                    aria-label={`Alcance de ${ataque.nome}`}
                    value={
                      ataque.alcance
                    }
                    onChange={(evento) =>
                      atualizarAtaque(
                        ataque.id,
                        "alcance",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <input
                    type="text"
                    aria-label={`Efeito especial de ${ataque.nome}`}
                    value={
                      ataque.especial
                    }
                    onChange={(evento) =>
                      atualizarAtaque(
                        ataque.id,
                        "especial",
                        evento.target
                          .value,
                      )
                    }
                  />

                  <div className="tabela-ataques__acoes">
                    <button
                      type="button"
                      onClick={() =>
                        rolarAtaque(
                          ataque,
                        )
                      }
                    >
                      Rolar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removerAtaque(
                          ataque.id,
                        )
                      }
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default TabelaAtaques;
