function PainelPermissoesMapa({ tokens, fichas, previsualizacao, aoPrevisualizar, aoAlterarToken, aoFechar }) {
  return (
    <section className="painel-mapa__config-grid painel-permissoes-mapa" data-assistente="mapa-painel-permissoes">
      <header><h3>Permissões e prévia</h3><button type="button" aria-label="Fechar painel" onClick={aoFechar}><span aria-hidden="true">×</span> Fechar</button></header>
      <label className="painel-permissoes-mapa__previa">
        Ver mapa como
        <select value={previsualizacao} onChange={(e) => aoPrevisualizar(e.target.value)}>
          <option value="">Mestre</option>
          {fichas.map((ficha) => <option value={ficha.jogador || ficha.id} key={ficha.id}>{ficha.nome || "Jogador sem nome"}</option>)}
        </select>
      </label>
      <p className="painel-mapa__token-ajuda">O mestre sempre controla tudo. Jogadores veem tokens não ocultos e movem apenas os próprios ou os que receberam permissão para controlar.</p>
      <div className="painel-permissoes-mapa__lista">
        {tokens.length === 0 ? <p>Adicione tokens para configurar o acesso.</p> : tokens.map((token) => (
          <article key={token.id}>
            <header><strong>{token.nome || fichas.find((f) => f.id === token.fichaId)?.nome || "Token"}</strong><small>{token.tipo === "npc" ? "NPC" : "Personagem"}</small></header>
            <label>Responsável
              <select value={token.proprietario || "mestre"} onChange={(e) => aoAlterarToken(token.id, { proprietario: e.target.value })}>
                <option value="mestre">Somente mestre</option>
                {fichas.map((ficha) => <option value={ficha.jogador || ficha.id} key={ficha.id}>{ficha.nome || "Jogador"}</option>)}
              </select>
            </label>
            <label><input type="checkbox" checked={token.permissoes?.jogadores === true} onChange={(e) => aoAlterarToken(token.id, { permissoes: { ...token.permissoes, jogadores: e.target.checked } })} /> Permitir controle de jogadores</label>
            <label><input type="checkbox" checked={token.bloqueado} onChange={(e) => aoAlterarToken(token.id, { bloqueado: e.target.checked })} /> Bloquear movimento</label>
            <label><input type="checkbox" checked={token.oculto} onChange={(e) => aoAlterarToken(token.id, { oculto: e.target.checked })} /> Ocultar dos jogadores</label>
            <details>
              <summary>Compartilhar controle</summary>
              {fichas.map((ficha) => {
                const id = String(ficha.jogador || ficha.id);
                const atuais = Array.isArray(token.permissoes?.controladores) ? token.permissoes.controladores.map(String) : [];
                return <label key={ficha.id}><input type="checkbox" checked={atuais.includes(id)} onChange={(e) => aoAlterarToken(token.id, { permissoes: { ...token.permissoes, controladores: e.target.checked ? [...atuais, id] : atuais.filter((item) => item !== id) } })} /> {ficha.nome || "Jogador"}</label>;
              })}
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PainelPermissoesMapa;
