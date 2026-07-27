import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";

import { executarFluxoGeracaoEstrutural } from "../src/geradorMapa/core/executarFluxoGeracaoEstrutural.js";
import {
  adaptarMapaGeradoParaGrid,
  removerMapaGeradoDoGrid,
} from "../src/geradorMapa/integracao/adaptarMapaGeradoParaGrid.js";
import { avaliarMovimentoTokenMapa } from "../src/components/mestre/mapa/politicaMovimentoTokenMapa.js";
import {
  calcularHashMapa,
  criarVisaoJogadorDoMapa,
  desserializarMapa,
  medirMapaSerializado,
  normalizarMapaParaPersistencia,
  serializarMapa,
} from "../src/geradorMapa/persistencia/formatoMapaGerador.js";
import {
  atualizarIdentidadeRascunhoLocal,
  carregarRascunhoLocal,
  duplicarRascunhoLocal,
  listarRascunhosLocais,
  removerRascunhoLocal,
  salvarRascunhoLocal,
} from "../src/geradorMapa/persistencia/rascunhosLocaisGerador.js";

function parametros({ seed, tema = "hospital-abandonado", largura, altura, quantidadeSalas, decoracao, iluminacao }) {
  return {
    seed,
    sistema: "arquivos",
    tema,
    largura,
    altura,
    configuracoes: {
      complexidade: "media",
      quantidadeSalas,
      larguraCorredores: 1,
      salasSecretas: 2,
      decoracao,
      iluminacao,
    },
  };
}

function gerar(configuracao) {
  const inicio = performance.now();
  const resultado = executarFluxoGeracaoEstrutural(parametros(configuracao));
  const geracaoMs = performance.now() - inicio;
  assert.equal(resultado.sucesso, true, `Falha ao gerar ${configuracao.seed}: ${resultado.relatorio.erros.join("; ")}`);
  return { mapa: resultado.mapa, geracaoMs };
}

const cenarios = [
  { nome: "pequeno", seed: "TESTE-20X15", largura: 20, altura: 15, quantidadeSalas: 5, decoracao: "baixa", iluminacao: "baixa" },
  { nome: "medio", seed: "TESTE-30X20", largura: 30, altura: 20, quantidadeSalas: 8, decoracao: "media", iluminacao: "media" },
  { nome: "grande", seed: "TESTE-60X60", largura: 60, altura: 60, quantidadeSalas: 30, decoracao: "alta", iluminacao: "clara" },
];

const temas = [
  "hospital-abandonado",
  "armazem",
  "escola",
  "delegacia",
  "laboratorio",
  "mansao",
  "instalacao-subterranea",
  "floresta",
  "acampamento",
  "local-ritual",
];

const metricas = [];
let mapaMedio;
for (const cenario of cenarios) {
  const { mapa, geracaoMs } = gerar(cenario);
  const inicioSerializacao = performance.now();
  const serializado = serializarMapa(mapa);
  const serializacaoMs = performance.now() - inicioSerializacao;
  const inicioAplicacao = performance.now();
  const grid = adaptarMapaGeradoParaGrid(mapa, {
    tokens: [{ id: "token-preservado" }],
    npcs: [{ id: "npc-preservado" }],
  });
  const aplicacaoMs = performance.now() - inicioAplicacao;
  const medicao = medirMapaSerializado(mapa);
  assert.equal(grid.tokens[0].id, "token-preservado");
  assert.equal(grid.npcs[0].id, "npc-preservado");
  assert.equal(desserializarMapa(serializado).seed, mapa.seed);
  metricas.push({
    cenario: cenario.nome,
    geracaoMs: Number(geracaoMs.toFixed(2)),
    serializacaoMs: Number(serializacaoMs.toFixed(2)),
    aplicacaoMs: Number(aplicacaoMs.toFixed(2)),
    bytesJson: medicao.bytes,
    salas: mapa.salas.length,
    paredes: mapa.paredes.length,
    portas: mapa.portas.length,
    objetos: mapa.objetos.length,
    luzes: mapa.luzes.length,
  });
  if (cenario.nome === "medio") mapaMedio = mapa;
}

const repeticao = gerar(cenarios[1]).mapa;
assert.equal(calcularHashMapa(mapaMedio), calcularHashMapa(repeticao), "A mesma seed deve produzir o mesmo mapa.");

const gridComManuais = adaptarMapaGeradoParaGrid(mapaMedio, {
  paredes: [{ id: "parede-manual", origem: "manual", inicio: { x: 10, y: 10 }, fim: { x: 20, y: 10 } }],
  luzes: [{ id: "luz-manual", origem: "manual", x: 12, y: 12 }],
  tokens: [{ id: "token-manual" }],
  npcs: [{ id: "npc-manual" }],
});
const gridSemGerado = removerMapaGeradoDoGrid(gridComManuais);
assert.ok(gridSemGerado.paredes.some((item) => item.id === "parede-manual"));
assert.ok(gridSemGerado.luzes.some((item) => item.id === "luz-manual"));
assert.equal(gridSemGerado.tokens[0].id, "token-manual");
assert.equal(gridSemGerado.npcs[0].id, "npc-manual");
assert.equal(gridSemGerado.paredes.some((item) => item.origem === "gerador-mapas"), false);

const memoriaLocal = new Map();
globalThis.window = {
  localStorage: {
    getItem: (chave) => memoriaLocal.get(chave) || null,
    setItem: (chave, valor) => memoriaLocal.set(chave, valor),
  },
};
const registroBiblioteca = salvarRascunhoLocal({
  mesaId: "mesa-teste",
  nome: "Hospital de teste",
  mapa: mapaMedio,
});
assert.ok(registroBiblioteca.miniatura.startsWith("data:image/svg+xml"));
atualizarIdentidadeRascunhoLocal(registroBiblioteca.id, { nome: "Hospital renomeado" });
assert.equal(carregarRascunhoLocal(registroBiblioteca.id).nome, "Hospital renomeado");
const copiaBiblioteca = duplicarRascunhoLocal(registroBiblioteca.id);
assert.notEqual(copiaBiblioteca.id, registroBiblioteca.id);
assert.match(copiaBiblioteca.nome, /Cópia/);
assert.equal(copiaBiblioteca.status, "rascunho");
assert.equal(listarRascunhosLocais("mesa-teste").length, 2);
removerRascunhoLocal(copiaBiblioteca.id);
assert.equal(listarRascunhosLocais("mesa-teste").length, 1);

const mapaColisao = {
  grid: { colunas: 10, linhas: 10, tamanhoCelula: 64 },
  paredes: [{ inicio: { x: 128, y: 0 }, fim: { x: 128, y: 256 }, bloqueiaMovimento: true }],
  portas: [],
  objetosCenario: [],
};
const tokenTeste = { tamanho: 1, bloqueado: false };
assert.equal(avaliarMovimentoTokenMapa({
  papelAtual: "mestre", possuiPermissao: true, token: tokenTeste,
  origem: { x: 64, y: 64 }, destino: { x: 192, y: 64 }, mapa: mapaColisao,
}).permitido, true, "O mestre normal deve atravessar barreiras.");
assert.equal(avaliarMovimentoTokenMapa({
  papelAtual: "jogador", possuiPermissao: true, token: tokenTeste,
  origem: { x: 64, y: 64 }, destino: { x: 192, y: 64 }, mapa: mapaColisao,
}).permitido, false, "Jogador e prévia do jogador devem validar o trajeto.");

for (const tema of temas) {
  const configuracao = {
    seed: `TESTE-TEMA-${tema}`,
    tema,
    largura: 30,
    altura: 20,
    quantidadeSalas: 8,
    decoracao: "media",
    iluminacao: "media",
  };
  const primeiro = gerar(configuracao).mapa;
  const segundo = gerar(configuracao).mapa;
  assert.equal(primeiro.tiposSalaDistribuidos, true, `${tema} deve distribuir tipos.`);
  assert.ok(primeiro.salas.every((sala) => sala.tipoTematico && sala.nome), `${tema} deixou sala sem identidade.`);
  assert.equal(primeiro.validacaoEstrutural?.valido, true, `${tema} deve chegar à validação final.`);
  assert.equal(calcularHashMapa(primeiro), calcularHashMapa(segundo), `${tema} deve ser determinístico.`);
  assert.equal(primeiro.fallbackTematico, false, `${tema} não deve depender do fallback durante o fluxo oficial.`);
  assert.equal(primeiro.resumoObjetos?.fallback, false, `${tema} deve usar objetos do pacote próprio.`);
}

for (const decoracao of ["nenhuma", "baixa", "media", "alta"]) {
  const mapa = gerar({
    seed: `TESTE-DECORACAO-${decoracao}`,
    largura: 30,
    altura: 20,
    quantidadeSalas: 8,
    decoracao,
    iluminacao: "media",
  }).mapa;
  if (decoracao === "nenhuma") {
    assert.equal(mapa.objetos.length, 0, "Decoração nenhuma não deve criar objetos automáticos.");
    assert.equal(mapa.resumoObjetos?.decoracaoDesativada, true);
  }
}

const mapaComSegredos = {
  ...mapaMedio,
  anotacoesMestre: "não enviar",
  dadosMestre: { objetivo: "oculto" },
  historico: [{ segredo: true }],
  salas: mapaMedio.salas.map((sala, indice) =>
    indice === 0 ? { ...sala, secreta: true } : sala),
  objetos: [
    ...mapaMedio.objetos,
    { id: "objeto-oculto", x: 1, y: 1, oculto: true },
  ],
  portas: [
    ...mapaMedio.portas,
    {
      id: "passagem-nao-revelada",
      tipoEspecial: "passagem-secreta",
      secreta: true,
      revelada: false,
      inicio: { x: 1, y: 1 },
      fim: { x: 2, y: 1 },
    },
  ],
};
const visaoJogador = criarVisaoJogadorDoMapa(mapaComSegredos);
assert.equal("anotacoesMestre" in visaoJogador, false);
assert.equal("dadosMestre" in visaoJogador, false);
assert.equal(visaoJogador.objetos.some(({ id }) => id === "objeto-oculto"), false);
assert.equal(visaoJogador.portas.some(({ id }) => id === "passagem-nao-revelada"), false);
const gridJogador = adaptarMapaGeradoParaGrid(visaoJogador, {}, { visaoJogador: true });
assert.ok(gridJogador.arquiteturaVisual?.salas?.length > 0, "O cenário deve permanecer na visão do jogador.");
assert.ok(gridJogador.paredes.every((parede) => parede.visivelJogador === true), "Paredes públicas devem ser desenhadas para o jogador.");
assert.ok(gridJogador.portas.every((porta) => porta.visivelJogador === true), "Portas públicas devem ser desenhadas para o jogador.");
assert.ok(gridJogador.objetosCenario.every((objeto) => objeto.visivelJogador === true), "Objetos públicos devem ser desenhados para o jogador.");

const normalizado = normalizarMapaParaPersistencia({
  ...mapaMedio,
  camera: { x: 20 },
  selecao: { id: "sala-1" },
  caches: { perigoso: true },
  conjunto: new Set(["a", "b"]),
});
assert.equal("camera" in normalizado, false);
assert.equal("selecao" in normalizado, false);
assert.equal("caches" in normalizado, false);
assert.deepEqual(normalizado.conjunto, ["a", "b"]);

assert.throws(() => desserializarMapa("{invalido"), /JSON válido/);
assert.throws(() => desserializarMapa(JSON.stringify({ versaoFormato: 999 })), /mais nova/);
const perigoso = desserializarMapa('{"versaoFormato":1,"largura":10,"altura":10,"__proto__":{"poluido":true},"constructor":{"prototype":{"poluido":true}}}');
assert.equal(Object.prototype.poluido, undefined);
assert.equal(Object.hasOwn(perigoso, "constructor"), false);

console.log(JSON.stringify({ sucesso: true, metricas }, null, 2));
