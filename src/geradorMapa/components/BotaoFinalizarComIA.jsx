import { useState } from "react";
import { FINALIZADOR_IA_CONFIGURADO } from "../ia/configuracaoFinalizadorIA.js";
import { calcularHashEstruturalMapa } from "../ia/hashMapaIA.js";
import { prepararImagemBaseMapa } from "../ia/prepararImagemBaseMapa.js";
import { finalizarMapaComIA } from "../ia/servicoFinalizacaoIA.js";

export default function BotaoFinalizarComIA({ mapa, tema, aoAplicarFinalizacao, aoRemoverFinalizacao, finalizacao }) {
  const [estado, setEstado] = useState("");
  const [erro, setErro] = useState("");
  const ocupado = Boolean(estado);
  async function finalizar() {
    if (!FINALIZADOR_IA_CONFIGURADO || ocupado || !mapa) return;
    setErro("");
    setEstado("Preparando mapa...");
    try {
      const hashMapa = await calcularHashEstruturalMapa(mapa);
      setEstado("Enviando para IA...");
      const imagemBase = await prepararImagemBaseMapa(mapa);
      setEstado("Finalizando cenário...");
      const resultado = await finalizarMapaComIA({ imagemBase, tema, descricao: "Cenário de RPG organizado e jogável", hashMapa, aoAtualizarEstado: setEstado });
      aoAplicarFinalizacao?.(resultado);
      setEstado("Mapa finalizado");
      window.setTimeout(() => setEstado(""), 1600);
    } catch (causa) {
      setErro(causa.message || "Falha ao finalizar mapa.");
      setEstado("");
    }
  }
  return (
    <div className="gerador-mapa__finalizador-ia">
      <button type="button" className="gerador-mapa__gerar" onClick={finalizar} disabled={!FINALIZADOR_IA_CONFIGURADO || ocupado}>
        {estado || (finalizacao ? "Finalizar novamente" : "Finalizar com IA")}
      </button>
      {finalizacao ? <button type="button" onClick={aoRemoverFinalizacao} disabled={ocupado}>Remover finalização</button> : null}
      {!FINALIZADOR_IA_CONFIGURADO ? <small>Finalizador IA não configurado.</small> : null}
      {erro ? <output role="alert">{erro} <button type="button" onClick={finalizar}>Tentar novamente</button></output> : null}
    </div>
  );
}
