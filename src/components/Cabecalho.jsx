import { Link } from "react-router";
import logoOrbe from "../assets/logo.png";

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <Link
        className="logo"
        to="/inicio"
        aria-label="Voltar para a página inicial do ORBE"
      >
        <img
          className="logo__imagem"
          src={logoOrbe}
          alt="Logo ORBE"
        />
      </Link>

      <nav className="menu">
        <Link to="/inicio">Início</Link>
        <Link to="/mesas">Mesas</Link>
        <Link to="/fichas">Fichas</Link>
      </nav>

      <Link className="botao-entrar" to="/">Conta</Link>
    </header>
  );
}
