# ORBE Finalizador IA

Worker opcional para finalizar visualmente mapas já gerados pelo ORBE.

## Configuração

1. Ajuste `ORBE_ORIGIN` no ambiente do Worker para a origem publicada do ORBE.
2. Publique com `npx wrangler deploy` dentro desta pasta.
3. Configure `VITE_ORBE_FINALIZADOR_IA_URL` no frontend com a URL do Worker.

O Worker usa o binding `env.AI`, o modelo `@cf/black-forest-labs/flux-2-klein-4b`, somente 512x512 e uma imagem-base por requisição. Ele não recebe tokens, dados de login ou informações privadas.
