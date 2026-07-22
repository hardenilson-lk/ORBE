import { ORIGENS_SOM } from "../constants/mesaSonoraConstants.js";
import PlayerArquivoLocal from "../players/PlayerArquivoLocal.jsx";
import PlayerSpotify from "../players/PlayerSpotify.jsx";
import PlayerYouTube from "../players/PlayerYouTube.jsx";

export default function PlayersExternos({ sons, spotifyAtivoId, registrar, atualizar }) {
  const locais = sons.filter((som) => som.origem === ORIGENS_SOM.LOCAL);
  const youtube = sons.filter((som) => som.origem === ORIGENS_SOM.YOUTUBE);
  const spotifyAtivo = sons.find((som) => som.id === spotifyAtivoId && som.origem === ORIGENS_SOM.SPOTIFY);

  return (
    <section className="mesa-sonora__players">
      {locais.map((som) => <PlayerArquivoLocal key={som.id} som={som} registrar={registrar} atualizar={atualizar} />)}
      <header><span>Players oficiais</span><h3>Fontes externas</h3></header>
      <p>YouTube usa a API oficial. Spotify abre o Embed oficial, cujos controles, volume e término não podem ser comandados pela mesa.</p>
      <div className="mesa-sonora__players-grade">
        {youtube.map((som) => <article key={som.id}><strong>{som.nome}</strong><PlayerYouTube som={som} registrar={registrar} atualizar={atualizar} /></article>)}
        {spotifyAtivo && <article className="mesa-sonora__player-spotify"><strong>{spotifyAtivo.nome}</strong><PlayerSpotify som={spotifyAtivo} /></article>}
        {!youtube.length && !spotifyAtivo && <span className="mesa-sonora__vazio">Nenhuma fonte externa cadastrada ou ativada.</span>}
      </div>
    </section>
  );
}
