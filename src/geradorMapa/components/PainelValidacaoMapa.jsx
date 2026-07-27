const ROTULOS = {
  salasDentroDoMapa: "Salas dentro do mapa",
  salasSemSobreposicao: "Salas sem sobreposição",
  corredoresValidos: "Corredores válidos",
  grafoConectado: "Grafo conectado",
  chaoConectado: "Chão caminhável",
  entradaValida: "Entrada válida",
  saidaValida: "Saída válida",
  caminhoEntradaSaida: "Caminho até o objetivo",
  paredesValidas: "Paredes válidas",
  portasValidas: "Portas válidas",
  navegacaoPortasAbertas: "Navegação com portas abertas",
  navegacaoEstadosIniciais: "Navegação estrutural inicial",
};

export default function PainelValidacaoMapa({ validacao, aoCorrigir }) {
  if (!validacao?.verificacoes) {
    return (
      <section className="gerador-mapa__validacao">
        <header>
          <span>Validação</span>
          <h3>Estrutura pendente</h3>
        </header>
        <p>Gere paredes e portas para liberar a validação estrutural completa.</p>
      </section>
    );
  }

  return (
    <section className="gerador-mapa__validacao">
      <header>
        <div>
          <span>Validação</span>
          <h3>{validacao.valido ? "Mapa estrutural válido" : "Estrutura com problemas"}</h3>
        </div>
        <strong className={validacao.valido ? "gerador-mapa__validacao-ok" : "gerador-mapa__validacao-erro"}>
          {validacao.valido ? "✓ Aprovado" : `✕ ${validacao.erros.length} erro(s)`}
        </strong>
      </header>

      <div className="gerador-mapa__verificacoes">
        {Object.entries(validacao.verificacoes).map(([chave, passou]) => (
          <span className={passou ? "gerador-mapa__verificacao-ok" : "gerador-mapa__verificacao-erro"} key={chave}>
            {passou ? "✓" : "✕"} {ROTULOS[chave] || chave}
          </span>
        ))}
      </div>

      {validacao.erros.length > 0 || validacao.avisos.length > 0 ? (
        <details>
          <summary>{validacao.erros.length} erro(s) · {validacao.avisos.length} aviso(s)</summary>
          {validacao.erros.map((erro) => <p className="gerador-mapa__erro-validacao" key={`${erro.codigo}-${erro.mensagem}`}>✕ {erro.mensagem}</p>)}
          {validacao.avisos.map((aviso) => <p className="gerador-mapa__aviso-validacao" key={`${aviso.codigo}-${aviso.mensagem}`}>⚠ {aviso.mensagem}</p>)}
        </details>
      ) : null}

      {validacao.corrigiveis.length > 0 ? (
        <button type="button" onClick={aoCorrigir}>Corrigir automaticamente</button>
      ) : null}
    </section>
  );
}
