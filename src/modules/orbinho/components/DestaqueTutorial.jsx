import { useEffect, useState } from "react";

export default function DestaqueTutorial({ seletor, aoMedir }) {
  const [retangulo, setRetangulo] = useState(null);

  useEffect(() => {
    let temporizador;
    let elemento = seletor ? document.querySelector(seletor) : null;
    let observador;

    function medir() {
      if (!elemento) {
        setRetangulo(null);
        aoMedir?.(null);
        return;
      }

      const caixa = elemento.getBoundingClientRect();
      const medida = {
        top: caixa.top,
        left: caixa.left,
        width: caixa.width,
        height: caixa.height,
        right: caixa.right,
        bottom: caixa.bottom,
      };
      setRetangulo(medida);
      aoMedir?.(medida);
    }

    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      temporizador = window.setTimeout(medir, 280);
    } else {
      medir();
      observador = new MutationObserver(() => {
        elemento = seletor ? document.querySelector(seletor) : null;
        if (!elemento) return;
        observador.disconnect();
        elemento.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        temporizador = window.setTimeout(medir, 280);
      });
      observador.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("resize", medir);
    window.addEventListener("scroll", medir, true);

    return () => {
      window.clearTimeout(temporizador);
      observador?.disconnect();
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", medir, true);
    };
  }, [aoMedir, seletor]);

  if (!retangulo) {
    return <div className="orbinho-destaque orbinho-destaque--sem-alvo" aria-hidden="true" />;
  }

  return (
    <div
      className="orbinho-destaque"
      aria-hidden="true"
      style={{
        top: retangulo.top - 5,
        left: retangulo.left - 5,
        width: retangulo.width + 10,
        height: retangulo.height + 10,
      }}
    />
  );
}
