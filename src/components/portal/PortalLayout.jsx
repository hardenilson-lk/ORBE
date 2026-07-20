import { NavLink, useNavigate } from "react-router";

import logoOrbe from "../../assets/logo.png";
import { lerUsuarioAtual, nomeCurtoUsuario, sairContaOrbe } from "../../utils/contasOrbe.js";

import "./PortalLayout.css";

const NAVEGACAO = [
  ["/inicio", "Início"],
  ["/mesas", "Mesas"],
  ["/fichas", "Fichas"],
  ["/sistemas", "Sistemas"],
  ["/biblioteca", "Biblioteca"],
];

export default function PortalLayout({ titulo, subtitulo, children }) {
  const navegar = useNavigate();
  const usuario = lerUsuarioAtual();

  function sair() {
    sairContaOrbe();
    navegar("/");
  }

  return (
    <div className="portal-orbe">
      <header className="portal-orbe__topo">
        <NavLink className="portal-orbe__marca" to="/inicio" aria-label="ORBE — início">
          <img src={logoOrbe} alt="ORBE" />
        </NavLink>
        <nav className="portal-orbe__navegacao" aria-label="Navegação principal">
          {NAVEGACAO.map(([destino, rotulo]) => (
            <NavLink key={destino} to={destino}>{rotulo}</NavLink>
          ))}
        </nav>
        <div className="portal-orbe__usuario">
          <span>{nomeCurtoUsuario(usuario)} <small>| jogador</small></span>
          <button type="button" onClick={sair}>Sair</button>
        </div>
      </header>

      <main className="portal-orbe__pagina">
        <section className="portal-orbe__apresentacao">
          <span>Central de criação</span>
          <h1>{titulo}</h1>
          <p>{subtitulo}</p>
        </section>
        {children}
      </main>
    </div>
  );
}
