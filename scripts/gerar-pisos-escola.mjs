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
    "escola",
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
        baseFrequency="0.8"
        numOctaves="3"
        seed="17"
        result="noise"
      />

      <feColorMatrix
        in="noise"
        type="saturate"
        values="0"
        result="noiseCinza"
      />

      <feComponentTransfer
        in="noiseCinza"
        result="noiseSuave"
      >
        <feFuncA
          type="table"
          tableValues="0 0.15"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="noiseSuave"
        mode="soft-light"
      />
    </filter>

    <filter
      id="sombraInterna"
      x="-10%"
      y="-10%"
      width="120%"
      height="120%"
    >
      <feOffset
        dx="0"
        dy="3"
      />

      <feGaussianBlur
        stdDeviation="4"
        result="desfoque"
      />

      <feComposite
        in2="SourceAlpha"
        operator="out"
        result="recorte"
      />

      <feColorMatrix
        in="recorte"
        type="matrix"
        values="
          0 0 0 0 0
          0 0 0 0 0
          0 0 0 0 0
          0 0 0 .55 0
        "
      />

      <feComposite
        in2="SourceGraphic"
        operator="over"
      />
    </filter>

    <linearGradient
      id="vinilSala"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d9d5bf"
      />

      <stop
        offset="0.5"
        stop-color="#bbb8a4"
      />

      <stop
        offset="1"
        stop-color="#8e9184"
      />
    </linearGradient>

    <linearGradient
      id="vinilCorredor"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#a9b1a8"
      />

      <stop
        offset="0.48"
        stop-color="#858f89"
      />

      <stop
        offset="1"
        stop-color="#626c67"
      />
    </linearGradient>

    <linearGradient
      id="pisoEspecial"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#b78650"
      />

      <stop
        offset="0.52"
        stop-color="#795333"
      />

      <stop
        offset="1"
        stop-color="#442d20"
      />
    </linearGradient>

    <pattern
      id="placasSala"
      width="128"
      height="128"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="128"
        fill="url(#vinilSala)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#696d65"
        stroke-width="5"
        opacity=".52"
      />

      <path
        d="M10 12c26 11 43-5 68 3 17 5 28 4 40-1M14 102c22-8 43 5 66-3 18-6 28-4 38 1"
        fill="none"
        stroke="#ece8d4"
        stroke-width="3"
        stroke-linecap="round"
        opacity=".24"
      />

      <circle
        cx="27"
        cy="38"
        r="3"
        fill="#797c72"
        opacity=".32"
      />

      <circle
        cx="97"
        cy="79"
        r="4"
        fill="#6c7068"
        opacity=".25"
      />
    </pattern>

    <pattern
      id="faixasCorredor"
      width="128"
      height="128"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="128"
        fill="url(#vinilCorredor)"
      />

      <rect
        x="0"
        y="0"
        width="128"
        height="18"
        fill="#c6c3a9"
        opacity=".42"
      />

      <rect
        x="0"
        y="110"
        width="128"
        height="18"
        fill="#4a5651"
        opacity=".54"
      />

      <path
        d="M0 64H128"
        stroke="#d6c66f"
        stroke-width="8"
        opacity=".58"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#4e5954"
        stroke-width="5"
        opacity=".58"
      />

      <path
        d="M18 28h92M18 97h92"
        stroke="#d3d9d2"
        stroke-width="3"
        stroke-dasharray="18 10"
        opacity=".24"
      />
    </pattern>

    <pattern
      id="tabuasEspecial"
      width="128"
      height="256"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="128"
        height="256"
        fill="url(#pisoEspecial)"
      />

      <path
        d="M0 0V256M64 0V256M128 0V256"
        stroke="#2c1c14"
        stroke-width="6"
        opacity=".65"
      />

      <path
        d="M0 64H64M64 128H128M0 192H64"
        stroke="#3d281c"
        stroke-width="5"
        opacity=".7"
      />

      <path
        d="M10 31c18-10 35 9 48-2M75 83c16 8 31-8 45 2M8 151c17-9 35 7 49-2M73 215c19 9 34-8 47 1"
        fill="none"
        stroke="#c3945c"
        stroke-width="4"
        stroke-linecap="round"
        opacity=".35"
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
      d="M0 256H512M256 0V512"
      stroke="#666a63"
      stroke-width="4"
      opacity=".38"
    />

    <path
      d="M12 12H500V500H12Z"
      fill="none"
      stroke="#ece7cf"
      stroke-width="5"
      opacity=".16"
    />

    <g
      fill="#6e7168"
      opacity=".16"
    >
      <circle
        cx="74"
        cy="86"
        r="7"
      />

      <circle
        cx="415"
        cy="126"
        r="5"
      />

      <circle
        cx="172"
        cy="402"
        r="6"
      />

      <circle
        cx="447"
        cy="434"
        r="8"
      />
    </g>
  </g>`),

  "piso-corredor.svg": criarSvg(`
  <g filter="url(#ruido)">
    <rect
      width="512"
      height="512"
      fill="url(#faixasCorredor)"
    />

    <path
      d="M0 128H512M0 256H512M0 384H512"
      stroke="#3f4b46"
      stroke-width="5"
      opacity=".46"
    />

    <path
      d="M0 64H512M0 320H512"
      stroke="#d1bd57"
      stroke-width="9"
      stroke-dasharray="44 18"
      opacity=".62"
    />

    <path
      d="M20 20H492V492H20Z"
      fill="none"
      stroke="#dde1da"
      stroke-width="5"
      opacity=".16"
    />

    <g
      fill="#252d2a"
      opacity=".25"
    >
      <circle
        cx="84"
        cy="180"
        r="7"
      />

      <circle
        cx="405"
        cy="343"
        r="6"
      />

      <circle
        cx="282"
        cy="462"
        r="5"
      />
    </g>
  </g>`),

  "piso-especial.svg": criarSvg(`
  <g filter="url(#ruido)">
    <rect
      width="512"
      height="512"
      fill="url(#tabuasEspecial)"
    />

    <rect
      x="20"
      y="20"
      width="472"
      height="472"
      rx="16"
      fill="none"
      stroke="#d9b078"
      stroke-width="7"
      opacity=".38"
    />

    <rect
      x="45"
      y="45"
      width="422"
      height="422"
      rx="12"
      fill="none"
      stroke="#3a251a"
      stroke-width="6"
      opacity=".62"
    />

    <circle
      cx="256"
      cy="256"
      r="114"
      fill="none"
      stroke="#d1bd68"
      stroke-width="10"
      opacity=".46"
    />

    <circle
      cx="256"
      cy="256"
      r="79"
      fill="none"
      stroke="#f0db8b"
      stroke-width="5"
      stroke-dasharray="22 14"
      opacity=".38"
    />

    <path
      d="M256 129V383M129 256H383"
      stroke="#e3ca78"
      stroke-width="6"
      opacity=".32"
    />

    <path
      d="M166 166 346 346M346 166 166 346"
      stroke="#342117"
      stroke-width="7"
      opacity=".46"
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
      "Pisos da Escola concluídos.",
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
      "Não foi possível gerar os pisos da Escola.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);