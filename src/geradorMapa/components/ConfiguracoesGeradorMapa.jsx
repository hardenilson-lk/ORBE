import {
  LIMITES_DIMENSOES_MAPA,
  TAMANHOS_MAPA,
} from "../data/configuracoesIniciaisMapa.js";

const NIVEIS = [
  { id: "nenhuma", nome: "Nenhuma" },
  { id: "baixa", nome: "Baixa" },
  { id: "media", nome: "Média" },
  { id: "alta", nome: "Alta" },
];

const ILUMINACOES = [
  { id: "clara", nome: "Clara" },
  { id: "media", nome: "Média" },
  { id: "baixa", nome: "Baixa" },
  { id: "escura", nome: "Escura" },
  { id: "apagada", nome: "Apagada" },
];

const COMPLEXIDADES = [
  { id: "baixa", nome: "Simples" },
  { id: "media", nome: "Média" },
  { id: "alta", nome: "Complexa" },
];

export default function ConfiguracoesGeradorMapa({
  configuracoes,
  temas,
  aoAlterar,
  aoAlterarTamanho,
  aoGerarSeed,
}) {
  const personalizado = configuracoes.tamanho === "personalizado";

  return (
    <section className="gerador-mapa__secao gerador-mapa__configuracoes">
      <header>
        <span>Parâmetros</span>
        <h3>Configuração inicial</h3>
      </header>

      <div className="gerador-mapa__campos">
        <label htmlFor="gerador-tema">
          Tema
          <select id="gerador-tema" value={configuracoes.tema} onChange={(evento) => aoAlterar("tema", evento.target.value)}>
            {temas.map((tema) => <option value={tema.id} key={tema.id}>{tema.nome}</option>)}
          </select>
        </label>

        <label htmlFor="gerador-tamanho">
          Tamanho do mapa
          <select id="gerador-tamanho" value={configuracoes.tamanho} onChange={(evento) => aoAlterarTamanho(evento.target.value)}>
            {Object.entries(TAMANHOS_MAPA).map(([id, tamanho]) => (
              <option value={id} key={id}>
                {tamanho.nome}{tamanho.largura ? ` · ${tamanho.largura} × ${tamanho.altura}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="gerador-largura">
          Largura
          <input id="gerador-largura" type="number" min={LIMITES_DIMENSOES_MAPA.largura.minimo} max={LIMITES_DIMENSOES_MAPA.largura.maximo} value={configuracoes.largura} disabled={!personalizado} onChange={(evento) => aoAlterar("largura", evento.target.value)} />
        </label>

        <label htmlFor="gerador-altura">
          Altura
          <input id="gerador-altura" type="number" min={LIMITES_DIMENSOES_MAPA.altura.minimo} max={LIMITES_DIMENSOES_MAPA.altura.maximo} value={configuracoes.altura} disabled={!personalizado} onChange={(evento) => aoAlterar("altura", evento.target.value)} />
        </label>

        <label htmlFor="gerador-complexidade">
          Complexidade
          <select id="gerador-complexidade" value={configuracoes.complexidade} onChange={(evento) => aoAlterar("complexidade", evento.target.value)}>
            {COMPLEXIDADES.map((nivel) => <option value={nivel.id} key={nivel.id}>{nivel.nome}</option>)}
          </select>
        </label>

        <label htmlFor="gerador-salas">
          Quantidade de salas
          <input id="gerador-salas" type="number" min="3" max="30" value={configuracoes.quantidadeSalas} onChange={(evento) => aoAlterar("quantidadeSalas", evento.target.value)} />
        </label>

        <label htmlFor="gerador-corredores">
          Largura dos corredores
          <input id="gerador-corredores" type="number" min="1" max="3" value={configuracoes.larguraCorredores} onChange={(evento) => aoAlterar("larguraCorredores", evento.target.value)} />
        </label>

        <label htmlFor="gerador-decoracao">
          Decoração
          <select id="gerador-decoracao" value={configuracoes.decoracao} onChange={(evento) => aoAlterar("decoracao", evento.target.value)}>
            {NIVEIS.map((nivel) => <option value={nivel.id} key={nivel.id}>{nivel.nome}</option>)}
          </select>
        </label>

        <label htmlFor="gerador-iluminacao">
          Iluminação
          <select id="gerador-iluminacao" value={configuracoes.iluminacao} onChange={(evento) => aoAlterar("iluminacao", evento.target.value)}>
            {ILUMINACOES.map((nivel) => <option value={nivel.id} key={nivel.id}>{nivel.nome}</option>)}
          </select>
        </label>
        <label htmlFor="gerador-desgaste">
          Desgaste
          <select id="gerador-desgaste" value={configuracoes.desgaste} onChange={(evento) => aoAlterar("desgaste", evento.target.value)}>
            <option value="baixo">Baixo</option><option value="medio">Médio</option><option value="alto">Alto</option>
          </select>
        </label>
        <label htmlFor="gerador-sujeira">
          Sujeira
          <select id="gerador-sujeira" value={configuracoes.sujeira} onChange={(evento) => aoAlterar("sujeira", evento.target.value)}>
            <option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option>
          </select>
        </label>
        <label htmlFor="gerador-paranormal">
          Presença paranormal
          <select id="gerador-paranormal" value={configuracoes.presencaParanormal} onChange={(evento) => aoAlterar("presencaParanormal", evento.target.value)}>
            <option value="nenhuma">Nenhuma</option><option value="discreta">Discreta</option><option value="media">Média</option><option value="intensa">Intensa</option>
          </select>
        </label>

        <label htmlFor="gerador-secretas">
          Salas secretas
          <input id="gerador-secretas" type="number" min="0" max="10" value={configuracoes.salasSecretas} onChange={(evento) => aoAlterar("salasSecretas", evento.target.value)} />
        </label>

        <label className="gerador-mapa__seed" htmlFor="gerador-seed">
          Seed
          <span>
            <input id="gerador-seed" type="text" maxLength="80" value={configuracoes.seed} onChange={(evento) => aoAlterar("seed", evento.target.value)} />
            <button type="button" title="Gerar uma nova seed" onClick={aoGerarSeed}>Nova seed</button>
          </span>
        </label>
      </div>
    </section>
  );
}
