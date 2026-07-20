# Comunicação da mesa

## O que foi criado

Este módulo reúne o chat de texto, a sala de voz, os participantes, os controles de áudio, o teste do microfone, os estados de conexão e os estilos da área **Comunicação da mesa**. A interface original do ORBE foi mantida, mas a conexão local por `BroadcastChannel` e WebRTC manual foi substituída pelo LiveKit.

Todo o frontend da comunicação fica em `src/comunicacao/`. O servidor de token fica separado em `server/comunicacao/`, porque a chave secreta jamais pode ser incluída no React.

## Pacotes

- `livekit-client`: conecta o navegador, publica o microfone e troca mensagens de dados.
- `livekit-server-sdk`: gera tokens curtos no servidor.

`@livekit/components-react` não foi instalado porque o painel usa os componentes próprios do ORBE. Isso preserva o visual e evita uma dependência que não seria utilizada.

## Criar e configurar o LiveKit Cloud

1. Crie uma conta e um projeto em [LiveKit Cloud](https://cloud.livekit.io/).
2. No painel do projeto, copie a **WebSocket URL** (`wss://...`).
3. Abra as configurações de chaves e crie/copiei a **API Key** e a **API Secret**.
4. Copie `.env.example` para `.env.local` e preencha apenas:

```env
VITE_LIVEKIT_URL=wss://SEU-PROJETO.livekit.cloud
VITE_COMMUNICATION_TOKEN_URL=http://localhost:3001/api/livekit-token
```

5. Copie `server/.env.example` para `server/.env` e preencha:

```env
LIVEKIT_URL=wss://SEU-PROJETO.livekit.cloud
LIVEKIT_API_KEY=SUA_API_KEY
LIVEKIT_API_SECRET=SUA_API_SECRET
ALLOWED_ORIGIN=http://localhost:5173
PORT=3001
```

Nunca use o prefixo `VITE_` na API Key ou na API Secret. Variáveis `VITE_` são entregues ao navegador.

## Iniciar

Abra dois terminais na raiz do projeto:

```bash
npm run dev:comunicacao
```

```bash
npm run dev
```

O primeiro comando inicia o emissor seguro de tokens na porta 3001. O segundo inicia o ORBE.

## Testar em duas abas

1. Abra a mesma mesa em duas abas ou em dois navegadores.
2. Em cada painel, abra a aba **Voz** e clique em **Entrar na voz**.
3. Autorize o microfone.
4. Confirme a lista de participantes, o indicador de quem está falando e os controles de mudo.
5. Volte à aba **Chat** e envie mensagens. `Enter` envia; `Shift + Enter` cria uma nova linha.
6. **Limpar registro** apaga somente as mensagens daquele navegador.

## Testar em dois computadores

1. Os dois computadores devem abrir a mesma mesa, portanto usar o mesmo `mesaId`.
2. O frontend e o endpoint de token precisam estar acessíveis aos dois aparelhos. Troque `localhost` pelo endereço HTTPS público ou pelo IP da máquina na rede, conforme o ambiente.
3. Ajuste `ALLOWED_ORIGIN` para a origem exata do frontend.
4. Entre na voz nos dois computadores e teste fala, mudo, áudio local e chat.

Fora de `localhost`, navegadores normalmente exigem HTTPS para liberar o microfone. O token server também deve ser servido por HTTPS em produção.

## Limitações desta etapa

- As mensagens são temporárias e desaparecem ao atualizar a página.
- Não há banco, histórico, câmera, vídeo, compartilhamento de tela ou gravação.
- O token server valida o formato dos dados, mas ainda não consulta o Supabase. Numa etapa futura, ele deve validar a sessão do usuário e sua participação na mesa antes de emitir o token.
- A API Secret fica somente em `server/.env`, que está ignorado pelo Git, e nunca é enviada ao frontend.
