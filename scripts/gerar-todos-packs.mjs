import {
  access,
} from "node:fs/promises";

import {
  execFile,
} from "node:child_process";

import {
  fileURLToPath,
} from "node:url";

import {
  promisify,
} from "node:util";

import path from "node:path";

const executarArquivo =
  promisify(execFile);

const DIRETORIO_SCRIPT =
  path.dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );

const RAIZ_PROJETO =
  path.resolve(
    DIRETORIO_SCRIPT,
    "..",
  );

const GERADORES_OBJETOS = [
  {
    nome: "Objetos — Armazém",
    arquivo:
      "gerar-pack-armazem.mjs",
  },
  {
    nome: "Objetos — Escola",
    arquivo:
      "gerar-pack-escola.mjs",
  },
  {
    nome: "Objetos — Delegacia",
    arquivo:
      "gerar-pack-delegacia.mjs",
  },
  {
    nome:
      "Objetos — Laboratório",
    arquivo:
      "gerar-pack-laboratorio.mjs",
  },
  {
    nome: "Objetos — Mansão",
    arquivo:
      "gerar-pack-mansao.mjs",
  },
  {
    nome:
      "Objetos — Instalação Subterrânea",
    arquivo:
      "gerar-pack-instalacao-subterranea.mjs",
  },
  {
    nome: "Objetos — Floresta",
    arquivo:
      "gerar-pack-floresta.mjs",
  },
  {
    nome:
      "Objetos — Acampamento",
    arquivo:
      "gerar-pack-acampamento.mjs",
  },
  {
    nome:
      "Objetos — Local de Ritual",
    arquivo:
      "gerar-pack-local-ritual.mjs",
  },
];

const GERADORES_PISOS = [
  {
    nome: "Pisos — Armazém",
    arquivo:
      "gerar-pisos-armazem.mjs",
  },
  {
    nome: "Pisos — Escola",
    arquivo:
      "gerar-pisos-escola.mjs",
  },
  {
    nome: "Pisos — Delegacia",
    arquivo:
      "gerar-pisos-delegacia.mjs",
  },
  {
    nome:
      "Pisos — Laboratório",
    arquivo:
      "gerar-pisos-laboratorio.mjs",
  },
  {
    nome: "Pisos — Mansão",
    arquivo:
      "gerar-pisos-mansao.mjs",
  },
  {
    nome:
      "Pisos — Instalação Subterrânea",
    arquivo:
      "gerar-pisos-instalacao-subterranea.mjs",
  },
  {
    nome:
      "Pisos — Local de Ritual",
    arquivo:
      "gerar-pisos-local-ritual.mjs",
  },
];

const GERADORES_ARQUITETURA = [
  {
    nome:
      "Paredes e portas — Armazém",
    arquivo:
      "gerar-paredes-portas-armazem.mjs",
  },
  {
    nome:
      "Paredes e portas — Escola",
    arquivo:
      "gerar-paredes-portas-escola.mjs",
  },
  {
    nome:
      "Paredes e portas — Delegacia",
    arquivo:
      "gerar-paredes-portas-delegacia.mjs",
  },
  {
    nome:
      "Paredes e portas — Laboratório",
    arquivo:
      "gerar-paredes-portas-laboratorio.mjs",
  },
  {
    nome:
      "Paredes e portas — Mansão",
    arquivo:
      "gerar-paredes-portas-mansao.mjs",
  },
  {
    nome:
      "Paredes e portas — Instalação Subterrânea",
    arquivo:
      "gerar-paredes-portas-instalacao-subterranea.mjs",
  },
  {
    nome:
      "Paredes e portas — Local de Ritual",
    arquivo:
      "gerar-paredes-portas-local-ritual.mjs",
  },
];

const TODOS_GERADORES = [
  ...GERADORES_OBJETOS,
  ...GERADORES_PISOS,
  ...GERADORES_ARQUITETURA,
];

const SCRIPT_MANIFESTO =
  path.join(
    DIRETORIO_SCRIPT,
    "gerar-manifest-packs.mjs",
  );

async function arquivoExiste(
  caminho,
) {
  try {
    await access(
      caminho,
    );

    return true;
  } catch {
    return false;
  }
}

function separador() {
  console.log(
    "\n" +
    "=".repeat(
      62,
    ) +
    "\n",
  );
}

async function executarScript({
  nome,
  caminho,
}) {
  console.log(
    `Iniciando: ${nome}`,
  );

  const {
    stdout,
    stderr,
  } = await executarArquivo(
    process.execPath,
    [
      caminho,
    ],
    {
      cwd: RAIZ_PROJETO,
      windowsHide: true,
      maxBuffer:
        20 * 1024 * 1024,
    },
  );

  if (
    stdout?.trim()
  ) {
    console.log(
      stdout.trim(),
    );
  }

  if (
    stderr?.trim()
  ) {
    console.error(
      stderr.trim(),
    );
  }

  console.log(
    `Concluído: ${nome}`,
  );
}

async function verificarArquivos() {
  const ausentes = [];

  for (
    const gerador
    of TODOS_GERADORES
  ) {
    const caminho =
      path.join(
        DIRETORIO_SCRIPT,
        gerador.arquivo,
      );

    if (
      !await arquivoExiste(
        caminho,
      )
    ) {
      ausentes.push(
        {
          nome:
            gerador.nome,
          caminho,
        },
      );
    }
  }

  if (
    !await arquivoExiste(
      SCRIPT_MANIFESTO,
    )
  ) {
    ausentes.push(
      {
        nome:
          "Gerador do manifesto",
        caminho:
          SCRIPT_MANIFESTO,
      },
    );
  }

  if (
    ausentes.length
  ) {
    const lista =
      ausentes
        .map(
          ({
            nome,
            caminho,
          }) =>
            `- ${nome}: ${caminho}`,
        )
        .join(
          "\n",
        );

    throw new Error(
      [
        "Alguns scripts não foram encontrados:",
        "",
        lista,
        "",
        "Crie os arquivos ausentes antes de executar novamente.",
      ].join(
        "\n",
      ),
    );
  }
}

async function executarGrupo({
  titulo,
  geradores,
  concluidos,
}) {
  console.log(
    titulo,
  );

  separador();

  for (
    let indice = 0;
    indice < geradores.length;
    indice += 1
  ) {
    const gerador =
      geradores[indice];

    const caminho =
      path.join(
        DIRETORIO_SCRIPT,
        gerador.arquivo,
      );

    console.log(
      `[${indice + 1}/${geradores.length}] ${gerador.nome}`,
    );

    await executarScript(
      {
        nome:
          gerador.nome,
        caminho,
      },
    );

    concluidos.push(
      gerador.nome,
    );

    separador();
  }
}

async function gerarTodosPacks() {
  console.log(
    [
      "",
      "GERADOR COMPLETO DE ASSETS DO ORBE",
      `Geradores de objetos: ${GERADORES_OBJETOS.length}`,
      `Geradores de pisos: ${GERADORES_PISOS.length}`,
      `Geradores de paredes e portas: ${GERADORES_ARQUITETURA.length}`,
      `Total de geradores: ${TODOS_GERADORES.length}`,
      `Projeto: ${RAIZ_PROJETO}`,
    ].join(
      "\n",
    ),
  );

  separador();

  console.log(
    "Verificando os scripts...",
  );

  await verificarArquivos();

  console.log(
    "Todos os scripts necessários foram encontrados.",
  );

  separador();

  const concluidos = [];

  await executarGrupo(
    {
      titulo:
        "GERANDO OBJETOS DOS TEMAS",
      geradores:
        GERADORES_OBJETOS,
      concluidos,
    },
  );

  await executarGrupo(
    {
      titulo:
        "GERANDO PISOS DOS TEMAS",
      geradores:
        GERADORES_PISOS,
      concluidos,
    },
  );

  await executarGrupo(
    {
      titulo:
        "GERANDO PAREDES E PORTAS DOS TEMAS",
      geradores:
        GERADORES_ARQUITETURA,
      concluidos,
    },
  );

  console.log(
    "Atualizando o manifesto visual final...",
  );

  await executarScript(
    {
      nome:
        "Manifesto visual final",
      caminho:
        SCRIPT_MANIFESTO,
    },
  );

  separador();

  console.log(
    [
      "TODOS OS ASSETS FORAM ATUALIZADOS COM SUCESSO.",
      "",
      `Geradores concluídos: ${concluidos.length}.`,
      `Objetos concluídos: ${GERADORES_OBJETOS.length}.`,
      `Pisos concluídos: ${GERADORES_PISOS.length}.`,
      `Paredes e portas concluídas: ${GERADORES_ARQUITETURA.length}.`,
      "",
      ...concluidos.map(
        (
          nome,
          indice,
        ) =>
          `${indice + 1}. ${nome}`,
      ),
      "",
      "O manifesto visual final também foi atualizado.",
    ].join(
      "\n",
    ),
  );
}

gerarTodosPacks().catch(
  (erro) => {
    separador();

    console.error(
      "Não foi possível gerar todos os assets.",
    );

    console.error(
      erro,
    );

    process.exitCode = 1;
  },
);