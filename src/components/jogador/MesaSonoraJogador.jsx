import { useMesaSonoraLiveKit } from "../mestre/mesaSonora/livekit/MesaSonoraLiveKitContext.jsx";
import "./MesaSonoraJogador.css";

export default function MesaSonoraJogador() {
  const mesa = useMesaSonoraLiveKit();
  const remoto = mesa.estadoRemoto || {};

  return (
    <section className="mesa-sonora-jogador" aria-label="Mesa Sonora">
      <header><span>Áudio da sessão</span><h2>Mesa Sonora</h2></header>
      <div className="mesa-sonora-jogador__agora">
        <small>Agora tocando</small>
        <strong>{remoto.somAtual || "Nenhum som"}</strong>
        <span>{remoto.cenaAtual ? `Cena: ${remoto.cenaAtual}` : "Sem cena ativa"}</span>
      </div>
      <label>Meu volume
        <input type="range" min="0" max="100" value={mesa.meuVolume} onChange={(evento) => mesa.setMeuVolume(Number(evento.target.value))} />
        <strong>{mesa.silenciado ? "Mudo" : `${mesa.meuVolume}%`}</strong>
      </label>
      <button type="button" onClick={() => mesa.setSilenciado(!mesa.silenciado)}>{mesa.silenciado ? "Voltar a ouvir" : "Silenciar Mesa Sonora"}</button>
      {mesa.audioBloqueado ? <button type="button" onClick={mesa.ativarAudio}>Ativar áudio da sessão</button> : null}
      <p data-estado={mesa.estadoRecepcao}>{mesa.conectado ? `Recepção: ${mesa.estadoRecepcao}` : "Entre na voz para receber o áudio."}</p>
    </section>
  );
}
