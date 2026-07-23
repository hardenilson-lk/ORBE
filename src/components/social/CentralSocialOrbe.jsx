import { useCallback, useEffect, useMemo, useState } from "react";

import {
  assinarSocialOrbe,
  buscarPessoasOrbe,
  enviarMensagemGeralOrbe,
  enviarMensagemPrivadaOrbe,
  listarAmizadesOrbe,
  listarMensagensGeraisOrbe,
  listarMensagensPrivadasOrbe,
  responderAmizadeOrbe,
  solicitarAmizadeOrbe,
} from "../../services/socialOrbe.js";
import { orbeOnlineHabilitado } from "../../services/supabaseOrbe.js";
import { lerUsuarioAtual } from "../../utils/contasOrbe.js";

import "./CentralSocialOrbe.css";

function horario(data) {
  if (!data) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data));
}

function ListaMensagens({ mensagens, usuarioId }) {
  if (!mensagens.length) {
    return (
      <div className="social-orbe__vazio">
        <span>✦</span>
        <strong>O canal está aberto</strong>
        <p>Seja a primeira pessoa a deixar uma mensagem.</p>
      </div>
    );
  }

  return (
    <div className="social-orbe__mensagens">
      {mensagens.map((mensagem) => (
        <article
          className={mensagem.autorId === usuarioId ? "propria" : ""}
          key={mensagem.id}
        >
          <span>
            {(mensagem.autor?.nome || mensagem.autor?.usuario || "OR")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div>
            <header>
              <strong>
                {mensagem.autor?.nome || mensagem.autor?.usuario || "Investigador"}
              </strong>
              <time>{horario(mensagem.criadoEm)}</time>
            </header>
            <p>{mensagem.conteudo}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function CentralSocialOrbe() {
  const online = orbeOnlineHabilitado();
  const usuarioId = lerUsuarioAtual()?.id || "";
  const [aba, setAba] = useState("geral");
  const [mensagensGerais, setMensagensGerais] = useState([]);
  const [amizades, setAmizades] = useState([]);
  const [amizadeAtivaId, setAmizadeAtivaId] = useState("");
  const [mensagensPrivadas, setMensagensPrivadas] = useState([]);
  const [texto, setTexto] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [resultadosPesquisa, setResultadosPesquisa] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const amigos = useMemo(
    () => amizades.filter((amizade) => amizade.status === "aceita"),
    [amizades],
  );
  const recebidas = useMemo(
    () =>
      amizades.filter(
        (amizade) => amizade.status === "pendente" && amizade.recebida,
      ),
    [amizades],
  );
  const amizadeAtiva = amigos.find((amizade) => amizade.id === amizadeAtivaId);

  const carregarGerais = useCallback(async () => {
    if (!online) return;
    try {
      setMensagensGerais(await listarMensagensGeraisOrbe());
    } catch (erro) {
      setMensagem(
        erro?.message || "O chat geral ainda não pôde ser carregado.",
      );
    }
  }, [online]);

  const carregarAmizades = useCallback(async () => {
    if (!online) return;
    try {
      const lista = await listarAmizadesOrbe();
      setAmizades(lista);
      setAmizadeAtivaId((atual) =>
        lista.some((item) => item.id === atual && item.status === "aceita")
          ? atual
          : lista.find((item) => item.status === "aceita")?.id || "",
      );
    } catch (erro) {
      setMensagem(
        erro?.message || "Os contatos do ORBE ainda não puderam ser carregados.",
      );
    }
  }, [online]);

  const carregarPrivadas = useCallback(async () => {
    if (!online || !amizadeAtivaId) {
      setMensagensPrivadas([]);
      return;
    }
    try {
      setMensagensPrivadas(
        await listarMensagensPrivadasOrbe(amizadeAtivaId),
      );
    } catch (erro) {
      setMensagem(erro?.message || "Não foi possível abrir essa conversa.");
    }
  }, [amizadeAtivaId, online]);

  useEffect(() => {
    if (!online) return undefined;
    void Promise.all([carregarGerais(), carregarAmizades()]);
    return assinarSocialOrbe({
      aoAmizades: carregarAmizades,
      aoMensagensGerais: carregarGerais,
      aoMensagensPrivadas: carregarPrivadas,
      aoErro: (erro) =>
        setMensagem(erro?.message || "A atualização social foi interrompida."),
    });
  }, [carregarAmizades, carregarGerais, carregarPrivadas, online]);

  useEffect(() => {
    void carregarPrivadas();
  }, [carregarPrivadas]);

  async function enviar(evento) {
    evento.preventDefault();
    if (!texto.trim() || carregando) return;
    setCarregando(true);
    setMensagem("");
    try {
      if (aba === "geral") {
        const nova = await enviarMensagemGeralOrbe(texto);
        setMensagensGerais((atuais) => [...atuais, nova].slice(-100));
      } else if (amizadeAtivaId) {
        const nova = await enviarMensagemPrivadaOrbe(amizadeAtivaId, texto);
        setMensagensPrivadas((atuais) => [...atuais, nova].slice(-100));
      }
      setTexto("");
    } catch (erro) {
      setMensagem(erro?.message || "A mensagem não pôde ser enviada.");
    } finally {
      setCarregando(false);
    }
  }

  async function pesquisar(evento) {
    evento.preventDefault();
    setCarregando(true);
    setMensagem("");
    try {
      setResultadosPesquisa(await buscarPessoasOrbe(pesquisa));
    } catch (erro) {
      setMensagem(erro?.message || "Não foi possível pesquisar pessoas.");
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar(perfil) {
    setCarregando(true);
    try {
      await solicitarAmizadeOrbe(perfil.id);
      setMensagem(`Solicitação enviada para @${perfil.usuario}.`);
      setResultadosPesquisa([]);
      setPesquisa("");
      await carregarAmizades();
    } catch (erro) {
      setMensagem(erro?.message || "Não foi possível enviar a solicitação.");
    } finally {
      setCarregando(false);
    }
  }

  async function responder(amizade, aceitar) {
    setCarregando(true);
    try {
      await responderAmizadeOrbe(amizade.id, aceitar);
      setMensagem(aceitar ? "Amizade aceita." : "Solicitação recusada.");
      await carregarAmizades();
    } catch (erro) {
      setMensagem(erro?.message || "Não foi possível responder.");
    } finally {
      setCarregando(false);
    }
  }

  if (!online) {
    return (
      <section className="social-orbe social-orbe--offline">
        <span>Rede social do ORBE</span>
        <h2>Amigos e chat geral</h2>
        <p>Entre no modo online para conversar e encontrar outros jogadores.</p>
      </section>
    );
  }

  return (
    <section className="social-orbe">
      <header className="social-orbe__cabecalho">
        <div>
          <span>Canal comunitário</span>
          <h2>Comunidade ORBE</h2>
          <p>Converse no salão geral ou abra um canal particular com seus amigos.</p>
        </div>
        <nav>
          <button
            type="button"
            className={aba === "geral" ? "ativo" : ""}
            onClick={() => setAba("geral")}
          >
            Chat geral
          </button>
          <button
            type="button"
            className={aba === "amigos" ? "ativo" : ""}
            onClick={() => setAba("amigos")}
          >
            Amigos {recebidas.length ? `(${recebidas.length})` : ""}
          </button>
        </nav>
      </header>

      {aba === "geral" ? (
        <div className="social-orbe__canal">
          <ListaMensagens mensagens={mensagensGerais} usuarioId={usuarioId} />
          <form className="social-orbe__envio" onSubmit={enviar}>
            <input
              maxLength="500"
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              placeholder="Escreva no chat geral..."
            />
            <button type="submit" disabled={carregando || !texto.trim()}>
              Enviar
            </button>
          </form>
        </div>
      ) : (
        <div className="social-orbe__area-amigos">
          <aside>
            <form className="social-orbe__pesquisa" onSubmit={pesquisar}>
              <label>
                Encontrar pessoa
                <input
                  minLength="2"
                  value={pesquisa}
                  onChange={(evento) => setPesquisa(evento.target.value)}
                  placeholder="Nome ou @usuário"
                />
              </label>
              <button type="submit" disabled={carregando || pesquisa.trim().length < 2}>
                Buscar
              </button>
            </form>

            {resultadosPesquisa.map((perfil) => (
              <article className="social-orbe__pessoa" key={perfil.id}>
                <div>
                  <strong>{perfil.nome}</strong>
                  <small>@{perfil.usuario}</small>
                </div>
                <button type="button" onClick={() => adicionar(perfil)}>
                  Adicionar
                </button>
              </article>
            ))}

            {recebidas.length ? <h3>Solicitações</h3> : null}
            {recebidas.map((amizade) => (
              <article className="social-orbe__pessoa" key={amizade.id}>
                <div>
                  <strong>{amizade.perfil?.nome || amizade.perfil?.usuario}</strong>
                  <small>@{amizade.perfil?.usuario}</small>
                </div>
                <button type="button" onClick={() => responder(amizade, true)}>
                  Aceitar
                </button>
                <button type="button" onClick={() => responder(amizade, false)}>
                  Recusar
                </button>
              </article>
            ))}

            <h3>Amigos</h3>
            {amigos.length ? (
              amigos.map((amizade) => (
                <button
                  type="button"
                  className={`social-orbe__amigo${amizade.id === amizadeAtivaId ? " ativo" : ""}`}
                  key={amizade.id}
                  onClick={() => setAmizadeAtivaId(amizade.id)}
                >
                  <span>
                    {(amizade.perfil?.nome || "OR").slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <strong>{amizade.perfil?.nome || "Investigador"}</strong>
                    <small>@{amizade.perfil?.usuario}</small>
                  </div>
                </button>
              ))
            ) : (
              <p className="social-orbe__sem-amigos">
                Seus amigos aparecerão aqui.
              </p>
            )}
          </aside>

          <div className="social-orbe__conversa">
            {amizadeAtiva ? (
              <>
                <header>
                  <span>Canal privado</span>
                  <strong>{amizadeAtiva.perfil?.nome}</strong>
                </header>
                <ListaMensagens
                  mensagens={mensagensPrivadas}
                  usuarioId={usuarioId}
                />
                <form className="social-orbe__envio" onSubmit={enviar}>
                  <input
                    maxLength="1000"
                    value={texto}
                    onChange={(evento) => setTexto(evento.target.value)}
                    placeholder={`Mensagem para ${amizadeAtiva.perfil?.nome}...`}
                  />
                  <button type="submit" disabled={carregando || !texto.trim()}>
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <div className="social-orbe__vazio">
                <span>⌘</span>
                <strong>Escolha um amigo</strong>
                <p>A conversa particular ficará disponível aqui.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {mensagem ? <output className="social-orbe__retorno">{mensagem}</output> : null}
    </section>
  );
}
