import "./IndicadorConexaoMesa.css";

const ESTADOS = {
  conectando: { rotulo: "Conectando", detalhe: "Estabelecendo canal da mesa." },
  online: { rotulo: "Online", detalhe: "Mesa sincronizada." },
  reconectando: { rotulo: "Reconectando", detalhe: "Tentando recuperar a mesa." },
  offline: { rotulo: "Offline", detalhe: "As alteracoes locais continuam preservadas." },
  erro: { rotulo: "Erro de conexao", detalhe: "O canal realtime precisa ser recuperado." },
};

export default function IndicadorConexaoMesa({ estado = "conectando" }) {
  const configuracao = ESTADOS[estado] || ESTADOS.erro;
  return (
    <div
      className={`indicador-conexao-mesa indicador-conexao-mesa--${estado}`}
      role="status"
      aria-live="polite"
      title={configuracao.detalhe}
    >
      <span className="indicador-conexao-mesa__ponto" aria-hidden="true" />
      <span className="indicador-conexao-mesa__texto">
        {configuracao.rotulo}
      </span>
    </div>
  );
}
