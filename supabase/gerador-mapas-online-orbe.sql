-- ORBE · Gerador de Mapas · Persistência online e versões
-- Aplicar manualmente no SQL Editor somente depois de revisar o backup.
-- Dependências: portal-orbe.sql já aplicado (mesas, membros e helpers private).

begin;

create table if not exists public.mapas_gerador_orbe (
  id uuid primary key default gen_random_uuid(),
  mesa_id uuid not null references public.mesas_orbe(id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 120),
  descricao text not null default '' check (char_length(descricao) <= 500),
  sistema_regra text not null default 'arquivos',
  tema text,
  seed text,
  versao_formato integer not null default 1 check (versao_formato >= 1),
  status text not null default 'rascunho'
    check (status in ('rascunho', 'aplicado', 'arquivado')),
  revisao integer not null default 1 check (revisao >= 1),
  hash_mapa text not null,
  dados_mapa jsonb not null,
  configuracoes jsonb not null default '{}'::jsonb,
  validacao jsonb not null default '{}'::jsonb,
  modificado_manualmente boolean not null default false,
  criado_por uuid not null references auth.users(id) on delete restrict,
  atualizado_por uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fonte oficial segura consumida pelos jogadores.
-- Não contém dados_mapa do mestre.
create table if not exists public.mapas_aplicados_orbe (
  mesa_id uuid primary key references public.mesas_orbe(id) on delete cascade,
  mapa_id uuid not null references public.mapas_gerador_orbe(id) on delete restrict,
  revisao integer not null check (revisao >= 1),
  hash_mapa text not null,
  versao_formato integer not null default 1 check (versao_formato >= 1),
  dados_jogador jsonb not null,
  grid_jogador jsonb not null,
  aplicado_por uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mapa_versoes_orbe (
  id uuid primary key default gen_random_uuid(),
  mapa_id uuid not null references public.mapas_gerador_orbe(id) on delete cascade,
  mesa_id uuid not null references public.mesas_orbe(id) on delete cascade,
  numero_versao integer not null check (numero_versao >= 1),
  descricao text not null default '' check (char_length(descricao) <= 500),
  hash_mapa text not null,
  versao_formato integer not null default 1 check (versao_formato >= 1),
  tamanho_bytes integer not null default 0 check (tamanho_bytes >= 0),
  dados_mestre jsonb not null,
  dados_jogador jsonb not null,
  grid_mestre jsonb not null,
  grid_jogador jsonb not null,
  criado_por uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (mapa_id, numero_versao)
);

create index if not exists mapas_gerador_orbe_mesa_status_updated_idx
on public.mapas_gerador_orbe (mesa_id, status, updated_at desc);

create index if not exists mapas_gerador_orbe_criado_por_idx
on public.mapas_gerador_orbe (criado_por);

create index if not exists mapa_versoes_orbe_mapa_numero_idx
on public.mapa_versoes_orbe (mapa_id, numero_versao desc);

create index if not exists mapa_versoes_orbe_mesa_created_idx
on public.mapa_versoes_orbe (mesa_id, created_at desc);

drop trigger if exists atualizar_mapas_gerador_orbe_updated_at
on public.mapas_gerador_orbe;
create trigger atualizar_mapas_gerador_orbe_updated_at
before update on public.mapas_gerador_orbe
for each row execute function private.definir_updated_at_orbe();

drop trigger if exists atualizar_mapas_aplicados_orbe_updated_at
on public.mapas_aplicados_orbe;
create trigger atualizar_mapas_aplicados_orbe_updated_at
before update on public.mapas_aplicados_orbe
for each row execute function private.definir_updated_at_orbe();

alter table public.mapas_gerador_orbe enable row level security;
alter table public.mapas_aplicados_orbe enable row level security;
alter table public.mapa_versoes_orbe enable row level security;

drop policy if exists "mestre administra mapas do gerador"
on public.mapas_gerador_orbe;
create policy "mestre administra mapas do gerador"
on public.mapas_gerador_orbe
for all
to authenticated
using (
  criado_por = auth.uid()
  and private.usuario_mestre_mesa_orbe(mesa_id)
)
with check (
  criado_por = auth.uid()
  and private.usuario_mestre_mesa_orbe(mesa_id)
);

drop policy if exists "membro le mapa aplicado seguro"
on public.mapas_aplicados_orbe;
create policy "membro le mapa aplicado seguro"
on public.mapas_aplicados_orbe
for select
to authenticated
using (
  private.usuario_participa_mesa_orbe(mesa_id)
);

drop policy if exists "mestre le versoes do mapa"
on public.mapa_versoes_orbe;
create policy "mestre le versoes do mapa"
on public.mapa_versoes_orbe
for select
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

revoke all on table public.mapas_gerador_orbe from anon, authenticated;
revoke all on table public.mapas_aplicados_orbe from anon, authenticated;
revoke all on table public.mapa_versoes_orbe from anon, authenticated;

grant select, insert, update, delete
on table public.mapas_gerador_orbe
to authenticated;

grant select
on table public.mapas_aplicados_orbe
to authenticated;

grant select
on table public.mapa_versoes_orbe
to authenticated;

create or replace function public.salvar_rascunho_mapa_orbe(
  mapa_id_informado uuid,
  mesa_id_informada uuid,
  nome_informado text,
  descricao_informada text,
  sistema_informado text,
  tema_informado text,
  seed_informada text,
  versao_formato_informada integer,
  hash_informado text,
  mapa_informado jsonb,
  configuracoes_informadas jsonb,
  validacao_informada jsonb,
  revisao_esperada integer default null
)
returns setof public.mapas_gerador_orbe
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  usuario_atual uuid := auth.uid();
  mapa_salvo public.mapas_gerador_orbe%rowtype;
begin
  if usuario_atual is null then
    raise exception 'Sessão expirada.' using errcode = '28000';
  end if;
  if not private.usuario_mestre_mesa_orbe(mesa_id_informada) then
    raise exception 'Somente o mestre pode salvar mapas nesta mesa.' using errcode = '42501';
  end if;
  if mapa_informado is null or jsonb_typeof(mapa_informado) <> 'object' then
    raise exception 'Mapa inválido.' using errcode = '22023';
  end if;

  if mapa_id_informado is null then
    insert into public.mapas_gerador_orbe (
      mesa_id, nome, descricao, sistema_regra, tema, seed,
      versao_formato, status, revisao, hash_mapa, dados_mapa,
      configuracoes, validacao, modificado_manualmente,
      criado_por, atualizado_por
    ) values (
      mesa_id_informada, left(btrim(nome_informado), 120),
      left(coalesce(descricao_informada, ''), 500),
      coalesce(nullif(btrim(sistema_informado), ''), 'arquivos'),
      nullif(btrim(tema_informado), ''), nullif(btrim(seed_informada), ''),
      versao_formato_informada, 'rascunho', 1, hash_informado,
      mapa_informado, coalesce(configuracoes_informadas, '{}'::jsonb),
      coalesce(validacao_informada, '{}'::jsonb),
      coalesce((mapa_informado ->> 'modificadoManualmente')::boolean, false),
      usuario_atual, usuario_atual
    )
    returning * into mapa_salvo;
  else
    update public.mapas_gerador_orbe
    set nome = left(btrim(nome_informado), 120),
        descricao = left(coalesce(descricao_informada, ''), 500),
        sistema_regra = coalesce(nullif(btrim(sistema_informado), ''), 'arquivos'),
        tema = nullif(btrim(tema_informado), ''),
        seed = nullif(btrim(seed_informada), ''),
        versao_formato = versao_formato_informada,
        status = 'rascunho',
        revisao = revisao + 1,
        hash_mapa = hash_informado,
        dados_mapa = mapa_informado,
        configuracoes = coalesce(configuracoes_informadas, '{}'::jsonb),
        validacao = coalesce(validacao_informada, '{}'::jsonb),
        modificado_manualmente = coalesce((mapa_informado ->> 'modificadoManualmente')::boolean, false),
        atualizado_por = usuario_atual
    where id = mapa_id_informado
      and mesa_id = mesa_id_informada
      and criado_por = usuario_atual
      and (revisao_esperada is null or revisao = revisao_esperada)
    returning * into mapa_salvo;

    if mapa_salvo.id is null then
      raise exception 'Conflito de revisão. O mapa foi alterado em outra sessão.'
        using errcode = '40001';
    end if;
  end if;

  return next mapa_salvo;
end;
$$;

create or replace function public.aplicar_mapa_gerador_orbe(
  mapa_id_informado uuid,
  mesa_id_informada uuid,
  revisao_esperada integer,
  hash_informado text,
  mapa_mestre_informado jsonb,
  mapa_jogador_informado jsonb,
  grid_mestre_informado jsonb,
  grid_jogador_informado jsonb,
  descricao_informada text default 'Mapa aplicado pelo mestre'
)
returns setof public.mapas_gerador_orbe
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  usuario_atual uuid := auth.uid();
  mapa_atual public.mapas_gerador_orbe%rowtype;
  mapa_salvo public.mapas_gerador_orbe%rowtype;
  proxima_versao integer;
begin
  if usuario_atual is null then
    raise exception 'Sessão expirada.' using errcode = '28000';
  end if;
  if not private.usuario_mestre_mesa_orbe(mesa_id_informada) then
    raise exception 'Somente o mestre pode aplicar mapas.' using errcode = '42501';
  end if;

  select * into mapa_atual
  from public.mapas_gerador_orbe
  where id = mapa_id_informado and mesa_id = mesa_id_informada
  for update;

  if mapa_atual.id is null then
    raise exception 'Mapa não encontrado.' using errcode = 'P0002';
  end if;
  if mapa_atual.criado_por <> usuario_atual then
    raise exception 'Mapa pertence a outro usuário.' using errcode = '42501';
  end if;
  if mapa_atual.revisao <> revisao_esperada then
    raise exception 'Conflito de revisão. Recarregue a versão online.'
      using errcode = '40001';
  end if;

  select coalesce(max(numero_versao), 0) + 1
  into proxima_versao
  from public.mapa_versoes_orbe
  where mapa_id = mapa_id_informado;

  insert into public.mapa_versoes_orbe (
    mapa_id, mesa_id, numero_versao, descricao, hash_mapa,
    versao_formato, tamanho_bytes, dados_mestre, dados_jogador,
    grid_mestre, grid_jogador, criado_por
  ) values (
    mapa_id_informado, mesa_id_informada, proxima_versao,
    left(coalesce(descricao_informada, ''), 500), hash_informado,
    mapa_atual.versao_formato, octet_length(mapa_mestre_informado::text),
    mapa_mestre_informado, mapa_jogador_informado,
    grid_mestre_informado, grid_jogador_informado, usuario_atual
  );

  update public.mapas_gerador_orbe
  set status = 'aplicado',
      revisao = revisao + 1,
      hash_mapa = hash_informado,
      dados_mapa = mapa_mestre_informado,
      atualizado_por = usuario_atual
  where id = mapa_id_informado
  returning * into mapa_salvo;

  insert into public.mapas_aplicados_orbe (
    mesa_id, mapa_id, revisao, hash_mapa, versao_formato,
    dados_jogador, grid_jogador, aplicado_por
  ) values (
    mesa_id_informada, mapa_id_informado, mapa_salvo.revisao,
    hash_informado, mapa_salvo.versao_formato,
    mapa_jogador_informado, grid_jogador_informado, usuario_atual
  )
  on conflict (mesa_id) do update
  set mapa_id = excluded.mapa_id,
      revisao = excluded.revisao,
      hash_mapa = excluded.hash_mapa,
      versao_formato = excluded.versao_formato,
      dados_jogador = excluded.dados_jogador,
      grid_jogador = excluded.grid_jogador,
      aplicado_por = excluded.aplicado_por;

  delete from public.mapa_versoes_orbe
  where mapa_id = mapa_id_informado
    and id not in (
      select id from public.mapa_versoes_orbe
      where mapa_id = mapa_id_informado
      order by numero_versao desc
      limit 20
    );

  return next mapa_salvo;
end;
$$;

create or replace function public.restaurar_versao_mapa_orbe(
  versao_id_informada uuid,
  mesa_id_informada uuid,
  revisao_esperada integer
)
returns setof public.mapas_gerador_orbe
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  usuario_atual uuid := auth.uid();
  versao_salva public.mapa_versoes_orbe%rowtype;
  mapa_atual public.mapas_gerador_orbe%rowtype;
  mapa_restaurado public.mapas_gerador_orbe%rowtype;
begin
  if usuario_atual is null then
    raise exception 'Sessão expirada.' using errcode = '28000';
  end if;
  if not private.usuario_mestre_mesa_orbe(mesa_id_informada) then
    raise exception 'Somente o mestre pode restaurar mapas.' using errcode = '42501';
  end if;

  select * into versao_salva
  from public.mapa_versoes_orbe
  where id = versao_id_informada and mesa_id = mesa_id_informada;
  if versao_salva.id is null then
    raise exception 'Versão não encontrada.' using errcode = 'P0002';
  end if;

  select * into mapa_atual
  from public.mapas_gerador_orbe
  where id = versao_salva.mapa_id and mesa_id = mesa_id_informada
  for update;
  if mapa_atual.revisao <> revisao_esperada then
    raise exception 'Conflito de revisão. Recarregue a versão online.'
      using errcode = '40001';
  end if;

  update public.mapas_gerador_orbe
  set status = 'aplicado',
      revisao = revisao + 1,
      hash_mapa = versao_salva.hash_mapa,
      versao_formato = versao_salva.versao_formato,
      dados_mapa = versao_salva.dados_mestre,
      atualizado_por = usuario_atual
  where id = mapa_atual.id
  returning * into mapa_restaurado;

  insert into public.mapas_aplicados_orbe (
    mesa_id, mapa_id, revisao, hash_mapa, versao_formato,
    dados_jogador, grid_jogador, aplicado_por
  ) values (
    mesa_id_informada, mapa_restaurado.id, mapa_restaurado.revisao,
    versao_salva.hash_mapa, versao_salva.versao_formato,
    versao_salva.dados_jogador, versao_salva.grid_jogador, usuario_atual
  )
  on conflict (mesa_id) do update
  set mapa_id = excluded.mapa_id,
      revisao = excluded.revisao,
      hash_mapa = excluded.hash_mapa,
      versao_formato = excluded.versao_formato,
      dados_jogador = excluded.dados_jogador,
      grid_jogador = excluded.grid_jogador,
      aplicado_por = excluded.aplicado_por;

  return next mapa_restaurado;
end;
$$;

revoke all on function public.salvar_rascunho_mapa_orbe(
  uuid, uuid, text, text, text, text, text, integer, text, jsonb, jsonb, jsonb, integer
) from public, anon, authenticated;
grant execute on function public.salvar_rascunho_mapa_orbe(
  uuid, uuid, text, text, text, text, text, integer, text, jsonb, jsonb, jsonb, integer
) to authenticated;

revoke all on function public.aplicar_mapa_gerador_orbe(
  uuid, uuid, integer, text, jsonb, jsonb, jsonb, jsonb, text
) from public, anon, authenticated;
grant execute on function public.aplicar_mapa_gerador_orbe(
  uuid, uuid, integer, text, jsonb, jsonb, jsonb, jsonb, text
) to authenticated;

revoke all on function public.restaurar_versao_mapa_orbe(
  uuid, uuid, integer
) from public, anon, authenticated;
grant execute on function public.restaurar_versao_mapa_orbe(
  uuid, uuid, integer
) to authenticated;

alter table public.mapas_aplicados_orbe replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'mapas_aplicados_orbe'
  ) then
    alter publication supabase_realtime add table public.mapas_aplicados_orbe;
  end if;
end;
$$;

commit;

-- Rollback manual (não executar junto com a instalação):
-- begin;
-- drop function if exists public.restaurar_versao_mapa_orbe(uuid, uuid, integer);
-- drop function if exists public.aplicar_mapa_gerador_orbe(uuid, uuid, integer, text, jsonb, jsonb, jsonb, jsonb, text);
-- drop function if exists public.salvar_rascunho_mapa_orbe(uuid, uuid, text, text, text, text, text, integer, text, jsonb, jsonb, jsonb, integer);
-- alter publication supabase_realtime drop table public.mapas_aplicados_orbe;
-- drop table if exists public.mapa_versoes_orbe;
-- drop table if exists public.mapas_aplicados_orbe;
-- drop table if exists public.mapas_gerador_orbe;
-- commit;
