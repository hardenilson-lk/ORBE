import { useState } from "react";
import { Link, useNavigate } from "react-router";

import Cabecalho from "../components/Cabecalho.jsx";

import {
  gerarIdMesa,
  lerMesasSalvas,
  salvarMesas,
} from "../utils/mesas.js";

function PaginaNovaMesa() {
  const navigate = useNavigate();

  const [nomeCampanha, setNomeCampanha] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  function criarMesa(evento) {
    evento.preventDefault();

    const nomeFinal = nomeCampanha.trim();

    if (!nomeFinal) {
      return;
    }

    const novaMesa = {
      id: gerarIdMesa(),
      nomeCampanha: nomeFinal,
      descricao: descricao.trim(),
      arquivoInicial: "ARQUIVO 0001",
      criadaEm: new Date().toISOString(),
    };

    const mesasAtuais = lerMesasSalvas();

    salvarMesas([
      novaMesa,
      ...mesasAtuais,
    ]);

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
              >
                Criar arquivo
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default PaginaNovaMesa;