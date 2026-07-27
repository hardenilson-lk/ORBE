import {
  mkdir,
  writeFile,
} from "node:fs/promises";

import {
  spawnSync,
} from "node:child_process";

import path from "node:path";

const RAIZ_PROJETO =
  process.cwd();

const PASTA_ESCOLA =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
    "escola",
  );

const PASTA_PAREDES =
  path.join(
    PASTA_ESCOLA,
    "paredes",
  );

const PASTA_PORTAS =
  path.join(
    PASTA_ESCOLA,
    "portas",
  );

function criarSvg({
  conteudo,
  viewBox = "0 0 512 512",
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="${viewBox}"
  width="512"
  height="512"
>
  <defs>
    <linearGradient
      id="reboco"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#ddd9c8"
      />

      <stop
        offset="0.5"
        stop-color="#b9b7a7"
      />

      <stop
        offset="1"
        stop-color="#858a7e"
      />
    </linearGradient>

    <linearGradient
      id="reboco-escuro"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#7d857a"
      />

      <stop
        offset="0.5"
        stop-color="#565f57"
      />

      <stop
        offset="1"
        stop-color="#313833"
      />
    </linearGradient>

    <linearGradient
      id="faixa-verde"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#769388"
      />

      <stop
        offset="0.52"
        stop-color="#496b60"
      />

      <stop
        offset="1"
        stop-color="#29483f"
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
        stop-color="#bd8856"
      />

      <stop
        offset="0.45"
        stop-color="#82532f"
      />

      <stop
        offset="1"
        stop-color="#432919"
      />
    </linearGradient>

    <linearGradient
      id="madeira-clara"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#d7ac78"
      />

      <stop
        offset="0.5"
        stop-color="#a36b3d"
      />

      <stop
        offset="1"
        stop-color="#684020"
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
        stop-color="#c4c8c1"
      />

      <stop
        offset="0.5"
        stop-color="#7b827c"
      />

      <stop
        offset="1"
        stop-color="#434943"
      />
    </linearGradient>

    <linearGradient
      id="porta-vermelha"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#c94d47"
      />

      <stop
        offset="0.52"
        stop-color="#922d2a"
      />

      <stop
        offset="1"
        stop-color="#4b1717"
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
        stop-color="#d8eeec"
        stop-opacity=".9"
      />

      <stop
        offset="0.45"
        stop-color="#8db5b2"
        stop-opacity=".75"
      />

      <stop
        offset="1"
        stop-color="#426b69"
        stop-opacity=".82"
      />
    </linearGradient>

    <pattern
      id="azulejo"
      width="64"
      height="64"
      patternUnits="userSpaceOnUse"
    >
      <rect
        width="64"
        height="64"
        fill="#d8d8c9"
      />

      <path
        d="M0 0H64V64H0Z"
        fill="none"
        stroke="#777d74"
        stroke-width="4"
        opacity=".5"
      />

      <path
        d="M8 8H56V56H8Z"
        fill="none"
        stroke="#f1efe1"
        stroke-width="3"
        opacity=".3"
      />
    </pattern>

    <pattern
      id="faixa-alerta"
      width="64"
      height="64"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <rect
        width="32"
        height="64"
        fill="#d7b73e"
      />

      <rect
        x="32"
        width="32"
        height="64"
        fill="#252825"
      />
    </pattern>

    <filter
      id="sombra"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feDropShadow
        dx="9"
        dy="13"
        stdDeviation="10"
        flood-color="#000000"
        flood-opacity=".55"
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
        baseFrequency=".03"
        numOctaves="3"
        seed="31"
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
          tableValues="0 .14"
        />
      </feComponentTransfer>

      <feBlend
        in="SourceGraphic"
        in2="ruido-suave"
        mode="multiply"
      />
    </filter>
  </defs>

  ${conteudo}
</svg>
`;
}

const PAREDES = {
  "parede-horizontal.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="18"
            y="171"
            width="476"
            height="170"
            rx="14"
            fill="#292e2a"
          />

          <rect
            x="29"
            y="183"
            width="454"
            height="146"
            rx="9"
            fill="url(#reboco)"
            stroke="#4e554f"
            stroke-width="10"
            filter="url(#textura)"
          />

          <rect
            x="43"
            y="197"
            width="426"
            height="54"
            rx="4"
            fill="#cfcebe"
            stroke="#74786f"
            stroke-width="5"
          />

          <rect
            x="43"
            y="251"
            width="426"
            height="62"
            rx="4"
            fill="url(#faixa-verde)"
            stroke="#30463e"
            stroke-width="5"
          />

          <path
            d="M47 205H465"
            stroke="#f4f1df"
            stroke-width="7"
            opacity=".45"
          />

          <path
            d="M47 259H465"
            stroke="#9ab0a7"
            stroke-width="6"
            opacity=".35"
          />

          <path
            d="M82 218h78M188 218h93M309 218h119"
            stroke="#aaa99c"
            stroke-width="6"
            stroke-linecap="round"
            opacity=".45"
          />

          <path
            d="M71 289h99M196 289h76M300 289h137"
            stroke="#20362f"
            stroke-width="7"
            stroke-linecap="round"
            opacity=".48"
          />

          <g
            fill="#9d9f94"
            stroke="#353a36"
            stroke-width="4"
          >
            <circle
              cx="49"
              cy="256"
              r="9"
            />

            <circle
              cx="463"
              cy="256"
              r="9"
            />

            <circle
              cx="256"
              cy="193"
              r="8"
            />

            <circle
              cx="256"
              cy="319"
              r="8"
            />
          </g>
        </g>
      `,
    }),

  "parede-vertical.svg":
    criarSvg({
      conteudo: `
        <g
          filter="url(#sombra)"
          transform="rotate(90 256 256)"
        >
          <rect
            x="18"
            y="171"
            width="476"
            height="170"
            rx="14"
            fill="#292e2a"
          />

          <rect
            x="29"
            y="183"
            width="454"
            height="146"
            rx="9"
            fill="url(#reboco)"
            stroke="#4e554f"
            stroke-width="10"
            filter="url(#textura)"
          />

          <rect
            x="43"
            y="197"
            width="426"
            height="54"
            rx="4"
            fill="#cfcebe"
            stroke="#74786f"
            stroke-width="5"
          />

          <rect
            x="43"
            y="251"
            width="426"
            height="62"
            rx="4"
            fill="url(#faixa-verde)"
            stroke="#30463e"
            stroke-width="5"
          />

          <path
            d="M47 205H465"
            stroke="#f4f1df"
            stroke-width="7"
            opacity=".45"
          />

          <path
            d="M47 259H465"
            stroke="#9ab0a7"
            stroke-width="6"
            opacity=".35"
          />

          <path
            d="M82 218h78M188 218h93M309 218h119"
            stroke="#aaa99c"
            stroke-width="6"
            stroke-linecap="round"
            opacity=".45"
          />

          <path
            d="M71 289h99M196 289h76M300 289h137"
            stroke="#20362f"
            stroke-width="7"
            stroke-linecap="round"
            opacity=".48"
          />

          <g
            fill="#9d9f94"
            stroke="#353a36"
            stroke-width="4"
          >
            <circle
              cx="49"
              cy="256"
              r="9"
            />

            <circle
              cx="463"
              cy="256"
              r="9"
            />

            <circle
              cx="256"
              cy="193"
              r="8"
            />

            <circle
              cx="256"
              cy="319"
              r="8"
            />
          </g>
        </g>
      `,
    }),

  "parede-canto.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <path
            d="
              M58 72
              H302
              V210
              H440
              V454
              H276
              V236
              H58
              Z
            "
            fill="#292e2a"
          />

          <path
            d="
              M73 88
              H286
              V226
              H424
              V438
              H292
              V220
              H73
              Z
            "
            fill="url(#reboco)"
            stroke="#4e554f"
            stroke-width="13"
            filter="url(#textura)"
          />

          <path
            d="M91 112H260V250H399"
            fill="none"
            stroke="#ece9d8"
            stroke-width="17"
            opacity=".42"
          />

          <path
            d="M89 180H220V311H359V416"
            fill="none"
            stroke="url(#faixa-verde)"
            stroke-width="42"
          />

          <path
            d="M92 174H226V305H365"
            fill="none"
            stroke="#98aaa2"
            stroke-width="6"
            opacity=".42"
          />

          <g
            fill="#9d9f94"
            stroke="#353a36"
            stroke-width="5"
          >
            <circle
              cx="98"
              cy="103"
              r="9"
            />

            <circle
              cx="276"
              cy="104"
              r="9"
            />

            <circle
              cx="303"
              cy="239"
              r="9"
            />

            <circle
              cx="409"
              cy="418"
              r="9"
            />
          </g>
        </g>
      `,
    }),
};

const PORTAS = {
  "porta-fechada.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="61"
            y="121"
            width="390"
            height="270"
            rx="22"
            fill="#303632"
          />

          <rect
            x="79"
            y="140"
            width="354"
            height="232"
            rx="14"
            fill="url(#madeira)"
            stroke="#392417"
            stroke-width="15"
            filter="url(#textura)"
          />

          <rect
            x="105"
            y="164"
            width="302"
            height="81"
            rx="8"
            fill="url(#vidro)"
            stroke="#344b49"
            stroke-width="11"
          />

          <path
            d="M181 166V244M256 166V244M331 166V244"
            stroke="#516663"
            stroke-width="8"
          />

          <path
            d="M120 273H392"
            stroke="#4d2d1b"
            stroke-width="12"
          />

          <rect
            x="110"
            y="267"
            width="134"
            height="78"
            rx="8"
            fill="url(#madeira-clara)"
            stroke="#4b2e1b"
            stroke-width="9"
          />

          <rect
            x="268"
            y="267"
            width="134"
            height="78"
            rx="8"
            fill="url(#madeira-clara)"
            stroke="#4b2e1b"
            stroke-width="9"
          />

          <circle
            cx="365"
            cy="307"
            r="17"
            fill="url(#metal)"
            stroke="#252b27"
            stroke-width="7"
          />

          <rect
            x="96"
            y="108"
            width="320"
            height="40"
            rx="9"
            fill="url(#reboco-escuro)"
            stroke="#292e2a"
            stroke-width="8"
          />

          <rect
            x="195"
            y="112"
            width="122"
            height="30"
            rx="7"
            fill="#d9d6c4"
            stroke="#51584f"
            stroke-width="5"
          />
        </g>
      `,
    }),

  "porta-aberta.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="66"
            y="105"
            width="380"
            height="302"
            rx="22"
            fill="#2b312d"
          />

          <rect
            x="89"
            y="128"
            width="334"
            height="256"
            rx="13"
            fill="#171c19"
            stroke="#69716a"
            stroke-width="13"
          />

          <rect
            x="94"
            y="148"
            width="95"
            height="218"
            rx="10"
            fill="url(#madeira)"
            stroke="#3e2819"
            stroke-width="11"
            transform="rotate(-20 94 148)"
          />

          <rect
            x="323"
            y="148"
            width="95"
            height="218"
            rx="10"
            fill="url(#madeira)"
            stroke="#3e2819"
            stroke-width="11"
            transform="rotate(20 418 148)"
          />

          <path
            d="M191 162H321V348H191Z"
            fill="#080b09"
            stroke="#53605a"
            stroke-width="10"
            stroke-dasharray="22 15"
          />

          <path
            d="M205 177H307V334H205Z"
            fill="#030504"
            opacity=".93"
          />

          <path
            d="M211 194H301"
            stroke="#92aaa4"
            stroke-width="7"
            opacity=".28"
          />

          <rect
            x="96"
            y="99"
            width="320"
            height="42"
            rx="9"
            fill="url(#reboco-escuro)"
            stroke="#292e2a"
            stroke-width="8"
          />

          <rect
            x="194"
            y="104"
            width="124"
            height="30"
            rx="7"
            fill="#d9d6c4"
            stroke="#51584f"
            stroke-width="5"
          />
        </g>
      `,
    }),

  "porta-trancada.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="61"
            y="121"
            width="390"
            height="270"
            rx="22"
            fill="#2d312e"
          />

          <rect
            x="79"
            y="140"
            width="354"
            height="232"
            rx="14"
            fill="url(#porta-vermelha)"
            stroke="#471716"
            stroke-width="15"
            filter="url(#textura)"
          />

          <rect
            x="103"
            y="165"
            width="306"
            height="64"
            rx="8"
            fill="url(#vidro)"
            stroke="#3e5654"
            stroke-width="10"
          />

          <path
            d="M179 167V227M256 167V227M333 167V227"
            stroke="#5f7370"
            stroke-width="8"
          />

          <rect
            x="100"
            y="245"
            width="312"
            height="98"
            rx="9"
            fill="url(#faixa-alerta)"
            opacity=".75"
            stroke="#451514"
            stroke-width="10"
          />

          <rect
            x="206"
            y="231"
            width="100"
            height="116"
            rx="15"
            fill="url(#metal)"
            stroke="#222723"
            stroke-width="11"
          />

          <path
            d="M226 236V204C226 160 286 160 286 204V236"
            fill="none"
            stroke="#d1d4cc"
            stroke-width="19"
            stroke-linecap="round"
          />

          <circle
            cx="256"
            cy="282"
            r="16"
            fill="#d6c65e"
            stroke="#322d10"
            stroke-width="7"
          />

          <path
            d="M256 298V322"
            stroke="#25271f"
            stroke-width="10"
            stroke-linecap="round"
          />

          <rect
            x="96"
            y="108"
            width="320"
            height="40"
            rx="9"
            fill="url(#reboco-escuro)"
            stroke="#292e2a"
            stroke-width="8"
          />

          <rect
            x="187"
            y="112"
            width="138"
            height="30"
            rx="7"
            fill="#ead8d4"
            stroke="#692b28"
            stroke-width="5"
          />
        </g>
      `,
    }),

  "porta-secreta.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="44"
            y="157"
            width="424"
            height="198"
            rx="15"
            fill="#292e2a"
          />

          <rect
            x="60"
            y="173"
            width="392"
            height="166"
            rx="10"
            fill="url(#reboco)"
            stroke="#4e554f"
            stroke-width="13"
            filter="url(#textura)"
          />

          <rect
            x="74"
            y="187"
            width="364"
            height="54"
            rx="4"
            fill="#cfcebe"
            stroke="#74786f"
            stroke-width="5"
          />

          <rect
            x="74"
            y="241"
            width="364"
            height="82"
            rx="4"
            fill="url(#faixa-verde)"
            stroke="#30463e"
            stroke-width="5"
          />

          <path
            d="M78 195H434"
            stroke="#f4f1df"
            stroke-width="7"
            opacity=".4"
          />

          <path
            d="M256 177V335"
            stroke="#343b36"
            stroke-width="7"
            opacity=".32"
          />

          <path
            d="M244 210h24M244 286h24"
            stroke="#5e665f"
            stroke-width="5"
            stroke-linecap="round"
            opacity=".25"
          />

          <circle
            cx="256"
            cy="267"
            r="8"
            fill="#6c746d"
            opacity=".25"
          />
        </g>
      `,
    }),
};

async function escreverGrupo({
  pasta,
  arquivos,
}) {
  await mkdir(
    pasta,
    {
      recursive: true,
    },
  );

  for (
    const [
      nomeArquivo,
      conteudo,
    ] of Object.entries(
      arquivos,
    )
  ) {
    const caminho =
      path.join(
        pasta,
        nomeArquivo,
      );

    await writeFile(
      caminho,
      conteudo,
      "utf8",
    );

    console.log(
      `Criado: ${nomeArquivo}`,
    );
  }
}

function atualizarManifesto() {
  const scriptManifesto =
    path.join(
      RAIZ_PROJETO,
      "scripts",
      "gerar-manifest-packs.mjs",
    );

  const resultado =
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
    resultado.stdout
  ) {
    console.log(
      resultado.stdout.trim(),
    );
  }

  if (
    resultado.stderr
  ) {
    console.error(
      resultado.stderr.trim(),
    );
  }

  if (
    resultado.status !==
    0
  ) {
    throw new Error(
      "Os assets foram criados, mas o manifesto não pôde ser atualizado.",
    );
  }
}

async function gerarPack() {
  await escreverGrupo({
    pasta:
      PASTA_PAREDES,

    arquivos:
      PAREDES,
  });

  await escreverGrupo({
    pasta:
      PASTA_PORTAS,

    arquivos:
      PORTAS,
  });

  atualizarManifesto();

  console.log(
    [
      "",
      "Paredes e portas da Escola concluídas.",
      `Paredes: ${Object.keys(PAREDES).length}.`,
      `Portas: ${Object.keys(PORTAS).length}.`,
      `Pasta de paredes: ${PASTA_PAREDES}`,
      `Pasta de portas: ${PASTA_PORTAS}`,
    ].join("\n"),
  );
}

gerarPack().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar as paredes e portas da Escola.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);