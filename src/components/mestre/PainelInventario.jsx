import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ITENS_ARQUIVOS,
  criarItemArquivos,
} from "../../data/itens/itensArquivos.js";

import {
  obterClasseVisualItem,
} from "../../utils/categoriasItens.js";

import {
  CATEGORIAS_INVENTARIO_ARQUIVOS,
  calcularResumoInventario,
  obterDescricaoCategoriaInventario,
  obterRotuloCategoriaNumerica,
  validarInventarioArquivos,
} from "../../utils/regrasInventarioArquivos.js";

import "./PaineisDossie.css";

const ITEM_VAZIO = {
  nome: "",
  tipo: "Equipamento",
  categoria: "Personalizado",
  categoriaNumerica: 0,
  quantidade: 1,
  volume: 1,
  dano: "",
  alcance: "",
  defesa: 0,
  protecao: 0,
  bonusCarga: 0,
  penalidadeMovimento: 0,
  ativo: true,
  descricao: "",
  efeito: "",
  propriedades: [],
  imagemPersonalizada: "",
};

function criarListaSegura(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function normalizarItem(item = {}) {
  return {
    ...ITEM_VAZIO,
    ...item,

    ativo:
      item.ativo !== false,

    quantidade: Math.max(
      0,
      Number(
        item.quantidade ?? 1,
      ) || 0,
    ),

    volume: Math.max(
      0,
      Number(item.volume) || 0,
    ),

    defesa: Math.max(
      0,
      Number(item.defesa) || 0,
    ),

    protecao: Math.max(
      0,
      Number(item.protecao) || 0,
    ),

    bonusCarga: Math.max(
      0,
      Number(item.bonusCarga) || 0,
    ),

    penalidadeMovimento:
      Math.max(
        0,
        Number(
          item.penalidadeMovimento,
        ) || 0,
      ),

    propriedades:
      criarListaSegura(
        item.propriedades,
      ),

    imagemPersonalizada:
      String(
        item.imagemPersonalizada ||
          item.foto ||
          "",
      ),
  };
}

function obterIconeItem(tipo) {
  if (tipo === "Arma") {
    return "⚔";
  }

  if (tipo === "Proteção") {
    return "⬟";
  }

  if (tipo === "Explosivo") {
    return "✹";
  }

  if (tipo === "Consumível") {
    return "✚";
  }

  return "▣";
}

function obterImagemItem(item) {
  const imagemPersonalizada =
    String(
      item.imagemPersonalizada ||
        item.foto ||
        "",
    ).trim();

  if (imagemPersonalizada) {
    return imagemPersonalizada;
  }

  const imagemCatalogo =
    String(
      item.imagem || "",
    ).trim();

  const pareceEndereco =
    imagemCatalogo.startsWith(
      "data:image/",
    ) ||
    imagemCatalogo.startsWith(
      "blob:",
    ) ||
    imagemCatalogo.startsWith(
      "http://",
    ) ||
    imagemCatalogo.startsWith(
      "https://",
    ) ||
    imagemCatalogo.startsWith(
      "/",
    ) ||
    imagemCatalogo.startsWith(
      "./",
    ) ||
    imagemCatalogo.startsWith(
      "../",
    );

  return pareceEndereco
    ? imagemCatalogo
    : "";
}

function lerArquivoComoDataUrl(
  arquivo,
) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const leitor =
        new FileReader();

      leitor.onload = () =>
        resolve(
          String(
            leitor.result || "",
          ),
        );

      leitor.onerror = () =>
        reject(
          new Error(
            "Não foi possível ler a imagem.",
          ),
        );

      leitor.readAsDataURL(
        arquivo,
      );
    },
  );
}

function carregarImagem(
  origem,
) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const imagem =
        new Image();

      imagem.onload = () =>
        resolve(imagem);

      imagem.onerror = () =>
        reject(
          new Error(
            "Não foi possível carregar a imagem.",
          ),
        );

      imagem.src = origem;
    },
  );
}

async function prepararImagemItem(
  arquivo,
) {
  const dataUrlOriginal =
    await lerArquivoComoDataUrl(
      arquivo,
    );

  const imagem =
    await carregarImagem(
      dataUrlOriginal,
    );

  const limite = 800;

  const maiorLado =
    Math.max(
      imagem.naturalWidth,
      imagem.naturalHeight,
    );

  const escala =
    maiorLado > limite
      ? limite / maiorLado
      : 1;

  const largura =
    Math.max(
      1,
      Math.round(
        imagem.naturalWidth *
          escala,
      ),
    );

  const altura =
    Math.max(
      1,
      Math.round(
        imagem.naturalHeight *
          escala,
      ),
    );

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width = largura;
  canvas.height = altura;

  const contexto =
    canvas.getContext("2d");

  if (!contexto) {
    return dataUrlOriginal;
  }

  contexto.drawImage(
    imagem,
    0,
    0,
    largura,
    altura,
  );

  const imagemWebp =
    canvas.toDataURL(
      "image/webp",
      0.84,
    );

  if (
    imagemWebp.startsWith(
      "data:image/webp",
    )
  ) {
    return imagemWebp;
  }

  return canvas.toDataURL(
    "image/jpeg",
    0.84,
  );
}

function PainelInventario({
  fichaAtiva = null,
  itens = [],
  aoAdicionarItem,
  aoAtualizarItem,
  aoRemoverItem,
}) {
  const arquivoImagemRef =
    useRef(null);

  const [novoItem, setNovoItem] =
    useState({
      ...ITEM_VAZIO,
    });

  const [
    itensLocais,
    setItensLocais,
  ] = useState([]);

  const [
    itemAbertoId,
    setItemAbertoId,
  ] = useState("");

  const [
    painelAdicaoAberto,
    setPainelAdicaoAberto,
  ] = useState(false);

  const [
    modoAdicao,
    setModoAdicao,
  ] = useState("catalogo");

  const [
    buscaCatalogo,
    setBuscaCatalogo,
  ] = useState("");

  const [
    tipoCatalogo,
    setTipoCatalogo,
  ] = useState("todos");

  const [
    itemImagemId,
    setItemImagemId,
  ] = useState("");

  const [
    carregandoImagemId,
    setCarregandoImagemId,
  ] = useState("");

  const [
    mensagemImagem,
    setMensagemImagem,
  ] = useState("");

  const [
    mensagemLimite,
    setMensagemLimite,
  ] = useState("");

  useEffect(() => {
    const listaNormalizada =
      Array.isArray(itens)
        ? itens.map(
            normalizarItem,
          )
        : [];

    setItensLocais(
      listaNormalizada,
    );

    setItemAbertoId(
      (itemAbertoAnterior) => {
        const itemAindaExiste =
          listaNormalizada.some(
            (item) =>
              item.id ===
              itemAbertoAnterior,
          );

        return itemAindaExiste
          ? itemAbertoAnterior
          : "";
      },
    );
  }, [itens]);

  const tiposDisponiveis =
    useMemo(() => {
      const tipos =
        new Set(
          ITENS_ARQUIVOS.map(
            (item) =>
              item.tipo ||
              "Equipamento",
          ),
        );

      return Array.from(
        tipos,
      ).sort(
        (
          primeiro,
          segundo,
        ) =>
          primeiro.localeCompare(
            segundo,
            "pt-BR",
          ),
      );
    }, []);

  const itensCatalogoFiltrados =
    useMemo(() => {
      const busca =
        normalizarTexto(
          buscaCatalogo,
        );

      return ITENS_ARQUIVOS.filter(
        (item) => {
          const passaTipo =
            tipoCatalogo ===
              "todos" ||
            item.tipo ===
              tipoCatalogo;

          if (!passaTipo) {
            return false;
          }

          if (!busca) {
            return true;
          }

          const textoItem =
            normalizarTexto(
              [
                item.nome,
                item.tipo,
                item.categoria,
                item.grupo,
                item.dano,
                item.alcance,
                item.efeito,
                item.descricao,
                ...criarListaSegura(
                  item.propriedades,
                ),
              ].join(" "),
            );

          return textoItem.includes(
            busca,
          );
        },
      );
    }, [
      buscaCatalogo,
      tipoCatalogo,
    ]);

  function atualizarCampoNovoItem(
    nomeCampo,
    valor,
  ) {
    setNovoItem(
      (itemAnterior) => ({
        ...itemAnterior,
        [nomeCampo]: valor,
      }),
    );
  }

  function atualizarNumeroNovoItem(
    nomeCampo,
    valor,
  ) {
    atualizarCampoNovoItem(
      nomeCampo,
      Math.max(
        0,
        Number(valor) || 0,
      ),
    );
  }

  function registrarItemAdicionado(
    itemRecebido,
  ) {
    const itemCriado =
      normalizarItem(
        itemRecebido,
      );

    const proximaLista = [
      itemCriado,
      ...itensLocais,
    ];
    const validacao =
      validarInventarioArquivos(
        fichaAtiva,
        proximaLista,
      );

    if (!validacao.permitido) {
      setMensagemLimite(
        validacao.mensagem,
      );
      return false;
    }

    setItensLocais(proximaLista);
    setMensagemLimite(
      validacao.mensagem,
    );

    setItemAbertoId(
      itemCriado.id,
    );

    if (
      typeof aoAdicionarItem ===
      "function"
    ) {
      aoAdicionarItem(
        itemCriado,
      );
    }

    return true;
  }

  function adicionarItemCatalogo(
    itemCatalogo,
  ) {
    const itemCriado =
      criarItemArquivos(
        itemCatalogo,
      );

    return registrarItemAdicionado(
      itemCriado,
    );
  }

  function adicionarItemManual(
    evento,
  ) {
    evento.preventDefault();

    if (!novoItem.nome.trim()) {
      return;
    }

    const itemCriado =
      criarItemArquivos({
        ...novoItem,

        itemCatalogoId: "",

        nome:
          novoItem.nome.trim(),

        categoria:
          novoItem.categoria ||
          "Personalizado",
      });

    const adicionado =
      registrarItemAdicionado(
      itemCriado,
    );

    if (!adicionado) {
      return;
    }

    setNovoItem({
      ...ITEM_VAZIO,
    });

    setPainelAdicaoAberto(
      false,
    );
  }

  function atualizarItem(
    item,
    nomeCampo,
    valor,
  ) {
    const itemAtualizado = {
      ...item,
      [nomeCampo]: valor,
    };

    const proximaLista =
      itensLocais.map(
        (itemAtual) =>
          itemAtual.id === item.id
            ? itemAtualizado
            : itemAtual,
      );
    const resumoAtual =
      calcularResumoInventario(
        fichaAtiva,
        itensLocais,
      );
    const validacao =
      validarInventarioArquivos(
        fichaAtiva,
        proximaLista,
      );
    const resumoNovo =
      validacao.resumo;
    const reduzOuMantemExcessos =
      resumoNovo.cargaAtual <=
        resumoAtual.cargaAtual &&
      [1, 2, 3, 4].every(
        (categoria) =>
          resumoNovo
            .usadosPorCategoria[
              categoria
            ] <=
          resumoAtual
            .usadosPorCategoria[
              categoria
            ],
      );

    if (
      !validacao.permitido &&
      !reduzOuMantemExcessos
    ) {
      setMensagemLimite(
        validacao.mensagem,
      );
      return false;
    }

    setItensLocais(proximaLista);
    setMensagemLimite(
      validacao.permitido
        ? validacao.mensagem
        : `${validacao.mensagem} A redução foi aceita para ajudar a regularizar a ficha.`,
    );

    if (
      typeof aoAtualizarItem ===
      "function"
    ) {
      aoAtualizarItem(
        itemAtualizado,
      );
    }

    return true;
  }

  function atualizarNumeroItem(
    item,
    nomeCampo,
    valor,
  ) {
    atualizarItem(
      item,
      nomeCampo,
      Math.max(
        0,
        Number(valor) || 0,
      ),
    );
  }

  function alternarDetalhesItem(
    item,
  ) {
    setItemAbertoId(
      (itemAbertoAnterior) =>
        itemAbertoAnterior ===
        item.id
          ? ""
          : item.id,
    );
  }

  function alternarPainelAdicao() {
    setPainelAdicaoAberto(
      (valorAnterior) =>
        !valorAnterior,
    );
  }

  function removerItem(item) {
    setItensLocais(
      (listaAnterior) =>
        listaAnterior.filter(
          (itemAtual) =>
            itemAtual.id !==
            item.id,
        ),
    );

    setItemAbertoId(
      (itemAbertoAnterior) =>
        itemAbertoAnterior ===
        item.id
          ? ""
          : itemAbertoAnterior,
    );

    if (
      typeof aoRemoverItem ===
      "function"
    ) {
      aoRemoverItem(item);
    }

    setMensagemLimite(
      "Item removido. Os limites foram recalculados.",
    );
  }

  function abrirSeletorImagem(
    item,
  ) {
    setItemImagemId(
      item.id,
    );

    setMensagemImagem("");

    arquivoImagemRef.current?.click();
  }

  async function trocarImagemItem(
    evento,
  ) {
    const arquivo =
      evento.target.files?.[0];

    evento.target.value = "";

    const identificador =
      itemImagemId;

    if (
      !arquivo ||
      !identificador
    ) {
      return;
    }

    if (
      !arquivo.type.startsWith(
        "image/",
      )
    ) {
      setMensagemImagem(
        "Escolha um arquivo de imagem.",
      );

      return;
    }

    const itemAtual =
      itensLocais.find(
        (item) =>
          item.id ===
          identificador,
      );

    if (!itemAtual) {
      return;
    }

    setCarregandoImagemId(
      identificador,
    );

    setMensagemImagem(
      "Preparando imagem...",
    );

    try {
      const imagemPreparada =
        await prepararImagemItem(
          arquivo,
        );

      atualizarItem(
        itemAtual,
        "imagemPersonalizada",
        imagemPreparada,
      );

      setMensagemImagem(
        "Foto do item atualizada.",
      );
    } catch {
      setMensagemImagem(
        "Não foi possível carregar essa imagem.",
      );
    } finally {
      setCarregandoImagemId(
        "",
      );

      setItemImagemId("");
    }
  }

  function removerImagemItem(
    item,
  ) {
    atualizarItem(
      item,
      "imagemPersonalizada",
      "",
    );

    setMensagemImagem(
      "Foto personalizada removida.",
    );
  }

  const nomeFicha =
    fichaAtiva?.nome ||
    "Nenhuma ficha selecionada";

  const resumoInventario =
    calcularResumoInventario(
      fichaAtiva,
      itensLocais,
    );

  const volumeTotal =
    resumoInventario.cargaAtual;

  return (
    <section className="painel-dossie painel-inventario-atualizado">
      <style>
        {`
          .painel-inventario-atualizado {
            color: #24160f;
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
          }

          .painel-inventario-atualizado .painel-dossie__cabecalho h2,
          .painel-inventario-atualizado h3,
          .painel-inventario-atualizado h4 {
            font-family:
              "Special Elite",
              "Courier New",
              monospace;
            letter-spacing: 0.02em;
          }

          .painel-inventario-atualizado .painel-dossie__cabecalho p,
          .painel-inventario-atualizado p,
          .painel-inventario-atualizado small,
          .painel-inventario-atualizado label,
          .painel-inventario-atualizado input,
          .painel-inventario-atualizado textarea,
          .painel-inventario-atualizado select,
          .painel-inventario-atualizado button {
            font-family:
              "Courier Prime",
              "Courier New",
              monospace;
          }

          .painel-inventario-atualizado
          .inventario-adicao__topo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }

          .painel-inventario-atualizado
          .inventario-adicao__topo h3 {
            margin: 0;
            font-size: 1.25rem;
            color: #24160f;
          }

          .painel-inventario-atualizado
          .inventario-adicao__modos {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 16px;
          }

          .painel-inventario-atualizado
          .inventario-adicao__modos button {
            min-height: 40px;
            padding: 0 14px;
            border: 1px solid rgba(64, 42, 24, 0.66);
            background:
              linear-gradient(
                180deg,
                #f1dfbd,
                #d8b67a
              );
            color: #2a1a12;
            font-weight: 700;
            cursor: pointer;
          }

          .painel-inventario-atualizado
          .inventario-adicao__modos
          button[aria-pressed="true"] {
            border-color: #8b1f1f;
            background:
              linear-gradient(
                180deg,
                #f3dca5,
                #c89a49
              );
            box-shadow:
              inset 0 -3px 0 #8b1f1f;
          }

          .painel-inventario-atualizado
          .inventario-catalogo {
            display: grid;
            gap: 14px;
            margin-top: 16px;
          }

          .painel-inventario-atualizado .item-cor--fogo {
            --item-cor: #a72f35;
            --item-cor-clara: rgba(167, 47, 53, 0.16);
          }

          .painel-inventario-atualizado .item-cor--corte {
            --item-cor: #d16a25;
            --item-cor-clara: rgba(209, 106, 37, 0.17);
          }

          .painel-inventario-atualizado .item-cor--impacto {
            --item-cor: #8a5a34;
            --item-cor-clara: rgba(138, 90, 52, 0.17);
          }

          .painel-inventario-atualizado .item-cor--perfuracao {
            --item-cor: #b08b24;
            --item-cor-clara: rgba(176, 139, 36, 0.17);
          }

          .painel-inventario-atualizado .item-cor--protecao {
            --item-cor: #3975a6;
            --item-cor-clara: rgba(57, 117, 166, 0.17);
          }

          .painel-inventario-atualizado .item-cor--explosivo {
            --item-cor: #8f2635;
            --item-cor-clara: rgba(143, 38, 53, 0.18);
          }

          .painel-inventario-atualizado .item-cor--consumivel {
            --item-cor: #3f7f58;
            --item-cor-clara: rgba(63, 127, 88, 0.17);
          }

          .painel-inventario-atualizado .item-cor--ferramenta {
            --item-cor: #6951a1;
            --item-cor-clara: rgba(105, 81, 161, 0.17);
          }

          .painel-inventario-atualizado .item-cor--geral {
            --item-cor: #806d55;
            --item-cor-clara: rgba(128, 109, 85, 0.14);
          }

          .painel-inventario-atualizado
          .inventario-catalogo__filtros {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              minmax(180px, 220px);
            gap: 10px;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__filtros
          input,
          .painel-inventario-atualizado
          .inventario-catalogo__filtros
          select {
            width: 100%;
            min-width: 0;
            min-height: 44px;
            padding: 0 12px;
            border: 1px solid rgba(72, 51, 29, 0.5);
            background: rgba(255, 248, 231, 0.94);
            color: #2d1a10;
            font-size: 0.95rem;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__quantidade {
            margin: 0;
            color: #4b2d18;
            font-size: 0.8rem;
            font-weight: 700;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__lista {
            display: grid;
            grid-template-columns:
              repeat(
                auto-fit,
                minmax(270px, 1fr)
              );
            gap: 14px;
            max-height: 560px;
            overflow-y: auto;
            padding-right: 6px;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__item {
            display: grid;
            gap: 12px;
            padding: 14px;
            border: 1px solid rgba(67, 45, 25, 0.42);
            border-left: 7px solid var(--item-cor, #8b6b3e);
            background:
              linear-gradient(
                115deg,
                var(--item-cor-clara, rgba(128, 109, 85, 0.14)),
                transparent 38%
              ),
              linear-gradient(
                180deg,
                rgba(255, 247, 225, 0.96),
                rgba(240, 225, 192, 0.92)
              );
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.48),
              0 2px 8px rgba(0, 0, 0, 0.08);
          }

          .painel-inventario-atualizado
          .inventario-catalogo__item
          header {
            display: grid;
            grid-template-columns:
              42px
              minmax(0, 1fr);
            align-items: center;
            gap: 10px;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__icone {
            display: grid;
            place-items: center;
            width: 42px;
            height: 42px;
            border: 1px solid rgba(71, 46, 26, 0.8);
            background: #2c1b13;
            color: #efd594;
            font-size: 1.15rem;
            font-weight: 700;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__item
          header div {
            display: grid;
            gap: 3px;
            min-width: 0;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__item
          header small {
            color: #7b2b22;
            font-size: 0.72rem;
            font-weight: 700;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__item
          header strong {
            color: #21140d;
            font-size: 1.12rem;
            line-height: 1.1;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__item p {
            margin: 0;
            color: #372116;
            font-size: 0.85rem;
            line-height: 1.55;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__dados {
            display: flex;
            gap: 7px;
            flex-wrap: wrap;
          }

          .painel-inventario-atualizado
          .inventario-catalogo__dados span {
            padding: 4px 8px;
            border: 1px solid rgba(76, 50, 28, 0.28);
            background:
              rgba(255, 255, 255, 0.34);
            color: #2e1c12;
            font-size: 0.72rem;
            font-weight: 700;
          }

          .painel-inventario-atualizado
          .painel-dossie__botao-principal,
          .painel-inventario-atualizado
          .inventario-catalogo__item button,
          .painel-inventario-atualizado
          .inventario-arquivos__imagem-acoes button,
          .painel-inventario-atualizado
          .inventario-arquivos__informacoes header button {
            min-height: 38px;
            padding: 0 14px;
            border: 1px solid rgba(69, 46, 26, 0.68);
            background:
              linear-gradient(
                180deg,
                #eed8a3,
                #c99f56
              );
            color: #23150d;
            font-size: 0.76rem;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
          }

          .painel-inventario-atualizado
          .painel-dossie__botao-principal:hover,
          .painel-inventario-atualizado
          .inventario-catalogo__item button:hover,
          .painel-inventario-atualizado
          .inventario-arquivos__imagem-acoes button:hover,
          .painel-inventario-atualizado
          .inventario-arquivos__informacoes header button:hover {
            filter: brightness(1.04);
          }

          .painel-inventario-atualizado
          .painel-dossie__conteudo > h3 {
            margin-bottom: 14px;
            font-size: 1.22rem;
          }

          .painel-inventario-atualizado
          .inventario-arquivos {
            display: grid;
            gap: 14px;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__item {
            border: 1px solid rgba(66, 45, 26, 0.35);
            border-left: 7px solid var(--item-cor, #8b6b3e);
            background:
              linear-gradient(
                115deg,
                var(--item-cor-clara, rgba(128, 109, 85, 0.14)),
                transparent 34%
              ),
              linear-gradient(
                180deg,
                rgba(255, 248, 233, 0.95),
                rgba(239, 225, 198, 0.92)
              );
            overflow: hidden;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__abrir {
            display: grid;
            grid-template-columns:
              54px
              minmax(0, 1fr)
              auto
              auto;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 14px;
            border: 0;
            background: transparent;
            color: #25170f;
            text-align: left;
            cursor: pointer;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__icone-resumo {
            display: grid;
            place-items: center;
            width: 54px;
            height: 54px;
            border: 1px solid rgba(75, 49, 28, 0.68);
            background: #2c1c13;
            color: #f0d58d;
            font-size: 1.35rem;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__nome-resumo {
            display: grid;
            gap: 4px;
            min-width: 0;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__nome-resumo small {
            color: #8a2a24;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__nome-resumo strong {
            color: #1f130d;
            font-size: 1.12rem;
            line-height: 1.1;
            word-break: break-word;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__numeros-resumo {
            justify-self: end;
            padding: 8px 10px;
            border: 1px solid rgba(74, 50, 28, 0.28);
            background: rgba(255, 255, 255, 0.32);
            color: #382217;
            font-size: 0.74rem;
            font-weight: 700;
            white-space: nowrap;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__acao-resumo {
            justify-self: end;
            color: #7f241d;
            font-size: 0.74rem;
            font-weight: 700;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__detalhes {
            display: grid;
            grid-template-columns:
              minmax(180px, 240px)
              minmax(0, 1fr);
            gap: 18px;
            padding: 0 14px 16px;
            border-top: 1px solid rgba(70, 49, 30, 0.16);
          }

          .painel-inventario-atualizado
          .inventario-arquivos__imagem {
            display: grid;
            gap: 8px;
            align-content: start;
            padding-top: 14px;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__imagem-botao {
            position: relative;
            display: grid;
            place-items: center;
            width: 100%;
            min-height: 210px;
            padding: 0;
            overflow: hidden;
            border: 2px dashed rgba(86, 55, 31, 0.68);
            background:
              linear-gradient(
                135deg,
                rgba(120, 78, 43, 0.14),
                rgba(255, 243, 214, 0.5)
              );
            cursor: pointer;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__imagem-botao img {
            display: block;
            width: 100%;
            height: 100%;
            min-height: 210px;
            max-height: 320px;
            object-fit: cover;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__imagem-botao > span {
            font-size: 3.6rem;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__imagem-legenda {
            position: absolute;
            left: 8px;
            right: 8px;
            bottom: 8px;
            padding: 6px 8px;
            background: rgba(20, 13, 9, 0.86);
            color: #f3dba3;
            font-size: 0.66rem;
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__imagem-acoes {
            display: grid;
            gap: 6px;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__imagem-acoes button {
            width: 100%;
          }

          .painel-inventario-atualizado
          .inventario-imagem__mensagem {
            margin: 0;
            color: #613118;
            font-size: 0.72rem;
            font-weight: 700;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes {
            display: grid;
            gap: 14px;
            padding-top: 14px;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            flex-wrap: wrap;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes header span {
            display: inline-block;
            margin-bottom: 4px;
            color: #8a2a24;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes header h4 {
            margin: 0;
            color: #1f130d;
            font-size: 1.35rem;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes dl {
            display: grid;
            grid-template-columns:
              repeat(
                auto-fit,
                minmax(160px, 1fr)
              );
            gap: 10px;
            margin: 0;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes dl > div {
            display: grid;
            gap: 6px;
            padding: 10px;
            border: 1px solid rgba(72, 48, 27, 0.18);
            background: rgba(255, 255, 255, 0.22);
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes dt {
            color: #69341d;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes dd {
            margin: 0;
            color: #24160f;
            font-size: 0.95rem;
            font-weight: 700;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes input[type="number"] {
            width: 100%;
            min-height: 38px;
            padding: 0 10px;
            border: 1px solid rgba(73, 51, 31, 0.4);
            background: rgba(255, 248, 234, 0.96);
            color: #24160f;
            font-size: 0.95rem;
            font-weight: 700;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes input[type="checkbox"] {
            width: 18px;
            height: 18px;
          }

          .painel-inventario-atualizado
          .inventario-arquivos__informacoes p {
            margin: 0;
            color: #352116;
            font-size: 0.9rem;
            line-height: 1.6;
          }

          .painel-inventario-atualizado
          .painel-dossie__vazio {
            padding: 14px;
            border: 1px dashed rgba(68, 45, 26, 0.36);
            background: rgba(255, 250, 237, 0.6);
            color: #4a2b17;
          }

          @media (max-width: 900px) {
            .painel-inventario-atualizado
            .inventario-arquivos__abrir {
              grid-template-columns:
                54px
                minmax(0, 1fr);
            }

            .painel-inventario-atualizado
            .inventario-arquivos__numeros-resumo,
            .painel-inventario-atualizado
            .inventario-arquivos__acao-resumo {
              justify-self: start;
            }

            .painel-inventario-atualizado
            .inventario-arquivos__detalhes {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 700px) {
            .painel-inventario-atualizado
            .inventario-catalogo__filtros {
              grid-template-columns: 1fr;
            }

            .painel-inventario-atualizado
            .inventario-catalogo__lista {
              grid-template-columns: 1fr;
            }

            .painel-inventario-atualizado
            .inventario-arquivos__abrir {
              gap: 10px;
              padding: 12px;
            }

            .painel-inventario-atualizado
            .inventario-arquivos__nome-resumo strong {
              font-size: 1rem;
            }

            .painel-inventario-atualizado
            .inventario-arquivos__informacoes dl {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <input
        ref={arquivoImagemRef}
        type="file"
        accept="image/*"
        hidden
        onChange={
          trocarImagemItem
        }
      />

      <header className="painel-dossie__cabecalho">
        <div>
          <span>
            Equipamentos do agente
          </span>

          <h2>Inventário</h2>

          <p>
            Ficha ativa:{" "}
            <strong>
              {nomeFicha}
            </strong>
          </p>
        </div>

        <div className="painel-dossie__resumo">
          <span>
            Espaços carregados
          </span>

          <strong>
            {volumeTotal}/
            {
              resumoInventario.cargaMaxima
            }
          </strong>
        </div>
      </header>

      <section
        className={`inventario-limites ${
          resumoInventario.valido
            ? "inventario-limites--valido"
            : "inventario-limites--excedido"
        }`}
        aria-label="Limites do inventário"
      >
        <header>
          <div>
            <span>Regra automática</span>
            <h3>
              Limites de{" "}
              {resumoInventario.patente}
            </h3>
          </div>

          <strong>
            Carga {volumeTotal}/
            {
              resumoInventario.cargaMaxima
            }
          </strong>
        </header>

        <div className="inventario-limites__categorias">
          {CATEGORIAS_INVENTARIO_ARQUIVOS.map(
            (categoria) => {
              const limite =
                resumoInventario
                  .limitesPorCategoria[
                  categoria
                ];
              const usados =
                resumoInventario
                  .usadosPorCategoria[
                  categoria
                ];
              const excedida =
                Number.isFinite(
                  limite,
                ) &&
                usados > limite;

              return (
                <div
                  className={
                    excedida
                      ? "inventario-limites__categoria inventario-limites__categoria--excedida"
                      : "inventario-limites__categoria"
                  }
                  key={categoria}
                  title={obterDescricaoCategoriaInventario(
                    categoria,
                  )}
                >
                  <span>
                    Categoria{" "}
                    {obterRotuloCategoriaNumerica(
                      categoria,
                    )}
                  </span>
                  <strong>
                    {usados}/
                    {Number.isFinite(
                      limite,
                    )
                      ? limite
                      : "livre"}
                  </strong>
                  <small>
                    {obterDescricaoCategoriaInventario(
                      categoria,
                    )}
                  </small>
                </div>
              );
            },
          )}
        </div>

        {mensagemLimite ? (
          <p
            className="inventario-limites__mensagem"
            role="status"
          >
            {mensagemLimite}
          </p>
        ) : null}
      </section>

      <section className="painel-dossie__formulario">
        <div className="inventario-adicao__topo">
          <h3>
            Adicionar item
          </h3>

          <button
            className="painel-dossie__botao-principal"
            type="button"
            onClick={
              alternarPainelAdicao
            }
          >
            {painelAdicaoAberto
              ? "Fechar"
              : "Adicionar item"}
          </button>
        </div>

        {painelAdicaoAberto ? (
          <>
            <div className="inventario-adicao__modos">
              <button
                type="button"
                aria-pressed={
                  modoAdicao ===
                  "catalogo"
                }
                onClick={() =>
                  setModoAdicao(
                    "catalogo",
                  )
                }
              >
                Escolher do catálogo
              </button>

              <button
                type="button"
                aria-pressed={
                  modoAdicao ===
                  "manual"
                }
                onClick={() =>
                  setModoAdicao(
                    "manual",
                  )
                }
              >
                Criar item personalizado
              </button>
            </div>

            {modoAdicao ===
            "catalogo" ? (
              <div className="inventario-catalogo">
                <div className="inventario-catalogo__filtros">
                  <input
                    type="search"
                    placeholder="Buscar arma, equipamento, efeito..."
                    value={
                      buscaCatalogo
                    }
                    onChange={(
                      evento,
                    ) =>
                      setBuscaCatalogo(
                        evento.target
                          .value,
                      )
                    }
                  />

                  <select
                    value={
                      tipoCatalogo
                    }
                    onChange={(
                      evento,
                    ) =>
                      setTipoCatalogo(
                        evento.target
                          .value,
                      )
                    }
                  >
                    <option value="todos">
                      Todos os tipos
                    </option>

                    {tiposDisponiveis.map(
                      (tipo) => (
                        <option
                          value={tipo}
                          key={tipo}
                        >
                          {tipo}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <p className="inventario-catalogo__quantidade">
                  {
                    itensCatalogoFiltrados.length
                  }{" "}
                  itens encontrados
                </p>

                <div className="inventario-catalogo__lista">
                  {itensCatalogoFiltrados.map(
                    (itemCatalogo) => (
                      <article
                        className={`inventario-catalogo__item ${obterClasseVisualItem(itemCatalogo)}`}
                        key={
                          itemCatalogo.id
                        }
                      >
                        <header>
                          <span className="inventario-catalogo__icone">
                            {obterIconeItem(
                              itemCatalogo.tipo,
                            )}
                          </span>

                          <div>
                            <small>
                              {itemCatalogo.tipo}
                              {" — "}
                              {itemCatalogo.categoria}
                            </small>

                            <strong>
                              {
                                itemCatalogo.nome
                              }
                            </strong>
                          </div>
                        </header>

                        <div className="inventario-catalogo__dados">
                          <span>
                            Volume{" "}
                            {itemCatalogo.volume ??
                              0}
                          </span>

                          <span>
                            Categoria{" "}
                            {obterRotuloCategoriaNumerica(
                              itemCatalogo.categoriaNumerica,
                            )}
                          </span>

                          {itemCatalogo.dano ? (
                            <span>
                              Dano{" "}
                              {
                                itemCatalogo.dano
                              }
                            </span>
                          ) : null}

                          {itemCatalogo.alcance ? (
                            <span>
                              {
                                itemCatalogo.alcance
                              }
                            </span>
                          ) : null}

                          {Number(
                            itemCatalogo.defesa,
                          ) > 0 ? (
                            <span>
                              Defesa +
                              {
                                itemCatalogo.defesa
                              }
                            </span>
                          ) : null}
                        </div>

                        <p>
                          {itemCatalogo.efeito ||
                            itemCatalogo.descricao ||
                            "Sem descrição."}
                        </p>

                        <button
                          className="painel-dossie__botao-principal"
                          type="button"
                          onClick={() =>
                            adicionarItemCatalogo(
                              itemCatalogo,
                            )
                          }
                        >
                          Adicionar ao inventário
                        </button>
                      </article>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <form
                onSubmit={
                  adicionarItemManual
                }
                style={{
                  display: "grid",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                <div className="painel-dossie__campos">
                  <label>
                    Nome

                    <input
                      type="text"
                      maxLength={50}
                      placeholder="Ex.: Lanterna especial"
                      value={
                        novoItem.nome
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarCampoNovoItem(
                          "nome",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Tipo

                    <select
                      value={
                        novoItem.tipo
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarCampoNovoItem(
                          "tipo",
                          evento.target
                            .value,
                        )
                      }
                    >
                      <option value="Equipamento">
                        Equipamento
                      </option>

                      <option value="Arma">
                        Arma
                      </option>

                      <option value="Proteção">
                        Proteção
                      </option>

                      <option value="Consumível">
                        Consumível
                      </option>

                      <option value="Explosivo">
                        Explosivo
                      </option>

                      <option value="Item especial">
                        Item especial
                      </option>
                    </select>
                  </label>

                  <label>
                    Categoria do item

                    <select
                      value={
                        novoItem.categoriaNumerica
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarNumeroNovoItem(
                          "categoriaNumerica",
                          evento.target
                            .value,
                        )
                      }
                    >
                      {CATEGORIAS_INVENTARIO_ARQUIVOS.map(
                        (categoria) => (
                          <option
                            value={categoria}
                            key={categoria}
                          >
                            Categoria{" "}
                            {obterRotuloCategoriaNumerica(
                              categoria,
                            )}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label>
                    Quantidade

                    <input
                      type="number"
                      min="1"
                      value={
                        novoItem.quantidade
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarNumeroNovoItem(
                          "quantidade",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Volume

                    <input
                      type="number"
                      min="0"
                      value={
                        novoItem.volume
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarNumeroNovoItem(
                          "volume",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Dano

                    <input
                      type="text"
                      maxLength={30}
                      placeholder="Ex.: 2d6"
                      value={
                        novoItem.dano
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarCampoNovoItem(
                          "dano",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Alcance

                    <input
                      type="text"
                      maxLength={30}
                      placeholder="Ex.: Curto"
                      value={
                        novoItem.alcance
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarCampoNovoItem(
                          "alcance",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Bônus de defesa

                    <input
                      type="number"
                      min="0"
                      value={
                        novoItem.defesa
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarNumeroNovoItem(
                          "defesa",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Proteção

                    <input
                      type="number"
                      min="0"
                      value={
                        novoItem.protecao
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarNumeroNovoItem(
                          "protecao",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Bônus de carga

                    <input
                      type="number"
                      min="0"
                      value={
                        novoItem.bonusCarga
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarNumeroNovoItem(
                          "bonusCarga",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Penalidade de movimento

                    <input
                      type="number"
                      min="0"
                      value={
                        novoItem
                          .penalidadeMovimento
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarNumeroNovoItem(
                          "penalidadeMovimento",
                          evento.target
                            .value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Item em uso

                    <input
                      type="checkbox"
                      checked={
                        novoItem.ativo
                      }
                      onChange={(
                        evento,
                      ) =>
                        atualizarCampoNovoItem(
                          "ativo",
                          evento.target
                            .checked,
                        )
                      }
                    />
                  </label>
                </div>

                <label className="painel-dossie__campo-grande">
                  Descrição

                  <textarea
                    rows="4"
                    maxLength={1000}
                    placeholder="Efeito, bônus ou observações do item..."
                    value={
                      novoItem.descricao
                    }
                    onChange={(
                      evento,
                    ) =>
                      atualizarCampoNovoItem(
                        "descricao",
                        evento.target
                          .value,
                      )
                    }
                  />
                </label>

                <button
                  className="painel-dossie__botao-principal"
                  type="submit"
                >
                  Adicionar ao inventário
                </button>
              </form>
            )}
          </>
        ) : null}
      </section>

      <section className="painel-dossie__conteudo">
        <h3>
          Itens carregados
        </h3>

        {itensLocais.length ===
        0 ? (
          <p className="painel-dossie__vazio">
            Nenhum item adicionado
            ao inventário desta
            ficha.
          </p>
        ) : (
          <div className="inventario-arquivos">
            {itensLocais.map(
              (item) => {
                const estaAberto =
                  itemAbertoId ===
                  item.id;

                const imagemItem =
                  obterImagemItem(
                    item,
                  );

                const carregandoImagem =
                  carregandoImagemId ===
                  item.id;

                return (
                  <article
                    className={`inventario-arquivos__item ${estaAberto ? "inventario-arquivos__item--aberto" : "inventario-arquivos__item--fechado"} ${obterClasseVisualItem(item)}`}
                    key={item.id}
                  >
                    <button
                      className="inventario-arquivos__abrir"
                      type="button"
                      aria-expanded={
                        estaAberto
                      }
                      onClick={() =>
                        alternarDetalhesItem(
                          item,
                        )
                      }
                    >
                      <span className="inventario-arquivos__icone-resumo">
                        {obterIconeItem(
                          item.tipo,
                        )}
                      </span>

                      <span className="inventario-arquivos__nome-resumo">
                        <small>
                          {item.tipo} —{" "}
                          {item.ativo !==
                          false
                            ? "Em uso"
                            : "Guardado"}
                        </small>

                        <strong>
                          {item.nome}
                        </strong>
                      </span>

                      <span className="inventario-arquivos__numeros-resumo">
                        Qtd.{" "}
                        {item.quantidade}
                        {" · "}
                        Volume{" "}
                        {item.volume}
                      </span>

                      <span className="inventario-arquivos__acao-resumo">
                        {estaAberto
                          ? "Fechar"
                          : "Ver detalhes"}
                      </span>
                    </button>

                    {estaAberto ? (
                      <div className="inventario-arquivos__detalhes">
                        <div className="inventario-arquivos__imagem">
                          <button
                            className="inventario-arquivos__imagem-botao"
                            type="button"
                            title="Clique para trocar a foto"
                            onClick={() =>
                              abrirSeletorImagem(
                                item,
                              )
                            }
                          >
                            {imagemItem ? (
                              <img
                                src={
                                  imagemItem
                                }
                                alt={`Imagem de ${item.nome}`}
                              />
                            ) : (
                              <span aria-hidden="true">
                                {obterIconeItem(
                                  item.tipo,
                                )}
                              </span>
                            )}

                            <small className="inventario-arquivos__imagem-legenda">
                              {carregandoImagem
                                ? "Preparando imagem..."
                                : imagemItem
                                  ? "Clique para trocar a foto"
                                  : "Clique para adicionar uma foto"}
                            </small>
                          </button>

                          <div className="inventario-arquivos__imagem-acoes">
                            <button
                              type="button"
                              disabled={
                                carregandoImagem
                              }
                              onClick={() =>
                                abrirSeletorImagem(
                                  item,
                                )
                              }
                            >
                              {imagemItem
                                ? "Trocar foto"
                                : "Adicionar foto"}
                            </button>

                            {item.imagemPersonalizada ? (
                              <button
                                type="button"
                                onClick={() =>
                                  removerImagemItem(
                                    item,
                                  )
                                }
                              >
                                Remover foto
                              </button>
                            ) : null}
                          </div>

                          {itemImagemId ===
                            item.id ||
                          mensagemImagem ? (
                            <p className="inventario-imagem__mensagem">
                              {
                                mensagemImagem
                              }
                            </p>
                          ) : null}
                        </div>

                        <div className="inventario-arquivos__informacoes">
                          <header>
                            <div>
                              <span>
                                {item.tipo}
                                {" — "}
                                {item.ativo !==
                                false
                                  ? "Em uso"
                                  : "Guardado"}
                              </span>

                              <h4>
                                {item.nome}
                              </h4>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removerItem(
                                  item,
                                )
                              }
                            >
                              Remover
                            </button>
                          </header>

                          <dl>
                            <div>
                              <dt>
                                Em uso
                              </dt>

                              <dd>
                                <input
                                  type="checkbox"
                                  aria-label={`Item ${item.nome} em uso`}
                                  checked={
                                    item.ativo !==
                                    false
                                  }
                                  onChange={(
                                    evento,
                                  ) =>
                                    atualizarItem(
                                      item,
                                      "ativo",
                                      evento
                                        .target
                                        .checked,
                                    )
                                  }
                                />
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Categoria
                              </dt>

                              <dd>
                                <select
                                  aria-label={`Categoria de ${item.nome}`}
                                  value={
                                    item.categoriaNumerica ??
                                    0
                                  }
                                  onChange={(
                                    evento,
                                  ) =>
                                    atualizarNumeroItem(
                                      item,
                                      "categoriaNumerica",
                                      evento
                                        .target
                                        .value,
                                    )
                                  }
                                >
                                  {CATEGORIAS_INVENTARIO_ARQUIVOS.map(
                                    (
                                      categoria,
                                    ) => (
                                      <option
                                        value={
                                          categoria
                                        }
                                        key={
                                          categoria
                                        }
                                      >
                                        {obterRotuloCategoriaNumerica(
                                          categoria,
                                        )}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Quantidade
                              </dt>

                              <dd>
                                <input
                                  type="number"
                                  min="0"
                                  aria-label={`Quantidade de ${item.nome}`}
                                  value={
                                    item.quantidade
                                  }
                                  onChange={(
                                    evento,
                                  ) =>
                                    atualizarNumeroItem(
                                      item,
                                      "quantidade",
                                      evento
                                        .target
                                        .value,
                                    )
                                  }
                                />
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Volume
                              </dt>

                              <dd>
                                <input
                                  type="number"
                                  min="0"
                                  aria-label={`Volume de ${item.nome}`}
                                  value={
                                    item.volume
                                  }
                                  onChange={(
                                    evento,
                                  ) =>
                                    atualizarNumeroItem(
                                      item,
                                      "volume",
                                      evento
                                        .target
                                        .value,
                                    )
                                  }
                                />
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Defesa
                              </dt>

                              <dd>
                                <input
                                  type="number"
                                  min="0"
                                  aria-label={`Defesa de ${item.nome}`}
                                  value={
                                    item.defesa
                                  }
                                  onChange={(
                                    evento,
                                  ) =>
                                    atualizarNumeroItem(
                                      item,
                                      "defesa",
                                      evento
                                        .target
                                        .value,
                                    )
                                  }
                                />
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Proteção
                              </dt>

                              <dd>
                                <input
                                  type="number"
                                  min="0"
                                  aria-label={`Proteção de ${item.nome}`}
                                  value={
                                    item.protecao
                                  }
                                  onChange={(
                                    evento,
                                  ) =>
                                    atualizarNumeroItem(
                                      item,
                                      "protecao",
                                      evento
                                        .target
                                        .value,
                                    )
                                  }
                                />
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Bônus de carga
                              </dt>

                              <dd>
                                <input
                                  type="number"
                                  min="0"
                                  aria-label={`Bônus de carga de ${item.nome}`}
                                  value={
                                    item.bonusCarga
                                  }
                                  onChange={(
                                    evento,
                                  ) =>
                                    atualizarNumeroItem(
                                      item,
                                      "bonusCarga",
                                      evento
                                        .target
                                        .value,
                                    )
                                  }
                                />
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Movimento
                              </dt>

                              <dd>
                                <input
                                  type="number"
                                  min="0"
                                  aria-label={`Penalidade de movimento de ${item.nome}`}
                                  value={
                                    item
                                      .penalidadeMovimento
                                  }
                                  onChange={(
                                    evento,
                                  ) =>
                                    atualizarNumeroItem(
                                      item,
                                      "penalidadeMovimento",
                                      evento
                                        .target
                                        .value,
                                    )
                                  }
                                />
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Dano
                              </dt>

                              <dd>
                                {item.dano ||
                                  "—"}
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Alcance
                              </dt>

                              <dd>
                                {item.alcance ||
                                  "—"}
                              </dd>
                            </div>
                          </dl>

                          {item.efeito ? (
                            <p>
                              <strong>
                                Efeito:{" "}
                              </strong>
                              {item.efeito}
                            </p>
                          ) : null}

                          <p>
                            {item.descricao ||
                              "Nenhuma descrição informada."}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>
    </section>
  );
}

export default PainelInventario;
