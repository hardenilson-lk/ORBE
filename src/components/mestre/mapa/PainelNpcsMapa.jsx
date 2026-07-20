import { useState } from "react";

import "./interacoesTokensMapa.css";

const NPC_INICIAL = {
  nome: "",
  foto: "",
  tipo: "NPC",
  defesa: 10,
  pvAtual: 10,
  pvMaximo: 10,
  peAtual: 0,
  peMaximo: 0,
  sanAtual: 0,
  sanMaximo: 0,
};

function PainelNpcsMapa({ npcs = [], aoCriar, aoAdicionarGrid, aoAbrirFicha, aoRemover, aoFechar }) {
  const [formulario, setFormulario] = useState(NPC_INICIAL);

  function atualizar(campo, valor) {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  }

  function criarNpc(evento) {
    evento.preventDefault();
    if (!formulario.nome.trim()) return;
    aoCriar({
      ...formulario,
      nome: formulario.nome.trim(),
      id: `npc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    });
    setFormulario(NPC_INICIAL);
  }

  return (
    <div
      className="painel-npcs-mapa__fundo"
      onPointerDown={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <section className="painel-npcs-mapa" data-assistente="mapa-painel-npcs" role="dialog" aria-modal="true" aria-labelledby="painel-npcs-titulo">
        <header>
          <div>
            <span>Arquivo de ameaças</span>
            <h2 id="painel-npcs-titulo">NPCs da cena</h2>
          </div>
          <button type="button" aria-label="Fechar painel de NPCs" onClick={aoFechar}>×</button>
        </header>

        <form onSubmit={criarNpc}>
          <h3>Criar mini ficha</h3>
          <div className="painel-npcs-mapa__campos">
            <label>Nome<input required value={formulario.nome} onChange={(evento) => atualizar("nome", evento.target.value)} /></label>
            <label>Imagem (URL)<input type="url" value={formulario.foto} onChange={(evento) => atualizar("foto", evento.target.value)} /></label>
            <label>PV<input type="number" min="0" value={formulario.pvMaximo} onChange={(evento) => {
              const valor = Number(evento.target.value) || 0;
              setFormulario((anterior) => ({ ...anterior, pvAtual: valor, pvMaximo: valor }));
            }} /></label>
            <label>Defesa<input type="number" min="0" value={formulario.defesa} onChange={(evento) => atualizar("defesa", Number(evento.target.value) || 0)} /></label>
          </div>
          <button type="submit">Criar NPC</button>
          <small>Criar não coloca o NPC automaticamente no grid.</small>
        </form>

        <div className="painel-npcs-mapa__lista">
          {npcs.length === 0 ? <p>Nenhum NPC criado nesta cena.</p> : npcs.map((npc) => (
            <article key={npc.id}>
              {npc.foto ? <img src={npc.foto} alt="" draggable="false" /> : <span>NPC</span>}
              <div>
                <strong>{npc.nome}</strong>
                <small>PV {npc.pvAtual ?? 0}/{npc.pvMaximo ?? 0} • Defesa {npc.defesa ?? 0}</small>
              </div>
              <button type="button" onClick={() => aoAbrirFicha(npc)}>Editar</button>
              <button type="button" onClick={() => aoAdicionarGrid(npc)}>Adicionar ao grid</button>
              <button className="painel-npcs-mapa__remover" type="button" onClick={() => aoRemover(npc)}>Excluir</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PainelNpcsMapa;
