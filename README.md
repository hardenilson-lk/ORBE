# ORBE

Portal de RPG com o sistema **Arquivos**. O projeto funciona em modo local por padrão e possui uma camada opcional de sincronização Supabase.

## Desenvolvimento

```bash
npm install
npm run dev
```

Para ativar o chat e a voz entre dispositivos, configure o LiveKit e execute também `npm run dev:comunicacao`. O guia completo está em [`src/comunicacao/README.md`](./src/comunicacao/README.md).

## Ativar o modo online

1. Abra o SQL Editor do projeto Supabase.
2. Execute [`supabase/portal-orbe.sql`](./supabase/portal-orbe.sql).
3. Copie `.env.example` para `.env.local` e preencha a URL e a chave publicável.
4. Altere `VITE_ORBE_ONLINE_ENABLED=true`.
5. Reinicie o servidor Vite.

Enquanto `VITE_ORBE_ONLINE_ENABLED=false`, login, mesas, fichas e sessões continuam usando o armazenamento local do navegador.

## Segurança

- Senhas online são gerenciadas pelo Supabase Auth e não pelas tabelas do aplicativo.
- Fichas só podem ser lidas pelo mestre ou pelo jogador responsável.
- Jogadores só editam fichas liberadas pelo mestre.
- Anotações privadas do escudo ficam em uma tabela separada, acessível apenas ao mestre.
- O SQL antigo de testes não deve ser utilizado como política de produção.

## Rotas principais

- `/` — login e cadastro
- `/inicio` — central do ORBE
- `/mesas` — campanhas e convites
- `/fichas` — fichas do usuário
- `/sistemas` — sistemas disponíveis
- `/biblioteca` — biblioteca geral
- `/arquivos/...` — sistema Arquivos atual
