import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router";

import Dados3D from "../components/Dados3D.jsx";

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

import {
  criarFichaArquivosVazia,
  carregarFichasArquivosConectadas,
  listarFichasArquivos,
  removerFichaArquivos,
  salvarFichaArquivosConectada,
} from "../utils/fichasArquivos.js";

import {
  lerMesasSalvas,
} from "../utils/mesas.js";

import {
  carregarSessaoArquivos,
  salvarSessaoArquivos,
} from "../utils/sessoesArquivos.js";
import {
  publicarRolagemMesaRealtime,
  salvarSegredosMestreRemotos,
} from "../services/supabaseOrbe.js";
import useRealtimeMesaOrbe from "../hooks/useRealtimeMesaOrbe.js";

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

  useRealtimeMesaOrbe({
    mesaId,
    mestre: true,
    aoSessao: setSessao,
    aoFichas: setFichas,
    aoRolagem: (rolagem) => {
      setResultadoRolagem(
        `${rolagem.nome || "Jogador"}: ${rolagem.total ?? rolagem.resultado}`,
      );
    },
    aoStatus: setMensagemSistema,
    aoErro: (erro) => {
      console.warn("Sincronização em tempo real da mesa indisponível.", erro);
      setMensagemSistema("A mesa continua local, mas perdeu a atualização em tempo real.");
    },
  });

  const mesasSalvas =
    lerMesasSalvas();

  const mesa =
    criarListaSegura(
      mesasSalvas,
    ).find(
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

        return salvarSessaoArquivos(
          mesaId,
          proximaSessao,
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
      return;
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
    const sessaoCarregada =
      carregarSessaoArquivos(
        mesaId,
      );

    let fichasCarregadas;
    try {
      fichasCarregadas = await carregarFichasArquivosConectadas(mesaId);
    } catch (erro) {
      setMensagemSistema(erro?.message || "Não foi possível carregar as fichas online.");
      return;
    }

    setSessao(
      sessaoCarregada,
    );

    setFichas(
      fichasCarregadas,
    );

    setMensagemSistema(
      "Campanha atualizada.",
    );
  }

  function salvarArquivoAtual() {
    const sessaoSalva =
      salvarSessaoArquivos(
        mesaId,
        sessao,
      );

    setSessao(
      sessaoSalva,
    );

    setMensagemSistema(
      "Arquivo salvo.",
    );
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
    });
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
    );
  }

  function renderizarPainel() {
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
            aoAlterarMapa={(mapaAtualizado) => persistirSessao({ mapa: mapaAtualizado })}
            aoAlterarMensagem={setMensagemSistema}
          />
        ) : (
          <PainelMapa
            papelAtual="mestre"
            arquivoInicial={arquivoAtual}
            mapa={sessao.mapa}
            fichas={fichas}
            aoAtualizarFicha={salvarFicha}
            aoAlterarMapa={(mapaAtualizado) => persistirSessao({ mapa: mapaAtualizado })}
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
