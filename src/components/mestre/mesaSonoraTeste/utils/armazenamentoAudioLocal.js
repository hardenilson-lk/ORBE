const NOME_BANCO = "orbe-mesa-sonora";
const VERSAO_BANCO = 1;
const NOME_REPOSITORIO = "arquivos-audio";

let bancoPromise;

function abrirBanco() {
  if (!globalThis.indexedDB) {
    return Promise.reject(
      new Error("Este navegador não permite salvar arquivos de áudio localmente."),
    );
  }

  if (bancoPromise) return bancoPromise;

  bancoPromise = new Promise((resolve, reject) => {
    const requisicao = indexedDB.open(NOME_BANCO, VERSAO_BANCO);

    requisicao.onupgradeneeded = () => {
      const banco = requisicao.result;
      if (!banco.objectStoreNames.contains(NOME_REPOSITORIO)) {
        banco.createObjectStore(NOME_REPOSITORIO, { keyPath: "id" });
      }
    };

    requisicao.onsuccess = () => resolve(requisicao.result);
    requisicao.onerror = () => {
      bancoPromise = undefined;
      reject(requisicao.error || new Error("Não foi possível abrir o armazenamento de áudio."));
    };
    requisicao.onblocked = () => {
      bancoPromise = undefined;
      reject(new Error("O armazenamento de áudio está bloqueado por outra aba do ORBE."));
    };
  });

  return bancoPromise;
}

function aguardarRequisicao(requisicao) {
  return new Promise((resolve, reject) => {
    requisicao.onsuccess = () => resolve(requisicao.result);
    requisicao.onerror = () => reject(
      requisicao.error || new Error("Não foi possível acessar o arquivo de áudio."),
    );
  });
}

function aguardarTransacao(transacao) {
  return new Promise((resolve, reject) => {
    transacao.oncomplete = () => resolve();
    transacao.onerror = () => reject(
      transacao.error || new Error("Não foi possível concluir o armazenamento do áudio."),
    );
    transacao.onabort = () => reject(
      transacao.error || new Error("O navegador cancelou o armazenamento do áudio."),
    );
  });
}

export async function salvarArquivoAudioLocal(id, arquivo) {
  if (!id || !(arquivo instanceof Blob)) {
    throw new Error("Arquivo de áudio inválido.");
  }

  const banco = await abrirBanco();
  const transacao = banco.transaction(NOME_REPOSITORIO, "readwrite");
  const repositorio = transacao.objectStore(NOME_REPOSITORIO);
  const conclusao = aguardarTransacao(transacao);

  const requisicao = aguardarRequisicao(repositorio.put({
    id: String(id),
    arquivo,
    nome: arquivo.name || "audio",
    tipo: arquivo.type || "",
    atualizadoEm: Date.now(),
  }));
  await Promise.all([requisicao, conclusao]);
}

export async function carregarArquivoAudioLocal(id) {
  if (!id) return null;
  const banco = await abrirBanco();
  const transacao = banco.transaction(NOME_REPOSITORIO, "readonly");
  const registro = await aguardarRequisicao(
    transacao.objectStore(NOME_REPOSITORIO).get(String(id)),
  );
  return registro?.arquivo instanceof Blob ? registro : null;
}

export async function removerArquivoAudioLocal(id) {
  if (!id) return;
  const banco = await abrirBanco();
  const transacao = banco.transaction(NOME_REPOSITORIO, "readwrite");
  const conclusao = aguardarTransacao(transacao);
  const requisicao = aguardarRequisicao(
    transacao.objectStore(NOME_REPOSITORIO).delete(String(id)),
  );
  await Promise.all([requisicao, conclusao]);
}

export async function limparArquivosAudioLocais() {
  const banco = await abrirBanco();
  const transacao = banco.transaction(NOME_REPOSITORIO, "readwrite");
  const conclusao = aguardarTransacao(transacao);
  const requisicao = aguardarRequisicao(
    transacao.objectStore(NOME_REPOSITORIO).clear(),
  );
  await Promise.all([requisicao, conclusao]);
}
