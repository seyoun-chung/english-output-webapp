import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { initialAppProgress } from '../src/appProgress';

const a = '00000000-0000-4000-8000-000000000001';
const b = '00000000-0000-4000-8000-000000000002';
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth to authenticated;
    insert into auth.users values ('${a}'),('${b}');`);
  await db.exec(await readFile(new URL('../supabase/migrations/202610030001_progress.sql', import.meta.url), 'utf8'));
  // Legacy rows must not disappear merely by installing the new migration.
  await db.query(`insert into public.learning_progress_history
    select $1::uuid,n,'{}'::jsonb,'2026-01-01'::timestamptz + n*interval '1 second'
    from generate_series(1,20) n`, [b]);
  await db.exec(await readFile(new URL('../supabase/migrations/202610040002_bounded_history.sql', import.meta.url), 'utf8'));
}, 20000);
afterAll(async () => { await db.close(); });
const rows = async (id: string) => (await db.query<{revision:number}>(
  'select revision from public.learning_progress_history where user_id=$1 order by revision', [id])).rows.map(r=>r.revision);

it('does not delete legacy records on installation', async () => {
  expect(await rows(b)).toHaveLength(20);
});

it('keeps daily first-save anchors through frequent autosaves and bounds only the writing user', async () => {
  // Synthetic data only; simulate ten active UTC days and 100 saves per day.
  for (let day=0; day<10; day++) {
    for (let save=1; save<=100; save++) {
      const revision = day*100+save;
      await db.query(`insert into public.learning_progress_history values
        ($1,$2,$3::jsonb,'2026-01-01'::timestamptz + $4::int*interval '1 day' + $5::int*interval '1 second')`,
        [a,revision,JSON.stringify({fixture:revision}),day,save]);
    }
  }
  expect(await rows(a)).toEqual([301,401,501,601,701,801,901,998,999,1000]);
  expect(await rows(b)).toHaveLength(20);
}, 20000);

it('rolls back pruning with its transaction', async () => {
  const before = await rows(a);
  await db.exec('begin');
  await db.query("insert into public.learning_progress_history values ($1,1001,'{}','2026-02-01')",[a]);
  await db.exec('rollback');
  expect(await rows(a)).toEqual(before);
});

it('uses UTC dates even when the database session uses a different time zone', async () => {
  const c = '00000000-0000-4000-8000-000000000003';
  await db.exec('begin');
  try {
    await db.exec("set local timezone='Asia/Seoul'");
    await db.query('insert into auth.users values ($1)', [c]);
    await db.query("insert into public.learning_progress_history values ($1,1,'{}','2026-01-01T23:59:00Z')",[c]);
    for (let revision=2;revision<=6;revision++) {
      await db.query(`insert into public.learning_progress_history values
        ($1,$2::bigint,'{}','2026-01-02T00:00:00Z'::timestamptz + $2::bigint*interval '1 minute')`,[c,revision]);
    }
    expect(await rows(c)).toEqual([1,2,4,5,6]);
  } finally { await db.exec('rollback'); }
});

it('keeps current progress, retries and conflicts intact, with RLS still protecting history', async () => {
  await db.exec('truncate public.learning_progress_history'); // isolated in-memory test DB only
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[a]);
  await db.exec('set role authenticated');
  const progress = initialAppProgress(); progress.automatic.writingDraft = 'Preserve this draft';
  for (let n=0;n<20;n++) {
    await db.query('select public.write_learning_progress($1,$2,$3::jsonb)',[n,`retention-${n}`,JSON.stringify(progress)]);
  }
  expect(await rows(a)).toEqual([1,18,19,20]);
  const current = async () => (await db.query<{result:{revision:number;progress:unknown}}>(
    'select public.read_learning_progress() as result')).rows[0].result;
  expect(await current()).toMatchObject({revision:20,progress});
  await db.query('select public.write_learning_progress(19,$1,$2::jsonb)',['retention-19',JSON.stringify(progress)]);
  expect((await current()).revision).toBe(20);
  const conflict = await db.query<{result:{status:string}}>('select public.write_learning_progress(0,$1,$2::jsonb) as result',
    ['stale-retention',JSON.stringify(progress)]);
  expect(conflict.rows[0].result.status).toBe('conflict');
  expect(await rows(a)).toEqual([1,18,19,20]);
  await expect(db.exec('delete from public.learning_progress_history')).rejects.toThrow(/permission denied/);
  await expect(db.exec('select public.retain_learning_progress_history()')).rejects.toThrow(/permission denied/);
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[b]);
  await db.exec('set role authenticated');
  expect(await rows(a)).toEqual([]);
});
