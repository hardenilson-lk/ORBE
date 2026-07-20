import { useEffect, useState } from "react";

import "./PaineisDossie.css";

const MISSAO_VAZIA = { titulo: "", descricao: "", status: "ativa", prioridade: "normal", privada: false };

const MODELOS_MISSAO = [
  {
    categoria: "investigacao",
    titulo: "Ecos no necrotério",
    objetivo: "Investigue registros de corpos que continuaram emitindo sons após a declaração de óbito.",
    local: "Instituto médico-legal interditado",
    pistas: ["O técnico legista desapareceu", "A câmera do corredor apagou às 03:17", "Um símbolo foi riscado sob a mesa fria"],
    ameaca: "Cadáver reanimado por uma manifestação de Energia",
    consequencia: "A manifestação aprende a voz de quem permanecer sozinho.",
  },
  {
    categoria: "terror",
    titulo: "A casa sem reflexo",
    objetivo: "Entre em uma residência onde os espelhos mostram pessoas que não estão mais vivas.",
    local: "Residência isolada no fim da rua",
    pistas: ["Passos são ouvidos dentro das paredes", "Todos os espelhos foram cobertos com jornal", "Uma chave foi encontrada dentro de um copo d'água"],
    ameaca: "Reflexo hostil que imita um dos agentes",
    consequencia: "Cada espelho quebrado apaga uma lembrança real.",
  },
  {
    categoria: "investigacao",
    titulo: "Sinal de emergência",
    objetivo: "Rastreie uma transmissão de rádio que repete os nomes dos investigadores antes da chegada deles.",
    local: "Estação repetidora abandonada",
    pistas: ["Há uma antena improvisada no telhado", "A mensagem repete a cada sete minutos", "Um aparelho esquenta quando alguém mente"],
    ameaca: "Operador desaparecido preso à frequência",
    consequencia: "Responder à transmissão revela a posição da equipe.",
  },
  {
    categoria: "combate",
    titulo: "O comboio vazio",
    objetivo: "Recupere uma carga confidencial de um comboio encontrado sem tripulação no meio da estrada.",
    local: "Trecho interditado de uma rodovia rural",
    pistas: ["Os motores ainda estão quentes", "Marcas de arrasto terminam no acostamento", "A carga registra movimento interno"],
    ameaca: "Criatura escondida entre os contêineres",
    consequencia: "A carga se rompe se o confronto durar demais.",
  },
  {
    categoria: "terror",
    titulo: "A última chamada",
    objetivo: "Descubra por que moradores recebem ligações de seus próprios números minutos antes de desaparecerem.",
    local: "Central telefônica desativada",
    pistas: ["As chamadas partem de uma linha removida", "Uma voz enumera nomes em ordem", "Cabos novos atravessam o subsolo"],
    ameaca: "Entidade que caça pela voz",
    consequencia: "Atender à chamada marca o próximo desaparecimento.",
  },
  {
    categoria: "combate",
    titulo: "Protocolo quebrado",
    objetivo: "Contenha uma equipe de agentes que retornou de missão sem reconhecer o próprio comandante.",
    local: "Posto avançado da Ordem",
    pistas: ["Os relatórios foram reescritos à mão", "As câmeras mostram duas versões da equipe", "O arsenal foi aberto por dentro"],
    ameaca: "Agentes duplicados e uma presença infiltrada",
    consequencia: "Atacar a cópia errada fortalece a entidade.",
  },
];

function criarId(prefixo) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function dataLocal(data = new Date()) {
  const ajustada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
  return ajustada.toISOString().slice(0, 10);
}

function PainelMissoes({ missoes = [], arquivos = [], aoAdicionarMissao, aoAtualizarMissao, aoRemoverMissao, aoAdicionarArquivo }) {
  const [novaMissao, setNovaMissao] = useState(MISSAO_VAZIA);
  const [missoesLocais, setMissoesLocais] = useState(missoes);
  const [categoriaGerador, setCategoriaGerador] = useState("qualquer");

  useEffect(() => setMissoesLocais(Array.isArray(missoes) ? missoes : []), [missoes]);

  function registrarMissao(missao) {
    setMissoesLocais((lista) => [missao, ...lista]);
    aoAdicionarMissao?.(missao);
  }

  function adicionarMissao(evento) {
    evento.preventDefault();
    if (!novaMissao.titulo.trim()) return;
    registrarMissao({
      ...novaMissao,
      id: criarId("missao"),
      titulo: novaMissao.titulo.trim(),
      descricao: novaMissao.descricao.trim(),
      criadaEm: new Date().toLocaleString("pt-BR"),
      origem: "manual",
    });
    setNovaMissao(MISSAO_VAZIA);
  }

  function gerarArquivoMissao() {
    const candidatos = categoriaGerador === "qualquer" ? MODELOS_MISSAO : MODELOS_MISSAO.filter((modelo) => modelo.categoria === categoriaGerador);
    const modelo = candidatos[Math.floor(Math.random() * candidatos.length)];
    const idMissao = criarId("missao-gerada");
    const criadaEm = new Date();
    const missao = {
      id: idMissao,
      titulo: modelo.titulo,
      descricao: modelo.objetivo,
      status: "ativa",
      prioridade: modelo.categoria === "combate" ? "alta" : "normal",
      privada: false,
      categoria: modelo.categoria,
      local: modelo.local,
      pistas: modelo.pistas,
      ameaca: modelo.ameaca,
      consequencia: modelo.consequencia,
      observacoesMestre: "Use luz baixa, pistas incompletas e uma consequência clara para falhas críticas.",
      textoJogadores: modelo.objetivo,
      criadaEm: criadaEm.toLocaleString("pt-BR"),
      origem: "gerador",
    };
    registrarMissao(missao);

    const maiorNumero = (Array.isArray(arquivos) ? arquivos : []).reduce((maior, arquivo) => Math.max(maior, Number(String(arquivo.codigo || "").match(/\d+/)?.[0]) || 0), 0);
    const numero = String(maiorNumero + 1).padStart(4, "0");
    aoAdicionarArquivo?.({
      id: criarId("arquivo-missao"),
      codigo: `ARQUIVO ${numero}`,
      titulo: modelo.titulo,
      data: dataLocal(criadaEm),
      status: "aberto",
      resumo: modelo.objetivo,
      missao: modelo.objetivo,
      pistas: modelo.pistas.join("\n"),
      personagens: modelo.ameaca,
      observacoes: `${missao.observacoesMestre}\nConsequência: ${modelo.consequencia}`,
      textoJogadores: modelo.objetivo,
      visivelJogadores: false,
      visibleToPlayers: false,
      missaoId: idMissao,
      criadoEm: criadaEm.toLocaleString("pt-BR"),
    });
  }

  function alterarMissao(missao, nomeCampo, valor) {
    const atualizada = { ...missao, [nomeCampo]: valor };
    setMissoesLocais((lista) => lista.map((item) => item.id === missao.id ? atualizada : item));
    aoAtualizarMissao?.(atualizada);
  }

  function removerMissao(missao) {
    setMissoesLocais((lista) => lista.filter((item) => item.id !== missao.id));
    aoRemoverMissao?.(missao);
  }

  const missoesAtivas = missoesLocais.filter((missao) => missao.status === "ativa").length;

  return (
    <section className="painel-dossie painel-missoes-configurado">
      <header className="painel-dossie__cabecalho">
        <div><span>Objetivos da campanha</span><h2>Missões</h2><p>Prepare objetivos, pistas e ameaças para cada investigação.</p></div>
        <div className="painel-dossie__resumo"><span>Missões ativas</span><strong>{missoesAtivas}</strong></div>
      </header>

      <section className="gerador-missao" aria-labelledby="gerador-missao-titulo">
        <div>
          <span>Ferramenta do mestre</span>
          <h3 id="gerador-missao-titulo">Gerador de missão</h3>
          <p>Cria um objetivo completo e abre automaticamente um arquivo restrito com pistas, ameaça e notas do mestre.</p>
        </div>
        <label>Tipo de operação<select value={categoriaGerador} onChange={(evento) => setCategoriaGerador(evento.target.value)}>
          <option value="qualquer">Surpresa</option><option value="investigacao">Investigação</option><option value="terror">Terror</option><option value="combate">Confronto</option>
        </select></label>
        <button type="button" onClick={gerarArquivoMissao}>Gerar arquivo de missão</button>
      </section>

      <form className="painel-dossie__formulario" onSubmit={adicionarMissao}>
        <h3>Nova missão manual</h3>
        <div className="painel-dossie__campos">
          <label>Título<input maxLength="80" placeholder="Ex.: Investigar a cripta" value={novaMissao.titulo} onChange={(e) => setNovaMissao((anterior) => ({ ...anterior, titulo: e.target.value }))} /></label>
          <label>Status<select value={novaMissao.status} onChange={(e) => setNovaMissao((anterior) => ({ ...anterior, status: e.target.value }))}><option value="ativa">Ativa</option><option value="pendente">Pendente</option><option value="concluida">Concluída</option><option value="falhou">Falhou</option></select></label>
          <label>Prioridade<select value={novaMissao.prioridade} onChange={(e) => setNovaMissao((anterior) => ({ ...anterior, prioridade: e.target.value }))}><option value="baixa">Baixa</option><option value="normal">Normal</option><option value="alta">Alta</option><option value="critica">Crítica</option></select></label>
        </div>
        <label className="painel-dossie__campo-grande">Descrição<textarea rows="4" maxLength="1000" placeholder="Objetivo e informações conhecidas..." value={novaMissao.descricao} onChange={(e) => setNovaMissao((anterior) => ({ ...anterior, descricao: e.target.value }))} /></label>
        <label className="missoes-arquivos__privada"><input type="checkbox" checked={novaMissao.privada} onChange={(e) => setNovaMissao((anterior) => ({ ...anterior, privada: e.target.checked }))} /> Somente o mestre pode ver</label>
        <button className="painel-dossie__botao-principal" type="submit">Adicionar missão</button>
      </form>

      <section className="painel-dossie__conteudo">
        <h3>Quadro de missões</h3>
        {missoesLocais.length === 0 ? <p className="painel-dossie__vazio">Nenhuma missão registrada nesta campanha.</p> : (
          <div className="missoes-arquivos">
            {missoesLocais.map((missao) => <article className={`missoes-arquivos__item missoes-arquivos__item--${missao.status}`} key={missao.id}>
              <header><div><span>{missao.prioridade} · {missao.origem === "gerador" ? "gerada" : "manual"}</span><h4>{missao.titulo}</h4><small>{missao.criadaEm}</small></div><button type="button" onClick={() => removerMissao(missao)}>Remover</button></header>
              <p>{missao.descricao || "Nenhuma descrição informada."}</p>
              {(missao.local || missao.ameaca || missao.consequencia) ? <dl className="missao-dossie__dados">
                {missao.local ? <div><dt>Local</dt><dd>{missao.local}</dd></div> : null}
                {missao.ameaca ? <div><dt>Ameaça</dt><dd>{missao.ameaca}</dd></div> : null}
                {missao.consequencia ? <div><dt>Consequência</dt><dd>{missao.consequencia}</dd></div> : null}
              </dl> : null}
              {Array.isArray(missao.pistas) && missao.pistas.length ? <div className="missao-dossie__pistas"><strong>Pistas iniciais</strong><ul>{missao.pistas.map((pista) => <li key={pista}>{pista}</li>)}</ul></div> : null}
              <div className="missoes-arquivos__controles">
                <label>Status<select value={missao.status} onChange={(e) => alterarMissao(missao, "status", e.target.value)}><option value="ativa">Ativa</option><option value="pendente">Pendente</option><option value="concluida">Concluída</option><option value="falhou">Falhou</option></select></label>
                <label>Prioridade<select value={missao.prioridade} onChange={(e) => alterarMissao(missao, "prioridade", e.target.value)}><option value="baixa">Baixa</option><option value="normal">Normal</option><option value="alta">Alta</option><option value="critica">Crítica</option></select></label>
                <label className="missoes-arquivos__privada"><input type="checkbox" checked={missao.privada === true} onChange={(e) => alterarMissao(missao, "privada", e.target.checked)} /> Somente mestre</label>
              </div>
            </article>)}
          </div>
        )}
      </section>
    </section>
  );
}

export default PainelMissoes;
