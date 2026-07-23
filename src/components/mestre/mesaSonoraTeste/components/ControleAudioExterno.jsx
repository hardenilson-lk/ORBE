export default function ControleAudioExterno({
  conectado,
  podeTransmitir,
  transmitindo,
  iniciando,
  erro,
  aoIniciar,
  aoEncerrar,
}) {
  const indisponivel = !conectado || !podeTransmitir;

  return (
    <section
      className={
        transmitindo
          ? "mesa-sonora__audio-externo mesa-sonora__audio-externo--ativo"
          : "mesa-sonora__audio-externo"
      }
    >
      <div>
        <span>YouTube · Spotify · áudio externo</span>
        <strong>
          {transmitindo
            ? "Áudio da aba sendo transmitido"
            : "Transmitir áudio de uma aba"}
        </strong>
        <p>
          {transmitindo
            ? "Todos na voz recebem esta fonte pela Mesa Sonora."
            : "Escolha a aba que está tocando e marque “Compartilhar áudio” na janela do navegador."}
        </p>
        {erro ? <small role="alert">{erro}</small> : null}
      </div>

      {transmitindo ? (
        <button
          type="button"
          className="botao-console botao-console--perigo"
          onClick={aoEncerrar}
        >
          Encerrar transmissão
        </button>
      ) : (
        <button
          type="button"
          className="botao-console botao-console--primario"
          disabled={indisponivel || iniciando}
          onClick={aoIniciar}
        >
          {iniciando
            ? "Aguardando escolha..."
            : indisponivel
              ? "Entre na voz como mestre"
              : "Transmitir áudio da aba"}
        </button>
      )}
    </section>
  );
}
