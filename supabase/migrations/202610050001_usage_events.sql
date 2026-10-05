-- Local-reviewed migration. Applying it to the hosted Seoul project requires
-- separate approval. Learning progress, recovery history and recordings are untouched.
create table public.analytics_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  analytics_user_id uuid not null unique default gen_random_uuid(),
  is_test boolean not null default false,
  first_seen_at timestamptz not null,
  last_seen_at timestamptz not null,
  first_touch_at timestamptz not null,
  utm_source text check (utm_source is null or char_length(utm_source) <= 128),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 128),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 128),
  utm_content text check (utm_content is null or char_length(utm_content) <= 128)
);

create table public.usage_events (
  event_id uuid primary key,
  analytics_user_id uuid not null references public.analytics_profiles(analytics_user_id) on delete cascade,
  occurred_at timestamptz not null,
  received_at timestamptz not null default clock_timestamp(),
  session_id uuid not null,
  event_name text not null check (event_name in (
    'app_open', 'learning_started', 'practice_rated', 'section_completed',
    'chapter_completed', 'review_completed'
  )),
  chapter_id smallint check (chapter_id is null or chapter_id between 1 and 12),
  pass smallint check (pass is null or pass between 1 and 4),
  section text check (section is null or char_length(section) between 1 and 40),
  practice_mode text check (practice_mode is null or char_length(practice_mode) between 1 and 40),
  content_item_id text check (content_item_id is null or char_length(content_item_id) between 1 and 100),
  hint_level smallint check (hint_level is null or hint_level between 0 and 2),
  self_rating text check (self_rating is null or self_rating in ('immediate', 'effort', 'review')),
  app_version text not null check (char_length(app_version) between 1 and 32),
  content_version text not null check (char_length(content_version) between 1 and 64),
  event_schema_version smallint not null check (event_schema_version = 1)
);

create index usage_events_user_time on public.usage_events(analytics_user_id, occurred_at desc);
create index usage_events_name_time on public.usage_events(event_name, occurred_at desc);

alter table public.analytics_profiles enable row level security;
alter table public.usage_events enable row level security;
revoke all on public.analytics_profiles, public.usage_events from public, anon, authenticated;

create function public.record_usage_events(first_touch jsonb, events jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  person uuid := auth.uid();
  profile_id uuid;
  accepted integer := 0;
begin
  if person is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if first_touch is null or jsonb_typeof(first_touch) <> 'object'
    or first_touch->>'capturedAt' is null
    or events is null or jsonb_typeof(events) <> 'array'
    or jsonb_array_length(events) < 1 or jsonb_array_length(events) > 50
    or octet_length(events::text) > 131072 then
    raise exception 'Invalid usage batch' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_array_elements(events) event
    where jsonb_typeof(event) <> 'object'
      or event->>'eventId' is null or event->>'sessionId' is null or event->>'occurredAt' is null
      or event->>'eventName' not in ('app_open', 'learning_started', 'practice_rated', 'section_completed', 'chapter_completed', 'review_completed')
      or event->>'appVersion' is null or char_length(event->>'appVersion') not between 1 and 32
      or event->>'contentVersion' is null or char_length(event->>'contentVersion') not between 1 and 64
      or event->>'eventSchemaVersion' <> '1'
      or (event->>'section' is not null and char_length(event->>'section') not between 1 and 40)
      or (event->>'practiceMode' is not null and char_length(event->>'practiceMode') not between 1 and 40)
      or (event->>'contentItemId' is not null and char_length(event->>'contentItemId') not between 1 and 100)
      or (event->>'selfRating' is not null and event->>'selfRating' not in ('immediate', 'effort', 'review'))
  ) then raise exception 'Invalid usage event' using errcode = '22023'; end if;

  insert into public.analytics_profiles(
    user_id, first_seen_at, last_seen_at, first_touch_at,
    utm_source, utm_medium, utm_campaign, utm_content
  ) values (
    person, clock_timestamp(), clock_timestamp(), (first_touch->>'capturedAt')::timestamptz,
    nullif(first_touch->>'source', ''), nullif(first_touch->>'medium', ''),
    nullif(first_touch->>'campaign', ''), nullif(first_touch->>'content', '')
  ) on conflict (user_id) do update set last_seen_at = excluded.last_seen_at
  returning analytics_user_id into profile_id;

  insert into public.usage_events(
    event_id, analytics_user_id, occurred_at, session_id, event_name,
    chapter_id, pass, section, practice_mode, content_item_id,
    hint_level, self_rating, app_version, content_version, event_schema_version
  )
  select
    (event->>'eventId')::uuid, profile_id, (event->>'occurredAt')::timestamptz,
    (event->>'sessionId')::uuid, event->>'eventName',
    nullif(event->>'chapterId', '')::smallint, nullif(event->>'pass', '')::smallint,
    nullif(event->>'section', ''), nullif(event->>'practiceMode', ''), nullif(event->>'contentItemId', ''),
    nullif(event->>'hintLevel', '')::smallint, nullif(event->>'selfRating', ''),
    event->>'appVersion', event->>'contentVersion', (event->>'eventSchemaVersion')::smallint
  from jsonb_array_elements(events) event
  on conflict (event_id) do nothing;
  get diagnostics accepted = row_count;
  return jsonb_build_object('accepted', accepted);
exception
  when invalid_text_representation or datetime_field_overflow or numeric_value_out_of_range then
    raise exception 'Invalid usage event' using errcode = '22023';
end; $$;

revoke all on function public.record_usage_events(jsonb, jsonb) from public, anon;
grant execute on function public.record_usage_events(jsonb, jsonb) to authenticated;
