export default function TesteMicrofone({ conectado, testando, nivel, aoAlternar }) {
  return <div className="comunicacao-mesa__teste"><div><strong>Teste do microfone</strong><small>O medidor não reproduz eco.</small></div><div className="comunicacao-mesa__medidor" aria-label={`Nível do microfone: ${nivel}%`}><span style={{ width: `${nivel}%` }} /></div><button type="button" onClick={aoAlternar} disabled={!conectado}>{testando ? "Parar teste" : "Testar"}</button></div>;
}
