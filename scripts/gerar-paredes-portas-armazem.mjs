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

const PASTA_ARMAZEM =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "armazem",
  );

const PASTA_PAREDES =
  path.join(
    PASTA_ARMAZEM,
    "paredes",
  );

const PASTA_PORTAS =
  path.join(
    PASTA_ARMAZEM,
    "portas",
  );

function criarSvg({
  conteudo,
  viewBox = "0 0 512 512",
}) {
  return `<svg
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
        stop-color="#8d918b"
      />

      <stop
        offset="0.45"
        stop-color="#515650"
      />

      <stop
        offset="1"
        stop-color="#282c29"
      />
    </linearGradient>

    <linearGradient
      id="metal-claro"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#b9bcb4"
      />

      <stop
        offset="0.5"
        stop-color="#777c75"
      />

      <stop
        offset="1"
        stop-color="#474c47"
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
        stop-color="#414642"
      />

      <stop
        offset="1"
        stop-color="#1e2220"
      />
    </linearGradient>

    <linearGradient
      id="porta-amarela"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d7ae3d"
      />

      <stop
        offset="0.52"
        stop-color="#a87518"
      />

      <stop
        offset="1"
        stop-color="#5f420c"
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
        stop-color="#d84b43"
      />

      <stop
        offset="0.52"
        stop-color="#9e2622"
      />

      <stop
        offset="1"
        stop-color="#51100f"
      />
    </linearGradient>

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
        fill="#d6ad35"
      />

      <rect
        x="32"
        width="32"
        height="64"
        fill="#252825"
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
        flood-opacity="0.6"
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
        baseFrequency="0.025"
        numOctaves="3"
        seed="19"
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
          tableValues="0 0.16"
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
            y="174"
            width="476"
            height="164"
            rx="14"
            fill="#171a18"
          />

          <rect
            x="28"
            y="185"
            width="456"
            height="142"
            rx="9"
            fill="url(#metal-escuro)"
            stroke="#0d0f0e"
            stroke-width="10"
            filter="url(#textura)"
          />

          <rect
            x="44"
            y="201"
            width="424"
            height="110"
            rx="5"
            fill="url(#metal)"
            stroke="#555b55"
            stroke-width="7"
          />

          <g
            fill="#202421"
            stroke="#111311"
            stroke-width="5"
          >
            <rect
              x="67"
              y="215"
              width="72"
              height="82"
              rx="5"
            />

            <rect
              x="153"
              y="215"
              width="72"
              height="82"
              rx="5"
            />

            <rect
              x="239"
              y="215"
              width="72"
              height="82"
              rx="5"
            />

            <rect
              x="325"
              y="215"
              width="72"
              height="82"
              rx="5"
            />

            <rect
              x="411"
              y="215"
              width="34"
              height="82"
              rx="5"
            />
          </g>

          <path
            d="M42 202 H470"
            stroke="#b0b4aa"
            stroke-width="7"
            opacity="0.42"
          />

          <g
            fill="#b8b8a7"
            stroke="#242824"
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
              cy="206"
              r="8"
            />

            <circle
              cx="256"
              cy="306"
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
            y="174"
            width="476"
            height="164"
            rx="14"
            fill="#171a18"
          />

          <rect
            x="28"
            y="185"
            width="456"
            height="142"
            rx="9"
            fill="url(#metal-escuro)"
            stroke="#0d0f0e"
            stroke-width="10"
            filter="url(#textura)"
          />

          <rect
            x="44"
            y="201"
            width="424"
            height="110"
            rx="5"
            fill="url(#metal)"
            stroke="#555b55"
            stroke-width="7"
          />

          <g
            fill="#202421"
            stroke="#111311"
            stroke-width="5"
          >
            <rect
              x="67"
              y="215"
              width="72"
              height="82"
              rx="5"
            />

            <rect
              x="153"
              y="215"
              width="72"
              height="82"
              rx="5"
            />

            <rect
              x="239"
              y="215"
              width="72"
              height="82"
              rx="5"
            />

            <rect
              x="325"
              y="215"
              width="72"
              height="82"
              rx="5"
            />

            <rect
              x="411"
              y="215"
              width="34"
              height="82"
              rx="5"
            />
          </g>

          <path
            d="M42 202 H470"
            stroke="#b0b4aa"
            stroke-width="7"
            opacity="0.42"
          />

          <g
            fill="#b8b8a7"
            stroke="#242824"
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
              cy="206"
              r="8"
            />

            <circle
              cx="256"
              cy="306"
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
            fill="#171a18"
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
            fill="url(#metal)"
            stroke="#2a2e2b"
            stroke-width="13"
            filter="url(#textura)"
          />

          <path
            d="M94 115 H258 V253 H397"
            fill="none"
            stroke="#a6aaa1"
            stroke-width="13"
            opacity="0.42"
          />

          <path
            d="M90 184 H218 V312 H358 V414"
            fill="none"
            stroke="#202421"
            stroke-width="34"
          />

          <g
            fill="#b7b7a7"
            stroke="#242724"
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
            y="126"
            width="390"
            height="260"
            rx="22"
            fill="#171a18"
          />

          <rect
            x="79"
            y="145"
            width="354"
            height="222"
            rx="14"
            fill="url(#porta-amarela)"
            stroke="#3e2d0c"
            stroke-width="15"
            filter="url(#textura)"
          />

          <g
            fill="none"
            stroke="#704e0c"
            stroke-width="13"
          >
            <rect
              x="108"
              y="171"
              width="134"
              height="170"
              rx="9"
            />

            <rect
              x="270"
              y="171"
              width="134"
              height="170"
              rx="9"
            />
          </g>

          <line
            x1="256"
            y1="153"
            x2="256"
            y2="359"
            stroke="#30260f"
            stroke-width="18"
          />

          <g
            fill="url(#metal-claro)"
            stroke="#1b1e1c"
            stroke-width="7"
          >
            <circle
              cx="220"
              cy="261"
              r="17"
            />

            <circle
              cx="292"
              cy="261"
              r="17"
            />
          </g>

          <rect
            x="97"
            y="113"
            width="318"
            height="36"
            rx="9"
            fill="url(#metal)"
            stroke="#161917"
            stroke-width="8"
          />
        </g>
      `,
    }),

  "porta-aberta.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="67"
            y="110"
            width="378"
            height="292"
            rx="22"
            fill="#151817"
          />

          <rect
            x="89"
            y="132"
            width="334"
            height="248"
            rx="13"
            fill="#222725"
            stroke="#4f554f"
            stroke-width="13"
          />

          <rect
            x="102"
            y="155"
            width="70"
            height="202"
            rx="9"
            fill="url(#porta-amarela)"
            stroke="#46330e"
            stroke-width="11"
            transform="rotate(-19 102 155)"
          />

          <rect
            x="340"
            y="155"
            width="70"
            height="202"
            rx="9"
            fill="url(#porta-amarela)"
            stroke="#46330e"
            stroke-width="11"
            transform="rotate(19 410 155)"
          />

          <path
            d="M185 164 H327 V348 H185 Z"
            fill="#101312"
            stroke="#5a625b"
            stroke-width="10"
            stroke-dasharray="22 15"
          />

          <path
            d="M199 177 H313 V335 H199 Z"
            fill="#080a09"
            opacity="0.92"
          />

          <rect
            x="95"
            y="102"
            width="322"
            height="38"
            rx="9"
            fill="url(#metal)"
            stroke="#151817"
            stroke-width="8"
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
            y="126"
            width="390"
            height="260"
            rx="22"
            fill="#171a18"
          />

          <rect
            x="79"
            y="145"
            width="354"
            height="222"
            rx="14"
            fill="url(#porta-vermelha)"
            stroke="#471110"
            stroke-width="15"
            filter="url(#textura)"
          />

          <rect
            x="102"
            y="171"
            width="308"
            height="170"
            rx="9"
            fill="url(#faixa-perigo)"
            opacity="0.72"
            stroke="#32100e"
            stroke-width="10"
          />

          <rect
            x="206"
            y="207"
            width="100"
            height="105"
            rx="15"
            fill="url(#metal)"
            stroke="#151817"
            stroke-width="11"
          />

          <path
            d="M226 211 V184 C226 142 286 142 286 184 V211"
            fill="none"
            stroke="#bfc2b8"
            stroke-width="19"
            stroke-linecap="round"
          />

          <circle
            cx="256"
            cy="254"
            r="16"
            fill="#d6c65e"
            stroke="#322d10"
            stroke-width="7"
          />

          <path
            d="M256 270 V291"
            stroke="#25271f"
            stroke-width="10"
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
            x="45"
            y="159"
            width="422"
            height="194"
            rx="15"
            fill="#171a18"
          />

          <rect
            x="61"
            y="175"
            width="390"
            height="162"
            rx="10"
            fill="url(#metal-escuro)"
            stroke="#292e2a"
            stroke-width="13"
            filter="url(#textura)"
          />

          <g
            fill="#252a26"
            stroke="#111411"
            stroke-width="6"
          >
            <rect
              x="84"
              y="195"
              width="84"
              height="122"
              rx="5"
            />

            <rect
              x="177"
              y="195"
              width="84"
              height="122"
              rx="5"
            />

            <rect
              x="270"
              y="195"
              width="84"
              height="122"
              rx="5"
            />

            <rect
              x="363"
              y="195"
              width="65"
              height="122"
              rx="5"
            />
          </g>

          <path
            d="M256 182 V330"
            stroke="#1a1d1b"
            stroke-width="8"
            opacity="0.7"
          />

          <circle
            cx="256"
            cy="257"
            r="9"
            fill="#6d726c"
            opacity="0.28"
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

  if (resultado.stdout) {
    console.log(
      resultado.stdout.trim(),
    );
  }

  if (resultado.stderr) {
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
      "Paredes e portas do Armazém concluídas.",
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
      "Não foi possível gerar as paredes e portas do Armazém.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);