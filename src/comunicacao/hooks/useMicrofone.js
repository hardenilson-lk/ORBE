import { useEffect, useRef, useState } from "react";

export default function useMicrofone(obterFaixaMicrofone, aoErro) {
  const [testando, setTestando] = useState(false);
  const [nivel, setNivel] = useState(0);
  const contextoRef = useRef(null);
  const analisadorRef = useRef(null);
  const quadroRef = useRef(null);

  function parar() {
    cancelAnimationFrame(quadroRef.current);
    analisadorRef.current?.disconnect();
    void contextoRef.current?.close();
    analisadorRef.current = null;
    contextoRef.current = null;
    setTestando(false);
    setNivel(0);
  }

  function alternar() {
    if (testando) return parar();
    const faixa = obterFaixaMicrofone?.();
    if (!faixa) return aoErro?.("Entre na voz antes de testar o microfone.");
    const AudioContexto = window.AudioContext || window.webkitAudioContext;
    if (!AudioContexto) return aoErro?.("O medidor de áudio não é suportado neste navegador.");
    const contexto = new AudioContexto();
    const analisador = contexto.createAnalyser();
    analisador.fftSize = 256;
    contexto.createMediaStreamSource(new MediaStream([faixa])).connect(analisador);
    contextoRef.current = contexto;
    analisadorRef.current = analisador;
    setTestando(true);
    const amostras = new Uint8Array(analisador.frequencyBinCount);
    const medir = () => {
      analisador.getByteFrequencyData(amostras);
      const media = amostras.reduce((soma, valor) => soma + valor, 0) / amostras.length;
      setNivel(Math.min(100, Math.round(media * 1.5)));
      quadroRef.current = requestAnimationFrame(medir);
    };
    medir();
  }

  useEffect(() => parar, []);
  return { testando, nivel, alternarTeste: alternar, pararTeste: parar };
}
