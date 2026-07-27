# Gerador de Mapas do ORBE

## Visão geral

O módulo gera e edita mapas procedurais do sistema Arquivos. O núcleo procedural, o editor, a persistência e a adaptação ao grid são independentes do tema; atualmente o único conteúdo registrado é `hospital-abandonado`.

O gerador é exclusivo do mestre. Jogadores consomem somente a projeção segura do mapa oficialmente aplicado.

## Estrutura

- `src/geradorMapa/core`: geração determinística, validações e correções.
- `src/geradorMapa/data`: configurações, etapas e registro de temas.
- `src/geradorMapa/temas`: catálogos temáticos do sistema Arquivos.
- `src/geradorMapa/editor`: editor, operações e histórico de desfazer/refazer.
- `src/geradorMapa/components`: painel principal, prévia e persistência.
- `src/geradorMapa/integracao`: conversão para o formato real do `PainelMapa`.
- `src/geradorMapa/persistencia`: formato versionado, JSON e rascunhos locais.
- `src/geradorMapa/online`: acesso ao Supabase e assinatura Realtime.
- `src/geradorMapa/styles`: estilos isolados do módulo.
- `supabase/gerador-mapas-online-orbe.sql`: instalação manual da persistência online.

## Fluxo procedural

A seed alimenta todas as decisões aleatórias. As etapas geram salas, corredores, navegação, paredes, portas, tipos temáticos, objetos, iluminação e validação. A mesma seed com as mesmas configurações produz o mesmo hash.

O editor trabalha sobre uma cópia local. Alterações intermediárias nunca são publicadas aos jogadores.

## Formato e migração

O campo `versaoFormato` identifica o contrato persistido. A versão atual é `1`. O carregamento sempre passa por `migrarMapaGerador` e `normalizarMapaParaPersistencia`; versões futuras desconhecidas são rejeitadas.

A normalização remove câmera, viewport, seleção, histórico interno, caches, listeners e estados temporários. `Set` e `Map` viram estruturas JSON. Chaves de protótipo perigosas são descartadas.

O JSON importado tem limite de 5 MB. Nenhum HTML, script ou URL remota é executado pela importação.

## Persistência local

Os rascunhos ficam em `localStorage`, separados por `mesaId`, com limite de 20 registros. Falhas online preservam uma cópia local e não são apresentadas como sincronizadas.

Exportação e importação usam JSON versionado. O fallback de clonagem mantém compatibilidade em navegadores sem `structuredClone`.

## Aplicação ao grid

`adaptarMapaGeradoParaGrid` converte células do gerador para pixels do grid real. Ela aplica dimensões, paredes, portas, objetos de cenário e luzes, preservando tokens e NPCs existentes.

O `PainelMapa` continua sendo a fonte visual e interativa da mesa. Mapas antigos sem `geradorMapa`, seed ou tema seguem pelo normalizador legado e não são convertidos automaticamente.

## Persistência online

O SQL acrescenta três estruturas especializadas:

- `mapas_gerador_orbe`: cópia completa e privada do mestre, rascunho ou mapa aplicado.
- `mapas_aplicados_orbe`: uma linha por mesa com a projeção segura oficial consumida pelo jogador.
- `mapa_versoes_orbe`: snapshots aplicados, limitados às 20 versões mais recentes.

O sistema existente (`mesas_orbe`, `mesa_membros_orbe` e seus helpers privados) continua sendo a autoridade para mesa, dono e membros. O cliente utilizado é o mesmo singleton autenticado do restante do ORBE.

Modelos compartilhados não foram colocados no banco: isso evita misturar dados de campanha e marketplace. Um mapa reutilizável pode ser mantido localmente ou exportado como JSON.

## Fonte oficial de verdade

- Editor: cópia local ainda não publicada.
- Rascunho local: recuperação no navegador.
- Rascunho online: cópia completa privada em `mapas_gerador_orbe`.
- Mapa aplicado: linha atual em `mapas_aplicados_orbe`.
- Jogador: `dados_jogador` e `grid_jogador`.
- Histórico: metadados e snapshots em `mapa_versoes_orbe`.

O estado dinâmico corrente de tokens, portas e luzes continua sendo salvo pela sessão real do ORBE. Ao receber novamente o mapa aplicado, esses estados são mesclados para não regredir a mesa.

## Permissões e RLS

As tabelas usam RLS:

- somente o mestre da mesa e criador administra o mapa completo;
- membros autenticados leem somente `mapas_aplicados_orbe`;
- somente o mestre lê versões;
- `anon` não recebe privilégios;
- jogador não recebe escrita direta;
- aplicar/restaurar exige RPC autenticada e validação de mestre no banco.

As RPCs usam `security definer`, `search_path` fixo, `auth.uid()` e os helpers existentes:

- `salvar_rascunho_mapa_orbe`
- `aplicar_mapa_gerador_orbe`
- `restaurar_versao_mapa_orbe`

Não existe `service_role` no frontend.

## Visão segura do jogador

`criarVisaoJogadorDoMapa` remove:

- passagens secretas não reveladas;
- salas, objetos e áreas ocultas;
- anotações e dados do mestre;
- configurações internas;
- validações e correções;
- histórico e estado temporário.

O banco publica somente a tabela segura. A ocultação não depende de CSS.

## Concorrência, versões e conflitos

Cada gravação incrementa `revisao`. Atualizações e aplicações enviam `revisao_esperada`; divergências geram SQLSTATE `40001` e não sobrescrevem silenciosamente.

O hash FNV-1a é determinístico e serve apenas para detectar divergência ou conteúdo repetido, não como assinatura de segurança.

Aplicar cria snapshot, atualiza o mapa privado e faz `upsert` da projeção segura na mesma transação. Restaurar incrementa a revisão e publica novamente a versão segura.

## Realtime e reconexão

O canal Postgres Changes é isolado por `mesa_id` em `mapas_aplicados_orbe`. O jogador:

1. carrega o estado atual;
2. carrega o mapa aplicado;
3. assina atualizações;
4. ignora revisões repetidas ou inferiores;
5. remove o canal ao sair ou trocar de mesa.

Uma reconexão não depende do evento perdido: o estado aplicado é buscado novamente. Mudanças normais de porta, luz e tokens continuam pelo canal de sessão já existente.

## Feature flags

- `VITE_GERADOR_MAPAS_ENABLED`: mostra ou esconde o acesso ao gerador.
- `VITE_GERADOR_MAPAS_APPLICATION_ENABLED`: habilita aplicação ao grid.
- `VITE_GERADOR_MAPAS_SYNC_ENABLED`: habilita persistência e leitura das novas tabelas.

Valores ausentes mantêm gerador e aplicação ativos. A sincronização online usa `false` como padrão até o SQL ser aplicado. Desabilitar as flags não apaga nem invalida mapas já aplicados.

## Instalação online

1. Faça backup do banco.
2. Revise e execute manualmente `supabase/gerador-mapas-online-orbe.sql`.
3. Confirme as tabelas, RPCs, RLS e a publicação Realtime.
4. Cadastre `VITE_GERADOR_MAPAS_SYNC_ENABLED=true` nas Repository Variables.
5. Faça um novo build/deploy.
6. Teste com contas distintas de mestre, membro e não membro.

O SQL não é executado pelo frontend nem pelo build.

## Testes

Execute:

```sh
npm run test:gerador
npm run build
npm run lint
```

O teste automatizado cobre determinismo, tamanhos 20×15, 30×20 e 60×60, serialização, adaptação, preservação de tokens/NPCs, dados secretos, caches, versão futura, JSON inválido e chaves perigosas.

Os testes RLS e Realtime exigem que o SQL seja aplicado em um projeto Supabase de teste e duas ou três contas autenticadas. Não devem ser simulados como prova de segurança.

## Solução de problemas

- **Botões online desabilitados:** verifique a flag de sincronização e a configuração pública do Supabase.
- **Tabela não encontrada:** aplique o SQL manualmente e confirme o schema `public`.
- **Conflito:** recarregue a versão online ou preserve o trabalho como rascunho local.
- **Sessão expirada:** entre novamente; o serviço não aceita ID recebido da interface.
- **Jogador sem atualização:** confirme associação à mesa, RLS, publicação Realtime e a revisão de `mapas_aplicados_orbe`.
- **Mapa grande:** observe o tamanho mostrado no painel; caches e dados derivados já são removidos.

## Extensão futura

Para adicionar outro tema, registre tipos de sala, objetos, regras visuais e validadores no catálogo do sistema. Para D&D 5e, crie um registro de sistema/tema separado e reutilize núcleo, editor, formato, aplicação e sincronização; não adicione conteúdo D&D ao módulo Arquivos.

## Limitações atuais

- não há edição simultânea entre mestres;
- modelos online públicos não existem;
- revelação parcial de objetos secretos depende de um fluxo futuro do grid;
- não há fila offline automática: a cópia local exige decisão explícita ao reconectar;
- a validação efetiva de RLS e Realtime depende da instalação manual do SQL e de teste multiusuário.
