import {
  URL_FINALIZADOR_IA,
} from "./configuracaoFinalizadorIA.js";

import {
  obterFinalizacaoIA,
  salvarFinalizacaoIA,
} from "./cacheFinalizacoesIA.js";

function blobParaDataUrl(blob) {
  return new Promise(
    (resolve, reject) => {
      const leitor =
        new FileReader();

      leitor.onload = () => {
        resolve(
          leitor.result,
        );
      };

      leitor.onerror = () => {
        reject(
          leitor.error,
        );
      };

      leitor.readAsDataURL(
        blob,
      );
    },
  );
}

function obterMensagemErro(
  dados,
) {
  return (
    dados?.mensagem
    || dados?.erro?.mensagem
    || "Não foi possível finalizar o mapa."
  );
}

export async function finalizarMapaComIA({
  imagemBase,
  tema,
  descricao,
  hashMapa,
  qualidade = "economica",
  aoAtualizarEstado,
}) {
  const cache =
    await obterFinalizacaoIA(
      hashMapa,
    );

  if (cache?.imagem) {
    aoAtualizarEstado?.(
      "Aplicando imagem...",
    );

    return {
      ...cache,
      origem: "navegador",
    };
  }

  aoAtualizarEstado?.(
    "Enviando para IA...",
  );

  const imagemBaseDataUrl =
    await blobParaDataUrl(
      imagemBase,
    );

  const resposta =
    await fetch(
      `${URL_FINALIZADOR_IA}/api/finalizar-mapa`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          imagemBase:
            imagemBaseDataUrl,

          tema,

          descricao,

          hashMapa,

          qualidade:
            qualidade,
        }),
      },
    );

  const dados =
    await resposta
      .json()
      .catch(() => ({}));

  if (
    !resposta.ok
    || !dados.imagem
  ) {
    throw new Error(
      obterMensagemErro(
        dados,
      ),
    );
  }

  const valor = {
    hashMapa,

    imagem:
      dados.imagem,

    criadoEm:
      dados.criadaEm
      || new Date().toISOString(),

    tamanho:
      dados.largura
      || 512,

    tema:
      dados.tema
      || tema,

    qualidade:
      dados.qualidade
      || "economica",

    modelo:
      dados.modelo
      || "",

    versaoPrompt:
      dados.versaoPrompt
      || 1,
  };

  await salvarFinalizacaoIA(
    valor,
  );

  aoAtualizarEstado?.(
    "Aplicando imagem...",
  );

  return {
    ...valor,

    origem:
      resposta.headers.get(
        "X-ORBE-Cache",
      )
      || "worker",
  };
}
