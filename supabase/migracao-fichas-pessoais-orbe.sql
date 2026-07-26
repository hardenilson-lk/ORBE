-- Fluxo de ficha pessoal -> solicitação -> aprovação do mestre.
-- Execute no SQL Editor do Supabase depois de revisar o backup do projeto.

alter table public.fichas_orbe
  add column if not exists owner_id uuid references auth.users(id) on delete cascade,
  add column if not exists mesa_solicitada_id uuid references public.mesas_orbe(id) on delete set null,
  add column if not exists status_migracao text;

alter table public.fichas_orbe
  drop constraint if exists fichas_orbe_status_migracao_check;

alter table public.fichas_orbe
  add constraint fichas_orbe_status_migracao_check
  check (
    status_migracao is null
    or status_migracao in ('pendente', 'recusada', 'aceita')
  );

update public.fichas_orbe as ficha
set owner_id = coalesce(
  ficha.owner_id,
  ficha.responsavel_id,
  mesa.owner_id
)
from public.mesas_orbe as mesa
where mesa.id = ficha.mesa_id
  and ficha.owner_id is null;

alter table public.fichas_orbe
  alter column mesa_id drop not null,
  alter column owner_id set not null;

create index if not exists fichas_orbe_owner_id_idx
on public.fichas_orbe (owner_id);

create index if not exists fichas_orbe_mesa_solicitada_idx
on public.fichas_orbe (mesa_solicitada_id, status_migracao);

create or replace function public.salvar_ficha_pessoal_orbe(
  ficha_id_informada text,
  nome_informado text,
  dados_informados jsonb
)
returns public.fichas_orbe
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  usuario_atual uuid := auth.uid();
  ficha_salva public.fichas_orbe;
begin
  if usuario_atual is null then
    raise exception 'Faça login para salvar sua ficha.' using errcode = '28000';
  end if;

  if nullif(btrim(ficha_id_informada), '') is null then
    raise exception 'A ficha informada é inválida.' using errcode = '22023';
  end if;

  insert into public.fichas_orbe (
    id,
    mesa_id,
    owner_id,
    responsavel_id,
    nome,
    edit_locked,
    dados,
    mesa_solicitada_id,
    status_migracao
  )
  values (
    ficha_id_informada,
    null,
    usuario_atual,
    usuario_atual,
    coalesce(nullif(btrim(nome_informado), ''), 'Agente'),
    false,
    coalesce(dados_informados, '{}'::jsonb),
    null,
    null
  )
  on conflict (id) do update
  set
    nome = excluded.nome,
    dados = excluded.dados,
    updated_at = now()
  where fichas_orbe.owner_id = usuario_atual
    and fichas_orbe.mesa_id is null
    and coalesce(fichas_orbe.status_migracao, '') <> 'pendente'
  returning * into ficha_salva;

  if ficha_salva.id is null then
    raise exception 'A ficha não pode ser alterada enquanto aguarda o mestre ou depois de entrar em uma campanha.'
      using errcode = '42501';
  end if;

  return ficha_salva;
end;
$$;

create or replace function public.solicitar_migracao_ficha_orbe(
  ficha_id_informada text,
  mesa_id_informada uuid
)
returns public.fichas_orbe
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  usuario_atual uuid := auth.uid();
  ficha_solicitada public.fichas_orbe;
begin
  if usuario_atual is null then
    raise exception 'Faça login para solicitar a migração.' using errcode = '28000';
  end if;

  if not private.usuario_participa_mesa_orbe(mesa_id_informada) then
    raise exception 'Entre na mesa antes de solicitar a migração da ficha.'
      using errcode = '42501';
  end if;

  if exists (
    select 1
    from public.fichas_orbe
    where mesa_id = mesa_id_informada
      and responsavel_id = usuario_atual
  ) then
    raise exception 'Você já possui uma ficha atribuída nesta campanha.'
      using errcode = '23505';
  end if;

  update public.fichas_orbe
  set
    mesa_solicitada_id = mesa_id_informada,
    status_migracao = 'pendente',
    updated_at = now()
  where id = ficha_id_informada
    and owner_id = usuario_atual
    and mesa_id is null
    and coalesce(status_migracao, '') <> 'pendente'
  returning * into ficha_solicitada;

  if ficha_solicitada.id is null then
    raise exception 'A ficha não está disponível para migração.'
      using errcode = '42501';
  end if;

  return ficha_solicitada;
end;
$$;

create or replace function public.revisar_migracao_ficha_orbe(
  ficha_id_informada text,
  aceitar boolean
)
returns public.fichas_orbe
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  ficha_solicitada public.fichas_orbe;
begin
  select *
  into ficha_solicitada
  from public.fichas_orbe
  where id = ficha_id_informada
    and status_migracao = 'pendente'
  for update;

  if ficha_solicitada.id is null then
    raise exception 'Solicitação de ficha não encontrada.' using errcode = 'P0002';
  end if;

  if not private.usuario_mestre_mesa_orbe(ficha_solicitada.mesa_solicitada_id) then
    raise exception 'Somente o mestre desta mesa pode revisar a ficha.'
      using errcode = '42501';
  end if;

  if aceitar and exists (
    select 1
    from public.fichas_orbe
    where mesa_id = ficha_solicitada.mesa_solicitada_id
      and responsavel_id = ficha_solicitada.owner_id
      and id <> ficha_solicitada.id
  ) then
    raise exception 'Este jogador já possui uma ficha atribuída nesta campanha.'
      using errcode = '23505';
  end if;

  if aceitar then
    update public.fichas_orbe
    set
      mesa_id = mesa_solicitada_id,
      responsavel_id = owner_id,
      mesa_solicitada_id = null,
      status_migracao = 'aceita',
      edit_locked = true,
      dados = coalesce(dados, '{}'::jsonb) || jsonb_build_object(
        'jogadorId', owner_id,
        'origemFicha', 'pessoal'
      ),
      updated_at = now()
    where id = ficha_solicitada.id
    returning * into ficha_solicitada;
  else
    update public.fichas_orbe
    set
      mesa_solicitada_id = null,
      status_migracao = 'recusada',
      updated_at = now()
    where id = ficha_solicitada.id
    returning * into ficha_solicitada;
  end if;

  return ficha_solicitada;
end;
$$;

drop policy if exists "jogador atualiza ficha liberada"
on public.fichas_orbe;

create policy "jogador atualiza ficha liberada"
on public.fichas_orbe
for update
to authenticated
using (
  mesa_id is not null
  and private.usuario_participa_mesa_orbe(mesa_id)
  and responsavel_id = auth.uid()
  and edit_locked = false
)
with check (
  mesa_id is not null
  and private.usuario_participa_mesa_orbe(mesa_id)
  and responsavel_id = auth.uid()
  and edit_locked = false
);

drop policy if exists "dono le ficha pessoal"
on public.fichas_orbe;
create policy "dono le ficha pessoal"
on public.fichas_orbe
for select
to authenticated
using (
  owner_id = auth.uid()
);

drop policy if exists "mestre le ficha solicitada"
on public.fichas_orbe;
create policy "mestre le ficha solicitada"
on public.fichas_orbe
for select
to authenticated
using (
  mesa_solicitada_id is not null
  and private.usuario_mestre_mesa_orbe(mesa_solicitada_id)
);

drop policy if exists "dono exclui ficha pessoal"
on public.fichas_orbe;
create policy "dono exclui ficha pessoal"
on public.fichas_orbe
for delete
to authenticated
using (
  owner_id = auth.uid()
  and mesa_id is null
  and coalesce(status_migracao, '') <> 'pendente'
);

grant execute on function public.salvar_ficha_pessoal_orbe(text, text, jsonb)
to authenticated;

grant execute on function public.solicitar_migracao_ficha_orbe(text, uuid)
to authenticated;

grant execute on function public.revisar_migracao_ficha_orbe(text, boolean)
to authenticated;

revoke all on function public.salvar_ficha_pessoal_orbe(text, text, jsonb)
from anon;

revoke all on function public.solicitar_migracao_ficha_orbe(text, uuid)
from anon;

revoke all on function public.revisar_migracao_ficha_orbe(text, boolean)
from anon;
