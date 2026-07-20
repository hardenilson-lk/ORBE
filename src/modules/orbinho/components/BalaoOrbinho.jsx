import { forwardRef } from "react";

import MenuOrbinho from "./MenuOrbinho.jsx";

const BalaoOrbinho = forwardRef(function BalaoOrbinho({
  titulo,
  mensagem,
  etapa,
  tipoRota,
  tutorial,
  etapaAtual,
  totalEtapas,
  aoEscolher,
  aoProximo,
  aoVoltar,
  aoPular,
  aoFechar,
  aoVoltarMenu,
  mostrarMenu,
  estilo,
}, ref) {
  return (
    <section
      className={`orbinho-balao${tutorial ? " orbinho-balao--tutorial" : ""}`}
      style={estilo}
      role="dialog"
      aria-modal="false"
      aria-labelledby="orbinho-titulo"
      tabIndex="-1"
      ref={ref}
    >
      <header className="orbinho-balao__cabecalho">
        <div>
          <span>Orbinho</span>
          <h2 id="orbinho-titulo">{titulo}</h2>
        </div>
        <button type="button" aria-label="Fechar Orbinho" onClick={aoFechar}>×</button>
      </header>

      <p className="orbinho-balao__mensagem">{mensagem}</p>

      {tutorial && etapa?.passos?.length ? (
        <div className="orbinho-balao__instrucao">
          {etapa.categoria ? <strong>{etapa.categoria}</strong> : null}
          <ol>
            {etapa.passos.map((passo) => <li key={passo}>{passo}</li>)}
          </ol>
        </div>
      ) : null}

      {tutorial && etapa?.dica ? (
        <p className="orbinho-balao__dica"><span aria-hidden="true">✦</span> {etapa.dica}</p>
      ) : null}

      {mostrarMenu ? (
        <MenuOrbinho tipoRota={tipoRota} aoEscolher={aoEscolher} aoFechar={aoFechar} />
      ) : tutorial ? (
        <>
          <div className="orbinho-balao__progresso" aria-live="polite">
            <span>{etapaAtual + 1} de {totalEtapas}</span>
            <div aria-hidden="true"><i style={{ width: `${((etapaAtual + 1) / totalEtapas) * 100}%` }} /></div>
          </div>
          <div className="orbinho-balao__acoes">
            <button type="button" onClick={aoVoltar} disabled={etapaAtual === 0}>Voltar</button>
            <button type="button" onClick={aoPular}>Pular tutorial</button>
            <button className="orbinho-balao__principal" type="button" onClick={aoProximo}>
              {etapaAtual + 1 === totalEtapas ? "Concluir" : "Próximo"}
            </button>
          </div>
        </>
      ) : (
        <div className="orbinho-balao__acoes">
          <button type="button" onClick={aoVoltarMenu}>Voltar</button>
          <button type="button" onClick={aoFechar}>Fechar</button>
        </div>
      )}
    </section>
  );
});

export default BalaoOrbinho;
