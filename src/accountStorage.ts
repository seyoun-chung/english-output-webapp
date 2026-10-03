import { STORAGE_KEY } from './progress';

// This is browser namespace separation, not encryption or a security boundary against
// someone with access to browser developer tools. Server protection is enforced by RLS.
export function accountStorage(storage: Storage, project: string, userId: string): Storage {
  if (!project || !userId) throw new Error('Missing account scope');
  const prefix = `english-output-account:${encodeURIComponent(project)}:${encodeURIComponent(userId)}:`;
  const physical = (key: string) => {
    if (key !== STORAGE_KEY && !key.startsWith(`${STORAGE_KEY}:`)) throw new Error('Outside progress scope');
    return prefix + key;
  };
  const keys = () => Array.from({ length: storage.length }, (_, i) => storage.key(i)).filter((k): k is string => Boolean(k?.startsWith(prefix)));
  return {
    get length() { return keys().length; },
    key: index => keys()[index]?.slice(prefix.length) ?? null,
    getItem: key => storage.getItem(physical(key)),
    setItem: (key, value) => storage.setItem(physical(key), value),
    removeItem: key => storage.removeItem(physical(key)),
    clear: () => { throw new Error('Bulk clearing is not supported'); },
  };
}
