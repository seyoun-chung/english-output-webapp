import type { AppProgress } from './appProgress';
import { sameProgress, validateCurrentProgress } from './progressBackup';

export type SyncSnapshot = { revision: number; progress: AppProgress | null; updatedAt: string | null };
export type SyncWrite = { baseRevision: number; operationId: string; progress: AppProgress };
export type SyncResult = { status: 'saved' | 'conflict'; snapshot: SyncSnapshot };
export type StoredSync = { snapshot: SyncSnapshot; lastOperationId: string | null; lastOperationPayload: string | null };
export const emptySync = (): StoredSync => ({ snapshot: { revision: 0, progress: null, updatedAt: null }, lastOperationId: null, lastOperationPayload: null });

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
export function parseSyncSnapshot(value: unknown): SyncSnapshot {
  if (!record(value) || !Number.isSafeInteger(value.revision) || (value.revision as number) < 0) throw new Error('Invalid sync revision.');
  if (value.revision === 0 && value.progress === null && value.updatedAt === null) return { revision: 0, progress: null, updatedAt: null };
  if (value.revision === 0 || typeof value.updatedAt !== 'string' || !Number.isFinite(Date.parse(value.updatedAt))) throw new Error('Invalid sync record.');
  return { revision: value.revision as number, progress: validateCurrentProgress(value.progress), updatedAt: value.updatedAt };
}
export function parseSyncWrite(value: unknown): SyncWrite {
  if (!record(value) || !Number.isSafeInteger(value.baseRevision) || (value.baseRevision as number) < 0
    || typeof value.operationId !== 'string' || !/^[a-zA-Z0-9-]{8,80}$/.test(value.operationId)) throw new Error('Invalid sync request.');
  return { baseRevision: value.baseRevision as number, operationId: value.operationId, progress: validateCurrentProgress(value.progress) };
}

// Repository adapters must execute this transition atomically and retain the previous
// committed snapshot. Never implement a read-then-unconditional-write cloud adapter.
export function applySyncWrite(current: StoredSync, raw: unknown, now = new Date().toISOString()): { result: SyncResult; next: StoredSync } {
  const write = parseSyncWrite(raw);
  const payload = JSON.stringify(write.progress);
  if (write.operationId === current.lastOperationId) {
    if (payload !== current.lastOperationPayload) throw new Error('Operation ID reused with different data.');
    return { result: { status: 'saved', snapshot: current.snapshot }, next: current };
  }
  if (write.baseRevision !== current.snapshot.revision) return { result: { status: 'conflict', snapshot: current.snapshot }, next: current };
  if (current.snapshot.revision >= Number.MAX_SAFE_INTEGER || !Number.isFinite(Date.parse(now))) throw new Error('Sync cannot safely advance.');
  const snapshot = { revision: current.snapshot.revision + 1, progress: write.progress, updatedAt: now };
  const next = { snapshot, lastOperationId: write.operationId, lastOperationPayload: payload };
  return { result: { status: 'saved', snapshot }, next };
}

export type SyncDecision = 'same' | 'upload' | 'download' | 'conflict';
export function decideSync(local: AppProgress, base: AppProgress | null, remote: AppProgress | null): SyncDecision {
  if (sameProgress(local, remote)) return 'same';
  if (remote === null) return base === null ? 'upload' : 'conflict';
  // A first connection to an existing remote always asks; never guess which device matters.
  if (base === null) return 'conflict';
  if (sameProgress(local, base)) return 'download';
  if (sameProgress(remote, base)) return 'upload';
  return 'conflict';
}
