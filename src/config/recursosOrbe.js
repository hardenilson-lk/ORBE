export const CONFIRMACAO_EMAIL_ATIVA =
  import.meta.env.VITE_EMAIL_CONFIRMATION_ENABLED !== "false";

function recursoAtivo(valor, padrao = true) {
  if (valor == null || valor === "") return padrao;
  return String(valor).toLowerCase() !== "false";
}

export const GERADOR_MAPAS_ATIVO =
  recursoAtivo(import.meta.env.VITE_GERADOR_MAPAS_ENABLED);

export const GERADOR_MAPAS_APLICACAO_ATIVA =
  recursoAtivo(import.meta.env.VITE_GERADOR_MAPAS_APPLICATION_ENABLED);

export const GERADOR_MAPAS_SINCRONIZACAO_ATIVA =
  recursoAtivo(import.meta.env.VITE_GERADOR_MAPAS_SYNC_ENABLED, false);
