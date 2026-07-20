import { useState } from "react";
import { useNavigate } from "react-router";

import logoOrbe from "../assets/logo.png";
import { criarContaOrbeConectada, entrarContaOrbeConectada, lerUsuarioAtual } from "../utils/contasOrbe.js";
import { lerMesasSalvas } from "../utils/mesas.js";
import { orbeOnlineHabilitado } from "../services/supabaseOrbe.js";

import "./PaginaLogin.css";

export default function PaginaLogin() {
  const navegar = useNavigate();
  const [modo, setModo] = useState("entrar");
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  if (lerUsuarioAtual() && modo === "entrar" && !usuario && !senha) {
    // A sessão continua disponível, mas a tela permanece acessível para trocar de conta.
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      if (modo === "criar") await criarContaOrbeConectada({ nome, usuario, email, senha });
      else await entrarContaOrbeConectada(usuario, senha);
      navegar("/inicio");
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  }

  function entrarComConvite(evento) {
    evento.preventDefault();
    const normalizado = codigo.trim().toUpperCase();
    const mesa = lerMesasSalvas().find((item) => {
      const convite = item.codigoConvite || `ORBE-${String(item.id).slice(-6).toUpperCase()}`;
      return String(convite).trim().toUpperCase() === normalizado;
    });
    if (!mesa) {
      setErro("Convite não encontrado neste navegador.");
      return;
    }
    navegar(`/arquivos/jogador/${mesa.id}`);
  }

  return (
    <main className="login-orbe">
      <nav className="login-orbe__nav"><span>✕</span><a href="#sobre">Sobre o ORBE</a><a href="#recursos">Recursos</a><a href="/sistemas">Sistemas</a><a href="#ajuda">Ajuda</a></nav>
      <section className="login-orbe__conteudo">
        <img className="login-orbe__logo" src={logoOrbe} alt="ORBE" />
        <p className="login-orbe__chamada">Plataforma para reunir sua mesa de RPG</p>
        <div className="login-orbe__grade">
          <section className="login-orbe__painel">
            <header><span>Acesso ao ORBE</span><h1>{modo === "criar" ? "Criar novo acesso" : modo === "convite" ? "Entrar com convite" : "Abra seu portal"}</h1></header>
            {modo === "convite" ? (
              <form className="login-orbe__form" onSubmit={entrarComConvite}>
                <label>Código da campanha<input autoFocus required value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="ORBE-000000" /></label>
                <button className="login-orbe__principal" type="submit">Localizar mesa <span>→</span></button>
              </form>
            ) : (
              <form className="login-orbe__form" onSubmit={enviar}>
                {modo === "criar" ? <><label>Seu nome<input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como devemos chamar você?" /></label><label>E-mail {orbeOnlineHabilitado() ? "da conta online" : "(opcional no modo local)"}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" /></label></> : null}
                <label>{orbeOnlineHabilitado() && modo === "entrar" ? "E-mail" : "Nome de usuário"}<input autoFocus required value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder={orbeOnlineHabilitado() && modo === "entrar" ? "voce@email.com" : "seu_usuario"} /></label>
                <label>Senha<div className="login-orbe__senha"><input required minLength="4" type={mostrarSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} /><button type="button" onClick={() => setMostrarSenha((atual) => !atual)}>{mostrarSenha ? "Ocultar" : "Mostrar"}</button></div></label>
                <button className="login-orbe__principal" type="submit" disabled={carregando}>{carregando ? "Conectando..." : modo === "criar" ? "Criar conta" : "Entrar"}<span>→</span></button>
              </form>
            )}
            {erro ? <p className="login-orbe__erro">{erro}</p> : null}
            <div className="login-orbe__alternativas">
              <button type="button" onClick={() => { setModo(modo === "criar" ? "entrar" : "criar"); setErro(""); }}>{modo === "criar" ? "Já tenho acesso" : "Criar conta"}</button>
              <button type="button" onClick={() => { setModo(modo === "convite" ? "entrar" : "convite"); setErro(""); }}>{modo === "convite" ? "Voltar ao login" : "Entrar com convite"}</button>
            </div>
            {lerUsuarioAtual() ? <button className="login-orbe__continuar" type="button" onClick={() => navegar("/inicio")}>Continuar como {lerUsuarioAtual().nome}</button> : null}
          </section>
          <aside className="login-orbe__orbe" aria-label="Estado do portal"><div className="login-orbe__nucleo"><i /><i /><span>◆</span></div><strong>{orbeOnlineHabilitado() ? "ORBE ONLINE" : "MODO LOCAL ATIVO"}</strong><small>{orbeOnlineHabilitado() ? "Conta conectada à nuvem do ORBE." : "Seus dados permanecem disponíveis neste navegador."}</small></aside>
        </div>
      </section>
    </main>
  );
}
