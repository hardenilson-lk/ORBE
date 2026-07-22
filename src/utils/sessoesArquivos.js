import { agendarSessaoPublicaRemota } from "../services/supabaseOrbe.js";

const PREFIXO_STORAGE =
  "orbe:arquivos:sessao";

function criarChaveStorage(mesaId) {
  const identificador =
    String(mesaId || "local").trim() ||
    "local";

  return `${PREFIXO_STORAGE}:${identificador}`;
}

function storageDisponivel() {
  return (
    typeof window !== "undefined" &&
    window.localStorage
  );
}

function criarListaSegura(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}

function criarObjetoSeguro(valor) {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return {};
  }

  return valor;
}

function limitarNumero(
  valor,
  valorPadrao,
  minimo,
  maximo,
) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return valorPadrao;
  }

  return Math.min(
    maximo,
    Math.max(
      minimo,
      numero,
    ),
  );
}

export function criarMapaArquivosVazio(
  valoresIniciais = {},
) {
  const valores =
    criarObjetoSeguro(
      valoresIniciais,
    );

  const gridRecebido =
    criarObjetoSeguro(
      valores.grid,
    );

  const cameraRecebida =
    criarObjetoSeguro(
      valores.camera,
    );

  const fundoRecebido =
    criarObjetoSeguro(
      valores.fundo,
    );

  const iluminacaoRecebida =
    criarObjetoSeguro(
      valores.iluminacao,
    );

  const neblinaRecebida =
    criarObjetoSeguro(
      valores.neblina,
    );

  return {
    versao: 3,

    grid: {
      colunas:
        limitarNumero(
          gridRecebido.colunas,
          32,
          1,
          200,
        ),

      linhas:
        limitarNumero(
          gridRecebido.linhas,
          17,
          1,
          200,
        ),

      tamanhoCelula:
        limitarNumero(
          gridRecebido.tamanhoCelula,
          64,
          24,
          160,
        ),

      cor:
        String(
          gridRecebido.cor ||
            "#d8b96f",
        ),

      opacidade:
        limitarNumero(
          gridRecebido.opacidade,
          0.46,
          0,
          1,
        ),

      espessura:
        limitarNumero(
          gridRecebido.espessura,
          1,
          1,
          6,
        ),

      linhaGrossaCada:
        limitarNumero(
          gridRecebido.linhaGrossaCada,
          5,
          0,
          20,
        ),

      encaixarTokens:
        gridRecebido.encaixarTokens !==
        false,

      mostrarCoordenadas:
        gridRecebido.mostrarCoordenadas ===
        true,

      unidadeMedida:
        ["metros", "quadrados"].includes(gridRecebido.unidadeMedida)
          ? gridRecebido.unidadeMedida
          : "metros",

      metrosPorCasa:
        limitarNumero(
          gridRecebido.metrosPorCasa,
          1.5,
          0.1,
          100,
        ),

      modoDiagonal:
        ["euclidiana", "alternada", "quadrados"].includes(gridRecebido.modoDiagonal)
          ? gridRecebido.modoDiagonal
          : "euclidiana",
    },

    camera: {
      zoom:
        limitarNumero(
          cameraRecebida.zoom,
          1,
          0.25,
          4,
        ),

      x:
        limitarNumero(
          cameraRecebida.x,
          0,
          -100000,
          100000,
        ),

      y:
        limitarNumero(
          cameraRecebida.y,
          0,
          -100000,
          100000,
        ),
    },

    fundo: {
      id:
        String(
          fundoRecebido.id ||
            "",
        ),
      imagem:
        String(
          fundoRecebido.imagem ||
            "",
        ),

      nome:
        String(
          fundoRecebido.nome ||
            "",
        ),

      x:
        limitarNumero(
          fundoRecebido.x,
          0,
          -100000,
          100000,
        ),

      y:
        limitarNumero(
          fundoRecebido.y,
          0,
          -100000,
          100000,
        ),

      largura:
        limitarNumero(
          fundoRecebido.largura,
          2048,
          1,
          50000,
        ),

      altura:
        limitarNumero(
          fundoRecebido.altura,
          1088,
          1,
          50000,
        ),

      rotacao:
        limitarNumero(
          fundoRecebido.rotacao,
          0,
          -360,
          360,
        ),

      opacidade:
        limitarNumero(
          fundoRecebido.opacidade,
          1,
          0,
          1,
        ),

      bloqueado:
        fundoRecebido.bloqueado !==
        false,

      ajustarAoGrid:
        fundoRecebido.ajustarAoGrid !==
        false,

      ordem:
        limitarNumero(
          fundoRecebido.ordem,
          0,
          -10000,
          10000,
        ),

      camada:
        "mapa",
    },

    mapas:
      criarListaSegura(
        valores.mapas,
      ).map(
        (item) => ({
          ...criarObjetoSeguro(item),
          camada: "mapa",
        }),
      ),

    fundoAtivoId:
      String(
        valores.fundoAtivoId ||
          "",
      ),

    camadas: Object.fromEntries(
      Object.entries({
        mapa: { visivel: true, bloqueada: true },
        objetos: { visivel: true, bloqueada: false },
        paredes: { visivel: true, bloqueada: false },
        tokens: { visivel: true, bloqueada: false },
        efeitos: { visivel: true, bloqueada: false },
        neblina: { visivel: true, bloqueada: false },
        interface: { visivel: true, bloqueada: true },
      }).map(([id, padrao]) => {
        const recebida = criarObjetoSeguro(criarObjetoSeguro(valores.camadas)[id]);
        return [id, {
          visivel: recebida.visivel !== false,
          bloqueada: recebida.bloqueada === true || (recebida.bloqueada == null && padrao.bloqueada),
        }];
      }),
    ),

    iluminacao: {
      modo:
        String(
          iluminacaoRecebida.modo ||
            "claro",
        ),

      luzAmbiente:
        limitarNumero(
          iluminacaoRecebida.luzAmbiente,
          1,
          0,
          1,
        ),

      corAmbiente:
        String(
          iluminacaoRecebida.corAmbiente ||
            "#ffffff",
        ),

      visaoDinamica:
        Number(valores.versao || 0) < 3
          ? true
          : iluminacaoRecebida.visaoDinamica === true,

      previsualizarJogador:
        iluminacaoRecebida.previsualizarJogador === true,
    },

    neblina: {
      ativa:
        neblinaRecebida.ativa ===
        true,

      modo:
        String(
          neblinaRecebida.modo ||
            "manual",
        ),

      opacidade:
        limitarNumero(
          neblinaRecebida.opacidade,
          0.92,
          0,
          1,
        ),

      areasReveladas:
        criarListaSegura(
          neblinaRecebida.areasReveladas,
        ),

      previsualizarJogador:
        neblinaRecebida.previsualizarJogador === true,
    },

    tokens:
      criarListaSegura(
        valores.tokens,
      ),

    npcs:
      criarListaSegura(
        valores.npcs,
      ),

    paredes:
      criarListaSegura(
        valores.paredes,
      ),

    portas:
      criarListaSegura(
        valores.portas,
      ),

    luzes:
      criarListaSegura(
        valores.luzes,
      ),

    guiaVisto:
      valores.guiaVisto ===
      true,
  };
}

export function criarSessaoArquivosVazia(
  valoresIniciais = {},
) {
  const valores =
    criarObjetoSeguro(
      valoresIniciais,
    );

  return {
    menuAtivo: "mapa",
    arquivoAtual: "ARQUIVO 0001",
    arquivoAtivoId: "",
    fichaAtivaId: "",
    escudoAberto: true,
    mesaVisivel: true,
    anotacoesMestre: "",
    volumeTrilha: 70,
    trilhaAtivaId: "",
    trilhas: [],
    anotacoes: [],
    missoes: [],
    arquivos: [],
    historicoRolagens: [],
    jogadores: [],
    criadoEm: "",
    atualizadoEm: "",
    ...valores,

    trilhas:
      criarListaSegura(
        valores.trilhas,
      ),

    anotacoes:
      criarListaSegura(
        valores.anotacoes,
      ),

    missoes:
      criarListaSegura(
        valores.missoes,
      ),

    arquivos:
      criarListaSegura(
        valores.arquivos,
      ),

    historicoRolagens:
      criarListaSegura(
        valores.historicoRolagens,
      ),

    chat:
      criarListaSegura(
        valores.chat,
      ),

    jogadores:
      criarListaSegura(
        valores.jogadores,
      ),

    mapa:
      criarMapaArquivosVazio(
        valores.mapa,
      ),
  };
}

export function carregarSessaoArquivos(
  mesaId,
) {
  if (!storageDisponivel()) {
    return criarSessaoArquivosVazia();
  }

  const chave =
    criarChaveStorage(mesaId);

  try {
    const conteudo =
      window.localStorage.getItem(chave);

    if (!conteudo) {
      return criarSessaoArquivosVazia();
    }

    const sessaoSalva =
      JSON.parse(conteudo);

    if (
      !sessaoSalva ||
      typeof sessaoSalva !== "object" ||
      Array.isArray(sessaoSalva)
    ) {
      return criarSessaoArquivosVazia();
    }

    return criarSessaoArquivosVazia(
      sessaoSalva,
    );
  } catch {
    return criarSessaoArquivosVazia();
  }
}

export function salvarSessaoArquivos(
  mesaId,
  sessaoRecebida = {},
) {
  const agora =
    new Date().toISOString();

  const sessaoAtual =
    carregarSessaoArquivos(mesaId);

  const sessaoNormalizada =
    criarSessaoArquivosVazia({
      ...sessaoAtual,
      ...sessaoRecebida,

      mapa:
        criarMapaArquivosVazio({
          ...sessaoAtual.mapa,
          ...criarObjetoSeguro(
            sessaoRecebida.mapa,
          ),
        }),

      criadoEm:
        sessaoRecebida.criadoEm ||
        sessaoAtual.criadoEm ||
        agora,

      atualizadoEm: agora,
    });

  if (!storageDisponivel()) {
    return sessaoNormalizada;
  }

  const chave =
    criarChaveStorage(mesaId);

  try {
    window.localStorage.setItem(
      chave,
      JSON.stringify(
        sessaoNormalizada,
      ),
    );
  } catch {
    return sessaoNormalizada;
  }

  agendarSessaoPublicaRemota(mesaId, sessaoNormalizada);

  return sessaoNormalizada;
}

export function aplicarSessaoArquivosRemota(
  mesaId,
  sessaoRecebida = {},
) {
  const sessaoAtual = carregarSessaoArquivos(mesaId);
  const sessaoNormalizada = criarSessaoArquivosVazia({
    ...sessaoAtual,
    ...(sessaoRecebida || {}),
    mapa: criarMapaArquivosVazio({
      ...sessaoAtual.mapa,
      ...criarObjetoSeguro(sessaoRecebida?.mapa),
    }),
    criadoEm: sessaoRecebida?.criadoEm || sessaoAtual.criadoEm,
    atualizadoEm: sessaoRecebida?.atualizadoEm || sessaoAtual.atualizadoEm || new Date().toISOString(),
  });

  if (!storageDisponivel()) return sessaoNormalizada;
  try {
    window.localStorage.setItem(criarChaveStorage(mesaId), JSON.stringify(sessaoNormalizada));
  } catch {
    return sessaoNormalizada;
  }
  return sessaoNormalizada;
}

export function atualizarSessaoArquivos(
  mesaId,
  alteracoes,
) {
  const sessaoAtual =
    carregarSessaoArquivos(mesaId);

  const mudancas =
    typeof alteracoes === "function"
      ? alteracoes(sessaoAtual)
      : alteracoes;

  return salvarSessaoArquivos(
    mesaId,
    {
      ...sessaoAtual,
      ...(mudancas || {}),
    },
  );
}

export function limparSessaoArquivos(
  mesaId,
) {
  if (!storageDisponivel()) {
    return false;
  }

  const chave =
    criarChaveStorage(mesaId);

  try {
    window.localStorage.removeItem(
      chave,
    );

    return true;
  } catch {
    return false;
  }
}

const sessoesArquivos = {
  criarVazia:
    criarSessaoArquivosVazia,

  criarMapaVazio:
    criarMapaArquivosVazio,

  carregar:
    carregarSessaoArquivos,

  salvar:
    salvarSessaoArquivos,

  atualizar:
    atualizarSessaoArquivos,

  limpar:
    limparSessaoArquivos,
};

export default sessoesArquivos;
