-- Local-reviewed migration. Apply to a hosted project only after separate approval.
create table public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 0 check (revision between 0 and 9007199254740991),
  progress jsonb,
  updated_at timestamptz,
  operation_id text
);
create table public.learning_progress_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  revision bigint not null,
  progress jsonb not null,
  updated_at timestamptz not null,
  primary key (user_id, revision)
);
alter table public.learning_progress enable row level security;
alter table public.learning_progress_history enable row level security;
revoke all on public.learning_progress, public.learning_progress_history from public, anon, authenticated;
grant select on public.learning_progress, public.learning_progress_history to authenticated;
create policy own_progress on public.learning_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy own_history on public.learning_progress_history for select to authenticated using ((select auth.uid()) = user_id);

create function public.read_learning_progress() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare person uuid := auth.uid(); row public.learning_progress%rowtype;
begin
  if person is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  select * into row from public.learning_progress where user_id = person;
  if not found then return jsonb_build_object('revision', 0, 'progress', null, 'updatedAt', null); end if;
  return jsonb_build_object('revision', row.revision, 'progress', row.progress, 'updatedAt', row.updated_at);
end; $$;

create function public.write_learning_progress(base_revision bigint, operation_id text, payload jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare person uuid := auth.uid(); row public.learning_progress%rowtype; snapshot jsonb;
begin
  if person is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if base_revision is null or base_revision < 0 or base_revision > 9007199254740990
    or operation_id is null or operation_id !~ '^[a-zA-Z0-9-]{8,80}$'
    or payload is null or jsonb_typeof(payload) <> 'object'
    or payload->'version' is distinct from '6'::jsonb
    or jsonb_typeof(payload->'chapters') is distinct from 'object'
    or jsonb_typeof(payload->'automatic') is distinct from 'object'
    or octet_length(payload::text) > 8388608 then
    raise exception 'Invalid progress' using errcode = '22023';
  end if;
  insert into public.learning_progress(user_id) values(person) on conflict (user_id) do nothing;
  select * into row from public.learning_progress where user_id = person for update;
  snapshot := jsonb_build_object('revision', row.revision, 'progress', row.progress, 'updatedAt', row.updated_at);
  if row.operation_id = write_learning_progress.operation_id then
    if row.progress is distinct from payload then raise exception 'Operation reused' using errcode = '22023'; end if;
    return jsonb_build_object('status', 'saved', 'snapshot', snapshot);
  end if;
  if row.revision <> base_revision then return jsonb_build_object('status', 'conflict', 'snapshot', snapshot); end if;
  update public.learning_progress set revision = row.revision + 1, progress = payload,
    updated_at = clock_timestamp(), operation_id = write_learning_progress.operation_id
    where user_id = person returning * into row;
  insert into public.learning_progress_history values(person, row.revision, row.progress, row.updated_at);
  snapshot := jsonb_build_object('revision', row.revision, 'progress', row.progress, 'updatedAt', row.updated_at);
  return jsonb_build_object('status', 'saved', 'snapshot', snapshot);
end; $$;
revoke all on function public.read_learning_progress() from public, anon;
revoke all on function public.write_learning_progress(bigint, text, jsonb) from public, anon;
grant execute on function public.read_learning_progress() to authenticated;
grant execute on function public.write_learning_progress(bigint, text, jsonb) to authenticated;
