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

const PASTA_LABORATORIO =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "laboratorio",
  );

const PASTA_PAREDES =
  path.join(
    PASTA_LABORATORIO,
    "paredes",
  );

const PASTA_PORTAS =
  path.join(
    PASTA_LABORATORIO,
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
      id="painel-claro"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#edf3ef"
      />

      <stop
        offset="0.48"
        stop-color="#c2cfca"
      />

      <stop
        offset="1"
        stop-color="#879792"
      />
    </linearGradient>

    <linearGradient
      id="painel-escuro"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#526763"
      />

      <stop
        offset="0.5"
        stop-color="#314743"
      />

      <stop
        offset="1"
        stop-color="#172724"
      />
    </linearGradient>

    <linearGradient
      id="faixa-laboratorio"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#54a69f"
      />

      <stop
        offset="0.5"
        stop-color="#297870"
      />

      <stop
        offset="1"
        stop-color="#155049"
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
        stop-color="#d9e1df"
      />

      <stop
        offset="0.48"
        stop-color="#8f9c99"
      />

      <stop
        offset="1"
        stop-color="#475350"
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
        stop-color="#485956"
      />

      <stop
        offset="0.5"
        stop-color="#293936"
      />

      <stop
        offset="1"
        stop-color="#101a18"
      />
    </linearGradient>

    <linearGradient
      id="porta-laboratorio"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#dce8e4"
      />

      <stop
        offset="0.5"
        stop-color="#a2b5af"
      />

      <stop
        offset="1"
        stop-color="#617671"
      />
    </linearGradient>

    <linearGradient
      id="porta-contencao"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#dd5b52"
      />

      <stop
        offset="0.5"
        stop-color="#9e302d"
      />

      <stop
        offset="1"
        stop-color="#501719"
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
        stop-color="#e5ffff"
        stop-opacity=".94"
      />

      <stop
        offset="0.48"
        stop-color="#83c8c4"
        stop-opacity=".72"
      />

      <stop
        offset="1"
        stop-color="#286b6a"
        stop-opacity=".86"
      />
    </linearGradient>

    <radialGradient
      id="luz-ciano"
      cx="50%"
      cy="50%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#d9ffff"
        stop-opacity="1"
      />

      <stop
        offset="0.42"
        stop-color="#55d4d1"
        stop-opacity=".75"
      />

      <stop
        offset="1"
        stop-color="#176264"
        stop-opacity="0"
      />
    </radialGradient>

    <pattern
      id="placas"
      width="72"
      height="72"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="72"
        height="72"
        fill="url(#painel-claro)"
      />

      <path
        d="M0 0H72V72H0Z"
        fill="none"
        stroke="#71807c"
        stroke-width="4"
        opacity=".58"
      />

      <circle
        cx="9"
        cy="9"
        r="4"
        fill="#dce5e2"
        stroke="#53615e"
        stroke-width="2"
      />

      <circle
        cx="63"
        cy="63"
        r="4"
        fill="#dce5e2"
        stroke="#53615e"
        stroke-width="2"
      />
    </pattern>

    <pattern
      id="faixa-perigo"
      width="64"
      height="64"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <rect
        width="32"
        height="64"
        fill="#d7b33d"
      />

      <rect
        x="32"
        width="32"
        height="64"
        fill="#202827"
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
        flood-opacity=".56"
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
        seed="57"
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
          tableValues="0 .12"
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
            fill="#263633"
          />

          <rect
            x="29"
            y="183"
            width="454"
            height="146"
            rx="9"
            fill="url(#painel-claro)"
            stroke="#52625e"
            stroke-width="10"
            filter="url(#textura)"
          />

          <rect
            x="43"
            y="197"
            width="426"
            height="54"
            rx="4"
            fill="#dfe8e4"
            stroke="#7e8c88"
            stroke-width="5"
          />

          <rect
            x="43"
            y="251"
            width="426"
            height="62"
            rx="4"
            fill="url(#faixa-laboratorio)"
            stroke="#174c47"
            stroke-width="5"
          />

          <path
            d="M47 205H465"
            stroke="#ffffff"
            stroke-width="7"
            opacity=".48"
          />

          <path
            d="M47 259H465"
            stroke="#95d3cd"
            stroke-width="6"
            opacity=".43"
          />

          <path
            d="M75 219H159M186 219H275M302 219H437"
            stroke="#aeb9b5"
            stroke-width="6"
            stroke-linecap="round"
            opacity=".42"
          />

          <path
            d="M73 288H169M197 288H283M311 288H439"
            stroke="#0c403a"
            stroke-width="7"
            stroke-linecap="round"
            opacity=".5"
          />

          <g
            fill="#b9c2bf"
            stroke="#3b4845"
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
            fill="#263633"
          />

          <rect
            x="29"
            y="183"
            width="454"
            height="146"
            rx="9"
            fill="url(#painel-claro)"
            stroke="#52625e"
            stroke-width="10"
            filter="url(#textura)"
          />

          <rect
            x="43"
            y="197"
            width="426"
            height="54"
            rx="4"
            fill="#dfe8e4"
            stroke="#7e8c88"
            stroke-width="5"
          />

          <rect
            x="43"
            y="251"
            width="426"
            height="62"
            rx="4"
            fill="url(#faixa-laboratorio)"
            stroke="#174c47"
            stroke-width="5"
          />

          <path
            d="M47 205H465"
            stroke="#ffffff"
            stroke-width="7"
            opacity=".48"
          />

          <path
            d="M47 259H465"
            stroke="#95d3cd"
            stroke-width="6"
            opacity=".43"
          />

          <path
            d="M75 219H159M186 219H275M302 219H437"
            stroke="#aeb9b5"
            stroke-width="6"
            stroke-linecap="round"
            opacity=".42"
          />

          <path
            d="M73 288H169M197 288H283M311 288H439"
            stroke="#0c403a"
            stroke-width="7"
            stroke-linecap="round"
            opacity=".5"
          />

          <g
            fill="#b9c2bf"
            stroke="#3b4845"
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
            fill="#263633"
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
            fill="url(#painel-claro)"
            stroke="#52625e"
            stroke-width="13"
            filter="url(#textura)"
          />

          <path
            d="M91 112H260V250H399"
            fill="none"
            stroke="#f2f7f4"
            stroke-width="17"
            opacity=".46"
          />

          <path
            d="M89 180H220V311H359V416"
            fill="none"
            stroke="url(#faixa-laboratorio)"
            stroke-width="42"
          />

          <path
            d="M92 174H226V305H365"
            fill="none"
            stroke="#8ed0c9"
            stroke-width="6"
            opacity=".44"
          />

          <g
            fill="#b9c2bf"
            stroke="#3b4845"
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
            fill="#263633"
          />

          <rect
            x="79"
            y="140"
            width="354"
            height="232"
            rx="14"
            fill="url(#porta-laboratorio)"
            stroke="#425450"
            stroke-width="15"
            filter="url(#textura)"
          />

          <rect
            x="101"
            y="161"
            width="310"
            height="92"
            rx="9"
            fill="url(#vidro)"
            stroke="#315c59"
            stroke-width="11"
          />

          <path
            d="M179 163V251M256 163V251M333 163V251"
            stroke="#53827e"
            stroke-width="8"
          />

          <rect
            x="103"
            y="275"
            width="306"
            height="72"
            rx="8"
            fill="url(#metal)"
            stroke="#455350"
            stroke-width="10"
          />

          <path
            d="M124 294H388M124 328H388"
            stroke="#b8c3bf"
            stroke-width="6"
            opacity=".45"
          />

          <circle
            cx="366"
            cy="309"
            r="17"
            fill="#5dd5ce"
            stroke="#153f3d"
            stroke-width="7"
          />

          <circle
            cx="366"
            cy="309"
            r="33"
            fill="url(#luz-ciano)"
            opacity=".42"
          />

          <rect
            x="96"
            y="108"
            width="320"
            height="40"
            rx="9"
            fill="url(#painel-escuro)"
            stroke="#263633"
            stroke-width="8"
          />

          <rect
            x="183"
            y="112"
            width="146"
            height="30"
            rx="7"
            fill="#e3efeb"
            stroke="#3c625d"
            stroke-width="5"
          />

          <path
            d="M206 126H306"
            stroke="#27857d"
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
            fill="#263633"
          />

          <rect
            x="89"
            y="128"
            width="334"
            height="256"
            rx="13"
            fill="#0c1513"
            stroke="#70807c"
            stroke-width="13"
          />

          <rect
            x="94"
            y="148"
            width="95"
            height="218"
            rx="10"
            fill="url(#porta-laboratorio)"
            stroke="#3d514d"
            stroke-width="11"
            transform="rotate(-20 94 148)"
          />

          <rect
            x="323"
            y="148"
            width="95"
            height="218"
            rx="10"
            fill="url(#porta-laboratorio)"
            stroke="#3d514d"
            stroke-width="11"
            transform="rotate(20 418 148)"
          />

          <path
            d="M191 162H321V348H191Z"
            fill="#040807"
            stroke="#536560"
            stroke-width="10"
            stroke-dasharray="22 15"
          />

          <path
            d="M205 177H307V334H205Z"
            fill="#010302"
            opacity=".96"
          />

          <path
            d="M214 194H298M214 317H298"
            stroke="#67a39d"
            stroke-width="7"
            opacity=".3"
          />

          <rect
            x="96"
            y="99"
            width="320"
            height="42"
            rx="9"
            fill="url(#painel-escuro)"
            stroke="#263633"
            stroke-width="8"
          />

          <rect
            x="183"
            y="104"
            width="146"
            height="30"
            rx="7"
            fill="#e3efeb"
            stroke="#3c625d"
            stroke-width="5"
          />

          <path
            d="M206 119H306"
            stroke="#27857d"
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
            fill="#263633"
          />

          <rect
            x="79"
            y="140"
            width="354"
            height="232"
            rx="14"
            fill="url(#porta-contencao)"
            stroke="#491719"
            stroke-width="15"
            filter="url(#textura)"
          />

          <rect
            x="103"
            y="162"
            width="306"
            height="70"
            rx="8"
            fill="url(#vidro)"
            stroke="#3e5f5c"
            stroke-width="10"
          />

          <path
            d="M179 164V230M256 164V230M333 164V230"
            stroke="#5d8581"
            stroke-width="8"
          />

          <rect
            x="100"
            y="248"
            width="312"
            height="96"
            rx="9"
            fill="url(#faixa-perigo)"
            opacity=".8"
            stroke="#451516"
            stroke-width="10"
          />

          <circle
            cx="256"
            cy="292"
            r="57"
            fill="#3c1618"
            stroke="#d0d5d2"
            stroke-width="10"
          />

          <circle
            cx="256"
            cy="292"
            r="17"
            fill="#d6c65e"
            stroke="#322d10"
            stroke-width="7"
          />

          <path
            d="M256 246V269M219 313L239 301M293 313L273 301"
            stroke="#d0d5d2"
            stroke-width="10"
            stroke-linecap="round"
          />

          <path
            d="M232 258C246 245 266 245 280 258"
            fill="none"
            stroke="#d0d5d2"
            stroke-width="10"
            stroke-linecap="round"
          />

          <rect
            x="96"
            y="108"
            width="320"
            height="40"
            rx="9"
            fill="url(#painel-escuro)"
            stroke="#263633"
            stroke-width="8"
          />

          <rect
            x="166"
            y="112"
            width="180"
            height="30"
            rx="7"
            fill="#edd8d7"
            stroke="#7a2928"
            stroke-width="5"
          />

          <path
            d="M191 126H321"
            stroke="#a62f2c"
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
            fill="#263633"
          />

          <rect
            x="60"
            y="173"
            width="392"
            height="166"
            rx="10"
            fill="url(#painel-claro)"
            stroke="#52625e"
            stroke-width="13"
            filter="url(#textura)"
          />

          <rect
            x="74"
            y="187"
            width="364"
            height="54"
            rx="4"
            fill="#dfe8e4"
            stroke="#7e8c88"
            stroke-width="5"
          />

          <rect
            x="74"
            y="241"
            width="364"
            height="82"
            rx="4"
            fill="url(#faixa-laboratorio)"
            stroke="#174c47"
            stroke-width="5"
          />

          <path
            d="M78 195H434"
            stroke="#ffffff"
            stroke-width="7"
            opacity=".47"
          />

          <path
            d="M256 177V335"
            stroke="#354743"
            stroke-width="7"
            opacity=".3"
          />

          <path
            d="M244 210H268M244 286H268"
            stroke="#637671"
            stroke-width="5"
            stroke-linecap="round"
            opacity=".24"
          />

          <circle
            cx="256"
            cy="267"
            r="8"
            fill="#64a29c"
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
      "Paredes e portas do Laboratório concluídas.",
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
      "Não foi possível gerar as paredes e portas do Laboratório.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);