const opcoesComuns = [
  { id: "pagina", texto: "O que é esta página?" },
];

const opcoesPorRota = {
  central: [
    { id: "criarMesa", texto: "Como criar uma mesa?" },
    { id: "acessarMesas", texto: "Como acessar minhas mesas?" },
  ],
  "nova-mesa": [
    { id: "criarMesa", texto: "Como criar uma mesa?" },
    { id: "acessarMesas", texto: "Como acessar minhas mesas?" },
  ],
  "minhas-mesas": [
    { id: "acessarMesas", texto: "Como acessar minhas mesas?" },
    { id: "criarMesa", texto: "Como criar uma mesa?" },
  ],
  mesa: [
    { id: "tour", texto: "Fazer um tour" },
    { id: "tourGrid", texto: "Aprender todos os recursos do grid" },
    { id: "tourFicha", texto: "Aprender a usar a ficha" },
    { id: "menuMestre", texto: "Como usar o menu do mestre?" },
    { id: "reiniciar", texto: "Reiniciar tutorial" },
  ],
};

export default function MenuOrbinho({ tipoRota, aoEscolher, aoFechar }) {
  const opcoes = [...opcoesComuns, ...(opcoesPorRota[tipoRota] || [])];

  return (
    <div className="orbinho-menu" aria-label="Opções do Orbinho">
      {opcoes.map((opcao) => (
        <button type="button" key={opcao.id} onClick={() => aoEscolher(opcao.id)}>
          {opcao.texto}
        </button>
      ))}
      <button type="button" onClick={aoFechar}>Fechar Orbinho</button>
    </div>
  );
}
