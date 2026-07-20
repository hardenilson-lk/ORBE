import { useEffect, useRef, useState } from "react";

import { lerUsuarioAtual } from "../../utils/contasOrbe.js";
import useChatTexto from "../hooks/useChatTexto.js";
import useComunicacaoMesa from "../hooks/useComunicacaoMesa.js";
import useMicrofone from "../hooks/useMicrofone.js";
import ChatTexto from "./ChatTexto.jsx";
import ChatVoz from "./ChatVoz.jsx";

import "../styles/ComunicacaoMesa.css";

export default function ComunicacaoMesa({ mesaId, mensagens = [], jogadores = [], nomeLocal = "Mestre", papelLocal = "Mestre" }) {
  const [abaAtiva, setAbaAtiva] = useState("chat");
  const [recolhido, setRecolhido] = useState(false);
  const audiosRef = useRef(null);
  const usuario = lerUsuarioAtual();
  const comunicacao = useComunicacaoMesa({ mesaId, identidadeLocal: usuario?.id, nomeLocal, papelLocal, audiosRef });
  const chat = useChatTexto({ mensagensIniciais: mensagens, nomeLocal, papelLocal, conectado: comunicacao.conectado, enviarDados: comunicacao.enviarDados, pacoteRecebido: comunicacao.pacoteRecebido });
  const microfone = useMicrofone(comunicacao.obterFaixaMicrofone, comunicacao.definirEstado);
  const { pacoteRecebido, definirEstado } = comunicacao;

  useEffect(() => {
    const pacote = pacoteRecebido;
    if (pacote?.tipo !== "alerta-voz") return;
    definirEstado(pacote.acao === "pedir-fala" ? `${pacote.nome || "Um jogador"} pediu para falar.` : `${pacote.nome || "Um jogador"} pediu atenção da mesa.`);
  }, [pacoteRecebido, definirEstado]);

  async function enviarAlerta(acao) {
    if (!comunicacao.conectado) return comunicacao.definirEstado("Entre na voz antes de usar este comando.");
    try { await comunicacao.enviarDados({ tipo: "alerta-voz", acao, nome: nomeLocal }); }
    catch (erro) { console.error("[Comunicação] Falha ao enviar alerta.", erro); comunicacao.definirEstado("O aviso não pôde ser enviado."); }
  }

  return <section className={`comunicacao-mesa${recolhido ? " comunicacao-mesa--recolhida" : ""}`} data-assistente="comunicacao-da-mesa">
    <header className="comunicacao-mesa__cabecalho"><div><span>Canal reservado</span><h2>Comunicação da mesa</h2></div><button type="button" className="comunicacao-mesa__recolher" onClick={() => setRecolhido((valor) => !valor)} aria-label={recolhido ? "Expandir comunicação" : "Recolher comunicação"} aria-expanded={!recolhido}>{recolhido ? "+" : "−"}</button></header>
    {!recolhido ? <><nav className="comunicacao-mesa__abas" aria-label="Comunicação da mesa"><button type="button" className={abaAtiva === "chat" ? "ativo" : ""} onClick={() => setAbaAtiva("chat")}><span>✉</span> Chat{chat.mensagens.length ? <small>{chat.mensagens.length}</small> : null}</button><button type="button" className={abaAtiva === "voz" ? "ativo" : ""} onClick={() => setAbaAtiva("voz")}><span className={`comunicacao-mesa__sinal${comunicacao.conectado ? " ativo" : ""}`} /> Voz</button></nav>{abaAtiva === "chat" ? <ChatTexto mensagens={chat.mensagens} conectado={comunicacao.conectado} enviarMensagem={chat.enviarMensagem} limparMensagens={chat.limparMensagens} /> : <ChatVoz comunicacao={comunicacao} microfone={microfone} jogadoresEsperados={jogadores.length} aoEnviarAlerta={enviarAlerta} />}<div ref={audiosRef} className="comunicacao-mesa__audios" aria-hidden="true" /></> : null}
  </section>;
}
