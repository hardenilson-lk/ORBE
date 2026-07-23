-- Aprovação de convites, amizades e chats do portal ORBE.
-- Revise e execute manualmente no SQL Editor do Supabase.

create extension if not exists "pgcrypto";
create schema if not exists private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

-- =========================================================
-- APROVAÇÃO DE ENTRADA NAS MESAS
-- =========================================================

alter table public.mesas_orbe
add column if not exists exigir_aprovacao_convite boolean not null default true;

drop function if exists public.entrar_mesa_por_codigo(text);

create function public.entrar_mesa_por_codigo(
  codigo_informado text
)
returns table (
  id uuid,
  nome text,
  sistema text,
  dados jsonb,
  codigo_convite text,
  exigir_aprovacao_convite boolean,
  status_entrada text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  mesa_encontrada public.mesas_orbe%rowtype;
  status_final text;
begin
  if auth.uid() is null then
    raise exception using
      errcode = '28000',
      message = 'Faça login antes de entrar na mesa.';
  end if;

  if btrim(coalesce(codigo_informado, '')) = '' then
    raise exception using
      errcode = '22023',
      message = 'Informe o código de convite da mesa.';
  end if;

  select tabela_mesa.*
  into mesa_encontrada
  from public.mesas_orbe tabela_mesa
  where lower(btrim(tabela_mesa.codigo_convite))
    = lower(btrim(codigo_informado))
  limit 1;

  if mesa_encontrada.id is null then
    raise exception using
      errcode = 'P0002',
      message = 'Código de convite não encontrado.';
  end if;

  if mesa_encontrada.owner_id = auth.uid() then
    status_final := 'ativo';
  else
    select membro.status
    into status_final
    from public.mesa_membros_orbe membro
    where membro.mesa_id = mesa_encontrada.id
      and membro.user_id = auth.uid();

    if status_final is distinct from 'ativo' then
      status_final := case
        when mesa_encontrada.exigir_aprovacao_convite then 'pendente'
        else 'ativo'
      end;
    end if;
  end if;

  insert into public.mesa_membros_orbe (
    mesa_id,
    user_id,
    papel,
    status
  )
  values (
    mesa_encontrada.id,
    auth.uid(),
    case when mesa_encontrada.owner_id = auth.uid() then 'mestre' else 'jogador' end,
    status_final
  )
  on conflict (mesa_id, user_id) do update
  set
    papel = case
      when public.mesa_membros_orbe.papel = 'mestre' then 'mestre'
      else excluded.papel
    end,
    status = case
      when public.mesa_membros_orbe.status = 'ativo' then 'ativo'
      else excluded.status
    end;

  return query
  select
    mesa_encontrada.id,
    mesa_encontrada.nome,
    mesa_encontrada.sistema,
    mesa_encontrada.dados,
    mesa_encontrada.codigo_convite,
    mesa_encontrada.exigir_aprovacao_convite,
    status_final,
    mesa_encontrada.created_at,
    mesa_encontrada.updated_at;
end;
$$;

revoke all on function public.entrar_mesa_por_codigo(text)
from public, anon, authenticated;

grant execute on function public.entrar_mesa_por_codigo(text)
to authenticated;

-- =========================================================
-- AMIZADES
-- =========================================================

create table if not exists public.amizades_orbe (
  id uuid primary key default gen_random_uuid(),
  solicitante_id uuid not null references public.perfis_orbe(id) on delete cascade,
  destinatario_id uuid not null references public.perfis_orbe(id) on delete cascade,
  status text not null default 'pendente'
    check (status in ('pendente', 'aceita', 'recusada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (solicitante_id <> destinatario_id)
);

create unique index if not exists amizades_orbe_par_unico_idx
on public.amizades_orbe (
  least(solicitante_id, destinatario_id),
  greatest(solicitante_id, destinatario_id)
);

create index if not exists amizades_orbe_solicitante_idx
on public.amizades_orbe (solicitante_id, status);

create index if not exists amizades_orbe_destinatario_idx
on public.amizades_orbe (destinatario_id, status);

drop trigger if exists atualizar_amizades_orbe_updated_at
on public.amizades_orbe;

create trigger atualizar_amizades_orbe_updated_at
before update on public.amizades_orbe
for each row
execute function private.definir_updated_at_orbe();

create or replace function private.usuario_participa_amizade_orbe(
  amizade uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.amizades_orbe a
      where a.id = amizade
        and a.status = 'aceita'
        and auth.uid() in (a.solicitante_id, a.destinatario_id)
    );
$$;

revoke all on function private.usuario_participa_amizade_orbe(uuid)
from public, anon, authenticated;

grant execute on function private.usuario_participa_amizade_orbe(uuid)
to authenticated;

create or replace function public.buscar_perfis_orbe(
  termo text
)
returns table (
  id uuid,
  nome text,
  usuario text
)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select p.id, p.nome, p.usuario
  from public.perfis_orbe p
  where auth.uid() is not null
    and p.id <> auth.uid()
    and length(btrim(coalesce(termo, ''))) >= 2
    and (
      p.usuario ilike '%' || btrim(termo) || '%'
      or p.nome ilike '%' || btrim(termo) || '%'
    )
  order by
    case when lower(p.usuario) = lower(btrim(termo)) then 0 else 1 end,
    p.usuario
  limit 20;
$$;

revoke all on function public.buscar_perfis_orbe(text)
from public, anon, authenticated;

grant execute on function public.buscar_perfis_orbe(text)
to authenticated;

create or replace function public.solicitar_amizade_orbe(
  usuario_destino uuid
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  amizade_existente public.amizades_orbe%rowtype;
  amizade_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Faça login para adicionar amigos.';
  end if;

  if usuario_destino is null or usuario_destino = auth.uid() then
    raise exception 'Escolha outra pessoa para adicionar.';
  end if;

  if not exists (select 1 from public.perfis_orbe where id = usuario_destino) then
    raise exception 'Usuário não encontrado.';
  end if;

  select a.*
  into amizade_existente
  from public.amizades_orbe a
  where auth.uid() in (a.solicitante_id, a.destinatario_id)
    and usuario_destino in (a.solicitante_id, a.destinatario_id)
  limit 1;

  if amizade_existente.status = 'aceita' then
    return amizade_existente.id;
  end if;

  if amizade_existente.status = 'pendente' then
    return amizade_existente.id;
  end if;

  if amizade_existente.id is not null then
    update public.amizades_orbe
    set
      solicitante_id = auth.uid(),
      destinatario_id = usuario_destino,
      status = 'pendente'
    where id = amizade_existente.id
    returning id into amizade_id;
  else
    insert into public.amizades_orbe (
      solicitante_id,
      destinatario_id,
      status
    )
    values (
      auth.uid(),
      usuario_destino,
      'pendente'
    )
    returning id into amizade_id;
  end if;

  return amizade_id;
end;
$$;

create or replace function public.responder_amizade_orbe(
  amizade_informada uuid,
  aceitar boolean
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  update public.amizades_orbe
  set status = case when aceitar then 'aceita' else 'recusada' end
  where id = amizade_informada
    and destinatario_id = auth.uid()
    and status = 'pendente';

  if not found then
    raise exception 'Solicitação de amizade não encontrada.';
  end if;
end;
$$;

revoke all on function public.solicitar_amizade_orbe(uuid)
from public, anon, authenticated;
grant execute on function public.solicitar_amizade_orbe(uuid)
to authenticated;

revoke all on function public.responder_amizade_orbe(uuid, boolean)
from public, anon, authenticated;
grant execute on function public.responder_amizade_orbe(uuid, boolean)
to authenticated;

-- =========================================================
-- CHAT PRIVADO E CHAT GERAL
-- =========================================================

create table if not exists public.mensagens_privadas_orbe (
  id uuid primary key default gen_random_uuid(),
  amizade_id uuid not null references public.amizades_orbe(id) on delete cascade,
  autor_id uuid not null references public.perfis_orbe(id) on delete cascade,
  conteudo text not null check (
    length(btrim(conteudo)) between 1 and 1000
  ),
  created_at timestamptz not null default now()
);

create index if not exists mensagens_privadas_orbe_amizade_idx
on public.mensagens_privadas_orbe (amizade_id, created_at desc);

create table if not exists public.mensagens_gerais_orbe (
  id uuid primary key default gen_random_uuid(),
  autor_id uuid not null references public.perfis_orbe(id) on delete cascade,
  conteudo text not null check (
    length(btrim(conteudo)) between 1 and 500
  ),
  created_at timestamptz not null default now()
);

create index if not exists mensagens_gerais_orbe_criadas_idx
on public.mensagens_gerais_orbe (created_at desc);

alter table public.amizades_orbe enable row level security;
alter table public.mensagens_privadas_orbe enable row level security;
alter table public.mensagens_gerais_orbe enable row level security;

drop policy if exists "participante le amizade" on public.amizades_orbe;
create policy "participante le amizade"
on public.amizades_orbe
for select to authenticated
using (
  auth.uid() in (solicitante_id, destinatario_id)
);

drop policy if exists "amigos leem conversa" on public.mensagens_privadas_orbe;
create policy "amigos leem conversa"
on public.mensagens_privadas_orbe
for select to authenticated
using (
  private.usuario_participa_amizade_orbe(amizade_id)
);

drop policy if exists "amigos enviam mensagem" on public.mensagens_privadas_orbe;
create policy "amigos enviam mensagem"
on public.mensagens_privadas_orbe
for insert to authenticated
with check (
  autor_id = auth.uid()
  and private.usuario_participa_amizade_orbe(amizade_id)
);

drop policy if exists "autenticado le chat geral" on public.mensagens_gerais_orbe;
create policy "autenticado le chat geral"
on public.mensagens_gerais_orbe
for select to authenticated
using (
  auth.uid() is not null
);

drop policy if exists "autenticado escreve chat geral" on public.mensagens_gerais_orbe;
create policy "autenticado escreve chat geral"
on public.mensagens_gerais_orbe
for insert to authenticated
with check (
  autor_id = auth.uid()
);

grant select on table public.amizades_orbe to authenticated;
grant select, insert on table public.mensagens_privadas_orbe to authenticated;
grant select, insert on table public.mensagens_gerais_orbe to authenticated;

revoke all on table public.amizades_orbe from anon;
revoke all on table public.mensagens_privadas_orbe from anon;
revoke all on table public.mensagens_gerais_orbe from anon;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'amizades_orbe'
  ) then
    alter publication supabase_realtime add table public.amizades_orbe;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'mensagens_privadas_orbe'
  ) then
    alter publication supabase_realtime add table public.mensagens_privadas_orbe;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'mensagens_gerais_orbe'
  ) then
    alter publication supabase_realtime add table public.mensagens_gerais_orbe;
  end if;
end
$$;
