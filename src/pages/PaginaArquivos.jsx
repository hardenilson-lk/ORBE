import { useState } from "react";
import { Link, useNavigate } from "react-router";

import Cabecalho from "../components/Cabecalho.jsx";
import { entrarMesaRemota, mensagemErroConviteOrbe, orbeOnlineHabilitado } from "../services/supabaseOrbe.js";
import { aplicarMesaRemota, lerMesasSalvas } from "../utils/mesas.js";

export default function PaginaArquivos() {
  const navegar = useNavigate();
  const [conviteAberto, setConviteAberto] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [erroConvite, setErroConvite] = useState("");
  const [carregandoConvite, setCarregandoConvite] = useState(false);

  async function entrarComConvite(evento) {
    evento.preventDefault();
    const normalizado = codigo.trim().toUpperCase();
    if (orbeOnlineHabilitado()) {
      if (carregandoConvite) return;
      setCarregandoConvite(true);
      try {
        const mesaRemota = await entrarMesaRemota(normalizado);
        if (mesaRemota.statusEntrada === "pendente") {
          setErroConvite(
            "Solicitação enviada. Aguarde o mestre aprovar sua entrada.",
          );
          setCodigo("");
          return;
        }
        aplicarMesaRemota(mesaRemota);
        navegar(`/arquivos/jogador/${mesaRemota.id}`);
        return;
      } catch (falha) {
        setErroConvite(mensagemErroConviteOrbe(falha));
        return;
      } finally {
        setCarregandoConvite(false);
      }
    }
    const mesa = lerMesasSalvas().find((item) => {
      const convite = item.codigoConvite || item.codigo_convite || item.inviteCode || `ORBE-${String(item.id).slice(-6).toUpperCase()}`;
      return String(convite).trim().toUpperCase() === normalizado;
    });

    if (!mesa) {
      setErroConvite("Código não encontrado neste navegador.");
      return;
    }

    navegar(`/arquivos/jogador/${mesa.id}`);
  }

  return (
    <div className="pagina">
      <Cabecalho />

      <main className="central-arquivos">
        <section className="central-arquivos__cabecalho">
          <span className="central-arquivos__etiqueta">
            Sistema Arquivos
          </span>

          <h1>Central de Arquivos</h1>

          <p>
            Crie uma nova investigação, acesse suas mesas ou entre em uma
            campanha por convite.
          </p>
        </section>

        <section className="acoes-arquivos">
          <article className="acao-arquivo">
            <span className="acao-arquivo__numero">
              01
            </span>

            <div className="acao-arquivo__icone">
              +
            </div>

            <span className="acao-arquivo__tipo">
              Nova investigação
            </span>

            <h2>Criar nova mesa</h2>

            <p>
              Defina o nome da campanha e prepare um novo arquivo para seus
              jogadores.
            </p>

            <Link
              className="acao-arquivo__botao"
              to="/arquivos/nova-mesa"
            >
              Criar mesa
            </Link>
          </article>

          <article className="acao-arquivo">
            <span className="acao-arquivo__numero">
              02
            </span>

            <div className="acao-arquivo__icone">
              A
            </div>

            <span className="acao-arquivo__tipo">
              Arquivos existentes
            </span>

            <h2>Minhas mesas</h2>

            <p>
              Consulte as campanhas que você criou ou das quais já participa.
            </p>

            <Link
              className="acao-arquivo__botao"
              to="/arquivos/minhas-mesas"
            >
              Abrir mesas
            </Link>
          </article>

          <article className="acao-arquivo">
            <span className="acao-arquivo__numero">
              03
            </span>

            <div className="acao-arquivo__icone">
              #
            </div>

            <span className="acao-arquivo__tipo">
              Código de acesso
            </span>

            <h2>Entrar com convite</h2>

            <p>
              Utilize um código ou link enviado pelo mestre para acessar uma
              campanha.
            </p>

            <button type="button" onClick={() => setConviteAberto((aberto) => !aberto)}>
              Inserir convite
            </button>

            {conviteAberto ? (
              <form className="acao-arquivo__convite" onSubmit={entrarComConvite}>
                <label htmlFor="codigo-convite">Código da campanha</label>
                <div>
                  <input id="codigo-convite" required value={codigo} onChange={(evento) => { setCodigo(evento.target.value); setErroConvite(""); }} placeholder="ORBE-000000" />
                  <button type="submit" disabled={carregandoConvite}>{carregandoConvite ? "Entrando..." : "Entrar"}</button>
                </div>
                {erroConvite ? <small>{erroConvite}</small> : null}
              </form>
            ) : null}
          </article>
        </section>

        <Link
          className="voltar-inicio"
          to="/"
        >
          ← Voltar para o início
        </Link>
      </main>
    </div>
  );
}
