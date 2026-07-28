import "./IndicadorSalvamentoOrbe.css";

const ROTULOS = {
  pendente: "Alteracoes pendentes",
  salvando: "Salvando...",
  salvo: "Salvo",
  erro: "Erro ao salvar",
  "sem-conexao": "Offline: alteracoes nao enviadas",
  conflito: "Conflito de edicao",
};

export default function IndicadorSalvamentoOrbe({
  estado = "salvo",
  rascunhoDisponivel,
  aoRecuperar,
}) {
  return (
    <div className={`indicador-salvamento-orbe indicador-salvamento-orbe--${estado}`} role="status" aria-live="polite">
      <span className="indicador-salvamento-orbe__ponto" aria-hidden="true" />
      <span>{ROTULOS[estado] || ROTULOS.erro}</span>
      {rascunhoDisponivel ? (
        <button type="button" onClick={aoRecuperar}>
          Recuperar rascunho
        </button>
      ) : null}
    </div>
  );
}
