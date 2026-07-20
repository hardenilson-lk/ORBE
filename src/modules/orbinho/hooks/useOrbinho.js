import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";

import { identificarRotaOrbinho } from "../data/configuracaoOrbinho.js";
import { tutoriaisOrbinho } from "../data/tutoriaisOrbinho.js";
import {
  lerEstadoOrbinho,
  lerTutoriaisOrbinho,
  salvarEstadoOrbinho,
  salvarTutoriaisOrbinho,
} from "../utils/armazenamentoOrbinho.js";

export default function useOrbinho() {
  const { pathname } = useLocation();
  const tipoRota = identificarRotaOrbinho(pathname);
  const [estado, setEstado] = useState(lerEstadoOrbinho);
  const [progresso, setProgresso] = useState(lerTutoriaisOrbinho);
  const [tutorialAtivo, setTutorialAtivo] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [ajudaAtiva, setAjudaAtiva] = useState(null);

  useEffect(() => salvarEstadoOrbinho(estado), [estado]);
  useEffect(() => salvarTutoriaisOrbinho(progresso), [progresso]);

  useEffect(() => {
    setTutorialAtivo(null);
    setAjudaAtiva(null);
  }, [pathname]);

  const tutorial = tutorialAtivo ? tutoriaisOrbinho[tutorialAtivo] : null;
  const etapa = tutorial?.etapas[etapaAtual] || null;

  const abrir = useCallback(() => {
    setEstado((anterior) => ({ ...anterior, aberto: true, jaInteragiu: true }));
  }, []);

  const fechar = useCallback(() => {
    setTutorialAtivo(null);
    setAjudaAtiva(null);
    setEstado((anterior) => ({ ...anterior, aberto: false, jaInteragiu: true }));
  }, []);

  const iniciarTutorial = useCallback((tutorialId = "menuMestre", reiniciar = false) => {
    const tutorialEscolhido = tutoriaisOrbinho[tutorialId];
    if (!tutorialEscolhido) return;

    const ultimaEtapa = reiniciar ? 0 : progresso[tutorialId]?.ultimaEtapa || 0;
    setAjudaAtiva(null);
    setEtapaAtual(Math.min(ultimaEtapa, tutorialEscolhido.etapas.length - 1));
    setTutorialAtivo(tutorialId);
    setEstado((anterior) => ({ ...anterior, aberto: true, jaInteragiu: true }));
  }, [progresso]);

  const registrarEtapa = useCallback((tutorialId, indice, alteracoes = {}) => {
    setProgresso((anterior) => ({
      ...anterior,
      [tutorialId]: {
        ...anterior[tutorialId],
        ultimaEtapa: indice,
        ...alteracoes,
      },
    }));
  }, []);

  const avancar = useCallback(() => {
    if (!tutorial) return;
    if (etapaAtual < tutorial.etapas.length - 1) {
      const proxima = etapaAtual + 1;
      setEtapaAtual(proxima);
      registrarEtapa(tutorialAtivo, proxima);
      return;
    }

    registrarEtapa(tutorialAtivo, 0, { concluido: true, pulado: false });
    setTutorialAtivo(null);
  }, [etapaAtual, registrarEtapa, tutorial, tutorialAtivo]);

  const voltar = useCallback(() => {
    const anterior = Math.max(0, etapaAtual - 1);
    setEtapaAtual(anterior);
    registrarEtapa(tutorialAtivo, anterior);
  }, [etapaAtual, registrarEtapa, tutorialAtivo]);

  const pular = useCallback(() => {
    registrarEtapa(tutorialAtivo, etapaAtual, { pulado: true });
    setTutorialAtivo(null);
  }, [etapaAtual, registrarEtapa, tutorialAtivo]);

  const api = useMemo(() => ({
    tipoRota,
    visivel: Boolean(tipoRota),
    aberto: estado.aberto,
    temMensagem: !estado.jaInteragiu,
    ajudaAtiva,
    tutorial,
    etapa,
    etapaAtual,
    progresso,
    abrir,
    fechar,
    setAjudaAtiva,
    iniciarTutorial,
    avancar,
    voltar,
    pular,
  }), [
    tipoRota, estado, ajudaAtiva, tutorial, etapa, etapaAtual, progresso,
    abrir, fechar, iniciarTutorial, avancar, voltar, pular,
  ]);

  return api;
}
