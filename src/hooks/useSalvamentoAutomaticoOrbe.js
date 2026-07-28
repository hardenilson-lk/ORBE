import { useCallback, useEffect, useRef, useState } from "react";

import {
  lerRascunhoOrbe,
  removerRascunhoOrbe,
  salvarRascunhoOrbe,
} from "../utils/rascunhosOrbe.js";

const ATRASO_PADRAO = 800;

function serializar(valor) {
  try {
    return JSON.stringify(valor);
  } catch {
    return "";
  }
}

export default function useSalvamentoAutomaticoOrbe({
  valor,
  chave,
  aoSalvar,
  atraso = ATRASO_PADRAO,
  habilitado = true,
}) {
  const serializado = serializar(valor);
  const valorRef = useRef(valor);
  const estadoRef = useRef({ chave, inicializado: false, confirmado: serializado });
  const pendenteRef = useRef(null);
  const timerRef = useRef(null);
  const salvandoRef = useRef(false);
  const versaoRef = useRef(0);
  const montadoRef = useRef(true);
  const [estado, setEstado] = useState("salvo");
  const [rascunhoDisponivel, setRascunhoDisponivel] = useState(null);
  const [conflito, setConflito] = useState(null);

  valorRef.current = valor;

  const limparTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const salvarPendente = useCallback(async () => {
    limparTimer();
    const pendente = pendenteRef.current;
    if (!pendente || !habilitado) return false;
    if (!window.navigator.onLine) {
      setEstado("sem-conexao");
      return false;
    }
    if (salvandoRef.current) return false;

    salvandoRef.current = true;
    const versaoDaRequisicao = pendente.versao;
    setEstado("salvando");
    try {
      await aoSalvar(pendente.valor);
      if (pendenteRef.current?.versao === versaoDaRequisicao) {
        estadoRef.current.confirmado = pendente.serializado;
        pendenteRef.current = null;
        removerRascunhoOrbe(chave);
        setEstado("salvo");
      } else if (montadoRef.current) {
        setEstado("pendente");
      }
      return true;
    } catch (erro) {
      if (montadoRef.current) setEstado(window.navigator.onLine ? "erro" : "sem-conexao");
      throw erro;
    } finally {
      salvandoRef.current = false;
      if (pendenteRef.current && montadoRef.current) {
        timerRef.current = window.setTimeout(() => {
          void salvarPendente().catch(() => {});
        }, 0);
      }
    }
  }, [aoSalvar, chave, habilitado, limparTimer]);

  const recuperarRascunho = useCallback(() => {
    if (!rascunhoDisponivel) return false;
    const recuperado = rascunhoDisponivel.valor;
    setRascunhoDisponivel(null);
    pendenteRef.current = {
      valor: recuperado,
      serializado: serializar(recuperado),
      versao: ++versaoRef.current,
    };
    salvarRascunhoOrbe(chave, recuperado);
    setEstado("pendente");
    timerRef.current = window.setTimeout(() => {
      void salvarPendente().catch(() => {});
    }, atraso);
    return true;
  }, [atraso, chave, rascunhoDisponivel, salvarPendente]);

  const descartarPendente = useCallback(() => {
    limparTimer();
    pendenteRef.current = null;
    removerRascunhoOrbe(chave);
    setEstado("salvo");
  }, [chave, limparTimer]);

  const salvarValor = useCallback((valorRecebido) => {
    const serializadoRecebido = serializar(valorRecebido);
    if (serializadoRecebido === estadoRef.current.confirmado) return false;
    pendenteRef.current = {
      valor: valorRecebido,
      serializado: serializadoRecebido,
      versao: ++versaoRef.current,
    };
    salvarRascunhoOrbe(chave, valorRecebido);
    setEstado(window.navigator.onLine ? "pendente" : "sem-conexao");
    return salvarPendente();
  }, [chave, salvarPendente]);

  const sinalizarConflito = useCallback((dados) => {
    if (!dados || serializar(dados.local) === serializar(dados.remoto)) return false;
    setConflito(dados);
    setEstado("conflito");
    return true;
  }, []);

  const resolverConflitoServidor = useCallback((valorRemoto) => {
    limparTimer();
    pendenteRef.current = null;
    removerRascunhoOrbe(chave);
    estadoRef.current.confirmado = serializar(valorRemoto);
    setConflito(null);
    setEstado("salvo");
  }, [chave, limparTimer]);

  const resolverConflitoLocal = useCallback(() => {
    const local = conflito?.local;
    setConflito(null);
    if (local !== undefined) void salvarValor(local);
  }, [conflito, salvarValor]);

  useEffect(() => {
    estadoRef.current = { chave, inicializado: false, confirmado: serializar(valorRef.current) };
    pendenteRef.current = null;
    limparTimer();
    setEstado("salvo");
    const rascunho = lerRascunhoOrbe(chave);
    setRascunhoDisponivel(rascunho);
  }, [chave, limparTimer]);

  useEffect(() => {
    if (!habilitado) return undefined;
    if (estadoRef.current.chave !== chave) return undefined;
    if (!estadoRef.current.inicializado) {
      estadoRef.current.inicializado = true;
      estadoRef.current.confirmado = serializado;
      return undefined;
    }
    if (serializado === estadoRef.current.confirmado) return undefined;

    pendenteRef.current = {
      valor,
      serializado,
      versao: ++versaoRef.current,
    };
    salvarRascunhoOrbe(chave, valor);
    setEstado(window.navigator.onLine ? "pendente" : "sem-conexao");
    limparTimer();
    timerRef.current = window.setTimeout(() => {
      void salvarPendente().catch(() => {});
    }, atraso);
    return undefined;
  }, [atraso, chave, habilitado, limparTimer, salvarPendente, serializado, valor]);

  useEffect(() => {
    montadoRef.current = true;
    const atualizarConexao = () => {
      if (!window.navigator.onLine) {
        if (pendenteRef.current) setEstado("sem-conexao");
        return;
      }
      if (pendenteRef.current) {
        setEstado("pendente");
        timerRef.current = window.setTimeout(() => {
          void salvarPendente().catch(() => {});
        }, 0);
      }
    };
    const protegerSaida = (evento) => {
      if (!pendenteRef.current) return;
      salvarRascunhoOrbe(chave, pendenteRef.current.valor);
      evento.preventDefault();
      evento.returnValue = "";
    };
    window.addEventListener("online", atualizarConexao);
    window.addEventListener("offline", atualizarConexao);
    window.addEventListener("beforeunload", protegerSaida);
    return () => {
      montadoRef.current = false;
      limparTimer();
      window.removeEventListener("online", atualizarConexao);
      window.removeEventListener("offline", atualizarConexao);
      window.removeEventListener("beforeunload", protegerSaida);
    };
  }, [chave, limparTimer, salvarPendente]);

  return {
    estado,
    pendente: Boolean(pendenteRef.current),
    rascunhoDisponivel,
    recuperarRascunho,
    descartarPendente,
    salvarValor,
    conflito,
    sinalizarConflito,
    resolverConflitoServidor,
    resolverConflitoLocal,
    salvarAgora: salvarPendente,
  };
}
