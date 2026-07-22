import { useEffect, useRef } from "react";
import { ESTADOS_SOM } from "../constants/mesaSonoraConstants.js";
import { carregarApiYouTube, extrairIdYouTube } from "../utils/youtubeUtils.js";

export default function PlayerYouTube({ som, registrar, atualizar }) {
  const alvoRef = useRef(null);

  useEffect(() => {
    let player;
    let cancelado = false;
    const idVideo = extrairIdYouTube(som.url);
    if (!idVideo) return undefined;

    carregarApiYouTube().then((YT) => {
      if (cancelado || !alvoRef.current) return;
      player = new YT.Player(alvoRef.current, {
        width: "280",
        height: "158",
        videoId: idVideo,
        playerVars: { controls: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: () => {
            player.setVolume(Number(som.volume));
            atualizar(som.id, { estado: ESTADOS_SOM.NORMAL, erro: "" });
            registrar(som.id, {
              tocar: () => player.playVideo(),
              pausar: () => player.pauseVideo(),
              parar: () => player.stopVideo(),
              reiniciar: () => { player.seekTo(0, true); player.playVideo(); },
              destruir: () => player.destroy(),
            });
          },
          onStateChange: (evento) => {
            if (evento.data === YT.PlayerState.PLAYING) atualizar(som.id, { estado: ESTADOS_SOM.TOCANDO, erro: "" });
            if (evento.data === YT.PlayerState.PAUSED) atualizar(som.id, { estado: ESTADOS_SOM.PAUSADO });
            if (evento.data === YT.PlayerState.ENDED) {
              if (som.loop) { player.seekTo(0, true); player.playVideo(); }
              else atualizar(som.id, { estado: ESTADOS_SOM.NORMAL });
            }
          },
          onError: () => atualizar(som.id, { estado: ESTADOS_SOM.ERRO, erro: "Vídeo indisponível para incorporação." }),
        },
      });
    }).catch((erro) => atualizar(som.id, { estado: ESTADOS_SOM.ERRO, erro: erro.message }));

    return () => {
      cancelado = true;
      registrar(som.id, null);
      player?.destroy?.();
    };
  }, [som.id, som.url, som.volume, som.loop, registrar, atualizar]);

  return <div className="mesa-sonora__youtube-player" ref={alvoRef} />;
}
