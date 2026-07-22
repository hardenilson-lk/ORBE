import { Navigate, Outlet, useLocation } from "react-router";

import { lerUsuarioAtual } from "../utils/contasOrbe.js";

export default function RotaProtegida() {
  const localizacao = useLocation();

  if (!lerUsuarioAtual()) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          origem: `${localizacao.pathname}${localizacao.search}${localizacao.hash}`,
          aviso: "Faça login para acessar esta área do ORBE.",
        }}
      />
    );
  }

  return <Outlet />;
}
