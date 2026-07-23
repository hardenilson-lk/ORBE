import {
  Route,
  Routes,
} from "react-router";

import ProvedorAutenticacaoOrbe from "./autenticacao/ProvedorAutenticacaoOrbe.jsx";
import RotaProtegida from "./components/RotaProtegida.jsx";
import PaginaArquivos from "./pages/PaginaArquivos.jsx";
import PaginaInicial from "./pages/PaginaInicial.jsx";
import PaginaJogador from "./pages/PaginaJogador.jsx";
import PaginaLogin from "./pages/PaginaLogin.jsx";
import PaginaMestre from "./pages/PaginaMestre.jsx";
import PaginaMinhasMesas from "./pages/PaginaMinhasMesas.jsx";
import PaginaNovaMesa from "./pages/PaginaNovaMesa.jsx";
import PaginaPortalBiblioteca from "./pages/PaginaPortalBiblioteca.jsx";
import PaginaPortalFichas from "./pages/PaginaPortalFichas.jsx";
import PaginaPortalMesas from "./pages/PaginaPortalMesas.jsx";
import PaginaPortalSistemas from "./pages/PaginaPortalSistemas.jsx";
import { Orbinho } from "./modules/orbinho";

import "./App.css";

function App() {
  return (
    <ProvedorAutenticacaoOrbe>
      <Routes>
        <Route
          path="/"
          element={<PaginaLogin />}
        />

        <Route element={<RotaProtegida />}>
          <Route path="/inicio" element={<PaginaInicial />} />
          <Route path="/mesas" element={<PaginaPortalMesas />} />
          <Route path="/fichas" element={<PaginaPortalFichas />} />
          <Route path="/sistemas" element={<PaginaPortalSistemas />} />
          <Route path="/biblioteca" element={<PaginaPortalBiblioteca />} />

          <Route
            path="/arquivos"
            element={<PaginaArquivos />}
          />

          <Route
            path="/arquivos/nova-mesa"
            element={<PaginaNovaMesa />}
          />

          <Route
            path="/arquivos/minhas-mesas"
            element={<PaginaMinhasMesas />}
          />

          <Route
            path="/arquivos/mesa/:mesaId"
            element={<PaginaMestre />}
          />

          <Route
            path="/arquivos/jogador/:mesaId"
            element={<PaginaJogador />}
          />
        </Route>
      </Routes>

      <Orbinho />
    </ProvedorAutenticacaoOrbe>
  );
}

export default App;
