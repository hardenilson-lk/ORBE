import { salasColidem, salaEstaDentroDoMapa } from "./verificarColisaoSalas.js";
import { normalizarSegmentoParede, criarSegmentoLadoCelula } from "./gerarParedes.js";
import { validarCaminhoEntradaSaida } from "./validarCaminhoEntradaSaida.js";
import { validarConectividadeMapa } from "./validarConectividadeMapa.js";

const ORIENTACOES = new Set(["horizontal", "vertical"]);
const ESTADOS_PORTA = new Set(["aberta", "fechada", "trancada", "secreta"]);

function adicionarProblema(lista, codigo, mensagem) {
  if (!lista.some((item) => item.codigo === codigo && item.mensagem === mensagem)) {
    lista.push({ codigo, mensagem });
  }
}

function validarSalas(mapa, erros) {
  const ids = new Set();
  let dentro = true;
  let semSobreposicao = true;

  mapa.salas.forEach((sala) => {
    if (!sala.id || ids.has(sala.id)) {
      adicionarProblema(erros, "sala-id", `Sala com id ausente ou duplicado: ${sala.id || "sem id"}.`);
    }
    ids.add(sala.id);
    const inteiros = [sala.x, sala.y, sala.largura, sala.altura].every(Number.isInteger);
    if (!inteiros || !salaEstaDentroDoMapa(sala, mapa.largura, mapa.altura)) {
      dentro = false;
      adicionarProblema(erros, "sala-limites", `${sala.id} possui coordenadas ou dimensões inválidas.`);
    }
  });

  for (let a = 0; a < mapa.salas.length; a += 1) {
    for (let b = a + 1; b < mapa.salas.length; b += 1) {
      if (salasColidem(mapa.salas[a], mapa.salas[b], 0)) {
        semSobreposicao = false;
        adicionarProblema(erros, "sala-sobreposicao", `${mapa.salas[a].id} sobrepõe ${mapa.salas[b].id}.`);
      }
    }
  }

  if (mapa.salas.length === 0) adicionarProblema(erros, "salas-vazias", "O mapa não possui salas.");
  if (!ids.has(mapa.salaInicialId)) adicionarProblema(erros, "sala-inicial", "A sala inicial não existe.");
  if (!ids.has(mapa.salaFinalId)) adicionarProblema(erros, "sala-final", "A sala final não existe.");
  if (mapa.salaInicialId === mapa.salaFinalId) adicionarProblema(erros, "salas-especiais", "Sala inicial e final não podem ser iguais.");

  return { dentro, semSobreposicao };
}

function validarCorredores(mapa, erros) {
  const salas = new Set(mapa.salas.map((sala) => sala.id));
  const ids = new Set();
  const conexoes = new Set();
  let validos = true;

  mapa.corredores.forEach((corredor) => {
    if (!corredor.id || ids.has(corredor.id)) {
      validos = false;
      adicionarProblema(erros, "corredor-id", `Corredor com id ausente ou duplicado: ${corredor.id || "sem id"}.`);
    }
    ids.add(corredor.id);
    const chaveConexao = [corredor.salaOrigemId, corredor.salaDestinoId].sort().join(":");
    if (conexoes.has(chaveConexao)) {
      validos = false;
      adicionarProblema(erros, "corredor-duplicado", `Conexão duplicada entre ${chaveConexao}.`);
    }
    conexoes.add(chaveConexao);
    if (!salas.has(corredor.salaOrigemId) || !salas.has(corredor.salaDestinoId)) {
      validos = false;
      adicionarProblema(erros, "corredor-salas", `${corredor.id} referencia uma sala inexistente.`);
    }
    if (corredor.largura < 1 || corredor.largura > 3) {
      validos = false;
      adicionarProblema(erros, "corredor-largura", `${corredor.id} possui largura inválida.`);
    }
    corredor.celulas.forEach((celula) => {
      if (
        !Number.isInteger(celula.x) || !Number.isInteger(celula.y)
        || celula.x < 0 || celula.y < 0
        || celula.x >= mapa.largura || celula.y >= mapa.altura
      ) {
        validos = false;
        adicionarProblema(erros, "corredor-celula", `${corredor.id} possui uma célula inválida.`);
      }
    });
  });

  return validos;
}

function validarChao(mapa, erros) {
  const chaves = new Set();
  let valido = true;
  mapa.celulasChao.forEach((celula) => {
    const chave = `${celula.x}:${celula.y}`;
    if (chaves.has(chave)) {
      valido = false;
      adicionarProblema(erros, "chao-duplicado", `Célula de chão duplicada em ${chave}.`);
    }
    chaves.add(chave);
    if (
      !Number.isInteger(celula.x) || !Number.isInteger(celula.y)
      || celula.x < 0 || celula.y < 0
      || celula.x >= mapa.largura || celula.y >= mapa.altura
    ) {
      valido = false;
      adicionarProblema(erros, "chao-limites", `Célula de chão inválida em ${chave}.`);
    }
  });
  const entradaChao = chaves.has(`${mapa.entrada?.x}:${mapa.entrada?.y}`);
  const saidaChao = chaves.has(`${mapa.saida?.x}:${mapa.saida?.y}`);
  if (!entradaChao) adicionarProblema(erros, "entrada-chao", "A entrada não pertence ao chão.");
  if (!saidaChao) adicionarProblema(erros, "saida-chao", "A saída não pertence ao chão.");
  const caminho = mapa.entrada && mapa.saida
    ? validarCaminhoEntradaSaida(mapa.celulasChao, mapa.entrada, mapa.saida)
    : { valido: false };
  if (!caminho.valido) adicionarProblema(erros, "caminho", "Não existe caminho físico entre entrada e saída.");
  mapa.salas.forEach((sala) => {
    if (!mapa.celulasChao.some((celula) => celula.salaIds?.includes(sala.id))) {
      valido = false;
      adicionarProblema(erros, "sala-sem-chao", `${sala.id} não possui células de chão.`);
    }
  });
  return { valido, entradaChao, saidaChao, caminhoValido: caminho.valido };
}

function obterCelulasAdjacentesParede(parede) {
  if (parede.orientacao === "horizontal") {
    const x = Math.min(parede.inicio.x, parede.fim.x);
    return [`${x}:${parede.inicio.y - 1}`, `${x}:${parede.inicio.y}`];
  }
  const y = Math.min(parede.inicio.y, parede.fim.y);
  return [`${parede.inicio.x - 1}:${y}`, `${parede.inicio.x}:${y}`];
}

function validarParedes(mapa, erros) {
  const chaves = new Set();
  const chao = new Set(mapa.celulasChao.map(({ x, y }) => `${x}:${y}`));
  let validas = true;

  mapa.paredes.forEach((parede) => {
    const chave = parede.inicio && parede.fim
      ? normalizarSegmentoParede(parede.inicio, parede.fim)
      : "invalida";
    const tamanhoZero = parede.inicio?.x === parede.fim?.x && parede.inicio?.y === parede.fim?.y;
    const diagonal = parede.inicio?.x !== parede.fim?.x && parede.inicio?.y !== parede.fim?.y;
    const alinhada = [parede.inicio?.x, parede.inicio?.y, parede.fim?.x, parede.fim?.y].every(Number.isInteger);
    if (!parede.id || !parede.inicio || !parede.fim || tamanhoZero || diagonal || !alinhada || !ORIENTACOES.has(parede.orientacao)) {
      validas = false;
      adicionarProblema(erros, "parede-formato", `${parede.id || "Parede"} possui formato inválido.`);
    }
    if (chaves.has(chave)) {
      validas = false;
      adicionarProblema(erros, "parede-duplicada", `Parede duplicada no segmento ${chave}.`);
    }
    chaves.add(chave);
    if (parede.tipo === "comum") {
      const [ladoA, ladoB] = obterCelulasAdjacentesParede(parede);
      if (Number(chao.has(ladoA)) + Number(chao.has(ladoB)) !== 1) {
        validas = false;
        adicionarProblema(erros, "parede-interna", `${parede.id} não está em uma borda exposta.`);
      }
    }
  });

  const chaveEntrada = mapa.entrada
    ? criarSegmentoLadoCelula(mapa.entrada, mapa.entrada.lado).chave
    : "";
  const chaveSaida = mapa.saida
    ? criarSegmentoLadoCelula(mapa.saida, mapa.saida.lado).chave
    : "";
  if (mapa.paredes.some((parede) => parede.chave === chaveEntrada && parede.tipo === "comum")) {
    validas = false;
    adicionarProblema(erros, "entrada-bloqueada", "Uma parede comum bloqueia a entrada.");
  }
  if (mapa.paredes.some((parede) => parede.chave === chaveSaida && parede.tipo === "comum")) {
    validas = false;
    adicionarProblema(erros, "saida-bloqueada", "Uma parede comum bloqueia a saída.");
  }

  return validas;
}

function validarPortas(mapa, erros) {
  const paredes = new Map(mapa.paredes.map((parede) => [parede.id, parede]));
  const segmentos = new Set();
  let validas = true;

  mapa.portas.forEach((porta) => {
    const parede = paredes.get(porta.paredeId);
    if (!porta.id || !parede || parede.tipo !== "porta" || parede.portaId !== porta.id) {
      validas = false;
      adicionarProblema(erros, "porta-parede", `${porta.id || "Porta"} não substitui um segmento válido.`);
    }
    if (segmentos.has(porta.chave)) {
      validas = false;
      adicionarProblema(erros, "porta-duplicada", `Porta duplicada no segmento ${porta.chave}.`);
    }
    segmentos.add(porta.chave);
    if (!ORIENTACOES.has(porta.orientacao) || !ESTADOS_PORTA.has(porta.estado)) {
      validas = false;
      adicionarProblema(erros, "porta-formato", `${porta.id} possui orientação ou estado inválido.`);
    }
    const dentroDoMapa = [porta.inicio, porta.fim].every((ponto) => (
      Number.isInteger(ponto?.x) && Number.isInteger(ponto?.y)
      && ponto.x >= 0 && ponto.x <= mapa.largura
      && ponto.y >= 0 && ponto.y <= mapa.altura
    ));
    if (!dentroDoMapa) {
      validas = false;
      adicionarProblema(erros, "porta-limites", `${porta.id} está fora dos limites do mapa.`);
    }
    if (porta.secreta && porta.obrigatoria) {
      validas = false;
      adicionarProblema(erros, "porta-secreta-obrigatoria", `${porta.id} secreta bloqueia uma rota obrigatória.`);
    }
    if (porta.trancada && porta.obrigatoria) {
      validas = false;
      adicionarProblema(erros, "porta-trancada-obrigatoria", `${porta.id} trancada bloqueia uma rota obrigatória.`);
    }
  });

  const portaEntrada = mapa.portas.find((porta) => porta.tipoEspecial === "entrada");
  const portaSaida = mapa.portas.find((porta) => porta.tipoEspecial === "saida");
  if (!portaEntrada) {
    validas = false;
    adicionarProblema(erros, "porta-entrada", "A entrada não possui porta ou abertura registrada.");
  } else if (mapa.entrada?.portaId !== portaEntrada.id || mapa.entrada?.paredeId !== portaEntrada.paredeId) {
    validas = false;
    adicionarProblema(erros, "relacao-entrada", "A entrada não referencia corretamente sua parede e porta.");
  }
  if (!portaSaida) {
    validas = false;
    adicionarProblema(erros, "porta-saida", "A saída não possui porta ou abertura registrada.");
  } else if (mapa.saida?.portaId !== portaSaida.id || mapa.saida?.paredeId !== portaSaida.paredeId) {
    validas = false;
    adicionarProblema(erros, "relacao-saida", "A saída não referencia corretamente sua parede e porta.");
  }
  mapa.salasSecretasIds.forEach((salaId) => {
    if (!mapa.portas.some((porta) => porta.secreta && porta.salaIds.includes(salaId))) {
      validas = false;
      adicionarProblema(erros, "sala-secreta", `${salaId} não possui passagem secreta.`);
    }
  });
  mapa.salas.forEach((sala) => {
    const portasDaSala = mapa.portas.filter((porta) => (
      !porta.tipoEspecial && porta.salaIds.includes(sala.id)
    ));
    if (portasDaSala.length > 0 && portasDaSala.every((porta) => porta.trancada)) {
      validas = false;
      adicionarProblema(erros, "sala-portas-trancadas", `${sala.id} possui todas as portas trancadas.`);
    }
  });
  return validas;
}

export function validarMapaEstrutural(mapa) {
  const erros = [];
  const avisos = [];
  const salas = validarSalas(mapa, erros);
  const corredoresValidos = validarCorredores(mapa, erros);
  const chao = validarChao(mapa, erros);
  const paredesValidas = validarParedes(mapa, erros);
  const portasValidas = validarPortas(mapa, erros);
  const conectividade = validarConectividadeMapa(mapa);

  if (!conectividade.grafo.valido) adicionarProblema(erros, "grafo", "O grafo de salas está desconectado.");
  if (!conectividade.fisica.valido) adicionarProblema(erros, "chao-conectividade", "Existem salas sem acesso físico.");
  if (mapa.navegacao?.distanciaCurta) adicionarProblema(avisos, "distancia-curta", mapa.navegacao.avisoDistancia);
  (mapa.avisosPortas || []).forEach((mensagem) => adicionarProblema(avisos, "portas", mensagem));
  const travessias = mapa.corredores.filter((corredor) => corredor.intersecoesComOutrasSalas > 0);
  if (travessias.length > 0) {
    adicionarProblema(avisos, "corredor-travessia", `${travessias.length} corredor(es) atravessam uma terceira sala.`);
  }

  const corrigiveis = [...new Set(erros
    .filter((erro) => [
      "chao-duplicado",
      "parede-duplicada",
      "porta-duplicada",
      "porta-parede",
      "entrada-bloqueada",
      "saida-bloqueada",
    ].includes(erro.codigo))
    .map((erro) => erro.codigo))];

  return {
    valido: erros.length === 0,
    erros,
    avisos,
    corrigiveis,
    verificacoes: {
      salasDentroDoMapa: salas.dentro,
      salasSemSobreposicao: salas.semSobreposicao,
      corredoresValidos,
      grafoConectado: conectividade.grafo.valido,
      chaoConectado: conectividade.fisica.valido,
      entradaValida: chao.entradaChao,
      saidaValida: chao.saidaChao,
      caminhoEntradaSaida: chao.caminhoValido,
      paredesValidas,
      portasValidas,
      navegacaoPortasAbertas: chao.caminhoValido,
      navegacaoEstadosIniciais: chao.caminhoValido,
    },
    grafo: conectividade.grafo,
    fisica: conectividade.fisica,
  };
}
