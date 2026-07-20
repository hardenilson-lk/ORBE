function PainelIluminacaoMapa({ iluminacao, luzes, tokens, fichas, ferramenta, bloqueada, aoAtualizar, aoEscolher, aoAlterarLuz, aoRemoverLuz, aoAlterarToken, aoFechar }) {
  return (
    <section className="painel-mapa__config-grid painel-iluminacao-mapa" data-assistente="mapa-painel-luz">
      <header><h3>Visão e iluminação</h3><button type="button" aria-label="Fechar painel" onClick={aoFechar}><span aria-hidden="true">×</span> Fechar</button></header>
      <div className="painel-mapa__config-checks">
        <label><input type="checkbox" checked={iluminacao.visaoDinamica} onChange={(e) => aoAtualizar("visaoDinamica", e.target.checked)} /> Visão dinâmica dos tokens</label>
        <label><input type="checkbox" checked={iluminacao.previsualizarJogador} onChange={(e) => aoAtualizar("previsualizarJogador", e.target.checked)} /> Prévia do jogador</label>
      </div>
      <div className="painel-mapa__config-campos">
        <label>Luz ambiente <input type="range" min="0" max="1" step="0.05" value={iluminacao.luzAmbiente} onChange={(e) => aoAtualizar("luzAmbiente", Number(e.target.value))} /></label>
        <label>Cor ambiente <input type="color" value={iluminacao.corAmbiente} onChange={(e) => aoAtualizar("corAmbiente", e.target.value)} /></label>
        <button className="painel-mapa__botao-ferramenta" type="button" disabled={bloqueada} aria-pressed={ferramenta === "luz"} onClick={() => aoEscolher(ferramenta === "luz" ? "" : "luz")}><span aria-hidden="true">✦</span> Adicionar luz no mapa</button>
      </div>
      <div className="painel-iluminacao-mapa__lista">
        {luzes.map((luz, indice) => <article key={luz.id}>
          <strong>Luz {indice + 1}</strong>
          <label>Alcance <input type="number" min="24" max="5000" value={luz.raio} onChange={(e) => aoAlterarLuz(luz.id, { raio: Number(e.target.value) })} /></label>
          <label>Intensidade <input type="range" min="0.1" max="1" step="0.05" value={luz.intensidade ?? 0.9} onChange={(e) => aoAlterarLuz(luz.id, { intensidade: Number(e.target.value) })} /></label>
          <label>Cor <input type="color" value={luz.cor || "#ffd36a"} onChange={(e) => aoAlterarLuz(luz.id, { cor: e.target.value })} /></label>
          <button className="painel-mapa__botao-perigo" type="button" onClick={() => aoRemoverLuz(luz.id)}>Remover</button>
        </article>)}
      </div>
      <h4>Visão dos tokens</h4>
      <div className="painel-iluminacao-mapa__lista">
        {tokens.map((token) => {
          const ficha = fichas.find((item) => item.id === token.fichaId);
          return <article key={token.id}>
            <strong>{ficha?.nome || token.nome || "Token"}</strong>
            <label>Casas <input type="number" min="0" max="50" value={token.visaoAlcance ?? 6} onChange={(e) => aoAlterarToken(token.id, { visaoAlcance: Number(e.target.value) })} /></label>
            <label>Direção <select value={token.rotacao ?? 0} onChange={(e) => aoAlterarToken(token.id, { rotacao: Number(e.target.value) })}>
              <option value="180">Norte</option><option value="270">Leste</option><option value="0">Sul</option><option value="90">Oeste</option>
            </select></label>
            <label>Cone <select value={token.visaoCone ?? 240} onChange={(e) => aoAlterarToken(token.id, { visaoCone: Number(e.target.value) })}>
              <option value="360">360°</option><option value="240">240°</option><option value="120">120°</option><option value="60">60°</option>
            </select></label>
          </article>;
        })}
      </div>
    </section>
  );
}

export default PainelIluminacaoMapa;
