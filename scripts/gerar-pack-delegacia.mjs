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
    "delegacia",
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
        flood-opacity="0.45"
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
        flood-opacity="0.34"
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
        stop-color="#d5dbd8"
      />

      <stop
        offset="0.35"
        stop-color="#8b9691"
      />

      <stop
        offset="0.7"
        stop-color="#4a5551"
      />

      <stop
        offset="1"
        stop-color="#1b211f"
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
        stop-color="#5c6863"
      />

      <stop
        offset="0.48"
        stop-color="#343c39"
      />

      <stop
        offset="1"
        stop-color="#151918"
      />
    </linearGradient>

    <linearGradient
      id="madeira"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#b27a43"
      />

      <stop
        offset="0.52"
        stop-color="#754727"
      />

      <stop
        offset="1"
        stop-color="#382318"
      />
    </linearGradient>

    <linearGradient
      id="madeiraClara"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d3a267"
      />

      <stop
        offset="1"
        stop-color="#81502d"
      />
    </linearGradient>

    <linearGradient
      id="plastico"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#505b57"
      />

      <stop
        offset="0.55"
        stop-color="#272e2c"
      />

      <stop
        offset="1"
        stop-color="#111514"
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
        stop-color="#eee5c6"
      />

      <stop
        offset="0.55"
        stop-color="#c8b88d"
      />

      <stop
        offset="1"
        stop-color="#8c7956"
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
        stop-color="#d1f0ed"
        stop-opacity=".85"
      />

      <stop
        offset="0.46"
        stop-color="#60918f"
        stop-opacity=".64"
      />

      <stop
        offset="1"
        stop-color="#263d3d"
        stop-opacity=".9"
      />
    </linearGradient>

    <radialGradient
      id="tela"
      cx="50%"
      cy="45%"
      r="68%"
    >
      <stop
        offset="0"
        stop-color="#8ee9db"
      />

      <stop
        offset="0.5"
        stop-color="#387e78"
      />

      <stop
        offset="1"
        stop-color="#102524"
      />
    </radialGradient>

    <radialGradient
      id="vermelho"
      cx="42%"
      cy="36%"
      r="72%"
    >
      <stop
        offset="0"
        stop-color="#ff7468"
      />

      <stop
        offset="0.48"
        stop-color="#c93635"
      />

      <stop
        offset="1"
        stop-color="#5b171b"
      />
    </radialGradient>
  </defs>

${conteudo}
</svg>
`;
}

const ASSETS = {
  "balcao.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M63 166c0-31 25-56 56-56h274c31 0 56 25 56 56v230c0 31-25 56-56 56H119c-31 0-56-25-56-56V166Z"
      fill="#191c1b"
      stroke="#090b0a"
      stroke-width="18"
    />

    <rect
      x="84"
      y="132"
      width="344"
      height="293"
      rx="32"
      fill="url(#madeira)"
      stroke="#41281b"
      stroke-width="10"
    />

    <rect
      x="49"
      y="79"
      width="414"
      height="107"
      rx="27"
      fill="#222725"
      stroke="#0c0f0e"
      stroke-width="18"
    />

    <rect
      x="73"
      y="102"
      width="366"
      height="61"
      rx="15"
      fill="url(#madeiraClara)"
      stroke="#674023"
      stroke-width="8"
    />

    <path
      d="M104 209h304M104 288h304M104 367h304"
      stroke="#59351f"
      stroke-width="9"
      opacity=".78"
    />

    <rect
      x="181"
      y="227"
      width="150"
      height="91"
      rx="17"
      fill="#202624"
      stroke="#0d100f"
      stroke-width="10"
    />

    <path
      d="M208 263h96M208 286h72"
      stroke="#9aa59f"
      stroke-width="8"
      stroke-linecap="round"
    />

    <circle
      cx="367"
      cy="271"
      r="22"
      fill="#a72b31"
      stroke="#4b1116"
      stroke-width="7"
    />
  </g>`),

  "mesa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="62"
      y="89"
      width="388"
      height="255"
      rx="34"
      fill="#171a19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="86"
      y="113"
      width="340"
      height="207"
      rx="22"
      fill="url(#madeiraClara)"
      stroke="#654021"
      stroke-width="9"
    />

    <path
      d="M171 119v195M256 119v195M341 119v195"
      stroke="#764724"
      stroke-width="8"
      opacity=".75"
    />

    <path
      d="M110 169c66-21 112 16 183-3 48-13 81 8 110 1M108 254c79 17 136-15 213 4 31 8 59 0 82-8"
      fill="none"
      stroke="#87562f"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".65"
    />

    <path
      d="M112 339 75 452M400 339l37 113M174 339l-11 121M338 339l11 121"
      stroke="#38312a"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M59 450h105M348 450h105M123 466h83M306 466h83"
      stroke="#111413"
      stroke-width="13"
      stroke-linecap="round"
    />

    <rect
      x="194"
      y="170"
      width="124"
      height="82"
      rx="13"
      fill="#e8dfc3"
      stroke="#6a604d"
      stroke-width="7"
      transform="rotate(-5 256 211)"
    />

    <path
      d="M215 198h81M215 218h62"
      stroke="#716a58"
      stroke-width="6"
      stroke-linecap="round"
    />
  </g>`),

  "cadeira.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="135"
      y="57"
      width="242"
      height="244"
      rx="47"
      fill="#191d1b"
      stroke="#090b0a"
      stroke-width="18"
    />

    <rect
      x="159"
      y="80"
      width="194"
      height="197"
      rx="35"
      fill="url(#plastico)"
      stroke="#5e6863"
      stroke-width="9"
    />

    <path
      d="M179 119h154M179 164h154M179 209h154"
      stroke="#7c8781"
      stroke-width="7"
      opacity=".43"
    />

    <rect
      x="119"
      y="275"
      width="274"
      height="129"
      rx="39"
      fill="#202523"
      stroke="#0c0f0e"
      stroke-width="17"
    />

    <rect
      x="145"
      y="298"
      width="222"
      height="82"
      rx="26"
      fill="url(#plastico)"
      stroke="#59635e"
      stroke-width="8"
    />

    <path
      d="M163 395 111 475M349 395l52 80M183 400l-7 81M329 400l7 81"
      stroke="#424b47"
      stroke-width="24"
      stroke-linecap="round"
    />

    <path
      d="M87 475h75M350 475h75M143 481h72M297 481h72"
      stroke="#131716"
      stroke-width="12"
      stroke-linecap="round"
    />
  </g>`),

  "computador.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="72"
      y="58"
      width="368"
      height="284"
      rx="34"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="97"
      y="84"
      width="318"
      height="226"
      rx="19"
      fill="url(#tela)"
      stroke="#304744"
      stroke-width="10"
    />

    <path
      d="M128 129h111M128 163h174M128 197h92M128 231h147"
      stroke="#a1e6d8"
      stroke-width="9"
      stroke-linecap="round"
      opacity=".72"
    />

    <rect
      x="219"
      y="339"
      width="74"
      height="76"
      rx="12"
      fill="url(#metalEscuro)"
      stroke="#151a18"
      stroke-width="8"
    />

    <rect
      x="154"
      y="400"
      width="204"
      height="43"
      rx="17"
      fill="#202624"
      stroke="#0d100f"
      stroke-width="9"
    />

    <rect
      x="91"
      y="455"
      width="330"
      height="38"
      rx="15"
      fill="#343c39"
      stroke="#111514"
      stroke-width="8"
    />

    <path
      d="M121 474h271"
      stroke="#8a9690"
      stroke-width="6"
      stroke-dasharray="18 9"
      opacity=".65"
    />

    <circle
      cx="384"
      cy="321"
      r="10"
      fill="#57d17a"
    />
  </g>`),

  "telefone.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="89"
      y="168"
      width="334"
      height="276"
      rx="51"
      fill="#1a1e1c"
      stroke="#090b0a"
      stroke-width="18"
    />

    <rect
      x="118"
      y="198"
      width="276"
      height="217"
      rx="34"
      fill="url(#plastico)"
      stroke="#515b56"
      stroke-width="9"
    />

    <path
      d="M111 167c25-74 85-111 145-111s120 37 145 111l-56 34c-21-42-50-63-89-63s-68 21-89 63l-56-34Z"
      fill="#202422"
      stroke="#0b0e0d"
      stroke-width="17"
      stroke-linejoin="round"
    />

    <path
      d="M146 144c28-33 64-52 110-52s82 19 110 52"
      fill="none"
      stroke="#626c67"
      stroke-width="14"
      stroke-linecap="round"
    />

    <rect
      x="170"
      y="216"
      width="172"
      height="63"
      rx="13"
      fill="#b4c1b8"
      stroke="#303a36"
      stroke-width="7"
    />

    <path
      d="M192 248h128"
      stroke="#48564f"
      stroke-width="7"
      stroke-linecap="round"
    />

    <g
      fill="#aeb6b0"
      stroke="#252b29"
      stroke-width="5"
    >
      <circle cx="183" cy="322" r="19" />
      <circle cx="256" cy="322" r="19" />
      <circle cx="329" cy="322" r="19" />
      <circle cx="183" cy="375" r="19" />
      <circle cx="256" cy="375" r="19" />
      <circle cx="329" cy="375" r="19" />
    </g>

    <path
      d="M104 311c-49 31-57 91-31 137"
      fill="none"
      stroke="#202523"
      stroke-width="22"
      stroke-linecap="round"
    />
  </g>`),

  "arquivo.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="75"
      y="54"
      width="362"
      height="406"
      rx="31"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="99"
      y="79"
      width="314"
      height="356"
      rx="19"
      fill="url(#metalEscuro)"
      stroke="#59635e"
      stroke-width="9"
    />

    <rect
      x="122"
      y="111"
      width="268"
      height="128"
      rx="15"
      fill="#313a36"
      stroke="#121615"
      stroke-width="9"
    />

    <rect
      x="122"
      y="272"
      width="268"
      height="128"
      rx="15"
      fill="#313a36"
      stroke="#121615"
      stroke-width="9"
    />

    <rect
      x="207"
      y="142"
      width="98"
      height="42"
      rx="10"
      fill="#c4c6b9"
      stroke="#4b514d"
      stroke-width="6"
    />

    <rect
      x="207"
      y="303"
      width="98"
      height="42"
      rx="10"
      fill="#c4c6b9"
      stroke="#4b514d"
      stroke-width="6"
    />

    <rect
      x="220"
      y="196"
      width="72"
      height="19"
      rx="9"
      fill="#9da7a1"
    />

    <rect
      x="220"
      y="357"
      width="72"
      height="19"
      rx="9"
      fill="#9da7a1"
    />

    <circle
      cx="371"
      cy="419"
      r="12"
      fill="#a52d32"
    />
  </g>`),

  "armario.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="77"
      y="52"
      width="358"
      height="410"
      rx="31"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="101"
      y="77"
      width="310"
      height="360"
      rx="18"
      fill="url(#metalEscuro)"
      stroke="#58625d"
      stroke-width="9"
    />

    <path
      d="M256 80v354"
      stroke="#151918"
      stroke-width="12"
    />

    <path
      d="M120 152h117M275 152h117M120 349h117M275 349h117"
      stroke="#77817c"
      stroke-width="8"
      opacity=".55"
    />

    <g fill="#b3bbb6" stroke="#2c3330" stroke-width="5">
      <rect
        x="210"
        y="210"
        width="20"
        height="80"
        rx="9"
      />

      <rect
        x="282"
        y="210"
        width="20"
        height="80"
        rx="9"
      />
    </g>

    <rect
      x="96"
      y="432"
      width="76"
      height="30"
      rx="8"
      fill="#181c1b"
    />

    <rect
      x="340"
      y="432"
      width="76"
      height="30"
      rx="8"
      fill="#181c1b"
    />
  </g>`),

  "grade.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="54"
      y="59"
      width="404"
      height="395"
      rx="22"
      fill="#111413"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="78"
      y="82"
      width="356"
      height="349"
      rx="12"
      fill="#222826"
      stroke="#59635e"
      stroke-width="9"
    />

    <g
      stroke="url(#metal)"
      stroke-width="25"
      stroke-linecap="round"
    >
      <path d="M113 93v327" />
      <path d="M184 93v327" />
      <path d="M256 93v327" />
      <path d="M328 93v327" />
      <path d="M399 93v327" />
    </g>

    <g
      stroke="#111514"
      stroke-width="11"
    >
      <path d="M82 173h348" />
      <path d="M82 256h348" />
      <path d="M82 339h348" />
    </g>

    <rect
      x="342"
      y="221"
      width="74"
      height="83"
      rx="13"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="9"
    />

    <circle
      cx="379"
      cy="262"
      r="13"
      fill="#b5bcb6"
      stroke="#343b38"
      stroke-width="5"
    />
  </g>`),

  "banco-de-cela.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="61"
      y="145"
      width="390"
      height="187"
      rx="27"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="84"
      y="168"
      width="344"
      height="141"
      rx="16"
      fill="url(#metalEscuro)"
      stroke="#606a65"
      stroke-width="9"
    />

    <path
      d="M132 179v118M194 179v118M256 179v118M318 179v118M380 179v118"
      stroke="#77827c"
      stroke-width="8"
      opacity=".52"
    />

    <path
      d="M105 331 74 443M407 331l31 112M175 331l-7 117M337 331l7 117"
      stroke="#424b47"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M57 445h102M353 445h102M130 457h78M304 457h78"
      stroke="#111514"
      stroke-width="13"
      stroke-linecap="round"
    />

    <rect
      x="196"
      y="212"
      width="120"
      height="53"
      rx="13"
      fill="#222725"
      stroke="#0d100f"
      stroke-width="7"
    />

    <path
      d="M220 238h72"
      stroke="#9da6a1"
      stroke-width="7"
      stroke-linecap="round"
    />
  </g>`),

  "camera.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M109 174h236c41 0 74 33 74 74v60c0 41-33 74-74 74H109c-41 0-74-33-74-74v-60c0-41 33-74 74-74Z"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <path
      d="M84 200h243c34 0 62 28 62 62v33c0 34-28 62-62 62H84c-14 0-25-11-25-25V225c0-14 11-25 25-25Z"
      fill="url(#metalEscuro)"
      stroke="#5b6560"
      stroke-width="9"
    />

    <circle
      cx="320"
      cy="278"
      r="83"
      fill="#101413"
      stroke="#080a09"
      stroke-width="12"
    />

    <circle
      cx="320"
      cy="278"
      r="57"
      fill="url(#vidro)"
      stroke="#527170"
      stroke-width="9"
    />

    <circle
      cx="320"
      cy="278"
      r="27"
      fill="#0a1516"
      stroke="#83aaa8"
      stroke-width="7"
    />

    <circle
      cx="301"
      cy="258"
      r="10"
      fill="#d9f7f3"
      opacity=".76"
    />

    <rect
      x="113"
      y="237"
      width="103"
      height="77"
      rx="14"
      fill="#222826"
      stroke="#0c0f0e"
      stroke-width="8"
    />

    <circle
      cx="164"
      cy="276"
      r="18"
      fill="url(#vermelho)"
    />

    <path
      d="M161 382v65M115 446h93"
      stroke="#4f5954"
      stroke-width="25"
      stroke-linecap="round"
    />
  </g>`),

  "monitor.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="56"
      y="54"
      width="400"
      height="323"
      rx="37"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="84"
      y="82"
      width="344"
      height="267"
      rx="22"
      fill="#0b1716"
      stroke="#304946"
      stroke-width="10"
    />

    <rect
      x="101"
      y="99"
      width="154"
      height="112"
      rx="12"
      fill="url(#tela)"
      stroke="#405d59"
      stroke-width="7"
    />

    <rect
      x="273"
      y="99"
      width="137"
      height="112"
      rx="12"
      fill="url(#tela)"
      stroke="#405d59"
      stroke-width="7"
    />

    <rect
      x="101"
      y="229"
      width="137"
      height="101"
      rx="12"
      fill="url(#tela)"
      stroke="#405d59"
      stroke-width="7"
    />

    <rect
      x="256"
      y="229"
      width="154"
      height="101"
      rx="12"
      fill="url(#tela)"
      stroke="#405d59"
      stroke-width="7"
    />

    <g
      fill="none"
      stroke="#b5e8df"
      stroke-width="5"
      opacity=".6"
    >
      <path d="M118 180c32-47 69 23 115-32" />
      <path d="M288 174c25-41 62 10 101-27" />
      <path d="M116 302c38-40 71 20 103-25" />
      <path d="M273 304c37-50 73 10 118-30" />
    </g>

    <path
      d="M225 378h62v64h-62z"
      fill="url(#metalEscuro)"
      stroke="#161a18"
      stroke-width="8"
    />

    <rect
      x="154"
      y="429"
      width="204"
      height="43"
      rx="16"
      fill="#222725"
      stroke="#0d100f"
      stroke-width="9"
    />

    <circle
      cx="424"
      cy="361"
      r="9"
      fill="#54d377"
    />
  </g>`),

  "quadro-de-investigacao.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="44"
      y="50"
      width="424"
      height="411"
      rx="30"
      fill="#19130f"
      stroke="#090706"
      stroke-width="18"
    />

    <rect
      x="70"
      y="76"
      width="372"
      height="359"
      rx="18"
      fill="#684b35"
      stroke="#2d1f17"
      stroke-width="10"
    />

    <g
      fill="url(#papel)"
      stroke="#5c503b"
      stroke-width="5"
    >
      <rect
        x="96"
        y="103"
        width="112"
        height="91"
        rx="8"
        transform="rotate(-5 152 148)"
      />

      <rect
        x="284"
        y="98"
        width="123"
        height="94"
        rx="8"
        transform="rotate(4 345 145)"
      />

      <rect
        x="182"
        y="219"
        width="137"
        height="108"
        rx="8"
        transform="rotate(-3 250 273)"
      />

      <rect
        x="93"
        y="316"
        width="109"
        height="82"
        rx="8"
        transform="rotate(5 147 357)"
      />

      <rect
        x="321"
        y="303"
        width="91"
        height="94"
        rx="8"
        transform="rotate(-6 366 350)"
      />
    </g>

    <g
      fill="#a62d34"
      stroke="#4a1116"
      stroke-width="4"
    >
      <circle cx="153" cy="147" r="10" />
      <circle cx="345" cy="146" r="10" />
      <circle cx="251" cy="272" r="10" />
      <circle cx="147" cy="357" r="10" />
      <circle cx="367" cy="350" r="10" />
    </g>

    <g
      fill="none"
      stroke="#b72e36"
      stroke-width="7"
      stroke-linecap="round"
    >
      <path d="M153 147 251 272 345 146" />
      <path d="M251 272 147 357" />
      <path d="M251 272 367 350" />
      <path d="M147 357 367 350" />
    </g>

    <path
      d="M110 129h68M110 151h55M304 126h76M207 249h89M207 276h67M112 344h65M337 332h61"
      stroke="#716650"
      stroke-width="6"
      stroke-linecap="round"
      opacity=".67"
    />
  </g>`),

  "caixa-de-evidencia.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="62"
      y="85"
      width="388"
      height="346"
      rx="31"
      fill="#1b201e"
      stroke="#090b0a"
      stroke-width="18"
    />

    <rect
      x="86"
      y="109"
      width="340"
      height="298"
      rx="20"
      fill="#5d6c66"
      stroke="#252d2a"
      stroke-width="10"
    />

    <rect
      x="105"
      y="139"
      width="302"
      height="213"
      rx="14"
      fill="url(#vidro)"
      stroke="#405653"
      stroke-width="8"
    />

    <path
      d="M128 162h256M128 330h256"
      stroke="#d1e6df"
      stroke-width="7"
      opacity=".38"
    />

    <rect
      x="146"
      y="191"
      width="220"
      height="112"
      rx="14"
      fill="#e4dac0"
      stroke="#605746"
      stroke-width="8"
    />

    <path
      d="M174 226h164M174 250h130M174 274h96"
      stroke="#716957"
      stroke-width="7"
      stroke-linecap="round"
    />

    <rect
      x="196"
      y="363"
      width="120"
      height="38"
      rx="11"
      fill="#202624"
      stroke="#0c0f0e"
      stroke-width="7"
    />

    <path
      d="M221 382h70"
      stroke="#abb4ae"
      stroke-width="6"
      stroke-linecap="round"
    />

    <path
      d="M94 83 140 43h232l46 40"
      fill="none"
      stroke="#48524e"
      stroke-width="22"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>`),

  "estante.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="60"
      y="49"
      width="392"
      height="418"
      rx="31"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="85"
      y="74"
      width="342"
      height="368"
      rx="18"
      fill="url(#metalEscuro)"
      stroke="#59645f"
      stroke-width="9"
    />

    <path
      d="M91 160h330M91 252h330M91 344h330"
      stroke="#808b85"
      stroke-width="14"
    />

    <path
      d="M113 92v332M399 92v332"
      stroke="#202624"
      stroke-width="15"
    />

    <g
      fill="#8c704f"
      stroke="#362719"
      stroke-width="6"
    >
      <rect x="125" y="102" width="80" height="49" rx="8" />
      <rect x="224" y="94" width="105" height="57" rx="8" />
      <rect x="344" y="107" width="43" height="44" rx="8" />

      <rect x="121" y="185" width="111" height="57" rx="8" />
      <rect x="249" y="192" width="69" height="50" rx="8" />
      <rect x="337" y="181" width="51" height="61" rx="8" />

      <rect x="125" y="276" width="74" height="58" rx="8" />
      <rect x="216" y="283" width="118" height="51" rx="8" />
      <rect x="351" y="278" width="38" height="56" rx="8" />

      <rect x="118" y="369" width="124" height="57" rx="8" />
      <rect x="259" y="375" width="75" height="51" rx="8" />
      <rect x="350" y="367" width="41" height="59" rx="8" />
    </g>

    <g
      fill="#d6cba8"
      opacity=".72"
    >
      <rect x="143" y="118" width="43" height="7" rx="3" />
      <rect x="247" y="113" width="58" height="7" rx="3" />
      <rect x="145" y="207" width="63" height="7" rx="3" />
      <rect x="239" y="305" width="69" height="7" rx="3" />
      <rect x="144" y="394" width="72" height="7" rx="3" />
    </g>
  </g>`),

  "extintor.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M170 175c0-36 29-65 65-65h42c36 0 65 29 65 65v244c0 36-29 65-65 65h-42c-36 0-65-29-65-65V175Z"
      fill="#171312"
      stroke="#080606"
      stroke-width="18"
    />

    <path
      d="M193 184c0-27 22-49 49-49h28c27 0 49 22 49 49v225c0 27-22 49-49 49h-28c-27 0-49-22-49-49V184Z"
      fill="url(#vermelho)"
      stroke="#67181b"
      stroke-width="9"
    />

    <rect
      x="211"
      y="67"
      width="90"
      height="83"
      rx="19"
      fill="url(#metalEscuro)"
      stroke="#111514"
      stroke-width="10"
    />

    <path
      d="M226 85h93c33 0 60 27 60 60v20"
      fill="none"
      stroke="#222725"
      stroke-width="22"
      stroke-linecap="round"
    />

    <path
      d="M376 162c68 19 79 95 33 132"
      fill="none"
      stroke="#252a28"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M407 292 372 333"
      stroke="#252a28"
      stroke-width="24"
      stroke-linecap="round"
    />

    <rect
      x="213"
      y="230"
      width="86"
      height="112"
      rx="13"
      fill="#e7e0c7"
      stroke="#665e4c"
      stroke-width="7"
    />

    <path
      d="M232 258h48M232 280h48M232 302h35"
      stroke="#6d6552"
      stroke-width="6"
      stroke-linecap="round"
    />

    <circle
      cx="256"
      cy="111"
      r="18"
      fill="#d5ddd7"
      stroke="#414a46"
      stroke-width="6"
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
      "Pack inicial da Delegacia concluído.",
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
      "Não foi possível gerar o pack da Delegacia.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);