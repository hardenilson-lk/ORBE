import { useEffect, useRef, useState } from "react";
import { LIMITE_MENSAGEM } from "../config/comunicacaoConfig.js";

function idMensagem() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `mensagem-${Date.now()}-${Math.random()}`;
}

export default function useChatTexto({ mensagensIniciais = [], nomeLocal, papelLocal, conectado, enviarDados, pacoteRecebido }) {
  const [mensagens, setMensagens] = useState(() => Array.isArray(mensagensIniciais) ? mensagensIniciais.slice(-120) : []);
  const idsRef = useRef(new Set(mensagens.map((item) => item.id)));

  function adicionar(mensagem) {
    if (!mensagem?.id || idsRef.current.has(mensagem.id)) return;
    idsRef.current.add(mensagem.id);
    setMensagens((atuais) => [...atuais, mensagem].slice(-120));
  }

  useEffect(() => {
    if (pacoteRecebido?.tipo === "chat" && pacoteRecebido.mensagem) adicionar(pacoteRecebido.mensagem);
  }, [pacoteRecebido]);

  async function enviar(conteudoRecebido) {
    const conteudo = String(conteudoRecebido || "").trim().slice(0, LIMITE_MENSAGEM);
    if (!conteudo) return { ok: false, erro: "Escreva uma mensagem antes de enviar." };
    if (!conectado) return { ok: false, erro: "Entre na comunicação para usar o chat em tempo real." };
    const mensagem = { id: idMensagem(), autor: nomeLocal, papel: papelLocal, conteudo, criadoEm: new Date().toISOString() };
    try {
      await enviarDados({ tipo: "chat", mensagem });
      adicionar(mensagem);
      return { ok: true };
    } catch (erro) {
      console.error("[Comunicação] Falha ao enviar mensagem.", erro);
      return { ok: false, erro: "A mensagem não pôde ser enviada. Verifique a conexão da sala." };
    }
  }

  function limpar() { idsRef.current.clear(); setMensagens([]); }
  return { mensagens, enviarMensagem: enviar, limparMensagens: limpar };
}
