import { salvarMesaRemota } from "../services/supabaseOrbe.js";

const CHAVE_MESAS = "orbe:mesas";

export function lerMesasSalvas() {
  try {
    const mesasSalvas = localStorage.getItem(CHAVE_MESAS);

    if (!mesasSalvas) {
      return [];
    }

    const mesasConvertidas = JSON.parse(mesasSalvas);

    return Array.isArray(mesasConvertidas)
      ? mesasConvertidas
      : [];
  } catch (erro) {
    console.error(
      "Não foi possível ler as mesas:",
      erro,
    );

    return [];
  }
}

export function salvarMesasLocal(mesas) {
  try {
    localStorage.setItem(
      CHAVE_MESAS,
      JSON.stringify(mesas),
    );
    return mesas;
  } catch (erro) {
    console.error(
      "Não foi possível salvar as mesas:",
      erro,
    );
    return [];
  }
}

export function salvarMesas(mesas) {
  const mesasSalvas = salvarMesasLocal(mesas);
  mesasSalvas.forEach((mesa) => {
    void salvarMesaRemota(mesa).catch((falha) => console.warn("Mesa salva localmente, mas não sincronizada.", falha));
  });
  return mesasSalvas;
}

export function aplicarMesaRemota(mesa) {
  if (!mesa?.id) return lerMesasSalvas();
  const atuais = lerMesasSalvas();
  const atualizadas = [mesa, ...atuais.filter((item) => String(item.id) !== String(mesa.id))];
  salvarMesasLocal(atualizadas);
  return atualizadas;
}

export function usuarioPodeAdministrarMesa(
  mesa,
  usuarioId,
) {
  const proprietarioId = String(
    mesa?.ownerId ||
      mesa?.criadaPorId ||
      "",
  );

  return Boolean(
    proprietarioId &&
      usuarioId &&
      proprietarioId ===
        String(usuarioId),
  );
}

export function gerarIdMesa() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function formatarData(data) {
  try {
    return new Date(data).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    );
  } catch {
    return "Data indisponível";
  }
}
