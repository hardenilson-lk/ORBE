import { useCallback, useEffect, useState } from "react";

import PortalLayout from "../components/portal/PortalLayout.jsx";
import useMesasOrbe from "../hooks/useMesasOrbe.js";
import {
  listarFichasPessoaisRemotas,
  orbeOnlineHabilitado,
  salvarFichaPessoalRemota,
  solicitarMigracaoFichaRemota,
} from "../services/supabaseOrbe.js";
import { criarFichaArquivosVazia } from "../utils/fichasArquivos.js";
import { lerUsuarioAtual } from "../utils/contasOrbe.js";

const CHAVE_FICHAS_PESSOAIS = "orbe:arquivos:fichas-pessoais";

function carregarFichasPessoaisLocais(usuarioId) {
  try {
    const fichas = JSON.parse(localStorage.getItem(CHAVE_FICHAS_PESSOAIS) || "[]");
    return Array.isArray(fichas)
      ? fichas.filter((ficha) => !usuarioId || ficha.jogadorId === usuarioId)
      : [];
  } catch {
    return [];
  }
}

function salvarFichaPessoalLocal(ficha) {
  const atuais = carregarFichasPessoaisLocais("");
  const lista = [ficha, ...atuais.filter((item) => item.id !== ficha.id)];
  localStorage.setItem(CHAVE_FICHAS_PESSOAIS, JSON.stringify(lista));
  return ficha;
}

export default function PaginaPortalFichas() {
  const [mesas] = useMesasOrbe();
  const usuario = lerUsuarioAtual();
  const usuarioId = usuario?.id || "";
  const [nome, setNome] = useState("");
  const [fichas, setFichas] = useState(() => carregarFichasPessoaisLocais(usuarioId));
  const [mesaPorFicha, setMesaPorFicha] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const recarregar = useCallback(async () => {
    if (!orbeOnlineHabilitado()) {
      setFichas(carregarFichasPessoaisLocais(usuarioId));
      return;
    }
    setCarregando(true);
    try {
      setFichas(await listarFichasPessoaisRemotas());
    } catch (erro) {
      setMensagem(erro?.message || "NÃ£o foi possÃ­vel carregar suas fichas.");
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  async function criar(evento) {
    evento.preventDefault();
    if (!nome.trim()) return;
    setCarregando(true);
    try {
      const novaFicha = criarFichaArquivosVazia({
        nome: nome.trim(),
        jogador: usuario?.nome || usuario?.usuario || "Jogador",
        jogadorId: usuarioId,
        origemFicha: "pessoal",
      });
      const fichaSalva = orbeOnlineHabilitado()
        ? await salvarFichaPessoalRemota(novaFicha)
        : salvarFichaPessoalLocal(novaFicha);
      setFichas((atuais) => [fichaSalva, ...atuais.filter((item) => item.id !== fichaSalva.id)]);
      setNome("");
      setMensagem("Ficha pessoal criada. Ela sÃ³ entrarÃ¡ em uma campanha depois da autorizaÃ§Ã£o do mestre.");
    } catch (erro) {
      setMensagem(erro?.message || "NÃ£o foi possÃ­vel salvar a ficha.");
    } finally {
      setCarregando(false);
    }
  }

  async function solicitarMigracao(ficha) {
    const mesaId = mesaPorFicha[ficha.id] || mesas[0]?.id || "";
    if (!mesaId) {
      setMensagem("Entre em uma mesa antes de solicitar a migraÃ§Ã£o.");
      return;
    }
    if (!orbeOnlineHabilitado()) {
      setMensagem("A autorizaÃ§Ã£o do mestre exige o modo online.");
      return;
    }
    setCarregando(true);
    try {
      const atualizada = await solicitarMigracaoFichaRemota(ficha.id, mesaId);
      setFichas((atuais) => atuais.map((item) => item.id === ficha.id ? atualizada : item));
      setMensagem("Ficha enviada ao mestre. Ela continuarÃ¡ pessoal atÃ© ser aprovada.");
    } catch (erro) {
      setMensagem(erro?.message || "NÃ£o foi possÃ­vel enviar a ficha ao mestre.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <PortalLayout titulo="Fichas de personagem" subtitulo="Crie seus agentes e solicite a migraÃ§Ã£o para uma campanha.">
      <section className="portal-grade" style={{ gridTemplateColumns: "minmax(280px,.75fr) minmax(0,1.65fr)" }}>
        <article className="portal-card">
          <span className="portal-etiqueta">Criar ficha pessoal</span>
          <h2>Novo agente</h2>
          <form className="portal-form" onSubmit={criar}>
            <label>Nome do personagem<input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Helena Duarte" /></label>
            <p>A ficha nasce no seu arquivo pessoal e nÃ£o entra automaticamente em nenhuma mesa.</p>
            <button className="portal-botao" type="submit" disabled={carregando}>Criar ficha</button>
          </form>
          {mensagem ? <p role="status">{mensagem}</p> : null}
        </article>

        <section className="portal-painel">
          <span className="portal-etiqueta">Arquivo pessoal</span>
          <h2>Minhas fichas</h2>
          {fichas.length ? (
            <div className="portal-lista">
              {fichas.map((ficha) => {
                const pendente = ficha.statusMigracao === "pendente";
                return (
                  <article className="portal-lista__item" key={ficha.id}>
                    <div>
                      <span className="portal-etiqueta">{pendente ? "Aguardando o mestre" : "Ficha pessoal"}</span>
                      <h3>{ficha.nome || "Agente sem nome"}</h3>
                      <p>{ficha.classe} Â· NEX {ficha.nex} Â· {ficha.jogador || usuario?.nome || "Jogador"}</p>
                    </div>
                    <div className="portal-form">
                      <label>
                        Migrar para
                        <select
                          value={mesaPorFicha[ficha.id] || mesas[0]?.id || ""}
                          onChange={(evento) => setMesaPorFicha((atual) => ({ ...atual, [ficha.id]: evento.target.value }))}
                          disabled={pendente || !mesas.length}
                        >
                          {!mesas.length ? <option value="">Nenhuma mesa disponÃ­vel</option> : null}
                          {mesas.map((mesa) => <option key={mesa.id} value={mesa.id}>{mesa.nomeCampanha || mesa.nome}</option>)}
                        </select>
                      </label>
                      <button className="portal-botao" type="button" disabled={pendente || carregando || !mesas.length} onClick={() => solicitarMigracao(ficha)}>
                        {pendente ? "Aguardando autorizaÃ§Ã£o" : "Migrar ficha"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : <p className="portal-vazio">{carregando ? "Carregando fichas..." : "Nenhuma ficha pessoal encontrada."}</p>}
        </section>
      </section>
    </PortalLayout>
  );
}
