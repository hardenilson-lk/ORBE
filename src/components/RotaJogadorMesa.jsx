import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router";

import {
  assinarMesasUsuarioRealtime,
  buscarMinhaAssociacaoMesaRemota,
  orbeOnlineHabilitado,
} from "../services/supabaseOrbe.js";

export default function RotaJogadorMesa() {
  const { mesaId = "local" } = useParams();
  const [estado, setEstado] = useState({
    verificando: true,
    permitido: false,
    aviso: "",
  });

  useEffect(() => {
    let ativo = true;
    let cancelarCanal = () => {};

    async function verificar() {
      if (!orbeOnlineHabilitado() || mesaId === "local") {
        if (ativo) {
          setEstado({
            verificando: false,
            permitido: true,
            aviso: "",
          });
        }
        return;
      }

      try {
        const associacao = await buscarMinhaAssociacaoMesaRemota(mesaId);
        const permitido = associacao?.status === "ativo";
        if (!ativo) return;
        setEstado({
          verificando: false,
          permitido,
          aviso:
            associacao?.status === "pendente"
              ? "Sua entrada ainda aguarda aprovação do mestre."
              : associacao?.status === "banido"
                ? "Você foi banido desta campanha."
              : "Você não possui acesso ativo a esta campanha.",
        });
      } catch (erro) {
        if (!ativo) return;
        setEstado({
          verificando: false,
          permitido: false,
          aviso:
            erro?.message ||
            "Não foi possível confirmar seu acesso à campanha.",
        });
      }
    }

    void verificar();
    void assinarMesasUsuarioRealtime(verificar).then((cancelar) => {
      if (!ativo) cancelar();
      else cancelarCanal = cancelar;
    });

    return () => {
      ativo = false;
      cancelarCanal();
    };
  }, [mesaId]);

  if (estado.verificando) {
    return (
      <main role="status" aria-live="polite">
        Confirmando acesso à campanha...
      </main>
    );
  }

  if (!estado.permitido) {
    return (
      <Navigate
        replace
        to="/mesas"
        state={{ aviso: estado.aviso }}
      />
    );
  }

  return <Outlet />;
}
