-- Local-only until explicit hosted migration approval. No records are removed.
create function public.read_learning_progress_since(known_revision bigint) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare person uuid := auth.uid(); row public.learning_progress%rowtype;
begin
  if person is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if known_revision is null or known_revision < 0 or known_revision > 9007199254740991 then
    raise exception 'Invalid revision' using errcode = '22023';
  end if;
  -- One snapshot avoids a revision/progress race between separate queries.
  select * into row from public.learning_progress where user_id = person;
  if not found then return jsonb_build_object('revision', 0, 'progress', null, 'updatedAt', null); end if;
  if row.revision = known_revision then
    return jsonb_build_object('revision', row.revision, 'unchanged', true);
  end if;
  return jsonb_build_object('revision', row.revision, 'progress', row.progress, 'updatedAt', row.updated_at);
end; $$;
revoke all on function public.read_learning_progress_since(bigint) from public, anon;
grant execute on function public.read_learning_progress_since(bigint) to authenticated;
