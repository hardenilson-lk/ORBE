import { consolidarCelulasChao } from "../core/consolidarCelulasChao.js";
import { gerarCorredores, consolidarCelulasCorredores, gerarCelulasDoSegmento } from "../core/gerarCorredores.js";
import { listarPontosBordaSala } from "../core/selecionarEntradaSaida.js";
import { validarCaminhoEntradaSaida } from "../core/validarCaminhoEntradaSaida.js";
import { validarMapaEstrutural } from "../core/validarMapaEstrutural.js";
import { salasColidem, salaEstaDentroDoMapa } from "../core/verificarColisaoSalas.js";
import { validarMapaTematico } from "../core/validarMapaTematico.js";

const inteiro = (valor) => Math.round(Number(valor));
const chaveCelula = ({ x, y }) => `${x}:${y}`;

export function proximoId(lista, prefixo) {
  let numero = 1;
  const usados = new Set(lista.map(({ id }) => id));
  while (usados.has(`${prefixo}-${numero}`)) numero += 1;
  return `${prefixo}-${numero}`;
}

function atualizarCentro(sala) {
  const x = inteiro(sala.x);
  const y = inteiro(sala.y);
  const largura = inteiro(sala.largura);
  const altura = inteiro(sala.altura);
  return {
    ...sala,
    x,
    y,
    largura,
    altura,
    centroX: x + largura / 2,
    centroY: y + altura / 2,
  };
}

export function validarSalaProposta(mapa, proposta, idIgnorado = null) {
  const sala = atualizarCentro(proposta);
  if (sala.largura < 3 || sala.altura < 3) return "A sala deve medir pelo menos 3 × 3 células.";
  if (!salaEstaDentroDoMapa(sala, mapa.largura, mapa.altura)) return "A sala precisa permanecer dentro do mapa.";
  if (mapa.salas.some((outra) => outra.id !== idIgnorado && salasColidem(sala, outra, 0))) {
    return "A sala não pode sobrepor outra sala.";
  }
  return "";
}

function reconstruirCorredor(mapa, corredor) {
  const conexao = mapa.conexoes.find(({ id }) => id === corredor.conexaoId) || {
    id: corredor.conexaoId || `conexao-${corredor.id}`,
    salaOrigemId: corredor.salaOrigemId,
    salaDestinoId: corredor.salaDestinoId,
  };
  const resultado = gerarCorredores({
    conexoes: [conexao],
    salas: mapa.salas,
    seed: `${mapa.seedOriginal || mapa.seed}-${corredor.id}`,
    largura: corredor.largura,
    larguraMapa: mapa.largura,
    alturaMapa: mapa.altura,
  }).corredores[0];
  return { ...resultado, id: corredor.id, conexaoId: conexao.id, origemManual: corredor.origemManual || false };
}

function reposicionarPontoEspecial(ponto, sala, mapa) {
  if (!ponto || ponto.salaId !== sala.id) return ponto;
  const candidato = listarPontosBordaSala({
    sala,
    larguraMapa: mapa.largura,
    alturaMapa: mapa.altura,
    celulasCorredores: mapa.celulasCorredores,
  })[0];
  return candidato ? { ...ponto, ...candidato, paredeId: null, portaId: null } : ponto;
}

export function atualizarDerivadosGeometria(mapa, { reconstruirSalas = [] } = {}) {
  const ids = new Set(reconstruirSalas);
  const corredores = mapa.corredores.map((corredor) => (
    ids.has(corredor.salaOrigemId) || ids.has(corredor.salaDestinoId)
      ? reconstruirCorredor(mapa, corredor)
      : corredor
  ));
  const celulasCorredores = consolidarCelulasCorredores(corredores);
  const celulasChao = consolidarCelulasChao(mapa.salas, corredores);
  const entradaSala = mapa.salas.find(({ id }) => id === mapa.salaInicialId);
  const saidaSala = mapa.salas.find(({ id }) => id === mapa.salaFinalId);
  const base = { ...mapa, corredores, celulasCorredores, celulasChao };
  const entrada = entradaSala ? reposicionarPontoEspecial(mapa.entrada, entradaSala, base) : mapa.entrada;
  const saida = saidaSala ? reposicionarPontoEspecial(mapa.saida, saidaSala, base) : mapa.saida;
  const caminho = entrada && saida ? validarCaminhoEntradaSaida(celulasChao, entrada, saida) : null;
  const objetos = (mapa.objetos || []).filter((objeto) => {
    const sala = mapa.salas.find(({ id }) => id === objeto.salaId);
    if (!sala) return false;
    const largura = objeto.rotacao % 180 === 0 ? objeto.largura : objeto.altura;
    const altura = objeto.rotacao % 180 === 0 ? objeto.altura : objeto.largura;
    return objeto.x >= sala.x && objeto.y >= sala.y
      && objeto.x + largura <= sala.x + sala.largura
      && objeto.y + altura <= sala.y + sala.altura;
  });
  const objetosIds = new Set(objetos.map(({ id }) => id));
  const luzes = (mapa.luzes || []).filter((luz) => (
    luz.x >= 0 && luz.y >= 0 && luz.x < mapa.largura && luz.y < mapa.altura
    && (!luz.salaId || mapa.salas.some(({ id }) => id === luz.salaId))
    && (!luz.objetoOrigemId || objetosIds.has(luz.objetoOrigemId))
  ));
  return {
    ...base,
    entrada,
    saida,
    navegacao: caminho ? {
      ...(mapa.navegacao || {}),
      conectado: caminho.valido,
      distanciaEntradaSaida: caminho.distanciaEmCelulas,
      celulasVisitadas: caminho.celulasVisitadas,
    } : null,
    paredes: [],
    portas: [],
    resumoPortas: null,
    objetos,
    luzes,
    objetosDesatualizados: ids.size > 0 || mapa.objetosDesatualizados,
    iluminacaoTematicaDesatualizada: ids.size > 0 || mapa.iluminacaoTematicaDesatualizada,
    validacaoTematica: null,
    validacaoEstrutural: null,
  };
}

export function marcarEdicao(mapa) {
  const validacaoMinimaEditor = validarMapaEstrutural(mapa);
  return {
    ...mapa,
    modificadoManualmente: true,
    seedOriginal: mapa.seedOriginal || mapa.seed,
    configuracoesOriginais: mapa.configuracoesOriginais || structuredClone(mapa.configuracoes),
    validacaoMinimaEditor,
    validacaoEditorDesatualizada: true,
  };
}

export function criarSalaManual(mapa, retangulo) {
  const sala = atualizarCentro({
    id: proximoId(mapa.salas, "sala-manual"),
    tipo: "comum",
    origemManual: true,
    ...retangulo,
  });
  const erro = validarSalaProposta(mapa, sala);
  if (erro) return { sucesso: false, erro };
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizarDerivadosGeometria({ ...mapa, salas: [...mapa.salas, sala] })),
    selecao: { tipo: "sala", id: sala.id },
    descricao: `${sala.id} criada`,
    aviso: "Sala criada sem conexão. Use Criar corredor para conectá-la.",
  };
}

export function alterarSala(mapa, salaId, alteracoes, descricao = "Sala alterada") {
  const atual = mapa.salas.find(({ id }) => id === salaId);
  if (!atual) return { sucesso: false, erro: "Sala não encontrada." };
  const sala = atualizarCentro({ ...atual, ...alteracoes });
  const erro = validarSalaProposta(mapa, sala, salaId);
  if (erro) return { sucesso: false, erro };
  if (["x", "y", "largura", "altura"].every((campo) => sala[campo] === atual[campo])) {
    return { sucesso: false, erro: "A sala já possui essa posição e tamanho." };
  }
  const salas = mapa.salas.map((item) => item.id === salaId ? sala : item);
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizarDerivadosGeometria({ ...mapa, salas }, { reconstruirSalas: [salaId] })),
    selecao: { tipo: "sala", id: salaId },
    descricao,
  };
}

export function excluirSala(mapa, salaId) {
  if (salaId === mapa.salaInicialId || salaId === mapa.salaFinalId) {
    return { sucesso: false, erro: "Defina outra sala inicial/final antes de excluir esta sala." };
  }
  const corredoresRemovidos = new Set(mapa.corredores.filter((corredor) => (
    corredor.salaOrigemId === salaId || corredor.salaDestinoId === salaId
  )).map(({ id }) => id));
  const conexoesRemovidas = new Set(mapa.corredores.filter(({ id }) => corredoresRemovidos.has(id)).map(({ conexaoId }) => conexaoId));
  const base = {
    ...mapa,
    salas: mapa.salas.filter(({ id }) => id !== salaId),
    corredores: mapa.corredores.filter(({ id }) => !corredoresRemovidos.has(id)),
    conexoes: mapa.conexoes.filter(({ id }) => !conexoesRemovidas.has(id)),
    salasSecretasIds: mapa.salasSecretasIds.filter((id) => id !== salaId),
  };
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizarDerivadosGeometria(base)),
    selecao: null,
    descricao: `${salaId} excluída`,
  };
}

function salaNaCelula(salas, ponto) {
  return salas.find((sala) => (
    ponto.x >= sala.x && ponto.x < sala.x + sala.largura
    && ponto.y >= sala.y && ponto.y < sala.y + sala.altura
  ));
}

function segmentosOrtogonais(inicio, fim) {
  const dobra = { x: fim.x, y: inicio.y };
  return [
    { inicio, fim: dobra },
    { inicio: dobra, fim },
  ].filter((segmento) => segmento.inicio.x !== segmento.fim.x || segmento.inicio.y !== segmento.fim.y);
}

function expandirCelulas(segmentos, largura, mapa) {
  const unicas = new Map();
  segmentos.forEach((segmento) => {
    const horizontal = segmento.inicio.y === segmento.fim.y;
    gerarCelulasDoSegmento(segmento.inicio, segmento.fim).forEach((celula) => {
      for (let deslocamento = 0; deslocamento < largura; deslocamento += 1) {
        const expandida = horizontal
          ? { x: celula.x, y: celula.y + deslocamento }
          : { x: celula.x + deslocamento, y: celula.y };
        if (expandida.x >= 0 && expandida.y >= 0 && expandida.x < mapa.largura && expandida.y < mapa.altura) {
          unicas.set(chaveCelula(expandida), expandida);
        }
      }
    });
  });
  return [...unicas.values()];
}

export function criarCorredorManual(mapa, inicioBruto, fimBruto, largura = 1) {
  const inicio = { x: inteiro(inicioBruto.x), y: inteiro(inicioBruto.y) };
  const fim = { x: inteiro(fimBruto.x), y: inteiro(fimBruto.y) };
  const origem = salaNaCelula(mapa.salas, inicio);
  const destino = salaNaCelula(mapa.salas, fim);
  if (!origem || !destino || origem.id === destino.id) {
    return { sucesso: false, erro: "Inicie e termine o corredor em duas salas diferentes." };
  }
  const segmentos = segmentosOrtogonais(inicio, fim);
  const celulas = expandirCelulas(segmentos, largura, mapa);
  if (!segmentos.length || !celulas.length) return { sucesso: false, erro: "O corredor precisa possuir comprimento válido." };
  const corredorId = proximoId(mapa.corredores, "corredor-manual");
  const conexaoId = proximoId(mapa.conexoes, "conexao-manual");
  const corredor = {
    id: corredorId,
    conexaoId,
    salaOrigemId: origem.id,
    salaDestinoId: destino.id,
    largura,
    inicio,
    fim,
    segmentos,
    celulas,
    intersecoesComOutrasSalas: 0,
    origemManual: true,
  };
  const base = {
    ...mapa,
    conexoes: [...mapa.conexoes, { id: conexaoId, salaOrigemId: origem.id, salaDestinoId: destino.id, origemManual: true }],
    corredores: [...mapa.corredores, corredor],
  };
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizarDerivadosGeometria(base)),
    selecao: { tipo: "corredor", id: corredorId },
    descricao: `${corredorId} criado`,
  };
}

export function alterarLarguraCorredor(mapa, corredorId, largura) {
  const valor = inteiro(largura);
  if (valor < 1 || valor > 3) return { sucesso: false, erro: "A largura deve ficar entre 1 e 3." };
  const corredores = mapa.corredores.map((corredor) => (
    corredor.id === corredorId
      ? { ...corredor, largura: valor, celulas: expandirCelulas(corredor.segmentos, valor, mapa) }
      : corredor
  ));
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizarDerivadosGeometria({ ...mapa, corredores })),
    selecao: { tipo: "corredor", id: corredorId },
    descricao: `Largura de ${corredorId} alterada`,
  };
}

export function excluirCorredor(mapa, corredorId) {
  const corredor = mapa.corredores.find(({ id }) => id === corredorId);
  if (!corredor) return { sucesso: false, erro: "Corredor não encontrado." };
  const base = {
    ...mapa,
    corredores: mapa.corredores.filter(({ id }) => id !== corredorId),
    conexoes: mapa.conexoes.filter(({ id }) => id !== corredor.conexaoId),
  };
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizarDerivadosGeometria(base)),
    selecao: null,
    descricao: `${corredorId} excluído`,
  };
}

export function definirSalaEspecial(mapa, salaId, tipo) {
  if (tipo === "inicial" && salaId === mapa.salaFinalId) return { sucesso: false, erro: "A mesma sala não pode ser inicial e final." };
  if (tipo === "final" && salaId === mapa.salaInicialId) return { sucesso: false, erro: "A mesma sala não pode ser inicial e final." };
  const chave = tipo === "inicial" ? "salaInicialId" : "salaFinalId";
  const ponto = tipo === "inicial" ? "entrada" : "saida";
  const sala = mapa.salas.find(({ id }) => id === salaId);
  const candidato = listarPontosBordaSala({
    sala,
    larguraMapa: mapa.largura,
    alturaMapa: mapa.altura,
    celulasCorredores: mapa.celulasCorredores,
  })[0];
  const atualizado = {
    ...mapa,
    [chave]: salaId,
    [ponto]: { ...candidato, salaId, tipo: ponto, paredeId: null, portaId: null },
    paredes: [],
    portas: [],
    salasSecretasIds: mapa.salasSecretasIds.filter((id) => id !== salaId),
  };
  return {
    sucesso: true,
    mapa: marcarEdicao(atualizado),
    selecao: { tipo: "sala", id: salaId },
    descricao: `${salaId} definida como sala ${tipo}`,
  };
}

export function alternarSalaSecreta(mapa, salaId) {
  if (salaId === mapa.salaInicialId || salaId === mapa.salaFinalId) {
    return { sucesso: false, erro: "A sala inicial ou final não pode ser secreta." };
  }
  const ativa = mapa.salasSecretasIds.includes(salaId);
  const salasSecretasIds = ativa
    ? mapa.salasSecretasIds.filter((id) => id !== salaId)
    : [...mapa.salasSecretasIds, salaId];
  let portas = mapa.portas;
  let paredes = mapa.paredes;
  if (!ativa) {
    const candidata = mapa.portas.find((porta) => (
      porta.salaIds.includes(salaId) && !porta.tipoEspecial && !porta.obrigatoria
    ));
    if (!candidata) return { sucesso: false, erro: "Não existe um acesso seguro que possa virar passagem secreta." };
    portas = mapa.portas.map((porta) => porta.id === candidata.id
      ? { ...porta, estado: "secreta", secreta: true, trancada: false, bloqueiaMovimento: true, bloqueiaVisao: true }
      : porta);
    paredes = mapa.paredes.map((parede) => parede.id === candidata.paredeId
      ? { ...parede, bloqueiaMovimento: true, bloqueiaVisao: true }
      : parede);
  } else {
    const idsAindaSecretas = new Set(salasSecretasIds);
    portas = mapa.portas.map((porta) => (
      porta.secreta && porta.salaIds.includes(salaId) && !porta.salaIds.some((id) => idsAindaSecretas.has(id))
        ? { ...porta, estado: "fechada", secreta: false, bloqueiaMovimento: true, bloqueiaVisao: true }
        : porta
    ));
  }
  return {
    sucesso: true,
    mapa: marcarEdicao({ ...mapa, salasSecretasIds, portas, paredes }),
    selecao: { tipo: "sala", id: salaId },
    descricao: `${salaId} ${ativa ? "deixou de ser secreta" : "marcada como secreta"}`,
    aviso: ativa ? "" : "Um acesso seguro foi transformado em passagem secreta.",
  };
}

export function validarEdicaoCompleta(mapa) {
  const validacao = validarMapaEstrutural(mapa);
  const validacaoTematica = mapa.tiposSalaDistribuidos ? validarMapaTematico(mapa) : null;
  return {
    ...mapa,
    validacao: validacao,
    validacaoEstrutural: validacao,
    validacaoMinimaEditor: validacao,
    validacaoTematica,
    validacaoEditorDesatualizada: false,
    ultimaValidacaoEditor: new Date().toISOString(),
  };
}
