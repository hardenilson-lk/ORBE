import {
  criarVisaoJogadorDoMapa,
  normalizarMapaParaPersistencia,
} from "../persistencia/formatoMapaGerador.js";

const TAMANHO_CELULA_PADRAO = 64;

const TIPOS_OBSTACULO_VALIDOS =
  new Set([
    "alto",
    "baixo",
    "chao",
    "transparente",
    "personalizado",
  ]);

const COMPORTAMENTO_OBSTACULOS = {
  alto: {
    bloqueiaMovimento: true,
    bloqueiaVisao: true,
  },

  baixo: {
    bloqueiaMovimento: true,
    bloqueiaVisao: false,
  },

  chao: {
    bloqueiaMovimento: false,
    bloqueiaVisao: false,
  },

  transparente: {
    bloqueiaMovimento: true,
    bloqueiaVisao: false,
  },

  personalizado: {
    bloqueiaMovimento: false,
    bloqueiaVisao: false,
  },
};

const TERMOS_CHAO = [
  "azulejo",
  "piso",
  "tapete",
  "carpete",
  "sangue",
  "mancha",
  "sujeira",
  "poeira",
  "poça",
  "poca",
  "água",
  "agua",
  "lama",
  "rachadura",
  "marca de arrasto",
  "rastro",
  "trilha",
  "folhas",
  "musgo",
  "grama",
  "terra",
  "cinzas",
  "sombra",
  "decalque",
  "símbolo",
  "simbolo",
  "runa",
  "pegada",
  "buraco pequeno",
  "vidro quebrado",
  "papel",
  "documento",
];

const TERMOS_TRANSPARENTES = [
  "grade",
  "cerca",
  "alambrado",
  "vidro",
  "vitrine",
  "janela",
  "divisória de vidro",
  "divisoria de vidro",
  "portão de grade",
  "portao de grade",
];

const TERMOS_ALTOS = [
  "armário",
  "armario",
  "estante",
  "prateleira",
  "arquivo",
  "freezer",
  "geladeira",
  "contêiner",
  "conteiner",
  "container",
  "pilar",
  "coluna",
  "árvore",
  "arvore",
  "tronco grande",
  "pedra grande",
  "rocha grande",
  "máquina",
  "maquina",
  "gerador",
  "caldeira",
  "veículo",
  "veiculo",
  "carro",
  "caminhão",
  "caminhao",
  "ambulância",
  "ambulancia",
  "tanque",
  "cabine",
  "biombo",
  "parede móvel",
  "parede movel",
  "gaveta mortuária",
  "gaveta mortuaria",
  "freezer mortuário",
  "freezer mortuario",
  "barraca",
  "tenda",
  "guarita",
  "elevador",
  "monumento",
  "estátua",
  "estatua",
];

const TERMOS_BAIXOS = [
  "mesa",
  "bancada",
  "balcão",
  "balcao",
  "cama",
  "maca",
  "sofá",
  "sofa",
  "banco",
  "cadeira",
  "poltrona",
  "pallet",
  "palete",
  "caixa",
  "baú",
  "bau",
  "pia",
  "vaso",
  "equipamento cirúrgico",
  "equipamento cirurgico",
  "mancha hospitalar",
  "lixeira",
  "gaveta",
  "fogueira",
  "tronco",
  "pedra",
  "computador",
  "monitor",
  "carrinho",
  "macas",
];

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[_-]+/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function objetoContemTermo(
  texto,
  termos,
) {
  return termos.some(
    (termo) =>
      texto.includes(
        normalizarTexto(termo),
      ),
  );
}

function obterTextoObjeto(
  objeto,
) {
  return normalizarTexto(
    [
      objeto?.id,
      objeto?.nome,
      objeto?.tipo,
      objeto?.categoria,
      objeto?.grupo,
      objeto?.assetId,
      objeto?.imagem,
      objeto?.descricao,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function inferirTipoObstaculo(
  objeto,
) {
  const tipoRecebido =
    normalizarTexto(
      objeto?.tipoObstaculo,
    );

  /*
   * O modo personalizado sempre preserva
   * a escolha manual dos dois bloqueios.
   */
  if (
    tipoRecebido
      === "personalizado"
  ) {
    return "personalizado";
  }

  const texto =
    obterTextoObjeto(
      objeto,
    );

  /*
   * Primeiro identificamos decorações de chão.
   * Elas nunca devem impedir passagem ou visão.
   */
  if (
    objetoContemTermo(
      texto,
      TERMOS_CHAO,
    )
  ) {
    return "chao";
  }

  /*
   * Objetos transparentes possuem colisão,
   * mas continuam permitindo enxergar.
   */
  if (
    objetoContemTermo(
      texto,
      TERMOS_TRANSPARENTES,
    )
  ) {
    return "transparente";
  }

  /*
   * Objetos altos interrompem movimento
   * e também a visão dinâmica.
   */
  if (
    objetoContemTermo(
      texto,
      TERMOS_ALTOS,
    )
  ) {
    return "alto";
  }

  /*
   * Objetos baixos impedem passagem,
   * mas não interrompem a visão.
   */
  if (
    objetoContemTermo(
      texto,
      TERMOS_BAIXOS,
    )
  ) {
    return "baixo";
  }

  /*
   * Mantemos tipos especializados já
   * fornecidos corretamente pelo catálogo.
   */
  if (
    TIPOS_OBSTACULO_VALIDOS.has(
      tipoRecebido,
    )
    && tipoRecebido !== "chao"
  ) {
    return tipoRecebido;
  }

  /*
   * Também reconhecemos objetos que já
   * carregam bloqueios explícitos.
   */
  if (
    objeto?.bloqueiaMovimento === true
    && objeto?.bloqueiaVisao === true
  ) {
    return "alto";
  }

  if (
    objeto?.bloqueiaMovimento === true
    && objeto?.bloqueiaVisao !== true
  ) {
    return "baixo";
  }

  if (
    objeto?.bloqueiaMovimento !== true
    && objeto?.bloqueiaVisao === true
  ) {
    return "personalizado";
  }

  /*
   * Um item desconhecido do catálogo de
   * objetos provavelmente representa algo
   * físico. Por segurança, bloqueia apenas
   * o movimento até ser classificado.
   */
  return "baixo";
}

function obterComportamentoObstaculo(
  objeto,
  tipoObstaculo,
) {
  if (typeof objeto?.bloqueiaMovimento === "boolean" || typeof objeto?.bloqueiaVisao === "boolean") {
    const padrao = COMPORTAMENTO_OBSTACULOS[tipoObstaculo] || COMPORTAMENTO_OBSTACULOS.chao;
    return {
      bloqueiaMovimento: typeof objeto?.bloqueiaMovimento === "boolean" ? objeto.bloqueiaMovimento : padrao.bloqueiaMovimento,
      bloqueiaVisao: typeof objeto?.bloqueiaVisao === "boolean" ? objeto.bloqueiaVisao : padrao.bloqueiaVisao,
    };
  }
  if (
    tipoObstaculo
      === "personalizado"
  ) {
    return {
      bloqueiaMovimento:
        objeto?.bloqueiaMovimento
          === true,

      bloqueiaVisao:
        objeto?.bloqueiaVisao
          === true,
    };
  }

  return (
    COMPORTAMENTO_OBSTACULOS[
      tipoObstaculo
    ]
    || COMPORTAMENTO_OBSTACULOS.baixo
  );
}

function pontoEmPixels(
  ponto,
  tamanhoCelula,
) {
  return {
    x:
      Math.round(
        (
          Number(ponto?.x)
          || 0
        ) * tamanhoCelula,
      ),

    y:
      Math.round(
        (
          Number(ponto?.y)
          || 0
        ) * tamanhoCelula,
      ),
  };
}

function metadadosAplicacao(
  mapaId,
  aplicacaoId,
) {
  return {
    origem:
      "gerador-mapas",

    mapaId,

    aplicacaoId,
  };
}

function adaptarEstruturas(
  mapa,
  tamanhoCelula,
  aplicacaoId,
) {
  const meta =
    metadadosAplicacao(
      mapa.id,
      aplicacaoId,
    );

  const idsPortas =
    new Set(
      (
        mapa.portas
        || []
      ).map(
        (porta) =>
          String(
            porta.paredeId
            || "",
          ),
      ),
    );

  const paredes =
    (
      mapa.paredes
      || []
    )
      .filter(
        (parede) =>
          !idsPortas.has(
            String(
              parede.id,
            ),
          ),
      )
      .map(
        (parede) => ({
          id:
            `gerador-${parede.id}`,

          tipoEstrutura:
            "parede",

          inicio:
            pontoEmPixels(
              parede.inicio,
              tamanhoCelula,
            ),

          fim:
            pontoEmPixels(
              parede.fim,
              tamanhoCelula,
            ),

          aberta:
            false,

          trancada:
            false,

          oculta:
            false,

          bloqueiaMovimento:
            true,

          bloqueiaVisao:
            true,

          camada:
            "paredes",

          visivelJogador:
            true,

          funcao:
            "colisao-visao",

          ...meta,

          origemGeradorId:
            parede.id,
        }),
      );

  const portas =
    (
      mapa.portas
      || []
    ).map(
      (porta) => {
        const aberta =
          porta.estado
            === "aberta";

        return {
          id:
            `gerador-${porta.id}`,

          tipoEstrutura:
            porta.tipoEspecial
              === "janela"
              ? "janela"
              : "porta",

          inicio:
            pontoEmPixels(
              porta.inicio,
              tamanhoCelula,
            ),

          fim:
            pontoEmPixels(
              porta.fim,
              tamanhoCelula,
            ),

          aberta,

          trancada:
            porta.estado
              === "trancada"
            || porta.trancada
              === true,

          oculta:
            porta.secreta
              === true
            && porta.revelada
              !== true,

          bloqueiaMovimento:
            !aberta,

          bloqueiaVisao:
            !aberta,

          camada:
            "paredes",

          visivelJogador:
            true,

          funcao:
            "colisao-visao",

          ...meta,

          origemGeradorId:
            porta.id,
        };
      },
    );

  return {
    paredes,
    portas,
  };
}

function adaptarLuzes(
  mapa,
  tamanhoCelula,
  aplicacaoId,
) {
  const meta =
    metadadosAplicacao(
      mapa.id,
      aplicacaoId,
    );

  return (
    mapa.luzes
    || []
  ).map(
    (luz) => ({
      id:
        `gerador-${luz.id}`,

      nome:
        String(
          luz.nome
          || "Luz",
        ),

      x:
        Math.round(
          (
            (
              Number(luz.x)
              || 0
            ) + 0.5
          ) * tamanhoCelula,
        ),

      y:
        Math.round(
          (
            (
              Number(luz.y)
              || 0
            ) + 0.5
          ) * tamanhoCelula,
        ),

      raio:
        Math.max(
          tamanhoCelula,

          Math.round(
            (
              Number(
                luz.alcance,
              )
              || 1
            ) * tamanhoCelula,
          ),
        ),

      intensidade:
        luz.ativa === false
          ? 0
          : Math.max(
              0,
              Math.min(
                1,
                Number(
                  luz.intensidade,
                ) || 0,
              ),
            ),

      cor:
        String(
          luz.cor
          || "#ffd36a",
        ),

      ativa:
        luz.ativa !== false,

      piscando:
        luz.piscando === true,

      camada:
        "efeitos",

      ...meta,

      origemGeradorId:
        luz.id,
    }),
  );
}

function adaptarObjetos(
  mapa,
  tamanhoCelula,
  aplicacaoId,
) {
  const meta =
    metadadosAplicacao(
      mapa.id,
      aplicacaoId,
    );

  return (
    mapa.objetos
    || []
  ).map(
    (objeto) => {
      const tipoObstaculo =
        inferirTipoObstaculo(
          objeto,
        );

      const comportamento =
        obterComportamentoObstaculo(
          objeto,
          tipoObstaculo,
        );

      const larguraCelulas =
        Math.max(
          1,
          Number(
            objeto.largura,
          ) || 1,
        );

      const alturaCelulas =
        Math.max(
          1,
          Number(
            objeto.altura,
          ) || 1,
        );

      const larguraColisaoCelulas =
        Math.max(
          1,
          Number(
            objeto.larguraColisao,
          )
          || larguraCelulas,
        );

      const alturaColisaoCelulas =
        Math.max(
          1,
          Number(
            objeto.alturaColisao,
          )
          || alturaCelulas,
        );

      return {
        id:
          `gerador-${objeto.id}`,

        nome:
          String(
            objeto.nome
            || "Objeto",
          ),

        tipo:
          String(
            objeto.tipo
            || "objeto",
          ),

        categoria:
          String(
            objeto.categoria
            || "objeto",
          ),

        x:
          Math.round(
            (
              Number(
                objeto.x,
              )
              || 0
            ) * tamanhoCelula,
          ),

        y:
          Math.round(
            (
              Number(
                objeto.y,
              )
              || 0
            ) * tamanhoCelula,
          ),

        largura:
          larguraCelulas
          * tamanhoCelula,

        altura:
          alturaCelulas
          * tamanhoCelula,

        rotacao:
          Number(
            objeto.rotacao,
          ) || 0,

        bloqueiaMovimento:
          comportamento
            .bloqueiaMovimento,

        bloqueiaVisao:
          comportamento
            .bloqueiaVisao,

        tipoObstaculo,

        formaColisao:
          objeto.formaColisao
            === "circulo"
            ? "circulo"
            : "retangulo",

        larguraColisao:
          larguraColisaoCelulas
          * tamanhoCelula,

        alturaColisao:
          alturaColisaoCelulas
          * tamanhoCelula,

        deslocamentoColisaoX:
          (
            Number(
              objeto.deslocamentoColisaoX,
            )
            || 0
          ) * tamanhoCelula,

        deslocamentoColisaoY:
          (
            Number(
              objeto.deslocamentoColisaoY,
            )
            || 0
          ) * tamanhoCelula,

        visivelJogador:
          objeto.visivelJogador
            !== false,

        camada:
          "objetos",

        classificacaoObstaculo:
          "adaptada-do-gerador",

        ...meta,

        origemGeradorId:
          objeto.id,
      };
    },
  );
}

export function adaptarMapaGeradoParaGrid(
  mapaGerado,
  mapaAtual = {},
  {
    visaoJogador = false,
  } = {},
) {
  const normalizado =
    visaoJogador
      ? criarVisaoJogadorDoMapa(
          mapaGerado,
        )
      : normalizarMapaParaPersistencia(
          mapaGerado,
        );

  const tamanhoCelula =
    Math.max(
      24,
      Number(
        mapaAtual?.grid
          ?.tamanhoCelula,
      )
      || TAMANHO_CELULA_PADRAO,
    );

  const aplicacaoId =
    `aplicacao-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  const estruturas =
    adaptarEstruturas(
      normalizado,
      tamanhoCelula,
      aplicacaoId,
    );

  const preservarManual =
    (lista) =>
      (
        Array.isArray(lista)
          ? lista
          : []
      ).filter(
        (item) =>
          item?.origem
            !== "gerador-mapas"
          && !item?.origemGeradorId,
      );

  const arquiteturaVisual = {
    ...metadadosAplicacao(
      normalizado.id,
      aplicacaoId,
    ),

    tema:
      normalizado.tema,

    largura:
      normalizado.largura,

    altura:
      normalizado.altura,

    salas:
      normalizado.salas
      || [],

    corredores:
      normalizado
        .celulasCorredores
      || [],

    paredes:
      normalizado.paredes
      || [],

    portas:
      normalizado.portas
      || [],

    imagemFinalizada:
      normalizado
        .finalizacaoIA
        ?.imagem
      || "",
  };

  return {
    ...(mapaAtual || {}),

    versao:
      Math.max(
        3,
        Number(
          mapaAtual?.versao,
        ) || 3,
      ),

    grid: {
      ...(mapaAtual?.grid || {}),

      colunas:
        normalizado.largura,

      linhas:
        normalizado.altura,

      tamanhoCelula,
    },

    paredes: [
      ...preservarManual(
        mapaAtual?.paredes,
      ),

      ...estruturas.paredes,
    ],

    portas: [
      ...preservarManual(
        mapaAtual?.portas,
      ),

      ...estruturas.portas,
    ],

    objetosCenario: [
      ...preservarManual(
        mapaAtual?.objetosCenario,
      ),

      ...adaptarObjetos(
        normalizado,
        tamanhoCelula,
        aplicacaoId,
      ),
    ],

    luzes: [
      ...preservarManual(
        mapaAtual?.luzes,
      ),

      ...adaptarLuzes(
        normalizado,
        tamanhoCelula,
        aplicacaoId,
      ),
    ],

    arquiteturaVisual,

    mapaAplicadoId:
      normalizado.id,

    aplicacaoMapaId:
      aplicacaoId,

    versaoMapaAplicada:
      normalizado
        .versaoFormato,

    geradorMapa: {
      id:
        normalizado.id,

      seed:
        normalizado.seed,

      tema:
        normalizado.tema,

      versaoFormato:
        normalizado
          .versaoFormato,

      nome:
        normalizado.nome
        || normalizado.seed
        || "Mapa gerado",

      aplicacaoId,

      visao:
        visaoJogador
          ? "jogador"
          : "mestre",
    },

    tokens:
      Array.isArray(
        mapaAtual?.tokens,
      )
        ? mapaAtual.tokens
        : [],

    npcs:
      Array.isArray(
        mapaAtual?.npcs,
      )
        ? mapaAtual.npcs
        : [],
  };
}

export function removerMapaGeradoDoGrid(
  mapaAtual = {},
  {
    removerTokens = false,
    removerNpcs = false,
  } = {},
) {
  const aplicacaoId =
    mapaAtual.aplicacaoMapaId
    || mapaAtual.geradorMapa
      ?.aplicacaoId;

  const pertenceAplicacao =
    (item) =>
      item?.origem
        === "gerador-mapas"
      && (
        !aplicacaoId
        || item.aplicacaoId
          === aplicacaoId
      );

  const semGerados =
    (lista) =>
      (
        Array.isArray(lista)
          ? lista
          : []
      ).filter(
        (item) =>
          !pertenceAplicacao(
            item,
          )
          && !item
            ?.origemGeradorId,
      );

  return {
    ...mapaAtual,

    paredes:
      semGerados(
        mapaAtual.paredes,
      ),

    portas:
      semGerados(
        mapaAtual.portas,
      ),

    objetosCenario:
      semGerados(
        mapaAtual
          .objetosCenario,
      ),

    luzes:
      semGerados(
        mapaAtual.luzes,
      ),

    areas:
      semGerados(
        mapaAtual.areas,
      ),

    arquiteturaVisual:
      null,

    geradorMapa:
      null,

    mapaAplicadoId:
      "",

    aplicacaoMapaId:
      "",

    versaoMapaAplicada:
      null,

    tokens:
      removerTokens
        ? []
        : (
            mapaAtual.tokens
            || []
          ),

    npcs:
      removerNpcs
        ? []
        : (
            mapaAtual.npcs
            || []
          ),
  };
}
