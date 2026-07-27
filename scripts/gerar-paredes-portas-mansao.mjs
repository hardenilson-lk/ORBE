import {
  mkdir,
  writeFile,
} from "node:fs/promises";

import {
  spawnSync,
} from "node:child_process";

import path from "node:path";

const RAIZ_PROJETO =
  process.cwd();

const PASTA_MANSAO =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "mansao",
  );

const PASTA_PAREDES =
  path.join(
    PASTA_MANSAO,
    "paredes",
  );

const PASTA_PORTAS =
  path.join(
    PASTA_MANSAO,
    "portas",
  );

function criarSvg({
  conteudo,
  viewBox = "0 0 512 512",
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="${viewBox}"
  width="512"
  height="512"
>
  <defs>
    <linearGradient
      id="madeira"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#a16c3c"
      />

      <stop
        offset="0.45"
        stop-color="#68401f"
      />

      <stop
        offset="1"
        stop-color="#2e1a10"
      />
    </linearGradient>

    <linearGradient
      id="madeira-clara"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#c9965d"
      />

      <stop
        offset="0.48"
        stop-color="#8a582d"
      />

      <stop
        offset="1"
        stop-color="#4b2b18"
      />
    </linearGradient>

    <linearGradient
      id="madeira-escura"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#4b2d1b"
      />

      <stop
        offset="0.5"
        stop-color="#291810"
      />

      <stop
        offset="1"
        stop-color="#120b08"
      />
    </linearGradient>

    <linearGradient
      id="papel-parede"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#9f9278"
      />

      <stop
        offset="0.5"
        stop-color="#736550"
      />

      <stop
        offset="1"
        stop-color="#453b30"
      />
    </linearGradient>

    <linearGradient
      id="vinho"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#8c3447"
      />

      <stop
        offset="0.5"
        stop-color="#571d2d"
      />

      <stop
        offset="1"
        stop-color="#290e17"
      />
    </linearGradient>

    <linearGradient
      id="metal"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d0c8ad"
      />

      <stop
        offset="0.48"
        stop-color="#8a8067"
      />

      <stop
        offset="1"
        stop-color="#494331"
      />
    </linearGradient>

    <radialGradient
      id="ouro"
      cx="40%"
      cy="35%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#ffe8a2"
      />

      <stop
        offset="0.42"
        stop-color="#c99a43"
      />

      <stop
        offset="1"
        stop-color="#604116"
      />
    </radialGradient>

    <radialGradient
      id="vidro"
      cx="40%"
      cy="30%"
      r="75%"
    >
      <stop
        offset="0"
        stop-color="#e4d9bd"
        stop-opacity=".92"
      />

      <stop
        offset="0.5"
        stop-color="#887d69"
        stop-opacity=".65"
      />

      <stop
        offset="1"
        stop-color="#342d26"
        stop-opacity=".88"
      />
    </radialGradient>

    <pattern
      id="ornamento"
      width="96"
      height="96"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="96"
        height="96"
        fill="url(#papel-parede)"
      />

      <circle
        cx="48"
        cy="48"
        r="26"
        fill="none"
        stroke="#b29e70"
        stroke-width="5"
        opacity=".3"
      />

      <path
        d="M48 12C62 29 68 35 84 48C68 61 62 67 48 84C34 67 28 61 12 48C28 35 34 29 48 12Z"
        fill="none"
        stroke="#4f4435"
        stroke-width="5"
        opacity=".4"
      />

      <circle
        cx="48"
        cy="48"
        r="7"
        fill="#c2a96d"
        opacity=".45"
      />
    </pattern>

    <pattern
      id="faixa-corrente"
      width="74"
      height="74"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(-35)"
    >
      <rect
        width="74"
        height="74"
        fill="#311116"
      />

      <path
        d="M18 4C5 4 5 31 18 31H37C50 31 50 58 37 58H18"
        fill="none"
        stroke="#a99f83"
        stroke-width="12"
        stroke-linecap="round"
      />
    </pattern>

    <filter
      id="sombra"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feDropShadow
        dx="10"
        dy="14"
        stdDeviation="11"
        flood-color="#000000"
        flood-opacity=".65"
      />
    </filter>

    <filter
      id="textura"
      x="-10%"
      y="-10%"
      width="120%"
      height="120%"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency=".027"
        numOctaves="3"
        seed="71"
        result="ruido"
      />

      <feColorMatrix
        in="ruido"
        type="saturate"
        values="0"
        result="ruido-cinza"
      />

      <feComponentTransfer
        in="ruido-cinza"
        result="ruido-suave"
      >
        <feFuncA
          type="table"
          tableValues="0 .17"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="ruido-suave"
        mode="multiply"
      />
    </filter>
  </defs>

  ${conteudo}
</svg>
`;
}

const PAREDES = {
  "parede-horizontal.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="18"
            y="168"
            width="476"
            height="176"
            rx="15"
            fill="#160e09"
          />

          <rect
            x="29"
            y="180"
            width="454"
            height="152"
            rx="10"
            fill="url(#ornamento)"
            stroke="#4b2e1c"
            stroke-width="11"
            filter="url(#textura)"
          />

          <rect
            x="43"
            y="194"
            width="426"
            height="67"
            rx="5"
            fill="url(#papel-parede)"
            stroke="#5c4c39"
            stroke-width="5"
          />

          <rect
            x="43"
            y="261"
            width="426"
            height="55"
            rx="5"
            fill="url(#madeira)"
            stroke="#2d190f"
            stroke-width="6"
          />

          <path
            d="M47 202H465"
            stroke="#cdbd95"
            stroke-width="7"
            opacity=".45"
          />

          <path
            d="M47 268H465"
            stroke="url(#ouro)"
            stroke-width="8"
            opacity=".68"
          />

          <path
            d="M82 218C114 196 145 240 178 218C211 196 242 240 275 218C308 196 339 240 372 218C394 204 416 218 435 225"
            fill="none"
            stroke="#574a38"
            stroke-width="7"
            opacity=".48"
          />

          <path
            d="M76 289H170M196 289H282M308 289H438"
            stroke="#1e110a"
            stroke-width="8"
            stroke-linecap="round"
            opacity=".6"
          />

          <g
            fill="url(#ouro)"
            stroke="#35260e"
            stroke-width="4"
          >
            <circle
              cx="49"
              cy="256"
              r="9"
            />

            <circle
              cx="463"
              cy="256"
              r="9"
            />

            <circle
              cx="256"
              cy="190"
              r="8"
            />

            <circle
              cx="256"
              cy="322"
              r="8"
            />
          </g>
        </g>
      `,
    }),

  "parede-vertical.svg":
    criarSvg({
      conteudo: `
        <g
          filter="url(#sombra)"
          transform="rotate(90 256 256)"
        >
          <rect
            x="18"
            y="168"
            width="476"
            height="176"
            rx="15"
            fill="#160e09"
          />

          <rect
            x="29"
            y="180"
            width="454"
            height="152"
            rx="10"
            fill="url(#ornamento)"
            stroke="#4b2e1c"
            stroke-width="11"
            filter="url(#textura)"
          />

          <rect
            x="43"
            y="194"
            width="426"
            height="67"
            rx="5"
            fill="url(#papel-parede)"
            stroke="#5c4c39"
            stroke-width="5"
          />

          <rect
            x="43"
            y="261"
            width="426"
            height="55"
            rx="5"
            fill="url(#madeira)"
            stroke="#2d190f"
            stroke-width="6"
          />

          <path
            d="M47 202H465"
            stroke="#cdbd95"
            stroke-width="7"
            opacity=".45"
          />

          <path
            d="M47 268H465"
            stroke="url(#ouro)"
            stroke-width="8"
            opacity=".68"
          />

          <path
            d="M82 218C114 196 145 240 178 218C211 196 242 240 275 218C308 196 339 240 372 218C394 204 416 218 435 225"
            fill="none"
            stroke="#574a38"
            stroke-width="7"
            opacity=".48"
          />

          <path
            d="M76 289H170M196 289H282M308 289H438"
            stroke="#1e110a"
            stroke-width="8"
            stroke-linecap="round"
            opacity=".6"
          />

          <g
            fill="url(#ouro)"
            stroke="#35260e"
            stroke-width="4"
          >
            <circle
              cx="49"
              cy="256"
              r="9"
            />

            <circle
              cx="463"
              cy="256"
              r="9"
            />

            <circle
              cx="256"
              cy="190"
              r="8"
            />

            <circle
              cx="256"
              cy="322"
              r="8"
            />
          </g>
        </g>
      `,
    }),

  "parede-canto.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <path
            d="
              M58 72
              H302
              V210
              H440
              V454
              H276
              V236
              H58
              Z
            "
            fill="#160e09"
          />

          <path
            d="
              M73 88
              H286
              V226
              H424
              V438
              H292
              V220
              H73
              Z
            "
            fill="url(#ornamento)"
            stroke="#4b2e1c"
            stroke-width="13"
            filter="url(#textura)"
          />

          <path
            d="M91 112H260V250H399"
            fill="none"
            stroke="#cdbd95"
            stroke-width="18"
            opacity=".43"
          />

          <path
            d="M89 180H220V311H359V416"
            fill="none"
            stroke="url(#madeira)"
            stroke-width="44"
          />

          <path
            d="M92 173H227V304H366"
            fill="none"
            stroke="url(#ouro)"
            stroke-width="7"
            opacity=".7"
          />

          <g
            fill="url(#ouro)"
            stroke="#35260e"
            stroke-width="5"
          >
            <circle
              cx="98"
              cy="103"
              r="9"
            />

            <circle
              cx="276"
              cy="104"
              r="9"
            />

            <circle
              cx="303"
              cy="239"
              r="9"
            />

            <circle
              cx="409"
              cy="418"
              r="9"
            />
          </g>
        </g>
      `,
    }),
};

const PORTAS = {
  "porta-fechada.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="57"
            y="116"
            width="398"
            height="280"
            rx="24"
            fill="#150d08"
          />

          <rect
            x="76"
            y="136"
            width="360"
            height="240"
            rx="15"
            fill="url(#madeira)"
            stroke="#2e190f"
            stroke-width="16"
            filter="url(#textura)"
          />

          <rect
            x="100"
            y="158"
            width="142"
            height="192"
            rx="10"
            fill="url(#madeira-clara)"
            stroke="#472918"
            stroke-width="10"
          />

          <rect
            x="270"
            y="158"
            width="142"
            height="192"
            rx="10"
            fill="url(#madeira-clara)"
            stroke="#472918"
            stroke-width="10"
          />

          <path
            d="M256 143V368"
            stroke="#24130c"
            stroke-width="18"
          />

          <g
            fill="none"
            stroke="url(#ouro)"
            stroke-width="9"
          >
            <rect
              x="118"
              y="178"
              width="106"
              height="150"
              rx="53"
            />

            <rect
              x="288"
              y="178"
              width="106"
              height="150"
              rx="53"
            />
          </g>

          <circle
            cx="226"
            cy="262"
            r="18"
            fill="url(#ouro)"
            stroke="#3f2b0d"
            stroke-width="7"
          />

          <circle
            cx="286"
            cy="262"
            r="18"
            fill="url(#ouro)"
            stroke="#3f2b0d"
            stroke-width="7"
          />

          <rect
            x="91"
            y="103"
            width="330"
            height="43"
            rx="10"
            fill="url(#madeira-escura)"
            stroke="#150d08"
            stroke-width="9"
          />

          <path
            d="M122 123H390"
            stroke="url(#ouro)"
            stroke-width="8"
            stroke-linecap="round"
          />
        </g>
      `,
    }),

  "porta-aberta.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="62"
            y="101"
            width="388"
            height="310"
            rx="24"
            fill="#150d08"
          />

          <rect
            x="86"
            y="125"
            width="340"
            height="262"
            rx="14"
            fill="#0b0705"
            stroke="#65442b"
            stroke-width="14"
          />

          <rect
            x="87"
            y="145"
            width="106"
            height="226"
            rx="12"
            fill="url(#madeira)"
            stroke="#2e190f"
            stroke-width="12"
            transform="rotate(-21 87 145)"
          />

          <rect
            x="319"
            y="145"
            width="106"
            height="226"
            rx="12"
            fill="url(#madeira)"
            stroke="#2e190f"
            stroke-width="12"
            transform="rotate(21 425 145)"
          />

          <path
            d="M191 160H321V351H191Z"
            fill="#030201"
            stroke="#57412d"
            stroke-width="11"
            stroke-dasharray="24 15"
          />

          <path
            d="M207 178H305V334H207Z"
            fill="#000000"
            opacity=".96"
          />

          <path
            d="M218 196H294M218 317H294"
            stroke="#a8864c"
            stroke-width="7"
            opacity=".3"
          />

          <rect
            x="91"
            y="95"
            width="330"
            height="44"
            rx="10"
            fill="url(#madeira-escura)"
            stroke="#150d08"
            stroke-width="9"
          />

          <path
            d="M122 117H390"
            stroke="url(#ouro)"
            stroke-width="8"
            stroke-linecap="round"
          />
        </g>
      `,
    }),

  "porta-trancada.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="57"
            y="116"
            width="398"
            height="280"
            rx="24"
            fill="#150d08"
          />

          <rect
            x="76"
            y="136"
            width="360"
            height="240"
            rx="15"
            fill="url(#vinho)"
            stroke="#3e111b"
            stroke-width="16"
            filter="url(#textura)"
          />

          <rect
            x="101"
            y="159"
            width="310"
            height="191"
            rx="10"
            fill="url(#madeira-escura)"
            stroke="#1a0d09"
            stroke-width="11"
          />

          <rect
            x="106"
            y="202"
            width="300"
            height="105"
            rx="10"
            fill="url(#faixa-corrente)"
            opacity=".88"
          />

          <path
            d="M126 184L386 326M386 184L126 326"
            stroke="#aaa28b"
            stroke-width="20"
            stroke-linecap="round"
          />

          <rect
            x="205"
            y="207"
            width="102"
            height="112"
            rx="16"
            fill="url(#metal)"
            stroke="#28241c"
            stroke-width="11"
          />

          <path
            d="M226 211V180C226 136 286 136 286 180V211"
            fill="none"
            stroke="#c9c2ad"
            stroke-width="20"
            stroke-linecap="round"
          />

          <circle
            cx="256"
            cy="260"
            r="17"
            fill="url(#ouro)"
            stroke="#3b290d"
            stroke-width="7"
          />

          <path
            d="M256 277V301"
            stroke="#292317"
            stroke-width="10"
            stroke-linecap="round"
          />

          <rect
            x="91"
            y="103"
            width="330"
            height="43"
            rx="10"
            fill="url(#madeira-escura)"
            stroke="#150d08"
            stroke-width="9"
          />

          <path
            d="M122 123H390"
            stroke="#8e2d40"
            stroke-width="8"
            stroke-linecap="round"
          />
        </g>
      `,
    }),

  "porta-secreta.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="42"
            y="154"
            width="428"
            height="204"
            rx="16"
            fill="#160e09"
          />

          <rect
            x="59"
            y="171"
            width="394"
            height="170"
            rx="11"
            fill="url(#ornamento)"
            stroke="#4b2e1c"
            stroke-width="14"
            filter="url(#textura)"
          />

          <rect
            x="74"
            y="187"
            width="364"
            height="65"
            rx="5"
            fill="url(#papel-parede)"
            stroke="#5c4c39"
            stroke-width="5"
          />

          <rect
            x="74"
            y="252"
            width="364"
            height="73"
            rx="5"
            fill="url(#madeira)"
            stroke="#2d190f"
            stroke-width="6"
          />

          <path
            d="M78 195H434"
            stroke="#cdbd95"
            stroke-width="7"
            opacity=".42"
          />

          <path
            d="M78 260H434"
            stroke="url(#ouro)"
            stroke-width="8"
            opacity=".65"
          />

          <path
            d="M256 175V337"
            stroke="#382216"
            stroke-width="7"
            opacity=".28"
          />

          <path
            d="M244 213H268M244 290H268"
            stroke="#70573a"
            stroke-width="5"
            stroke-linecap="round"
            opacity=".23"
          />

          <circle
            cx="256"
            cy="278"
            r="8"
            fill="url(#ouro)"
            opacity=".22"
          />
        </g>
      `,
    }),
};

async function escreverGrupo({
  pasta,
  arquivos,
}) {
  await mkdir(
    pasta,
    {
      recursive: true,
    },
  );

  for (
    const [
      nomeArquivo,
      conteudo,
    ] of Object.entries(
      arquivos,
    )
  ) {
    const caminho =
      path.join(
        pasta,
        nomeArquivo,
      );

    await writeFile(
      caminho,
      conteudo,
      "utf8",
    );

    console.log(
      `Criado: ${nomeArquivo}`,
    );
  }
}

function atualizarManifesto() {
  const scriptManifesto =
    path.join(
      RAIZ_PROJETO,
      "scripts",
      "gerar-manifest-packs.mjs",
    );

  const resultado =
    spawnSync(
      process.execPath,
      [
        scriptManifesto,
      ],
      {
        cwd:
          RAIZ_PROJETO,

        encoding:
          "utf8",
      },
    );

  if (
    resultado.stdout
  ) {
    console.log(
      resultado.stdout.trim(),
    );
  }

  if (
    resultado.stderr
  ) {
    console.error(
      resultado.stderr.trim(),
    );
  }

  if (
    resultado.status !==
    0
  ) {
    throw new Error(
      "Os assets foram criados, mas o manifesto não pôde ser atualizado.",
    );
  }
}

async function gerarPack() {
  await escreverGrupo({
    pasta:
      PASTA_PAREDES,

    arquivos:
      PAREDES,
  });

  await escreverGrupo({
    pasta:
      PASTA_PORTAS,

    arquivos:
      PORTAS,
  });

  atualizarManifesto();

  console.log(
    [
      "",
      "Paredes e portas da Mansão concluídas.",
      `Paredes: ${Object.keys(PAREDES).length}.`,
      `Portas: ${Object.keys(PORTAS).length}.`,
      `Pasta de paredes: ${PASTA_PAREDES}`,
      `Pasta de portas: ${PASTA_PORTAS}`,
    ].join("\n"),
  );
}

gerarPack().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar as paredes e portas da Mansão.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);