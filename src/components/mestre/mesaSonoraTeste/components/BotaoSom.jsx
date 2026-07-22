import { ESTADOS_SOM, ROTULOS_ORIGEM } from "../constants/mesaSonoraConstants.js";

export default function BotaoSom({ som, aoTocar, aoPausar, aoParar, aoReiniciar, aoEditar, aoRemover }) {
  const tocando = som.estado === ESTADOS_SOM.TOCANDO;
  return (
    <article className={`botao-som botao-som--${som.estado || ESTADOS_SOM.NORMAL}`} style={{ "--cor-som": som.cor }}>
      <button type="button" className="botao-som__disparo" onClick={() => aoTocar(som.id)} aria-label={`Tocar ${som.nome}`}>
        <span className="botao-som__icone">{som.icone || "♪"}</span>
        <span className="botao-som__texto"><strong>{som.nome}</strong><small>{som.categoria} · {ROTULOS_ORIGEM[som.origem]}</small></span>
        <span className="botao-som__estado">{som.estado || "normal"}</span>
      </button>
      <div className="botao-som__indicadores">
        {som.loop && <span>↻ Loop</span>}{som.atalho && <kbd>{som.atalho}</kbd>}<span>{som.volume}%</span>
      </div>
      {(som.erro || som.precisaArquivo) && <p>{som.erro || "ARQUIVO PRECISA SER SELECIONADO NOVAMENTE"}</p>}
      <div className="botao-som__acoes">
        <button type="button" onClick={() => tocando ? aoPausar(som.id) : aoTocar(som.id)}>{tocando ? "Pausar" : "Tocar"}</button>
        <button type="button" onClick={() => aoParar(som.id)}>Parar</button>
        <button type="button" onClick={() => aoReiniciar(som.id)}>Reiniciar</button>
        <button type="button" onClick={() => aoEditar(som)}>Editar</button>
        <button type="button" onClick={() => aoRemover(som.id)}>Remover</button>
      </div>
    </article>
  );
}
