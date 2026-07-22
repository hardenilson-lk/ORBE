create extension if not exists "pgcrypto";

-- =========================================================
-- ESQUEMA PRIVADO
-- Guarda funções internas que não devem aparecer na API.
-- =========================================================

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

-- =========================================================
-- TABELAS
-- =========================================================

create table if not exists public.perfis_orbe (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  usuario text unique not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mesas_orbe (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  codigo_convite text unique not null,
  sistema text not null default 'arquivos',
  dados jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mesa_membros_orbe (
  mesa_id uuid not null references public.mesas_orbe(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  papel text not null default 'jogador'
    check (papel in ('mestre', 'jogador')),
  status text not null default 'ativo',
  created_at timestamptz not null default now(),
  primary key (mesa_id, user_id)
);

create table if not exists public.fichas_orbe (
  id text primary key,
  mesa_id uuid not null references public.mesas_orbe(id) on delete cascade,
  responsavel_id uuid references auth.users(id) on delete set null,
  nome text not null,
  edit_locked boolean not null default true,
  dados jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessoes_orbe (
  mesa_id uuid primary key references public.mesas_orbe(id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.segredos_mestre_orbe (
  mesa_id uuid primary key references public.mesas_orbe(id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ÍNDICES
-- Melhoram buscas usadas pelas políticas e pelo site.
-- =========================================================

create unique index if not exists
  mesas_orbe_codigo_convite_normalizado_idx
on public.mesas_orbe (
  lower(btrim(codigo_convite))
);

create index if not exists
  mesas_orbe_owner_id_idx
on public.mesas_orbe (owner_id);

create index if not exists
  mesa_membros_orbe_user_status_idx
on public.mesa_membros_orbe (user_id, status);

create index if not exists
  mesa_membros_orbe_mesa_status_idx
on public.mesa_membros_orbe (mesa_id, status);

create index if not exists
  fichas_orbe_mesa_id_idx
on public.fichas_orbe (mesa_id);

create index if not exists
  fichas_orbe_responsavel_id_idx
on public.fichas_orbe (responsavel_id);

-- =========================================================
-- UPDATED_AT AUTOMÁTICO
-- =========================================================

create or replace function private.definir_updated_at_orbe()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists atualizar_perfis_orbe_updated_at
on public.perfis_orbe;

create trigger atualizar_perfis_orbe_updated_at
before update on public.perfis_orbe
for each row
execute function private.definir_updated_at_orbe();

drop trigger if exists atualizar_mesas_orbe_updated_at
on public.mesas_orbe;

create trigger atualizar_mesas_orbe_updated_at
before update on public.mesas_orbe
for each row
execute function private.definir_updated_at_orbe();

drop trigger if exists atualizar_fichas_orbe_updated_at
on public.fichas_orbe;

create trigger atualizar_fichas_orbe_updated_at
before update on public.fichas_orbe
for each row
execute function private.definir_updated_at_orbe();

drop trigger if exists atualizar_sessoes_orbe_updated_at
on public.sessoes_orbe;

create trigger atualizar_sessoes_orbe_updated_at
before update on public.sessoes_orbe
for each row
execute function private.definir_updated_at_orbe();

drop trigger if exists atualizar_segredos_mestre_orbe_updated_at
on public.segredos_mestre_orbe;

create trigger atualizar_segredos_mestre_orbe_updated_at
before update on public.segredos_mestre_orbe
for each row
execute function private.definir_updated_at_orbe();

-- =========================================================
-- CRIAÇÃO AUTOMÁTICA DO PERFIL
-- =========================================================

create or replace function private.criar_perfil_orbe()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  nome_final text;
  usuario_base text;
  usuario_final text;
begin
  nome_final := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'nome'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Agente'
  );

  usuario_base := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'usuario'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'usuario'
  );

  usuario_base := lower(
    regexp_replace(
      usuario_base,
      '[^a-zA-Z0-9_]+',
      '_',
      'g'
    )
  );

  usuario_base := btrim(usuario_base, '_');

  if usuario_base = '' then
    usuario_base := 'usuario';
  end if;

  usuario_final := left(usuario_base, 48);

  begin
    insert into public.perfis_orbe (
      id,
      nome,
      usuario,
      email
    )
    values (
      new.id,
      nome_final,
      usuario_final,
      new.email
    )
    on conflict (id) do update
    set
      nome = excluded.nome,
      email = excluded.email,
      updated_at = now();

  exception
    when unique_violation then
      usuario_final :=
        left(usuario_base, 40)
        || '_'
        || left(new.id::text, 6);

      insert into public.perfis_orbe (
        id,
        nome,
        usuario,
        email
      )
      values (
        new.id,
        nome_final,
        usuario_final,
        new.email
      )
      on conflict (id) do update
      set
        nome = excluded.nome,
        email = excluded.email,
        updated_at = now();
  end;

  return new;
end;
$$;

drop trigger if exists criar_perfil_orbe
on auth.users;

create trigger criar_perfil_orbe
after insert on auth.users
for each row
execute function private.criar_perfil_orbe();

-- =========================================================
-- SINCRONIZAR ALTERAÇÃO DE E-MAIL
-- =========================================================

create or replace function private.sincronizar_email_perfil_orbe()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  update public.perfis_orbe
  set
    email = new.email,
    updated_at = now()
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists sincronizar_email_perfil_orbe
on auth.users;

create trigger sincronizar_email_perfil_orbe
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function private.sincronizar_email_perfil_orbe();

-- =========================================================
-- FUNÇÕES INTERNAS DE PERMISSÃO
-- =========================================================

create or replace function private.usuario_participa_mesa_orbe(
  mesa uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    auth.uid() is not null
    and (
      exists (
        select 1
        from public.mesa_membros_orbe membro
        where membro.mesa_id = mesa
          and membro.user_id = auth.uid()
          and membro.status = 'ativo'
      )
      or exists (
        select 1
        from public.mesas_orbe tabela_mesa
        where tabela_mesa.id = mesa
          and tabela_mesa.owner_id = auth.uid()
      )
    );
$$;

create or replace function private.usuario_mestre_mesa_orbe(
  mesa uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    auth.uid() is not null
    and (
      exists (
        select 1
        from public.mesas_orbe tabela_mesa
        where tabela_mesa.id = mesa
          and tabela_mesa.owner_id = auth.uid()
      )
      or exists (
        select 1
        from public.mesa_membros_orbe membro
        where membro.mesa_id = mesa
          and membro.user_id = auth.uid()
          and membro.papel = 'mestre'
          and membro.status = 'ativo'
      )
    );
$$;

-- =========================================================
-- ENTRAR EM UMA MESA POR CÓDIGO
-- Esta função será chamada pelo site através do Supabase.
-- =========================================================

create or replace function public.entrar_mesa_orbe(
  codigo_informado text
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  mesa_encontrada uuid;
  codigo_normalizado text;
begin
  if auth.uid() is null then
    raise exception 'Faça login antes de entrar na mesa.';
  end if;

  codigo_normalizado := btrim(
    coalesce(codigo_informado, '')
  );

  if codigo_normalizado = '' then
    raise exception 'Informe o código de convite da mesa.';
  end if;

  select tabela_mesa.id
  into mesa_encontrada
  from public.mesas_orbe tabela_mesa
  where lower(btrim(tabela_mesa.codigo_convite))
    = lower(codigo_normalizado)
  limit 1;

  if mesa_encontrada is null then
    raise exception 'Código de convite não encontrado.';
  end if;

  insert into public.mesa_membros_orbe (
    mesa_id,
    user_id,
    papel,
    status
  )
  values (
    mesa_encontrada,
    auth.uid(),
    'jogador',
    'ativo'
  )
  on conflict (mesa_id, user_id) do update
  set status = 'ativo';

  return mesa_encontrada;
end;
$$;

-- =========================================================
-- REGISTRAR AUTOMATICAMENTE O CRIADOR COMO MESTRE
-- =========================================================

create or replace function private.registrar_mestre_mesa_orbe()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.mesa_membros_orbe (
    mesa_id,
    user_id,
    papel,
    status
  )
  values (
    new.id,
    new.owner_id,
    'mestre',
    'ativo'
  )
  on conflict (mesa_id, user_id) do update
  set
    papel = 'mestre',
    status = 'ativo';

  return new;
end;
$$;

drop trigger if exists registrar_mestre_mesa_orbe
on public.mesas_orbe;

create trigger registrar_mestre_mesa_orbe
after insert on public.mesas_orbe
for each row
execute function private.registrar_mestre_mesa_orbe();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.perfis_orbe
enable row level security;

alter table public.mesas_orbe
enable row level security;

alter table public.mesa_membros_orbe
enable row level security;

alter table public.fichas_orbe
enable row level security;

alter table public.sessoes_orbe
enable row level security;

alter table public.segredos_mestre_orbe
enable row level security;

-- =========================================================
-- REMOVER POLÍTICAS ANTIGAS
-- Permite executar o arquivo novamente sem duplicar regras.
-- =========================================================

drop policy if exists
  "perfil autenticado pode ler"
on public.perfis_orbe;

drop policy if exists
  "perfil autenticado le dados publicos"
on public.perfis_orbe;

drop policy if exists
  "usuario cria proprio perfil"
on public.perfis_orbe;

drop policy if exists
  "usuario atualiza proprio perfil"
on public.perfis_orbe;

drop policy if exists
  "membro le mesa"
on public.mesas_orbe;

drop policy if exists
  "usuario cria mesa"
on public.mesas_orbe;

drop policy if exists
  "mestre atualiza mesa"
on public.mesas_orbe;

drop policy if exists
  "dono exclui mesa"
on public.mesas_orbe;

drop policy if exists
  "membro le participantes"
on public.mesa_membros_orbe;

drop policy if exists
  "mestre administra participantes"
on public.mesa_membros_orbe;

drop policy if exists
  "membro le fichas permitidas"
on public.fichas_orbe;

drop policy if exists
  "mestre cria ficha"
on public.fichas_orbe;

drop policy if exists
  "mestre atualiza ficha"
on public.fichas_orbe;

drop policy if exists
  "jogador atualiza ficha liberada"
on public.fichas_orbe;

drop policy if exists
  "mestre exclui ficha"
on public.fichas_orbe;

drop policy if exists
  "membro le sessao publica"
on public.sessoes_orbe;

drop policy if exists
  "membro grava sessao publica"
on public.sessoes_orbe;

drop policy if exists
  "membro atualiza sessao publica"
on public.sessoes_orbe;

drop policy if exists
  "mestre exclui sessao publica"
on public.sessoes_orbe;

drop policy if exists
  "mestre le segredos"
on public.segredos_mestre_orbe;

drop policy if exists
  "mestre cria segredos"
on public.segredos_mestre_orbe;

drop policy if exists
  "mestre atualiza segredos"
on public.segredos_mestre_orbe;

drop policy if exists
  "mestre exclui segredos"
on public.segredos_mestre_orbe;

-- =========================================================
-- POLÍTICAS DE PERFIL
-- O e-mail continua protegido pelas permissões de coluna.
-- =========================================================

create policy "perfil autenticado le dados publicos"
on public.perfis_orbe
for select
to authenticated
using (true);

create policy "usuario cria proprio perfil"
on public.perfis_orbe
for insert
to authenticated
with check (
  id = auth.uid()
);

create policy "usuario atualiza proprio perfil"
on public.perfis_orbe
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);

-- =========================================================
-- POLÍTICAS DE MESAS
-- =========================================================

create policy "membro le mesa"
on public.mesas_orbe
for select
to authenticated
using (
  private.usuario_participa_mesa_orbe(id)
);

create policy "usuario cria mesa"
on public.mesas_orbe
for insert
to authenticated
with check (
  owner_id = auth.uid()
);

create policy "mestre atualiza mesa"
on public.mesas_orbe
for update
to authenticated
using (
  private.usuario_mestre_mesa_orbe(id)
)
with check (
  private.usuario_mestre_mesa_orbe(id)
);

create policy "dono exclui mesa"
on public.mesas_orbe
for delete
to authenticated
using (
  owner_id = auth.uid()
);

-- =========================================================
-- POLÍTICAS DE PARTICIPANTES
-- =========================================================

create policy "membro le participantes"
on public.mesa_membros_orbe
for select
to authenticated
using (
  private.usuario_participa_mesa_orbe(mesa_id)
);

create policy "mestre administra participantes"
on public.mesa_membros_orbe
for all
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
)
with check (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

-- =========================================================
-- POLÍTICAS DE FICHAS
-- =========================================================

create policy "membro le fichas permitidas"
on public.fichas_orbe
for select
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
  or responsavel_id = auth.uid()
);

create policy "mestre cria ficha"
on public.fichas_orbe
for insert
to authenticated
with check (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

create policy "mestre atualiza ficha"
on public.fichas_orbe
for update
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
)
with check (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

create policy "jogador atualiza ficha liberada"
on public.fichas_orbe
for update
to authenticated
using (
  responsavel_id = auth.uid()
  and edit_locked = false
)
with check (
  responsavel_id = auth.uid()
  and edit_locked = false
);

create policy "mestre exclui ficha"
on public.fichas_orbe
for delete
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

-- =========================================================
-- POLÍTICAS DA SESSÃO PÚBLICA
-- =========================================================

create policy "membro le sessao publica"
on public.sessoes_orbe
for select
to authenticated
using (
  private.usuario_participa_mesa_orbe(mesa_id)
);

create policy "membro grava sessao publica"
on public.sessoes_orbe
for insert
to authenticated
with check (
  private.usuario_participa_mesa_orbe(mesa_id)
);

create policy "membro atualiza sessao publica"
on public.sessoes_orbe
for update
to authenticated
using (
  private.usuario_participa_mesa_orbe(mesa_id)
)
with check (
  private.usuario_participa_mesa_orbe(mesa_id)
);

create policy "mestre exclui sessao publica"
on public.sessoes_orbe
for delete
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

-- =========================================================
-- POLÍTICAS DOS SEGREDOS DO MESTRE
-- =========================================================

create policy "mestre le segredos"
on public.segredos_mestre_orbe
for select
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

create policy "mestre cria segredos"
on public.segredos_mestre_orbe
for insert
to authenticated
with check (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

create policy "mestre atualiza segredos"
on public.segredos_mestre_orbe
for update
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
)
with check (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

create policy "mestre exclui segredos"
on public.segredos_mestre_orbe
for delete
to authenticated
using (
  private.usuario_mestre_mesa_orbe(mesa_id)
);

-- =========================================================
-- PERMISSÕES DO ESQUEMA PÚBLICO
-- =========================================================

grant usage on schema public to authenticated;

-- Nenhum usuário anônimo acessará as tabelas do ORBE.

revoke all
on table public.perfis_orbe
from anon, authenticated;

revoke all
on table public.mesas_orbe
from anon, authenticated;

revoke all
on table public.mesa_membros_orbe
from anon, authenticated;

revoke all
on table public.fichas_orbe
from anon, authenticated;

revoke all
on table public.sessoes_orbe
from anon, authenticated;

revoke all
on table public.segredos_mestre_orbe
from anon, authenticated;

-- Perfis:
-- usuários autenticados podem ler apenas colunas públicas.
-- A coluna email não recebe permissão de leitura.

grant select (
  id,
  nome,
  usuario,
  created_at,
  updated_at
)
on table public.perfis_orbe
to authenticated;

grant insert (
  id,
  nome,
  usuario,
  email
)
on table public.perfis_orbe
to authenticated;

grant update (
  nome,
  usuario,
  email
)
on table public.perfis_orbe
to authenticated;

-- Mesas

grant select, insert, update, delete
on table public.mesas_orbe
to authenticated;

-- Participantes

grant select, insert, update, delete
on table public.mesa_membros_orbe
to authenticated;

-- Fichas

grant select, insert, update, delete
on table public.fichas_orbe
to authenticated;

-- Sessões públicas

grant select, insert, update, delete
on table public.sessoes_orbe
to authenticated;

-- Segredos do mestre

grant select, insert, update, delete
on table public.segredos_mestre_orbe
to authenticated;

-- =========================================================
-- PERMISSÕES DAS FUNÇÕES
-- =========================================================

revoke all
on function public.entrar_mesa_orbe(text)
from public, anon, authenticated;

grant execute
on function public.entrar_mesa_orbe(text)
to authenticated;

revoke all
on function private.usuario_participa_mesa_orbe(uuid)
from public;

grant execute
on function private.usuario_participa_mesa_orbe(uuid)
to authenticated;

revoke all
on function private.usuario_mestre_mesa_orbe(uuid)
from public;

grant execute
on function private.usuario_mestre_mesa_orbe(uuid)
to authenticated;

revoke all
on function private.criar_perfil_orbe()
from public;

revoke all
on function private.sincronizar_email_perfil_orbe()
from public;

revoke all
on function private.registrar_mestre_mesa_orbe()
from public;

revoke all
on function private.definir_updated_at_orbe()
from public;

-- =========================================================
-- TEMPO REAL DA MESA
-- Mantém mestre e jogadores sincronizados sem expor dados
-- além do que as políticas RLS já permitem a cada usuário.
-- =========================================================

alter table public.mesas_orbe replica identity full;
alter table public.mesa_membros_orbe replica identity full;
alter table public.fichas_orbe replica identity full;
alter table public.sessoes_orbe replica identity full;
alter table public.segredos_mestre_orbe replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'mesas_orbe'
  ) then
    alter publication supabase_realtime add table public.mesas_orbe;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'mesa_membros_orbe'
  ) then
    alter publication supabase_realtime add table public.mesa_membros_orbe;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'fichas_orbe'
  ) then
    alter publication supabase_realtime add table public.fichas_orbe;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sessoes_orbe'
  ) then
    alter publication supabase_realtime add table public.sessoes_orbe;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'segredos_mestre_orbe'
  ) then
    alter publication supabase_realtime add table public.segredos_mestre_orbe;
  end if;
end $$;
