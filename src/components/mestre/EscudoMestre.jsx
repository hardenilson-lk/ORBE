import { useState } from "react";
import MiniFichaToken from "./mapa/MiniFichaToken.jsx";

import "./EscudoMestre.css";

const RECURSOS_ESCUDO = [
  { id: "pv", sigla: "PV", atual: "pvAtual", maximo: "pvMaximo", reduzir: "Aplicar dano", recuperar: "Aplicar cura" },
  { id: "pe", sigla: "PE", atual: "peAtual", maximo: "peMaximo", reduzir: "Gastar PE", recuperar: "Recuperar PE" },
  { id: "san", sigla: "SAN", atual: "sanAtual", maximo: "sanMaximo", reduzir: "Perder SAN", recuperar: "Recuperar SAN" },
];

function limitar(valor, minimo, maximo) {
  return Math.min(maximo, Math.max(minimo, Number(valor) || 0));
}

function obterIniciais(nome = "") {
  const partes = String(nome).trim().split(/\s+/).filter(Boolean);
  return (partes.length > 1 ? `${partes[0][0]}${partes.at(-1)[0]}` : partes[0]?.slice(0, 2) || "ARQ").toUpperCase();
}

function normalizarIdentidade(valor = "") {
  return String(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

function BarraRecurso({ recurso, entidade }) {
  const atual = Math.max(0, Number(entidade[recurso.atual]) || 0);
  const maximo = Math.max(1, Number(entidade[recurso.maximo]) || 1);
  const percentual = limitar((atual / maximo) * 100, 0, 100);

  return (
    <div className={`escudo-mestre__barra escudo-mestre__barra--${recurso.id}`}>
      <span><strong>{recurso.sigla}</strong><b>{atual} / {maximo}</b></span>
      <i aria-hidden="true"><b style={{ width: `${percentual}%` }} /></i>
    </div>
  );
}

function AjusteRecurso({ recurso, entidade, aoAjustar }) {
  const [quantidade, setQuantidade] = useState("");

  function aplicar(direcao) {
    const valor = Math.max(0, Math.floor(Number(quantidade) || 0));
    if (!valor) return;
    aoAjustar(recurso, direcao === "recuperar" ? valor : -valor);
    setQuantidade("");
  }

  return (
    <div className={`escudo-mestre__ajuste escudo-mestre__ajuste--${recurso.id}`}>
      <label>
        <span>{recurso.sigla}</span>
        <input
          type="number"
          min="0"
          step="1"
          aria-label={`Quantidade de ${recurso.sigla} para ${entidade.nome || "personagem"}`}
          placeholder="Valor"
          value={quantidade}
          onChange={(evento) => setQuantidade(evento.target.value)}
        />
      </label>
      <button type="button" onClick={() => aplicar("reduzir")}>{recurso.reduzir}</button>
      <button type="button" onClick={() => aplicar("recuperar")}>{recurso.recuperar}</button>
    </div>
  );
}

function MiniFichaEscudo({ entidade, tipo = "jogador", token, aoAtualizar, aoAbrirFicha, aoAbrirInventario, aoAbrirNpcs }) {
  function ajustarRecurso(recurso, alteracao) {
    const maximo = Math.max(0, Number(entidade[recurso.maximo]) || 0);
    const atual = Math.max(0, Number(entidade[recurso.atual]) || 0);
    aoAtualizar?.({ [recurso.atual]: limitar(atual + alteracao, 0, maximo) });
  }

  return (
    <article className={`escudo-mestre__ficha escudo-mestre__ficha--${tipo}`}>
      <header className="escudo-mestre__ficha-cabecalho">
        <div className="escudo-mestre__retrato">
          {entidade.foto ? <img src={entidade.foto} alt="" draggable="false" /> : <span>{obterIniciais(entidade.nome)}</span>}
        </div>
        <div>
          <small>{tipo === "npc" ? "NPC da cena" : entidade.jogador || "Ficha da campanha"}</small>
          <h4>{entidade.nome || (tipo === "npc" ? "NPC sem nome" : "Agente sem nome")}</h4>
          <p>
            {tipo === "npc"
              ? `${entidade.tipo || "Ameaça"} · Defesa ${entidade.defesa ?? 10}`
              : `${entidade.classe || "Sem classe"} · ${entidade.trilha || "Sem trilha"} · NEX ${entidade.nex || "5%"}`}
          </p>
        </div>
        <span className={token ? "escudo-mestre__token-status escudo-mestre__token-status--ativo" : "escudo-mestre__token-status"}>
          {token ? "No mapa" : "Sem token"}
        </span>
      </header>

      <div className="escudo-mestre__barras">
        {RECURSOS_ESCUDO.map((recurso) => <BarraRecurso recurso={recurso} entidade={entidade} key={recurso.id} />)}
      </div>

      <details className="escudo-mestre__ajustes">
        <summary>Ajuste rápido de recursos</summary>
        <div>
          {RECURSOS_ESCUDO.map((recurso) => (
            <AjusteRecurso recurso={recurso} entidade={entidade} aoAjustar={ajustarRecurso} key={recurso.id} />
          ))}
        </div>
      </details>

      <footer className="escudo-mestre__atalhos">
        {tipo === "jogador" ? (
          <>
            <button type="button" onClick={aoAbrirFicha}>Abrir ficha</button>
            <button type="button" onClick={aoAbrirInventario}>Inventário</button>
          </>
        ) : (
          <button type="button" onClick={aoAbrirNpcs}>Abrir gerenciador de NPCs</button>
        )}
      </footer>
    </article>
  );
}

function JogadorSemFicha({ jogador, aoCriarFicha }) {
  const nome = jogador?.nome || "Jogador";
  return (
    <article className="escudo-mestre__ficha escudo-mestre__ficha--sem-ficha">
      <header className="escudo-mestre__ficha-cabecalho">
        <div className="escudo-mestre__retrato"><span>{obterIniciais(nome)}</span></div>
        <div>
          <small>Jogador da campanha</small>
          <h4>{nome}</h4>
          <p>{jogador?.personagem || "Nenhuma ficha vinculada"}</p>
        </div>
        <span className="escudo-mestre__token-status">Sem ficha</span>
      </header>
      <div className="escudo-mestre__ficha-pendente">
        <p>Crie uma ficha para representar este jogador no arquivo.</p>
        <button type="button" onClick={() => aoCriarFicha?.(jogador)}>Criar ficha</button>
      </div>
    </article>
  );
}

function EscudoMestre({
  aberto = true,
  jogadoresVisiveis = true,
  anotacoes = "",
  jogadores = [],
  fichas = [],
  mapa = {},
  arquivoAtual = "ARQUIVO 0001",
  aoAlternarEscudo,
  aoAlternarVisibilidade,
  aoAlterarAnotacoes,
  aoAtualizarFicha,
  aoAtualizarMapa,
  aoCriarFicha,
  aoAbrirFicha,
  aoAbrirInventario,
  miniFichaAberta,
  aoFecharMiniFicha,
}) {
  const jogadoresOnline = jogadores.filter((jogador) => jogador?.online !== false).length;
  const tokens = Array.isArray(mapa?.tokens) ? mapa.tokens : [];
  const npcs = Array.isArray(mapa?.npcs) ? mapa.npcs : [];
  const tokensOcultos = tokens.filter((token) => (token?.modoVisibilidade || (token?.oculto === false ? "visivel" : "oculto")) === "oculto").length;
  const tokensProximidade = tokens.filter((token) => token?.modoVisibilidade === "proximidade").length;
  const representacoesJogadores = [];
  const fichasUsadas = new Set();
  const identidadesJogadores = new Set();
  const entidadeMiniFicha = miniFichaAberta?.tipo === "npc"
    ? npcs.find((npc) => npc.id === miniFichaAberta.id) || null
    : fichas.find((ficha) => ficha.id === miniFichaAberta?.id) || null;

  if (jogadores.length) {
    jogadores.forEach((jogador) => {
      const chaves = [jogador?.id, jogador?.nome].map(normalizarIdentidade).filter(Boolean);
      chaves.forEach((chave) => identidadesJogadores.add(chave));
      const personagem = normalizarIdentidade(jogador?.personagem);
      const ficha = fichas.find((item) => {
        if (fichasUsadas.has(item.id)) return false;
        const dono = normalizarIdentidade(item.jogadorId || item.jogador);
        return chaves.includes(dono) || (personagem && normalizarIdentidade(item.nome) === personagem) || item.id === jogador?.fichaId;
      }) || null;
      if (ficha) fichasUsadas.add(ficha.id);
      representacoesJogadores.push({ jogador, ficha, chave: jogador?.id || jogador?.nome });
    });
    fichas.forEach((ficha) => {
      if (fichasUsadas.has(ficha.id) || identidadesJogadores.has(normalizarIdentidade(ficha.jogadorId || ficha.jogador))) return;
      fichasUsadas.add(ficha.id);
      representacoesJogadores.push({ jogador: null, ficha, chave: ficha.id });
    });
  } else {
    const donosExibidos = new Set();
    fichas.forEach((ficha) => {
      const dono = normalizarIdentidade(ficha.jogadorId || ficha.jogador) || ficha.id;
      if (donosExibidos.has(dono)) return;
      donosExibidos.add(dono);
      representacoesJogadores.push({ jogador: null, ficha, chave: ficha.id });
    });
  }

  function atualizarNpc(npcId, alteracoes) {
    aoAtualizarMapa?.({
      ...mapa,
      npcs: npcs.map((npc) => npc.id === npcId ? { ...npc, ...alteracoes } : npc),
    });
  }

  function abrirGerenciadorNpcs() {
    window.dispatchEvent(new CustomEvent("escudo:abrir-ferramenta-mapa", { detail: { painel: "npc" } }));
  }

  return (
    <section className={aberto ? "escudo-mestre" : "escudo-mestre escudo-mestre--fechado"}>
      <header className="escudo-mestre__cabecalho">
        <div className="escudo-mestre__selo" aria-hidden="true"><span>ARQ</span></div>
        <div className="escudo-mestre__titulo">
          <span>Área reservada · comando da sessão</span>
          <h2>Escudo do Mestre</h2>
          <p>{arquivoAtual}</p>
        </div>
        <div className="escudo-mestre__estado">
          <i className={jogadoresVisiveis ? "escudo-mestre__estado-luz" : "escudo-mestre__estado-luz escudo-mestre__estado-luz--oculta"} />
          <span>{jogadoresVisiveis ? "Mesa visível" : "Mesa oculta"}</span>
        </div>
        <button className="escudo-mestre__criar-ficha" type="button" onClick={() => aoCriarFicha?.()}>Criar ficha</button>
        <button className="escudo-mestre__alternar" type="button" aria-expanded={aberto} onClick={aoAlternarEscudo}>
          <span aria-hidden="true">{aberto ? "⌄" : "⌃"}</span>
          {aberto ? "Recolher" : "Abrir escudo"}
        </button>
      </header>

      {aberto ? (
        <div className="escudo-mestre__conteudo">
          <section className="escudo-mestre__resumo" aria-label="Resumo da mesa">
            <article><span>Jogadores</span><strong>{jogadoresOnline}/{jogadores.length}</strong><small>conectados</small></article>
            <article><span>Fichas</span><strong>{fichas.length}</strong><small>na campanha</small></article>
            <article><span>NPCs</span><strong>{npcs.length}</strong><small>na cena</small></article>
            <article><span>Tokens</span><strong>{tokens.length}</strong><small>{tokensOcultos} ocultos · {tokensProximidade} por proximidade</small></article>
          </section>

          {entidadeMiniFicha ? (
            <section className="escudo-mestre__mini-ficha-area" aria-label="Mini ficha selecionada no mapa">
              <header>
                <div><span>Token selecionado</span><h3>Ficha rápida no escudo</h3></div>
                <small>Duplo clique no token abre esta área</small>
              </header>
              <MiniFichaToken
                ficha={entidadeMiniFicha}
                tipo={miniFichaAberta.tipo}
                embutida
                aoAlterar={(alteracoes) => {
                  if (miniFichaAberta.tipo === "npc") atualizarNpc(entidadeMiniFicha.id, alteracoes);
                  else aoAtualizarFicha?.({ ...entidadeMiniFicha, ...alteracoes });
                }}
                aoFechar={aoFecharMiniFicha}
              />
            </section>
          ) : null}

          <section className="escudo-mestre__arquivo">
            <header>
              <div><span>Controle rápido</span><h3>Agentes no arquivo</h3></div>
              <small>{representacoesJogadores.length} {representacoesJogadores.length === 1 ? "jogador representado" : "jogadores representados"}</small>
            </header>
            <div className="escudo-mestre__grade-fichas">
              {representacoesJogadores.length ? representacoesJogadores.map(({ jogador, ficha, chave }) => ficha ? (
                  <MiniFichaEscudo
                    entidade={{ ...ficha, jogador: jogador?.nome || ficha.jogador }}
                    token={tokens.find((token) => token.fichaId === ficha.id)}
                    aoAtualizar={(alteracoes) => aoAtualizarFicha?.({ ...ficha, ...alteracoes })}
                    aoAbrirFicha={() => aoAbrirFicha?.(ficha.id)}
                    aoAbrirInventario={() => aoAbrirInventario?.(ficha.id)}
                    key={chave}
                  />
                ) : <JogadorSemFicha jogador={jogador} aoCriarFicha={aoCriarFicha} key={chave} />
              ) : <p className="escudo-mestre__vazio">Nenhum jogador ou ficha vinculado. Use “Criar ficha” para preparar o primeiro agente.</p>}
            </div>
          </section>

          <section className="escudo-mestre__arquivo escudo-mestre__arquivo--npcs">
            <header>
              <div><span>Arquivo de ameaças</span><h3>NPCs da cena</h3></div>
              <button type="button" onClick={abrirGerenciadorNpcs}>Gerenciar NPCs</button>
            </header>
            <div className="escudo-mestre__grade-fichas">
              {npcs.length ? npcs.map((npc) => (
                <MiniFichaEscudo
                  entidade={npc}
                  tipo="npc"
                  token={tokens.find((token) => token.npcId === npc.id)}
                  aoAtualizar={(alteracoes) => atualizarNpc(npc.id, alteracoes)}
                  aoAbrirNpcs={abrirGerenciadorNpcs}
                  key={npc.id}
                />
              )) : <p className="escudo-mestre__vazio">Nenhum NPC criado nesta cena. Use o gerenciador para preparar ameaças rápidas.</p>}
            </div>
          </section>

          <div className="escudo-mestre__corpo">
            <label className="escudo-mestre__anotacoes">
              <span><strong>Anotações privadas</strong><small>{anotacoes.length}/1500</small></span>
              <textarea rows="8" maxLength={1500} placeholder="Pistas, segredos, PV de ameaças e lembretes que somente o mestre pode ver..." value={anotacoes} onChange={(evento) => aoAlterarAnotacoes?.(evento.target.value)} />
              <em>Este conteúdo nunca é exibido aos jogadores.</em>
            </label>

            <aside className="escudo-mestre__comandos">
              <header><span>Controle da transmissão</span><strong>Visão dos jogadores</strong></header>
              <div className={jogadoresVisiveis ? "escudo-mestre__visibilidade" : "escudo-mestre__visibilidade escudo-mestre__visibilidade--oculta"}>
                <span aria-hidden="true">{jogadoresVisiveis ? "◉" : "⊘"}</span>
                <div><strong>{jogadoresVisiveis ? "Cena liberada" : "Cena protegida"}</strong><small>{jogadoresVisiveis ? "Os jogadores podem acompanhar a mesa." : "A tela dos jogadores está temporariamente oculta."}</small></div>
              </div>
              <button className={jogadoresVisiveis ? "escudo-mestre__botao-perigo" : "escudo-mestre__botao-seguro"} type="button" onClick={() => aoAlternarVisibilidade?.(!jogadoresVisiveis)}>
                {jogadoresVisiveis ? "Ocultar mesa dos jogadores" : "Revelar mesa aos jogadores"}
              </button>
              <p><span>◆</span> Proteja a transmissão antes de preparar encontros, mapas secretos ou revelações.</p>
            </aside>
          </div>
        </div>
      ) : (
        <p className="escudo-mestre__fechado"><span>◆</span> Conteúdo privado recolhido. A sessão continua sendo salva automaticamente.</p>
      )}
    </section>
  );
}

export default EscudoMestre;
