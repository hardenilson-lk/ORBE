import { criarUrlEmbedSpotify } from "../utils/spotifyUtils.js";

export default function PlayerSpotify({ som }) {
  const url = criarUrlEmbedSpotify(som.url);
  if (!url) return null;
  return (
    <iframe
      className="mesa-sonora__spotify-player"
      title={`Spotify — ${som.nome}`}
      src={url}
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
