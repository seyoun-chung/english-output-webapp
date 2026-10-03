import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { initialAppProgress } from '../src/appProgress';

const a = '00000000-0000-4000-8000-000000000001', b = '00000000-0000-4000-8000-000000000002';
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid$$;
    grant usage on schema auth to authenticated;
    insert into auth.users values ('${a}'), ('${b}');`);
  await db.exec(await readFile(new URL('../supabase/migrations/202610030001_progress.sql', import.meta.url), 'utf8'));
  await db.exec(await readFile(new URL('../supabase/migrations/202610040001_conditional_read.sql', import.meta.url), 'utf8'));
}, 20000);
afterAll(async () => { await db.close(); });
const asUser = async (id: string) => { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]); await db.exec('set role authenticated'); };
const write = async (revision: number, op: string, text: string) => {
  const p = initialAppProgress(); p.automatic.writingDraft = text;
  return (await db.query<{ result: { status: string; snapshot: { revision: number } } }>('select public.write_learning_progress($1,$2,$3::jsonb) as result', [revision, op, JSON.stringify(p)])).rows[0].result;
};
describe('Supabase migration on local PostgreSQL engine', () => {
  it('returns an empty snapshot before the first save', async () => {
    await asUser(a);
    expect((await db.query<{result:unknown}>('select public.read_learning_progress_since(0) as result')).rows[0].result)
      .toEqual({revision:0,progress:null,updatedAt:null});
  });
  it('isolates reads and history by authenticated user and blocks direct writes', async () => {
    await asUser(a); expect((await write(0, 'database-a', 'A private')).status).toBe('saved');
    await asUser(b); expect((await db.query('select * from public.learning_progress')).rows).toHaveLength(0);
    expect((await db.query('select * from public.learning_progress_history')).rows).toHaveLength(0);
    expect((await write(0, 'database-a', 'B private')).status).toBe('saved');
    expect((await db.query<{user_id:string}>('select user_id from public.learning_progress')).rows.map(r=>r.user_id)).toEqual([b]);
    await expect(db.query("update public.learning_progress set revision=999")).rejects.toThrow(/permission denied/);
    await expect(db.query('delete from public.learning_progress_history')).rejects.toThrow(/permission denied/);
  });
  it('preserves revisions, retries safely and rejects stale writes', async () => {
    await asUser(a);
    expect((await write(0, 'database-a', 'A private')).snapshot.revision).toBe(1);
    expect((await write(0, 'database-stale', 'stale')).status).toBe('conflict');
    await expect(write(1, 'database-a', 'changed payload')).rejects.toThrow(/Operation reused/);
    expect((await write(1, 'database-a2', 'A new')).snapshot.revision).toBe(2);
    expect((await db.query('select * from public.learning_progress_history')).rows).toHaveLength(2);
  });
  it('rejects anonymous access and invalid payloads', async () => {
    await asUser(a);
    await expect(db.query("select public.write_learning_progress(2,'invalid-data','{}'::jsonb)")).rejects.toThrow(/Invalid progress/);
    await asUser(''); await expect(db.query('select public.read_learning_progress()')).rejects.toThrow(/Authentication required/);
    await db.exec('reset role; set role anon');
    await expect(db.query('select public.read_learning_progress()')).rejects.toThrow(/permission denied/);
    await expect(db.query('select * from public.learning_progress')).rejects.toThrow(/permission denied/);
  });
  it('omits unchanged payloads, returns changed records and keeps identity isolation', async () => {
    await asUser(a);
    const read = async (revision: number) => (await db.query<{result:Record<string,unknown>}>(
      'select public.read_learning_progress_since($1) as result', [revision])).rows[0].result;
    expect(await read(2)).toEqual({revision:2,unchanged:true});
    expect((await read(1)).progress).toBeDefined();
    await expect(read(-1)).rejects.toThrow(/Invalid revision/);
    await asUser(b);
    expect(await read(1)).toEqual({revision:1,unchanged:true});
    expect((await read(2)).revision).toBe(1);
    await asUser(''); await expect(read(1)).rejects.toThrow(/Authentication required/);
    await db.exec('reset role; set role anon');
    await expect(read(1)).rejects.toThrow(/permission denied/);
  });
  it('checks 200 isolated accounts and measures unchanged response bytes, not hosted load capacity', async () => {
    let fullBytes = 0, unchangedBytes = 0;
    for (let index = 100; index < 300; index++) {
      const id = `00000000-0000-4000-8000-${String(index).padStart(12,'0')}`;
      await db.exec('reset role');
      await db.query('insert into auth.users values ($1)',[id]);
      await asUser(id);
      await write(0,`capacity-${index}`,`Private fixture ${index}`);
      const full = (await db.query<{result:unknown}>('select public.read_learning_progress() as result')).rows[0].result;
      const small = (await db.query<{result:unknown}>('select public.read_learning_progress_since(1) as result')).rows[0].result;
      expect((await db.query<{user_id:string}>('select user_id from public.learning_progress')).rows).toEqual([{user_id:id}]);
      expect(small).toEqual({revision:1,unchanged:true});
      fullBytes += Buffer.byteLength(JSON.stringify(full));
      unchangedBytes += Buffer.byteLength(JSON.stringify(small));
    }
    expect(unchangedBytes).toBeLessThan(fullBytes / 10);
    console.info(`200 synthetic accounts, one read each: full JSON ${fullBytes} bytes; unchanged JSON ${unchangedBytes} bytes. Excludes HTTP/Auth/compression; not concurrent hosted load.`);
  },20000);
});
