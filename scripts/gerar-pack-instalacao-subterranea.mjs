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
    "instalacao-subterranea",
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
        dy="14"
        stdDeviation="13"
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
        stop-color="#d8dfdc"
      />

      <stop
        offset="0.34"
        stop-color="#899590"
      />

      <stop
        offset="0.7"
        stop-color="#424c48"
      />

      <stop
        offset="1"
        stop-color="#171c1a"
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
        stop-color="#59645f"
      />

      <stop
        offset="0.5"
        stop-color="#303735"
      />

      <stop
        offset="1"
        stop-color="#111514"
      />
    </linearGradient>

    <linearGradient
      id="metalAzulado"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#9eafb0"
      />

      <stop
        offset="0.5"
        stop-color="#53686b"
      />

      <stop
        offset="1"
        stop-color="#243538"
      />
    </linearGradient>

    <linearGradient
      id="tela"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#a9fff3"
      />

      <stop
        offset="0.45"
        stop-color="#39aa9f"
      />

      <stop
        offset="1"
        stop-color="#102c2d"
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
        stop-color="#66776d"
      />

      <stop
        offset="0.5"
        stop-color="#3e4b43"
      />

      <stop
        offset="1"
        stop-color="#1e2822"
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
        stop-color="#a87546"
      />

      <stop
        offset="0.5"
        stop-color="#704528"
      />

      <stop
        offset="1"
        stop-color="#332116"
      />
    </linearGradient>

    <radialGradient
      id="alertaVermelho"
      cx="38%"
      cy="32%"
      r="72%"
    >
      <stop
        offset="0"
        stop-color="#ff9b89"
      />

      <stop
        offset="0.48"
        stop-color="#dc3d3a"
      />

      <stop
        offset="1"
        stop-color="#67161a"
      />
    </radialGradient>

    <radialGradient
      id="alertaAmarelo"
      cx="38%"
      cy="32%"
      r="72%"
    >
      <stop
        offset="0"
        stop-color="#fff2a0"
      />

      <stop
        offset="0.48"
        stop-color="#dfa72d"
      />

      <stop
        offset="1"
        stop-color="#6b4716"
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
        fill="#d3aa2d"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#202422"
      />
    </pattern>
  </defs>

${conteudo}
</svg>
`;
}

const ASSETS = {
  "painel.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="55"
      y="58"
      width="402"
      height="396"
      rx="42"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="82"
      y="85"
      width="348"
      height="342"
      rx="28"
      fill="url(#metalEscuro)"
      stroke="#5b6661"
      stroke-width="9"
    />

    <rect
      x="108"
      y="113"
      width="211"
      height="133"
      rx="18"
      fill="#0b1717"
      stroke="#324a48"
      stroke-width="8"
    />

    <path
      d="M132 213c23-48 47 17 73-14 24-29 44-8 87-47"
      fill="none"
      stroke="#a7fff1"
      stroke-width="8"
      stroke-linecap="round"
    />

    <g
      fill="url(#alertaVermelho)"
      stroke="#551317"
      stroke-width="5"
    >
      <circle
        cx="369"
        cy="138"
        r="18"
      />

      <circle
        cx="369"
        cy="198"
        r="18"
      />
    </g>

    <rect
      x="108"
      y="276"
      width="296"
      height="119"
      rx="20"
      fill="#202725"
      stroke="#0d100f"
      stroke-width="9"
    />

    <g fill="#78847e">
      <rect
        x="137"
        y="306"
        width="59"
        height="59"
        rx="9"
      />

      <rect
        x="214"
        y="306"
        width="59"
        height="59"
        rx="9"
      />

      <rect
        x="291"
        y="306"
        width="59"
        height="59"
        rx="9"
      />
    </g>

    <circle
      cx="376"
      cy="336"
      r="34"
      fill="#102628"
      stroke="#3a807e"
      stroke-width="8"
    />

    <circle
      cx="376"
      cy="336"
      r="15"
      fill="#9ffff6"
    />
  </g>`),

  "computador.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="68"
      y="55"
      width="376"
      height="287"
      rx="36"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="94"
      y="82"
      width="324"
      height="228"
      rx="21"
      fill="url(#tela)"
      stroke="#31504e"
      stroke-width="10"
    />

    <path
      d="M125 130h116M125 164h181M125 198h95M125 232h152"
      stroke="#c2fff4"
      stroke-width="9"
      stroke-linecap="round"
      opacity=".72"
    />

    <path
      d="M286 136c24 18 34 40 42 69 7 25 19 42 48 57"
      fill="none"
      stroke="#e0fff8"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".7"
    />

    <rect
      x="218"
      y="340"
      width="76"
      height="76"
      rx="13"
      fill="url(#metalEscuro)"
      stroke="#151a18"
      stroke-width="8"
    />

    <rect
      x="153"
      y="401"
      width="206"
      height="43"
      rx="17"
      fill="#202624"
      stroke="#0d100f"
      stroke-width="9"
    />

    <rect
      x="88"
      y="456"
      width="336"
      height="38"
      rx="15"
      fill="#333c38"
      stroke="#111514"
      stroke-width="8"
    />

    <path
      d="M118 475h276"
      stroke="#9eaaa4"
      stroke-width="6"
      stroke-dasharray="18 9"
      opacity=".65"
    />

    <circle
      cx="387"
      cy="322"
      r="10"
      fill="#61dd7f"
    />
  </g>`),

  "servidor.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="72"
      y="40"
      width="368"
      height="432"
      rx="35"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="97"
      y="65"
      width="318"
      height="382"
      rx="22"
      fill="url(#metalEscuro)"
      stroke="#59645f"
      stroke-width="9"
    />

    <g
      fill="#111615"
      stroke="#080a09"
      stroke-width="7"
    >
      <rect
        x="123"
        y="93"
        width="266"
        height="68"
        rx="12"
      />

      <rect
        x="123"
        y="176"
        width="266"
        height="68"
        rx="12"
      />

      <rect
        x="123"
        y="259"
        width="266"
        height="68"
        rx="12"
      />

      <rect
        x="123"
        y="342"
        width="266"
        height="68"
        rx="12"
      />
    </g>

    <g fill="#55db7a">
      <circle
        cx="151"
        cy="127"
        r="9"
      />

      <circle
        cx="151"
        cy="210"
        r="9"
      />

      <circle
        cx="151"
        cy="293"
        r="9"
      />

      <circle
        cx="151"
        cy="376"
        r="9"
      />
    </g>

    <g fill="#e0a644">
      <circle
        cx="181"
        cy="127"
        r="9"
      />

      <circle
        cx="181"
        cy="210"
        r="9"
      />

      <circle
        cx="181"
        cy="293"
        r="9"
      />

      <circle
        cx="181"
        cy="376"
        r="9"
      />
    </g>

    <g
      stroke="#78857e"
      stroke-width="8"
      stroke-linecap="round"
    >
      <path d="M215 117h144" />
      <path d="M215 138h105" />

      <path d="M215 200h144" />
      <path d="M215 221h105" />

      <path d="M215 283h144" />
      <path d="M215 304h105" />

      <path d="M215 366h144" />
      <path d="M215 387h105" />
    </g>
  </g>`),

  "gerador.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="54"
      y="90"
      width="404"
      height="335"
      rx="45"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="80"
      y="116"
      width="352"
      height="283"
      rx="29"
      fill="url(#metalEscuro)"
      stroke="#59645f"
      stroke-width="9"
    />

    <rect
      x="105"
      y="145"
      width="177"
      height="124"
      rx="19"
      fill="#0c1717"
      stroke="#304743"
      stroke-width="8"
    />

    <path
      d="M130 239c24-53 46 14 70-24 24-40 40 8 60-27"
      fill="none"
      stroke="#8eeedd"
      stroke-width="8"
      stroke-linecap="round"
    />

    <circle
      cx="353"
      cy="206"
      r="67"
      fill="#18130f"
      stroke="#0b0907"
      stroke-width="10"
    />

    <path
      d="m353 148 19 41 45 4-35 30 11 44-40-24-40 24 11-44-35-30 45-4 19-41Z"
      fill="url(#alertaAmarelo)"
      stroke="#6a5018"
      stroke-width="7"
    />

    <rect
      x="107"
      y="300"
      width="298"
      height="65"
      rx="15"
      fill="#101312"
      stroke="#4e5954"
      stroke-width="8"
    />

    <circle
      cx="149"
      cy="332"
      r="12"
      fill="#d43b3f"
    />

    <circle
      cx="190"
      cy="332"
      r="12"
      fill="#d7a333"
    />

    <circle
      cx="121"
      cy="425"
      r="36"
      fill="#212624"
      stroke="#0b0e0d"
      stroke-width="11"
    />

    <circle
      cx="391"
      cy="425"
      r="36"
      fill="#212624"
      stroke="#0b0e0d"
      stroke-width="11"
    />
  </g>`),

  "cabo.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M47 348c58-158 201-38 248-165 38-103 122-64 171-14"
      fill="none"
      stroke="#080a09"
      stroke-width="43"
      stroke-linecap="round"
    />

    <path
      d="M47 348c58-158 201-38 248-165 38-103 122-64 171-14"
      fill="none"
      stroke="#2c3431"
      stroke-width="29"
      stroke-linecap="round"
    />

    <path
      d="M47 348c58-158 201-38 248-165 38-103 122-64 171-14"
      fill="none"
      stroke="#d1992a"
      stroke-width="8"
      stroke-linecap="round"
      opacity=".85"
    />

    <rect
      x="27"
      y="317"
      width="81"
      height="70"
      rx="15"
      fill="#313836"
      stroke="#111413"
      stroke-width="10"
    />

    <rect
      x="404"
      y="124"
      width="81"
      height="76"
      rx="15"
      fill="#313836"
      stroke="#111413"
      stroke-width="10"
    />

    <g fill="#c2ccc6">
      <rect
        x="42"
        y="333"
        width="16"
        height="37"
        rx="4"
      />

      <rect
        x="76"
        y="333"
        width="16"
        height="37"
        rx="4"
      />

      <rect
        x="419"
        y="140"
        width="16"
        height="43"
        rx="4"
      />

      <rect
        x="452"
        y="140"
        width="16"
        height="43"
        rx="4"
      />
    </g>
  </g>`),

  "caixa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="66"
      y="67"
      width="380"
      height="380"
      rx="29"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="90"
      y="91"
      width="332"
      height="332"
      rx="18"
      fill="url(#metalAzulado)"
      stroke="#384947"
      stroke-width="9"
    />

    <path
      d="M101 168h310M101 256h310M101 344h310"
      stroke="#394947"
      stroke-width="9"
    />

    <path
      d="M111 117 400 398M401 117 113 399"
      stroke="#263331"
      stroke-width="30"
    />

    <path
      d="M111 117 400 398M401 117 113 399"
      stroke="#657875"
      stroke-width="13"
    />

    <rect
      x="204"
      y="204"
      width="104"
      height="104"
      rx="16"
      fill="#141918"
      stroke="#080a09"
      stroke-width="10"
    />

    <circle
      cx="256"
      cy="256"
      r="29"
      fill="url(#alertaAmarelo)"
      stroke="#594117"
      stroke-width="7"
    />

    <g
      fill="#505b56"
      stroke="#111514"
      stroke-width="8"
    >
      <rect
        x="66"
        y="67"
        width="71"
        height="71"
        rx="12"
      />

      <rect
        x="375"
        y="67"
        width="71"
        height="71"
        rx="12"
      />

      <rect
        x="66"
        y="376"
        width="71"
        height="71"
        rx="12"
      />

      <rect
        x="375"
        y="376"
        width="71"
        height="71"
        rx="12"
      />
    </g>
  </g>`),

  "armario.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="75"
      y="49"
      width="362"
      height="416"
      rx="34"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="99"
      y="74"
      width="314"
      height="366"
      rx="20"
      fill="url(#metalEscuro)"
      stroke="#5b6661"
      stroke-width="9"
    />

    <path
      d="M256 77v360"
      stroke="#151918"
      stroke-width="13"
    />

    <path
      d="M119 151h117M276 151h117M119 349h117M276 349h117"
      stroke="#7f8a84"
      stroke-width="8"
      opacity=".55"
    />

    <rect
      x="208"
      y="214"
      width="21"
      height="83"
      rx="10"
      fill="url(#metal)"
      stroke="#303734"
      stroke-width="5"
    />

    <rect
      x="283"
      y="214"
      width="21"
      height="83"
      rx="10"
      fill="url(#metal)"
      stroke="#303734"
      stroke-width="5"
    />

    <circle
      cx="382"
      cy="110"
      r="11"
      fill="url(#alertaVermelho)"
    />

    <rect
      x="96"
      y="435"
      width="77"
      height="30"
      rx="8"
      fill="#181c1b"
    />

    <rect
      x="339"
      y="435"
      width="77"
      height="30"
      rx="8"
      fill="#181c1b"
    />
  </g>`),

  "beliche.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="77"
      y="64"
      width="358"
      height="380"
      rx="34"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="100"
      y="87"
      width="312"
      height="139"
      rx="22"
      fill="url(#tecido)"
      stroke="#2c3831"
      stroke-width="9"
    />

    <rect
      x="100"
      y="282"
      width="312"
      height="139"
      rx="22"
      fill="url(#tecido)"
      stroke="#2c3831"
      stroke-width="9"
    />

    <rect
      x="121"
      y="107"
      width="128"
      height="61"
      rx="25"
      fill="#aeb9ae"
      stroke="#59645c"
      stroke-width="7"
    />

    <rect
      x="121"
      y="302"
      width="128"
      height="61"
      rx="25"
      fill="#aeb9ae"
      stroke="#59645c"
      stroke-width="7"
    />

    <g
      stroke="url(#metal)"
      stroke-width="22"
      stroke-linecap="round"
    >
      <path d="M87 75v390" />
      <path d="M425 75v390" />
      <path d="M86 248h340" />
    </g>

    <g
      stroke="#75817b"
      stroke-width="14"
      stroke-linecap="round"
    >
      <path d="M363 184v157" />
      <path d="M337 207h51" />
      <path d="M337 248h51" />
      <path d="M337 289h51" />
      <path d="M337 330h51" />
    </g>
  </g>`),

  "mesa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="57"
      y="91"
      width="398"
      height="266"
      rx="40"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="82"
      y="116"
      width="348"
      height="216"
      rx="26"
      fill="url(#metalAzulado)"
      stroke="#425451"
      stroke-width="9"
    />

    <path
      d="M169 122v204M256 122v204M343 122v204"
      stroke="#536966"
      stroke-width="8"
      opacity=".7"
    />

    <path
      d="M113 351 74 460M399 351l39 109M179 351l-11 117M333 351l11 117"
      stroke="#414a46"
      stroke-width="26"
      stroke-linecap="round"
    />

    <path
      d="M55 461h111M346 461h111M127 473h82M303 473h82"
      stroke="#111514"
      stroke-width="14"
      stroke-linecap="round"
    />

    <rect
      x="187"
      y="174"
      width="138"
      height="91"
      rx="15"
      fill="#141918"
      stroke="#080a09"
      stroke-width="8"
    />

    <path
      d="M211 208h90M211 232h64"
      stroke="#92a19a"
      stroke-width="7"
      stroke-linecap="round"
    />
  </g>`),

  "cadeira.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="140"
      y="53"
      width="232"
      height="248"
      rx="49"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="164"
      y="77"
      width="184"
      height="200"
      rx="36"
      fill="url(#tecido)"
      stroke="#425048"
      stroke-width="9"
    />

    <path
      d="M184 123h144M184 166h144M184 209h144"
      stroke="#88988d"
      stroke-width="7"
      opacity=".38"
    />

    <rect
      x="121"
      y="275"
      width="270"
      height="135"
      rx="42"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="17"
    />

    <rect
      x="147"
      y="299"
      width="218"
      height="87"
      rx="28"
      fill="url(#tecido)"
      stroke="#425048"
      stroke-width="9"
    />

    <path
      d="M162 400 110 478M350 400l52 78M184 405l-7 78M328 405l7 78"
      stroke="#414a46"
      stroke-width="24"
      stroke-linecap="round"
    />

    <path
      d="M85 479h79M348 479h79M143 485h73M296 485h73"
      stroke="#111514"
      stroke-width="12"
      stroke-linecap="round"
    />
  </g>`),

  "equipamento.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="55"
      y="64"
      width="402"
      height="386"
      rx="43"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="81"
      y="90"
      width="350"
      height="334"
      rx="28"
      fill="url(#metalEscuro)"
      stroke="#5a6560"
      stroke-width="9"
    />

    <rect
      x="108"
      y="119"
      width="208"
      height="132"
      rx="18"
      fill="#0c1818"
      stroke="#344c49"
      stroke-width="8"
    />

    <path
      d="M132 218c24-48 48 18 73-14 25-31 44-8 84-45"
      fill="none"
      stroke="#abfff2"
      stroke-width="8"
      stroke-linecap="round"
    />

    <g
      fill="url(#alertaVermelho)"
      stroke="#581418"
      stroke-width="5"
    >
      <circle
        cx="368"
        cy="143"
        r="18"
      />

      <circle
        cx="368"
        cy="205"
        r="18"
      />
    </g>

    <rect
      x="108"
      y="281"
      width="297"
      height="113"
      rx="20"
      fill="#202725"
      stroke="#0d100f"
      stroke-width="9"
    />

    <g fill="#76827c">
      <rect
        x="137"
        y="311"
        width="59"
        height="55"
        rx="9"
      />

      <rect
        x="214"
        y="311"
        width="59"
        height="55"
        rx="9"
      />

      <rect
        x="291"
        y="311"
        width="59"
        height="55"
        rx="9"
      />
    </g>

    <circle
      cx="377"
      cy="338"
      r="34"
      fill="#24200f"
      stroke="#8b6e24"
      stroke-width="8"
    />

    <circle
      cx="377"
      cy="338"
      r="15"
      fill="#ffe47a"
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
      fill="url(#tela)"
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
      fill="url(#alertaVermelho)"
    />

    <path
      d="M161 382v65M115 446h93"
      stroke="#4f5954"
      stroke-width="25"
      stroke-linecap="round"
    />
  </g>`),

  "porta-metalica.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="54"
      y="46"
      width="404"
      height="420"
      rx="28"
      fill="#111514"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="79"
      y="71"
      width="354"
      height="370"
      rx="17"
      fill="url(#metalEscuro)"
      stroke="#69746f"
      stroke-width="10"
    />

    <path
      d="M96 145h320M96 256h320M96 367h320"
      stroke="#1c2220"
      stroke-width="12"
    />

    <path
      d="M163 81v350M349 81v350"
      stroke="#49534f"
      stroke-width="11"
    />

    <rect
      x="196"
      y="183"
      width="120"
      height="146"
      rx="18"
      fill="#111514"
      stroke="#080a09"
      stroke-width="10"
    />

    <circle
      cx="256"
      cy="256"
      r="42"
      fill="url(#alertaVermelho)"
      stroke="#5a1519"
      stroke-width="8"
    />

    <path
      d="M256 226v60M226 256h60"
      stroke="#f1c7b8"
      stroke-width="9"
      stroke-linecap="round"
    />

    <path
      d="M103 105h306"
      stroke="url(#perigo)"
      stroke-width="38"
    />

    <rect
      x="342"
      y="208"
      width="62"
      height="96"
      rx="14"
      fill="#202725"
      stroke="#0d100f"
      stroke-width="8"
    />

    <circle
      cx="373"
      cy="256"
      r="12"
      fill="#a6b1ab"
    />
  </g>`),

  "tubulacao.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M49 114h254c72 0 130 58 130 130v216"
      fill="none"
      stroke="#111514"
      stroke-width="76"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      d="M49 114h254c72 0 130 58 130 130v216"
      fill="none"
      stroke="url(#metalAzulado)"
      stroke-width="54"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <g
      fill="#303936"
      stroke="#111514"
      stroke-width="8"
    >
      <circle
        cx="111"
        cy="114"
        r="48"
      />

      <circle
        cx="256"
        cy="114"
        r="48"
      />

      <circle
        cx="433"
        cy="257"
        r="48"
      />

      <circle
        cx="433"
        cy="404"
        r="48"
      />
    </g>

    <g
      fill="#83908a"
      stroke="#28312e"
      stroke-width="6"
    >
      <circle
        cx="111"
        cy="114"
        r="30"
      />

      <circle
        cx="256"
        cy="114"
        r="30"
      />

      <circle
        cx="433"
        cy="257"
        r="30"
      />

      <circle
        cx="433"
        cy="404"
        r="30"
      />
    </g>

    <path
      d="M110 84v60M80 114h60M433 227v60M403 257h60"
      stroke="#323b38"
      stroke-width="8"
      stroke-linecap="round"
    />
  </g>`),

  "entulho.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <g
      stroke="#161918"
      stroke-width="9"
      stroke-linejoin="round"
    >
      <path
        d="m66 372 73-126 121 41-34 145-160-60Z"
        fill="#5b625e"
      />

      <path
        d="m157 215 81-137 107 79-45 126-143-68Z"
        fill="#737b76"
      />

      <path
        d="m276 302 106-112 88 126-91 107-103-121Z"
        fill="#4b5350"
      />

      <path
        d="m177 381 113-105 77 135-126 63-64-93Z"
        fill="#666d69"
      />

      <path
        d="m56 278 52-97 78 47-38 101-92-51Z"
        fill="#858c87"
      />
    </g>

    <g
      fill="#303735"
      stroke="#111514"
      stroke-width="7"
    >
      <circle
        cx="112"
        cy="400"
        r="31"
      />

      <circle
        cx="415"
        cy="391"
        r="29"
      />

      <circle
        cx="363"
        cy="154"
        r="24"
      />

      <circle
        cx="87"
        cy="167"
        r="22"
      />
    </g>

    <path
      d="M79 322 445 207M150 447 388 96"
      stroke="#7d4828"
      stroke-width="19"
      stroke-linecap="round"
    />

    <path
      d="M80 322 445 207M150 447 388 96"
      stroke="#b16b3a"
      stroke-width="8"
      stroke-linecap="round"
    />

    <path
      d="M205 98 328 457"
      stroke="#747f79"
      stroke-width="15"
      stroke-dasharray="26 14"
      stroke-linecap="round"
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
      "Pack inicial da Instalação Subterrânea concluído.",
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
      "Não foi possível gerar o pack da Instalação Subterrânea.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);