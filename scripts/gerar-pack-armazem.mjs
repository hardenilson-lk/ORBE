import {
  access,
  mkdir,
  writeFile,
} from "node:fs/promises";

import {
  constants,
} from "node:fs";

import {
  spawnSync,
} from "node:child_process";

import path from "node:path";

const RAIZ_PROJETO =
  process.cwd();

const PASTA_OBJETOS =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "armazem",
    "objetos",
  );

const SOBRESCREVER =
  process.argv.includes(
    "--sobrescrever",
  );

function criarSvg({
  conteudo,
  fundo = "transparent",
}) {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512 512"
  width="512"
  height="512"
>
  <defs>
    <filter
      id="sombra"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feDropShadow
        dx="12"
        dy="16"
        stdDeviation="13"
        flood-color="#000000"
        flood-opacity="0.55"
      />
    </filter>

    <filter
      id="textura"
      x="-10%"
      y="-10%"
      width="120%"
      height="120%"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.025"
        numOctaves="3"
        seed="11"
        result="ruido"
      />

      <feColorMatrix
        in="ruido"
        type="saturate"
        values="0"
        result="ruido-cinza"
      />

      <feComponentTransfer
        in="ruido-cinza"
        result="ruido-suave"
      >
        <feFuncA
          type="table"
          tableValues="0 0.16"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="ruido-suave"
        mode="multiply"
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
        stop-color="#858982"
      />

      <stop
        offset="0.48"
        stop-color="#444944"
      />

      <stop
        offset="1"
        stop-color="#262a28"
      />
    </linearGradient>

    <linearGradient
      id="metal-claro"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#b9bdb4"
      />

      <stop
        offset="1"
        stop-color="#5d625d"
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
        stop-color="#bd8042"
      />

      <stop
        offset="0.5"
        stop-color="#824b27"
      />

      <stop
        offset="1"
        stop-color="#4e2c1b"
      />
    </linearGradient>

    <linearGradient
      id="amarelo"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#f3c84f"
      />

      <stop
        offset="0.55"
        stop-color="#c98d18"
      />

      <stop
        offset="1"
        stop-color="#76500c"
      />
    </linearGradient>

    <linearGradient
      id="vermelho"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#ef5448"
      />

      <stop
        offset="0.55"
        stop-color="#aa211e"
      />

      <stop
        offset="1"
        stop-color="#5a1110"
      />
    </linearGradient>
  </defs>

  <rect
    width="512"
    height="512"
    fill="${fundo}"
  />

  <g filter="url(#sombra)">
    ${conteudo}
  </g>
</svg>
`;
}

const ASSETS = {
  "engradado.svg": criarSvg({
    conteudo: `
      <rect
        x="58"
        y="58"
        width="396"
        height="396"
        rx="18"
        fill="#29170e"
        opacity="0.9"
      />

      <rect
        x="72"
        y="72"
        width="368"
        height="368"
        rx="12"
        fill="url(#madeira)"
        stroke="#3b2114"
        stroke-width="14"
        filter="url(#textura)"
      />

      <g
        fill="#a96c34"
        stroke="#472716"
        stroke-width="9"
      >
        <rect
          x="93"
          y="93"
          width="326"
          height="62"
          rx="5"
        />

        <rect
          x="93"
          y="174"
          width="326"
          height="62"
          rx="5"
        />

        <rect
          x="93"
          y="255"
          width="326"
          height="62"
          rx="5"
        />

        <rect
          x="93"
          y="336"
          width="326"
          height="62"
          rx="5"
        />
      </g>

      <path
        d="M94 94 L418 418"
        stroke="#55301c"
        stroke-width="34"
      />

      <path
        d="M418 94 L94 418"
        stroke="#55301c"
        stroke-width="34"
      />

      <path
        d="M94 94 L418 418"
        stroke="#a66a38"
        stroke-width="14"
      />

      <path
        d="M418 94 L94 418"
        stroke="#a66a38"
        stroke-width="14"
      />

      <g
        fill="url(#metal)"
        stroke="#1b1e1c"
        stroke-width="6"
      >
        <rect
          x="52"
          y="52"
          width="82"
          height="82"
          rx="10"
        />

        <rect
          x="378"
          y="52"
          width="82"
          height="82"
          rx="10"
        />

        <rect
          x="52"
          y="378"
          width="82"
          height="82"
          rx="10"
        />

        <rect
          x="378"
          y="378"
          width="82"
          height="82"
          rx="10"
        />
      </g>
    `,
  }),

  "estante-industrial.svg": criarSvg({
    conteudo: `
      <rect
        x="49"
        y="84"
        width="414"
        height="344"
        rx="14"
        fill="#171a19"
        opacity="0.9"
      />

      <g
        fill="url(#metal)"
        stroke="#171a19"
        stroke-width="8"
      >
        <rect
          x="55"
          y="88"
          width="50"
          height="336"
          rx="7"
        />

        <rect
          x="407"
          y="88"
          width="50"
          height="336"
          rx="7"
        />

        <rect
          x="83"
          y="103"
          width="346"
          height="46"
          rx="5"
        />

        <rect
          x="83"
          y="232"
          width="346"
          height="46"
          rx="5"
        />

        <rect
          x="83"
          y="361"
          width="346"
          height="46"
          rx="5"
        />
      </g>

      <g
        stroke="#402417"
        stroke-width="7"
      >
        <rect
          x="105"
          y="154"
          width="88"
          height="70"
          rx="7"
          fill="#95602f"
        />

        <rect
          x="211"
          y="154"
          width="74"
          height="70"
          rx="7"
          fill="#b47738"
        />

        <rect
          x="304"
          y="154"
          width="100"
          height="70"
          rx="7"
          fill="#70472a"
        />

        <rect
          x="105"
          y="283"
          width="108"
          height="70"
          rx="7"
          fill="#714429"
        />

        <rect
          x="231"
          y="283"
          width="80"
          height="70"
          rx="7"
          fill="#a96d35"
        />

        <rect
          x="329"
          y="283"
          width="75"
          height="70"
          rx="7"
          fill="#86542d"
        />
      </g>

      <g
        fill="#c0b9a1"
        stroke="#202320"
        stroke-width="4"
      >
        <circle
          cx="80"
          cy="113"
          r="9"
        />

        <circle
          cx="432"
          cy="113"
          r="9"
        />

        <circle
          cx="80"
          cy="398"
          r="9"
        />

        <circle
          cx="432"
          cy="398"
          r="9"
        />
      </g>
    `,
  }),

  "empilhadeira.svg": criarSvg({
    conteudo: `
      <rect
        x="108"
        y="91"
        width="270"
        height="330"
        rx="45"
        fill="#171917"
        opacity="0.9"
      />

      <rect
        x="130"
        y="111"
        width="226"
        height="286"
        rx="35"
        fill="url(#amarelo)"
        stroke="#4d340c"
        stroke-width="14"
        filter="url(#textura)"
      />

      <rect
        x="165"
        y="150"
        width="156"
        height="110"
        rx="22"
        fill="#253237"
        stroke="#111719"
        stroke-width="12"
      />

      <path
        d="M181 236 L305 169"
        stroke="#6f8790"
        stroke-width="10"
        opacity="0.7"
      />

      <rect
        x="173"
        y="282"
        width="140"
        height="74"
        rx="18"
        fill="#76500d"
        stroke="#3f2b09"
        stroke-width="10"
      />

      <g
        fill="#171917"
        stroke="#343834"
        stroke-width="6"
      >
        <circle
          cx="135"
          cy="146"
          r="41"
        />

        <circle
          cx="351"
          cy="146"
          r="41"
        />

        <circle
          cx="135"
          cy="364"
          r="41"
        />

        <circle
          cx="351"
          cy="364"
          r="41"
        />
      </g>

      <g
        fill="url(#metal)"
        stroke="#171a18"
        stroke-width="9"
      >
        <rect
          x="200"
          y="48"
          width="25"
          height="102"
          rx="6"
        />

        <rect
          x="268"
          y="48"
          width="25"
          height="102"
          rx="6"
        />

        <rect
          x="197"
          y="38"
          width="101"
          height="26"
          rx="7"
        />

        <rect
          x="189"
          y="20"
          width="20"
          height="110"
          rx="5"
        />

        <rect
          x="285"
          y="20"
          width="20"
          height="110"
          rx="5"
        />
      </g>

      <circle
        cx="243"
        cy="319"
        r="25"
        fill="#272b28"
        stroke="#111311"
        stroke-width="8"
      />
    `,
  }),

  "carrinho-de-carga.svg": criarSvg({
    conteudo: `
      <rect
        x="81"
        y="111"
        width="350"
        height="277"
        rx="24"
        fill="#171a18"
        opacity="0.85"
      />

      <rect
        x="101"
        y="131"
        width="310"
        height="237"
        rx="17"
        fill="url(#metal-claro)"
        stroke="#252a27"
        stroke-width="14"
        filter="url(#textura)"
      />

      <g
        stroke="#3d433f"
        stroke-width="12"
      >
        <line
          x1="135"
          y1="171"
          x2="377"
          y2="171"
        />

        <line
          x1="135"
          y1="242"
          x2="377"
          y2="242"
        />

        <line
          x1="135"
          y1="313"
          x2="377"
          y2="313"
        />
      </g>

      <path
        d="M105 135 C41 105 37 55 62 31"
        fill="none"
        stroke="#373d39"
        stroke-width="24"
        stroke-linecap="round"
      />

      <path
        d="M407 135 C471 105 475 55 450 31"
        fill="none"
        stroke="#373d39"
        stroke-width="24"
        stroke-linecap="round"
      />

      <g
        fill="#151715"
        stroke="#555b56"
        stroke-width="7"
      >
        <circle
          cx="113"
          cy="410"
          r="38"
        />

        <circle
          cx="399"
          cy="410"
          r="38"
        />
      </g>
    `,
  }),

  "extintor.svg": criarSvg({
    conteudo: `
      <ellipse
        cx="256"
        cy="267"
        rx="120"
        ry="173"
        fill="#310b0b"
        opacity="0.85"
      />

      <ellipse
        cx="256"
        cy="258"
        rx="102"
        ry="156"
        fill="url(#vermelho)"
        stroke="#591111"
        stroke-width="16"
        filter="url(#textura)"
      />

      <ellipse
        cx="256"
        cy="133"
        rx="59"
        ry="39"
        fill="#d34139"
        stroke="#661613"
        stroke-width="12"
      />

      <rect
        x="221"
        y="70"
        width="70"
        height="72"
        rx="18"
        fill="url(#metal)"
        stroke="#181b19"
        stroke-width="10"
      />

      <path
        d="M286 96 C360 75 410 117 414 183"
        fill="none"
        stroke="#20231f"
        stroke-width="21"
        stroke-linecap="round"
      />

      <rect
        x="200"
        y="236"
        width="112"
        height="75"
        rx="9"
        fill="#ded8be"
        stroke="#6d681f"
        stroke-width="7"
      />

      <path
        d="M218 258 H294 M218 279 H278"
        stroke="#a72520"
        stroke-width="9"
      />

      <circle
        cx="255"
        cy="116"
        r="17"
        fill="#e8e4ce"
        stroke="#252923"
        stroke-width="7"
      />
    `,
  }),

  "painel-eletrico.svg": criarSvg({
    conteudo: `
      <rect
        x="70"
        y="57"
        width="372"
        height="398"
        rx="24"
        fill="#181c1b"
        opacity="0.9"
      />

      <rect
        x="87"
        y="74"
        width="338"
        height="364"
        rx="17"
        fill="url(#metal-claro)"
        stroke="#303632"
        stroke-width="14"
        filter="url(#textura)"
      />

      <rect
        x="112"
        y="108"
        width="288"
        height="180"
        rx="10"
        fill="#303735"
        stroke="#151817"
        stroke-width="10"
      />

      <g
        fill="#0f1211"
        stroke="#606861"
        stroke-width="5"
      >
        <rect
          x="139"
          y="137"
          width="50"
          height="101"
          rx="8"
        />

        <rect
          x="208"
          y="137"
          width="50"
          height="101"
          rx="8"
        />

        <rect
          x="277"
          y="137"
          width="50"
          height="101"
          rx="8"
        />

        <rect
          x="346"
          y="137"
          width="26"
          height="101"
          rx="8"
        />
      </g>

      <g>
        <circle
          cx="154"
          cy="333"
          r="21"
          fill="#39bd5b"
          stroke="#173f21"
          stroke-width="8"
        />

        <circle
          cx="220"
          cy="333"
          r="21"
          fill="#e5b23d"
          stroke="#5a4412"
          stroke-width="8"
        />

        <circle
          cx="286"
          cy="333"
          r="21"
          fill="#d8433b"
          stroke="#561410"
          stroke-width="8"
        />
      </g>

      <path
        d="M344 316 L305 378 H339 L315 418 L391 347 H354 L383 316 Z"
        fill="#f2c334"
        stroke="#5e4810"
        stroke-width="7"
      />

      <circle
        cx="387"
        cy="101"
        r="12"
        fill="#1e211f"
      />
    `,
  }),

  "camera.svg": criarSvg({
    conteudo: `
      <circle
        cx="256"
        cy="256"
        r="178"
        fill="#141716"
        opacity="0.9"
      />

      <circle
        cx="256"
        cy="256"
        r="155"
        fill="url(#metal-claro)"
        stroke="#292e2b"
        stroke-width="15"
        filter="url(#textura)"
      />

      <circle
        cx="256"
        cy="256"
        r="105"
        fill="#171d20"
        stroke="#0b0e0f"
        stroke-width="14"
      />

      <circle
        cx="256"
        cy="256"
        r="64"
        fill="#1a3442"
        stroke="#080c0e"
        stroke-width="13"
      />

      <circle
        cx="234"
        cy="228"
        r="21"
        fill="#90d4e7"
        opacity="0.72"
      />

      <circle
        cx="256"
        cy="256"
        r="28"
        fill="#040809"
      />

      <g
        fill="#d63b34"
        stroke="#53100d"
        stroke-width="5"
      >
        <circle
          cx="256"
          cy="110"
          r="12"
        />

        <circle
          cx="402"
          cy="256"
          r="12"
        />

        <circle
          cx="256"
          cy="402"
          r="12"
        />

        <circle
          cx="110"
          cy="256"
          r="12"
        />
      </g>
    `,
  }),

  "mesa.svg": criarSvg({
    conteudo: `
      <rect
        x="47"
        y="91"
        width="418"
        height="330"
        rx="28"
        fill="#24150d"
        opacity="0.85"
      />

      <rect
        x="61"
        y="76"
        width="390"
        height="330"
        rx="22"
        fill="url(#madeira)"
        stroke="#452617"
        stroke-width="15"
        filter="url(#textura)"
      />

      <path
        d="M91 142 C178 101 259 165 420 116"
        fill="none"
        stroke="#60361f"
        stroke-width="12"
        stroke-linecap="round"
        opacity="0.7"
      />

      <path
        d="M91 256 C177 214 281 292 421 235"
        fill="none"
        stroke="#60361f"
        stroke-width="11"
        stroke-linecap="round"
        opacity="0.65"
      />

      <path
        d="M91 352 C191 307 297 379 419 327"
        fill="none"
        stroke="#60361f"
        stroke-width="11"
        stroke-linecap="round"
        opacity="0.65"
      />

      <g
        fill="#202320"
        stroke="#101210"
        stroke-width="7"
      >
        <circle
          cx="93"
          cy="104"
          r="23"
        />

        <circle
          cx="419"
          cy="104"
          r="23"
        />

        <circle
          cx="93"
          cy="378"
          r="23"
        />

        <circle
          cx="419"
          cy="378"
          r="23"
        />
      </g>
    `,
  }),

  "armario.svg": criarSvg({
    conteudo: `
      <rect
        x="85"
        y="48"
        width="342"
        height="416"
        rx="22"
        fill="#181b1a"
        opacity="0.9"
      />

      <rect
        x="101"
        y="65"
        width="310"
        height="382"
        rx="14"
        fill="url(#metal-claro)"
        stroke="#303532"
        stroke-width="14"
        filter="url(#textura)"
      />

      <line
        x1="256"
        y1="78"
        x2="256"
        y2="434"
        stroke="#414743"
        stroke-width="12"
      />

      <g
        fill="none"
        stroke="#505752"
        stroke-width="8"
      >
        <path
          d="M135 118 H220"
        />

        <path
          d="M135 148 H220"
        />

        <path
          d="M135 178 H220"
        />

        <path
          d="M292 118 H377"
        />

        <path
          d="M292 148 H377"
        />

        <path
          d="M292 178 H377"
        />
      </g>

      <g
        fill="#2b2f2c"
        stroke="#111311"
        stroke-width="6"
      >
        <rect
          x="215"
          y="240"
          width="23"
          height="65"
          rx="9"
        />

        <rect
          x="274"
          y="240"
          width="23"
          height="65"
          rx="9"
        />
      </g>

      <rect
        x="130"
        y="355"
        width="252"
        height="48"
        rx="8"
        fill="#666d67"
        stroke="#343936"
        stroke-width="7"
      />
    `,
  }),

  "computador.svg": criarSvg({
    conteudo: `
      <rect
        x="68"
        y="88"
        width="376"
        height="286"
        rx="28"
        fill="#151817"
        opacity="0.9"
      />

      <rect
        x="88"
        y="106"
        width="336"
        height="247"
        rx="19"
        fill="#242b2d"
        stroke="#101313"
        stroke-width="14"
      />

      <rect
        x="112"
        y="131"
        width="288"
        height="173"
        rx="11"
        fill="#183442"
        stroke="#0a0e10"
        stroke-width="10"
      />

      <path
        d="M132 282 L263 154 L380 268"
        fill="none"
        stroke="#39778a"
        stroke-width="11"
        opacity="0.65"
      />

      <circle
        cx="167"
        cy="183"
        r="28"
        fill="#6cc7dd"
        opacity="0.65"
      />

      <rect
        x="228"
        y="345"
        width="56"
        height="69"
        rx="10"
        fill="url(#metal)"
        stroke="#171a18"
        stroke-width="8"
      />

      <rect
        x="165"
        y="401"
        width="182"
        height="40"
        rx="12"
        fill="url(#metal)"
        stroke="#171a18"
        stroke-width="8"
      />

      <circle
        cx="378"
        cy="329"
        r="9"
        fill="#41c660"
      />
    `,
  }),
};

async function arquivoExiste(
  caminho,
) {
  try {
    await access(
      caminho,
      constants.F_OK,
    );

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
    ] of Object.entries(
      ASSETS,
    )
  ) {
    const caminho =
      path.join(
        PASTA_OBJETOS,
        nomeArquivo,
      );

    const existe =
      await arquivoExiste(
        caminho,
      );

    if (
      existe &&
      !SOBRESCREVER
    ) {
      preservados += 1;

      console.log(
        `Preservado: ${nomeArquivo}`,
      );

      continue;
    }

    await writeFile(
      caminho,
      conteudo,
      "utf8",
    );

    criados += 1;

    console.log(
      `Criado: ${nomeArquivo}`,
    );
  }

  const scriptManifesto =
    path.join(
      RAIZ_PROJETO,
      "scripts",
      "gerar-manifest-packs.mjs",
    );

  const resultadoManifesto =
    spawnSync(
      process.execPath,
      [
        scriptManifesto,
      ],
      {
        cwd:
          RAIZ_PROJETO,

        encoding:
          "utf8",
      },
    );

  if (
    resultadoManifesto.stdout
  ) {
    console.log(
      resultadoManifesto.stdout.trim(),
    );
  }

  if (
    resultadoManifesto.stderr
  ) {
    console.error(
      resultadoManifesto.stderr.trim(),
    );
  }

  if (
    resultadoManifesto.status !==
    0
  ) {
    throw new Error(
      "O pack foi criado, mas o manifesto não pôde ser atualizado.",
    );
  }

  console.log(
    [
      "",
      "Pack inicial do Armazém concluído.",
      `Criados: ${criados}.`,
      `Preservados: ${preservados}.`,
      `Pasta: ${PASTA_OBJETOS}`,
    ].join("\n"),
  );
}

gerarAssets().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar o pack do Armazém.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);