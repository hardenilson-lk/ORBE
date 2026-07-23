import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";

import Dados3D from "../components/Dados3D.jsx";
import { ComunicacaoMesa } from "../comunicacao/index.js";
import PainelFichas from "../components/mestre/PainelFichas.jsx";
import PainelInventario from "../components/mestre/PainelInventario.jsx";
import PainelMapa from "../components/mestre/PainelMapa.jsx";
import MenuJogador from "../components/jogador/MenuJogador.jsx";
import PaineisJogador from "../components/jogador/PaineisJogador.jsx";
import MesaSonoraJogador from "../components/jogador/MesaSonoraJogador.jsx";
import { MesaSonoraLiveKitProvider } from "../components/mestre/mesaSonora/livekit/MesaSonoraLiveKitContext.jsx";

import {
  criarFichaArquivosVazia,
  carregarFichasArquivosConectadas,
  listarFichasArquivos,
  salvarFichaArquivosConectada,
} from "../utils/fichasArquivos.js";
import { lerUsuarioAtual } from "../utils/contasOrbe.js";
import { lerMesasSalvas } from "../utils/mesas.js";
import {
  carregarSessaoArquivos,
  salvarSessaoArquivos,
} from "../utils/sessoesArquivos.js";
import useRealtimeMesaOrbe from "../hooks/useRealtimeMesaOrbe.js";

import "./PaginaJogador.css";

const TITULOS = {
  mapa: "Mapa de combate",
  ficha: "Ficha do agente",
  inventario: "Inventário",
  anotacoes: "Anotações pessoais",
  missoes: "Missões da equipe",
  arquivos: "Arquivos liberados",
};

function listaSegura(valor) {
  return Array.isArray(valor) ? valor : [];
}

function porcentagem(atual, maximo) {
  const limite = Math.max(1, Number(maximo) || 1);
  return Math.max(0, Math.min(100, ((Number(atual) || 0) / limite) * 100));
}

function PaginaJogador() {
  const { mesaId = "local" } = useParams();
  const dadosRef = useRef(null);
  const [sessao, setSessao] = useState(() => carregarSessaoArquivos(mesaId));
  const [fichas, setFichas] = useState(() => listarFichasArquivos(mesaId));
  const [menuAtivo, setMenuAtivo] = useState("mapa");
  const [selecaoAberta, setSelecaoAberta] = useState(true);
  const [nomeJogador, setNomeJogador] = useState("");
  const [nomePersonagem, setNomePersonagem] = useState("");
  const [fichaId, setFichaId] = useState(() => localStorage.getItem(`orbe:jogador:ficha:${mesaId}`) || "");
  const [tipoDado, setTipoDado] = useState("d20");
  const [quantidade, setQuantidade] = useState(1);
  const [modificador, setModificador] = useState(0);
  const [resultado, setResultado] = useState("Pronto para rolar.");
  const [mensagemSistema, setMensagemSistema] = useState("Conectado ao arquivo da campanha.");
  const [menuRecolhido, setMenuRecolhido] = useState(() => localStorage.getItem("orbe:jogador:menu-recolhido") === "true");

  const mesa = lerMesasSalvas().find((item) => String(item.id) === String(mesaId));
  const usuarioPortal = lerUsuarioAtual();
  const usuarioPortalId = usuarioPortal?.id || "";
  const usuarioPortalNome = usuarioPortal?.nome || usuarioPortal?.usuario || "";
  const nomeCampanha = mesa?.nomeCampanha || mesa?.nome || "Campanha";
  const arquivoAtual = sessao.arquivoAtual || mesa?.arquivoInicial || "ARQUIVO 0001";
  const fichasDisponiveis = useMemo(() => usuarioPortalId
    ? fichas.filter((ficha) =>
        ficha.jogadorId === usuarioPortalId ||
        String(ficha.jogador || "").trim().toLocaleLowerCase("pt-BR") === usuarioPortalNome.trim().toLocaleLowerCase("pt-BR") ||
        (!ficha.jogadorId && !ficha.jogador && fichas.length === 1),
      )
    : fichas, [fichas, usuarioPortalId, usuarioPortalNome]);
  const fichaAtiva = fichasDisponiveis.find((ficha) => ficha.id === fichaId) || null;
  const fichaAtivaId = fichaAtiva?.id;
  const fichaAtivaNome = fichaAtiva?.nome;
  const fichaAtivaJogador = fichaAtiva?.jogador;

  const { online: realtimeOnline, pronto: realtimePronto } = useRealtimeMesaOrbe({
    mesaId,
    aoSessao: setSessao,
    aoFichas: setFichas,
    aoStatus: setMensagemSistema,
    aoErro: (erro) => {
      console.warn("Sincronização em tempo real do jogador indisponível.", erro);
      setMensagemSistema("Conexão em tempo real indisponível. Os dados locais foram preservados.");
    },
  });

  useEffect(() => {
    if (realtimeOnline && !realtimePronto) return;
    if (!usuarioPortalId) return;
    setSessao((anterior) => {
      const jogadores = listaSegura(anterior.jogadores);
      const existente = jogadores.find((jogador) => jogador.id === usuarioPortalId);
      const registro = {
        ...(existente || {}),
        id: usuarioPortalId,
        nome: usuarioPortalNome || "Jogador",
        online: true,
        atualizadoEm: new Date().toISOString(),
      };
      return salvarSessaoArquivos(mesaId, {
        ...anterior,
        jogadores: [...jogadores.filter((jogador) => jogador.id !== usuarioPortalId), registro],
      });
    });
  }, [mesaId, realtimeOnline, realtimePronto, usuarioPortalId, usuarioPortalNome]);

  useEffect(() => {
    if (!fichaId && fichasDisponiveis.length === 1) {
      const unicaFicha = fichasDisponiveis[0];
      setFichaId(unicaFicha.id);
      localStorage.setItem(`orbe:jogador:ficha:${mesaId}`, unicaFicha.id);
      setSelecaoAberta(false);
      return;
    }

    if (fichaId && fichasDisponiveis.some((ficha) => ficha.id === fichaId)) {
      setSelecaoAberta(false);
    }
  }, [fichaId, fichasDisponiveis, mesaId]);

  useEffect(() => {
    function sincronizar(evento) {
      if (evento.key === `orbe:arquivos:sessao:${mesaId}`) {
        setSessao(carregarSessaoArquivos(mesaId));
      }
      if (evento.key === `orbe:arquivos:fichas:${mesaId}`) {
        setFichas(listarFichasArquivos(mesaId));
      }
    }

    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, [mesaId]);

  useEffect(() => {
    if (realtimeOnline && !realtimePronto) return;
    if (!fichaAtivaId) return;

    setSessao((anterior) => {
      const jogadorId = usuarioPortalId || `jogador-${fichaAtivaId}`;
      const jogadores = listaSegura(anterior.jogadores);
      const registro = {
        id: jogadorId,
        fichaId: fichaAtivaId,
        nome: usuarioPortalNome || fichaAtivaJogador || fichaAtivaNome || "Jogador",
        personagem: fichaAtivaNome || "Agente",
        online: true,
        atualizadoEm: new Date().toISOString(),
      };
      const atualizados = [
        ...jogadores.filter((jogador) => jogador.id !== jogadorId && jogador.fichaId !== fichaAtivaId),
        registro,
      ];
      return salvarSessaoArquivos(mesaId, { ...anterior, jogadores: atualizados });
    });
  }, [fichaAtivaId, fichaAtivaJogador, fichaAtivaNome, mesaId, realtimeOnline, realtimePronto, usuarioPortalId, usuarioPortalNome]);

  function persistirSessao(alteracoes) {
    setSessao((anterior) => {
      const proxima = typeof alteracoes === "function" ? alteracoes(anterior) : { ...anterior, ...alteracoes };
      return salvarSessaoArquivos(mesaId, proxima);
    });
  }

  async function salvarFicha(ficha) {
    if (fichaAtiva?.editLocked) {
      setMensagemSistema("Esta ficha está bloqueada pelo mestre para edição.");
      return fichaAtiva;
    }
    try {
      const salva = await salvarFichaArquivosConectada(mesaId, ficha, {
        usarUsuarioAutenticadoComoResponsavel: true,
      });
      setFichas(listarFichasArquivos(mesaId));
      setFichaId(salva.id);
      localStorage.setItem(`orbe:jogador:ficha:${mesaId}`, salva.id);
      setMensagemSistema("Sua ficha foi salva.");
      return salva;
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível salvar sua ficha online.");
      return null;
    }
  }

  function escolherFicha(ficha) {
    setFichaId(ficha.id);
    localStorage.setItem(`orbe:jogador:ficha:${mesaId}`, ficha.id);
    setSelecaoAberta(false);
    setMensagemSistema(`Agente ${ficha.nome || "selecionado"} vinculado.`);
  }

  async function criarFicha(evento) {
    evento.preventDefault();
    if (!nomePersonagem.trim()) return;
    let ficha;
    try {
      ficha = await salvarFichaArquivosConectada(mesaId, criarFichaArquivosVazia({
        nome: nomePersonagem.trim(),
        jogador: usuarioPortalNome || nomeJogador.trim() || nomePersonagem.trim(),
        jogadorId: usuarioPortalId,
        origemFicha: "pessoal",
      }), { usarUsuarioAutenticadoComoResponsavel: true });
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível criar sua ficha online.");
      return;
    }
    setFichas(listarFichasArquivos(mesaId));
    escolherFicha(ficha);
    setNomeJogador("");
    setNomePersonagem("");
  }

  function atualizarInventario(operacao, item) {
    if (!fichaAtiva) return;
    const inventario = listaSegura(fichaAtiva.inventario);
    let atualizado = inventario;
    if (operacao === "adicionar") atualizado = [item, ...inventario];
    if (operacao === "atualizar") atualizado = inventario.map((atual) => atual.id === item.id ? item : atual);
    if (operacao === "remover") atualizado = inventario.filter((atual) => atual.id !== item.id);
    salvarFicha({ ...fichaAtiva, inventario: atualizado });
  }

  function finalizarRolagem(resultados) {
    const grupo = Array.isArray(resultados) ? resultados[0] : resultados;
    const valores = listaSegura(grupo?.rolls).map((item) => Number(item.value)).filter(Number.isFinite);
    const soma = valores.length ? valores.reduce((total, valor) => total + valor, 0) : Number(grupo?.value) || 0;
    const bonus = Number(grupo?.modifier ?? modificador) || 0;
    const total = Number.isFinite(Number(grupo?.value)) ? Number(grupo.value) : soma + bonus;
    const expressao = `${valores.length > 1 ? valores.join(" + ") : soma}${bonus > 0 ? ` + ${bonus}` : bonus < 0 ? ` - ${Math.abs(bonus)}` : ""}`;
    setResultado(`${expressao} = ${total}`);
    persistirSessao((anterior) => ({
      ...anterior,
      historicoRolagens: [{
        id: `rolagem-${Date.now()}-${Math.random()}`,
        nome: fichaAtiva?.nome || "Jogador",
        tipo: tipoDado,
        quantidade: Number(quantidade) || 1,
        valores: valores.length ? valores : [soma],
        modificador: bonus,
        total,
        resultado: total,
        criadoEm: new Date().toISOString(),
      }, ...listaSegura(anterior.historicoRolagens)].slice(0, 50),
    }));
  }

  async function rolarDado() {
    if (!dadosRef.current?.rolar) return;
    setResultado("Rolando...");
    try {
      await dadosRef.current.rolar({
        qty: Math.max(1, Math.min(10, Number(quantidade) || 1)),
        sides: Number(tipoDado.replace("d", "")),
        modifier: Number(modificador) || 0,
      });
    } catch {
      setResultado("Não foi possível realizar a rolagem.");
    }
  }

  async function recarregar() {
    setSessao(carregarSessaoArquivos(mesaId));
    try {
      setFichas(await carregarFichasArquivosConectadas(mesaId));
      setMensagemSistema("Campanha atualizada.");
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível carregar as fichas online.");
    }
  }

  function alternarMenuPrincipal() {
    setMenuRecolhido((valorAtual) => {
      const proximo = !valorAtual;
      localStorage.setItem("orbe:jogador:menu-recolhido", String(proximo));
      return proximo;
    });
  }

  function renderizarConteudo() {
    if (!fichaAtiva) return null;

    if (menuAtivo === "ficha") {
      return <><div className={fichaAtiva.editLocked ? "pagina-jogador__permissao pagina-jogador__permissao--bloqueada" : "pagina-jogador__permissao"}>{fichaAtiva.editLocked ? "Edição bloqueada pelo mestre. Você pode consultar a ficha, mas não salvar alterações." : "Edição liberada pelo mestre. Esta é a mesma ficha compartilhada na sessão."}</div><PainelFichas fichas={[fichaAtiva]} fichaSelecionada={fichaAtiva} aoSalvarFicha={salvarFicha} aoSelecionarFicha={escolherFicha} permitirNovaFicha={false} /></>;
    }

    if (menuAtivo === "inventario") {
      return <PainelInventario fichaAtiva={fichaAtiva} itens={fichaAtiva.inventario || []} aoAdicionarItem={(item) => atualizarInventario("adicionar", item)} aoAtualizarItem={(item) => atualizarInventario("atualizar", item)} aoRemoverItem={(item) => atualizarInventario("remover", item)} />;
    }

    if (["anotacoes", "missoes", "arquivos"].includes(menuAtivo)) {
      return <PaineisJogador tipo={menuAtivo} ficha={fichaAtiva} missoes={sessao.missoes || []} arquivos={sessao.arquivos || []} aoSalvarFicha={salvarFicha} />;
    }

    if (sessao.mesaVisivel === false) {
      return (
        <section className="pagina-jogador__mapa-oculto">
          <span>Transmissão protegida</span>
          <h2>O mestre ocultou a mesa</h2>
          <p>Aguarde enquanto a próxima cena ou revelação é preparada.</p>
          <button type="button" onClick={recarregar}>Verificar novamente</button>
        </section>
      );
    }

    return <PainelMapa papelAtual="jogador" jogadorAtualId={fichaAtiva.id} arquivoInicial={arquivoAtual} mapa={sessao.mapa} fichas={[fichaAtiva]} aoAtualizarFicha={salvarFicha} aoAlterarMapa={(mapa) => persistirSessao({ mapa })} aoAlterarMensagem={setMensagemSistema} />;
  }

  const trilhaAtiva = listaSegura(sessao.trilhas).find((trilha) => trilha.id === sessao.trilhaAtivaId);
  const missaoAtiva = listaSegura(sessao.missoes).find((missao) => missao.status === "ativa" && missao.privada !== true);

  return (
    <MesaSonoraLiveKitProvider mesaId={mesaId}>
    <div className={menuRecolhido ? "pagina-jogador pagina-jogador--menu-recolhido" : "pagina-jogador"}>
      <Dados3D ref={dadosRef} aoFinalizar={finalizarRolagem} />

      <MenuJogador
        nomeCampanha={nomeCampanha}
        arquivoAtual={arquivoAtual}
        menuAtivo={menuAtivo}
        ficha={fichaAtiva}
        aoSelecionarMenu={setMenuAtivo}
        aoTrocarPersonagem={() => setSelecaoAberta(true)}
        aoAtualizar={recarregar}
        recolhido={menuRecolhido}
        aoAlternarRecolhido={alternarMenuPrincipal}
      />

      <main className="pagina-jogador__conteudo">
        <header className="pagina-jogador__topo">
          <div><span>Sistema Arquivos · acesso de agente</span><h1>{TITULOS[menuAtivo]}</h1><p>{nomeCampanha} — {arquivoAtual}</p></div>
          <div className="pagina-jogador__estado"><span>Status do sistema</span><strong>{mensagemSistema}</strong></div>
        </header>

        <div className="pagina-jogador__corpo">
          <section className="pagina-jogador__principal">{renderizarConteudo()}</section>

          <aside className="pagina-jogador__lateral">
            {fichaAtiva ? (
              <section className="resumo-jogador">
                <header><span>Arquivo pessoal</span><h2>{fichaAtiva.nome || "Agente"}</h2><p>{fichaAtiva.classe} · NEX {fichaAtiva.nex}</p></header>
                {[['PV', fichaAtiva.pvAtual, fichaAtiva.pvMaximo, 'pv'], ['PE', fichaAtiva.peAtual, fichaAtiva.peMaximo, 'pe'], ['SAN', fichaAtiva.sanAtual, fichaAtiva.sanMaximo, 'san']].map(([nome, atual, maximo, classe]) => (
                  <div className="resumo-jogador__recurso" key={nome}><div><strong>{nome}</strong><span>{atual}/{maximo}</span></div><i><span className={`resumo-jogador__barra--${classe}`} style={{ width: `${porcentagem(atual, maximo)}%` }} /></i></div>
                ))}
                <div className="resumo-jogador__dados"><span>Defesa <strong>{fichaAtiva.defesa}</strong></span><span>Desloc. <strong>{fichaAtiva.deslocamento}m</strong></span><span>Carga <strong>{fichaAtiva.cargaAtual}/{fichaAtiva.cargaMaxima}</strong></span></div>
                <button type="button" onClick={() => setMenuAtivo("ficha")}>Abrir ficha completa</button>
              </section>
            ) : null}

            <section className="rolador-jogador">
              <header><span>Rolador pessoal</span><h2>Dados 3D</h2></header>
              <div><label>Qtd.<input type="number" min="1" max="10" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} /></label><label>Dado<select value={tipoDado} onChange={(e) => setTipoDado(e.target.value)}>{[20, 12, 10, 8, 6, 4].map((lado) => <option value={`d${lado}`} key={lado}>d{lado}</option>)}</select></label><label>Mod.<input type="number" value={modificador} onChange={(e) => setModificador(e.target.value)} /></label></div>
              <button type="button" onClick={rolarDado}>Rolar dado</button>
              <strong>{resultado}</strong>
            </section>

            <ComunicacaoMesa
              mesaId={mesaId}
              jogadores={sessao.jogadores || []}
              nomeLocal={fichaAtiva?.jogador || fichaAtiva?.nome || "Jogador"}
              papelLocal="Jogador"
            />

            <MesaSonoraJogador />

            <section className="transmissao-jogador">
              <span>Objetivo atual</span>
              <h2>{missaoAtiva?.titulo || "Aguardando missão"}</h2>
              <p>{missaoAtiva?.descricao || "O mestre ainda não transmitiu um novo objetivo."}</p>
              <div><small>Trilha da mesa</small><strong>{trilhaAtiva?.nome || trilhaAtiva?.titulo || "Nenhuma trilha ativa"}</strong>{trilhaAtiva?.url ? <a href={trilhaAtiva.url} target="_blank" rel="noreferrer">Abrir áudio</a> : null}</div>
            </section>
          </aside>
        </div>
      </main>

      {selecaoAberta ? (
        <div className="selecao-agente" role="dialog" aria-modal="true" aria-labelledby="selecao-agente-titulo">
          <section>
            <header><span>Identificação obrigatória</span><h2 id="selecao-agente-titulo">Quem entra no arquivo?</h2><p>Escolha a ficha que representa você nesta campanha.</p></header>
            {fichasDisponiveis.length ? <div className="selecao-agente__lista">{fichasDisponiveis.map((ficha) => <button type="button" key={ficha.id} onClick={() => escolherFicha(ficha)}><span>{String(ficha.nome || "AG").slice(0, 2).toUpperCase()}</span><div><strong>{ficha.nome || "Agente sem nome"}</strong><small>{ficha.jogador || "Jogador não informado"} · {ficha.classe} · NEX {ficha.nex}</small></div><i>Entrar</i></button>)}</div> : <p className="selecao-agente__sem-ficha">O mestre ainda não atribuiu uma ficha à sua conta. Você também pode criar uma ficha pessoal abaixo.</p>}
            <form onSubmit={criarFicha}><h3>Criar ficha de jogador</h3><label>Seu nome<input maxLength="40" value={nomeJogador} onChange={(e) => setNomeJogador(e.target.value)} placeholder="Nome do jogador" /></label><label>Nome do agente<input required maxLength="40" value={nomePersonagem} onChange={(e) => setNomePersonagem(e.target.value)} placeholder="Nome do personagem" /></label><button type="submit">Criar e entrar</button></form>
            {fichaAtiva ? <button className="selecao-agente__fechar" type="button" onClick={() => setSelecaoAberta(false)}>Continuar com {fichaAtiva.nome}</button> : null}
            <Link to="/mesas">Voltar ao portal</Link>
          </section>
        </div>
      ) : null}
    </div>
    </MesaSonoraLiveKitProvider>
  );
}

export default PaginaJogador;
