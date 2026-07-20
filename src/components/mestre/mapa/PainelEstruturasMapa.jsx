function PainelEstruturasMapa({ ferramenta, paredes, portas, bloqueada, aoEscolher, aoAlterar, aoRemover, aoFechar }) {
  const itens = [
    ...paredes.map((item, indice) => ({ ...item, tipo: "parede", nome: `Parede ${indice + 1}` })),
    ...portas.map((item, indice) => ({ ...item, tipo: "porta", nome: `Porta ${indice + 1}` })),
  ];
  return (
    <section className="painel-mapa__config-grid painel-estruturas-mapa" data-assistente="mapa-painel-paredes">
      <header><h3>Paredes e portas</h3><button type="button" aria-label="Fechar painel" onClick={aoFechar}><span aria-hidden="true">×</span> Fechar</button></header>
      <p className="painel-mapa__token-ajuda">Trace segmentos diretamente no mapa. Paredes e portas fechadas bloqueiam visão e luz; portas abertas liberam a passagem.</p>
      <div className="painel-estruturas-mapa__acoes">
        <button className="painel-mapa__botao-ferramenta" type="button" disabled={bloqueada} aria-pressed={ferramenta === "parede"} onClick={() => aoEscolher(ferramenta === "parede" ? "" : "parede")}><span aria-hidden="true">╱</span> Desenhar parede</button>
        <button className="painel-mapa__botao-ferramenta" type="button" disabled={bloqueada} aria-pressed={ferramenta === "porta"} onClick={() => aoEscolher(ferramenta === "porta" ? "" : "porta")}><span aria-hidden="true">▯</span> Desenhar porta</button>
      </div>
      {bloqueada ? <p className="painel-mapa__token-ajuda">Destrave a camada “Paredes e portas” para editar.</p> : null}
      <div className="painel-estruturas-mapa__lista">
        {itens.length === 0 ? <p>Nenhuma estrutura desenhada.</p> : itens.map((item) => (
          <article key={item.id}>
            <strong>{item.nome}</strong>
            <small>{Math.round(item.inicio.x)}, {Math.round(item.inicio.y)} → {Math.round(item.fim.x)}, {Math.round(item.fim.y)}</small>
            <div className="painel-estruturas-mapa__pontos">
              <label>X1 <input type="number" value={Math.round(item.inicio.x)} onChange={(e) => aoAlterar(item.tipo, item.id, { inicio: { ...item.inicio, x: Number(e.target.value) } })} /></label>
              <label>Y1 <input type="number" value={Math.round(item.inicio.y)} onChange={(e) => aoAlterar(item.tipo, item.id, { inicio: { ...item.inicio, y: Number(e.target.value) } })} /></label>
              <label>X2 <input type="number" value={Math.round(item.fim.x)} onChange={(e) => aoAlterar(item.tipo, item.id, { fim: { ...item.fim, x: Number(e.target.value) } })} /></label>
              <label>Y2 <input type="number" value={Math.round(item.fim.y)} onChange={(e) => aoAlterar(item.tipo, item.id, { fim: { ...item.fim, y: Number(e.target.value) } })} /></label>
            </div>
            {item.tipo === "porta" ? <button type="button" onClick={() => aoAlterar(item.tipo, item.id, { aberta: !item.aberta })}>{item.aberta ? "Fechar" : "Abrir"}</button> : null}
            <button type="button" onClick={() => aoAlterar(item.tipo, item.id, { oculta: !item.oculta })}>{item.oculta ? "Mostrar" : "Ocultar de jogadores"}</button>
            <button className="painel-mapa__botao-perigo" type="button" onClick={() => aoRemover(item.tipo, item.id)}>Remover</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PainelEstruturasMapa;
