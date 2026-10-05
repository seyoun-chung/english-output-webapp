import { describe, expect, it, vi } from 'vitest';
import { initialAppProgress, updateAppProgress, type AppAction } from '../src/appProgress';
import {
  PENDING_FIRST_TOUCH_KEY,
  captureFirstTouch,
  createUsageRecorder,
  usageEventsForTransition,
  type UsageEvent,
} from '../src/usageTracking';

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: key => values.get(key) ?? null,
    key: index => [...values.keys()][index] ?? null,
    removeItem: key => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

describe('privacy-bounded usage tracking', () => {
  it('captures only the first bounded UTM values and preserves direct first touch', () => {
    const storage = memoryStorage();
    const first = captureFirstTouch(storage, 'https://app.test/?utm_source=bootcamp&utm_medium=community&utm_campaign=community_launch&utm_content=kakao_notice', '2026-10-05T00:00:00.000Z');
    expect(first).toEqual({ capturedAt: '2026-10-05T00:00:00.000Z', source: 'bootcamp', medium: 'community', campaign: 'community_launch', content: 'kakao_notice' });
    expect(captureFirstTouch(storage, 'https://app.test/?utm_source=replaced', '2026-10-06T00:00:00.000Z')).toEqual(first);

    const direct = memoryStorage();
    expect(captureFirstTouch(direct, 'https://app.test/', '2026-10-05T00:00:00.000Z').source).toBeNull();
    expect(captureFirstTouch(direct, 'https://app.test/?utm_source=later', '2026-10-06T00:00:00.000Z').source).toBeNull();
  });

  it('queues failures without blocking, retries with the same event id, and consumes first touch only after success', async () => {
    const queueStorage = memoryStorage(), sessionStorage = memoryStorage();
    const firstTouch = captureFirstTouch(sessionStorage, 'https://app.test/?utm_source=bootcamp', '2026-10-05T00:00:00.000Z');
    const sent: UsageEvent[][] = [];
    const write = vi.fn(async (_first, events: UsageEvent[]) => {
      sent.push(events);
      if (sent.length === 1) throw new Error('offline');
    });
    const recorder = createUsageRecorder({ transport: { write }, queueStorage, sessionStorage, scope: 'project:user', firstTouch, now: () => '2026-10-05T01:00:00.000Z' });
    recorder.record({ eventName: 'learning_started', chapterId: 3, pass: 1, section: 'myStory' });
    expect(await recorder.flush()).toBe(false);
    expect(sessionStorage.getItem(PENDING_FIRST_TOUCH_KEY)).not.toBeNull();
    expect(await recorder.flush()).toBe(true);
    expect(sent).toHaveLength(2);
    expect(sent[1][0].eventId).toBe(sent[0][0].eventId);
    expect(sessionStorage.getItem(PENDING_FIRST_TOUCH_KEY)).toBeNull();
  });

  it('records meaningful study attempts and completion without copying writing text', () => {
    let previous = initialAppProgress();
    const navigate: AppAction = { type: 'chapter', action: { type: 'practice' } };
    let next = updateAppProgress(previous, navigate);
    expect(usageEventsForTransition(previous, next, navigate)).toEqual([
      { eventName: 'learning_started', chapterId: 3, pass: 1, section: 'myStory' },
    ]);
    previous = next;
    const hint: AppAction = { type: 'chapter', action: { type: 'hint', level: 2 } };
    next = updateAppProgress(previous, hint);
    previous = next;
    const rate: AppAction = { type: 'chapter', action: { type: 'rate', rating: 'effort' } };
    next = updateAppProgress(previous, rate);
    expect(usageEventsForTransition(previous, next, rate)).toContainEqual({
      eventName: 'practice_rated', chapterId: 3, pass: 1, section: 'myStory',
      practiceMode: 'chunk-recall', contentItemId: 'story-1', hintLevel: 2, selfRating: 'effort',
    });

    previous = next;
    const writing = previous.chapters[3]!.passes[1].writing;
    const edit: AppAction = { type: 'chapter', action: { type: 'writing', value: { ...writing, drafts: { free: 'private writing must never enter analytics' } } } };
    next = updateAppProgress(previous, edit);
    expect(JSON.stringify(usageEventsForTransition(previous, next, edit))).not.toContain('private writing');
  });

  it('emits rising-edge section, chapter and review completions once', () => {
    let progress = initialAppProgress();
    progress = updateAppProgress(progress, { type: 'chapter', action: { type: 'navigate', screen: 'full' } });
    const complete: AppAction = { type: 'chapter', action: { type: 'complete' } };
    const storyDone = updateAppProgress(progress, complete);
    expect(usageEventsForTransition(progress, storyDone, complete)).toContainEqual({ eventName: 'section_completed', chapterId: 3, pass: 1, section: 'myStory' });

    const automatic = structuredClone(storyDone);
    automatic.view = 'automatic';
    automatic.automatic = { ...automatic.automatic, screen: 'session', mode: 'smart', queue: ['3:story-1'], selectedChapterIds: [3] };
    const rating: AppAction = { type: 'automatic', action: { type: 'rate', rating: 'immediate', now: '2026-10-05T02:00:00.000Z' } };
    const reviewed = updateAppProgress(automatic, rating);
    const events = usageEventsForTransition(automatic, reviewed, rating);
    expect(events).toContainEqual({ eventName: 'review_completed', pass: 4, section: 'review', practiceMode: 'smart' });
    expect(events).toContainEqual({ eventName: 'practice_rated', chapterId: 3, pass: 4, section: 'review', practiceMode: 'smart', contentItemId: 'story-1', hintLevel: 0, selfRating: 'immediate' });
  });
});
