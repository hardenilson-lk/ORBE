export default function AvisoSincronizacao({ conectado, podeTransmitir, estado, erro }) {
  return (
    <aside className="mesa-sonora__aviso" role="note">
      <strong>{conectado && podeTransmitir ? "Mesa Sonora ligada à sala LiveKit" : "Entre na voz como mestre para transmitir"}</strong>
      <span>Estado: {estado}. Arquivos locais chegam ao mestre e aos jogadores sem alterar o volume das vozes.</span>
      {erro ? <span>{erro}</span> : null}
      <small>YouTube e Spotify não são capturados em segredo. Use compartilhamento de aba ou integração oficial para essas fontes.</small>
    </aside>
  );
}
