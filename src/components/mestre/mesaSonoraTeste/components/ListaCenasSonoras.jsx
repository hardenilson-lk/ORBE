import { useState } from "react";
import FormularioCenaSonora from "./FormularioCenaSonora.jsx";

export default function ListaCenasSonoras({ cenas, sons, aoSalvar, aoRemover, aoAtivar, aoParar }) {
  const [edicao, setEdicao] = useState(null);
  return (
    <section className="mesa-sonora__cenas">
      <header><span>Programação combinada</span><h3>Cenas sonoras</h3></header>
      <FormularioCenaSonora sons={sons} cenaEditada={edicao} aoCancelar={() => setEdicao(null)} aoSalvar={(dados, id) => { aoSalvar(dados, id); setEdicao(null); }} />
      <div className="mesa-sonora__lista-cenas">{cenas.map((cena) => <article key={cena.id}><div><strong>{cena.nome}</strong><small>{cena.sonsIds.length} sons programados</small></div><ul>{cena.sonsIds.map((id) => { const som = sons.find((item) => item.id === id); return som ? <li key={id} className={`cena-som--${som.estado}`}>{som.icone} {som.nome} <span>{som.estado}</span></li> : null; })}</ul><div><button type="button" onClick={() => aoAtivar(cena)}>Ativar</button><button type="button" onClick={() => aoParar(cena)}>Parar</button><button type="button" onClick={() => setEdicao(cena)}>Editar</button><button type="button" onClick={() => aoRemover(cena.id)}>Remover</button></div></article>)}</div>
    </section>
  );
}
