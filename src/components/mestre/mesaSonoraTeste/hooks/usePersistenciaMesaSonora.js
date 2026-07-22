import { useCallback, useEffect, useRef, useState } from "react";
import { CHAVE_MESA_SONORA, CHAVE_MESA_SONORA_LEGADA, ESTADO_INICIAL_MESA, ESTADOS_SOM } from "../constants/mesaSonoraConstants.js";
import { serializarMesa } from "../utils/mesaSonoraUtils.js";

function carregarMesa() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_MESA_SONORA) || localStorage.getItem(CHAVE_MESA_SONORA_LEGADA));
    if (!salvo || typeof salvo !== "object") return ESTADO_INICIAL_MESA;
    return {
      ...ESTADO_INICIAL_MESA,
      ...salvo,
      sons: Array.isArray(salvo.sons)
        ? salvo.sons.map((som) => ({ ...som, estado: ESTADOS_SOM.NORMAL, erro: "", urlObjeto: "", precisaArquivo: som.origem === "local" }))
        : [],
      cenas: Array.isArray(salvo.cenas) ? salvo.cenas : [],
      categorias: Array.isArray(salvo.categorias) ? salvo.categorias : ESTADO_INICIAL_MESA.categorias,
    };
  } catch {
    return ESTADO_INICIAL_MESA;
  }
}

export default function usePersistenciaMesaSonora() {
  const [mesa, setMesa] = useState(carregarMesa);
  const ignorarProximaGravacao = useRef(false);

  useEffect(() => {
    if (ignorarProximaGravacao.current) {
      ignorarProximaGravacao.current = false;
      return;
    }
    localStorage.setItem(CHAVE_MESA_SONORA, JSON.stringify(serializarMesa(mesa)));
    localStorage.removeItem(CHAVE_MESA_SONORA_LEGADA);
  }, [mesa]);

  const limparPersistencia = useCallback(() => {
    ignorarProximaGravacao.current = true;
    localStorage.removeItem(CHAVE_MESA_SONORA);
    localStorage.removeItem(CHAVE_MESA_SONORA_LEGADA);
    setMesa({ ...ESTADO_INICIAL_MESA, sons: [], cenas: [], categorias: [...ESTADO_INICIAL_MESA.categorias] });
  }, []);

  return { mesa, setMesa, limparPersistencia };
}
