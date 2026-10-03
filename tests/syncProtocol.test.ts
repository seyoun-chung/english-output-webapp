import { describe, expect, it } from 'vitest';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { initialAppProgress } from '../src/appProgress';
import { applySyncWrite, decideSync, emptySync, parseSyncSnapshot } from '../src/syncProtocol';
import { LocalSyncStore } from '../server/localSyncStore';

const app = (text: string) => { const state = initialAppProgress(); state.automatic.writingDraft = text; return state; };
describe('sync safety', () => {
  it('never guesses a winner on first connection to existing remote data', () => {
    expect(decideSync(app('local'), null, app('remote'))).toBe('conflict');
    expect(decideSync(app('local'), null, null)).toBe('upload');
  });
  it('uses a common baseline to choose safe directions and preserves conflicts', () => {
    expect(decideSync(app('a'), app('a'), app('b'))).toBe('download');
    expect(decideSync(app('b'), app('a'), app('a'))).toBe('upload');
    expect(decideSync(app('b'), app('a'), app('c'))).toBe('conflict');
    expect(decideSync(app('a'), app('a'), null)).toBe('conflict');
    expect(decideSync(app('a'), null, app('a'))).toBe('same');
  });
  it('rejects stale revisions and retries an identical operation idempotently', () => {
    const write = { baseRevision: 0, operationId: 'operation-1', progress: app('one') };
    const first = applySyncWrite(emptySync(), write);
    expect(first.next.snapshot.revision).toBe(1);
    expect(applySyncWrite(first.next, write).next).toBe(first.next);
    expect(applySyncWrite(first.next, { ...write, operationId: 'operation-2' }).result.status).toBe('conflict');
    expect(() => applySyncWrite(first.next, { ...write, progress: app('different') })).toThrow(/reused/);
  });
  it('rejects malformed remote records', () => {
    expect(() => parseSyncSnapshot({ revision: 5, progress: {}, updatedAt: new Date().toISOString() })).toThrow();
    expect(() => parseSyncSnapshot({ revision: -1 })).toThrow();
  });
  it('serializes concurrent writes, survives reload and retains every prior revision', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'english-output-sync-test-'));
    try {
      const store = new LocalSyncStore(directory);
      const results = await Promise.all(['one', 'two'].map((value, i) => store.write({ baseRevision: 0, operationId: `operation-${i}`, progress: app(value) })));
      expect(results.map(r => r.status).sort()).toEqual(['conflict', 'saved']);
      const restored = new LocalSyncStore(directory);
      expect((await restored.read()).progress?.automatic.writingDraft).toBe('one');
      await restored.write({ baseRevision: 1, operationId: 'operation-3', progress: app('three') });
      const files = (await readdir(directory)).filter(f => f.startsWith('revision-')).sort();
      expect(files).toHaveLength(2);
      expect(JSON.parse(await readFile(join(directory, files[0]), 'utf8')).snapshot.progress.automatic.writingDraft).toBe('one');
    } finally {
      if (dirname(resolve(directory)) !== resolve(tmpdir()) || !basename(directory).startsWith('english-output-sync-test-')) throw new Error('Unsafe cleanup target');
      await rm(directory, { recursive: true });
    }
  });
  it('never overwrites a revision when independent store instances race', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'english-output-sync-test-'));
    try {
      const results = await Promise.all(Array.from({ length: 8 }, (_, i) => new LocalSyncStore(directory).write({ baseRevision: 0, operationId: `parallel-${i}`, progress: app(String(i)) })));
      expect(results.filter(r => r.status === 'saved')).toHaveLength(1);
      expect(results.filter(r => r.status === 'conflict')).toHaveLength(7);
      expect(await readdir(directory)).toHaveLength(1);
    } finally {
      if (dirname(resolve(directory)) !== resolve(tmpdir()) || !basename(directory).startsWith('english-output-sync-test-')) throw new Error('Unsafe cleanup target');
      await rm(directory, { recursive: true });
    }
  });
});
