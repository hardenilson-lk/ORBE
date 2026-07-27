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

const PASTA_DELEGACIA =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "delegacia",
  );

const PASTA_PAREDES =
  path.join(
    PASTA_DELEGACIA,
    "paredes",
  );

const PASTA_PORTAS =
  path.join(
    PASTA_DELEGACIA,
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
      id="concreto"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d0d5d4"
      />

      <stop
        offset="0.48"
        stop-color="#a3acad"
      />

      <stop
        offset="1"
        stop-color="#707a7c"
      />
    </linearGradient>

    <linearGradient
      id="concreto-escuro"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#687376"
      />

      <stop
        offset="0.5"
        stop-color="#434e52"
      />

      <stop
        offset="1"
        stop-color="#252d30"
      />
    </linearGradient>

    <linearGradient
      id="faixa-azul"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#497b9b"
      />

      <stop
        offset="0.48"
        stop-color="#285879"
      />

      <stop
        offset="1"
        stop-color="#15384f"
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
        stop-color="#bcc5c5"
      />

      <stop
        offset="0.46"
        stop-color="#758184"
      />

      <stop
        offset="1"
        stop-color="#3a4447"
      />
    </linearGradient>

    <linearGradient
      id="metal-escuro"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#4d595d"
      />

      <stop
        offset="0.5"
        stop-color="#2d373b"
      />

      <stop
        offset="1"
        stop-color="#151b1e"
      />
    </linearGradient>

    <linearGradient
      id="porta-azul"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#477896"
      />

      <stop
        offset="0.5"
        stop-color="#285572"
      />

      <stop
        offset="1"
        stop-color="#143247"
      />
    </linearGradient>

    <linearGradient
      id="porta-vermelha"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#c94d4a"
      />

      <stop
        offset="0.52"
        stop-color="#8d2928"
      />

      <stop
        offset="1"
        stop-color="#481415"
      />
    </linearGradient>

    <linearGradient
      id="vidro"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d9eef1"
        stop-opacity=".9"
      />

      <stop
        offset="0.5"
        stop-color="#81aeb8"
        stop-opacity=".75"
      />

      <stop
        offset="1"
        stop-color="#345f6a"
        stop-opacity=".86"
      />
    </linearGradient>

    <pattern
      id="placas-metal"
      width="64"
      height="64"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="64"
        height="64"
        fill="url(#metal)"
      />

      <path
        d="M0 0H64V64H0Z"
        fill="none"
        stroke="#3d484b"
        stroke-width="4"
        opacity=".64"
      />

      <circle
        cx="9"
        cy="9"
        r="4"
        fill="#c2caca"
        stroke="#3a4345"
        stroke-width="2"
      />

      <circle
        cx="55"
        cy="55"
        r="4"
        fill="#c2caca"
        stroke="#3a4345"
        stroke-width="2"
      />
    </pattern>

    <pattern
      id="grade"
      width="42"
      height="42"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="42"
        height="42"
        fill="#161c1f"
      />

      <path
        d="M10 0V42M32 0V42"
        stroke="#839093"
        stroke-width="7"
      />

      <path
        d="M0 10H42M0 32H42"
        stroke="#687579"
        stroke-width="4"
      />
    </pattern>

    <pattern
      id="faixa-alerta"
      width="64"
      height="64"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <rect
        width="32"
        height="64"
        fill="#d2ad37"
      />

      <rect
        x="32"
        width="32"
        height="64"
        fill="#252a2b"
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
        dx="9"
        dy="13"
        stdDeviation="10"
        flood-color="#000000"
        flood-opacity=".58"
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
        baseFrequency=".028"
        numOctaves="3"
        seed="43"
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
          tableValues="0 .15"
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
            y="171"
            width="476"
            height="170"
            rx="14"
            fill="#252d30"
          />

          <rect
            x="29"
            y="183"
            width="454"
            height="146"
            rx="9"
            fill="url(#concreto)"
            stroke="#465154"
            stroke-width="10"
            filter="url(#textura)"
          />

          <rect
            x="43"
            y="197"
            width="426"
            height="53"
            rx="4"
            fill="#c5cbca"
            stroke="#727c7d"
            stroke-width="5"
          />

          <rect
            x="43"
            y="250"
            width="426"
            height="63"
            rx="4"
            fill="url(#faixa-azul)"
            stroke="#18384c"
            stroke-width="5"
          />

          <path
            d="M47 205H465"
            stroke="#eef2f1"
            stroke-width="7"
            opacity=".4"
          />

          <path
            d="M47 259H465"
            stroke="#88aabd"
            stroke-width="6"
            opacity=".45"
          />

          <path
            d="M73 219H168M195 219H285M312 219H437"
            stroke="#9da5a5"
            stroke-width="6"
            stroke-linecap="round"
            opacity=".43"
          />

          <path
            d="M72 288H177M205 288H283M310 288H439"
            stroke="#102f43"
            stroke-width="7"
            stroke-linecap="round"
            opacity=".5"
          />

          <g
            fill="#a1a8a6"
            stroke="#343d3f"
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
              cy="193"
              r="8"
            />

            <circle
              cx="256"
              cy="319"
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
            y="171"
            width="476"
            height="170"
            rx="14"
            fill="#252d30"
          />

          <rect
            x="29"
            y="183"
            width="454"
            height="146"
            rx="9"
            fill="url(#concreto)"
            stroke="#465154"
            stroke-width="10"
            filter="url(#textura)"
          />

          <rect
            x="43"
            y="197"
            width="426"
            height="53"
            rx="4"
            fill="#c5cbca"
            stroke="#727c7d"
            stroke-width="5"
          />

          <rect
            x="43"
            y="250"
            width="426"
            height="63"
            rx="4"
            fill="url(#faixa-azul)"
            stroke="#18384c"
            stroke-width="5"
          />

          <path
            d="M47 205H465"
            stroke="#eef2f1"
            stroke-width="7"
            opacity=".4"
          />

          <path
            d="M47 259H465"
            stroke="#88aabd"
            stroke-width="6"
            opacity=".45"
          />

          <path
            d="M73 219H168M195 219H285M312 219H437"
            stroke="#9da5a5"
            stroke-width="6"
            stroke-linecap="round"
            opacity=".43"
          />

          <path
            d="M72 288H177M205 288H283M310 288H439"
            stroke="#102f43"
            stroke-width="7"
            stroke-linecap="round"
            opacity=".5"
          />

          <g
            fill="#a1a8a6"
            stroke="#343d3f"
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
              cy="193"
              r="8"
            />

            <circle
              cx="256"
              cy="319"
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
            fill="#252d30"
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
            fill="url(#concreto)"
            stroke="#465154"
            stroke-width="13"
            filter="url(#textura)"
          />

          <path
            d="M91 112H260V250H399"
            fill="none"
            stroke="#e2e7e6"
            stroke-width="17"
            opacity=".4"
          />

          <path
            d="M89 180H220V311H359V416"
            fill="none"
            stroke="url(#faixa-azul)"
            stroke-width="42"
          />

          <path
            d="M92 174H226V305H365"
            fill="none"
            stroke="#82a5b8"
            stroke-width="6"
            opacity=".42"
          />

          <g
            fill="#a1a8a6"
            stroke="#343d3f"
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
            x="61"
            y="121"
            width="390"
            height="270"
            rx="22"
            fill="#252d30"
          />

          <rect
            x="79"
            y="140"
            width="354"
            height="232"
            rx="14"
            fill="url(#porta-azul)"
            stroke="#132f40"
            stroke-width="15"
            filter="url(#textura)"
          />

          <rect
            x="103"
            y="162"
            width="306"
            height="78"
            rx="8"
            fill="url(#vidro)"
            stroke="#2f4f58"
            stroke-width="11"
          />

          <path
            d="M179 164V238M256 164V238M333 164V238"
            stroke="#4e6e76"
            stroke-width="8"
          />

          <rect
            x="104"
            y="264"
            width="304"
            height="82"
            rx="8"
            fill="url(#metal)"
            stroke="#354043"
            stroke-width="10"
          />

          <path
            d="M125 284H387M125 326H387"
            stroke="#8d999a"
            stroke-width="6"
            opacity=".45"
          />

          <circle
            cx="365"
            cy="304"
            r="17"
            fill="#d1c36c"
            stroke="#34321b"
            stroke-width="7"
          />

          <rect
            x="96"
            y="108"
            width="320"
            height="40"
            rx="9"
            fill="url(#concreto-escuro)"
            stroke="#252d30"
            stroke-width="8"
          />

          <rect
            x="179"
            y="112"
            width="154"
            height="30"
            rx="7"
            fill="#d9e2e3"
            stroke="#384b51"
            stroke-width="5"
          />

          <path
            d="M203 126H309"
            stroke="#254f68"
            stroke-width="7"
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
            x="66"
            y="105"
            width="380"
            height="302"
            rx="22"
            fill="#252d30"
          />

          <rect
            x="89"
            y="128"
            width="334"
            height="256"
            rx="13"
            fill="#111719"
            stroke="#687477"
            stroke-width="13"
          />

          <rect
            x="94"
            y="148"
            width="95"
            height="218"
            rx="10"
            fill="url(#porta-azul)"
            stroke="#173a4f"
            stroke-width="11"
            transform="rotate(-20 94 148)"
          />

          <rect
            x="323"
            y="148"
            width="95"
            height="218"
            rx="10"
            fill="url(#porta-azul)"
            stroke="#173a4f"
            stroke-width="11"
            transform="rotate(20 418 148)"
          />

          <path
            d="M191 162H321V348H191Z"
            fill="#070a0b"
            stroke="#536064"
            stroke-width="10"
            stroke-dasharray="22 15"
          />

          <path
            d="M205 177H307V334H205Z"
            fill="#020304"
            opacity=".95"
          />

          <path
            d="M214 194H298M214 317H298"
            stroke="#678a93"
            stroke-width="7"
            opacity=".27"
          />

          <rect
            x="96"
            y="99"
            width="320"
            height="42"
            rx="9"
            fill="url(#concreto-escuro)"
            stroke="#252d30"
            stroke-width="8"
          />

          <rect
            x="179"
            y="104"
            width="154"
            height="30"
            rx="7"
            fill="#d9e2e3"
            stroke="#384b51"
            stroke-width="5"
          />

          <path
            d="M203 119H309"
            stroke="#254f68"
            stroke-width="7"
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
            x="61"
            y="121"
            width="390"
            height="270"
            rx="22"
            fill="#252d30"
          />

          <rect
            x="79"
            y="140"
            width="354"
            height="232"
            rx="14"
            fill="url(#porta-vermelha)"
            stroke="#451415"
            stroke-width="15"
            filter="url(#textura)"
          />

          <rect
            x="103"
            y="162"
            width="306"
            height="69"
            rx="8"
            fill="url(#grade)"
            stroke="#252d30"
            stroke-width="10"
          />

          <rect
            x="100"
            y="247"
            width="312"
            height="96"
            rx="9"
            fill="url(#faixa-alerta)"
            opacity=".78"
            stroke="#451514"
            stroke-width="10"
          />

          <rect
            x="206"
            y="230"
            width="100"
            height="118"
            rx="15"
            fill="url(#metal)"
            stroke="#22292b"
            stroke-width="11"
          />

          <path
            d="M226 235V201C226 157 286 157 286 201V235"
            fill="none"
            stroke="#d0d5d3"
            stroke-width="19"
            stroke-linecap="round"
          />

          <circle
            cx="256"
            cy="282"
            r="16"
            fill="#d7c863"
            stroke="#35321a"
            stroke-width="7"
          />

          <path
            d="M256 298V323"
            stroke="#25291f"
            stroke-width="10"
            stroke-linecap="round"
          />

          <rect
            x="96"
            y="108"
            width="320"
            height="40"
            rx="9"
            fill="url(#concreto-escuro)"
            stroke="#252d30"
            stroke-width="8"
          />

          <rect
            x="173"
            y="112"
            width="166"
            height="30"
            rx="7"
            fill="#ecd8d8"
            stroke="#6a2929"
            stroke-width="5"
          />

          <path
            d="M196 126H316"
            stroke="#9a2929"
            stroke-width="7"
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
            x="44"
            y="157"
            width="424"
            height="198"
            rx="15"
            fill="#252d30"
          />

          <rect
            x="60"
            y="173"
            width="392"
            height="166"
            rx="10"
            fill="url(#concreto)"
            stroke="#465154"
            stroke-width="13"
            filter="url(#textura)"
          />

          <rect
            x="74"
            y="187"
            width="364"
            height="54"
            rx="4"
            fill="#c5cbca"
            stroke="#727c7d"
            stroke-width="5"
          />

          <rect
            x="74"
            y="241"
            width="364"
            height="82"
            rx="4"
            fill="url(#faixa-azul)"
            stroke="#18384c"
            stroke-width="5"
          />

          <path
            d="M78 195H434"
            stroke="#eef2f1"
            stroke-width="7"
            opacity=".4"
          />

          <path
            d="M256 177V335"
            stroke="#303a3d"
            stroke-width="7"
            opacity=".32"
          />

          <path
            d="M244 210H268M244 286H268"
            stroke="#627074"
            stroke-width="5"
            stroke-linecap="round"
            opacity=".25"
          />

          <circle
            cx="256"
            cy="267"
            r="8"
            fill="#6e7a7d"
            opacity=".25"
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
      "Paredes e portas da Delegacia concluídas.",
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
      "Não foi possível gerar as paredes e portas da Delegacia.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);