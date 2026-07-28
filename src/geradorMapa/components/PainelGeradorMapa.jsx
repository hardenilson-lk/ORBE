import { useEffect, useMemo, useState } from "react";
import {
  CONFIGURACOES_INICIAIS_MAPA,
  TAMANHOS_MAPA,
  limitarDimensaoMapa,
} from "../data/configuracoesIniciaisMapa.js";
import { ETAPA_AFETADA_POR_CONFIGURACAO } from "../data/etapasGeradorMapa.js";
import { executarEtapaGerador } from "../core/executarEtapaGerador.js";
import { executarFluxoGeracaoEstrutural } from "../core/executarFluxoGeracaoEstrutural.js";
import {
  concluirEtapa,
  criarEstadosIniciaisEtapas,
  estadosDoMapa,
  invalidarEtapasAPartirDe,
  invalidarPorConfiguracao,
  marcarErroEtapa,
  marcarEtapaProcessando,
} from "../core/estadoEtapasGerador.js";
import { corrigirMapaEstrutural } from "../core/corrigirMapaEstrutural.js";
import { validarConfiguracoesGerador } from "../core/validarConfiguracoesGerador.js";
import { obterTemasDoSistema } from "../data/temasPorSistema.js";
import { obterSistemaGeradorMapa } from "../integracao/obterSistemaGeradorMapa.js";
import EditorMapaGerado from "../editor/EditorMapaGerado.jsx";
import ConfiguracoesGeradorMapa from "./ConfiguracoesGeradorMapa.jsx";
import PainelValidacaoMapa from "./PainelValidacaoMapa.jsx";
import PreviewGeradorMapa from "./PreviewGeradorMapa.jsx";
import ProgressoGeracaoMapa from "./ProgressoGeracaoMapa.jsx";
import SeletorModoGeracao from "./SeletorModoGeracao.jsx";
import PainelPersistenciaMapa from "./PainelPersistenciaMapa.jsx";
import BotaoFinalizarComIA from "./BotaoFinalizarComIA.jsx";
import "../styles/geradorMapa.css";

function criarSeed(sistema, tema) {
  const codigoTema = tema?.codigoSeed || "MAPA";
  const numero = Math.floor(1000 + Math.random() * 9000);
  return `ORBE-${String(sistema || "ARQUIVOS").toUpperCase()}-${codigoTema}-${numero}`;
}

function proximoFrame() {
  return new Promise((resolver) => requestAnimationFrame(resolver));
}

export default function PainelGeradorMapa({
  sistemaCampanha,
  mesaId = "local",
  mapaAtual = {},
  mapaInicial = null,
  aoAplicarMapa,
  aoFechar,
}) {
  const sistema = useMemo(() => obterSistemaGeradorMapa(sistemaCampanha), [sistemaCampanha]);
  const temas = useMemo(() => obterTemasDoSistema(sistema.id), [sistema.id]);
  const temaInicial = temas.find((tema) => tema.id === CONFIGURACOES_INICIAIS_MAPA.tema) || temas[0];
  const [configuracoes, setConfiguracoes] = useState(() => ({
    ...CONFIGURACOES_INICIAIS_MAPA,
    ...(mapaInicial?.configuracoes || {}),
    tema: temaInicial?.id || "",
    ...(mapaInicial ? {
      tema: mapaInicial.tema || temaInicial?.id || "",
      seed: mapaInicial.seed || criarSeed(sistema.id, temaInicial),
      largura: mapaInicial.largura || CONFIGURACOES_INICIAIS_MAPA.largura,
      altura: mapaInicial.altura || CONFIGURACOES_INICIAIS_MAPA.altura,
    } : { seed: criarSeed(sistema.id, temaInicial) }),
  }));
  const [mapaGerado, setMapaGerado] = useState(() => mapaInicial);
  const [ultimoMapaValido, setUltimoMapaValido] = useState(() => mapaInicial?.validacaoEstrutural?.valido ? mapaInicial : null);
  const [estadosEtapas, setEstadosEtapas] = useState(() => mapaInicial ? estadosDoMapa(mapaInicial) : criarEstadosIniciaisEtapas());
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("informacao");
  const [configuracoesAlteradas, setConfiguracoesAlteradas] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [editorAberto, setEditorAberto] = useState(false);
  const [mapaEditor, setMapaEditor] = useState(() => mapaInicial);
  const mapaEmUso = mapaEditor || mapaGerado;

  function aplicarFinalizacaoIA(finalizacao) {
    setMapaGerado((atual) => atual ? { ...atual, finalizacaoIA: finalizacao } : atual);
    setMapaEditor((atual) => atual ? { ...atual, finalizacaoIA: finalizacao } : atual);
    setMensagem("Mapa finalizado visualmente. A imagem não altera a geometria nem a colisão.");
    setTipoMensagem("sucesso");
  }

  function removerFinalizacaoIA() {
    setMapaGerado((atual) => atual ? { ...atual, finalizacaoIA: null } : atual);
    setMapaEditor((atual) => atual ? { ...atual, finalizacaoIA: null } : atual);
  }

  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key !== "Escape" || editorAberto) return;
      evento.preventDefault();
      aoFechar?.();
    }
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aoFechar, editorAberto]);

  function parametrosGeracao(proximas = configuracoes) {
    return {
      seed: proximas.seed.trim(),
      sistema: sistema.id,
      tema: proximas.tema,
      largura: Number(proximas.largura),
      altura: Number(proximas.altura),
      configuracoes: {
        ...proximas,
        quantidadeSalas: Number(proximas.quantidadeSalas),
        larguraCorredores: Number(proximas.larguraCorredores),
        salasSecretas: Number(proximas.salasSecretas),
      },
    };
  }

  function alterar(campo, valor) {
    setMensagem("");
    const normalizado = ["largura", "altura"].includes(campo)
      ? limitarDimensaoMapa(valor, campo)
      : ["quantidadeSalas", "larguraCorredores", "salasSecretas"].includes(campo)
        ? Math.max(0, Math.round(Number(valor) || 0))
        : valor;
    setConfiguracoes((atuais) => ({ ...atuais, [campo]: normalizado }));
    if (mapaGerado && campo !== "modo" && ETAPA_AFETADA_POR_CONFIGURACAO[campo]) {
      setConfiguracoesAlteradas(true);
      setEstadosEtapas((atuais) => invalidarPorConfiguracao(atuais, campo));
    }
  }

  function alterarTamanho(tamanhoId) {
    const tamanho = TAMANHOS_MAPA[tamanhoId];
    setConfiguracoes((atuais) => ({
      ...atuais,
      tamanho: tamanhoId,
      largura: tamanho?.largura ?? atuais.largura,
      altura: tamanho?.altura ?? atuais.altura,
    }));
    if (mapaGerado) {
      setConfiguracoesAlteradas(true);
      setEstadosEtapas((atuais) => invalidarEtapasAPartirDe(atuais, "salas"));
    }
  }

  function validarConfiguracoes() {
    const validacao = validarConfiguracoesGerador(configuracoes);
    if (validacao.valida) return true;
    setTipoMensagem("erro");
    setMensagem(validacao.mensagem);
    return false;
  }

  async function gerarAutomaticamente() {
    if (gerando || !validarConfiguracoes()) return;
    setGerando(true);
    setRelatorio(null);
    setMensagem("");
    setEstadosEtapas(criarEstadosIniciaisEtapas());
    await proximoFrame();
    const resultado = executarFluxoGeracaoEstrutural(
      parametrosGeracao(),
      (etapa, status, parcial) => {
        setEstadosEtapas((atuais) => ({ ...atuais, [etapa]: status }));
        setRelatorio(parcial);
      },
    );
    if (!resultado.sucesso) {
      setTipoMensagem("erro");
      setMensagem(`A geração foi interrompida na etapa ${resultado.relatorio.etapaFalha}. ${resultado.relatorio.erros[0] || ""}`);
      setRelatorio(resultado.relatorio);
      setGerando(false);
      return;
    }
    setMapaGerado(resultado.mapa);
    setMapaEditor(null);
    setUltimoMapaValido(resultado.mapa);
    setEstadosEtapas(estadosDoMapa(resultado.mapa));
    setConfiguracoesAlteradas(false);
    setRelatorio(resultado.relatorio);
    setTipoMensagem(resultado.relatorio.avisos.length ? "aviso" : "sucesso");
    setMensagem("O mapa temático está pronto, com tipos de sala, objetos, decoração e iluminação.");
    setGerando(false);
  }

  async function executarPorPartes(etapa) {
    const status = estadosEtapas[etapa];
    if (status === "bloqueada" || status === "processando" || gerando) return;
    if (!validarConfiguracoes()) return;
    setEstadosEtapas((atuais) => marcarEtapaProcessando(invalidarEtapasAPartirDe(atuais, etapa), etapa));
    await proximoFrame();
    const resultado = executarEtapaGerador(etapa, {
      mapa: mapaGerado,
      parametros: parametrosGeracao(),
    });
    if (!resultado.sucesso) {
      setEstadosEtapas((atuais) => marcarErroEtapa(atuais, etapa));
      setTipoMensagem("erro");
      setMensagem(`A etapa ${etapa} falhou. ${resultado.erros[0] || ""}`);
      return;
    }
    setMapaGerado(resultado.mapaAtualizado);
    setMapaEditor(null);
    const statusConclusao = resultado.resumo?.fallback
      ? "concluida-fallback"
      : resultado.resumo?.decoracaoDesativada
        ? "ignorada"
        : resultado.avisos.length
          ? "concluida-avisos"
          : "concluida";
    setEstadosEtapas((atuais) => concluirEtapa(atuais, etapa, statusConclusao));
    setConfiguracoesAlteradas(false);
    setTipoMensagem(resultado.avisos.length ? "aviso" : "sucesso");
    setMensagem(resultado.avisos[0] || `${etapa} concluída com sucesso.`);
    if (etapa === "validacao" && resultado.mapaAtualizado.validacaoEstrutural.valido) {
      setUltimoMapaValido(resultado.mapaAtualizado);
    }
  }

  function corrigirAutomaticamente() {
    if (!mapaEmUso) return;
    const resultado = corrigirMapaEstrutural(mapaEmUso);
    setMapaGerado(resultado.mapa);
    setMapaEditor(null);
    setEstadosEtapas((atuais) => ({ ...atuais, validacao: resultado.validacao.valido ? "concluida" : "erro" }));
    if (resultado.validacao.valido) setUltimoMapaValido(resultado.mapa);
    setTipoMensagem(resultado.validacao.valido ? "sucesso" : "aviso");
    setMensagem(resultado.correcoes.length ? `${resultado.correcoes.length} correção(ões) segura(s) aplicada(s).` : "Não há correções automáticas seguras disponíveis.");
  }

  function carregarMapaPersistido(mapa) {
    setMapaGerado(mapa);
    setMapaEditor(mapa);
    setUltimoMapaValido(mapa?.validacaoEstrutural?.valido ? mapa : null);
    setEstadosEtapas(estadosDoMapa(mapa));
    setConfiguracoes((atuais) => ({
      ...atuais,
      ...(mapa.configuracoes || {}),
      tema: mapa.tema || atuais.tema,
      seed: mapa.seed || atuais.seed,
      largura: mapa.largura || atuais.largura,
      altura: mapa.altura || atuais.altura,
      quantidadeSalas: mapa.configuracoes?.quantidadeSalas || mapa.salas?.length || atuais.quantidadeSalas,
    }));
    setConfiguracoesAlteradas(false);
    setTipoMensagem("sucesso");
    setMensagem("Mapa carregado e preparado para edição.");
  }

  if (editorAberto && mapaEmUso) {
    return (
      <div className="gerador-mapa__sobreposicao">
        <EditorMapaGerado
          mapa={mapaEmUso}
          mapaOriginal={mapaGerado}
          aoVoltar={(mapaEditado) => {
            setMapaEditor(mapaEditado);
            setEditorAberto(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="gerador-mapa__sobreposicao">
      <section className="gerador-mapa" role="dialog" aria-modal="true" aria-labelledby="titulo-gerador-mapa">
        <header className="gerador-mapa__cabecalho">
          <div><span>ORBE · Ferramenta de planejamento</span><h2 id="titulo-gerador-mapa">Gerador de Mapas</h2><p>Sistema: <strong>{sistema.nome}</strong></p></div>
          <button type="button" title="Fechar gerador de mapas" onClick={aoFechar}>Fechar</button>
        </header>
        {!sistema.disponivel ? <p className="gerador-mapa__aviso" role="status">Este sistema ainda não possui temas registrados no gerador.</p> : (
          <form onSubmit={(evento) => { evento.preventDefault(); gerarAutomaticamente(); }}>
            <SeletorModoGeracao modo={configuracoes.modo} aoAlterar={(modo) => alterar("modo", modo)} estados={estadosEtapas} mapa={mapaGerado} aoExecutar={executarPorPartes} />
            <ProgressoGeracaoMapa estados={estadosEtapas} visivel={gerando || Boolean(relatorio)} />
            <div className="gerador-mapa__conteudo">
              <ConfiguracoesGeradorMapa configuracoes={configuracoes} temas={temas} aoAlterar={alterar} aoAlterarTamanho={alterarTamanho} aoGerarSeed={() => alterar("seed", criarSeed(sistema.id, temas.find((item) => item.id === configuracoes.tema)))} />
              <PreviewGeradorMapa largura={configuracoes.largura} altura={configuracoes.altura} mapaGerado={mapaEmUso} desatualizado={configuracoesAlteradas} />
              {mapaEmUso?.validacaoEstrutural?.valido ? (
                <BotaoFinalizarComIA
                  mapa={mapaEmUso}
                  tema={mapaEmUso.tema || configuracoes.tema}
                  finalizacao={mapaEmUso.finalizacaoIA}
                  aoAplicarFinalizacao={aplicarFinalizacaoIA}
                  aoRemoverFinalizacao={removerFinalizacaoIA}
                />
              ) : null}
            </div>
            {mapaEmUso?.paredes?.length ? <PainelValidacaoMapa validacao={mapaEmUso.validacaoEstrutural} aoCorrigir={corrigirAutomaticamente} /> : null}
            {mapaEmUso?.validacaoEstrutural?.valido ? (
              <PainelPersistenciaMapa
                mapa={mapaEmUso}
                mesaId={mesaId}
                mapaGridAtual={mapaAtual}
                aoCarregarMapa={carregarMapaPersistido}
                aoAplicarGrid={aoAplicarMapa}
              />
            ) : null}
            <footer className="gerador-mapa__acoes">
              {mensagem ? <output className={`gerador-mapa__mensagem gerador-mapa__mensagem--${tipoMensagem}`} aria-live="polite">{mensagem}{ultimoMapaValido && tipoMensagem === "erro" ? " A última geração válida foi preservada." : ""}</output> : <span />}
              <button type="button" onClick={aoFechar}>Fechar</button>
              {configuracoes.modo !== "por-partes" ? <button className="gerador-mapa__gerar" type="submit" disabled={gerando}>{gerando ? "Gerando…" : "Gerar mapa"}</button> : null}
              {configuracoes.modo === "gerar-editar" && mapaEmUso?.validacaoEstrutural?.valido ? <button className="gerador-mapa__gerar" type="button" onClick={() => setEditorAberto(true)}>Abrir no editor</button> : null}
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}
