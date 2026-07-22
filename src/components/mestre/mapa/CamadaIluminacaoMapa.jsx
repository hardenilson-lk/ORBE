import { calcularPoligonoVisao } from "./visaoMapa.js";

function CamadaIluminacaoMapa({ largura, altura, iluminacao, luzes, fontesToken, barreiras, papelAtual, ativaEdicao, aoAdicionarLuz }) {
  const fontesManuais = luzes.map((luz) => ({
    ...luz,
    raioPixels: luz.raio,
    intensidade: luz.intensidade ?? 0.9,
  }));
  const fontesVisao = iluminacao.visaoDinamica
    ? fontesToken.flatMap((fonte) => [
      { ...fonte, id: `${fonte.id}-cone` },
      {
        ...fonte,
        id: `${fonte.id}-traseira`,
        x: fonte.traseiraX,
        y: fonte.traseiraY,
        raioPixels: fonte.raioTraseiroPixels,
        angulo: fonte.anguloTraseiro,
        amplitude: fonte.amplitudeTraseira,
      },
    ])
    : [];
  const fontes = [...fontesManuais, ...fontesVisao].filter((fonte) => fonte.raioPixels > 0);

  return (
    <svg
      className={ativaEdicao ? "camada-iluminacao-mapa camada-iluminacao-mapa--ativa" : "camada-iluminacao-mapa"}
      viewBox={`0 0 ${largura} ${altura}`}
      aria-label="Iluminação e visão do mapa"
      onPointerDown={(evento) => {
        if (!ativaEdicao || evento.button !== 0) return;
        const rect = evento.currentTarget.getBoundingClientRect();
        aoAdicionarLuz({
          x: ((evento.clientX - rect.left) / Math.max(1, rect.width)) * largura,
          y: ((evento.clientY - rect.top) / Math.max(1, rect.height)) * altura,
        });
      }}
    >
      <defs>
        {fontes.map((fonte) => {
          const gradienteId = `gradiente-luz-${String(fonte.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
          return (
            <radialGradient key={gradienteId} id={gradienteId} gradientUnits="userSpaceOnUse" cx={fonte.x} cy={fonte.y} r={fonte.raioPixels}>
              <stop offset="0%" stopColor="black" stopOpacity={fonte.intensidade ?? 1} />
              <stop offset="68%" stopColor="black" stopOpacity={fonte.intensidade ?? 1} />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </radialGradient>
          );
        })}
        {fontesVisao.map((fonte) => {
          const gradienteId = `gradiente-brilho-token-${String(fonte.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
          return (
            <radialGradient key={gradienteId} id={gradienteId} gradientUnits="userSpaceOnUse" cx={fonte.x} cy={fonte.y} r={fonte.raioPixels}>
              <stop offset="0%" stopColor="#fff4bd" stopOpacity="0.48" />
              <stop offset="38%" stopColor="#ffd774" stopOpacity="0.3" />
              <stop offset="78%" stopColor="#d89536" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#d89536" stopOpacity="0" />
            </radialGradient>
          );
        })}
        <mask id="mascara-luz-orbe">
          <rect width={largura} height={altura} fill="white" />
          {fontes.map((fonte) => {
            const gradienteId = `gradiente-luz-${String(fonte.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
            const poligono = calcularPoligonoVisao(
              { x: fonte.x, y: fonte.y },
              fonte.raioPixels,
              barreiras,
              128,
              { angulo: fonte.angulo, amplitude: fonte.amplitude },
            );
            return <polygon key={fonte.id} points={poligono.map((ponto) => `${ponto.x},${ponto.y}`).join(" ")} fill={`url(#${gradienteId})`} />;
          })}
        </mask>
      </defs>
      <rect
        className="camada-iluminacao-mapa__escuridao"
        width={largura}
        height={altura}
        opacity={Math.max(0, 1 - iluminacao.luzAmbiente)}
        mask="url(#mascara-luz-orbe)"
      />
      <rect
        className="camada-iluminacao-mapa__ambiente"
        width={largura}
        height={altura}
        fill={iluminacao.corAmbiente}
        opacity={Math.min(0.16, iluminacao.luzAmbiente * 0.12)}
      />
      {iluminacao.visaoDinamica ? fontesVisao.map((fonte) => {
        const gradienteId = `gradiente-brilho-token-${String(fonte.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        const poligono = calcularPoligonoVisao(
          { x: fonte.x, y: fonte.y },
          fonte.raioPixels,
          barreiras,
          128,
          { angulo: fonte.angulo, amplitude: fonte.amplitude },
        );
        return (
          <polygon
            className="camada-iluminacao-mapa__brilho-token"
            key={`brilho-${fonte.id}`}
            points={poligono.map((ponto) => `${ponto.x},${ponto.y}`).join(" ")}
            fill={`url(#${gradienteId})`}
          />
        );
      }) : null}
      {papelAtual === "mestre" ? luzes.map((luz) => (
        <circle
          className="camada-iluminacao-mapa__fonte"
          style={{ fill: luz.cor, color: luz.cor }}
          key={`marca-${luz.id}`}
          cx={luz.x}
          cy={luz.y}
          r="10"
        />
      )) : null}
    </svg>
  );
}

export default CamadaIluminacaoMapa;
