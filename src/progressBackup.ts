import { initialAppProgress, parseAppProgress, type AppProgress } from './appProgress';
import { STORAGE_KEY } from './progress';

export const MAX_BACKUP_BYTES = 8 * 1024 * 1024;
export const BACKUP_FORMAT = 'english-output-progress';
export type ProgressBackup = { format: typeof BACKUP_FORMAT; version: 1; savedAt: string; progress: AppProgress };
export type StorageAccess = Pick<Storage, 'getItem' | 'setItem'>;

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Key ordering is not significant. Unknown fields and discarded values are significant:
// a tolerant migration parser must not silently turn a bad import into an empty record.
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (record(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export const sameProgress = (left: unknown, right: unknown): boolean => canonical(left) === canonical(right);

export function validateCurrentProgress(value: unknown): AppProgress {
  if (!record(value) || value.version !== 6) throw new Error('This progress version is not supported.');
  const parsed = parseAppProgress(JSON.stringify(value));
  if (canonical(value) !== canonical(parsed)) throw new Error('The progress file is incomplete or invalid. Nothing was replaced.');
  return parsed;
}

function preservesFields(source: unknown, target: unknown): boolean {
  if (record(source) && record(target)) return Object.keys(source).every(key =>
    Object.hasOwn(target, key) && preservesFields(source[key], target[key]));
  return canonical(source) === canonical(target);
}

export function prepareStoredRecord(raw: string): AppProgress {
  if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) throw new Error('This record is too large.');
  const value: unknown = JSON.parse(raw);
  if (!record(value)) throw new Error('Invalid saved record.');
  if (value.version === 6) return validateCurrentProgress(value);
  if (![1, 2, 3, 4, 5].includes(value.version as number)) throw new Error('This progress version is not supported.');
  const migrated = parseAppProgress(raw);
  const { version: _version, ...fields } = value;
  let target: unknown;
  if (value.version === 5) {
    if (!record(value.chapters) || !Object.keys(value.chapters).length) throw new Error('No chapter records found.');
    target = migrated;
  } else {
    if (value.chapterId !== 3) throw new Error('Legacy records must belong to Chapter 3.');
    if (value.version === 3 || value.version === 4) {
      if (!record(value.passes) || !record(value.passes[1])) throw new Error('Missing study record.');
      target = migrated.chapters[3];
    } else {
      if (value.pass !== 1 || !record(value.chunkRatings) || !record(value.hintUsage)) throw new Error('Missing study record.');
      const { chapterId: _chapter, pass1CompletedAt, ...passFields } = fields;
      const pass = migrated.chapters[3]!.passes[1];
      if (!preservesFields(passFields, pass)
        || (pass1CompletedAt !== undefined && pass1CompletedAt !== pass.completedAt)) {
        throw new Error('This record needs manual recovery. The original is unchanged.');
      }
      return validateCurrentProgress(migrated);
    }
  }
  if (!preservesFields(fields, target)) throw new Error('This record needs manual recovery. The original is unchanged.');
  return validateCurrentProgress(migrated);
}

export function listRecoveryRecords(storage: StorageAccess & Pick<Storage, 'length' | 'key'>): { key: string; raw: string }[] {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key?.startsWith(`${STORAGE_KEY}:before-restore:`)) keys.push(key);
  }
  return keys.sort().reverse().flatMap(key => {
    const raw = storage.getItem(key);
    return raw === null ? [] : [{ key, raw }];
  });
}

export function createProgressBackup(progress: AppProgress, now = new Date().toISOString()): string {
  if (!Number.isFinite(Date.parse(now))) throw new Error('Invalid backup date.');
  const backup: ProgressBackup = { format: BACKUP_FORMAT, version: 1, savedAt: now, progress: validateCurrentProgress(progress) };
  const text = JSON.stringify(backup, null, 2);
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new Error('This backup is too large.');
  return text;
}

export function readProgressBackup(text: string): ProgressBackup {
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new Error('Choose a backup smaller than 8 MB.');
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error('This is not a valid JSON backup.'); }
  if (!record(value) || value.format !== BACKUP_FORMAT || value.version !== 1
    || typeof value.savedAt !== 'string' || !Number.isFinite(Date.parse(value.savedAt))) {
    throw new Error('Choose an English Output backup file.');
  }
  return { format: BACKUP_FORMAT, version: 1, savedAt: value.savedAt, progress: validateCurrentProgress(value.progress) };
}

export type StoredProgress = { progress: AppProgress; original: string | null; protected: boolean; message: string | null };

export function readProtectedProgress(storage: StorageAccess): StoredProgress {
  let original: string | null = null;
  try {
    original = storage.getItem(STORAGE_KEY);
    if (original === null) return { progress: initialAppProgress(), original, protected: false, message: null };
    const value: unknown = JSON.parse(original);
    return { progress: validateCurrentProgress(value), original, protected: false, message: null };
  } catch {
    // Keep the original bytes in place. The caller must disable automatic saves until
    // an explicit recovery/migration workflow has preserved them successfully.
    return { progress: original ? parseAppProgress(original) : initialAppProgress(), original, protected: true,
      message: 'Saved progress could not be read safely. The original is unchanged. Export it before recovery.' };
  }
}

export function saveProgressIfUnchanged(storage: StorageAccess, expected: string | null, progress: AppProgress): string {
  const next = JSON.stringify(validateCurrentProgress(progress));
  if (storage.getItem(STORAGE_KEY) !== expected) throw new Error('Progress changed in another tab. Export your work before reloading.');
  storage.setItem(STORAGE_KEY, next);
  return next;
}

// Call only after the UI has shown a preview and the learner confirmed replacement.
// The caller must serialize writers across tabs (e.g. Web Locks); this synchronous
// compare is an additional stale-data guard, not an atomic cross-tab transaction.
export function restoreProgressBackup(storage: StorageAccess, text: string, expected: string | null, recoveryId: string): { progress: AppProgress; recoveryKey: string | null; saved: string } {
  const backup = readProgressBackup(text);
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(recoveryId)) throw new Error('Invalid recovery identifier.');
  if (storage.getItem(STORAGE_KEY) !== expected) throw new Error('Progress changed. Check the backup preview again.');
  const recoveryKey = expected === null ? null : `${STORAGE_KEY}:before-restore:${recoveryId}`;
  if (recoveryKey) {
    if (storage.getItem(recoveryKey) !== null) throw new Error('This recovery copy already exists. Nothing was replaced.');
    storage.setItem(recoveryKey, expected!);
    if (storage.getItem(recoveryKey) !== expected) throw new Error('The recovery copy could not be verified. Nothing was replaced.');
  }
  const saved = saveProgressIfUnchanged(storage, expected, backup.progress);
  return { progress: backup.progress, recoveryKey, saved };
}
