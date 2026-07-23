export default function ControleAudioExterno({
  conectado,
  podeTransmitir,
  transmitindo,
  iniciando,
  erro,
  nivel,
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
        <span className="mesa-sonora__audio-externo-origem">
          YouTube · Spotify · áudio externo
        </span>
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
        {transmitindo ? (
          <div className="mesa-sonora__transmissao-status" role="status" aria-live="polite">
            <span className="mesa-sonora__ao-vivo">
              <i aria-hidden="true" />
              AO VIVO
            </span>
            <div
              className="mesa-sonora__medidor"
              role="meter"
              aria-label="Nível do áudio transmitido"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={nivel}
            >
              <i style={{ width: `${Math.max(2, nivel)}%` }} />
            </div>
            <b className={nivel > 2 ? "tem-sinal" : "sem-sinal"}>
              {nivel > 2 ? "Áudio detectado e sendo enviado" : "Compartilhando, mas sem áudio detectado"}
            </b>
          </div>
        ) : null}
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
