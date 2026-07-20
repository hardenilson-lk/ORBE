const CAMADAS_MAPA = [
  ["mapa", "Mapa", "Imagens que formam o cenário"],
  ["objetos", "Objetos", "Marcadores e elementos de cena"],
  ["paredes", "Paredes e portas", "Limites de visão e passagem"],
  ["tokens", "Tokens", "Personagens e NPCs"],
  ["efeitos", "Efeitos e luzes", "Iluminação e efeitos visuais"],
  ["neblina", "Neblina", "Áreas ocultas ou reveladas"],
  ["interface", "Interface", "Guias, coordenadas e auxiliares do mestre"],
];

function PainelCamadasMapa({ camadas, aoAlterar, aoFechar }) {
  return (
    <section className="painel-mapa__config-grid painel-camadas-mapa" data-assistente="mapa-painel-camadas">
      <header>
        <h3>Camadas da cena</h3>
        <button type="button" aria-label="Fechar painel" onClick={aoFechar}><span aria-hidden="true">×</span> Fechar</button>
      </header>
      <p className="painel-mapa__token-ajuda">O olho controla o que aparece. O cadeado impede alterações acidentais sem apagar o conteúdo.</p>
      <div className="painel-camadas-mapa__lista">
        {CAMADAS_MAPA.map(([id, nome, descricao]) => {
          const camada = camadas[id];
          return (
            <article className="painel-camadas-mapa__item" key={id}>
              <div>
                <strong>{nome}</strong>
                <small>{descricao}</small>
              </div>
              <button type="button" aria-pressed={camada.visivel} onClick={() => aoAlterar(id, "visivel", !camada.visivel)}>
                {camada.visivel ? "Visível" : "Oculta"}
              </button>
              <button type="button" aria-pressed={camada.bloqueada} onClick={() => aoAlterar(id, "bloqueada", !camada.bloqueada)}>
                {camada.bloqueada ? "Travada" : "Editável"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PainelCamadasMapa;
