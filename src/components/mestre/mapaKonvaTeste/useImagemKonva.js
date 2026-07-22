import { useEffect, useState } from "react";

export default function useImagemKonva(origem) {
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    if (!origem) {
      setImagem(null);
      return undefined;
    }

    let ativo = true;
    const elemento = new Image();
    elemento.crossOrigin = "anonymous";
    elemento.onload = () => ativo && setImagem(elemento);
    elemento.onerror = () => ativo && setImagem(null);
    elemento.src = origem;
    return () => { ativo = false; };
  }, [origem]);

  return imagem;
}
