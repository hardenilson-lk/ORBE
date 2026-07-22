import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import logoOrbe from "../assets/logo.png";
import { CONFIRMACAO_EMAIL_ATIVA } from "../config/recursosOrbe.js";
import {
  criarContaOrbeConectada,
  entrarContaOrbeConectada,
  lerUsuarioAtual,
  processarRetornoAutenticacaoOrbe,
  reenviarConfirmacaoOrbe,
} from "../utils/contasOrbe.js";
import { lerMesasSalvas } from "../utils/mesas.js";
import { orbeOnlineHabilitado, verificarServidorOrbe } from "../services/supabaseOrbe.js";

import "./PaginaLogin.css";

function mensagemAmigavel(falha) {
  const detalhe = String(falha?.message || "").toLowerCase();
  if (detalhe.includes("invalid login") || detalhe.includes("invalid credentials")) return "E-mail ou senha incorretos.";
  if (detalhe.includes("email not confirmed")) {
    return CONFIRMACAO_EMAIL_ATIVA
      ? "Confirme seu e-mail antes de entrar."
      : "Não foi possível entrar. Verifique as configurações de teste e tente novamente.";
  }
  if (detalhe.includes("already registered") || detalhe.includes("already exists")) return "Este acesso já está cadastrado.";
  if (detalhe.includes("failed to fetch") || detalhe.includes("network") || detalhe.includes("fetch")) return "O servidor não respondeu. Verifique sua conexão e tente novamente.";
  return falha?.message || "Não foi possível concluir o acesso.";
}

export default function PaginaLogin() {
  const navegar = useNavigate();
  const localizacao = useLocation();
  const [modo, setModo] = useState("entrar");
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [retorno, setRetorno] = useState(() => localizacao.state?.aviso
    ? { tipo: "aviso", texto: localizacao.state.aviso }
    : null);
  const [carregando, setCarregando] = useState(false);
  const [emailConfirmacaoPendente, setEmailConfirmacaoPendente] = useState("");
  const [estadoServidor, setEstadoServidor] = useState({
    situacao: "verificando",
    titulo: "VERIFICANDO SERVIDOR",
    mensagem: "Procurando o canal de autenticação do ORBE...",
  });

  const consultarServidor = useCallback(async () => {
    setEstadoServidor({
      situacao: "verificando",
      titulo: "VERIFICANDO SERVIDOR",
      mensagem: "Procurando o canal de autenticação do ORBE...",
    });
    const resultado = await verificarServidorOrbe();
    if (resultado.online) {
      setEstadoServidor({ situacao: "online", titulo: "SERVIDOR ONLINE", mensagem: resultado.mensagem });
    } else if (resultado.modo === "local") {
      setEstadoServidor({ situacao: "local", titulo: "MODO LOCAL ATIVO", mensagem: resultado.mensagem });
    } else {
      setEstadoServidor({ situacao: "offline", titulo: "SERVIDOR OFFLINE", mensagem: resultado.mensagem });
    }
  }, []);

  useEffect(() => {
    void consultarServidor();
  }, [consultarServidor]);

  useEffect(() => {
    if (!CONFIRMACAO_EMAIL_ATIVA) return undefined;

    let ativo = true;

    async function reconhecerRetorno() {
      try {
        const conta = await processarRetornoAutenticacaoOrbe();
        if (!ativo || !conta) return;
        setRetorno({ tipo: "sucesso", texto: "E-mail confirmado. Abrindo seu portal..." });
        window.setTimeout(() => navegar("/inicio", { replace: true }), 650);
      } catch (falha) {
        if (!ativo) return;
        console.warn("Falha ao processar o retorno de autenticação do ORBE.", falha);
        setRetorno({ tipo: "erro", texto: mensagemAmigavel(falha) });
      }
    }

    void reconhecerRetorno();
    return () => { ativo = false; };
  }, [navegar]);

  function trocarModo(proximoModo) {
    setModo(proximoModo);
    setRetorno(null);
  }

  async function enviar(evento) {
    evento.preventDefault();
    setRetorno({ tipo: "processando", texto: modo === "criar" ? "Criando seu acesso..." : "Verificando suas credenciais..." });
    setCarregando(true);

    try {
      const conta = modo === "criar"
        ? await criarContaOrbeConectada({ nome, usuario, email, senha })
        : await entrarContaOrbeConectada(usuario, senha);

      if (conta?.confirmacaoPendente) {
        if (!CONFIRMACAO_EMAIL_ATIVA) {
          setRetorno({ tipo: "sucesso", texto: "Conta criada com sucesso." });
          setUsuario(String(email || "").trim());
          setModo("entrar");
          return;
        }

        const emailPendente = String(email || "").trim();
        setEmailConfirmacaoPendente(emailPendente);
        setUsuario(emailPendente);
        setRetorno({ tipo: "sucesso", texto: "Conta criada. Confirme o e-mail enviado antes de entrar." });
        setModo("entrar");
        return;
      }

      setRetorno({
        tipo: "sucesso",
        texto: modo === "criar" ? "Conta criada e acesso liberado." : "Login realizado. Abrindo seu portal...",
      });
      window.setTimeout(() => {
        navegar(localizacao.state?.origem || "/inicio", { replace: true });
      }, 850);
    } catch (falha) {
      if (CONFIRMACAO_EMAIL_ATIVA
        && String(falha?.message || "").toLowerCase().includes("email not confirmed")
        && String(usuario || "").includes("@")) {
        setEmailConfirmacaoPendente(String(usuario).trim());
      }
      console.warn("Falha de autenticação no ORBE.", falha);
      setRetorno({ tipo: "erro", texto: mensagemAmigavel(falha) });
    } finally {
      setCarregando(false);
    }
  }

  async function reenviarConfirmacao() {
    const destino = String(emailConfirmacaoPendente || usuario || email).trim();
    setCarregando(true);
    setRetorno({ tipo: "processando", texto: "Reenviando a confirmação..." });
    try {
      await reenviarConfirmacaoOrbe(destino);
      setEmailConfirmacaoPendente(destino);
      setRetorno({ tipo: "sucesso", texto: "E-mail de confirmação reenviado. Verifique também a caixa de spam." });
    } catch (falha) {
      console.warn("Falha ao reenviar a confirmação do ORBE.", falha);
      setRetorno({ tipo: "erro", texto: mensagemAmigavel(falha) });
    } finally {
      setCarregando(false);
    }
  }

  function entrarComConvite(evento) {
    evento.preventDefault();
    if (!lerUsuarioAtual()) {
      setRetorno({ tipo: "aviso", texto: "Entre na sua conta antes de usar um convite de campanha." });
      setModo("entrar");
      return;
    }

    const normalizado = codigo.trim().toUpperCase();
    const mesa = lerMesasSalvas().find((item) => {
      const convite = item.codigoConvite || `ORBE-${String(item.id).slice(-6).toUpperCase()}`;
      return String(convite).trim().toUpperCase() === normalizado;
    });
    if (!mesa) {
      setRetorno({ tipo: "erro", texto: "Convite não encontrado neste navegador." });
      return;
    }
    navegar(`/arquivos/jogador/${mesa.id}`);
  }

  const usuarioAtual = lerUsuarioAtual();

  return (
    <main className="login-orbe">
      <nav className="login-orbe__nav" aria-label="Navegação pública">
        <span aria-hidden="true">✕</span>
        <a href="#sobre">Sobre o ORBE</a>
        <a href="#recursos">Recursos</a>
        <Link to="/sistemas">Sistemas</Link>
        <a href="#ajuda">Ajuda</a>
      </nav>

      <section className="login-orbe__conteudo">
        <img className="login-orbe__logo" src={logoOrbe} alt="ORBE" />
        <p className="login-orbe__chamada">Plataforma para reunir sua mesa de RPG</p>

        <div className="login-orbe__grade">
          <section className="login-orbe__painel">
            <header>
              <span>Acesso ao ORBE</span>
              <h1>{modo === "criar" ? "Criar novo acesso" : modo === "convite" ? "Entrar com convite" : "Abra seu portal"}</h1>
            </header>

            {modo === "convite" ? (
              <form className="login-orbe__form" onSubmit={entrarComConvite}>
                <label>Código da campanha<input autoFocus required value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="ORBE-000000" /></label>
                <button className="login-orbe__principal" type="submit">Localizar mesa <span>→</span></button>
              </form>
            ) : (
              <form className="login-orbe__form" onSubmit={enviar}>
                {modo === "criar" ? <>
                  <label>Seu nome<input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como devemos chamar você?" /></label>
                  <label>E-mail {orbeOnlineHabilitado() ? "da conta online" : "(opcional no modo local)"}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" /></label>
                </> : null}
                <label>{orbeOnlineHabilitado() && modo === "entrar" ? "E-mail" : "Nome de usuário"}<input autoFocus required value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder={orbeOnlineHabilitado() && modo === "entrar" ? "voce@email.com" : "seu_usuario"} /></label>
                <label>Senha<div className="login-orbe__senha"><input required minLength="4" type={mostrarSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} /><button type="button" onClick={() => setMostrarSenha((atual) => !atual)}>{mostrarSenha ? "Ocultar" : "Mostrar"}</button></div></label>
                <button className="login-orbe__principal" type="submit" disabled={carregando}>{carregando ? "Conectando..." : modo === "criar" ? "Criar conta" : "Entrar"}<span>→</span></button>
              </form>
            )}

            {retorno ? <div className={`login-orbe__retorno login-orbe__retorno--${retorno.tipo}`} role="status" aria-live="polite"><i aria-hidden="true" />{retorno.texto}</div> : null}

            <div className="login-orbe__alternativas">
              <button type="button" onClick={() => trocarModo(modo === "criar" ? "entrar" : "criar")}>{modo === "criar" ? "Já tenho acesso" : "Criar conta"}</button>
              <button type="button" onClick={() => trocarModo(modo === "convite" ? "entrar" : "convite")}>{modo === "convite" ? "Voltar ao login" : "Entrar com convite"}</button>
              {CONFIRMACAO_EMAIL_ATIVA && orbeOnlineHabilitado() && modo === "entrar" ? (
                <button
                  type="button"
                  disabled={carregando || !String(emailConfirmacaoPendente || usuario).includes("@")}
                  onClick={reenviarConfirmacao}
                >Reenviar e-mail de confirmação</button>
              ) : null}
            </div>
            {usuarioAtual ? <button className="login-orbe__continuar" type="button" onClick={() => navegar("/inicio")}>Continuar como {usuarioAtual.nome}</button> : null}
          </section>

          <aside className={`login-orbe__orbe login-orbe__orbe--${estadoServidor.situacao}`} aria-label="Estado do portal">
            <div className="login-orbe__nucleo" aria-hidden="true">
              <i /><i /><i />
              <span>◆</span>
              <b /><b /><b />
            </div>
            <div className="login-orbe__estado" role="status" aria-live="polite">
              <span><i />{estadoServidor.titulo}</span>
              <small>{estadoServidor.mensagem}</small>
              {estadoServidor.situacao === "offline" ? <button type="button" onClick={consultarServidor}>Tentar novamente</button> : null}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
