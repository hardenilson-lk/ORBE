const PADRAO_ID_YOUTUBE = /^[a-zA-Z0-9_-]{11}$/;

export function extrairIdYouTube(valor = "") {
  try {
    const url = new URL(valor.trim());
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    let id = "";

    if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
    if (["youtube.com", "m.youtube.com"].includes(host)) {
      if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
      if (url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2] || "";
      if (url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2] || "";
    }

    return PADRAO_ID_YOUTUBE.test(id) ? id : "";
  } catch {
    return "";
  }
}

export function validarUrlYouTube(valor) {
  return Boolean(extrairIdYouTube(valor));
}

let promessaApiYouTube;

export function carregarApiYouTube() {
  if (typeof window === "undefined") return Promise.reject(new Error("Navegador indisponível."));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (promessaApiYouTube) return promessaApiYouTube;

  promessaApiYouTube = new Promise((resolve, reject) => {
    const callbackAnterior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      callbackAnterior?.();
      resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => reject(new Error("Não foi possível carregar o player do YouTube."));
      document.head.appendChild(script);
    }
  });

  return promessaApiYouTube;
}
