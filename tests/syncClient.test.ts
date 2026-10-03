import { describe, expect, it } from 'vitest';
import { initialAppProgress } from '../src/appProgress';
import { SyncConflict, SyncSession, type SyncTransport } from '../src/syncClient';
import { applySyncWrite, emptySync } from '../src/syncProtocol';

const app = (text: string) => { const state = initialAppProgress(); state.automatic.writingDraft = text; return state; };
function service() {
  let data = emptySync();
  const transport: SyncTransport = {
    read: async () => structuredClone(data.snapshot),
    write: async request => {
      const result = applySyncWrite(data, request); data = result.next;
      if (result.result.status === 'conflict') throw new SyncConflict(data.snapshot);
      return structuredClone(data.snapshot);
    },
  };
  return transport;
}
describe('two-device sync session', () => {
  it('requires a choice on first connection then transfers subsequent changes', async () => {
    const transport = service(), a = new SyncSession(transport), b = new SyncSession(transport);
    await a.check(app('one'));
    await expect(b.check(app('empty'))).rejects.toBeInstanceOf(SyncConflict);
    b.accept(await transport.read());
    await a.check(app('two'));
    const download = await b.check(app('one'));
    expect(download.action).toBe('download');
    expect(download.snapshot.progress?.automatic.writingDraft).toBe('two');
    b.accept(download.snapshot);
    await b.check(app('three'));
    expect((await a.check(app('two'))).action).toBe('download');
  });
  it('preserves both offline edits and rejects a stale conflict choice', async () => {
    const transport = service(), a = new SyncSession(transport), b = new SyncSession(transport);
    await a.check(app('base')); await b.check(app('base'));
    await a.check(app('from a'));
    await expect(b.check(app('from b'))).rejects.toBeInstanceOf(SyncConflict);
    const old = await transport.read();
    await a.check(app('newer a'));
    await expect(b.chooseLocal(app('from b'), old)).rejects.toBeInstanceOf(SyncConflict);
    expect((await transport.read()).progress?.automatic.writingDraft).toBe('newer a');
  });
  it('does not advance the baseline when a write fails', async () => {
    const transport = service(); let offline = false;
    const session = new SyncSession({ read: transport.read, write: async r => { if (offline) throw new Error('offline'); return transport.write(r); } });
    await session.check(app('base')); offline = true;
    await expect(session.check(app('edit'))).rejects.toThrow('offline');
    offline = false;
    await session.check(app('edit'));
    expect((await transport.read()).progress?.automatic.writingDraft).toBe('edit');
  });
});
