import ControlesVoz from "./ControlesVoz.jsx";
import ListaParticipantesVoz from "./ListaParticipantesVoz.jsx";
import TesteMicrofone from "./TesteMicrofone.jsx";

import "../styles/ChatVoz.css";

export default function ChatVoz({ comunicacao, microfone, jogadoresEsperados, aoEnviarAlerta }) {
  const { conectado, conectando, microfoneMudo, audioSilenciado, estado, estadoConexao, participantes, falando, entrar, sair, alternarMicrofone, alternarAudio } = comunicacao;
  return <div className="comunicacao-mesa__voz">
    <div className={`comunicacao-mesa__estado-voz estado-${estadoConexao}`}><span className={conectado ? "ativo" : ""} /><div><strong>{conectado ? "Conectado à mesa" : conectando ? "Conectando..." : "Sala de voz"}</strong><small>{estado}</small></div></div>
    <button type="button" className={`comunicacao-mesa__entrar${conectado ? " sair" : ""}`} disabled={conectando} onClick={conectado ? () => sair() : entrar}>{conectado ? "Sair da voz" : conectando ? "Entrando..." : "Entrar na voz"}</button>
    <ControlesVoz conectado={conectado} microfoneMudo={microfoneMudo} audioSilenciado={audioSilenciado} aoAlternarMicrofone={alternarMicrofone} aoAlternarAudio={alternarAudio} aoPedirAtencao={() => aoEnviarAlerta("atencao")} aoPedirFala={() => aoEnviarAlerta("pedir-fala")} />
    <TesteMicrofone conectado={conectado} testando={microfone.testando} nivel={microfone.nivel} aoAlternar={microfone.alternarTeste} />
    <ListaParticipantesVoz participantes={participantes} falando={falando} totalEsperado={jogadoresEsperados + 1} />
  </div>;
}
