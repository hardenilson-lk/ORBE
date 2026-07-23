import { Link } from "react-router";

import PortalLayout from "../components/portal/PortalLayout.jsx";
import CentralSocialOrbe from "../components/social/CentralSocialOrbe.jsx";
import useMesasOrbe from "../hooks/useMesasOrbe.js";
import { listarFichasArquivos } from "../utils/fichasArquivos.js";

export default function PaginaInicial() {
  const [mesas] = useMesasOrbe();
  const totalFichas = mesas.reduce((total, mesa) => total + listarFichasArquivos(mesa.id).length, 0);

  return (
    <PortalLayout titulo="Suas mesas, mundos e histórias" subtitulo="Tudo o que você precisa para preparar, reunir e conduzir sua próxima sessão.">
      <section className="portal-painel portal-inicio-destaque">
        <div>
          <span className="portal-etiqueta">Central de criação</span>
          <h2>O próximo arquivo começa aqui.</h2>
          <p>Organize campanhas, prepare agentes e abra o mapa do sistema Arquivos sem perder o trabalho já construído.</p>
          <div className="portal-acoes"><Link className="portal-botao" to="/mesas">Abrir minhas mesas</Link><Link className="portal-botao" to="/arquivos/nova-mesa">Criar nova mesa</Link></div>
        </div>
        <div className="portal-inicio-destaque__numeros"><article><strong>{mesas.length}</strong><span>mesas</span></article><article><strong>{totalFichas}</strong><span>fichas</span></article><article><strong>ARQ</strong><span>sistema ativo</span></article></div>
      </section>
      <section className="portal-grade portal-inicio-atalhos">
        <article className="portal-card"><span className="portal-etiqueta">01 · campanhas</span><h2>Mesas</h2><p>Crie investigações, entre com convite e acesse mestre ou jogador.</p><Link className="portal-botao" to="/mesas">Gerenciar mesas</Link></article>
        <article className="portal-card"><span className="portal-etiqueta">02 · agentes</span><h2>Fichas</h2><p>Consulte todos os agentes vinculados às suas campanhas do Arquivos.</p><Link className="portal-botao" to="/fichas">Ver fichas</Link></article>
        <article className="portal-card"><span className="portal-etiqueta">03 · referência</span><h2>Biblioteca</h2><p>Conheça a estrutura do ORBE e as regras usadas pelo sistema atual.</p><Link className="portal-botao" to="/biblioteca">Abrir biblioteca</Link></article>
      </section>
      <CentralSocialOrbe />
    </PortalLayout>
  );
}
