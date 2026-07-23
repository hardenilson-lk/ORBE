import {
  useEffect,
  useState,
} from "react";
import {
  Navigate,
  Outlet,
  useParams,
} from "react-router";

import useAutenticacaoOrbe from "../autenticacao/useAutenticacaoOrbe.js";
import {
  buscarMesaRemota,
} from "../services/supabaseOrbe.js";
import {
  lerUsuarioAtual,
} from "../utils/contasOrbe.js";
import {
  lerMesasSalvas,
  salvarMesasLocal,
  usuarioPodeAdministrarMesa,
} from "../utils/mesas.js";

export default function RotaMestreMesa() {
  const { mesaId = "local" } =
    useParams();

  const {
    online,
    usuario,
  } = useAutenticacaoOrbe();

  const [estado, setEstado] =
    useState({
      verificando: true,
      permitido: false,
    });

  useEffect(() => {
    let ativo = true;

    async function verificarAcesso() {
      const usuarioId =
        usuario?.id ||
        lerUsuarioAtual()?.id ||
        "";

      if (!usuarioId) {
        if (ativo) {
          setEstado({
            verificando: false,
            permitido: false,
          });
        }
        return;
      }

      if (online) {
        try {
          const mesa =
            await buscarMesaRemota(
              mesaId,
            );

          if (ativo) {
            setEstado({
              verificando: false,
              permitido:
                usuarioPodeAdministrarMesa(
                  mesa,
                  usuarioId,
                ),
            });
          }
        } catch {
          if (ativo) {
            setEstado({
              verificando: false,
              permitido: false,
            });
          }
        }
        return;
      }

      const mesas = lerMesasSalvas();
      const mesa = mesas.find(
        (item) =>
          String(item.id) ===
          String(mesaId),
      );

      if (
        mesa &&
        !mesa.ownerId &&
        !mesa.criadaPorId
      ) {
        const mesaMigrada = {
          ...mesa,
          ownerId: usuarioId,
          criadaPorId: usuarioId,
        };

        salvarMesasLocal(
          mesas.map((item) =>
            String(item.id) ===
            String(mesaId)
              ? mesaMigrada
              : item,
          ),
        );

        if (ativo) {
          setEstado({
            verificando: false,
            permitido: true,
          });
        }
        return;
      }

      if (ativo) {
        setEstado({
          verificando: false,
          permitido:
            usuarioPodeAdministrarMesa(
              mesa,
              usuarioId,
            ),
        });
      }
    }

    void verificarAcesso();

    return () => {
      ativo = false;
    };
  }, [
    mesaId,
    online,
    usuario?.id,
  ]);

  if (estado.verificando) {
    return (
      <main
        role="status"
        aria-live="polite"
      >
        Confirmando quem criou a
        mesa...
      </main>
    );
  }

  if (!estado.permitido) {
    return (
      <Navigate
        replace
        to={`/arquivos/jogador/${mesaId}`}
        state={{
          aviso:
            "Somente quem criou a sala pode entrar como mestre.",
        }}
      />
    );
  }

  return <Outlet />;
}
