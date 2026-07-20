import { TOKEN_URL } from "../config/comunicacaoConfig.js";

export async function solicitarTokenLiveKit({ sala, identidade, nome, papel }) {
  let resposta;
  try {
    resposta = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sala, identidade, nome, papel }),
    });
  } catch (erro) {
    console.error("[Comunicação] Servidor de token indisponível.", erro);
    throw new Error("O servidor de comunicação não respondeu. Confirme se ele está iniciado.");
  }

  let dados = {};
  try { dados = await resposta.json(); } catch { /* resposta inválida tratada abaixo */ }
  if (!resposta.ok || !dados.token) {
    console.error("[Comunicação] Falha ao gerar token.", resposta.status, dados);
    throw new Error(dados.erro || "O servidor não conseguiu autorizar sua entrada na sala.");
  }
  return dados.token;
}
