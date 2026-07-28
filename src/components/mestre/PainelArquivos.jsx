import { useEffect, useRef, useState } from "react";

import "./PaineisDossie.css";
import "./HistoricoArquivo.css";
import { lerBackupCampanha } from "../../utils/backupCampanhaOrbe.js";

const ARQUIVO_VAZIO = {
  titulo: "",
  data: "",
  status: "aberto",
  resumo: "",
  missao: "",
  acontecimentos: "",
  pistas: "",
  personagens: "",
  textoJogadores: "",
  observacoes: "",
  visivelJogadores: false,
};

function estaLiberado(arquivo) {
  return arquivo?.visivelJogadores === true || arquivo?.visibleToPlayers === true;
}

function textoPistas(valor) {
  return Array.isArray(valor) ? valor.join("\n") : String(valor || "");
}

function dataLocal(data = new Date()) {
  const ajustada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
  return ajustada.toISOString().slice(0, 10);
}

function PainelArquivos({ arquivos = [], arquivoSelecionado = null, aoAdicionarArquivo, aoSelecionarArquivo, aoAtualizarArquivo, aoRemoverArquivo, mesaId = "local", aoListarHistorico, aoRestaurarArquivo, aoExportarBackup, aoImportarBackup }) {
  const [novoArquivo, setNovoArquivo] = useState(ARQUIVO_VAZIO);
  const [arquivosLocais, setArquivosLocais] = useState(arquivos);
  const [arquivoAtivo, setArquivoAtivo] = useState(arquivoSelecionado);
  const [historico, setHistorico] = useState([]);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [versaoPrevia, setVersaoPrevia] = useState(null);
  const [restaurando, setRestaurando] = useState(false);
  const [importacao, setImportacao] = useState(null);
  const [importando, setImportando] = useState(false);
  const inputBackupRef = useRef(null);

  useEffect(() => setArquivosLocais(Array.isArray(arquivos) ? arquivos : []), [arquivos]);
  useEffect(() => setArquivoAtivo(arquivoSelecionado || null), [arquivoSelecionado]);

  function gerarNumeroArquivo() {
    const maior = arquivosLocais.reduce((resultado, arquivo) => Math.max(resultado, Number(String(arquivo.codigo || "").match(/\d+/)?.[0]) || 0), 0);
    return String(maior + 1).padStart(4, "0");
  }

  function adicionarArquivo(evento) {
    evento.preventDefault();
    const numero = gerarNumeroArquivo();
    const arquivoCriado = {
      ...novoArquivo,
      id: `arquivo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      codigo: `ARQUIVO ${numero}`,
      titulo: novoArquivo.titulo.trim() || `Sessão ${numero}`,
      data: novoArquivo.data || dataLocal(),
      criadoEm: new Date().toLocaleString("pt-BR"),
      visibleToPlayers: novoArquivo.visivelJogadores,
    };
    setArquivosLocais((lista) => [arquivoCriado, ...lista]);
    setArquivoAtivo(arquivoCriado);
    setNovoArquivo(ARQUIVO_VAZIO);
    aoAdicionarArquivo?.(arquivoCriado);
  }

  function selecionarArquivo(arquivo) {
    setArquivoAtivo(arquivo);
    aoSelecionarArquivo?.(arquivo);
  }

  function atualizarArquivo(arquivo, alteracoes) {
    const atualizado = { ...arquivo, ...alteracoes };
    setArquivosLocais((lista) => lista.map((item) => item.id === atualizado.id ? atualizado : item));
    setArquivoAtivo((ativo) => ativo?.id === atualizado.id ? atualizado : ativo);
    aoAtualizarArquivo?.(atualizado);
  }

  function atualizarArquivoAtivo(nomeCampo, valor) {
    if (!arquivoAtivo) return;
    atualizarArquivo(arquivoAtivo, { [nomeCampo]: valor });
  }

  function alternarLiberacao(arquivo) {
    const liberado = !estaLiberado(arquivo);
    atualizarArquivo(arquivo, { visivelJogadores: liberado, visibleToPlayers: liberado });
  }

  function alternarArquivo(arquivo) {
    atualizarArquivo(arquivo, { status: arquivo.status === "arquivado" ? "aberto" : "arquivado" });
  }

  function removerArquivo(arquivo) {
    if (!window.confirm(`Remover ${arquivo.codigo || "este arquivo"}?`)) return;
    setArquivosLocais((lista) => lista.filter((item) => item.id !== arquivo.id));
    if (arquivoAtivo?.id === arquivo.id) setArquivoAtivo(null);
    aoRemoverArquivo?.(arquivo);
  }

  async function alternarHistorico() {
    if (!arquivoAtivo || !aoListarHistorico || mesaId === "local") return;
    if (historicoAberto) {
      setHistoricoAberto(false);
      return;
    }
    setCarregandoHistorico(true);
    try {
      setHistorico(await aoListarHistorico(mesaId, arquivoAtivo.id));
      setHistoricoAberto(true);
    } catch {
      setHistorico([]);
    } finally {
      setCarregandoHistorico(false);
    }
  }

  async function restaurarVersao(versao) {
    if (!aoRestaurarArquivo || !arquivoAtivo) return;
    setRestaurando(true);
    try {
      await aoRestaurarArquivo(arquivoAtivo, versao);
      setHistoricoAberto(false);
      setVersaoPrevia(null);
    } finally {
      setRestaurando(false);
    }
  }

  async function selecionarBackup(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    try {
      const texto = await arquivo.text();
      const backup = lerBackupCampanha(texto);
      setImportacao({ texto, backup });
    } catch (erro) {
      setImportacao({ erro: erro?.message || "Backup invalido." });
    }
  }

  async function confirmarImportacao(modo) {
    if (!importacao?.texto || !aoImportarBackup) return;
    setImportando(true);
    try {
      await aoImportarBackup({ texto: importacao.texto, modo });
      setImportacao(null);
    } finally {
      setImportando(false);
    }
  }

  const liberados = arquivosLocais.filter(estaLiberado).length;

  return (
    <section className="painel-dossie painel-arquivos-configurado">
      <header className="painel-dossie__cabecalho">
        <div><span>Histórico da campanha</span><h2>Arquivos</h2><p>Organize sessões, missões e informações liberadas aos jogadores.</p></div>
        <div className="painel-dossie__resumos-duplos">
          <div className="painel-dossie__resumo"><span>Registrados</span><strong>{arquivosLocais.length}</strong></div>
          <div className="painel-dossie__resumo"><span>Liberados</span><strong>{liberados}</strong></div>
        </div>
        <div className="backup-arquivos__acoes">
          <button type="button" disabled={!aoExportarBackup} onClick={aoExportarBackup}>Exportar backup</button>
          <button type="button" onClick={() => inputBackupRef.current?.click()}>Importar backup</button>
          <input ref={inputBackupRef} className="backup-arquivos__input" type="file" accept=".json,.orbe.json,application/json" onChange={selecionarBackup} />
        </div>
      </header>
      {importacao ? <section className="backup-arquivos__dialog">
        {importacao.erro ? <><strong>Backup recusado</strong><p>{importacao.erro}</p><button type="button" onClick={() => setImportacao(null)}>Fechar</button></> : <><strong>Backup pronto para importar</strong><p>{importacao.backup.manifesto.quantidadeArquivos} Arquivo(s) e {importacao.backup.manifesto.quantidadeVersoes} versao(oes) encontradas.</p><div><button type="button" disabled={importando} onClick={() => confirmarImportacao("nova")}>Nova campanha</button><button type="button" disabled={importando} onClick={() => confirmarImportacao("mesclar")}>Mesclar nesta campanha</button><button type="button" disabled={importando} onClick={() => confirmarImportacao("substituir")}>Substituir Arquivos</button><button type="button" disabled={importando} onClick={() => setImportacao(null)}>Cancelar</button></div></>}
      </section> : null}

      <form className="painel-dossie__formulario" onSubmit={adicionarArquivo}>
        <h3>Criar novo arquivo</h3>
        <div className="painel-dossie__campos">
          <label>Título da sessão<input maxLength="80" placeholder="Ex.: A casa abandonada" value={novoArquivo.titulo} onChange={(e) => setNovoArquivo((anterior) => ({ ...anterior, titulo: e.target.value }))} /></label>
          <label>Data da sessão<input type="date" value={novoArquivo.data} onChange={(e) => setNovoArquivo((anterior) => ({ ...anterior, data: e.target.value }))} /></label>
          <label>Status<select value={novoArquivo.status} onChange={(e) => setNovoArquivo((anterior) => ({ ...anterior, status: e.target.value }))}><option value="aberto">Aberto</option><option value="andamento">Em andamento</option><option value="encerrado">Encerrado</option><option value="arquivado">Arquivado</option></select></label>
        </div>
        <label className="painel-dossie__campo-grande">Resumo inicial<textarea rows="3" maxLength="1000" placeholder="Introdução ou resumo desta sessão..." value={novoArquivo.resumo} onChange={(e) => setNovoArquivo((anterior) => ({ ...anterior, resumo: e.target.value }))} /></label>
        <label className="painel-dossie__campo-grande">Objetivo / missão<textarea rows="2" maxLength="1000" placeholder="O que os agentes precisam realizar?" value={novoArquivo.missao} onChange={(e) => setNovoArquivo((anterior) => ({ ...anterior, missao: e.target.value }))} /></label>
        <label className="arquivo-aberto__visibilidade"><input type="checkbox" checked={novoArquivo.visivelJogadores} onChange={(e) => setNovoArquivo((anterior) => ({ ...anterior, visivelJogadores: e.target.checked }))} /> Liberar este arquivo aos jogadores</label>
        <button className="painel-dossie__botao-principal" type="submit">Criar arquivo</button>
      </form>

      <section className="painel-dossie__conteudo">
        <h3>Arquivos da campanha</h3>
        {arquivosLocais.length === 0 ? <p className="painel-dossie__vazio">Nenhuma sessão foi registrada nesta campanha.</p> : (
          <div className="arquivos-campanha">
            {arquivosLocais.map((arquivo) => {
              const ativo = arquivoAtivo?.id === arquivo.id;
              const liberado = estaLiberado(arquivo);
              return <article className={`${ativo ? "arquivos-campanha__item arquivos-campanha__item--ativo" : "arquivos-campanha__item"} ${liberado ? "arquivos-campanha__item--liberado" : "arquivos-campanha__item--restrito"}`} key={arquivo.id}>
                <button className="arquivos-campanha__abrir" type="button" onClick={() => selecionarArquivo(arquivo)}>
                  <span>{arquivo.codigo}</span><strong>{arquivo.titulo}</strong><small>{arquivo.data || "Data não informada"}</small>
                  <span className="arquivos-campanha__selos"><i>{arquivo.status || "aberto"}</i><i>{liberado ? "Liberado" : "Restrito"}</i></span>
                </button>
                <div className="arquivos-campanha__acoes">
                  <button type="button" onClick={() => selecionarArquivo(arquivo)}>Abrir</button>
                  <button type="button" onClick={() => alternarLiberacao(arquivo)}>{liberado ? "Bloquear" : "Liberar"}</button>
                  <button type="button" onClick={() => alternarArquivo(arquivo)}>{arquivo.status === "arquivado" ? "Reabrir" : "Arquivar"}</button>
                  <button className="arquivos-campanha__remover" type="button" onClick={() => removerArquivo(arquivo)}>Remover</button>
                </div>
              </article>;
            })}
          </div>
        )}
      </section>

      {arquivoAtivo ? <section className="painel-dossie__conteudo arquivo-aberto">
        <header className="arquivo-aberto__cabecalho">
          <div><span>{arquivoAtivo.codigo}</span><h3>{arquivoAtivo.titulo}</h3><small>{estaLiberado(arquivoAtivo) ? "Visível para os jogadores" : "Restrito ao mestre"}</small></div>
          <div className="arquivo-aberto__controles"><select aria-label="Status do arquivo" value={arquivoAtivo.status} onChange={(e) => atualizarArquivoAtivo("status", e.target.value)}><option value="aberto">Aberto</option><option value="andamento">Em andamento</option><option value="encerrado">Encerrado</option><option value="arquivado">Arquivado</option></select><button type="button" disabled={carregandoHistorico || mesaId === "local"} onClick={alternarHistorico}>{carregandoHistorico ? "Carregando..." : historicoAberto ? "Fechar historico" : "Ver historico"}</button></div>
        </header>
        {historicoAberto ? <aside className="historico-arquivo">
          <header><div><span>Registro persistente</span><h4>Versoes do Arquivo</h4></div><small>{historico.length} versao(oes)</small></header>
          {historico.length ? <div className="historico-arquivo__lista">{historico.map((versao, indice) => {
            const atual = indice === 0;
            return <article key={versao.id || `${versao.numeroVersao}-${versao.criadoEm}`} className={atual ? "historico-arquivo__item historico-arquivo__item--atual" : "historico-arquivo__item"}>
              <div><strong>Versao {versao.numeroVersao}</strong>{atual ? <em>Versao atual</em> : null}<small>{versao.criadoEm ? new Date(versao.criadoEm).toLocaleString("pt-BR") : "Data nao informada"}</small><small>Autor: {versao.autor?.nome || versao.usuarioId || "Registro anterior"}</small><p>{versao.dados?.titulo || "Sem titulo"} · {versao.dados?.status || "aberto"}</p></div>
              <div className="historico-arquivo__acoes"><button type="button" onClick={() => setVersaoPrevia(versao)}>Visualizar</button>{!atual ? <button type="button" disabled={restaurando} onClick={() => restaurarVersao(versao)}>Restaurar</button> : null}</div>
            </article>;
          })}</div> : <p>Nenhuma versao persistida ainda.</p>}
          {versaoPrevia ? <div className="historico-arquivo__previa"><header><strong>Previa da versao {versaoPrevia.numeroVersao}</strong><button type="button" onClick={() => setVersaoPrevia(null)}>Fechar</button></header><pre>{JSON.stringify(versaoPrevia.dados, null, 2)}</pre></div> : null}
        </aside> : null}
        <div className="arquivo-aberto__campos">
          <label>Título<input maxLength="80" value={arquivoAtivo.titulo} onChange={(e) => atualizarArquivoAtivo("titulo", e.target.value)} /></label>
          <label>Data da sessão<input type="date" value={arquivoAtivo.data || ""} onChange={(e) => atualizarArquivoAtivo("data", e.target.value)} /></label>
        </div>
        <label className="arquivo-aberto__visibilidade"><input type="checkbox" checked={estaLiberado(arquivoAtivo)} onChange={() => alternarLiberacao(arquivoAtivo)} /> Liberar este arquivo aos jogadores</label>
        <label className="painel-dossie__campo-grande">Resumo<textarea rows="4" value={arquivoAtivo.resumo || ""} onChange={(e) => atualizarArquivoAtivo("resumo", e.target.value)} /></label>
        <label className="painel-dossie__campo-grande">Objetivo / missão<textarea rows="3" value={arquivoAtivo.missao || ""} onChange={(e) => atualizarArquivoAtivo("missao", e.target.value)} /></label>
        <label className="painel-dossie__campo-grande">Pistas reveladas<textarea rows="5" placeholder="Uma pista por linha" value={textoPistas(arquivoAtivo.pistas)} onChange={(e) => atualizarArquivoAtivo("pistas", e.target.value)} /></label>
        <label className="painel-dossie__campo-grande arquivo-aberto__publico">Texto liberado aos jogadores<textarea rows="3" placeholder="Somente este texto deve antecipar a investigação." value={arquivoAtivo.textoJogadores || arquivoAtivo.publicText || ""} onChange={(e) => atualizarArquivo(arquivoAtivo, { textoJogadores: e.target.value, publicText: e.target.value })} /></label>
        <label className="painel-dossie__campo-grande">Acontecimentos<textarea rows="5" placeholder="Registre o que aconteceu durante a sessão..." value={arquivoAtivo.acontecimentos || ""} onChange={(e) => atualizarArquivoAtivo("acontecimentos", e.target.value)} /></label>
        <label className="painel-dossie__campo-grande">Personagens envolvidos<textarea rows="3" placeholder="Agentes, NPCs, suspeitos e criaturas..." value={arquivoAtivo.personagens || ""} onChange={(e) => atualizarArquivoAtivo("personagens", e.target.value)} /></label>
        <label className="painel-dossie__campo-grande arquivo-aberto__privado">Observações privadas do mestre<textarea rows="4" placeholder="Planos, ameaças ocultas e consequências..." value={arquivoAtivo.observacoes || ""} onChange={(e) => atualizarArquivoAtivo("observacoes", e.target.value)} /></label>
      </section> : null}
    </section>
  );
}

export default PainelArquivos;
