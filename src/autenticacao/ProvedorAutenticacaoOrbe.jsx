import { useEffect, useMemo, useState } from "react";

import { orbeOnlineHabilitado, supabaseOrbe } from "../services/supabaseOrbe.js";
import { limparSessaoLocalOrbe } from "../utils/contasOrbe.js";
import AutenticacaoOrbeContext from "./AutenticacaoOrbeContext.js";

export default function ProvedorAutenticacaoOrbe({ children }) {
  const online = orbeOnlineHabilitado();
  const [estado, setEstado] = useState({
    carregando: online,
    sessao: null,
  });

  useEffect(() => {
    if (!online || !supabaseOrbe) {
      setEstado({ carregando: false, sessao: null });
      return undefined;
    }

    let ativo = true;

    function aplicarSessao(sessao) {
      if (!ativo) return;
      if (!sessao?.user) limparSessaoLocalOrbe();
      setEstado({ carregando: false, sessao: sessao || null });
    }

    const { data: listener } = supabaseOrbe.auth.onAuthStateChange((_evento, sessao) => {
      aplicarSessao(sessao);
    });

    supabaseOrbe.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          aplicarSessao(null);
          return;
        }
        aplicarSessao(data.session);
      })
      .catch(() => aplicarSessao(null));

    return () => {
      ativo = false;
      listener.subscription.unsubscribe();
    };
  }, [online]);

  const valor = useMemo(() => ({
    online,
    carregando: estado.carregando,
    sessao: estado.sessao,
    usuario: estado.sessao?.user || null,
  }), [estado, online]);

  return (
    <AutenticacaoOrbeContext.Provider value={valor}>
      {children}
    </AutenticacaoOrbeContext.Provider>
  );
}
