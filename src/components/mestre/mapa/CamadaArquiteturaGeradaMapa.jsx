import {
  useEffect,
  useRef,
} from "react";

import {
  obterPackVisualMapa,
} from "../../../geradorMapa/temas/packs/registroPacksVisuais.js";

import {
  obterAssetDoManifesto,
} from "../../../geradorMapa/temas/packs/manifestPacksGerado.js";

const BASE_PUBLICA = String(
  import.meta.env.BASE_URL || "/",
).replace(/\/+$/, "");

const TEMAS_ABERTOS = new Set([
  "floresta",
  "acampamento",
]);

const PALETA_ABERTA = {
  fundo: "#102017",
  mataProfunda: "#152a1c",
  mataMedia: "#294632",
  mataClara: "#567052",
  clareira: "#77866a",
  trilha: "#776c4f",
  trilhaClara: "#b1a474",
  bordaEscura: "#0d1811",
  bordaMedia: "#26462f",
  bordaClara: "#5e7a53",
  sombra: "#070c09",
  agua: "#3d6668",
  aguaClara: "#78a59d",
  ritual: "#51415d",
};

const PALETA_INTERNA = {
  fundo: "#26322f",
  pisoSala: "#9c9c8e",
  pisoCorredor: "#85877d",
  parede: "#3c261f",
  detalheParede: "#8e7960",
  porta: "#c99538",
  portaTrancada: "#ae3131",
  sombra: "#100c0a",
};

function limitarNumero(
  valor,
  padrao,
  minimo,
  maximo,
) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return padrao;
  }

  return Math.min(
    maximo,
    Math.max(
      minimo,
      numero,
    ),
  );
}

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function criarIdSvg(valor) {
  return String(
    valor || "mapa-gerado",
  ).replace(
    /[^a-zA-Z0-9_-]/g,
    "-",
  );
}

function criarCaminhoPublico(caminho) {
  const caminhoNormalizado = String(
    caminho || "",
  ).replace(
    /^\/+/,
    "",
  );

  if (!caminhoNormalizado) {
    return "";
  }

  return `${BASE_PUBLICA}/${caminhoNormalizado}`;
}

function obterAssetVisualDoPack({
  temaId,
  categoria,
  assetId,
}) {
  return criarCaminhoPublico(
    obterAssetDoManifesto({
      temaId,
      categoria,
      assetId,
    }),
  );
}

function ocultarImagemComErro(evento) {
  evento.currentTarget.style.display =
    "none";
}

function obterPaletaInterna(pack) {
  return {
    ...PALETA_INTERNA,
    ...(pack?.paleta || {}),
  };
}

function temaEhAberto(
  arquitetura,
  pack,
) {
  const tema = normalizarTexto(
    arquitetura?.tema || pack?.id,
  );

  return (
    pack?.ambiente === "aberto"
    || TEMAS_ABERTOS.has(tema)
  );
}

function segmento(
  estrutura,
  tamanhoCelula,
) {
  return {
    x1:
      (
        Number(
          estrutura?.inicio?.x,
        ) || 0
      ) * tamanhoCelula,

    y1:
      (
        Number(
          estrutura?.inicio?.y,
        ) || 0
      ) * tamanhoCelula,

    x2:
      (
        Number(
          estrutura?.fim?.x,
        ) || 0
      ) * tamanhoCelula,

    y2:
      (
        Number(
          estrutura?.fim?.y,
        ) || 0
      ) * tamanhoCelula,
  };
}

function geometriaSegmento(
  estrutura,
  tamanhoCelula,
) {
  const ponto = segmento(
    estrutura,
    tamanhoCelula,
  );

  const deltaX =
    ponto.x2 - ponto.x1;

  const deltaY =
    ponto.y2 - ponto.y1;

  const comprimento = Math.max(
    1,
    Math.hypot(
      deltaX,
      deltaY,
    ),
  );

  return {
    ...ponto,
    deltaX,
    deltaY,
    comprimento,

    angulo:
      Math.atan2(
        deltaY,
        deltaX,
      ) * (
        180 / Math.PI
      ),

    normalX:
      -deltaY / comprimento,

    normalY:
      deltaX / comprimento,

    meioX:
      (
        ponto.x1 + ponto.x2
      ) / 2,

    meioY:
      (
        ponto.y1 + ponto.y2
      ) / 2,
  };
}

function deslocarSegmento(
  geometria,
  distancia,
) {
  const deslocamentoX =
    geometria.normalX * distancia;

  const deslocamentoY =
    geometria.normalY * distancia;

  return {
    x1:
      geometria.x1 + deslocamentoX,

    y1:
      geometria.y1 + deslocamentoY,

    x2:
      geometria.x2 + deslocamentoX,

    y2:
      geometria.y2 + deslocamentoY,
  };
}

function obterTextoSala(sala) {
  return normalizarTexto(
    [
      sala?.nome,
      sala?.tipo,
      sala?.tipoTematico,
      sala?.categoria,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function salaUsaPisoEspecial(sala) {
  const texto =
    obterTextoSala(sala);

  return [
    "carga",
    "descarga",
    "deposito",
    "estoque",
    "industrial",
    "eletrica",
    "gerador",
    "seguranca",
    "interditada",
    "maquinas",
  ].some(
    (termo) =>
      texto.includes(termo),
  );
}

function obterCoresAreaAberta(sala) {
  const texto =
    obterTextoSala(sala);

  if (
    texto.includes("rio")
    || texto.includes("corrego")
    || texto.includes("alagada")
  ) {
    return {
      base: PALETA_ABERTA.agua,
      detalhe:
        PALETA_ABERTA.aguaClara,
      borda: "#284b4d",
    };
  }

  if (texto.includes("ritual")) {
    return {
      base: PALETA_ABERTA.ritual,
      detalhe: "#87729a",
      borda: "#342b3d",
    };
  }

  if (
    texto.includes("clareira")
    || texto.includes("confronto")
    || texto.includes("acampamento")
  ) {
    return {
      base: PALETA_ABERTA.clareira,
      detalhe: "#a3ad82",
      borda: "#40523d",
    };
  }

  if (
    texto.includes("mata-fechada")
    || texto.includes("area-escondida")
  ) {
    return {
      base:
        PALETA_ABERTA.mataProfunda,

      detalhe:
        PALETA_ABERTA.mataMedia,

      borda:
        PALETA_ABERTA.bordaEscura,
    };
  }

  if (
    texto.includes("trilha")
    || texto.includes("entrada")
  ) {
    return {
      base: PALETA_ABERTA.trilha,
      detalhe:
        PALETA_ABERTA.trilhaClara,
      borda: "#473f2e",
    };
  }

  return {
    base: PALETA_ABERTA.mataMedia,
    detalhe:
      PALETA_ABERTA.mataClara,
    borda:
      PALETA_ABERTA.bordaEscura,
  };
}

function obterVariacaoSala(sala) {
  const id = String(
    sala?.id || "",
  );

  let soma = 0;

  for (
    let indice = 0;
    indice < id.length;
    indice += 1
  ) {
    soma += id.charCodeAt(indice);
  }

  return soma % 4;
}

function geometriaSalaAberta(
  sala,
  tamanhoCelula,
) {
  const variacao =
    obterVariacaoSala(sala);

  const recuo =
    tamanhoCelula * (
      variacao === 0
        ? 0.14
        : variacao === 1
          ? 0.2
          : 0.11
    );

  const x =
    sala.x * tamanhoCelula
    + recuo;

  const y =
    sala.y * tamanhoCelula
    + recuo;

  const largura = Math.max(
    tamanhoCelula,

    sala.largura
    * tamanhoCelula
    - recuo * 2,
  );

  const altura = Math.max(
    tamanhoCelula,

    sala.altura
    * tamanhoCelula
    - recuo * 2,
  );

  const raio = Math.min(
    Math.max(
      tamanhoCelula * 0.72,
      28,
    ),

    largura * 0.28,
    altura * 0.28,
  );

  return {
    x,
    y,
    largura,
    altura,
    raio,
  };
}

function criarChaveCelula(
  x,
  y,
) {
  return `${x}:${y}`;
}

function obterCentroCelula(
  celula,
  tamanhoCelula,
) {
  return {
    x:
      (
        Number(celula?.x)
        + 0.5
      ) * tamanhoCelula,

    y:
      (
        Number(celula?.y)
        + 0.5
      ) * tamanhoCelula,
  };
}

function criarSegmentosTrilha(
  corredores = [],
  tamanhoCelula,
) {
  const celulasValidas =
    corredores.filter(
      (celula) => (
        Number.isFinite(
          Number(celula?.x),
        )
        && Number.isFinite(
          Number(celula?.y),
        )
      ),
    );

  const conjunto =
    new Set(
      celulasValidas.map(
        (celula) =>
          criarChaveCelula(
            Number(celula.x),
            Number(celula.y),
          ),
      ),
    );

  const segmentos = [];
  const isoladas = [];

  celulasValidas.forEach(
    (celula) => {
      const x =
        Number(celula.x);

      const y =
        Number(celula.y);

      const centro =
        obterCentroCelula(
          {
            x,
            y,
          },
          tamanhoCelula,
        );

      const vizinhos = [
        {
          x: x + 1,
          y,
        },

        {
          x,
          y: y + 1,
        },
      ];

      let possuiVizinhoPosterior =
        false;

      vizinhos.forEach(
        (vizinho) => {
          if (
            !conjunto.has(
              criarChaveCelula(
                vizinho.x,
                vizinho.y,
              ),
            )
          ) {
            return;
          }

          possuiVizinhoPosterior =
            true;

          const centroVizinho =
            obterCentroCelula(
              vizinho,
              tamanhoCelula,
            );

          segmentos.push({
            id:
              `${x}-${y}-${vizinho.x}-${vizinho.y}`,

            x1: centro.x,
            y1: centro.y,
            x2: centroVizinho.x,
            y2: centroVizinho.y,
          });
        },
      );

      const possuiVizinhoAnterior =
        conjunto.has(
          criarChaveCelula(
            x - 1,
            y,
          ),
        )
        || conjunto.has(
          criarChaveCelula(
            x,
            y - 1,
          ),
        );

      if (
        !possuiVizinhoPosterior
        && !possuiVizinhoAnterior
      ) {
        isoladas.push({
          id:
            `isolada-${x}-${y}`,

          x: centro.x,
          y: centro.y,
        });
      }
    },
  );

  return {
    segmentos,
    isoladas,
  };
}

function hashNumerico(texto) {
  let hash = 2166136261;

  for (
    let indice = 0;
    indice < texto.length;
    indice += 1
  ) {
    hash ^= texto.charCodeAt(
      indice,
    );

    hash = Math.imul(
      hash,
      16777619,
    );
  }

  return hash >>> 0;
}

function numeroDeterministico(
  chave,
  variacao = 0,
) {
  return (
    hashNumerico(
      `${chave}-${variacao}`,
    )
    / 4294967295
  );
}

function criarVegetacaoDecorativa({
  arquitetura,
  largura,
  altura,
  tamanhoCelula,
}) {
  const colunas = Math.max(
    1,
    Math.ceil(
      largura / tamanhoCelula,
    ),
  );

  const linhas = Math.max(
    1,
    Math.ceil(
      altura / tamanhoCelula,
    ),
  );

  const passo = 2;

  const seed = String(
    arquitetura?.seed
    || arquitetura?.aplicacaoId
    || arquitetura?.id
    || arquitetura?.tema
    || "floresta",
  );

  const elementos = [];

  for (
    let y = -1;
    y < linhas + 1;
    y += passo
  ) {
    for (
      let x = -1;
      x < colunas + 1;
      x += passo
    ) {
      const chave =
        `${seed}-${x}-${y}`;

      const chance =
        numeroDeterministico(
          chave,
          1,
        );

      if (chance < 0.34) {
        continue;
      }

      const tipo =
        numeroDeterministico(
          chave,
          2,
        ) < 0.72
          ? "arvore"
          : "arbusto";

      const tamanhoBase =
        tipo === "arvore"
          ? 1.78
          : 1.18;

      const tamanho =
        tamanhoCelula * (
          tamanhoBase
          + numeroDeterministico(
            chave,
            3,
          ) * 0.55
        );

      const centroX = (
        x
        + 1
        + (
          numeroDeterministico(
            chave,
            4,
          ) - 0.5
        ) * 1.15
      ) * tamanhoCelula;

      const centroY = (
        y
        + 1
        + (
          numeroDeterministico(
            chave,
            5,
          ) - 0.5
        ) * 1.15
      ) * tamanhoCelula;

      elementos.push({
        id:
          `mata-${x}-${y}`,

        tipo,

        x:
          centroX
          - tamanho / 2,

        y:
          centroY
          - tamanho / 2,

        largura: tamanho,
        altura: tamanho,

        rotacao:
          Math.round(
            numeroDeterministico(
              chave,
              6,
            ) * 360,
          ),

        opacidade:
          0.72
          + numeroDeterministico(
            chave,
            7,
          ) * 0.24,
      });

      if (
        numeroDeterministico(
          chave,
          8,
        ) > 0.76
      ) {
        const tamanhoSecundario =
          tamanhoCelula * (
            0.75
            + numeroDeterministico(
              chave,
              9,
            ) * 0.45
          );

        elementos.push({
          id:
            `mata-secundaria-${x}-${y}`,

          tipo: "arbusto",

          x:
            centroX
            + (
              numeroDeterministico(
                chave,
                10,
              ) - 0.5
            ) * tamanhoCelula * 1.4
            - tamanhoSecundario / 2,

          y:
            centroY
            + (
              numeroDeterministico(
                chave,
                11,
              ) - 0.5
            ) * tamanhoCelula * 1.4
            - tamanhoSecundario / 2,

          largura:
            tamanhoSecundario,

          altura:
            tamanhoSecundario,

          rotacao:
            Math.round(
              numeroDeterministico(
                chave,
                12,
              ) * 360,
            ),

          opacidade:
            0.64
            + numeroDeterministico(
              chave,
              13,
            ) * 0.22,
        });
      }
    }
  }

  return elementos;
}

function MascaraMata({
  id,
  arquitetura,
  largura,
  altura,
  tamanhoCelula,
  segmentosTrilha,
}) {
  const margemSala =
    tamanhoCelula * 0.38;

  const larguraProtecaoTrilha =
    Math.max(
      44,
      tamanhoCelula * 1.22,
    );

  return (
    <mask
      id={id}
      maskUnits="userSpaceOnUse"
    >
      <rect
        x="0"
        y="0"
        width={largura}
        height={altura}
        fill="white"
      />

      {(
        arquitetura.salas || []
      ).map(
        (sala) => {
          const geometria =
            geometriaSalaAberta(
              sala,
              tamanhoCelula,
            );

          return (
            <rect
              key={
                `mascara-sala-${sala.id}`
              }
              x={
                geometria.x
                - margemSala
              }
              y={
                geometria.y
                - margemSala
              }
              width={
                geometria.largura
                + margemSala * 2
              }
              height={
                geometria.altura
                + margemSala * 2
              }
              rx={
                geometria.raio
                + margemSala
              }
              fill="black"
            />
          );
        },
      )}

      {segmentosTrilha.segmentos.map(
        (trecho) => (
          <line
            key={
              `mascara-trilha-${trecho.id}`
            }
            x1={trecho.x1}
            y1={trecho.y1}
            x2={trecho.x2}
            y2={trecho.y2}
            stroke="black"
            strokeWidth={
              larguraProtecaoTrilha
            }
            strokeLinecap="round"
          />
        ),
      )}

      {segmentosTrilha.isoladas.map(
        (ponto) => (
          <circle
            key={
              `mascara-trilha-${ponto.id}`
            }
            cx={ponto.x}
            cy={ponto.y}
            r={
              larguraProtecaoTrilha / 2
            }
            fill="black"
          />
        ),
      )}
    </mask>
  );
}

function MataDecorativaFundo({
  elementos,
  imagemArvore,
  imagemArbusto,
  mascaraId,
}) {
  if (
    !imagemArvore
    && !imagemArbusto
  ) {
    return null;
  }

  return (
    <g
      className="camada-arquitetura-gerada__mata-de-fundo"
      mask={`url(#${mascaraId})`}
      pointerEvents="none"
    >
      {elementos.map(
        (elemento) => {
          const caminho =
            elemento.tipo === "arvore"
              ? (
                imagemArvore
                || imagemArbusto
              )
              : (
                imagemArbusto
                || imagemArvore
              );

          const centroX =
            elemento.x
            + elemento.largura / 2;

          const centroY =
            elemento.y
            + elemento.altura / 2;

          return (
            <image
              key={elemento.id}
              href={caminho}
              x={elemento.x}
              y={elemento.y}
              width={elemento.largura}
              height={elemento.altura}
              opacity={
                elemento.opacidade
              }
              preserveAspectRatio="xMidYMid meet"
              transform={
                `rotate(${elemento.rotacao} ${centroX} ${centroY})`
              }
              onError={
                ocultarImagemComErro
              }
            />
          );
        },
      )}
    </g>
  );
}

function TrilhasContinuas({
  segmentosTrilha,
  tamanhoCelula,
  filtroOrganicoId,
}) {
  const larguraSombra =
    Math.max(
      34,
      tamanhoCelula * 0.78,
    );

  const larguraPrincipal =
    Math.max(
      28,
      tamanhoCelula * 0.66,
    );

  const larguraCentro =
    Math.max(
      3,
      tamanhoCelula * 0.07,
    );

  return (
    <g
      className="camada-arquitetura-gerada__trilhas"
      filter={
        `url(#${filtroOrganicoId})`
      }
    >
      {segmentosTrilha.segmentos.map(
        (trecho) => (
          <line
            key={
              `sombra-${trecho.id}`
            }
            x1={trecho.x1}
            y1={trecho.y1}
            x2={trecho.x2}
            y2={trecho.y2}
            stroke="#211d15"
            strokeWidth={
              larguraSombra
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.66"
          />
        ),
      )}

      {segmentosTrilha.isoladas.map(
        (ponto) => (
          <circle
            key={
              `sombra-${ponto.id}`
            }
            cx={ponto.x}
            cy={ponto.y}
            r={
              larguraSombra / 2
            }
            fill="#211d15"
            opacity="0.66"
          />
        ),
      )}

      {segmentosTrilha.segmentos.map(
        (trecho) => (
          <line
            key={
              `base-${trecho.id}`
            }
            x1={trecho.x1}
            y1={trecho.y1}
            x2={trecho.x2}
            y2={trecho.y2}
            stroke={
              PALETA_ABERTA.trilha
            }
            strokeWidth={
              larguraPrincipal
            }
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      )}

      {segmentosTrilha.isoladas.map(
        (ponto) => (
          <circle
            key={
              `base-${ponto.id}`
            }
            cx={ponto.x}
            cy={ponto.y}
            r={
              larguraPrincipal / 2
            }
            fill={
              PALETA_ABERTA.trilha
            }
          />
        ),
      )}

      {segmentosTrilha.segmentos.map(
        (trecho) => (
          <line
            key={
              `centro-${trecho.id}`
            }
            x1={trecho.x1}
            y1={trecho.y1}
            x2={trecho.x2}
            y2={trecho.y2}
            stroke={
              PALETA_ABERTA.trilhaClara
            }
            strokeWidth={
              larguraCentro
            }
            strokeLinecap="round"
            strokeDasharray={
              `${
                tamanhoCelula * 0.24
              } ${
                tamanhoCelula * 0.18
              }`
            }
            opacity="0.68"
          />
        ),
      )}
    </g>
  );
}

function ParedePadrao({
  geometria,
  larguraParede,
  tamanhoCelula,
  paleta,
}) {
  return (
    <g>
      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={paleta.sombra}
        strokeLinecap="square"
        strokeWidth={
          larguraParede
          + Math.max(
            3,
            tamanhoCelula * 0.065,
          )
        }
        opacity="0.88"
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={paleta.parede}
        strokeLinecap="square"
        strokeWidth={
          larguraParede
        }
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={
          paleta.detalheParede
        }
        strokeLinecap="square"
        strokeWidth={
          Math.max(
            1,
            larguraParede * 0.18,
          )
        }
        opacity="0.68"
      />
    </g>
  );
}

function ParedeIndustrial({
  geometria,
  tamanhoCelula,
}) {
  const espessuraExterna =
    Math.max(
      18,
      tamanhoCelula * 0.34,
    );

  const espessuraEstrutura =
    espessuraExterna * 0.8;

  const espessuraMetal =
    espessuraExterna * 0.51;

  const espessuraCentro =
    espessuraExterna * 0.23;

  const espessuraReflexo =
    Math.max(
      1.4,
      espessuraExterna * 0.065,
    );

  const linhaReflexo =
    deslocarSegmento(
      geometria,
      -espessuraExterna * 0.2,
    );

  const linhaInferior =
    deslocarSegmento(
      geometria,
      espessuraExterna * 0.22,
    );

  const tamanhoPainel =
    Math.max(
      tamanhoCelula * 0.72,
      30,
    );

  const espacoPainel =
    Math.max(
      tamanhoCelula * 0.13,
      6,
    );

  return (
    <g className="camada-arquitetura-gerada__parede-industrial">
      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke="#090b0a"
        strokeLinecap="square"
        strokeWidth={
          espessuraExterna
          + Math.max(
            5,
            tamanhoCelula * 0.09,
          )
        }
        opacity="0.94"
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke="#202622"
        strokeLinecap="square"
        strokeWidth={
          espessuraExterna
        }
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke="#424c45"
        strokeLinecap="square"
        strokeWidth={
          espessuraEstrutura
        }
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke="#687269"
        strokeLinecap="square"
        strokeWidth={
          espessuraMetal
        }
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke="#29302c"
        strokeLinecap="square"
        strokeWidth={
          espessuraCentro
        }
        strokeDasharray={
          `${tamanhoPainel} ${espacoPainel}`
        }
      />

      <line
        x1={linhaReflexo.x1}
        y1={linhaReflexo.y1}
        x2={linhaReflexo.x2}
        y2={linhaReflexo.y2}
        stroke="#c0c8ba"
        strokeLinecap="square"
        strokeWidth={
          espessuraReflexo
        }
        opacity="0.58"
      />

      <line
        x1={linhaInferior.x1}
        y1={linhaInferior.y1}
        x2={linhaInferior.x2}
        y2={linhaInferior.y2}
        stroke="#111512"
        strokeLinecap="square"
        strokeWidth={
          Math.max(
            2,
            espessuraReflexo * 1.45,
          )
        }
        opacity="0.8"
      />
    </g>
  );
}

function LimiteVegetacao({
  geometria,
  tamanhoCelula,
  filtroOrganicoId,
}) {
  const larguraExterna =
    Math.max(
      24,
      tamanhoCelula * 0.46,
    );

  const larguraInterna =
    larguraExterna * 0.6;

  const larguraFolhas =
    larguraExterna * 0.23;

  return (
    <g
      className="camada-arquitetura-gerada__limite-vegetacao"
      filter={
        `url(#${filtroOrganicoId})`
      }
    >
      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={
          PALETA_ABERTA.sombra
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={
          larguraExterna
          + tamanhoCelula * 0.12
        }
        opacity="0.64"
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={
          PALETA_ABERTA.bordaEscura
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={
          larguraExterna
        }
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={
          PALETA_ABERTA.bordaMedia
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={
          larguraInterna
        }
        strokeDasharray={
          `${
            tamanhoCelula * 0.55
          } ${
            tamanhoCelula * 0.16
          }`
        }
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={
          PALETA_ABERTA.bordaClara
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={
          larguraFolhas
        }
        strokeDasharray={
          `${
            tamanhoCelula * 0.18
          } ${
            tamanhoCelula * 0.25
          }`
        }
        opacity="0.72"
      />
    </g>
  );
}

function PassagemNatural({
  geometria,
  tamanhoCelula,
}) {
  const larguraPassagem =
    Math.max(
      tamanhoCelula * 0.52,
      24,
    );

  return (
    <g className="camada-arquitetura-gerada__passagem-natural">
      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke="#211d15"
        strokeLinecap="round"
        strokeWidth={
          larguraPassagem
          + tamanhoCelula * 0.1
        }
        opacity="0.64"
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={
          PALETA_ABERTA.trilha
        }
        strokeLinecap="round"
        strokeWidth={
          larguraPassagem
        }
      />

      <line
        x1={geometria.x1}
        y1={geometria.y1}
        x2={geometria.x2}
        y2={geometria.y2}
        stroke={
          PALETA_ABERTA.trilhaClara
        }
        strokeLinecap="round"
        strokeWidth={
          Math.max(
            2,
            tamanhoCelula * 0.065,
          )
        }
        strokeDasharray={
          `${
            tamanhoCelula * 0.22
          } ${
            tamanhoCelula * 0.16
          }`
        }
        opacity="0.68"
      />
    </g>
  );
}

function ImagemPorta({
  geometria,
  caminho,
  tamanhoCelula,
}) {
  if (!caminho) {
    return null;
  }

  const larguraImagem =
    Math.max(
      geometria.comprimento * 1.08,
      tamanhoCelula * 1.02,
    );

  const alturaImagem =
    Math.max(
      tamanhoCelula * 0.88,
      42,
    );

  return (
    <g
      className="camada-arquitetura-gerada__imagem-porta"
      transform={
        `translate(${geometria.meioX} ${geometria.meioY}) rotate(${geometria.angulo})`
      }
      pointerEvents="none"
    >
      <image
        href={caminho}
        x={
          -larguraImagem / 2
        }
        y={
          -alturaImagem / 2
        }
        width={larguraImagem}
        height={alturaImagem}
        preserveAspectRatio="none"
        onError={
          ocultarImagemComErro
        }
      />
    </g>
  );
}

function RenderizacaoAmbienteAberto({
  arquitetura,
  tamanhoCelula,
  largura,
  altura,
  filtroOrganicoId,
  mascaraMataId,
  imagemArvore,
  imagemArbusto,
  elementosVegetacao,
  segmentosTrilha,
  texturaFundoId,
}) {
  return (
    <>
      <rect
        x="0"
        y="0"
        width={largura}
        height={altura}
        fill={
          PALETA_ABERTA.fundo
        }
      />

      <rect
        x="0"
        y="0"
        width={largura}
        height={altura}
        fill={
          `url(#${texturaFundoId})`
        }
        opacity="0.68"
      />

      <MataDecorativaFundo
        elementos={
          elementosVegetacao
        }
        imagemArvore={
          imagemArvore
        }
        imagemArbusto={
          imagemArbusto
        }
        mascaraId={
          mascaraMataId
        }
      />

      <g className="camada-arquitetura-gerada__terreno-aberto">
        {(
          arquitetura.salas || []
        ).map(
          (sala) => {
            const cores =
              obterCoresAreaAberta(
                sala,
              );

            const geometria =
              geometriaSalaAberta(
                sala,
                tamanhoCelula,
              );

            return (
              <g
                key={sala.id}
                filter={
                  `url(#${filtroOrganicoId})`
                }
              >
                <rect
                  x={geometria.x}
                  y={geometria.y}
                  width={
                    geometria.largura
                  }
                  height={
                    geometria.altura
                  }
                  rx={geometria.raio}
                  fill={cores.base}
                  stroke={cores.borda}
                  strokeWidth={
                    Math.max(
                      4,
                      tamanhoCelula * 0.11,
                    )
                  }
                />

                <rect
                  x={
                    geometria.x
                    + tamanhoCelula * 0.14
                  }
                  y={
                    geometria.y
                    + tamanhoCelula * 0.14
                  }
                  width={
                    Math.max(
                      1,

                      geometria.largura
                      - tamanhoCelula * 0.28,
                    )
                  }
                  height={
                    Math.max(
                      1,

                      geometria.altura
                      - tamanhoCelula * 0.28,
                    )
                  }
                  rx={
                    Math.max(
                      4,
                      geometria.raio * 0.82,
                    )
                  }
                  fill="none"
                  stroke={
                    cores.detalhe
                  }
                  strokeWidth={
                    Math.max(
                      2,
                      tamanhoCelula * 0.045,
                    )
                  }
                  strokeDasharray={
                    `${
                      tamanhoCelula * 0.35
                    } ${
                      tamanhoCelula * 0.22
                    }`
                  }
                  opacity="0.28"
                />
              </g>
            );
          },
        )}
      </g>

      <TrilhasContinuas
        segmentosTrilha={
          segmentosTrilha
        }
        tamanhoCelula={
          tamanhoCelula
        }
        filtroOrganicoId={
          filtroOrganicoId
        }
      />

      <g className="camada-arquitetura-gerada__limites-naturais">
        {(
          arquitetura.paredes || []
        ).map(
          (parede) => (
            <LimiteVegetacao
              key={parede.id}
              geometria={
                geometriaSegmento(
                  parede,
                  tamanhoCelula,
                )
              }
              tamanhoCelula={
                tamanhoCelula
              }
              filtroOrganicoId={
                filtroOrganicoId
              }
            />
          ),
        )}
      </g>

      <g className="camada-arquitetura-gerada__passagens-naturais">
        {(
          arquitetura.portas || []
        ).map(
          (porta) => (
            <PassagemNatural
              key={porta.id}
              geometria={
                geometriaSegmento(
                  porta,
                  tamanhoCelula,
                )
              }
              tamanhoCelula={
                tamanhoCelula
              }
            />
          ),
        )}
      </g>
    </>
  );
}

export default function CamadaArquiteturaGeradaMapa({
  arquitetura,
  tamanhoCelula,
  largura,
  altura,
  papelAtual = "mestre",
}) {
  const referenciaSvg =
    useRef(null);

  const pack =
    arquitetura
      ? obterPackVisualMapa(
          arquitetura.tema,
        )
      : null;

  const ambienteAberto =
    temaEhAberto(
      arquitetura,
      pack,
    );

  useEffect(
    () => {
      const painel =
        referenciaSvg.current?.closest(
          ".painel-mapa",
        );

      if (!painel) {
        return undefined;
      }

      painel.classList.toggle(
        "painel-mapa--ambiente-aberto",
        ambienteAberto,
      );

      return () => {
        painel.classList.remove(
          "painel-mapa--ambiente-aberto",
        );
      };
    },
    [
      ambienteAberto,
      arquitetura?.id,
      arquitetura?.aplicacaoId,
    ],
  );

  if (
    !arquitetura
    || !pack
  ) {
    return null;
  }

  const paleta =
    obterPaletaInterna(pack);

  const temaId =
    normalizarTexto(
      pack.id
      || arquitetura.tema,
    );

  const tamanhoSeguro =
    limitarNumero(
      tamanhoCelula,
      64,
      16,
      256,
    );

  const larguraSegura =
    limitarNumero(
      largura,
      2048,
      1,
      50000,
    );

  const alturaSegura =
    limitarNumero(
      altura,
      1088,
      1,
      50000,
    );

  const idBase =
    criarIdSvg(
      arquitetura.aplicacaoId
      || arquitetura.mapaId
      || arquitetura.id
      || arquitetura.tema,
    );

  const idPisoSala =
    `piso-sala-${idBase}`;

  const idPisoCorredor =
    `piso-corredor-${idBase}`;

  const idPisoEspecial =
    `piso-especial-${idBase}`;

  const idSombra =
    `sombra-${idBase}`;

  const idDesgaste =
    `desgaste-${idBase}`;

  const idOrganico =
    `organico-${idBase}`;

  const idMascaraMata =
    `mascara-mata-${idBase}`;

  const idTexturaFundo =
    `textura-mata-${idBase}`;

  const texturaPisoSala =
    obterAssetVisualDoPack({
      temaId,
      categoria: "pisos",
      assetId: "piso-sala",
    });

  const texturaPisoCorredor =
    obterAssetVisualDoPack({
      temaId,
      categoria: "pisos",
      assetId: "piso-corredor",
    });

  const texturaPisoEspecial =
    obterAssetVisualDoPack({
      temaId,
      categoria: "pisos",
      assetId: "piso-especial",
    });

  const texturaPortaFechada =
    obterAssetVisualDoPack({
      temaId,
      categoria: "portas",
      assetId: "porta-fechada",
    });

  const texturaPortaAberta =
    obterAssetVisualDoPack({
      temaId,
      categoria: "portas",
      assetId: "porta-aberta",
    });

  const texturaPortaTrancada =
    obterAssetVisualDoPack({
      temaId,
      categoria: "portas",
      assetId: "porta-trancada",
    });

  const texturaPortaSecreta =
    obterAssetVisualDoPack({
      temaId,
      categoria: "portas",
      assetId: "porta-secreta",
    });

  const temaVegetacao =
    temaId === "floresta"
      ? temaId
      : "floresta";

  const imagemArvore =
    obterAssetVisualDoPack({
      temaId: temaVegetacao,
      categoria: "objetos",
      assetId: "arvore",
    });

  const imagemArbusto =
    obterAssetVisualDoPack({
      temaId: temaVegetacao,
      categoria: "objetos",
      assetId: "arbusto",
    });

  const segmentosTrilha =
    criarSegmentosTrilha(
      arquitetura.corredores || [],
      tamanhoSeguro,
    );

  const elementosVegetacao =
    criarVegetacaoDecorativa({
      arquitetura,
      largura: larguraSegura,
      altura: alturaSegura,
      tamanhoCelula: tamanhoSeguro,
    });

  const larguraParede =
    pack.ambiente === "aberto"
      ? Math.max(
          6,
          tamanhoSeguro * 0.12,
        )
      : Math.max(
          10,
          tamanhoSeguro * 0.2,
        );

  const larguraPorta =
    Math.max(
      8,
      larguraParede * 0.76,
    );

  const usarParedeIndustrial =
    temaId === "armazem";

  return (
    <>
      <style>
        {`
          .painel-mapa--ambiente-aberto .camada-estruturas-mapa__parede,
          .painel-mapa--ambiente-aberto .camada-estruturas-mapa__traco {
            opacity: 0 !important;
          }

          .painel-mapa--ambiente-aberto .camada-estruturas-mapa__estrutura {
            filter: none !important;
          }

          .painel-mapa--ambiente-aberto .camada-estruturas-mapa__controles {
            opacity: 0.88;
          }
        `}
      </style>

      <svg
        ref={referenciaSvg}
        className={[
          "camada-arquitetura-gerada",

          ambienteAberto
            ? "camada-arquitetura-gerada--ambiente-aberto"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-tema={pack.id}
        data-ambiente={
          ambienteAberto
            ? "aberto"
            : pack.ambiente
        }
        data-pack-paredes={
          ambienteAberto
            ? "organico"
            : usarParedeIndustrial
              ? "industrial"
              : "padrao"
        }
        data-pack-portas={
          ambienteAberto
            ? "passagem-natural"
            : texturaPortaFechada
              ? "sim"
              : "nao"
        }
        viewBox={
          `0 0 ${larguraSegura} ${alturaSegura}`
        }
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter
            id={idDesgaste}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="2"
              seed="7"
              result="ruido"
            />

            <feColorMatrix
              in="ruido"
              type="saturate"
              values="0"
              result="ruidoCinza"
            />

            <feComponentTransfer
              in="ruidoCinza"
              result="ruidoSuave"
            >
              <feFuncA
                type="table"
                tableValues="0 0.08"
              />
            </feComponentTransfer>

            <feBlend
              in="SourceGraphic"
              in2="ruidoSuave"
              mode="multiply"
            />
          </filter>

          <filter
            id={idOrganico}
            x="-18%"
            y="-18%"
            width="136%"
            height="136%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.015"
              numOctaves="2"
              seed="19"
              result="ruidoOrganico"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="ruidoOrganico"
              scale={
                Math.max(
                  4,
                  tamanhoSeguro * 0.11,
                )
              }
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <filter
            id={idSombra}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx={
                Math.max(
                  1,
                  tamanhoSeguro * 0.035,
                )
              }
              dy={
                Math.max(
                  1,
                  tamanhoSeguro * 0.05,
                )
              }
              stdDeviation={
                Math.max(
                  1,
                  tamanhoSeguro * 0.025,
                )
              }
              floodColor={
                paleta.sombra
              }
              floodOpacity="0.72"
            />
          </filter>

          <pattern
            id={idTexturaFundo}
            width={
              tamanhoSeguro * 2.5
            }
            height={
              tamanhoSeguro * 2.5
            }
            patternUnits="userSpaceOnUse"
          >
            <rect
              width={
                tamanhoSeguro * 2.5
              }
              height={
                tamanhoSeguro * 2.5
              }
              fill={
                PALETA_ABERTA.mataProfunda
              }
            />

            <path
              d={
                `M 0 ${tamanhoSeguro * 1.9} C ${tamanhoSeguro * 0.7} ${tamanhoSeguro * 1.25}, ${tamanhoSeguro * 1.4} ${tamanhoSeguro * 2.35}, ${tamanhoSeguro * 2.5} ${tamanhoSeguro * 1.55}`
              }
              fill="none"
              stroke={
                PALETA_ABERTA.mataClara
              }
              strokeWidth={
                Math.max(
                  1,
                  tamanhoSeguro * 0.025,
                )
              }
              opacity="0.12"
            />

            <path
              d={
                `M ${tamanhoSeguro * 0.2} ${tamanhoSeguro * 0.45} C ${tamanhoSeguro * 0.95} ${tamanhoSeguro * 0.12}, ${tamanhoSeguro * 1.5} ${tamanhoSeguro * 0.82}, ${tamanhoSeguro * 2.25} ${tamanhoSeguro * 0.38}`
              }
              fill="none"
              stroke="#7c936b"
              strokeWidth={
                Math.max(
                  1,
                  tamanhoSeguro * 0.02,
                )
              }
              opacity="0.09"
            />
          </pattern>

          <pattern
            id={idPisoSala}
            width={tamanhoSeguro}
            height={tamanhoSeguro}
            patternUnits="userSpaceOnUse"
          >
            {texturaPisoSala ? (
              <image
                href={texturaPisoSala}
                x="0"
                y="0"
                width={tamanhoSeguro}
                height={tamanhoSeguro}
                preserveAspectRatio="xMidYMid slice"
                onError={
                  ocultarImagemComErro
                }
              />
            ) : (
              <rect
                width={tamanhoSeguro}
                height={tamanhoSeguro}
                fill={paleta.pisoSala}
              />
            )}

            <path
              d={
                `M ${tamanhoSeguro} 0 H 0 V ${tamanhoSeguro}`
              }
              fill="none"
              stroke={
                paleta.detalheParede
              }
              strokeWidth="1"
              opacity="0.2"
            />
          </pattern>

          <pattern
            id={idPisoCorredor}
            width={tamanhoSeguro}
            height={tamanhoSeguro}
            patternUnits="userSpaceOnUse"
          >
            {texturaPisoCorredor ? (
              <image
                href={
                  texturaPisoCorredor
                }
                x="0"
                y="0"
                width={tamanhoSeguro}
                height={tamanhoSeguro}
                preserveAspectRatio="xMidYMid slice"
                onError={
                  ocultarImagemComErro
                }
              />
            ) : (
              <rect
                width={tamanhoSeguro}
                height={tamanhoSeguro}
                fill={
                  paleta.pisoCorredor
                }
              />
            )}

            <path
              d={
                `M 0 ${tamanhoSeguro / 2} H ${tamanhoSeguro}`
              }
              stroke={paleta.porta}
              strokeWidth={
                Math.max(
                  2,
                  tamanhoSeguro * 0.055,
                )
              }
              opacity="0.25"
            />
          </pattern>

          <pattern
            id={idPisoEspecial}
            width={
              tamanhoSeguro * 4
            }
            height={
              tamanhoSeguro * 4
            }
            patternUnits="userSpaceOnUse"
          >
            {texturaPisoEspecial ? (
              <image
                href={
                  texturaPisoEspecial
                }
                x="0"
                y="0"
                width={
                  tamanhoSeguro * 4
                }
                height={
                  tamanhoSeguro * 4
                }
                preserveAspectRatio="xMidYMid slice"
                onError={
                  ocultarImagemComErro
                }
              />
            ) : (
              <rect
                width={
                  tamanhoSeguro * 4
                }
                height={
                  tamanhoSeguro * 4
                }
                fill={
                  paleta.pisoSala
                }
              />
            )}
          </pattern>

          <MascaraMata
            id={idMascaraMata}
            arquitetura={
              arquitetura
            }
            largura={
              larguraSegura
            }
            altura={
              alturaSegura
            }
            tamanhoCelula={
              tamanhoSeguro
            }
            segmentosTrilha={
              segmentosTrilha
            }
          />
        </defs>

        {ambienteAberto ? (
          <RenderizacaoAmbienteAberto
            arquitetura={
              arquitetura
            }
            tamanhoCelula={
              tamanhoSeguro
            }
            largura={
              larguraSegura
            }
            altura={
              alturaSegura
            }
            filtroOrganicoId={
              idOrganico
            }
            mascaraMataId={
              idMascaraMata
            }
            imagemArvore={
              imagemArvore
            }
            imagemArbusto={
              imagemArbusto
            }
            elementosVegetacao={
              elementosVegetacao
            }
            segmentosTrilha={
              segmentosTrilha
            }
            texturaFundoId={
              idTexturaFundo
            }
          />
        ) : (
          <>
            <rect
              x="0"
              y="0"
              width={
                larguraSegura
              }
              height={
                alturaSegura
              }
              fill={paleta.fundo}
              opacity="0.3"
            />

            <g
              className="camada-arquitetura-gerada__pisos"
              filter={
                `url(#${idDesgaste})`
              }
            >
              {(
                arquitetura.salas || []
              ).map(
                (sala) => {
                  const especial =
                    salaUsaPisoEspecial(
                      sala,
                    )
                    && Boolean(
                      texturaPisoEspecial,
                    );

                  const idPadrao =
                    especial
                      ? idPisoEspecial
                      : idPisoSala;

                  return (
                    <rect
                      key={sala.id}
                      x={
                        sala.x
                        * tamanhoSeguro
                      }
                      y={
                        sala.y
                        * tamanhoSeguro
                      }
                      width={
                        sala.largura
                        * tamanhoSeguro
                      }
                      height={
                        sala.altura
                        * tamanhoSeguro
                      }
                      fill={
                        `url(#${idPadrao})`
                      }
                    />
                  );
                },
              )}

              {(
                arquitetura.corredores
                || []
              ).map(
                (
                  celula,
                  indice,
                ) => (
                  <rect
                    key={
                      `${celula.x}-${celula.y}-${indice}`
                    }
                    x={
                      celula.x
                      * tamanhoSeguro
                    }
                    y={
                      celula.y
                      * tamanhoSeguro
                    }
                    width={
                      tamanhoSeguro
                    }
                    height={
                      tamanhoSeguro
                    }
                    fill={
                      `url(#${idPisoCorredor})`
                    }
                  />
                ),
              )}
            </g>

            <g
              className="camada-arquitetura-gerada__paredes"
              filter={
                `url(#${idSombra})`
              }
            >
              {(
                arquitetura.paredes || []
              ).map(
                (parede) => {
                  const geometria =
                    geometriaSegmento(
                      parede,
                      tamanhoSeguro,
                    );

                  return usarParedeIndustrial ? (
                    <ParedeIndustrial
                      key={parede.id}
                      geometria={
                        geometria
                      }
                      tamanhoCelula={
                        tamanhoSeguro
                      }
                    />
                  ) : (
                    <ParedePadrao
                      key={parede.id}
                      geometria={
                        geometria
                      }
                      larguraParede={
                        larguraParede
                      }
                      tamanhoCelula={
                        tamanhoSeguro
                      }
                      paleta={paleta}
                    />
                  );
                },
              )}
            </g>

            <g className="camada-arquitetura-gerada__portas">
              {(
                arquitetura.portas || []
              ).map(
                (porta) => {
                  const secretaOculta =
                    porta.secreta
                    && !porta.revelada;

                  const geometria =
                    geometriaSegmento(
                      porta,
                      tamanhoSeguro,
                    );

                  const aberta =
                    porta.estado
                    === "aberta";

                  const trancada =
                    porta.estado
                    === "trancada"
                    || porta.trancada
                    === true;

                  const disfarcarComoParede =
                    papelAtual
                    === "jogador"
                    && secretaOculta;

                  let caminhoPorta =
                    texturaPortaFechada;

                  if (
                    papelAtual === "mestre"
                    && secretaOculta
                  ) {
                    caminhoPorta =
                      texturaPortaSecreta
                      || texturaPortaFechada;
                  } else if (
                    trancada
                  ) {
                    caminhoPorta =
                      texturaPortaTrancada
                      || texturaPortaFechada;
                  } else if (
                    aberta
                  ) {
                    caminhoPorta =
                      texturaPortaAberta
                      || texturaPortaFechada;
                  }

                  if (
                    disfarcarComoParede
                  ) {
                    return usarParedeIndustrial ? (
                      <ParedeIndustrial
                        key={porta.id}
                        geometria={
                          geometria
                        }
                        tamanhoCelula={
                          tamanhoSeguro
                        }
                      />
                    ) : (
                      <ParedePadrao
                        key={porta.id}
                        geometria={
                          geometria
                        }
                        larguraParede={
                          larguraParede
                        }
                        tamanhoCelula={
                          tamanhoSeguro
                        }
                        paleta={paleta}
                      />
                    );
                  }

                  return (
                    <g key={porta.id}>
                      <line
                        x1={geometria.x1}
                        y1={geometria.y1}
                        x2={geometria.x2}
                        y2={geometria.y2}
                        stroke={
                          paleta.sombra
                        }
                        strokeLinecap="square"
                        strokeWidth={
                          larguraPorta
                          + Math.max(
                            3,
                            tamanhoSeguro
                            * 0.055,
                          )
                        }
                        opacity="0.76"
                      />

                      <line
                        x1={geometria.x1}
                        y1={geometria.y1}
                        x2={geometria.x2}
                        y2={geometria.y2}
                        stroke={
                          trancada
                            ? paleta.portaTrancada
                            : paleta.porta
                        }
                        strokeLinecap="square"
                        strokeWidth={
                          larguraPorta
                        }
                        strokeDasharray={
                          aberta
                            ? `${
                                tamanhoSeguro
                                * 0.15
                              } ${
                                tamanhoSeguro
                                * 0.1
                              }`
                            : undefined
                        }
                        opacity={
                          caminhoPorta
                            ? 0.18
                            : 1
                        }
                      />

                      <ImagemPorta
                        geometria={
                          geometria
                        }
                        caminho={
                          caminhoPorta
                        }
                        tamanhoCelula={
                          tamanhoSeguro
                        }
                      />
                    </g>
                  );
                },
              )}
            </g>
          </>
        )}
      </svg>
    </>
  );
}