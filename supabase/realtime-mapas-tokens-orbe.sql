-- Protecao aditiva para a sessao JSON existente.
-- Executar depois do schema base e dos SQLs de campanha.

create or replace function private.validar_movimento_token_mapa_orbe()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
declare
  mapa_antigo jsonb := coalesce(old.dados -> 'mapa', '{}'::jsonb);
  mapa_novo jsonb := coalesce(new.dados -> 'mapa', '{}'::jsonb);
  token_novo jsonb;
  token_antigo jsonb;
  ficha_id text;
  token_id text;
begin
  if private.usuario_mestre_mesa_orbe(new.mesa_id) then
    return new;
  end if;

  if (mapa_novo - 'tokens') <> (mapa_antigo - 'tokens') then
    raise exception using
      errcode = '42501',
      message = 'Somente o mestre pode alterar a estrutura do mapa.';
  end if;

  if jsonb_array_length(coalesce(mapa_novo -> 'tokens', '[]'::jsonb))
     <> jsonb_array_length(coalesce(mapa_antigo -> 'tokens', '[]'::jsonb)) then
    raise exception using errcode = '42501', message = 'Jogadores nao podem criar ou remover tokens.';
  end if;

  for token_novo in select value from jsonb_array_elements(coalesce(mapa_novo -> 'tokens', '[]'::jsonb)) loop
    token_id := token_novo ->> 'id';
    select value into token_antigo
      from jsonb_array_elements(coalesce(mapa_antigo -> 'tokens', '[]'::jsonb))
      where value ->> 'id' = token_id;

    if token_antigo is null then
      raise exception using errcode = '42501', message = 'Jogadores nao podem criar ou remover tokens.';
    end if;

    if (token_novo - array['x','y','coluna','linha'])
       <> (token_antigo - array['x','y','coluna','linha']) then
      raise exception using errcode = '42501', message = 'Jogadores so podem alterar a posicao de tokens autorizados.';
    end if;

    if token_novo <> token_antigo then
      if coalesce(token_novo ->> 'tipo', '') = 'npc'
         or coalesce((token_novo ->> 'bloqueado')::boolean, false)
         or coalesce((token_novo -> 'permissoes' ->> 'jogadores')::boolean, false) is not true
         or (token_novo ->> 'fichaId') is null
         or (token_novo ->> 'fichaId') = '' then
        raise exception using errcode = '42501', message = 'Este token nao pode ser controlado pelo jogador.';
      end if;

      ficha_id := token_novo ->> 'fichaId';
      if not exists (
        select 1 from public.fichas_orbe ficha
        where ficha.id = ficha_id
          and ficha.mesa_id = new.mesa_id
          and ficha.responsavel_id = auth.uid()
          and ficha.edit_locked = false
      ) then
        raise exception using errcode = '42501', message = 'O jogador nao possui permissao para mover este token.';
      end if;
    end if;
  end loop;

  return new;
end;
$$;

do $$
begin
  if to_regclass('public.sessoes_orbe') is not null then
    drop trigger if exists validar_movimento_token_mapa_orbe on public.sessoes_orbe;
    create trigger validar_movimento_token_mapa_orbe
      before update on public.sessoes_orbe
      for each row execute function private.validar_movimento_token_mapa_orbe();
  end if;
end
$$;
