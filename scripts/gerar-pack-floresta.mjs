import {
  access,
  mkdir,
  writeFile,
} from "node:fs/promises";

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
    "floresta",
    "objetos",
  );

function criarSvg({
  conteudo,
  viewBox = "0 0 512 512",
}) {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="${viewBox}"
  width="512"
  height="512"
>
  <defs>
    <radialGradient
      id="folhagem"
      cx="42%"
      cy="36%"
      r="68%"
    >
      <stop
        offset="0"
        stop-color="#8aa45a"
      />

      <stop
        offset="0.46"
        stop-color="#4f713b"
      />

      <stop
        offset="1"
        stop-color="#263b28"
      />
    </radialGradient>

    <radialGradient
      id="folhagem-escura"
      cx="38%"
      cy="32%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#678249"
      />

      <stop
        offset="0.52"
        stop-color="#365134"
      />

      <stop
        offset="1"
        stop-color="#17271e"
      />
    </radialGradient>

    <linearGradient
      id="madeira"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#9a6539"
      />

      <stop
        offset="0.48"
        stop-color="#694125"
      />

      <stop
        offset="1"
        stop-color="#352319"
      />
    </linearGradient>

    <linearGradient
      id="madeira-clara"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#bd8750"
      />

      <stop
        offset="1"
        stop-color="#684025"
      />
    </linearGradient>

    <linearGradient
      id="pedra"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#9a9b87"
      />

      <stop
        offset="0.48"
        stop-color="#666b61"
      />

      <stop
        offset="1"
        stop-color="#343936"
      />
    </linearGradient>

    <linearGradient
      id="lona"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0"
        stop-color="#c7a85c"
      />

      <stop
        offset="0.52"
        stop-color="#866e35"
      />

      <stop
        offset="1"
        stop-color="#41391f"
      />
    </linearGradient>

    <radialGradient
      id="lama"
      cx="42%"
      cy="35%"
      r="70%"
    >
      <stop
        offset="0"
        stop-color="#806a48"
      />

      <stop
        offset="0.6"
        stop-color="#51462f"
      />

      <stop
        offset="1"
        stop-color="#29291f"
      />
    </radialGradient>

    <radialGradient
      id="agua"
      cx="40%"
      cy="30%"
      r="72%"
    >
      <stop
        offset="0"
        stop-color="#83b6b0"
      />

      <stop
        offset="0.5"
        stop-color="#477b78"
      />

      <stop
        offset="1"
        stop-color="#243f42"
      />
    </radialGradient>

    <filter
      id="sombra"
      x="-35%"
      y="-35%"
      width="170%"
      height="170%"
    >
      <feDropShadow
        dx="12"
        dy="16"
        stdDeviation="13"
        flood-color="#000000"
        flood-opacity="0.58"
      />
    </filter>

    <filter
      id="sombra-suave"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feDropShadow
        dx="7"
        dy="10"
        stdDeviation="9"
        flood-color="#000000"
        flood-opacity="0.42"
      />
    </filter>

    <filter
      id="textura"
      x="-15%"
      y="-15%"
      width="130%"
      height="130%"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.025"
        numOctaves="3"
        seed="31"
        result="ruido"
      />

      <feColorMatrix
        in="ruido"
        type="saturate"
        values="0"
        result="cinza"
      />

      <feComponentTransfer
        in="cinza"
        result="ruido-suave"
      >
        <feFuncA
          type="table"
          tableValues="0 0.14"
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

const ASSETS = {
  "arvore.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <ellipse
            cx="269"
            cy="380"
            rx="145"
            ry="43"
            fill="#101a12"
            opacity="0.48"
          />

          <circle
            cx="256"
            cy="267"
            r="72"
            fill="url(#madeira)"
            stroke="#2c1c13"
            stroke-width="13"
          />

          <path
            d="M210 287 C228 250 228 221 218 184"
            fill="none"
            stroke="#b07a43"
            stroke-width="13"
            stroke-linecap="round"
            opacity="0.52"
          />

          <path
            d="M300 286 C283 250 285 216 302 178"
            fill="none"
            stroke="#3a2518"
            stroke-width="16"
            stroke-linecap="round"
            opacity="0.8"
          />

          <g
            fill="url(#folhagem)"
            stroke="#203222"
            stroke-width="10"
          >
            <circle cx="166" cy="189" r="91" />
            <circle cx="250" cy="137" r="105" />
            <circle cx="346" cy="184" r="94" />
            <circle cx="191" cy="273" r="98" />
            <circle cx="304" cy="272" r="111" />
          </g>

          <g
            fill="#9cac68"
            opacity="0.45"
          >
            <circle cx="201" cy="131" r="25" />
            <circle cx="284" cy="102" r="31" />
            <circle cx="349" cy="168" r="23" />
            <circle cx="246" cy="226" r="28" />
          </g>
        </g>
      `,
    }),

  "arbusto.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra-suave)">
          <ellipse
            cx="256"
            cy="356"
            rx="153"
            ry="38"
            fill="#101911"
            opacity="0.42"
          />

          <g
            fill="url(#folhagem-escura)"
            stroke="#1c3020"
            stroke-width="10"
          >
            <circle cx="151" cy="260" r="74" />
            <circle cx="211" cy="192" r="83" />
            <circle cx="297" cy="189" r="88" />
            <circle cx="365" cy="254" r="76" />
            <circle cx="256" cy="286" r="104" />
          </g>

          <g
            fill="#8ca15f"
            opacity="0.42"
          >
            <circle cx="195" cy="191" r="20" />
            <circle cx="287" cy="164" r="24" />
            <circle cx="348" cy="239" r="17" />
            <circle cx="236" cy="278" r="22" />
          </g>

          <path
            d="M164 334 C216 300 296 302 353 336"
            fill="none"
            stroke="#543923"
            stroke-width="17"
            stroke-linecap="round"
          />
        </g>
      `,
    }),

  "pedra.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <ellipse
            cx="267"
            cy="376"
            rx="157"
            ry="45"
            fill="#111513"
            opacity="0.47"
          />

          <path
            d="
              M105 326
              L131 207
              L211 120
              L338 139
              L415 236
              L389 339
              L289 392
              L173 378
              Z
            "
            fill="url(#pedra)"
            stroke="#292f2c"
            stroke-width="15"
            filter="url(#textura)"
          />

          <path
            d="M151 220 L220 154 L330 166"
            fill="none"
            stroke="#c2c1aa"
            stroke-width="16"
            stroke-linecap="round"
            opacity="0.46"
          />

          <path
            d="M212 161 L245 249 L192 326"
            fill="none"
            stroke="#474d48"
            stroke-width="12"
            stroke-linecap="round"
          />

          <path
            d="M344 183 L309 274 L370 335"
            fill="none"
            stroke="#3e4440"
            stroke-width="10"
            stroke-linecap="round"
          />
        </g>
      `,
    }),

  "tronco.svg":
    criarSvg({
      conteudo: `
        <g
          filter="url(#sombra)"
          transform="rotate(-18 256 256)"
        >
          <rect
            x="61"
            y="190"
            width="390"
            height="139"
            rx="65"
            fill="url(#madeira)"
            stroke="#302016"
            stroke-width="16"
            filter="url(#textura)"
          />

          <ellipse
            cx="74"
            cy="259"
            rx="52"
            ry="64"
            fill="url(#madeira-clara)"
            stroke="#302016"
            stroke-width="14"
          />

          <g
            fill="none"
            stroke="#704526"
            stroke-width="10"
          >
            <ellipse cx="74" cy="259" rx="34" ry="43" />
            <ellipse cx="74" cy="259" rx="18" ry="25" />
          </g>

          <path
            d="M131 225 C202 194 301 224 389 204"
            fill="none"
            stroke="#c28a51"
            stroke-width="13"
            stroke-linecap="round"
            opacity="0.48"
          />

          <path
            d="M145 292 C225 271 305 309 402 278"
            fill="none"
            stroke="#3c281c"
            stroke-width="12"
            stroke-linecap="round"
          />

          <path
            d="M281 191 L310 149 L346 191"
            fill="url(#madeira)"
            stroke="#302016"
            stroke-width="12"
          />
        </g>
      `,
    }),

  "vegetacao.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra-suave)">
          <ellipse
            cx="256"
            cy="380"
            rx="144"
            ry="30"
            fill="#111b13"
            opacity="0.38"
          />

          <g
            fill="#486c39"
            stroke="#213822"
            stroke-width="7"
          >
            <path d="M246 370 C180 304 181 213 208 130 C246 222 257 297 246 370 Z" />
            <path d="M258 370 C303 289 331 219 318 143 C273 218 255 302 258 370 Z" />
            <path d="M234 369 C175 345 132 292 111 221 C184 260 222 311 234 369 Z" />
            <path d="M276 371 C329 343 373 295 401 223 C327 256 288 311 276 371 Z" />
            <path d="M253 370 C229 293 237 224 254 173 C274 235 274 302 253 370 Z" />
          </g>

          <g
            fill="none"
            stroke="#99a85f"
            stroke-width="6"
            opacity="0.45"
          >
            <path d="M244 347 C215 270 216 208 215 161" />
            <path d="M267 348 C292 276 308 219 311 174" />
            <path d="M222 349 C181 306 150 267 128 241" />
          </g>
        </g>
      `,
    }),

  "lama.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra-suave)">
          <path
            d="
              M67 282
              C54 221 104 173 166 176
              C194 120 278 121 309 166
              C375 142 447 195 431 260
              C466 322 401 383 336 368
              C288 415 196 400 171 360
              C105 373 65 333 67 282
              Z
            "
            fill="url(#lama)"
            stroke="#27271d"
            stroke-width="13"
            filter="url(#textura)"
          />

          <g
            fill="#a58a5a"
            opacity="0.39"
          >
            <ellipse cx="170" cy="232" rx="42" ry="18" />
            <ellipse cx="316" cy="218" rx="51" ry="22" />
            <ellipse cx="249" cy="324" rx="62" ry="24" />
          </g>

          <g
            fill="#302d20"
            opacity="0.72"
          >
            <circle cx="130" cy="301" r="13" />
            <circle cx="215" cy="195" r="9" />
            <circle cx="370" cy="298" r="15" />
            <circle cx="290" cy="365" r="10" />
          </g>
        </g>
      `,
    }),

  "agua.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra-suave)">
          <path
            d="
              M61 282
              C45 219 104 166 170 178
              C205 117 284 126 318 171
              C386 149 453 202 433 269
              C460 330 398 382 332 368
              C281 411 200 398 169 358
              C103 372 63 336 61 282
              Z
            "
            fill="url(#agua)"
            stroke="#1f393b"
            stroke-width="13"
          />

          <g
            fill="none"
            stroke="#a8d1c7"
            stroke-width="10"
            stroke-linecap="round"
            opacity="0.58"
          >
            <path d="M109 239 C166 208 224 232 271 216" />
            <path d="M187 288 C249 259 313 285 377 253" />
            <path d="M121 326 C176 306 215 331 259 314" />
          </g>

          <g
            fill="#d4e5d8"
            opacity="0.45"
          >
            <ellipse cx="153" cy="216" rx="20" ry="9" />
            <ellipse cx="344" cy="308" rx="25" ry="10" />
            <ellipse cx="271" cy="191" rx="15" ry="7" />
          </g>
        </g>
      `,
    }),

  "barraca.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <ellipse
            cx="262"
            cy="392"
            rx="187"
            ry="43"
            fill="#111713"
            opacity="0.46"
          />

          <path
            d="
              M59 358
              L183 127
              L326 127
              L453 358
              Z
            "
            fill="url(#lona)"
            stroke="#302a19"
            stroke-width="16"
            filter="url(#textura)"
          />

          <path
            d="M183 127 L256 359 L326 127"
            fill="#625229"
            stroke="#332b19"
            stroke-width="13"
          />

          <path
            d="M256 359 L257 171"
            stroke="#dac174"
            stroke-width="9"
            opacity="0.62"
          />

          <path
            d="M90 344 L184 150"
            stroke="#e0ca80"
            stroke-width="11"
            opacity="0.44"
          />

          <path
            d="M419 344 L326 150"
            stroke="#332b19"
            stroke-width="12"
            opacity="0.65"
          />

          <g
            stroke="#1d211c"
            stroke-width="9"
            stroke-linecap="round"
          >
            <path d="M61 359 L31 391" />
            <path d="M451 359 L480 391" />
            <path d="M184 128 L169 84" />
            <path d="M326 128 L342 84" />
          </g>
        </g>
      `,
    }),

  "caixa.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra)">
          <rect
            x="84"
            y="92"
            width="344"
            height="330"
            rx="18"
            fill="url(#madeira-clara)"
            stroke="#2c1e15"
            stroke-width="17"
            filter="url(#textura)"
          />

          <g
            fill="none"
            stroke="#5b351e"
            stroke-width="17"
          >
            <rect
              x="112"
              y="120"
              width="288"
              height="274"
              rx="8"
            />

            <path d="M117 126 L395 389" />
            <path d="M395 126 L117 389" />
          </g>

          <g
            fill="#30342f"
            stroke="#171a18"
            stroke-width="8"
          >
            <rect x="70" y="78" width="72" height="72" rx="12" />
            <rect x="370" y="78" width="72" height="72" rx="12" />
            <rect x="70" y="366" width="72" height="72" rx="12" />
            <rect x="370" y="366" width="72" height="72" rx="12" />
          </g>

          <rect
            x="211"
            y="211"
            width="90"
            height="90"
            rx="13"
            fill="#282b28"
            stroke="#151715"
            stroke-width="11"
          />

          <circle
            cx="256"
            cy="256"
            r="14"
            fill="#c7c6aa"
            stroke="#282b28"
            stroke-width="7"
          />
        </g>
      `,
    }),

  "fogueira-apagada.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra-suave)">
          <ellipse
            cx="256"
            cy="371"
            rx="142"
            ry="35"
            fill="#101411"
            opacity="0.43"
          />

          <g
            fill="url(#pedra)"
            stroke="#292e2b"
            stroke-width="10"
          >
            <circle cx="256" cy="121" r="38" />
            <circle cx="339" cy="148" r="38" />
            <circle cx="389" cy="219" r="38" />
            <circle cx="381" cy="302" r="38" />
            <circle cx="315" cy="353" r="38" />
            <circle cx="230" cy="359" r="38" />
            <circle cx="155" cy="320" r="38" />
            <circle cx="120" cy="244" r="38" />
            <circle cx="154" cy="169" r="38" />
          </g>

          <circle
            cx="256"
            cy="245"
            r="104"
            fill="#222723"
            stroke="#131613"
            stroke-width="15"
          />

          <g
            stroke="#3b281c"
            stroke-width="39"
            stroke-linecap="round"
          >
            <path d="M181 187 L329 305" />
            <path d="M329 187 L181 305" />
          </g>

          <g
            stroke="#8a5831"
            stroke-width="12"
            stroke-linecap="round"
            opacity="0.48"
          >
            <path d="M191 190 L320 294" />
            <path d="M320 190 L191 294" />
          </g>

          <g
            fill="#111411"
          >
            <circle cx="225" cy="235" r="16" />
            <circle cx="279" cy="261" r="21" />
            <circle cx="252" cy="301" r="13" />
          </g>
        </g>
      `,
    }),

  "pegada.svg":
    criarSvg({
      conteudo: `
        <g
          fill="#302d24"
          stroke="#171914"
          stroke-width="8"
          opacity="0.9"
          filter="url(#sombra-suave)"
        >
          <g transform="translate(135 119) rotate(-20)">
            <ellipse cx="78" cy="129" rx="48" ry="75" />
            <ellipse cx="33" cy="47" rx="20" ry="29" />
            <ellipse cx="68" cy="30" rx="21" ry="31" />
            <ellipse cx="105" cy="35" rx="20" ry="30" />
            <ellipse cx="136" cy="57" rx="18" ry="27" />
          </g>

          <g transform="translate(264 245) rotate(16)">
            <ellipse cx="78" cy="129" rx="48" ry="75" />
            <ellipse cx="33" cy="47" rx="20" ry="29" />
            <ellipse cx="68" cy="30" rx="21" ry="31" />
            <ellipse cx="105" cy="35" rx="20" ry="30" />
            <ellipse cx="136" cy="57" rx="18" ry="27" />
          </g>
        </g>
      `,
    }),

  "simbolo.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra-suave)">
          <circle
            cx="256"
            cy="256"
            r="182"
            fill="#29251f"
            fill-opacity="0.38"
            stroke="#7e2730"
            stroke-width="18"
          />

          <circle
            cx="256"
            cy="256"
            r="137"
            fill="none"
            stroke="#bd3948"
            stroke-width="13"
            stroke-dasharray="28 15"
          />

          <path
            d="
              M256 98
              L302 199
              L413 210
              L329 282
              L355 390
              L256 333
              L157 390
              L183 282
              L99 210
              L210 199
              Z
            "
            fill="none"
            stroke="#c94b58"
            stroke-width="17"
            stroke-linejoin="round"
          />

          <circle
            cx="256"
            cy="256"
            r="37"
            fill="#40151c"
            stroke="#e06269"
            stroke-width="11"
          />

          <g
            fill="#ddcfc1"
            opacity="0.72"
          >
            <circle cx="256" cy="73" r="10" />
            <circle cx="439" cy="256" r="10" />
            <circle cx="256" cy="439" r="10" />
            <circle cx="73" cy="256" r="10" />
          </g>
        </g>
      `,
    }),

  "osso.svg":
    criarSvg({
      conteudo: `
        <g
          filter="url(#sombra)"
          transform="rotate(-27 256 256)"
        >
          <path
            d="
              M145 215
              C112 196 83 220 91 253
              C61 276 78 315 115 314
              C129 348 170 345 184 316
              L337 316
              C352 347 395 348 408 314
              C447 312 458 271 426 251
              C434 216 400 195 370 215
              C354 189 318 194 306 225
              L205 225
              C193 194 159 189 145 215
              Z
            "
            fill="#d8d0b3"
            stroke="#5b584b"
            stroke-width="14"
            filter="url(#textura)"
          />

          <path
            d="M192 251 H319"
            stroke="#f2ead0"
            stroke-width="18"
            stroke-linecap="round"
            opacity="0.62"
          />

          <path
            d="M214 294 H299"
            stroke="#8c8873"
            stroke-width="10"
            stroke-linecap="round"
            opacity="0.46"
          />
        </g>
      `,
    }),

  "entulho-natural.svg":
    criarSvg({
      conteudo: `
        <g filter="url(#sombra-suave)">
          <ellipse
            cx="259"
            cy="384"
            rx="177"
            ry="41"
            fill="#111612"
            opacity="0.4"
          />

          <g
            fill="url(#pedra)"
            stroke="#292e2b"
            stroke-width="10"
          >
            <path d="M85 311 L117 230 L190 243 L208 329 L143 371 Z" />
            <path d="M278 296 L315 211 L391 232 L426 318 L354 366 Z" />
            <path d="M190 341 L225 281 L294 293 L309 368 L239 398 Z" />
          </g>

          <g
            stroke="url(#madeira)"
            stroke-width="35"
            stroke-linecap="round"
          >
            <path d="M112 177 L344 355" />
            <path d="M386 162 L179 357" />
          </g>

          <g
            stroke="#b17b46"
            stroke-width="8"
            stroke-linecap="round"
            opacity="0.48"
          >
            <path d="M119 171 L342 343" />
            <path d="M377 162 L185 347" />
          </g>

          <g
            fill="#45673a"
            stroke="#203622"
            stroke-width="6"
          >
            <path d="M94 298 C55 261 51 213 75 177 C103 220 112 258 94 298 Z" />
            <path d="M411 311 C447 266 453 218 431 183 C401 225 393 270 411 311 Z" />
            <path d="M258 223 C232 186 234 149 255 119 C278 155 281 192 258 223 Z" />
          </g>
        </g>
      `,
    }),
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

    if (
      await arquivoExiste(
        caminho,
      )
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

  return {
    criados,
    preservados,
  };
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
      "Os objetos foram criados, mas o manifesto não pôde ser atualizado.",
    );
  }
}

async function gerarPack() {
  const resultado =
    await gerarAssets();

  atualizarManifesto();

  console.log(
    [
      "",
      "Pack inicial da Floresta concluído.",
      `Criados: ${resultado.criados}.`,
      `Preservados: ${resultado.preservados}.`,
      `Objetos disponíveis: ${Object.keys(ASSETS).length}.`,
      `Pasta: ${PASTA_OBJETOS}`,
    ].join("\n"),
  );
}

gerarPack().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar o pack da Floresta.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);