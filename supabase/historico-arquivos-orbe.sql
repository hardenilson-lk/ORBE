-- Historico persistente dos Arquivos da campanha.
-- Seguro para executar depois do schema base: nao recria nem apaga tabelas existentes.

create table if not exists public.arquivo_versoes_orbe (
  id uuid primary key default gen_random_uuid(),
  mesa_id uuid not null references public.mesas_orbe(id) on delete cascade,
  arquivo_id text not null,
  usuario_id uuid references auth.users(id) on delete set null,
  autor_nome text,
  numero_versao integer not null check (numero_versao > 0),
  dados jsonb not null,
  origem_versao integer,
  created_at timestamptz not null default now(),
  constraint arquivo_versoes_orbe_numero_unico
    unique (mesa_id, arquivo_id, numero_versao)
);

alter table public.arquivo_versoes_orbe
  add column if not exists autor_nome text;

create index if not exists arquivo_versoes_orbe_mesa_idx
  on public.arquivo_versoes_orbe (mesa_id, created_at desc);

create index if not exists arquivo_versoes_orbe_arquivo_idx
  on public.arquivo_versoes_orbe (mesa_id, arquivo_id, numero_versao desc);

create unique index if not exists arquivo_versoes_orbe_dados_unicos_idx
  on public.arquivo_versoes_orbe (mesa_id, arquivo_id, md5(dados::text));

alter table public.arquivo_versoes_orbe enable row level security;

revoke all on table public.arquivo_versoes_orbe from anon, authenticated;
grant select on table public.arquivo_versoes_orbe to authenticated;

create or replace function private.usuario_pode_ler_historico_arquivo_orbe(
  p_mesa_id uuid,
  p_arquivo_id text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public, private
as $$
declare
  arquivo jsonb;
begin
  if not private.usuario_participa_mesa_orbe(p_mesa_id) then
    return false;
  end if;

  if private.usuario_mestre_mesa_orbe(p_mesa_id) then
    return true;
  end if;

  select item
    into arquivo
    from public.sessoes_orbe sessao,
      jsonb_array_elements(coalesce(sessao.dados -> 'arquivos', '[]'::jsonb)) item
   where sessao.mesa_id = p_mesa_id
     and item ->> 'id' = p_arquivo_id
   limit 1;

  return coalesce(
    arquivo ->> 'visivelJogadores' = 'true'
      or arquivo ->> 'visibleToPlayers' = 'true',
    false
  );
end;
$$;

drop policy if exists "participante autorizado le historico de arquivo"
  on public.arquivo_versoes_orbe;

create policy "participante autorizado le historico de arquivo"
  on public.arquivo_versoes_orbe
  for select
  to authenticated
  using (private.usuario_pode_ler_historico_arquivo_orbe(mesa_id, arquivo_id));

create or replace function public.listar_versoes_arquivo_orbe(
  p_mesa_id uuid,
  p_arquivo_id text
)
returns table (
  id uuid,
  mesa_id uuid,
  arquivo_id text,
  usuario_id uuid,
  numero_versao integer,
  dados jsonb,
  origem_versao integer,
  created_at timestamptz,
  autor_nome text
)
language plpgsql
stable
security invoker
set search_path = public, private
as $$
begin
  if not private.usuario_pode_ler_historico_arquivo_orbe(p_mesa_id, p_arquivo_id) then
    raise exception 'Usuario nao autorizado a consultar este historico';
  end if;

  return query
    select versao.id, versao.mesa_id, versao.arquivo_id, versao.usuario_id,
      versao.numero_versao, versao.dados, versao.origem_versao, versao.created_at, versao.autor_nome
      from public.arquivo_versoes_orbe versao
     where versao.mesa_id = p_mesa_id
       and versao.arquivo_id = p_arquivo_id
     order by versao.numero_versao desc;
end;
$$;

create or replace function public.registrar_versao_arquivo_orbe(
  p_mesa_id uuid,
  p_arquivo_id text,
  p_dados jsonb,
  p_origem_versao integer default null,
  p_autor_nome text default null
)
returns public.arquivo_versoes_orbe
language plpgsql
security definer
set search_path = public, private
as $$
declare
  versao_existente public.arquivo_versoes_orbe;
  versao_criada public.arquivo_versoes_orbe;
  proximo_numero integer;
begin
  if not private.usuario_mestre_mesa_orbe(p_mesa_id) then
    raise exception 'Somente o mestre pode registrar versoes de Arquivos';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_mesa_id::text || ':' || p_arquivo_id, 0));

  select * into versao_existente
    from public.arquivo_versoes_orbe
   where mesa_id = p_mesa_id
     and arquivo_id = p_arquivo_id
     and dados = p_dados
   order by numero_versao desc
   limit 1;

  if versao_existente.id is not null then
    return versao_existente;
  end if;

  select coalesce(max(numero_versao), 0) + 1
    into proximo_numero
    from public.arquivo_versoes_orbe
   where mesa_id = p_mesa_id
     and arquivo_id = p_arquivo_id;

  insert into public.arquivo_versoes_orbe (
    mesa_id, arquivo_id, usuario_id, autor_nome, numero_versao, dados, origem_versao
  ) values (
    p_mesa_id, p_arquivo_id, auth.uid(),
    coalesce(p_autor_nome, (select nome from public.perfis_orbe where id = auth.uid())),
    proximo_numero, p_dados, p_origem_versao
  ) returning * into versao_criada;

  delete from public.arquivo_versoes_orbe
   where mesa_id = p_mesa_id
     and arquivo_id = p_arquivo_id
     and numero_versao <= proximo_numero - 30;

  return versao_criada;
end;
$$;

create or replace function public.restaurar_versao_arquivo_orbe(
  p_mesa_id uuid,
  p_arquivo_id text,
  p_numero_versao integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  sessao_atual jsonb;
  arquivos_atuais jsonb;
  arquivo_restaurado jsonb;
  arquivos_novos jsonb;
  sessao_nova jsonb;
  versao_nova public.arquivo_versoes_orbe;
begin
  if not private.usuario_mestre_mesa_orbe(p_mesa_id) then
    raise exception 'Somente o mestre pode restaurar versoes de Arquivos';
  end if;

  select dados into arquivo_restaurado
    from public.arquivo_versoes_orbe
   where mesa_id = p_mesa_id
     and arquivo_id = p_arquivo_id
     and numero_versao = p_numero_versao;

  if arquivo_restaurado is null then
    raise exception 'Versao de Arquivo nao encontrada';
  end if;

  select coalesce(dados, '{}'::jsonb) into sessao_atual
    from public.sessoes_orbe
   where mesa_id = p_mesa_id;

  arquivos_atuais := coalesce(sessao_atual -> 'arquivos', '[]'::jsonb);
  select coalesce(jsonb_agg(case
    when item ->> 'id' = p_arquivo_id then arquivo_restaurado
    else item
  end), '[]'::jsonb)
    into arquivos_novos
    from jsonb_array_elements(arquivos_atuais) item;

  if not exists (
    select 1 from jsonb_array_elements(arquivos_atuais) item
     where item ->> 'id' = p_arquivo_id
  ) then
    raise exception 'Arquivo nao encontrado na sessao atual';
  end if;

  sessao_nova := jsonb_set(coalesce(sessao_atual, '{}'::jsonb), '{arquivos}', arquivos_novos, true);

  insert into public.sessoes_orbe (mesa_id, dados, updated_at)
  values (p_mesa_id, sessao_nova, now())
  on conflict (mesa_id) do update
    set dados = excluded.dados, updated_at = excluded.updated_at;

  select public.registrar_versao_arquivo_orbe(
    p_mesa_id, p_arquivo_id, arquivo_restaurado, p_numero_versao
  ) into versao_nova;

  return jsonb_build_object(
    'arquivo', arquivo_restaurado,
    'versao', versao_nova.numero_versao,
    'origemVersao', p_numero_versao
  );
end;
$$;

revoke all on function public.listar_versoes_arquivo_orbe(uuid, text) from public, anon;
grant execute on function public.listar_versoes_arquivo_orbe(uuid, text) to authenticated;
revoke all on function public.registrar_versao_arquivo_orbe(uuid, text, jsonb, integer, text) from public, anon;
grant execute on function public.registrar_versao_arquivo_orbe(uuid, text, jsonb, integer, text) to authenticated;
revoke all on function public.restaurar_versao_arquivo_orbe(uuid, text, integer) from public, anon;
grant execute on function public.restaurar_versao_arquivo_orbe(uuid, text, integer) to authenticated;
