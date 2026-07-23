-- Correção isolada do fluxo de convites online do ORBE.
-- Revise e execute manualmente no SQL Editor do Supabase.

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

-- Funções pequenas e SECURITY DEFINER evitam recursão entre as políticas
-- de mesas_orbe e mesa_membros_orbe.

create or replace function private.usuario_dono_mesa_orbe(
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
    and exists (
      select 1
      from public.mesas_orbe tabela_mesa
      where tabela_mesa.id = mesa
        and tabela_mesa.owner_id = auth.uid()
    );
$$;

create or replace function private.usuario_membro_ativo_mesa_orbe(
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
    and exists (
      select 1
      from public.mesa_membros_orbe membro
      where membro.mesa_id = mesa
        and membro.user_id = auth.uid()
        and membro.status = 'ativo'
    );
$$;

revoke all
on function private.usuario_dono_mesa_orbe(uuid)
from public, anon, authenticated;

grant execute
on function private.usuario_dono_mesa_orbe(uuid)
to authenticated;

revoke all
on function private.usuario_membro_ativo_mesa_orbe(uuid)
from public, anon, authenticated;

grant execute
on function private.usuario_membro_ativo_mesa_orbe(uuid)
to authenticated;

-- Impede que owner_id e codigo_convite sejam alterados depois da criação.

create or replace function private.proteger_identidade_mesa_orbe()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception using
      errcode = '42501',
      message = 'O proprietário da mesa não pode ser alterado.';
  end if;

  if new.codigo_convite is distinct from old.codigo_convite then
    raise exception using
      errcode = '42501',
      message = 'O código de convite da mesa não pode ser alterado.';
  end if;

  return new;
end;
$$;

drop trigger if exists proteger_identidade_mesa_orbe
on public.mesas_orbe;

create trigger proteger_identidade_mesa_orbe
before update on public.mesas_orbe
for each row
execute function private.proteger_identidade_mesa_orbe();

-- Garante que o criador seja membro mestre da própria mesa.

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

-- Entrada segura por convite. A função localiza uma única mesa sem conceder
-- ao jogador permissão para listar campanhas que ainda não integra.

create or replace function public.entrar_mesa_por_codigo(
  codigo_informado text
)
returns table (
  id uuid,
  nome text,
  sistema text,
  dados jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  mesa_encontrada public.mesas_orbe%rowtype;
  codigo_normalizado text;
begin
  if auth.uid() is null then
    raise exception using
      errcode = '28000',
      message = 'Faça login antes de entrar na mesa.';
  end if;

  codigo_normalizado := upper(btrim(coalesce(codigo_informado, '')));

  if codigo_normalizado = '' then
    raise exception using
      errcode = '22023',
      message = 'Informe o código de convite da mesa.';
  end if;

  select tabela_mesa.*
  into mesa_encontrada
  from public.mesas_orbe tabela_mesa
  where lower(btrim(tabela_mesa.codigo_convite))
    = lower(codigo_normalizado)
  limit 1;

  if mesa_encontrada.id is null then
    raise exception using
      errcode = 'P0002',
      message = 'Código de convite não encontrado.';
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
    'jogador',
    'ativo'
  )
  on conflict (mesa_id, user_id) do update
  set
    papel = case
      when public.mesa_membros_orbe.papel = 'mestre' then 'mestre'
      else 'jogador'
    end,
    status = 'ativo';

  return query
  select
    mesa_encontrada.id,
    mesa_encontrada.nome,
    mesa_encontrada.sistema,
    mesa_encontrada.dados,
    mesa_encontrada.created_at,
    mesa_encontrada.updated_at;
end;
$$;

revoke all
on function public.entrar_mesa_por_codigo(text)
from public, anon, authenticated;

grant execute
on function public.entrar_mesa_por_codigo(text)
to authenticated;

-- =========================================================
-- PRIVILÉGIOS DAS TABELAS
-- O RLS continua responsável por limitar cada operação às
-- linhas permitidas pelas políticas definidas abaixo.
-- =========================================================

grant usage on schema public
to authenticated;

grant select, insert, update, delete
on table public.mesas_orbe
to authenticated;

grant select, insert, update, delete
on table public.mesa_membros_orbe
to authenticated;

revoke all
on table public.mesas_orbe
from anon;

revoke all
on table public.mesa_membros_orbe
from anon;

alter table public.mesas_orbe enable row level security;
alter table public.mesa_membros_orbe enable row level security;

drop policy if exists "membro le mesa"
on public.mesas_orbe;

drop policy if exists "usuario cria mesa"
on public.mesas_orbe;

drop policy if exists "mestre atualiza mesa"
on public.mesas_orbe;

drop policy if exists "dono exclui mesa"
on public.mesas_orbe;

create policy "membro le mesa"
on public.mesas_orbe
for select
to authenticated
using (
  private.usuario_dono_mesa_orbe(id)
  or private.usuario_membro_ativo_mesa_orbe(id)
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
  private.usuario_dono_mesa_orbe(id)
)
with check (
  owner_id = auth.uid()
);

create policy "dono exclui mesa"
on public.mesas_orbe
for delete
to authenticated
using (
  private.usuario_dono_mesa_orbe(id)
);

drop policy if exists "membro le participantes"
on public.mesa_membros_orbe;

drop policy if exists "mestre administra participantes"
on public.mesa_membros_orbe;

create policy "membro le participantes"
on public.mesa_membros_orbe
for select
to authenticated
using (
  user_id = auth.uid()
  or private.usuario_dono_mesa_orbe(mesa_id)
);

create policy "mestre administra participantes"
on public.mesa_membros_orbe
for all
to authenticated
using (
  private.usuario_dono_mesa_orbe(mesa_id)
)
with check (
  private.usuario_dono_mesa_orbe(mesa_id)
);
