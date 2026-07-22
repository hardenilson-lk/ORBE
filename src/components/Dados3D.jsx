import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import DiceBox from "@3d-dice/dice-box";

import "./Dados3D.css";

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

    const [mensagem, setMensagem] = useState(
      "Carregando dados 3D...",
    );

    const [dadosVisiveis, setDadosVisiveis] =
      useState(false);

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

            assetPath: "/assets/dice-box/",

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
              if (
                !componenteFechado &&
                aoFinalizarRef.current
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
        async rolar(configuracao) {
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

          window.clearTimeout(
            temporizadorLimpezaRef.current,
          );

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
            setDadosVisiveis(false);
            throw erro;
          }
        },

        limpar() {
          window.clearTimeout(
            temporizadorLimpezaRef.current,
          );

          if (caixaDadosRef.current) {
            caixaDadosRef.current.clear();
          }

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
