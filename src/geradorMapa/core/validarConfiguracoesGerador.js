const LIMITES = {
  largura: { minimo: 10, maximo: 60, nome: "A largura" },
  altura: { minimo: 10, maximo: 60, nome: "A altura" },
  quantidadeSalas: { minimo: 3, maximo: 30, nome: "A quantidade de salas" },
  larguraCorredores: { minimo: 1, maximo: 3, nome: "A largura dos corredores" },
};

export function validarConfiguracoesGerador(configuracoes) {
  for (const [campo, limite] of Object.entries(LIMITES)) {
    const valor = Number(configuracoes[campo]);

    if (!Number.isFinite(valor)) {
      return { valida: false, mensagem: `${limite.nome} precisa ser um número válido.` };
    }

    if (valor < limite.minimo || valor > limite.maximo) {
      return {
        valida: false,
        mensagem: `${limite.nome} deve estar entre ${limite.minimo} e ${limite.maximo}.`,
      };
    }
  }

  if (!String(configuracoes.seed || "").trim()) {
    return { valida: false, mensagem: "Informe uma seed antes de gerar as salas." };
  }

  return { valida: true, mensagem: "" };
}
