# Orbinho

O Orbinho é o assistente interativo da área **Arquivos** do ORBE. Ele apresenta mensagens adequadas à rota atual e um tour guiado, sem usar IA, APIs externas ou bibliotecas de tutorial.

## Instalação e migração

Copie a pasta completa `src/modules/orbinho/` para o mesmo caminho no projeto de destino. Importe o componente no ponto em que o React Router já esteja disponível:

```jsx
import { Orbinho } from "./modules/orbinho";

<Orbinho />
```

No ORBE atual, ele fica em `App.jsx`, logo depois de `Routes`. O componente identifica a rota sozinho e só aparece em `/arquivos`, `/arquivos/nova-mesa`, `/arquivos/minhas-mesas` e `/arquivos/mesa/:mesaId`.

## Elementos necessários no MenuMestre

O tour espera estes atributos nos botões existentes:

```text
data-assistente="menu-mapa"
data-assistente="menu-fichas"
data-assistente="menu-inventario"
data-assistente="menu-rituais"
data-assistente="menu-trilha-sonora"
data-assistente="menu-anotacoes"
data-assistente="menu-missoes"
data-assistente="menu-arquivos"
```

O tour apenas localiza e destaca esses elementos. Ele não dispara cliques nem altera o painel ativo.

O tour da ficha também utiliza os atributos abaixo nas seções correspondentes:

```text
data-assistente="ficha-inicio"
data-assistente="ficha-lista"
data-assistente="ficha-identificacao"
data-assistente="ficha-classe-nex"
data-assistente="ficha-atributos"
data-assistente="ficha-recursos"
data-assistente="ficha-defesa"
data-assistente="ficha-pericias"
data-assistente="ficha-dano-cura"
data-assistente="ficha-ataques"
data-assistente="ficha-habilidades"
data-assistente="ficha-equipamentos"
data-assistente="ficha-progressao"
data-assistente="ficha-rituais"
data-assistente="ficha-anotacoes"
data-assistente="ficha-salvar"
```

Para iniciar esse guia, abra o Orbinho dentro de uma mesa e escolha **Aprender a usar a ficha**. A primeira etapa pede que o usuário abra “Ficha do personagem”; o assistente nunca clica no menu automaticamente.

## Personalização

- Nome, mensagem inicial, rotas, posição, animação e chaves: `data/configuracaoOrbinho.js`.
- Mensagens por página e respostas do menu: `data/mensagensOrbinho.js`.
- Etapas e seletores dos tours: `data/tutoriaisOrbinho.js`.
- Aparência e responsividade: `styles/orbinho.css`.

Para criar outro tutorial, adicione um objeto em `tutoriaisOrbinho.js` com `id`, `titulo` e uma lista `etapas`. Cada etapa deve ter `seletor`, `titulo` e `mensagem`; depois exponha a nova opção e o controle correspondente no hook/componente.

## Armazenamento local

Somente estas chaves são usadas:

- `orbe:arquivos:orbinho:estado`: aberto/fechado e registro da primeira interação.
- `orbe:arquivos:orbinho:tutoriais`: conclusão, tutorial pulado e última etapa.

Falhas ou bloqueios do `localStorage` não interrompem o assistente.

## Alterações externas exigidas

Em outra cópia do site, altere somente:

1. O componente que está dentro do contexto do React Router, para importar e renderizar `<Orbinho />`.
2. O componente do MenuMestre, para adicionar os oito atributos `data-assistente` aos botões correspondentes.

Nenhuma rota, função de menu ou regra do sistema precisa ser modificada.
