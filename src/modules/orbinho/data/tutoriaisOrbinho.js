export const tutoriaisOrbinho = {
  menuMestre: {
    id: "menuMestre",
    titulo: "Tour do MenuMestre",
    etapas: [
      {
        seletor: '[data-assistente="menu-mapa"]',
        titulo: "Mapa",
        mensagem: "Abre o mapa de combate e os recursos visuais da mesa.",
      },
      {
        seletor: '[data-assistente="menu-fichas"]',
        titulo: "Fichas",
        mensagem: "Acessa a ficha do personagem selecionado na campanha.",
      },
      {
        seletor: '[data-assistente="menu-inventario"]',
        titulo: "Inventário",
        mensagem: "Organiza os itens associados à ficha ativa.",
      },
      {
        seletor: '[data-assistente="menu-rituais"]',
        titulo: "Rituais",
        mensagem: "Consulta e administra os rituais da ficha ativa.",
      },
      {
        seletor: '[data-assistente="menu-trilha-sonora"]',
        titulo: "Trilha sonora",
        mensagem: "Reúne as trilhas usadas para ambientar a sessão.",
      },
      {
        seletor: '[data-assistente="menu-anotacoes"]',
        titulo: "Anotações",
        mensagem: "Guarda e organiza as anotações da campanha.",
      },
      {
        seletor: '[data-assistente="menu-missoes"]',
        titulo: "Missões",
        mensagem: "Cria missões manualmente ou gera um arquivo completo com objetivo, pistas, ameaça e consequências.",
      },
      {
        seletor: '[data-assistente="menu-arquivos"]',
        titulo: "Arquivos",
        mensagem: "Organiza os dossiês da campanha, controla o que os jogadores podem ver e arquiva sessões encerradas.",
      },
    ],
  },
  fichaPersonagem: {
    id: "fichaPersonagem",
    titulo: "Tour da ficha do personagem",
    etapas: [
      {
        seletor: '[data-assistente="menu-fichas"]',
        titulo: "Abra a ficha",
        mensagem:
          "Clique em “Ficha do personagem” para abrir o formulário. Depois pressione Próximo e eu explicarei cada parte.",
      },
      {
        seletor: '[data-assistente="ficha-inicio"]',
        titulo: "Criar uma ficha",
        mensagem:
          "Use “Nova ficha” para começar com um formulário limpo. Preencha os dados e salve somente quando terminar as alterações desejadas.",
      },
      {
        seletor: '[data-assistente="ficha-lista"]',
        titulo: "Fichas da mesa",
        mensagem:
          "As fichas já salvas aparecem aqui. Clique em um personagem para abrir e editar seus dados.",
      },
      {
        seletor: '[data-assistente="ficha-identificacao"]',
        titulo: "Identificação e retrato",
        mensagem:
          "Adicione o retrato e preencha nome do agente, jogador e origem. Esses são os dados básicos do personagem.",
      },
      {
        seletor: '[data-assistente="ficha-classe-nex"]',
        titulo: "Classe, trilha e NEX",
        mensagem:
          "Escolha a classe, a trilha e o NEX. Essas escolhas atualizam automaticamente vários valores calculados da ficha.",
      },
      {
        seletor: '[data-assistente="ficha-atributos"]',
        titulo: "Atributos",
        mensagem:
          "Preencha Agilidade, Força, Intelecto, Presença e Vigor. Eles influenciam perícias e outros cálculos do personagem.",
      },
      {
        seletor: '[data-assistente="ficha-recursos"]',
        titulo: "PV, PE e Sanidade",
        mensagem:
          "O primeiro número é o valor atual e pode ser alterado. O valor máximo é calculado pela ficha conforme classe, NEX e atributos.",
      },
      {
        seletor: '[data-assistente="ficha-defesa"]',
        titulo: "Defesa e proteção",
        mensagem:
          "Defesa, proteção, esquiva, carga e bloqueio são valores de consulta calculados a partir dos dados e equipamentos do agente.",
      },
      {
        seletor: '[data-assistente="ficha-pericias"]',
        titulo: "Perícias",
        mensagem:
          "Em cada perícia, informe treino e outros bônus. O total é recalculado automaticamente; use o botão da linha para realizar a rolagem.",
      },
      {
        seletor: '[data-assistente="ficha-dano-cura"]',
        titulo: "Dano e cura",
        mensagem:
          "Escolha o recurso, informe o valor e use os controles para reduzir ou recuperar PV, PE ou Sanidade.",
      },
      {
        seletor: '[data-assistente="ficha-ataques"]',
        titulo: "Ataques",
        mensagem:
          "Clique em “Adicionar ataque” para criar uma linha. Preencha nome, teste, dano, crítico, alcance e observações; depois você pode editar ou remover.",
      },
      {
        seletor: '[data-assistente="ficha-habilidades"]',
        titulo: "Habilidades",
        mensagem:
          "Adicione habilidades pelo catálogo quando disponíveis ou preencha uma habilidade manual. As entradas ficam vinculadas à ficha ao salvar.",
      },
      {
        seletor: '[data-assistente="ficha-equipamentos"]',
        titulo: "Equipamentos",
        mensagem:
          "Clique em “Adicionar”, pesquise no catálogo, selecione o equipamento e confirme em “Adicionar selecionado”. O item entra no inventário da ficha.",
      },
      {
        seletor: '[data-assistente="ficha-progressao"]',
        titulo: "Progressão de NEX",
        mensagem:
          "Esta área resume o nível atual, o próximo marco e os benefícios obtidos. Ela acompanha o NEX escolhido no início da ficha.",
      },
      {
        seletor: '[data-assistente="ficha-rituais"]',
        titulo: "Rituais",
        mensagem:
          "Use o botão de adicionar para escolher um ritual do catálogo ou registrar um ritual manualmente. Os requisitos e detalhes ficam disponíveis aqui.",
      },
      {
        seletor: '[data-assistente="ficha-anotacoes"]',
        titulo: "Anotações",
        mensagem:
          "Registre pistas, condições, traumas e informações importantes que não cabem nos outros campos.",
      },
      {
        seletor: '[data-assistente="ficha-salvar"]',
        titulo: "Salvar a ficha",
        mensagem:
          "Por fim, clique em “Salvar ficha”. “Limpar ficha” prepara um formulário novo, então use essa opção com atenção.",
      },
    ],
  },
  gridMapa: {
    id: "gridMapa",
    titulo: "Tour completo do mapa",
    etapas: [
      {
        seletor: '[data-assistente="menu-mapa"]',
        titulo: "Entre no mapa de combate",
        categoria: "Começo",
        mensagem: "O grid fica na opção Mapa do menu do mestre. Se você estiver em outra área, clique em Mapa; depois avance.",
        passos: ["Abra Mapa no menu lateral.", "O que você configurar aqui fica salvo na mesa."],
        dica: "Durante o tour, eu abrirei cada painel para você. Só altere algo se quiser experimentar.",
      },
      {
        seletor: '[data-assistente="mapa-ferramentas"]',
        painelMapa: "",
        menuMapaAberto: true,
        titulo: "Seu leque de ferramentas",
        categoria: "Visão geral",
        mensagem: "Este botão abre o leque do mapa. As ferramentas estão separadas por função: Cena, Ambiente, Jogo e Acesso.",
        passos: ["Cena monta o tabuleiro.", "Ambiente controla visão e obstáculos.", "Jogo reúne régua, personagens e NPCs.", "Acesso define o que cada jogador pode fazer."],
      },
      {
        seletor: '[data-assistente="mapa-painel-grid"]',
        painelMapa: "grid",
        menuMapaAberto: true,
        titulo: "Monte o grid",
        categoria: "Cena · Grid",
        mensagem: "Aqui você define o tamanho real do tabuleiro e a aparência das casas.",
        passos: ["Colunas e linhas aumentam ou reduzem o mapa.", "Tamanho da casa muda a escala visual.", "Cor, opacidade, espessura e linha grossa melhoram a leitura.", "Encaixar tokens faz as peças saltarem de casa em casa; coordenadas ajudam a localizar posições."],
        dica: "Para movimento livre, desative Encaixar tokens nas casas.",
      },
      {
        seletor: '[data-assistente="mapa-painel-fundo"]',
        painelMapa: "fundo",
        menuMapaAberto: true,
        titulo: "Construa o cenário com imagens",
        categoria: "Cena · Fundo",
        mensagem: "Adicione uma imagem do computador ou por URL. Você pode combinar várias partes para montar uma cena inteira.",
        passos: ["Selecione a parte que deseja editar.", "Ajuste, centralize, mova, redimensione ou gire.", "Use frente e trás para acertar a sobreposição.", "Trave a imagem quando terminar para não movê-la sem querer."],
      },
      {
        seletor: '[data-assistente="mapa-painel-camadas"]',
        painelMapa: "camadas",
        menuMapaAberto: true,
        titulo: "Organize pelas camadas",
        categoria: "Cena · Camadas",
        mensagem: "Cada tipo de conteúdo possui sua própria camada: mapa, objetos, paredes, tokens, efeitos, neblina e interface.",
        passos: ["Visível mostra ou esconde o conteúdo.", "Travada impede edições acidentais.", "Esconder ou travar não apaga nada."],
        dica: "Se uma ferramenta não deixar editar, confira primeiro se a camada correspondente está travada.",
      },
      {
        seletor: '[data-assistente="mapa-painel-paredes"]',
        painelMapa: "estruturas",
        menuMapaAberto: true,
        titulo: "Desenhe paredes e portas",
        categoria: "Ambiente · Paredes",
        mensagem: "Ative Parede ou Porta e arraste no mapa para criar um segmento. Essas estruturas bloqueiam visão e luz.",
        passos: ["Escolha a ferramenta.", "Arraste do ponto inicial ao final no mapa.", "Abra uma porta para liberar a passagem.", "Você também pode ocultar, ajustar os pontos ou remover a estrutura."],
      },
      {
        seletor: '[data-assistente="mapa-painel-neblina"]',
        painelMapa: "neblina",
        menuMapaAberto: true,
        titulo: "Revele a cena aos poucos",
        categoria: "Ambiente · Neblina",
        mensagem: "A neblina cobre o mapa dos jogadores. Revele somente as áreas que o grupo já explorou.",
        passos: ["Ative a neblina geral.", "Escolha retângulo, círculo ou desenho livre.", "Arraste sobre o mapa para revelar.", "Ocultar tudo recompõe a neblina; a prévia mostra exatamente o que o jogador verá."],
      },
      {
        seletor: '[data-assistente="mapa-painel-luz"]',
        painelMapa: "luz",
        menuMapaAberto: true,
        titulo: "Controle luz e visão",
        categoria: "Ambiente · Luz",
        mensagem: "A luz ambiente clareia a cena inteira. Fontes locais e o cone de visão de cada token revelam apenas o que realmente pode ser visto.",
        passos: ["Ajuste intensidade, alcance e cor de cada luz.", "Ative Adicionar luz e clique no mapa.", "Defina alcance, direção e abertura do cone de cada token.", "Paredes e portas fechadas interrompem luz, visão e movimento."],
        dica: "Itens ativos como lanterna ou lampião no inventário também ampliam a visão do token.",
      },
      {
        seletor: '[data-assistente="mapa-painel-regua"]',
        painelMapa: "medicao",
        menuMapaAberto: true,
        titulo: "Meça movimentos e alcances",
        categoria: "Jogo · Régua",
        mensagem: "Escolha metros ou quadrados e arraste sobre o mapa para medir uma distância.",
        passos: ["Em metros, informe quantos metros vale cada casa.", "Escolha a regra de diagonal da sua mesa.", "Arraste do início ao destino; Limpar medição remove a linha."],
      },
      {
        seletor: '[data-assistente="mapa-painel-tokens"]',
        painelMapa: "token",
        menuMapaAberto: true,
        titulo: "Coloque os personagens no mapa",
        categoria: "Jogo · Tokens",
        mensagem: "Os tokens de personagens vêm das fichas da campanha. Use Adicionar para colocá-los no grid.",
        passos: ["Clique para selecionar e arraste para mover.", "O botão ••• abre ações como tamanho, bloqueio e ocultação.", "Dê duplo clique para abrir a mini ficha.", "Se o token já estiver no mapa, o botão passa a selecioná-lo."],
      },
      {
        seletor: '[data-assistente="mapa-painel-npcs"]',
        painelMapa: "npc",
        menuMapaAberto: true,
        titulo: "Crie NPCs sem ficha completa",
        categoria: "Jogo · NPCs",
        mensagem: "NPCs usam uma mini ficha rápida, ideal para ameaças e coadjuvantes da cena.",
        passos: ["Informe nome, imagem opcional, PV e Defesa.", "Clique em Criar NPC.", "Depois use Adicionar ao grid.", "Editar abre a mini ficha; Excluir remove também suas instâncias do mapa."],
        dica: "Criar o NPC não o coloca automaticamente no grid.",
      },
      {
        seletor: '[data-assistente="mapa-painel-permissoes"]',
        painelMapa: "permissoes",
        menuMapaAberto: true,
        titulo: "Defina quem controla cada peça",
        categoria: "Acesso · Permissões",
        mensagem: "Escolha o responsável de cada token e decida se jogadores podem controlá-lo, movê-lo ou até enxergá-lo.",
        passos: ["Responsável define o dono principal.", "Compartilhar controle libera jogadores específicos.", "Bloquear movimento congela a peça.", "Ocultar dos jogadores mantém o token visível somente para o mestre."],
        dica: "Use Ver mapa como para conferir a visão de um jogador antes da sessão.",
      },
      {
        seletor: '[data-assistente="mapa-area"]',
        painelMapa: "",
        menuMapaAberto: false,
        titulo: "Interaja diretamente com o tabuleiro",
        categoria: "Mapa",
        mensagem: "O centro do mapa é sua área de trabalho. As ferramentas ativas respondem aos cliques e arrastes feitos aqui.",
        passos: ["Segure Espaço e arraste uma área vazia; o botão do meio também move a câmera.", "Segure Ctrl e use a roda para alterar o zoom sem deslocamentos acidentais.", "Selecione um token e clique numa casa, ou arraste-o; paredes e portas fechadas bloqueiam o caminho."],
      },
      {
        seletor: '[data-assistente="mapa-camera"]',
        painelMapa: "",
        menuMapaAberto: false,
        titulo: "Encontre o melhor enquadramento",
        categoria: "Câmera",
        mensagem: "Os controles inferiores cuidam da visualização sem alterar o conteúdo do mapa.",
        passos: ["− e + mudam o zoom em passos firmes; o percentual volta para 100%.", "Alvo centraliza a câmera.", "Ajustar tela enquadra o mapa inteiro.", "Ctrl + roda controla o zoom; Espaço + arrastar controla a câmera."],
      },
      {
        seletor: '[data-assistente="mapa-ferramentas"]',
        painelMapa: "",
        menuMapaAberto: true,
        titulo: "Pronto para preparar sua cena",
        categoria: "Resumo",
        mensagem: "A ordem mais segura é: montar o grid, adicionar e travar o fundo, organizar camadas, criar obstáculos, configurar visão e só então colocar tokens e permissões.",
        passos: ["Cena: Grid → Fundo → Camadas.", "Ambiente: Paredes → Neblina → Luz.", "Jogo: Régua → Tokens → NPCs.", "Acesso: Permissões e prévia do jogador."],
        dica: "Você pode refazer este tour quando quiser em Orbinho → Aprender todos os recursos do grid.",
      },
    ],
  },
};
