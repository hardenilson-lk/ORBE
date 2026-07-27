import { useMemo, useState } from "react";

function unicosPor(lista, campo) {
  const vistos = new Set();
  return lista.filter((item) => {
    const chave = String(item?.[campo] || item?.nome || "");
    if (!chave || vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}

export default function LegendaMapa({ mapa, papelAtual = "mestre" }) {
  const [aberta, setAberta] = useState(true);
  const salas = useMemo(
    () => unicosPor((mapa?.arquiteturaVisual?.salas || [])
      .filter((sala) => papelAtual === "mestre" || !sala.secreta), "tipoTematico"),
    [mapa?.arquiteturaVisual?.salas, papelAtual],
  );
  const objetos = useMemo(
    () => unicosPor(
      (mapa?.objetosCenario || []).filter(
        (item) => papelAtual === "mestre" || item.visivelJogador !== false,
      ),
      "tipo",
    ),
    [mapa?.objetosCenario, papelAtual],
  );
  if (!mapa?.arquiteturaVisual && !objetos.length) return null;
  return (
    <details
      className="legenda-mapa"
      open={aberta}
      onToggle={(evento) => setAberta(evento.currentTarget.open)}
    >
      <summary>Legenda do mapa</summary>
      <div>
        <section>
          <h4>Arquitetura</h4>
          <p><i className="legenda-mapa__amostra legenda-mapa__amostra--sala" /> Piso de sala</p>
          <p><i className="legenda-mapa__amostra legenda-mapa__amostra--corredor" /> Corredor</p>
          <p><i className="legenda-mapa__amostra legenda-mapa__amostra--parede" /> Parede visual</p>
          <p><i className="legenda-mapa__amostra legenda-mapa__amostra--porta" /> Porta</p>
          <p><i className="legenda-mapa__amostra legenda-mapa__amostra--luz" /> Fonte de luz</p>
        </section>
        {salas.length ? (
          <section><h4>Salas e áreas</h4>{salas.map((sala) => <p key={sala.tipoTematico}><i>▣</i>{sala.nome || sala.tipoTematico}</p>)}</section>
        ) : null}
        {objetos.length ? (
          <section><h4>Objetos</h4>{objetos.slice(0, 18).map((objeto) => <p key={objeto.tipo || objeto.nome}><i>◆</i>{objeto.nome || objeto.tipo}</p>)}</section>
        ) : null}
        <section>
          <h4>Peças</h4>
          <p><i className="legenda-mapa__amostra legenda-mapa__amostra--agente" /> Agente</p>
          <p><i className="legenda-mapa__amostra legenda-mapa__amostra--npc" /> NPC</p>
        </section>
      </div>
    </details>
  );
}
