import { createHash } from 'node:crypto';
import { MAX_BACKUP_BYTES } from '../src/progressBackup';
import { parseSyncWrite, type SyncResult, type SyncSnapshot, type SyncWrite } from '../src/syncProtocol';

// Only an adapter that verifies the provider session may return this identity.
// Never derive identity from a request body, user-id header, or decoded-only JWT.
export type VerifiedIdentity = { issuer: string; subject: string };
export interface AccountStore {
  read(): Promise<SyncSnapshot>;
  write(request: SyncWrite): Promise<SyncResult>;
}
export type AccountSyncDependencies = {
  origin: string;
  authenticate(request: Request): Promise<VerifiedIdentity | null>;
  storeFor(accountKey: string): AccountStore;
};

export function accountKey(identity: VerifiedIdentity): string {
  if (!identity || typeof identity.issuer !== 'string' || typeof identity.subject !== 'string'
    || !identity.issuer.trim() || !identity.subject.trim()
    || identity.issuer.length > 2048 || identity.subject.length > 512) throw new Error('Invalid verified identity');
  return createHash('sha256').update(JSON.stringify([identity.issuer, identity.subject])).digest('hex');
}
class RequestFailure extends Error { constructor(public status: number) { super('Request rejected'); } }
async function readWrite(request: Request): Promise<SyncWrite> {
  const declared = request.headers.get('content-length');
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > MAX_BACKUP_BYTES)) throw new RequestFailure(413);
  if (!request.body) throw new RequestFailure(400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BACKUP_BYTES) { await reader.cancel(); throw new RequestFailure(413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try {
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const body: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!body || typeof body !== 'object' || Array.isArray(body)
      || Object.keys(body).some(key => !['baseRevision', 'operationId', 'progress'].includes(key))) throw new Error('Unknown field');
    return parseSyncWrite(body);
  } catch { throw new RequestFailure(400); }
}

// Not mounted in production yet: provider authentication and a durable transactional
// repository must be supplied. Fail closed when either fails; never use a guest fallback.
export function createAccountSyncHandler(deps: AccountSyncDependencies) {
  const origin = new URL(deps.origin).origin;
  return async (request: Request): Promise<Response> => {
    const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), {
      status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Cookie, Authorization' },
    });
    if (new URL(request.url).origin !== origin || new URL(request.url).pathname !== '/api/progress' || new URL(request.url).search) return reply(404, { error: 'Not found.' });
    if (!['GET', 'PUT'].includes(request.method)) return reply(405, { error: 'Method not allowed.' });
    const requestOrigin = request.headers.get('origin');
    if ((requestOrigin !== null && requestOrigin !== origin) || request.headers.get('sec-fetch-site') === 'cross-site') return reply(403, { error: 'Request not allowed.' });
    if (request.method === 'PUT' && (requestOrigin !== origin
      || request.headers.get('x-english-output-sync') !== '1'
      || request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json')) return reply(403, { error: 'Request not allowed.' });
    try {
      const identity = await deps.authenticate(request);
      if (!identity) return reply(401, { error: 'Sign in again. Your local record is unchanged.' });
      const key = accountKey(identity);
      if (request.method === 'GET') return reply(200, await deps.storeFor(key).read());
      const write = await readWrite(request);
      const result = await deps.storeFor(key).write(write);
      return reply(result.status === 'conflict' ? 409 : 200, result);
    } catch (error) {
      if (error instanceof RequestFailure) return reply(error.status, { error: 'Invalid progress request.' });
      return reply(503, { error: 'Sync unavailable. Your local record is unchanged.' });
    }
  };
}
