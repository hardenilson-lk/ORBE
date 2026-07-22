import { Howl, Howler } from "howler";

export function criarPlayerLocal(som, eventos = {}) {
  const formato = som.nomeArquivo?.split(".").pop()?.toLowerCase();

  return new Howl({
    src: [som.urlObjeto],
    format: formato ? [formato] : undefined,
    html5: true,
    loop: Boolean(som.loop),
    volume: Number(som.volume) / 100,
    onload: eventos.aoCarregar,
    onplay: eventos.aoTocar,
    onpause: eventos.aoPausar,
    onstop: eventos.aoParar,
    onend: eventos.aoFinalizar,
    onloaderror: (_, erro) => eventos.aoErro?.(String(erro)),
    onplayerror: (_, erro) => eventos.aoErro?.(String(erro)),
  });
}

export function definirVolumeGeralLocal(volume) {
  Howler.volume(Math.max(0, Math.min(1, Number(volume) / 100)));
}

export function revogarUrlObjeto(url) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}
