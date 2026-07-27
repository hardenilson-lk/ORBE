import { criarGeradorAleatorio } from "../utils/geradorAleatorioSeed.js";

export function criarChaveConexao(
  salaAId,
  salaBId,
) {
  return [
    salaAId,
    salaBId,
  ]
    .sort()
    .join(":");
}

export function calcularDistanciaSalas(
  salaA,
  salaB,
) {
  return (
    Math.abs(
      salaA.centroX
        - salaB.centroX,
    )
    + Math.abs(
      salaA.centroY
        - salaB.centroY,
    )
  );
}

function criarArestasPossiveis(
  salas,
) {
  const arestas = [];

  for (
    let origem = 0;
    origem < salas.length;
    origem += 1
  ) {
    for (
      let destino = origem + 1;
      destino < salas.length;
      destino += 1
    ) {
      const salaOrigem =
        salas[origem];

      const salaDestino =
        salas[destino];

      arestas.push({
        salaOrigemId:
          salaOrigem.id,

        salaDestinoId:
          salaDestino.id,

        distancia:
          calcularDistanciaSalas(
            salaOrigem,
            salaDestino,
          ),

        chave:
          criarChaveConexao(
            salaOrigem.id,
            salaDestino.id,
          ),
      });
    }
  }

  return arestas.sort(
    (arestaA, arestaB) =>
      arestaA.distancia
        - arestaB.distancia
      || arestaA.chave.localeCompare(
        arestaB.chave,
      ),
  );
}

function criarEstruturaUniao(
  salas,
) {
  const pais = new Map(
    salas.map(
      (sala) => [
        sala.id,
        sala.id,
      ],
    ),
  );

  const tamanhos = new Map(
    salas.map(
      (sala) => [
        sala.id,
        1,
      ],
    ),
  );

  function encontrar(id) {
    const pai = pais.get(id);

    if (
      pai === undefined
      || pai === id
    ) {
      return id;
    }

    const raiz =
      encontrar(pai);

    pais.set(
      id,
      raiz,
    );

    return raiz;
  }

  function unir(a, b) {
    let raizA =
      encontrar(a);

    let raizB =
      encontrar(b);

    if (raizA === raizB) {
      return false;
    }

    const tamanhoA =
      tamanhos.get(raizA)
      || 1;

    const tamanhoB =
      tamanhos.get(raizB)
      || 1;

    const deveTrocar =
      tamanhoA < tamanhoB
      || (
        tamanhoA === tamanhoB
        && String(raizA)
          .localeCompare(
            String(raizB),
          ) > 0
      );

    if (deveTrocar) {
      [
        raizA,
        raizB,
      ] = [
        raizB,
        raizA,
      ];
    }

    pais.set(
      raizB,
      raizA,
    );

    tamanhos.set(
      raizA,
      tamanhoA + tamanhoB,
    );

    return true;
  }

  return {
    encontrar,
    unir,
  };
}

function criarMapaGraus(
  salas,
  conexoes = [],
) {
  const graus = new Map(
    salas.map(
      (sala) => [
        sala.id,
        0,
      ],
    ),
  );

  for (
    const conexao
    of conexoes
  ) {
    graus.set(
      conexao.salaOrigemId,
      (
        graus.get(
          conexao.salaOrigemId,
        )
        || 0
      ) + 1,
    );

    graus.set(
      conexao.salaDestinoId,
      (
        graus.get(
          conexao.salaDestinoId,
        )
        || 0
      ) + 1,
    );
  }

  return graus;
}

function calcularDistanciaReferencia({
  salas,
  arestas,
}) {
  const menoresDistancias =
    salas
      .map((sala) => {
        const distancias =
          arestas
            .filter(
              (aresta) =>
                aresta.salaOrigemId
                  === sala.id
                || aresta.salaDestinoId
                  === sala.id,
            )
            .map(
              (aresta) =>
                aresta.distancia,
            )
            .filter(
              (distancia) =>
                Number.isFinite(
                  distancia,
                ),
            );

        if (!distancias.length) {
          return null;
        }

        return Math.min(
          ...distancias,
        );
      })
      .filter(
        (distancia) =>
          distancia !== null,
      )
      .sort(
        (a, b) => a - b,
      );

  if (
    !menoresDistancias.length
  ) {
    return 1;
  }

  const meio = Math.floor(
    menoresDistancias.length
      / 2,
  );

  const mediana =
    menoresDistancias.length % 2
      ? menoresDistancias[meio]
      : (
          menoresDistancias[
            meio - 1
          ]
          + menoresDistancias[
            meio
          ]
        ) / 2;

  return Math.max(
    1,
    mediana,
  );
}

function calcularPenalidadeConcentracao({
  grauOrigem,
  grauDestino,
  distanciaReferencia,
}) {
  const excessoOrigem =
    Math.max(
      0,
      grauOrigem - 2,
    );

  const excessoDestino =
    Math.max(
      0,
      grauDestino - 2,
    );

  return (
    excessoOrigem
      + excessoDestino
  )
    * distanciaReferencia
    * 0.75;
}

function criarConexoesMinimas(
  salas,
  arestas,
) {
  const uniao =
    criarEstruturaUniao(
      salas,
    );

  const graus =
    criarMapaGraus(
      salas,
    );

  const conexoes = [];

  const distanciaReferencia =
    calcularDistanciaReferencia({
      salas,
      arestas,
    });

  while (
    conexoes.length
      < salas.length - 1
  ) {
    let melhor = null;

    for (
      const aresta
      of arestas
    ) {
      const raizOrigem =
        uniao.encontrar(
          aresta.salaOrigemId,
        );

      const raizDestino =
        uniao.encontrar(
          aresta.salaDestinoId,
        );

      if (
        raizOrigem
          === raizDestino
      ) {
        continue;
      }

      const grauOrigem =
        graus.get(
          aresta.salaOrigemId,
        )
        || 0;

      const grauDestino =
        graus.get(
          aresta.salaDestinoId,
        )
        || 0;

      const penalidade =
        calcularPenalidadeConcentracao({
          grauOrigem,
          grauDestino,
          distanciaReferencia,
        });

      const pontuacao =
        aresta.distancia
        + penalidade;

      const melhorPontuacao =
        melhor?.pontuacao
        ?? Number.POSITIVE_INFINITY;

      const pontuacaoMenor =
        pontuacao
          < melhorPontuacao;

      const pontuacaoIgual =
        Math.abs(
          pontuacao
            - melhorPontuacao,
        ) < 0.000001;

      const desempateMelhor =
        pontuacaoIgual
        && (
          !melhor
          || aresta.chave
            .localeCompare(
              melhor.aresta.chave,
            ) < 0
        );

      if (
        pontuacaoMenor
        || desempateMelhor
      ) {
        melhor = {
          aresta,
          pontuacao,
        };
      }
    }

    if (!melhor) {
      break;
    }

    const conectou =
      uniao.unir(
        melhor.aresta
          .salaOrigemId,

        melhor.aresta
          .salaDestinoId,
      );

    if (!conectou) {
      continue;
    }

    graus.set(
      melhor.aresta
        .salaOrigemId,

      (
        graus.get(
          melhor.aresta
            .salaOrigemId,
        )
        || 0
      ) + 1,
    );

    graus.set(
      melhor.aresta
        .salaDestinoId,

      (
        graus.get(
          melhor.aresta
            .salaDestinoId,
        )
        || 0
      ) + 1,
    );

    conexoes.push({
      ...melhor.aresta,
      tipo: "minima",
    });
  }

  return conexoes;
}

function obterQuantidadeExtras(
  quantidadeSalas,
  complexidade,
) {
  const base = Math.max(
    0,
    quantidadeSalas - 1,
  );

  if (
    complexidade === "baixa"
  ) {
    return quantidadeSalas >= 12
      ? 1
      : 0;
  }

  if (
    complexidade === "alta"
  ) {
    return Math.round(
      base * 0.35,
    );
  }

  return Math.round(
    base * 0.18,
  );
}

function obterProporcaoCandidatas(
  complexidade,
) {
  if (
    complexidade === "baixa"
  ) {
    return 0.35;
  }

  if (
    complexidade === "alta"
  ) {
    return 0.65;
  }

  return 0.5;
}

function criarAdjacencia(
  salas,
  conexoes,
) {
  const adjacencia = new Map(
    salas.map(
      (sala) => [
        sala.id,
        new Set(),
      ],
    ),
  );

  for (
    const conexao
    of conexoes
  ) {
    adjacencia
      .get(
        conexao.salaOrigemId,
      )
      ?.add(
        conexao.salaDestinoId,
      );

    adjacencia
      .get(
        conexao.salaDestinoId,
      )
      ?.add(
        conexao.salaOrigemId,
      );
  }

  return adjacencia;
}

function calcularDistanciaEmSaltos({
  adjacencia,
  origemId,
  destinoId,
}) {
  if (
    origemId === destinoId
  ) {
    return 0;
  }

  const visitados =
    new Set([
      origemId,
    ]);

  const fila = [{
    id: origemId,
    distancia: 0,
  }];

  while (fila.length) {
    const atual =
      fila.shift();

    const vizinhos =
      adjacencia.get(
        atual.id,
      )
      || [];

    for (
      const vizinho
      of vizinhos
    ) {
      if (
        visitados.has(
          vizinho,
        )
      ) {
        continue;
      }

      const distancia =
        atual.distancia + 1;

      if (
        vizinho === destinoId
      ) {
        return distancia;
      }

      visitados.add(
        vizinho,
      );

      fila.push({
        id: vizinho,
        distancia,
      });
    }
  }

  return Number.POSITIVE_INFINITY;
}

function registrarConexaoNaAdjacencia({
  adjacencia,
  conexao,
}) {
  adjacencia
    .get(
      conexao.salaOrigemId,
    )
    ?.add(
      conexao.salaDestinoId,
    );

  adjacencia
    .get(
      conexao.salaDestinoId,
    )
    ?.add(
      conexao.salaOrigemId,
    );
}

function adicionarConexoesExtras({
  salas,
  arestas,
  conexoesMinimas,
  quantidadeSalas,
  complexidade,
  seed,
}) {
  const quantidade =
    obterQuantidadeExtras(
      quantidadeSalas,
      complexidade,
    );

  if (quantidade === 0) {
    return [];
  }

  const existentes =
    new Set(
      conexoesMinimas.map(
        (conexao) =>
          conexao.chave,
      ),
    );

  const todasDisponiveis =
    arestas.filter(
      (aresta) =>
        !existentes.has(
          aresta.chave,
        ),
    );

  if (
    !todasDisponiveis.length
  ) {
    return [];
  }

  const proporcao =
    obterProporcaoCandidatas(
      complexidade,
    );

  const tamanhoGrupoProximo =
    Math.min(
      todasDisponiveis.length,

      Math.max(
        quantidade * 6,

        Math.ceil(
          todasDisponiveis.length
            * proporcao,
        ),
      ),
    );

  let disponiveis =
    todasDisponiveis.slice(
      0,
      tamanhoGrupoProximo,
    );

  const aleatorio =
    criarGeradorAleatorio(
      `${seed}-CONEXOES-EXTRAS`,
    );

  const prioridadeAleatoria =
    new Map(
      disponiveis.map(
        (aresta) => [
          aresta.chave,
          aleatorio(),
        ],
      ),
    );

  const graus =
    criarMapaGraus(
      salas,
      conexoesMinimas,
    );

  const extrasPorSala =
    new Map(
      salas.map(
        (sala) => [
          sala.id,
          0,
        ],
      ),
    );

  const adjacencia =
    criarAdjacencia(
      salas,
      conexoesMinimas,
    );

  const distanciaReferencia =
    calcularDistanciaReferencia({
      salas,
      arestas,
    });

  const extras = [];

  while (
    extras.length < quantidade
    && disponiveis.length
  ) {
    let melhor = null;

    for (
      const aresta
      of disponiveis
    ) {
      const saltos =
        calcularDistanciaEmSaltos({
          adjacencia,

          origemId:
            aresta.salaOrigemId,

          destinoId:
            aresta.salaDestinoId,
        });

      if (
        !Number.isFinite(
          saltos,
        )
      ) {
        continue;
      }

      const grauOrigem =
        graus.get(
          aresta.salaOrigemId,
        )
        || 0;

      const grauDestino =
        graus.get(
          aresta.salaDestinoId,
        )
        || 0;

      const extrasOrigem =
        extrasPorSala.get(
          aresta.salaOrigemId,
        )
        || 0;

      const extrasDestino =
        extrasPorSala.get(
          aresta.salaDestinoId,
        )
        || 0;

      const beneficioTopologico =
        Math.max(
          0,
          saltos - 1,
        )
        * distanciaReferencia
        * 1.25;

      const penalidadeDistancia =
        aresta.distancia;

      const penalidadeGraus =
        (
          grauOrigem
          + grauDestino
        )
        * distanciaReferencia
        * 0.08;

      const penalidadeRepeticao =
        (
          extrasOrigem
          + extrasDestino
        )
        * distanciaReferencia
        * 0.9;

      const bonusAleatorio =
        (
          prioridadeAleatoria
            .get(
              aresta.chave,
            )
          || 0
        )
        * distanciaReferencia
        * 0.12;

      const pontuacao =
        beneficioTopologico
        - penalidadeDistancia
        - penalidadeGraus
        - penalidadeRepeticao
        + bonusAleatorio;

      const melhorPontuacao =
        melhor?.pontuacao
        ?? Number.NEGATIVE_INFINITY;

      const pontuacaoMaior =
        pontuacao
          > melhorPontuacao;

      const pontuacaoIgual =
        Math.abs(
          pontuacao
            - melhorPontuacao,
        ) < 0.000001;

      const distanciaMenor =
        pontuacaoIgual
        && (
          !melhor
          || aresta.distancia
            < melhor.aresta
              .distancia
        );

      const desempatePorChave =
        pontuacaoIgual
        && melhor
        && aresta.distancia
          === melhor.aresta
            .distancia
        && aresta.chave
          .localeCompare(
            melhor.aresta.chave,
          ) < 0;

      if (
        pontuacaoMaior
        || distanciaMenor
        || desempatePorChave
      ) {
        melhor = {
          aresta,
          pontuacao,
        };
      }
    }

    if (!melhor) {
      break;
    }

    const conexaoExtra = {
      ...melhor.aresta,
      tipo: "extra",
    };

    extras.push(
      conexaoExtra,
    );

    existentes.add(
      conexaoExtra.chave,
    );

    graus.set(
      conexaoExtra.salaOrigemId,

      (
        graus.get(
          conexaoExtra
            .salaOrigemId,
        )
        || 0
      ) + 1,
    );

    graus.set(
      conexaoExtra.salaDestinoId,

      (
        graus.get(
          conexaoExtra
            .salaDestinoId,
        )
        || 0
      ) + 1,
    );

    extrasPorSala.set(
      conexaoExtra.salaOrigemId,

      (
        extrasPorSala.get(
          conexaoExtra
            .salaOrigemId,
        )
        || 0
      ) + 1,
    );

    extrasPorSala.set(
      conexaoExtra.salaDestinoId,

      (
        extrasPorSala.get(
          conexaoExtra
            .salaDestinoId,
        )
        || 0
      ) + 1,
    );

    registrarConexaoNaAdjacencia({
      adjacencia,
      conexao: conexaoExtra,
    });

    disponiveis =
      disponiveis.filter(
        (aresta) =>
          aresta.chave
            !== conexaoExtra.chave,
      );
  }

  return extras;
}

export function criarConexoesEntreSalas({
  salas,
  complexidade,
  seed,
}) {
  if (
    !Array.isArray(salas)
    || salas.length < 2
  ) {
    return {
      conexoes: [],
      conexoesMinimas: 0,
      conexoesExtras: 0,
    };
  }

  const arestas =
    criarArestasPossiveis(
      salas,
    );

  const minimas =
    criarConexoesMinimas(
      salas,
      arestas,
    );

  const extras =
    adicionarConexoesExtras({
      salas,
      arestas,
      conexoesMinimas:
        minimas,
      quantidadeSalas:
        salas.length,
      complexidade,
      seed,
    });

  const conexoes = [
    ...minimas,
    ...extras,
  ].map(
    (conexao, indice) => ({
      id:
        `conexao-${indice + 1}`,

      salaOrigemId:
        conexao.salaOrigemId,

      salaDestinoId:
        conexao.salaDestinoId,

      distancia:
        conexao.distancia,

      tipo:
        conexao.tipo,

      chave:
        conexao.chave,
    }),
  );

  return {
    conexoes,
    conexoesMinimas:
      minimas.length,

    conexoesExtras:
      extras.length,
  };
}