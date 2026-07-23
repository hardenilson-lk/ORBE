import { Navigate, Outlet, useLocation } from "react-router";

import useAutenticacaoOrbe from "../autenticacao/useAutenticacaoOrbe.js";
import { lerUsuarioAtual } from "../utils/contasOrbe.js";

export default function RotaProtegida() {
  const localizacao = useLocation();
  const { online, carregando, usuario } = useAutenticacaoOrbe();
  const autenticado = online ? Boolean(usuario) : Boolean(lerUsuarioAtual());

  if (carregando) {
    return <main role="status" aria-live="polite">Restaurando sua sessão...</main>;
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          origem: `${localizacao.pathname}${localizacao.search}${localizacao.hash}`,
          aviso: online
            ? "Sua sessão expirou. Entre novamente."
            : "Faça login para acessar esta área do ORBE.",
        }}
      />
    );
  }

  return <Outlet />;
}
