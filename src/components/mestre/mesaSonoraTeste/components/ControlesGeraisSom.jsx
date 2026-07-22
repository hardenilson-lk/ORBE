import { ORIGENS_SOM, ROTULOS_ORIGEM } from "../constants/mesaSonoraConstants.js";

export default function ControlesGeraisSom({ mesa, busca, setBusca, categoria, setCategoria, origem, setOrigem, volumeSala, aoVolumeSala, meuVolume, aoMeuVolume, silenciado, aoSilenciar, aoEncerrarFaixa, aoParar, aoPausar, aoRetomar, aoLimparFinalizados }) {
  return (
    <section className="mesa-sonora__controles" aria-label="Controles gerais">
      <div className="mesa-sonora__controle-master">
        <label>Volume da sala
          <input type="range" min="0" max="100" value={volumeSala} onChange={(e) => aoVolumeSala(Number(e.target.value))} />
        </label>
        <strong>{volumeSala}%</strong>
        <label>Meu volume
          <input type="range" min="0" max="100" value={meuVolume} onChange={(e) => aoMeuVolume(Number(e.target.value))} />
        </label>
        <strong>{silenciado ? "Mudo" : `${meuVolume}%`}</strong>
        <button type="button" onClick={aoSilenciar}>{silenciado ? "Ouvir mesa" : "Silenciar para mim"}</button>
      </div>
      <div className="mesa-sonora__transportes">
        <button type="button" onClick={aoParar}>■ Parar tudo</button>
        <button type="button" onClick={aoPausar}>Ⅱ Pausar tudo</button>
        <button type="button" onClick={aoRetomar}>▶ Retomar pausados</button>
        <button type="button" onClick={aoLimparFinalizados}>Limpar finalizados</button>
        <button type="button" onClick={aoEncerrarFaixa}>Encerrar transmissão</button>
      </div>
      <div className="mesa-sonora__filtros">
        <label>Buscar<input type="search" placeholder="Nome ou categoria" value={busca} onChange={(e) => setBusca(e.target.value)} /></label>
        <label>Categoria<select value={categoria} onChange={(e) => setCategoria(e.target.value)}><option value="todas">Todas</option>{mesa.categorias.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Origem<select value={origem} onChange={(e) => setOrigem(e.target.value)}><option value="todas">Todas</option>{Object.values(ORIGENS_SOM).map((item) => <option key={item} value={item}>{ROTULOS_ORIGEM[item]}</option>)}</select></label>
      </div>
    </section>
  );
}
