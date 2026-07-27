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
    "escola",
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
        flood-opacity="0.43"
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
        flood-opacity="0.33"
      />
    </filter>

    <linearGradient
      id="madeira"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d4a76b"
      />

      <stop
        offset="0.5"
        stop-color="#8c5d32"
      />

      <stop
        offset="1"
        stop-color="#42291a"
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
        stop-color="#755039"
      />

      <stop
        offset="0.55"
        stop-color="#432c21"
      />

      <stop
        offset="1"
        stop-color="#1d1511"
      />
    </linearGradient>

    <linearGradient
      id="metal"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d7ddd8"
      />

      <stop
        offset="0.4"
        stop-color="#8d9992"
      />

      <stop
        offset="1"
        stop-color="#303936"
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
        stop-color="#5d6863"
      />

      <stop
        offset="0.5"
        stop-color="#333b38"
      />

      <stop
        offset="1"
        stop-color="#151918"
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
        stop-color="#6f7c75"
      />

      <stop
        offset="0.5"
        stop-color="#3b4641"
      />

      <stop
        offset="1"
        stop-color="#171d1a"
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
        stop-color="#f1e7c9"
      />

      <stop
        offset="0.55"
        stop-color="#c9b98c"
      />

      <stop
        offset="1"
        stop-color="#847351"
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
        stop-color="#5d7380"
      />

      <stop
        offset="0.55"
        stop-color="#344b57"
      />

      <stop
        offset="1"
        stop-color="#17252b"
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
        stop-color="#a4f0e6"
      />

      <stop
        offset="0.5"
        stop-color="#448e89"
      />

      <stop
        offset="1"
        stop-color="#142c2b"
      />
    </radialGradient>
  </defs>

${conteudo}
</svg>
`;
}

const ASSETS = {
  "carteira.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="68"
      y="76"
      width="376"
      height="247"
      rx="35"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="92"
      y="100"
      width="328"
      height="199"
      rx="23"
      fill="url(#madeira)"
      stroke="#5f3b22"
      stroke-width="10"
    />

    <path
      d="M174 105v188M256 105v188M338 105v188"
      stroke="#7b4a28"
      stroke-width="8"
      opacity=".7"
    />

    <path
      d="M112 317 78 455M400 317l34 138M179 317l-10 145M333 317l10 145"
      stroke="#414a46"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M57 457h112M343 457h112M126 470h84M302 470h84"
      stroke="#111514"
      stroke-width="13"
      stroke-linecap="round"
    />

    <rect
      x="180"
      y="149"
      width="152"
      height="91"
      rx="13"
      fill="url(#papel)"
      stroke="#675d49"
      stroke-width="7"
      transform="rotate(-4 256 194)"
    />

    <path
      d="M205 180h102M205 203h76"
      stroke="#716957"
      stroke-width="6"
      stroke-linecap="round"
    />
  </g>`),

  "cadeira.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="139"
      y="55"
      width="234"
      height="246"
      rx="49"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="164"
      y="80"
      width="184"
      height="196"
      rx="35"
      fill="url(#plastico)"
      stroke="#53605a"
      stroke-width="9"
    />

    <path
      d="M184 124h144M184 168h144M184 212h144"
      stroke="#88968f"
      stroke-width="7"
      opacity=".4"
    />

    <rect
      x="121"
      y="275"
      width="270"
      height="135"
      rx="42"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="17"
    />

    <rect
      x="147"
      y="299"
      width="218"
      height="87"
      rx="28"
      fill="url(#plastico)"
      stroke="#53605a"
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

  "mesa-do-professor.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="53"
      y="86"
      width="406"
      height="278"
      rx="43"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="78"
      y="111"
      width="356"
      height="228"
      rx="27"
      fill="url(#madeira)"
      stroke="#5f3b22"
      stroke-width="10"
    />

    <path
      d="M166 117v216M256 117v216M346 117v216"
      stroke="#744522"
      stroke-width="8"
      opacity=".72"
    />

    <rect
      x="106"
      y="173"
      width="121"
      height="116"
      rx="16"
      fill="#242b28"
      stroke="#0d100f"
      stroke-width="9"
    />

    <rect
      x="285"
      y="173"
      width="121"
      height="116"
      rx="16"
      fill="#242b28"
      stroke="#0d100f"
      stroke-width="9"
    />

    <path
      d="M132 207h69M132 232h69M311 207h69M311 232h69"
      stroke="#919c96"
      stroke-width="7"
      stroke-linecap="round"
    />

    <path
      d="M105 354 70 463M407 354l35 109M178 354l-10 116M334 354l10 116"
      stroke="#414a46"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M52 464h111M349 464h111M126 475h82M304 475h82"
      stroke="#111514"
      stroke-width="13"
      stroke-linecap="round"
    />
  </g>`),

  "quadro.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="45"
      y="79"
      width="422"
      height="354"
      rx="29"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="71"
      y="105"
      width="370"
      height="302"
      rx="18"
      fill="#365646"
      stroke="#17251e"
      stroke-width="11"
    />

    <path
      d="M103 172h172M103 217h241M103 262h132M103 307h211"
      stroke="#d7e5d8"
      stroke-width="10"
      stroke-linecap="round"
      opacity=".72"
    />

    <path
      d="m336 161 48 78-48 78-48-78 48-78Z"
      fill="none"
      stroke="#d7e5d8"
      stroke-width="9"
      opacity=".65"
    />

    <rect
      x="78"
      y="397"
      width="356"
      height="36"
      rx="14"
      fill="url(#madeiraEscura)"
      stroke="#1c120d"
      stroke-width="7"
    />

    <rect
      x="120"
      y="385"
      width="80"
      height="19"
      rx="8"
      fill="#e9e0c8"
    />

    <rect
      x="218"
      y="385"
      width="66"
      height="19"
      rx="8"
      fill="#d8a64f"
    />
  </g>`),

  "armario.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="75"
      y="50"
      width="362"
      height="414"
      rx="34"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="99"
      y="75"
      width="314"
      height="364"
      rx="20"
      fill="url(#metalEscuro)"
      stroke="#5b6661"
      stroke-width="9"
    />

    <path
      d="M256 78v358"
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
  </g>`),

  "estante.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="59"
      y="48"
      width="394"
      height="420"
      rx="32"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="84"
      y="73"
      width="344"
      height="370"
      rx="18"
      fill="url(#madeiraEscura)"
      stroke="#4d3021"
      stroke-width="9"
    />

    <path
      d="M91 160h330M91 253h330M91 346h330"
      stroke="#a36b3d"
      stroke-width="14"
    />

    <path
      d="M113 91v334M399 91v334"
      stroke="#211611"
      stroke-width="15"
    />

    <g stroke="#241711" stroke-width="5">
      <rect x="124" y="102" width="38" height="48" rx="5" fill="#8f3340" />
      <rect x="168" y="93" width="44" height="57" rx="5" fill="#3e6570" />
      <rect x="218" y="102" width="54" height="48" rx="5" fill="#b18a43" />
      <rect x="278" y="96" width="39" height="54" rx="5" fill="#55703f" />
      <rect x="323" y="100" width="64" height="50" rx="5" fill="#67405e" />

      <rect x="121" y="184" width="66" height="58" rx="5" fill="#78532e" />
      <rect x="193" y="193" width="40" height="49" rx="5" fill="#913646" />
      <rect x="239" y="180" width="54" height="62" rx="5" fill="#45626c" />
      <rect x="299" y="189" width="36" height="53" rx="5" fill="#a78542" />
      <rect x="341" y="182" width="47" height="60" rx="5" fill="#506a40" />

      <rect x="124" y="277" width="43" height="58" rx="5" fill="#496873" />
      <rect x="173" y="284" width="58" height="51" rx="5" fill="#a56e36" />
      <rect x="237" y="271" width="38" height="64" rx="5" fill="#793441" />
      <rect x="281" y="279" width="55" height="56" rx="5" fill="#526d42" />
      <rect x="342" y="278" width="46" height="57" rx="5" fill="#9f763b" />

      <rect x="121" y="370" width="61" height="57" rx="5" fill="#8a6939" />
      <rect x="188" y="363" width="39" height="64" rx="5" fill="#43616d" />
      <rect x="233" y="375" width="48" height="52" rx="5" fill="#843342" />
      <rect x="287" y="366" width="39" height="61" rx="5" fill="#576e40" />
      <rect x="332" y="371" width="56" height="56" rx="5" fill="#a06f39" />
    </g>
  </g>`),

  "livro.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M69 135c70-33 135-24 187 17v276c-52-41-117-50-187-17V135Z"
      fill="url(#papel)"
      stroke="#514431"
      stroke-width="12"
      stroke-linejoin="round"
    />

    <path
      d="M443 135c-70-33-135-24-187 17v276c52-41 117-50 187-17V135Z"
      fill="url(#papel)"
      stroke="#514431"
      stroke-width="12"
      stroke-linejoin="round"
    />

    <path
      d="M256 153v273"
      stroke="#705b3d"
      stroke-width="12"
    />

    <path
      d="M95 178c42-14 85-8 126 15M95 219c42-14 85-8 126 15M95 260c42-14 85-8 126 15M95 301c42-14 85-8 126 15M95 342c42-14 85-8 126 15"
      fill="none"
      stroke="#786b52"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".72"
    />

    <path
      d="M417 178c-42-14-85-8-126 15M417 219c-42-14-85-8-126 15M417 260c-42-14-85-8-126 15M417 301c-42-14-85-8-126 15M417 342c-42-14-85-8-126 15"
      fill="none"
      stroke="#786b52"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".72"
    />
  </g>`),

  "computador.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="69"
      y="56"
      width="374"
      height="286"
      rx="36"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="95"
      y="83"
      width="322"
      height="227"
      rx="21"
      fill="url(#tela)"
      stroke="#31504e"
      stroke-width="10"
    />

    <path
      d="M126 130h116M126 164h181M126 198h95M126 232h152"
      stroke="#c2fff4"
      stroke-width="9"
      stroke-linecap="round"
      opacity=".72"
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

    <circle
      cx="387"
      cy="322"
      r="10"
      fill="#61dd7f"
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
      fill="#171b19"
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
  </g>`),

  "bancada.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="55"
      y="103"
      width="402"
      height="264"
      rx="35"
      fill="#171b19"
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

  "mesa-de-refeitorio.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="54"
      y="148"
      width="404"
      height="177"
      rx="37"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <rect
      x="80"
      y="174"
      width="352"
      height="125"
      rx="23"
      fill="url(#madeira)"
      stroke="#5f3b22"
      stroke-width="10"
    />

    <path
      d="M168 180v113M256 180v113M344 180v113"
      stroke="#734522"
      stroke-width="8"
      opacity=".72"
    />

    <rect
      x="65"
      y="64"
      width="382"
      height="64"
      rx="24"
      fill="url(#plastico)"
      stroke="#222a26"
      stroke-width="10"
    />

    <rect
      x="65"
      y="345"
      width="382"
      height="64"
      rx="24"
      fill="url(#plastico)"
      stroke="#222a26"
      stroke-width="10"
    />

    <path
      d="M111 123v35M401 123v35M111 320v31M401 320v31"
      stroke="#424c48"
      stroke-width="24"
      stroke-linecap="round"
    />

    <path
      d="M104 410 82 474M408 410l22 64"
      stroke="#424c48"
      stroke-width="24"
      stroke-linecap="round"
    />
  </g>`),

  "papel.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="m112 87 289-30 38 361-288 31-39-362Z"
      fill="#8b7650"
      stroke="#403524"
      stroke-width="11"
    />

    <path
      d="m75 132 288-42 49 350-287 43-50-351Z"
      fill="url(#papel)"
      stroke="#594c36"
      stroke-width="12"
    />

    <path
      d="M130 183c69-7 137-19 204-30M137 229c74-10 143-22 208-31M145 278c61-9 119-18 178-27M152 329c50-8 103-17 156-25"
      fill="none"
      stroke="#655b44"
      stroke-width="8"
      stroke-linecap="round"
      opacity=".74"
    />

    <path
      d="M116 151c31 17 47 37 55 67"
      fill="none"
      stroke="#92353e"
      stroke-width="10"
      stroke-linecap="round"
    />
  </g>`),

  "mochila.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M138 178c0-67 53-121 118-121s118 54 118 121v237c0 43-35 78-78 78h-80c-43 0-78-35-78-78V178Z"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
    />

    <path
      d="M165 185c0-52 41-94 91-94s91 42 91 94v217c0 33-27 60-60 60h-62c-33 0-60-27-60-60V185Z"
      fill="url(#tecido)"
      stroke="#2d4652"
      stroke-width="10"
    />

    <path
      d="M195 140c20-44 102-44 122 0"
      fill="none"
      stroke="#1d282c"
      stroke-width="25"
      stroke-linecap="round"
    />

    <rect
      x="183"
      y="282"
      width="146"
      height="125"
      rx="35"
      fill="#293b45"
      stroke="#15232a"
      stroke-width="9"
    />

    <path
      d="M208 322h96M208 349h73"
      stroke="#819aa6"
      stroke-width="7"
      stroke-linecap="round"
    />

    <path
      d="M162 220 94 380M350 220l68 160"
      stroke="#242e31"
      stroke-width="26"
      stroke-linecap="round"
    />

    <path
      d="M213 235h86"
      stroke="#9bb0b8"
      stroke-width="9"
      stroke-linecap="round"
    />
  </g>`),

  "lixeira.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M125 147h262l-34 300H159l-34-300Z"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="18"
      stroke-linejoin="round"
    />

    <path
      d="M151 171h210l-28 250H179l-28-250Z"
      fill="url(#metalEscuro)"
      stroke="#56615c"
      stroke-width="9"
      stroke-linejoin="round"
    />

    <rect
      x="102"
      y="93"
      width="308"
      height="74"
      rx="28"
      fill="#171b19"
      stroke="#080a09"
      stroke-width="17"
    />

    <rect
      x="127"
      y="116"
      width="258"
      height="29"
      rx="13"
      fill="url(#metal)"
    />

    <path
      d="M195 80c0-27 22-49 49-49h24c27 0 49 22 49 49"
      fill="none"
      stroke="#434c48"
      stroke-width="22"
      stroke-linecap="round"
    />

    <path
      d="M196 207v167M256 207v167M316 207v167"
      stroke="#7d8983"
      stroke-width="8"
      opacity=".5"
    />
  </g>`),

  "entulho.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <g
      stroke="#171918"
      stroke-width="9"
      stroke-linejoin="round"
    >
      <path
        d="m67 372 72-126 121 41-34 145-159-60Z"
        fill="#646b67"
      />

      <path
        d="m157 215 81-137 107 79-45 126-143-68Z"
        fill="#777f7a"
      />

      <path
        d="m276 302 106-112 88 126-91 107-103-121Z"
        fill="#4d5551"
      />

      <path
        d="m177 381 113-105 77 135-126 63-64-93Z"
        fill="#686f6b"
      />

      <path
        d="m56 278 52-97 78 47-38 101-92-51Z"
        fill="#898f8b"
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
      "Pack inicial da Escola concluído.",
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
      "Não foi possível gerar o pack da Escola.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);