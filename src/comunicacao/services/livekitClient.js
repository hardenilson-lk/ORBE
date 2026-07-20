import { Room, RoomEvent, Track } from "livekit-client";

export { RoomEvent, Track };

export function criarClienteLiveKit() {
  return new Room({ adaptiveStream: true, dynacast: true, disconnectOnPageLeave: true });
}

export async function publicarDados(room, dados, topico) {
  const bytes = new TextEncoder().encode(JSON.stringify(dados));
  await room.localParticipant.publishData(bytes, { reliable: true, topic: topico });
}

export function lerDadosRecebidos(payload) {
  try { return JSON.parse(new TextDecoder().decode(payload)); }
  catch (erro) {
    console.warn("[Comunicação] Pacote de dados ignorado.", erro);
    return null;
  }
}
