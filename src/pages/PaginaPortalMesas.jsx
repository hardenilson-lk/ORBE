import { useState } from "react";
import { Link, useNavigate } from "react-router";

import PortalLayout from "../components/portal/PortalLayout.jsx";
import useMesasOrbe from "../hooks/useMesasOrbe.js";
import { entrarMesaRemota, mensagemErroConviteOrbe, orbeOnlineHabilitado } from "../services/supabaseOrbe.js";
import { lerUsuarioAtual } from "../utils/contasOrbe.js";
import { aplicarMesaRemota, formatarData } from "../utils/mesas.js";

export default function PaginaPortalMesas() {
  const navegar = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [carregandoConvite, setCarregandoConvite] = useState(false);
  const [mesas, setMesas] = useMesasOrbe();

  async function entrar(evento) {
    evento.preventDefault();
    const valor = codigo.trim().toUpperCase();
    if (orbeOnlineHabilitado()) {
      if (carregandoConvite) return;
      setCarregandoConvite(true);
      try {
        const mesa = await entrarMesaRemota(valor);
        if (mesa.statusEntrada === "pendente") {
          setErro("Solicitação enviada. Aguarde o mestre aprovar sua entrada.");
          setCodigo("");
          return;
        }
        setMesas(aplicarMesaRemota(mesa));
        navegar(`/arquivos/jogador/${mesa.id}`);
        return;
      } catch (falha) {
        setErro(mensagemErroConviteOrbe(falha));
        return;
      } finally {
        setCarregandoConvite(false);
      }
    }
    const mesa = mesas.find((item) => String(item.codigoConvite || `ORBE-${String(item.id).slice(-6).toUpperCase()}`).toUpperCase() === valor);
    if (!mesa) return setErro("Código não encontrado neste navegador.");
    navegar(`/arquivos/jogador/${mesa.id}`);
  }

  return (
    <PortalLayout titulo="Mesas e campanhas" subtitulo={`Campanhas disponíveis para ${lerUsuarioAtual()?.nome || "você"}.`}>
      <section className="portal-grade">
        <article className="portal-card"><span className="portal-etiqueta">Nova campanha</span><h2>Criar mesa</h2><p>Abra uma investigação no sistema Arquivos e receba um código de convite.</p><Link className="portal-botao" to="/arquivos/nova-mesa">Criar mesa</Link></article>
        <article className="portal-card"><span className="portal-etiqueta">Convite</span><h2>Entrar em uma mesa</h2><form className="portal-form" onSubmit={entrar}><label>Código<input required value={codigo} onChange={(e) => { setCodigo(e.target.value); setErro(""); }} placeholder="ORBE-000000" /></label>{erro ? <small className="portal-erro">{erro}</small> : null}<button className="portal-botao" type="submit" disabled={carregandoConvite}>{carregandoConvite ? "Entrando..." : "Entrar como jogador"}</button></form></article>
        <article className="portal-card"><span className="portal-etiqueta">Sistema atual</span><h2>Arquivos</h2><p>O grid, escudo, dados, missões, arquivos e fichas permanecem exatamente no sistema novo.</p><Link className="portal-botao" to="/arquivos">Abrir central Arquivos</Link></article>
      </section>
      <section className="portal-painel" style={{ marginTop: 20 }}><h2>Campanhas</h2>{mesas.length ? <div className="portal-lista">{mesas.map((mesa) => <article className="portal-lista__item" key={mesa.id}><div><span className="portal-etiqueta">{mesa.arquivoInicial || "ARQUIVO 0001"} · {formatarData(mesa.criadaEm)}</span><h3>{mesa.nomeCampanha || mesa.nome}</h3><p>{mesa.descricao || "Investigação sem descrição."}</p></div><div className="portal-acoes"><Link className="portal-botao" to={`/arquivos/mesa/${mesa.id}`}>Mestre</Link><Link className="portal-botao" to={`/arquivos/jogador/${mesa.id}`}>Jogador</Link></div></article>)}</div> : <p className="portal-vazio">Nenhuma campanha criada ainda.</p>}</section>
    </PortalLayout>
  );
}
