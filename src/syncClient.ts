import type { AppProgress } from './appProgress';
import { initialAppProgress } from './appProgress';
import { sameProgress } from './progressBackup';
import { decideSync, parseSyncSnapshot, type SyncSnapshot, type SyncWrite } from './syncProtocol';

export interface SyncTransport {
  read(): Promise<SyncSnapshot>;
  write(request: SyncWrite): Promise<SyncSnapshot>;
}
export class SyncConflict extends Error {
  constructor(public snapshot: SyncSnapshot) { super('Both copies changed. Choose which one to keep.'); }
}
export const localSyncTransport: SyncTransport = {
  async read() {
    const response = await fetch('/api/local-sync', { cache: 'no-store' });
    if (!response.ok) throw new Error('Sync unavailable. Your browser record is safe.');
    return parseSyncSnapshot(await response.json());
  },
  async write(request) {
    const response = await fetch('/api/local-sync', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-English-Output-Sync': '1' }, body: JSON.stringify(request) });
    if (response.status !== 409 && !response.ok) throw new Error('Sync unavailable. Your browser record is safe.');
    const result = await response.json();
    const snapshot = parseSyncSnapshot(result.snapshot);
    if (response.status === 409) throw new SyncConflict(snapshot);
    if (result.status !== 'saved' || JSON.stringify(snapshot.progress) !== JSON.stringify(request.progress)) throw new Error('Sync response did not match your record.');
    return snapshot;
  },
};

// An untouched browser may safely resume an existing account record. Two
// independently edited records still require an explicit choice.
export class SyncSession {
  private baseline: AppProgress | null = null;
  constructor(private transport: SyncTransport, baseline: AppProgress | null = null) { this.baseline = baseline; }
  getBaseline(): AppProgress | null { return this.baseline; }
  async check(local: AppProgress): Promise<{ action: 'same' | 'download'; snapshot: SyncSnapshot }> {
    const remote = await this.transport.read();
    if (this.baseline === null && remote.progress && sameProgress(local, initialAppProgress())) {
      return { action: 'download', snapshot: remote };
    }
    const decision = decideSync(local, this.baseline, remote.progress);
    if (decision === 'conflict') throw new SyncConflict(remote);
    if (decision === 'upload') {
      const saved = await this.transport.write({ baseRevision: remote.revision, operationId: crypto.randomUUID(), progress: local });
      this.baseline = saved.progress;
      return { action: 'same', snapshot: saved };
    }
    if (decision === 'same') this.baseline = remote.progress;
    // Caller must protect local changes before accepting a download.
    return { action: decision, snapshot: remote };
  }
  accept(snapshot: SyncSnapshot) { this.baseline = snapshot.progress; }
  async chooseLocal(local: AppProgress, remote: SyncSnapshot) {
    const saved = await this.transport.write({ baseRevision: remote.revision, operationId: crypto.randomUUID(), progress: local });
    this.baseline = saved.progress;
    return saved;
  }
}
