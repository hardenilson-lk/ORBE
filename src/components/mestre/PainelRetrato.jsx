import {
  useRef,
} from "react";

function obterIniciais(nome) {
  const partes =
    String(nome || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (partes.length === 0) {
    return "AR";
  }

  if (partes.length === 1) {
    return partes[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    `${partes[0][0]}${
      partes[
        partes.length - 1
      ][0]
    }`
  ).toUpperCase();
}

function PainelRetrato({
  nome = "",
  foto = "",
  aoAlterarFoto,
}) {
  const inputArquivo =
    useRef(null);

  function abrirSeletorFoto() {
    inputArquivo.current?.click();
  }

  function alterarFoto(evento) {
    const arquivo =
      evento.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const leitor =
      new FileReader();

    leitor.onload = () => {
      if (
        typeof aoAlterarFoto ===
        "function"
      ) {
        aoAlterarFoto(
          String(
            leitor.result || "",
          ),
        );
      }
    };

    leitor.readAsDataURL(
      arquivo,
    );

    evento.target.value = "";
  }

  return (
    <>
      <style>
        {`
          .ficha-arquivos
          .painel-retrato {
            display: grid;
            align-content: start;
            justify-items: center;
            min-width: 0;
          }

          .ficha-arquivos
          .painel-retrato__imagem {
            position: relative;
            display: grid;
            place-items: center;
            width: 105px;
            height: 105px;
            margin: 0;
            padding: 0;
            overflow: hidden;
            border: 4px solid #292019;
            border-radius: 50%;
            background:
              radial-gradient(
                circle at 50% 38%,
                rgba(116, 75, 42, 0.35),
                transparent 46%
              ),
              linear-gradient(
                145deg,
                #d8c6a7,
                #8e7559
              );
            box-shadow:
              0 0 0 3px
              rgba(
                238,
                226,
                202,
                0.9
              ),
              0 0 0 5px #39271a,
              inset 0 0 26px
              rgba(
                0,
                0,
                0,
                0.28
              );
            cursor: pointer;
          }

          .ficha-arquivos
          .painel-retrato__imagem:hover {
            border-color: #922c27;
            box-shadow:
              0 0 0 3px
              rgba(
                238,
                226,
                202,
                0.9
              ),
              0 0 0 5px #922c27,
              0 0 16px
              rgba(
                146,
                44,
                39,
                0.42
              ),
              inset 0 0 26px
              rgba(
                0,
                0,
                0,
                0.28
              );
          }

          .ficha-arquivos
          .painel-retrato__imagem:focus-visible {
            outline: 3px solid
              rgba(
                146,
                44,
                39,
                0.72
              );
            outline-offset: 7px;
          }

          .ficha-arquivos
          .painel-retrato__imagem img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            object-position: center;
            pointer-events: none;
          }

          .ficha-arquivos
          .painel-retrato__iniciais {
            color: #291d14;
            font-family:
              Georgia,
              "Times New Roman",
              serif;
            font-size: 1.5rem;
            font-weight: 900;
            pointer-events: none;
          }

          .ficha-arquivos
          .painel-retrato__aviso {
            position: absolute;
            inset: auto 0 0;
            padding: 5px 3px;
            background:
              rgba(
                22,
                14,
                9,
                0.82
              );
            color: #fff1d5;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
            font-size: 0.42rem;
            font-weight: 900;
            text-align: center;
            text-transform: uppercase;
            opacity: 0;
            transform:
              translateY(100%);
            transition:
              opacity 0.15s ease,
              transform 0.15s ease;
            pointer-events: none;
          }

          .ficha-arquivos
          .painel-retrato__imagem:hover
          .painel-retrato__aviso,
          .ficha-arquivos
          .painel-retrato__imagem:focus-visible
          .painel-retrato__aviso {
            opacity: 1;
            transform:
              translateY(0);
          }

          .ficha-arquivos
          .painel-retrato__arquivo {
            display: none;
          }

          @media (max-width: 720px) {
            .ficha-arquivos
            .painel-retrato {
              width: 130px;
              justify-self: center;
            }
          }
        `}
      </style>

      <div className="painel-retrato">
        <button
          className="painel-retrato__imagem"
          type="button"
          title={
            foto
              ? "Clique para trocar a foto"
              : "Clique para escolher uma foto"
          }
          aria-label={
            foto
              ? "Trocar foto do agente"
              : "Escolher foto do agente"
          }
          onClick={abrirSeletorFoto}
        >
          {foto ? (
            <img
              src={foto}
              alt={
                nome
                  ? `Retrato de ${nome}`
                  : "Retrato do agente"
              }
            />
          ) : (
            <span className="painel-retrato__iniciais">
              {obterIniciais(nome)}
            </span>
          )}

          <span className="painel-retrato__aviso">
            {foto
              ? "Trocar foto"
              : "Adicionar foto"}
          </span>
        </button>

        <input
          ref={inputArquivo}
          className="painel-retrato__arquivo"
          type="file"
          accept="image/*"
          onChange={alterarFoto}
        />
      </div>
    </>
  );
}

export default PainelRetrato;