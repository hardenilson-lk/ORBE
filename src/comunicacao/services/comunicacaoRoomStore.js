const salas = new Map();
const assinantes = new Map();

function snapshotVazio(mesaId) {
  return { mesaId: String(mesaId), room: null, conectado: false, papel: "", identidade: "" };
}

export function obterSalaComunicacao(mesaId) {
  const chave = String(mesaId);
  if (!salas.has(chave)) salas.set(chave, snapshotVazio(chave));
  return salas.get(chave);
}

export function definirSalaComunicacao(mesaId, dados) {
  const chave = String(mesaId);
  const anterior = obterSalaComunicacao(chave);
  salas.set(chave, { ...anterior, ...dados, mesaId: chave });
  assinantes.get(chave)?.forEach((notificar) => notificar());
}

export function limparSalaComunicacao(mesaId, room) {
  const chave = String(mesaId);
  const atual = salas.get(chave);
  if (room && atual?.room && atual.room !== room) return;
  salas.set(chave, snapshotVazio(chave));
  assinantes.get(chave)?.forEach((notificar) => notificar());
}

export function assinarSalaComunicacao(mesaId, notificar) {
  const chave = String(mesaId);
  if (!assinantes.has(chave)) assinantes.set(chave, new Set());
  assinantes.get(chave).add(notificar);
  return () => assinantes.get(chave)?.delete(notificar);
}
