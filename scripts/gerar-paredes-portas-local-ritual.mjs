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

const PASTA_LOCAL_RITUAL =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "local-ritual",
  );

const PASTA_PAREDES =
  path.join(
    PASTA_LOCAL_RITUAL,
    "paredes",
  );

const PASTA_PORTAS =
  path.join(
    PASTA_LOCAL_RITUAL,
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
      id="pedra"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#62595f"
      />

      <stop
        offset="0.48"
        stop-color="#3c343b"
      />

      <stop
        offset="1"
        stop-color="#1b171c"
      />
    </linearGradient>

    <linearGradient
      id="pedra-clara"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#8c8188"
      />

      <stop
        offset="0.5"
        stop-color="#5d5159"
      />

      <stop
        offset="1"
        stop-color="#302931"
      />
    </linearGradient>

    <linearGradient
      id="pedra-escura"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#2b232b"
      />

      <stop
        offset="0.5"
        stop-color="#171219"
      />

      <stop
        offset="1"
        stop-color="#080609"
      />
    </linearGradient>

    <linearGradient
      id="energia-roxa"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d784ee"
      />

      <stop
        offset="0.48"
        stop-color="#8b3aaa"
      />

      <stop
        offset="1"
        stop-color="#421453"
      />
    </linearGradient>

    <linearGradient
      id="energia-vermelha"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#e45b70"
      />

      <stop
        offset="0.5"
        stop-color="#9f263e"
      />

      <stop
        offset="1"
        stop-color="#4a0e1d"
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
        stop-color="#b7aeb4"
      />

      <stop
        offset="0.48"
        stop-color="#756b72"
      />

      <stop
        offset="1"
        stop-color="#3b343b"
      />
    </linearGradient>

    <radialGradient
      id="brilho-roxo"
      cx="50%"
      cy="50%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#f3b4ff"
        stop-opacity="1"
      />

      <stop
        offset="0.38"
        stop-color="#be5be0"
        stop-opacity=".82"
      />

      <stop
        offset="1"
        stop-color="#531568"
        stop-opacity="0"
      />
    </radialGradient>

    <radialGradient
      id="brilho-vermelho"
      cx="50%"
      cy="50%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#ffb1a9"
        stop-opacity="1"
      />

      <stop
        offset="0.4"
        stop-color="#e04658"
        stop-opacity=".82"
      />

      <stop
        offset="1"
        stop-color="#681221"
        stop-opacity="0"
      />
    </radialGradient>

    <pattern
      id="blocos-pedra"
      width="128"
      height="96"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="96"
        fill="url(#pedra)"
      />

      <path
        d="M0 0H128V96H0Z"
        fill="none"
        stroke="#130f14"
        stroke-width="7"
        opacity=".86"
      />

      <path
        d="M64 0V96M0 48H128"
        stroke="#756a72"
        stroke-width="4"
        opacity=".34"
      />

      <path
        d="M14 18C31 7 47 28 64 16C82 5 97 26 115 15"
        fill="none"
        stroke="#91858d"
        stroke-width="4"
        stroke-linecap="round"
        opacity=".22"
      />

      <path
        d="M13 76C30 64 47 84 65 72C82 61 99 82 115 70"
        fill="none"
        stroke="#1b151c"
        stroke-width="5"
        stroke-linecap="round"
        opacity=".4"
      />

      <circle
        cx="15"
        cy="15"
        r="5"
        fill="#827780"
        stroke="#292229"
        stroke-width="3"
      />

      <circle
        cx="113"
        cy="81"
        r="5"
        fill="#827780"
        stroke="#292229"
        stroke-width="3"
      />
    </pattern>

    <pattern
      id="simbolos"
      width="112"
      height="112"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="112"
        height="112"
        fill="url(#pedra-escura)"
      />

      <circle
        cx="56"
        cy="56"
        r="34"
        fill="none"
        stroke="#8f3daa"
        stroke-width="6"
        opacity=".56"
      />

      <path
        d="M56 18L66 45L95 47L72 65L80 94L56 78L32 94L40 65L17 47L46 45Z"
        fill="none"
        stroke="#b6476c"
        stroke-width="6"
        stroke-linejoin="round"
        opacity=".58"
      />

      <circle
        cx="56"
        cy="56"
        r="8"
        fill="#c465d7"
        opacity=".5"
      />
    </pattern>

    <pattern
      id="faixa-ritual"
      width="72"
      height="72"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <rect
        width="36"
        height="72"
        fill="#8e2948"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#25131f"
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
        flood-opacity=".72"
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
        baseFrequency=".032"
        numOctaves="3"
        seed="97"
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
          tableValues="0 .18"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="ruido-suave"
        mode="multiply"
      />
    </filter>

    <filter
      id="brilho"
      x="-40%"
      y="-40%"
      width="180%"
      height="180%"
    >
      <feGaussianBlur
        stdDeviation="8"
        result="desfoque"
      />

      <feMerge>
        <feMergeNode
          in="desfoque"
        />

        <feMergeNode
          in="SourceGraphic"
        />
      </feMerge>
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
            rx="14"
            fill="#09070a"
          />

          <rect
            x="29"
            y="180"
            width="454"
            height="152"
            rx="9"
            fill="url(#blocos-pedra)"
            stroke="#171218"
            stroke-width="11"
            filter="url(#textura)"
          />

          <rect
            x="44"
            y="196"
            width="424"
            height="58"
            rx="5"
            fill="url(#pedra-clara)"
            stroke="#3d333d"
            stroke-width="6"
          />

          <rect
            x="44"
            y="254"
            width="424"
            height="62"
            rx="5"
            fill="url(#simbolos)"
            stroke="#160b18"
            stroke-width="6"
          />

          <path
            d="M49 204H463"
            stroke="#b6a8b2"
            stroke-width="7"
            opacity=".35"
          />

          <path
            d="M49 261H463"
            stroke="url(#energia-roxa)"
            stroke-width="8"
            opacity=".68"
          />

          <path
            d="M70 224C103 198 136 244 169 218C202 192 235 240 268 216C301 192 334 240 367 216C392 198 416 217 440 226"
            fill="none"
            stroke="#4c3e49"
            stroke-width="7"
            opacity=".58"
          />

          <path
            d="M76 287H169M196 287H282M309 287H438"
            stroke="#561b62"
            stroke-width="8"
            stroke-linecap="round"
            opacity=".62"
          />

          <g
            fill="url(#energia-roxa)"
            stroke="#28112d"
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
            rx="14"
            fill="#09070a"
          />

          <rect
            x="29"
            y="180"
            width="454"
            height="152"
            rx="9"
            fill="url(#blocos-pedra)"
            stroke="#171218"
            stroke-width="11"
            filter="url(#textura)"
          />

          <rect
            x="44"
            y="196"
            width="424"
            height="58"
            rx="5"
            fill="url(#pedra-clara)"
            stroke="#3d333d"
            stroke-width="6"
          />

          <rect
            x="44"
            y="254"
            width="424"
            height="62"
            rx="5"
            fill="url(#simbolos)"
            stroke="#160b18"
            stroke-width="6"
          />

          <path
            d="M49 204H463"
            stroke="#b6a8b2"
            stroke-width="7"
            opacity=".35"
          />

          <path
            d="M49 261H463"
            stroke="url(#energia-roxa)"
            stroke-width="8"
            opacity=".68"
          />

          <path
            d="M70 224C103 198 136 244 169 218C202 192 235 240 268 216C301 192 334 240 367 216C392 198 416 217 440 226"
            fill="none"
            stroke="#4c3e49"
            stroke-width="7"
            opacity=".58"
          />

          <path
            d="M76 287H169M196 287H282M309 287H438"
            stroke="#561b62"
            stroke-width="8"
            stroke-linecap="round"
            opacity=".62"
          />

          <g
            fill="url(#energia-roxa)"
            stroke="#28112d"
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
            fill="#09070a"
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
            fill="url(#blocos-pedra)"
            stroke="#171218"
            stroke-width="13"
            filter="url(#textura)"
          />

          <path
            d="M91 112H260V250H399"
            fill="none"
            stroke="#a99da5"
            stroke-width="18"
            opacity=".36"
          />

          <path
            d="M89 180H220V311H359V416"
            fill="none"
            stroke="url(#simbolos)"
            stroke-width="44"
          />

          <path
            d="M92 173H227V304H366"
            fill="none"
            stroke="url(#energia-roxa)"
            stroke-width="8"
            opacity=".74"
          />

          <g
            fill="url(#energia-vermelha)"
            stroke="#36101c"
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
            x="55"
            y="114"
            width="402"
            height="284"
            rx="24"
            fill="#080609"
          />

          <rect
            x="75"
            y="135"
            width="362"
            height="242"
            rx="15"
            fill="url(#pedra)"
            stroke="#211923"
            stroke-width="16"
            filter="url(#textura)"
          />

          <rect
            x="101"
            y="159"
            width="310"
            height="191"
            rx="10"
            fill="url(#simbolos)"
            stroke="#32183a"
            stroke-width="11"
          />

          <circle
            cx="256"
            cy="254"
            r="73"
            fill="none"
            stroke="url(#energia-roxa)"
            stroke-width="12"
            opacity=".82"
            filter="url(#brilho)"
          />

          <circle
            cx="256"
            cy="254"
            r="47"
            fill="none"
            stroke="url(#energia-vermelha)"
            stroke-width="9"
            stroke-dasharray="20 12"
            opacity=".78"
          />

          <path
            d="M256 179L274 229L327 232L285 265L298 316L256 287L214 316L227 265L185 232L238 229Z"
            fill="none"
            stroke="#b64e79"
            stroke-width="10"
            stroke-linejoin="round"
          />

          <circle
            cx="256"
            cy="254"
            r="13"
            fill="#db75e8"
            stroke="#42134d"
            stroke-width="7"
          />

          <circle
            cx="256"
            cy="254"
            r="39"
            fill="url(#brilho-roxo)"
            opacity=".42"
          />

          <rect
            x="91"
            y="101"
            width="330"
            height="45"
            rx="10"
            fill="url(#pedra-escura)"
            stroke="#080609"
            stroke-width="9"
          />

          <path
            d="M126 123H386"
            stroke="url(#energia-roxa)"
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
            x="60"
            y="99"
            width="392"
            height="314"
            rx="24"
            fill="#080609"
          />

          <rect
            x="84"
            y="123"
            width="344"
            height="266"
            rx="14"
            fill="#020102"
            stroke="#4d3b50"
            stroke-width="14"
          />

          <rect
            x="86"
            y="144"
            width="108"
            height="228"
            rx="12"
            fill="url(#pedra)"
            stroke="#211923"
            stroke-width="12"
            transform="rotate(-21 86 144)"
          />

          <rect
            x="318"
            y="144"
            width="108"
            height="228"
            rx="12"
            fill="url(#pedra)"
            stroke="#211923"
            stroke-width="12"
            transform="rotate(21 426 144)"
          />

          <path
            d="M190 159H322V352H190Z"
            fill="#000000"
            stroke="#4b2854"
            stroke-width="11"
            stroke-dasharray="24 15"
          />

          <path
            d="M207 177H305V334H207Z"
            fill="#000000"
            opacity=".98"
          />

          <circle
            cx="256"
            cy="256"
            r="91"
            fill="url(#brilho-roxo)"
            opacity=".28"
          />

          <path
            d="M216 197C242 173 270 173 296 197M216 315C242 339 270 339 296 315"
            fill="none"
            stroke="#a550bd"
            stroke-width="8"
            opacity=".46"
          />

          <path
            d="M256 188V324"
            stroke="#cf617f"
            stroke-width="6"
            stroke-dasharray="20 13"
            opacity=".38"
          />

          <rect
            x="91"
            y="93"
            width="330"
            height="45"
            rx="10"
            fill="url(#pedra-escura)"
            stroke="#080609"
            stroke-width="9"
          />

          <path
            d="M126 116H386"
            stroke="url(#energia-roxa)"
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
            x="55"
            y="114"
            width="402"
            height="284"
            rx="24"
            fill="#080609"
          />

          <rect
            x="75"
            y="135"
            width="362"
            height="242"
            rx="15"
            fill="url(#energia-vermelha)"
            stroke="#48101e"
            stroke-width="16"
            filter="url(#textura)"
          />

          <rect
            x="100"
            y="159"
            width="312"
            height="191"
            rx="10"
            fill="url(#simbolos)"
            stroke="#280d2c"
            stroke-width="11"
          />

          <rect
            x="98"
            y="247"
            width="316"
            height="104"
            rx="9"
            fill="url(#faixa-ritual)"
            opacity=".72"
            stroke="#46101d"
            stroke-width="10"
          />

          <circle
            cx="256"
            cy="256"
            r="98"
            fill="url(#brilho-vermelho)"
            opacity=".42"
          />

          <circle
            cx="256"
            cy="256"
            r="74"
            fill="#1b0913"
            stroke="#d44762"
            stroke-width="13"
            filter="url(#brilho)"
          />

          <circle
            cx="256"
            cy="256"
            r="48"
            fill="none"
            stroke="#db78e9"
            stroke-width="9"
            stroke-dasharray="21 12"
          />

          <path
            d="M256 176L274 226L327 229L285 262L298 313L256 284L214 313L227 262L185 229L238 226Z"
            fill="none"
            stroke="#e3536e"
            stroke-width="11"
            stroke-linejoin="round"
          />

          <rect
            x="220"
            y="223"
            width="72"
            height="78"
            rx="13"
            fill="url(#metal)"
            stroke="#231b23"
            stroke-width="10"
          />

          <path
            d="M234 227V204C234 171 278 171 278 204V227"
            fill="none"
            stroke="#c5bac2"
            stroke-width="16"
            stroke-linecap="round"
          />

          <circle
            cx="256"
            cy="259"
            r="12"
            fill="#e45b70"
            stroke="#4d101d"
            stroke-width="6"
          />

          <path
            d="M256 271V288"
            stroke="#291720"
            stroke-width="8"
            stroke-linecap="round"
          />

          <rect
            x="91"
            y="101"
            width="330"
            height="45"
            rx="10"
            fill="url(#pedra-escura)"
            stroke="#080609"
            stroke-width="9"
          />

          <path
            d="M126 123H386"
            stroke="url(#energia-vermelha)"
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
            fill="#09070a"
          />

          <rect
            x="59"
            y="171"
            width="394"
            height="170"
            rx="11"
            fill="url(#blocos-pedra)"
            stroke="#171218"
            stroke-width="14"
            filter="url(#textura)"
          />

          <rect
            x="74"
            y="187"
            width="364"
            height="57"
            rx="5"
            fill="url(#pedra-clara)"
            stroke="#3d333d"
            stroke-width="6"
          />

          <rect
            x="74"
            y="244"
            width="364"
            height="81"
            rx="5"
            fill="url(#simbolos)"
            stroke="#160b18"
            stroke-width="6"
          />

          <path
            d="M79 195H433"
            stroke="#b6a8b2"
            stroke-width="7"
            opacity=".35"
          />

          <path
            d="M79 252H433"
            stroke="url(#energia-roxa)"
            stroke-width="8"
            opacity=".62"
          />

          <path
            d="M256 175V337"
            stroke="#281d29"
            stroke-width="8"
            opacity=".34"
          />

          <path
            d="M244 215H268M244 292H268"
            stroke="#6c5d68"
            stroke-width="5"
            stroke-linecap="round"
            opacity=".25"
          />

          <circle
            cx="256"
            cy="279"
            r="9"
            fill="#b94ac7"
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
      "Paredes e portas do Local de Ritual concluídas.",
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
      "Não foi possível gerar as paredes e portas do Local de Ritual.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);