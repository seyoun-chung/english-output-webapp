import { describe, expect, it, vi } from 'vitest';
import { createAccountSyncHandler, accountKey, type AccountStore } from '../server/accountSync';
import { initialAppProgress } from '../src/appProgress';
import { applySyncWrite, emptySync } from '../src/syncProtocol';

const origin = 'https://study.example';
function setup() {
  const records = new Map<string, ReturnType<typeof emptySync>>();
  const storeFor = vi.fn((key: string): AccountStore => ({
    read: async () => (records.get(key) ?? emptySync()).snapshot,
    write: async request => { const next = applySyncWrite(records.get(key) ?? emptySync(), request); records.set(key, next.next); return next.result; },
  }));
  // Test-only authentication stub. Production must use a verified provider session.
  const authenticate = vi.fn(async (r: Request) => {
    const session = r.headers.get('authorization');
    return session === 'test-a' || session === 'test-b' ? { issuer: 'test-provider', subject: session } : null;
  });
  return { records, storeFor, authenticate, handler: createAccountSyncHandler({ origin, authenticate, storeFor }) };
}
function request(session: string, body?: unknown, headers = {}) {
  return new Request(`${origin}/api/progress`, { method: body === undefined ? 'GET' : 'PUT', headers: {
    authorization: session, origin, 'content-type': 'application/json', 'x-english-output-sync': '1', ...headers,
  }, body: body === undefined ? undefined : JSON.stringify(body) });
}
const payload = () => ({ baseRevision: 0, operationId: 'operation-1', progress: initialAppProgress() });
describe('authenticated multi-user sync boundary', () => {
  it('rejects unauthenticated reads and writes without accessing any store', async () => {
    const s = setup();
    expect((await s.handler(request('expired'))).status).toBe(401);
    expect((await s.handler(request('expired', payload()))).status).toBe(401);
    expect(s.storeFor).not.toHaveBeenCalled();
  });
  it('separates two accounts even when they use the same operation ID', async () => {
    const s = setup(), a = payload(), b = payload();
    a.progress.automatic.writingDraft = 'Private A'; b.progress.automatic.writingDraft = 'Private B';
    expect((await s.handler(request('test-a', a))).status).toBe(200);
    expect((await s.handler(request('test-b', b))).status).toBe(200);
    expect((await (await s.handler(request('test-a'))).json()).progress.automatic.writingDraft).toBe('Private A');
    expect((await (await s.handler(request('test-b'))).json()).progress.automatic.writingDraft).toBe('Private B');
    expect(s.records.size).toBe(2);
  });
  it('does not accept client-supplied account identity', async () => {
    const s = setup();
    expect((await s.handler(request('test-a', { ...payload(), userId: 'test-b' }))).status).toBe(400);
    expect(s.storeFor).not.toHaveBeenCalled();
    await s.handler(request('test-a', payload(), { 'x-user-id': 'test-b' }));
    expect((await (await s.handler(request('test-b'))).json()).revision).toBe(0);
  });
  it('rejects foreign origin, missing CSRF header, query targeting and oversized bodies', async () => {
    const s = setup();
    expect((await s.handler(request('test-a', payload(), { origin: 'https://other.example' }))).status).toBe(403);
    expect((await s.handler(request('test-a', payload(), { 'x-english-output-sync': '' }))).status).toBe(403);
    expect((await s.handler(new Request(`${origin}/api/progress?user=test-b`))).status).toBe(404);
    expect((await s.handler(request('test-a', payload(), { 'content-length': '8388609' }))).status).toBe(413);
    expect(s.storeFor).not.toHaveBeenCalled();
  });
  it('returns stale-write conflicts and never caches personal data', async () => {
    const s = setup(); await s.handler(request('test-a', payload()));
    const response = await s.handler(request('test-a', { ...payload(), operationId: 'operation-2' }));
    expect(response.status).toBe(409); expect(response.headers.get('cache-control')).toBe('no-store');
  });
  it('fails closed and does not reveal authentication errors or credentials', async () => {
    const s = setup(); s.authenticate.mockRejectedValue(new Error('sensitive provider details'));
    const response = await s.handler(request('test-a'));
    expect(response.status).toBe(503); expect(await response.text()).not.toContain('sensitive');
    expect(s.storeFor).not.toHaveBeenCalled();
  });
  it('uses issuer and subject, not unsafe filesystem path fragments or email', () => {
    expect(accountKey({ issuer: 'a', subject: '../person' })).toMatch(/^[a-f0-9]{64}$/);
    expect(accountKey({ issuer: 'a', subject: 'same' })).not.toBe(accountKey({ issuer: 'b', subject: 'same' }));
    expect(() => accountKey({ issuer: '', subject: 'a' })).toThrow();
  });
});
