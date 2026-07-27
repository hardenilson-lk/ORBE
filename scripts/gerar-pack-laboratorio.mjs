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
    "laboratorio",
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
        stop-color="#eef3f0"
      />

      <stop
        offset="0.3"
        stop-color="#a7b3ae"
      />

      <stop
        offset="0.68"
        stop-color="#59645f"
      />

      <stop
        offset="1"
        stop-color="#222826"
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
        stop-color="#65716c"
      />

      <stop
        offset="0.5"
        stop-color="#343d39"
      />

      <stop
        offset="1"
        stop-color="#151a18"
      />
    </linearGradient>

    <linearGradient
      id="plasticoBranco"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#f5f6ef"
      />

      <stop
        offset="0.55"
        stop-color="#c4cbc4"
      />

      <stop
        offset="1"
        stop-color="#737d78"
      />
    </linearGradient>

    <linearGradient
      id="plasticoEscuro"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#4e5b57"
      />

      <stop
        offset="0.55"
        stop-color="#29322f"
      />

      <stop
        offset="1"
        stop-color="#111716"
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
        stop-color="#e1fbf8"
        stop-opacity=".88"
      />

      <stop
        offset="0.5"
        stop-color="#75aaa8"
        stop-opacity=".68"
      />

      <stop
        offset="1"
        stop-color="#284747"
        stop-opacity=".9"
      />
    </linearGradient>

    <linearGradient
      id="liquidoAzul"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#90f7ef"
      />

      <stop
        offset="0.5"
        stop-color="#27b8bf"
      />

      <stop
        offset="1"
        stop-color="#16536c"
      />
    </linearGradient>

    <linearGradient
      id="liquidoVerde"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d0ff9d"
      />

      <stop
        offset="0.5"
        stop-color="#6acb59"
      />

      <stop
        offset="1"
        stop-color="#1f603c"
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
        stop-color="#9df7e9"
      />

      <stop
        offset="0.45"
        stop-color="#3aa79d"
      />

      <stop
        offset="1"
        stop-color="#112f31"
      />
    </linearGradient>

    <radialGradient
      id="alerta"
      cx="42%"
      cy="36%"
      r="72%"
    >
      <stop
        offset="0"
        stop-color="#ff9c86"
      />

      <stop
        offset="0.48"
        stop-color="#e5443f"
      />

      <stop
        offset="1"
        stop-color="#67191d"
      />
    </radialGradient>

    <radialGradient
      id="energia"
      cx="50%"
      cy="45%"
      r="68%"
    >
      <stop
        offset="0"
        stop-color="#d7ffff"
      />

      <stop
        offset="0.42"
        stop-color="#59d7da"
      />

      <stop
        offset="1"
        stop-color="#16455a"
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
        fill="#d3ad31"
      />

      <rect
        x="36"
        width="36"
        height="72"
        fill="#242826"
      />
    </pattern>
  </defs>

${conteudo}
</svg>
`;
}

const ASSETS = {
  "bancada.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="55"
      y="103"
      width="402"
      height="264"
      rx="35"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="79"
      y="127"
      width="354"
      height="216"
      rx="21"
      fill="url(#metal)"
      stroke="#59645f"
      stroke-width="9"
    />

    <rect
      x="39"
      y="74"
      width="434"
      height="91"
      rx="24"
      fill="#e3e7e2"
      stroke="#59625e"
      stroke-width="13"
    />

    <path
      d="M69 120h374"
      stroke="#ffffff"
      stroke-width="7"
      opacity=".56"
    />

    <rect
      x="107"
      y="190"
      width="126"
      height="112"
      rx="16"
      fill="#252d2a"
      stroke="#101413"
      stroke-width="9"
    />

    <rect
      x="279"
      y="190"
      width="126"
      height="112"
      rx="16"
      fill="#252d2a"
      stroke="#101413"
      stroke-width="9"
    />

    <g fill="#aab5af">
      <rect
        x="134"
        y="217"
        width="72"
        height="18"
        rx="8"
      />

      <rect
        x="306"
        y="217"
        width="72"
        height="18"
        rx="8"
      />
    </g>

    <path
      d="M100 357 72 459M412 357l28 102M180 357l-8 108M332 357l8 108"
      stroke="#424c48"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M56 460h100M356 460h100M132 470h77M303 470h77"
      stroke="#111514"
      stroke-width="13"
      stroke-linecap="round"
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
      d="M285 136c24 18 34 40 42 69 7 25 19 42 48 57"
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

  "monitor.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="53"
      y="53"
      width="406"
      height="326"
      rx="39"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="81"
      y="81"
      width="350"
      height="270"
      rx="23"
      fill="#091615"
      stroke="#324c49"
      stroke-width="10"
    />

    <rect
      x="103"
      y="103"
      width="306"
      height="226"
      rx="15"
      fill="url(#tela)"
      stroke="#4c6a66"
      stroke-width="8"
    />

    <path
      d="M126 262c37-85 78 20 121-42 32-46 57 12 91-30 21-26 34-28 51-17"
      fill="none"
      stroke="#d0fff7"
      stroke-width="8"
      stroke-linecap="round"
    />

    <g fill="#b9fff2" opacity=".68">
      <circle
        cx="148"
        cy="151"
        r="11"
      />

      <circle
        cx="211"
        cy="183"
        r="8"
      />

      <circle
        cx="282"
        cy="137"
        r="12"
      />

      <circle
        cx="350"
        cy="214"
        r="9"
      />
    </g>

    <path
      d="M226 379h60v66h-60z"
      fill="url(#metalEscuro)"
      stroke="#161b19"
      stroke-width="8"
    />

    <rect
      x="153"
      y="432"
      width="206"
      height="43"
      rx="16"
      fill="#222725"
      stroke="#0d100f"
      stroke-width="9"
    />

    <circle
      cx="423"
      cy="363"
      r="9"
      fill="#58da7b"
    />
  </g>`),

  "microscopio.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M218 55h89c19 0 34 15 34 34v87c0 19-15 34-34 34h-89c-19 0-34-15-34-34V89c0-19 15-34 34-34Z"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="16"
    />

    <rect
      x="209"
      y="78"
      width="107"
      height="109"
      rx="22"
      fill="url(#metal)"
      stroke="#58625e"
      stroke-width="8"
    />

    <path
      d="M249 200v78c0 29-14 50-42 64-55 28-82 71-79 132"
      fill="none"
      stroke="#1b201e"
      stroke-width="56"
      stroke-linecap="round"
    />

    <path
      d="M249 200v78c0 29-14 50-42 64-55 28-82 71-79 132"
      fill="none"
      stroke="url(#metal)"
      stroke-width="35"
      stroke-linecap="round"
    />

    <path
      d="M269 183 340 301"
      stroke="#171b19"
      stroke-width="45"
      stroke-linecap="round"
    />

    <path
      d="M269 183 340 301"
      stroke="url(#metal)"
      stroke-width="27"
      stroke-linecap="round"
    />

    <rect
      x="211"
      y="300"
      width="202"
      height="62"
      rx="16"
      fill="#1c211f"
      stroke="#090c0b"
      stroke-width="11"
    />

    <rect
      x="235"
      y="316"
      width="154"
      height="29"
      rx="8"
      fill="#98a59e"
    />

    <circle
      cx="354"
      cy="252"
      r="34"
      fill="#222826"
      stroke="#0d100f"
      stroke-width="9"
    />

    <circle
      cx="354"
      cy="252"
      r="16"
      fill="#8fd8d2"
    />

    <path
      d="M142 405h248c30 0 55 25 55 55v9H87v-9c0-30 25-55 55-55Z"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <path
      d="M127 440h280"
      stroke="#68736e"
      stroke-width="12"
      stroke-linecap="round"
    />
  </g>`),

  "equipamento.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="58"
      y="67"
      width="396"
      height="380"
      rx="41"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="83"
      y="93"
      width="346"
      height="329"
      rx="27"
      fill="url(#plasticoBranco)"
      stroke="#626d67"
      stroke-width="9"
    />

    <rect
      x="111"
      y="122"
      width="210"
      height="126"
      rx="18"
      fill="#101b1b"
      stroke="#334b49"
      stroke-width="8"
    />

    <path
      d="M134 211c23-48 49 19 72-15 25-38 48 2 86-35"
      fill="none"
      stroke="#a7fff1"
      stroke-width="8"
      stroke-linecap="round"
    />

    <g fill="#de4e51" stroke="#64191c" stroke-width="5">
      <circle
        cx="369"
        cy="145"
        r="18"
      />

      <circle
        cx="369"
        cy="209"
        r="18"
      />
    </g>

    <rect
      x="110"
      y="279"
      width="293"
      height="111"
      rx="20"
      fill="#252c2a"
      stroke="#0d100f"
      stroke-width="9"
    />

    <g fill="#72807a">
      <rect
        x="137"
        y="307"
        width="59"
        height="55"
        rx="9"
      />

      <rect
        x="214"
        y="307"
        width="59"
        height="55"
        rx="9"
      />

      <rect
        x="291"
        y="307"
        width="59"
        height="55"
        rx="9"
      />
    </g>

    <circle
      cx="377"
      cy="335"
      r="34"
      fill="#10272a"
      stroke="#3f7c7c"
      stroke-width="8"
    />

    <circle
      cx="377"
      cy="335"
      r="15"
      fill="#a1ffff"
    />
  </g>`),

  "armario.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="76"
      y="51"
      width="360"
      height="412"
      rx="32"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="100"
      y="76"
      width="312"
      height="362"
      rx="19"
      fill="url(#plasticoBranco)"
      stroke="#5e6963"
      stroke-width="9"
    />

    <path
      d="M256 79v356"
      stroke="#4b5550"
      stroke-width="12"
    />

    <path
      d="M120 153h117M275 153h117M120 350h117M275 350h117"
      stroke="#88938d"
      stroke-width="8"
      opacity=".65"
    />

    <g fill="#434d48" stroke="#202624" stroke-width="5">
      <rect
        x="209"
        y="211"
        width="21"
        height="81"
        rx="9"
      />

      <rect
        x="282"
        y="211"
        width="21"
        height="81"
        rx="9"
      />
    </g>

    <rect
      x="95"
      y="433"
      width="77"
      height="30"
      rx="8"
      fill="#181c1b"
    />

    <rect
      x="340"
      y="433"
      width="77"
      height="30"
      rx="8"
      fill="#181c1b"
    />

    <circle
      cx="382"
      cy="111"
      r="10"
      fill="#e44849"
    />
  </g>`),

  "freezer.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="69"
      y="48"
      width="374"
      height="418"
      rx="34"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="93"
      y="73"
      width="326"
      height="368"
      rx="20"
      fill="url(#plasticoBranco)"
      stroke="#61706a"
      stroke-width="9"
    />

    <path
      d="M98 216h316"
      stroke="#5c6862"
      stroke-width="12"
    />

    <rect
      x="125"
      y="102"
      width="261"
      height="82"
      rx="15"
      fill="#d9e5df"
      stroke="#78847e"
      stroke-width="7"
    />

    <path
      d="M149 133h126M149 156h88"
      stroke="#71807a"
      stroke-width="7"
      stroke-linecap="round"
    />

    <rect
      x="129"
      y="252"
      width="26"
      height="116"
      rx="12"
      fill="#47524d"
      stroke="#202624"
      stroke-width="6"
    />

    <path
      d="M209 287c18-23 39-25 59-5 17-25 40-23 55-1 18-17 38-11 51 8"
      fill="none"
      stroke="#84cfcf"
      stroke-width="9"
      stroke-linecap="round"
      opacity=".65"
    />

    <circle
      cx="373"
      cy="120"
      r="13"
      fill="#51d47a"
    />

    <path
      d="M112 437h288"
      stroke="#1a1f1d"
      stroke-width="15"
      stroke-linecap="round"
    />
  </g>`),

  "recipiente.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M178 77h156v80c0 24 9 46 27 62 47 43 75 104 75 170 0 48-39 87-87 87H163c-48 0-87-39-87-87 0-66 28-127 75-170 18-16 27-38 27-62V77Z"
      fill="#1b2422"
      stroke="#090d0c"
      stroke-width="18"
    />

    <rect
      x="174"
      y="52"
      width="164"
      height="75"
      rx="20"
      fill="url(#metal)"
      stroke="#242b29"
      stroke-width="10"
    />

    <path
      d="M120 304c71 26 200 24 272-4v89c0 27-22 49-49 49H169c-27 0-49-22-49-49v-85Z"
      fill="url(#liquidoVerde)"
      stroke="#285944"
      stroke-width="8"
    />

    <path
      d="M151 329c49 17 161 16 210-2"
      fill="none"
      stroke="#d3ffba"
      stroke-width="7"
      opacity=".65"
    />

    <g fill="#e1ffb5" opacity=".7">
      <circle
        cx="208"
        cy="359"
        r="15"
      />

      <circle
        cx="283"
        cy="387"
        r="11"
      />

      <circle
        cx="330"
        cy="344"
        r="9"
      />
    </g>

    <path
      d="M235 91h42"
      stroke="#eef2ee"
      stroke-width="8"
      stroke-linecap="round"
      opacity=".58"
    />
  </g>`),

  "estante.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="59"
      y="48"
      width="394"
      height="420"
      rx="32"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="84"
      y="73"
      width="344"
      height="370"
      rx="18"
      fill="url(#metalEscuro)"
      stroke="#59645f"
      stroke-width="9"
    />

    <path
      d="M91 160h330M91 253h330M91 346h330"
      stroke="#85908a"
      stroke-width="14"
    />

    <path
      d="M113 91v334M399 91v334"
      stroke="#202624"
      stroke-width="15"
    />

    <g stroke="#234d4d" stroke-width="6">
      <rect
        x="124"
        y="102"
        width="76"
        height="48"
        rx="8"
        fill="url(#liquidoAzul)"
      />

      <rect
        x="219"
        y="95"
        width="104"
        height="55"
        rx="8"
        fill="url(#liquidoVerde)"
      />

      <rect
        x="342"
        y="108"
        width="45"
        height="42"
        rx="8"
        fill="#dbe6df"
      />

      <rect
        x="121"
        y="184"
        width="111"
        height="58"
        rx="8"
        fill="#d9e1dc"
      />

      <rect
        x="248"
        y="191"
        width="70"
        height="51"
        rx="8"
        fill="url(#liquidoAzul)"
      />

      <rect
        x="337"
        y="181"
        width="51"
        height="61"
        rx="8"
        fill="#d8ded9"
      />

      <rect
        x="124"
        y="277"
        width="75"
        height="58"
        rx="8"
        fill="url(#liquidoVerde)"
      />

      <rect
        x="215"
        y="284"
        width="119"
        height="51"
        rx="8"
        fill="#d8e0db"
      />

      <rect
        x="350"
        y="279"
        width="39"
        height="56"
        rx="8"
        fill="url(#liquidoAzul)"
      />

      <rect
        x="118"
        y="370"
        width="124"
        height="57"
        rx="8"
        fill="#d8dfdb"
      />

      <rect
        x="259"
        y="376"
        width="75"
        height="51"
        rx="8"
        fill="url(#liquidoVerde)"
      />

      <rect
        x="350"
        y="368"
        width="41"
        height="59"
        rx="8"
        fill="#dbe2de"
      />
    </g>
  </g>`),

  "pia.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="59"
      y="102"
      width="394"
      height="309"
      rx="38"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="84"
      y="127"
      width="344"
      height="259"
      rx="26"
      fill="url(#metal)"
      stroke="#5d6863"
      stroke-width="9"
    />

    <ellipse
      cx="256"
      cy="257"
      rx="125"
      ry="93"
      fill="#273431"
      stroke="#101514"
      stroke-width="12"
    />

    <ellipse
      cx="256"
      cy="251"
      rx="100"
      ry="69"
      fill="url(#vidro)"
      stroke="#607d79"
      stroke-width="8"
    />

    <circle
      cx="256"
      cy="258"
      r="18"
      fill="#29312e"
      stroke="#111514"
      stroke-width="7"
    />

    <path
      d="M255 126v-51c0-28 23-51 51-51s51 23 51 51v86"
      fill="none"
      stroke="#1c211f"
      stroke-width="39"
      stroke-linecap="round"
    />

    <path
      d="M255 126v-51c0-28 23-51 51-51s51 23 51 51v86"
      fill="none"
      stroke="url(#metal)"
      stroke-width="24"
      stroke-linecap="round"
    />

    <path
      d="M341 159h59"
      stroke="url(#metal)"
      stroke-width="27"
      stroke-linecap="round"
    />

    <path
      d="M112 402 88 477M400 402l24 75"
      stroke="#424c48"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M70 477h91M351 477h91"
      stroke="#111514"
      stroke-width="13"
      stroke-linecap="round"
    />
  </g>`),

  "painel.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="57"
      y="60"
      width="398"
      height="391"
      rx="42"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="83"
      y="86"
      width="346"
      height="339"
      rx="27"
      fill="url(#metalEscuro)"
      stroke="#5a6560"
      stroke-width="9"
    />

    <rect
      x="110"
      y="115"
      width="205"
      height="129"
      rx="18"
      fill="#0c1818"
      stroke="#334c49"
      stroke-width="8"
    />

    <path
      d="M133 213c24-45 49 16 74-13 25-31 42-7 81-43"
      fill="none"
      stroke="#adfff2"
      stroke-width="8"
      stroke-linecap="round"
    />

    <g fill="#db4b4c" stroke="#64191c" stroke-width="5">
      <circle
        cx="365"
        cy="137"
        r="18"
      />

      <circle
        cx="365"
        cy="196"
        r="18"
      />
    </g>

    <rect
      x="110"
      y="276"
      width="292"
      height="116"
      rx="20"
      fill="#202725"
      stroke="#0d100f"
      stroke-width="9"
    />

    <g fill="#7c8882">
      <rect
        x="138"
        y="307"
        width="58"
        height="56"
        rx="9"
      />

      <rect
        x="213"
        y="307"
        width="58"
        height="56"
        rx="9"
      />

      <rect
        x="288"
        y="307"
        width="58"
        height="56"
        rx="9"
      />
    </g>

    <circle
      cx="374"
      cy="335"
      r="34"
      fill="#10292b"
      stroke="#3c8583"
      stroke-width="8"
    />

    <circle
      cx="374"
      cy="335"
      r="15"
      fill="#9ffff6"
    />
  </g>`),

  "servidor.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="74"
      y="43"
      width="364"
      height="426"
      rx="34"
      fill="#151918"
      stroke="#070908"
      stroke-width="18"
    />

    <rect
      x="98"
      y="68"
      width="316"
      height="376"
      rx="21"
      fill="url(#metalEscuro)"
      stroke="#59645f"
      stroke-width="9"
    />

    <g fill="#141918" stroke="#080a09" stroke-width="7">
      <rect
        x="124"
        y="96"
        width="264"
        height="67"
        rx="12"
      />

      <rect
        x="124"
        y="178"
        width="264"
        height="67"
        rx="12"
      />

      <rect
        x="124"
        y="260"
        width="264"
        height="67"
        rx="12"
      />

      <rect
        x="124"
        y="342"
        width="264"
        height="67"
        rx="12"
      />
    </g>

    <g fill="#56dc7b">
      <circle
        cx="151"
        cy="129"
        r="9"
      />

      <circle
        cx="151"
        cy="211"
        r="9"
      />

      <circle
        cx="151"
        cy="293"
        r="9"
      />

      <circle
        cx="151"
        cy="375"
        r="9"
      />
    </g>

    <g fill="#e2a847">
      <circle
        cx="180"
        cy="129"
        r="9"
      />

      <circle
        cx="180"
        cy="211"
        r="9"
      />

      <circle
        cx="180"
        cy="293"
        r="9"
      />

      <circle
        cx="180"
        cy="375"
        r="9"
      />
    </g>

    <g
      stroke="#78857e"
      stroke-width="8"
      stroke-linecap="round"
    >
      <path d="M215 119h143" />
      <path d="M215 139h104" />

      <path d="M215 201h143" />
      <path d="M215 221h104" />

      <path d="M215 283h143" />
      <path d="M215 303h104" />

      <path d="M215 365h143" />
      <path d="M215 385h104" />
    </g>

    <rect
      x="96"
      y="439"
      width="76"
      height="30"
      rx="8"
      fill="#181c1b"
    />

    <rect
      x="340"
      y="439"
      width="76"
      height="30"
      rx="8"
      fill="#181c1b"
    />
  </g>`),

  "caixa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="67"
      y="68"
      width="378"
      height="378"
      rx="29"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="91"
      y="92"
      width="330"
      height="330"
      rx="18"
      fill="url(#plasticoBranco)"
      stroke="#5f6964"
      stroke-width="9"
    />

    <path
      d="M102 168h308M102 256h308M102 344h308"
      stroke="#7f8984"
      stroke-width="9"
    />

    <path
      d="M110 118 399 397M400 118 112 398"
      stroke="#3d4945"
      stroke-width="29"
    />

    <path
      d="M110 118 399 397M400 118 112 398"
      stroke="#82918a"
      stroke-width="13"
    />

    <rect
      x="204"
      y="204"
      width="104"
      height="104"
      rx="16"
      fill="#172322"
      stroke="#080c0b"
      stroke-width="10"
    />

    <circle
      cx="256"
      cy="256"
      r="30"
      fill="url(#energia)"
      stroke="#70c8cb"
      stroke-width="7"
    />

    <path
      d="M256 228v56M228 256h56"
      stroke="#e7ffff"
      stroke-width="7"
      stroke-linecap="round"
    />

    <g fill="#59645f" stroke="#111514" stroke-width="8">
      <rect
        x="67"
        y="68"
        width="70"
        height="70"
        rx="12"
      />

      <rect
        x="375"
        y="68"
        width="70"
        height="70"
        rx="12"
      />

      <rect
        x="67"
        y="376"
        width="70"
        height="70"
        rx="12"
      />

      <rect
        x="375"
        y="376"
        width="70"
        height="70"
        rx="12"
      />
    </g>
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
      stroke="#42bfc0"
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

  "sinalizacao.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M256 54 472 436H40L256 54Z"
      fill="#171b1a"
      stroke="#080a09"
      stroke-width="18"
      stroke-linejoin="round"
    />

    <path
      d="M256 94 437 415H75L256 94Z"
      fill="#e2c13e"
      stroke="#6d5b19"
      stroke-width="10"
      stroke-linejoin="round"
    />

    <circle
      cx="256"
      cy="293"
      r="92"
      fill="#202523"
      stroke="#0e1110"
      stroke-width="11"
    />

    <path
      d="M256 219v104"
      stroke="#e5c743"
      stroke-width="27"
      stroke-linecap="round"
    />

    <circle
      cx="256"
      cy="360"
      r="17"
      fill="#e5c743"
    />

    <path
      d="M123 393h266"
      stroke="#3a3215"
      stroke-width="9"
      stroke-linecap="round"
      opacity=".54"
    />
  </g>`),

  "fita-de-isolamento.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M33 203c122-52 193 42 302-13 59-30 100-24 148 4"
      fill="none"
      stroke="#111311"
      stroke-width="79"
      stroke-linecap="round"
    />

    <path
      d="M33 203c122-52 193 42 302-13 59-30 100-24 148 4"
      fill="none"
      stroke="#d2ab2e"
      stroke-width="64"
      stroke-linecap="round"
    />

    <path
      d="M33 203c122-52 193 42 302-13 59-30 100-24 148 4"
      fill="none"
      stroke="#1d201e"
      stroke-width="64"
      stroke-dasharray="49 49"
      stroke-linecap="butt"
    />

    <path
      d="M44 320c91-35 162 33 245-5 68-31 114-26 181 8"
      fill="none"
      stroke="#111311"
      stroke-width="69"
      stroke-linecap="round"
    />

    <path
      d="M44 320c91-35 162 33 245-5 68-31 114-26 181 8"
      fill="none"
      stroke="#d2ab2e"
      stroke-width="55"
      stroke-linecap="round"
    />

    <path
      d="M44 320c91-35 162 33 245-5 68-31 114-26 181 8"
      fill="none"
      stroke="#1d201e"
      stroke-width="55"
      stroke-dasharray="43 43"
      stroke-linecap="butt"
    />

    <circle
      cx="52"
      cy="199"
      r="35"
      fill="#29302d"
      stroke="#0f1210"
      stroke-width="10"
    />

    <circle
      cx="466"
      cy="194"
      r="35"
      fill="#29302d"
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
      "Pack inicial do Laboratório concluído.",
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
      "Não foi possível gerar o pack do Laboratório.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);