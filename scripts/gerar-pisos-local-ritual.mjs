import {
  access,
  mkdir,
  writeFile,
} from "node:fs/promises";

import {
  execFile,
} from "node:child_process";

import {
  fileURLToPath,
} from "node:url";

import {
  promisify,
} from "node:util";

import path from "node:path";

const executarArquivo =
  promisify(execFile);

const DIRETORIO_SCRIPT =
  path.dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );

const RAIZ_PROJETO =
  path.resolve(
    DIRETORIO_SCRIPT,
    "..",
  );

const PASTA_PISOS =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "local-ritual",
    "pisos",
  );

const SCRIPT_MANIFESTO =
  path.join(
    DIRETORIO_SCRIPT,
    "gerar-manifest-packs.mjs",
  );

function criarSvg(
  conteudo,
  {
    largura = 512,
    altura = 512,
  } = {},
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${largura} ${altura}"
  width="${largura}"
  height="${altura}"
  preserveAspectRatio="none"
>
  <defs>
    <filter
      id="ruido"
      x="-20%"
      y="-20%"
      width="140%"
      height="140%"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.68"
        numOctaves="3"
        seed="79"
        result="textura"
      />

      <feColorMatrix
        in="textura"
        type="saturate"
        values="0"
        result="texturaCinza"
      />

      <feComponentTransfer
        in="texturaCinza"
        result="texturaSuave"
      >
        <feFuncA
          type="table"
          tableValues="0 0.19"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="texturaSuave"
        mode="soft-light"
      />
    </filter>

    <filter
      id="brilho"
      x="-35%"
      y="-35%"
      width="170%"
      height="170%"
    >
      <feGaussianBlur
        stdDeviation="9"
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

    <linearGradient
      id="concretoSala"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#5b5555"
      />

      <stop
        offset="0.48"
        stop-color="#393435"
      />

      <stop
        offset="1"
        stop-color="#1c191b"
      />
    </linearGradient>

    <linearGradient
      id="concretoCorredor"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#3f3a3d"
      />

      <stop
        offset="0.5"
        stop-color="#262125"
      />

      <stop
        offset="1"
        stop-color="#100d10"
      />
    </linearGradient>

    <linearGradient
      id="pisoRitual"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#291a29"
      />

      <stop
        offset="0.5"
        stop-color="#170f1a"
      />

      <stop
        offset="1"
        stop-color="#070609"
      />
    </linearGradient>

    <radialGradient
      id="energiaRoxa"
      cx="50%"
      cy="50%"
      r="68%"
    >
      <stop
        offset="0"
        stop-color="#f5b6ff"
        stop-opacity=".92"
      />

      <stop
        offset="0.27"
        stop-color="#bd5ce8"
        stop-opacity=".76"
      />

      <stop
        offset="0.58"
        stop-color="#652184"
        stop-opacity=".42"
      />

      <stop
        offset="1"
        stop-color="#17091f"
        stop-opacity="0"
      />
    </radialGradient>

    <radialGradient
      id="energiaVermelha"
      cx="50%"
      cy="50%"
      r="68%"
    >
      <stop
        offset="0"
        stop-color="#ff9f9b"
        stop-opacity=".9"
      />

      <stop
        offset="0.35"
        stop-color="#d33b51"
        stop-opacity=".65"
      />

      <stop
        offset="1"
        stop-color="#55101f"
        stop-opacity="0"
      />
    </radialGradient>

    <pattern
      id="placasSala"
      width="128"
      height="128"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="128"
        fill="url(#concretoSala)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#171416"
        stroke-width="7"
        opacity=".82"
      />

      <path
        d="M15 15H113V113H15Z"
        fill="none"
        stroke="#746d6d"
        stroke-width="4"
        opacity=".34"
      />

      <path
        d="M64 15V113M15 64H113"
        stroke="#857d7d"
        stroke-width="3"
        opacity=".18"
      />

      <circle
        cx="18"
        cy="18"
        r="6"
        fill="#918989"
        stroke="#302b2d"
        stroke-width="3"
      />

      <circle
        cx="110"
        cy="18"
        r="6"
        fill="#918989"
        stroke="#302b2d"
        stroke-width="3"
      />

      <circle
        cx="18"
        cy="110"
        r="6"
        fill="#918989"
        stroke="#302b2d"
        stroke-width="3"
      />

      <circle
        cx="110"
        cy="110"
        r="6"
        fill="#918989"
        stroke="#302b2d"
        stroke-width="3"
      />

      <path
        d="M21 94c23-11 43 8 63-2 13-6 23-5 30 0"
        fill="none"
        stroke="#9f9697"
        stroke-width="3"
        stroke-linecap="round"
        opacity=".17"
      />
    </pattern>

    <pattern
      id="placasCorredor"
      width="128"
      height="128"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="128"
        fill="url(#concretoCorredor)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#080709"
        stroke-width="7"
        opacity=".94"
      />

      <path
        d="M14 14H114V114H14Z"
        fill="none"
        stroke="#4d464b"
        stroke-width="4"
        opacity=".48"
      />

      <rect
        x="0"
        y="52"
        width="128"
        height="24"
        fill="#5c1e39"
        opacity=".48"
      />

      <path
        d="M0 64H128"
        stroke="#b23d68"
        stroke-width="7"
        stroke-dasharray="30 15"
        opacity=".7"
      />

      <path
        d="M18 27h92M18 101h92"
        stroke="#786d73"
        stroke-width="3"
        stroke-dasharray="18 11"
        opacity=".2"
      />

      <circle
        cx="18"
        cy="18"
        r="5"
        fill="#70686c"
      />

      <circle
        cx="110"
        cy="110"
        r="5"
        fill="#70686c"
      />
    </pattern>

    <pattern
      id="placasEspeciais"
      width="128"
      height="128"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="128"
        fill="url(#pisoRitual)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#030204"
        stroke-width="8"
        opacity=".98"
      />

      <path
        d="M15 15H113V113H15Z"
        fill="none"
        stroke="#47264f"
        stroke-width="4"
        opacity=".58"
      />

      <path
        d="M64 15V113M15 64H113"
        stroke="#34183d"
        stroke-width="4"
        opacity=".52"
      />

      <circle
        cx="18"
        cy="18"
        r="6"
        fill="#814394"
        stroke="#170a1c"
        stroke-width="3"
      />

      <circle
        cx="110"
        cy="18"
        r="6"
        fill="#814394"
        stroke="#170a1c"
        stroke-width="3"
      />

      <circle
        cx="18"
        cy="110"
        r="6"
        fill="#814394"
        stroke="#170a1c"
        stroke-width="3"
      />

      <circle
        cx="110"
        cy="110"
        r="6"
        fill="#814394"
        stroke="#170a1c"
        stroke-width="3"
      />
    </pattern>

    <pattern
      id="faixaPerigo"
      width="72"
      height="72"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(35)"
    >
      <rect
        width="36"
        height="72"
        fill="#8e2b4d"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#171016"
      />
    </pattern>
  </defs>

${conteudo}
</svg>
`;
}

const PISOS = {
  "piso-sala.svg": criarSvg(`
  <g filter="url(#ruido)">
    <rect
      width="512"
      height="512"
      fill="url(#placasSala)"
    />

    <path
      d="M0 128H512M0 256H512M0 384H512"
      stroke="#211d20"
      stroke-width="5"
      opacity=".62"
    />

    <path
      d="M128 0V512M256 0V512M384 0V512"
      stroke="#211d20"
      stroke-width="5"
      opacity=".62"
    />

    <rect
      x="18"
      y="18"
      width="476"
      height="476"
      rx="9"
      fill="none"
      stroke="#817878"
      stroke-width="6"
      opacity=".24"
    />

    <path
      d="M72 83c46 13 81-14 126 2M310 83c42-12 78 11 130-1M73 427c49-14 85 13 128-2M310 427c47 12 83-11 131 1"
      fill="none"
      stroke="#938989"
      stroke-width="4"
      stroke-linecap="round"
      opacity=".18"
    />

    <g
      fill="#151114"
      opacity=".34"
    >
      <circle
        cx="82"
        cy="102"
        r="8"
      />

      <circle
        cx="414"
        cy="140"
        r="6"
      />

      <circle
        cx="177"
        cy="405"
        r="7"
      />

      <circle
        cx="449"
        cy="439"
        r="9"
      />
    </g>

    <path
      d="M185 217c41-20 79 18 116-3 20-11 35-9 54-1"
      fill="none"
      stroke="#6f263e"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".25"
    />
  </g>`),

  "piso-corredor.svg": criarSvg(`
  <g filter="url(#ruido)">
    <rect
      width="512"
      height="512"
      fill="url(#placasCorredor)"
    />

    <path
      d="M0 128H512M0 256H512M0 384H512"
      stroke="#080709"
      stroke-width="6"
      opacity=".8"
    />

    <path
      d="M0 64H512M0 320H512"
      stroke="#a73660"
      stroke-width="10"
      stroke-dasharray="42 19"
      opacity=".64"
    />

    <path
      d="M19 19H493V493H19Z"
      fill="none"
      stroke="#635960"
      stroke-width="6"
      opacity=".27"
    />

    <path
      d="M48 104h416M48 408h416"
      stroke="#887880"
      stroke-width="4"
      stroke-dasharray="20 12"
      opacity=".22"
    />

    <path
      d="M256 0V512"
      stroke="#d85080"
      stroke-width="5"
      stroke-dasharray="24 16"
      opacity=".32"
    />

    <g
      fill="#050405"
      opacity=".42"
    >
      <circle
        cx="86"
        cy="183"
        r="8"
      />

      <circle
        cx="406"
        cy="343"
        r="7"
      />

      <circle
        cx="281"
        cy="461"
        r="6"
      />
    </g>
  </g>`),

  "piso-especial.svg": criarSvg(`
  <g filter="url(#ruido)">
    <rect
      width="512"
      height="512"
      fill="url(#placasEspeciais)"
    />

    <path
      d="M0 36H512"
      stroke="url(#faixaPerigo)"
      stroke-width="50"
    />

    <path
      d="M0 476H512"
      stroke="url(#faixaPerigo)"
      stroke-width="50"
    />

    <rect
      x="27"
      y="76"
      width="458"
      height="360"
      rx="13"
      fill="none"
      stroke="#5d3268"
      stroke-width="8"
      opacity=".66"
    />

    <rect
      x="53"
      y="102"
      width="406"
      height="308"
      rx="10"
      fill="none"
      stroke="#040205"
      stroke-width="8"
      opacity=".92"
    />

    <circle
      cx="256"
      cy="256"
      r="184"
      fill="url(#energiaRoxa)"
      opacity=".62"
    />

    <circle
      cx="256"
      cy="256"
      r="148"
      fill="none"
      stroke="#a548c2"
      stroke-width="14"
      opacity=".72"
      filter="url(#brilho)"
    />

    <circle
      cx="256"
      cy="256"
      r="112"
      fill="none"
      stroke="#e67af5"
      stroke-width="8"
      stroke-dasharray="29 16"
      opacity=".7"
    />

    <circle
      cx="256"
      cy="256"
      r="74"
      fill="none"
      stroke="#8e2854"
      stroke-width="9"
      opacity=".78"
    />

    <circle
      cx="256"
      cy="256"
      r="39"
      fill="#150819"
      stroke="#ed92f8"
      stroke-width="8"
    />

    <path
      d="m256 99 37 100 107 6-83 67 28 105-89-57-89 57 28-105-83-67 107-6 37-100Z"
      fill="none"
      stroke="#ce4f86"
      stroke-width="12"
      stroke-linejoin="round"
      opacity=".82"
    />

    <path
      d="M256 72V440M72 256H440M126 126 386 386M386 126 126 386"
      stroke="#80598a"
      stroke-width="5"
      stroke-dasharray="25 16"
      opacity=".38"
    />

    <g>
      <circle
        cx="128"
        cy="128"
        r="58"
        fill="url(#energiaVermelha)"
        opacity=".7"
      />

      <circle
        cx="384"
        cy="128"
        r="58"
        fill="url(#energiaVermelha)"
        opacity=".7"
      />

      <circle
        cx="128"
        cy="384"
        r="58"
        fill="url(#energiaVermelha)"
        opacity=".7"
      />

      <circle
        cx="384"
        cy="384"
        r="58"
        fill="url(#energiaVermelha)"
        opacity=".7"
      />

      <circle
        cx="128"
        cy="128"
        r="12"
        fill="#da4056"
      />

      <circle
        cx="384"
        cy="128"
        r="12"
        fill="#da4056"
      />

      <circle
        cx="128"
        cy="384"
        r="12"
        fill="#da4056"
      />

      <circle
        cx="384"
        cy="384"
        r="12"
        fill="#da4056"
      />
    </g>

    <path
      d="M93 93h70M349 93h70M93 419h70M349 419h70"
      stroke="#b23e68"
      stroke-width="8"
      stroke-dasharray="18 10"
      opacity=".72"
    />
  </g>`),
};

async function arquivoExiste(
  caminho,
) {
  try {
    await access(
      caminho,
    );

    return true;
  } catch {
    return false;
  }
}

async function executarGeradorManifesto() {
  if (
    !await arquivoExiste(
      SCRIPT_MANIFESTO,
    )
  ) {
    throw new Error(
      [
        "O gerador do manifesto não foi encontrado.",
        `Caminho procurado: ${SCRIPT_MANIFESTO}`,
      ].join("\n"),
    );
  }

  const {
    stdout,
    stderr,
  } = await executarArquivo(
    process.execPath,
    [
      SCRIPT_MANIFESTO,
    ],
    {
      cwd: RAIZ_PROJETO,
      windowsHide: true,
      maxBuffer:
        10 * 1024 * 1024,
    },
  );

  if (
    stdout?.trim()
  ) {
    console.log(
      stdout.trim(),
    );
  }

  if (
    stderr?.trim()
  ) {
    console.error(
      stderr.trim(),
    );
  }
}

async function gerarPisos() {
  await mkdir(
    PASTA_PISOS,
    {
      recursive: true,
    },
  );

  let criados = 0;
  let preservados = 0;

  for (
    const [
      nomeArquivo,
      conteudo,
    ] of Object.entries(
      PISOS,
    )
  ) {
    const caminhoArquivo =
      path.join(
        PASTA_PISOS,
        nomeArquivo,
      );

    if (
      await arquivoExiste(
        caminhoArquivo,
      )
    ) {
      preservados += 1;

      console.log(
        `Preservado: ${nomeArquivo}`,
      );

      continue;
    }

    await writeFile(
      caminhoArquivo,
      conteudo,
      "utf8",
    );

    criados += 1;

    console.log(
      `Criado: ${nomeArquivo}`,
    );
  }

  await executarGeradorManifesto();

  console.log(
    [
      "",
      "Pisos do Local de Ritual concluídos.",
      `Criados: ${criados}.`,
      `Preservados: ${preservados}.`,
      `Pisos disponíveis: ${Object.keys(PISOS).length}.`,
      `Pasta: ${PASTA_PISOS}`,
    ].join("\n"),
  );
}

gerarPisos().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar os pisos do Local de Ritual.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);