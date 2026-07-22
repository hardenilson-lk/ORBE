import BotaoSom from "./BotaoSom.jsx";

export default function ListaBotoesSom({ sons, ...acoes }) {
  return (
    <section className="mesa-sonora__biblioteca">
      <header><span>Painel de disparo</span><h3>Botões de som</h3></header>
      {sons.length ? <div className="mesa-sonora__botoes">{sons.map((som) => <BotaoSom key={som.id} som={som} {...acoes} />)}</div> : <p className="mesa-sonora__vazio">Nenhum som corresponde aos filtros. Cadastre um canal ou ajuste a busca.</p>}
    </section>
  );
}
