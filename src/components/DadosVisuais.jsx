import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import DadoPoliedrico from "./DadoPoliedrico.jsx";

import "./DadosVisuais.css";

const DadosVisuais = forwardRef(
  function DadosVisuais(
    {
      aoFinalizar,
    },
    referencia,
  ) {
    const temporizadorLimpezaRef = useRef(null);
    const temporizadorResultadoRef = useRef(null);

    const [dados, setDados] = useState([]);
    const [efeitoEspecial, setEfeitoEspecial] =
      useState("");

    useEffect(() => {
      return () => {
        window.clearTimeout(
          temporizadorLimpezaRef.current,
        );

        window.clearTimeout(
          temporizadorResultadoRef.current,
        );
      };
    }, []);

    function sortearPosicao(indice) {
      const coluna = indice % 4;

      const inicioX =
        -90 - coluna * 24;

      const inicioY =
        70 + (indice % 3) * 34;

      const finalX =
        20 + Math.random() * 60;

      const finalY =
        16 + Math.random() * 58;

      return {
        inicioX,
        inicioY,
        finalX,
        finalY,
        rotacaoMeio:
          380 + indice * 67,
        rotacaoFinal:
          720 + indice * 53,
        atraso:
          indice * 70,
      };
    }

    function identificarEfeito(
      resultados,
      lados,
    ) {
      if (lados !== 20) {
        return "";
      }

      const temCritico =
        resultados.some(
          (resultado) => resultado === 20,
        );

      const temFalha =
        resultados.some(
          (resultado) => resultado === 1,
        );

      if (temCritico && temFalha) {
        return "dados-visuais--complicacao";
      }

      if (temCritico) {
        return "dados-visuais--critico";
      }

      if (temFalha) {
        return "dados-visuais--falha";
      }

      return "";
    }

    useImperativeHandle(
      referencia,
      () => ({
        async rolar(configuracao) {
          const quantidade = Math.min(
            Math.max(
              Number(configuracao?.qty) || 1,
              1,
            ),
            18,
          );

          const lados =
            Number(configuracao?.sides) || 20;

          const modificador =
            Number(configuracao?.modifier) || 0;

          window.clearTimeout(
            temporizadorLimpezaRef.current,
          );

          window.clearTimeout(
            temporizadorResultadoRef.current,
          );

          const resultados = Array.from(
            {
              length: quantidade,
            },
            () =>
              Math.floor(
                Math.random() * lados,
              ) + 1,
          );

          const novosDados =
            resultados.map(
              (resultado, indice) => {
                const posicao =
                  sortearPosicao(indice);

                return {
                  id: `${Date.now()}-${indice}-${Math.random()}`,
                  lados,
                  resultado,
                  ...posicao,
                };
              },
            );

          const totalDados =
            resultados.reduce(
              (soma, resultado) =>
                soma + resultado,
              0,
            );

          const total =
            totalDados + modificador;

          setDados(novosDados);

          setEfeitoEspecial(
            identificarEfeito(
              resultados,
              lados,
            ),
          );

          const resposta = [
            {
              sides: lados,
              value: total,
              modifier: modificador,
              rolls: resultados.map(
                (resultado) => ({
                  sides: lados,
                  value: resultado,
                }),
              ),
            },
          ];

          temporizadorResultadoRef.current =
            window.setTimeout(() => {
              if (aoFinalizar) {
                aoFinalizar(resposta);
              }
            }, 1250);

          temporizadorLimpezaRef.current =
            window.setTimeout(() => {
              setDados([]);
              setEfeitoEspecial("");
            }, 5000);

          return resposta;
        },

        limpar() {
          window.clearTimeout(
            temporizadorLimpezaRef.current,
          );

          window.clearTimeout(
            temporizadorResultadoRef.current,
          );

          setDados([]);
          setEfeitoEspecial("");
        },
      }),
      [aoFinalizar],
    );

    if (dados.length === 0) {
      return null;
    }

    return (
      <div
        className={`dados-visuais ${efeitoEspecial}`}
        aria-hidden="true"
      >
        {dados.map((dado) => (
          <div
            className={`dado-animado dado-animado--d${dado.lados}`}
            key={dado.id}
            style={{
              "--inicio-x": `${dado.inicioX}px`,
              "--inicio-y": `${dado.inicioY}vh`,
              "--final-x": `${dado.finalX}vw`,
              "--final-y": `${dado.finalY}vh`,
              "--rotacao-meio": `${dado.rotacaoMeio}deg`,
              "--rotacao-final": `${dado.rotacaoFinal}deg`,
              "--atraso": `${dado.atraso}ms`,
            }}
          >
            <DadoPoliedrico
              lados={dado.lados}
              resultado={dado.resultado}
            />
          </div>
        ))}

        {efeitoEspecial && (
          <div className="dados-visuais__efeito">
            {Array.from(
              {
                length: 10,
              },
              (_, indice) => (
                <i
                  key={indice}
                  style={{
                    "--indice": indice,
                  }}
                />
              ),
            )}
          </div>
        )}
      </div>
    );
  },
);

export default DadosVisuais;