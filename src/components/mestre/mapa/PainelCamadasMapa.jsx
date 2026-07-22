const CAMADAS_MAPA = [
  { id: "mapa", nome: "Mapa", descricao: "Imagens enviadas para formar o chão e o cenário.", uso: "Destrave para mover, girar ou redimensionar imagens. Trave quando terminar a montagem." },
  { id: "objetos", nome: "Objetos", descricao: "Marcadores e elementos decorativos colocados sobre o cenário.", uso: "Use para separar objetos de cena do fundo principal sem afetar paredes ou tokens." },
  { id: "paredes", nome: "Paredes e aberturas", descricao: "Paredes, portas e janelas controlam passagem, linha de visão e iluminação.", uso: "Paredes ficam reservadas ao mestre. Portas e janelas não ocultas aparecem como elementos interativos; abertas liberam a visão, e portas trancadas impedem a abertura por jogadores." },
  { id: "tokens", nome: "Tokens", descricao: "Personagens, aliados, criaturas e NPCs presentes no tabuleiro.", uso: "A visibilidade individual de cada token é configurada em Tokens ou Permissões; esta camada controla o conjunto inteiro." },
  { id: "efeitos", nome: "Efeitos e luzes", descricao: "Escuridão, luz ambiente, fontes locais e cones de visão.", uso: "Desative para inspecionar o mapa sem iluminação. Trave para impedir a criação ou alteração acidental de fontes." },
  { id: "neblina", nome: "Neblina", descricao: "Cobertura usada para revelar a exploração aos poucos.", uso: "Ocultar a camada suspende sua exibição sem apagar as áreas já reveladas." },
  { id: "interface", nome: "Interface", descricao: "Coordenadas, régua e outros auxiliares de operação.", uso: "É uma camada de apoio. Ela não altera o cenário nem apaga conteúdo das demais camadas." },
];

function PainelCamadasMapa({ camadas, aoAlterar, aoFechar }) {
  return (
    <section className="painel-mapa__config-grid painel-camadas-mapa" data-assistente="mapa-painel-camadas">
      <header>
        <h3>Camadas da cena</h3>
        <button type="button" aria-label="Fechar painel" onClick={aoFechar}><span aria-hidden="true">×</span> Fechar</button>
      </header>
      <div className="painel-camadas-mapa__explicacao">
        <p><strong>Visível/Oculta</strong> controla somente a exibição da categoria inteira.</p>
        <p><strong>Travada/Editável</strong> controla se as ferramentas podem alterar aquela categoria.</p>
        <p>Ocultar ou travar <strong>não apaga</strong> o conteúdo salvo. A visibilidade individual dos tokens é configurada separadamente.</p>
      </div>
      <div className="painel-camadas-mapa__lista">
        {CAMADAS_MAPA.map(({ id, nome, descricao, uso }) => {
          const camada = camadas[id];
          return (
            <article className="painel-camadas-mapa__item" key={id}>
              <div>
                <strong>{nome}</strong>
                <small>{descricao}</small>
                <details>
                  <summary>Quando usar</summary>
                  <p>{uso}</p>
                </details>
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
