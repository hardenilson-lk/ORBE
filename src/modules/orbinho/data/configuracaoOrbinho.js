export const configuracaoOrbinho = {
  nome: "Orbinho",
  mensagemInicial:
    "Olá! Eu sou o Orbinho. Posso mostrar como utilizar esta área do sistema Arquivos.",
  rotasHabilitadas: [
    "/arquivos",
    "/arquivos/nova-mesa",
    "/arquivos/minhas-mesas",
    "/arquivos/mesa/:mesaId",
    "/arquivos/jogador/:mesaId",
  ],
  posicao: "inferior-direita",
  aberturaAutomatica: false,
  duracaoAnimacao: 220,
  chavesArmazenamento: {
    estado: "orbe:arquivos:orbinho:estado",
    tutoriais: "orbe:arquivos:orbinho:tutoriais",
  },
};

export function identificarRotaOrbinho(caminho = "") {
  if (/^\/arquivos\/jogador\/[^/]+\/?$/.test(caminho)) {
    return "jogador";
  }

  if (/^\/arquivos\/mesa\/[^/]+\/?$/.test(caminho)) {
    return "mesa";
  }

  const rotas = {
    "/arquivos": "central",
    "/arquivos/nova-mesa": "nova-mesa",
    "/arquivos/minhas-mesas": "minhas-mesas",
  };

  const caminhoNormalizado =
    caminho.length > 1 ? caminho.replace(/\/$/, "") : caminho;

  return rotas[caminhoNormalizado] || null;
}
