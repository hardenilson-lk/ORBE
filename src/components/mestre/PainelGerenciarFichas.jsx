import { useState } from "react";

import "./PainelFichas.css";

function PainelGerenciarFichas({
  fichas = [],
  jogadores = [],
  jogadorInicialId = "",
  fichaSelecionada = null,
  aoCriarFicha,
  aoAbrirFicha,
  aoAlternarPermissao,
  aoRemoverFicha,
}) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Personagem da sessão");
  const [jogadorId, setJogadorId] = useState(jogadorInicialId || "");
  const [permissao, setPermissao] = useState("bloqueada");

  function criarFicha(evento) {
    evento.preventDefault();
    const jogadorDiretoId = evento.nativeEvent?.submitter?.name === "jogadorDireto"
      ? evento.nativeEvent.submitter.value
      : "";
    const jogadorFinalId = jogadorDiretoId || jogadorId;
    const jogador = jogadores.find((item) => item.id === jogadorFinalId) || null;
    const nomeFinal = nome.trim() || jogador?.personagem || (jogador ? `Agente de ${jogador.nome || "jogador"}` : "");
    if (!nomeFinal) return;
    aoCriarFicha?.({
      nome: nomeFinal,
      tipo,
      jogadorId: jogadorFinalId,
      jogador: jogador?.nome || "",
      permissao,
    });
    setNome("");
  }

  return (
    <section className="painel-fichas painel-gerenciar-fichas">
      <header className="painel-fichas__cabecalho">
        <div><span>Departamento de agentes</span><h2>Gerenciar fichas</h2></div>
        <small>O mestre cria, atribui e controla a edição da mesma ficha usada pelo jogador.</small>
      </header>

      <form id="form-criar-ficha-sessao" className="painel-gerenciar-fichas__form" onSubmit={criarFicha}>
        <div className="painel-gerenciar-fichas__titulo"><span>Campanha atual</span><h3>Criar ficha da sessão</h3></div>
        <label>Nome da ficha<input required maxLength="60" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Novo agente da sessão" /></label>
        <label>Tipo<select value={tipo} onChange={(e) => setTipo(e.target.value)}><option>Personagem da sessão</option><option>Aliado</option><option>Temporário</option></select></label>
        <label>Jogador responsável<select value={jogadorId} onChange={(e) => setJogadorId(e.target.value)}><option value="">Sem jogador vinculado</option>{jogadores.map((jogador) => <option value={jogador.id} key={jogador.id}>{jogador.nome || jogador.personagem || "Jogador"}{jogador.online === false ? " · offline" : " · conectado"}</option>)}</select></label>
        <label>Permissão inicial<select value={permissao} onChange={(e) => setPermissao(e.target.value)}><option value="bloqueada">Bloqueada para jogador</option><option value="liberada">Liberada para jogador responsável</option></select></label>
        <button type="submit">Criar e vincular ficha</button>
      </form>

      <section className="painel-fichas__mesa">
        <header className="painel-gerenciar-fichas__subtitulo"><div><span>Jogadores da mesa</span><h3>Participantes e vínculos</h3></div><small>{jogadores.length} participante(s)</small></header>
        {jogadores.length ? <div className="painel-gerenciar-fichas__jogadores">{jogadores.map((jogador) => {
          const vinculadas = fichas.filter((ficha) => ficha.jogadorId === jogador.id || ficha.id === jogador.fichaId);
          return <article key={jogador.id}><div><strong>{jogador.nome || "Jogador"}</strong><span>{jogador.online === false ? "Offline" : "Conectado"}</span><small>{vinculadas.length ? `${vinculadas.length} ficha(s) vinculada(s)` : "Sem ficha vinculada"}</small></div><button type="submit" form="form-criar-ficha-sessao" name="jogadorDireto" value={jogador.id}>Criar ficha</button></article>;
        })}</div> : <p className="painel-fichas__vazio">Nenhum jogador entrou nesta mesa. Assim que alguém entrar pelo convite, aparecerá aqui.</p>}
      </section>

      <section className="painel-fichas__mesa">
        <header className="painel-gerenciar-fichas__subtitulo"><div><span>Arquivo compartilhado</span><h3>Fichas da sessão</h3></div><small>{fichas.length} ficha(s)</small></header>
        {fichas.length === 0 ? <p className="painel-fichas__vazio">Nenhuma ficha vinculada à campanha.</p> : <div className="painel-fichas__lista">{fichas.map((ficha) => {
          const estaSelecionada = fichaSelecionada?.id === ficha.id;
          return <article className="painel-fichas__item" key={ficha.id}><button className={estaSelecionada ? "painel-fichas__cartao painel-fichas__cartao--ativo" : "painel-fichas__cartao"} type="button" onClick={() => aoAbrirFicha?.(ficha)}><strong>{ficha.nome || "Agente sem nome"}</strong><span>{ficha.classe || "Classe não definida"} · {ficha.fichaCategoria || "Personagem"}</span><small>{ficha.jogador || "Sem responsável"} · {ficha.editLocked ? "Edição bloqueada" : "Edição liberada"}</small></button><button className="painel-gerenciar-fichas__permissao" type="button" onClick={() => aoAlternarPermissao?.(ficha)}>{ficha.editLocked ? "Liberar" : "Bloquear"}</button><button className="painel-fichas__remover" type="button" onClick={() => aoRemoverFicha?.(ficha)}>Excluir</button></article>;
        })}</div>}
      </section>
    </section>
  );
}

export default PainelGerenciarFichas;
