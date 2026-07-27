import { useCallback, useState } from "react";
import BarraFerramentasEditorMapa from "./BarraFerramentasEditorMapa.jsx";
import ConfirmacaoEditorMapa from "./ConfirmacaoEditorMapa.jsx";
import PainelCamadasEditorMapa from "./PainelCamadasEditorMapa.jsx";
import PainelPropriedadesEditorMapa from "./PainelPropriedadesEditorMapa.jsx";
import ViewportEditorMapa from "./ViewportEditorMapa.jsx";
import { CAMADAS_EDITOR } from "./configEditorMapa.js";
import {
  alterarLarguraCorredor,
  alterarSala,
  alternarSalaSecreta,
  criarCorredorManual,
  criarSalaManual,
  definirSalaEspecial,
  excluirCorredor,
  excluirSala,
  validarEdicaoCompleta,
} from "./operacoesEditorMapa.js";
import {
  alterarTipoParede,
  criarParedeManual,
  excluirParede,
  recriarParedesAutomaticas,
} from "./operacoesParedeEditorMapa.js";
import {
  alterarPorta,
  criarOuMoverPorta,
  excluirPorta,
  gerarPortasAutomaticasEditor,
} from "./operacoesPortaEditorMapa.js";
import {
  alterarLuzManual,
  alterarObjetoManual,
  alterarTipoObjetoManual,
  alterarTipoSalaTematico,
  criarLuzManual,
  criarObjetoManual,
  corrigirTematicaEditor,
  excluirLuzManual,
  excluirObjetoManual,
  limparLuzesSala,
  limparObjetosSala,
  redistribuirTiposEditor,
  regenerarIluminacaoEditor,
  regenerarObjetosEditor,
  rotacionarObjetoManual,
} from "./operacoesTematicasEditorMapa.js";
import {
  criarHistoricoEditor,
  desfazerHistorico,
  refazerHistorico,
  registrarNoHistorico,
} from "./historicoEditorMapa.js";
import { obterTemaVisualMapa } from "../temas/registroTemasMapa.js";
import { OBJETOS_HOSPITAL } from "../temas/arquivos/objetosHospital.js";
import { LUZES_HOSPITAL } from "../temas/arquivos/luzesHospital.js";
import "../temas/arquivos/hospitalAbandonado.css";
import "./editorMapa.css";

function limitarZoom(valor) {
  return Math.max(25, Math.min(300, valor));
}

export default function EditorMapaGerado({ mapa, mapaOriginal = mapa, aoVoltar }) {
  const [mapaEmEdicao, setMapaEmEdicao] = useState(() => structuredClone(mapa));
  const [historico, setHistorico] = useState(() => criarHistoricoEditor(mapa));
  const [ferramenta, setFerramenta] = useState("selecionar");
  const [selecao, setSelecao] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [sinalAjuste, setSinalAjuste] = useState(0);
  const [camadas, setCamadas] = useState(() => Object.fromEntries(CAMADAS_EDITOR.map(([id]) => [id, true])));
  const [modoVisual, setModoVisual] = useState("estrutural");
  const [intensidadeGrid, setIntensidadeGrid] = useState("media");
  const [tipoObjeto, setTipoObjeto] = useState(OBJETOS_HOSPITAL[0].id);
  const [tipoLuz, setTipoLuz] = useState(LUZES_HOSPITAL[0].id);
  const [mensagem, setMensagem] = useState("O editor está pronto. Toda edição respeita o grid.");
  const [confirmacao, setConfirmacao] = useState(null);
  const alterarZoom = useCallback((valor) => setZoom(limitarZoom(valor)), []);
  const tema = obterTemaVisualMapa(mapaEmEdicao.tema);

  function aplicarResultado(resultado) {
    if (!resultado?.sucesso) {
      setMensagem(resultado?.erro || "A ação não pôde ser concluída.");
      return false;
    }
    setMapaEmEdicao(resultado.mapa);
    setHistorico((atual) => resultado.limparHistorico
      ? criarHistoricoEditor(resultado.mapa)
      : registrarNoHistorico(atual, resultado.mapa, resultado.descricao));
    setSelecao(resultado.selecao ?? selecao);
    setMensagem(resultado.aviso || resultado.descricao);
    return true;
  }

  function pedirConfirmacao(titulo, mensagemConfirmacao, executar, rotulo) {
    setConfirmacao({ titulo, mensagem: mensagemConfirmacao, executar, rotulo });
  }

  function confirmar() {
    const acao = confirmacao?.executar;
    setConfirmacao(null);
    if (acao) aplicarResultado(acao());
  }

  function apagarElemento(alvo = selecao) {
    if (!alvo) return setMensagem("Selecione um elemento antes de apagar.");
    if (alvo.tipo === "sala") {
      const ligados = mapaEmEdicao.corredores.filter((c) => c.salaOrigemId === alvo.id || c.salaDestinoId === alvo.id).length;
      pedirConfirmacao("Excluir sala", `${ligados} corredor(es) ligado(s) também serão removidos.`, () => excluirSala(mapaEmEdicao, alvo.id), "Excluir sala");
    } else if (alvo.tipo === "corredor") {
      pedirConfirmacao("Excluir corredor", "A exclusão pode isolar salas. A validação indicará qualquer problema.", () => excluirCorredor(mapaEmEdicao, alvo.id), "Excluir corredor");
    } else if (alvo.tipo === "parede") {
      pedirConfirmacao("Excluir parede", "O segmento será removido da estrutura.", () => excluirParede(mapaEmEdicao, alvo.id), "Excluir parede");
    } else if (alvo.tipo === "porta") {
      pedirConfirmacao("Excluir porta", "A parede comum será restaurada neste segmento.", () => excluirPorta(mapaEmEdicao, alvo.id, "parede"), "Excluir porta");
    } else if (alvo.tipo === "objeto") {
      aplicarResultado(excluirObjetoManual(mapaEmEdicao, alvo.id));
    } else if (alvo.tipo === "luz") {
      aplicarResultado(excluirLuzManual(mapaEmEdicao, alvo.id));
    } else setMensagem("Entrada e saída precisam receber substitutas antes da exclusão.");
  }

  function executarAcaoGeometrica(acao, dados) {
    if (acao === "criar-sala") aplicarResultado(criarSalaManual(mapaEmEdicao, dados));
    else if (acao === "mover-sala") aplicarResultado(alterarSala(mapaEmEdicao, dados.salaId, { x: dados.x, y: dados.y }, `${dados.salaId} movida`));
    else if (acao === "redimensionar-sala") aplicarResultado(alterarSala(mapaEmEdicao, dados.salaId, dados, `${dados.salaId} redimensionada`));
    else if (acao === "criar-corredor") aplicarResultado(criarCorredorManual(mapaEmEdicao, dados.inicio, dados.fim, 1));
    else if (acao === "criar-parede") aplicarResultado(criarParedeManual(mapaEmEdicao, dados.inicio, dados.fim));
    else if (acao === "criar-porta") aplicarResultado(criarOuMoverPorta(mapaEmEdicao, dados.paredeId));
    else if (acao === "criar-objeto") aplicarResultado(criarObjetoManual(mapaEmEdicao, tipoObjeto, dados));
    else if (acao === "criar-luz") aplicarResultado(criarLuzManual(mapaEmEdicao, tipoLuz, dados));
    else if (acao === "mover-objeto") aplicarResultado(alterarObjetoManual(mapaEmEdicao, dados.id, { x: dados.x, y: dados.y }));
    else if (acao === "mover-luz") aplicarResultado(alterarLuzManual(mapaEmEdicao, dados.id, { x: dados.x, y: dados.y }));
    else if (acao === "mover-porta") {
      aplicarResultado(criarOuMoverPorta(mapaEmEdicao, dados.paredeId, selecao?.tipo === "porta" ? selecao.id : null));
      setFerramenta("selecionar");
    } else if (acao === "apagar") apagarElemento(dados);
  }

  function executarPropriedade(acao, valor) {
    if (!selecao) return;
    if (acao === "alterar-sala") aplicarResultado(alterarSala(mapaEmEdicao, selecao.id, valor, `${selecao.id} alterada`));
    else if (acao === "sala-inicial") aplicarResultado(definirSalaEspecial(mapaEmEdicao, selecao.id, "inicial"));
    else if (acao === "sala-final") aplicarResultado(definirSalaEspecial(mapaEmEdicao, selecao.id, "final"));
    else if (acao === "sala-secreta") aplicarResultado(alternarSalaSecreta(mapaEmEdicao, selecao.id));
    else if (acao === "tipo-sala-tematico") aplicarResultado(alterarTipoSalaTematico(mapaEmEdicao, selecao.id, valor));
    else if (acao === "regenerar-objetos-sala") aplicarResultado(regenerarObjetosEditor(mapaEmEdicao, selecao.id));
    else if (acao === "limpar-objetos-sala") aplicarResultado(limparObjetosSala(mapaEmEdicao, selecao.id));
    else if (acao === "regenerar-luzes-sala") aplicarResultado(regenerarIluminacaoEditor(mapaEmEdicao, selecao.id));
    else if (acao === "limpar-luzes-sala") aplicarResultado(limparLuzesSala(mapaEmEdicao, selecao.id));
    else if (acao === "largura-corredor") aplicarResultado(alterarLarguraCorredor(mapaEmEdicao, selecao.id, valor));
    else if (acao === "tipo-parede") aplicarResultado(alterarTipoParede(mapaEmEdicao, selecao.id, valor));
    else if (acao === "estado-porta") aplicarResultado(alterarPorta(mapaEmEdicao, selecao.id, { estado: valor }));
    else if (acao === "tipo-porta") aplicarResultado(alterarPorta(mapaEmEdicao, selecao.id, { tipoEspecial: valor === "comum" ? null : valor }));
    else if (acao === "alterar-objeto") aplicarResultado(alterarObjetoManual(mapaEmEdicao, selecao.id, valor));
    else if (acao === "tipo-objeto") aplicarResultado(alterarTipoObjetoManual(mapaEmEdicao, selecao.id, valor));
    else if (acao === "rotacionar-objeto") aplicarResultado(rotacionarObjetoManual(mapaEmEdicao, selecao.id));
    else if (acao === "alterar-luz") aplicarResultado(alterarLuzManual(mapaEmEdicao, selecao.id, valor));
    else if (acao === "mover-porta") {
      setFerramenta("mover-porta");
      setMensagem("Clique no novo segmento de parede para mover a porta.");
    } else if (acao === "excluir-porta-parede" || acao === "excluir-porta-abertura") {
      const destino = acao.endsWith("abertura") ? "abertura" : "parede";
      pedirConfirmacao("Excluir porta", `O segmento será transformado em ${destino}.`, () => excluirPorta(mapaEmEdicao, selecao.id, destino), "Excluir porta");
    } else if (acao === "excluir") apagarElemento();
  }

  function desfazer() {
    const resultado = desfazerHistorico(historico);
    if (!resultado) return;
    setHistorico(resultado.historico);
    setMapaEmEdicao(resultado.mapa);
    setSelecao(null);
    setMensagem(`Desfeito: ${historico.entradas[historico.indice].descricao}`);
  }

  function refazer() {
    const resultado = refazerHistorico(historico);
    if (!resultado) return;
    setHistorico(resultado.historico);
    setMapaEmEdicao(resultado.mapa);
    setSelecao(null);
    setMensagem(`Refeito: ${resultado.historico.entradas[resultado.historico.indice].descricao}`);
  }

  function validarMapa() {
    const validado = validarEdicaoCompleta(mapaEmEdicao);
    setMapaEmEdicao(validado);
    const total = validado.validacaoEstrutural.erros.length + (validado.validacaoTematica?.erros.length || 0);
    setMensagem(total ? `Mapa com problemas: ${total} erro(s).` : "Mapa válido.");
  }

  function restaurarOriginal() {
    const restaurado = structuredClone(mapaOriginal);
    setHistorico(criarHistoricoEditor(restaurado));
    setSelecao(null);
    return {
      sucesso: true,
      mapa: restaurado,
      selecao: null,
      descricao: "A geração original foi restaurada.",
      limparHistorico: true,
    };
  }

  function tratarAtalho(evento) {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(evento.target.tagName)) return;
    const tecla = evento.key.toLowerCase();
    if ((evento.ctrlKey || evento.metaKey) && tecla === "z") {
      if (evento.shiftKey) refazer();
      else desfazer();
    } else if ((evento.ctrlKey || evento.metaKey) && tecla === "y") refazer();
    else if (tecla === "escape") {
      if (ferramenta !== "selecionar") setFerramenta("selecionar");
      else setSelecao(null);
    } else if (tecla === "delete") apagarElemento();
    else if (tecla === "q" && selecao?.tipo === "objeto") aplicarResultado(rotacionarObjetoManual(mapaEmEdicao, selecao.id));
    else if ({ v: "selecionar", h: "mover", r: "criar-sala", c: "criar-corredor", w: "criar-parede", d: "criar-porta", o: "criar-objeto", l: "criar-luz" }[tecla]) {
      setFerramenta({ v: "selecionar", h: "mover", r: "criar-sala", c: "criar-corredor", w: "criar-parede", d: "criar-porta", o: "criar-objeto", l: "criar-luz" }[tecla]);
    } else if (evento.key === "+" || evento.key === "=") alterarZoom(zoom + 25);
    else if (evento.key === "-") alterarZoom(zoom - 25);
    else if (evento.key === "0") setSinalAjuste((atual) => atual + 1);
    else return;
    evento.preventDefault();
  }

  const validacao = mapaEmEdicao.validacaoEstrutural;
  const validacaoVisivel = mapaEmEdicao.validacaoEditorDesatualizada
    ? mapaEmEdicao.validacaoMinimaEditor
    : validacao;
  return (
    <section className="editor-mapa" tabIndex="0" autoFocus onKeyDown={tratarAtalho} aria-label="Editor geométrico do mapa">
      <header className="editor-mapa__cabecalho">
        <div>
          <span>Edição estrutural · {tema.nome}</span>
          <h2>Editor de mapa</h2>
          <p>{mapaEmEdicao.modificadoManualmente ? "Este mapa foi alterado manualmente e pode não ser recriado apenas pela seed." : "A geração original está preservada."}</p>
        </div>
        <div className="editor-mapa__cabecalho-acoes">
          <button type="button" onClick={() => pedirConfirmacao("Recriar paredes", "Paredes automáticas serão recalculadas. Alterações manuais conflitantes poderão ser removidas.", () => recriarParedesAutomaticas(mapaEmEdicao), "Recriar paredes")}>Recriar paredes</button>
          <button type="button" disabled={!mapaEmEdicao.paredes.length} onClick={() => aplicarResultado(gerarPortasAutomaticasEditor(mapaEmEdicao))}>Recriar portas</button>
          <button type="button" onClick={() => pedirConfirmacao("Redistribuir tipos", "Objetos anteriores serão removidos e a iluminação ficará desatualizada.", () => redistribuirTiposEditor(mapaEmEdicao), "Redistribuir")}>Refazer tipos</button>
          <button type="button" disabled={!mapaEmEdicao.tiposSalaDistribuidos} onClick={() => aplicarResultado(regenerarObjetosEditor(mapaEmEdicao))}>Regenerar objetos</button>
          <button type="button" disabled={!mapaEmEdicao.tiposSalaDistribuidos} onClick={() => aplicarResultado(regenerarIluminacaoEditor(mapaEmEdicao))}>Regenerar luzes</button>
          <button type="button" disabled={!mapaEmEdicao.tiposSalaDistribuidos} onClick={() => aplicarResultado(corrigirTematicaEditor(mapaEmEdicao))}>Corrigir tema</button>
          <button type="button" onClick={() => aoVoltar(mapaEmEdicao)}>Voltar ao gerador</button>
        </div>
      </header>
      <BarraFerramentasEditorMapa
        ferramenta={ferramenta}
        zoom={zoom}
        podeDesfazer={historico.indice > 0}
        podeRefazer={historico.indice < historico.entradas.length - 1}
        aoSelecionarFerramenta={setFerramenta}
        aoAproximar={() => alterarZoom(zoom + 25)}
        aoAfastar={() => alterarZoom(zoom - 25)}
        aoAjustar={() => setSinalAjuste((atual) => atual + 1)}
        aoDesfazer={desfazer}
        aoRefazer={refazer}
        aoValidar={validarMapa}
        aoRestaurar={() => pedirConfirmacao("Restaurar geração original", "Todas as edições manuais e o histórico temporário serão descartados.", restaurarOriginal, "Restaurar")}
        tipoObjeto={tipoObjeto}
        tipoLuz={tipoLuz}
        objetosDisponiveis={OBJETOS_HOSPITAL}
        luzesDisponiveis={LUZES_HOSPITAL}
        aoAlterarTipoObjeto={setTipoObjeto}
        aoAlterarTipoLuz={setTipoLuz}
      />
      <div className="editor-mapa__visualizacao">
        <fieldset><legend>Visualização</legend>
          <label><input type="radio" name="modo-visual" checked={modoVisual === "estrutural"} onChange={() => setModoVisual("estrutural")} /> Estrutural</label>
          <label><input type="radio" name="modo-visual" checked={modoVisual === "tematico"} onChange={() => setModoVisual("tematico")} /> Temático</label>
          <label>Intensidade do grid <select value={intensidadeGrid} onChange={(evento) => setIntensidadeGrid(evento.target.value)}><option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option></select></label>
        </fieldset>
        <output className={mapaEmEdicao.validacaoEditorDesatualizada ? "editor-mapa__status--aviso" : validacao?.valido ? "editor-mapa__status--valido" : "editor-mapa__status--erro"}>
          {mapaEmEdicao.validacaoEditorDesatualizada ? "Validação desatualizada" : validacao?.valido ? "Mapa válido" : "Mapa com problemas"}
        </output>
        <details className="editor-mapa__validacao-resumo">
          <summary>Validação</summary>
          <span>Erros: {validacaoVisivel?.erros?.length || 0} · Avisos: {validacaoVisivel?.avisos?.length || 0}</span>
          {mapaEmEdicao.validacaoEditorDesatualizada ? <small>Resumo imediato; execute Validar mapa para atualizar a validação completa.</small> : null}
          {mapaEmEdicao.ultimaValidacaoEditor ? <small>Última: {new Date(mapaEmEdicao.ultimaValidacaoEditor).toLocaleTimeString("pt-BR")}</small> : <small>Ainda não validado no editor.</small>}
          {validacaoVisivel?.erros?.slice(0, 3).map((erro) => <small key={`${erro.codigo}-${erro.mensagem}`}>{erro.mensagem}</small>)}
          {mapaEmEdicao.validacaoTematica ? <small>Temática: {mapaEmEdicao.validacaoTematica.valido ? "válida" : `${mapaEmEdicao.validacaoTematica.erros.length} erro(s)`} · {mapaEmEdicao.validacaoTematica.avisos.length} aviso(s)</small> : null}
        </details>
      </div>
      <div className="editor-mapa__corpo">
        <PainelCamadasEditorMapa camadas={camadas} aoAlternar={(id) => {
          setCamadas((atuais) => ({ ...atuais, [id]: !atuais[id] }));
          if (selecao && ((["entrada", "saida"].includes(selecao.tipo) && id === "marcacoes") || id === `${selecao.tipo}s`)) setSelecao(null);
        }} />
        <ViewportEditorMapa
          mapa={mapaEmEdicao}
          camadas={camadas}
          ferramenta={ferramenta}
          selecao={selecao}
          zoom={zoom}
          modoVisual={modoVisual}
          intensidadeGrid={intensidadeGrid}
          modoMestre
          aoSelecionar={setSelecao}
          aoAlterarZoom={alterarZoom}
          aoAcaoGeometrica={executarAcaoGeometrica}
          sinalAjuste={sinalAjuste}
        />
        <PainelPropriedadesEditorMapa mapa={mapaEmEdicao} selecao={selecao} aoExecutar={executarPropriedade} />
      </div>
      <footer>
        <output aria-live="polite">{mensagem}</output>
        <span>Histórico: {historico.indice}/{historico.entradas.length - 1} · Seed original: {mapaEmEdicao.seedOriginal || mapaEmEdicao.seed}</span>
      </footer>
      <ConfirmacaoEditorMapa confirmacao={confirmacao} aoConfirmar={confirmar} aoCancelar={() => setConfirmacao(null)} />
    </section>
  );
}
