import { useEffect } from "react";
import { elementoAceitaDigitacao, normalizarAtalho } from "../utils/mesaSonoraUtils.js";

export default function useAtalhosMesaSonora(sons, tocarSom) {
  useEffect(() => {
    function executarAtalho(evento) {
      if (elementoAceitaDigitacao(evento.target)) return;
      const atalho = normalizarAtalho(evento);
      const som = sons.find((item) => item.origem === "local" && item.atalho === atalho);
      if (!som) return;
      evento.preventDefault();
      tocarSom(som.id);
    }

    window.addEventListener("keydown", executarAtalho);
    return () => window.removeEventListener("keydown", executarAtalho);
  }, [sons, tocarSom]);
}
