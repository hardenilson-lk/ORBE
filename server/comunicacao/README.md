# Servidor de token da comunicação

Este pequeno servidor Node gera tokens temporários do LiveKit. Ele não usa banco de dados e nunca envia a API Secret ao navegador.

Copie `server/.env.example` para `server/.env`, preencha os dados do projeto LiveKit Cloud e execute `npm run dev:comunicacao` na raiz do ORBE.

O endpoint `POST /api/livekit-token` aceita `sala`, `identidade`, `nome` e `papel`. O token dura 15 minutos. Jogadores publicam microfone, recebem áudio e trocam mensagens de dados; o mestre também pode publicar a faixa `orbe-mesa-sonora`. Não há permissão administrativa, câmera, tela ou gravação.

Em produção, não confie no campo `papel` enviado pelo navegador: valide a sessão real e a propriedade da mesa antes de emitir o token de mestre.
