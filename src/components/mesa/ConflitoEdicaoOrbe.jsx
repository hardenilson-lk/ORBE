import "./ConflitoEdicaoOrbe.css";

function resumir(valor) {
  if (typeof valor === "string") return valor || "(vazio)";
  try {
    return JSON.stringify(valor, null, 2);
  } catch {
    return "Não foi possível exibir esta versão.";
  }
}

export default function ConflitoEdicaoOrbe({
  registro = "registro",
  local,
  remoto,
  atualizadoEm,
  autor,
  aoCarregarServidor,
  aoManterLocal,
  aoFechar,
}) {
  return (
    <section className="conflito-edicao-orbe" role="dialog" aria-modal="false" aria-labelledby="conflito-edicao-orbe-titulo">
      <header>
        <div>
          <span>Conflito de edição</span>
          <h3 id="conflito-edicao-orbe-titulo">{registro}</h3>
        </div>
        <button type="button" onClick={aoFechar} aria-label="Adiar decisão">×</button>
      </header>
      <p>
        Existem alterações locais pendentes e uma versão mais recente no servidor. Nenhuma versão será descartada sem sua decisão.
      </p>
      <small>{atualizadoEm ? `Servidor atualizado em ${atualizadoEm}.` : "Versão remota recebida agora."}{autor ? ` Alterado por ${autor}.` : ""}</small>
      <div className="conflito-edicao-orbe__versoes">
        <article><strong>Minhas alterações</strong><pre>{resumir(local)}</pre></article>
        <article><strong>Servidor</strong><pre>{resumir(remoto)}</pre></article>
      </div>
      <footer>
        <button type="button" onClick={aoCarregarServidor}>Carregar versão do servidor</button>
        <button type="button" onClick={aoManterLocal}>Manter minhas alterações</button>
      </footer>
    </section>
  );
}
