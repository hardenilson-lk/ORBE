import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const executarArquivo = promisify(execFile);

const DIRETORIO_SCRIPT =
  path.dirname(
    fileURLToPath(import.meta.url),
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
    "acampamento",
    "objetos",
  );

const SCRIPT_MANIFESTO =
  path.join(
    RAIZ_PROJETO,
    "scripts",
    "gerar-manifest-packs.mjs",
  );

function svg(
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
        flood-opacity="0.42"
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
        stop-color="#c88943"
      />
      <stop
        offset="0.5"
        stop-color="#8b4f25"
      />
      <stop
        offset="1"
        stop-color="#512b19"
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
        stop-color="#dbad68"
      />
      <stop
        offset="1"
        stop-color="#8d5429"
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
        stop-color="#d8ddd6"
      />
      <stop
        offset="0.45"
        stop-color="#7f8985"
      />
      <stop
        offset="1"
        stop-color="#343b3b"
      />
    </linearGradient>

    <linearGradient
      id="lonaVerde"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#83945c"
      />
      <stop
        offset="0.5"
        stop-color="#52643c"
      />
      <stop
        offset="1"
        stop-color="#2d3929"
      />
    </linearGradient>

    <linearGradient
      id="lonaBege"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d6bc83"
      />
      <stop
        offset="0.55"
        stop-color="#a47f48"
      />
      <stop
        offset="1"
        stop-color="#5f472d"
      />
    </linearGradient>

    <radialGradient
      id="fogo"
      cx="50%"
      cy="62%"
      r="48%"
    >
      <stop
        offset="0"
        stop-color="#fff8a8"
      />
      <stop
        offset="0.33"
        stop-color="#ffc43d"
      />
      <stop
        offset="0.68"
        stop-color="#f36a20"
      />
      <stop
        offset="1"
        stop-color="#7b1e16"
      />
    </radialGradient>

    <radialGradient
      id="folha"
      cx="35%"
      cy="30%"
      r="78%"
    >
      <stop
        offset="0"
        stop-color="#8db467"
      />
      <stop
        offset="0.45"
        stop-color="#426e3b"
      />
      <stop
        offset="1"
        stop-color="#173622"
      />
    </radialGradient>
  </defs>

${conteudo}
</svg>
`;
}

const ASSETS = {
  "barraca.svg": svg(`
  <g filter="url(#sombra)">
    <path
      d="M74 374 231 78c11-21 39-21 50 0l157 296c12 23-4 50-30 50H104c-26 0-42-27-30-50Z"
      fill="#2a2e24"
      stroke="#171a17"
      stroke-width="18"
      stroke-linejoin="round"
    />

    <path
      d="M95 365 240 94c7-13 25-13 32 0l145 271c7 14-3 31-19 31H114c-16 0-26-17-19-31Z"
      fill="url(#lonaVerde)"
      stroke="#a99b66"
      stroke-width="7"
    />

    <path
      d="M256 102v294"
      stroke="#e0c98d"
      stroke-width="9"
      opacity=".72"
    />

    <path
      d="M256 182 164 394h184L256 182Z"
      fill="#253127"
      stroke="#121713"
      stroke-width="8"
    />

    <path
      d="M256 203 204 385h104l-52-182Z"
      fill="#151b17"
    />

    <path
      d="M116 345 256 101l140 244"
      fill="none"
      stroke="#cbb77a"
      stroke-width="7"
      opacity=".55"
    />

    <path
      d="M84 409 47 448M428 409l37 39M76 367l-47 9M436 367l47 9"
      stroke="#6d4c2d"
      stroke-width="11"
      stroke-linecap="round"
    />

    <circle
      cx="47"
      cy="448"
      r="10"
      fill="#38423d"
      stroke="#151918"
      stroke-width="5"
    />

    <circle
      cx="465"
      cy="448"
      r="10"
      fill="#38423d"
      stroke="#151918"
      stroke-width="5"
    />
  </g>`),

  "cama-de-campanha.svg": svg(`
  <g filter="url(#sombra)">
    <rect
      x="82"
      y="88"
      width="348"
      height="336"
      rx="38"
      fill="#252924"
      stroke="#111512"
      stroke-width="17"
    />

    <rect
      x="104"
      y="108"
      width="304"
      height="296"
      rx="29"
      fill="url(#lonaVerde)"
      stroke="#9b8e62"
      stroke-width="8"
    />

    <path
      d="M114 145h284M114 366h284"
      stroke="#c5b47a"
      stroke-width="7"
      opacity=".54"
    />

    <rect
      x="127"
      y="126"
      width="258"
      height="77"
      rx="28"
      fill="#c9b882"
      stroke="#6d6042"
      stroke-width="6"
    />

    <path
      d="M101 102 65 54M411 102l36-48M101 410l-36 48M411 410l36 48"
      stroke="#555f5b"
      stroke-width="16"
      stroke-linecap="round"
    />

    <path
      d="M81 79 431 433M431 79 81 433"
      stroke="#7e8984"
      stroke-width="12"
      opacity=".86"
    />

    <circle
      cx="84"
      cy="82"
      r="14"
      fill="#b8beb5"
      stroke="#303735"
      stroke-width="6"
    />

    <circle
      cx="428"
      cy="82"
      r="14"
      fill="#b8beb5"
      stroke="#303735"
      stroke-width="6"
    />

    <circle
      cx="84"
      cy="430"
      r="14"
      fill="#b8beb5"
      stroke="#303735"
      stroke-width="6"
    />

    <circle
      cx="428"
      cy="430"
      r="14"
      fill="#b8beb5"
      stroke="#303735"
      stroke-width="6"
    />
  </g>`),

  "banco.svg": svg(`
  <g filter="url(#sombra)">
    <rect
      x="61"
      y="150"
      width="390"
      height="182"
      rx="29"
      fill="#2d2119"
      stroke="#16110d"
      stroke-width="17"
    />

    <rect
      x="82"
      y="171"
      width="348"
      height="140"
      rx="18"
      fill="url(#madeiraClara)"
      stroke="#63391f"
      stroke-width="8"
    />

    <path
      d="M151 178v126M256 178v126M361 178v126"
      stroke="#6d3e21"
      stroke-width="8"
      opacity=".75"
    />

    <path
      d="M101 205c74 20 129-16 205 5s91-8 109-2M104 272c95-22 156 19 304-6"
      fill="none"
      stroke="#764525"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".72"
    />

    <rect
      x="93"
      y="326"
      width="54"
      height="116"
      rx="12"
      fill="#464c48"
      stroke="#171a18"
      stroke-width="9"
    />

    <rect
      x="365"
      y="326"
      width="54"
      height="116"
      rx="12"
      fill="#464c48"
      stroke="#171a18"
      stroke-width="9"
    />

    <rect
      x="86"
      y="429"
      width="68"
      height="25"
      rx="9"
      fill="#1d201f"
    />

    <rect
      x="358"
      y="429"
      width="68"
      height="25"
      rx="9"
      fill="#1d201f"
    />
  </g>`),

  "mesa.svg": svg(`
  <g filter="url(#sombra)">
    <rect
      x="66"
      y="100"
      width="380"
      height="232"
      rx="31"
      fill="#2a1d15"
      stroke="#130e0b"
      stroke-width="18"
    />

    <rect
      x="88"
      y="121"
      width="336"
      height="190"
      rx="21"
      fill="url(#madeiraClara)"
      stroke="#6a3c20"
      stroke-width="9"
    />

    <path
      d="M172 128v176M256 128v176M340 128v176"
      stroke="#754422"
      stroke-width="8"
      opacity=".74"
    />

    <path
      d="M110 166c58-21 116 18 190-5 48-15 80 9 103 1M108 252c76 17 130-13 205 4 38 9 65-2 92-10"
      fill="none"
      stroke="#81502b"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".68"
    />

    <path
      d="M116 330 78 437M396 330l38 107M176 330l-9 116M336 330l9 116"
      stroke="#4d3424"
      stroke-width="23"
      stroke-linecap="round"
    />

    <path
      d="M92 429h70M350 429h70M132 444h70M310 444h70"
      stroke="#1b1714"
      stroke-width="12"
      stroke-linecap="round"
    />
  </g>`),

  "fogueira.svg": svg(`
  <g filter="url(#sombra)">
    <circle
      cx="256"
      cy="281"
      r="157"
      fill="#282925"
      stroke="#111310"
      stroke-width="17"
    />

    <g
      fill="#7b7366"
      stroke="#2b2c29"
      stroke-width="7"
    >
      <ellipse
        cx="256"
        cy="126"
        rx="46"
        ry="27"
      />

      <ellipse
        cx="356"
        cy="163"
        rx="46"
        ry="27"
        transform="rotate(39 356 163)"
      />

      <ellipse
        cx="400"
        cy="264"
        rx="46"
        ry="27"
        transform="rotate(79 400 264)"
      />

      <ellipse
        cx="363"
        cy="366"
        rx="46"
        ry="27"
        transform="rotate(125 363 366)"
      />

      <ellipse
        cx="256"
        cy="407"
        rx="46"
        ry="27"
      />

      <ellipse
        cx="151"
        cy="367"
        rx="46"
        ry="27"
        transform="rotate(52 151 367)"
      />

      <ellipse
        cx="111"
        cy="263"
        rx="46"
        ry="27"
        transform="rotate(101 111 263)"
      />

      <ellipse
        cx="155"
        cy="164"
        rx="46"
        ry="27"
        transform="rotate(141 155 164)"
      />
    </g>

    <path
      d="M151 334 359 206M151 206l208 128"
      stroke="#4a2818"
      stroke-width="41"
      stroke-linecap="round"
    />

    <path
      d="M151 334 359 206M151 206l208 128"
      stroke="url(#madeira)"
      stroke-width="27"
      stroke-linecap="round"
    />

    <path
      d="M256 345c-69 0-106-47-88-99 13-37 48-51 42-99 44 26 52 61 44 91 32-22 53-55 45-99 53 43 69 89 41 137-17 30-46 69-84 69Z"
      fill="url(#fogo)"
      stroke="#7f2416"
      stroke-width="8"
    />

    <path
      d="M256 326c-32 0-54-22-46-50 7-24 28-34 25-62 31 23 39 50 21 77 23-13 37-30 40-54 20 31 16 58-2 78-10 11-23 11-38 11Z"
      fill="#fff2a1"
      opacity=".88"
    />
  </g>`),

  "caixa.svg": svg(`
  <g filter="url(#sombra)">
    <rect
      x="72"
      y="67"
      width="368"
      height="378"
      rx="27"
      fill="#342017"
      stroke="#17100c"
      stroke-width="18"
    />

    <rect
      x="94"
      y="90"
      width="324"
      height="332"
      rx="15"
      fill="url(#madeiraClara)"
      stroke="#6a3b1f"
      stroke-width="9"
    />

    <path
      d="M105 161h302M105 256h302M105 351h302"
      stroke="#6f3e20"
      stroke-width="9"
    />

    <path
      d="M112 121 395 395M400 119 116 397"
      stroke="#74401f"
      stroke-width="29"
    />

    <path
      d="M112 121 395 395M400 119 116 397"
      stroke="#a96332"
      stroke-width="13"
    />

    <rect
      x="215"
      y="217"
      width="82"
      height="82"
      rx="13"
      fill="#2d302d"
      stroke="#151815"
      stroke-width="10"
    />

    <circle
      cx="256"
      cy="258"
      r="13"
      fill="#b7ad83"
      stroke="#34342e"
      stroke-width="5"
    />

    <rect
      x="73"
      y="67"
      width="71"
      height="70"
      rx="12"
      fill="#3c4140"
      stroke="#151817"
      stroke-width="9"
    />

    <rect
      x="368"
      y="67"
      width="71"
      height="70"
      rx="12"
      fill="#3c4140"
      stroke="#151817"
      stroke-width="9"
    />

    <rect
      x="73"
      y="375"
      width="71"
      height="70"
      rx="12"
      fill="#3c4140"
      stroke="#151817"
      stroke-width="9"
    />

    <rect
      x="368"
      y="375"
      width="71"
      height="70"
      rx="12"
      fill="#3c4140"
      stroke="#151817"
      stroke-width="9"
    />
  </g>`),

  "mochila.svg": svg(`
  <g filter="url(#sombra)">
    <path
      d="M157 116c0-49 40-89 89-89h20c49 0 89 40 89 89v30c46 28 72 80 67 137l-10 115c-4 48-45 85-93 85H193c-48 0-89-37-93-85L90 283c-5-57 21-109 67-137v-30Z"
      fill="#242a24"
      stroke="#101411"
      stroke-width="18"
    />

    <path
      d="M175 122c0-35 28-63 63-63h36c35 0 63 28 63 63v46H175v-46Z"
      fill="url(#lonaVerde)"
      stroke="#89966a"
      stroke-width="8"
    />

    <path
      d="M129 186c37-33 75-42 127-42s90 9 127 42l12 196c2 36-26 66-62 66H179c-36 0-64-30-62-66l12-196Z"
      fill="url(#lonaVerde)"
      stroke="#89966a"
      stroke-width="9"
    />

    <rect
      x="151"
      y="285"
      width="210"
      height="126"
      rx="34"
      fill="#3f5038"
      stroke="#1d271c"
      stroke-width="9"
    />

    <path
      d="M148 236h216M178 169v77M334 169v77"
      stroke="#c1b77f"
      stroke-width="8"
      opacity=".55"
    />

    <rect
      x="235"
      y="252"
      width="42"
      height="63"
      rx="12"
      fill="#252a27"
      stroke="#101311"
      stroke-width="7"
    />

    <path
      d="M121 208c-55 36-60 110-36 163M391 208c55 36 60 110 36 163"
      fill="none"
      stroke="#232723"
      stroke-width="24"
      stroke-linecap="round"
    />
  </g>`),

  "armario.svg": svg(`
  <g filter="url(#sombra)">
    <rect
      x="78"
      y="58"
      width="356"
      height="400"
      rx="27"
      fill="#232825"
      stroke="#101311"
      stroke-width="18"
    />

    <rect
      x="100"
      y="80"
      width="312"
      height="356"
      rx="15"
      fill="url(#madeira)"
      stroke="#552f1c"
      stroke-width="9"
    />

    <path
      d="M256 82v352"
      stroke="#4a2919"
      stroke-width="11"
    />

    <path
      d="M116 153h124M272 153h124M116 350h124M272 350h124"
      stroke="#6f3f23"
      stroke-width="8"
      opacity=".78"
    />

    <rect
      x="219"
      y="224"
      width="20"
      height="77"
      rx="10"
      fill="url(#metal)"
      stroke="#282e2c"
      stroke-width="5"
    />

    <rect
      x="273"
      y="224"
      width="20"
      height="77"
      rx="10"
      fill="url(#metal)"
      stroke="#282e2c"
      stroke-width="5"
    />

    <path
      d="M123 116c25 12 74-8 106 5M282 112c27 15 70-8 104 7M119 386c38-13 71 9 112-5M281 390c35-16 71 8 106-4"
      fill="none"
      stroke="#a46a39"
      stroke-width="6"
      opacity=".55"
    />

    <rect
      x="96"
      y="430"
      width="72"
      height="28"
      rx="8"
      fill="#242823"
    />

    <rect
      x="344"
      y="430"
      width="72"
      height="28"
      rx="8"
      fill="#242823"
    />
  </g>`),

  "utensilio.svg": svg(`
  <g filter="url(#sombraLeve)">
    <ellipse
      cx="230"
      cy="280"
      rx="154"
      ry="122"
      fill="#222725"
      stroke="#101312"
      stroke-width="16"
    />

    <ellipse
      cx="230"
      cy="264"
      rx="134"
      ry="103"
      fill="url(#metal)"
      stroke="#3b4542"
      stroke-width="9"
    />

    <ellipse
      cx="230"
      cy="242"
      rx="105"
      ry="73"
      fill="#323a37"
      stroke="#171b1a"
      stroke-width="8"
    />

    <path
      d="M121 255c44 34 161 48 219-3"
      fill="none"
      stroke="#c5ccc3"
      stroke-width="7"
      opacity=".42"
    />

    <path
      d="M89 228 42 188M371 228l50-41"
      stroke="#555f5c"
      stroke-width="25"
      stroke-linecap="round"
    />

    <path
      d="M370 95c19 5 34 20 39 39L470 373c6 23-8 46-31 52-23 5-46-9-52-32l-61-239c-6-23 8-46 31-52l13-7Z"
      fill="#454e4b"
      stroke="#171b1a"
      stroke-width="11"
    />

    <path
      d="m361 143 26-7 51 201-26 7-51-201Z"
      fill="#cbd0c8"
      opacity=".62"
    />

    <path
      d="M71 384c56-45 105-56 154-25"
      fill="none"
      stroke="#c0c7c0"
      stroke-width="14"
      stroke-linecap="round"
    />

    <circle
      cx="65"
      cy="389"
      r="27"
      fill="#737d78"
      stroke="#242b28"
      stroke-width="8"
    />
  </g>`),

  "lanterna.svg": svg(`
  <g filter="url(#sombra)">
    <path
      d="M174 100c0-48 37-87 82-87s82 39 82 87v43h-34v-38c0-29-22-52-48-52s-48 23-48 52v38h-34v-43Z"
      fill="#414844"
      stroke="#151918"
      stroke-width="12"
    />

    <rect
      x="132"
      y="119"
      width="248"
      height="327"
      rx="56"
      fill="#252b28"
      stroke="#101312"
      stroke-width="18"
    />

    <rect
      x="159"
      y="153"
      width="194"
      height="211"
      rx="38"
      fill="#4b5650"
      stroke="#1a211e"
      stroke-width="10"
    />

    <rect
      x="181"
      y="174"
      width="150"
      height="169"
      rx="29"
      fill="#f6dfa0"
      stroke="#797557"
      stroke-width="8"
    />

    <radialGradient
      id="luzLanterna"
      cx="50%"
      cy="46%"
      r="54%"
    >
      <stop
        offset="0"
        stop-color="#fffbd0"
      />
      <stop
        offset="0.55"
        stop-color="#ffd86c"
      />
      <stop
        offset="1"
        stop-color="#b86d23"
        stop-opacity=".45"
      />
    </radialGradient>

    <rect
      x="191"
      y="185"
      width="130"
      height="148"
      rx="22"
      fill="url(#luzLanterna)"
    />

    <path
      d="M217 180v158M295 180v158"
      stroke="#6b705f"
      stroke-width="8"
      opacity=".62"
    />

    <rect
      x="179"
      y="385"
      width="154"
      height="41"
      rx="17"
      fill="#131715"
    />

    <circle
      cx="256"
      cy="405"
      r="13"
      fill="#8c946e"
    />
  </g>`),

  "placa.svg": svg(`
  <g filter="url(#sombra)">
    <path
      d="M232 260h48v206h-48z"
      fill="#4d321f"
      stroke="#21150e"
      stroke-width="12"
    />

    <path
      d="m256 492-42-45h84l-42 45Z"
      fill="#302217"
      stroke="#17100b"
      stroke-width="8"
    />

    <path
      d="M60 87h314l78 95-78 95H60c-16 0-29-13-29-29V116c0-16 13-29 29-29Z"
      fill="#2c1d14"
      stroke="#130d09"
      stroke-width="17"
    />

    <path
      d="M76 108h285l62 74-62 74H76c-11 0-20-9-20-20V128c0-11 9-20 20-20Z"
      fill="url(#madeiraClara)"
      stroke="#704120"
      stroke-width="8"
    />

    <path
      d="M99 146h227M99 197h263"
      stroke="#71411f"
      stroke-width="8"
      opacity=".72"
    />

    <circle
      cx="85"
      cy="132"
      r="10"
      fill="#b3a274"
      stroke="#4a402e"
      stroke-width="4"
    />

    <circle
      cx="85"
      cy="230"
      r="10"
      fill="#b3a274"
      stroke="#4a402e"
      stroke-width="4"
    />

    <path
      d="m365 150 36 32-36 32"
      fill="none"
      stroke="#4d2e1b"
      stroke-width="14"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>`),

  "tronco.svg": svg(`
  <g filter="url(#sombra)">
    <path
      d="M73 309c-23-58 6-122 64-146l202-82c58-24 125 4 149 62s-4 125-62 149l-202 82c-58 24-128-7-151-65Z"
      fill="#321f15"
      stroke="#160f0b"
      stroke-width="18"
    />

    <path
      d="M96 299c-18-44 4-94 48-112l201-81c44-18 96 3 114 47s-4 96-48 114l-201 81c-44 18-96-5-114-49Z"
      fill="url(#madeira)"
      stroke="#63381f"
      stroke-width="8"
    />

    <ellipse
      cx="126"
      cy="267"
      rx="63"
      ry="78"
      transform="rotate(-22 126 267)"
      fill="#b0713b"
      stroke="#512e1a"
      stroke-width="10"
    />

    <ellipse
      cx="126"
      cy="267"
      rx="43"
      ry="55"
      transform="rotate(-22 126 267)"
      fill="#8f542c"
      stroke="#64391f"
      stroke-width="7"
    />

    <ellipse
      cx="126"
      cy="267"
      rx="23"
      ry="31"
      transform="rotate(-22 126 267)"
      fill="#5b341e"
    />

    <path
      d="M187 194c61 11 114-42 190-31M202 249c77-5 111-51 195-34M210 305c62-7 111-44 170-35"
      fill="none"
      stroke="#d08b4a"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".48"
    />

    <path
      d="M315 120c18-32 49-50 79-51M357 300c32 8 59 28 76 52"
      fill="none"
      stroke="#402717"
      stroke-width="20"
      stroke-linecap="round"
    />
  </g>`),

  "vegetacao.svg": svg(`
  <g filter="url(#sombraLeve)">
    <g
      fill="url(#folha)"
      stroke="#183322"
      stroke-width="7"
    >
      <ellipse
        cx="256"
        cy="116"
        rx="70"
        ry="103"
      />

      <ellipse
        cx="365"
        cy="165"
        rx="70"
        ry="103"
        transform="rotate(54 365 165)"
      />

      <ellipse
        cx="399"
        cy="279"
        rx="70"
        ry="103"
        transform="rotate(96 399 279)"
      />

      <ellipse
        cx="330"
        cy="378"
        rx="70"
        ry="103"
        transform="rotate(145 330 378)"
      />

      <ellipse
        cx="203"
        cy="390"
        rx="70"
        ry="103"
        transform="rotate(196 203 390)"
      />

      <ellipse
        cx="105"
        cy="302"
        rx="70"
        ry="103"
        transform="rotate(248 105 302)"
      />

      <ellipse
        cx="119"
        cy="179"
        rx="70"
        ry="103"
        transform="rotate(307 119 179)"
      />
    </g>

    <circle
      cx="256"
      cy="258"
      r="111"
      fill="#2e5838"
      stroke="#132d1c"
      stroke-width="11"
    />

    <circle
      cx="256"
      cy="258"
      r="83"
      fill="url(#folha)"
    />

    <path
      d="M256 150v216M164 204l185 107M166 315l182-111"
      stroke="#8caf67"
      stroke-width="7"
      stroke-linecap="round"
      opacity=".35"
    />

    <g
      fill="#aac47d"
      opacity=".36"
    >
      <circle
        cx="203"
        cy="211"
        r="13"
      />

      <circle
        cx="301"
        cy="191"
        r="11"
      />

      <circle
        cx="328"
        cy="280"
        r="14"
      />

      <circle
        cx="229"
        cy="322"
        r="12"
      />

      <circle
        cx="180"
        cy="279"
        r="9"
      />
    </g>
  </g>`),

  "papel.svg": svg(`
  <g filter="url(#sombraLeve)">
    <path
      d="M129 88 404 58l36 322-275 31-36-323Z"
      fill="#d9c99c"
      stroke="#584f3d"
      stroke-width="10"
    />

    <path
      d="M83 133 359 93l47 321-275 41-48-322Z"
      fill="#eee2bd"
      stroke="#665c48"
      stroke-width="11"
    />

    <path
      d="M126 183c71-5 135-22 211-27M132 229c65-9 129-19 197-28M140 278c55-9 111-19 175-27M148 327c46-8 93-16 145-23"
      fill="none"
      stroke="#6f654f"
      stroke-width="8"
      stroke-linecap="round"
      opacity=".67"
    />

    <path
      d="M122 133c29 21 35 39 45 65"
      fill="none"
      stroke="#9a3e2c"
      stroke-width="9"
      stroke-linecap="round"
    />

    <path
      d="m299 343 41 40M340 343l-41 40"
      stroke="#7d2925"
      stroke-width="11"
      stroke-linecap="round"
    />

    <path
      d="M102 142 84 91M365 108l36-52M139 448l-7 42"
      stroke="#5e4b34"
      stroke-width="8"
      opacity=".52"
    />
  </g>`),

  "simbolo.svg": svg(`
  <g filter="url(#sombraLeve)">
    <circle
      cx="256"
      cy="256"
      r="207"
      fill="#221622"
      fill-opacity=".55"
      stroke="#5d1c38"
      stroke-width="17"
      stroke-dasharray="30 14"
    />

    <circle
      cx="256"
      cy="256"
      r="162"
      fill="none"
      stroke="#bd3f62"
      stroke-width="12"
    />

    <path
      d="m256 82 43 105 113 8-87 72 28 111-97-59-97 59 28-111-87-72 113-8 40-105Z"
      fill="#7b1d43"
      fill-opacity=".46"
      stroke="#d65074"
      stroke-width="11"
      stroke-linejoin="round"
    />

    <circle
      cx="256"
      cy="256"
      r="64"
      fill="#1b111a"
      stroke="#d65074"
      stroke-width="11"
    />

    <path
      d="M256 202c31 0 54 23 54 54s-23 54-54 54-54-23-54-54 23-54 54-54Zm0 25-25 43h50l-25-43Z"
      fill="#d65074"
    />

    <path
      d="M256 48v54M256 410v54M48 256h54M410 256h54M109 109l38 38M365 365l38 38M403 109l-38 38M147 365l-38 38"
      stroke="#b3375c"
      stroke-width="11"
      stroke-linecap="round"
    />

    <g fill="#e36382">
      <circle
        cx="256"
        cy="49"
        r="12"
      />

      <circle
        cx="463"
        cy="256"
        r="12"
      />

      <circle
        cx="256"
        cy="463"
        r="12"
      />

      <circle
        cx="49"
        cy="256"
        r="12"
      />
    </g>
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

async function gerarAssets() {
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
    ] of Object.entries(ASSETS)
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

  if (
    !await arquivoExiste(
      SCRIPT_MANIFESTO,
    )
  ) {
    throw new Error(
      `O gerador do manifesto não foi encontrado em: ${SCRIPT_MANIFESTO}`,
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

  console.log(
    [
      "",
      "Pack inicial do Acampamento concluído.",
      `Criados: ${criados}.`,
      `Preservados: ${preservados}.`,
      `Objetos disponíveis: ${Object.keys(ASSETS).length}.`,
      `Pasta: ${PASTA_OBJETOS}`,
    ].join("\n"),
  );
}

gerarAssets().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar o pack do Acampamento.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);