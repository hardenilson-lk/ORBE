const MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
const TAMANHO = 512;

function origemPermitida(request, env) {
  const origem = request.headers.get("Origin");
  if (!origem) return true;
  if (env.ORBE_ORIGIN && origem === env.ORBE_ORIGIN) return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origem);
}

function cabecalhosCors(request, env) {
  const origem = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": origem && origemPermitida(request, env) ? origem : "",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function respostaJson(dados, status, request, env, extras = {}) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cabecalhosCors(request, env), ...extras },
  });
}

function erro(codigo, mensagem, status, request, env) {
  return respostaJson({ erro: { codigo, mensagem } }, status, request, env);
}

function validarEntrada(entrada) {
  if (!entrada || typeof entrada !== "object") return "Corpo JSON inválido.";
  if (typeof entrada.imagemBase !== "string" || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(entrada.imagemBase)) return "imagemBase deve ser uma imagem data URL válida.";
  if (entrada.imagemBase.length > 8 * 1024 * 1024) return "imagemBase excede o limite permitido.";
  if (typeof entrada.tema !== "string" || entrada.tema.length > 120) return "tema inválido.";
  if (typeof entrada.descricao !== "string" || entrada.descricao.length > 1200) return "descricao inválida.";
  if (!/^[a-f0-9]{16,128}$/i.test(String(entrada.hashMapa || ""))) return "hashMapa inválido.";
  if (entrada.qualidade !== "padrao") return "qualidade inválida.";
  return "";
}

function decodificarDataUrl(dataUrl) {
  const [, tipo, base64] = dataUrl.match(/^data:image\/(png|jpeg|webp);base64,(.+)$/) || [];
  if (!base64) return null;
  const binario = atob(base64);
  const bytes = Uint8Array.from(binario, (caractere) => caractere.charCodeAt(0));
  return new Blob([bytes], { type: `image/${tipo}` });
}

function chaveCache(hash) {
  return new Request(`https://orbe-finalizador-ia.invalid/cache/${encodeURIComponent(hash)}`);
}

async function gerarImagem(entrada, env) {
  const imagem = decodificarDataUrl(entrada.imagemBase);
  const form = new FormData();
  form.append("prompt", `Finalize visualmente este mapa de RPG. Tema: ${entrada.tema}. Descrição: ${entrada.descricao}. Preserve exatamente a estrutura, salas, corredores, portas e proporções do mapa-base. Produza somente cenário visual, sem grade, textos, tokens, interface, dados ou informações privadas.`);
  form.append("input_image_0", imagem, "mapa-base.png");
  form.append("width", String(TAMANHO));
  form.append("height", String(TAMANHO));
  const formResponse = new Response(form);
  const resultado = await env.AI.run(MODEL, {
    multipart: {
      body: formResponse.body,
      contentType: formResponse.headers.get("content-type"),
    },
  });
  const base64 = typeof resultado === "string" ? resultado : resultado?.image || resultado?.output?.image;
  if (typeof base64 !== "string" || !base64) throw new Error("A IA não retornou uma imagem válida.");
  return base64.startsWith("data:image/") ? base64 : `data:image/png;base64,${base64}`;
}

async function finalizar(request, env) {
  let entrada;
  try { entrada = await request.json(); } catch { return erro("JSON_INVALIDO", "Envie um corpo JSON válido.", 400, request, env); }
  const mensagem = validarEntrada(entrada);
  if (mensagem) return erro("ENTRADA_INVALIDA", mensagem, 400, request, env);
  const cache = caches.default;
  const chave = chaveCache(entrada.hashMapa);
  const encontrada = await cache.match(chave);
  if (encontrada) {
    return new Response(encontrada.body, { headers: { ...Object.fromEntries(encontrada.headers), ...cabecalhosCors(request, env), "X-ORBE-Cache": "HIT" } });
  }
  try {
    const imagem = await gerarImagem(entrada, env);
    const resposta = respostaJson({ imagem, hashMapa: entrada.hashMapa, tamanho: TAMANHO }, 200, request, env, { "X-ORBE-Cache": "MISS" });
    await cache.put(chave, resposta.clone());
    return resposta;
  } catch {
    return erro("IA_INDISPONIVEL", "Não foi possível finalizar o mapa agora.", 502, request, env);
  }
}

export default {
  async fetch(request, env) {
    if (!origemPermitida(request, env)) return erro("ORIGEM_NAO_PERMITIDA", "Origem não autorizada.", 403, request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cabecalhosCors(request, env) });
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/status") return respostaJson({ ativo: true, modelo: MODEL, tamanho: TAMANHO, cache: "cache-api" }, 200, request, env);
    if (request.method === "POST" && url.pathname === "/api/finalizar-mapa") return finalizar(request, env);
    return erro("NAO_ENCONTRADO", "Rota não encontrada.", 404, request, env);
  },
};
