import "./PaineisJogador.css";

function ListaVazia({ titulo, texto }) {
  return (
    <div className="painel-jogador__vazio">
      <span aria-hidden="true">◇</span>
      <strong>{titulo}</strong>
      <p>{texto}</p>
    </div>
  );
}

function PainelAnotacoes({ ficha, aoSalvar }) {
  return (
    <section className="painel-jogador">
      <header className="painel-jogador__cabecalho">
        <div><span>Arquivo pessoal</span><h2>Anotações do agente</h2><p>Registre pistas, suspeitas e detalhes importantes da investigação.</p></div>
        <div className="painel-jogador__selo">Privado</div>
      </header>
      <div className="painel-jogador__papel">
        <label htmlFor="anotacoes-jogador">Caderno de campo</label>
        <textarea
          id="anotacoes-jogador"
          rows="20"
          value={ficha?.anotacoes || ""}
          placeholder="Escreva suas pistas, teorias, nomes e lembretes..."
          onChange={(evento) => aoSalvar({ ...ficha, anotacoes: evento.target.value })}
        />
        <small>As alterações são salvas automaticamente na sua ficha.</small>
      </div>
    </section>
  );
}

function PainelMissoes({ missoes }) {
  const visiveis = missoes.filter((missao) => missao?.privada !== true);

  return (
    <section className="painel-jogador">
      <header className="painel-jogador__cabecalho">
        <div><span>Diretivas da operação</span><h2>Missões</h2><p>Objetivos e informações liberadas pelo mestre.</p></div>
        <div className="painel-jogador__contador"><strong>{visiveis.filter((item) => item.status === "ativa").length}</strong><span>ativas</span></div>
      </header>
      {visiveis.length === 0 ? (
        <ListaVazia titulo="Nenhuma missão recebida" texto="Quando o mestre liberar um objetivo, ele aparecerá neste quadro." />
      ) : (
        <div className="painel-jogador__grade">
          {visiveis.map((missao) => (
            <article className={`missao-jogador missao-jogador--${missao.status || "pendente"}`} key={missao.id}>
              <header><span>{missao.prioridade || "normal"}</span><i>{missao.status || "pendente"}</i></header>
              <h3>{missao.titulo || "Missão sem título"}</h3>
              <p>{missao.descricao || "Nenhuma orientação adicional foi fornecida."}</p>
              {missao.local ? <dl><dt>Local</dt><dd>{missao.local}</dd></dl> : null}
              {Array.isArray(missao.pistas) && missao.pistas.length ? (
                <div className="missao-jogador__pistas"><strong>Pistas conhecidas</strong><ul>{missao.pistas.map((pista) => <li key={pista}>{pista}</li>)}</ul></div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function PainelArquivos({ arquivos }) {
  const liberados = arquivos.filter((arquivo) => arquivo?.visivelJogadores === true || arquivo?.visibleToPlayers === true);

  return (
    <section className="painel-jogador">
      <header className="painel-jogador__cabecalho">
        <div><span>Documentos autorizados</span><h2>Arquivos da campanha</h2><p>Relatórios, evidências e registros revelados à equipe.</p></div>
        <div className="painel-jogador__contador"><strong>{liberados.length}</strong><span>liberados</span></div>
      </header>
      {liberados.length === 0 ? (
        <ListaVazia titulo="Acesso ainda restrito" texto="Não há documentos liberados para o seu nível de acesso." />
      ) : (
        <div className="painel-jogador__arquivos">
          {liberados.map((arquivo) => (
            <details key={arquivo.id}>
              <summary>
                <span>{arquivo.codigo || "ARQUIVO"}</span>
                <div><strong>{arquivo.titulo || "Documento sem título"}</strong><small>{arquivo.data || arquivo.criadoEm || "Data não informada"}</small></div>
                <i>{arquivo.status || "aberto"}</i>
              </summary>
              <div className="painel-jogador__documento">
                {arquivo.textoJogadores || arquivo.publicText ? <p className="painel-jogador__destaque">{arquivo.textoJogadores || arquivo.publicText}</p> : null}
                {arquivo.resumo ? <section><h4>Resumo</h4><p>{arquivo.resumo}</p></section> : null}
                {arquivo.missao ? <section><h4>Objetivo</h4><p>{arquivo.missao}</p></section> : null}
                {arquivo.pistas ? <section><h4>Pistas reveladas</h4><p className="painel-jogador__pre">{Array.isArray(arquivo.pistas) ? arquivo.pistas.join("\n") : arquivo.pistas}</p></section> : null}
                {arquivo.acontecimentos ? <section><h4>Acontecimentos</h4><p>{arquivo.acontecimentos}</p></section> : null}
                {arquivo.personagens ? <section><h4>Envolvidos</h4><p>{arquivo.personagens}</p></section> : null}
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

function PaineisJogador({ tipo, ficha, missoes = [], arquivos = [], aoSalvarFicha }) {
  if (tipo === "anotacoes") return <PainelAnotacoes ficha={ficha} aoSalvar={aoSalvarFicha} />;
  if (tipo === "missoes") return <PainelMissoes missoes={missoes} />;
  return <PainelArquivos arquivos={arquivos} />;
}

export default PaineisJogador;
