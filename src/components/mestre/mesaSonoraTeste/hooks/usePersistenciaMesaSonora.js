import { useCallback, useEffect, useRef, useState } from "react";
import { CHAVE_MESA_SONORA, CHAVE_MESA_SONORA_LEGADA, ESTADO_INICIAL_MESA, ESTADOS_SOM } from "../constants/mesaSonoraConstants.js";
import { serializarMesa } from "../utils/mesaSonoraUtils.js";
import {
  carregarArquivoAudioLocal,
  limparArquivosAudioLocais,
} from "../utils/armazenamentoAudioLocal.js";
import { revogarUrlObjeto } from "../utils/audioUtils.js";

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
  const sonsIniciais = useRef(mesa.sons);

  useEffect(() => {
    let cancelado = false;

    const sonsLocais = sonsIniciais.current.filter(
      (som) => som.origem === "local" && som.id,
    );
    if (!sonsLocais.length) return undefined;

    Promise.all(
      sonsLocais.map(async (som) => {
        try {
          const registro = await carregarArquivoAudioLocal(som.id);
          return registro
            ? {
                id: som.id,
                urlObjeto: URL.createObjectURL(registro.arquivo),
                nomeArquivo: registro.nome || som.nomeArquivo,
              }
            : { id: som.id, urlObjeto: "" };
        } catch {
          return { id: som.id, urlObjeto: "" };
        }
      }),
    ).then((arquivosRestaurados) => {
      if (cancelado) {
        arquivosRestaurados.forEach((item) => revogarUrlObjeto(item.urlObjeto));
        return;
      }

      const arquivosPorId = new Map(
        arquivosRestaurados.map((item) => [item.id, item]),
      );
      setMesa((anterior) => ({
        ...anterior,
        sons: anterior.sons.map((som) => {
          const restaurado = arquivosPorId.get(som.id);
          if (!restaurado) return som;
          return {
            ...som,
            urlObjeto: restaurado.urlObjeto,
            nomeArquivo: restaurado.nomeArquivo || som.nomeArquivo,
            precisaArquivo: !restaurado.urlObjeto,
            estado: ESTADOS_SOM.NORMAL,
            erro: restaurado.urlObjeto
              ? ""
              : "Arquivo antigo: selecione-o novamente uma única vez para salvá-lo.",
          };
        }),
      }));
    });

    return () => {
      cancelado = true;
    };
  }, []);

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
    void limparArquivosAudioLocais().catch(() => {});
    setMesa({ ...ESTADO_INICIAL_MESA, sons: [], cenas: [], categorias: [...ESTADO_INICIAL_MESA.categorias] });
  }, []);

  return { mesa, setMesa, limparPersistencia };
}
