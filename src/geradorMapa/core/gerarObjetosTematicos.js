import { criarGeradorAleatorio, sortearInteiro } from "../utils/geradorAleatorioSeed.js";
import {
  listarObjetosCompativeisDoTema,
  obterCatalogoTematicoMapa,
  obterObjetoDoTema,
} from "../temas/catalogoTematicoMapa.js";

const chave = (x, y) => `${x}:${y}`;
const densidades = { nenhuma: 0, baixa: 0.35, media: 0.65, alta: 1 };

const MULTIPLICADORES_TEMA = {
  floresta: 1.7,
  acampamento: 1.45,
  "local-ritual": 1.25,
};

function obterCatalogoTema(mapa) {
  return obterCatalogoTematicoMapa(mapa.tema);
}

function temaAoArLivre(mapa) {
  return obterCatalogoTema(mapa)?.regrasDistribuicao?.ambiente === "aberto";
}

function multiplicadorTema(mapa) {
  if (MULTIPLICADORES_TEMA[mapa.tema]) {
    return MULTIPLICADORES_TEMA[mapa.tema];
  }

  return temaAoArLivre(mapa) ? 1.2 : 1;
}

function limiteObjetosPorSala(mapa, nivel) {
  if (temaAoArLivre(mapa)) {
    return nivel === "alta" ? 12 : 10;
  }

  return nivel === "alta" ? 8 : 6;
}

function ehDecoracaoNatural(objeto) {
  const texto = `${objeto?.id || ""} ${objeto?.nome || ""}`.toLowerCase();

  return (
    objeto?.categoria === "decoracao"
    || /arvore|árvore|arbusto|vegetacao|vegetação|pedra|tronco|lama|agua|água|pegada|simbolo|símbolo|osso|entulho-natural|fogueira|ruina|ruína|barraca/.test(texto)
  );
}

function sortearItemPonderado(lista, aleatorio) {
  if (!Array.isArray(lista) || !lista.length) return null;

  const total = lista.reduce((soma, item) => soma + (item.peso || 1), 0);
  let sorteio = aleatorio() * total;

  return lista.find((item) => {
    sorteio -= item.peso || 1;
    return sorteio <= 0;
  }) || lista[lista.length - 1];
}

function criarPlanoObjetosSala(mapa, sala, nivel) {
  const densidade = densidades[nivel] ?? densidades.media;

  if (!densidade) {
    return {
      densidade,
      quantidadePrincipal: 0,
      quantidadeDecorativaExtra: 0,
      quantidadeEsperada: 0,
    };
  }

  const areaSala = sala.largura * sala.altura;
  const aoArLivre = temaAoArLivre(mapa);
  const fatorArea = aoArLivre ? 0.22 : 0.16;
  const limite = limiteObjetosPorSala(mapa, nivel);
  const multiplicador = multiplicadorTema(mapa);

  const quantidadePrincipal = Math.max(
    1,
    Math.min(
      Math.floor(areaSala * fatorArea * densidade * multiplicador),
      limite,
    ),
  );

  const quantidadeDecorativaExtra = aoArLivre
    ? Math.min(4, Math.max(1, Math.floor(quantidadePrincipal * 0.45)))
    : 0;

  return {
    densidade,
    quantidadePrincipal,
    quantidadeDecorativaExtra,
    quantidadeEsperada: quantidadePrincipal + quantidadeDecorativaExtra,
  };
}

export function dimensoesOcupadasObjeto(objeto) {
  return objeto.rotacao % 180 === 0
    ? { largura: objeto.largura, altura: objeto.altura }
    : { largura: objeto.altura, altura: objeto.largura };
}

export function celulasDoObjeto(objeto) {
  const { largura, altura } = dimensoesOcupadasObjeto(objeto);
  const celulas = [];

  for (let y = objeto.y; y < objeto.y + altura; y += 1) {
    for (let x = objeto.x; x < objeto.x + largura; x += 1) {
      celulas.push({ x, y });
    }
  }

  return celulas;
}

function celulasReservadas(mapa) {
  const reservadas = new Set();

  [mapa.entrada, mapa.saida]
    .filter(Boolean)
    .forEach(({ x, y }) => reservadas.add(chave(x, y)));

  mapa.portas.forEach((porta) => {
    porta.salaIds.forEach((salaId) => {
      const sala = mapa.salas.find(({ id }) => id === salaId);

      if (!sala) return;

      const x = Math.max(
        sala.x,
        Math.min(sala.x + sala.largura - 1, Math.floor(porta.x)),
      );

      const y = Math.max(
        sala.y,
        Math.min(sala.y + sala.altura - 1, Math.floor(porta.y)),
      );

      reservadas.add(chave(x, y));

      [[1, 0], [-1, 0], [0, 1], [0, -1]]
        .forEach(([dx, dy]) => reservadas.add(chave(x + dx, y + dy)));
    });
  });

  mapa.salas.forEach((sala) => {
    reservadas.add(chave(Math.floor(sala.centroX), Math.floor(sala.centroY)));
  });

  return reservadas;
}

function caminhoPreservado(mapa, objetos) {
  const chao = new Set(
    mapa.celulasChao.map(({ x, y }) => chave(x, y)),
  );

  const bloqueadas = new Set(
    objetos
      .filter(({ bloqueiaMovimento }) => bloqueiaMovimento)
      .flatMap(celulasDoObjeto)
      .map(({ x, y }) => chave(x, y)),
  );

  const inicio = chave(mapa.entrada.x, mapa.entrada.y);
  const fim = chave(mapa.saida.x, mapa.saida.y);
  const fila = [inicio];
  const visitadas = new Set([inicio]);

  while (fila.length) {
    const atual = fila.shift();

    if (atual === fim) return true;

    const [x, y] = atual.split(":").map(Number);

    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const proxima = chave(x + dx, y + dy);

      if (chao.has(proxima) && !bloqueadas.has(proxima) && !visitadas.has(proxima)) {
        visitadas.add(proxima);
        fila.push(proxima);
      }
    });
  }

  return false;
}

export function validarPosicaoObjeto(mapa, objeto, objetos = mapa.objetos || [], idIgnorado = null) {
  const sala = mapa.salas.find(({ id }) => id === objeto.salaId);

  if (!sala) return "Selecione uma sala válida.";

  if (![0, 90, 180, 270].includes(objeto.rotacao)) {
    return "A rotação deve ser 0°, 90°, 180° ou 270°.";
  }

  const celulas = celulasDoObjeto(objeto);

  if (
    celulas.some(({ x, y }) => (
      !Number.isInteger(x)
      || !Number.isInteger(y)
      || x < sala.x
      || y < sala.y
      || x >= sala.x + sala.largura
      || y >= sala.y + sala.altura
    ))
  ) {
    return "O objeto precisa permanecer dentro da sala.";
  }

  const reservadas = celulasReservadas(mapa);

  if (
    objeto.bloqueiaMovimento
    && celulas.some(({ x, y }) => reservadas.has(chave(x, y)))
  ) {
    return "O objeto bloquearia um acesso ou o centro da sala.";
  }

  const ocupadas = new Set(
    objetos
      .filter((item) => item.id !== idIgnorado && item.bloqueiaMovimento)
      .flatMap(celulasDoObjeto)
      .map(({ x, y }) => chave(x, y)),
  );

  if (
    objeto.bloqueiaMovimento
    && celulas.some(({ x, y }) => ocupadas.has(chave(x, y)))
  ) {
    return "O objeto sobrepõe outro volume ocupado.";
  }

  if (
    objeto.bloqueiaMovimento
    && !caminhoPreservado(
      mapa,
      [...objetos.filter(({ id }) => id !== idIgnorado), objeto],
    )
  ) {
    return "O objeto interromperia o caminho principal.";
  }

  return "";
}

function criarObjeto(catalogo, sala, x, y, rotacao, id, origem = "gerado") {
  return {
    id,
    tipo: catalogo.id,
    nome: catalogo.nome,
    categoria: catalogo.categoria,
    salaId: sala.id,
    x,
    y,
    largura: catalogo.largura,
    altura: catalogo.altura,
    rotacao,
    bloqueiaMovimento: catalogo.bloqueiaMovimento,
    bloqueiaVisao: catalogo.bloqueiaVisao,
    decorativo: ["decoracao", "sinalizacao"].includes(catalogo.categoria),
    interativo: false,
    tema: sala.tema || null,
    origem,
  };
}

function tentarPosicionar(mapa, sala, catalogo, objetos, aleatorio, id) {
  for (let tentativa = 0; tentativa < 30; tentativa += 1) {
    const rotacao = [0, 90, 180, 270][sortearInteiro(aleatorio, 0, 3)];
    const dimensoes = dimensoesOcupadasObjeto({ ...catalogo, rotacao });

    if (dimensoes.largura > sala.largura || dimensoes.altura > sala.altura) {
      return null;
    }

    let x = sortearInteiro(
      aleatorio,
      sala.x,
      sala.x + sala.largura - dimensoes.largura,
    );

    let y = sortearInteiro(
      aleatorio,
      sala.y,
      sala.y + sala.altura - dimensoes.altura,
    );

    if (catalogo.preferencia === "parede") {
      const lado = sortearInteiro(aleatorio, 0, 3);

      if (lado === 0) y = sala.y;
      if (lado === 1) x = sala.x + sala.largura - dimensoes.largura;
      if (lado === 2) y = sala.y + sala.altura - dimensoes.altura;
      if (lado === 3) x = sala.x;
    }

    if (catalogo.preferencia === "centro") {
      x = Math.max(
        sala.x,
        Math.min(
          sala.x + sala.largura - dimensoes.largura,
          Math.floor(sala.centroX - dimensoes.largura / 2),
        ),
      );

      y = Math.max(
        sala.y,
        Math.min(
          sala.y + sala.altura - dimensoes.altura,
          Math.floor(sala.centroY - dimensoes.altura / 2),
        ),
      );
    }

    const candidato = criarObjeto(catalogo, sala, x, y, rotacao, id);

    if (!validarPosicaoObjeto(mapa, candidato, objetos)) {
      return candidato;
    }
  }

  return null;
}

export function gerarObjetosDaSala(mapa, salaId, objetosPreservados = []) {
  const sala = mapa.salas.find(({ id }) => id === salaId);

  if (!sala || !sala.tipoTematico) return objetosPreservados;

  const nivel = mapa.configuracoes.decoracao || "media";
  const plano = criarPlanoObjetosSala(mapa, sala, nivel);

  if (!plano.densidade || !plano.quantidadeEsperada) {
    return objetosPreservados;
  }

  const aleatorio = criarGeradorAleatorio(`${mapa.seed}-OBJETOS-${sala.id}-${nivel}`);
  const catalogoTema = obterCatalogoTema(mapa);
  const compativeis = listarObjetosCompativeisDoTema(mapa.tema, sala.tipoTematico);

  const principais = (catalogoTema.objetosPrincipais[sala.tipoTematico] || [])
    .map((id) => obterObjetoDoTema(mapa.tema, id))
    .filter(Boolean);

  const filaPrincipal = [...principais.slice(0, Math.ceil(plano.quantidadePrincipal / 2))];

  while (filaPrincipal.length < plano.quantidadePrincipal && compativeis.length) {
    const item = sortearItemPonderado(compativeis, aleatorio);
    if (!item) break;
    filaPrincipal.push(item);
  }

  const filaDecorativaExtra = [];
  const decorativosAoArLivre = compativeis.filter(ehDecoracaoNatural);

  while (
    filaDecorativaExtra.length < plano.quantidadeDecorativaExtra
    && decorativosAoArLivre.length
  ) {
    const item = sortearItemPonderado(decorativosAoArLivre, aleatorio);
    if (!item) break;
    filaDecorativaExtra.push(item);
  }

  const objetos = [...objetosPreservados];
  let contador = 1;

  [...filaPrincipal, ...filaDecorativaExtra].forEach((catalogo) => {
    const id = `objeto-${sala.id}-${contador}`;
    contador += 1;

    const candidato = tentarPosicionar(
      mapa,
      { ...sala, tema: mapa.tema },
      catalogo,
      objetos,
      aleatorio,
      id,
    );

    if (candidato) {
      objetos.push(candidato);
    }
  });

  return objetos;
}

export function gerarObjetosTematicos(mapa, salaId = null) {
  const manuais = (mapa.objetos || [])
    .filter(({ origem }) => origem && origem !== "gerado");

  const preservados = salaId
    ? (mapa.objetos || []).filter((objeto) => objeto.salaId !== salaId)
    : manuais;

  const salas = salaId
    ? mapa.salas.filter(({ id }) => id === salaId)
    : mapa.salas;

  const nivel = mapa.configuracoes.decoracao || "media";

  if (nivel === "nenhuma") {
    return {
      ...mapa,
      objetos: preservados,
      celulasOcupadasObjetos: [
        ...new Set(
          preservados
            .filter(({ bloqueiaMovimento }) => bloqueiaMovimento)
            .flatMap(celulasDoObjeto)
            .map(({ x, y }) => chave(x, y)),
        ),
      ],
      objetosDesatualizados: false,
      iluminacaoTematicaDesatualizada: true,
      validacaoTematica: null,
      resumoObjetos: {
        total: preservados.length,
        decoracoes: preservados.filter(({ decorativo }) => decorativo).length,
        bloqueadores: preservados.filter(({ bloqueiaMovimento }) => bloqueiaMovimento).length,
        ignorados: 0,
        fallback: !obterCatalogoTema(mapa).especializado,
        decoracaoDesativada: true,
      },
    };
  }

  const objetos = salas.reduce(
    (lista, sala) => gerarObjetosDaSala(mapa, sala.id, lista),
    preservados,
  );

  const esperados = salas.reduce((total, sala) => {
    const plano = criarPlanoObjetosSala(mapa, sala, nivel);
    return total + plano.quantidadeEsperada;
  }, 0);

  const gerados = objetos.filter(({ origem }) => origem === "gerado").length;

  return {
    ...mapa,
    objetos,
    celulasOcupadasObjetos: [
      ...new Set(
        objetos
          .filter(({ bloqueiaMovimento }) => bloqueiaMovimento)
          .flatMap(celulasDoObjeto)
          .map(({ x, y }) => chave(x, y)),
      ),
    ],
    objetosDesatualizados: false,
    iluminacaoTematicaDesatualizada: true,
    validacaoTematica: null,
    resumoObjetos: {
      total: objetos.length,
      decoracoes: objetos.filter(({ decorativo }) => decorativo).length,
      bloqueadores: objetos.filter(({ bloqueiaMovimento }) => bloqueiaMovimento).length,
      ignorados: Math.max(0, esperados - gerados),
      fallback: !obterCatalogoTema(mapa).especializado,
      decoracaoDesativada: false,
    },
  };
}

export { caminhoPreservado as validarNavegacaoComObjetos };