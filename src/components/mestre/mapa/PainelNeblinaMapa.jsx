function PainelNeblinaMapa({ neblina, ferramenta, bloqueada, aoAtualizar, aoEscolher, aoRemoverArea, aoFechar }) {
  return (
    <section className="painel-mapa__config-grid painel-neblina-mapa" data-assistente="mapa-painel-neblina">
      <header><h3>Neblina de guerra</h3><button type="button" aria-label="Fechar painel" onClick={aoFechar}><span aria-hidden="true">×</span> Fechar</button></header>
      <div className="painel-mapa__config-checks">
        <label><input type="checkbox" checked={neblina.ativa} onChange={(e) => aoAtualizar("ativa", e.target.checked)} /> Ativar neblina geral</label>
        <label><input type="checkbox" checked={neblina.previsualizarJogador} onChange={(e) => aoAtualizar("previsualizarJogador", e.target.checked)} /> Prévia exata do jogador</label>
      </div>
      <div className="painel-mapa__config-campos">
        <label>Opacidade <input type="range" min="0.2" max="1" step="0.05" value={neblina.opacidade} onChange={(e) => aoAtualizar("opacidade", Number(e.target.value))} /></label>
      </div>
      <div className="painel-neblina-mapa__acoes">
        <button className="painel-mapa__botao-ferramenta" type="button" disabled={bloqueada || !neblina.ativa} aria-pressed={ferramenta === "retangulo"} onClick={() => aoEscolher(ferramenta === "retangulo" ? "" : "retangulo")}><span aria-hidden="true">□</span> Revelar retângulo</button>
        <button className="painel-mapa__botao-ferramenta" type="button" disabled={bloqueada || !neblina.ativa} aria-pressed={ferramenta === "circulo"} onClick={() => aoEscolher(ferramenta === "circulo" ? "" : "circulo")}><span aria-hidden="true">○</span> Revelar círculo</button>
        <button className="painel-mapa__botao-ferramenta" type="button" disabled={bloqueada || !neblina.ativa} aria-pressed={ferramenta === "livre"} onClick={() => aoEscolher(ferramenta === "livre" ? "" : "livre")}><span aria-hidden="true">⌁</span> Revelar livre</button>
        <button className="painel-mapa__botao-perigo" type="button" onClick={() => aoAtualizar("areasReveladas", [])}>Ocultar tudo novamente</button>
      </div>
      <div className="painel-neblina-mapa__areas">
        {neblina.areasReveladas.length === 0 ? <p>Nenhuma área revelada.</p> : neblina.areasReveladas.map((area, indice) => (
          <article key={area.id}><strong>Área {indice + 1} · {area.tipo}</strong><button type="button" onClick={() => aoRemoverArea(area.id)}>Ocultar novamente</button></article>
        ))}
      </div>
    </section>
  );
}

export default PainelNeblinaMapa;
