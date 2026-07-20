import { configuracaoOrbinho } from "../data/configuracaoOrbinho.js";

function lerJson(chave, valorPadrao) {
  try {
    const valor = window.localStorage.getItem(chave);
    return valor ? { ...valorPadrao, ...JSON.parse(valor) } : valorPadrao;
  } catch {
    return valorPadrao;
  }
}

function salvarJson(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // O assistente continua funcionando quando o armazenamento está indisponível.
  }
}

export function lerEstadoOrbinho() {
  return lerJson(configuracaoOrbinho.chavesArmazenamento.estado, {
    aberto: configuracaoOrbinho.aberturaAutomatica,
    jaInteragiu: false,
  });
}

export function salvarEstadoOrbinho(estado) {
  salvarJson(configuracaoOrbinho.chavesArmazenamento.estado, estado);
}

export function lerTutoriaisOrbinho() {
  return lerJson(configuracaoOrbinho.chavesArmazenamento.tutoriais, {
    menuMestre: {
      concluido: false,
      pulado: false,
      ultimaEtapa: 0,
    },
    fichaPersonagem: {
      concluido: false,
      pulado: false,
      ultimaEtapa: 0,
    },
  });
}

export function salvarTutoriaisOrbinho(tutoriais) {
  salvarJson(configuracaoOrbinho.chavesArmazenamento.tutoriais, tutoriais);
}
