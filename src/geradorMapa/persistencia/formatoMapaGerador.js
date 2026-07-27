export const VERSAO_FORMATO_MAPA_GERADOR = 1;
export const LIMITE_IMPORTACAO_MAPA_BYTES = 5 * 1024 * 1024;

const CHAVES_TEMPORARIAS = new Set([
  "camera",
  "viewport",
  "selecao",
  "historico",
  "progresso",
  "mensagem",
  "listeners",
  "indices",
  "caches",
  "celulasOcupadasObjetos",
]);

const CHAVES_PERIGOSAS = new Set(["__proto__", "constructor", "prototype"]);

export function clonarMapaSeguro(valor) {
  if (typeof structuredClone === "function") return structuredClone(valor);
  return JSON.parse(JSON.stringify(valor));
}

function limparValor(valor, caminho = "") {
  if (valor == null || ["string", "number", "boolean"].includes(typeof valor)) {
    return valor;
  }
  if (typeof valor === "function" || typeof valor === "symbol") return undefined;
  if (valor instanceof Date) return valor.toISOString();
  if (valor instanceof Set) return [...valor].map((item, indice) => limparValor(item, `${caminho}[${indice}]`));
  if (valor instanceof Map) {
    return Object.fromEntries(
      [...valor.entries()]
        .filter(([chave]) => !CHAVES_PERIGOSAS.has(String(chave)))
        .map(([chave, item]) => [String(chave), limparValor(item, `${caminho}.${String(chave)}`)]),
    );
  }
  if (Array.isArray(valor)) {
    return valor
      .map((item, indice) => limparValor(item, `${caminho}[${indice}]`))
      .filter((item) => item !== undefined);
  }
  if (typeof valor !== "object") return undefined;

  const limpo = {};
  for (const [chave, item] of Object.entries(valor)) {
    if (CHAVES_PERIGOSAS.has(chave) || CHAVES_TEMPORARIAS.has(chave)) continue;
    const valorLimpo = limparValor(item, caminho ? `${caminho}.${chave}` : chave);
    if (valorLimpo !== undefined) limpo[chave] = valorLimpo;
  }
  return limpo;
}

export function normalizarMapaParaPersistencia(mapa) {
  if (!mapa || typeof mapa !== "object" || Array.isArray(mapa)) {
    throw new Error("O mapa informado não possui um formato válido.");
  }
  const normalizado = limparValor(mapa);
  return {
    ...normalizado,
    versaoFormato: VERSAO_FORMATO_MAPA_GERADOR,
    id: String(normalizado.id || "mapa-gerado"),
    sistema: String(normalizado.sistema || "arquivos"),
    tema: String(normalizado.tema || ""),
    seed: String(normalizado.seed || ""),
    largura: Math.max(1, Math.round(Number(normalizado.largura) || 1)),
    altura: Math.max(1, Math.round(Number(normalizado.altura) || 1)),
    salas: Array.isArray(normalizado.salas) ? normalizado.salas : [],
    corredores: Array.isArray(normalizado.corredores) ? normalizado.corredores : [],
    paredes: Array.isArray(normalizado.paredes) ? normalizado.paredes : [],
    portas: Array.isArray(normalizado.portas) ? normalizado.portas : [],
    objetos: Array.isArray(normalizado.objetos) ? normalizado.objetos : [],
    luzes: Array.isArray(normalizado.luzes) ? normalizado.luzes : [],
  };
}

const migradoresMapa = {};

export function migrarMapaGerador(mapa) {
  let atual = clonarMapaSeguro(mapa);
  let versao = Number(atual?.versaoFormato || 1);
  if (!Number.isInteger(versao) || versao < 1) {
    throw new Error("A versão do mapa é inválida.");
  }
  if (versao > VERSAO_FORMATO_MAPA_GERADOR) {
    throw new Error(`Este mapa usa a versão ${versao}, mais nova que a versão suportada (${VERSAO_FORMATO_MAPA_GERADOR}).`);
  }
  while (versao < VERSAO_FORMATO_MAPA_GERADOR) {
    const migrar = migradoresMapa[versao];
    if (!migrar) throw new Error(`Não existe migração disponível para a versão ${versao}.`);
    atual = migrar(atual);
    versao += 1;
  }
  return normalizarMapaParaPersistencia(atual);
}

export function criarVisaoJogadorDoMapa(mapa) {
  const normalizado = normalizarMapaParaPersistencia(mapa);
  const salasOcultas = new Set(
    normalizado.salas
      .filter((sala) => sala?.especial?.secreta === true || sala?.secreta === true)
      .map((sala) => String(sala.id)),
  );
  const portasSecretasNaoReveladas = new Set(normalizado.portas.filter((porta) => {
    const secreta = porta?.secreta === true || porta?.tipoEspecial === "passagem-secreta";
    return secreta && porta?.revelada !== true;
  }).map((porta) => String(porta.id)));
  const portas = normalizado.portas.filter((porta) => !portasSecretasNaoReveladas.has(String(porta.id)));
  const paredes = normalizado.paredes.map((parede) =>
    portasSecretasNaoReveladas.has(String(parede?.portaId || ""))
      ? {
          ...parede,
          tipo: "comum",
          portaId: null,
          bloqueiaMovimento: true,
          bloqueiaVisao: true,
        }
      : parede,
  );
  const salas = normalizado.salas.filter((sala) => !salasOcultas.has(String(sala.id)));
  const objetos = normalizado.objetos.filter((objeto) =>
    objeto?.visivelJogador !== false
    && objeto?.oculto !== true
    && !salasOcultas.has(String(objeto?.salaId || "")),
  );
  const luzes = normalizado.luzes.filter((luz) =>
    luz?.visivelJogador !== false
    && !salasOcultas.has(String(luz?.salaId || "")),
  );
  const areasEspeciais = (normalizado.areasEspeciais || []).filter((area) =>
    area?.visivelJogador !== false && area?.oculta !== true,
  );
  const {
    validacao: _validacao,
    validacaoEstrutural: _validacaoEstrutural,
    validacaoTematica: _validacaoTematica,
    correcoesAutomaticas: _correcoes,
    dadosMestre: _dadosMestre,
    anotacoesMestre: _anotacoesMestre,
    configuracoes: _configuracoes,
    ...publico
  } = normalizado;
  return {
    ...publico,
    salas,
    paredes,
    portas,
    objetos,
    luzes,
    areasEspeciais,
    visao: "jogador",
  };
}

export function serializarMapa(mapa, { visaoJogador = false } = {}) {
  const dados = visaoJogador
    ? criarVisaoJogadorDoMapa(mapa)
    : normalizarMapaParaPersistencia(mapa);
  return JSON.stringify(dados);
}

export function desserializarMapa(texto) {
  const conteudo = String(texto || "");
  if (!conteudo.trim()) throw new Error("O arquivo de mapa está vazio.");
  if (new Blob([conteudo]).size > LIMITE_IMPORTACAO_MAPA_BYTES) {
    throw new Error("O arquivo excede o limite de 5 MB.");
  }
  let dados;
  try {
    dados = JSON.parse(conteudo);
  } catch {
    throw new Error("O arquivo não contém um JSON válido.");
  }
  return migrarMapaGerador(dados);
}

export function calcularHashMapa(mapa) {
  const texto = serializarMapa(mapa);
  let hash = 2166136261;
  for (let indice = 0; indice < texto.length; indice += 1) {
    hash ^= texto.charCodeAt(indice);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function medirMapaSerializado(mapa) {
  const texto = serializarMapa(mapa);
  return {
    bytes: new Blob([texto]).size,
    caracteres: texto.length,
    hash: calcularHashMapa(mapa),
  };
}
