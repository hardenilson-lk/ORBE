export default function ConfirmacaoEditorMapa({ confirmacao, aoConfirmar, aoCancelar }) {
  if (!confirmacao) return null;
  return (
    <div className="editor-mapa__confirmacao" role="alertdialog" aria-modal="true" aria-labelledby="confirmacao-editor-titulo">
      <div>
        <span>Ação estrutural</span>
        <h3 id="confirmacao-editor-titulo">{confirmacao.titulo}</h3>
        <p>{confirmacao.mensagem}</p>
        <footer>
          <button type="button" onClick={aoCancelar}>Cancelar</button>
          <button type="button" className="editor-mapa__perigo" onClick={aoConfirmar}>{confirmacao.rotulo || "Confirmar"}</button>
        </footer>
      </div>
    </div>
  );
}
