import { describe, expect, it } from 'vitest';
import { initialAppProgress, updateAppProgress } from '../src/appProgress';
import { chapterCatalog } from '../src/data/chapters';
import { STORAGE_KEY, initialProgress, type Screen } from '../src/progress';
import { createProgressBackup, listRecoveryRecords, prepareStoredRecord, readProgressBackup, readProtectedProgress, restoreProgressBackup, saveProgressIfUnchanged, type StorageAccess } from '../src/progressBackup';

function memory(original: string | null = null) {
  const values = new Map<string, string>(original === null ? [] : [[STORAGE_KEY, original]]);
  const storage: StorageAccess = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } };
  return { values, storage };
}
const date = '2026-10-03T00:00:00.000Z';

describe('local progress backups', () => {
  it('round-trips real navigation and recall actions for all 12 chapters', () => {
    for (const chapter of chapterCatalog) {
      let progress = updateAppProgress(initialAppProgress(), { type: 'selectChapter', chapterId: chapter.id });
      for (const screen of ['read', 'recall', 'full', 'conversation', 'output', 'review', 'writing', 'about', 'grammar', 'overview'] satisfies Screen[]) {
        progress = updateAppProgress(progress, { type: 'chapter', action: { type: 'navigate', screen } });
        expect(readProgressBackup(createProgressBackup(progress)).progress).toEqual(progress);
      }
      for (const action of [{ type: 'practice' }, { type: 'hint', level: 1 }, { type: 'rate', rating: 'effort' }] as const) {
        progress = updateAppProgress(progress, { type: 'chapter', action });
        expect(readProgressBackup(createProgressBackup(progress)).progress).toEqual(progress);
      }
    }
  });
  it.each([1, 2])('preserves supported old Pass 1 version %s fields', version => {
    const current = initialProgress().passes[1];
    current.chunkRatings[1] = 'effort';
    const { completedAt, ...fields } = current;
    const legacy: Record<string, unknown> = { ...fields, version, chapterId: 3, pass1CompletedAt: completedAt };
    if (version === 1) for (const field of ['conversation', 'output', 'review', 'writing', 'about', 'grammar', 'lastSection']) delete legacy[field];
    const parsed = prepareStoredRecord(JSON.stringify(legacy));
    expect(parsed.chapters[3]!.passes[1].chunkRatings[1]).toBe('effort');
  });
  it.each([3, 4, 5])('prepares legacy version %s without losing writing or ratings', version => {
    const chapter = initialProgress();
    chapter.passes[1].writing.drafts.free = 'Keep my draft';
    chapter.passes[1].chunkRatings[1] = 'review';
    const value = version === 5 ? { version: 5, view: 'chapter', activeChapterId: 3, chapters: { 3: chapter } }
      : version === 3 ? { ...chapter, version: 3, passes: { 1: chapter.passes[1], 2: null } } : chapter;
    const result = prepareStoredRecord(JSON.stringify(value));
    expect(result.chapters[3]!.passes[1].writing.drafts.free).toBe('Keep my draft');
    expect(result.chapters[3]!.passes[1].chunkRatings[1]).toBe('review');
  });
  it('rejects a partially damaged legacy record rather than silently resetting it', () => {
    const chapter = initialProgress();
    (chapter.passes[1] as any).writing.drafts.free = 5;
    expect(() => prepareStoredRecord(JSON.stringify(chapter))).toThrow(/manual recovery/);
  });
  it('lists only recovery copies and keeps malformed originals available for download', () => {
    const keys = ['unrelated', `${STORAGE_KEY}:before-restore:a`];
    const records = listRecoveryRecords({ length: 2, key: i => keys[i], getItem: () => '{broken', setItem: () => {} });
    expect(records).toEqual([{key: keys[1], raw: '{broken'}]);
  });
  it('round-trips all chapters and personal writing without uploading audio or content', () => {
    let app = initialAppProgress();
    for (const chapter of chapterCatalog) app = updateAppProgress(app, { type: 'selectChapter', chapterId: chapter.id });
    app.chapters[1]!.passes[1].writing.drafts.free = 'My own story. <script>not code</script>';
    app.chapters[1]!.passes[1].chunkRatings[1] = 'effort';
    app.automatic.writingDraft = 'My mixed chapter story.';
    const text = createProgressBackup(app, date);
    expect(readProgressBackup(text).progress).toEqual(app);
    expect(text).not.toContain('englishText');
    expect(text).not.toContain('blob:');
  });
  it.each(['{', '{}', 'null', '[]', '{"version":99}'])('rejects an invalid backup without modifying storage: %s', text => {
    const { storage, values } = memory('original');
    expect(() => restoreProgressBackup(storage, text, 'original', 'test')).toThrow();
    expect([...values]).toEqual([[STORAGE_KEY, 'original']]);
  });
  it('rejects nested data that the tolerant parser would reset', () => {
    const backup = JSON.parse(createProgressBackup(initialAppProgress(), date));
    backup.progress.chapters[3].passes[1].writing = { drafts: { free: 'Keep me' } };
    expect(() => readProgressBackup(JSON.stringify(backup))).toThrow(/incomplete or invalid/);
  });
  it.each(['{', '', '{"version":100}', '{"version":6,"chapters":{}}'])('protects unreadable stored bytes: %s', original => {
    const { storage, values } = memory(original);
    expect(readProtectedProgress(storage).protected).toBe(true);
    expect(values.get(STORAGE_KEY)).toBe(original);
  });
  it('distinguishes a new browser from unreadable storage', () => {
    expect(readProtectedProgress(memory().storage).protected).toBe(false);
    expect(readProtectedProgress({ getItem: () => { throw Error('denied'); }, setItem: () => {} }).protected).toBe(true);
  });
  it('keeps the previous raw record before replacing it', () => {
    const original = 'legacy or corrupt bytes to keep';
    const { storage, values } = memory(original);
    const result = restoreProgressBackup(storage, createProgressBackup(initialAppProgress(), date), original, 'one');
    expect(values.get(result.recoveryKey!)).toBe(original);
    expect(JSON.parse(values.get(STORAGE_KEY)!)).toEqual(initialAppProgress());
  });
  it('does not replace progress when recovery storage is full', () => {
    const { storage, values } = memory('original');
    storage.setItem = () => { throw Error('quota'); };
    expect(() => restoreProgressBackup(storage, createProgressBackup(initialAppProgress(), date), 'original', 'one')).toThrow('quota');
    expect(values.get(STORAGE_KEY)).toBe('original');
  });
  it('keeps the recovery copy if writing the replacement fails', () => {
    const { storage, values } = memory('original');
    const set = storage.setItem;
    storage.setItem = (key, value) => { if (key === STORAGE_KEY) throw Error('quota'); set(key, value); };
    expect(() => restoreProgressBackup(storage, createProgressBackup(initialAppProgress(), date), 'original', 'one')).toThrow('quota');
    expect(values.get(`${STORAGE_KEY}:before-restore:one`)).toBe('original');
    expect(values.get(STORAGE_KEY)).toBe('original');
  });
  it('refuses a stale writer or duplicate recovery ID', () => {
    const { storage, values } = memory('newer');
    expect(() => saveProgressIfUnchanged(storage, 'older', initialAppProgress())).toThrow(/another tab/);
    expect(() => restoreProgressBackup(storage, createProgressBackup(initialAppProgress(), date), 'older', 'one')).toThrow(/changed/);
    values.set(`${STORAGE_KEY}:before-restore:one`, 'keep');
    expect(() => restoreProgressBackup(storage, createProgressBackup(initialAppProgress(), date), 'newer', 'one')).toThrow(/already exists/);
    expect(values.get(STORAGE_KEY)).toBe('newer');
  });
});
