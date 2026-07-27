import { criarGeradorAleatorio } from "../utils/geradorAleatorioSeed.js";

const PESO_INTERSECAO_SALA = 100000;
const PESO_INTERSECAO_SALA_EXTREMIDADE = 4000;
const PESO_INTERSECAO_CORREDOR = 8;
const PESO_CURVA = 4;

function limitar(valor, minimo, maximo) {
  return Math.min(
    maximo,
    Math.max(minimo, valor),
  );
}

function criarChaveCelula(celula) {
  return `${celula.x}:${celula.y}`;
}

function criarChavePontos(pontos) {
  return pontos
    .map((ponto) => criarChaveCelula(ponto))
    .join("|");
}

function calcularDistanciaManhattan(pontoA, pontoB) {
  return (
    Math.abs(pontoA.x - pontoB.x)
    + Math.abs(pontoA.y - pontoB.y)
  );
}

function celulaEstaDentroSala(celula, sala) {
  return (
    celula.x >= sala.x
    && celula.x < sala.x + sala.largura
    && celula.y >= sala.y
    && celula.y < sala.y + sala.altura
  );
}

export function calcularPontosAcessoEntreSalas(
  salaA,
  salaB,
) {
  const diferencaX =
    salaB.centroX - salaA.centroX;

  const diferencaY =
    salaB.centroY - salaA.centroY;

  if (
    Math.abs(diferencaX)
    >= Math.abs(diferencaY)
  ) {
    const destinoEstaDireita =
      diferencaX >= 0;

    return {
      inicio: {
        x: destinoEstaDireita
          ? salaA.x + salaA.largura - 1
          : salaA.x,

        y: limitar(
          Math.floor(salaB.centroY),
          salaA.y,
          salaA.y + salaA.altura - 1,
        ),
      },

      fim: {
        x: destinoEstaDireita
          ? salaB.x
          : salaB.x + salaB.largura - 1,

        y: limitar(
          Math.floor(salaA.centroY),
          salaB.y,
          salaB.y + salaB.altura - 1,
        ),
      },
    };
  }

  const destinoEstaAbaixo =
    diferencaY >= 0;

  return {
    inicio: {
      x: limitar(
        Math.floor(salaB.centroX),
        salaA.x,
        salaA.x + salaA.largura - 1,
      ),

      y: destinoEstaAbaixo
        ? salaA.y + salaA.altura - 1
        : salaA.y,
    },

    fim: {
      x: limitar(
        Math.floor(salaA.centroX),
        salaB.x,
        salaB.x + salaB.largura - 1,
      ),

      y: destinoEstaAbaixo
        ? salaB.y
        : salaB.y + salaB.altura - 1,
    },
  };
}

function removerPontosRepetidos(pontos) {
  const resultado = [];

  for (const ponto of pontos) {
    const anterior =
      resultado[resultado.length - 1];

    if (
      anterior
      && anterior.x === ponto.x
      && anterior.y === ponto.y
    ) {
      continue;
    }

    resultado.push({
      x: ponto.x,
      y: ponto.y,
    });
  }

  return resultado;
}

function removerPontosColineares(pontos) {
  const resultado = [];

  for (const ponto of pontos) {
    resultado.push(ponto);

    while (resultado.length >= 3) {
      const pontoA =
        resultado[resultado.length - 3];

      const pontoB =
        resultado[resultado.length - 2];

      const pontoC =
        resultado[resultado.length - 1];

      const mesmaLinhaHorizontal =
        pontoA.y === pontoB.y
        && pontoB.y === pontoC.y;

      const mesmaLinhaVertical =
        pontoA.x === pontoB.x
        && pontoB.x === pontoC.x;

      if (
        !mesmaLinhaHorizontal
        && !mesmaLinhaVertical
      ) {
        break;
      }

      resultado.splice(
        resultado.length - 2,
        1,
      );
    }
  }

  return resultado;
}

function normalizarPontosRota(pontos) {
  return removerPontosColineares(
    removerPontosRepetidos(pontos),
  );
}

function criarSegmentosDosPontos(pontos) {
  const segmentos = [];

  for (
    let indice = 0;
    indice < pontos.length - 1;
    indice += 1
  ) {
    const inicio = pontos[indice];
    const fim = pontos[indice + 1];

    if (
      inicio.x === fim.x
      && inicio.y === fim.y
    ) {
      continue;
    }

    if (
      inicio.x !== fim.x
      && inicio.y !== fim.y
    ) {
      continue;
    }

    segmentos.push({
      inicio,
      fim,
    });
  }

  return segmentos;
}

export function gerarCelulasDoSegmento(
  inicio,
  fim,
) {
  const celulas = [];

  const passoX =
    Math.sign(fim.x - inicio.x);

  const passoY =
    Math.sign(fim.y - inicio.y);

  let x = inicio.x;
  let y = inicio.y;

  celulas.push({ x, y });

  while (
    x !== fim.x
    || y !== fim.y
  ) {
    x += passoX;
    y += passoY;

    celulas.push({ x, y });
  }

  return celulas;
}

function criarSequenciaOffsets(
  inicio,
  quantidade,
) {
  return Array.from(
    { length: quantidade },
    (_, indice) => inicio + indice,
  );
}

function obterOpcoesOffsets(largura) {
  const larguraSegura =
    Math.max(
      1,
      Math.round(Number(largura) || 1),
    );

  if (larguraSegura === 1) {
    return [[0]];
  }

  const inicioCentral =
    -Math.floor(larguraSegura / 2);

  const opcoes =
    larguraSegura % 2 === 0
      ? [
          criarSequenciaOffsets(
            inicioCentral + 1,
            larguraSegura,
          ),

          criarSequenciaOffsets(
            inicioCentral,
            larguraSegura,
          ),
        ]
      : [
          criarSequenciaOffsets(
            inicioCentral,
            larguraSegura,
          ),

          criarSequenciaOffsets(
            inicioCentral + 1,
            larguraSegura,
          ),

          criarSequenciaOffsets(
            inicioCentral - 1,
            larguraSegura,
          ),
        ];

  const unicas = new Map();

  for (const opcao of opcoes) {
    unicas.set(
      opcao.join(":"),
      opcao,
    );
  }

  return [...unicas.values()];
}

function escolherOffsets(
  segmento,
  largura,
  larguraMapa,
  alturaMapa,
  preferencia,
) {
  const horizontal =
    segmento.inicio.y === segmento.fim.y;

  const referencia =
    horizontal
      ? segmento.inicio.y
      : segmento.inicio.x;

  const limite =
    horizontal
      ? alturaMapa
      : larguraMapa;

  const opcoes =
    obterOpcoesOffsets(largura);

  const inicio =
    Math.abs(preferencia) % opcoes.length;

  for (
    let deslocamento = 0;
    deslocamento < opcoes.length;
    deslocamento += 1
  ) {
    const opcao =
      opcoes[
        (inicio + deslocamento)
        % opcoes.length
      ];

    const cabeNoMapa =
      opcao.every(
        (offset) =>
          referencia + offset >= 0
          && referencia + offset < limite,
      );

    if (cabeNoMapa) {
      return opcao;
    }
  }

  return [0];
}

function expandirSegmentos({
  segmentos,
  inicio,
  largura,
  larguraMapa,
  alturaMapa,
  preferencia,
}) {
  const unicas = new Map();

  if (!segmentos.length) {
    unicas.set(
      criarChaveCelula(inicio),
      inicio,
    );
  }

  segmentos.forEach(
    (segmento, indice) => {
      const horizontal =
        segmento.inicio.y
        === segmento.fim.y;

      const offsets =
        escolherOffsets(
          segmento,
          largura,
          larguraMapa,
          alturaMapa,
          preferencia + indice,
        );

      const celulasSegmento =
        gerarCelulasDoSegmento(
          segmento.inicio,
          segmento.fim,
        );

      for (const celula of celulasSegmento) {
        for (const offset of offsets) {
          const expandida =
            horizontal
              ? {
                  x: celula.x,
                  y: celula.y + offset,
                }
              : {
                  x: celula.x + offset,
                  y: celula.y,
                };

          const estaNoMapa =
            expandida.x >= 0
            && expandida.x < larguraMapa
            && expandida.y >= 0
            && expandida.y < alturaMapa;

          if (!estaNoMapa) {
            continue;
          }

          unicas.set(
            criarChaveCelula(expandida),
            expandida,
          );
        }
      }
    },
  );

  return [...unicas.values()];
}

function contarIntersecoesComOutrasSalas(
  celulas,
  salas,
  idsIgnorados,
) {
  let total = 0;

  for (const celula of celulas) {
    const atravessaOutraSala =
      salas.some(
        (sala) =>
          !idsIgnorados.has(sala.id)
          && celulaEstaDentroSala(
            celula,
            sala,
          ),
      );

    if (atravessaOutraSala) {
      total += 1;
    }
  }

  return total;
}

function contarIntersecoesInternasExtremidades({
  celulas,
  origem,
  destino,
  inicio,
  fim,
  largura,
}) {
  const raioPermitido =
    Math.max(
      1,
      Math.ceil(
        Math.max(1, largura) / 2,
      ),
    );

  let total = 0;

  for (const celula of celulas) {
    if (
      celulaEstaDentroSala(
        celula,
        origem,
      )
      && calcularDistanciaManhattan(
        celula,
        inicio,
      ) > raioPermitido
    ) {
      total += 1;
      continue;
    }

    if (
      celulaEstaDentroSala(
        celula,
        destino,
      )
      && calcularDistanciaManhattan(
        celula,
        fim,
      ) > raioPermitido
    ) {
      total += 1;
    }
  }

  return total;
}

function contarIntersecoesComCorredores(
  celulas,
  celulasOcupadas,
) {
  let total = 0;

  for (const celula of celulas) {
    if (
      celulasOcupadas.has(
        criarChaveCelula(celula),
      )
    ) {
      total += 1;
    }
  }

  return total;
}

function adicionarCoordenada(
  conjunto,
  valor,
  limite,
) {
  if (!Number.isFinite(valor)) {
    return;
  }

  conjunto.add(
    limitar(
      Math.round(valor),
      0,
      limite - 1,
    ),
  );
}

function obterCoordenadasDesvioX({
  inicio,
  fim,
  salas,
  idsIgnorados,
  largura,
  larguraMapa,
}) {
  const coordenadas = new Set();

  const distancia =
    fim.x - inicio.x;

  adicionarCoordenada(
    coordenadas,
    (inicio.x + fim.x) / 2,
    larguraMapa,
  );

  adicionarCoordenada(
    coordenadas,
    inicio.x + distancia / 3,
    larguraMapa,
  );

  adicionarCoordenada(
    coordenadas,
    inicio.x + (distancia * 2) / 3,
    larguraMapa,
  );

  const margem =
    Math.max(
      2,
      Math.ceil(largura) + 1,
    );

  for (const sala of salas) {
    if (idsIgnorados.has(sala.id)) {
      continue;
    }

    adicionarCoordenada(
      coordenadas,
      sala.x - margem,
      larguraMapa,
    );

    adicionarCoordenada(
      coordenadas,
      sala.x + sala.largura - 1 + margem,
      larguraMapa,
    );
  }

  return [...coordenadas]
    .sort((a, b) => a - b);
}

function obterCoordenadasDesvioY({
  inicio,
  fim,
  salas,
  idsIgnorados,
  largura,
  alturaMapa,
}) {
  const coordenadas = new Set();

  const distancia =
    fim.y - inicio.y;

  adicionarCoordenada(
    coordenadas,
    (inicio.y + fim.y) / 2,
    alturaMapa,
  );

  adicionarCoordenada(
    coordenadas,
    inicio.y + distancia / 3,
    alturaMapa,
  );

  adicionarCoordenada(
    coordenadas,
    inicio.y + (distancia * 2) / 3,
    alturaMapa,
  );

  const margem =
    Math.max(
      2,
      Math.ceil(largura) + 1,
    );

  for (const sala of salas) {
    if (idsIgnorados.has(sala.id)) {
      continue;
    }

    adicionarCoordenada(
      coordenadas,
      sala.y - margem,
      alturaMapa,
    );

    adicionarCoordenada(
      coordenadas,
      sala.y + sala.altura - 1 + margem,
      alturaMapa,
    );
  }

  return [...coordenadas]
    .sort((a, b) => a - b);
}

function adicionarCandidato(
  candidatos,
  pontos,
  tipo,
) {
  const normalizados =
    normalizarPontosRota(pontos);

  if (normalizados.length < 2) {
    return;
  }

  const segmentos =
    criarSegmentosDosPontos(
      normalizados,
    );

  if (!segmentos.length) {
    return;
  }

  if (
    segmentos.length
    !== normalizados.length - 1
  ) {
    return;
  }

  const chave =
    criarChavePontos(normalizados);

  if (candidatos.has(chave)) {
    return;
  }

  candidatos.set(chave, {
    chave,
    tipo,
    pontos: normalizados,
    segmentos,
  });
}

function criarCandidatosRota({
  inicio,
  fim,
  salas,
  idsIgnorados,
  largura,
  larguraMapa,
  alturaMapa,
}) {
  const candidatos = new Map();

  if (
    inicio.x === fim.x
    || inicio.y === fim.y
  ) {
    adicionarCandidato(
      candidatos,
      [inicio, fim],
      "direta",
    );
  }

  adicionarCandidato(
    candidatos,
    [
      inicio,
      {
        x: fim.x,
        y: inicio.y,
      },
      fim,
    ],
    "curva-horizontal",
  );

  adicionarCandidato(
    candidatos,
    [
      inicio,
      {
        x: inicio.x,
        y: fim.y,
      },
      fim,
    ],
    "curva-vertical",
  );

  const desviosX =
    obterCoordenadasDesvioX({
      inicio,
      fim,
      salas,
      idsIgnorados,
      largura,
      larguraMapa,
    });

  for (const x of desviosX) {
    adicionarCandidato(
      candidatos,
      [
        inicio,
        {
          x,
          y: inicio.y,
        },
        {
          x,
          y: fim.y,
        },
        fim,
      ],
      "desvio-vertical",
    );
  }

  const desviosY =
    obterCoordenadasDesvioY({
      inicio,
      fim,
      salas,
      idsIgnorados,
      largura,
      alturaMapa,
    });

  for (const y of desviosY) {
    adicionarCandidato(
      candidatos,
      [
        inicio,
        {
          x: inicio.x,
          y,
        },
        {
          x: fim.x,
          y,
        },
        fim,
      ],
      "desvio-horizontal",
    );
  }

  return [...candidatos.values()];
}

function calcularPontuacaoRota({
  intersecoesSalas,
  intersecoesExtremidades,
  intersecoesCorredores,
  quantidadeCelulas,
  quantidadeCurvas,
}) {
  return (
    intersecoesSalas
      * PESO_INTERSECAO_SALA
    + intersecoesExtremidades
      * PESO_INTERSECAO_SALA_EXTREMIDADE
    + intersecoesCorredores
      * PESO_INTERSECAO_CORREDOR
    + quantidadeCelulas
    + quantidadeCurvas
      * PESO_CURVA
  );
}

function criarOpcaoRota({
  candidato,
  largura,
  larguraMapa,
  alturaMapa,
  preferencia,
  salas,
  idsIgnorados,
  origem,
  destino,
  inicio,
  fim,
  celulasOcupadas,
  aleatorio,
}) {
  const celulas =
    expandirSegmentos({
      segmentos:
        candidato.segmentos,

      inicio,
      largura,
      larguraMapa,
      alturaMapa,
      preferencia,
    });

  const intersecoesSalas =
    contarIntersecoesComOutrasSalas(
      celulas,
      salas,
      idsIgnorados,
    );

  const intersecoesExtremidades =
    contarIntersecoesInternasExtremidades({
      celulas,
      origem,
      destino,
      inicio,
      fim,
      largura,
    });

  const intersecoesCorredores =
    contarIntersecoesComCorredores(
      celulas,
      celulasOcupadas,
    );

  const quantidadeCurvas =
    Math.max(
      0,
      candidato.segmentos.length - 1,
    );

  const pontuacao =
    calcularPontuacaoRota({
      intersecoesSalas,
      intersecoesExtremidades,
      intersecoesCorredores,
      quantidadeCelulas:
        celulas.length,
      quantidadeCurvas,
    });

  return {
    ...candidato,

    celulas,

    intersecoes:
      intersecoesSalas,

    intersecoesComOutrasSalas:
      intersecoesSalas,

    intersecoesComSalasExtremidade:
      intersecoesExtremidades,

    intersecoesComCorredores:
      intersecoesCorredores,

    quantidadeCurvas,

    pontuacao,

    desempateAleatorio:
      aleatorio(),
  };
}

function compararOpcoesRota(
  opcaoA,
  opcaoB,
) {
  if (
    opcaoA.pontuacao
    !== opcaoB.pontuacao
  ) {
    return (
      opcaoA.pontuacao
      - opcaoB.pontuacao
    );
  }

  if (
    opcaoA.intersecoesComOutrasSalas
    !== opcaoB.intersecoesComOutrasSalas
  ) {
    return (
      opcaoA.intersecoesComOutrasSalas
      - opcaoB.intersecoesComOutrasSalas
    );
  }

  if (
    opcaoA.intersecoesComSalasExtremidade
    !== opcaoB.intersecoesComSalasExtremidade
  ) {
    return (
      opcaoA.intersecoesComSalasExtremidade
      - opcaoB.intersecoesComSalasExtremidade
    );
  }

  if (
    opcaoA.celulas.length
    !== opcaoB.celulas.length
  ) {
    return (
      opcaoA.celulas.length
      - opcaoB.celulas.length
    );
  }

  if (
    opcaoA.quantidadeCurvas
    !== opcaoB.quantidadeCurvas
  ) {
    return (
      opcaoA.quantidadeCurvas
      - opcaoB.quantidadeCurvas
    );
  }

  if (
    opcaoA.desempateAleatorio
    !== opcaoB.desempateAleatorio
  ) {
    return (
      opcaoA.desempateAleatorio
      - opcaoB.desempateAleatorio
    );
  }

  return opcaoA.chave.localeCompare(
    opcaoB.chave,
  );
}

function escolherMelhorRota({
  inicio,
  fim,
  origem,
  destino,
  salas,
  largura,
  larguraMapa,
  alturaMapa,
  preferencia,
  celulasOcupadas,
  aleatorio,
}) {
  const idsIgnorados =
    new Set([
      origem.id,
      destino.id,
    ]);

  const candidatos =
    criarCandidatosRota({
      inicio,
      fim,
      salas,
      idsIgnorados,
      largura,
      larguraMapa,
      alturaMapa,
    });

  const opcoes =
    candidatos.map(
      (candidato, indice) =>
        criarOpcaoRota({
          candidato,
          largura,
          larguraMapa,
          alturaMapa,

          preferencia:
            preferencia + indice,

          salas,
          idsIgnorados,
          origem,
          destino,
          inicio,
          fim,
          celulasOcupadas,
          aleatorio,
        }),
    );

  opcoes.sort(
    compararOpcoesRota,
  );

  return opcoes[0];
}

export function consolidarCelulasCorredores(
  corredores,
) {
  const unicas = new Map();

  for (const corredor of corredores) {
    for (const celula of corredor.celulas) {
      unicas.set(
        criarChaveCelula(celula),
        celula,
      );
    }
  }

  return [...unicas.values()];
}

export function gerarCorredores({
  conexoes,
  salas,
  seed,
  largura,
  larguraMapa,
  alturaMapa,
}) {
  const salasPorId =
    new Map(
      salas.map(
        (sala) => [
          sala.id,
          sala,
        ],
      ),
    );

  const aleatorio =
    criarGeradorAleatorio(
      `${seed}-CORREDORES`,
    );

  const corredores = [];
  const celulasOcupadas = new Set();

  conexoes.forEach(
    (conexao, indice) => {
      const origem =
        salasPorId.get(
          conexao.salaOrigemId,
        );

      const destino =
        salasPorId.get(
          conexao.salaDestinoId,
        );

      if (!origem || !destino) {
        return;
      }

      const { inicio, fim } =
        calcularPontosAcessoEntreSalas(
          origem,
          destino,
        );

      const preferencia =
        Math.floor(
          aleatorio() * 100000,
        );

      const rota =
        escolherMelhorRota({
          inicio,
          fim,
          origem,
          destino,
          salas,
          largura,
          larguraMapa,
          alturaMapa,
          preferencia,
          celulasOcupadas,
          aleatorio,
        });

      if (!rota) {
        return;
      }

      const corredor = {
        id:
          `corredor-${indice + 1}`,

        conexaoId:
          conexao.id,

        salaOrigemId:
          origem.id,

        salaDestinoId:
          destino.id,

        largura,

        inicio,
        fim,

        tipoRota:
          rota.tipo,

        segmentos:
          rota.segmentos,

        celulas:
          rota.celulas,

        intersecoesComOutrasSalas:
          rota.intersecoesComOutrasSalas,

        intersecoesComSalasExtremidade:
          rota.intersecoesComSalasExtremidade,

        intersecoesComCorredores:
          rota.intersecoesComCorredores,

        quantidadeCurvas:
          rota.quantidadeCurvas,

        pontuacaoRota:
          rota.pontuacao,
      };

      corredores.push(corredor);

      for (const celula of corredor.celulas) {
        celulasOcupadas.add(
          criarChaveCelula(celula),
        );
      }
    },
  );

  return {
    corredores,

    celulasCorredores:
      consolidarCelulasCorredores(
        corredores,
      ),
  };
}