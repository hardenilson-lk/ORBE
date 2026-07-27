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

const PASTA_INSTALACAO =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "instalacao-subterranea",
  );

const PASTA_PAREDES =
  path.join(
    PASTA_INSTALACAO,
    "paredes",
  );

const PASTA_PORTAS =
  path.join(
    PASTA_INSTALACAO,
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
      id="metal"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#8b9692"
      />

      <stop
        offset="0.45"
        stop-color="#56615d"
      />

      <stop
        offset="1"
        stop-color="#28312e"
      />
    </linearGradient>

    <linearGradient
      id="metal-claro"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#bcc4c0"
      />

      <stop
        offset="0.5"
        stop-color="#7c8782"
      />

      <stop
        offset="1"
        stop-color="#48514e"
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
        stop-color="#414b48"
      />

      <stop
        offset="0.5"
        stop-color="#242d2a"
      />

      <stop
        offset="1"
        stop-color="#0f1513"
      />
    </linearGradient>

    <linearGradient
      id="porta-blindada"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#798783"
      />

      <stop
        offset="0.5"
        stop-color="#45534f"
      />

      <stop
        offset="1"
        stop-color="#202a27"
      />
    </linearGradient>

    <linearGradient
      id="porta-alerta"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d7544c"
      />

      <stop
        offset="0.5"
        stop-color="#992d2a"
      />

      <stop
        offset="1"
        stop-color="#4b1415"
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
        stop-color="#d8ffff"
        stop-opacity=".9"
      />

      <stop
        offset="0.48"
        stop-color="#79b8b5"
        stop-opacity=".7"
      />

      <stop
        offset="1"
        stop-color="#2c6260"
        stop-opacity=".88"
      />
    </linearGradient>

    <radialGradient
      id="luz-verde"
      cx="50%"
      cy="50%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#c8ffd7"
        stop-opacity="1"
      />

      <stop
        offset="0.42"
        stop-color="#4ecf73"
        stop-opacity=".78"
      />

      <stop
        offset="1"
        stop-color="#125a2b"
        stop-opacity="0"
      />
    </radialGradient>

    <radialGradient
      id="luz-vermelha"
      cx="50%"
      cy="50%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#ffc0b3"
        stop-opacity="1"
      />

      <stop
        offset="0.42"
        stop-color="#e34d46"
        stop-opacity=".8"
      />

      <stop
        offset="1"
        stop-color="#681618"
        stop-opacity="0"
      />
    </radialGradient>

    <pattern
      id="placas-metalicas"
      width="96"
      height="96"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="96"
        height="96"
        fill="url(#metal)"
      />

      <path
        d="M0 0H96V96H0Z"
        fill="none"
        stroke="#1b2421"
        stroke-width="6"
        opacity=".8"
      />

      <path
        d="M13 13H83V83H13Z"
        fill="none"
        stroke="#7f8985"
        stroke-width="4"
        opacity=".42"
      />

      <circle
        cx="15"
        cy="15"
        r="5"
        fill="#a9b0ad"
        stroke="#252d2a"
        stroke-width="3"
      />

      <circle
        cx="81"
        cy="15"
        r="5"
        fill="#a9b0ad"
        stroke="#252d2a"
        stroke-width="3"
      />

      <circle
        cx="15"
        cy="81"
        r="5"
        fill="#a9b0ad"
        stroke="#252d2a"
        stroke-width="3"
      />

      <circle
        cx="81"
        cy="81"
        r="5"
        fill="#a9b0ad"
        stroke="#252d2a"
        stroke-width="3"
      />
    </pattern>

    <pattern
      id="faixa-perigo"
      width="72"
      height="72"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <rect
        width="36"
        height="72"
        fill="#d0a52e"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#202624"
      />
    </pattern>

    <pattern
      id="grade"
      width="44"
      height="44"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="44"
        height="44"
        fill="#111816"
      />

      <path
        d="M11 0V44M33 0V44"
        stroke="#75817d"
        stroke-width="7"
      />

      <path
        d="M0 11H44M0 33H44"
        stroke="#56615d"
        stroke-width="4"
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
        flood-opacity=".68"
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
        baseFrequency=".029"
        numOctaves="3"
        seed="83"
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
          tableValues="0 .16"
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
            rx="14"
            fill="#0d1311"
          />

          <rect
            x="29"
            y="180"
            width="454"
            height="152"
            rx="9"
            fill="url(#placas-metalicas)"
            stroke="#18211e"
            stroke-width="11"
            filter="url(#textura)"
          />

          <rect
            x="44"
            y="196"
            width="424"
            height="56"
            rx="5"
            fill="url(#metal-claro)"
            stroke="#39433f"
            stroke-width="6"
          />

          <rect
            x="44"
            y="252"
            width="424"
            height="64"
            rx="5"
            fill="url(#faixa-perigo)"
            stroke="#161c1a"
            stroke-width="6"
          />

          <path
            d="M49 204H463"
            stroke="#d5dcd8"
            stroke-width="7"
            opacity=".38"
          />

          <path
            d="M49 259H463"
            stroke="#f0c94c"
            stroke-width="7"
            opacity=".4"
          />

          <path
            d="M75 219H165M192 219H279M306 219H437"
            stroke="#68736f"
            stroke-width="7"
            stroke-linecap="round"
            opacity=".48"
          />

          <path
            d="M73 288H169M197 288H283M311 288H439"
            stroke="#171d1b"
            stroke-width="8"
            stroke-linecap="round"
            opacity=".65"
          />

          <g
            fill="#a1a9a5"
            stroke="#252d2a"
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
            fill="#0d1311"
          />

          <rect
            x="29"
            y="180"
            width="454"
            height="152"
            rx="9"
            fill="url(#placas-metalicas)"
            stroke="#18211e"
            stroke-width="11"
            filter="url(#textura)"
          />

          <rect
            x="44"
            y="196"
            width="424"
            height="56"
            rx="5"
            fill="url(#metal-claro)"
            stroke="#39433f"
            stroke-width="6"
          />

          <rect
            x="44"
            y="252"
            width="424"
            height="64"
            rx="5"
            fill="url(#faixa-perigo)"
            stroke="#161c1a"
            stroke-width="6"
          />

          <path
            d="M49 204H463"
            stroke="#d5dcd8"
            stroke-width="7"
            opacity=".38"
          />

          <path
            d="M49 259H463"
            stroke="#f0c94c"
            stroke-width="7"
            opacity=".4"
          />

          <path
            d="M75 219H165M192 219H279M306 219H437"
            stroke="#68736f"
            stroke-width="7"
            stroke-linecap="round"
            opacity=".48"
          />

          <path
            d="M73 288H169M197 288H283M311 288H439"
            stroke="#171d1b"
            stroke-width="8"
            stroke-linecap="round"
            opacity=".65"
          />

          <g
            fill="#a1a9a5"
            stroke="#252d2a"
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
            fill="#0d1311"
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
            fill="url(#placas-metalicas)"
            stroke="#18211e"
            stroke-width="13"
            filter="url(#textura)"
          />

          <path
            d="M91 112H260V250H399"
            fill="none"
            stroke="#aeb7b3"
            stroke-width="18"
            opacity=".4"
          />

          <path
            d="M89 180H220V311H359V416"
            fill="none"
            stroke="url(#faixa-perigo)"
            stroke-width="44"
          />

          <path
            d="M92 173H227V304H366"
            fill="none"
            stroke="#e0bd3b"
            stroke-width="7"
            opacity=".56"
          />

          <g
            fill="#a1a9a5"
            stroke="#252d2a"
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
            fill="#0c1210"
          />

          <rect
            x="75"
            y="135"
            width="362"
            height="242"
            rx="15"
            fill="url(#porta-blindada)"
            stroke="#1d2825"
            stroke-width="16"
            filter="url(#textura)"
          />

          <rect
            x="102"
            y="159"
            width="308"
            height="77"
            rx="8"
            fill="url(#vidro)"
            stroke="#355956"
            stroke-width="11"
          />

          <path
            d="M179 161V234M256 161V234M333 161V234"
            stroke="#587875"
            stroke-width="8"
          />

          <rect
            x="102"
            y="259"
            width="308"
            height="91"
            rx="9"
            fill="url(#metal-escuro)"
            stroke="#131a18"
            stroke-width="11"
          />

          <path
            d="M127 281H385M127 326H385"
            stroke="#65716d"
            stroke-width="7"
            opacity=".5"
          />

          <circle
            cx="363"
            cy="304"
            r="18"
            fill="#4bd36f"
            stroke="#174426"
            stroke-width="7"
          />

          <circle
            cx="363"
            cy="304"
            r="39"
            fill="url(#luz-verde)"
            opacity=".44"
          />

          <rect
            x="91"
            y="101"
            width="330"
            height="45"
            rx="10"
            fill="url(#metal-escuro)"
            stroke="#0c1210"
            stroke-width="9"
          />

          <rect
            x="175"
            y="107"
            width="162"
            height="32"
            rx="7"
            fill="#bbc5c1"
            stroke="#394642"
            stroke-width="5"
          />

          <path
            d="M198 123H314"
            stroke="#d1a72f"
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
            fill="#0c1210"
          />

          <rect
            x="84"
            y="123"
            width="344"
            height="266"
            rx="14"
            fill="#050807"
            stroke="#4d5b57"
            stroke-width="14"
          />

          <rect
            x="86"
            y="144"
            width="108"
            height="228"
            rx="12"
            fill="url(#porta-blindada)"
            stroke="#1e2926"
            stroke-width="12"
            transform="rotate(-21 86 144)"
          />

          <rect
            x="318"
            y="144"
            width="108"
            height="228"
            rx="12"
            fill="url(#porta-blindada)"
            stroke="#1e2926"
            stroke-width="12"
            transform="rotate(21 426 144)"
          />

          <path
            d="M190 159H322V352H190Z"
            fill="#010202"
            stroke="#45534f"
            stroke-width="11"
            stroke-dasharray="24 15"
          />

          <path
            d="M207 177H305V334H207Z"
            fill="#000000"
            opacity=".97"
          />

          <path
            d="M218 195H294M218 317H294"
            stroke="#647f78"
            stroke-width="7"
            opacity=".3"
          />

          <rect
            x="91"
            y="93"
            width="330"
            height="45"
            rx="10"
            fill="url(#metal-escuro)"
            stroke="#0c1210"
            stroke-width="9"
          />

          <rect
            x="175"
            y="100"
            width="162"
            height="31"
            rx="7"
            fill="#bbc5c1"
            stroke="#394642"
            stroke-width="5"
          />

          <path
            d="M198 116H314"
            stroke="#d1a72f"
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
            fill="#0c1210"
          />

          <rect
            x="75"
            y="135"
            width="362"
            height="242"
            rx="15"
            fill="url(#porta-alerta)"
            stroke="#451416"
            stroke-width="16"
            filter="url(#textura)"
          />

          <rect
            x="101"
            y="159"
            width="310"
            height="72"
            rx="8"
            fill="url(#grade)"
            stroke="#1c2522"
            stroke-width="11"
          />

          <rect
            x="99"
            y="250"
            width="314"
            height="101"
            rx="9"
            fill="url(#faixa-perigo)"
            opacity=".82"
            stroke="#411416"
            stroke-width="11"
          />

          <circle
            cx="256"
            cy="295"
            r="63"
            fill="#241719"
            stroke="#aab2ae"
            stroke-width="11"
          />

          <circle
            cx="256"
            cy="295"
            r="23"
            fill="#d6c551"
            stroke="#39320f"
            stroke-width="8"
          />

          <path
            d="M256 242V268M211 318L234 304M301 318L278 304"
            stroke="#c4cbc7"
            stroke-width="11"
            stroke-linecap="round"
          />

          <path
            d="M226 259C244 240 268 240 286 259"
            fill="none"
            stroke="#c4cbc7"
            stroke-width="11"
            stroke-linecap="round"
          />

          <circle
            cx="374"
            cy="180"
            r="18"
            fill="#e04740"
            stroke="#541616"
            stroke-width="7"
          />

          <circle
            cx="374"
            cy="180"
            r="40"
            fill="url(#luz-vermelha)"
            opacity=".5"
          />

          <rect
            x="91"
            y="101"
            width="330"
            height="45"
            rx="10"
            fill="url(#metal-escuro)"
            stroke="#0c1210"
            stroke-width="9"
          />

          <rect
            x="165"
            y="107"
            width="182"
            height="32"
            rx="7"
            fill="#e0c8c7"
            stroke="#692222"
            stroke-width="5"
          />

          <path
            d="M190 123H322"
            stroke="#a42f2c"
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
            fill="#0d1311"
          />

          <rect
            x="59"
            y="171"
            width="394"
            height="170"
            rx="11"
            fill="url(#placas-metalicas)"
            stroke="#18211e"
            stroke-width="14"
            filter="url(#textura)"
          />

          <rect
            x="74"
            y="187"
            width="364"
            height="55"
            rx="5"
            fill="url(#metal-claro)"
            stroke="#39433f"
            stroke-width="6"
          />

          <rect
            x="74"
            y="242"
            width="364"
            height="83"
            rx="5"
            fill="url(#faixa-perigo)"
            stroke="#161c1a"
            stroke-width="6"
          />

          <path
            d="M79 195H433"
            stroke="#d5dcd8"
            stroke-width="7"
            opacity=".38"
          />

          <path
            d="M256 175V337"
            stroke="#202926"
            stroke-width="8"
            opacity=".35"
          />

          <path
            d="M244 214H268M244 291H268"
            stroke="#69736f"
            stroke-width="5"
            stroke-linecap="round"
            opacity=".26"
          />

          <circle
            cx="256"
            cy="278"
            r="9"
            fill="#a9b0ad"
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
      "Paredes e portas da Instalação Subterrânea concluídas.",
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
      "Não foi possível gerar as paredes e portas da Instalação Subterrânea.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);