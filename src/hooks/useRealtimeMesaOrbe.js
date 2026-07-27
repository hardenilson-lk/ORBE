import { useEffect, useRef, useState } from "react";

import {
  assinarPresencaMesaOrbe,
  assinarMesaOrbeRealtime,
  carregarEstadoMesaRemoto,
  listarFichasRemotas,
  listarMembrosMesaRemotos,
  orbeOnlineHabilitado,
} from "../services/supabaseOrbe.js";
import { GERADOR_MAPAS_SINCRONIZACAO_ATIVA } from "../config/recursosOrbe.js";
import {
  assinarMapaAplicadoRealtime,
  carregarMapaAplicadoDaMesa,
} from "../geradorMapa/online/mapasGeradorOnline.js";
import { salvarListaFichasArquivos } from "../utils/fichasArquivos.js";
import { aplicarMesaRemota } from "../utils/mesas.js";
import {
  aplicarSessaoArquivosRemota,
  carregarSessaoArquivos,
} from "../utils/sessoesArquivos.js";

function mesclarMembrosNaSessao(
  mesaId,
  membros = [],
  presencas = [],
  sessaoBase,
) {
  const sessaoAtual = sessaoBase || carregarSessaoArquivos(mesaId);
  const jogadoresAtuais = Array.isArray(sessaoAtual.jogadores) ? sessaoAtual.jogadores : [];
  const membrosJogadores = membros.filter((membro) => membro.papel !== "mestre");
  const idsOnline = new Set(
    presencas.map((presenca) => String(presenca.user_id || "")),
  );
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
        online: idsOnline.has(String(membro.id)),
      };
    }),
  ];
  return aplicarSessaoArquivosRemota(mesaId, { ...sessaoAtual, jogadores });
}

function mesclarEstadoDinamicoDoMapa(gridAplicado, mapaAtual = {}) {
  const porOrigem = (lista = []) =>
    new Map(
      lista.map((item) => [
        String(item?.origemGeradorId || item?.id || ""),
        item,
      ]),
    );
  const portasAtuais = porOrigem(mapaAtual.portas);
  const luzesAtuais = porOrigem(mapaAtual.luzes);

  return {
    ...gridAplicado,
    camera: mapaAtual.camera || gridAplicado.camera,
    tokens: Array.isArray(mapaAtual.tokens) ? mapaAtual.tokens : (gridAplicado.tokens || []),
    npcs: Array.isArray(mapaAtual.npcs) ? mapaAtual.npcs : (gridAplicado.npcs || []),
    portas: (gridAplicado.portas || []).map((porta) => {
      const atual = portasAtuais.get(String(porta?.origemGeradorId || porta?.id || ""));
      if (!atual) return porta;
      return {
        ...porta,
        aberta: atual.aberta,
        trancada: atual.trancada,
        bloqueiaMovimento: atual.bloqueiaMovimento,
        bloqueiaVisao: atual.bloqueiaVisao,
      };
    }),
    luzes: (gridAplicado.luzes || []).map((luz) => {
      const atual = luzesAtuais.get(String(luz?.origemGeradorId || luz?.id || ""));
      if (!atual) return luz;
      return {
        ...luz,
        ativa: atual.ativa,
        intensidade: atual.intensidade,
      };
    }),
  };
}

export default function useRealtimeMesaOrbe({
  mesaId,
  mestre = false,
  aoSessao,
  aoFichas,
  aoMesa,
  aoInicioRolagem,
  aoRolagem,
  aoTokens,
  aoSolicitacoesFichasAlteradas,
  aoStatus,
  aoErro,
  usuarioId,
  nomePresenca,
  fichaId,
}) {
  const online = orbeOnlineHabilitado() && Boolean(mesaId) && mesaId !== "local";
  const [pronto, setPronto] = useState(!online);
  const [presencas, setPresencas] = useState([]);
  const membrosRef = useRef([]);
  const presencasRef = useRef([]);
  const controlePresencaRef = useRef(null);
  const revisaoMapaAplicadoRef = useRef(0);
  const dadosPresencaRef = useRef({
    nome: nomePresenca,
    fichaId,
    papel: mestre ? "mestre" : "jogador",
  });
  dadosPresencaRef.current = {
    nome: nomePresenca,
    fichaId,
    papel: mestre ? "mestre" : "jogador",
  };
  const callbacksRef = useRef({
    aoSessao,
    aoFichas,
    aoMesa,
    aoInicioRolagem,
    aoRolagem,
    aoTokens,
    aoSolicitacoesFichasAlteradas,
    aoStatus,
    aoErro,
  });
  callbacksRef.current = {
    aoSessao,
    aoFichas,
    aoMesa,
    aoInicioRolagem,
    aoRolagem,
    aoTokens,
    aoSolicitacoesFichasAlteradas,
    aoStatus,
    aoErro,
  };

  useEffect(() => {
    if (!online) {
      setPronto(true);
      return undefined;
    }
    setPronto(false);
    membrosRef.current = [];
    let ativo = true;
    let cancelarCanal = () => {};
    let cancelarCanalMapa = () => {};
    revisaoMapaAplicadoRef.current = 0;

    const aplicarSessao = (dados) => {
      if (!ativo || !dados) return;
      const sessaoRemota = aplicarSessaoArquivosRemota(mesaId, dados);
      const sessao = mesclarMembrosNaSessao(
        mesaId,
        membrosRef.current,
        presencasRef.current,
        sessaoRemota,
      );
      callbacksRef.current.aoSessao?.(sessao);
    };

    const aplicarFichas = (lista) => {
      if (!ativo) return;
      const fichas = salvarListaFichasArquivos(mesaId, lista || []);
      callbacksRef.current.aoFichas?.(fichas);
    };

    const aplicarMapaSeguro = (registro) => {
      if (!ativo || mestre || !registro?.grid) return;
      const revisao = Number(registro.revisao || 0);
      if (revisao <= revisaoMapaAplicadoRef.current) return;
      if (String(registro.mesaId || mesaId) !== String(mesaId)) return;
      revisaoMapaAplicadoRef.current = revisao;
      const sessaoAtual = carregarSessaoArquivos(mesaId);
      aplicarSessao({
        ...sessaoAtual,
        mapa: mesclarEstadoDinamicoDoMapa(registro.grid, sessaoAtual.mapa),
        mapaAplicado: {
          id: registro.mapaId,
          revisao,
          hash: registro.hash,
          atualizadoEm: registro.atualizadoEm,
        },
      });
    };

    const aplicarMembros = (membros) => {
      if (!ativo) return;
      membrosRef.current = membros || [];
      const sessao = mesclarMembrosNaSessao(
        mesaId,
        membrosRef.current,
        presencasRef.current,
      );
      callbacksRef.current.aoSessao?.(sessao);
    };

    const aplicarRolagem = (rolagem) => {
      if (!ativo || !rolagem?.id) return;
      const sessaoAtual = carregarSessaoArquivos(mesaId);
      const historicoAtual = Array.isArray(sessaoAtual.historicoRolagens)
        ? sessaoAtual.historicoRolagens
        : [];
      if (historicoAtual.some((item) => item?.id === rolagem.id)) {
        callbacksRef.current.aoRolagem?.(rolagem);
        return;
      }

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
      aoTokens: (evento) => {
        if (!ativo || !Array.isArray(evento?.tokens)) return;
        const sessaoAtual = carregarSessaoArquivos(mesaId);
        const sessao = aplicarSessaoArquivosRemota(mesaId, {
          ...sessaoAtual,
          mapa: {
            ...(sessaoAtual.mapa || {}),
            tokens: evento.tokens,
          },
          atualizadoEm: evento.atualizadoEm || new Date().toISOString(),
        });
        callbacksRef.current.aoSessao?.(sessao);
        callbacksRef.current.aoTokens?.(evento.tokens);
      },
      aoSolicitacoesFichasAlteradas: () => {
        callbacksRef.current.aoSolicitacoesFichasAlteradas?.();
      },
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

    if (!mestre && GERADOR_MAPAS_SINCRONIZACAO_ATIVA) {
      cancelarCanalMapa = assinarMapaAplicadoRealtime(mesaId, {
        revisaoInicial: revisaoMapaAplicadoRef.current,
        aoMapa: aplicarMapaSeguro,
        aoStatus: (status) => {
          if (status === "SUBSCRIBED") callbacksRef.current.aoStatus?.("Mapa da mesa sincronizado.");
        },
        aoErro: (erro) => callbacksRef.current.aoErro?.(erro),
      });
    }

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
        if (!mestre && GERADOR_MAPAS_SINCRONIZACAO_ATIVA) {
          try {
            aplicarMapaSeguro(await carregarMapaAplicadoDaMesa(mesaId));
          } catch (erro) {
            if (!/mapas_aplicados_orbe/i.test(String(erro?.message || ""))) {
              callbacksRef.current.aoErro?.(erro);
            }
          }
        }
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
      cancelarCanalMapa();
    };
  }, [mesaId, mestre, online]);

  useEffect(() => {
    if (!online || !usuarioId) {
      setPresencas([]);
      presencasRef.current = [];
      return undefined;
    }

    let ativo = true;
    let remover = () => {};

    void assinarPresencaMesaOrbe(
      mesaId,
      dadosPresencaRef.current,
      {
        aoAlterar: (lista) => {
          if (!ativo) return;
          presencasRef.current = lista;
          setPresencas(lista);
          const sessao = mesclarMembrosNaSessao(
            mesaId,
            membrosRef.current,
            lista,
          );
          callbacksRef.current.aoSessao?.(sessao);
        },
        aoErro: (erro) => callbacksRef.current.aoErro?.(erro),
      },
    )
      .then((controle) => {
        if (!ativo) {
          controle.remover();
          return;
        }
        controlePresencaRef.current = controle;
        remover = controle.remover;
        void controle
          .atualizar(dadosPresencaRef.current)
          .catch((erro) => callbacksRef.current.aoErro?.(erro));
      })
      .catch((erro) => callbacksRef.current.aoErro?.(erro));

    return () => {
      ativo = false;
      controlePresencaRef.current = null;
      remover();
    };
  }, [mesaId, mestre, online, usuarioId]);

  useEffect(() => {
    if (!controlePresencaRef.current) return;
    void controlePresencaRef.current
      .atualizar({
        nome: nomePresenca,
        fichaId,
        papel: mestre ? "mestre" : "jogador",
      })
      .catch((erro) => callbacksRef.current.aoErro?.(erro));
  }, [fichaId, mestre, nomePresenca]);

  const mestreOnline = presencas.some(
    (presenca) => String(presenca.papel || "").toLowerCase() === "mestre",
  );

  return { online, pronto, presencas, mestreOnline };
}
