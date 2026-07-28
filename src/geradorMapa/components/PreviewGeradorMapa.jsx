export default function PreviewGeradorMapa({
  largura,
  altura,
  mapaGerado,
  desatualizado,
}) {
  const salas = mapaGerado?.salas || [];
  const corredores = mapaGerado?.corredores || [];
  const celulasCorredores = mapaGerado?.celulasCorredores || [];
  const celulasChao = mapaGerado?.celulasChao || [];
  const conectividade = mapaGerado?.validacao;
  const entrada = mapaGerado?.entrada;
  const saida = mapaGerado?.saida;
  const paredes = mapaGerado?.paredes || [];
  const portas = mapaGerado?.portas || [];
  const objetos = mapaGerado?.objetos || [];
  const luzes = mapaGerado?.luzes || [];

  return (
    <section className={`gerador-mapa__preview gerador-mapa__preview--${mapaGerado?.tema || "estrutural"}`}>
      <header>
        <div>
          <span>Pré-visualização</span>
          <h3>{mapaGerado?.tiposSalaDistribuidos ? "Mapa temático gerado" : "Planta estrutural"}</h3>
        </div>
        <small>{largura} × {altura} células</small>
      </header>
      <div className="gerador-mapa__preview-area">
        {mapaGerado ? (
          <svg
            className="gerador-mapa__planta"
            viewBox={`0 0 ${mapaGerado.largura} ${mapaGerado.altura}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`Prévia de ${salas.length} salas em um mapa de ${mapaGerado.largura} por ${mapaGerado.altura} células`}
          >
            <defs>
              <pattern id="grade-gerador-mapa" width="1" height="1" patternUnits="userSpaceOnUse">
                <path d="M 1 0 L 0 0 0 1" className="gerador-mapa__linha-grade" />
              </pattern>
            </defs>
            <rect width={mapaGerado.largura} height={mapaGerado.altura} className="gerador-mapa__fundo-planta" />
            {mapaGerado.finalizacaoIA?.imagem ? (
              <image
                href={mapaGerado.finalizacaoIA.imagem}
                x="0"
                y="0"
                width={mapaGerado.largura}
                height={mapaGerado.altura}
                preserveAspectRatio="xMidYMid slice"
                opacity="0.72"
                pointerEvents="none"
                aria-hidden="true"
              />
            ) : null}
            <rect width={mapaGerado.largura} height={mapaGerado.altura} fill="url(#grade-gerador-mapa)" />
            {celulasCorredores.map((celula) => (
              <rect
                x={celula.x}
                y={celula.y}
                width="1"
                height="1"
                className="gerador-mapa__celula-corredor"
                key={`${celula.x}:${celula.y}`}
              />
            ))}
            {salas.map((sala, indice) => (
              <g key={sala.id}>
                <rect
                  x={sala.x}
                  y={sala.y}
                  width={sala.largura}
                  height={sala.altura}
                  className={[
                    "gerador-mapa__sala",
                    sala.id === mapaGerado.salaInicialId ? "gerador-mapa__sala--inicial" : "",
                    sala.id === mapaGerado.salaFinalId ? "gerador-mapa__sala--final" : "",
                  ].filter(Boolean).join(" ")}
                />
                <text
                  x={sala.centroX}
                  y={sala.centroY}
                  className="gerador-mapa__rotulo-sala"
                >
                  {sala.nome || indice + 1}
                </text>
              </g>
            ))}
            {luzes.filter(({ ativa }) => ativa).map((luz) => (
              <circle cx={luz.x + .5} cy={luz.y + .5} r={luz.alcance} className="gerador-mapa__alcance-luz" style={{ fill: luz.cor, opacity: Math.max(.08, luz.intensidade * .22) }} key={`alcance-${luz.id}`} />
            ))}
            {objetos.map((objeto) => {
              const girado = objeto.rotacao % 180 !== 0;
              const larguraObjeto = girado ? objeto.altura : objeto.largura;
              const alturaObjeto = girado ? objeto.largura : objeto.altura;
              return <rect x={objeto.x + .08} y={objeto.y + .08} width={larguraObjeto - .16} height={alturaObjeto - .16} className={`gerador-mapa__objeto gerador-mapa__objeto--${objeto.categoria}`} key={objeto.id} />;
            })}
            {luzes.map((luz) => <circle cx={luz.x + .5} cy={luz.y + .5} r=".22" className={luz.ativa ? "gerador-mapa__luz" : "gerador-mapa__luz gerador-mapa__luz--inativa"} key={luz.id} />)}
            {paredes.map((parede) => (
              <line
                x1={parede.inicio.x}
                y1={parede.inicio.y}
                x2={parede.fim.x}
                y2={parede.fim.y}
                className={`gerador-mapa__parede gerador-mapa__parede--${parede.tipo}`}
                key={parede.id}
              />
            ))}
            {portas.map((porta) => (
              <g className={`gerador-mapa__porta gerador-mapa__porta--${porta.estado}`} key={porta.id}>
                <line x1={porta.inicio.x} y1={porta.inicio.y} x2={porta.fim.x} y2={porta.fim.y} />
                {porta.trancada || porta.secreta ? (
                  <text
                    x={(porta.inicio.x + porta.fim.x) / 2}
                    y={(porta.inicio.y + porta.fim.y) / 2}
                  >
                    {porta.trancada ? "T" : "?"}
                  </text>
                ) : null}
              </g>
            ))}
            {entrada ? (
              <g className="gerador-mapa__marcador gerador-mapa__marcador--entrada">
                <circle cx={entrada.x + 0.5} cy={entrada.y + 0.5} r="0.48" />
                <text x={entrada.x + 0.5} y={entrada.y + 0.5}>E</text>
              </g>
            ) : null}
            {saida ? (
              <g className="gerador-mapa__marcador gerador-mapa__marcador--saida">
                <circle cx={saida.x + 0.5} cy={saida.y + 0.5} r="0.48" />
                <text x={saida.x + 0.5} y={saida.y + 0.5}>S</text>
              </g>
            ) : null}
          </svg>
        ) : (
          <p>Configure o mapa e clique em Gerar mapa.</p>
        )}
      </div>
      <div className="gerador-mapa__legenda" aria-label="Legenda da pré-visualização">
        <span><i className="gerador-mapa__legenda-sala" />Sala</span>
        <span><i className="gerador-mapa__legenda-corredor" />Corredor</span>
        <span><i className="gerador-mapa__legenda-parede" />Parede</span>
        <span><i className="gerador-mapa__legenda-porta" />Porta</span>
        <span><i className="gerador-mapa__legenda-trancada">T</i>Trancada</span>
        <span><i className="gerador-mapa__legenda-secreta">?</i>Secreta</span>
        <span><i className="gerador-mapa__legenda-entrada">E</i>Entrada</span>
        <span><i className="gerador-mapa__legenda-saida">S</i>Saída/Objetivo</span>
      </div>
      {mapaGerado ? (
        <div className="gerador-mapa__resumo">
          <strong>Mapa gerado</strong>
          <span>Sistema: {mapaGerado.sistema}</span>
          <span>Tema: {mapaGerado.tema}</span>
          <span>{mapaGerado.largura} × {mapaGerado.altura}</span>
          <span>{salas.length} sala(s)</span>
          <span>{corredores.length} corredor(es)</span>
          <span>{celulasChao.length} célula(s) caminhável(is)</span>
          <span>{paredes.length} parede(s)</span>
          <span>{portas.length} porta(s)</span>
          <span>{salas.filter(({ tipoTematico }) => tipoTematico).length} tipo(s) de sala atribuído(s)</span>
          <span>{objetos.length} objeto(s)</span>
          <span>{objetos.filter(({ decorativo }) => decorativo).length} decoração(ões) ambiental(is)</span>
          <span>{luzes.length} luz(es)</span>
          <span>{luzes.filter(({ ativa }) => ativa).length} ativa(s) · {luzes.filter(({ ativa }) => !ativa).length} inativa(s)</span>
          {mapaGerado.resumoIluminacao ? <span>{mapaGerado.resumoIluminacao.salasSemIluminacao} sala(s) sem iluminação ativa</span> : null}
          {mapaGerado.resumoPortas ? (
            <>
              <span>{mapaGerado.resumoPortas.abertas} aberta(s)</span>
              <span>{mapaGerado.resumoPortas.fechadas} fechada(s)</span>
              <span>{mapaGerado.resumoPortas.trancadas} trancada(s)</span>
              <span>{mapaGerado.resumoPortas.secretas} secreta(s)</span>
            </>
          ) : null}
          {mapaGerado.resumoConexoes ? (
            <>
              <span>{mapaGerado.resumoConexoes.minimas} conexão(ões) mínima(s)</span>
              <span>{mapaGerado.resumoConexoes.extras} conexão(ões) extra(s)</span>
            </>
          ) : null}
          <span>Largura: {mapaGerado.configuracoes?.larguraCorredores || 1}</span>
          <span>
            Conectividade: {conectividade
              ? (conectividade.valido ? "todas as salas conectadas" : "existem salas isoladas")
              : "corredores pendentes"}
          </span>
          {mapaGerado.salaInicialId ? <span>Sala inicial: {mapaGerado.salaInicialId.replace("sala-", "Sala ")}</span> : null}
          {mapaGerado.salaFinalId ? <span>Sala final: {mapaGerado.salaFinalId.replace("sala-", "Sala ")}</span> : null}
          {mapaGerado.navegacao ? <span>Distância até o objetivo: {mapaGerado.navegacao.distanciaEntradaSaida} células</span> : null}
          {entrada ? <span>Entrada: {entrada.x}, {entrada.y}</span> : null}
          {saida ? <span>Saída: {saida.x}, {saida.y}</span> : null}
          {mapaGerado.validacaoEstrutural ? (
            <span>Validação: {mapaGerado.validacaoEstrutural.valido ? "mapa estrutural válido" : `${mapaGerado.validacaoEstrutural.erros.length} erro(s)`}</span>
          ) : null}
          {mapaGerado.validacaoTematica ? <span>Validação temática: {mapaGerado.validacaoTematica.valido ? `${mapaGerado.validacaoTematica.avisos.length} aviso(s)` : `${mapaGerado.validacaoTematica.erros.length} erro(s)`}</span> : null}
          {mapaGerado.validacaoTematica ? <span>Navegação com objetos: {mapaGerado.validacaoTematica.navegacaoObjetosValida ? "válida" : "bloqueada"}</span> : null}
          <span>Seed: {mapaGerado.seed}</span>
          {mapaGerado.navegacao?.avisoDistancia ? <em>{mapaGerado.navegacao.avisoDistancia}</em> : null}
          {conectividade && !conectividade.valido ? (
            <em>
              Salas isoladas: {[
                ...conectividade.grafo.salasIsoladas,
                ...conectividade.fisica.salasInalcancaveis,
              ].filter((id, indice, lista) => lista.indexOf(id) === indice).join(", ") || "não identificadas"}
            </em>
          ) : null}
          {desatualizado ? <em>As configurações foram alteradas. Gere novamente para atualizar a prévia.</em> : null}
        </div>
      ) : null}
    </section>
  );
}
