import { criarGeradorAleatorio } from "../utils/geradorAleatorioSeed.js";
import { calcularDistanciasNoGrafo } from "./selecionarEntradaSaida.js";

const PROPORCAO_PORTAS = { baixa: 0.4, media: 0.65, alta: 0.8 };
const PROPORCAO_TRANCADAS = { baixa: 0, media: 0.15, alta: 0.25 };

function ordenarComSeed(itens, seed) {
  const aleatorio = criarGeradorAleatorio(seed);
  return itens
    .map((item) => ({ item, ordemSeed: aleatorio() }))
    .sort((a, b) => a.ordemSeed - b.ordemSeed || a.item.chave.localeCompare(b.item.chave))
    .map(({ item }) => item);
}

function existeCaminhoSemConexao(mapa, conexaoIdIgnorada) {
  const corredoresIgnorados = new Set(
    mapa.corredores
      .filter((corredor) => corredor.conexaoId === conexaoIdIgnorada)
      .map((corredor) => corredor.id),
  );
  const conexoesValidas = mapa.conexoes.filter((conexao) => conexao.id !== conexaoIdIgnorada);
  const distancias = calcularDistanciasNoGrafo(mapa.salaInicialId, mapa.salas, conexoesValidas);
  return distancias.has(mapa.salaFinalId) && corredoresIgnorados.size > 0;
}

function obterConexoesParede(parede, mapa) {
  const corredoresPorId = new Map(mapa.corredores.map((corredor) => [corredor.id, corredor]));
  return [...new Set(
    parede.corredorIds
      .map((id) => corredoresPorId.get(id)?.conexaoId)
      .filter(Boolean),
  )];
}

function criarPortaDaParede(parede, indice, tipoEspecial = null) {
  const aberta = tipoEspecial === "entrada";
  const estado = aberta ? "aberta" : "fechada";
  return {
    id: `porta-${indice + 1}`,
    paredeId: parede.id,
    chave: parede.chave,
    inicio: parede.inicio,
    fim: parede.fim,
    x: parede.inicio.x,
    y: parede.inicio.y,
    orientacao: parede.orientacao,
    salaIds: [...parede.salaIds],
    corredorIds: [...parede.corredorIds],
    conexaoIds: [],
    estado,
    trancada: false,
    secreta: false,
    bloqueiaMovimento: !aberta,
    bloqueiaVisao: !aberta,
    tipoEspecial,
    obrigatoria: false,
  };
}

function selecionarParedesComPorta(mapa, complexidade, seed) {
  const especiais = mapa.paredes.filter((parede) => parede.tiposEspeciais.length > 0);
  const internas = mapa.paredes.filter((parede) => (
    parede.tipo === "abertura"
    && parede.corredorIds.length > 0
    && parede.tiposEspeciais.length === 0
  ));
  const quantidade = Math.round(internas.length * (PROPORCAO_PORTAS[complexidade] ?? 0.65));
  const selecionadas = ordenarComSeed(internas, `${seed}-PORTAS`).slice(0, quantidade);
  return [...especiais, ...selecionadas]
    .filter((parede, indice, lista) => lista.findIndex((item) => item.chave === parede.chave) === indice)
    .sort((a, b) => a.chave.localeCompare(b.chave));
}

function marcarObrigatoriedade(portas, mapa) {
  return portas.map((porta) => {
    const parede = mapa.paredes.find((item) => item.id === porta.paredeId);
    const conexaoIds = obterConexoesParede(parede, mapa);
    const obrigatoria = conexaoIds.some((id) => !existeCaminhoSemConexao(mapa, id));
    return { ...porta, conexaoIds, obrigatoria };
  });
}

function selecionarSalasSecretas(portas, mapa, quantidadeSolicitada, seed) {
  if (quantidadeSolicitada <= 0) return { portas, salasSecretasIds: [], quantidadeSolicitada: 0 };

  const graus = new Map(mapa.salas.map((sala) => [sala.id, 0]));
  mapa.conexoes.forEach((conexao) => {
    graus.set(conexao.salaOrigemId, graus.get(conexao.salaOrigemId) + 1);
    graus.set(conexao.salaDestinoId, graus.get(conexao.salaDestinoId) + 1);
  });
  const distancias = calcularDistanciasNoGrafo(mapa.salaInicialId, mapa.salas, mapa.conexoes);
  const candidatas = mapa.salas.filter((sala) => (
    sala.id !== mapa.salaInicialId
    && sala.id !== mapa.salaFinalId
    && portas.some((porta) => (
      porta.salaIds.includes(sala.id)
      && !porta.obrigatoria
      && !porta.tipoEspecial
    ))
  ));
  const aleatorio = criarGeradorAleatorio(`${seed}-SECRETAS`);
  const ordenadas = candidatas
    .map((sala) => ({ sala, desempate: aleatorio() }))
    .sort((a, b) => (
      graus.get(a.sala.id) - graus.get(b.sala.id)
      || (distancias.get(b.sala.id) || 0) - (distancias.get(a.sala.id) || 0)
      || a.desempate - b.desempate
      || a.sala.id.localeCompare(b.sala.id)
    ))
    .map(({ sala }) => sala);
  const selecionadas = ordenadas.slice(0, quantidadeSolicitada);
  const usadas = new Set();
  const atualizadas = portas.map((porta) => ({ ...porta }));

  selecionadas.forEach((sala) => {
    const candidatasPorta = ordenarComSeed(
      atualizadas.filter((porta) => (
        porta.salaIds.includes(sala.id)
        && !porta.obrigatoria
        && !porta.tipoEspecial
        && !usadas.has(porta.id)
      )),
      `${seed}-SECRETAS-${sala.id}`,
    );
    const porta = candidatasPorta[0];
    if (!porta) return;
    usadas.add(porta.id);
    porta.estado = "secreta";
    porta.secreta = true;
    porta.trancada = false;
    porta.bloqueiaMovimento = true;
    porta.bloqueiaVisao = true;
  });

  return {
    portas: atualizadas,
    salasSecretasIds: selecionadas.filter((sala) => (
      atualizadas.some((porta) => porta.secreta && porta.salaIds.includes(sala.id))
    )).map((sala) => sala.id),
    quantidadeSolicitada,
  };
}

function selecionarPortasTrancadas(portas, complexidade, seed) {
  const candidatas = portas.filter((porta) => (
    !porta.tipoEspecial && !porta.secreta && !porta.obrigatoria
  ));
  const quantidade = Math.round(candidatas.length * (PROPORCAO_TRANCADAS[complexidade] ?? 0.15));
  const totaisPorSala = new Map();
  portas.filter((porta) => !porta.tipoEspecial).forEach((porta) => {
    porta.salaIds.forEach((salaId) => {
      totaisPorSala.set(salaId, (totaisPorSala.get(salaId) || 0) + 1);
    });
  });
  const trancadasPorSala = new Map();
  const ids = new Set();
  ordenarComSeed(candidatas, `${seed}-PORTAS-TRANCADAS`).some((porta) => {
    const bloqueariaTodas = porta.salaIds.some((salaId) => (
      (trancadasPorSala.get(salaId) || 0) + 1 >= (totaisPorSala.get(salaId) || 0)
    ));
    if (!bloqueariaTodas) {
      ids.add(porta.id);
      porta.salaIds.forEach((salaId) => {
        trancadasPorSala.set(salaId, (trancadasPorSala.get(salaId) || 0) + 1);
      });
    }
    return ids.size >= quantidade;
  });

  return portas.map((porta) => ids.has(porta.id)
    ? {
        ...porta,
        estado: "trancada",
        trancada: true,
        bloqueiaMovimento: true,
        bloqueiaVisao: true,
      }
    : porta);
}

export function gerarPortas({ mapa, seed, complexidade, quantidadeSalasSecretas }) {
  const paredesSelecionadas = selecionarParedesComPorta(mapa, complexidade, seed);
  let portas = paredesSelecionadas.map((parede, indice) => criarPortaDaParede(
    parede,
    indice,
    parede.tiposEspeciais.includes("entrada")
      ? "entrada"
      : parede.tiposEspeciais.includes("saida")
        ? "saida"
        : null,
  ));
  portas = marcarObrigatoriedade(portas, mapa);
  const resultadoSecretas = selecionarSalasSecretas(
    portas,
    mapa,
    quantidadeSalasSecretas,
    seed,
  );
  portas = selecionarPortasTrancadas(resultadoSecretas.portas, complexidade, seed);
  const portasPorParede = new Map(portas.map((porta) => [porta.paredeId, porta]));
  const paredes = mapa.paredes.map((parede) => {
    const porta = portasPorParede.get(parede.id);
    if (!porta) return parede;
    return {
      ...parede,
      tipo: "porta",
      portaId: porta.id,
      bloqueiaMovimento: porta.bloqueiaMovimento,
      bloqueiaVisao: porta.bloqueiaVisao,
    };
  });
  const avisos = [];
  if (resultadoSecretas.salasSecretasIds.length < resultadoSecretas.quantidadeSolicitada) {
    avisos.push(`Foi possível criar ${resultadoSecretas.salasSecretasIds.length} das ${resultadoSecretas.quantidadeSolicitada} salas secretas solicitadas sem bloquear o caminho principal.`);
  }
  const portaEntrada = portas.find((porta) => porta.tipoEspecial === "entrada");
  const portaSaida = portas.find((porta) => porta.tipoEspecial === "saida");

  return {
    ...mapa,
    entrada: {
      ...mapa.entrada,
      paredeId: portaEntrada?.paredeId || mapa.entrada.paredeId,
      portaId: portaEntrada?.id || null,
    },
    saida: {
      ...mapa.saida,
      paredeId: portaSaida?.paredeId || mapa.saida.paredeId,
      portaId: portaSaida?.id || null,
    },
    paredes,
    portas,
    salasSecretasIds: resultadoSecretas.salasSecretasIds,
    resumoPortas: {
      total: portas.length,
      abertas: portas.filter((porta) => porta.estado === "aberta").length,
      fechadas: portas.filter((porta) => porta.estado === "fechada").length,
      trancadas: portas.filter((porta) => porta.estado === "trancada").length,
      secretas: portas.filter((porta) => porta.estado === "secreta").length,
    },
    avisosPortas: avisos,
    validacaoEstrutural: null,
  };
}
