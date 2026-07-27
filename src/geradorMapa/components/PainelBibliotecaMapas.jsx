import { useRef, useState } from "react";
import { adaptarMapaGeradoParaGrid, removerMapaGeradoDoGrid } from "../integracao/adaptarMapaGeradoParaGrid.js";
import {
  atualizarIdentidadeRascunhoLocal,
  carregarRascunhoLocal,
  duplicarRascunhoLocal,
  listarRascunhosLocais,
  removerRascunhoLocal,
  salvarRascunhoLocal,
} from "../persistencia/rascunhosLocaisGerador.js";
import { desserializarMapa, serializarMapa } from "../persistencia/formatoMapaGerador.js";
import PainelGeradorMapa from "./PainelGeradorMapa.jsx";
import "../styles/bibliotecaMapas.css";

const ABAS = [
  ["mapas", "Meus mapas"],
  ["criar", "Criar mapa"],
  ["historico", "Histórico"],
  ["importar", "Importar"],
];

function baixarMapa(registro) {
  const blob = new Blob([serializarMapa(registro.mapa)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${registro.nome.replace(/[^\w-]+/g, "-").toLowerCase() || "mapa-orbe"}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PainelBibliotecaMapas({
  mesaId = "local",
  sistemaCampanha = "arquivos",
  mapaGridAtual = {},
  aoAlterarMapaGrid,
}) {
  const importacaoRef = useRef(null);
  const [aba, setAba] = useState("mapas");
  const [, setRevisao] = useState(0);
  const [geradorAberto, setGeradorAberto] = useState(false);
  const [mapaEdicao, setMapaEdicao] = useState(null);
  const [renomeando, setRenomeando] = useState(null);
  const [nome, setNome] = useState("");
  const [confirmacao, setConfirmacao] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const registros = listarRascunhosLocais(mesaId).map((resumo) => {
    const completo = carregarRascunhoLocal(resumo.id);
    return completo || resumo;
  });
  const aplicadoId = mapaGridAtual?.mapaAplicadoId || mapaGridAtual?.geradorMapa?.id || "";

  function atualizar() {
    setRevisao((valor) => valor + 1);
  }

  function abrirRegistro(registro) {
    setMapaEdicao(registro.mapa);
    setGeradorAberto(true);
  }

  function aplicar(registro) {
    const grid = adaptarMapaGeradoParaGrid(registro.mapa, mapaGridAtual);
    aoAlterarMapaGrid?.(grid);
    atualizarIdentidadeRascunhoLocal(registro.id, {
      status: "aplicado",
      aplicadoNaMesaId: mesaId,
      aplicacaoAtualId: grid.aplicacaoMapaId,
    });
    setMensagem(`“${registro.nome}” foi aplicado ao grid.`);
    atualizar();
  }

  function removerDoGrid() {
    aoAlterarMapaGrid?.(removerMapaGeradoDoGrid(mapaGridAtual));
    const atual = registros.find((item) => item.mapa?.id === aplicadoId || item.id === aplicadoId);
    if (atual) {
      atualizarIdentidadeRascunhoLocal(atual.id, {
        status: "pronto",
        aplicadoNaMesaId: "",
        aplicacaoAtualId: "",
      });
    }
    setConfirmacao(null);
    setMensagem("O mapa foi removido do grid. Tokens, NPCs e elementos manuais foram preservados.");
    atualizar();
  }

  async function importar(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    try {
      const mapa = desserializarMapa(await arquivo.text());
      const salvo = salvarRascunhoLocal({
        mesaId,
        nome: mapa.nome || arquivo.name.replace(/\.json$/i, ""),
        mapa,
      });
      setMapaEdicao(salvo.mapa);
      setAba("mapas");
      setMensagem("Mapa importado para a biblioteca. Abra-o no editor antes de aplicar.");
      atualizar();
    } catch (erro) {
      setMensagem(erro?.message || "Não foi possível importar o mapa.");
    }
  }

  function excluir(registro) {
    if (registro.mapa?.id === aplicadoId || registro.id === aplicadoId) {
      setMensagem("Remova o mapa do grid antes de excluí-lo definitivamente.");
      return;
    }
    removerRascunhoLocal(registro.id);
    setConfirmacao(null);
    setMensagem("Mapa excluído definitivamente da biblioteca local.");
    atualizar();
  }

  return (
    <section className="biblioteca-mapas">
      <header className="biblioteca-mapas__cabecalho">
        <div><span>Arquivo cartográfico</span><h2>Gerador de Mapas</h2></div>
        {aplicadoId ? <button type="button" onClick={() => setConfirmacao({ tipo: "remover-grid" })}>Remover mapa do grid</button> : null}
      </header>
      <nav className="biblioteca-mapas__abas" aria-label="Seções da biblioteca">
        {ABAS.map(([id, rotulo]) => <button key={id} type="button" aria-current={aba === id ? "page" : undefined} onClick={() => setAba(id)}>{rotulo}</button>)}
      </nav>
      {mensagem ? <p className="biblioteca-mapas__mensagem" aria-live="polite">{mensagem}</p> : null}

      {aba === "mapas" ? (
        <div className="biblioteca-mapas__lista">
          {registros.length ? registros.map((registro) => {
            const estaAplicado = registro.mapa?.id === aplicadoId || registro.id === aplicadoId;
            return (
              <article className="biblioteca-mapas__item" key={registro.id}>
                <img src={registro.miniatura} alt={`Miniatura de ${registro.nome}`} />
                <div className="biblioteca-mapas__identidade">
                  <strong>{registro.nome}</strong>
                  <span>{registro.tema} · {registro.sistema || "arquivos"} · {registro.largura} × {registro.altura}</span>
                  <small>{registro.quantidadeSalas || registro.mapa?.salas?.length || 0} salas · seed {registro.seed}</small>
                </div>
                <div className="biblioteca-mapas__estado">
                  <b>{estaAplicado ? "Aplicado" : registro.status || "Rascunho"}</b>
                  <small>Atualizado {new Date(registro.atualizadoEm).toLocaleString("pt-BR")}</small>
                </div>
                <div className="biblioteca-mapas__acoes">
                  <button type="button" onClick={() => abrirRegistro(registro)}>Abrir / editar</button>
                  {!estaAplicado ? <button type="button" onClick={() => aplicar(registro)}>Aplicar</button> : <button type="button" onClick={() => setConfirmacao({ tipo: "remover-grid" })}>Remover do grid</button>}
                  <button type="button" onClick={() => { setRenomeando(registro); setNome(registro.nome); }}>Renomear</button>
                  <button type="button" onClick={() => { duplicarRascunhoLocal(registro.id); atualizar(); }}>Duplicar</button>
                  <button type="button" onClick={() => baixarMapa(registro)}>Exportar</button>
                  <button type="button" onClick={() => { atualizarIdentidadeRascunhoLocal(registro.id, { status: "modelo" }); atualizar(); }}>Salvar modelo</button>
                  {!estaAplicado ? <button className="perigo" type="button" onClick={() => setConfirmacao({ tipo: "excluir", registro })}>Excluir</button> : null}
                </div>
              </article>
            );
          }) : <p className="biblioteca-mapas__vazio">Nenhum mapa salvo. Use “Criar mapa” para começar.</p>}
        </div>
      ) : null}

      {aba === "criar" ? (
        <div className="biblioteca-mapas__chamada">
          <span>Nova planta</span><h3>Planeje uma nova cena</h3>
          <p>Escolha tema, tamanho e complexidade; depois salve ou aplique o resultado.</p>
          <button type="button" onClick={() => { setMapaEdicao(null); setGeradorAberto(true); }}>Abrir gerador</button>
        </div>
      ) : null}

      {aba === "historico" ? (
        <div className="biblioteca-mapas__historico">
          {registros.filter((item) => item.status === "aplicado" || item.aplicadoNaMesaId).map((item) => (
            <p key={item.id}><strong>{item.nome}</strong><span>{item.aplicadoNaMesaId ? `Mesa ${item.aplicadoNaMesaId}` : "Aplicação anterior"} · {new Date(item.atualizadoEm).toLocaleString("pt-BR")}</span></p>
          ))}
          {!registros.some((item) => item.status === "aplicado" || item.aplicadoNaMesaId) ? <p>Nenhuma aplicação registrada neste navegador.</p> : null}
        </div>
      ) : null}

      {aba === "importar" ? (
        <div className="biblioteca-mapas__chamada">
          <span>Intercâmbio</span><h3>Importar JSON do ORBE</h3>
          <p>O arquivo será validado, salvo na biblioteca e poderá ser aberto no editor antes da aplicação.</p>
          <button type="button" onClick={() => importacaoRef.current?.click()}>Escolher arquivo</button>
          <input ref={importacaoRef} hidden type="file" accept=".json,application/json" onChange={importar} />
        </div>
      ) : null}

      {renomeando ? (
        <div className="biblioteca-mapas__modal" role="dialog" aria-modal="true" aria-labelledby="renomear-mapa">
          <form onSubmit={(evento) => {
            evento.preventDefault();
            try {
              atualizarIdentidadeRascunhoLocal(renomeando.id, { nome });
              setRenomeando(null); atualizar();
            } catch (erro) { setMensagem(erro.message); }
          }}>
            <h3 id="renomear-mapa">Renomear mapa</h3>
            <label>Novo nome<input autoFocus value={nome} maxLength={80} onChange={(evento) => setNome(evento.target.value)} /></label>
            <div><button type="button" onClick={() => setRenomeando(null)}>Cancelar</button><button type="submit">Salvar nome</button></div>
          </form>
        </div>
      ) : null}

      {confirmacao ? (
        <div className="biblioteca-mapas__modal" role="dialog" aria-modal="true">
          <div>
            <h3>{confirmacao.tipo === "excluir" ? "Excluir mapa?" : "Remover mapa do grid?"}</h3>
            <p>{confirmacao.tipo === "excluir" ? "Esta ação remove o registro salvo. Ela não pode ser desfeita." : "A biblioteca será preservada. Tokens, NPCs e elementos manuais continuarão no grid."}</p>
            <div><button type="button" onClick={() => setConfirmacao(null)}>Cancelar</button><button className="perigo" type="button" onClick={() => confirmacao.tipo === "excluir" ? excluir(confirmacao.registro) : removerDoGrid()}>{confirmacao.tipo === "excluir" ? "Excluir definitivamente" : "Remover do grid"}</button></div>
          </div>
        </div>
      ) : null}

      {geradorAberto ? (
        <PainelGeradorMapa
          sistemaCampanha={sistemaCampanha}
          mesaId={mesaId}
          mapaAtual={mapaGridAtual}
          mapaInicial={mapaEdicao}
          aoAplicarMapa={(grid) => { aoAlterarMapaGrid?.(grid); setGeradorAberto(false); atualizar(); }}
          aoFechar={() => { setGeradorAberto(false); atualizar(); }}
        />
      ) : null}
    </section>
  );
}
