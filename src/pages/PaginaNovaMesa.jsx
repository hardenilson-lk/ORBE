import { useState } from "react";
import { Link, useNavigate } from "react-router";

import Cabecalho from "../components/Cabecalho.jsx";
import { criarMesaRemota, orbeOnlineHabilitado } from "../services/supabaseOrbe.js";
import { lerUsuarioAtual } from "../utils/contasOrbe.js";

import {
  aplicarMesaRemota,
  gerarIdMesa,
  lerMesasSalvas,
  salvarMesasLocal,
} from "../utils/mesas.js";

function PaginaNovaMesa() {
  const navigate = useNavigate();

  const [nomeCampanha, setNomeCampanha] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [idMesa] = useState(() => gerarIdMesa());
  const [criando, setCriando] = useState(false);
  const [erroCriacao, setErroCriacao] = useState("");

  async function criarMesa(evento) {
    evento.preventDefault();

    const nomeFinal = nomeCampanha.trim();

    if (!nomeFinal) {
      return;
    }

    const novaMesa = {
      id: idMesa,
      ownerId:
        lerUsuarioAtual()?.id ||
        "",
      criadaPorId:
        lerUsuarioAtual()?.id ||
        "",
      nomeCampanha: nomeFinal,
      descricao: descricao.trim(),
      arquivoInicial: "ARQUIVO 0001",
      codigoConvite: `ORBE-${String(idMesa).slice(-6).toUpperCase()}`,
      criadaEm: new Date().toISOString(),
    };

    if (orbeOnlineHabilitado()) {
      setCriando(true);
      setErroCriacao("");
      try {
        const mesaRemota = await criarMesaRemota(novaMesa);
        aplicarMesaRemota(mesaRemota);
      } catch (falha) {
        setErroCriacao(falha?.message || "Não foi possível criar a mesa online. Tente novamente.");
        setCriando(false);
        return;
      }
      setCriando(false);
    } else {
      const mesasAtuais = lerMesasSalvas();
      salvarMesasLocal([
        novaMesa,
        ...mesasAtuais.filter((mesa) => String(mesa.id) !== String(novaMesa.id)),
      ]);
    }

    navigate(
      `/arquivos/mesa/${novaMesa.id}`,
    );
  }

  return (
    <div className="pagina">
      <Cabecalho />

      <main className="nova-mesa">
        <section className="nova-mesa__painel">
          <span className="nova-mesa__etiqueta">
            Novo arquivo
          </span>

          <h1>Criar nova mesa</h1>

          <p className="nova-mesa__descricao">
            Preencha as informações iniciais da sua
            campanha.
          </p>

          <form
            className="formulario-mesa"
            onSubmit={criarMesa}
          >
            <label className="campo-formulario">
              <span>Nome da campanha</span>

              <input
                type="text"
                placeholder="Ex.: Acampamento Aurora"
                maxLength="60"
                required
                value={nomeCampanha}
                onChange={(evento) =>
                  setNomeCampanha(
                    evento.target.value,
                  )
                }
              />
            </label>

            <label className="campo-formulario">
              <span>Descrição</span>

              <textarea
                placeholder="Escreva uma breve apresentação da campanha..."
                rows="5"
                maxLength="500"
                value={descricao}
                onChange={(evento) =>
                  setDescricao(
                    evento.target.value,
                  )
                }
              />
            </label>

            <label className="campo-formulario">
              <span>
                Identificação do primeiro arquivo
              </span>

              <input
                type="text"
                value="ARQUIVO 0001"
                readOnly
              />
            </label>

            <div className="formulario-mesa__acoes">
              <Link
                className="formulario-mesa__cancelar"
                to="/arquivos"
              >
                Cancelar
              </Link>

              <button
                className="formulario-mesa__criar"
                type="submit"
                disabled={criando}
              >
                {criando ? "Criando arquivo..." : "Criar arquivo"}
              </button>
            </div>
            {erroCriacao ? <p className="formulario-mesa__erro" role="alert">{erroCriacao}</p> : null}
          </form>
        </section>
      </main>
    </div>
  );
}

export default PaginaNovaMesa;
