import {
  readFile,
  writeFile,
} from "node:fs/promises";

import path from "node:path";

const RAIZ_PROJETO =
  process.cwd();

const AJUSTES = [
  {
    arquivo: [
      "public",
      "assets",
      "mapas",
      "armazem",
      "paredes",
      "parede-horizontal.svg",
    ],

    viewBox:
      "0 135 512 242",
  },

  {
    arquivo: [
      "public",
      "assets",
      "mapas",
      "armazem",
      "paredes",
      "parede-vertical.svg",
    ],

    viewBox:
      "135 0 242 512",
  },

  {
    arquivo: [
      "public",
      "assets",
      "mapas",
      "armazem",
      "paredes",
      "parede-canto.svg",
    ],

    viewBox:
      "30 45 455 430",
  },

  {
    arquivo: [
      "public",
      "assets",
      "mapas",
      "armazem",
      "portas",
      "porta-fechada.svg",
    ],

    viewBox:
      "35 85 442 342",
  },

  {
    arquivo: [
      "public",
      "assets",
      "mapas",
      "armazem",
      "portas",
      "porta-aberta.svg",
    ],

    viewBox:
      "35 75 442 365",
  },

  {
    arquivo: [
      "public",
      "assets",
      "mapas",
      "armazem",
      "portas",
      "porta-trancada.svg",
    ],

    viewBox:
      "35 85 442 342",
  },

  {
    arquivo: [
      "public",
      "assets",
      "mapas",
      "armazem",
      "portas",
      "porta-secreta.svg",
    ],

    viewBox:
      "25 125 462 262",
  },
];

async function corrigirArquivo({
  arquivo,
  viewBox,
}) {
  const caminho =
    path.join(
      RAIZ_PROJETO,
      ...arquivo,
    );

  const conteudoAtual =
    await readFile(
      caminho,
      "utf8",
    );

  if (
    !/viewBox="[^"]+"/.test(
      conteudoAtual,
    )
  ) {
    throw new Error(
      `O arquivo não possui viewBox: ${caminho}`,
    );
  }

  const conteudoCorrigido =
    conteudoAtual.replace(
      /viewBox="[^"]+"/,
      `viewBox="${viewBox}"`,
    );

  await writeFile(
    caminho,
    conteudoCorrigido,
    "utf8",
  );

  console.log(
    [
      "Recorte corrigido:",
      path.basename(
        caminho,
      ),
      `→ ${viewBox}`,
    ].join(" "),
  );
}

async function corrigirRecortes() {
  console.log(
    "Corrigindo recortes das paredes e portas do Armazém...",
  );

  for (
    const ajuste of AJUSTES
  ) {
    await corrigirArquivo(
      ajuste,
    );
  }

  console.log(
    [
      "",
      "Recortes corrigidos com sucesso.",
      `Arquivos alterados: ${AJUSTES.length}.`,
      "Não foi necessário alterar o manifesto.",
    ].join("\n"),
  );
}

corrigirRecortes().catch(
  (erro) => {
    console.error(
      "Não foi possível corrigir os recortes.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);