function iniciais(nome) {
  return String(nome || "M").trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase() || "M";
}

export default function ListaParticipantesVoz({ participantes, falando, totalEsperado }) {
  return <div className="comunicacao-mesa__participantes"><header><strong>Na voz</strong><small>{participantes.length}/{Math.max(totalEsperado, participantes.length)}</small></header>{participantes.length === 0 ? <p>Ninguém conectado. O navegador pedirá acesso ao microfone ao entrar.</p> : participantes.map((participante) => <div className={falando.has(participante.id) ? "falando" : ""} key={participante.id}><span>{iniciais(participante.nome)}</span><strong>{participante.nome}{participante.local ? " (você)" : ""}</strong><small>{falando.has(participante.id) ? "Falando" : participante.mudo ? "Mudo" : "Ouvindo"}</small></div>)}</div>;
}
