import { useState } from "react";
import AvisoSincronizacao from "./components/AvisoSincronizacao.jsx";
import CabecalhoMesaSonora from "./components/CabecalhoMesaSonora.jsx";
import ControleAudioExterno from "./components/ControleAudioExterno.jsx";
import ControlesGeraisSom from "./components/ControlesGeraisSom.jsx";
import FormularioSom from "./components/FormularioSom.jsx";
import ListaBotoesSom from "./components/ListaBotoesSom.jsx";
import ListaCenasSonoras from "./components/ListaCenasSonoras.jsx";
import PlayersExternos from "./components/PlayersExternos.jsx";
import useMesaSonora from "./hooks/useMesaSonora.js";
import { useMesaSonoraLiveKit } from "../mesaSonora/livekit/MesaSonoraLiveKitContext.jsx";
import "./MesaSonoraTeste.css";

export default function MesaSonoraTeste({ aoVoltar }) {
  const mesaSonora = useMesaSonora();
  const livekit = useMesaSonoraLiveKit();
  const [somEditado, setSomEditado] = useState(null);

  function confirmarLimpeza() {
    if (window.confirm("Limpar todos os sons e cenas salvos na Mesa Sonora?")) {
      mesaSonora.limparTeste();
      setSomEditado(null);
    }
  }

  return (
    <section className="mesa-sonora">
      <CabecalhoMesaSonora quantidade={mesaSonora.mesa.sons.length} ativos={mesaSonora.ativos.length} aoVoltar={aoVoltar} aoLimpar={confirmarLimpeza} />
      <AvisoSincronizacao conectado={livekit.conectado} podeTransmitir={livekit.podeTransmitir} estado={livekit.estadoTransmissao} erro={livekit.erroTransmissao} />
      <ControleAudioExterno
        conectado={livekit.conectado}
        podeTransmitir={livekit.podeTransmitir}
        transmitindo={livekit.capturandoAudioExterno}
        iniciando={livekit.iniciandoAudioExterno}
        erro={livekit.erroAudioExterno}
        nivel={livekit.nivelAudioExterno}
        aoIniciar={() => { void livekit.iniciarCapturaAudioExterno(); }}
        aoEncerrar={() => { void livekit.encerrarCapturaAudioExterno(); }}
      />
      <ControlesGeraisSom
        mesa={mesaSonora.mesa}
        busca={mesaSonora.busca} setBusca={mesaSonora.setBusca}
        categoria={mesaSonora.filtroCategoria} setCategoria={mesaSonora.setFiltroCategoria}
        origem={mesaSonora.filtroOrigem} setOrigem={mesaSonora.setFiltroOrigem}
        volumeSala={livekit.volumeSala} aoVolumeSala={livekit.setVolumeSala}
        meuVolume={livekit.meuVolume} aoMeuVolume={livekit.setMeuVolume}
        silenciado={livekit.silenciado} aoSilenciar={() => livekit.setSilenciado(!livekit.silenciado)}
        aoEncerrarFaixa={livekit.encerrarFaixa}
        aoParar={mesaSonora.pararTodos} aoPausar={mesaSonora.pausarTodos} aoRetomar={mesaSonora.retomarTodos} aoLimparFinalizados={mesaSonora.limparFinalizados}
      />
      <div className="mesa-sonora__corpo">
        <main>
          <ListaBotoesSom
            sons={mesaSonora.sonsFiltrados} aoTocar={mesaSonora.tocarSom} aoPausar={mesaSonora.pausarSom}
            aoParar={mesaSonora.pararSom} aoReiniciar={mesaSonora.reiniciarSom} aoEditar={setSomEditado}
            aoRemover={(id) => window.confirm("Remover este botão de som?") && mesaSonora.removerSom(id)}
          />
          <PlayersExternos sons={mesaSonora.mesa.sons} spotifyAtivoId={mesaSonora.spotifyAtivoId} registrar={mesaSonora.registrarPlayer} atualizar={mesaSonora.atualizarSom} />
        </main>
        <aside>
          <FormularioSom categorias={mesaSonora.mesa.categorias} sons={mesaSonora.mesa.sons} somEditado={somEditado} aoCancelar={() => setSomEditado(null)} aoSalvar={async (...args) => { await mesaSonora.salvarSom(...args); setSomEditado(null); }} />
          <ListaCenasSonoras cenas={mesaSonora.mesa.cenas} sons={mesaSonora.mesa.sons} aoSalvar={mesaSonora.salvarCena} aoRemover={mesaSonora.removerCena} aoAtivar={(cena) => { mesaSonora.ativarCena(cena); void livekit.publicarEstado({ cenaAtual: cena.nome, cenaId: cena.id }); }} aoParar={(cena) => { mesaSonora.pararCena(cena); void livekit.publicarEstado({ cenaAtual: "", cenaId: "" }); }} />
        </aside>
      </div>
    </section>
  );
}
