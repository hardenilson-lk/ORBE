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
    "delegacia",
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
        baseFrequency="0.72"
        numOctaves="3"
        seed="27"
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
          tableValues="0 0.16"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="texturaSuave"
        mode="soft-light"
      />
    </filter>

    <linearGradient
      id="baseSala"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#c6ced0"
      />

      <stop
        offset="0.48"
        stop-color="#aab5b8"
      />

      <stop
        offset="1"
        stop-color="#7d898c"
      />
    </linearGradient>

    <linearGradient
      id="baseCorredor"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#7f8d91"
      />

      <stop
        offset="0.5"
        stop-color="#5e6b70"
      />

      <stop
        offset="1"
        stop-color="#3d484c"
      />
    </linearGradient>

    <linearGradient
      id="baseEspecial"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#4f5a5e"
      />

      <stop
        offset="0.52"
        stop-color="#303a3e"
      />

      <stop
        offset="1"
        stop-color="#151b1d"
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
        fill="url(#baseSala)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#5d686b"
        stroke-width="5"
        opacity=".58"
      />

      <path
        d="M64 0V128M0 64H128"
        stroke="#dfe5e5"
        stroke-width="3"
        opacity=".22"
      />

      <circle
        cx="24"
        cy="29"
        r="3"
        fill="#5e696c"
        opacity=".27"
      />

      <circle
        cx="99"
        cy="84"
        r="4"
        fill="#536064"
        opacity=".2"
      />

      <path
        d="M13 105c28-8 52 8 76-1 13-5 23-4 29 0"
        fill="none"
        stroke="#e5e9e8"
        stroke-width="3"
        stroke-linecap="round"
        opacity=".22"
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
        fill="url(#baseCorredor)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#283236"
        stroke-width="5"
        opacity=".7"
      />

      <rect
        x="0"
        y="54"
        width="128"
        height="20"
        fill="#c5b765"
        opacity=".5"
      />

      <path
        d="M0 64H128"
        stroke="#e3d47c"
        stroke-width="6"
        stroke-dasharray="28 13"
        opacity=".64"
      />

      <path
        d="M18 21h92M18 107h92"
        stroke="#cbd3d3"
        stroke-width="3"
        stroke-dasharray="17 10"
        opacity=".22"
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
        fill="url(#baseEspecial)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#101719"
        stroke-width="7"
        opacity=".9"
      />

      <path
        d="M14 14H114V114H14Z"
        fill="none"
        stroke="#6c797c"
        stroke-width="4"
        opacity=".45"
      />

      <circle
        cx="18"
        cy="18"
        r="6"
        fill="#a1aaab"
        stroke="#222b2e"
        stroke-width="3"
      />

      <circle
        cx="110"
        cy="18"
        r="6"
        fill="#a1aaab"
        stroke="#222b2e"
        stroke-width="3"
      />

      <circle
        cx="18"
        cy="110"
        r="6"
        fill="#a1aaab"
        stroke="#222b2e"
        stroke-width="3"
      />

      <circle
        cx="110"
        cy="110"
        r="6"
        fill="#a1aaab"
        stroke="#222b2e"
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
        fill="#c7a532"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#202628"
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
      stroke="#626d70"
      stroke-width="4"
      opacity=".38"
    />

    <path
      d="M128 0V512M256 0V512M384 0V512"
      stroke="#626d70"
      stroke-width="4"
      opacity=".38"
    />

    <path
      d="M14 14H498V498H14Z"
      fill="none"
      stroke="#e8eded"
      stroke-width="5"
      opacity=".16"
    />

    <g
      fill="#505b5e"
      opacity=".16"
    >
      <circle
        cx="72"
        cy="97"
        r="7"
      />

      <circle
        cx="404"
        cy="142"
        r="5"
      />

      <circle
        cx="177"
        cy="398"
        r="6"
      />

      <circle
        cx="448"
        cy="436"
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
      stroke="#2d383c"
      stroke-width="5"
      opacity=".58"
    />

    <path
      d="M0 64H512M0 320H512"
      stroke="#d3c267"
      stroke-width="9"
      stroke-dasharray="42 18"
      opacity=".56"
    />

    <path
      d="M18 18H494V494H18Z"
      fill="none"
      stroke="#cbd4d4"
      stroke-width="5"
      opacity=".14"
    />

    <g
      fill="#20282b"
      opacity=".28"
    >
      <circle
        cx="86"
        cy="181"
        r="7"
      />

      <circle
        cx="408"
        cy="341"
        r="6"
      />

      <circle
        cx="281"
        cy="461"
        r="5"
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
      d="M0 34H512"
      stroke="url(#faixaPerigo)"
      stroke-width="46"
    />

    <path
      d="M0 478H512"
      stroke="url(#faixaPerigo)"
      stroke-width="46"
    />

    <rect
      x="25"
      y="72"
      width="462"
      height="368"
      rx="12"
      fill="none"
      stroke="#859194"
      stroke-width="7"
      opacity=".48"
    />

    <rect
      x="48"
      y="95"
      width="416"
      height="322"
      rx="9"
      fill="none"
      stroke="#12191b"
      stroke-width="6"
      opacity=".72"
    />

    <circle
      cx="256"
      cy="256"
      r="108"
      fill="none"
      stroke="#a02e35"
      stroke-width="14"
      opacity=".66"
    />

    <path
      d="M178 178 334 334M334 178 178 334"
      stroke="#b53a40"
      stroke-width="13"
      stroke-linecap="round"
      opacity=".7"
    />

    <path
      d="M256 121V391M121 256H391"
      stroke="#8c989b"
      stroke-width="5"
      stroke-dasharray="25 15"
      opacity=".35"
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
      "Pisos da Delegacia concluídos.",
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
      "Não foi possível gerar os pisos da Delegacia.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);