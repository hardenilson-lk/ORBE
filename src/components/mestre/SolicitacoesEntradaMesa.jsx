import { useCallback, useEffect, useState } from "react";

import {
  assinarSolicitacoesEntradaRealtime,
  configurarAprovacaoConvitesRemota,
  listarSolicitacoesEntradaRemotas,
  orbeOnlineHabilitado,
  responderSolicitacaoEntradaRemota,
} from "../../services/supabaseOrbe.js";

import "./SolicitacoesEntradaMesa.css";

export default function SolicitacoesEntradaMesa({
  mesaId,
  exigirAprovacaoInicial = true,
}) {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [exigirAprovacao, setExigirAprovacao] = useState(
    exigirAprovacaoInicial !== false,
  );
  const [mensagem, setMensagem] = useState("");
  const [processando, setProcessando] = useState("");
  const online = orbeOnlineHabilitado() && mesaId && mesaId !== "local";

  const carregar = useCallback(async () => {
    if (!online) return;
    try {
      setSolicitacoes(await listarSolicitacoesEntradaRemotas(mesaId));
    } catch (erro) {
      setMensagem(
        erro?.message ||
          "Não foi possível carregar as solicitações de entrada.",
      );
    }
  }, [mesaId, online]);

  useEffect(() => {
    setExigirAprovacao(exigirAprovacaoInicial !== false);
  }, [exigirAprovacaoInicial]);

  useEffect(() => {
    if (!online) return undefined;
    void carregar();
    return assinarSolicitacoesEntradaRealtime(
      mesaId,
      carregar,
      (erro) =>
        setMensagem(
          erro?.message || "A atualização das solicitações foi interrompida.",
        ),
    );
  }, [carregar, mesaId, online]);

  async function alternarAprovacao() {
    const proximo = !exigirAprovacao;
    setProcessando("configuracao");
    setMensagem("");
    try {
      await configurarAprovacaoConvitesRemota(mesaId, proximo);
      setExigirAprovacao(proximo);
      setMensagem(
        proximo
          ? "O mestre precisa aprovar novos participantes."
          : "Novos participantes entram imediatamente pelo convite.",
      );
    } catch (erro) {
      setMensagem(erro?.message || "Não foi possível alterar essa opção.");
    } finally {
      setProcessando("");
    }
  }

  async function responder(usuarioId, aprovar) {
    setProcessando(usuarioId);
    setMensagem("");
    try {
      await responderSolicitacaoEntradaRemota(mesaId, usuarioId, aprovar);
      setSolicitacoes((atuais) =>
        atuais.filter((item) => item.user_id !== usuarioId),
      );
      setMensagem(
        aprovar ? "Participante aprovado e liberado." : "Solicitação recusada.",
      );
    } catch (erro) {
      setMensagem(erro?.message || "Não foi possível responder à solicitação.");
    } finally {
      setProcessando("");
    }
  }

  if (!online) return null;

  return (
    <section className="solicitacoes-entrada">
      <header>
        <div>
          <span>Controle de acesso</span>
          <h3>Entrada por convite</h3>
        </div>
        <button
          type="button"
          className={exigirAprovacao ? "ativo" : ""}
          disabled={processando === "configuracao"}
          onClick={alternarAprovacao}
        >
          {exigirAprovacao ? "Aprovação ativa" : "Entrada direta"}
        </button>
      </header>

      <p>
        {exigirAprovacao
          ? "Quem usar o código aguardará sua autorização antes de acessar a sala."
          : "Quem usar o código será admitido automaticamente."}
      </p>

      {solicitacoes.length ? (
        <div className="solicitacoes-entrada__lista">
          {solicitacoes.map((solicitacao) => {
            const perfil = solicitacao.perfil || {};
            const nome = perfil.nome || perfil.usuario || "Novo participante";
            return (
              <article key={solicitacao.user_id}>
                <span>{nome.slice(0, 2).toUpperCase()}</span>
                <div>
                  <strong>{nome}</strong>
                  <small>@{perfil.usuario || "investigador"}</small>
                </div>
                <button
                  type="button"
                  disabled={processando === solicitacao.user_id}
                  onClick={() => responder(solicitacao.user_id, true)}
                >
                  Aprovar
                </button>
                <button
                  type="button"
                  className="recusar"
                  disabled={processando === solicitacao.user_id}
                  onClick={() => responder(solicitacao.user_id, false)}
                >
                  Recusar
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <small className="solicitacoes-entrada__vazio">
          Nenhuma solicitação aguardando aprovação.
        </small>
      )}

      {mensagem ? <output>{mensagem}</output> : null}
    </section>
  );
}
