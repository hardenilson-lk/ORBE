import { Fragment, useEffect, useMemo, useRef, useState, } from "react";
import { createPortal } from "react-dom";
import EditorTokenMapa from "./mapa/EditorTokenMapa.jsx";
import MenuContextualToken from "./mapa/MenuContextualToken.jsx";
import MiniFichaToken from "./mapa/MiniFichaToken.jsx";
import PainelNpcsMapa from "./mapa/PainelNpcsMapa.jsx";
import CamadaMedicaoMapa from "./mapa/CamadaMedicaoMapa.jsx";
import { calcularMedicaoMapa } from "./mapa/medicaoMapa.js";
import PainelCamadasMapa from "./mapa/PainelCamadasMapa.jsx";
import CamadaEstruturasMapa from "./mapa/CamadaEstruturasMapa.jsx";
import PainelEstruturasMapa from "./mapa/PainelEstruturasMapa.jsx";
import CamadaNeblinaMapa from "./mapa/CamadaNeblinaMapa.jsx";
import PainelNeblinaMapa from "./mapa/PainelNeblinaMapa.jsx";
import CamadaIluminacaoMapa from "./mapa/CamadaIluminacaoMapa.jsx";
import PainelIluminacaoMapa from "./mapa/PainelIluminacaoMapa.jsx";
import PainelPermissoesMapa from "./mapa/PainelPermissoesMapa.jsx";
import { podeControlarTokenMapa } from "./mapa/permissoesTokensMapa.js";
import "./PainelMapa.css";
const GRID_PADRAO = {
    colunas: 32,
    linhas: 17,
    tamanhoCelula: 64,
    cor: "#d8b96f",
    opacidade: 0.46,
    espessura: 1,
    linhaGrossaCada: 5,
    encaixarTokens: true,
    mostrarCoordenadas: false,
    unidadeMedida: "metros",
    metrosPorCasa: 1.5,
    modoDiagonal: "euclidiana",
};
const CAMERA_PADRAO = {
    zoom: 1,
    x: 0,
    y: 0,
};
const CAMADAS_PADRAO = {
    mapa: { visivel: true, bloqueada: true },
    objetos: { visivel: true, bloqueada: false },
    paredes: { visivel: true, bloqueada: false },
    tokens: { visivel: true, bloqueada: false },
    efeitos: { visivel: true, bloqueada: false },
    neblina: { visivel: true, bloqueada: false },
    interface: { visivel: true, bloqueada: true },
};
const FUNDO_PADRAO = {
    imagem: "",
    nome: "",
    x: 0,
    y: 0,
    largura: 2048,
    altura: 1088,
    rotacao: 0,
    opacidade: 1,
    bloqueado: true,
    ajustarAoGrid: true,
};
const TAMANHO_MINIMO_FUNDO = 40;
const DIRECOES_REDIMENSIONAMENTO = [
    ["n", "Linha superior"],
    ["s", "Linha inferior"],
    ["e", "Linha direita"],
    ["w", "Linha esquerda"],
    ["ne", "Canto superior direito"],
    ["nw", "Canto superior esquerdo"],
    ["se", "Canto inferior direito"],
    ["sw", "Canto inferior esquerdo"],
];
const CORES_TOKEN = [
    "#2d79cf",
    "#7650d8",
    "#a34949",
    "#3f8c70",
    "#a26e2f",
    "#556fb5",
];
const ROTULOS_PAINEIS_MAPA = {
    grid: "Grid",
    fundo: "Fundo",
    camadas: "Camadas",
    estruturas: "Paredes",
    neblina: "Neblina",
    luz: "Luz",
    medicao: "Régua",
    token: "Tokens",
    npc: "NPCs",
    permissoes: "Permissões",
};
function normalizarFundo(fundoRecebido, indice = 0) {
    const fundo = fundoRecebido && typeof fundoRecebido === "object" ? fundoRecebido : {};
    return {
        ...FUNDO_PADRAO,
        ...fundo,
        id: String(fundo.id || `mapa-${indice}`),
        nome: String(fundo.nome || `Parte do cenário ${indice + 1}`),
        imagem: String(fundo.imagem || ""),
        x: limitarNumero(fundo.x, 0, -100000, 100000),
        y: limitarNumero(fundo.y, 0, -100000, 100000),
        largura: limitarNumero(fundo.largura, FUNDO_PADRAO.largura, TAMANHO_MINIMO_FUNDO, 50000),
        altura: limitarNumero(fundo.altura, FUNDO_PADRAO.altura, TAMANHO_MINIMO_FUNDO, 50000),
        rotacao: limitarNumero(fundo.rotacao, 0, -360, 360),
        opacidade: limitarNumero(fundo.opacidade, 1, 0, 1),
        bloqueado: fundo.bloqueado !== false,
        ordem: limitarNumero(fundo.ordem, indice, -10000, 10000),
        camada: "mapa",
    };
}
function criarListaSegura(valor) {
    return Array.isArray(valor)
        ? valor
        : [];
}
function limitarNumero(valor, padrao, minimo, maximo) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) {
        return padrao;
    }
    return Math.min(maximo, Math.max(minimo, numero));
}
function segmentoCruzaBarreira(origem, destino, barreira) {
    const rx = destino.x - origem.x;
    const ry = destino.y - origem.y;
    const sx = barreira.fim.x - barreira.inicio.x;
    const sy = barreira.fim.y - barreira.inicio.y;
    const divisor = rx * sy - ry * sx;
    if (Math.abs(divisor) < 0.00001) return false;
    const qpx = barreira.inicio.x - origem.x;
    const qpy = barreira.inicio.y - origem.y;
    const t = (qpx * sy - qpy * sx) / divisor;
    const u = (qpx * ry - qpy * rx) / divisor;
    return t > 0.025 && t <= 1 && u >= 0 && u <= 1;
}
function normalizarGrid(gridRecebido) {
    const grid = gridRecebido &&
        typeof gridRecebido === "object"
        ? gridRecebido
        : {};
    return {
        ...GRID_PADRAO,
        ...grid,
        colunas: limitarNumero(grid.colunas, 32, 1, 200),
        linhas: limitarNumero(grid.linhas, 17, 1, 200),
        tamanhoCelula: limitarNumero(grid.tamanhoCelula, 64, 24, 160),
        opacidade: limitarNumero(grid.opacidade, 0.46, 0, 1),
        espessura: limitarNumero(grid.espessura, 1, 1, 6),
        linhaGrossaCada: limitarNumero(grid.linhaGrossaCada, 5, 0, 20),
        encaixarTokens: grid.encaixarTokens !== false,
        unidadeMedida: ["metros", "quadrados"].includes(grid.unidadeMedida) ? grid.unidadeMedida : "metros",
        metrosPorCasa: limitarNumero(grid.metrosPorCasa, 1.5, 0.1, 100),
        modoDiagonal: ["euclidiana", "alternada", "quadrados"].includes(grid.modoDiagonal) ? grid.modoDiagonal : "euclidiana",
    };
}
function normalizarToken(tokenRecebido, indice, grid) {
    const token = tokenRecebido &&
        typeof tokenRecebido ===
            "object"
        ? tokenRecebido
        : {};
    const tamanho = Math.round(limitarNumero(token.tamanho, 1, 1, 6));
    const xLegado = Number(token.coluna || 0) * grid.tamanhoCelula;
    const yLegado = Number(token.linha || 0) * grid.tamanhoCelula;
    const xRecebido = Number.isFinite(Number(token.x)) ? Number(token.x) : xLegado;
    const yRecebido = Number.isFinite(Number(token.y)) ? Number(token.y) : yLegado;
    const xLimitado = limitarNumero(xRecebido, 0, 0, Math.max(0, (grid.colunas - tamanho) * grid.tamanhoCelula));
    const yLimitado = limitarNumero(yRecebido, 0, 0, Math.max(0, (grid.linhas - tamanho) * grid.tamanhoCelula));
    const x = grid.encaixarTokens ? Math.round(xLimitado / grid.tamanhoCelula) * grid.tamanhoCelula : xLimitado;
    const y = grid.encaixarTokens ? Math.round(yLimitado / grid.tamanhoCelula) * grid.tamanhoCelula : yLimitado;
    const coluna = Math.round(x / grid.tamanhoCelula);
    const linha = Math.round(y / grid.tamanhoCelula);
    const tipo = token.tipo === "npc" || token.npcId ? "npc" : "jogador";
    return {
        ...token,
        id: token.id ||
            `token-${indice}`,
        fichaId: String(token.fichaId ||
            ""),
        npcId: String(token.npcId || ""),
        tipo,
        nome: String(token.nome ||
            ""),
        foto: String(token.foto ||
            ""),
        tamanho,
        coluna,
        linha,
        x,
        y,
        rotacao: limitarNumero(token.rotacao, 0, -360, 360),
        camada: String(token.camada || "tokens"),
        ordem: limitarNumero(token.ordem, indice + 1, -10000, 10000),
        mostrarNome: token.mostrarNome !==
            false,
        mostrarPv: token.mostrarPv !==
            false,
        bloqueado: token.bloqueado ===
            true,
        oculto: token.oculto === true,
        visaoAlcance: limitarNumero(token.visaoAlcance, 6, 0, 50),
        visaoCone: limitarNumero(token.visaoCone, 240, 45, 360),
        proprietario: String(token.proprietario || (tipo === "npc" ? "mestre" : token.fichaId || "")),
        permissoes: token.permissoes && typeof token.permissoes === "object"
            ? token.permissoes
            : { mestre: true, jogadores: tipo !== "npc" },
    };
}
function normalizarEstrutura(itemRecebido, indice, tipo) {
    const item = itemRecebido && typeof itemRecebido === "object" ? itemRecebido : {};
    const ponto = (valor) => ({
        x: limitarNumero(valor?.x, 0, 0, 100000),
        y: limitarNumero(valor?.y, 0, 0, 100000),
    });
    return {
        ...item,
        id: String(item.id || `${tipo}-${indice}`),
        inicio: ponto(item.inicio),
        fim: ponto(item.fim),
        aberta: tipo === "porta" && item.aberta === true,
        oculta: item.oculta === true,
        bloqueiaVisao: tipo === "parede" || item.aberta !== true,
        camada: "paredes",
    };
}
function normalizarMapa(mapaRecebido) {
    const mapaSeguro = mapaRecebido &&
        typeof mapaRecebido ===
            "object"
        ? mapaRecebido
        : {};
    const grid = normalizarGrid(mapaSeguro.grid);
    const fundoLegado = normalizarFundo(mapaSeguro.fundo, 0);
    const mapasRecebidos = criarListaSegura(mapaSeguro.mapas).filter((item) => item && typeof item === "object");
    const mapas = (mapasRecebidos.length > 0
        ? mapasRecebidos
        : fundoLegado.imagem ? [fundoLegado] : [])
        .map((item, indice) => normalizarFundo(item, indice));
    const fundoAtivoIdRecebido = String(mapaSeguro.fundoAtivoId || "");
    const fundoAtivoId = mapas.some((item) => item.id === fundoAtivoIdRecebido)
        ? fundoAtivoIdRecebido
        : mapas[0]?.id || "";
    const fundoAtivo = mapas.find((item) => item.id === fundoAtivoId) || fundoLegado;
    const camadasRecebidas = mapaSeguro.camadas && typeof mapaSeguro.camadas === "object" ? mapaSeguro.camadas : {};
    const camadas = Object.fromEntries(Object.entries(CAMADAS_PADRAO).map(([id, padrao]) => {
        const recebida = camadasRecebidas[id] && typeof camadasRecebidas[id] === "object" ? camadasRecebidas[id] : {};
        return [id, { visivel: recebida.visivel !== false, bloqueada: recebida.bloqueada === true || (recebida.bloqueada == null && padrao.bloqueada) }];
    }));
    const neblinaRecebida = mapaSeguro.neblina && typeof mapaSeguro.neblina === "object" ? mapaSeguro.neblina : {};
    const neblina = {
        ativa: neblinaRecebida.ativa === true,
        modo: String(neblinaRecebida.modo || "manual"),
        opacidade: limitarNumero(neblinaRecebida.opacidade, 0.92, 0.2, 1),
        previsualizarJogador: neblinaRecebida.previsualizarJogador === true,
        areasReveladas: criarListaSegura(neblinaRecebida.areasReveladas).map((area, indice) => ({
            ...area,
            id: String(area?.id || `area-${indice}`),
            tipo: ["retangulo", "circulo", "livre"].includes(area?.tipo) ? area.tipo : "retangulo",
            inicio: { x: limitarNumero(area?.inicio?.x, 0, 0, 100000), y: limitarNumero(area?.inicio?.y, 0, 0, 100000) },
            fim: { x: limitarNumero(area?.fim?.x, 0, 0, 100000), y: limitarNumero(area?.fim?.y, 0, 0, 100000) },
            pontos: criarListaSegura(area?.pontos).map((ponto) => ({ x: limitarNumero(ponto?.x, 0, 0, 100000), y: limitarNumero(ponto?.y, 0, 0, 100000) })),
        })),
    };
    const iluminacaoRecebida = mapaSeguro.iluminacao && typeof mapaSeguro.iluminacao === "object" ? mapaSeguro.iluminacao : {};
    const iluminacao = {
        modo: String(iluminacaoRecebida.modo || "claro"),
        luzAmbiente: limitarNumero(iluminacaoRecebida.luzAmbiente, 1, 0, 1),
        corAmbiente: String(iluminacaoRecebida.corAmbiente || "#ffffff"),
        visaoDinamica: Number(mapaSeguro.versao || 0) < 3
            ? true
            : iluminacaoRecebida.visaoDinamica === true,
        previsualizarJogador: iluminacaoRecebida.previsualizarJogador === true,
    };
    const luzes = criarListaSegura(mapaSeguro.luzes).map((luz, indice) => ({
        ...luz,
        id: String(luz?.id || `luz-${indice}`),
        x: limitarNumero(luz?.x, 0, 0, 100000),
        y: limitarNumero(luz?.y, 0, 0, 100000),
        raio: limitarNumero(luz?.raio, 320, 24, 5000),
        intensidade: limitarNumero(luz?.intensidade, 1, 0, 1),
        cor: String(luz?.cor || "#ffd36a"),
        camada: "efeitos",
    }));
    return {
        ...mapaSeguro,
        versao: 3,
        grid,
        camera: {
            ...CAMERA_PADRAO,
            ...(mapaSeguro.camera ||
                {}),
            zoom: limitarNumero(mapaSeguro.camera
                ?.zoom, 1, 0.35, 2.5),
        },
        fundo: fundoAtivo,
        mapas,
        fundoAtivoId,
        camadas,
        neblina,
        iluminacao,
        luzes,
        tokens: criarListaSegura(mapaSeguro.tokens).map((token, indice) => normalizarToken(token, indice, grid)),
        npcs: criarListaSegura(mapaSeguro.npcs).map((npc, indice) => ({
            ...npc,
            id: String(npc?.id || `npc-${indice}`),
            nome: String(npc?.nome || `NPC ${indice + 1}`),
            foto: String(npc?.foto || ""),
            tipo: String(npc?.tipo || "NPC"),
        })),
        paredes: criarListaSegura(mapaSeguro.paredes).map((item, indice) => normalizarEstrutura(item, indice, "parede")),
        portas: criarListaSegura(mapaSeguro.portas).map((item, indice) => normalizarEstrutura(item, indice, "porta")),
    };
}
function hexParaRgba(cor, opacidade) {
    const texto = String(cor ||
        "#d8b96f").replace("#", "");
    const completo = texto.length === 3
        ? texto
            .split("")
            .map((letra) => `${letra}${letra}`)
            .join("")
        : texto
            .padEnd(6, "0")
            .slice(0, 6);
    const vermelho = parseInt(completo.slice(0, 2), 16) || 0;
    const verde = parseInt(completo.slice(2, 4), 16) || 0;
    const azul = parseInt(completo.slice(4, 6), 16) || 0;
    return `rgba(${vermelho}, ${verde}, ${azul}, ${opacidade})`;
}
function obterIniciais(nome) {
    const partes = String(nome ||
        "Agente")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (partes.length === 0) {
        return "?";
    }
    if (partes.length === 1) {
        return partes[0]
            .slice(0, 2)
            .toUpperCase();
    }
    return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}
function obterCorToken(identificador) {
    const texto = String(identificador ||
        "token");
    const soma = texto
        .split("")
        .reduce((total, letra) => total +
        letra.charCodeAt(0), 0);
    return CORES_TOKEN[soma %
        CORES_TOKEN.length];
}
function calcularPorcentagem(atual, maximo) {
    const valorMaximo = Math.max(1, Number(maximo) ||
        1);
    const valorAtual = limitarNumero(atual, valorMaximo, 0, valorMaximo);
    return {
        atual: valorAtual,
        maximo: valorMaximo,
        porcentagem: limitarNumero((valorAtual /
            valorMaximo) *
            100, 0, 0, 100),
    };
}
function lerArquivoComoDataUrl(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload =
            () => resolve(String(leitor.result ||
                ""));
        leitor.onerror =
            () => reject(new Error("Não foi possível ler a imagem."));
        leitor.readAsDataURL(arquivo);
    });
}
function carregarImagem(origem) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();
        imagem.onload =
            () => resolve(imagem);
        imagem.onerror =
            () => reject(new Error("A imagem não pôde ser carregada."));
        imagem.src =
            origem;
    });
}
async function compactarImagemMapa(arquivo) {
    const dataUrlOriginal = await lerArquivoComoDataUrl(arquivo);
    const imagem = await carregarImagem(dataUrlOriginal);
    const maiorLado = Math.max(imagem.naturalWidth, imagem.naturalHeight);
    const escala = maiorLado > 2600
        ? 2600 /
            maiorLado
        : 1;
    const largura = Math.max(1, Math.round(imagem.naturalWidth *
        escala));
    const altura = Math.max(1, Math.round(imagem.naturalHeight *
        escala));
    const canvas = document.createElement("canvas");
    canvas.width =
        largura;
    canvas.height =
        altura;
    const contexto = canvas.getContext("2d");
    if (!contexto) {
        return {
            imagem: dataUrlOriginal,
            larguraOriginal: imagem.naturalWidth,
            alturaOriginal: imagem.naturalHeight,
        };
    }
    contexto.drawImage(imagem, 0, 0, largura, altura);
    let imagemCompactada = canvas.toDataURL("image/webp", 0.86);
    if (!imagemCompactada.startsWith("data:image/webp")) {
        imagemCompactada =
            canvas.toDataURL("image/jpeg", 0.86);
    }
    return {
        imagem: imagemCompactada ||
            dataUrlOriginal,
        larguraOriginal: imagem.naturalWidth,
        alturaOriginal: imagem.naturalHeight,
    };
}
function PainelMapa({ arquivoInicial = "ARQUIVO 0001", mapa = null, fichas = [], papelAtual = "mestre", jogadorAtualId = "", aoAtualizarFicha, aoAlterarMapa, aoAlterarMensagem, }) {
    const viewportRef = useRef(null);
    const arquivoFundoRef = useRef(null);
    const arrasteMapaRef = useRef(null);
    const arrasteFundoRef = useRef(null);
    const redimensionamentoFundoRef = useRef(null);
    const arrasteTokenRef = useRef(null);
    const ignorarCliqueTokenRef = useRef(false);
    const ignorarCliqueMapaRef = useRef(false);
    const teclaEspacoRef = useRef(false);
    const scrollSalvarRef = useRef(null);
    const mapaRef = useRef(normalizarMapa(mapa));
    const [mapaLocal, setMapaLocal,] = useState(() => normalizarMapa(mapa));
    const [tamanhoViewport, setTamanhoViewport,] = useState({
        largura: 0,
        altura: 0,
    });
    const [painelAtivo, setPainelAtivo,] = useState("");
    const [menuFerramentasAberto, setMenuFerramentasAberto] = useState(false);
    const [guiaAberto, setGuiaAberto,] = useState(false);
    const [arrastandoMapa, setArrastandoMapa,] = useState(false);
    const [arrastandoFundo, setArrastandoFundo,] = useState(false);
    const [redimensionandoFundo, setRedimensionandoFundo,] = useState(false);
    const [tokenArrastandoId, setTokenArrastandoId,] = useState("");
    const [tokenSelecionadoId, setTokenSelecionadoId,] = useState("");
    const [menuTokenPosicao, setMenuTokenPosicao,] = useState(null);
    const [miniFichaAberta, setMiniFichaAberta,] = useState(null);
    const [editorTokenAbertoId, setEditorTokenAbertoId,] = useState("");
    const [carregandoImagem, setCarregandoImagem,] = useState(false);
    const [urlFundo, setUrlFundo,] = useState("");
    const [medicao, setMedicao] = useState(null);
    const [ferramentaEstrutura, setFerramentaEstrutura] = useState("");
    const [ferramentaNeblina, setFerramentaNeblina] = useState("");
    const [ferramentaLuz, setFerramentaLuz] = useState("");
    const [previsualizacaoJogadorId, setPrevisualizacaoJogadorId] = useState("");
    const [npcParaExcluir, setNpcParaExcluir] = useState(null);
    const [aviso, setAviso,] = useState("Arraste tokens livremente ou ative o encaixe nas casas do grid.");
    useEffect(() => {
        const novoMapa = normalizarMapa(mapa);
        mapaRef.current =
            novoMapa;
        setMapaLocal(novoMapa);
    }, [mapa]);
    useEffect(() => {
        const tokenAindaExiste = mapaLocal.tokens.some((token) => token.id ===
            tokenSelecionadoId);
        if (tokenSelecionadoId &&
            !tokenAindaExiste) {
            setTokenSelecionadoId("");
        }
        if (editorTokenAbertoId && !mapaLocal.tokens.some((token) => token.id === editorTokenAbertoId)) {
            setEditorTokenAbertoId("");
        }
    }, [
        editorTokenAbertoId,
        mapaLocal.tokens,
        tokenSelecionadoId,
    ]);
    useEffect(() => {
        function controlarTecla(evento) {
            const campoEditavel = evento.target instanceof HTMLElement && evento.target.closest("input, textarea, select, [contenteditable='true']");
            if (campoEditavel || evento.code !== "Space") return;
            teclaEspacoRef.current = evento.type === "keydown";
            if (evento.type === "keydown") evento.preventDefault();
        }
        function limparTeclas() {
            teclaEspacoRef.current = false;
        }
        window.addEventListener("keydown", controlarTecla);
        window.addEventListener("keyup", controlarTecla);
        window.addEventListener("blur", limparTeclas);
        return () => {
            window.removeEventListener("keydown", controlarTecla);
            window.removeEventListener("keyup", controlarTecla);
            window.removeEventListener("blur", limparTeclas);
        };
    }, []);
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) {
            return undefined;
        }
        function atualizarTamanho() {
            setTamanhoViewport({
                largura: viewport.clientWidth,
                altura: viewport.clientHeight,
            });
        }
        atualizarTamanho();
        if (typeof ResizeObserver ===
            "undefined") {
            window.addEventListener("resize", atualizarTamanho);
            return () => {
                window.removeEventListener("resize", atualizarTamanho);
            };
        }
        const observador = new ResizeObserver(atualizarTamanho);
        observador.observe(viewport);
        return () => {
            observador.disconnect();
        };
    }, []);
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) {
            return;
        }
        const identificador = requestAnimationFrame(() => {
            viewport.scrollLeft =
                Math.max(0, Number(mapaLocal
                    .camera.x) || 0);
            viewport.scrollTop =
                Math.max(0, Number(mapaLocal
                    .camera.y) || 0);
        });
        return () => cancelAnimationFrame(identificador);
    }, [
        mapaLocal.camera.x,
        mapaLocal.camera.y,
        tamanhoViewport.largura,
        tamanhoViewport.altura,
    ]);
    useEffect(() => {
        return () => {
            if (scrollSalvarRef.current) {
                clearTimeout(scrollSalvarRef.current);
            }
        };
    }, []);
    useEffect(() => {
        function prepararPainelDoTour(evento) {
            const detalhe = evento.detail || {};
            if (typeof detalhe.menuAberto === "boolean") {
                setMenuFerramentasAberto(detalhe.menuAberto);
            }
            if (typeof detalhe.painel === "string") {
                setPainelAtivo(detalhe.painel);
                setFerramentaEstrutura("");
                setFerramentaNeblina("");
                setFerramentaLuz("");
            }
        }
        function abrirFerramentaPeloEscudo(evento) {
            const painel = evento.detail?.painel;
            if (typeof painel !== "string") return;
            setPainelAtivo(painel);
        }
        window.addEventListener("orbinho:preparar-mapa", prepararPainelDoTour);
        window.addEventListener("escudo:abrir-ferramenta-mapa", abrirFerramentaPeloEscudo);
        return () => {
            window.removeEventListener("orbinho:preparar-mapa", prepararPainelDoTour);
            window.removeEventListener("escudo:abrir-ferramenta-mapa", abrirFerramentaPeloEscudo);
        };
    }, []);
    const fichasSeguras = criarListaSegura(fichas);
    const grid = mapaLocal.grid;
    const camera = mapaLocal.camera;
    const mapas = criarListaSegura(mapaLocal.mapas);
    const fundo = mapas.find((item) => item.id === mapaLocal.fundoAtivoId) || mapaLocal.fundo;
    const tokens = mapaLocal.tokens;
    const painelGrid = painelAtivo ===
        "grid";
    const painelFundo = painelAtivo ===
        "fundo";
    const painelToken = painelAtivo ===
        "token";
    const painelNpc = painelAtivo ===
        "npc";
    const painelMedicao = painelAtivo === "medicao";
    const painelCamadas = painelAtivo === "camadas";
    const painelEstruturas = painelAtivo === "estruturas";
    const painelNeblina = painelAtivo === "neblina";
    const painelLuz = painelAtivo === "luz";
    const painelPermissoes = painelAtivo === "permissoes";
    const papelEfetivo = papelAtual === "mestre" && previsualizacaoJogadorId ? "jogador" : papelAtual;
    const jogadorEfetivoId = previsualizacaoJogadorId || jogadorAtualId;
    const fundoEditavel = Boolean(painelFundo &&
        fundo.imagem &&
        !fundo.bloqueado &&
        !mapaLocal.camadas.mapa.bloqueada);
    const tokenSelecionado = tokens.find((token) => token.id ===
        tokenSelecionadoId) || null;
    const tokenEditor = tokens.find((token) => token.id === editorTokenAbertoId) || null;
    const npcs = criarListaSegura(mapaLocal.npcs);
    const obterEntidadeDoToken = (token) => token?.tipo === "npc"
        ? npcs.find((npc) => npc.id === token.npcId) || null
        : fichasSeguras.find((ficha) => ficha.id === token?.fichaId) || null;
    const entidadeMiniFicha = miniFichaAberta?.tipo === "npc"
        ? npcs.find((npc) => npc.id === miniFichaAberta.id) || null
        : fichasSeguras.find((ficha) => ficha.id === miniFichaAberta?.id) || null;
    const tokensVisiveis = papelEfetivo === "mestre"
        ? tokens
        : tokens.filter((token) => !token.oculto);
    const larguraMundo = grid.colunas *
        grid.tamanhoCelula;
    const alturaMundo = grid.linhas *
        grid.tamanhoCelula;
    const larguraComZoom = larguraMundo *
        camera.zoom;
    const alturaComZoom = alturaMundo *
        camera.zoom;
    const larguraCanvas = Math.max(larguraComZoom, tamanhoViewport.largura);
    const alturaCanvas = Math.max(alturaComZoom, tamanhoViewport.altura);
    const barreirasVisao = [...mapaLocal.paredes, ...mapaLocal.portas.filter((porta) => !porta.aberta)];
    const fontesToken = tokensVisiveis.filter((token) => papelEfetivo === "mestre" || podeControlarTokenMapa({ token, papelAtual: papelEfetivo, jogadorAtualId: jogadorEfetivoId })).map((token) => {
        const ficha = obterEntidadeDoToken(token);
        const inventario = criarListaSegura(ficha?.inventario);
        const possuiLuz = inventario.some((item) => item?.ativo !== false && /lanterna|lampi[aã]o|luz qu[ií]mica|farol/i.test(`${item?.nome || ""} ${item?.descricao || ""}`));
        const alcance = limitarNumero(token.visaoAlcance, 6, 0, 50) + (possuiLuz ? 4 : 0);
        return {
            id: `visao-${token.id}`,
            x: token.x + (token.tamanho * grid.tamanhoCelula) / 2,
            y: token.y + (token.tamanho * grid.tamanhoCelula) / 2,
            raioPixels: alcance * grid.tamanhoCelula,
            raioCurtoPixels: Math.min(alcance * grid.tamanhoCelula, grid.tamanhoCelula * 1.35),
            angulo: ((90 + (Number(token.rotacao) || 0)) * Math.PI) / 180,
            amplitude: ((Number(token.visaoCone) || 240) * Math.PI) / 180,
            intensidade: 1,
            cor: "#f3d58a",
        };
    });
    const resultadoMedicao = useMemo(() => calcularMedicaoMapa({
        inicio: medicao?.inicio,
        fim: medicao?.fim,
        tamanhoCelula: grid.tamanhoCelula,
        modoDiagonal: grid.modoDiagonal,
        unidade: grid.unidadeMedida,
        metrosPorCasa: grid.metrosPorCasa,
    }), [medicao, grid.tamanhoCelula, grid.modoDiagonal, grid.unidadeMedida, grid.metrosPorCasa]);
    const margemHorizontal = larguraComZoom <
        tamanhoViewport.largura
        ? (tamanhoViewport.largura -
            larguraComZoom) / 2
        : 0;
    const margemVertical = alturaComZoom <
        tamanhoViewport.altura
        ? (tamanhoViewport.altura -
            alturaComZoom) / 2
        : 0;
    function mostrarAviso(texto) {
        setAviso(texto);
        if (typeof aoAlterarMensagem ===
            "function") {
            aoAlterarMensagem(texto);
        }
    }
    function registrarMapa(proximoMapa, mensagem = "Mapa atualizado.") {
        const mapaNormalizado = normalizarMapa(proximoMapa);
        mapaRef.current =
            mapaNormalizado;
        setMapaLocal(mapaNormalizado);
        if (typeof aoAlterarMapa ===
            "function") {
            aoAlterarMapa(mapaNormalizado);
        }
        mostrarAviso(mensagem);
    }
    function atualizarMapaSemSalvar(proximoMapa) {
        const mapaNormalizado = normalizarMapa(proximoMapa);
        mapaRef.current =
            mapaNormalizado;
        setMapaLocal(mapaNormalizado);
    }
    function salvarPosicaoCamera(mensagem = "Posição do mapa atualizada.") {
        const viewport = viewportRef.current;
        if (!viewport) {
            return;
        }
        registrarMapa({
            ...mapaRef.current,
            camera: {
                ...mapaRef.current
                    .camera,
                x: viewport.scrollLeft,
                y: viewport.scrollTop,
            },
        }, mensagem);
    }
    function atualizarGrid(campo, valor) {
        registrarMapa({
            ...mapaRef.current,
            grid: {
                ...mapaRef.current
                    .grid,
                [campo]: valor,
            },
        }, "Configuração do grid atualizada.");
    }
    function atualizarCamada(id, campo, valor) {
        registrarMapa({
            ...mapaRef.current,
            camadas: {
                ...mapaRef.current.camadas,
                [id]: { ...mapaRef.current.camadas[id], [campo]: valor },
            },
        }, `Camada ${id} atualizada.`);
    }
    function criarEstrutura(inicio, fim) {
        if (!ferramentaEstrutura || mapaRef.current.camadas.paredes.bloqueada) return;
        const campo = ferramentaEstrutura === "porta" ? "portas" : "paredes";
        const novo = normalizarEstrutura({
            id: `${ferramentaEstrutura}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            inicio,
            fim,
        }, mapaRef.current[campo].length, ferramentaEstrutura);
        registrarMapa({ ...mapaRef.current, [campo]: [...mapaRef.current[campo], novo] }, `${ferramentaEstrutura === "porta" ? "Porta" : "Parede"} criada.`);
    }
    function alterarEstrutura(tipo, id, alteracoes) {
        const campo = tipo === "porta" ? "portas" : "paredes";
        registrarMapa({
            ...mapaRef.current,
            [campo]: mapaRef.current[campo].map((item) => item.id === id ? normalizarEstrutura({ ...item, ...alteracoes }, 0, tipo) : item),
        }, "Estrutura atualizada.");
    }
    function removerEstrutura(tipo, id) {
        const campo = tipo === "porta" ? "portas" : "paredes";
        registrarMapa({ ...mapaRef.current, [campo]: mapaRef.current[campo].filter((item) => item.id !== id) }, "Estrutura removida.");
    }
    function atualizarNeblina(campo, valor) {
        registrarMapa({ ...mapaRef.current, neblina: { ...mapaRef.current.neblina, [campo]: valor } }, "Neblina atualizada.");
    }
    function adicionarAreaNeblina(area) {
        const novaArea = { ...area, id: `area-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
        atualizarNeblina("areasReveladas", [...mapaRef.current.neblina.areasReveladas, novaArea]);
    }
    function removerAreaNeblina(id) {
        atualizarNeblina("areasReveladas", mapaRef.current.neblina.areasReveladas.filter((area) => area.id !== id));
    }
    function atualizarIluminacao(campo, valor) {
        registrarMapa({ ...mapaRef.current, iluminacao: { ...mapaRef.current.iluminacao, [campo]: valor } }, "Iluminação atualizada.");
    }
    function adicionarLuz(posicao) {
        if (mapaRef.current.camadas.efeitos.bloqueada) return;
        const luz = { id: `luz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ...posicao, raio: grid.tamanhoCelula * 5, intensidade: 1, cor: "#ffd36a", camada: "efeitos" };
        registrarMapa({ ...mapaRef.current, luzes: [...mapaRef.current.luzes, luz] }, "Fonte de luz adicionada.");
    }
    function alterarLuz(id, alteracoes) {
        registrarMapa({ ...mapaRef.current, luzes: mapaRef.current.luzes.map((luz) => luz.id === id ? { ...luz, ...alteracoes } : luz) }, "Fonte de luz atualizada.");
    }
    function removerLuz(id) {
        registrarMapa({ ...mapaRef.current, luzes: mapaRef.current.luzes.filter((luz) => luz.id !== id) }, "Fonte de luz removida.");
    }
    function criarMapaComFundoAtualizado(mapaBase, alteracoes) {
        const fundoAtual = criarListaSegura(mapaBase.mapas).find((item) => item.id === mapaBase.fundoAtivoId) || mapaBase.fundo;
        const fundoAtualizado = { ...fundoAtual, ...alteracoes };
        return {
            ...mapaBase,
            fundo: fundoAtualizado,
            mapas: criarListaSegura(mapaBase.mapas).map((item) => item.id === fundoAtualizado.id ? fundoAtualizado : item),
        };
    }
    function atualizarFundo(campo, valor, mensagem = "Imagem de fundo atualizada.") {
        registrarMapa(criarMapaComFundoAtualizado(mapaRef.current, { [campo]: valor }), mensagem);
    }
    function atualizarFundoCompleto(alteracoes, mensagem = "Imagem de fundo atualizada.") {
        registrarMapa(criarMapaComFundoAtualizado(mapaRef.current, alteracoes), mensagem);
    }
    function adicionarFundo(alteracoes, mensagem) {
        const id = `mapa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const novoFundo = normalizarFundo({
            ...alteracoes,
            id,
            ordem: Math.max(-1, ...criarListaSegura(mapaRef.current.mapas).map((item) => Number(item.ordem) || 0)) + 1,
        }, criarListaSegura(mapaRef.current.mapas).length);
        registrarMapa({
            ...mapaRef.current,
            mapas: [...criarListaSegura(mapaRef.current.mapas), novoFundo],
            fundoAtivoId: id,
            fundo: novoFundo,
        }, mensagem);
    }
    function selecionarFundo(fundoId) {
        const selecionado = criarListaSegura(mapaRef.current.mapas).find((item) => item.id === fundoId);
        if (!selecionado) return;
        registrarMapa({ ...mapaRef.current, fundoAtivoId: fundoId, fundo: selecionado }, `${selecionado.nome} selecionado.`);
        setPainelAtivo("fundo");
    }
    function alterarOrdemFundo(direcao) {
        const ordens = mapas.map((item) => Number(item.ordem) || 0);
        atualizarFundo("ordem", direcao === "frente" ? Math.max(0, ...ordens) + 1 : Math.min(0, ...ordens) - 1, direcao === "frente" ? "Parte trazida para frente." : "Parte enviada para trás.");
    }
    function alternarPainel(nomePainel) {
        setPainelAtivo((painelAnterior) => painelAnterior ===
            nomePainel
            ? ""
            : nomePainel);
        setMenuFerramentasAberto(false);
    }
    function alternarBloqueioFundo() {
        if (!fundo.imagem) {
            mostrarAviso("Adicione uma imagem primeiro.");
            return;
        }
        const novoBloqueio = !fundo.bloqueado;
        atualizarFundo("bloqueado", novoBloqueio, novoBloqueio
            ? "Imagem travada."
            : "Imagem destravada. Arraste o centro, as linhas ou os cantos.");
    }
    function travarFundo() {
        if (!fundo.imagem ||
            fundo.bloqueado) {
            return;
        }
        atualizarFundo("bloqueado", true, "Imagem travada.");
    }
    function obterFichaDoToken(token) {
        return obterEntidadeDoToken(token);
    }
    function limitarCasaToken(coluna, linha, tamanho) {
        return {
            coluna: Math.round(limitarNumero(coluna, 0, 0, Math.max(0, grid.colunas -
                tamanho))),
            linha: Math.round(limitarNumero(linha, 0, 0, Math.max(0, grid.linhas -
                tamanho))),
        };
    }
    function criarAlteracaoCasa(coluna, linha, tamanho) {
        const casa = limitarCasaToken(coluna, linha, tamanho);
        return {
            ...casa,
            x: casa.coluna *
                grid.tamanhoCelula,
            y: casa.linha *
                grid.tamanhoCelula,
        };
    }
    function iniciarMedicao(ponto) {
        setMedicao({ inicio: ponto, fim: ponto, medindo: true });
    }
    function moverMedicao(ponto) {
        setMedicao((anterior) => anterior ? { ...anterior, fim: ponto } : anterior);
    }
    function finalizarMedicao(ponto) {
        setMedicao((anterior) => anterior ? { ...anterior, fim: ponto, medindo: false } : anterior);
        mostrarAviso("Medição concluída.");
    }
    function criarAlteracaoPosicao(xRecebido, yRecebido, tamanho) {
        const larguraToken = tamanho * grid.tamanhoCelula;
        const xLimitado = limitarNumero(xRecebido, 0, 0, Math.max(0, larguraMundo - larguraToken));
        const yLimitado = limitarNumero(yRecebido, 0, 0, Math.max(0, alturaMundo - larguraToken));
        const x = grid.encaixarTokens
            ? Math.round(xLimitado / grid.tamanhoCelula) * grid.tamanhoCelula
            : xLimitado;
        const y = grid.encaixarTokens
            ? Math.round(yLimitado / grid.tamanhoCelula) * grid.tamanhoCelula
            : yLimitado;
        return {
            x,
            y,
            coluna: Math.round(x / grid.tamanhoCelula),
            linha: Math.round(y / grid.tamanhoCelula),
        };
    }
    function adicionarToken(ficha) {
        const tokenExistente = mapaRef.current.tokens.find((token) => token.fichaId ===
            ficha.id);
        if (tokenExistente) {
            setTokenSelecionadoId(tokenExistente.id);
            mostrarAviso(`${ficha.nome ||
                "Agente"} já está no mapa.`);
            return;
        }
        const tamanho = 1;
        const casaInicial = criarAlteracaoCasa(Math.floor(grid.colunas / 2), Math.floor(grid.linhas / 2), tamanho);
        const novoToken = {
            id: `token-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 7)}`,
            fichaId: ficha.id,
            npcId: "",
            tipo: "jogador",
            nome: ficha.nome ||
                "Agente",
            foto: ficha.foto ||
                "",
            tamanho,
            ...casaInicial,
            mostrarNome: true,
            mostrarPv: true,
            bloqueado: false,
            oculto: false,
            camada: "tokens",
            ordem: mapaRef.current.tokens.length + 1,
            proprietario: ficha.jogador || ficha.id,
            permissoes: { mestre: true, jogadores: true },
        };
        registrarMapa({
            ...mapaRef.current,
            tokens: [
                ...mapaRef.current
                    .tokens,
                novoToken,
            ],
        }, `${ficha.nome ||
            "Agente"} foi adicionado ao mapa.`);
        setTokenSelecionadoId(novoToken.id);
    }
    function criarNpc(npc) {
        registrarMapa({
            ...mapaRef.current,
            npcs: [
                ...criarListaSegura(mapaRef.current.npcs),
                npc,
            ],
        }, `${npc.nome} foi criado. Use “Adicionar ao grid” quando desejar.`);
    }
    function atualizarNpc(npcId, alteracoes) {
        registrarMapa({
            ...mapaRef.current,
            npcs: criarListaSegura(mapaRef.current.npcs).map((npc) => npc.id === npcId
                ? { ...npc, ...alteracoes }
                : npc),
        }, "Mini ficha do NPC atualizada.");
    }
    function removerNpc(npc) {
        setNpcParaExcluir(npc);
    }
    function confirmarRemocaoNpc() {
        const npc = npcParaExcluir;
        if (!npc) return;
        registrarMapa({
            ...mapaRef.current,
            npcs: criarListaSegura(mapaRef.current.npcs).filter((item) => item.id !== npc.id),
            tokens: mapaRef.current.tokens.filter((token) => token.npcId !== npc.id),
        }, `${npc.nome} foi excluído da cena.`);
        if (miniFichaAberta?.tipo === "npc" && miniFichaAberta.id === npc.id) {
            setMiniFichaAberta(null);
        }
        setNpcParaExcluir(null);
    }
    function adicionarNpcAoGrid(npc) {
        const tamanho = 1;
        const posicao = criarAlteracaoCasa(Math.floor(grid.colunas / 2), Math.floor(grid.linhas / 2), tamanho);
        const novoToken = {
            id: `token-npc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            tipo: "npc",
            fichaId: "",
            npcId: npc.id,
            nome: npc.nome,
            foto: npc.foto || "",
            tamanho,
            ...posicao,
            mostrarNome: true,
            mostrarPv: true,
            bloqueado: false,
            oculto: false,
            camada: "tokens",
            ordem: mapaRef.current.tokens.length + 1,
            proprietario: "mestre",
            permissoes: { mestre: true, jogadores: false },
        };
        registrarMapa({
            ...mapaRef.current,
            tokens: [...mapaRef.current.tokens, novoToken],
        }, `${npc.nome} foi adicionado ao grid.`);
        setTokenSelecionadoId(novoToken.id);
    }
    function duplicarTokenNpc(token) {
        if (token.tipo !== "npc") {
            return;
        }
        const deslocamento = grid.encaixarTokens ? grid.tamanhoCelula : 18;
        const novoToken = {
            ...token,
            id: `token-npc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            ...criarAlteracaoPosicao(token.x + deslocamento, token.y + deslocamento, token.tamanho),
            ordem: Math.max(0, ...mapaRef.current.tokens.map((item) => Number(item.ordem) || 0)) + 1,
        };
        registrarMapa({
            ...mapaRef.current,
            tokens: [...mapaRef.current.tokens, novoToken],
        }, "Instância do NPC duplicada.");
        setTokenSelecionadoId(novoToken.id);
        setMenuTokenPosicao(null);
    }
    function atualizarToken(tokenId, alteracoes, mensagem = "Token atualizado.") {
        registrarMapa({
            ...mapaRef.current,
            tokens: mapaRef.current
                .tokens.map((token) => token.id ===
                tokenId
                ? {
                    ...token,
                    ...alteracoes,
                }
                : token),
        }, mensagem);
    }
    function girarToken(token, direcao = 1) {
        if (!token || !podeControlarToken(token) || token.bloqueado) {
            mostrarAviso(token?.bloqueado ? "Este token está bloqueado." : "Você não possui autorização para girar este token.");
            return;
        }
        const rotacaoAtual = Number(token.rotacao) || 0;
        const proximaRotacao = ((rotacaoAtual + (direcao * 90)) % 360 + 360) % 360;
        atualizarToken(token.id, { rotacao: proximaRotacao }, `Token virou para ${proximaRotacao}°; a luz acompanhou a direção.`);
        setTokenSelecionadoId(token.id);
        setMenuTokenPosicao(null);
    }
    function alterarOrdemToken(token, direcao) {
        const ordens = mapaRef.current.tokens.map((item) => Number(item.ordem) || 0);
        const novaOrdem = direcao === "frente"
            ? Math.max(0, ...ordens) + 1
            : Math.min(0, ...ordens) - 1;
        atualizarToken(token.id, { ordem: novaOrdem }, direcao === "frente"
            ? "Token trazido para frente."
            : "Token enviado para trás.");
        setMenuTokenPosicao(null);
    }
    function abrirMiniFichaDoToken(token) {
        const entidade = obterFichaDoToken(token);
        if (!entidade) {
            mostrarAviso("Este token não possui uma ficha vinculada.");
            return;
        }
        setMiniFichaAberta({
            tipo: token.tipo,
            id: token.tipo === "npc" ? token.npcId : token.fichaId,
        });
        setMenuTokenPosicao(null);
    }
    function atualizarEntidadeMiniFicha(alteracoes) {
        if (!miniFichaAberta) {
            return;
        }
        if (miniFichaAberta.tipo === "npc") {
            atualizarNpc(miniFichaAberta.id, alteracoes);
            return;
        }
        const ficha = fichasSeguras.find((item) => item.id === miniFichaAberta.id);
        if (ficha && typeof aoAtualizarFicha === "function") {
            aoAtualizarFicha({ ...ficha, ...alteracoes });
            mostrarAviso("Ficha do jogador atualizada.");
        }
    }
    function alterarTamanhoToken(token, tamanhoRecebido) {
        const novoTamanho = Math.round(limitarNumero(tamanhoRecebido, 1, 1, 6));
        atualizarToken(token.id, {
            tamanho: novoTamanho,
            ...criarAlteracaoCasa(token.coluna, token.linha, novoTamanho),
        }, "Tamanho do token atualizado.");
    }
    function removerToken(token) {
        const ficha = obterFichaDoToken(token);
        registrarMapa({
            ...mapaRef.current,
            tokens: mapaRef.current
                .tokens.filter((item) => item.id !==
                token.id),
        }, `${ficha?.nome ||
            token.nome ||
            "Token"} foi removido do mapa.`);
        setTokenSelecionadoId("");
        setMenuTokenPosicao(null);
    }
    function podeControlarToken(token) {
        return podeControlarTokenMapa({ token, papelAtual: papelEfetivo, jogadorAtualId: jogadorEfetivoId });
    }
    function movimentoCruzaEstrutura(token, alteracao) {
        const metade = (token.tamanho * grid.tamanhoCelula) / 2;
        const origem = { x: token.x + metade, y: token.y + metade };
        const destino = { x: alteracao.x + metade, y: alteracao.y + metade };
        return barreirasVisao.some((barreira) => segmentoCruzaBarreira(origem, destino, barreira));
    }
    function moverTokenSelecionadoPorClique(evento) {
        if (ignorarCliqueMapaRef.current) {
            ignorarCliqueMapaRef.current = false;
            return;
        }
        if (!tokenSelecionado || evento.target.closest("button, input, select, textarea, summary")) return;
        if (!podeControlarToken(tokenSelecionado) || tokenSelecionado.bloqueado) return;
        if (painelMedicao || ferramentaEstrutura || ferramentaNeblina || ferramentaLuz || fundoEditavel) return;
        const area = evento.currentTarget.getBoundingClientRect();
        const pontoX = ((evento.clientX - area.left) / Math.max(1, area.width)) * larguraMundo;
        const pontoY = ((evento.clientY - area.top) / Math.max(1, area.height)) * alturaMundo;
        const alteracao = grid.encaixarTokens
            ? criarAlteracaoCasa(Math.floor(pontoX / grid.tamanhoCelula), Math.floor(pontoY / grid.tamanhoCelula), tokenSelecionado.tamanho)
            : criarAlteracaoPosicao(pontoX - (tokenSelecionado.tamanho * grid.tamanhoCelula) / 2, pontoY - (tokenSelecionado.tamanho * grid.tamanhoCelula) / 2, tokenSelecionado.tamanho);
        if (movimentoCruzaEstrutura(tokenSelecionado, alteracao)) {
            mostrarAviso("Movimento bloqueado por uma parede ou porta fechada.");
            return;
        }
        atualizarToken(tokenSelecionado.id, alteracao, grid.encaixarTokens ? "Token movido para a casa escolhida." : "Token reposicionado.");
    }
    function iniciarArrasteToken(evento, token) {
        if (evento.button !== 0 ||
            fundoEditavel) {
            return;
        }
        if (token.bloqueado || !podeControlarToken(token)) {
            evento.preventDefault();
            evento.stopPropagation();
            mostrarAviso(token.bloqueado ? "Este token está bloqueado." : "Você não possui autorização para mover este token.");
            setTokenSelecionadoId(token.id);
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        evento.currentTarget
            .setPointerCapture(evento.pointerId);
        arrasteTokenRef.current = {
            pointerId: evento.pointerId,
            tokenId: token.id,
            inicioX: evento.clientX,
            inicioY: evento.clientY,
            x: token.x,
            y: token.y,
            tamanho: token.tamanho,
            movimentou: false,
            bloqueado: false,
        };
        setTokenSelecionadoId(token.id);
        setTokenArrastandoId(token.id);
        setMenuTokenPosicao(null);
    }
    function moverArrasteToken(evento) {
        const arraste = arrasteTokenRef.current;
        if (!arraste ||
            arraste.pointerId !==
                evento.pointerId) {
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        const deltaTelaX = evento.clientX - arraste.inicioX;
        const deltaTelaY = evento.clientY - arraste.inicioY;
        if (!arraste.movimentou && Math.hypot(deltaTelaX, deltaTelaY) < 4) {
            return;
        }
        const zoom = mapaRef.current.camera.zoom || 1;
        const alteracao = criarAlteracaoPosicao(
            arraste.x + deltaTelaX / zoom,
            arraste.y + deltaTelaY / zoom,
            arraste.tamanho,
        );
        const tokenAtual = mapaRef.current.tokens.find((token) => token.id ===
            arraste.tokenId);
        if (tokenAtual && movimentoCruzaEstrutura(tokenAtual, alteracao)) {
            arraste.bloqueado = true;
            return;
        }
        if (tokenAtual &&
            tokenAtual.x === alteracao.x &&
            tokenAtual.y === alteracao.y) {
            return;
        }
        arraste.movimentou = true;
        arraste.bloqueado = false;
        atualizarMapaSemSalvar({
            ...mapaRef.current,
            tokens: mapaRef.current
                .tokens.map((token) => token.id ===
                arraste.tokenId
                ? {
                    ...token,
                    ...alteracao,
                }
                : token),
        });
    }
    function finalizarArrasteToken(evento) {
        const arraste = arrasteTokenRef.current;
        if (!arraste ||
            arraste.pointerId !==
                evento.pointerId) {
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        arrasteTokenRef.current =
            null;
        setTokenArrastandoId("");
        if (arraste.bloqueado) {
            mostrarAviso("Movimento bloqueado por uma parede ou porta fechada.");
        } else if (arraste.movimentou) {
            ignorarCliqueTokenRef.current = true;
            registrarMapa(mapaRef.current, grid.encaixarTokens
                ? "Token movido e encaixado no grid."
                : "Token movido livremente.");
        }
    }
    function selecionarToken(evento, token) {
        evento.preventDefault();
        evento.stopPropagation();
        if (ignorarCliqueTokenRef.current) {
            ignorarCliqueTokenRef.current = false;
            return;
        }
        setTokenSelecionadoId(token.id);
        setMenuTokenPosicao(null);
        mostrarAviso(`${obterFichaDoToken(token)?.nome || token.nome || "Token"} selecionado.`);
    }
    function abrirMenuToken(evento, token) {
        evento.preventDefault();
        evento.stopPropagation();
        setTokenSelecionadoId(token.id);
        if (papelEfetivo !== "mestre") {
            girarToken(token, 1);
            return;
        }
        setMenuTokenPosicao({
            x: Math.max(12, Math.min(evento.clientX + 10, window.innerWidth - 222)),
            y: Math.max(12, Math.min(evento.clientY + 10, window.innerHeight - 360)),
        });
    }
    function centralizarMapa() {
        const viewport = viewportRef.current;
        if (!viewport) {
            return;
        }
        viewport.scrollLeft =
            Math.max(0, (viewport.scrollWidth -
                viewport.clientWidth) / 2);
        viewport.scrollTop =
            Math.max(0, (viewport.scrollHeight -
                viewport.clientHeight) / 2);
        salvarPosicaoCamera("Mapa centralizado.");
    }
    function alterarZoom(valor, pontoTela = null) {
        const viewport = viewportRef.current;
        const zoomAnterior = mapaRef.current
            .camera.zoom;
        const novoZoom = Math.round(limitarNumero(valor, zoomAnterior, 0.35, 2.5) * 10) / 10;
        let centroMundoX = larguraMundo / 2;
        let centroMundoY = alturaMundo / 2;
        let ancoraTelaX = viewport?.clientWidth / 2 || 0;
        let ancoraTelaY = viewport?.clientHeight / 2 || 0;
        if (viewport) {
            if (pontoTela) {
                const retangulo = viewport.getBoundingClientRect();
                ancoraTelaX = pontoTela.x - retangulo.left;
                ancoraTelaY = pontoTela.y - retangulo.top;
            }
            const margemAnteriorX = larguraMundo *
                zoomAnterior <
                viewport.clientWidth
                ? (viewport.clientWidth -
                    larguraMundo *
                        zoomAnterior) / 2
                : 0;
            const margemAnteriorY = alturaMundo *
                zoomAnterior <
                viewport.clientHeight
                ? (viewport.clientHeight -
                    alturaMundo *
                        zoomAnterior) / 2
                : 0;
            centroMundoX =
                (viewport.scrollLeft +
                    ancoraTelaX -
                    margemAnteriorX) /
                    zoomAnterior;
            centroMundoY =
                (viewport.scrollTop +
                    ancoraTelaY -
                    margemAnteriorY) /
                    zoomAnterior;
        }
        registrarMapa({
            ...mapaRef.current,
            camera: {
                ...mapaRef.current
                    .camera,
                zoom: novoZoom,
            },
        }, `Zoom em ${Math.round(novoZoom * 100)}%.`);
        requestAnimationFrame(() => {
            const viewportAtual = viewportRef.current;
            if (!viewportAtual) {
                return;
            }
            const margemNovaX = larguraMundo *
                novoZoom <
                viewportAtual
                    .clientWidth
                ? (viewportAtual
                    .clientWidth -
                    larguraMundo *
                        novoZoom) / 2
                : 0;
            const margemNovaY = alturaMundo *
                novoZoom <
                viewportAtual
                    .clientHeight
                ? (viewportAtual
                    .clientHeight -
                    alturaMundo *
                        novoZoom) / 2
                : 0;
            viewportAtual.scrollLeft =
                Math.max(0, centroMundoX *
                    novoZoom +
                    margemNovaX -
                    ancoraTelaX);
            viewportAtual.scrollTop =
                Math.max(0, centroMundoY *
                    novoZoom +
                    margemNovaY -
                    ancoraTelaY);
            salvarPosicaoCamera(`Zoom em ${Math.round(novoZoom * 100)}%.`);
        });
    }
    function ajustarNaTela() {
        const viewport = viewportRef.current;
        if (!viewport) {
            return;
        }
        const novoZoom = limitarNumero(Math.min(Math.max(100, viewport.clientWidth -
            34) /
            larguraMundo, Math.max(100, viewport.clientHeight -
            34) /
            alturaMundo), 1, 0.35, 2.5);
        registrarMapa({
            ...mapaRef.current,
            camera: {
                ...mapaRef.current
                    .camera,
                zoom: novoZoom,
            },
        }, "Mapa ajustado à tela.");
        requestAnimationFrame(centralizarMapa);
    }
    function iniciarArrasteMapa(evento) {
        const gestoCamera = evento.button === 1 ||
            (evento.button === 0 && teclaEspacoRef.current) ||
            evento.pointerType === "touch";
        if (!gestoCamera ||
            arrastandoFundo ||
            redimensionandoFundo ||
            arrasteTokenRef.current) {
            return;
        }
        const viewport = viewportRef.current;
        if (!viewport) {
            return;
        }
        evento.preventDefault();
        evento.currentTarget
            .setPointerCapture(evento.pointerId);
        arrasteMapaRef.current = {
            pointerId: evento.pointerId,
            inicioX: evento.clientX,
            inicioY: evento.clientY,
            scrollX: viewport.scrollLeft,
            scrollY: viewport.scrollTop,
            movimentou: false,
        };
        setArrastandoMapa(true);
    }
    function moverArrasteMapa(evento) {
        const arraste = arrasteMapaRef.current;
        const viewport = viewportRef.current;
        if (!arraste ||
            !viewport ||
            arraste.pointerId !==
                evento.pointerId) {
            return;
        }
        const deltaX = evento.clientX - arraste.inicioX;
        const deltaY = evento.clientY - arraste.inicioY;
        if (!arraste.movimentou && Math.hypot(deltaX, deltaY) < 5) return;
        arraste.movimentou = true;
        evento.preventDefault();
        viewport.scrollLeft =
            arraste.scrollX -
                deltaX;
        viewport.scrollTop =
            arraste.scrollY -
                deltaY;
    }
    function finalizarArrasteMapa(evento) {
        const arraste = arrasteMapaRef.current;
        if (!arraste ||
            arraste.pointerId !==
                evento.pointerId) {
            return;
        }
        arrasteMapaRef.current =
            null;
        setArrastandoMapa(false);
        if (arraste.movimentou) {
            ignorarCliqueMapaRef.current = true;
            salvarPosicaoCamera();
        }
    }
    function iniciarArrasteFundo(evento) {
        if (evento.button !== 0 ||
            !fundoEditavel) {
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        evento.currentTarget
            .setPointerCapture(evento.pointerId);
        arrasteFundoRef.current = {
            pointerId: evento.pointerId,
            inicioX: evento.clientX,
            inicioY: evento.clientY,
            x: Number(mapaRef.current
                .fundo.x) || 0,
            y: Number(mapaRef.current
                .fundo.y) || 0,
        };
        setArrastandoFundo(true);
    }
    function moverArrasteFundo(evento) {
        const arraste = arrasteFundoRef.current;
        if (!arraste ||
            arraste.pointerId !==
                evento.pointerId) {
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        const zoomAtual = mapaRef.current
            .camera.zoom ||
            1;
        atualizarMapaSemSalvar(criarMapaComFundoAtualizado(mapaRef.current, {
                x: arraste.x +
                    (evento.clientX -
                        arraste.inicioX) /
                        zoomAtual,
                y: arraste.y +
                    (evento.clientY -
                        arraste.inicioY) /
                        zoomAtual,
                ajustarAoGrid: false,
        }));
    }
    function finalizarArrasteFundo(evento) {
        const arraste = arrasteFundoRef.current;
        if (!arraste ||
            arraste.pointerId !==
                evento.pointerId) {
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        arrasteFundoRef.current =
            null;
        setArrastandoFundo(false);
        registrarMapa(mapaRef.current, "Posição da imagem atualizada.");
    }
    function iniciarRedimensionamentoFundo(evento, direcao) {
        if (evento.button !== 0 ||
            !fundoEditavel) {
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        evento.currentTarget
            .setPointerCapture(evento.pointerId);
        redimensionamentoFundoRef.current = {
            pointerId: evento.pointerId,
            direcao,
            inicioX: evento.clientX,
            inicioY: evento.clientY,
            x: Number(mapaRef.current
                .fundo.x) || 0,
            y: Number(mapaRef.current
                .fundo.y) || 0,
            largura: Math.max(TAMANHO_MINIMO_FUNDO, Number(mapaRef.current
                .fundo.largura) ||
                TAMANHO_MINIMO_FUNDO),
            altura: Math.max(TAMANHO_MINIMO_FUNDO, Number(mapaRef.current
                .fundo.altura) ||
                TAMANHO_MINIMO_FUNDO),
        };
        setRedimensionandoFundo(true);
    }
    function moverRedimensionamentoFundo(evento) {
        const ajuste = redimensionamentoFundoRef.current;
        if (!ajuste ||
            ajuste.pointerId !==
                evento.pointerId) {
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        const zoomAtual = mapaRef.current
            .camera.zoom ||
            1;
        const diferencaX = (evento.clientX -
            ajuste.inicioX) /
            zoomAtual;
        const diferencaY = (evento.clientY -
            ajuste.inicioY) /
            zoomAtual;
        let x = ajuste.x;
        let y = ajuste.y;
        let largura = ajuste.largura;
        let altura = ajuste.altura;
        if (ajuste.direcao.includes("e")) {
            largura =
                Math.max(TAMANHO_MINIMO_FUNDO, ajuste.largura +
                    diferencaX);
        }
        if (ajuste.direcao.includes("s")) {
            altura =
                Math.max(TAMANHO_MINIMO_FUNDO, ajuste.altura +
                    diferencaY);
        }
        if (ajuste.direcao.includes("w")) {
            largura =
                Math.max(TAMANHO_MINIMO_FUNDO, ajuste.largura -
                    diferencaX);
            x =
                ajuste.x +
                    (ajuste.largura -
                        largura);
        }
        if (ajuste.direcao.includes("n")) {
            altura =
                Math.max(TAMANHO_MINIMO_FUNDO, ajuste.altura -
                    diferencaY);
            y =
                ajuste.y +
                    (ajuste.altura -
                        altura);
        }
        atualizarMapaSemSalvar(criarMapaComFundoAtualizado(mapaRef.current, {
                x,
                y,
                largura,
                altura,
                ajustarAoGrid: false,
        }));
    }
    function finalizarRedimensionamentoFundo(evento) {
        const ajuste = redimensionamentoFundoRef.current;
        if (!ajuste ||
            ajuste.pointerId !==
                evento.pointerId) {
            return;
        }
        evento.preventDefault();
        evento.stopPropagation();
        redimensionamentoFundoRef.current =
            null;
        setRedimensionandoFundo(false);
        registrarMapa(mapaRef.current, "Tamanho da imagem atualizado.");
    }
    function controlarRoda(evento) {
        if (!evento.ctrlKey && !evento.metaKey) return;
        evento.preventDefault();
        alterarZoom(mapaRef.current.camera.zoom + (evento.deltaY < 0 ? 0.1 : -0.1), { x: evento.clientX, y: evento.clientY });
    }
    function controlarScroll() {
        if (arrastandoMapa ||
            arrastandoFundo ||
            redimensionandoFundo ||
            tokenArrastandoId) {
            return;
        }
        if (scrollSalvarRef.current) {
            clearTimeout(scrollSalvarRef.current);
        }
        scrollSalvarRef.current =
            setTimeout(() => {
                salvarPosicaoCamera("Posição do mapa salva.");
            }, 260);
    }
    async function carregarArquivoFundo(evento) {
        const arquivo = evento.target
            .files?.[0];
        evento.target.value =
            "";
        if (!arquivo) {
            return;
        }
        if (!arquivo.type.startsWith("image/")) {
            mostrarAviso("Escolha um arquivo de imagem.");
            return;
        }
        setCarregandoImagem(true);
        mostrarAviso("Preparando imagem de fundo...");
        try {
            const resultado = await compactarImagemMapa(arquivo);
            const proporcao = resultado
                .larguraOriginal /
                Math.max(1, resultado
                    .alturaOriginal);
            const larguraInicial = larguraMundo;
            const alturaInicial = larguraInicial / proporcao;
            adicionarFundo({
                imagem: resultado.imagem,
                nome: arquivo.name,
                x: 0,
                y: 0,
                largura: Math.max(TAMANHO_MINIMO_FUNDO, larguraInicial),
                altura: Math.max(TAMANHO_MINIMO_FUNDO, alturaInicial),
                rotacao: 0,
                opacidade: 1,
                bloqueado: false,
            }, "Nova parte do cenário adicionada. Ajuste pelas bordas e depois trave.");
            setPainelAtivo("fundo");
        }
        catch {
            mostrarAviso("Não foi possível adicionar essa imagem.");
        }
        finally {
            setCarregandoImagem(false);
        }
    }
    function aplicarUrlFundo() {
        const url = urlFundo.trim();
        if (!url) {
            mostrarAviso("Digite o endereço da imagem.");
            return;
        }
        adicionarFundo({
            imagem: url,
            nome: `Imagem por URL ${mapas.length + 1}`,
            x: 0,
            y: 0,
            largura: larguraMundo,
            altura: alturaMundo,
            rotacao: 0,
            opacidade: 1,
            bloqueado: false,
        }, "Nova parte do cenário adicionada por URL.");
        setUrlFundo("");
    }
    function ajustarFundoAoGrid() {
        atualizarFundoCompleto({
            x: 0,
            y: 0,
            largura: larguraMundo,
            altura: alturaMundo,
            rotacao: 0,
            ajustarAoGrid: true,
        }, "Imagem ajustada ao grid.");
    }
    function centralizarFundo() {
        atualizarFundoCompleto({
            x: (larguraMundo -
                fundo.largura) / 2,
            y: (alturaMundo -
                fundo.altura) / 2,
            ajustarAoGrid: false,
        }, "Imagem centralizada.");
    }
    function removerFundo() {
        if (!fundo?.imagem || !window.confirm(`Remover ${fundo.nome || "esta parte do cenário"}?`)) return;
        const restantes = mapas.filter((item) => item.id !== fundo.id);
        const proximo = restantes[0] || normalizarFundo({ ...FUNDO_PADRAO, largura: larguraMundo, altura: alturaMundo }, 0);
        registrarMapa({
            ...mapaRef.current,
            mapas: restantes,
            fundoAtivoId: restantes[0]?.id || "",
            fundo: proximo,
        }, "Parte do cenário removida.");
    }
    const configuracaoGrid = useMemo(() => {
        const corLinha = hexParaRgba(grid.cor, grid.opacidade);
        const fundos = [
            `linear-gradient(to right, ${corLinha} ${grid.espessura}px, transparent ${grid.espessura}px)`,
            `linear-gradient(to bottom, ${corLinha} ${grid.espessura}px, transparent ${grid.espessura}px)`,
        ];
        const tamanhos = [
            `${grid.tamanhoCelula}px ${grid.tamanhoCelula}px`,
            `${grid.tamanhoCelula}px ${grid.tamanhoCelula}px`,
        ];
        if (grid.linhaGrossaCada >
            0) {
            const tamanho = grid.tamanhoCelula *
                grid.linhaGrossaCada;
            const espessura = Math.max(2, grid.espessura +
                1);
            fundos.push(`linear-gradient(to right, ${corLinha} ${espessura}px, transparent ${espessura}px)`, `linear-gradient(to bottom, ${corLinha} ${espessura}px, transparent ${espessura}px)`);
            tamanhos.push(`${tamanho}px ${tamanho}px`, `${tamanho}px ${tamanho}px`);
        }
        return {
            imagem: fundos.join(", "),
            tamanho: tamanhos.join(", "),
        };
    }, [
        grid.cor,
        grid.opacidade,
        grid.espessura,
        grid.tamanhoCelula,
        grid.linhaGrossaCada,
    ]);
    return (<section className="painel-mapa painel-mapa--real">
      <style>
        {`
          .painel-mapa--real {
            overflow: hidden;
          }

          .painel-mapa--real
          .painel-mapa__ferramentas
          button[aria-pressed="true"] {
            border-color:
              var(--mapa-vermelho);

            box-shadow:
              inset 0 -3px 0
                var(--mapa-vermelho),
              0 2px 0
                rgba(0, 0, 0, 0.3);
          }

          .painel-mapa__config-grid,
          .painel-mapa__config-fundo,
          .painel-mapa__config-token,
          .painel-mapa__guia {
            display: grid;
            gap: 12px;
            padding: 14px;

            border: 1px solid
              rgba(
                54,
                38,
                25,
                0.62
              );

            background:
              rgba(
                239,
                217,
                177,
                0.94
              );
          }

          .painel-mapa__config-grid
          header,
          .painel-mapa__config-fundo
          header,
          .painel-mapa__config-token
          header {
            display: flex;
            justify-content:
              space-between;
            align-items:
              center;
            gap: 12px;
          }

          .painel-mapa__config-grid
          h3,
          .painel-mapa__config-fundo
          h3,
          .painel-mapa__config-token
          h3,
          .painel-mapa__guia
          h3 {
            margin: 0;

            font-family:
              "Special Elite",
              "Courier New",
              monospace;

            font-size: 0.86rem;

            text-transform:
              uppercase;
          }

          .painel-mapa__config-campos,
          .painel-mapa__fundo-campos,
          .painel-mapa__token-campos {
            display: grid;

            grid-template-columns:
              repeat(
                4,
                minmax(0, 1fr)
              );

            gap: 10px;
          }

          .painel-mapa__config-campos
          label,
          .painel-mapa__fundo-campos
          label,
          .painel-mapa__token-campos
          label,
          .painel-mapa__config-checks
          label,
          .painel-mapa__token-checks
          label {
            display: grid;
            gap: 5px;
            min-width: 0;

            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size:
              0.63rem;

            font-weight: 900;

            text-transform:
              uppercase;
          }

          .painel-mapa__config-campos
          input,
          .painel-mapa__fundo-campos
          input,
          .painel-mapa__token-campos
          input,
          .painel-mapa__token-campos
          select,
          .painel-mapa__fundo-url
          input {
            width: 100%;
            min-width: 0;
            min-height: 34px;
            padding: 5px 7px;

            border: 1px solid
              rgba(
                54,
                38,
                25,
                0.62
              );

            border-radius: 0;
            background: #f4e4c5;
            color: #21150e;
          }

          .painel-mapa__config-checks,
          .painel-mapa__fundo-acoes,
          .painel-mapa__token-checks,
          .painel-mapa__token-acoes {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 16px;
          }

          .painel-mapa__config-checks
          label,
          .painel-mapa__token-checks
          label {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .painel-mapa__fundo-url {
            display: grid;

            grid-template-columns:
              minmax(0, 1fr)
              auto;

            gap: 8px;
          }

          .painel-mapa__fundo-nome,
          .painel-mapa__fundo-ajuda,
          .painel-mapa__token-ajuda {
            margin: 0;
            padding: 8px 10px;

            border-left:
              4px solid
              var(--mapa-vermelho);

            background:
              rgba(
                139,
                31,
                31,
                0.08
              );

            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size: 0.68rem;
            line-height: 1.5;
          }

          .painel-mapa__fundo-ajuda,
          .painel-mapa__token-ajuda {
            border-left-color:
              var(--mapa-dourado);
          }

          .painel-mapa__lista-fichas {
            display: grid;

            grid-template-columns:
              repeat(
                auto-fit,
                minmax(
                  190px,
                  1fr
                )
              );

            gap: 10px;
          }

          .painel-mapa__ficha-token {
            display: grid;

            grid-template-columns:
              48px
              minmax(0, 1fr)
              auto;

            align-items: center;
            gap: 9px;
            padding: 9px;

            border: 1px solid
              rgba(
                55,
                38,
                24,
                0.55
              );

            background:
              rgba(
                255,
                240,
                207,
                0.7
              );
          }

          .painel-mapa__ficha-token
          img,
          .painel-mapa__ficha-token-iniciais {
            display: grid;
            place-items: center;

            width: 48px;
            height: 48px;

            border:
              2px solid
              #4e321e;

            border-radius: 50%;

            background:
              #271a12;

            color:
              #f2d693;

            object-fit: cover;

            font-family:
              "Special Elite",
              "Courier New",
              monospace;

            font-size:
              0.78rem;

            font-weight: 900;
          }

          .painel-mapa__ficha-token
          div {
            display: grid;
            gap: 3px;
            min-width: 0;
          }

          .painel-mapa__ficha-token
          strong,
          .painel-mapa__ficha-token
          small {
            overflow: hidden;
            text-overflow:
              ellipsis;
            white-space:
              nowrap;
          }

          .painel-mapa__ficha-token
          strong {
            font-family:
              "Special Elite",
              "Courier New",
              monospace;

            font-size:
              0.74rem;
          }

          .painel-mapa__ficha-token
          small {
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size:
              0.61rem;
          }

          .painel-mapa__token-selecionado {
            display: grid;
            gap: 10px;
            padding: 12px;

            border:
              2px solid
              rgba(
                139,
                31,
                31,
                0.68
              );

            background:
              rgba(
                139,
                31,
                31,
                0.07
              );
          }

          .painel-mapa__mini-ficha {
            display: grid;
            gap: 12px;
            padding: 12px;

            border: 1px solid
              rgba(
                55,
                38,
                24,
                0.55
              );

            background:
              rgba(
                255,
                246,
                227,
                0.82
              );
          }

          .painel-mapa__mini-ficha-topo {
            display: grid;
            grid-template-columns: 56px minmax(0, 1fr);
            gap: 10px;
            align-items: center;
          }

          .painel-mapa__mini-ficha-avatar,
          .painel-mapa__mini-ficha-avatar img {
            width: 56px;
            height: 56px;
          }

          .painel-mapa__mini-ficha-avatar {
            display: grid;
            place-items: center;
            overflow: hidden;

            border: 2px solid #4e321e;
            border-radius: 50%;
            background: #271a12;
            color: #f2d693;

            font-family:
              "Special Elite",
              "Courier New",
              monospace;

            font-size: 0.84rem;
            font-weight: 900;
          }

          .painel-mapa__mini-ficha-avatar img {
            display: block;
            object-fit: cover;
          }

          .painel-mapa__mini-ficha-info {
            display: grid;
            gap: 2px;
            min-width: 0;
          }

          .painel-mapa__mini-ficha-info strong {
            font-family:
              "Special Elite",
              "Courier New",
              monospace;

            font-size: 0.8rem;
          }

          .painel-mapa__mini-ficha-info span {
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size: 0.66rem;
            line-height: 1.45;
          }

          .painel-mapa__mini-ficha-campos {
            display: grid;
            grid-template-columns:
              repeat(
                4,
                minmax(0, 1fr)
              );
            gap: 10px;
          }

          .painel-mapa__mini-ficha-campos label {
            display: grid;
            gap: 5px;
            min-width: 0;

            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size: 0.63rem;
            font-weight: 900;
            text-transform: uppercase;
          }

          .painel-mapa__mini-ficha-campos input {
            width: 100%;
            min-width: 0;
            min-height: 34px;
            padding: 5px 7px;

            border: 1px solid
              rgba(
                54,
                38,
                25,
                0.62
              );

            background: #f4e4c5;
            color: #21150e;
          }

          .painel-mapa__mini-ficha-resumo {
            margin: 0;
            padding: 8px 10px;

            border-left: 4px solid
              var(--mapa-dourado);

            background:
              rgba(
                196,
                154,
                58,
                0.1
              );

            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size: 0.68rem;
            line-height: 1.5;
          }

          .painel-mapa__token-selecionado
          h4 {
            margin: 0;

            font-family:
              "Special Elite",
              "Courier New",
              monospace;

            font-size:
              0.8rem;

            text-transform:
              uppercase;
          }

          .painel-mapa__moldura {
            position: relative;
            min-width: 0;
          }

          .painel-mapa--real
          .painel-mapa__area {
            position: relative;
            display: block;

            height:
              min(
                68vh,
                760px
              );

            min-height:
              520px;

            overflow: auto;

            overscroll-behavior:
              contain;

            scrollbar-color:
              #80643f
              #1a1510;

            scrollbar-width:
              auto;

            touch-action:
              none;

            cursor: default;

            user-select:
              none;

            background:
              radial-gradient(
                circle at
                  45% 40%,
                #273229,
                #111512 75%
              );
          }

          .painel-mapa--real
          .painel-mapa__area::-webkit-scrollbar {
            width: 14px;
            height: 14px;
          }

          .painel-mapa--real
          .painel-mapa__area::-webkit-scrollbar-track {
            background:
              #1a1510;
          }

          .painel-mapa--real
          .painel-mapa__area::-webkit-scrollbar-thumb {
            border:
              3px solid
              #1a1510;

            background:
              #927148;
          }

          .painel-mapa--real
          .painel-mapa__area--arrastando {
            cursor: grabbing;
          }

          .painel-mapa__canvas {
            position: relative;
            min-width: 100%;
            min-height: 100%;
          }

          .painel-mapa__mundo {
            position: absolute;
            overflow: hidden;

            transform-origin:
              0 0;

            border:
              2px solid
              rgba(
                223,
                190,
                119,
                0.72
              );

            background-color:
              #18211c;

            box-shadow:
              0 0 0 3px
                rgba(
                  0,
                  0,
                  0,
                  0.48
                ),
              0 18px 44px
                rgba(
                  0,
                  0,
                  0,
                  0.62
                );
          }

          .painel-mapa__fundo-editor {
            position: absolute;
            z-index: 2;

            transform-origin:
              0 0;

            touch-action:
              none;
          }

          .painel-mapa__fundo-editor--editavel {
            cursor: move;

            outline:
              3px solid
              rgba(
                255,
                206,
                96,
                0.95
              );

            outline-offset:
              -3px;

            box-shadow:
              0 0 0 2px
                rgba(
                  0,
                  0,
                  0,
                  0.68
                ),
              0 0 20px
                rgba(
                  255,
                  206,
                  96,
                  0.42
                );
          }

          .painel-mapa__fundo-editor--movendo {
            cursor: grabbing;
          }

          .painel-mapa__fundo-imagem {
            display: block;
            width: 100%;
            height: 100%;

            object-fit: fill;

            user-select: none;
            pointer-events: none;

            -webkit-user-drag:
              none;
          }

          .painel-mapa__fundo-travar {
            position: absolute;
            z-index: 15;
            top: 12px;
            right: 12px;

            min-height: 32px;
            padding: 5px 10px;

            border:
              2px solid
              #f4ce72;

            background:
              linear-gradient(
                180deg,
                #7a2c25,
                #38120f
              );

            color:
              #fff1c8;

            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size:
              0.66rem;

            font-weight: 900;

            text-transform:
              uppercase;

            cursor: pointer;
          }

          .painel-mapa__redimensionador {
            position: absolute;
            z-index: 12;

            display: block;
            margin: 0;
            padding: 0;
            border: 0;

            background:
              rgba(
                255,
                207,
                96,
                0.05
              );

            touch-action:
              none;
          }

          .painel-mapa__redimensionador::after {
            content: "";
            position: absolute;

            background:
              #f6cc65;

            box-shadow:
              0 0 0 2px
                rgba(
                  32,
                  20,
                  10,
                  0.9
                );
          }

          .painel-mapa__redimensionador--n,
          .painel-mapa__redimensionador--s {
            left: 16px;
            right: 16px;
            height: 14px;

            cursor: ns-resize;
          }

          .painel-mapa__redimensionador--n {
            top: -7px;
          }

          .painel-mapa__redimensionador--s {
            bottom: -7px;
          }

          .painel-mapa__redimensionador--n::after,
          .painel-mapa__redimensionador--s::after {
            top: 6px;
            left: 0;
            right: 0;
            height: 2px;
          }

          .painel-mapa__redimensionador--e,
          .painel-mapa__redimensionador--w {
            top: 16px;
            bottom: 16px;
            width: 14px;

            cursor: ew-resize;
          }

          .painel-mapa__redimensionador--e {
            right: -7px;
          }

          .painel-mapa__redimensionador--w {
            left: -7px;
          }

          .painel-mapa__redimensionador--e::after,
          .painel-mapa__redimensionador--w::after {
            top: 0;
            bottom: 0;
            width: 2px;
          }

          .painel-mapa__redimensionador--e::after {
            right: 6px;
          }

          .painel-mapa__redimensionador--w::after {
            left: 6px;
          }

          .painel-mapa__redimensionador--ne,
          .painel-mapa__redimensionador--nw,
          .painel-mapa__redimensionador--se,
          .painel-mapa__redimensionador--sw {
            width: 20px;
            height: 20px;

            border:
              3px solid
              #24150b;

            background:
              #f6cc65;
          }

          .painel-mapa__redimensionador--ne::after,
          .painel-mapa__redimensionador--nw::after,
          .painel-mapa__redimensionador--se::after,
          .painel-mapa__redimensionador--sw::after {
            display: none;
          }

          .painel-mapa__redimensionador--ne {
            top: -10px;
            right: -10px;
            cursor: nesw-resize;
          }

          .painel-mapa__redimensionador--nw {
            top: -10px;
            left: -10px;
            cursor: nwse-resize;
          }

          .painel-mapa__redimensionador--se {
            right: -10px;
            bottom: -10px;
            cursor: nwse-resize;
          }

          .painel-mapa__redimensionador--sw {
            left: -10px;
            bottom: -10px;
            cursor: nesw-resize;
          }

          .painel-mapa__grid-camada {
            position: absolute;
            z-index: 3;
            inset: 0;

            pointer-events:
              none;
          }

          .painel-mapa__sombra-camada {
            position: absolute;
            z-index: 4;
            inset: 0;

            pointer-events:
              none;

            background:
              radial-gradient(
                circle at
                  45% 40%,
                rgba(
                  92,
                  124,
                  98,
                  0.1
                ),
                transparent 54%
              ),
              linear-gradient(
                transparent,
                rgba(
                  0,
                  0,
                  0,
                  0.16
                )
              );
          }

          .painel-mapa--real
          .painel-mapa__token
          span {
            position: static;
            z-index: auto;

            padding: 0;
            border: 0;

            background:
              transparent;

            color: inherit;

            font: inherit;

            text-transform:
              none;
          }

          .painel-mapa__token {
            position: absolute;
            z-index: 8;

            display: block;

            padding: 0;
            border: 0;
            border-radius: 0;

            background:
              transparent;

            cursor: grab;

            touch-action:
              none;

            user-select:
              none;

            overflow:
              visible;
          }

          .painel-mapa__token::before {
            content: "";

            position: absolute;
            top: 3%;
            left: 11%;

            width: 78%;
            height: 78%;

            border:
              2px solid
              transparent;

            border-radius: 50%;

            pointer-events:
              none;
          }

          .painel-mapa__token--selecionado::before {
            border-color:
              #e8b83f;

            background:
              rgba(
                232,
                184,
                63,
                0.1
              );

            box-shadow:
              inset 0 0 12px
                rgba(
                  232,
                  184,
                  63,
                  0.26
                );
          }

          .painel-mapa__token--arrastando {
            z-index: 14;
            cursor: grabbing;
          }

          .painel-mapa__token--bloqueado {
            cursor:
              not-allowed;
          }

          .painel-mapa__token-visual {
            position: absolute;

            top: 5%;
            left: 14%;

            width: 72%;
            height: 72%;

            display: grid;
            place-items: center;

            border:
              3px solid
              #ead487;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle at
                  35% 28%,
                rgba(
                  255,
                  255,
                  255,
                  0.28
                ),
                transparent 30%
              ),
              var(--token-cor);

            box-shadow:
              0 0 0 3px
                rgba(
                  48,
                  27,
                  14,
                  0.9
                ),
              0 4px 10px
                rgba(
                  0,
                  0,
                  0,
                  0.8
                ),
              inset 0 0 12px
                rgba(
                  255,
                  255,
                  255,
                  0.18
                );

            overflow: hidden;

            pointer-events:
              none;
          }

          .painel-mapa__token-visual
          img {
            display: block;

            width: 100%;
            height: 100%;

            object-fit: cover;

            pointer-events:
              none;

            -webkit-user-drag:
              none;
          }

          .painel-mapa__token-iniciais {
            display: grid !important;

            place-items:
              center;

            width: 100%;
            height: 100%;

            color:
              #fff2bf !important;

            font-family:
              "Special Elite",
              "Courier New",
              monospace !important;

            font-size:
              clamp(
                0.58rem,
                2vw,
                1.3rem
              ) !important;

            font-weight:
              900 !important;

            text-shadow:
              0 2px 3px
              #000;

            pointer-events:
              none;
          }

          .painel-mapa__token-marcador {
            position:
              absolute !important;

            z-index: 4 !important;

            top: 5% !important;
            left: 14% !important;

            width: 72% !important;
            height: 72% !important;

            transform:
              rotate(var(--token-rotacao, 0deg));

            color:
              transparent !important;

            font-size:
              0 !important;

            text-shadow:
              0 0 2px #000,
              0 2px 4px #000;

            pointer-events:
              none;
          }

          .painel-mapa__token-marcador::after {
            content: "▼";

            position: absolute;
            z-index: 2;
            bottom: -7px;
            left: 50%;

            transform: translateX(-50%);

            color: #ffd85c;
            font-size: clamp(11px, 1.45vw, 18px);
            line-height: 1;
            text-shadow: 0 0 2px #000, 0 2px 4px #000;
            filter: drop-shadow(0 0 3px rgba(255, 207, 79, 0.72));
          }

          .painel-mapa__token-recursos {
            position:
              absolute;

            z-index: 5;

            top: 78%;
            left: 14%;

            width: 72%;

            display: grid;
            gap: 2px;

            pointer-events:
              none;
          }

          .painel-mapa__token-barra {
            display:
              block !important;

            width: 100%;
            height: 5px;

            overflow: hidden;

            border:
              1px solid
              #170e09 !important;

            background:
              #21130e !important;

            box-shadow:
              0 1px 2px
                rgba(
                  0,
                  0,
                  0,
                  0.8
                );
          }

          .painel-mapa__token-barra
          > span {
            display:
              block !important;

            height: 100%;
          }

          .painel-mapa__token-barra--pv
          > span {
            background:
              linear-gradient(
                90deg,
                #7a1515,
                #e2483d
              ) !important;
          }

          .painel-mapa__token-barra--pe
          > span {
            background:
              linear-gradient(
                90deg,
                #173f8b,
                #4c8ef1
              ) !important;
          }

          .painel-mapa__token-barra--san
          > span {
            background:
              linear-gradient(
                90deg,
                #997216,
                #ffd84e
              ) !important;
          }

          .painel-mapa__token-nome {
            position:
              absolute !important;

            z-index: 6 !important;

            top:
              calc(
                100% + 8px
              ) !important;

            left: 50% !important;

            min-width: 82px;
            max-width: 150px;

            padding:
              3px 6px !important;

            transform:
              translateX(-50%);

            overflow: hidden;

            text-overflow:
              ellipsis;

            white-space:
              nowrap;

            border:
              1px solid
              rgba(
                224,
                190,
                111,
                0.75
              ) !important;

            background:
              rgba(
                12,
                9,
                7,
                0.94
              ) !important;

            color:
              #f3dda8 !important;

            font-family:
              "Courier Prime",
              "Courier New",
              monospace !important;

            font-size:
              9px !important;

            font-weight:
              900 !important;

            text-align:
              center;

            pointer-events:
              none;
          }

          .painel-mapa__informacao {
            position: absolute;
            z-index: 20;

            top: 12px;
            right: 24px;

            display: grid;
            gap: 4px;

            padding: 9px 11px;

            border:
              1px solid
              rgba(
                222,
                188,
                121,
                0.52
              );

            background:
              rgba(
                12,
                10,
                8,
                0.88
              );

            color:
              #ead7a8;

            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size:
              0.62rem;

            pointer-events:
              none;
          }

          .painel-mapa__coordenada {
            position:
              absolute !important;

            z-index: 6 !important;

            display:
              grid !important;

            place-items:
              center;

            padding:
              0 !important;

            border:
              0 !important;

            background:
              rgba(
                13,
                11,
                9,
                0.74
              ) !important;

            color:
              #f1d9a4 !important;

            font-size:
              10px !important;

            pointer-events:
              none;
          }

          .painel-mapa__aviso {
            margin: 0;

            padding:
              8px 10px;

            border-left:
              4px solid
              var(--mapa-vermelho);

            background:
              rgba(
                139,
                31,
                31,
                0.08
              );

            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size:
              0.68rem;

            font-weight:
              700;
          }

          .painel-mapa__guia
          p {
            margin: 0;

            font-family:
              "Courier Prime",
              "Courier New",
              monospace;

            font-size:
              0.7rem;

            line-height:
              1.55;
          }

          @media (
            max-width: 900px
          ) {
            .painel-mapa__config-campos,
            .painel-mapa__fundo-campos,
            .painel-mapa__token-campos,
            .painel-mapa__mini-ficha-campos {
              grid-template-columns:
                repeat(
                  2,
                  minmax(
                    0,
                    1fr
                  )
                );
            }

            .painel-mapa--real
            .painel-mapa__area {
              min-height:
                420px;
            }
          }

          @media (
            max-width: 560px
          ) {
            .painel-mapa__config-campos,
            .painel-mapa__fundo-campos,
            .painel-mapa__token-campos,
            .painel-mapa__fundo-url,
            .painel-mapa__mini-ficha-campos {
              grid-template-columns:
                1fr;
            }

            .painel-mapa__mini-ficha-topo {
              grid-template-columns: 1fr;
            }

            .painel-mapa__ficha-token {
              grid-template-columns:
                42px
                minmax(
                  0,
                  1fr
                );
            }

            .painel-mapa__ficha-token
            button {
              grid-column:
                1 / -1;
            }
          }
        `}
      </style>

      {painelNpc && typeof document !== "undefined" ? createPortal(
        <PainelNpcsMapa
          npcs={npcs}
          aoCriar={criarNpc}
          aoAdicionarGrid={adicionarNpcAoGrid}
          aoAbrirFicha={(npc) => setMiniFichaAberta({ tipo: "npc", id: npc.id })}
          aoRemover={removerNpc}
          aoFechar={() => setPainelAtivo("")}
        />,
        document.body,
      ) : null}

      {npcParaExcluir ? (
        <div className="painel-mapa__confirmacao-fundo" role="presentation">
          <section className="painel-mapa__confirmacao" role="dialog" aria-modal="true" aria-label="Confirmar exclusão do NPC">
            <strong>Excluir {npcParaExcluir.nome}?</strong>
            <p>As instâncias deste NPC também serão removidas do grid.</p>
            <div>
              <button type="button" onClick={() => setNpcParaExcluir(null)}>Cancelar</button>
              <button type="button" onClick={confirmarRemocaoNpc}>Excluir NPC</button>
            </div>
          </section>
        </div>
      ) : null}

      <MenuContextualToken
        token={tokenSelecionado}
        posicao={menuTokenPosicao}
        podeAdministrar={papelEfetivo === "mestre"}
        podeControlar={Boolean(tokenSelecionado && podeControlarToken(tokenSelecionado) && !tokenSelecionado.bloqueado)}
        aoAbrirFicha={() => abrirMiniFichaDoToken(tokenSelecionado)}
        aoGirarEsquerda={() => girarToken(tokenSelecionado, -1)}
        aoGirarDireita={() => girarToken(tokenSelecionado, 1)}
        aoEditarToken={() => {
          setEditorTokenAbertoId(tokenSelecionado.id);
          setMenuTokenPosicao(null);
        }}
        aoDuplicar={() => duplicarTokenNpc(tokenSelecionado)}
        aoRemover={() => removerToken(tokenSelecionado)}
        aoAlternarOculto={() => {
          atualizarToken(tokenSelecionado.id, { oculto: !tokenSelecionado.oculto }, tokenSelecionado.oculto ? "Token revelado." : "Token ocultado.");
          setMenuTokenPosicao(null);
        }}
        aoAlternarBloqueado={() => {
          atualizarToken(tokenSelecionado.id, { bloqueado: !tokenSelecionado.bloqueado }, tokenSelecionado.bloqueado ? "Token desbloqueado." : "Token bloqueado.");
          setMenuTokenPosicao(null);
        }}
        aoTrazerFrente={() => alterarOrdemToken(tokenSelecionado, "frente")}
        aoEnviarTras={() => alterarOrdemToken(tokenSelecionado, "tras")}
        aoFechar={() => setMenuTokenPosicao(null)}
      />

      {entidadeMiniFicha ? (
        <MiniFichaToken
          ficha={entidadeMiniFicha}
          tipo={miniFichaAberta.tipo}
          aoAlterar={atualizarEntidadeMiniFicha}
          aoFechar={() => setMiniFichaAberta(null)}
        />
      ) : null}

      {tokenEditor ? (
        <EditorTokenMapa
          token={tokenEditor}
          ficha={obterFichaDoToken(tokenEditor)}
          grid={grid}
          aoAlterar={(alteracoes) => {
            const possuiPosicao = Object.hasOwn(alteracoes, "x") || Object.hasOwn(alteracoes, "y");
            const alteracoesFinais = possuiPosicao
              ? {
                  ...alteracoes,
                  ...criarAlteracaoPosicao(
                    Object.hasOwn(alteracoes, "x") ? alteracoes.x : tokenEditor.x,
                    Object.hasOwn(alteracoes, "y") ? alteracoes.y : tokenEditor.y,
                    tokenEditor.tamanho,
                  ),
                }
              : alteracoes;
            atualizarToken(tokenEditor.id, alteracoesFinais, "Token atualizado no grid.");
          }}
          aoAlterarTamanho={(tamanho) => alterarTamanhoToken(tokenEditor, tamanho)}
          aoFechar={() => setEditorTokenAbertoId("")}
        />
      ) : null}

      <header className="painel-mapa__cabecalho">
        <span>
          Mapa
        </span>

        <strong>
          {arquivoInicial} —
          Arquivo inicial
        </strong>
      </header>

      <div className="painel-mapa__ferramentas">
        <button
          data-assistente="mapa-ferramentas"
          className="painel-mapa__ferramentas-gatilho"
          type="button"
          aria-expanded={menuFerramentasAberto}
          aria-controls="leque-ferramentas-mapa"
          onClick={() => setMenuFerramentasAberto((aberto) => !aberto)}
        >
          <i aria-hidden="true">✦</i>
          <span><strong>Ferramentas</strong><small>{ROTULOS_PAINEIS_MAPA[painelAtivo] || (menuFerramentasAberto ? "Escolha uma ferramenta" : "Abrir menu do mapa")}</small></span>
          <b aria-hidden="true">{menuFerramentasAberto ? "‹" : "›"}</b>
        </button>

        <div
          id="leque-ferramentas-mapa"
          className={menuFerramentasAberto ? "painel-mapa__ferramentas-leque painel-mapa__ferramentas-leque--aberto" : "painel-mapa__ferramentas-leque"}
          aria-hidden={!menuFerramentasAberto}
          inert={!menuFerramentasAberto}
        >
        {papelEfetivo === "mestre" ? (<>
        <div className="painel-mapa__ferramentas-grupo">
          <span className="painel-mapa__ferramentas-legenda">Cena</span>
          <button type="button" title="Configurar grid" disabled={papelEfetivo !== "mestre"} aria-pressed={painelGrid} onClick={() => alternarPainel("grid")}><i aria-hidden="true">▦</i><span>Grid</span></button>
          <button type="button" title="Imagens do cenário" disabled={papelEfetivo !== "mestre"} aria-pressed={painelFundo} onClick={() => alternarPainel("fundo")}><i aria-hidden="true">▧</i><span>Fundo</span></button>
          <button type="button" title="Organizar camadas" disabled={papelEfetivo !== "mestre"} aria-pressed={painelCamadas} onClick={() => alternarPainel("camadas")}><i aria-hidden="true">▤</i><span>Camadas</span></button>
        </div>

        <div className="painel-mapa__ferramentas-grupo">
          <span className="painel-mapa__ferramentas-legenda">Ambiente</span>
          <button type="button" title="Paredes e portas" disabled={papelEfetivo !== "mestre"} aria-pressed={painelEstruturas} onClick={() => alternarPainel("estruturas")}><i aria-hidden="true">⌑</i><span>Paredes</span></button>
          <button type="button" title="Neblina de guerra" disabled={papelEfetivo !== "mestre"} aria-pressed={painelNeblina} onClick={() => alternarPainel("neblina")}><i aria-hidden="true">◌</i><span>Neblina</span></button>
          <button type="button" title="Visão e iluminação" disabled={papelEfetivo !== "mestre"} aria-pressed={painelLuz} onClick={() => alternarPainel("luz")}><i aria-hidden="true">✦</i><span>Luz</span></button>
        </div>
        </>) : null}

        <div className="painel-mapa__ferramentas-grupo">
          <span className="painel-mapa__ferramentas-legenda">Jogo</span>
          <button type="button" title="Medir distâncias" aria-pressed={painelMedicao} onClick={() => alternarPainel("medicao")}><i aria-hidden="true">⌁</i><span>Régua</span></button>
          {papelEfetivo === "mestre" ? <button type="button" title="Tokens de personagens" aria-pressed={painelToken} onClick={() => alternarPainel("token")}><i aria-hidden="true">◉</i><span>Tokens</span></button> : null}
        </div>

        {papelAtual === "mestre" ? (<div className="painel-mapa__ferramentas-grupo painel-mapa__ferramentas-grupo--acesso">
          <span className="painel-mapa__ferramentas-legenda">Acesso</span>
          <button type="button" title="Permissões e prévia dos jogadores" aria-pressed={painelPermissoes} onClick={() => alternarPainel("permissoes")}><i aria-hidden="true">⌘</i><span>Permissões</span></button>
        </div>) : null}
        </div>
      </div>

      {painelGrid ? (<section className="painel-mapa__config-grid" data-assistente="mapa-painel-grid">
          <header>
            <h3>
              Configuração do grid
            </h3>

            <button type="button" onClick={() => setPainelAtivo("")}>
              Fechar
            </button>
          </header>

          <div className="painel-mapa__config-campos">
            <label>
              Colunas

              <input type="number" min="1" max="200" value={grid.colunas} onChange={(evento) => atualizarGrid("colunas", limitarNumero(evento.target
                .value, 32, 1, 200))}/>
            </label>

            <label>
              Linhas

              <input type="number" min="1" max="200" value={grid.linhas} onChange={(evento) => atualizarGrid("linhas", limitarNumero(evento.target
                .value, 17, 1, 200))}/>
            </label>

            <label>
              Tamanho da casa

              <input type="number" min="24" max="160" value={grid.tamanhoCelula} onChange={(evento) => atualizarGrid("tamanhoCelula", limitarNumero(evento.target
                .value, 64, 24, 160))}/>
            </label>

            <label>
              Linha grossa a cada

              <input type="number" min="0" max="20" value={grid.linhaGrossaCada} onChange={(evento) => atualizarGrid("linhaGrossaCada", limitarNumero(evento.target
                .value, 5, 0, 20))}/>
            </label>

            <label>
              Cor das linhas

              <input type="color" value={grid.cor} onChange={(evento) => atualizarGrid("cor", evento.target
                .value)}/>
            </label>

            <label>
              Opacidade

              <input type="range" min="0" max="1" step="0.05" value={grid.opacidade} onChange={(evento) => atualizarGrid("opacidade", limitarNumero(evento.target
                .value, 0.46, 0, 1))}/>
            </label>

            <label>
              Espessura

              <input type="number" min="1" max="6" value={grid.espessura} onChange={(evento) => atualizarGrid("espessura", limitarNumero(evento.target
                .value, 1, 1, 6))}/>
            </label>
          </div>

          <div className="painel-mapa__config-checks">
            <label>
              <input type="checkbox" checked={grid.encaixarTokens} onChange={(evento) => atualizarGrid("encaixarTokens", evento.target.checked)}/>

              Encaixar tokens
              nas casas
            </label>

            <label>
              <input type="checkbox" checked={grid.mostrarCoordenadas} onChange={(evento) => atualizarGrid("mostrarCoordenadas", evento.target
                .checked)}/>

              Mostrar coordenadas
            </label>
          </div>
        </section>) : null}

      {painelMedicao ? (<section className="painel-mapa__config-grid painel-mapa__config-medicao" data-assistente="mapa-painel-regua">
          <header>
            <h3>Régua e medição</h3>
            <button type="button" onClick={() => setPainelAtivo("")}>Fechar</button>
          </header>
          <div className="painel-mapa__config-campos">
            <label>
              Unidade
              <select value={grid.unidadeMedida} onChange={(evento) => atualizarGrid("unidadeMedida", evento.target.value)}>
                <option value="metros">Metros</option>
                <option value="quadrados">Quadrados</option>
              </select>
            </label>
            {grid.unidadeMedida === "metros" ? (<label>
              Metros por casa
              <input type="number" min="0.1" max="100" step="0.1" value={grid.metrosPorCasa} onChange={(evento) => atualizarGrid("metrosPorCasa", limitarNumero(evento.target.value, 1.5, 0.1, 100))}/>
            </label>) : null}
            <label>
              Diagonal
              <select value={grid.modoDiagonal} onChange={(evento) => atualizarGrid("modoDiagonal", evento.target.value)}>
                <option value="euclidiana">Distância real</option>
                <option value="alternada">Alternada (1–2–1)</option>
                <option value="quadrados">Maior eixo</option>
              </select>
            </label>
            <button className="painel-mapa__botao-perigo" type="button" disabled={!medicao} onClick={() => setMedicao(null)}>Limpar medição</button>
          </div>
          <p className="painel-mapa__token-ajuda">Arraste sobre o mapa para traçar uma linha. A régua respeita o tamanho das casas e a regra de diagonal escolhida.</p>
        </section>) : null}

      {painelCamadas ? (
        <PainelCamadasMapa camadas={mapaLocal.camadas} aoAlterar={atualizarCamada} aoFechar={() => setPainelAtivo("")} />
      ) : null}

      {painelEstruturas ? (
        <PainelEstruturasMapa
          ferramenta={ferramentaEstrutura}
          paredes={mapaLocal.paredes}
          portas={mapaLocal.portas}
          bloqueada={mapaLocal.camadas.paredes.bloqueada}
          aoEscolher={setFerramentaEstrutura}
          aoAlterar={alterarEstrutura}
          aoRemover={removerEstrutura}
          aoFechar={() => { setPainelAtivo(""); setFerramentaEstrutura(""); }}
        />
      ) : null}

      {painelNeblina ? (
        <PainelNeblinaMapa
          neblina={mapaLocal.neblina}
          ferramenta={ferramentaNeblina}
          bloqueada={mapaLocal.camadas.neblina.bloqueada}
          aoAtualizar={atualizarNeblina}
          aoEscolher={setFerramentaNeblina}
          aoRemoverArea={removerAreaNeblina}
          aoFechar={() => { setPainelAtivo(""); setFerramentaNeblina(""); }}
        />
      ) : null}

      {painelLuz ? (
        <PainelIluminacaoMapa
          iluminacao={mapaLocal.iluminacao}
          luzes={mapaLocal.luzes}
          tokens={tokens}
          fichas={fichasSeguras}
          ferramenta={ferramentaLuz}
          bloqueada={mapaLocal.camadas.efeitos.bloqueada}
          aoAtualizar={atualizarIluminacao}
          aoEscolher={setFerramentaLuz}
          aoAlterarLuz={alterarLuz}
          aoRemoverLuz={removerLuz}
          aoAlterarToken={(id, alteracoes) => atualizarToken(id, alteracoes, "Visão do token atualizada.")}
          aoFechar={() => { setPainelAtivo(""); setFerramentaLuz(""); }}
        />
      ) : null}

      {painelPermissoes && papelAtual === "mestre" ? (
        <PainelPermissoesMapa
          tokens={tokens}
          fichas={fichasSeguras}
          previsualizacao={previsualizacaoJogadorId}
          aoPrevisualizar={(id) => { setPrevisualizacaoJogadorId(id); setTokenSelecionadoId(""); setMenuTokenPosicao(null); }}
          aoAlterarToken={(id, alteracoes) => atualizarToken(id, alteracoes, "Permissões do token atualizadas.")}
          aoFechar={() => setPainelAtivo("")}
        />
      ) : null}

      {painelFundo ? (<section className="painel-mapa__config-fundo" data-assistente="mapa-painel-fundo">
          <header>
            <h3>
              Mapas da cena
            </h3>

            <button type="button" onClick={() => setPainelAtivo("")}>
              Fechar
            </button>
          </header>

          <input ref={arquivoFundoRef} type="file" accept="image/*" hidden onChange={carregarArquivoFundo}/>

          <div className="painel-mapa__lista-fundos">
            {mapas.length === 0 ? <p>Nenhuma parte de cenário adicionada.</p> : [...mapas]
              .sort((a, b) => (Number(b.ordem) || 0) - (Number(a.ordem) || 0))
              .map((item) => (
                <button
                  type="button"
                  className={item.id === fundo.id ? "painel-mapa__fundo-item painel-mapa__fundo-item--ativo" : "painel-mapa__fundo-item"}
                  key={item.id}
                  onClick={() => selecionarFundo(item.id)}
                >
                  <strong>{item.nome || "Parte do cenário"}</strong>
                  <small>{item.bloqueado ? "Travado" : "Editando"} · ordem {item.ordem}</small>
                </button>
              ))}
          </div>

          <div className="painel-mapa__fundo-acoes">
            <button type="button" disabled={carregandoImagem} onClick={() => arquivoFundoRef.current?.click()}>
              {carregandoImagem
                ? "Preparando..."
                : "Adicionar imagem"}
            </button>

            <button type="button" disabled={!fundo.imagem} onClick={alternarBloqueioFundo}>
              {fundo.bloqueado
                ? "Destravar imagem"
                : "Travar imagem"}
            </button>

            <button type="button" disabled={!fundo.imagem} onClick={ajustarFundoAoGrid}>
              Ajustar ao grid
            </button>

            <button type="button" disabled={!fundo.imagem} onClick={centralizarFundo}>
              Centralizar
            </button>

            <button type="button" disabled={!fundo.imagem} onClick={() => alterarOrdemFundo("frente")}>
              Trazer à frente
            </button>

            <button type="button" disabled={!fundo.imagem} onClick={() => alterarOrdemFundo("tras")}>
              Enviar para trás
            </button>

            <button className="painel-mapa__botao-perigo" type="button" disabled={!fundo.imagem} onClick={removerFundo}>
              Remover fundo
            </button>
          </div>

          <div className="painel-mapa__fundo-url">
            <input type="url" placeholder="Cole o endereço de uma imagem..." value={urlFundo} onChange={(evento) => setUrlFundo(evento.target
                .value)}/>

            <button type="button" onClick={aplicarUrlFundo}>
              Usar URL
            </button>
          </div>

          <p className="painel-mapa__fundo-nome">
            {fundo.imagem
                ? `Parte selecionada: ${fundo.nome ||
                    "imagem carregada"}`
                : "Adicione uma ou mais imagens para montar a cena."}
          </p>

          {fundoEditavel ? (<p className="painel-mapa__fundo-ajuda">
              Arraste o centro
              para mover, as
              linhas para aumentar
              ou diminuir e os
              cantos para alterar
              largura e altura.
            </p>) : null}

          <div className="painel-mapa__fundo-campos">
            <label>
              Nome da parte

              <input type="text" value={fundo.nome || ""} disabled={!fundo.imagem} onChange={(evento) => atualizarFundo("nome", evento.target.value)}/>
            </label>
            <label>
              Posição X

              <input type="number" value={Math.round(fundo.x)} disabled={!fundo.imagem} onChange={(evento) => atualizarFundo("x", limitarNumero(evento.target
                .value, 0, -100000, 100000))}/>
            </label>

            <label>
              Posição Y

              <input type="number" value={Math.round(fundo.y)} disabled={!fundo.imagem} onChange={(evento) => atualizarFundo("y", limitarNumero(evento.target
                .value, 0, -100000, 100000))}/>
            </label>

            <label>
              Largura

              <input type="number" min={TAMANHO_MINIMO_FUNDO} max="50000" value={Math.round(fundo.largura)} disabled={!fundo.imagem} onChange={(evento) => atualizarFundo("largura", limitarNumero(evento.target
                .value, larguraMundo, TAMANHO_MINIMO_FUNDO, 50000))}/>
            </label>

            <label>
              Altura

              <input type="number" min={TAMANHO_MINIMO_FUNDO} max="50000" value={Math.round(fundo.altura)} disabled={!fundo.imagem} onChange={(evento) => atualizarFundo("altura", limitarNumero(evento.target
                .value, alturaMundo, TAMANHO_MINIMO_FUNDO, 50000))}/>
            </label>

            <label>
              Rotação

              <input type="number" min="-360" max="360" value={fundo.rotacao} disabled={!fundo.imagem} onChange={(evento) => atualizarFundo("rotacao", limitarNumero(evento.target
                .value, 0, -360, 360))}/>
            </label>

            <label>
              Opacidade

              <input type="range" min="0" max="1" step="0.05" value={fundo.opacidade} disabled={!fundo.imagem} onChange={(evento) => atualizarFundo("opacidade", limitarNumero(evento.target
                .value, 1, 0, 1))}/>
            </label>
          </div>
        </section>) : null}

      {painelToken ? (<section className="painel-mapa__config-token" data-assistente="mapa-painel-tokens">
          <header>
            <h3>
              Tokens das fichas
            </h3>

            <button type="button" onClick={() => setPainelAtivo("")}>
              Fechar
            </button>
          </header>

          <p className="painel-mapa__token-ajuda">
            Fichas de jogadores continuam sendo a fonte dos tokens. Clique para selecionar, use “•••” para as ações, dê duplo clique para abrir a mini ficha e arraste para mover. O encaixe nas casas é opcional nas configurações do Grid.
          </p>

          {fichasSeguras.length >
                0 ? (<div className="painel-mapa__lista-fichas">
              {fichasSeguras.map((ficha) => {
                    const tokenDaFicha = tokens.find((token) => token.fichaId ===
                        ficha.id);
                    return (<article className="painel-mapa__ficha-token" key={ficha.id}>
                      {ficha.foto ? (<img src={ficha.foto} alt="" draggable="false"/>) : (<span className="painel-mapa__ficha-token-iniciais">
                          {obterIniciais(ficha.nome)}
                        </span>)}

                      <div>
                        <strong>
                          {ficha.nome ||
                            "Agente sem nome"}
                        </strong>

                        <small>
                          PV{" "}
                          {ficha.pvAtual ??
                            0}
                          /
                          {ficha.pvMaximo ??
                            0}
                          {" • "}
                          PE{" "}
                          {ficha.peAtual ??
                            0}
                          /
                          {ficha.peMaximo ??
                            0}
                          {" • "}
                          SAN{" "}
                          {ficha.sanAtual ??
                            0}
                          /
                          {ficha.sanMaximo ??
                            0}
                        </small>
                      </div>

                      <button type="button" onClick={() => {
                            if (tokenDaFicha) {
                                setTokenSelecionadoId(tokenDaFicha.id);
                                mostrarAviso("Token selecionado.");
                            }
                            else {
                                adicionarToken(ficha);
                            }
                        }}>
                        {tokenDaFicha
                            ? "Selecionar"
                            : "Adicionar"}
                      </button>
                    </article>);
                })}
            </div>) : (<p className="painel-mapa__token-ajuda">
              Nenhuma ficha foi
              criada nesta
              campanha.
            </p>)}

        </section>) : null}

      {guiaAberto ? (<section className="painel-mapa__guia">
          <h3>
            Guia rápido
          </h3>

          <p>
            Selecione um token e clique em uma casa para movê-lo, ou arraste a peça. Paredes e portas fechadas bloqueiam a passagem. A câmera só se move com Espaço + arraste, botão do meio ou toque; use Ctrl + roda para aplicar zoom.
          </p>
        </section>) : null}

      <div className="painel-mapa__moldura">
        <div ref={viewportRef} data-assistente="mapa-area" className={arrastandoMapa
            ? "painel-mapa__area painel-mapa__area--arrastando"
            : "painel-mapa__area"} onPointerDown={iniciarArrasteMapa} onPointerMove={moverArrasteMapa} onPointerUp={finalizarArrasteMapa} onPointerCancel={finalizarArrasteMapa} onWheel={controlarRoda} onScroll={controlarScroll}>
          <div className="painel-mapa__canvas" style={{
            width: `${larguraCanvas}px`,
            height: `${alturaCanvas}px`,
        }}>
            <div className="painel-mapa__mundo" style={{
            width: `${larguraMundo}px`,
            height: `${alturaMundo}px`,
            left: `${margemHorizontal}px`,
            top: `${margemVertical}px`,
            transform: `scale(${camera.zoom})`,
        }} onClick={moverTokenSelecionadoPorClique}>
              {mapaLocal.camadas.mapa.visivel ? (<div className="painel-mapa__fundos-camada">
              {[...mapas].sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0)).map((parte) => {
                const parteAtiva = parte.id === fundo.id;
                const parteEditavel = parteAtiva && fundoEditavel && !mapaLocal.camadas.mapa.bloqueada;
                return (<div className={[
                "painel-mapa__fundo-editor",
                parteEditavel
                    ? "painel-mapa__fundo-editor--editavel"
                    : "",
                parteAtiva && arrastandoFundo
                    ? "painel-mapa__fundo-editor--movendo"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")} key={parte.id} onPointerDown={iniciarArrasteFundo} onPointerMove={moverArrasteFundo} onPointerUp={finalizarArrasteFundo} onPointerCancel={finalizarArrasteFundo} style={{
                left: `${parte.x}px`,
                top: `${parte.y}px`,
                width: `${parte.largura}px`,
                height: `${parte.altura}px`,
                opacity: parte.opacidade,
                transform: `rotate(${parte.rotacao}deg)`,
                zIndex: Number(parte.ordem) || 0,
                pointerEvents: parteEditavel
                    ? "auto"
                    : "none",
            }}>
                  <img className="painel-mapa__fundo-imagem" src={parte.imagem} alt={parte.nome || "Parte do cenário"} draggable="false" onDragStart={(evento) => evento.preventDefault()} onError={() => mostrarAviso("A imagem de fundo não pôde ser exibida.")}/>

                  {parteEditavel ? (<>
                      <button className="painel-mapa__fundo-travar" type="button" onPointerDown={(evento) => {
                    evento.preventDefault();
                    evento.stopPropagation();
                }} onClick={(evento) => {
                    evento.preventDefault();
                    evento.stopPropagation();
                    travarFundo();
                }}>
                        Travar imagem
                      </button>

                      {DIRECOES_REDIMENSIONAMENTO.map(([direcao, nome,]) => (<button className={`painel-mapa__redimensionador painel-mapa__redimensionador--${direcao}`} type="button" aria-label={nome} title={nome} key={direcao} onPointerDown={(evento) => iniciarRedimensionamentoFundo(evento, direcao)} onPointerMove={moverRedimensionamentoFundo} onPointerUp={finalizarRedimensionamentoFundo} onPointerCancel={finalizarRedimensionamentoFundo} onClick={(evento) => {
                        evento.preventDefault();
                        evento.stopPropagation();
                    }}/>))}
                    </>) : null}
                </div>);
              })}
              </div>) : null}

              <div className="painel-mapa__grid-camada" style={{
            backgroundImage: configuracaoGrid
                .imagem,
            backgroundSize: configuracaoGrid
                .tamanho,
        }}/>

              <div className="painel-mapa__sombra-camada"/>

              {mapaLocal.camadas.interface.visivel ? (<CamadaMedicaoMapa
                ativa={painelMedicao}
                largura={larguraMundo}
                altura={alturaMundo}
                medicao={medicao}
                texto={resultadoMedicao.texto}
                aoIniciar={iniciarMedicao}
                aoMover={moverMedicao}
                aoFinalizar={finalizarMedicao}
              />) : null}

              {mapaLocal.camadas.paredes.visivel ? (
                <CamadaEstruturasMapa
                  ativa={painelEstruturas && Boolean(ferramentaEstrutura) && !mapaLocal.camadas.paredes.bloqueada && papelEfetivo === "mestre"}
                  largura={larguraMundo}
                  altura={alturaMundo}
                  paredes={mapaLocal.paredes}
                  portas={mapaLocal.portas}
                  papelAtual={papelEfetivo}
                  aoCriar={criarEstrutura}
                />
              ) : null}

              {mapaLocal.camadas.neblina.visivel && mapaLocal.neblina.ativa ? (
                <CamadaNeblinaMapa
                  ativa={painelNeblina && !mapaLocal.camadas.neblina.bloqueada}
                  ferramenta={ferramentaNeblina}
                  largura={larguraMundo}
                  altura={alturaMundo}
                  neblina={mapaLocal.neblina}
                  papelAtual={papelEfetivo}
                  aoAdicionar={adicionarAreaNeblina}
                />
              ) : null}

              {mapaLocal.camadas.efeitos.visivel ? (
                <CamadaIluminacaoMapa
                  largura={larguraMundo}
                  altura={alturaMundo}
                  iluminacao={mapaLocal.iluminacao}
                  luzes={mapaLocal.luzes}
                  fontesToken={fontesToken}
                  barreiras={barreirasVisao}
                  ativaEdicao={painelLuz && ferramentaLuz === "luz" && !mapaLocal.camadas.efeitos.bloqueada && papelEfetivo === "mestre"}
                  aoAdicionarLuz={adicionarLuz}
                />
              ) : null}

              {mapaLocal.camadas.interface.visivel && grid.mostrarCoordenadas
            ? Array.from({
                length: grid.colunas,
            }, (_, indice) => (<span className="painel-mapa__coordenada" key={`coluna-${indice}`} style={{
                    top: "2px",
                    left: `${indice *
                        grid.tamanhoCelula +
                        24}px`,
                    width: `${Math.max(20, grid.tamanhoCelula -
                        26)}px`,
                    height: "18px",
                }}>
                        {indice +
                    1}
                      </span>))
            : null}

              {mapaLocal.camadas.interface.visivel && grid.mostrarCoordenadas
            ? Array.from({
                length: grid.linhas,
            }, (_, indice) => (<span className="painel-mapa__coordenada" key={`linha-${indice}`} style={{
                    top: `${indice *
                        grid.tamanhoCelula +
                        22}px`,
                    left: "2px",
                    width: "20px",
                    height: `${Math.max(18, grid.tamanhoCelula -
                        24)}px`,
                }}>
                        {indice +
                    1}
                      </span>))
            : null}

              {papelEfetivo === "mestre" && mapaLocal.camadas.interface.visivel && tokens.length === 0 ? (
                <section
                  className="painel-mapa__estado-vazio"
                  onPointerDown={(evento) => evento.stopPropagation()}
                >
                  <span>Preparar encontro</span>
                  <strong>Adicione o primeiro token</strong>
                  <p>Use uma ficha existente. Criação e controle de NPCs ficam no Escudo do Mestre.</p>
                  <div>
                    <button type="button" onClick={() => setPainelAtivo("token")}>Adicionar personagem</button>
                  </div>
                </section>
              ) : null}

              {mapaLocal.camadas.tokens.visivel ? tokensVisiveis.map((token) => {
            const ficha = obterFichaDoToken(token);
            const nome = ficha?.nome ||
                token.nome ||
                "Agente";
            const foto = ficha?.foto ||
                token.foto ||
                "";
            const pv = calcularPorcentagem(ficha?.pvAtual, ficha?.pvMaximo);
            const pe = calcularPorcentagem(ficha?.peAtual, ficha?.peMaximo);
            const san = calcularPorcentagem(ficha?.sanAtual, ficha?.sanMaximo);
            const tamanhoPixels = token.tamanho *
                grid.tamanhoCelula;
            const tokenControlavel = podeControlarToken(token) && !token.bloqueado;
            return (<Fragment key={token.id}><button className={[
                    "painel-mapa__token",
                    tokenSelecionadoId ===
                        token.id
                        ? "painel-mapa__token--selecionado"
                        : "",
                    tokenArrastandoId ===
                        token.id
                        ? "painel-mapa__token--arrastando"
                        : "",
                    token.bloqueado
                        ? "painel-mapa__token--bloqueado"
                        : "",
                    token.oculto
                        ? "painel-mapa__token--oculto"
                        : "",
                    token.tipo === "npc"
                        ? "painel-mapa__token--npc"
                        : "painel-mapa__token--jogador",
                ]
                    .filter(Boolean)
                    .join(" ")} type="button" title={`${nome} — casa ${token.coluna +
                    1}, ${token.linha +
                    1} — frente ${token.rotacao || 0}° — PV ${pv.atual}/${pv.maximo} — PE ${pe.atual}/${pe.maximo} — SAN ${san.atual}/${san.maximo}${tokenControlavel ? " — clique direito para virar" : ""}`} onClick={(evento) => selecionarToken(evento, token)} onDoubleClick={(evento) => {
                    evento.preventDefault();
                    evento.stopPropagation();
                    abrirMiniFichaDoToken(token);
                }} onContextMenu={(evento) => abrirMenuToken(evento, token)} onPointerDown={(evento) => iniciarArrasteToken(evento, token)} onPointerMove={moverArrasteToken} onPointerUp={finalizarArrasteToken} onPointerCancel={finalizarArrasteToken} style={{
                    left: `${token.x}px`,
                    top: `${token.y}px`,
                    width: `${tamanhoPixels}px`,
                    height: `${tamanhoPixels}px`,
                    pointerEvents: fundoEditavel || mapaLocal.camadas.tokens.bloqueada
                        ? "none"
                        : "auto",
                    zIndex: Number(token.ordem) || 1,
                    "--token-rotacao": `${token.rotacao || 0}deg`,
                    "--token-cor": obterCorToken(token.fichaId ||
                        token.id),
                }}>
                      <span className="painel-mapa__token-visual">
                        {foto ? (<img src={foto} alt="" draggable="false"/>) : (<span className="painel-mapa__token-iniciais">
                            {obterIniciais(nome)}
                          </span>)}
                      </span>

                      <span className="painel-mapa__token-marcador" aria-hidden="true" />

                      {token.mostrarPv ? (<span className="painel-mapa__token-recursos">
                          <span className="painel-mapa__token-barra painel-mapa__token-barra--pv">
                            <span style={{
                        width: `${pv.porcentagem}%`,
                    }}/>
                          </span>

                          <span className="painel-mapa__token-barra painel-mapa__token-barra--pe">
                            <span style={{
                        width: `${pe.porcentagem}%`,
                    }}/>
                          </span>

                          <span className="painel-mapa__token-barra painel-mapa__token-barra--san">
                            <span style={{
                        width: `${san.porcentagem}%`,
                    }}/>
                          </span>
                        </span>) : null}

                      {token.mostrarNome ? (<strong className="painel-mapa__token-nome">
                          {nome}
                        </strong>) : null}
                    </button>

                    {tokenSelecionadoId === token.id && tokenArrastandoId !== token.id && tokenControlavel ? (
                      <button
                        className="painel-mapa__token-girar"
                        type="button"
                        aria-label={`Girar ${nome} 90 graus para a direita`}
                        title="Virar token e direcionar a luz"
                        onPointerDown={(evento) => evento.stopPropagation()}
                        onClick={(evento) => {
                          evento.preventDefault();
                          evento.stopPropagation();
                          girarToken(token, 1);
                        }}
                        style={{
                          left: `${token.x - 13}px`,
                          top: `${token.y - 13}px`,
                          zIndex: (Number(token.ordem) || 1) + 2,
                        }}
                      >
                        ↷
                      </button>
                    ) : null}

                    {tokenSelecionadoId === token.id && tokenArrastandoId !== token.id ? (
                      <button
                        className="painel-mapa__token-menu-gatilho"
                        type="button"
                        aria-label={`Abrir ações de ${nome}`}
                        onPointerDown={(evento) => evento.stopPropagation()}
                        onClick={(evento) => abrirMenuToken(evento, token)}
                        style={{
                          left: `${token.x + tamanhoPixels - 13}px`,
                          top: `${token.y - 13}px`,
                          zIndex: (Number(token.ordem) || 1) + 2,
                        }}
                      >
                        •••
                      </button>
                    ) : null}
                  </Fragment>);
        }) : null}
            </div>
          </div>
        </div>

        <div className="painel-mapa__informacao">
          <strong>
            {grid.colunas} ×{" "}
            {grid.linhas}
          </strong>

          <span>
            Casa:{" "}
            {grid.tamanhoCelula}
            px
          </span>

          <span>
            Zoom:{" "}
            {Math.round(camera.zoom *
            100)}
            %
          </span>

          <span>
            Tokens:{" "}
            {tokens.length}
          </span>

          <span>
            Movimento: {grid.encaixarTokens ? "encaixado nas casas" : "livre"}
          </span>
        </div>
      </div>

      <p className="painel-mapa__aviso">
        {aviso}
      </p>

      <footer className="painel-mapa__controles" data-assistente="mapa-camera">
        <span className="painel-mapa__camera-ajuda">Câmera: Espaço + arrastar · Zoom: Ctrl + roda</span>
        <button type="button" aria-label="Diminuir zoom" onClick={() => alterarZoom(camera.zoom -
            0.1)}>
          −
        </button>

        <button type="button" onClick={() => alterarZoom(1)}>
          {Math.round(camera.zoom *
            100)}
          %
        </button>

        <button type="button" aria-label="Aumentar zoom" onClick={() => alterarZoom(camera.zoom +
            0.1)}>
          +
        </button>

        <button type="button" onClick={centralizarMapa}>
          Alvo
        </button>

        <button type="button" onClick={ajustarNaTela}>
          Ajustar tela
        </button>

        <button type="button" onClick={() => setGuiaAberto((aberto) => !aberto)}>
          Guia
        </button>
      </footer>
    </section>);
}
export default PainelMapa;
