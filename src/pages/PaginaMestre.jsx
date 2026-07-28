import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router";

import Dados3D from "../components/Dados3D.jsx";
import useAutenticacaoOrbe from "../autenticacao/useAutenticacaoOrbe.js";

import BarraLateralMesa from "../components/mestre/BarraLateralMesa.jsx";
import { ComunicacaoMesa } from "../comunicacao/index.js";
import EscudoMestre from "../components/mestre/EscudoMestre.jsx";
import HistoricoRolagens from "../components/mestre/HistoricoRolagens.jsx";
import MenuMestre from "../components/mestre/MenuMestre.jsx";
import SolicitacoesEntradaMesa from "../components/mestre/SolicitacoesEntradaMesa.jsx";
import PainelAnotacoes from "../components/mestre/PainelAnotacoes.jsx";
import PainelArquivos from "../components/mestre/PainelArquivos.jsx";
import PainelFichas from "../components/mestre/PainelFichas.jsx";
import PainelGerenciarFichas from "../components/mestre/PainelGerenciarFichas.jsx";
import PainelInventario from "../components/mestre/PainelInventario.jsx";
import PainelMapa from "../components/mestre/PainelMapa.jsx";
import PainelMapaKonvaTeste from "../components/mestre/mapaKonvaTeste/PainelMapaKonvaTeste.jsx";
import PainelMissoes from "../components/mestre/PainelMissoes.jsx";
import PainelRituais from "../components/mestre/PainelRituais.jsx";
import MesaSonora from "../components/mestre/mesaSonora/MesaSonora.jsx";
import { MesaSonoraLiveKitProvider } from "../components/mestre/mesaSonora/livekit/MesaSonoraLiveKitContext.jsx";
import PainelBibliotecaMapas from "../geradorMapa/components/PainelBibliotecaMapas.jsx";

import {
  criarFichaArquivosVazia,
  carregarFichasArquivosConectadas,
  listarFichasArquivos,
  removerFichaArquivos,
  salvarFichaArquivosConectada,
} from "../utils/fichasArquivos.js";

import {
  lerMesasSalvas,
  salvarMesasLocal,
  gerarIdMesa,
  aplicarMesaRemota,
} from "../utils/mesas.js";
import {
  criarBackupCampanha,
  lerBackupCampanha,
  nomeArquivoBackup,
  prepararArquivosImportados,
} from "../utils/backupCampanhaOrbe.js";

import {
  carregarSessaoArquivos,
  aplicarSessaoArquivosRemota,
  salvarSessaoArquivos,
} from "../utils/sessoesArquivos.js";
import {
  carregarEstadoMesaRemoto,
  criarMesaRemota,
  listarSolicitacoesMigracaoFichaRemotas,
  moderarMembroMesaRemoto,
  publicarInicioRolagemMesaRealtime,
  publicarRolagemMesaRealtime,
  publicarTokensMesaRealtime,
  revisarMigracaoFichaRemota,
  listarVersoesArquivoRemotas,
  registrarVersaoArquivoRemota,
  restaurarVersaoArquivoRemota,
  orbeOnlineHabilitado,
  salvarSegredosMestreRemotos,
  sincronizarSessaoPublicaAgora,
} from "../services/supabaseOrbe.js";
import useRealtimeMesaOrbe from "../hooks/useRealtimeMesaOrbe.js";
import useSalvamentoAutomaticoOrbe from "../hooks/useSalvamentoAutomaticoOrbe.js";
import IndicadorConexaoMesa from "../components/mesa/IndicadorConexaoMesa.jsx";
import IndicadorSalvamentoOrbe from "../components/mesa/IndicadorSalvamentoOrbe.jsx";
import { removerRascunhoOrbe } from "../utils/rascunhosOrbe.js";

import "./PaginaMestre.css";

const TITULOS_MENU = {
  mapa: "Mapa de combate",
  "gerenciar-fichas":
    "Gerenciar fichas",
  fichas:
    "Ficha do personagem",
  inventario:
    "Inventário",
  rituais:
    "Rituais",
  "trilha-sonora":
    "Mesa Sonora",
  anotacoes:
    "Anotações",
  missoes:
    "Missões",
  arquivos:
    "Arquivos da campanha",
};

function criarListaSegura(
  valor,
) {
  return Array.isArray(valor)
    ? valor
    : [];
}

function PaginaMestre() {
  const { mesaId = "local" } =
    useParams();

  const navegar =
    useNavigate();
  const { usuario } =
    useAutenticacaoOrbe();

  const dados3DRef =
    useRef(null);

  const [jogadorCriacaoId, setJogadorCriacaoId] = useState("");
  const [usarMapaKonvaTeste, setUsarMapaKonvaTeste] = useState(false);
  const [miniFichaEscudo, setMiniFichaEscudo] = useState(null);

  const [
    tipoDado,
    setTipoDado,
  ] = useState("d20");

  const [
    modificador,
    setModificador,
  ] = useState(0);

  const [
    quantidadeDados,
    setQuantidadeDados,
  ] = useState(1);

  const [
    resultadoRolagem,
    setResultadoRolagem,
  ] = useState(
    "Pronto para rolar.",
  );

  const [
    mensagemSistema,
    setMensagemSistema,
  ] = useState(
    "Alterações salvas automaticamente.",
  );
  const [atualizacaoParticipantes, setAtualizacaoParticipantes] = useState(0);

  const [
    sessao,
    setSessao,
  ] = useState(() =>
    carregarSessaoArquivos(
      mesaId,
    ),
  );

  const [
    fichas,
    setFichas,
  ] = useState(() =>
    listarFichasArquivos(
      mesaId,
    ),
  );

  const [
    solicitacoesFichas,
    setSolicitacoesFichas,
  ] = useState([]);

  const [
    mesaAtual,
    setMesaAtual,
  ] = useState(() =>
    lerMesasSalvas().find(
      (item) =>
        String(item.id) ===
        String(mesaId),
    ) || null,
  );

  const dadosArquivosEditaveis = {
    arquivos: sessao.arquivos || [],
    arquivoAtivoId: sessao.arquivoAtivoId || "",
    arquivoAtual: sessao.arquivoAtual || "",
  };
  const arquivosSalvosRef = useRef(
    new Map((sessao.arquivos || []).map((arquivo) => [String(arquivo.id), JSON.stringify(arquivo)])),
  );
  useEffect(() => {
    arquivosSalvosRef.current = new Map(
      (carregarSessaoArquivos(mesaId).arquivos || []).map((arquivo) => [String(arquivo.id), JSON.stringify(arquivo)]),
    );
  }, [mesaId]);
  const salvarArquivosAutomaticamente = useCallback(async (dados) => {
    const sessaoAtual = carregarSessaoArquivos(mesaId);
    await sincronizarSessaoPublicaAgora(mesaId, {
      ...sessaoAtual,
      ...dados,
    });
    for (const arquivo of dados.arquivos || []) {
      const arquivoId = String(arquivo.id || "");
      const fotografia = JSON.stringify(arquivo);
      if (!arquivoId || arquivosSalvosRef.current.get(arquivoId) === fotografia) continue;
      try {
        await registrarVersaoArquivoRemota(mesaId, arquivoId, arquivo);
        arquivosSalvosRef.current.set(arquivoId, fotografia);
      } catch (erro) {
        console.warn("Nao foi possivel registrar a versao do Arquivo.", erro);
      }
    }
  }, [mesaId]);
  const salvamentoArquivos = useSalvamentoAutomaticoOrbe({
    valor: dadosArquivosEditaveis,
    chave: `orbe:rascunho:v1:${usuario?.id || "anonimo"}:${mesaId}:arquivos`,
    aoSalvar: salvarArquivosAutomaticamente,
  });
  const dadosMapaEditaveis = sessao.mapa || {};
  const salvarMapaAutomaticamente = useCallback(async (mapa) => {
    const sessaoAtual = carregarSessaoArquivos(mesaId);
    await sincronizarSessaoPublicaAgora(mesaId, {
      ...sessaoAtual,
      mapa,
    });
  }, [mesaId]);
  const salvamentoMapa = useSalvamentoAutomaticoOrbe({
    valor: dadosMapaEditaveis,
    chave: `orbe:rascunho:v1:${usuario?.id || "anonimo"}:${mesaId}:mapa:${dadosMapaEditaveis.fundoAtivoId || "principal"}`,
    habilitado: Boolean(mesaId && mesaId !== "local" && usuario?.id),
    aoSalvar: salvarMapaAutomaticamente,
  });
  const [conflitoMapa, setConflitoMapa] = useState(null);
  const receberSessaoRealtime = useCallback((sessaoRemota) => {
    const mapaRemoto = sessaoRemota?.mapa;
    if (salvamentoMapa.pendente && mapaRemoto && JSON.stringify(mapaRemoto) !== JSON.stringify(sessao.mapa)) {
      const conflito = { local: sessao.mapa, remoto: mapaRemoto, sessaoRemota, atualizadoEm: sessaoRemota.atualizadoEm };
      setConflitoMapa(conflito);
      salvamentoMapa.sinalizarConflito(conflito);
      return;
    }
    setSessao(sessaoRemota);
  }, [salvamentoMapa, sessao]);

  useEffect(() => {
    const sessaoCarregada =
      carregarSessaoArquivos(
        mesaId,
      );

    const fichasCarregadas =
      listarFichasArquivos(
        mesaId,
      );

    setSessao(
      sessaoCarregada,
    );

    setFichas(
      fichasCarregadas,
    );

    setMesaAtual(
      lerMesasSalvas().find(
        (item) =>
          String(item.id) ===
          String(mesaId),
      ) || null,
    );
  }, [mesaId]);

  useEffect(() => {
    function sincronizarOutraAba(evento) {
      if (evento.key === `orbe:arquivos:sessao:${mesaId}`) {
        setSessao(carregarSessaoArquivos(mesaId));
      }

      if (evento.key === `orbe:arquivos:fichas:${mesaId}`) {
        setFichas(listarFichasArquivos(mesaId));
      }
    }

    window.addEventListener("storage", sincronizarOutraAba);
    return () => window.removeEventListener("storage", sincronizarOutraAba);
  }, [mesaId]);

  const carregarSolicitacoesFichas = useCallback(async () => {
    if (!mesaId || mesaId === "local") {
      setSolicitacoesFichas([]);
      return;
    }
    try {
      setSolicitacoesFichas(
        await listarSolicitacoesMigracaoFichaRemotas(mesaId),
      );
    } catch (erro) {
      console.warn("Não foi possível carregar as solicitações de ficha.", erro);
    }
  }, [mesaId]);

  useEffect(() => {
    void carregarSolicitacoesFichas();
  }, [carregarSolicitacoesFichas]);

  const { mestreOnline, estadoConexao } =
    useRealtimeMesaOrbe({
    mesaId,
    mestre: true,
    usuarioId: usuario?.id || "",
    nomePresenca:
      usuario?.user_metadata?.nome ||
      usuario?.email?.split("@")[0] ||
      "Mestre",
    aoMesa: setMesaAtual,
    aoSessao: receberSessaoRealtime,
    aoFichas: setFichas,
    aoSolicitacoesFichasAlteradas: carregarSolicitacoesFichas,
    aoInicioRolagem: (configuracao) => {
      setResultadoRolagem(
        `${configuracao.nome || "Jogador"} está rolando...`,
      );
      void dados3DRef.current
        ?.rolar(
          {
            qty: configuracao.quantidade,
            sides: configuracao.lados,
            modifier: configuracao.modificador,
          },
          {
            notificarResultado: false,
            ocultarResultadoFisico: true,
          },
        )
        .catch(() => {
          setResultadoRolagem("A animação remota não pôde ser exibida.");
        });
    },
    aoRolagem: (rolagem) => {
      dados3DRef.current?.mostrarResultado(
        rolagem,
      );
      setResultadoRolagem(
        `${rolagem.nome || "Jogador"}: ${rolagem.total ?? rolagem.resultado}`,
      );
    },
    aoStatus: setMensagemSistema,
    aoMembrosAlterados: () => setAtualizacaoParticipantes((atual) => atual + 1),
    aoErro: (erro) => {
      console.warn("Sincronização em tempo real da mesa indisponível.", erro);
      setMensagemSistema("A mesa continua local, mas perdeu a atualização em tempo real.");
    },
  });

  const mesa =
    mesaAtual ||
    lerMesasSalvas().find(
      (item) =>
        String(item.id) ===
        String(mesaId),
    );

  const nomeCampanha =
    mesa?.nomeCampanha ||
    mesa?.nome ||
    "Campanha";

  const arquivoAtual =
    sessao.arquivoAtual ||
    mesa?.arquivoInicial ||
    "ARQUIVO 0001";

  const codigoConvite =
    mesa?.codigoConvite ||
    mesa?.codigo_convite ||
    mesa?.inviteCode ||
    `ORBE-${String(mesaId)
      .slice(-6)
      .toUpperCase()}`;

  const menuAtivo =
    sessao.menuAtivo ||
    "mapa";

  const fichaAtiva =
    fichas.find(
      (ficha) =>
        ficha.id ===
        sessao.fichaAtivaId,
    ) ||
    fichas[0] ||
    null;

  const arquivoSelecionado =
    criarListaSegura(
      sessao.arquivos,
    ).find(
      (arquivo) =>
        arquivo.id ===
        sessao.arquivoAtivoId,
    ) || null;

  function persistirSessao(
    alteracoes,
    opcoes = {},
  ) {
    setSessao(
      (sessaoAnterior) => {
        const proximaSessao =
          typeof alteracoes ===
          "function"
            ? alteracoes(
                sessaoAnterior,
              )
            : {
                ...sessaoAnterior,
                ...alteracoes,
              };

        if (proximaSessao.mapa !== sessaoAnterior.mapa) {
          void publicarTokensMesaRealtime(
            mesaId,
            proximaSessao.mapa?.tokens,
          ).catch((erro) => {
            console.warn("NÃ£o foi possÃ­vel transmitir o movimento dos tokens.", erro);
          });
        }

        return salvarSessaoArquivos(
          mesaId,
          proximaSessao,
          opcoes,
        );
      },
    );
  }

  function atualizarListaFichas() {
    const listaAtualizada =
      listarFichasArquivos(
        mesaId,
      );

    setFichas(
      listaAtualizada,
    );

    return listaAtualizada;
  }

  async function salvarFicha(
    fichaRecebida,
  ) {
    try {
      const fichaSalva =
        await salvarFichaArquivosConectada(
        mesaId,
        fichaRecebida,
        { responsavelId: fichaRecebida?.jogadorId || null },
      );

      atualizarListaFichas();

      persistirSessao({
        fichaAtivaId:
          fichaSalva.id,
      });

      setMensagemSistema(
        `Ficha de ${fichaSalva.nome || "agente"} salva.`,
      );
      return fichaSalva;
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível salvar a ficha online.");
      return null;
    }
  }

  async function revisarSolicitacaoFicha(ficha, aceitar) {
    try {
      await revisarMigracaoFichaRemota(ficha.id, aceitar);
      await Promise.all([
        carregarFichasArquivosConectadas(mesaId).then(setFichas),
        carregarSolicitacoesFichas(),
      ]);
      setMensagemSistema(
        aceitar
          ? "Ficha aprovada e vinculada à campanha. A edição começa bloqueada."
          : "Solicitação de ficha recusada.",
      );
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível revisar a solicitação de ficha.");
    }
  }

  async function moderarJogador(jogador, acao) {
    if (!jogador?.id) return;
    const verbo = acao === "banir" ? "banir" : "expulsar";
    const complemento =
      acao === "banir"
        ? " Ele não poderá solicitar entrada novamente."
        : " Ele poderá enviar uma nova solicitação depois.";
    if (!window.confirm(`Deseja ${verbo} ${jogador.nome || "este jogador"}?${complemento}`)) {
      return;
    }

    try {
      await moderarMembroMesaRemoto(mesaId, jogador.id, acao);
      setSessao((atual) => ({
        ...atual,
        jogadores: criarListaSegura(atual.jogadores).filter(
          (item) => String(item.id) !== String(jogador.id),
        ),
      }));
      setMensagemSistema(
        acao === "banir"
          ? `${jogador.nome || "Jogador"} foi banido da mesa.`
          : `${jogador.nome || "Jogador"} foi expulso da mesa.`,
      );
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível moderar o participante.");
    }
  }

  async function criarFichaDaSessao(configuracao = {}) {
    const jogador = criarListaSegura(sessao.jogadores).find(
      (item) => item.id === configuracao.jogadorId,
    );
    let fichaSalva;
    try {
      fichaSalva = await salvarFichaArquivosConectada(
        mesaId,
        criarFichaArquivosVazia({
          nome: configuracao.nome || jogador?.personagem || "Novo agente",
          jogador: configuracao.jogador || jogador?.nome || "",
          jogadorId: configuracao.jogadorId || "",
          fichaCategoria: configuracao.tipo || "Personagem da sessão",
          origemFicha: "sessao",
          editLocked: configuracao.permissao !== "liberada",
        }),
        { responsavelId: configuracao.jogadorId || null },
      );
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível criar a ficha online.");
      throw erro;
    }

    const listaAtualizada = atualizarListaFichas();
    persistirSessao((anterior) => ({
      ...anterior,
      fichaAtivaId: fichaSalva.id,
      jogadores: criarListaSegura(anterior.jogadores).map((item) =>
        item.id === configuracao.jogadorId
          ? { ...item, fichaId: fichaSalva.id, personagem: fichaSalva.nome }
          : item,
      ),
    }));
    setJogadorCriacaoId("");
    setFichas(listaAtualizada);
    setMensagemSistema(`Ficha de ${fichaSalva.nome} criada${jogador ? ` para ${jogador.nome}` : ""}.`);
    return fichaSalva;
  }

  function removerFicha(ficha) {
    if (!ficha || !window.confirm(`Excluir a ficha de ${ficha.nome || "agente"}? O token vinculado também será removido do mapa.`)) {
      return;
    }

    const listaAtualizada = removerFichaArquivos(mesaId, ficha.id);
    setFichas(listaAtualizada);
    persistirSessao((sessaoAnterior) => ({
      ...sessaoAnterior,
      fichaAtivaId: sessaoAnterior.fichaAtivaId === ficha.id ? "" : sessaoAnterior.fichaAtivaId,
      mapa: {
        ...sessaoAnterior.mapa,
        tokens: criarListaSegura(sessaoAnterior.mapa?.tokens).filter((token) => token.fichaId !== ficha.id),
      },
    }));
    setMensagemSistema(`Ficha de ${ficha.nome || "agente"} excluída.`);
  }

  function atualizarColecaoFicha(
    nomeColecao,
    operacao,
    item,
  ) {
    if (!fichaAtiva) {
      setMensagemSistema(
        "Crie ou selecione uma ficha primeiro.",
      );

      return;
    }

    const listaAtual =
      criarListaSegura(
        fichaAtiva[
          nomeColecao
        ],
      );

    let novaLista =
      listaAtual;

    if (
      operacao ===
      "adicionar"
    ) {
      novaLista = [
        item,
        ...listaAtual,
      ];
    }

    if (
      operacao ===
      "atualizar"
    ) {
      novaLista =
        listaAtual.map(
          (itemAtual) =>
            itemAtual.id ===
            item.id
              ? item
              : itemAtual,
        );
    }

    if (
      operacao ===
      "remover"
    ) {
      novaLista =
        listaAtual.filter(
          (itemAtual) =>
            itemAtual.id !==
            item.id,
        );
    }

    salvarFicha({
      ...fichaAtiva,
      [nomeColecao]:
        novaLista,
    });
  }

  function atualizarColecaoSessao(
    nomeColecao,
    operacao,
    item,
  ) {
    persistirSessao(
      (sessaoAnterior) => {
        const listaAtual =
          criarListaSegura(
            sessaoAnterior[
              nomeColecao
            ],
          );

        let novaLista =
          listaAtual;

        if (
          operacao ===
          "adicionar"
        ) {
          novaLista = [
            item,
            ...listaAtual,
          ];
        }

        if (
          operacao ===
          "atualizar"
        ) {
          novaLista =
            listaAtual.map(
              (itemAtual) =>
                itemAtual.id ===
                item.id
                  ? item
                  : itemAtual,
            );
        }

        if (
          operacao ===
          "remover"
        ) {
          novaLista =
            listaAtual.filter(
              (itemAtual) =>
                itemAtual.id !==
                item.id,
            );
        }

        return {
          ...sessaoAnterior,
          [nomeColecao]:
            novaLista,
        };
      },
      nomeColecao === "arquivos" ? { agendarRemoto: false } : {},
    );
  }

  async function rolarDado() {
    const quantidadeLados =
      Number(
        tipoDado.replace(
          "d",
          "",
        ),
      );

    const valorModificador =
      Number(modificador) ||
      0;

    const quantidade = Math.min(
      Math.max(
        Number(quantidadeDados) || 1,
        1,
      ),
      10,
    );

    if (
      !dados3DRef.current
        ?.rolar
    ) {
      setResultadoRolagem(
        "O rolador ainda não está disponível.",
      );

      return;
    }

    setResultadoRolagem(
      "Rolando dado...",
    );

    try {
      void publicarInicioRolagemMesaRealtime(mesaId, {
        id: `inicio-rolagem-${Date.now()}-${Math.random()}`,
        nome: "Mestre",
        quantidade,
        lados: quantidadeLados,
        modificador: valorModificador,
      }).catch((erro) => {
        console.warn("Não foi possível transmitir a animação dos dados.", erro);
      });
      await dados3DRef.current.rolar({
        qty: quantidade,
        sides:
          quantidadeLados,
        modifier:
          valorModificador,
      });
    } catch {
      setResultadoRolagem(
        "Não foi possível realizar a rolagem.",
      );
    }
  }

  function finalizarRolagem(
    resultados,
  ) {
    const grupoRolagem =
      Array.isArray(resultados)
        ? resultados[0]
        : resultados;

    const rolagens = Array.isArray(
      grupoRolagem?.rolls,
    )
      ? grupoRolagem.rolls
      : [];

    const valores = rolagens
      .map((rolagem) =>
        Number(rolagem?.value),
      )
      .filter(Number.isFinite);

    const somaDados = valores.length > 0
      ? valores.reduce(
          (soma, valor) => soma + valor,
          0,
        )
      : Number(grupoRolagem?.value) || 0;

    const modificadorAplicado =
      Number(
        grupoRolagem?.modifier ??
          modificador,
      ) || 0;

    const totalInformado = Number(
      grupoRolagem?.value ??
        grupoRolagem?.total,
    );

    const resultadoFinal = Number.isFinite(
      totalInformado,
    )
      ? totalInformado
      : somaDados + modificadorAplicado;

    const ladosDado =
      Number(
        grupoRolagem?.sides ??
          rolagens[0]?.sides ??
          tipoDado.replace(
            "d",
            "",
          ) ??
          20,
      );

    const nomeDado =
      `d${ladosDado}`;

    const quantidadeRolada =
      valores.length ||
      Number(grupoRolagem?.qty) ||
      1;

    if (quantidadeRolada === 1 && modificadorAplicado === 0) {
      setResultadoRolagem(
        `${nomeDado}: ${somaDados}`,
      );
    } else {
      const expressaoDados = valores.length > 0
        ? valores.join(" + ")
        : String(somaDados);

      const trechoModificador = modificadorAplicado === 0
        ? ""
        : modificadorAplicado > 0
          ? ` + ${modificadorAplicado}`
          : ` - ${Math.abs(modificadorAplicado)}`;

      setResultadoRolagem(
        `${expressaoDados}${trechoModificador} = ${resultadoFinal}`,
      );
    }

    const novaRolagem = {
      id:
        `rolagem-${Date.now()}-${Math.random()}`,

      nome:
        `Rolagem de ${nomeDado}`,

      tipo:
        nomeDado,

      dado:
        nomeDado,

      quantidade:
        quantidadeRolada,

      valores:
        valores.length > 0
          ? valores
          : [somaDados],

      valor:
        somaDados,

      modificador:
        modificadorAplicado,

      total:
        resultadoFinal,

      resultado:
        resultadoFinal,

      criadoEm:
        new Date().toISOString(),
    };

    persistirSessao(
      (sessaoAnterior) => ({
        ...sessaoAnterior,

        historicoRolagens: [
          novaRolagem,

          ...criarListaSegura(
            sessaoAnterior
              .historicoRolagens,
          ),
        ].slice(0, 50),
      }),
    );

    void publicarRolagemMesaRealtime(mesaId, novaRolagem).catch((erro) => {
      console.warn("Não foi possível transmitir a rolagem para a mesa.", erro);
    });
  }

  async function recarregarCampanha() {
    let fichasCarregadas;
    try {
      const estadoRemoto =
        await carregarEstadoMesaRemoto(
          mesaId,
          {
            incluirSegredos: true,
          },
        );
      fichasCarregadas = await carregarFichasArquivosConectadas(mesaId);
      if (estadoRemoto?.mesa) {
        setMesaAtual(
          estadoRemoto.mesa,
        );
      }
      if (estadoRemoto?.sessao) {
        setSessao(
          aplicarSessaoArquivosRemota(
            mesaId,
            estadoRemoto.sessao,
          ),
        );
      }
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível carregar as fichas online.");
      return;
    }

    setFichas(
      fichasCarregadas,
    );

    setMensagemSistema(
      "Campanha atualizada.",
    );
  }

  async function salvarArquivoAtual() {
    const sessaoSalva =
      salvarSessaoArquivos(
        mesaId,
        sessao,
      );

    setSessao(
      sessaoSalva,
    );

    try {
      const autosaveConcluido = await salvamentoArquivos.salvarAgora();
      if (autosaveConcluido) {
        setMensagemSistema("Arquivo salvo e sincronizado.");
        return;
      }
      const sessaoConfirmada =
        await sincronizarSessaoPublicaAgora(
          mesaId,
          sessaoSalva,
        );

      setSessao(
        aplicarSessaoArquivosRemota(
          mesaId,
          sessaoConfirmada,
        ),
      );

      setMensagemSistema(
        "Arquivo salvo e sincronizado.",
      );
    } catch (erro) {
      setMensagemSistema(
        erro?.message ||
          "Não foi possível salvar a campanha online.",
      );
    }
  }

  function adicionarArquivo(
    arquivo,
  ) {
    persistirSessao(
      (sessaoAnterior) => ({
        ...sessaoAnterior,

        arquivos: [
          arquivo,

          ...criarListaSegura(
            sessaoAnterior
              .arquivos,
          ),
        ],

        arquivoAtivoId:
          arquivo.id,

        arquivoAtual:
          arquivo.codigo,
      }),
      { agendarRemoto: false },
    );
  }

  function selecionarArquivo(
    arquivo,
  ) {
    persistirSessao({
      arquivoAtivoId:
        arquivo.id,

      arquivoAtual:
        arquivo.codigo,
    }, { agendarRemoto: false });
  }

  function atualizarArquivo(
    arquivo,
  ) {
    atualizarColecaoSessao(
      "arquivos",
      "atualizar",
      arquivo,
    );
  }

  function removerArquivo(
    arquivo,
  ) {
    persistirSessao(
      (sessaoAnterior) => {
        const arquivosRestantes =
          criarListaSegura(
            sessaoAnterior
              .arquivos,
          ).filter(
            (arquivoAtual) =>
              arquivoAtual.id !==
              arquivo.id,
          );

        const estavaSelecionado =
          sessaoAnterior
            .arquivoAtivoId ===
          arquivo.id;

        return {
          ...sessaoAnterior,

          arquivos:
            arquivosRestantes,

          arquivoAtivoId:
            estavaSelecionado
              ? ""
              : sessaoAnterior
                  .arquivoAtivoId,

          arquivoAtual:
            estavaSelecionado
              ? mesa?.arquivoInicial ||
                "ARQUIVO 0001"
              : sessaoAnterior
                  .arquivoAtual,
        };
      },
      { agendarRemoto: false },
    );
  }

  async function restaurarArquivo(arquivo, versao) {
    if (!arquivo?.id || !versao?.numeroVersao) return;
    const confirmado = window.confirm(
      `Restaurar a versao ${versao.numeroVersao} de ${arquivo.codigo || "este Arquivo"}? A versao atual nao sera apagada.`,
    );
    if (!confirmado) return;
    try {
      salvamentoArquivos.descartarPendente();
      const resultado = await restaurarVersaoArquivoRemota(
        mesaId,
        arquivo.id,
        versao.numeroVersao,
      );
      const sessaoAtual = carregarSessaoArquivos(mesaId);
      const arquivos = (sessaoAtual.arquivos || []).map((item) =>
        String(item.id) === String(arquivo.id) ? resultado?.arquivo || versao.dados : item,
      );
      const sessaoRestaurada = salvarSessaoArquivos(
        mesaId,
        { ...sessaoAtual, arquivos },
        { agendarRemoto: false },
      );
      arquivosSalvosRef.current.set(String(arquivo.id), JSON.stringify(resultado?.arquivo || versao.dados));
      removerRascunhoOrbe(`orbe:rascunho:v1:${usuario?.id || "anonimo"}:${mesaId}:arquivos`);
      setSessao(sessaoRestaurada);
      setMensagemSistema(`Versao ${versao.numeroVersao} restaurada como novo estado.`);
    } catch (erro) {
      setMensagemSistema(erro?.message || "Nao foi possivel restaurar esta versao.");
    }
  }

  async function exportarBackupCampanha() {
    const historicos = {};
    for (const arquivo of sessao.arquivos || []) {
      try {
        historicos[arquivo.id] = await listarVersoesArquivoRemotas(mesaId, arquivo.id);
      } catch (erro) {
        console.warn("Historico indisponivel para exportacao.", erro);
        historicos[arquivo.id] = [];
      }
    }
    const backup = criarBackupCampanha({ mesa: mesaAtual, arquivos: sessao.arquivos || [], historicos });
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivoBackup(nomeCampanha);
    link.click();
    URL.revokeObjectURL(url);
    setMensagemSistema("Backup da campanha exportado.");
  }

  async function registrarHistoricoImportado(idDestino, historico) {
    if (!orbeOnlineHabilitado() || !idDestino) return;
    for (const [arquivoId, versoes] of Object.entries(historico || {})) {
      for (const versao of versoes || []) {
        try {
          await registrarVersaoArquivoRemota(
            idDestino,
            arquivoId,
            versao.dados,
            versao.origemVersao,
            versao.autorNome,
          );
        } catch (erro) {
          console.warn("Nao foi possivel importar uma versao historica.", erro);
        }
      }
    }
  }

  async function importarBackupCampanha({ texto, modo }) {
    try {
      const backup = lerBackupCampanha(texto);
      const preparados = prepararArquivosImportados(backup);
      const titulosExistentes = new Set((sessao.arquivos || []).map((arquivo) => String(arquivo.titulo || "").toLowerCase()));
      const arquivosImportados = preparados.arquivos.map((arquivo) => {
        if (modo === "substituir" || modo === "nova") return arquivo;
        const titulo = String(arquivo.titulo || "").toLowerCase();
        if (!titulosExistentes.has(titulo)) return arquivo;
        return { ...arquivo, titulo: `${arquivo.titulo || "Arquivo"} (importado)` };
      });

      if (modo === "nova") {
        const novoId = gerarIdMesa();
        const novaMesa = {
          id: novoId,
          ownerId: usuario?.id || "",
          criadaPorId: usuario?.id || "",
          nomeCampanha: `${backup.campanha.nomeCampanha || "Campanha"} (importada)`,
          descricao: backup.campanha.descricao || "",
          arquivoInicial: backup.campanha.arquivoInicial || "ARQUIVO 0001",
          criadaEm: new Date().toISOString(),
        };
        if (orbeOnlineHabilitado()) aplicarMesaRemota(await criarMesaRemota(novaMesa));
        else salvarMesasLocal([novaMesa, ...lerMesasSalvas()]);
        const sessaoImportada = salvarSessaoArquivos(novoId, {
          arquivos: arquivosImportados,
          arquivoAtivoId: arquivosImportados[0]?.id || "",
          arquivoAtual: arquivosImportados[0]?.codigo || novaMesa.arquivoInicial,
        }, { agendarRemoto: false });
        if (orbeOnlineHabilitado()) {
          await sincronizarSessaoPublicaAgora(novoId, sessaoImportada);
          await registrarHistoricoImportado(novoId, preparados.historico);
        }
        navegar(`/arquivos/mesa/${novoId}`);
        return;
      }

      const sessaoAtual = carregarSessaoArquivos(mesaId);
      const arquivosFinais = modo === "substituir"
        ? arquivosImportados
        : [...(sessaoAtual.arquivos || []), ...arquivosImportados];
      const sessaoImportada = salvarSessaoArquivos(mesaId, { ...sessaoAtual, arquivos: arquivosFinais }, { agendarRemoto: false });
      arquivosSalvosRef.current = new Map(arquivosFinais.map((arquivo) => [String(arquivo.id), JSON.stringify(arquivo)]));
      salvamentoArquivos.descartarPendente();
      removerRascunhoOrbe(`orbe:rascunho:v1:${usuario?.id || "anonimo"}:${mesaId}:arquivos`);
      if (orbeOnlineHabilitado()) {
        await sincronizarSessaoPublicaAgora(mesaId, sessaoImportada);
        await registrarHistoricoImportado(mesaId, preparados.historico);
      }
      setSessao(sessaoImportada);
      setMensagemSistema(modo === "substituir" ? "Arquivos substituidos pelo backup." : "Arquivos mesclados com o backup.");
    } catch (erro) {
      setMensagemSistema(erro?.message || "Nao foi possivel importar o backup.");
    }
  }

  function renderizarPainel() {
    if (menuAtivo === "gerador-mapas") {
      return (
        <PainelBibliotecaMapas
          mesaId={mesaId}
          sistemaCampanha={mesaAtual?.sistema || "arquivos"}
          mapaGridAtual={sessao.mapa || {}}
          aoAlterarMapaGrid={(mapaAtualizado) =>
            persistirSessao({ mapa: mapaAtualizado })
          }
        />
      );
    }

    if (
      menuAtivo ===
      "gerenciar-fichas"
    ) {
      return (
        <PainelGerenciarFichas
          fichas={
            fichas
          }
          fichaSelecionada={
            fichaAtiva
          }
          jogadores={sessao.jogadores || []}
          solicitacoes={solicitacoesFichas}
          jogadorInicialId={jogadorCriacaoId}
          aoCriarFicha={criarFichaDaSessao}
          aoAbrirFicha={(
            ficha,
          ) =>
            persistirSessao({
              fichaAtivaId:
                ficha.id,

              menuAtivo:
                "fichas",
            })
          }
          aoAlternarPermissao={(ficha) => salvarFicha({ ...ficha, editLocked: !ficha.editLocked })}
          aoRemoverFicha={removerFicha}
          aoRevisarSolicitacao={revisarSolicitacaoFicha}
        />
      );
    }

    if (
      menuAtivo ===
      "fichas"
    ) {
      return (
        <PainelFichas
          fichas={
            fichas
          }
          fichaSelecionada={
            fichaAtiva
          }
          aoSalvarFicha={
            salvarFicha
          }
          chaveRascunho={`orbe:rascunho:v1:${usuario?.id || "anonimo"}:${mesaId}:ficha:${fichaAtiva?.id || "nova"}`}
          aoCriarFicha={() =>
            persistirSessao({
              fichaAtivaId: "",
            })
          }
          aoSelecionarFicha={(
            ficha,
          ) =>
            persistirSessao({
              fichaAtivaId:
                ficha.id,
            })
          }
        />
      );
    }

    if (
      menuAtivo ===
      "inventario"
    ) {
      return (
        <PainelInventario
          fichaAtiva={
            fichaAtiva
          }
          itens={
            fichaAtiva
              ?.inventario ||
            []
          }
          aoAdicionarItem={(
            item,
          ) =>
            atualizarColecaoFicha(
              "inventario",
              "adicionar",
              item,
            )
          }
          aoAtualizarItem={(
            item,
          ) =>
            atualizarColecaoFicha(
              "inventario",
              "atualizar",
              item,
            )
          }
          aoRemoverItem={(
            item,
          ) =>
            atualizarColecaoFicha(
              "inventario",
              "remover",
              item,
            )
          }
        />
      );
    }

    if (
      menuAtivo ===
      "rituais"
    ) {
      return (
        <PainelRituais
          fichaAtiva={
            fichaAtiva
          }
          rituais={
            fichaAtiva
              ?.rituais ||
            []
          }
          aoAdicionarRitual={(
            ritual,
          ) =>
            atualizarColecaoFicha(
              "rituais",
              "adicionar",
              ritual,
            )
          }
          aoAtualizarRitual={(
            ritual,
          ) =>
            atualizarColecaoFicha(
              "rituais",
              "atualizar",
              ritual,
            )
          }
          aoRemoverRitual={(
            ritual,
          ) =>
            atualizarColecaoFicha(
              "rituais",
              "remover",
              ritual,
            )
          }
        />
      );
    }

    if (
      menuAtivo ===
      "trilha-sonora"
    ) {
      return <MesaSonora />;
    }

    if (
      menuAtivo ===
      "anotacoes"
    ) {
      return (
        <PainelAnotacoes
          anotacoes={
            sessao.anotacoes ||
            []
          }
          aoAdicionarAnotacao={(
            anotacao,
          ) =>
            atualizarColecaoSessao(
              "anotacoes",
              "adicionar",
              anotacao,
            )
          }
          aoAtualizarAnotacao={(
            anotacao,
          ) =>
            atualizarColecaoSessao(
              "anotacoes",
              "atualizar",
              anotacao,
            )
          }
          aoRemoverAnotacao={(
            anotacao,
          ) =>
            atualizarColecaoSessao(
              "anotacoes",
              "remover",
              anotacao,
            )
          }
          aoSalvarLista={(lista) => {
            persistirSessao({ anotacoes: lista }, { agendarRemoto: false });
            return sincronizarSessaoPublicaAgora(mesaId, { ...carregarSessaoArquivos(mesaId), anotacoes: lista });
          }}
          chaveRascunho={`orbe:rascunho:v1:${usuario?.id || "anonimo"}:${mesaId}:anotacoes:mestre`}
        />
      );
    }

    if (
      menuAtivo ===
      "missoes"
    ) {
      return (
        <PainelMissoes
          missoes={
            sessao.missoes ||
            []
          }
          arquivos={
            sessao.arquivos ||
            []
          }
          aoAdicionarMissao={(
            missao,
          ) =>
            atualizarColecaoSessao(
              "missoes",
              "adicionar",
              missao,
            )
          }
          aoAtualizarMissao={(
            missao,
          ) =>
            atualizarColecaoSessao(
              "missoes",
              "atualizar",
              missao,
            )
          }
          aoRemoverMissao={(
            missao,
          ) =>
            atualizarColecaoSessao(
              "missoes",
              "remover",
              missao,
            )
          }
          aoSalvarLista={(lista) => {
            persistirSessao({ missoes: lista }, { agendarRemoto: false });
            return sincronizarSessaoPublicaAgora(mesaId, { ...carregarSessaoArquivos(mesaId), missoes: lista });
          }}
          chaveRascunho={`orbe:rascunho:v1:${usuario?.id || "anonimo"}:${mesaId}:missoes`}
          aoAdicionarArquivo={
            adicionarArquivo
          }
        />
      );
    }

    if (
      menuAtivo ===
      "arquivos"
    ) {
      return (
        <PainelArquivos
          arquivos={
            sessao.arquivos ||
            []
          }
          arquivoSelecionado={
            arquivoSelecionado
          }
          aoAdicionarArquivo={
            adicionarArquivo
          }
          aoSelecionarArquivo={
            selecionarArquivo
          }
          aoAtualizarArquivo={
            atualizarArquivo
          }
          aoRemoverArquivo={
            removerArquivo
          }
          mesaId={mesaId}
          aoListarHistorico={listarVersoesArquivoRemotas}
          aoRestaurarArquivo={restaurarArquivo}
          aoExportarBackup={exportarBackupCampanha}
          aoImportarBackup={importarBackupCampanha}
        />
      );
    }

    return (
      <>
        <div className="pagina-mestre__troca-mapa">
          <button type="button" onClick={() => setUsarMapaKonvaTeste((ativo) => !ativo)}>
            {usarMapaKonvaTeste ? "Voltar ao mapa atual" : "Testar mapa Konva"}
          </button>
        </div>

        {usarMapaKonvaTeste ? (
          <PainelMapaKonvaTeste
            arquivoInicial={arquivoAtual}
            mapa={sessao.mapa}
            fichas={fichas}
            aoAlterarMapa={(mapaAtualizado) => persistirSessao({ mapa: mapaAtualizado }, { agendarRemoto: false })}
            aoAlterarMensagem={setMensagemSistema}
          />
        ) : (
          <PainelMapa
            papelAtual="mestre"
            arquivoInicial={arquivoAtual}
            sistemaCampanha={mesaAtual?.sistema || "arquivos"}
            mesaId={mesaId}
            mapa={sessao.mapa}
            fichas={fichas}
            aoAtualizarFicha={salvarFicha}
            aoAlterarMapa={(mapaAtualizado) => persistirSessao({ mapa: mapaAtualizado }, { agendarRemoto: false })}
            estadoSalvamentoMapa={salvamentoMapa.estado}
            rascunhoMapaDisponivel={salvamentoMapa.rascunhoDisponivel}
            aoRecuperarRascunhoMapa={salvamentoMapa.recuperarRascunho}
            conflitoMapa={conflitoMapa}
            aoCarregarServidorMapa={() => {
              if (!conflitoMapa) return;
              salvamentoMapa.resolverConflitoServidor(conflitoMapa.remoto);
              setSessao(conflitoMapa.sessaoRemota);
              setConflitoMapa(null);
            }}
            aoManterLocalMapa={() => {
              if (!conflitoMapa || !window.confirm("Manter suas alterações pode substituir a versão remota. Continuar?")) return;
              void salvamentoMapa.salvarValor(conflitoMapa.local);
              setConflitoMapa(null);
            }}
            aoFecharConflitoMapa={() => setConflitoMapa(null)}
            aoAlterarMensagem={setMensagemSistema}
            aoAbrirMiniFicha={(referencia) => {
              setMiniFichaEscudo(referencia);
              persistirSessao({ escudoAberto: true });
              window.requestAnimationFrame(() => {
                document.querySelector(".escudo-mestre")?.scrollIntoView({ behavior: "smooth", block: "start" });
              });
            }}
          />
        )}

        <EscudoMestre
          jogadores={sessao.jogadores || []}
          fichas={fichas}
          mapa={sessao.mapa || {}}
          arquivoAtual={arquivoAtual}
          aberto={
            sessao.escudoAberto !==
            false
          }
          jogadoresVisiveis={
            sessao.mesaVisivel !==
            false
          }
          anotacoes={
            sessao.anotacoesMestre ||
            ""
          }
          aoAtualizarFicha={salvarFicha}
          aoCriarFicha={(jogador) => {
            setJogadorCriacaoId(jogador?.id || "");
            persistirSessao({ fichaAtivaId: "", menuAtivo: "gerenciar-fichas" });
          }}
          aoAtualizarMapa={(mapaAtualizado) =>
            persistirSessao({ mapa: mapaAtualizado })
          }
          aoAbrirFicha={(fichaId) =>
            persistirSessao({ fichaAtivaId: fichaId, menuAtivo: "fichas" })
          }
          aoAbrirInventario={(fichaId) =>
            persistirSessao({ fichaAtivaId: fichaId, menuAtivo: "inventario" })
          }
          miniFichaAberta={miniFichaEscudo}
          aoFecharMiniFicha={() => setMiniFichaEscudo(null)}
          aoAlternarEscudo={() =>
            persistirSessao(
              (
                sessaoAnterior,
              ) => ({
                ...sessaoAnterior,

                escudoAberto:
                  sessaoAnterior
                    .escudoAberto ===
                  false,
              }),
            )
          }
          aoAlternarVisibilidade={(
            visivel,
          ) =>
            persistirSessao({
              mesaVisivel:
                visivel,
            })
          }
          aoAlterarAnotacoes={(
            anotacoes,
          ) => {
            persistirSessao({
              anotacoesMestre:
                anotacoes,
            })
            void salvarSegredosMestreRemotos(mesaId, anotacoes).catch((falha) =>
              console.warn("Anotações privadas salvas apenas localmente.", falha),
            );
          }}
        />
      </>
    );
  }

  return (
    <MesaSonoraLiveKitProvider mesaId={mesaId}>
    <div className="pagina-mestre">
      <Dados3D
        ref={
          dados3DRef
        }
        aoFinalizar={
          finalizarRolagem
        }
      />

      <MenuMestre
        nomeCampanha={
          nomeCampanha
        }
        arquivoInicial={
          arquivoAtual
        }
        menuAtivo={
          menuAtivo
        }
        aoSelecionarMenu={(
          menu,
        ) => {
          persistirSessao({
            menuAtivo:
              menu,
          });
        }}
        aoAtualizarCampanha={
          recarregarCampanha
        }
        aoSalvarArquivo={
          salvarArquivoAtual
        }
      />

      <main className="pagina-mestre__conteudo">
        <header className="pagina-mestre__cabecalho">
          <div>
            <span>
              Sistema Arquivos
            </span>

            <h1>
              {TITULOS_MENU[
                menuAtivo
              ] ||
                "Mesa do mestre"}
            </h1>

            <p>
              {nomeCampanha} —{" "}
              {arquivoAtual}
            </p>
          </div>

          <div className="pagina-mestre__estado">
            <span>
              Status do sistema
            </span>

            <strong>
              {mensagemSistema}
            </strong>

            <IndicadorConexaoMesa estado={estadoConexao} />
            <IndicadorSalvamentoOrbe
              estado={salvamentoArquivos.estado}
              rascunhoDisponivel={salvamentoArquivos.rascunhoDisponivel}
              aoRecuperar={salvamentoArquivos.recuperarRascunho}
            />
          </div>
        </header>

        <div className="pagina-mestre__corpo">
          <section className="pagina-mestre__painel">
            {renderizarPainel()}
          </section>

          <aside className="pagina-mestre__lateral">
            <section className="rolador-mestre">
              <header>
                <span>
                  Rolador da mesa
                </span>

                <h2>
                  Dados 3D
                </h2>
              </header>

              <div className="rolador-mestre__campos">
                <label>
                  Quantidade

                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={
                      quantidadeDados
                    }
                    onChange={(
                      evento,
                    ) =>
                      setQuantidadeDados(
                        evento.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  Dado

                  <select
                    value={
                      tipoDado
                    }
                    onChange={(
                      evento,
                    ) =>
                      setTipoDado(
                        evento
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="d20">
                      d20
                    </option>

                    <option value="d12">
                      d12
                    </option>

                    <option value="d10">
                      d10
                    </option>

                    <option value="d8">
                      d8
                    </option>

                    <option value="d6">
                      d6
                    </option>

                    <option value="d4">
                      d4
                    </option>
                  </select>
                </label>

                <label>
                  Modificador

                  <input
                    type="number"
                    value={
                      modificador
                    }
                    onChange={(
                      evento,
                    ) =>
                      setModificador(
                        evento
                          .target
                          .value,
                      )
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={
                  rolarDado
                }
              >
                Rolar dado
              </button>

              <strong className="rolador-mestre__resultado">
                {resultadoRolagem}
              </strong>
            </section>

            <HistoricoRolagens
              rolagens={
                sessao
                  .historicoRolagens ||
                []
              }
              aoLimparHistorico={() =>
                persistirSessao({
                  historicoRolagens:
                    [],
                })
              }
            />

            <ComunicacaoMesa
              mesaId={mesaId}
              jogadores={sessao.jogadores || []}
              nomeLocal="Mestre"
              papelLocal="Mestre"
            />

            <SolicitacoesEntradaMesa
              mesaId={mesaId}
              exigirAprovacaoInicial={mesa?.exigeAprovacaoConvite}
              aoMesaAtualizada={setMesaAtual}
              atualizacaoParticipantes={atualizacaoParticipantes}
            />

            <BarraLateralMesa
              nomeCampanha={
                nomeCampanha
              }
              arquivoAtual={
                arquivoAtual
              }
              codigoConvite={
                codigoConvite
              }
              jogadores={
                sessao.jogadores ||
                []
              }
              mestreOnline={mestreOnline}
              aoExpulsarJogador={(jogador) => moderarJogador(jogador, "expulsar")}
              aoBanirJogador={(jogador) => moderarJogador(jogador, "banir")}
              aoCopiarConvite={() =>
                setMensagemSistema(
                  "Código de convite copiado.",
                )
              }
              aoAbrirConfiguracoes={() =>
                setMensagemSistema(
                  "Configurações ainda não foram abertas.",
                )
              }
              aoEncerrarSessao={() =>
                navegar(
                  "/mesas",
                )
              }
            />
          </aside>
        </div>
      </main>
    </div>
    </MesaSonoraLiveKitProvider>
  );
}

export default PaginaMestre;
