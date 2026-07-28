const NOME_BANCO = "orbe-finalizacoes-ia";
const NOME_STORE = "imagens";

function abrirBanco() {
  return new Promise((resolve, reject) => {
    const pedido = indexedDB.open(NOME_BANCO, 1);
    pedido.onupgradeneeded = () => pedido.result.createObjectStore(NOME_STORE, { keyPath: "hashMapa" });
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
}

export async function obterFinalizacaoIA(hashMapa) {
  if (typeof indexedDB === "undefined") return null;
  const banco = await abrirBanco();
  return new Promise((resolve, reject) => {
    const pedido = banco.transaction(NOME_STORE, "readonly").objectStore(NOME_STORE).get(hashMapa);
    pedido.onsuccess = () => resolve(pedido.result || null);
    pedido.onerror = () => reject(pedido.error);
  });
}

export async function salvarFinalizacaoIA(valor) {
  if (typeof indexedDB === "undefined") return;
  const banco = await abrirBanco();
  await new Promise((resolve, reject) => {
    const pedido = banco.transaction(NOME_STORE, "readwrite").objectStore(NOME_STORE).put(valor);
    pedido.onsuccess = resolve;
    pedido.onerror = () => reject(pedido.error);
  });
}

export async function removerFinalizacaoIA(hashMapa) {
  if (typeof indexedDB === "undefined") return;
  const banco = await abrirBanco();
  banco.transaction(NOME_STORE, "readwrite").objectStore(NOME_STORE).delete(hashMapa);
}
