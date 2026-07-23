import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import DiceBox from "@3d-dice/dice-box";

import "./Dados3D.css";

const CAMINHO_ASSETS_DADOS = `${import.meta.env.BASE_URL}assets/dice-box/`;

const Dados3D = forwardRef(
  function Dados3D(
    {
      aoFinalizar,
    },
    referencia,
  ) {
    const areaDadosRef = useRef(null);
    const caixaDadosRef = useRef(null);
    const aoFinalizarRef = useRef(aoFinalizar);
    const temporizadorLimpezaRef = useRef(null);
    const ignorarFinalizacaoRef = useRef(false);

    const [mensagem, setMensagem] = useState(
      "Carregando dados 3D...",
    );

    const [dadosVisiveis, setDadosVisiveis] =
      useState(false);

    const [
      resultadoVisual,
      setResultadoVisual,
    ] = useState(null);

    useEffect(() => {
      aoFinalizarRef.current = aoFinalizar;
    }, [aoFinalizar]);

    useEffect(() => {
      let componenteFechado = false;
      const areaDados = areaDadosRef.current;

      async function iniciarDados() {
        try {
          const caixaDados = new DiceBox({
            id: "orbe-dice-canvas",

            container: "#dados-3d-area",

            assetPath: CAMINHO_ASSETS_DADOS,

            theme: "default",
            themeColor: "#9B5CFF",

            scale: 4.5,
            gravity: 1,
            mass: 1,
            friction: 0.8,
            restitution: 0.25,
            spinForce: 5,
            throwForce: 6,
            startingHeight: 8,

            enableShadows: true,
            offscreen: false,

            onRollComplete: (resultados) => {
              const deveNotificar = !ignorarFinalizacaoRef.current;
              ignorarFinalizacaoRef.current = false;

              if (
                !componenteFechado &&
                aoFinalizarRef.current &&
                deveNotificar
              ) {
                aoFinalizarRef.current(
                  resultados,
                );
              }

              window.clearTimeout(
                temporizadorLimpezaRef.current,
              );

              temporizadorLimpezaRef.current =
                window.setTimeout(() => {
                  if (
                    !componenteFechado &&
                    caixaDadosRef.current === caixaDados
                  ) {
                    caixaDados.clear();
                    setResultadoVisual(null);
                    setDadosVisiveis(false);
                  }
                }, 2500);
            },
          });

          await caixaDados.init();

          if (componenteFechado) {
            caixaDados.clear();
            return;
          }

          caixaDadosRef.current = caixaDados;

          caixaDados.show();

          setMensagem("");
        } catch (erro) {
          console.error(
            "Não foi possível carregar os dados 3D:",
            erro,
          );

          setMensagem(
            "Não foi possível carregar os dados 3D.",
          );
        }
      }

      iniciarDados();

      return () => {
        componenteFechado = true;

        window.clearTimeout(
          temporizadorLimpezaRef.current,
        );

        if (caixaDadosRef.current) {
          caixaDadosRef.current.clear();
          caixaDadosRef.current = null;
        }

        if (areaDados) {
          areaDados.innerHTML = "";
        }
      };
    }, []);

    useImperativeHandle(
      referencia,
      () => ({
        async rolar(configuracao, opcoes = {}) {
          if (!caixaDadosRef.current) {
            throw new Error(
              "Os dados 3D ainda estão carregando.",
            );
          }

          const quantidade =
            Number(configuracao?.qty) || 1;

          const lados =
            Number(configuracao?.sides) || 20;

          const modificador =
            Number(configuracao?.modifier) || 0;
          ignorarFinalizacaoRef.current =
            opcoes.notificarResultado === false;

          window.clearTimeout(
            temporizadorLimpezaRef.current,
          );

          setResultadoVisual(null);

          let notacao =
            `${quantidade}d${lados}`;

          if (modificador > 0) {
            notacao += `+${modificador}`;
          }

          if (modificador < 0) {
            notacao += `${modificador}`;
          }

          caixaDadosRef.current.show();
          setDadosVisiveis(true);

          try {
            return await caixaDadosRef.current.roll(
              notacao,
            );
          } catch (erro) {
            ignorarFinalizacaoRef.current = false;
            setDadosVisiveis(false);
            throw erro;
          }
        },

        mostrarResultado(rolagem = {}) {
          const valores = Array.isArray(
            rolagem.valores,
          )
            ? rolagem.valores
                .map(Number)
                .filter(Number.isFinite)
            : [];

          const valorUnico = Number(
            rolagem.valor,
          );

          const valoresExibidos =
            valores.length > 0
              ? valores
              : Number.isFinite(valorUnico)
                ? [valorUnico]
                : [];

          const lados = Number(
            rolagem.lados ||
              String(
                rolagem.dado ||
                  rolagem.tipo ||
                  "",
              ).replace(/\D/g, ""),
          );

          const modificador =
            Number(rolagem.modificador) ||
            0;

          const total = Number(
            rolagem.total ??
              rolagem.resultado,
          );

          window.clearTimeout(
            temporizadorLimpezaRef.current,
          );

          ignorarFinalizacaoRef.current = false;

          if (caixaDadosRef.current) {
            caixaDadosRef.current.clear();
          }

          setResultadoVisual({
            valores: valoresExibidos,
            lados:
              Number.isFinite(lados) &&
              lados > 0
                ? lados
                : null,
            modificador,
            total:
              Number.isFinite(total)
                ? total
                : valoresExibidos.reduce(
                    (soma, valor) =>
                      soma + valor,
                    0,
                  ) + modificador,
          });

          setDadosVisiveis(true);

          temporizadorLimpezaRef.current =
            window.setTimeout(() => {
              setResultadoVisual(null);
              setDadosVisiveis(false);
            }, 3000);
        },

        limpar() {
          window.clearTimeout(
            temporizadorLimpezaRef.current,
          );

          if (caixaDadosRef.current) {
            caixaDadosRef.current.clear();
          }

          setResultadoVisual(null);
          setDadosVisiveis(false);
        },
      }),
      [],
    );

    return (
      <div
        className="dados-3d"
        data-dados-visiveis={dadosVisiveis}
      >
        <div
          id="dados-3d-area"
          className="dados-3d__area"
          ref={areaDadosRef}
        />

        {resultadoVisual && (
          <div
            className="dados-3d__resultado-oficial"
            role="status"
            aria-live="polite"
          >
            <span className="dados-3d__resultado-legenda">
              Resultado da mesa
            </span>

            <div className="dados-3d__faces">
              {resultadoVisual.valores.map(
                (valor, indice) => (
                  <span
                    className="dados-3d__face"
                    key={`${valor}-${indice}`}
                  >
                    <small>
                      {resultadoVisual.lados
                        ? `d${resultadoVisual.lados}`
                        : "dado"}
                    </small>

                    <strong>{valor}</strong>
                  </span>
                ),
              )}
            </div>

            {(resultadoVisual.valores.length >
              1 ||
              resultadoVisual.modificador !==
                0) && (
              <strong className="dados-3d__total">
                {resultadoVisual.modificador ===
                0
                  ? `Total: ${resultadoVisual.total}`
                  : `Total com modificador: ${resultadoVisual.total}`}
              </strong>
            )}
          </div>
        )}

        {mensagem && (
          <span className="dados-3d__mensagem">
            {mensagem}
          </span>
        )}
      </div>
    );
  },
);

export default Dados3D;
