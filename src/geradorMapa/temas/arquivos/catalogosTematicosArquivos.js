function slug(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function criarTipos(nomes) {
  return nomes.map((nome, indice) => ({
    id: slug(nome),
    nome,
    descricao: `${nome} temática do cenário.`,
    min: [3, 3],
    max: indice === 0 || indice === nomes.length - 1 ? 1 : 3,
    peso: indice < 4 ? 5 : 3,
    inicial: indice === 0 || indice === 1,
    final: indice >= nomes.length - 3,
    secreta: /secreto|escondida|restrita|interditada|ritual|sacrifício|contenção|objetivo/i.test(nome),
    objetos: [slug(nome)],
    luz: "media",
  }));
}

function criarObjetos(nomes, tiposSala) {
  const idsSala = tiposSala.map(({ id }) => id);
  return nomes.map((nome, indice) => {
    const id = slug(nome);
    const decorativo = /papel|lona|fita|entulho|livro|mochila|quadro|tapete|espelho|lama|água|pegada|símbolo|osso|marca|mancha|sinalização|vegetação|cabo|tubulação/i.test(nome);
    const grande = /estante|mesa|bancada|cama|maca|piano|sofá|empilhadeira|gerador|freezer|beliche|barraca/i.test(nome);
    return {
      id,
      nome,
      categoria: decorativo ? "decoracao" : /computador|monitor|painel|servidor|microscópio|equipamento|câmera|telefone/i.test(nome) ? "equipamento" : "movel",
      salas: idsSala,
      largura: grande ? 2 : 1,
      altura: 1,
      bloqueiaMovimento: !decorativo,
      bloqueiaVisao: /estante|armário|freezer|servidor|gerador|empilhadeira/i.test(nome),
      preferencia: /estante|armário|painel|arquivo|extintor|quadro|pia|servidor/i.test(nome) ? "parede" : "livre",
      simbolo: nome.slice(0, 1).toUpperCase(),
      peso: Math.max(2, 7 - (indice % 5)),
    };
  });
}

function criarLuzes(nomes) {
  const cores = ["#edf5de", "#ff665c", "#f3c76a", "#8dd9ff", "#9b5cff", "#f4f0cf"];
  const catalogo = nomes.map((nome, indice) => ({
    id: slug(nome),
    nome,
    alcance: 3 + (indice % 4),
    intensidade: .45 + (indice % 3) * .15,
    cor: cores[indice % cores.length],
  }));
  if (!catalogo.some(({ id }) => id === "luz-teto")) {
    catalogo.unshift({ id: "luz-teto", nome: "Luz de teto", alcance: 5, intensidade: .7, cor: "#edf5de" });
  }
  return catalogo;
}

function criarPacote({ id, nome, tipos, objetos, luzes, ambiente = "interno" }) {
  const tiposSala = criarTipos(tipos);
  const catalogoObjetos = criarObjetos(objetos, tiposSala);
  const catalogoLuzes = criarLuzes(luzes);
  const objetosPrincipais = Object.fromEntries(tiposSala.map((tipo, indice) => [
    tipo.id,
    [
      catalogoObjetos[indice % catalogoObjetos.length]?.id,
      catalogoObjetos[(indice + 1) % catalogoObjetos.length]?.id,
      catalogoObjetos[(indice + 2) % catalogoObjetos.length]?.id,
    ].filter(Boolean),
  ]));
  const perfisLuz = Object.fromEntries(tiposSala.map((tipo, indice) => [
    tipo.id,
    [
      catalogoLuzes[indice % catalogoLuzes.length]?.id,
      catalogoLuzes[(indice + 1) % catalogoLuzes.length]?.id,
    ].filter(Boolean),
  ]));
  perfisLuz.padrao = [catalogoLuzes[0].id];
  return {
    id,
    nome,
    especializado: true,
    tiposSala,
    objetos: catalogoObjetos,
    objetosPrincipais,
    luzes: catalogoLuzes,
    perfisLuz,
    regrasDistribuicao: {
      ambiente,
      respeitarDimensoes: true,
      preservarAcessos: true,
      posicionamentoPorSala: true,
    },
    validacaoTematica: {
      exigeTipos: true,
      exigeObjetos: true,
      exigeIluminacao: true,
    },
    capacidades: {
      tiposSala: true,
      objetos: true,
      iluminacao: true,
      visualCompleto: true,
    },
  };
}

export const CATALOGOS_TEMATICOS_ARQUIVOS = Object.fromEntries([
  criarPacote({
    id: "armazem", nome: "Armazém",
    tipos: ["Entrada de carga", "Área de carga e descarga", "Depósito principal", "Corredor de estoque", "Escritório administrativo", "Sala de segurança", "Almoxarifado", "Câmara fria", "Sala elétrica", "Banheiro", "Área interditada", "Depósito secreto"],
    objetos: ["Pallet", "Caixa", "Engradado", "Estante industrial", "Carrinho de carga", "Empilhadeira", "Mesa", "Computador", "Armário", "Câmera", "Extintor", "Painel elétrico", "Lona", "Fita de isolamento", "Entulho"],
    luzes: ["Luminária industrial", "Luz de emergência", "Refletor", "Painel elétrico", "Área apagada"],
  }),
  criarPacote({
    id: "escola", nome: "Escola",
    tipos: ["Entrada", "Secretaria", "Diretoria", "Sala de aula", "Sala dos professores", "Biblioteca", "Laboratório", "Refeitório", "Cozinha", "Banheiro", "Depósito", "Auditório", "Enfermaria", "Sala interditada"],
    objetos: ["Carteira", "Cadeira", "Mesa do professor", "Quadro", "Armário", "Estante", "Livro", "Computador", "Arquivo", "Bancada", "Mesa de refeitório", "Papel", "Mochila", "Lixeira", "Entulho"],
    luzes: ["Luz fluorescente", "Luz de emergência", "Projetor", "Corredor apagado"],
  }),
  criarPacote({
    id: "delegacia", nome: "Delegacia",
    tipos: ["Recepção", "Atendimento", "Sala de espera", "Escritório policial", "Sala do delegado", "Sala de interrogatório", "Cela", "Arquivo", "Arsenal", "Sala de evidências", "Monitoramento", "Banheiro", "Garagem", "Área restrita"],
    objetos: ["Balcão", "Mesa", "Cadeira", "Computador", "Telefone", "Arquivo", "Armário", "Grade", "Banco de cela", "Câmera", "Monitor", "Quadro de investigação", "Caixa de evidência", "Estante", "Extintor"],
    luzes: ["Luz fluorescente", "Monitor", "Luz de emergência", "Luz de cela", "Luz restrita"],
  }),
  criarPacote({
    id: "laboratorio", nome: "Laboratório",
    tipos: ["Recepção", "Área de pesquisa", "Laboratório principal", "Sala de análise", "Sala de amostras", "Câmara fria", "Sala limpa", "Escritório", "Almoxarifado químico", "Sala de servidores", "Sala de contenção", "Banheiro", "Área contaminada", "Área restrita"],
    objetos: ["Bancada", "Computador", "Monitor", "Microscópio", "Equipamento", "Armário", "Freezer", "Recipiente", "Estante", "Pia", "Painel", "Servidor", "Caixa", "Cabo", "Sinalização", "Fita de isolamento"],
    luzes: ["Luz branca", "Luz de emergência", "Monitor", "Painel", "Luz de contenção", "Luz de alerta"],
  }),
  criarPacote({
    id: "mansao", nome: "Mansão",
    tipos: ["Hall de entrada", "Sala de estar", "Sala de jantar", "Cozinha", "Escritório", "Biblioteca", "Quarto", "Suíte", "Banheiro", "Corredor", "Despensa", "Adega", "Sala de música", "Porão", "Sótão", "Sala secreta"],
    objetos: ["Sofá", "Poltrona", "Mesa", "Cadeira", "Estante", "Livro", "Armário", "Cama", "Criado-mudo", "Piano", "Quadro", "Tapete", "Caixa", "Espelho", "Papel", "Objeto deslocado"],
    luzes: ["Lustre", "Abajur", "Luminária", "Vela", "Luz externa", "Área apagada"],
  }),
  criarPacote({
    id: "instalacao-subterranea", nome: "Instalação subterrânea",
    tipos: ["Entrada de segurança", "Corredor técnico", "Sala de controle", "Sala de servidores", "Gerador", "Depósito", "Alojamento", "Refeitório", "Enfermaria", "Sala de contenção", "Laboratório", "Arsenal", "Câmara de segurança", "Área interditada", "Sala de objetivo"],
    objetos: ["Painel", "Computador", "Servidor", "Gerador", "Cabo", "Caixa", "Armário", "Beliche", "Mesa", "Cadeira", "Equipamento", "Câmera", "Porta metálica", "Tubulação", "Entulho"],
    luzes: ["Luz de teto", "Luz de emergência", "Painel", "Luz vermelha", "Sinalização", "Setor apagado"],
  }),
  criarPacote({
    id: "floresta", nome: "Floresta", ambiente: "aberto",
    tipos: ["Entrada da trilha", "Clareira", "Trilha", "Mata fechada", "Acampamento abandonado", "Rio ou córrego", "Área alagada", "Ruína", "Caverna", "Área de ritual", "Zona de confronto", "Área escondida"],
    objetos: ["Árvore", "Arbusto", "Pedra", "Tronco", "Vegetação", "Lama", "Água", "Barraca", "Caixa", "Fogueira apagada", "Pegada", "Símbolo", "Osso", "Entulho natural"],
    luzes: ["Luz natural", "Luar", "Fogueira", "Lanterna abandonada", "Luz ritualística", "Área de sombra"],
  }),
  criarPacote({
    id: "acampamento", nome: "Acampamento", ambiente: "aberto",
    tipos: ["Entrada", "Área das barracas", "Fogueira central", "Cozinha", "Refeitório", "Banheiro", "Cabana administrativa", "Depósito", "Enfermaria", "Trilha", "Área esportiva", "Área abandonada", "Área de ritual", "Mata próxima"],
    objetos: ["Barraca", "Cama de campanha", "Banco", "Mesa", "Fogueira", "Caixa", "Mochila", "Armário", "Utensílio", "Lanterna", "Placa", "Tronco", "Vegetação", "Papel", "Símbolo"],
    luzes: ["Fogueira", "Poste", "Lanterna", "Luz de cabana", "Luz de emergência", "Área escura"],
  }),
  criarPacote({
    id: "local-ritual", nome: "Local de ritual",
    tipos: ["Entrada", "Caminho de preparação", "Câmara principal", "Círculo ritualístico", "Sala de oferendas", "Área de contenção", "Depósito", "Sala de registros", "Área de sacrifício", "Área interditada", "Sala secreta", "Ponto de objetivo"],
    objetos: ["Símbolo", "Vela", "Mesa", "Altar contemporâneo", "Documento", "Caixa", "Recipiente", "Corrente", "Marca", "Mancha", "Objeto deslocado", "Equipamento", "Cabo", "Gerador", "Barreira", "Fita de isolamento"],
    luzes: ["Luz ritualística", "Vela", "Luz de emergência", "Refletor", "Luz vermelha", "Setor apagado"],
  }),
].map((pacote) => [pacote.id, pacote]));

