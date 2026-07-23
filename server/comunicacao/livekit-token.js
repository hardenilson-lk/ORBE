import { createServer } from "node:http";
import { AccessToken, TrackSource } from "livekit-server-sdk";

const PORTA = Number.parseInt(process.env.PORT || "3001", 10);
const HOST = process.env.HOST || "0.0.0.0";
const ORIGEM_PERMITIDA = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const CAMINHO_TOKEN = "/api/livekit-token";
const LIMITE_CORPO = 16 * 1024;

function cabecalhosCors(resposta, origem) {
  if (origem === ORIGEM_PERMITIDA) resposta.setHeader("Access-Control-Allow-Origin", origem);
  resposta.setHeader("Vary", "Origin");
  resposta.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  resposta.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function responderJson(resposta, status, dados) {
  resposta.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  resposta.end(JSON.stringify(dados));
}

function textoSeguro(valor, limite) {
  return String(valor || "").trim().slice(0, limite);
}

function validarEntrada(corpo) {
  const sala = textoSeguro(corpo?.sala, 120);
  const identidade = textoSeguro(corpo?.identidade, 128);
  const nome = textoSeguro(corpo?.nome, 80);
  const papel = textoSeguro(corpo?.papel, 32) || "Jogador";

  if (!/^orbe-mesa-[a-zA-Z0-9_-]+$/.test(sala)) return { erro: "O identificador da mesa é inválido." };
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(identidade)) return { erro: "A identidade do participante é inválida." };
  if (!nome) return { erro: "Informe o nome do participante." };
  if (!/^[\p{L}\p{N} _-]{1,32}$/u.test(papel)) return { erro: "O papel do participante é inválido." };
  return { sala, identidade, nome, papel };
}

async function lerJson(requisicao) {
  let tamanho = 0;
  const partes = [];
  for await (const parte of requisicao) {
    tamanho += parte.length;
    if (tamanho > LIMITE_CORPO) throw new Error("CORPO_MUITO_GRANDE");
    partes.push(parte);
  }
  try { return JSON.parse(Buffer.concat(partes).toString("utf8") || "{}"); }
  catch { throw new Error("JSON_INVALIDO"); }
}

const servidor = createServer(async (requisicao, resposta) => {
  const origem = requisicao.headers.origin || "";
  cabecalhosCors(resposta, origem);

  if (origem && origem !== ORIGEM_PERMITIDA) return responderJson(resposta, 403, { erro: "Origem não autorizada." });
  if (requisicao.method === "OPTIONS") return responderJson(resposta, 204, {});
  if (requisicao.url !== CAMINHO_TOKEN) return responderJson(resposta, 404, { erro: "Rota não encontrada." });
  if (requisicao.method !== "POST") return responderJson(resposta, 405, { erro: "Use uma requisição POST para solicitar o token." });

  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    console.error("[Comunicação] Configure LIVEKIT_URL, LIVEKIT_API_KEY e LIVEKIT_API_SECRET em server/.env.");
    return responderJson(resposta, 503, { erro: "O servidor de comunicação ainda não foi configurado." });
  }

  try {
    const entrada = validarEntrada(await lerJson(requisicao));
    if (entrada.erro) return responderJson(resposta, 400, { erro: entrada.erro });

    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: entrada.identidade,
      name: entrada.nome,
      metadata: JSON.stringify({ nome: entrada.nome, papel: entrada.papel }),
      ttl: "15m",
    });
    const papelMestre = entrada.papel.toLocaleLowerCase("pt-BR") === "mestre";
    token.addGrant({
      roomJoin: true,
      room: entrada.sala,
      canPublish: true,
      canPublishSources: papelMestre
        ? [TrackSource.MICROPHONE, TrackSource.SCREEN_SHARE_AUDIO]
        : [TrackSource.MICROPHONE],
      canSubscribe: true,
      canPublishData: true,
    });

    return responderJson(resposta, 200, { token: await token.toJwt(), sala: entrada.sala, livekitUrl: LIVEKIT_URL });
  } catch (erro) {
    console.error("[Comunicação] Erro ao gerar token.", erro);
    if (erro.message === "JSON_INVALIDO") return responderJson(resposta, 400, { erro: "O corpo da requisição não contém JSON válido." });
    if (erro.message === "CORPO_MUITO_GRANDE") return responderJson(resposta, 413, { erro: "A requisição excedeu o tamanho permitido." });
    return responderJson(resposta, 500, { erro: "Não foi possível autorizar a entrada na sala." });
  }
});

servidor.listen(PORTA, HOST, () => {
  console.log(`[Comunicação] Servidor de token em http://${HOST}:${PORTA}${CAMINHO_TOKEN}`);
});
