import { useEffect, useState } from "react";
import { TIPOS_SALA_HOSPITAL } from "../temas/arquivos/tiposSalaHospital.js";
import { OBJETOS_HOSPITAL } from "../temas/arquivos/objetosHospital.js";
import { LUZES_HOSPITAL } from "../temas/arquivos/luzesHospital.js";

function simNao(valor) {
  return valor ? "Sim" : "Não";
}

function obterElemento(mapa, selecao) {
  if (!selecao) return null;
  if (selecao.tipo === "entrada" || selecao.tipo === "saida") return mapa[selecao.tipo];
  const colecoes = {
    sala: mapa.salas,
    corredor: mapa.corredores,
    parede: mapa.paredes,
    porta: mapa.portas,
    objeto: mapa.objetos || [],
    luz: mapa.luzes || [],
  };
  return colecoes[selecao.tipo]?.find(({ id }) => id === selecao.id) || null;
}

function CampoNumero({ nome, valor, aoAlterar, minimo = 0 }) {
  return (
    <label>
      <span>{nome}</span>
      <input type="number" min={minimo} step="1" value={valor} onChange={(evento) => aoAlterar(Number(evento.target.value))} />
    </label>
  );
}

function PropriedadesSala({ mapa, sala, aoExecutar }) {
  const [valores, setValores] = useState(sala);
  useEffect(() => setValores(sala), [sala]);
  const alterar = (campo, valor) => setValores((atuais) => ({ ...atuais, [campo]: valor }));
  return (
    <>
      <div className="editor-mapa__grade-campos">
        <CampoNumero nome="X" valor={valores.x} aoAlterar={(valor) => alterar("x", valor)} />
        <CampoNumero nome="Y" valor={valores.y} aoAlterar={(valor) => alterar("y", valor)} />
        <CampoNumero nome="Largura" valor={valores.largura} minimo={3} aoAlterar={(valor) => alterar("largura", valor)} />
        <CampoNumero nome="Altura" valor={valores.altura} minimo={3} aoAlterar={(valor) => alterar("altura", valor)} />
      </div>
      <button type="button" onClick={() => aoExecutar("alterar-sala", valores)}>Aplicar posição e tamanho</button>
      <label><span>Tipo de sala</span>
        <select value={sala.tipoTematico || "sala-comum"} onChange={(evento) => aoExecutar("tipo-sala-tematico", evento.target.value)}>
          {TIPOS_SALA_HOSPITAL.map((tipo) => <option value={tipo.id} key={tipo.id}>{tipo.nome}</option>)}
        </select>
      </label>
      <p>Nome: {sala.nome || "Ainda não distribuído"}</p>
      <button type="button" onClick={() => aoExecutar("regenerar-objetos-sala")}>Regenerar objetos da sala</button>
      <button type="button" onClick={() => aoExecutar("limpar-objetos-sala")}>Limpar objetos da sala</button>
      <button type="button" onClick={() => aoExecutar("regenerar-luzes-sala")}>Regenerar iluminação da sala</button>
      <button type="button" onClick={() => aoExecutar("limpar-luzes-sala")}>Limpar luzes da sala</button>
      <button type="button" disabled={sala.id === mapa.salaInicialId} onClick={() => aoExecutar("sala-inicial")}>Definir como inicial</button>
      <button type="button" disabled={sala.id === mapa.salaFinalId} onClick={() => aoExecutar("sala-final")}>Definir como final</button>
      <button type="button" onClick={() => aoExecutar("sala-secreta")}>
        {mapa.salasSecretasIds.includes(sala.id) ? "Desmarcar secreta" : "Marcar como secreta"}
      </button>
      <button type="button" className="editor-mapa__perigo" onClick={() => aoExecutar("excluir")}>Excluir sala</button>
    </>
  );
}

function PropriedadesObjeto({ objeto, aoExecutar }) {
  const [nome, setNome] = useState(objeto.nome);
  useEffect(() => setNome(objeto.nome), [objeto.id, objeto.nome]);
  return (
    <>
      <label><span>Tipo</span>
        <select value={objeto.tipo} onChange={(evento) => aoExecutar("tipo-objeto", evento.target.value)}>
          {OBJETOS_HOSPITAL.map((tipo) => <option value={tipo.id} key={tipo.id}>{tipo.nome}</option>)}
        </select>
      </label>
      <label><span>Nome</span><input value={nome} onChange={(evento) => setNome(evento.target.value)} onBlur={() => { if (nome.trim() && nome !== objeto.nome) aoExecutar("alterar-objeto", { nome: nome.trim() }); }} /></label>
      <p>Categoria: {objeto.categoria}<br />Sala: {objeto.salaId}<br />Posição: {objeto.x}, {objeto.y}<br />Dimensões: {objeto.largura} × {objeto.altura}<br />Rotação: {objeto.rotacao}°<br />Bloqueia movimento: {simNao(objeto.bloqueiaMovimento)}<br />Bloqueia visão: {simNao(objeto.bloqueiaVisao)}<br />Origem: {objeto.origem}</p>
      <button type="button" onClick={() => aoExecutar("rotacionar-objeto")}>Rotacionar 90° <kbd>Q</kbd></button>
      <label><input type="checkbox" checked={objeto.bloqueiaMovimento} onChange={(evento) => aoExecutar("alterar-objeto", { bloqueiaMovimento: evento.target.checked })} /> Bloqueia movimento</label>
      <label><input type="checkbox" checked={objeto.bloqueiaVisao} onChange={(evento) => aoExecutar("alterar-objeto", { bloqueiaVisao: evento.target.checked })} /> Bloqueia visão</label>
      <button type="button" className="editor-mapa__perigo" onClick={() => aoExecutar("excluir")}>Excluir objeto</button>
    </>
  );
}

function PropriedadesLuz({ luz, aoExecutar }) {
  const [nome, setNome] = useState(luz.nome);
  useEffect(() => setNome(luz.nome), [luz.id, luz.nome]);
  return (
    <>
      <label><span>Tipo</span>
        <select value={luz.tipo} onChange={(evento) => aoExecutar("alterar-luz", { tipo: evento.target.value })}>
          {LUZES_HOSPITAL.map((tipo) => <option value={tipo.id} key={tipo.id}>{tipo.nome}</option>)}
        </select>
      </label>
      <label><span>Nome</span><input value={nome} onChange={(evento) => setNome(evento.target.value)} onBlur={() => { if (nome.trim() && nome !== luz.nome) aoExecutar("alterar-luz", { nome: nome.trim() }); }} /></label>
      <CampoNumero nome="Alcance" valor={luz.alcance} minimo={1} aoAlterar={(valor) => aoExecutar("alterar-luz", { alcance: valor })} />
      <label><span>Intensidade: {Math.round(luz.intensidade * 100)}%</span><input type="range" min="0" max="1" step=".05" value={luz.intensidade} onChange={(evento) => aoExecutar("alterar-luz", { intensidade: Number(evento.target.value) })} /></label>
      <label><input type="checkbox" checked={luz.ativa} onChange={(evento) => aoExecutar("alterar-luz", { ativa: evento.target.checked })} /> Ativa</label>
      <label><input type="checkbox" checked={luz.piscando} onChange={(evento) => aoExecutar("alterar-luz", { piscando: evento.target.checked })} /> Piscando</label>
      <p>Posição: {luz.x}, {luz.y}<br />Sala: {luz.salaId || "Nenhuma"}<br />Origem: {luz.origem}<br />Objeto relacionado: {luz.objetoOrigemId || "Nenhum"}</p>
      <button type="button" className="editor-mapa__perigo" onClick={() => aoExecutar("excluir")}>Excluir luz</button>
    </>
  );
}

function PropriedadesCorredor({ corredor, aoExecutar }) {
  return (
    <>
      <label><span>Largura</span>
        <select value={corredor.largura} onChange={(evento) => aoExecutar("largura-corredor", Number(evento.target.value))}>
          <option value="1">1 célula</option><option value="2">2 células</option><option value="3">3 células</option>
        </select>
      </label>
      <p>Origem: {corredor.salaOrigemId}<br />Destino: {corredor.salaDestinoId}<br />Segmentos: {corredor.segmentos.length}</p>
      <button type="button" className="editor-mapa__perigo" onClick={() => aoExecutar("excluir")}>Excluir corredor</button>
    </>
  );
}

function PropriedadesParede({ parede, aoExecutar }) {
  return (
    <>
      <label><span>Tipo</span>
        <select value={parede.tipo === "porta" ? "comum" : parede.tipo} onChange={(evento) => aoExecutar("tipo-parede", evento.target.value)}>
          <option value="comum">Comum</option><option value="abertura">Abertura</option><option value="secreta">Secreta</option>
        </select>
      </label>
      <p>Orientação: {parede.orientacao}<br />Início: {parede.inicio.x}, {parede.inicio.y}<br />Fim: {parede.fim.x}, {parede.fim.y}</p>
      <button type="button" className="editor-mapa__perigo" onClick={() => aoExecutar("excluir")}>Excluir parede</button>
    </>
  );
}

function PropriedadesPorta({ porta, aoExecutar }) {
  return (
    <>
      <label><span>Estado</span>
        <select value={porta.estado} onChange={(evento) => aoExecutar("estado-porta", evento.target.value)}>
          <option value="aberta">Aberta</option><option value="fechada">Fechada</option><option value="trancada">Trancada</option><option value="secreta">Secreta</option>
        </select>
      </label>
      <label><span>Tipo especial</span>
        <select value={porta.tipoEspecial || "comum"} onChange={(evento) => aoExecutar("tipo-porta", evento.target.value)}>
          <option value="comum">Comum</option><option value="entrada">Entrada</option><option value="saida">Saída</option>
        </select>
      </label>
      <p>Trancada: {simNao(porta.trancada)}<br />Secreta: {simNao(porta.secreta)}<br />Parede: {porta.paredeId}</p>
      <button type="button" onClick={() => aoExecutar("mover-porta")}>Mover porta</button>
      <button type="button" className="editor-mapa__perigo" onClick={() => aoExecutar("excluir-porta-parede")}>Excluir e restaurar parede</button>
      <button type="button" className="editor-mapa__perigo" onClick={() => aoExecutar("excluir-porta-abertura")}>Excluir e criar abertura</button>
    </>
  );
}

export default function PainelPropriedadesEditorMapa({ mapa, selecao, aoExecutar }) {
  const item = obterElemento(mapa, selecao);
  return (
    <aside className="editor-mapa__painel editor-mapa__propriedades" aria-live="polite">
      <h3>Propriedades</h3>
      {!selecao || !item ? <p>Selecione um elemento para inspecioná-lo e editar suas propriedades.</p> : (
        <>
          <strong>{selecao.tipo === "saida" ? "Saída" : selecao.tipo} · {selecao.id}</strong>
          {selecao.tipo === "sala" ? <PropriedadesSala mapa={mapa} sala={item} aoExecutar={aoExecutar} /> : null}
          {selecao.tipo === "corredor" ? <PropriedadesCorredor corredor={item} aoExecutar={aoExecutar} /> : null}
          {selecao.tipo === "parede" ? <PropriedadesParede parede={item} aoExecutar={aoExecutar} /> : null}
          {selecao.tipo === "porta" ? <PropriedadesPorta porta={item} aoExecutar={aoExecutar} /> : null}
          {selecao.tipo === "objeto" ? <PropriedadesObjeto objeto={item} aoExecutar={aoExecutar} /> : null}
          {selecao.tipo === "luz" ? <PropriedadesLuz luz={item} aoExecutar={aoExecutar} /> : null}
          {(selecao.tipo === "entrada" || selecao.tipo === "saida") ? (
            <p>Posição: {item.x}, {item.y}<br />Sala: {item.salaId}<br />Lado: {item.lado}</p>
          ) : null}
        </>
      )}
    </aside>
  );
}
