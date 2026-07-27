import {
  MANIFEST_PACKS_VISUAIS,
} from "../../../geradorMapa/temas/packs/manifestPacksGerado.js";

const ALIASES_ASSETS = {
  palete: "pallet",
  paletes: "pallet",
  pallets: "pallet",
  caixas: "caixa",
};

function normalizarTexto(
  valor,
) {
  return String(
    valor || "",
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

function nomeSala(
  sala,
) {
  return String(
    sala?.nome ||
      sala?.tipoTematico ||
      sala?.tipo ||
      "Área",
  ).replaceAll(
    "-",
    " ",
  );
}

function adicionarCandidato(
  candidatos,
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
    ALIASES_ASSETS[
      normalizado
    ] ||
    normalizado;

  if (
    !candidatos.includes(
      comAlias,
    )
  ) {
    candidatos.push(
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

  for (const parte of partes) {
    const parteComAlias =
      ALIASES_ASSETS[
        parte
      ] ||
      parte;

    if (
      !candidatos.includes(
        parteComAlias,
      )
    ) {
      candidatos.push(
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

function encontrarAssetNoGrupo({
  grupo,
  candidatos,
}) {
  const entradas =
    Object.entries(
      grupo || {},
    );

  for (const candidato of candidatos) {
    if (grupo?.[candidato]) {
      return candidato;
    }
  }

  for (const candidato of candidatos) {
    if (candidato.length < 3) {
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
      return aproximado[0];
    }
  }

  return "";
}

function objetoPossuiImagem({
  arquitetura,
  objeto,
}) {
  const tema =
    normalizarTexto(
      arquitetura?.tema,
    );

  const grupoDoTema =
    MANIFEST_PACKS_VISUAIS?.[
      tema
    ]?.objetos ||
    {};

  const candidatos =
    candidatosDeAsset(
      objeto,
    );

  const assetDoTema =
    encontrarAssetNoGrupo({
      grupo:
        grupoDoTema,

      candidatos,
    });

  if (assetDoTema) {
    return true;
  }

  /*
   * Proteção temporária:
   *
   * Procura nos outros packs caso o tema
   * ainda não tenha sido informado corretamente.
   */
  for (
    const categorias of Object.values(
      MANIFEST_PACKS_VISUAIS ||
        {},
    )
  ) {
    const encontrado =
      encontrarAssetNoGrupo({
        grupo:
          categorias?.objetos ||
          {},

        candidatos,
      });

    if (encontrado) {
      return true;
    }
  }

  return false;
}

export default function CamadaRotulosCenarioMapa({
  arquitetura,
  objetos = [],
  tamanhoCelula,
  largura,
  altura,
  papelAtual = "mestre",
}) {
  const salas =
    (
      arquitetura?.salas ||
      []
    ).filter(
      (sala) =>
        papelAtual ===
          "mestre" ||
        !sala.secreta,
    );

  const objetosVisiveis =
    objetos.filter(
      (objeto) =>
        papelAtual ===
          "mestre" ||
        objeto.visivelJogador !==
          false,
    );

  const objetosComRotulo =
    objetosVisiveis.filter(
      (objeto) =>
        !objetoPossuiImagem({
          arquitetura,
          objeto,
        }),
    );

  if (
    !salas.length &&
    !objetosComRotulo.length
  ) {
    return null;
  }

  return (
    <svg
      className="camada-rotulos-cenario-mapa"
      viewBox={`0 0 ${largura} ${altura}`}
      preserveAspectRatio="none"
      aria-label="Nomes das áreas e objetos do cenário"
    >
      <g className="camada-rotulos-cenario-mapa__salas">
        {salas.map(
          (sala) => (
            <text
              key={`sala-${sala.id}`}
              x={
                (
                  sala.x +
                  sala.largura /
                    2
                ) *
                tamanhoCelula
              }
              y={
                (
                  sala.y +
                  sala.altura /
                    2
                ) *
                tamanhoCelula
              }
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {nomeSala(
                sala,
              )}
            </text>
          ),
        )}
      </g>

      <g className="camada-rotulos-cenario-mapa__objetos">
        {objetosComRotulo.map(
          (objeto) => (
            <text
              key={`objeto-${objeto.id}`}
              x={
                objeto.x +
                objeto.largura /
                  2
              }
              y={
                objeto.y +
                objeto.altura /
                  2
              }
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {objeto.nome ||
                objeto.tipo ||
                "Objeto"}
            </text>
          ),
        )}
      </g>
    </svg>
  );
}