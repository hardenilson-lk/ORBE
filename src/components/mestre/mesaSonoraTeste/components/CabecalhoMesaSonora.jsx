export default function CabecalhoMesaSonora({ quantidade, ativos, aoVoltar, aoLimpar }) {
  return (
    <header className="mesa-sonora__cabecalho">
      <div>
        <span>Central de áudio · transmissão da sessão</span>
        <h2>Mesa Sonora</h2>
        <p>Dispare ambientes, músicas e efeitos como botões de uma central de áudio.</p>
      </div>
      <div className="mesa-sonora__cabecalho-acoes">
        <dl>
          <div><dt>Sons</dt><dd>{quantidade}</dd></div>
          <div><dt>Ativos</dt><dd>{ativos}</dd></div>
        </dl>
        {aoVoltar ? <button type="button" className="botao-console botao-console--claro" onClick={aoVoltar}>Voltar</button> : null}
        <button type="button" className="botao-console botao-console--perigo" onClick={aoLimpar}>Limpar Mesa Sonora</button>
      </div>
    </header>
  );
}
