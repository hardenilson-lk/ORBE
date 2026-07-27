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

const PASTA_OBJETOS =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "local-ritual",
    "objetos",
  );

const SCRIPT_MANIFESTO =
  path.join(
    RAIZ_PROJETO,
    "scripts",
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
>
  <defs>
    <filter
      id="sombra"
      x="-35%"
      y="-35%"
      width="170%"
      height="170%"
    >
      <feDropShadow
        dx="0"
        dy="13"
        stdDeviation="12"
        flood-color="#000000"
        flood-opacity="0.48"
      />
    </filter>

    <filter
      id="sombraLeve"
      x="-25%"
      y="-25%"
      width="150%"
      height="150%"
    >
      <feDropShadow
        dx="0"
        dy="7"
        stdDeviation="7"
        flood-color="#000000"
        flood-opacity="0.36"
      />
    </filter>

    <linearGradient
      id="metal"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d5d8d5"
      />

      <stop
        offset="0.35"
        stop-color="#7b8581"
      />

      <stop
        offset="0.7"
        stop-color="#404946"
      />

      <stop
        offset="1"
        stop-color="#171c1b"
      />
    </linearGradient>

    <linearGradient
      id="metalEscuro"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#505956"
      />

      <stop
        offset="0.5"
        stop-color="#292f2d"
      />

      <stop
        offset="1"
        stop-color="#101312"
      />
    </linearGradient>

    <linearGradient
      id="madeiraEscura"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#755038"
      />

      <stop
        offset="0.45"
        stop-color="#42291f"
      />

      <stop
        offset="1"
        stop-color="#1c1310"
      />
    </linearGradient>

    <linearGradient
      id="tecido"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#5f243c"
      />

      <stop
        offset="0.5"
        stop-color="#361627"
      />

      <stop
        offset="1"
        stop-color="#160d14"
      />
    </linearGradient>

    <linearGradient
      id="papel"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#eee3bd"
      />

      <stop
        offset="0.55"
        stop-color="#c5b282"
      />

      <stop
        offset="1"
        stop-color="#88724f"
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
        stop-color="#d9eff0"
        stop-opacity=".8"
      />

      <stop
        offset="0.48"
        stop-color="#698d8e"
        stop-opacity=".62"
      />

      <stop
        offset="1"
        stop-color="#263f41"
        stop-opacity=".82"
      />
    </linearGradient>

    <radialGradient
      id="luzVela"
      cx="50%"
      cy="38%"
      r="64%"
    >
      <stop
        offset="0"
        stop-color="#fffbd0"
      />

      <stop
        offset="0.28"
        stop-color="#ffd45f"
      />

      <stop
        offset="0.66"
        stop-color="#ef6b25"
      />

      <stop
        offset="1"
        stop-color="#8d1e20"
      />
    </radialGradient>

    <radialGradient
      id="energia"
      cx="50%"
      cy="45%"
      r="60%"
    >
      <stop
        offset="0"
        stop-color="#f7b9ff"
      />

      <stop
        offset="0.32"
        stop-color="#b85aff"
      />

      <stop
        offset="0.67"
        stop-color="#6120a4"
      />

      <stop
        offset="1"
        stop-color="#1a0d2d"
      />
    </radialGradient>

    <radialGradient
      id="sangue"
      cx="42%"
      cy="35%"
      r="74%"
    >
      <stop
        offset="0"
        stop-color="#b42635"
      />

      <stop
        offset="0.55"
        stop-color="#711625"
      />

      <stop
        offset="1"
        stop-color="#270b10"
      />
    </radialGradient>

    <pattern
      id="perigo"
      width="72"
      height="72"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(35)"
    >
      <rect
        width="36"
        height="72"
        fill="#d0a529"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#202321"
      />
    </pattern>
  </defs>

${conteudo}
</svg>
`;
}

const ASSETS = {
  "simbolo.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <circle
      cx="256"
      cy="256"
      r="210"
      fill="#170d18"
      fill-opacity=".72"
      stroke="#742448"
      stroke-width="18"
      stroke-dasharray="29 15"
    />

    <circle
      cx="256"
      cy="256"
      r="168"
      fill="none"
      stroke="#d14b78"
      stroke-width="12"
    />

    <circle
      cx="256"
      cy="256"
      r="112"
      fill="#271028"
      stroke="#8c2858"
      stroke-width="11"
    />

    <path
      d="m256 78 45 106 115 10-88 74 29 112-101-60-101 60 29-112-88-74 115-10 45-106Z"
      fill="#6f2049"
      fill-opacity=".65"
      stroke="#e15b86"
      stroke-width="11"
      stroke-linejoin="round"
    />

    <path
      d="M256 177 321 288H191l65-111Z"
      fill="#1d0f1f"
      stroke="#d94c7a"
      stroke-width="10"
    />

    <circle
      cx="256"
      cy="274"
      r="37"
      fill="url(#energia)"
      stroke="#f0a7ff"
      stroke-width="8"
    />

    <path
      d="M256 34v61M256 417v61M34 256h61M417 256h61M98 98l45 45M369 369l45 45M414 98l-45 45M143 369l-45 45"
      stroke="#b83b69"
      stroke-width="12"
      stroke-linecap="round"
    />
  </g>`),

  "vela.svg": criarSvg(`
  <g filter="url(#sombra)">
    <ellipse
      cx="256"
      cy="438"
      rx="115"
      ry="34"
      fill="#110e0d"
      opacity=".72"
    />

    <path
      d="M194 177h124l19 230c2 25-18 46-43 46h-76c-25 0-45-21-43-46l19-230Z"
      fill="#d9cfaa"
      stroke="#5b5344"
      stroke-width="13"
    />

    <path
      d="M213 202c15 28 5 67 18 98 12 29 5 75 19 112M296 194c-19 45-2 76-14 116-10 34 5 72-5 110"
      fill="none"
      stroke="#a99d77"
      stroke-width="9"
      stroke-linecap="round"
      opacity=".7"
    />

    <ellipse
      cx="256"
      cy="180"
      rx="63"
      ry="23"
      fill="#f0e8c9"
      stroke="#665f4d"
      stroke-width="10"
    />

    <ellipse
      cx="256"
      cy="182"
      rx="28"
      ry="11"
      fill="#4c3930"
    />

    <path
      d="M256 183v-34"
      stroke="#2a211e"
      stroke-width="9"
      stroke-linecap="round"
    />

    <path
      d="M256 151c-39-22-37-63-4-95 4 29 31 42 19 72 21-13 30-33 28-55 31 35 22 75-11 91-12 6-22 5-32-13Z"
      fill="url(#luzVela)"
      stroke="#9c2e21"
      stroke-width="7"
      stroke-linejoin="round"
    />

    <path
      d="M257 139c-15-13-14-31-2-46 2 15 14 23 9 36 9-5 13-15 12-26 11 18 6 34-7 40-5 2-8 1-12-4Z"
      fill="#fff9bc"
    />
  </g>`),

  "mesa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="64"
      y="91"
      width="384"
      height="253"
      rx="32"
      fill="#17100e"
      stroke="#090706"
      stroke-width="18"
    />

    <rect
      x="86"
      y="113"
      width="340"
      height="209"
      rx="21"
      fill="url(#madeiraEscura)"
      stroke="#241713"
      stroke-width="9"
    />

    <path
      d="M256 116v204M90 218h332"
      stroke="#1b1010"
      stroke-width="9"
      opacity=".9"
    />

    <circle
      cx="256"
      cy="217"
      r="72"
      fill="#1a0e19"
      stroke="#8b2a55"
      stroke-width="10"
    />

    <path
      d="m256 154 20 45 49 4-38 32 12 48-43-26-43 26 12-48-38-32 49-4 20-45Z"
      fill="#5d193c"
      stroke="#c84673"
      stroke-width="7"
      stroke-linejoin="round"
    />

    <path
      d="M113 340 72 453M399 340l41 113M177 340l-12 121M335 340l12 121"
      stroke="#2b211c"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M58 451h104M350 451h104M125 465h84M303 465h84"
      stroke="#11100e"
      stroke-width="13"
      stroke-linecap="round"
    />
  </g>`),

  "altar-contemporaneo.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M105 410h302l-34-255H139l-34 255Z"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
      stroke-linejoin="round"
    />

    <path
      d="M133 386h246l-28-207H161l-28 207Z"
      fill="url(#metalEscuro)"
      stroke="#4d5753"
      stroke-width="9"
      stroke-linejoin="round"
    />

    <rect
      x="98"
      y="115"
      width="316"
      height="99"
      rx="20"
      fill="#242b29"
      stroke="#090c0b"
      stroke-width="17"
    />

    <rect
      x="121"
      y="137"
      width="270"
      height="55"
      rx="12"
      fill="url(#metal)"
      stroke="#4e5955"
      stroke-width="7"
    />

    <circle
      cx="256"
      cy="164"
      r="91"
      fill="#170d18"
      stroke="#6f2148"
      stroke-width="13"
    />

    <circle
      cx="256"
      cy="164"
      r="59"
      fill="none"
      stroke="#dc5382"
      stroke-width="8"
      stroke-dasharray="20 10"
    />

    <path
      d="m256 105 18 38 42 4-32 27 10 41-38-22-38 22 10-41-32-27 42-4 18-38Z"
      fill="#7c2750"
      stroke="#e06491"
      stroke-width="7"
      stroke-linejoin="round"
    />

    <rect
      x="180"
      y="284"
      width="152"
      height="69"
      rx="15"
      fill="#0d1110"
      stroke="#626d68"
      stroke-width="8"
    />

    <g fill="#b54766">
      <circle
        cx="210"
        cy="318"
        r="10"
      />

      <circle
        cx="256"
        cy="318"
        r="10"
      />

      <circle
        cx="302"
        cy="318"
        r="10"
      />
    </g>

    <path
      d="M151 408h210M129 439h254"
      stroke="#090b0a"
      stroke-width="18"
      stroke-linecap="round"
    />
  </g>`),

  "documento.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="m112 89 287-31 39 360-287 32-39-361Z"
      fill="#88734e"
      stroke="#3d3426"
      stroke-width="11"
    />

    <path
      d="m75 133 288-43 49 350-287 43-50-350Z"
      fill="url(#papel)"
      stroke="#564a37"
      stroke-width="12"
    />

    <path
      d="M130 183c67-7 135-19 202-30M137 229c73-10 142-22 207-31M144 278c60-9 118-18 177-27M152 329c49-8 102-17 155-25"
      fill="none"
      stroke="#5b5341"
      stroke-width="8"
      stroke-linecap="round"
      opacity=".75"
    />

    <path
      d="M116 152c31 16 47 36 55 66"
      fill="none"
      stroke="#912e3f"
      stroke-width="10"
      stroke-linecap="round"
    />

    <circle
      cx="307"
      cy="374"
      r="48"
      fill="#72192b"
      stroke="#3b0d18"
      stroke-width="8"
    />

    <path
      d="m307 344 12 25 28 3-21 18 7 27-26-15-25 15 7-27-21-18 28-3 11-25Z"
      fill="#b94b62"
    />
  </g>`),

  "caixa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="68"
      y="66"
      width="376"
      height="382"
      rx="28"
      fill="#1b1514"
      stroke="#090707"
      stroke-width="18"
    />

    <rect
      x="91"
      y="89"
      width="330"
      height="336"
      rx="17"
      fill="#42322d"
      stroke="#18110f"
      stroke-width="10"
    />

    <path
      d="M101 161h310M101 256h310M101 351h310"
      stroke="#241816"
      stroke-width="9"
    />

    <path
      d="M110 116 398 399M399 116 112 400"
      stroke="#1c1211"
      stroke-width="31"
    />

    <path
      d="M110 116 398 399M399 116 112 400"
      stroke="#683049"
      stroke-width="13"
    />

    <rect
      x="208"
      y="208"
      width="96"
      height="96"
      rx="15"
      fill="#141716"
      stroke="#080a09"
      stroke-width="10"
    />

    <circle
      cx="256"
      cy="256"
      r="28"
      fill="url(#energia)"
      stroke="#c779ed"
      stroke-width="7"
    />

    <path
      d="M256 229v54M229 256h54"
      stroke="#f2c7ff"
      stroke-width="7"
      stroke-linecap="round"
    />

    <g fill="#555e5a" stroke="#111514" stroke-width="8">
      <rect
        x="68"
        y="66"
        width="70"
        height="70"
        rx="12"
      />

      <rect
        x="374"
        y="66"
        width="70"
        height="70"
        rx="12"
      />

      <rect
        x="68"
        y="378"
        width="70"
        height="70"
        rx="12"
      />

      <rect
        x="374"
        y="378"
        width="70"
        height="70"
        rx="12"
      />
    </g>
  </g>`),

  "recipiente.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M178 78h156v80c0 23 9 45 26 61 47 43 75 104 75 169 0 48-39 87-87 87H164c-48 0-87-39-87-87 0-65 28-126 75-169 17-16 26-38 26-61V78Z"
      fill="#1c2423"
      stroke="#0a0e0d"
      stroke-width="18"
    />

    <rect
      x="174"
      y="53"
      width="164"
      height="74"
      rx="20"
      fill="url(#metal)"
      stroke="#242b29"
      stroke-width="10"
    />

    <path
      d="M121 307c68 25 199 23 270-4v84c0 27-22 49-49 49H170c-27 0-49-22-49-49v-80Z"
      fill="url(#vidro)"
      stroke="#315051"
      stroke-width="8"
    />

    <path
      d="M154 328c44 15 157 15 205-2"
      fill="none"
      stroke="#b5dde1"
      stroke-width="7"
      opacity=".62"
    />

    <circle
      cx="213"
      cy="355"
      r="16"
      fill="#ba5fe7"
      opacity=".72"
    />

    <circle
      cx="287"
      cy="383"
      r="11"
      fill="#df8dff"
      opacity=".68"
    />

    <circle
      cx="330"
      cy="339"
      r="9"
      fill="#8f3ac7"
      opacity=".74"
    />

    <path
      d="M236 92h40"
      stroke="#e3e6e1"
      stroke-width="8"
      stroke-linecap="round"
      opacity=".55"
    />
  </g>`),

  "corrente.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <g
      fill="none"
      stroke="url(#metal)"
      stroke-width="28"
    >
      <ellipse
        cx="105"
        cy="160"
        rx="55"
        ry="88"
        transform="rotate(-38 105 160)"
      />

      <ellipse
        cx="180"
        cy="229"
        rx="55"
        ry="88"
        transform="rotate(44 180 229)"
      />

      <ellipse
        cx="256"
        cy="292"
        rx="55"
        ry="88"
        transform="rotate(-38 256 292)"
      />

      <ellipse
        cx="333"
        cy="355"
        rx="55"
        ry="88"
        transform="rotate(44 333 355)"
      />

      <ellipse
        cx="412"
        cy="409"
        rx="51"
        ry="79"
        transform="rotate(-38 412 409)"
      />
    </g>

    <g
      fill="none"
      stroke="#d6dcd7"
      stroke-width="6"
      opacity=".55"
    >
      <ellipse
        cx="105"
        cy="160"
        rx="55"
        ry="88"
        transform="rotate(-38 105 160)"
      />

      <ellipse
        cx="256"
        cy="292"
        rx="55"
        ry="88"
        transform="rotate(-38 256 292)"
      />

      <ellipse
        cx="412"
        cy="409"
        rx="51"
        ry="79"
        transform="rotate(-38 412 409)"
      />
    </g>
  </g>`),

  "marca.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M76 246c25-79 96-146 180-164 84 18 155 85 180 164-25 79-96 146-180 164-84-18-155-85-180-164Z"
      fill="#140b12"
      fill-opacity=".72"
      stroke="#6e1b3c"
      stroke-width="16"
    />

    <circle
      cx="256"
      cy="246"
      r="116"
      fill="none"
      stroke="#b93663"
      stroke-width="11"
      stroke-dasharray="25 13"
    />

    <path
      d="M256 125 308 228l109 18-79 77 18 108-100-50-100 50 18-108-79-77 109-18 52-103Z"
      fill="#6d1a40"
      fill-opacity=".48"
      stroke="#dc4e7b"
      stroke-width="10"
      stroke-linejoin="round"
    />

    <path
      d="M256 175v137M190 245h132M211 199l90 94M301 199l-90 94"
      stroke="#e25b86"
      stroke-width="9"
      stroke-linecap="round"
    />

    <circle
      cx="256"
      cy="246"
      r="30"
      fill="#1b0b17"
      stroke="#ef78a1"
      stroke-width="8"
    />
  </g>`),

  "mancha.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M65 288c18-43 57-61 96-68 10-54 65-96 119-77 40-54 131-35 146 32 59 8 86 77 49 122 26 56-29 116-85 102-39 46-112 36-140-17-54 25-119-12-115-73-27 3-57-1-70-21Z"
      fill="url(#sangue)"
      stroke="#24080e"
      stroke-width="13"
      stroke-linejoin="round"
    />

    <g fill="#d83b4a" opacity=".38">
      <circle
        cx="154"
        cy="262"
        r="28"
      />

      <circle
        cx="253"
        cy="209"
        r="35"
      />

      <circle
        cx="356"
        cy="275"
        r="24"
      />

      <circle
        cx="268"
        cy="349"
        r="31"
      />
    </g>

    <g fill="#7b1422">
      <circle
        cx="90"
        cy="168"
        r="17"
      />

      <circle
        cx="438"
        cy="132"
        r="13"
      />

      <circle
        cx="450"
        cy="390"
        r="20"
      />

      <circle
        cx="112"
        cy="417"
        r="12"
      />

      <circle
        cx="50"
        cy="357"
        r="9"
      />
    </g>

    <path
      d="M138 284c72-48 149-22 221-62M183 353c52-22 104 5 156-24"
      fill="none"
      stroke="#ed5960"
      stroke-width="9"
      stroke-linecap="round"
      opacity=".32"
    />
  </g>`),

  "objeto-deslocado.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M92 375 184 91l238 77-92 284L92 375Z"
      fill="#171413"
      stroke="#080706"
      stroke-width="18"
      stroke-linejoin="round"
    />

    <path
      d="m119 358 80-240 196 65-80 240-196-65Z"
      fill="url(#madeiraEscura)"
      stroke="#31201a"
      stroke-width="9"
    />

    <path
      d="m208 149 158 52M190 206l158 52M171 265l158 52M152 324l158 52"
      stroke="#2a1716"
      stroke-width="8"
      opacity=".75"
    />

    <path
      d="M111 409 63 458M345 431l39 60M400 154l60-37"
      stroke="#25211e"
      stroke-width="22"
      stroke-linecap="round"
    />

    <path
      d="M239 108 345 446"
      stroke="#73264b"
      stroke-width="12"
      stroke-dasharray="22 13"
      opacity=".8"
    />

    <circle
      cx="239"
      cy="276"
      r="37"
      fill="#171018"
      stroke="#c43f70"
      stroke-width="8"
    />

    <path
      d="m239 254 10 19 21 3-16 15 5 21-20-10-19 10 5-21-16-15 21-3 9-19Z"
      fill="#d6537f"
    />
  </g>`),

  "equipamento.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="64"
      y="69"
      width="384"
      height="374"
      rx="37"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="88"
      y="94"
      width="336"
      height="152"
      rx="22"
      fill="url(#metalEscuro)"
      stroke="#4c5652"
      stroke-width="9"
    />

    <rect
      x="111"
      y="117"
      width="218"
      height="105"
      rx="14"
      fill="#101819"
      stroke="#27393a"
      stroke-width="7"
    />

    <path
      d="M128 189c27-38 51 17 78-10s49-3 70-36 28 7 36 28"
      fill="none"
      stroke="#8ef5e1"
      stroke-width="7"
      stroke-linecap="round"
    />

    <g fill="#c34468" stroke="#481526" stroke-width="5">
      <circle
        cx="370"
        cy="132"
        r="17"
      />

      <circle
        cx="370"
        cy="188"
        r="17"
      />
    </g>

    <rect
      x="91"
      y="273"
      width="330"
      height="135"
      rx="21"
      fill="#232a28"
      stroke="#0e1110"
      stroke-width="10"
    />

    <g fill="#68726e">
      <rect
        x="119"
        y="303"
        width="58"
        height="77"
        rx="9"
      />

      <rect
        x="194"
        y="303"
        width="58"
        height="77"
        rx="9"
      />

      <rect
        x="269"
        y="303"
        width="58"
        height="77"
        rx="9"
      />
    </g>

    <circle
      cx="374"
      cy="341"
      r="34"
      fill="#170d1b"
      stroke="#9542ba"
      stroke-width="8"
    />

    <circle
      cx="374"
      cy="341"
      r="15"
      fill="#d48aff"
    />
  </g>`),

  "cabo.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M48 345c56-157 198-36 245-163 37-102 121-63 171-14"
      fill="none"
      stroke="#080a09"
      stroke-width="42"
      stroke-linecap="round"
    />

    <path
      d="M48 345c56-157 198-36 245-163 37-102 121-63 171-14"
      fill="none"
      stroke="#2d3431"
      stroke-width="28"
      stroke-linecap="round"
    />

    <path
      d="M48 345c56-157 198-36 245-163 37-102 121-63 171-14"
      fill="none"
      stroke="#8e315d"
      stroke-width="8"
      stroke-linecap="round"
      opacity=".82"
    />

    <rect
      x="28"
      y="315"
      width="79"
      height="69"
      rx="15"
      fill="#313735"
      stroke="#111413"
      stroke-width="10"
    />

    <rect
      x="404"
      y="124"
      width="80"
      height="75"
      rx="15"
      fill="#313735"
      stroke="#111413"
      stroke-width="10"
    />

    <g fill="#b9c1bc">
      <rect
        x="42"
        y="331"
        width="16"
        height="36"
        rx="4"
      />

      <rect
        x="75"
        y="331"
        width="16"
        height="36"
        rx="4"
      />

      <rect
        x="419"
        y="140"
        width="16"
        height="42"
        rx="4"
      />

      <rect
        x="451"
        y="140"
        width="16"
        height="42"
        rx="4"
      />
    </g>
  </g>`),

  "gerador.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="57"
      y="92"
      width="398"
      height="329"
      rx="43"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="82"
      y="118"
      width="348"
      height="278"
      rx="27"
      fill="url(#metalEscuro)"
      stroke="#56615c"
      stroke-width="9"
    />

    <rect
      x="107"
      y="146"
      width="173"
      height="121"
      rx="18"
      fill="#101817"
      stroke="#323f3b"
      stroke-width="8"
    />

    <path
      d="M132 239c23-52 45 14 67-23 24-40 39 8 58-26"
      fill="none"
      stroke="#82e6d2"
      stroke-width="8"
      stroke-linecap="round"
    />

    <circle
      cx="350"
      cy="205"
      r="66"
      fill="#17120f"
      stroke="#11100e"
      stroke-width="10"
    />

    <path
      d="m350 149 18 40 44 4-34 29 11 43-39-23-39 23 11-43-34-29 44-4 18-40Z"
      fill="#d3a92d"
      stroke="#6b531b"
      stroke-width="7"
    />

    <rect
      x="109"
      y="298"
      width="294"
      height="64"
      rx="15"
      fill="#101312"
      stroke="#4f5955"
      stroke-width="8"
    />

    <g fill="#c14364">
      <circle
        cx="146"
        cy="330"
        r="12"
      />

      <circle
        cx="187"
        cy="330"
        r="12"
      />
    </g>

    <rect
      x="235"
      y="314"
      width="137"
      height="32"
      rx="9"
      fill="#29312e"
    />

    <circle
      cx="123"
      cy="421"
      r="35"
      fill="#222725"
      stroke="#0c0e0d"
      stroke-width="11"
    />

    <circle
      cx="389"
      cy="421"
      r="35"
      fill="#222725"
      stroke="#0c0e0d"
      stroke-width="11"
    />
  </g>`),

  "barreira.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M67 378h378v71H67z"
      fill="#242927"
      stroke="#0d100f"
      stroke-width="15"
    />

    <path
      d="M99 94h314l33 256H66L99 94Z"
      fill="#171a19"
      stroke="#090b0a"
      stroke-width="17"
      stroke-linejoin="round"
    />

    <path
      d="M118 119h276l26 205H92l26-205Z"
      fill="url(#perigo)"
      stroke="#4d4f42"
      stroke-width="8"
      stroke-linejoin="round"
    />

    <rect
      x="112"
      y="172"
      width="288"
      height="102"
      rx="17"
      fill="#171a19"
      stroke="#0a0c0b"
      stroke-width="11"
    />

    <path
      d="M151 223h210"
      stroke="#d3aa2f"
      stroke-width="13"
      stroke-linecap="round"
    />

    <path
      d="M123 356 91 445M389 356l32 89"
      stroke="#303634"
      stroke-width="28"
      stroke-linecap="round"
    />

    <path
      d="M57 447h113M342 447h113"
      stroke="#121514"
      stroke-width="16"
      stroke-linecap="round"
    />
  </g>`),

  "fita-de-isolamento.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M34 203c121-51 191 41 300-13 58-29 99-23 147 4"
      fill="none"
      stroke="#111311"
      stroke-width="78"
      stroke-linecap="round"
    />

    <path
      d="M34 203c121-51 191 41 300-13 58-29 99-23 147 4"
      fill="none"
      stroke="#d1a829"
      stroke-width="63"
      stroke-linecap="round"
    />

    <path
      d="M34 203c121-51 191 41 300-13 58-29 99-23 147 4"
      fill="none"
      stroke="#1c1f1d"
      stroke-width="63"
      stroke-dasharray="48 48"
      stroke-linecap="butt"
    />

    <path
      d="M45 319c90-34 161 32 243-5 67-31 113-26 179 8"
      fill="none"
      stroke="#111311"
      stroke-width="68"
      stroke-linecap="round"
    />

    <path
      d="M45 319c90-34 161 32 243-5 67-31 113-26 179 8"
      fill="none"
      stroke="#d1a829"
      stroke-width="54"
      stroke-linecap="round"
    />

    <path
      d="M45 319c90-34 161 32 243-5 67-31 113-26 179 8"
      fill="none"
      stroke="#1c1f1d"
      stroke-width="54"
      stroke-dasharray="42 42"
      stroke-linecap="butt"
    />

    <circle
      cx="53"
      cy="199"
      r="34"
      fill="#292f2c"
      stroke="#0f1210"
      stroke-width="10"
    />

    <circle
      cx="464"
      cy="194"
      r="34"
      fill="#292f2c"
      stroke="#0f1210"
      stroke-width="10"
    />
  </g>`),
};

async function arquivoExiste(
  caminho,
) {
  try {
    await access(caminho);

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

async function gerarPack() {
  await mkdir(
    PASTA_OBJETOS,
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
      ASSETS,
    )
  ) {
    const caminhoArquivo =
      path.join(
        PASTA_OBJETOS,
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
      "Pack inicial do Local de Ritual concluído.",
      `Criados: ${criados}.`,
      `Preservados: ${preservados}.`,
      `Objetos disponíveis: ${Object.keys(ASSETS).length}.`,
      `Pasta: ${PASTA_OBJETOS}`,
    ].join("\n"),
  );
}

gerarPack().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar o pack do Local de Ritual.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);