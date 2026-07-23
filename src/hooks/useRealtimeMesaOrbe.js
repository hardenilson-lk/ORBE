import { useEffect, useRef, useState } from "react";

import {
  assinarMesaOrbeRealtime,
  carregarEstadoMesaRemoto,
  listarFichasRemotas,
  listarMembrosMesaRemotos,
  orbeOnlineHabilitado,
} from "../services/supabaseOrbe.js";
import { salvarListaFichasArquivos } from "../utils/fichasArquivos.js";
import { aplicarMesaRemota } from "../utils/mesas.js";
import {
  aplicarSessaoArquivosRemota,
  carregarSessaoArquivos,
} from "../utils/sessoesArquivos.js";

function mesclarMembrosNaSessao(mesaId, membros = []) {
  const sessaoAtual = carregarSessaoArquivos(mesaId);
  const jogadoresAtuais = Array.isArray(sessaoAtual.jogadores) ? sessaoAtual.jogadores : [];
  const membrosJogadores = membros.filter((membro) => membro.papel !== "mestre");
  const idsMembros = new Set(membrosJogadores.map((membro) => membro.id));
  const jogadores = [
    ...membrosJogadores.map((membro) => {
      const atual = jogadoresAtuais.find((jogador) => jogador.id === membro.id) || {};
      return {
        ...membro,
        ...atual,
        id: membro.id,
        nome: atual.nome || membro.nome,
        usuario: membro.usuario,
        papel: membro.papel,
        online: atual.online ?? false,
      };
    }),
    ...jogadoresAtuais.filter((jogador) => jogador.id && !idsMembros.has(jogador.id)),
  ];
  return aplicarSessaoArquivosRemota(mesaId, { ...sessaoAtual, jogadores });
}

export default function useRealtimeMesaOrbe({
  mesaId,
  mestre = false,
  aoSessao,
  aoFichas,
  aoMesa,
  aoInicioRolagem,
  aoRolagem,
  aoStatus,
  aoErro,
}) {
  const online = orbeOnlineHabilitado() && Boolean(mesaId) && mesaId !== "local";
  const [pronto, setPronto] = useState(!online);
  const callbacksRef = useRef({
    aoSessao,
    aoFichas,
    aoMesa,
    aoInicioRolagem,
    aoRolagem,
    aoStatus,
    aoErro,
  });
  callbacksRef.current = {
    aoSessao,
    aoFichas,
    aoMesa,
    aoInicioRolagem,
    aoRolagem,
    aoStatus,
    aoErro,
  };

  useEffect(() => {
    if (!online) {
      setPronto(true);
      return undefined;
    }
    setPronto(false);
    let ativo = true;
    let cancelarCanal = () => {};

    const aplicarSessao = (dados) => {
      if (!ativo || !dados) return;
      const sessao = aplicarSessaoArquivosRemota(mesaId, dados);
      callbacksRef.current.aoSessao?.(sessao);
    };

    const aplicarFichas = (lista) => {
      if (!ativo) return;
      const fichas = salvarListaFichasArquivos(mesaId, lista || []);
      callbacksRef.current.aoFichas?.(fichas);
    };

    const aplicarMembros = (membros) => {
      if (!ativo) return;
      const sessao = mesclarMembrosNaSessao(mesaId, membros);
      callbacksRef.current.aoSessao?.(sessao);
    };

    const aplicarRolagem = (rolagem) => {
      if (!ativo || !rolagem?.id) return;
      const sessaoAtual = carregarSessaoArquivos(mesaId);
      const historicoAtual = Array.isArray(sessaoAtual.historicoRolagens)
        ? sessaoAtual.historicoRolagens
        : [];
      if (historicoAtual.some((item) => item?.id === rolagem.id)) return;

      const sessao = aplicarSessaoArquivosRemota(mesaId, {
        ...sessaoAtual,
        historicoRolagens: [rolagem, ...historicoAtual].slice(0, 50),
      });
      callbacksRef.current.aoSessao?.(sessao);
      callbacksRef.current.aoRolagem?.(rolagem);
    };

    async function recarregarFichas() {
      try {
        aplicarFichas(await listarFichasRemotas(mesaId));
      } catch (erro) {
        callbacksRef.current.aoErro?.(erro);
      } finally {
        if (ativo) setPronto(true);
      }
    }

    async function recarregarMembros() {
      try {
        aplicarMembros(await listarMembrosMesaRemotos(mesaId));
      } catch (erro) {
        callbacksRef.current.aoErro?.(erro);
      }
    }

    cancelarCanal = assinarMesaOrbeRealtime(mesaId, {
      aoMesa: (mesa) => {
        if (!ativo || !mesa) return;
        aplicarMesaRemota(mesa);
        callbacksRef.current.aoMesa?.(mesa);
      },
      aoFichasAlteradas: recarregarFichas,
      aoSessao: aplicarSessao,
      aoInicioRolagem: (configuracao) => {
        if (!ativo || !configuracao?.id) return;
        callbacksRef.current.aoInicioRolagem?.(configuracao);
      },
      aoRolagem: aplicarRolagem,
      aoMembrosAlterados: recarregarMembros,
      ...(mestre ? {
        aoSegredos: (segredos) => {
          if (!segredos) return;
          aplicarSessao({
            ...carregarSessaoArquivos(mesaId),
            anotacoesMestre: segredos.anotacoesMestre || "",
          });
        },
      } : {}),
      aoStatus: (status) => {
        if (status === "SUBSCRIBED") callbacksRef.current.aoStatus?.("Tempo real conectado.");
        if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
          callbacksRef.current.aoStatus?.("Tempo real desconectado. Tentando recuperar a conexão.");
        }
      },
      aoErro: (erro) => callbacksRef.current.aoErro?.(erro),
    });

    async function carregarInicial() {
      try {
        const estado = await carregarEstadoMesaRemoto(mesaId, { incluirSegredos: mestre });
        if (!ativo || !estado) return;
        if (estado.mesa) {
          aplicarMesaRemota(estado.mesa);
          callbacksRef.current.aoMesa?.(estado.mesa);
        }
        if (estado.sessao) aplicarSessao(estado.sessao);
        aplicarFichas(estado.fichas);
        aplicarMembros(estado.membros);
        if (mestre && estado.segredos) {
          aplicarSessao({
            ...carregarSessaoArquivos(mesaId),
            anotacoesMestre: estado.segredos.anotacoesMestre || "",
          });
        }
      } catch (erro) {
        callbacksRef.current.aoErro?.(erro);
      }
    }

    void carregarInicial();
    return () => {
      ativo = false;
      cancelarCanal();
    };
  }, [mesaId, mestre, online]);

  return { online, pronto };
}
