import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ESTADOS_SOM, ORIGENS_SOM } from "../constants/mesaSonoraConstants.js";
import { revogarUrlObjeto } from "../utils/audioUtils.js";
import { criarIdMesa } from "../utils/mesaSonoraUtils.js";
import useAtalhosMesaSonora from "./useAtalhosMesaSonora.js";
import usePersistenciaMesaSonora from "./usePersistenciaMesaSonora.js";

export default function useMesaSonora() {
  const { mesa, setMesa, limparPersistencia } = usePersistenciaMesaSonora();
  const players = useRef(new Map());
  const sonsRef = useRef(mesa.sons);
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroOrigem, setFiltroOrigem] = useState("todas");
  const [spotifyAtivoId, setSpotifyAtivoId] = useState("");
  const [filaExecucao, setFilaExecucao] = useState([]);

  useEffect(() => { sonsRef.current = mesa.sons; }, [mesa.sons]);

  const atualizarSom = useCallback((id, alteracoes) => {
    setMesa((anterior) => ({ ...anterior, sons: anterior.sons.map((som) => som.id === id ? { ...som, ...alteracoes } : som) }));
  }, [setMesa]);

  const registrarPlayer = useCallback((id, api) => {
    if (api) players.current.set(id, api);
    else players.current.delete(id);
  }, []);

  const pararSom = useCallback((id) => {
    players.current.get(id)?.parar?.();
    if (id === spotifyAtivoId) setSpotifyAtivoId("");
    atualizarSom(id, { estado: ESTADOS_SOM.NORMAL });
  }, [atualizarSom, spotifyAtivoId]);

  const pararTodos = useCallback(() => {
    players.current.forEach((player) => player.parar?.());
    setSpotifyAtivoId("");
    setMesa((anterior) => ({ ...anterior, sons: anterior.sons.map((som) => ({ ...som, estado: ESTADOS_SOM.NORMAL })) }));
  }, [setMesa]);

  const tocarSom = useCallback((id) => {
    const som = sonsRef.current.find((item) => item.id === id);
    if (!som) return;
    setFilaExecucao((fila) => fila.includes(id) ? fila : [...fila, id]);
    if (som.origem === ORIGENS_SOM.LOCAL && !som.urlObjeto) {
      atualizarSom(id, { estado: ESTADOS_SOM.ERRO, erro: "ARQUIVO PRECISA SER SELECIONADO NOVAMENTE" });
      return;
    }
    if (som.origem !== ORIGENS_SOM.LOCAL) {
      atualizarSom(id, {
        estado: ESTADOS_SOM.ERRO,
        erro: "Esta fonte externa não é capturada pelo LiveKit. Use compartilhamento de aba ou um player oficial sincronizado.",
      });
      return;
    }
    if (som.pararOutros || !som.tocarJunto) pararTodos();
    const player = players.current.get(id);
    if (!player) {
      atualizarSom(id, { estado: ESTADOS_SOM.CARREGANDO, erro: "" });
      return;
    }
    player.tocar?.();
  }, [atualizarSom, pararTodos]);

  const pausarSom = useCallback((id) => players.current.get(id)?.pausar?.(), []);
  const reiniciarSom = useCallback((id) => players.current.get(id)?.reiniciar?.(), []);
  const pausarTodos = useCallback(() => players.current.forEach((player) => player.pausar?.()), []);
  const retomarTodos = useCallback(() => {
    sonsRef.current.filter((som) => som.estado === ESTADOS_SOM.PAUSADO).forEach((som) => players.current.get(som.id)?.tocar?.());
  }, []);

  const limparFinalizados = useCallback(() => {
    setFilaExecucao((fila) => fila.filter((id) => {
      const som = sonsRef.current.find((item) => item.id === id);
      return som && [ESTADOS_SOM.TOCANDO, ESTADOS_SOM.PAUSADO, ESTADOS_SOM.CARREGANDO].includes(som.estado);
    }));
  }, []);

  useAtalhosMesaSonora(mesa.sons, tocarSom);

  function salvarSom(dados, arquivo, idEdicao = "") {
    const categoria = dados.categoria === "Personalizada" ? dados.categoriaPersonalizada.trim() : dados.categoria;
    const urlObjeto = arquivo ? URL.createObjectURL(arquivo) : "";
    setMesa((anterior) => {
      const existente = anterior.sons.find((som) => som.id === idEdicao);
      if (existente?.urlObjeto && (urlObjeto || dados.origem !== ORIGENS_SOM.LOCAL)) revogarUrlObjeto(existente.urlObjeto);
      const urlObjetoFinal = dados.origem === ORIGENS_SOM.LOCAL ? urlObjeto || existente?.urlObjeto || "" : "";
      const som = {
        ...(existente || {}), ...dados, categoria, id: idEdicao || criarIdMesa("som"),
        atalho: dados.origem === ORIGENS_SOM.LOCAL ? dados.atalho : "",
        url: dados.origem === ORIGENS_SOM.LOCAL ? "" : dados.url,
        urlObjeto: urlObjetoFinal,
        nomeArquivo: dados.origem === ORIGENS_SOM.LOCAL ? arquivo?.name || existente?.nomeArquivo || "" : "",
        precisaArquivo: dados.origem === ORIGENS_SOM.LOCAL && !urlObjetoFinal, estado: ESTADOS_SOM.NORMAL, erro: "",
      };
      const categorias = anterior.categorias.includes(categoria) ? anterior.categorias : [...anterior.categorias, categoria];
      return { ...anterior, categorias, sons: idEdicao ? anterior.sons.map((item) => item.id === idEdicao ? som : item) : [som, ...anterior.sons] };
    });
  }

  function removerSom(id) {
    const som = mesa.sons.find((item) => item.id === id);
    players.current.get(id)?.destruir?.();
    revogarUrlObjeto(som?.urlObjeto);
    setMesa((anterior) => ({
      ...anterior,
      sons: anterior.sons.filter((item) => item.id !== id),
      cenas: anterior.cenas.map((cena) => ({ ...cena, sonsIds: cena.sonsIds.filter((somId) => somId !== id) })),
    }));
  }

  function salvarCena(dados, idEdicao = "") {
    const cena = { ...dados, id: idEdicao || criarIdMesa("cena") };
    setMesa((anterior) => ({ ...anterior, cenas: idEdicao ? anterior.cenas.map((item) => item.id === idEdicao ? cena : item) : [cena, ...anterior.cenas] }));
  }

  function removerCena(id) {
    setMesa((anterior) => ({ ...anterior, cenas: anterior.cenas.filter((cena) => cena.id !== id) }));
  }

  function ativarCena(cena) { cena.sonsIds.forEach(tocarSom); }
  function pararCena(cena) { cena.sonsIds.forEach(pararSom); }

  function limparTeste() {
    players.current.forEach((player) => player.destruir?.());
    mesa.sons.forEach((som) => revogarUrlObjeto(som.urlObjeto));
    setSpotifyAtivoId("");
    setFilaExecucao([]);
    limparPersistencia();
  }

  const sonsFiltrados = useMemo(() => mesa.sons.filter((som) => {
    const texto = `${som.nome} ${som.categoria}`.toLowerCase();
    return texto.includes(busca.toLowerCase()) && (filtroCategoria === "todas" || som.categoria === filtroCategoria) && (filtroOrigem === "todas" || som.origem === filtroOrigem);
  }), [mesa.sons, busca, filtroCategoria, filtroOrigem]);

  const ativos = mesa.sons.filter((som) => [ESTADOS_SOM.TOCANDO, ESTADOS_SOM.PAUSADO].includes(som.estado));

  return {
    mesa, setMesa, sonsFiltrados, ativos, filaExecucao, busca, setBusca, filtroCategoria, setFiltroCategoria, filtroOrigem, setFiltroOrigem,
    spotifyAtivoId, registrarPlayer, atualizarSom, salvarSom, removerSom, tocarSom, pausarSom, pararSom, reiniciarSom,
    pararTodos, pausarTodos, retomarTodos, limparFinalizados, salvarCena, removerCena, ativarCena, pararCena, limparTeste,
  };
}
