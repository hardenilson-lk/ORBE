import { useContext } from "react";

import AutenticacaoOrbeContext from "./AutenticacaoOrbeContext.js";

export default function useAutenticacaoOrbe() {
  const contexto = useContext(AutenticacaoOrbeContext);
  if (!contexto) throw new Error("useAutenticacaoOrbe deve ser usado dentro do provedor de autenticação.");
  return contexto;
}
