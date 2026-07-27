import { ETAPAS_ESTRUTURAIS, ROTULOS_STATUS_ETAPA } from "../data/etapasGeradorMapa.js";

export default function ProgressoGeracaoMapa({ estados, visivel }) {
  if (!visivel) return null;
  return (
    <section className="gerador-mapa__progresso" aria-live="polite">
      <header><span>Gerando mapa</span><h3>Progresso estrutural e temático</h3></header>
      <div>
        {ETAPAS_ESTRUTURAIS.map((etapa) => (
          <span className={`gerador-mapa__progresso-item gerador-mapa__progresso-item--${estados[etapa.id]}`} key={etapa.id}>
            <b>{String(estados[etapa.id]).startsWith("concluida") || estados[etapa.id] === "ignorada" ? "✓" : estados[etapa.id] === "erro" ? "×" : "•"}</b>
            {etapa.nome}: {ROTULOS_STATUS_ETAPA[estados[etapa.id]]}
          </span>
        ))}
      </div>
    </section>
  );
}
