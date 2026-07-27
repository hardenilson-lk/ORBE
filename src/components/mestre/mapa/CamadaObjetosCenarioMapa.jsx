import {
  MANIFEST_PACKS_VISUAIS,
} from "../../../geradorMapa/temas/packs/manifestPacksGerado.js";

import {
  obterConfiguracaoAssetVisual,
  resolverAliasAssetVisual,
} from "../../../geradorMapa/temas/packs/configuracaoAssetsVisuais.js";

const BASE_PUBLICA =
  String(
    import.meta.env.BASE_URL ||
      "/",
  ).replace(
    /\/+$/,
    "",
  );

const SIMBOLOS_OBJETOS = {
  recepcao: "▰",
  cadeira: "⌑",
  banco: "▭",
  mesa: "▱",
  armario: "▥",
  arquivo: "▤",
  estante: "▥",
  maca: "▰",
  cama: "▰",
  cirurgica: "✚",
  biombo: "⋮",
  soro: "⚕",
  computador: "▣",
  monitor: "▣",
  carrinho: "▦",
  bancada: "▱",
  pia: "◡",
  sanitario: "◯",
  gerador: "⚙",
  painel: "⚡",
  freezer: "▧",
  mortuaria: "▥",
  extintor: "!",
  camera: "◉",
  caixa: "□",
  pallet: "▤",
  palete: "▤",
  entulho: "◆",
  papel: "≋",
  vidro: "◇",
  fita: "╳",
  sangue: "●",
  arrasto: "〰",
  ritual: "⟡",
  umidade: "≈",
  vegetacao: "❧",
  altar: "◇",
  terminal: "▣",
};

function normalizarTexto(
  valor,
) {
  return String(
    valor ||
      "",
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function criarCaminhoPublico(
  caminho,
) {
  const caminhoNormalizado =
    String(
      caminho ||
        "",
    ).replace(
      /^\/+/,
      "",
    );

  if (!caminhoNormalizado) {
    return "";
  }

  return `${BASE_PUBLICA}/${caminhoNormalizado}`;
}

function adicionarCandidato(
  lista,
  valor,
) {
  const normalizado =
    normalizarTexto(
      valor,
    );

  if (!normalizado) {
    return;
  }

  const comAlias =
    resolverAliasAssetVisual(
      normalizado,
    );

  if (
    !lista.includes(
      comAlias,
    )
  ) {
    lista.push(
      comAlias,
    );
  }

  const partes =
    normalizado
      .split("-")
      .filter(
        (parte) =>
          parte.length >= 3,
      );

  for (
    const parte of partes
  ) {
    const parteComAlias =
      resolverAliasAssetVisual(
        parte,
      );

    if (
      !lista.includes(
        parteComAlias,
      )
    ) {
      lista.push(
        parteComAlias,
      );
    }
  }
}

function candidatosDeAsset(
  objeto,
) {
  const candidatos = [];

  adicionarCandidato(
    candidatos,
    objeto?.assetId,
  );

  adicionarCandidato(
    candidatos,
    objeto?.tipo,
  );

  adicionarCandidato(
    candidatos,
    objeto?.nome,
  );

  adicionarCandidato(
    candidatos,
    objeto?.categoria,
  );

  return candidatos;
}

function obterAssetsDoTema(
  temaId,
) {
  const temaNormalizado =
    normalizarTexto(
      temaId,
    );

  return (
    MANIFEST_PACKS_VISUAIS?.[
      temaNormalizado
    ]?.objetos ||
    {}
  );
}

function localizarNoGrupo({
  grupo,
  candidatos,
}) {
  const entradas =
    Object.entries(
      grupo ||
        {},
    );

  for (
    const candidato of candidatos
  ) {
    if (
      grupo?.[
        candidato
      ]
    ) {
      return {
        assetId:
          candidato,

        caminho:
          grupo[
            candidato
          ],
      };
    }
  }

  for (
    const candidato of candidatos
  ) {
    if (
      candidato.length <
      3
    ) {
      continue;
    }

    const aproximado =
      entradas.find(
        ([assetId]) =>
          candidato.includes(
            assetId,
          ) ||
          assetId.includes(
            candidato,
          ),
      );

    if (aproximado) {
      return {
        assetId:
          aproximado[0],

        caminho:
          aproximado[1],
      };
    }
  }

  return null;
}

function encontrarImagemObjeto({
  objeto,
  temaId,
}) {
  const candidatos =
    candidatosDeAsset(
      objeto,
    );

  if (!candidatos.length) {
    return {
      assetId: "",
      caminho: "",
    };
  }

  const grupoDoTema =
    obterAssetsDoTema(
      temaId,
    );

  const resultadoDoTema =
    localizarNoGrupo({
      grupo:
        grupoDoTema,

      candidatos,
    });

  if (resultadoDoTema) {
    return {
      ...resultadoDoTema,

      caminho:
        criarCaminhoPublico(
          resultadoDoTema.caminho,
        ),
    };
  }

  /*
   * Proteção temporária:
   *
   * Caso o tema não tenha chegado corretamente
   * ao componente, procura nos demais packs.
   */
  for (
    const categorias of Object.values(
      MANIFEST_PACKS_VISUAIS ||
        {},
    )
  ) {
    const resultadoAlternativo =
      localizarNoGrupo({
        grupo:
          categorias?.objetos ||
          {},

        candidatos,
      });

    if (
      resultadoAlternativo
    ) {
      return {
        ...resultadoAlternativo,

        caminho:
          criarCaminhoPublico(
            resultadoAlternativo.caminho,
          ),
      };
    }
  }

  return {
    assetId: "",
    caminho: "",
  };
}

function textoCompletoObjeto(
  objeto,
) {
  return normalizarTexto(
    [
      objeto?.assetId,
      objeto?.tipo,
      objeto?.nome,
      objeto?.categoria,
    ]
      .filter(
        Boolean,
      )
      .join(" "),
  );
}

function simboloDoObjeto(
  objeto,
) {
  const texto =
    textoCompletoObjeto(
      objeto,
    );

  const entrada =
    Object.entries(
      SIMBOLOS_OBJETOS,
    ).find(
      ([chave]) =>
        texto.includes(
          chave,
        ),
    );

  return (
    entrada?.[1] ||
    "◆"
  );
}

function classeTipoObjeto(
  objeto,
) {
  return (
    normalizarTexto(
      objeto?.tipo ||
        objeto?.categoria ||
        "objeto",
    ) ||
    "objeto"
  );
}

function mostrarFallback(
  elementoObjeto,
) {
  const fallback =
    elementoObjeto?.querySelector(
      "[data-fallback-objeto='sim']",
    );

  if (fallback) {
    fallback.style.display =
      "flex";
  }
}

function esconderImagemComErro(
  evento,
) {
  const imagem =
    evento.currentTarget;

  imagem.style.display =
    "none";

  const elementoObjeto =
    imagem.parentElement;

  if (!elementoObjeto) {
    return;
  }

  elementoObjeto.style.background =
    "";

  elementoObjeto.style.border =
    "";

  elementoObjeto.style.boxShadow =
    "";

  mostrarFallback(
    elementoObjeto,
  );
}

export default function CamadaObjetosCenarioMapa({
  objetos = [],
  temaId = "generico-arquivos",
}) {
  if (!objetos.length) {
    return null;
  }

  const temaNormalizado =
    normalizarTexto(
      temaId,
    ) ||
    "generico-arquivos";

  return (
    <div
      className="camada-objetos-cenario-mapa"
      data-tema={
        temaNormalizado
      }
      aria-hidden="true"
    >
      {objetos.map(
        (objeto) => {
          const imagem =
            encontrarImagemObjeto({
              objeto,
              temaId:
                temaNormalizado,
            });

          const possuiImagem =
            Boolean(
              imagem.caminho,
            );

          const configuracaoVisual =
            obterConfiguracaoAssetVisual(
              imagem.assetId,
            );

          const escala =
            Number(
              configuracaoVisual.escala,
            ) || 1;

          const deslocamentoX =
            Number(
              configuracaoVisual.deslocamentoX,
            ) || 0;

          const deslocamentoY =
            Number(
              configuracaoVisual.deslocamentoY,
            ) || 0;

          const rotacaoAdicional =
            Number(
              configuracaoVisual.rotacaoAdicional,
            ) || 0;

          const opacidade =
            Number.isFinite(
              Number(
                configuracaoVisual.opacidade,
              ),
            )
              ? Number(
                  configuracaoVisual.opacidade,
                )
              : 1;

          const zIndex =
            Number(
              configuracaoVisual.zIndex,
            ) || 5;

          const usarSombra =
            configuracaoVisual.sombra !==
            false;

          return (
            <div
              className={[
                "camada-objetos-cenario-mapa__objeto",

                `camada-objetos-cenario-mapa__objeto--${classeTipoObjeto(
                  objeto,
                )}`,

                objeto.bloqueiaMovimento
                  ? "camada-objetos-cenario-mapa__objeto--solido"
                  : "",

                possuiImagem
                  ? "camada-objetos-cenario-mapa__objeto--com-imagem"
                  : "",
              ]
                .filter(
                  Boolean,
                )
                .join(" ")}
              data-asset={
                imagem.assetId
              }
              data-caminho={
                imagem.caminho
              }
              key={
                objeto.id
              }
              title={
                objeto.nome ||
                objeto.tipo ||
                "Objeto"
              }
              style={{
                position:
                  "absolute",

                left:
                  `${Number(
                    objeto.x,
                  ) || 0}px`,

                top:
                  `${Number(
                    objeto.y,
                  ) || 0}px`,

                width:
                  `${Math.max(
                    1,
                    Number(
                      objeto.largura,
                    ) || 1,
                  )}px`,

                height:
                  `${Math.max(
                    1,
                    Number(
                      objeto.altura,
                    ) || 1,
                  )}px`,

                transform:
                  `rotate(${
                    Number(
                      objeto.rotacao,
                    ) || 0
                  }deg)`,

                transformOrigin:
                  "center",

                overflow:
                  "visible",

                background:
                  possuiImagem
                    ? "transparent"
                    : undefined,

                border:
                  possuiImagem
                    ? "0"
                    : undefined,

                boxShadow:
                  possuiImagem
                    ? "none"
                    : undefined,
              }}
            >
              {possuiImagem ? (
                <img
                  src={
                    imagem.caminho
                  }
                  alt=""
                  draggable="false"
                  aria-hidden="true"
                  onDragStart={
                    (evento) =>
                      evento.preventDefault()
                  }
                  onError={
                    esconderImagemComErro
                  }
                  style={{
                    position:
                      "absolute",

                    zIndex,

                    left:
                      "50%",

                    top:
                      "50%",

                    display:
                      "block",

                    width:
                      "100%",

                    height:
                      "100%",

                    maxWidth:
                      "none",

                    objectFit:
                      "contain",

                    opacity: opacidade,

                    transformOrigin:
                      "center",

                    transform: [
                      "translate(-50%, -50%)",

                      `translate(${
                        deslocamentoX *
                        100
                      }%, ${
                        deslocamentoY *
                        100
                      }%)`,

                      `scale(${escala})`,

                      `rotate(${rotacaoAdicional}deg)`,
                    ].join(" "),

                    pointerEvents:
                      "none",

                    userSelect:
                      "none",

                    filter:
                      usarSombra
                        ? "drop-shadow(0 4px 5px rgba(0, 0, 0, 0.55))"
                        : "none",
                  }}
                />
              ) : null}

              <span
                data-fallback-objeto="sim"
                style={{
                  position:
                    "relative",

                  zIndex: 1,

                  display:
                    possuiImagem
                      ? "none"
                      : "flex",

                  width:
                    "100%",

                  height:
                    "100%",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  pointerEvents:
                    "none",
                }}
              >
                {simboloDoObjeto(
                  objeto,
                )}
              </span>
            </div>
          );
        },
      )}
    </div>
  );
}