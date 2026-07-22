import { useEffect, useState } from "react";
import { Link } from "react-router";

import PortalLayout from "../components/portal/PortalLayout.jsx";
import useMesasOrbe from "../hooks/useMesasOrbe.js";
import { criarFichaArquivosVazia, listarFichasArquivos, salvarFichaArquivos } from "../utils/fichasArquivos.js";
import { lerUsuarioAtual } from "../utils/contasOrbe.js";

export default function PaginaPortalFichas() {
  const [mesas] = useMesasOrbe();
  const usuario = lerUsuarioAtual();
  const [mesaId, setMesaId] = useState(mesas[0]?.id || "");
  const [nome, setNome] = useState("");
  const [versao, setVersao] = useState(0);
  const fichas = mesas.flatMap((mesa) => listarFichasArquivos(mesa.id).map((ficha) => ({ ...ficha, mesa })));

  useEffect(() => {
    if ((!mesaId || !mesas.some((mesa) => mesa.id === mesaId)) && mesas[0]?.id) {
      setMesaId(mesas[0].id);
    }
  }, [mesaId, mesas]);

  function criar(evento) {
    evento.preventDefault();
    if (!mesaId || !nome.trim()) return;
    salvarFichaArquivos(mesaId, criarFichaArquivosVazia({ nome: nome.trim(), jogador: usuario?.nome || usuario?.usuario || "Jogador", jogadorId: usuario?.id || "", origemFicha: "pessoal" }));
    setNome("");
    setVersao((atual) => atual + 1);
  }
  void versao;

  return (
    <PortalLayout titulo="Fichas de personagem" subtitulo="Seus agentes do sistema Arquivos, organizados por campanha.">
      <section className="portal-grade" style={{ gridTemplateColumns: "minmax(280px,.75fr) minmax(0,1.65fr)" }}>
        <article className="portal-card"><span className="portal-etiqueta">Criar ficha</span><h2>Novo agente</h2>{mesas.length ? <form className="portal-form" onSubmit={criar}><label>Nome do personagem<input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Helena Duarte" /></label><label>Mesa<select value={mesaId} onChange={(e) => setMesaId(e.target.value)}>{mesas.map((mesa) => <option key={mesa.id} value={mesa.id}>{mesa.nomeCampanha}</option>)}</select></label><button className="portal-botao" type="submit">Criar ficha</button></form> : <><p>Crie uma mesa antes de preparar o primeiro agente.</p><Link className="portal-botao" to="/arquivos/nova-mesa">Criar mesa</Link></>}</article>
        <section className="portal-painel"><span className="portal-etiqueta">Arquivo pessoal</span><h2>Minhas fichas</h2>{fichas.length ? <div className="portal-lista">{fichas.map((ficha) => <article className="portal-lista__item" key={`${ficha.mesa.id}-${ficha.id}`}><div><span className="portal-etiqueta">{ficha.mesa.nomeCampanha}</span><h3>{ficha.nome || "Agente sem nome"}</h3><p>{ficha.classe} · NEX {ficha.nex} · {ficha.jogador || "Sem responsável"}</p></div><Link className="portal-botao" to={`/arquivos/jogador/${ficha.mesa.id}`}>Abrir ficha</Link></article>)}</div> : <p className="portal-vazio">Nenhuma ficha encontrada.</p>}</section>
      </section>
    </PortalLayout>
  );
}
