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
    "mansao",
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
        flood-opacity="0.46"
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
        dy="8"
        stdDeviation="7"
        flood-color="#000000"
        flood-opacity="0.34"
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
        stop-color="#c58b4d"
      />

      <stop
        offset="0.48"
        stop-color="#784526"
      />

      <stop
        offset="1"
        stop-color="#2f1b13"
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
        stop-color="#dbb071"
      />

      <stop
        offset="1"
        stop-color="#86522e"
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
        stop-color="#68402c"
      />

      <stop
        offset="0.5"
        stop-color="#3b241a"
      />

      <stop
        offset="1"
        stop-color="#17100d"
      />
    </linearGradient>

    <linearGradient
      id="tecidoVermelho"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#9f4252"
      />

      <stop
        offset="0.5"
        stop-color="#652434"
      />

      <stop
        offset="1"
        stop-color="#2b111c"
      />
    </linearGradient>

    <linearGradient
      id="tecidoVerde"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#73856a"
      />

      <stop
        offset="0.5"
        stop-color="#465646"
      />

      <stop
        offset="1"
        stop-color="#202a23"
      />
    </linearGradient>

    <linearGradient
      id="tecidoBege"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#e2c999"
      />

      <stop
        offset="0.55"
        stop-color="#ad895d"
      />

      <stop
        offset="1"
        stop-color="#64482f"
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
        stop-color="#e1d6b0"
      />

      <stop
        offset="0.38"
        stop-color="#9e8b5c"
      />

      <stop
        offset="1"
        stop-color="#413623"
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
        stop-color="#f0e4bf"
      />

      <stop
        offset="0.58"
        stop-color="#c8b486"
      />

      <stop
        offset="1"
        stop-color="#88714d"
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
        stop-color="#e9ffff"
        stop-opacity=".85"
      />

      <stop
        offset="0.45"
        stop-color="#8fb6b6"
        stop-opacity=".62"
      />

      <stop
        offset="1"
        stop-color="#365255"
        stop-opacity=".88"
      />
    </linearGradient>

    <radialGradient
      id="ouro"
      cx="38%"
      cy="30%"
      r="76%"
    >
      <stop
        offset="0"
        stop-color="#fff0a1"
      />

      <stop
        offset="0.45"
        stop-color="#d9a438"
      />

      <stop
        offset="1"
        stop-color="#6d4318"
      />
    </radialGradient>
  </defs>

${conteudo}
</svg>
`;
}

const ASSETS = {
  "sofa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="50"
      y="157"
      width="412"
      height="256"
      rx="70"
      fill="#211219"
      stroke="#0c070a"
      stroke-width="18"
    />

    <rect
      x="82"
      y="181"
      width="348"
      height="203"
      rx="53"
      fill="url(#tecidoVermelho)"
      stroke="#4b1726"
      stroke-width="10"
    />

    <rect
      x="111"
      y="72"
      width="290"
      height="194"
      rx="63"
      fill="#211219"
      stroke="#0c070a"
      stroke-width="18"
    />

    <rect
      x="139"
      y="96"
      width="234"
      height="144"
      rx="45"
      fill="url(#tecidoVermelho)"
      stroke="#521b2b"
      stroke-width="9"
    />

    <path
      d="M256 103v132M92 286h328"
      stroke="#c17a87"
      stroke-width="7"
      opacity=".35"
    />

    <circle
      cx="195"
      cy="165"
      r="13"
      fill="#d09a9d"
      opacity=".58"
    />

    <circle
      cx="317"
      cy="165"
      r="13"
      fill="#d09a9d"
      opacity=".58"
    />

    <rect
      x="37"
      y="213"
      width="96"
      height="176"
      rx="39"
      fill="url(#tecidoVermelho)"
      stroke="#3d1421"
      stroke-width="12"
    />

    <rect
      x="379"
      y="213"
      width="96"
      height="176"
      rx="39"
      fill="url(#tecidoVermelho)"
      stroke="#3d1421"
      stroke-width="12"
    />

    <path
      d="M101 401 77 463M411 401l24 62"
      stroke="#39251b"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M57 464h72M383 464h72"
      stroke="#15100d"
      stroke-width="13"
      stroke-linecap="round"
    />
  </g>`),

  "poltrona.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="114"
      y="151"
      width="284"
      height="264"
      rx="76"
      fill="#1d1613"
      stroke="#0b0807"
      stroke-width="18"
    />

    <rect
      x="143"
      y="177"
      width="226"
      height="207"
      rx="58"
      fill="url(#tecidoVerde)"
      stroke="#344033"
      stroke-width="10"
    />

    <rect
      x="145"
      y="58"
      width="222"
      height="232"
      rx="73"
      fill="#1c1512"
      stroke="#0b0807"
      stroke-width="18"
    />

    <rect
      x="171"
      y="83"
      width="170"
      height="183"
      rx="53"
      fill="url(#tecidoVerde)"
      stroke="#344033"
      stroke-width="9"
    />

    <path
      d="M256 91v168"
      stroke="#9ca789"
      stroke-width="7"
      opacity=".35"
    />

    <circle
      cx="256"
      cy="172"
      r="14"
      fill="#a7b08e"
      opacity=".5"
    />

    <rect
      x="73"
      y="211"
      width="94"
      height="172"
      rx="41"
      fill="url(#tecidoVerde)"
      stroke="#2a352a"
      stroke-width="12"
    />

    <rect
      x="345"
      y="211"
      width="94"
      height="172"
      rx="41"
      fill="url(#tecidoVerde)"
      stroke="#2a352a"
      stroke-width="12"
    />

    <path
      d="M158 403 124 470M354 403l34 67"
      stroke="#3c281c"
      stroke-width="26"
      stroke-linecap="round"
    />

    <path
      d="M102 470h79M331 470h79"
      stroke="#16100d"
      stroke-width="13"
      stroke-linecap="round"
    />
  </g>`),

  "mesa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="55"
      y="88"
      width="402"
      height="270"
      rx="44"
      fill="#1a100c"
      stroke="#090605"
      stroke-width="18"
    />

    <rect
      x="79"
      y="112"
      width="354"
      height="222"
      rx="30"
      fill="url(#madeiraClara)"
      stroke="#5c321d"
      stroke-width="10"
    />

    <path
      d="M167 119v208M256 119v208M345 119v208"
      stroke="#71401f"
      stroke-width="8"
      opacity=".76"
    />

    <path
      d="M102 169c69-24 119 18 192-4 45-14 78 9 112 0M103 258c83 18 139-16 216 4 29 8 58 0 87-10"
      fill="none"
      stroke="#885329"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".67"
    />

    <path
      d="M112 352 73 458M400 352l39 106M179 352l-11 114M333 352l11 114"
      stroke="#3d2a20"
      stroke-width="27"
      stroke-linecap="round"
    />

    <path
      d="M55 459h111M346 459h111M127 470h82M303 470h82"
      stroke="#130e0b"
      stroke-width="14"
      stroke-linecap="round"
    />

    <circle
      cx="256"
      cy="223"
      r="57"
      fill="#332016"
      stroke="#a56a35"
      stroke-width="8"
      opacity=".5"
    />
  </g>`),

  "cadeira.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="145"
      y="50"
      width="222"
      height="248"
      rx="50"
      fill="#1a110d"
      stroke="#090605"
      stroke-width="18"
    />

    <rect
      x="169"
      y="75"
      width="174"
      height="198"
      rx="36"
      fill="url(#tecidoBege)"
      stroke="#705030"
      stroke-width="9"
    />

    <path
      d="M190 122h132M190 165h132M190 208h132"
      stroke="#e0c598"
      stroke-width="7"
      opacity=".36"
    />

    <rect
      x="126"
      y="272"
      width="260"
      height="136"
      rx="43"
      fill="#1b120e"
      stroke="#090605"
      stroke-width="17"
    />

    <rect
      x="151"
      y="295"
      width="210"
      height="88"
      rx="29"
      fill="url(#tecidoBege)"
      stroke="#705030"
      stroke-width="9"
    />

    <path
      d="M166 398 112 477M346 398l54 79M190 404l-8 78M322 404l8 78"
      stroke="#4b3020"
      stroke-width="24"
      stroke-linecap="round"
    />

    <path
      d="M87 478h79M346 478h79M145 484h73M294 484h73"
      stroke="#15100d"
      stroke-width="12"
      stroke-linecap="round"
    />
  </g>`),

  "estante.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="58"
      y="45"
      width="396"
      height="424"
      rx="34"
      fill="#17100d"
      stroke="#080504"
      stroke-width="18"
    />

    <rect
      x="83"
      y="70"
      width="346"
      height="374"
      rx="21"
      fill="url(#madeiraEscura)"
      stroke="#4d2f21"
      stroke-width="10"
    />

    <path
      d="M89 158h334M89 250h334M89 342h334"
      stroke="#a16b3c"
      stroke-width="14"
    />

    <path
      d="M112 88v338M400 88v338"
      stroke="#241712"
      stroke-width="15"
    />

    <g stroke="#2a1812" stroke-width="5">
      <rect x="123" y="96" width="40" height="53" rx="5" fill="#8d2835" />
      <rect x="168" y="89" width="37" height="60" rx="5" fill="#3f6270" />
      <rect x="210" y="100" width="51" height="49" rx="5" fill="#b48b48" />
      <rect x="267" y="92" width="35" height="57" rx="5" fill="#52683d" />
      <rect x="307" y="97" width="49" height="52" rx="5" fill="#6d365d" />
      <rect x="361" y="88" width="28" height="61" rx="5" fill="#a26238" />

      <rect x="121" y="181" width="56" height="60" rx="5" fill="#73502e" />
      <rect x="182" y="191" width="38" height="50" rx="5" fill="#8d3040" />
      <rect x="225" y="178" width="48" height="63" rx="5" fill="#425f6a" />
      <rect x="278" y="188" width="31" height="53" rx="5" fill="#a78243" />
      <rect x="314" y="181" width="39" height="60" rx="5" fill="#4e6740" />
      <rect x="358" y="194" width="31" height="47" rx="5" fill="#784265" />

      <rect x="123" y="275" width="36" height="58" rx="5" fill="#46646e" />
      <rect x="164" y="282" width="51" height="51" rx="5" fill="#a46e36" />
      <rect x="220" y="270" width="34" height="63" rx="5" fill="#71313e" />
      <rect x="259" y="278" width="47" height="55" rx="5" fill="#506a42" />
      <rect x="311" y="269" width="38" height="64" rx="5" fill="#99743d" />
      <rect x="354" y="284" width="35" height="49" rx="5" fill="#68445f" />

      <rect x="121" y="370" width="52" height="56" rx="5" fill="#88683a" />
      <rect x="178" y="363" width="35" height="63" rx="5" fill="#405e6b" />
      <rect x="218" y="374" width="43" height="52" rx="5" fill="#7f2e3e" />
      <rect x="266" y="365" width="34" height="61" rx="5" fill="#536b40" />
      <rect x="305" y="371" width="49" height="55" rx="5" fill="#9f6e39" />
      <rect x="359" y="362" width="29" height="64" rx="5" fill="#69465d" />
    </g>
  </g>`),

  "livro.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M69 135c70-33 135-24 187 17v276c-52-41-117-50-187-17V135Z"
      fill="#e7d9ad"
      stroke="#514431"
      stroke-width="12"
      stroke-linejoin="round"
    />

    <path
      d="M443 135c-70-33-135-24-187 17v276c52-41 117-50 187-17V135Z"
      fill="#e7d9ad"
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

    <path
      d="m256 152-30-76h60l-30 76Z"
      fill="#8f263d"
      stroke="#48101e"
      stroke-width="7"
    />
  </g>`),

  "armario.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="75"
      y="49"
      width="362"
      height="416"
      rx="34"
      fill="#17100d"
      stroke="#080504"
      stroke-width="18"
    />

    <rect
      x="99"
      y="74"
      width="314"
      height="366"
      rx="20"
      fill="url(#madeira)"
      stroke="#4e2e1d"
      stroke-width="10"
    />

    <path
      d="M256 77v360"
      stroke="#2e1a12"
      stroke-width="13"
    />

    <path
      d="M119 151h117M276 151h117M119 349h117M276 349h117"
      stroke="#a06a37"
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
      stroke="#463922"
      stroke-width="5"
    />

    <rect
      x="283"
      y="214"
      width="21"
      height="83"
      rx="10"
      fill="url(#metal)"
      stroke="#463922"
      stroke-width="5"
    />

    <path
      d="M122 111c35 15 70-10 111 4M280 109c30 17 72-7 110 6M122 387c35-14 70 8 112-4M280 389c34-16 73 8 111-4"
      fill="none"
      stroke="#c28448"
      stroke-width="6"
      opacity=".48"
    />

    <rect
      x="96"
      y="435"
      width="77"
      height="30"
      rx="8"
      fill="#1a120e"
    />

    <rect
      x="339"
      y="435"
      width="77"
      height="30"
      rx="8"
      fill="#1a120e"
    />
  </g>`),

  "cama.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="71"
      y="83"
      width="370"
      height="368"
      rx="46"
      fill="#1a120e"
      stroke="#090605"
      stroke-width="18"
    />

    <rect
      x="94"
      y="106"
      width="324"
      height="322"
      rx="34"
      fill="url(#tecidoBege)"
      stroke="#6f4e2e"
      stroke-width="10"
    />

    <rect
      x="116"
      y="126"
      width="280"
      height="88"
      rx="35"
      fill="#eee0ba"
      stroke="#867351"
      stroke-width="8"
    />

    <path
      d="M105 235h302"
      stroke="#7a5635"
      stroke-width="9"
      opacity=".58"
    />

    <path
      d="M256 238v176"
      stroke="#8d6741"
      stroke-width="8"
      opacity=".42"
    />

    <path
      d="M116 270c55 26 102-13 140 10 39-23 86 16 140-10"
      fill="none"
      stroke="#ead3a2"
      stroke-width="9"
      stroke-linecap="round"
      opacity=".55"
    />

    <path
      d="M94 424 63 481M418 424l31 57"
      stroke="#4b3020"
      stroke-width="24"
      stroke-linecap="round"
    />

    <path
      d="M44 481h88M380 481h88"
      stroke="#15100d"
      stroke-width="13"
      stroke-linecap="round"
    />
  </g>`),

  "criado-mudo.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="102"
      y="91"
      width="308"
      height="354"
      rx="35"
      fill="#17100d"
      stroke="#080504"
      stroke-width="18"
    />

    <rect
      x="126"
      y="115"
      width="260"
      height="306"
      rx="21"
      fill="url(#madeiraClara)"
      stroke="#5b351f"
      stroke-width="10"
    />

    <rect
      x="145"
      y="148"
      width="222"
      height="101"
      rx="18"
      fill="#6e4125"
      stroke="#382116"
      stroke-width="9"
    />

    <rect
      x="145"
      y="278"
      width="222"
      height="101"
      rx="18"
      fill="#6e4125"
      stroke="#382116"
      stroke-width="9"
    />

    <rect
      x="220"
      y="180"
      width="72"
      height="24"
      rx="12"
      fill="url(#metal)"
      stroke="#463821"
      stroke-width="5"
    />

    <rect
      x="220"
      y="310"
      width="72"
      height="24"
      rx="12"
      fill="url(#metal)"
      stroke="#463821"
      stroke-width="5"
    />

    <path
      d="M137 421 115 470M375 421l22 49"
      stroke="#3f291c"
      stroke-width="22"
      stroke-linecap="round"
    />

    <path
      d="M96 470h63M353 470h63"
      stroke="#15100d"
      stroke-width="12"
      stroke-linecap="round"
    />
  </g>`),

  "piano.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M55 112c0-38 31-69 69-69h206c71 0 127 57 127 127v212c0 47-38 85-85 85H124c-38 0-69-31-69-69V112Z"
      fill="#13100f"
      stroke="#070605"
      stroke-width="18"
    />

    <path
      d="M81 123c0-30 24-54 54-54h184c62 0 112 50 112 112v179c0 42-34 76-76 76H135c-30 0-54-24-54-54V123Z"
      fill="url(#madeiraEscura)"
      stroke="#543323"
      stroke-width="10"
    />

    <rect
      x="104"
      y="256"
      width="280"
      height="117"
      rx="18"
      fill="#171514"
      stroke="#080706"
      stroke-width="10"
    />

    <g fill="#ece5cf" stroke="#625c4f" stroke-width="3">
      <rect x="118" y="270" width="26" height="86" rx="3" />
      <rect x="146" y="270" width="26" height="86" rx="3" />
      <rect x="174" y="270" width="26" height="86" rx="3" />
      <rect x="202" y="270" width="26" height="86" rx="3" />
      <rect x="230" y="270" width="26" height="86" rx="3" />
      <rect x="258" y="270" width="26" height="86" rx="3" />
      <rect x="286" y="270" width="26" height="86" rx="3" />
      <rect x="314" y="270" width="26" height="86" rx="3" />
      <rect x="342" y="270" width="26" height="86" rx="3" />
    </g>

    <g fill="#171514">
      <rect x="136" y="270" width="18" height="52" rx="3" />
      <rect x="192" y="270" width="18" height="52" rx="3" />
      <rect x="220" y="270" width="18" height="52" rx="3" />
      <rect x="276" y="270" width="18" height="52" rx="3" />
      <rect x="332" y="270" width="18" height="52" rx="3" />
    </g>

    <path
      d="M110 192c63-51 149-60 239-33"
      fill="none"
      stroke="#8e603d"
      stroke-width="13"
      stroke-linecap="round"
      opacity=".55"
    />

    <circle
      cx="266"
      cy="159"
      r="33"
      fill="url(#ouro)"
      stroke="#5c451d"
      stroke-width="8"
    />

    <path
      d="M120 435 96 486M374 435l24 51"
      stroke="#2c211a"
      stroke-width="24"
      stroke-linecap="round"
    />
  </g>`),

  "quadro.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="61"
      y="54"
      width="390"
      height="404"
      rx="22"
      fill="#1a100c"
      stroke="#080504"
      stroke-width="18"
    />

    <rect
      x="88"
      y="81"
      width="336"
      height="350"
      rx="12"
      fill="url(#ouro)"
      stroke="#60461c"
      stroke-width="10"
    />

    <rect
      x="111"
      y="104"
      width="290"
      height="304"
      rx="7"
      fill="#2a4039"
      stroke="#19120e"
      stroke-width="9"
    />

    <path
      d="M124 342c52-88 98-129 138-122 39 7 60 47 126 122"
      fill="#4d6751"
      stroke="#1f3129"
      stroke-width="8"
    />

    <path
      d="M129 341h258v55H129z"
      fill="#2d483c"
    />

    <circle
      cx="335"
      cy="165"
      r="44"
      fill="#d8b45d"
      opacity=".82"
    />

    <path
      d="M177 244c16-50 45-78 81-78s65 28 81 78"
      fill="#495354"
      stroke="#20282a"
      stroke-width="8"
    />

    <ellipse
      cx="258"
      cy="206"
      rx="34"
      ry="44"
      fill="#b99170"
      stroke="#4d3426"
      stroke-width="7"
    />

    <path
      d="M227 200c5-43 58-55 69-6"
      fill="#362419"
      stroke="#1d130e"
      stroke-width="8"
    />

    <path
      d="M225 256c25-24 48-32 66-24 20 8 32 27 43 53"
      fill="#6d2737"
      stroke="#32101a"
      stroke-width="8"
    />
  </g>`),

  "tapete.svg": criarSvg(`
  <g filter="url(#sombraLeve)">
    <rect
      x="49"
      y="92"
      width="414"
      height="328"
      rx="31"
      fill="#241018"
      stroke="#0b0508"
      stroke-width="18"
    />

    <rect
      x="72"
      y="115"
      width="368"
      height="282"
      rx="22"
      fill="url(#tecidoVermelho)"
      stroke="#6d2638"
      stroke-width="10"
    />

    <rect
      x="101"
      y="143"
      width="310"
      height="226"
      rx="17"
      fill="none"
      stroke="url(#ouro)"
      stroke-width="13"
    />

    <path
      d="M256 162 294 218l68 14-47 50 8 70-67-29-67 29 8-70-47-50 68-14 38-56Z"
      fill="#48202b"
      stroke="#d1a448"
      stroke-width="9"
      stroke-linejoin="round"
    />

    <circle
      cx="256"
      cy="260"
      r="54"
      fill="none"
      stroke="#c99b45"
      stroke-width="9"
    />

    <path
      d="M94 420v51M125 420v51M156 420v51M356 420v51M387 420v51M418 420v51"
      stroke="#b78848"
      stroke-width="11"
      stroke-linecap="round"
    />
  </g>`),

  "caixa.svg": criarSvg(`
  <g filter="url(#sombra)">
    <rect
      x="68"
      y="68"
      width="376"
      height="376"
      rx="29"
      fill="#17100d"
      stroke="#080504"
      stroke-width="18"
    />

    <rect
      x="92"
      y="92"
      width="328"
      height="328"
      rx="17"
      fill="url(#madeiraClara)"
      stroke="#5c351f"
      stroke-width="10"
    />

    <path
      d="M102 168h308M102 256h308M102 344h308"
      stroke="#72401f"
      stroke-width="9"
    />

    <path
      d="M112 119 398 397M399 119 114 398"
      stroke="#4b2819"
      stroke-width="30"
    />

    <path
      d="M112 119 398 397M399 119 114 398"
      stroke="#a56534"
      stroke-width="13"
    />

    <rect
      x="207"
      y="207"
      width="98"
      height="98"
      rx="16"
      fill="#26211b"
      stroke="#0e0c09"
      stroke-width="10"
    />

    <circle
      cx="256"
      cy="256"
      r="29"
      fill="url(#ouro)"
      stroke="#53401e"
      stroke-width="7"
    />

    <g fill="#493c2b" stroke="#15110d" stroke-width="8">
      <rect x="68" y="68" width="70" height="70" rx="12" />
      <rect x="374" y="68" width="70" height="70" rx="12" />
      <rect x="68" y="374" width="70" height="70" rx="12" />
      <rect x="374" y="374" width="70" height="70" rx="12" />
    </g>
  </g>`),

  "espelho.svg": criarSvg(`
  <g filter="url(#sombra)">
    <ellipse
      cx="256"
      cy="256"
      rx="190"
      ry="221"
      fill="#1a100c"
      stroke="#080504"
      stroke-width="18"
    />

    <ellipse
      cx="256"
      cy="256"
      rx="165"
      ry="196"
      fill="url(#ouro)"
      stroke="#684d1f"
      stroke-width="11"
    />

    <ellipse
      cx="256"
      cy="256"
      rx="137"
      ry="168"
      fill="url(#vidro)"
      stroke="#4b6363"
      stroke-width="9"
    />

    <path
      d="M177 142c62-52 142-34 179 25M153 236c31-49 65-67 98-70"
      fill="none"
      stroke="#efffff"
      stroke-width="15"
      stroke-linecap="round"
      opacity=".38"
    />

    <path
      d="M319 108c31 24 49 50 55 78"
      fill="none"
      stroke="#ffffff"
      stroke-width="8"
      stroke-linecap="round"
      opacity=".42"
    />

    <path
      d="M256 40v-24M256 496v-24M66 256H39M473 256h-27"
      stroke="#b88937"
      stroke-width="15"
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
      stroke="#8f2d3d"
      stroke-width="10"
      stroke-linecap="round"
    />

    <circle
      cx="309"
      cy="374"
      r="48"
      fill="#7a1b2c"
      stroke="#3a0d17"
      stroke-width="8"
    />

    <path
      d="m309 344 12 25 28 3-21 18 7 27-26-15-25 15 7-27-21-18 28-3 11-25Z"
      fill="#c75a67"
    />
  </g>`),

  "objeto-deslocado.svg": criarSvg(`
  <g filter="url(#sombra)">
    <path
      d="M85 383 179 87l249 80-94 296L85 383Z"
      fill="#17100d"
      stroke="#080504"
      stroke-width="18"
      stroke-linejoin="round"
    />

    <path
      d="m112 365 82-251 207 67-82 251-207-67Z"
      fill="url(#madeiraEscura)"
      stroke="#41291c"
      stroke-width="10"
    />

    <path
      d="m205 146 166 54M186 207l166 54M166 270l166 54M147 333l166 54"
      stroke="#231511"
      stroke-width="8"
      opacity=".74"
    />

    <path
      d="M107 418 59 469M350 438l40 57M407 151l61-37"
      stroke="#302219"
      stroke-width="23"
      stroke-linecap="round"
    />

    <path
      d="M234 104 344 452"
      stroke="#8d2f4f"
      stroke-width="12"
      stroke-dasharray="22 13"
      opacity=".82"
    />

    <circle
      cx="241"
      cy="277"
      r="38"
      fill="#191016"
      stroke="#c64a70"
      stroke-width="8"
    />

    <path
      d="m241 253 10 20 22 3-16 15 5 22-21-11-20 11 5-22-16-15 22-3 9-20Z"
      fill="#db6b8b"
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
      "Pack inicial da Mansão concluído.",
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
      "Não foi possível gerar o pack da Mansão.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);