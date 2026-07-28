export const ORBE_BACKUP_FORMAT = "ORBE_CAMPAIGN_BACKUP";
export const ORBE_BACKUP_VERSION = 1;

export const BACKUP_MODULOS_INCLUIDOS = ["campanha", "arquivos", "historicoArquivos"];
export const BACKUP_MODULOS_EXCLUIDOS = [
  "autenticacao", "participantes", "convites", "fichas", "mapas", "tokens",
  "inventario", "rituais", "audios", "imagens", "missoes", "anotacoes", "geradorMapas",
];

function clonar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function metadadosSeguros(mesa = {}) {
  return {
    nomeCampanha: mesa.nomeCampanha || mesa.nome || "Campanha importada",
    descricao: mesa.descricao || "",
    sistema: mesa.sistema || "arquivos",
    arquivoInicial: mesa.arquivoInicial || "ARQUIVO 0001",
    criadaEm: mesa.criadaEm || mesa.created_at || null,
    origemId: mesa.id ? String(mesa.id) : null,
  };
}

export function criarBackupCampanha({ mesa, arquivos = [], historicos = {} }) {
  const historicoSeguro = Object.fromEntries(
    Object.entries(historicos).map(([arquivoId, versoes]) => [
      String(arquivoId),
      (versoes || []).map((versao) => ({
        numeroVersao: Number(versao.numeroVersao || 0),
        dados: clonar(versao.dados || {}),
        origemVersao: versao.origemVersao || null,
        criadoEm: versao.criadoEm || null,
        autorNome: versao.autor?.nome || versao.autorNome || "Autor anterior",
      })),
    ]),
  );

  return {
    manifesto: {
      formato: ORBE_BACKUP_FORMAT,
      versao: ORBE_BACKUP_VERSION,
      exportadoEm: new Date().toISOString(),
      versaoOrbe: "0.0.0",
      modulosIncluidos: BACKUP_MODULOS_INCLUIDOS,
      modulosExcluidos: BACKUP_MODULOS_EXCLUIDOS,
      quantidadeArquivos: arquivos.length,
      quantidadeVersoes: Object.values(historicoSeguro).reduce((total, lista) => total + lista.length, 0),
    },
    campanha: metadadosSeguros(mesa),
    arquivos: clonar(arquivos),
    historicoArquivos: historicoSeguro,
  };
}

export function validarBackupCampanha(backup) {
  const manifesto = backup?.manifesto;
  if (!manifesto || manifesto.formato !== ORBE_BACKUP_FORMAT) {
    throw new Error("Formato de backup ORBE invalido.");
  }
  if (Number(manifesto.versao) !== ORBE_BACKUP_VERSION) {
    throw new Error(`Versao de backup incompatível: ${manifesto.versao}.`);
  }
  if (!backup.campanha || !Array.isArray(backup.arquivos) || typeof backup.historicoArquivos !== "object") {
    throw new Error("Estrutura obrigatoria do backup nao encontrada.");
  }
  for (const arquivo of backup.arquivos) {
    if (!arquivo?.id || typeof arquivo !== "object") throw new Error("Arquivo invalido no backup.");
  }
  return true;
}

export function lerBackupCampanha(texto) {
  let backup;
  try {
    backup = JSON.parse(texto);
  } catch {
    throw new Error("O arquivo selecionado nao contem JSON valido.");
  }
  validarBackupCampanha(backup);
  return backup;
}

export function nomeArquivoBackup(nomeCampanha = "campanha") {
  const slug = String(nomeCampanha).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "campanha";
  return `orbe-backup-${slug}-${new Date().toISOString().slice(0, 10)}.orbe.json`;
}

export function prepararArquivosImportados(backup, { preservarIds = false } = {}) {
  const mapaIds = new Map();
  const arquivos = backup.arquivos.map((arquivo) => {
    const id = preservarIds ? String(arquivo.id) : `arquivo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    mapaIds.set(String(arquivo.id), id);
    return { ...clonar(arquivo), id };
  });
  const historico = {};
  for (const [arquivoId, versoes] of Object.entries(backup.historicoArquivos || {})) {
    const novoId = mapaIds.get(String(arquivoId));
    if (!novoId) continue;
    historico[novoId] = (versoes || []).map((versao) => ({
      ...clonar(versao),
      origemVersao: versao.origemVersao || null,
    }));
  }
  return { arquivos, historico, mapaIds };
}
