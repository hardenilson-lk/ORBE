create extension if not exists "pgcrypto";

create table if not exists public.perfis_orbe (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  usuario text unique not null,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.mesas_orbe (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  codigo_convite text unique not null,
  sistema text not null default 'arquivos',
  dados jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.mesa_membros_orbe (
  mesa_id uuid references public.mesas_orbe(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  papel text not null default 'jogador' check (papel in ('mestre','jogador')),
  status text not null default 'ativo',
  created_at timestamptz default now(),
  primary key (mesa_id, user_id)
);

create table if not exists public.fichas_orbe (
  id text primary key,
  mesa_id uuid not null references public.mesas_orbe(id) on delete cascade,
  responsavel_id uuid references auth.users(id) on delete set null,
  nome text not null,
  edit_locked boolean not null default true,
  dados jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.sessoes_orbe (
  mesa_id uuid primary key references public.mesas_orbe(id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.segredos_mestre_orbe (
  mesa_id uuid primary key references public.mesas_orbe(id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create or replace function public.criar_perfil_orbe()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis_orbe(id,nome,usuario,email)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'usuario', split_part(new.email,'@',1) || '_' || left(new.id::text,6)),
    new.email
  ) on conflict(id) do nothing;
  return new;
end;
$$;

drop trigger if exists criar_perfil_orbe on auth.users;
create trigger criar_perfil_orbe after insert on auth.users for each row execute function public.criar_perfil_orbe();

create or replace function public.usuario_participa_mesa_orbe(mesa uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.mesa_membros_orbe m where m.mesa_id = mesa and m.user_id = auth.uid() and m.status = 'ativo')
  or exists(select 1 from public.mesas_orbe t where t.id = mesa and t.owner_id = auth.uid());
$$;

create or replace function public.usuario_mestre_mesa_orbe(mesa uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.mesas_orbe t where t.id = mesa and t.owner_id = auth.uid())
  or exists(select 1 from public.mesa_membros_orbe m where m.mesa_id = mesa and m.user_id = auth.uid() and m.papel = 'mestre' and m.status = 'ativo');
$$;

create or replace function public.entrar_mesa_orbe(codigo_informado text)
returns uuid language plpgsql security definer set search_path = public as $$
declare mesa_encontrada uuid;
begin
  if auth.uid() is null then raise exception 'Faça login antes de entrar na mesa.'; end if;
  select id into mesa_encontrada from public.mesas_orbe where upper(codigo_convite) = upper(trim(codigo_informado));
  if mesa_encontrada is null then raise exception 'Código de convite não encontrado.'; end if;
  insert into public.mesa_membros_orbe(mesa_id,user_id,papel,status) values(mesa_encontrada,auth.uid(),'jogador','ativo')
  on conflict(mesa_id,user_id) do update set status='ativo';
  return mesa_encontrada;
end;
$$;

create or replace function public.registrar_mestre_mesa_orbe()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.mesa_membros_orbe(mesa_id,user_id,papel,status) values(new.id,new.owner_id,'mestre','ativo')
  on conflict(mesa_id,user_id) do update set papel='mestre',status='ativo';
  return new;
end;
$$;

drop trigger if exists registrar_mestre_mesa_orbe on public.mesas_orbe;
create trigger registrar_mestre_mesa_orbe after insert on public.mesas_orbe for each row execute function public.registrar_mestre_mesa_orbe();

alter table public.perfis_orbe enable row level security;
alter table public.mesas_orbe enable row level security;
alter table public.mesa_membros_orbe enable row level security;
alter table public.fichas_orbe enable row level security;
alter table public.sessoes_orbe enable row level security;
alter table public.segredos_mestre_orbe enable row level security;

create policy "perfil autenticado pode ler" on public.perfis_orbe for select to authenticated using (true);
create policy "usuario cria proprio perfil" on public.perfis_orbe for insert to authenticated with check (id = auth.uid());
create policy "usuario atualiza proprio perfil" on public.perfis_orbe for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "membro le mesa" on public.mesas_orbe for select to authenticated using (public.usuario_participa_mesa_orbe(id));
create policy "usuario cria mesa" on public.mesas_orbe for insert to authenticated with check (owner_id = auth.uid());
create policy "mestre atualiza mesa" on public.mesas_orbe for update to authenticated using (public.usuario_mestre_mesa_orbe(id)) with check (public.usuario_mestre_mesa_orbe(id));
create policy "dono exclui mesa" on public.mesas_orbe for delete to authenticated using (owner_id = auth.uid());

create policy "membro le participantes" on public.mesa_membros_orbe for select to authenticated using (public.usuario_participa_mesa_orbe(mesa_id));
create policy "mestre administra participantes" on public.mesa_membros_orbe for all to authenticated using (public.usuario_mestre_mesa_orbe(mesa_id)) with check (public.usuario_mestre_mesa_orbe(mesa_id));

create policy "membro le fichas permitidas" on public.fichas_orbe for select to authenticated using (public.usuario_mestre_mesa_orbe(mesa_id) or responsavel_id = auth.uid());
create policy "mestre cria ficha" on public.fichas_orbe for insert to authenticated with check (public.usuario_mestre_mesa_orbe(mesa_id));
create policy "mestre atualiza ficha" on public.fichas_orbe for update to authenticated using (public.usuario_mestre_mesa_orbe(mesa_id)) with check (public.usuario_mestre_mesa_orbe(mesa_id));
create policy "jogador atualiza ficha liberada" on public.fichas_orbe for update to authenticated using (responsavel_id = auth.uid() and edit_locked = false) with check (responsavel_id = auth.uid() and edit_locked = false);
create policy "mestre exclui ficha" on public.fichas_orbe for delete to authenticated using (public.usuario_mestre_mesa_orbe(mesa_id));

create policy "membro le sessao publica" on public.sessoes_orbe for select to authenticated using (public.usuario_participa_mesa_orbe(mesa_id));
create policy "membro grava sessao publica" on public.sessoes_orbe for insert to authenticated with check (public.usuario_participa_mesa_orbe(mesa_id));
create policy "membro atualiza sessao publica" on public.sessoes_orbe for update to authenticated using (public.usuario_participa_mesa_orbe(mesa_id)) with check (public.usuario_participa_mesa_orbe(mesa_id));

create policy "mestre le segredos" on public.segredos_mestre_orbe for select to authenticated using (public.usuario_mestre_mesa_orbe(mesa_id));
create policy "mestre cria segredos" on public.segredos_mestre_orbe for insert to authenticated with check (public.usuario_mestre_mesa_orbe(mesa_id));
create policy "mestre atualiza segredos" on public.segredos_mestre_orbe for update to authenticated using (public.usuario_mestre_mesa_orbe(mesa_id)) with check (public.usuario_mestre_mesa_orbe(mesa_id));

grant execute on function public.entrar_mesa_orbe(text) to authenticated;
