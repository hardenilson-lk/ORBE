import { CAMADAS_EDITOR } from "./configEditorMapa.js";

export default function PainelCamadasEditorMapa({ camadas, aoAlternar }) {
  return (
    <aside className="editor-mapa__painel editor-mapa__camadas">
      <h3>Camadas</h3>
      {CAMADAS_EDITOR.map(([id, nome]) => (
        <label key={id}>
          <input
            type="checkbox"
            checked={camadas[id]}
            onChange={() => aoAlternar(id)}
          />
          <span>{nome}</span>
          <small>{camadas[id] ? "Visível" : "Oculta"}</small>
        </label>
      ))}
    </aside>
  );
}
