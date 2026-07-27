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
    "laboratorio",
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
        baseFrequency="0.76"
        numOctaves="3"
        seed="39"
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
          tableValues="0 0.13"
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
        stop-color="#dce4df"
      />

      <stop
        offset="0.48"
        stop-color="#bbc9c3"
      />

      <stop
        offset="1"
        stop-color="#81918b"
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
        stop-color="#91a8a5"
      />

      <stop
        offset="0.5"
        stop-color="#607976"
      />

      <stop
        offset="1"
        stop-color="#344b49"
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
        stop-color="#263f42"
      />

      <stop
        offset="0.48"
        stop-color="#182d30"
      />

      <stop
        offset="1"
        stop-color="#091416"
      />
    </linearGradient>

    <radialGradient
      id="energiaAzul"
      cx="50%"
      cy="50%"
      r="68%"
    >
      <stop
        offset="0"
        stop-color="#ddffff"
        stop-opacity=".95"
      />

      <stop
        offset="0.35"
        stop-color="#64dfe0"
        stop-opacity=".72"
      />

      <stop
        offset="1"
        stop-color="#15515e"
        stop-opacity="0"
      />
    </radialGradient>

    <radialGradient
      id="alertaVermelho"
      cx="50%"
      cy="50%"
      r="68%"
    >
      <stop
        offset="0"
        stop-color="#ffb19f"
        stop-opacity=".95"
      />

      <stop
        offset="0.4"
        stop-color="#e34a45"
        stop-opacity=".75"
      />

      <stop
        offset="1"
        stop-color="#73191f"
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
        fill="url(#baseSala)"
      />

      <path
        d="M0 0H128V128H0Z"
        fill="none"
        stroke="#687772"
        stroke-width="5"
        opacity=".52"
      />

      <path
        d="M64 0V128M0 64H128"
        stroke="#eff5f1"
        stroke-width="3"
        opacity=".2"
      />

      <circle
        cx="17"
        cy="17"
        r="5"
        fill="#8d9a95"
        stroke="#53605c"
        stroke-width="2"
      />

      <circle
        cx="111"
        cy="17"
        r="5"
        fill="#8d9a95"
        stroke="#53605c"
        stroke-width="2"
      />

      <circle
        cx="17"
        cy="111"
        r="5"
        fill="#8d9a95"
        stroke="#53605c"
        stroke-width="2"
      />

      <circle
        cx="111"
        cy="111"
        r="5"
        fill="#8d9a95"
        stroke="#53605c"
        stroke-width="2"
      />

      <path
        d="M20 98c27-8 51 7 75-1 12-4 20-3 25 0"
        fill="none"
        stroke="#f2f7f4"
        stroke-width="3"
        stroke-linecap="round"
        opacity=".19"
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
        stroke="#293d3c"
        stroke-width="5"
        opacity=".66"
      />

      <rect
        x="0"
        y="54"
        width="128"
        height="20"
        fill="#a8d7d2"
        opacity=".22"
      />

      <path
        d="M0 64H128"
        stroke="#b5ece5"
        stroke-width="6"
        stroke-dasharray="28 13"
        opacity=".54"
      />

      <path
        d="M18 21h92M18 107h92"
        stroke="#d7e7e3"
        stroke-width="3"
        stroke-dasharray="17 10"
        opacity=".18"
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
        stroke="#071113"
        stroke-width="7"
        opacity=".95"
      />

      <path
        d="M14 14H114V114H14Z"
        fill="none"
        stroke="#49696b"
        stroke-width="4"
        opacity=".55"
      />

      <circle
        cx="18"
        cy="18"
        r="6"
        fill="#8ea7a6"
        stroke="#172627"
        stroke-width="3"
      />

      <circle
        cx="110"
        cy="18"
        r="6"
        fill="#8ea7a6"
        stroke="#172627"
        stroke-width="3"
      />

      <circle
        cx="18"
        cy="110"
        r="6"
        fill="#8ea7a6"
        stroke="#172627"
        stroke-width="3"
      />

      <circle
        cx="110"
        cy="110"
        r="6"
        fill="#8ea7a6"
        stroke="#172627"
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
        fill="#c7aa39"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#1b2425"
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
      stroke="#697872"
      stroke-width="4"
      opacity=".36"
    />

    <path
      d="M128 0V512M256 0V512M384 0V512"
      stroke="#697872"
      stroke-width="4"
      opacity=".36"
    />

    <path
      d="M14 14H498V498H14Z"
      fill="none"
      stroke="#f1f6f2"
      stroke-width="5"
      opacity=".17"
    />

    <g
      fill="#5e6c67"
      opacity=".15"
    >
      <circle
        cx="74"
        cy="92"
        r="7"
      />

      <circle
        cx="404"
        cy="139"
        r="5"
      />

      <circle
        cx="174"
        cy="401"
        r="6"
      />

      <circle
        cx="447"
        cy="434"
        r="8"
      />
    </g>

    <path
      d="M90 302c52-13 91 11 139-3 38-11 77 8 116-2"
      fill="none"
      stroke="#dce7e2"
      stroke-width="4"
      stroke-linecap="round"
      opacity=".15"
    />
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
      stroke="#263b3a"
      stroke-width="5"
      opacity=".56"
    />

    <path
      d="M0 64H512M0 320H512"
      stroke="#9fddd6"
      stroke-width="9"
      stroke-dasharray="42 18"
      opacity=".42"
    />

    <path
      d="M18 18H494V494H18Z"
      fill="none"
      stroke="#d8e8e4"
      stroke-width="5"
      opacity=".13"
    />

    <g
      fill="#172828"
      opacity=".25"
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

    <path
      d="M43 103h426M43 407h426"
      stroke="#a2bab5"
      stroke-width="4"
      stroke-dasharray="18 11"
      opacity=".24"
    />
  </g>`),

  "piso-especial.svg": criarSvg(`
  <g filter="url(#ruido)">
    <rect
      width="512"
      height="512"
      fill="url(#placasEspeciais)"
    />

    <path
      d="M0 35H512"
      stroke="url(#faixaPerigo)"
      stroke-width="48"
    />

    <path
      d="M0 477H512"
      stroke="url(#faixaPerigo)"
      stroke-width="48"
    />

    <rect
      x="26"
      y="73"
      width="460"
      height="366"
      rx="13"
      fill="none"
      stroke="#698486"
      stroke-width="7"
      opacity=".52"
    />

    <rect
      x="49"
      y="96"
      width="414"
      height="320"
      rx="10"
      fill="none"
      stroke="#071214"
      stroke-width="6"
      opacity=".78"
    />

    <circle
      cx="256"
      cy="256"
      r="134"
      fill="url(#energiaAzul)"
      opacity=".46"
    />

    <circle
      cx="256"
      cy="256"
      r="105"
      fill="none"
      stroke="#64d7d9"
      stroke-width="13"
      opacity=".58"
    />

    <circle
      cx="256"
      cy="256"
      r="70"
      fill="none"
      stroke="#bafff9"
      stroke-width="6"
      stroke-dasharray="23 14"
      opacity=".5"
    />

    <path
      d="M256 122V390M122 256H390"
      stroke="#8eaeae"
      stroke-width="5"
      stroke-dasharray="25 15"
      opacity=".36"
    />

    <path
      d="M180 180 332 332M332 180 180 332"
      stroke="#6fd9d9"
      stroke-width="7"
      opacity=".42"
    />

    <g>
      <circle
        cx="153"
        cy="153"
        r="47"
        fill="url(#alertaVermelho)"
        opacity=".52"
      />

      <circle
        cx="359"
        cy="153"
        r="47"
        fill="url(#alertaVermelho)"
        opacity=".52"
      />

      <circle
        cx="153"
        cy="359"
        r="47"
        fill="url(#alertaVermelho)"
        opacity=".52"
      />

      <circle
        cx="359"
        cy="359"
        r="47"
        fill="url(#alertaVermelho)"
        opacity=".52"
      />

      <circle
        cx="153"
        cy="153"
        r="10"
        fill="#e6534d"
      />

      <circle
        cx="359"
        cy="153"
        r="10"
        fill="#e6534d"
      />

      <circle
        cx="153"
        cy="359"
        r="10"
        fill="#e6534d"
      />

      <circle
        cx="359"
        cy="359"
        r="10"
        fill="#e6534d"
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
      "Pisos do Laboratório concluídos.",
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
      "Não foi possível gerar os pisos do Laboratório.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);