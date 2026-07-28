const TIPOS_OBSTACULO =
  new Set([
    "alto",
    "baixo",
    "chao",
    "transparente",
    "personalizado",
  ]);

const FORMAS_COLISAO =
  new Set([
    "retangulo",
    "circulo",
  ]);

const COMPORTAMENTOS_PADRAO = {
  alto: {
    bloqueiaMovimento: true,
    bloqueiaVisao: true,
  },

  baixo: {
    bloqueiaMovimento: true,
    bloqueiaVisao: false,
  },

  chao: {
    bloqueiaMovimento: false,
    bloqueiaVisao: false,
  },

  transparente: {
    bloqueiaMovimento: true,
    bloqueiaVisao: false,
  },

  personalizado: {
    bloqueiaMovimento: false,
    bloqueiaVisao: false,
  },
};

function numero(
  valor,
  padrao = 0,
) {
  return Number.isFinite(
    Number(valor),
  )
    ? Number(valor)
    : padrao;
}

function limitar(
  valor,
  minimo,
  maximo,
) {
  return Math.max(
    minimo,
    Math.min(
      maximo,
      valor,
    ),
  );
}

function tipoInferido(
  objeto,
) {
  if (
    TIPOS_OBSTACULO.has(
      objeto?.tipoObstaculo,
    )
  ) {
    return objeto.tipoObstaculo;
  }

  if (
    objeto?.bloqueiaMovimento === true
    && objeto?.bloqueiaVisao === true
  ) {
    return "alto";
  }

  if (
    objeto?.bloqueiaMovimento === true
  ) {
    return "baixo";
  }

  return "chao";
}

function obterComportamentoObjeto(
  objeto,
  tipoObstaculo,
) {
  const padrao =
    COMPORTAMENTOS_PADRAO[
      tipoObstaculo
    ]
    || COMPORTAMENTOS_PADRAO.chao;

  /*
   * Quando o objeto possui uma configuração
   * explícita, ela é respeitada.
   *
   * Quando não possui, usamos o comportamento
   * padrão correspondente ao tipo.
   */
  const bloqueiaMovimento =
    typeof objeto?.bloqueiaMovimento
      === "boolean"
      ? objeto.bloqueiaMovimento
      : padrao.bloqueiaMovimento;

  const bloqueiaVisao =
    typeof objeto?.bloqueiaVisao
      === "boolean"
      ? objeto.bloqueiaVisao
      : padrao.bloqueiaVisao;

  return {
    bloqueiaMovimento,
    bloqueiaVisao,
  };
}

export function normalizarObjetoCenario(
  objeto = {},
  indice = 0,
) {
  const largura =
    Math.max(
      1,
      numero(
        objeto.largura,
        1,
      ),
    );

  const altura =
    Math.max(
      1,
      numero(
        objeto.altura,
        1,
      ),
    );

  const tipoObstaculo =
    tipoInferido(
      objeto,
    );

  const comportamento =
    obterComportamentoObjeto(
      objeto,
      tipoObstaculo,
    );

  const formaColisao =
    FORMAS_COLISAO.has(
      objeto.formaColisao,
    )
      ? objeto.formaColisao
      : "retangulo";

  return {
    ...objeto,

    id: String(
      objeto.id
      || `objeto-cenario-${indice}`,
    ),

    x: numero(
      objeto.x,
    ),

    y: numero(
      objeto.y,
    ),

    largura,

    altura,

    tipoObstaculo,

    formaColisao,

    larguraColisao:
      Math.max(
        1,
        numero(
          objeto.larguraColisao,
          largura,
        ),
      ),

    alturaColisao:
      Math.max(
        1,
        numero(
          objeto.alturaColisao,
          altura,
        ),
      ),

    deslocamentoColisaoX:
      numero(
        objeto.deslocamentoColisaoX,
        0,
      ),

    deslocamentoColisaoY:
      numero(
        objeto.deslocamentoColisaoY,
        0,
      ),

    bloqueiaMovimento:
      comportamento.bloqueiaMovimento,

    bloqueiaVisao:
      comportamento.bloqueiaVisao,
  };
}

function rotacionar(
  ponto,
  centro,
  graus,
) {
  const angulo =
    (
      numero(graus)
      * Math.PI
    ) / 180;

  const seno =
    Math.sin(
      angulo,
    );

  const cosseno =
    Math.cos(
      angulo,
    );

  const x =
    ponto.x
    - centro.x;

  const y =
    ponto.y
    - centro.y;

  return {
    x:
      centro.x
      + x * cosseno
      - y * seno,

    y:
      centro.y
      + x * seno
      + y * cosseno,
  };
}

export function obterFormaColisaoObjeto(
  objeto,
) {
  const normalizado =
    normalizarObjetoCenario(
      objeto,
    );

  const centro = {
    x:
      normalizado.x
      + normalizado.largura / 2
      + normalizado.deslocamentoColisaoX,

    y:
      normalizado.y
      + normalizado.altura / 2
      + normalizado.deslocamentoColisaoY,
  };

  if (
    normalizado.formaColisao
      === "circulo"
  ) {
    return {
      forma:
        "circulo",

      centro,

      raio:
        Math.min(
          normalizado.larguraColisao,
          normalizado.alturaColisao,
        ) / 2,

      objeto:
        normalizado,
    };
  }

  const metadeLargura =
    normalizado.larguraColisao
    / 2;

  const metadeAltura =
    normalizado.alturaColisao
    / 2;

  const pontosBase = [
    {
      x:
        centro.x
        - metadeLargura,

      y:
        centro.y
        - metadeAltura,
    },

    {
      x:
        centro.x
        + metadeLargura,

      y:
        centro.y
        - metadeAltura,
    },

    {
      x:
        centro.x
        + metadeLargura,

      y:
        centro.y
        + metadeAltura,
    },

    {
      x:
        centro.x
        - metadeLargura,

      y:
        centro.y
        + metadeAltura,
    },
  ];

  return {
    forma:
      "retangulo",

    centro,

    pontos:
      pontosBase.map(
        (ponto) =>
          rotacionar(
            ponto,
            centro,
            normalizado.rotacao,
          ),
      ),

    objeto:
      normalizado,
  };
}

function distanciaPontoSegmento(
  ponto,
  inicio,
  fim,
) {
  const dx =
    fim.x
    - inicio.x;

  const dy =
    fim.y
    - inicio.y;

  const tamanho =
    dx * dx
    + dy * dy;

  const proporcao =
    tamanho
      ? limitar(
          (
            (
              ponto.x
              - inicio.x
            ) * dx
            + (
              ponto.y
              - inicio.y
            ) * dy
          ) / tamanho,
          0,
          1,
        )
      : 0;

  const pontoMaisProximo = {
    x:
      inicio.x
      + proporcao * dx,

    y:
      inicio.y
      + proporcao * dy,
  };

  return Math.hypot(
    ponto.x
      - pontoMaisProximo.x,

    ponto.y
      - pontoMaisProximo.y,
  );
}

function pontoDentroPoligono(
  ponto,
  pontos,
) {
  let dentro = false;

  for (
    let indice = 0,
      anterior =
        pontos.length - 1;

    indice < pontos.length;

    anterior = indice,
      indice += 1
  ) {
    const atual =
      pontos[indice];

    const outro =
      pontos[anterior];

    const cruza =
      (
        atual.y > ponto.y
      )
        !== (
          outro.y > ponto.y
        )
      && ponto.x
        < (
            (
              outro.x
              - atual.x
            )
            * (
              ponto.y
              - atual.y
            )
          )
          / (
            outro.y
            - atual.y
            || 1e-9
          )
          + atual.x;

    if (cruza) {
      dentro = !dentro;
    }
  }

  return dentro;
}

export function pontoColideForma(
  ponto,
  forma,
  raio = 0,
) {
  if (
    forma.forma
      === "circulo"
  ) {
    return (
      Math.hypot(
        ponto.x
          - forma.centro.x,

        ponto.y
          - forma.centro.y,
      )
      <= forma.raio
        + raio
    );
  }

  if (
    pontoDentroPoligono(
      ponto,
      forma.pontos,
    )
  ) {
    return true;
  }

  for (
    let indice = 0;
    indice < forma.pontos.length;
    indice += 1
  ) {
    const inicio =
      forma.pontos[indice];

    const fim =
      forma.pontos[
        (
          indice + 1
        )
        % forma.pontos.length
      ];

    if (
      distanciaPontoSegmento(
        ponto,
        inicio,
        fim,
      ) <= raio
    ) {
      return true;
    }
  }

  return false;
}

export function caminhoCruzaFormaColisao(
  origem,
  destino,
  forma,
  raio = 0,
  tamanhoPasso = 16,
) {
  const distancia =
    Math.hypot(
      destino.x
        - origem.x,

      destino.y
        - origem.y,
    );

  const passos =
    Math.max(
      1,
      Math.ceil(
        distancia
        / Math.max(
          4,
          tamanhoPasso,
        ),
      ),
    );

  for (
    let indice = 0;
    indice <= passos;
    indice += 1
  ) {
    const progresso =
      indice / passos;

    const ponto = {
      x:
        origem.x
        + (
          destino.x
          - origem.x
        ) * progresso,

      y:
        origem.y
        + (
          destino.y
          - origem.y
        ) * progresso,
    };

    if (
      pontoColideForma(
        ponto,
        forma,
        raio,
      )
    ) {
      return true;
    }
  }

  return false;
}

function criarSegmentosRetangulo(
  forma,
) {
  return forma.pontos.map(
    (inicio, indice) => ({
      inicio,

      fim:
        forma.pontos[
          (
            indice + 1
          )
          % forma.pontos.length
        ],
    }),
  );
}

function criarSegmentosCirculo(
  forma,
) {
  const quantidadeSegmentos =
    16;

  const pontos =
    Array.from(
      {
        length:
          quantidadeSegmentos,
      },

      (_, indice) => {
        const angulo =
          (
            indice
            / quantidadeSegmentos
          )
          * Math.PI
          * 2;

        return {
          x:
            forma.centro.x
            + Math.cos(
              angulo,
            ) * forma.raio,

          y:
            forma.centro.y
            + Math.sin(
              angulo,
            ) * forma.raio,
        };
      },
    );

  return pontos.map(
    (inicio, indice) => ({
      inicio,

      fim:
        pontos[
          (
            indice + 1
          )
          % pontos.length
        ],
    }),
  );
}

export function criarSegmentosVisaoDosObjetos(
  objetos = [],
) {
  const segmentos = [];

  objetos.forEach(
    (objeto, indiceObjeto) => {
      const normalizado =
        normalizarObjetoCenario(
          objeto,
          indiceObjeto,
        );

      if (
        !normalizado.bloqueiaVisao
      ) {
        return;
      }

      const forma =
        obterFormaColisaoObjeto(
          normalizado,
        );

      const segmentosForma =
        forma.forma === "circulo"
          ? criarSegmentosCirculo(
              forma,
            )
          : criarSegmentosRetangulo(
              forma,
            );

      segmentosForma.forEach(
        (
          segmento,
          indiceSegmento,
        ) => {
          segmentos.push({
            id:
              `segmento-visao-objeto-${normalizado.id}-${indiceSegmento + 1}`,

            objetoId:
              normalizado.id,

            origem:
              "objeto-cenario",

            tipo:
              "objeto",

            bloqueiaVisao:
              true,

            inicio:
              segmento.inicio,

            fim:
              segmento.fim,
          });
        },
      );
    },
  );

  return segmentos;
}