# Servidor de token da comunicação

Este pequeno servidor Node gera tokens temporários do LiveKit. Ele não usa banco de dados e nunca envia a API Secret ao navegador.

Copie `server/.env.example` para `server/.env`, preencha os dados do projeto LiveKit Cloud e execute `npm run dev:comunicacao` na raiz do ORBE.

O endpoint `POST /api/livekit-token` aceita `sala`, `identidade`, `nome` e `papel`. O token dura 15 minutos e permite somente entrar na sala, publicar microfone, receber áudio e trocar mensagens de dados. Não há permissão administrativa, câmera, tela ou gravação.

Em produção, mantenha a mesma validação ao migrar o endpoint para Vercel ou Supabase Edge Functions e valide a sessão real do usuário antes de emitir o token.
