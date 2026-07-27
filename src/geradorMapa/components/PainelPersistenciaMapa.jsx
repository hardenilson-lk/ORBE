import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GERADOR_MAPAS_APLICACAO_ATIVA,
  GERADOR_MAPAS_SINCRONIZACAO_ATIVA,
} from "../../config/recursosOrbe.js";
import { orbeOnlineHabilitado } from "../../services/supabaseOrbe.js";
import { adaptarMapaGeradoParaGrid } from "../integracao/adaptarMapaGeradoParaGrid.js";
import {
  aplicarMapaOnline,
  carregarMapaOnline,
  listarRascunhosOnline,
  listarVersoesMapaOnline,
  restaurarVersaoMapaOnline,
  salvarRascunhoOnline,
} from "../online/mapasGeradorOnline.js";
import {
  carregarRascunhoLocal,
  listarRascunhosLocais,
  salvarRascunhoLocal,
} from "../persistencia/rascunhosLocaisGerador.js";
import {
  desserializarMapa,
  medirMapaSerializado,
  serializarMapa,
} from "../persistencia/formatoMapaGerador.js";

function baixarMapa(mapa, nome) {
  const blob = new Blob([serializarMapa(mapa)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${String(nome || "mapa-orbe").replace(/[^\w-]+/g, "-").toLowerCase()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PainelPersistenciaMapa({
  mapa,
  mesaId = "local",
  mapaGridAtual = {},
  aoCarregarMapa,
  aoAplicarGrid,
}) {
  const importacaoRef = useRef(null);
  const [nome, setNome] = useState(() => mapa?.nome || mapa?.seed || "Hospital abandonado");
  const [descricao, setDescricao] = useState("");
  const [registroOnline, setRegistroOnline] = useState(null);
  const [rascunhosLocais, setRascunhosLocais] = useState([]);
  const [rascunhosOnline, setRascunhosOnline] = useState([]);
  const [versoes, setVersoes] = useState([]);
  const [status, setStatus] = useState("Pronto");
  const [mensagem, setMensagem] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const online = GERADOR_MAPAS_SINCRONIZACAO_ATIVA
    && orbeOnlineHabilitado()
    && mesaId !== "local";
  const medicao = useMemo(() => medirMapaSerializado(mapa), [mapa]);

  const atualizarLocais = useCallback(() => {
    setRascunhosLocais(listarRascunhosLocais(mesaId));
  }, [mesaId]);

  const atualizarOnline = useCallback(async () => {
    if (!online) return;
    try {
      setRascunhosOnline(await listarRascunhosOnline(mesaId));
    } catch (erro) {
      setStatus("Offline");
      setMensagem(erro?.message || "Não foi possível listar os mapas online.");
    }
  }, [mesaId, online]);

  useEffect(() => {
    atualizarLocais();
    void atualizarOnline();
  }, [atualizarLocais, atualizarOnline]);

  useEffect(() => {
    if (!registroOnline?.id || !online) {
      setVersoes([]);
      return;
    }
    void listarVersoesMapaOnline(registroOnline.id)
      .then(setVersoes)
      .catch(() => setVersoes([]));
  }, [online, registroOnline?.id, registroOnline?.revisao]);

  function salvarLocal(mensagemSucesso = "Rascunho salvo neste navegador.") {
    const salvo = salvarRascunhoLocal({
      id: registroOnline?.id ? `online-${registroOnline.id}` : undefined,
      mesaId,
      nome,
      descricao,
      mapa,
    });
    atualizarLocais();
    setStatus("Sincronizado localmente");
    setMensagem(mensagemSucesso);
    return salvo;
  }

  async function salvarOnline() {
    if (!online || ocupado) {
      salvarLocal("Modo offline: o rascunho ficou salvo neste navegador.");
      return null;
    }
    setOcupado(true);
    setStatus("Salvando");
    setMensagem("");
    try {
      const salvo = await salvarRascunhoOnline({
        id: registroOnline?.id || null,
        mesaId,
        nome,
        descricao,
        mapa,
        revisaoEsperada: registroOnline?.revisao ?? null,
      });
      setRegistroOnline(salvo);
      salvarLocal("Rascunho salvo localmente e confirmado online.");
      await atualizarOnline();
      setStatus("Sincronizado");
      return salvo;
    } catch (erro) {
      salvarLocal("A conexão falhou. Uma cópia local foi preservada para nova tentativa.");
      setStatus(erro?.tipo === "conflito" ? "Conflito" : "Erro ao salvar");
      setMensagem(erro?.message || "Não foi possível salvar o rascunho online.");
      return null;
    } finally {
      setOcupado(false);
    }
  }

  async function aplicarAoGrid() {
    if (!GERADOR_MAPAS_APLICACAO_ATIVA || ocupado) return;
    if (!mapa?.validacaoEstrutural?.valido) {
      setStatus("Erro de validação");
      setMensagem("Valide o mapa antes de aplicá-lo.");
      return;
    }
    setOcupado(true);
    setStatus("Salvando");
    try {
      if (!online) {
        salvarLocal();
        const grid = adaptarMapaGeradoParaGrid(mapa, mapaGridAtual);
        aoAplicarGrid?.(grid);
        setStatus("Aplicado localmente");
        setMensagem("Mapa aplicado ao grid local. A sincronização online está desativada.");
        return;
      }
      let registro = registroOnline;
      if (!registro) {
        registro = await salvarRascunhoOnline({
          mesaId,
          nome,
          descricao,
          mapa,
        });
      }
      const resultado = await aplicarMapaOnline({
        mapaId: registro.id,
        mesaId,
        mapa,
        mapaGridAtual,
        revisaoEsperada: registro.revisao,
      });
      setRegistroOnline(resultado.mapaOnline);
      aoAplicarGrid?.(resultado.gridMestre);
      salvarLocal("A versão aplicada também foi preservada localmente.");
      setStatus("Sincronizado");
      setMensagem(`Mapa aplicado online na revisão ${resultado.mapaOnline.revisao}.`);
      await atualizarOnline();
    } catch (erro) {
      salvarLocal("A aplicação falhou antes da confirmação online. O rascunho local foi mantido.");
      setStatus(erro?.tipo === "conflito" ? "Conflito" : "Erro ao salvar");
      setMensagem(erro?.message || "Não foi possível aplicar o mapa.");
    } finally {
      setOcupado(false);
    }
  }

  async function carregarOnline(id) {
    if (ocupado) return;
    setOcupado(true);
    setStatus("Carregando");
    try {
      const registro = await carregarMapaOnline(id);
      setRegistroOnline(registro);
      setNome(registro.nome);
      setDescricao(registro.descricao);
      aoCarregarMapa?.(registro.mapa);
      setStatus("Sincronizado");
      setMensagem(`Mapa “${registro.nome}” carregado.`);
    } catch (erro) {
      setStatus("Erro ao carregar");
      setMensagem(erro?.message || "Não foi possível carregar o mapa online.");
    } finally {
      setOcupado(false);
    }
  }

  async function restaurar(versaoId) {
    if (!registroOnline || ocupado) return;
    setOcupado(true);
    setStatus("Salvando");
    try {
      const restaurado = await restaurarVersaoMapaOnline({
        versaoId,
        mesaId,
        revisaoEsperada: registroOnline.revisao,
      });
      setRegistroOnline(restaurado);
      aoCarregarMapa?.(restaurado.mapa);
      aoAplicarGrid?.(adaptarMapaGeradoParaGrid(restaurado.mapa, mapaGridAtual));
      setStatus("Sincronizado");
      setMensagem(`Versão restaurada na revisão ${restaurado.revisao}.`);
    } catch (erro) {
      setStatus(erro?.tipo === "conflito" ? "Conflito" : "Erro ao salvar");
      setMensagem(erro?.message || "Não foi possível restaurar a versão.");
    } finally {
      setOcupado(false);
    }
  }

  async function importar(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    try {
      const importado = desserializarMapa(await arquivo.text());
      aoCarregarMapa?.(importado);
      setRegistroOnline(null);
      setNome(importado.seed || arquivo.name.replace(/\.json$/i, ""));
      setStatus("Pronto");
      setMensagem("Mapa importado e validado. Salve antes de aplicar.");
    } catch (erro) {
      setStatus("Erro de importação");
      setMensagem(erro?.message || "O arquivo não pôde ser importado.");
    }
  }

  return (
    <section className="gerador-persistencia" aria-labelledby="titulo-persistencia-mapa">
      <header>
        <div>
          <span>Persistência e aplicação</span>
          <h3 id="titulo-persistencia-mapa">Mapa da mesa</h3>
        </div>
        <output data-status={status.toLowerCase().replaceAll(" ", "-")}>{status}</output>
      </header>

      <div className="gerador-persistencia__campos">
        <label>Nome<input value={nome} maxLength={120} onChange={(evento) => setNome(evento.target.value)} /></label>
        <label>Descrição<input value={descricao} maxLength={500} onChange={(evento) => setDescricao(evento.target.value)} /></label>
      </div>
      <p className="gerador-persistencia__medicao">
        {(medicao.bytes / 1024).toFixed(1)} KB · {medicao.hash}
      </p>
      <div className="gerador-persistencia__acoes">
        <button type="button" disabled={ocupado} onClick={() => salvarLocal()}>Salvar local</button>
        <button type="button" disabled={ocupado || !online} onClick={salvarOnline}>Salvar online</button>
        <button type="button" onClick={() => baixarMapa(mapa, nome)}>Exportar JSON</button>
        <button type="button" onClick={() => importacaoRef.current?.click()}>Importar JSON</button>
        <input ref={importacaoRef} hidden type="file" accept="application/json,.json" onChange={importar} />
        <button
          className="gerador-persistencia__aplicar"
          type="button"
          disabled={ocupado || !GERADOR_MAPAS_APLICACAO_ATIVA}
          onClick={aplicarAoGrid}
        >
          Aplicar ao grid
        </button>
      </div>
      {mensagem ? <p className="gerador-persistencia__mensagem" aria-live="polite">{mensagem}</p> : null}

      <details>
        <summary>Rascunhos locais ({rascunhosLocais.length})</summary>
        <div className="gerador-persistencia__lista">
          {rascunhosLocais.length ? rascunhosLocais.map((item) => (
            <button key={item.id} type="button" onClick={() => {
              const carregado = carregarRascunhoLocal(item.id);
              if (carregado) {
                setNome(carregado.nome);
                setDescricao(carregado.descricao);
                setRegistroOnline(null);
                aoCarregarMapa?.(carregado.mapa);
              }
            }}>
              <strong>{item.nome}</strong><span>{new Date(item.atualizadoEm).toLocaleString("pt-BR")}</span>
            </button>
          )) : <p>Nenhum rascunho local.</p>}
        </div>
      </details>

      {online ? (
        <details>
          <summary>Mapas online ({rascunhosOnline.length})</summary>
          <div className="gerador-persistencia__lista">
            {rascunhosOnline.length ? rascunhosOnline.map((item) => (
              <button key={item.id} type="button" disabled={ocupado} onClick={() => carregarOnline(item.id)}>
                <strong>{item.nome}</strong><span>{item.status} · revisão {item.revisao}</span>
              </button>
            )) : <p>Nenhum mapa online. Aplique o SQL da etapa 20 antes do primeiro uso.</p>}
          </div>
        </details>
      ) : null}

      {versoes.length ? (
        <details>
          <summary>Histórico aplicado ({versoes.length})</summary>
          <div className="gerador-persistencia__lista">
            {versoes.map((versao) => (
              <button key={versao.id} type="button" disabled={ocupado} onClick={() => restaurar(versao.id)}>
                <strong>Versão {versao.numero_versao}</strong>
                <span>{new Date(versao.created_at).toLocaleString("pt-BR")} · {(Number(versao.tamanho_bytes || 0) / 1024).toFixed(1)} KB</span>
              </button>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}
