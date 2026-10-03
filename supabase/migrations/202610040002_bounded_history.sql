-- Local implementation only. Hosted application needs separate approval.
-- Keep recent saves plus daily anchors, not an unbounded autosave journal.
-- Current learning_progress, browser recovery copies and exported backups are untouched.
-- Installation alone does not prune existing rows. Each successful future history
-- insert prunes only that user's history inside the same write transaction.
create function public.retain_learning_progress_history() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.learning_progress_history h
  where h.user_id = new.user_id
    and h.revision not in (
      select recent.revision from (
        select revision from public.learning_progress_history
        where user_id = new.user_id order by revision desc limit 3
      ) recent
      union
      select daily.revision from (
        select distinct on ((updated_at at time zone 'UTC')::date)
          revision, (updated_at at time zone 'UTC')::date as saved_day
        from public.learning_progress_history where user_id = new.user_id
        order by (updated_at at time zone 'UTC')::date desc, revision asc
        limit 7
      ) daily
    );
  return new;
end; $$;
revoke all on function public.retain_learning_progress_history() from public, anon, authenticated;
create trigger retain_learning_progress_history
after insert on public.learning_progress_history
for each row execute function public.retain_learning_progress_history();
