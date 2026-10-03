import { mkdir, readFile, readdir, writeFile, link, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { applySyncWrite, emptySync, parseSyncSnapshot, type StoredSync } from '../src/syncProtocol';

// Development-only. Each successful revision is an immutable
// file; temp files are never read as committed records. Keep all revisions for recovery.
export class LocalSyncStore {
  private tail: Promise<unknown> = Promise.resolve();
  constructor(private directory: string) {}
  private async load(): Promise<StoredSync> {
    await mkdir(this.directory, { recursive: true });
    const revisions = (await readdir(this.directory)).filter(name => /^revision-\d{16}\.json$/.test(name)).sort();
    if (!revisions.length) return emptySync();
    const raw = JSON.parse(await readFile(join(this.directory, revisions.at(-1)!), 'utf8'));
    const snapshot = parseSyncSnapshot(raw.snapshot);
    if (typeof raw.lastOperationId !== 'string' || raw.lastOperationPayload !== JSON.stringify(snapshot.progress)) throw new Error('Stored sync data needs recovery.');
    return { snapshot, lastOperationId: raw.lastOperationId, lastOperationPayload: raw.lastOperationPayload };
  }
  private serialize<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.tail.then(fn, fn);
    this.tail = result.catch(() => {});
    return result;
  }
  read() { return this.serialize(async () => (await this.load()).snapshot); }
  write(raw: unknown) {
    return this.serialize(async () => {
      const current = await this.load();
      const { result, next } = applySyncWrite(current, raw);
      if (next !== current) {
        const temp = join(this.directory, `pending-${randomUUID()}.json`);
        await writeFile(temp, JSON.stringify(next), { flag: 'wx', flush: true, mode: 0o600 });
        try {
          // Unlike rename, link fails if another process already committed this revision.
          await link(temp, join(this.directory, `revision-${String(next.snapshot.revision).padStart(16, '0')}.json`));
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
          return applySyncWrite(await this.load(), raw).result;
        } finally {
          await unlink(temp).catch(() => {});
        }
      }
      return result;
    });
  }
}
