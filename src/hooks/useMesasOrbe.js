import { useEffect, useState } from "react";

import {
  assinarMesasUsuarioRealtime,
  listarFichasRemotas,
  listarMesasRemotas,
  orbeOnlineHabilitado,
} from "../services/supabaseOrbe.js";
import { lerMesasSalvas, salvarMesasLocal } from "../utils/mesas.js";
import { salvarListaFichasArquivos } from "../utils/fichasArquivos.js";

function mesclarMesas(locais, remotas) {
  const remotasPorId = new Map(remotas.map((mesa) => [String(mesa.id), mesa]));
  const locaisPendentes = locais.filter((mesa) => !mesa.remoto && !remotasPorId.has(String(mesa.id)));
  return [...remotas, ...locaisPendentes];
}

export default function useMesasOrbe() {
  const [mesas, setMesas] = useState(() => lerMesasSalvas());

  useEffect(() => {
    if (!orbeOnlineHabilitado()) return undefined;
    let ativo = true;
    let cancelar = () => {};

    async function atualizar() {
      try {
        const remotas = await listarMesasRemotas();
        if (!ativo) return;
        const atualizadas = mesclarMesas(lerMesasSalvas(), remotas);
        const fichasPorMesa = await Promise.all(
          remotas.map(async (mesa) => [mesa.id, await listarFichasRemotas(mesa.id)]),
        );
        if (!ativo) return;
        salvarMesasLocal(atualizadas);
        fichasPorMesa.forEach(([mesaId, fichas]) => salvarListaFichasArquivos(mesaId, fichas));
        setMesas(atualizadas);
      } catch (erro) {
        console.warn("Não foi possível atualizar as mesas em tempo real.", erro);
      }
    }

    void atualizar();
    void assinarMesasUsuarioRealtime(atualizar, undefined, (erro) => {
      console.warn("Canal de mesas em tempo real indisponível.", erro);
    }).then((removerCanal) => {
      if (!ativo) removerCanal();
      else cancelar = removerCanal;
    });

    return () => {
      ativo = false;
      cancelar();
    };
  }, []);

  return [mesas, setMesas];
}
