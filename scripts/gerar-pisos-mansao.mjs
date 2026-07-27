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
    "mansao",
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
        baseFrequency="0.65"
        numOctaves="3"
        seed="51"
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
          tableValues="0 0.17"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="texturaSuave"
        mode="soft-light"
      />
    </filter>

    <linearGradient
      id="madeiraSala"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#b67c48"
      />

      <stop
        offset="0.48"
        stop-color="#774425"
      />

      <stop
        offset="1"
        stop-color="#382118"
      />
    </linearGradient>

    <linearGradient
      id="madeiraCorredor"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#5b3929"
      />

      <stop
        offset="0.5"
        stop-color="#36231c"
      />

      <stop
        offset="1"
        stop-color="#17110e"
      />
    </linearGradient>

    <linearGradient
      id="pedraEspecial"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#71695d"
      />

      <stop
        offset="0.5"
        stop-color="#48423b"
      />

      <stop
        offset="1"
        stop-color="#211e1b"
      />
    </linearGradient>

    <linearGradient
      id="tapeteVermelho"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#8e3144"
      />

      <stop
        offset="0.5"
        stop-color="#5c1d2c"
      />

      <stop
        offset="1"
        stop-color="#2c1019"
      />
    </linearGradient>

    <radialGradient
      id="ouro"
      cx="42%"
      cy="35%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#f4dda1"
      />

      <stop
        offset="0.45"
        stop-color="#c3913c"
      />

      <stop
        offset="1"
        stop-color="#624018"
      />
    </radialGradient>

    <radialGradient
      id="sombraRitual"
      cx="50%"
      cy="50%"
      r="68%"
    >
      <stop
        offset="0"
        stop-color="#8d263c"
        stop-opacity=".65"
      />

      <stop
        offset=".52"
        stop-color="#4e1424"
        stop-opacity=".35"
      />

      <stop
        offset="1"
        stop-color="#1b0910"
        stop-opacity="0"
      />
    </radialGradient>

    <pattern
      id="parquetSala"
      width="128"
      height="128"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="128"
        fill="url(#madeiraSala)"
      />

      <path
        d="M0 0V128M32 0V128M64 0V128M96 0V128M128 0V128"
        stroke="#321b12"
        stroke-width="5"
        opacity=".68"
      />

      <path
        d="M0 32H32M32 64H64M64 96H96M96 32H128"
        stroke="#4b2a18"
        stroke-width="4"
        opacity=".72"
      />

      <path
        d="M8 16c8-6 15 5 22-1M39 47c8 6 16-5 23 1M71 79c8-6 16 5 23-1M102 111c8 6 16-5 23 1"
        fill="none"
        stroke="#d0a16a"
        stroke-width="3"
        stroke-linecap="round"
        opacity=".34"
      />

      <path
        d="M7 78c9-5 17 5 23-1M41 110c8 5 15-5 21 0M70 15c8-5 17 5 24-1M102 47c8 5 16-5 23 1"
        fill="none"
        stroke="#22140e"
        stroke-width="3"
        stroke-linecap="round"
        opacity=".35"
      />
    </pattern>

    <pattern
      id="tabuasCorredor"
      width="128"
      height="256"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="256"
        fill="url(#madeiraCorredor)"
      />

      <path
        d="M0 0V256M32 0V256M64 0V256M96 0V256M128 0V256"
        stroke="#120d0b"
        stroke-width="5"
        opacity=".82"
      />

      <path
        d="M0 64H32M32 128H64M64 192H96M96 64H128"
        stroke="#251813"
        stroke-width="4"
        opacity=".74"
      />

      <path
        d="M7 28c8-6 16 6 23-1M40 93c8 6 16-5 23 1M71 157c8-6 16 6 23-1M102 220c8 6 16-5 23 1"
        fill="none"
        stroke="#81553d"
        stroke-width="3"
        stroke-linecap="round"
        opacity=".35"
      />
    </pattern>

    <pattern
      id="pedrasEspeciais"
      width="128"
      height="128"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="128"
        fill="url(#pedraEspecial)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#171513"
        stroke-width="7"
        opacity=".82"
      />

      <path
        d="M64 0V128M0 64H128"
        stroke="#837a6d"
        stroke-width="4"
        opacity=".38"
      />

      <path
        d="M15 17c22 12 43-9 65 4 12 7 23 5 33-1M17 102c26-11 44 9 67-3 12-6 22-5 29 0"
        fill="none"
        stroke="#a39a8d"
        stroke-width="3"
        stroke-linecap="round"
        opacity=".18"
      />

      <circle
        cx="18"
        cy="18"
        r="5"
        fill="#a79d8f"
        stroke="#2e2b27"
        stroke-width="2"
      />

      <circle
        cx="110"
        cy="18"
        r="5"
        fill="#a79d8f"
        stroke="#2e2b27"
        stroke-width="2"
      />

      <circle
        cx="18"
        cy="110"
        r="5"
        fill="#a79d8f"
        stroke="#2e2b27"
        stroke-width="2"
      />

      <circle
        cx="110"
        cy="110"
        r="5"
        fill="#a79d8f"
        stroke="#2e2b27"
        stroke-width="2"
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
      fill="url(#parquetSala)"
    />

    <rect
      x="17"
      y="17"
      width="478"
      height="478"
      rx="10"
      fill="none"
      stroke="#d2a66d"
      stroke-width="7"
      opacity=".4"
    />

    <rect
      x="42"
      y="42"
      width="428"
      height="428"
      rx="7"
      fill="none"
      stroke="#3d2417"
      stroke-width="6"
      opacity=".72"
    />

    <path
      d="M42 42 470 470M470 42 42 470"
      stroke="#c48d50"
      stroke-width="5"
      opacity=".18"
    />

    <circle
      cx="256"
      cy="256"
      r="116"
      fill="none"
      stroke="#d0a15e"
      stroke-width="8"
      opacity=".22"
    />

    <circle
      cx="256"
      cy="256"
      r="75"
      fill="none"
      stroke="#4a2919"
      stroke-width="6"
      stroke-dasharray="26 14"
      opacity=".35"
    />

    <g
      fill="#29170f"
      opacity=".18"
    >
      <circle
        cx="83"
        cy="101"
        r="7"
      />

      <circle
        cx="416"
        cy="135"
        r="5"
      />

      <circle
        cx="178"
        cy="407"
        r="6"
      />

      <circle
        cx="449"
        cy="439"
        r="8"
      />
    </g>
  </g>`),

  "piso-corredor.svg": criarSvg(`
  <g filter="url(#ruido)">
    <rect
      width="512"
      height="512"
      fill="url(#tabuasCorredor)"
    />

    <rect
      x="87"
      y="0"
      width="338"
      height="512"
      fill="url(#tapeteVermelho)"
      opacity=".9"
    />

    <path
      d="M88 0V512M424 0V512"
      stroke="#130a0e"
      stroke-width="16"
      opacity=".9"
    />

    <path
      d="M103 0V512M409 0V512"
      stroke="url(#ouro)"
      stroke-width="9"
      opacity=".75"
    />

    <path
      d="M125 0V512M387 0V512"
      stroke="#d3ab55"
      stroke-width="4"
      stroke-dasharray="28 14"
      opacity=".42"
    />

    <path
      d="M256 0V512"
      stroke="#c28091"
      stroke-width="4"
      stroke-dasharray="31 17"
      opacity=".22"
    />

    <path
      d="M150 58 256 120 362 58M150 198l106 62 106-62M150 338l106 62 106-62"
      fill="none"
      stroke="#d2a456"
      stroke-width="8"
      opacity=".34"
    />

    <path
      d="M17 17H495V495H17Z"
      fill="none"
      stroke="#7c5237"
      stroke-width="6"
      opacity=".27"
    />

    <g
      fill="#120c0a"
      opacity=".25"
    >
      <circle
        cx="61"
        cy="177"
        r="7"
      />

      <circle
        cx="453"
        cy="342"
        r="6"
      />

      <circle
        cx="52"
        cy="458"
        r="5"
      />
    </g>
  </g>`),

  "piso-especial.svg": criarSvg(`
  <g filter="url(#ruido)">
    <rect
      width="512"
      height="512"
      fill="url(#pedrasEspeciais)"
    />

    <rect
      x="21"
      y="21"
      width="470"
      height="470"
      rx="12"
      fill="none"
      stroke="url(#ouro)"
      stroke-width="11"
      opacity=".58"
    />

    <rect
      x="48"
      y="48"
      width="416"
      height="416"
      rx="9"
      fill="none"
      stroke="#161310"
      stroke-width="8"
      opacity=".8"
    />

    <circle
      cx="256"
      cy="256"
      r="173"
      fill="url(#sombraRitual)"
      opacity=".62"
    />

    <circle
      cx="256"
      cy="256"
      r="137"
      fill="none"
      stroke="#8c2a40"
      stroke-width="14"
      opacity=".7"
    />

    <circle
      cx="256"
      cy="256"
      r="101"
      fill="none"
      stroke="url(#ouro)"
      stroke-width="9"
      stroke-dasharray="29 15"
      opacity=".63"
    />

    <circle
      cx="256"
      cy="256"
      r="64"
      fill="none"
      stroke="#a73951"
      stroke-width="7"
      opacity=".58"
    />

    <path
      d="m256 118 33 91 97 4-76 60 27 93-81-53-81 53 27-93-76-60 97-4 33-91Z"
      fill="none"
      stroke="#ba4058"
      stroke-width="10"
      stroke-linejoin="round"
      opacity=".72"
    />

    <path
      d="M256 79V433M79 256H433M131 131 381 381M381 131 131 381"
      stroke="#9f8756"
      stroke-width="5"
      stroke-dasharray="24 16"
      opacity=".32"
    />

    <g fill="url(#ouro)">
      <circle
        cx="112"
        cy="112"
        r="12"
      />

      <circle
        cx="400"
        cy="112"
        r="12"
      />

      <circle
        cx="112"
        cy="400"
        r="12"
      />

      <circle
        cx="400"
        cy="400"
        r="12"
      />
    </g>
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
      "Pisos da Mansão concluídos.",
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
      "Não foi possível gerar os pisos da Mansão.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);