import {
  mkdir,
  readdir,
  writeFile,
} from "node:fs/promises";

import path from "node:path";

const RAIZ_PROJETO =
  process.cwd();

const PASTA_MAPAS =
  path.join(
    RAIZ_PROJETO,
    "public",
    "assets",
    "mapas",
  );

const ARQUIVO_SAIDA =
  path.join(
    RAIZ_PROJETO,
    "src",
    "geradorMapa",
    "temas",
    "packs",
    "manifestPacksGerado.js",
  );

const EXTENSOES_ACEITAS =
  new Set([
    ".svg",
    ".webp",
    ".png",
    ".jpg",
    ".jpeg",
  ]);

function normalizarId(
  valor,
) {
  return String(
    valor || "",
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

async function listarDiretorios(
  pasta,
) {
  try {
    const entradas =
      await readdir(
        pasta,
        {
          withFileTypes: true,
        },
      );

    return entradas
      .filter(
        (entrada) =>
          entrada.isDirectory(),
      )
      .sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
          ),
      );
  } catch {
    return [];
  }
}

async function listarArquivosRecursivamente(
  pasta,
  pastaBase = pasta,
) {
  const encontrados = [];

  let entradas = [];

  try {
    entradas =
      await readdir(
        pasta,
        {
          withFileTypes: true,
        },
      );
  } catch {
    return encontrados;
  }

  for (const entrada of entradas) {
    const caminhoCompleto =
      path.join(
        pasta,
        entrada.name,
      );

    if (entrada.isDirectory()) {
      const internos =
        await listarArquivosRecursivamente(
          caminhoCompleto,
          pastaBase,
        );

      encontrados.push(
        ...internos,
      );

      continue;
    }

    if (!entrada.isFile()) {
      continue;
    }

    const extensao =
      path.extname(
        entrada.name,
      ).toLowerCase();

    if (
      !EXTENSOES_ACEITAS.has(
        extensao,
      )
    ) {
      continue;
    }

    encontrados.push({
      nome:
        entrada.name,

      extensao,

      caminhoCompleto,

      caminhoRelativo:
        path
          .relative(
            pastaBase,
            caminhoCompleto,
          )
          .split(
            path.sep,
          )
          .join("/"),
    });
  }

  return encontrados.sort(
    (a, b) =>
      a.caminhoRelativo.localeCompare(
        b.caminhoRelativo,
      ),
  );
}

function ordenarObjeto(
  objeto,
) {
  return Object.fromEntries(
    Object.entries(
      objeto,
    )
      .sort(
        ([chaveA], [chaveB]) =>
          chaveA.localeCompare(
            chaveB,
          ),
      )
      .map(
        ([chave, valor]) => [
          chave,

          valor &&
          typeof valor === "object" &&
          !Array.isArray(valor)
            ? ordenarObjeto(
                valor,
              )
            : valor,
        ],
      ),
  );
}

async function gerarManifesto() {
  const manifesto = {};

  const temas =
    await listarDiretorios(
      PASTA_MAPAS,
    );

  for (const tema of temas) {
    const temaId =
      normalizarId(
        tema.name,
      );

    const pastaTema =
      path.join(
        PASTA_MAPAS,
        tema.name,
      );

    const categorias =
      await listarDiretorios(
        pastaTema,
      );

    manifesto[temaId] = {};

    for (
      const categoria of categorias
    ) {
      const categoriaId =
        normalizarId(
          categoria.name,
        );

      const pastaCategoria =
        path.join(
          pastaTema,
          categoria.name,
        );

      const arquivos =
        await listarArquivosRecursivamente(
          pastaCategoria,
        );

      manifesto[temaId][
        categoriaId
      ] = {};

      for (
        const arquivo of arquivos
      ) {
        const nomeSemExtensao =
          path.basename(
            arquivo.nome,
            arquivo.extensao,
          );

        const assetId =
          normalizarId(
            nomeSemExtensao,
          );

        if (
          manifesto[temaId][
            categoriaId
          ][assetId]
        ) {
          console.warn(
            [
              "Asset duplicado ignorado:",
              temaId,
              categoriaId,
              assetId,
              arquivo.caminhoRelativo,
            ].join(" "),
          );

          continue;
        }

        manifesto[temaId][
          categoriaId
        ][assetId] = [
          "assets",
          "mapas",
          tema.name,
          categoria.name,
          arquivo.caminhoRelativo,
        ].join("/");
      }
    }
  }

  const manifestoOrdenado =
    ordenarObjeto(
      manifesto,
    );

  const conteudo = `/*
 * ARQUIVO GERADO AUTOMATICAMENTE.
 *
 * Não edite manualmente.
 * Execute:
 *
 * node scripts/gerar-manifest-packs.mjs
 */

export const MANIFEST_PACKS_VISUAIS =
  Object.freeze(
    ${JSON.stringify(
      manifestoOrdenado,
      null,
      2,
    )},
  );

export function obterAssetDoManifesto({
  temaId,
  categoria,
  assetId,
}) {
  const tema =
    String(temaId || "")
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const grupo =
    String(categoria || "")
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const asset =
    String(assetId || "")
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return (
    MANIFEST_PACKS_VISUAIS?.[tema]
      ?.[grupo]?.[asset] ||
    ""
  );
}

export default MANIFEST_PACKS_VISUAIS;
`;

  await mkdir(
    path.dirname(
      ARQUIVO_SAIDA,
    ),
    {
      recursive: true,
    },
  );

  await writeFile(
    ARQUIVO_SAIDA,
    conteudo,
    "utf8",
  );

  const quantidadeTemas =
    Object.keys(
      manifestoOrdenado,
    ).length;

  const quantidadeAssets =
    Object.values(
      manifestoOrdenado,
    ).reduce(
      (
        totalTemas,
        categorias,
      ) =>
        totalTemas +
        Object.values(
          categorias,
        ).reduce(
          (
            totalCategorias,
            assets,
          ) =>
            totalCategorias +
            Object.keys(
              assets,
            ).length,
          0,
        ),
      0,
    );

  console.log(
    [
      "Manifesto visual criado com sucesso.",
      `Temas: ${quantidadeTemas}.`,
      `Assets: ${quantidadeAssets}.`,
    ].join(" "),
  );

  console.log(
    ARQUIVO_SAIDA,
  );
}

gerarManifesto().catch(
  (erro) => {
    console.error(
      "Não foi possível gerar o manifesto dos packs.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);