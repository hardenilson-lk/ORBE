import { ETAPAS_ESTRUTURAIS, ROTULOS_STATUS_ETAPA } from "../data/etapasGeradorMapa.js";
import { MODOS_GERACAO_MAPA } from "../data/modosGeracaoMapa.js";

function resumoEtapa(mapa, etapa) {
  if (etapa === "salas") return `${mapa?.salas?.length || 0} sala(s)`;
  if (etapa === "corredores") return `${mapa?.corredores?.length || 0} corredor(es)`;
  if (etapa === "navegacao") return mapa?.entrada ? `Distância: ${mapa.navegacao?.distanciaEntradaSaida || 0}` : "Entrada e saída pendentes";
  if (etapa === "paredes") return `${mapa?.paredes?.length || 0} parede(s)`;
  if (etapa === "portas") return `${mapa?.portas?.length || 0} porta(s)`;
  return mapa?.validacaoEstrutural?.valido ? "Mapa estrutural válido" : "Validação pendente";
}

function motivoBloqueio(indice) {
  if (indice === 0) return "";
  return `Conclua ${ETAPAS_ESTRUTURAIS[indice - 1].nome} primeiro.`;
}

export default function SeletorModoGeracao({ modo, aoAlterar, estados, mapa, aoExecutar }) {
  return (
    <section className="gerador-mapa__secao">
      <header><span>Estratégia</span><h3>Modo de geração</h3></header>
      <div className="gerador-mapa__modos">
        {MODOS_GERACAO_MAPA.map((opcao) => (
          <label className={modo === opcao.id ? "gerador-mapa__modo gerador-mapa__modo--ativo" : "gerador-mapa__modo"} key={opcao.id}>
            <input type="radio" name="modo-geracao-mapa" value={opcao.id} checked={modo === opcao.id} onChange={() => aoAlterar(opcao.id)} />
            <strong>{opcao.nome}</strong><small>{opcao.descricao}</small>
          </label>
        ))}
      </div>
      {modo === "por-partes" ? (
        <div className="gerador-mapa__etapas-detalhadas" aria-label="Etapas da geração por partes">
          {ETAPAS_ESTRUTURAIS.map((etapa, indice) => {
            const status = estados[etapa.id];
            const executavel = status !== "bloqueada" && status !== "processando";
            const jaGerada = ["concluida", "desatualizada", "erro"].includes(status) && Boolean(mapa);
            return (
              <article className={`gerador-mapa__etapa-card gerador-mapa__etapa-card--${status}`} key={etapa.id}>
                <b>{indice + 1}</b>
                <div><strong>{etapa.nome}</strong><span>Status: {ROTULOS_STATUS_ETAPA[status]}</span><small>{status === "bloqueada" ? motivoBloqueio(indice) : resumoEtapa(mapa, etapa.id)}</small></div>
                <button type="button" disabled={!executavel} onClick={() => aoExecutar(etapa.id)}>
                  {status === "processando" ? "Processando…" : etapa.id === "validacao" ? (jaGerada ? "Validar novamente" : "Validar mapa") : jaGerada ? `Refazer ${etapa.nome.toLowerCase()}` : `Gerar ${etapa.nome.toLowerCase()}`}
                </button>
              </article>
            );
          })}
          <p className="gerador-mapa__informacao">Iluminação e decoração permanecem bloqueadas para as próximas etapas.</p>
        </div>
      ) : null}
      {modo === "gerar-editar" ? <p className="gerador-mapa__informacao">O editor está disponível para visualização e inspeção. As ferramentas de alteração serão liberadas nas próximas etapas.</p> : null}
    </section>
  );
}
