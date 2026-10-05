import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { initialAppProgress } from '../src/appProgress';
import { supabaseSyncTransport, supabaseUsageTransport } from '../src/supabaseAccount';
import { SyncConflict } from '../src/syncClient';

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), factory: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({ createClient: (...args: unknown[]) => { mocks.factory(...args); return { rpc: mocks.rpc }; } }));
const config = { url: 'https://example.supabase.co', key: 'sb_publishable_localtest' };
const session = (id: string) => ({ error: null, data: { session: { user: { id }, access_token: `test-session-${id}` } } });
const snapshot = () => ({ revision: 1, progress: initialAppProgress(), updatedAt: new Date().toISOString() });
beforeEach(() => vi.clearAllMocks());
describe('Supabase sync transport account binding', () => {
  it('reuses only a validated private snapshot on unchanged responses and downloads newer records', async () => {
    const client = { auth: { getSession: vi.fn().mockResolvedValue(session('a')) } } as unknown as SupabaseClient;
    const transport = supabaseSyncTransport(client,config,'a'), data = snapshot();
    mocks.rpc.mockResolvedValueOnce({data,error:null});
    const first = await transport.read(); first.progress!.automatic.writingDraft = 'local mutation';
    mocks.rpc.mockResolvedValueOnce({data:{revision:1,unchanged:true},error:null});
    expect((await transport.read()).progress!.automatic.writingDraft).toBe('');
    expect(mocks.rpc).toHaveBeenLastCalledWith('read_learning_progress_since',{known_revision:1});
    mocks.rpc.mockResolvedValueOnce({data:{...data,revision:2},error:null});
    expect((await transport.read()).revision).toBe(2);
    mocks.rpc.mockResolvedValueOnce({data:{revision:1,unchanged:true},error:null});
    await expect(transport.read()).rejects.toThrow(/Invalid sync revision/);
  });
  it('rejects unchanged markers without a cache and does not share caches between accounts', async () => {
    const client = { auth: { getSession: vi.fn().mockResolvedValue(session('a')) } } as unknown as SupabaseClient;
    mocks.rpc.mockResolvedValue({data:{revision:1,unchanged:true},error:null});
    await expect(supabaseSyncTransport(client,config,'a').read()).rejects.toThrow(/Invalid sync revision/);
    expect(mocks.rpc).toHaveBeenLastCalledWith('read_learning_progress',undefined);
  });
  it('refuses a request after account switch without calling the RPC', async () => {
    const client = { auth: { getSession: vi.fn().mockResolvedValue(session('b')) } } as unknown as SupabaseClient;
    await expect(supabaseSyncTransport(client, config, 'a').read()).rejects.toThrow(/Account changed/);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it('discards an in-flight response when the user signs out or switches', async () => {
    const getSession = vi.fn().mockResolvedValueOnce(session('a')).mockResolvedValueOnce(session('b'));
    mocks.rpc.mockResolvedValue({ data: snapshot(), error: null });
    const client = { auth: { getSession } } as unknown as SupabaseClient;
    await expect(supabaseSyncTransport(client, config, 'a').read()).rejects.toThrow(/Account changed/);
    expect(await mocks.factory.mock.calls[0][2].accessToken()).toBe('test-session-a');
  });
  it('accepts reordered JSONB fields and distinguishes conflicts from successful writes', async () => {
    const client = { auth: { getSession: vi.fn().mockResolvedValue(session('a')) } } as unknown as SupabaseClient;
    const transport = supabaseSyncTransport(client,config,'a'), data = snapshot();
    data.progress = Object.fromEntries(Object.entries(data.progress).reverse()) as typeof data.progress;
    mocks.rpc.mockResolvedValue({ data: {status:'saved',snapshot:data},error:null });
    const request = {baseRevision:0,operationId:'test-operation',progress:initialAppProgress()};
    expect((await transport.write(request)).revision).toBe(1);
    mocks.rpc.mockResolvedValue({ data: {status:'conflict',snapshot:data},error:null });
    await expect(transport.write(request)).rejects.toBeInstanceOf(SyncConflict);
  });
  it('rejects malformed server data and does not expose provider errors', async () => {
    const client = { auth: { getSession: vi.fn().mockResolvedValue(session('a')) } } as unknown as SupabaseClient;
    const transport = supabaseSyncTransport(client,config,'a');
    mocks.rpc.mockResolvedValue({data:{},error:null}); await expect(transport.read()).rejects.toThrow();
    mocks.rpc.mockResolvedValue({data:null,error:{message:'private database details'}});
    await expect(transport.read()).rejects.toThrow('Sync unavailable. Your local record is safe. Try again after signing in.');
  });
  it('binds usage batches to the captured account token and sends only the reviewed RPC payload', async () => {
    const client = { auth: { getSession: vi.fn().mockResolvedValue(session('a')) } } as unknown as SupabaseClient;
    const transport = supabaseUsageTransport(client, config, 'a');
    mocks.rpc.mockResolvedValue({ data: { accepted: 1 }, error: null });
    const firstTouch = { capturedAt: '2026-10-05T00:00:00.000Z', source: 'bootcamp', medium: 'community', campaign: 'launch', content: 'notice' };
    const events = [{ eventId: '20000000-0000-4000-8000-000000000001', occurredAt: '2026-10-05T01:00:00.000Z', sessionId: '30000000-0000-4000-8000-000000000001', eventName: 'app_open' as const, appVersion: '0.1.0', contentVersion: 'chapters-2026-10-05', eventSchemaVersion: 1 as const }];
    await transport.write(firstTouch, events);
    expect(mocks.rpc).toHaveBeenCalledWith('record_usage_events', { first_touch: firstTouch, events });
    expect(await mocks.factory.mock.calls[0][2].accessToken()).toBe('test-session-a');
  });
  it('retains a usage batch for retry when identity changes or the RPC fails', async () => {
    const switched = { auth: { getSession: vi.fn().mockResolvedValueOnce(session('a')).mockResolvedValueOnce(session('b')) } } as unknown as SupabaseClient;
    mocks.rpc.mockResolvedValue({ data: null, error: null });
    await expect(supabaseUsageTransport(switched, config, 'a').write(
      { capturedAt: '2026-10-05T00:00:00.000Z', source: null, medium: null, campaign: null, content: null },
      [{ eventId: '20000000-0000-4000-8000-000000000001', occurredAt: '2026-10-05T01:00:00.000Z', sessionId: '30000000-0000-4000-8000-000000000001', eventName: 'app_open', appVersion: '0.1.0', contentVersion: 'chapters-2026-10-05', eventSchemaVersion: 1 }],
    )).rejects.toThrow(/Account changed/);
  });
});
