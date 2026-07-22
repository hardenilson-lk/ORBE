import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { assinarSalaComunicacao, obterSalaComunicacao } from "../../../../comunicacao/services/comunicacaoRoomStore.js";
import useRecepcaoMesaSonora from "./useRecepcaoMesaSonora.js";
import useTransmissaoMesaSonora from "./useTransmissaoMesaSonora.js";

const ContextoMesaSonora = createContext(null);

export function MesaSonoraLiveKitProvider({ mesaId, children, volumeSalaInicial = 80 }) {
  const [volumeSala, setVolumeSala] = useState(volumeSalaInicial);
  const sala = useSyncExternalStore(
    (notificar) => assinarSalaComunicacao(mesaId, notificar),
    () => obterSalaComunicacao(mesaId),
    () => obterSalaComunicacao(mesaId),
  );
  const recepcao = useRecepcaoMesaSonora({ mesaId, room: sala.room, conectado: sala.conectado });
  const transmissao = useTransmissaoMesaSonora({ room: sala.room, conectado: sala.conectado, volumeSala, meuVolumeEfetivo: recepcao.meuVolumeEfetivo });
  const valor = useMemo(
    () => ({ ...sala, ...recepcao, ...transmissao, volumeSala, setVolumeSala }),
    [recepcao, sala, transmissao, volumeSala],
  );

  return (
    <ContextoMesaSonora.Provider value={valor}>
      {children}
      <div ref={recepcao.elementosRef} hidden aria-hidden="true" />
    </ContextoMesaSonora.Provider>
  );
}

export function useMesaSonoraLiveKit() {
  const contexto = useContext(ContextoMesaSonora);
  if (!contexto) throw new Error("A Mesa Sonora precisa do provedor LiveKit da sala.");
  return contexto;
}
