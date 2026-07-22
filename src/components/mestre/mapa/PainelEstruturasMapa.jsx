function PainelEstruturasMapa({ ferramenta, paredes, portas, bloqueada, aoEscolher, aoAlterar, aoRemover, aoFechar }) {
  const contadores = { parede: 0, porta: 0, janela: 0 };
  const itens = [
    ...paredes.map((item) => ({ ...item, tipo: "parede" })),
    ...portas.map((item) => ({ ...item, tipo: item.tipoEstrutura === "janela" ? "janela" : "porta" })),
  ].map((item) => {
    contadores[item.tipo] += 1;
    const rotulo = item.tipo === "janela" ? "Janela" : item.tipo === "porta" ? "Porta" : "Parede";
    return { ...item, nome: `${rotulo} ${contadores[item.tipo]}` };
  });
  const ferramentas = [
    { id: "parede", simbolo: "╱", nome: "Desenhar parede" },
    { id: "porta", simbolo: "▯", nome: "Desenhar porta" },
    { id: "janela", simbolo: "▤", nome: "Desenhar janela" },
  ];
  return (
    <section className="painel-mapa__config-grid painel-estruturas-mapa" data-assistente="mapa-painel-paredes">
      <header><h3>Paredes, portas e janelas</h3><button type="button" aria-label="Fechar painel" onClick={aoFechar}><span aria-hidden="true">×</span> Fechar</button></header>
      <p className="painel-mapa__token-ajuda">Paredes e aberturas fechadas bloqueiam visão e luz. Dê dois cliques numa porta ou janela para abrir/fechar. Portas trancadas só podem ser liberadas pelo mestre.</p>
      <div className="painel-estruturas-mapa__acoes">
        {ferramentas.map((item) => (
          <button className="painel-mapa__botao-ferramenta" key={item.id} type="button" disabled={bloqueada} aria-pressed={ferramenta === item.id} onClick={() => aoEscolher(ferramenta === item.id ? "" : item.id)}>
            <span aria-hidden="true">{item.simbolo}</span> {item.nome}
          </button>
        ))}
      </div>
      {bloqueada ? <p className="painel-mapa__token-ajuda">Destrave a camada “Paredes, portas e janelas” para editar.</p> : null}
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
            {item.tipo !== "parede" ? <button type="button" onClick={() => aoAlterar(item.tipo, item.id, { aberta: !item.aberta })}>{item.aberta ? "Fechar" : "Abrir"}</button> : null}
            {item.tipo === "porta" ? <button type="button" onClick={() => aoAlterar(item.tipo, item.id, { trancada: !item.trancada, aberta: item.trancada ? item.aberta : false })}>{item.trancada ? "Destrancar" : "Trancar"}</button> : null}
            <button type="button" onClick={() => aoAlterar(item.tipo, item.id, { oculta: !item.oculta })}>{item.oculta ? "Mostrar" : "Ocultar de jogadores"}</button>
            <button className="painel-mapa__botao-perigo" type="button" onClick={() => aoRemover(item.tipo, item.id)}>Remover</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PainelEstruturasMapa;
