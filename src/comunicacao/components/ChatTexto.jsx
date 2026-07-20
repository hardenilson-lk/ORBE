import { useEffect, useRef, useState } from "react";

import "../styles/ChatTexto.css";

function horario(valor) {
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "agora" : data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function iniciais(nome) {
  return String(nome || "M").trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase() || "M";
}

export default function ChatTexto({ mensagens, conectado, enviarMensagem, limparMensagens }) {
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");
  const fimRef = useRef(null);
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens.length]);

  async function enviar(evento) {
    evento.preventDefault();
    const resultado = await enviarMensagem(texto);
    if (resultado.ok) { setTexto(""); setAviso(""); }
    else setAviso(resultado.erro);
  }

  return <div className="comunicacao-mesa__chat">
    {!conectado ? <p className="comunicacao-mesa__aviso">Entre na comunicação para usar o chat em tempo real.</p> : null}
    <div className="comunicacao-mesa__lista" aria-live="polite">
      {mensagens.length === 0 ? <div className="comunicacao-mesa__vazio"><span>✦</span><strong>Canal aberto</strong><p>Envie avisos, pistas e mensagens para a mesa.</p></div> : mensagens.map((mensagem) => <article className="comunicacao-mesa__mensagem" key={mensagem.id}><span className="comunicacao-mesa__avatar">{iniciais(mensagem.autor)}</span><div><header><strong>{mensagem.autor || "Mestre"}</strong><time>{horario(mensagem.criadoEm)}</time></header><p>{mensagem.conteudo}</p></div></article>)}
      <span ref={fimRef} />
    </div>
    <form className="comunicacao-mesa__formulario" onSubmit={enviar}><label htmlFor="mensagem-mesa">Mensagem para a mesa</label><div><textarea id="mensagem-mesa" rows="2" maxLength="500" value={texto} placeholder="Escreva uma mensagem..." onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) enviar(e); }} /><button type="submit" disabled={!texto.trim() || !conectado} aria-label="Enviar mensagem">➤</button></div>{aviso ? <small className="comunicacao-mesa__erro">{aviso}</small> : null}</form>
    {mensagens.length ? <button type="button" className="comunicacao-mesa__limpar" onClick={limparMensagens}>Limpar registro</button> : null}
  </div>;
}
