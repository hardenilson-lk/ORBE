import { useId } from "react";

const COR_CONTORNO = "#2a1a12";
const COR_CENTRO = "#f6d88f";
const COR_HACHURA = "#8c5727";

function Definicoes({ id }) {
  return (
    <defs>
      <pattern
        id={`${id}-hachura`}
        width="7"
        height="7"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(35)"
      >
        <rect width="7" height="7" fill="#e6af55" />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="7"
          stroke={COR_HACHURA}
          strokeWidth="1.4"
          opacity="0.65"
        />
      </pattern>
    </defs>
  );
}

function propriedadesFace(preenchimento) {
  return {
    fill: preenchimento,
    stroke: COR_CONTORNO,
    strokeWidth: 3.4,
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke",
  };
}

function propriedadesLinha() {
  return {
    fill: "none",
    stroke: COR_CONTORNO,
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke",
  };
}

function Numero({ resultado, tamanho = 28, x = 60, y = 60 }) {
  return (
    <text
      x={x}
      y={y}
      fill={COR_CONTORNO}
      stroke="#fff1c5"
      strokeWidth="1.1"
      paintOrder="stroke"
      fontFamily="Georgia, Times New Roman, serif"
      fontSize={tamanho}
      fontWeight="700"
      textAnchor="middle"
      dominantBaseline="middle"
      pointerEvents="none"
    >
      {resultado}
    </text>
  );
}

/* D20 mantido */

function D20({ resultado, id }) {
  return (
    <>
      <polygon
        points="
          60,6
          103,30
          103,84
          60,110
          17,84
          17,30
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          60,28
          85,43
          78,77
          42,77
          35,43
        "
        {...propriedadesFace(COR_CENTRO)}
      />

      <polygon
        points="60,6 103,30 85,43 60,28"
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="60,6 60,28 35,43 17,30"
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="17,30 35,43 42,77 17,84"
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="103,30 85,43 78,77 103,84"
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="17,84 42,77 60,110"
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="78,77 103,84 60,110"
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <Numero resultado={resultado} tamanho={28} y={56} />
    </>
  );
}

/* D12 corrigido */

function D12({ resultado, id }) {
  return (
    <>
      <polygon
        points="
          60,8
          76,12
          90,22
          99,37
          100,55
          95,73
          83,87
          67,96
          53,96
          37,87
          25,73
          20,55
          21,37
          30,22
          44,12
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          60,31
          74,39
          71,61
          60,72
          49,61
          46,39
        "
        {...propriedadesFace(COR_CENTRO)}
      />

      <line x1="60" y1="8" x2="60" y2="31" {...propriedadesLinha()} />
      <line x1="76" y1="12" x2="74" y2="39" {...propriedadesLinha()} />
      <line x1="90" y1="22" x2="74" y2="39" {...propriedadesLinha()} />
      <line x1="99" y1="37" x2="74" y2="39" {...propriedadesLinha()} />
      <line x1="100" y1="55" x2="71" y2="61" {...propriedadesLinha()} />
      <line x1="95" y1="73" x2="71" y2="61" {...propriedadesLinha()} />
      <line x1="83" y1="87" x2="71" y2="61" {...propriedadesLinha()} />
      <line x1="67" y1="96" x2="60" y2="72" {...propriedadesLinha()} />
      <line x1="53" y1="96" x2="60" y2="72" {...propriedadesLinha()} />
      <line x1="37" y1="87" x2="49" y2="61" {...propriedadesLinha()} />
      <line x1="25" y1="73" x2="49" y2="61" {...propriedadesLinha()} />
      <line x1="20" y1="55" x2="46" y2="39" {...propriedadesLinha()} />
      <line x1="21" y1="37" x2="46" y2="39" {...propriedadesLinha()} />
      <line x1="30" y1="22" x2="46" y2="39" {...propriedadesLinha()} />
      <line x1="44" y1="12" x2="46" y2="39" {...propriedadesLinha()} />

      <Numero resultado={resultado} tamanho={28} y={54} />
    </>
  );
}

/* D10 mantido */

function D10({ resultado, id }) {
  return (
    <>
      <polygon
        points="
          60,7
          103,57
          87,84
          60,108
          33,84
          17,57
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          60,7
          60,19
          36,72
          17,57
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          60,7
          103,57
          84,72
          60,19
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          36,72
          84,72
          87,84
          60,108
          33,84
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          60,19
          84,72
          36,72
        "
        {...propriedadesFace(COR_CENTRO)}
      />

      <Numero resultado={resultado} tamanho={30} y={53} />
    </>
  );
}

/* D8 mantido */

function D8({ resultado, id }) {
  return (
    <>
      <polygon
        points="
          60,10
          92,34
          100,66
          60,102
          20,66
          28,34
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          60,27
          78,71
          42,71
        "
        {...propriedadesFace(COR_CENTRO)}
      />

      <line x1="60" y1="10" x2="60" y2="27" {...propriedadesLinha()} />
      <line x1="92" y1="34" x2="78" y2="71" {...propriedadesLinha()} />
      <line x1="100" y1="66" x2="78" y2="71" {...propriedadesLinha()} />
      <line x1="60" y1="102" x2="60" y2="71" {...propriedadesLinha()} />
      <line x1="20" y1="66" x2="42" y2="71" {...propriedadesLinha()} />
      <line x1="28" y1="34" x2="42" y2="71" {...propriedadesLinha()} />

      <Numero resultado={resultado} tamanho={30} y={60} />
    </>
  );
}

/* D6 mantido */

function D6({ resultado, id }) {
  return (
    <>
      <polygon
        points="
          22,29
          34,17
          100,17
          88,29
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          88,29
          100,17
          100,83
          88,95
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <rect
        x="22"
        y="29"
        width="66"
        height="66"
        rx="2"
        {...propriedadesFace(COR_CENTRO)}
      />

      <rect
        x="30"
        y="37"
        width="50"
        height="50"
        rx="1"
        fill="none"
        stroke={COR_CONTORNO}
        strokeWidth="1.7"
        vectorEffect="non-scaling-stroke"
      />

      <Numero resultado={resultado} tamanho={31} x={55} y={62} />
    </>
  );
}

/* D4 mantido */

function D4({ resultado, id }) {
  return (
    <>
      <polygon
        points="
          60,8
          107,100
          13,100
        "
        {...propriedadesFace(`url(#${id}-hachura)`)}
      />

      <polygon
        points="
          60,25
          89,87
          31,87
        "
        {...propriedadesFace(COR_CENTRO)}
      />

      <line x1="60" y1="8" x2="60" y2="25" {...propriedadesLinha()} />
      <line x1="107" y1="100" x2="89" y2="87" {...propriedadesLinha()} />
      <line x1="13" y1="100" x2="31" y2="87" {...propriedadesLinha()} />

      <Numero resultado={resultado} tamanho={30} y={61} />
    </>
  );
}

function DadoPoliedrico({ lados = 20, resultado = 1, className = "" }) {
  const idOriginal = useId();
  const id = idOriginal.replace(/:/g, "");

  const quantidadeLados = [4, 6, 8, 10, 12, 20].includes(Number(lados))
    ? Number(lados)
    : 20;

  let desenho;

  if (quantidadeLados === 4) {
    desenho = <D4 resultado={resultado} id={id} />;
  } else if (quantidadeLados === 6) {
    desenho = <D6 resultado={resultado} id={id} />;
  } else if (quantidadeLados === 8) {
    desenho = <D8 resultado={resultado} id={id} />;
  } else if (quantidadeLados === 10) {
    desenho = <D10 resultado={resultado} id={id} />;
  } else if (quantidadeLados === 12) {
    desenho = <D12 resultado={resultado} id={id} />;
  } else {
    desenho = <D20 resultado={resultado} id={id} />;
  }

  return (
    <svg
      className={`dado-poliedrico dado-poliedrico--d${quantidadeLados} ${className}`}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`d${quantidadeLados}: ${resultado}`}
    >
      <Definicoes id={id} />
      {desenho}
    </svg>
  );
}

export default DadoPoliedrico;