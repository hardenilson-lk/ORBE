import { useEffect } from "react";
import { useMesaSonoraLiveKit } from "../../mesaSonora/livekit/MesaSonoraLiveKitContext.jsx";
import { ESTADOS_SOM } from "../constants/mesaSonoraConstants.js";

export default function PlayerArquivoLocal({ som, registrar, atualizar }) {
  const { criarControleArquivo } = useMesaSonoraLiveKit();
  const { id, urlObjeto, nome, volume, loop, fadeIn, fadeOut } = som;

  useEffect(() => {
    if (!urlObjeto) {
      registrar(id, null);
      return undefined;
    }

    const configuracao = { id, urlObjeto, nome, volume, loop, fadeIn, fadeOut };
    const estado = (novoEstado, erro = "") => atualizar(id, { estado: novoEstado, erro });
    const controle = criarControleArquivo(configuracao, {
      aoTocar: () => estado(ESTADOS_SOM.TOCANDO),
      aoPausar: () => estado(ESTADOS_SOM.PAUSADO),
      aoParar: () => estado(ESTADOS_SOM.NORMAL),
      aoFinalizar: () => !loop && estado(ESTADOS_SOM.NORMAL),
      aoErro: (erro) => estado(ESTADOS_SOM.ERRO, erro),
    });

    registrar(id, controle);
    return () => {
      registrar(id, null);
    };
  }, [criarControleArquivo, fadeIn, fadeOut, id, loop, nome, registrar, atualizar, urlObjeto, volume]);

  return null;
}
