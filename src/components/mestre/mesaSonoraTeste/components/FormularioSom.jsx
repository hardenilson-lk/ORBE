import { useEffect, useState } from "react";
import { CORES_SOM, MIME_AUDIO_ACEITOS, ORIGENS_SOM, ROTULOS_ORIGEM } from "../constants/mesaSonoraConstants.js";
import { formularioDoSom, normalizarAtalho, validarSom } from "../utils/mesaSonoraUtils.js";

export default function FormularioSom({ categorias, sons, somEditado, aoSalvar, aoCancelar }) {
  const [dados, setDados] = useState(() => formularioDoSom(somEditado));
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => { setDados(formularioDoSom(somEditado)); setArquivo(null); setErro(""); }, [somEditado]);
  const campo = (nome, valor) => setDados((anterior) => ({ ...anterior, [nome]: valor }));

  function enviar(evento) {
    evento.preventDefault();
    const mensagem = validarSom(dados, arquivo, sons, somEditado?.id);
    if (mensagem) { setErro(mensagem); return; }
    aoSalvar(dados, arquivo, somEditado?.id);
    setDados(formularioDoSom()); setArquivo(null); setErro("");
  }

  function capturarAtalho(evento) {
    evento.preventDefault();
    campo("atalho", normalizarAtalho(evento));
  }

  return (
    <form className="mesa-sonora__formulario" onSubmit={enviar}>
      <header><div><span>Canal de entrada</span><h3>{somEditado ? "Editar botão" : "Cadastrar som"}</h3></div>{somEditado && <button type="button" onClick={aoCancelar}>Cancelar edição</button>}</header>
      <div className="mesa-sonora__grade-formulario">
        <label>Nome<input name="nome" required maxLength="60" value={dados.nome} onChange={(e) => campo("nome", e.target.value)} /></label>
        <label>Origem<select name="origem" value={dados.origem} onChange={(e) => campo("origem", e.target.value)}>{Object.values(ORIGENS_SOM).map((origem) => <option key={origem} value={origem}>{ROTULOS_ORIGEM[origem]}</option>)}</select></label>
        <label>Categoria<select name="categoria" value={dados.categoria} onChange={(e) => campo("categoria", e.target.value)}>{categorias.map((categoria) => <option key={categoria}>{categoria}</option>)}<option>Personalizada</option></select></label>
        {dados.categoria === "Personalizada" && <label>Nova categoria<input value={dados.categoriaPersonalizada} onChange={(e) => campo("categoriaPersonalizada", e.target.value)} /></label>}
        {dados.origem === ORIGENS_SOM.LOCAL ? (
          <label className="mesa-sonora__campo-amplo">Arquivo MP3, WAV, OGG ou M4A<input type="file" accept={MIME_AUDIO_ACEITOS} onChange={(e) => setArquivo(e.target.files?.[0] || null)} /><small>{arquivo?.name || somEditado?.nomeArquivo || "Nenhum arquivo selecionado"}</small></label>
        ) : (
          <label className="mesa-sonora__campo-amplo">Link oficial<input name="url" type="url" value={dados.url} placeholder={dados.origem === ORIGENS_SOM.YOUTUBE ? "https://youtu.be/..." : "https://open.spotify.com/track/..."} onChange={(e) => campo("url", e.target.value)} /></label>
        )}
        <label>Ícone<input maxLength="4" value={dados.icone} onChange={(e) => campo("icone", e.target.value)} /></label>
        <label>Cor<select value={dados.cor} onChange={(e) => campo("cor", e.target.value)}>{CORES_SOM.map((cor) => <option key={cor} value={cor}>{cor}</option>)}</select></label>
        <label>Volume: {dados.volume}%<input type="range" min="0" max="100" value={dados.volume} onChange={(e) => campo("volume", Number(e.target.value))} /></label>
        <label>Fade in (s)<input type="number" min="0" max="30" value={dados.fadeIn} onChange={(e) => campo("fadeIn", Number(e.target.value))} /></label>
        <label>Fade out (s)<input type="number" min="0" max="30" value={dados.fadeOut} onChange={(e) => campo("fadeOut", Number(e.target.value))} /></label>
        {dados.origem === ORIGENS_SOM.LOCAL && <label>Atalho local<input readOnly placeholder="Clique e pressione" value={dados.atalho} onKeyDown={capturarAtalho} onClick={(e) => e.currentTarget.focus()} /><button type="button" className="mesa-sonora__limpar-atalho" onClick={() => campo("atalho", "")}>Remover atalho</button></label>}
      </div>
      <div className="mesa-sonora__opcoes">
        <label><input type="checkbox" checked={dados.loop} onChange={(e) => campo("loop", e.target.checked)} /> Repetir em loop</label>
        <label><input type="checkbox" checked={dados.tocarJunto} onChange={(e) => campo("tocarJunto", e.target.checked)} /> Pode tocar junto</label>
        <label><input type="checkbox" checked={dados.pararOutros} onChange={(e) => campo("pararOutros", e.target.checked)} /> Parar outros ao iniciar</label>
      </div>
      {erro && <p className="mesa-sonora__erro" role="alert">{erro}</p>}
      <button className="botao-console botao-console--primario" type="submit">{somEditado ? "Salvar alterações" : "Criar botão de som"}</button>
    </form>
  );
}
