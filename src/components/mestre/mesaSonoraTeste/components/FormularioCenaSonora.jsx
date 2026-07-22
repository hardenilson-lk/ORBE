import { useEffect, useState } from "react";

export default function FormularioCenaSonora({ sons, cenaEditada, aoSalvar, aoCancelar }) {
  const [nome, setNome] = useState("");
  const [sonsIds, setSonsIds] = useState([]);
  useEffect(() => { setNome(cenaEditada?.nome || ""); setSonsIds(cenaEditada?.sonsIds || []); }, [cenaEditada]);
  function alternar(id) { setSonsIds((lista) => lista.includes(id) ? lista.filter((item) => item !== id) : [...lista, id]); }
  function enviar(evento) { evento.preventDefault(); if (!nome.trim() || !sonsIds.length) return; aoSalvar({ nome: nome.trim(), sonsIds }, cenaEditada?.id); setNome(""); setSonsIds([]); }
  return (
    <form className="mesa-sonora__form-cena" onSubmit={enviar}>
      <h4>{cenaEditada ? "Editar cena" : "Criar cena sonora"}</h4>
      <label>Nome da cena<input required value={nome} onChange={(e) => setNome(e.target.value)} /></label>
      <fieldset><legend>Sons da cena</legend>{sons.length ? sons.map((som) => <label key={som.id}><input type="checkbox" checked={sonsIds.includes(som.id)} onChange={() => alternar(som.id)} />{som.icone} {som.nome}</label>) : <small>Cadastre sons primeiro.</small>}</fieldset>
      <div><button type="submit">Salvar cena</button>{cenaEditada && <button type="button" onClick={aoCancelar}>Cancelar</button>}</div>
    </form>
  );
}
