const FERRAMENTAS = [
  ["selecionar", "Selecionar", "V"],
  ["mover", "Mover visualização", "H"],
  ["criar-sala", "Criar sala", "R"],
  ["criar-corredor", "Criar corredor", "C"],
  ["criar-parede", "Criar parede", "W"],
  ["criar-porta", "Criar porta", "D"],
  ["criar-objeto", "Objeto", "O"],
  ["criar-luz", "Luz", "L"],
  ["apagar", "Apagar", "Delete"],
];

export default function BarraFerramentasEditorMapa({
  ferramenta,
  zoom,
  podeDesfazer,
  podeRefazer,
  aoSelecionarFerramenta,
  aoAproximar,
  aoAfastar,
  aoAjustar,
  aoDesfazer,
  aoRefazer,
  aoValidar,
  aoRestaurar,
  tipoObjeto,
  tipoLuz,
  objetosDisponiveis,
  luzesDisponiveis,
  aoAlterarTipoObjeto,
  aoAlterarTipoLuz,
}) {
  return (
    <div className="editor-mapa__ferramentas" aria-label="Ferramentas do editor">
      {FERRAMENTAS.map(([id, nome, atalho]) => (
        <button
          type="button"
          aria-pressed={ferramenta === id}
          title={`${nome} (${atalho})`}
          onClick={() => aoSelecionarFerramenta(id)}
          key={id}
        >
          {nome} <kbd>{atalho}</kbd>
        </button>
      ))}
      {ferramenta === "criar-objeto" ? (
        <label className="editor-mapa__catalogo-rapido">
          Objeto
          <select value={tipoObjeto} onChange={(evento) => aoAlterarTipoObjeto(evento.target.value)}>
            {objetosDisponiveis.map((objeto) => <option value={objeto.id} key={objeto.id}>{objeto.nome}</option>)}
          </select>
        </label>
      ) : null}
      {ferramenta === "criar-luz" ? (
        <label className="editor-mapa__catalogo-rapido">
          Luz
          <select value={tipoLuz} onChange={(evento) => aoAlterarTipoLuz(evento.target.value)}>
            {luzesDisponiveis.map((luz) => <option value={luz.id} key={luz.id}>{luz.nome}</option>)}
          </select>
        </label>
      ) : null}
      <span className="editor-mapa__separador" aria-hidden="true" />
      <button type="button" onClick={aoDesfazer} disabled={!podeDesfazer} title="Desfazer (Ctrl+Z)">Desfazer</button>
      <button type="button" onClick={aoRefazer} disabled={!podeRefazer} title="Refazer (Ctrl+Y)">Refazer</button>
      <button type="button" onClick={aoValidar}>Validar mapa</button>
      <button type="button" onClick={aoRestaurar}>Restaurar original</button>
      <span className="editor-mapa__zoom">
        <button type="button" onClick={aoAjustar}>Ajustar <kbd>0</kbd></button>
        <button type="button" onClick={aoAfastar} disabled={zoom <= 25} aria-label="Afastar visualização">−</button>
        <output aria-label="Zoom atual">{zoom}%</output>
        <button type="button" onClick={aoAproximar} disabled={zoom >= 300} aria-label="Aproximar visualização">+</button>
      </span>
    </div>
  );
}
