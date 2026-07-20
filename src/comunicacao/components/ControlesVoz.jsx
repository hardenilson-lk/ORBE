export default function ControlesVoz({ conectado, microfoneMudo, audioSilenciado, aoAlternarMicrofone, aoAlternarAudio, aoPedirAtencao, aoPedirFala }) {
  return <div className="comunicacao-mesa__controles">
    <button type="button" onClick={aoAlternarMicrofone} disabled={!conectado} className={microfoneMudo ? "alerta" : ""}><span>{microfoneMudo ? "⊘" : "◉"}</span>{microfoneMudo ? "Ativar mic" : "Silenciar mic"}</button>
    <button type="button" onClick={aoAlternarAudio} disabled={!conectado} className={audioSilenciado ? "alerta" : ""}><span>{audioSilenciado ? "◌" : "◖"}</span>{audioSilenciado ? "Ouvir mesa" : "Silenciar mesa"}</button>
    <button type="button" onClick={aoPedirAtencao} disabled={!conectado}><span>!</span>Atenção</button>
    <button type="button" onClick={aoPedirFala} disabled={!conectado}><span>✋</span>Pedir fala</button>
  </div>;
}
