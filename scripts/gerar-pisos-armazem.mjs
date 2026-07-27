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

const PASTA_PISOS =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "armazem",
    "pisos",
  );

function criarSvg({
  conteudo,
}) {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512 512"
  width="512"
  height="512"
>
  <defs>
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
        numOctaves="4"
        seed="21"
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
          tableValues="0 0.24"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="ruido-suave"
        mode="multiply"
      />
    </filter>

    <linearGradient
      id="concreto"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#8a887e"
      />

      <stop
        offset="0.48"
        stop-color="#74746e"
      />

      <stop
        offset="1"
        stop-color="#5f615d"
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
        stop-color="#686b66"
      />

      <stop
        offset="1"
        stop-color="#444945"
      />
    </linearGradient>

    <pattern
      id="faixa-industrial"
      width="72"
      height="72"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <rect
        width="36"
        height="72"
        fill="#d2a52e"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#292b29"
      />
    </pattern>
  </defs>

  ${conteudo}
</svg>
`;
}

const PISOS = {
  "piso-sala.svg": criarSvg({
    conteudo: `
      <rect
        width="512"
        height="512"
        fill="url(#concreto)"
        filter="url(#textura)"
      />

      <path
        d="M0 256 H512 M256 0 V512"
        fill="none"
        stroke="#4d504c"
        stroke-width="5"
        opacity="0.42"
      />

      <path
        d="M0 6 H512 M6 0 V512"
        fill="none"
        stroke="#b1aa91"
        stroke-width="5"
        opacity="0.2"
      />

      <g
        fill="#3f423f"
        opacity="0.16"
      >
        <circle
          cx="83"
          cy="102"
          r="18"
        />

        <circle
          cx="374"
          cy="81"
          r="10"
        />

        <circle
          cx="420"
          cy="349"
          r="21"
        />

        <circle
          cx="146"
          cy="403"
          r="13"
        />

        <circle
          cx="286"
          cy="298"
          r="8"
        />
      </g>

      <g
        fill="none"
        stroke="#4a4d49"
        stroke-linecap="round"
        opacity="0.28"
      >
        <path
          d="M61 181 C127 160 165 202 222 177"
          stroke-width="7"
        />

        <path
          d="M303 415 C354 385 398 430 459 398"
          stroke-width="6"
        />

        <path
          d="M308 144 L332 168 L319 194"
          stroke-width="5"
        />
      </g>
    `,
  }),

  "piso-corredor.svg": criarSvg({
    conteudo: `
      <rect
        width="512"
        height="512"
        fill="url(#concreto-escuro)"
        filter="url(#textura)"
      />

      <rect
        x="0"
        y="210"
        width="512"
        height="92"
        fill="#77776d"
        opacity="0.65"
      />

      <rect
        x="0"
        y="225"
        width="512"
        height="15"
        fill="#d0a83b"
        opacity="0.82"
      />

      <rect
        x="0"
        y="272"
        width="512"
        height="15"
        fill="#d0a83b"
        opacity="0.82"
      />

      <path
        d="M0 0 H512 V512 H0 Z"
        fill="none"
        stroke="#353936"
        stroke-width="12"
        opacity="0.35"
      />

      <g
        fill="#252826"
        opacity="0.22"
      >
        <circle
          cx="94"
          cy="116"
          r="17"
        />

        <circle
          cx="411"
          cy="377"
          r="23"
        />

        <circle
          cx="271"
          cy="74"
          r="11"
        />
      </g>
    `,
  }),

  "piso-especial.svg": criarSvg({
    conteudo: `
      <rect
        width="512"
        height="512"
        fill="#555955"
        filter="url(#textura)"
      />

      <rect
        x="0"
        y="0"
        width="512"
        height="72"
        fill="url(#faixa-industrial)"
        opacity="0.9"
      />

      <rect
        x="0"
        y="440"
        width="512"
        height="72"
        fill="url(#faixa-industrial)"
        opacity="0.9"
      />

      <rect
        x="48"
        y="105"
        width="416"
        height="302"
        rx="18"
        fill="#777a72"
        stroke="#333633"
        stroke-width="14"
      />

      <path
        d="M96 151 H416 V361 H96 Z"
        fill="none"
        stroke="#c6a43c"
        stroke-width="10"
        stroke-dasharray="35 22"
        opacity="0.85"
      />

      <g
        fill="#292c29"
        opacity="0.3"
      >
        <circle
          cx="150"
          cy="233"
          r="20"
        />

        <circle
          cx="359"
          cy="302"
          r="15"
        />

        <circle
          cx="278"
          cy="185"
          r="9"
        />
      </g>
    `,
  }),
};

async function gerarPisos() {
  await mkdir(
    PASTA_PISOS,
    {
      recursive: true,
    },
  );

  for (
    const [
      nomeArquivo,
      conteudo,
    ] of Object.entries(
      PISOS,
    )
  ) {
    const caminho =
      path.join(
        PASTA_PISOS,
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

  if (resultado.status !== 0) {
    throw new Error(
      "Os pisos foram criados, mas o manifesto não pôde ser atualizado.",
    );
  }

  console.log(
    [
      "",
      "Pisos do Armazém concluídos.",
      `Pasta: ${PASTA_PISOS}`,
    ].join("\n"),
  );
}

gerarPisos().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar os pisos do Armazém.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);