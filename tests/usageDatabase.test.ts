import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const db = new PGlite();
const userA = '10000000-0000-4000-8000-000000000001';
const userB = '10000000-0000-4000-8000-000000000002';
const eventId = '20000000-0000-4000-8000-000000000001';
const firstTouch = { capturedAt: '2026-10-05T00:00:00.000Z', source: 'bootcamp', medium: 'community', campaign: 'community_launch', content: 'kakao_notice' };
const event = {
  eventId, occurredAt: '2026-10-05T01:00:00.000Z', sessionId: '30000000-0000-4000-8000-000000000001',
  eventName: 'practice_rated', chapterId: 3, pass: 1, section: 'myStory', practiceMode: 'chunk-recall',
  contentItemId: 'story-1', hintLevel: 1, selfRating: 'effort', appVersion: '0.1.0',
  contentVersion: 'chapters-2026-10-05', eventSchemaVersion: 1,
  writingText: 'must be ignored rather than stored',
};

async function asUser(id: string) {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  await db.exec('set role authenticated');
}

async function record(touch = firstTouch, events = [event]) {
  return (await db.query<{ result: { accepted: number } }>(
    'select public.record_usage_events($1::jsonb,$2::jsonb) as result',
    [JSON.stringify(touch), JSON.stringify(events)],
  )).rows[0].result;
}

beforeAll(async () => {
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth to authenticated;
    insert into auth.users values ('${userA}'),('${userB}');`);
  await db.exec(await readFile(new URL('../supabase/migrations/202610050001_usage_events.sql', import.meta.url), 'utf8'));
});

afterAll(async () => { await db.close(); });

describe('append-only usage event database boundary', () => {
  it('creates a pseudonymous profile, stores only whitelisted event fields and deduplicates retries', async () => {
    await asUser(userA);
    expect(await record()).toEqual({ accepted: 1 });
    expect(await record()).toEqual({ accepted: 0 });
    await db.exec('reset role');
    const profiles = (await db.query<{ user_id: string; analytics_user_id: string; is_test: boolean; utm_source: string }>('select user_id, analytics_user_id, is_test, utm_source from public.analytics_profiles')).rows;
    expect(profiles).toHaveLength(1);
    expect(profiles[0]).toMatchObject({ user_id: userA, is_test: false, utm_source: 'bootcamp' });
    expect(profiles[0].analytics_user_id).not.toBe(userA);
    const stored = (await db.query<Record<string, unknown>>('select * from public.usage_events')).rows[0];
    expect(stored).toMatchObject({ event_id: eventId, event_name: 'practice_rated', content_item_id: 'story-1', self_rating: 'effort' });
    expect(stored).not.toHaveProperty('writing_text');
    expect(stored).not.toHaveProperty('user_id');
  });

  it('keeps the original first touch, supports an operator-controlled test flag and isolates authenticated users', async () => {
    await asUser(userA);
    await record({ ...firstTouch, source: 'later-source' }, [{ ...event, eventId: '20000000-0000-4000-8000-000000000002' }]);
    await db.exec('reset role');
    expect((await db.query<{ utm_source: string }>('select utm_source from public.analytics_profiles where user_id=$1', [userA])).rows[0].utm_source).toBe('bootcamp');
    await db.query('update public.analytics_profiles set is_test=true where user_id=$1', [userA]);
    expect((await db.query<{ is_test: boolean }>('select is_test from public.analytics_profiles where user_id=$1', [userA])).rows[0].is_test).toBe(true);

    await asUser(userB);
    await expect(db.query('select * from public.analytics_profiles')).rejects.toThrow(/permission denied/);
    await expect(db.query('select * from public.usage_events')).rejects.toThrow(/permission denied/);
    expect(await record({ ...firstTouch, source: 'direct-b' }, [{ ...event, eventId: '20000000-0000-4000-8000-000000000003' }])).toEqual({ accepted: 1 });
    await db.exec('reset role');
    expect((await db.query('select * from public.analytics_profiles')).rows).toHaveLength(2);
  });

  it('rejects anonymous and malformed batches without changing stored rows', async () => {
    await db.exec('reset role');
    await db.query("select set_config('request.jwt.claim.sub','',false)");
    await db.exec('set role authenticated');
    await expect(record()).rejects.toThrow(/Authentication required/);
    await asUser(userA);
    await expect(db.query(
      'select public.record_usage_events($1::jsonb,$2::jsonb)',
      [JSON.stringify(firstTouch), null],
    )).rejects.toThrow(/Invalid usage batch/);
    await expect(record(firstTouch, [{ ...event, eventId: 'not-a-uuid' }])).rejects.toThrow(/Invalid usage event/);
    await db.exec('reset role');
    expect((await db.query('select * from public.usage_events')).rows).toHaveLength(3);
  });
});
