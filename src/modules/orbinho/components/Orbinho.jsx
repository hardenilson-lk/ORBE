import { useCallback, useEffect, useRef, useState } from "react";

import { configuracaoOrbinho } from "../data/configuracaoOrbinho.js";
import { mensagensAjuda, mensagensPorRota } from "../data/mensagensOrbinho.js";
import useOrbinho from "../hooks/useOrbinho.js";
import BalaoOrbinho from "./BalaoOrbinho.jsx";
import DestaqueTutorial from "./DestaqueTutorial.jsx";
import orbinhoImagem from "../assets/orbinho.png";

import "../styles/orbinho.css";

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(valor, maximo));
}

function calcularLayoutTutorial(retangulo) {
  if (!retangulo) return {};

  const larguraTela = window.innerWidth;
  const alturaTela = window.innerHeight;
  const celular = larguraTela <= 900;
  const tamanhoOrbinho = celular ? 82 : 96;
  const larguraBalao = Math.min(celular ? 350 : 365, larguraTela - 24);
  const alturaBalaoEstimada = Math.min(540, alturaTela - 24);
  let orbinhoLeft;
  let orbinhoTop;
  let balaoLeft;
  let balaoTop;

  if (celular) {
    orbinhoLeft = limitar(
      retangulo.left + 10,
      12,
      larguraTela - tamanhoOrbinho - 12,
    );
    orbinhoTop = limitar(
      retangulo.bottom + 8,
      12,
      alturaTela - tamanhoOrbinho - 12,
    );
    balaoLeft = 12;
    balaoTop = orbinhoTop + tamanhoOrbinho - 12;

    if (balaoTop + alturaBalaoEstimada > alturaTela - 12) {
      balaoTop = Math.max(12, retangulo.top - alturaBalaoEstimada - 12);
      orbinhoTop = limitar(
        balaoTop + alturaBalaoEstimada - 28,
        12,
        alturaTela - tamanhoOrbinho - 12,
      );
    }
  } else {
    orbinhoLeft = limitar(
      retangulo.right + 10,
      12,
      larguraTela - tamanhoOrbinho - 12,
    );
    orbinhoTop = limitar(
      retangulo.top + retangulo.height / 2 - tamanhoOrbinho / 2,
      12,
      alturaTela - tamanhoOrbinho - 12,
    );
    balaoLeft = orbinhoLeft + tamanhoOrbinho - 9;
    balaoTop = limitar(
      orbinhoTop - 24,
      12,
      alturaTela - alturaBalaoEstimada - 12,
    );

    if (balaoLeft + larguraBalao > larguraTela - 12) {
      balaoLeft = limitar(
        retangulo.left - larguraBalao - tamanhoOrbinho,
        12,
        larguraTela - larguraBalao - 12,
      );
      orbinhoLeft = limitar(
        balaoLeft + larguraBalao - 8,
        12,
        larguraTela - tamanhoOrbinho - 12,
      );
    }
  }

  return {
    orbinho: {
      position: "fixed",
      top: orbinhoTop,
      left: orbinhoLeft,
      right: "auto",
      bottom: "auto",
      width: tamanhoOrbinho,
      height: tamanhoOrbinho,
    },
    balao: {
      position: "fixed",
      top: balaoTop,
      left: balaoLeft,
      right: "auto",
      bottom: "auto",
      width: larguraBalao,
    },
  };
}

export default function Orbinho() {
  const orbinho = useOrbinho();
  const botaoRef = useRef(null);
  const balaoRef = useRef(null);
  const [alvo, setAlvo] = useState(null);
  const medirAlvo = useCallback((retangulo) => setAlvo(retangulo), []);
  const { aberto, ajudaAtiva, etapaAtual, fechar: fecharOrbinho, iniciarTutorial } = orbinho;

  useEffect(() => {
    if (aberto) balaoRef.current?.focus();
  }, [aberto, ajudaAtiva, etapaAtual]);

  useEffect(() => {
    if (!orbinho.tutorial || !orbinho.etapa || !("painelMapa" in orbinho.etapa)) return;

    window.dispatchEvent(new CustomEvent("orbinho:preparar-mapa", {
      detail: {
        painel: orbinho.etapa.painelMapa,
        menuAberto: orbinho.etapa.menuMapaAberto,
      },
    }));
  }, [orbinho.etapa, orbinho.tutorial]);

  useEffect(() => {
    function iniciarTutorialSolicitado(evento) {
      const tutorialId = evento.detail?.id;
      if (!tutorialId) return;
      iniciarTutorial(tutorialId, evento.detail?.reiniciar === true);
    }
    window.addEventListener("orbinho:iniciar-tutorial", iniciarTutorialSolicitado);
    return () => window.removeEventListener("orbinho:iniciar-tutorial", iniciarTutorialSolicitado);
  }, [iniciarTutorial]);

  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key === "Escape" && aberto) {
        fecharOrbinho();
        window.requestAnimationFrame(() => botaoRef.current?.focus());
      }
    }
    document.addEventListener("keydown", fecharComEscape);
    return () => document.removeEventListener("keydown", fecharComEscape);
  }, [aberto, fecharOrbinho]);

  if (!orbinho.visivel) return null;

  const mensagemRota = mensagensPorRota[orbinho.tipoRota];
  const conteudoAjuda = orbinho.ajudaAtiva === "pagina"
    ? mensagemRota
    : mensagensAjuda[orbinho.ajudaAtiva];
  const titulo = orbinho.etapa?.titulo || conteudoAjuda?.titulo || "Assistente do sistema Arquivos";
  const mensagem = orbinho.etapa?.mensagem || conteudoAjuda?.mensagem || configuracaoOrbinho.mensagemInicial;
  const mostrarMenu = !orbinho.tutorial && !orbinho.ajudaAtiva;
  const layoutTutorial = orbinho.tutorial
    ? calcularLayoutTutorial(alvo)
    : {};

  function escolherOpcao(opcao) {
    if (opcao === "tour") return orbinho.iniciarTutorial("menuMestre", false);
    if (opcao === "tourGrid") return orbinho.iniciarTutorial("gridMapa", true);
    if (opcao === "tourFicha") return orbinho.iniciarTutorial("fichaPersonagem", true);
    if (opcao === "reiniciar") return orbinho.iniciarTutorial("menuMestre", true);
    orbinho.setAjudaAtiva(opcao);
  }

  function fechar() {
    fecharOrbinho();
    window.requestAnimationFrame(() => botaoRef.current?.focus());
  }

  return (
    <div className="orbinho" data-posicao={configuracaoOrbinho.posicao}>
      {orbinho.tutorial && (
        <DestaqueTutorial seletor={orbinho.etapa?.seletor} aoMedir={medirAlvo} />
      )}

      {aberto && (
        <BalaoOrbinho
          ref={balaoRef}
          titulo={titulo}
          mensagem={mensagem}
          etapa={orbinho.etapa}
          tipoRota={orbinho.tipoRota}
          tutorial={orbinho.tutorial}
          etapaAtual={orbinho.etapaAtual}
          totalEtapas={orbinho.tutorial?.etapas.length || 0}
          aoEscolher={escolherOpcao}
          aoProximo={orbinho.avancar}
          aoVoltar={orbinho.voltar}
          aoPular={orbinho.pular}
          aoFechar={fechar}
          aoVoltarMenu={() => orbinho.setAjudaAtiva(null)}
          mostrarMenu={mostrarMenu}
          estilo={layoutTutorial.balao}
        />
      )}

      <button
        ref={botaoRef}
        className={`orbinho-d20${orbinho.temMensagem ? " orbinho-d20--mensagem" : ""}${orbinho.tutorial ? " orbinho-d20--tour" : ""}`}
        style={layoutTutorial.orbinho}
        type="button"
        aria-label={aberto ? "Fechar Orbinho" : "Abrir Orbinho"}
        aria-expanded={aberto}
        onClick={aberto ? fechar : orbinho.abrir}
      >
        <img
          src={orbinhoImagem}
          alt=""
          aria-hidden="true"
          draggable="false"
        />
      </button>
    </div>
  );
}
