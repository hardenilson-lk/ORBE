-- Correção idempotente do fluxo online do ORBE.
-- Execute manualmente no SQL Editor do Supabase.
-- Não cria tabelas novas e não desativa o RLS.

alter table public.mesas_orbe
add column if not exists exigir_aprovacao_convite boolean not null default true;

-- O usuário precisa ler a própria associação pendente para receber,
-- via Realtime, a aprovação ou recusa do mestre.
drop policy if exists "usuario le propria associacao"
on public.mesa_membros_orbe;

create policy "usuario le propria associacao"
on public.mesa_membros_orbe
for select
to authenticated
using (
  user_id = auth.uid()
);

-- Consolida a versão da RPC que respeita exigir_aprovacao_convite.
-- Ela reutiliza mesa_membros_orbe: pendente é a solicitação e ativo é o membro.
drop function if exists public.entrar_mesa_por_codigo(text);

create function public.entrar_mesa_por_codigo(
  codigo_informado text
)
returns table (
  id uuid,
  owner_id uuid,
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

  if exists (
    select 1
    from public.mesa_membros_orbe membro
    where membro.mesa_id = mesa_encontrada.id
      and membro.user_id = auth.uid()
      and membro.status = 'banido'
  ) then
    raise exception using
      errcode = '42501',
      message = 'Você foi banido desta mesa.';
  end if;

  status_final := case
    when mesa_encontrada.owner_id = auth.uid() then 'ativo'
    when mesa_encontrada.exigir_aprovacao_convite then 'pendente'
    else 'ativo'
  end;

  insert into public.mesa_membros_orbe (
    mesa_id,
    user_id,
    papel,
    status
  )
  values (
    mesa_encontrada.id,
    auth.uid(),
    case
      when mesa_encontrada.owner_id = auth.uid() then 'mestre'
      else 'jogador'
    end,
    status_final
  )
  on conflict (mesa_id, user_id) do update
  set
    papel = case
      when public.mesa_membros_orbe.papel = 'mestre' then 'mestre'
      else excluded.papel
    end,
    status = excluded.status;

  return query
  select
    mesa_encontrada.id,
    mesa_encontrada.owner_id,
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

-- Garante os eventos necessários sem duplicar entradas na publicação.
alter table public.mesas_orbe replica identity full;
alter table public.mesa_membros_orbe replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'mesas_orbe'
  ) then
    alter publication supabase_realtime add table public.mesas_orbe;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'mesa_membros_orbe'
  ) then
    alter publication supabase_realtime add table public.mesa_membros_orbe;
  end if;
end
$$;
