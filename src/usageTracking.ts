import type { AppAction, AppProgress } from './appProgress';
import { completionForPass } from './chapterCompletion';
import { roleTurnIds } from './data/conversations';
import { chapterContentById } from './data/chapterContent';
import { hasCompletedReview } from './exerciseProgress';
import { activePassProgress, type Rating, type Section } from './progress';

export const EVENT_SCHEMA_VERSION = 1 as const;
export const APP_VERSION = '0.1.0';
export const CONTENT_VERSION = 'chapters-2026-10-05';
export const PENDING_FIRST_TOUCH_KEY = 'english-output-usage:first-touch:v1';
const SESSION_KEY = 'english-output-usage:session:v1';
const MAX_QUEUE_SIZE = 500;
const MAX_BATCH_SIZE = 50;

export type FirstTouch = {
  capturedAt: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
};

export type UsageEventName =
  | 'app_open'
  | 'learning_started'
  | 'practice_rated'
  | 'section_completed'
  | 'chapter_completed'
  | 'review_completed';

export type UsageEventInput = {
  eventName: UsageEventName;
  chapterId?: number;
  pass?: number;
  section?: string;
  practiceMode?: string;
  contentItemId?: string;
  hintLevel?: 0 | 1 | 2;
  selfRating?: Rating;
};

export type UsageEvent = UsageEventInput & {
  eventId: string;
  occurredAt: string;
  sessionId: string;
  appVersion: string;
  contentVersion: string;
  eventSchemaVersion: typeof EVENT_SCHEMA_VERSION;
};

export type UsageTransport = {
  write: (firstTouch: FirstTouch, events: UsageEvent[]) => Promise<void>;
};

export type UsageRecorder = {
  record: (event: UsageEventInput | UsageEventInput[]) => void;
  recordOnce: (key: string, event: UsageEventInput) => void;
  flush: () => Promise<boolean>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const validDate = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));
const validUuid = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const safeValue = (value: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 128) : null;
};

function parseFirstTouch(value: unknown): FirstTouch | null {
  if (!isRecord(value) || !validDate(value.capturedAt)) return null;
  const fields = ['source', 'medium', 'campaign', 'content'] as const;
  if (!fields.every((field) => value[field] === null || (typeof value[field] === 'string' && value[field].length <= 128))) return null;
  return {
    capturedAt: value.capturedAt,
    source: value.source as string | null,
    medium: value.medium as string | null,
    campaign: value.campaign as string | null,
    content: value.content as string | null,
  };
}

export function captureFirstTouch(storage: Storage, href: string, now = new Date().toISOString()): FirstTouch {
  try {
    const existing = parseFirstTouch(JSON.parse(storage.getItem(PENDING_FIRST_TOUCH_KEY) ?? 'null'));
    if (existing) return existing;
  } catch { /* Create a fresh, bounded record below. */ }
  let url: URL | null = null;
  try { url = new URL(href); } catch { /* Treat invalid input as direct traffic. */ }
  const firstTouch: FirstTouch = {
    capturedAt: now,
    source: safeValue(url?.searchParams.get('utm_source') ?? null),
    medium: safeValue(url?.searchParams.get('utm_medium') ?? null),
    campaign: safeValue(url?.searchParams.get('utm_campaign') ?? null),
    content: safeValue(url?.searchParams.get('utm_content') ?? null),
  };
  try { storage.setItem(PENDING_FIRST_TOUCH_KEY, JSON.stringify(firstTouch)); } catch { /* Login must continue without analytics storage. */ }
  return firstTouch;
}

function parseUsageEvent(value: unknown): UsageEvent | null {
  if (!isRecord(value) || !validUuid(value.eventId) || !validUuid(value.sessionId) || !validDate(value.occurredAt)
    || !['app_open', 'learning_started', 'practice_rated', 'section_completed', 'chapter_completed', 'review_completed'].includes(String(value.eventName))
    || value.eventSchemaVersion !== EVENT_SCHEMA_VERSION || value.appVersion !== APP_VERSION || value.contentVersion !== CONTENT_VERSION) return null;
  const rating = value.selfRating;
  if (rating !== undefined && !['immediate', 'effort', 'review'].includes(String(rating))) return null;
  const hint = value.hintLevel;
  if (hint !== undefined && ![0, 1, 2].includes(Number(hint))) return null;
  return {
    eventId: value.eventId,
    occurredAt: value.occurredAt,
    sessionId: value.sessionId,
    eventName: value.eventName as UsageEventName,
    ...(Number.isInteger(value.chapterId) ? { chapterId: value.chapterId as number } : {}),
    ...(Number.isInteger(value.pass) ? { pass: value.pass as number } : {}),
    ...(typeof value.section === 'string' ? { section: value.section.slice(0, 40) } : {}),
    ...(typeof value.practiceMode === 'string' ? { practiceMode: value.practiceMode.slice(0, 40) } : {}),
    ...(typeof value.contentItemId === 'string' ? { contentItemId: value.contentItemId.slice(0, 100) } : {}),
    ...(hint !== undefined ? { hintLevel: Number(hint) as 0 | 1 | 2 } : {}),
    ...(rating !== undefined ? { selfRating: rating as Rating } : {}),
    appVersion: APP_VERSION,
    contentVersion: CONTENT_VERSION,
    eventSchemaVersion: EVENT_SCHEMA_VERSION,
  };
}

function storageKey(scope: string) {
  return `english-output-usage:queue:v1:${encodeURIComponent(scope)}`;
}

function sessionId(storage: Storage) {
  try {
    const existing = storage.getItem(SESSION_KEY);
    if (validUuid(existing)) return existing;
    const created = crypto.randomUUID();
    storage.setItem(SESSION_KEY, created);
    return created;
  } catch { return crypto.randomUUID(); }
}

export function createUsageRecorder({ transport, queueStorage, sessionStorage, scope, firstTouch, now = () => new Date().toISOString() }: {
  transport: UsageTransport;
  queueStorage: Storage;
  sessionStorage: Storage;
  scope: string;
  firstTouch: FirstTouch;
  now?: () => string;
}): UsageRecorder {
  const key = storageKey(scope);
  const currentSessionId = sessionId(sessionStorage);
  let inFlight: Promise<boolean> | null = null;
  let scheduled = false;
  const readQueue = (): UsageEvent[] => {
    try {
      const raw: unknown = JSON.parse(queueStorage.getItem(key) ?? '[]');
      return Array.isArray(raw) ? raw.map(parseUsageEvent).filter((event): event is UsageEvent => event !== null).slice(-MAX_QUEUE_SIZE) : [];
    } catch { return []; }
  };
  let queue = readQueue();
  const persist = () => {
    try { queueStorage.setItem(key, JSON.stringify(queue)); } catch { /* Analytics never blocks learning. */ }
  };
  const flush = (): Promise<boolean> => {
    if (inFlight) return inFlight;
    const task = (async () => {
      while (queue.length) {
        const batch = queue.slice(0, MAX_BATCH_SIZE);
        try { await transport.write(firstTouch, batch); }
        catch { return false; }
        const sent = new Set(batch.map((event) => event.eventId));
        queue = queue.filter((event) => !sent.has(event.eventId));
        persist();
        try { sessionStorage.removeItem(PENDING_FIRST_TOUCH_KEY); } catch { /* The server already has the first touch. */ }
      }
      return true;
    })();
    inFlight = task;
    void task.finally(() => { if (inFlight === task) inFlight = null; });
    return task;
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; void flush(); });
  };
  const record = (input: UsageEventInput | UsageEventInput[]) => {
    const inputs = Array.isArray(input) ? input : [input];
    const created = inputs.map((event): UsageEvent => ({
      ...event,
      eventId: crypto.randomUUID(),
      occurredAt: now(),
      sessionId: currentSessionId,
      appVersion: APP_VERSION,
      contentVersion: CONTENT_VERSION,
      eventSchemaVersion: EVENT_SCHEMA_VERSION,
    })).map(parseUsageEvent).filter((event): event is UsageEvent => event !== null);
    if (!created.length) return;
    queue = [...queue, ...created].slice(-MAX_QUEUE_SIZE);
    persist();
    schedule();
  };
  const recordOnce = (onceKey: string, event: UsageEventInput) => {
    const marker = `${SESSION_KEY}:once:${scope}:${onceKey}`;
    try {
      if (sessionStorage.getItem(marker) === currentSessionId) return;
      sessionStorage.setItem(marker, currentSessionId);
    } catch { /* A duplicate app-open is preferable to blocking the app. */ }
    record(event);
  };
  return { record, recordOnce, flush };
}

const screenSection = (screen: string): Section | 'myStory' | null =>
  ['read', 'recall', 'full'].includes(screen) ? 'myStory'
    : ['conversation', 'output', 'review', 'writing', 'about', 'grammar'].includes(screen) ? screen as Section : null;

function learningStart(previous: AppProgress, next: AppProgress): UsageEventInput[] {
  if (next.view === 'automatic') {
    if (previous.automatic.screen !== next.automatic.screen && next.automatic.screen === 'session')
      return [{ eventName: 'learning_started', pass: 4, section: 'review', practiceMode: next.automatic.mode }];
    if (previous.automatic.screen !== next.automatic.screen && next.automatic.screen === 'writing')
      return [{ eventName: 'learning_started', pass: 4, section: 'writing', practiceMode: 'multi-chapter-writing' }];
  }
  if (next.view !== 'chapter') return [];
  const nextChapter = next.chapters[next.activeChapterId];
  if (!nextChapter) return [];
  const nextPass = activePassProgress(nextChapter);
  const previousChapter = previous.chapters[previous.activeChapterId];
  const previousPass = previousChapter ? activePassProgress(previousChapter) : null;
  const section = screenSection(nextPass.currentScreen);
  if (!section) return [];
  const sameLocation = previous.view === 'chapter' && previous.activeChapterId === next.activeChapterId
    && previousPass?.pass === nextPass.pass && screenSection(previousPass.currentScreen) === section;
  if (sameLocation) return [];
  return [{ eventName: 'learning_started', chapterId: next.activeChapterId, pass: nextPass.pass, section }];
}

function ratingEvents(progress: AppProgress, action: AppAction): UsageEventInput[] {
  if (action.type === 'automatic' && action.action.type === 'rate') {
    const key = progress.automatic.queue[progress.automatic.index];
    const [chapter, ...item] = key?.split(':') ?? [];
    return key ? [{
      eventName: 'practice_rated', chapterId: Number(chapter), pass: 4,
      section: 'review', practiceMode: progress.automatic.mode,
      contentItemId: item.join(':'), hintLevel: 0, selfRating: action.action.rating,
    }] : [];
  }
  if (action.type !== 'chapter') return [];
  const chapter = progress.chapters[progress.activeChapterId];
  const content = chapterContentById[progress.activeChapterId];
  if (!chapter || !content) return [];
  const pass = activePassProgress(chapter);
  const base = { chapterId: progress.activeChapterId, pass: pass.pass };
  if (action.action.type === 'rate' && pass.currentScreen === 'recall') {
    const id = pass.queue[pass.queueIndex];
    return [{ eventName: 'practice_rated', ...base, section: 'myStory', practiceMode: 'chunk-recall', contentItemId: `story-${id}`, hintLevel: pass.hintUsage[id], selfRating: action.action.rating }];
  }
  if (action.action.type === 'conversation' && action.action.action.type === 'rate' && pass.conversation.view === 'role') {
    const role = pass.conversation.role;
    const id = roleTurnIds(role, content.conversations)[pass.conversation.positions[role]];
    return [{ eventName: 'practice_rated', ...base, section: 'conversation', practiceMode: `role-${role.toLowerCase()}`, contentItemId: `conversation-${id}`, hintLevel: pass.conversation.hintUsage[id], selfRating: action.action.action.rating }];
  }
  if (action.action.type === 'output') {
    const mode = pass.output.mode;
    const changed = Object.entries(action.action.value.ratings).filter(([id, rating]) => pass.output.ratings[id] !== rating);
    return changed.map(([id, rating]) => ({ eventName: 'practice_rated', ...base, section: 'output', practiceMode: mode, contentItemId: id, hintLevel: 0, selfRating: rating }));
  }
  if (action.action.type === 'review') {
    const changed = Object.entries(action.action.value.ratings).filter(([id, rating]) => pass.review.ratings[id] !== rating);
    return changed.map(([id, rating]) => ({ eventName: 'practice_rated', ...base, section: 'review', practiceMode: 'chapter-review', contentItemId: id, hintLevel: 0, selfRating: rating }));
  }
  return [];
}

function completionEvents(previous: AppProgress, next: AppProgress): UsageEventInput[] {
  if (previous.view === 'automatic' || next.view === 'automatic') {
    if (!previous.automatic.completed && next.automatic.completed) return [{ eventName: 'review_completed', pass: 4, section: 'review', practiceMode: next.automatic.mode }];
    if (!previous.automatic.writingCompletedAt && next.automatic.writingCompletedAt) return [{ eventName: 'section_completed', pass: 4, section: 'writing', practiceMode: 'multi-chapter-writing' }];
  }
  if (next.view !== 'chapter') return [];
  const previousChapter = previous.chapters[next.activeChapterId];
  const nextChapter = next.chapters[next.activeChapterId];
  const content = chapterContentById[next.activeChapterId];
  if (!previousChapter || !nextChapter || !content) return [];
  const before = activePassProgress(previousChapter);
  const after = activePassProgress(nextChapter);
  if (before.pass !== after.pass) return [];
  const context = { chapterId: next.activeChapterId, pass: after.pass };
  const events: UsageEventInput[] = [];
  const beforeSections = new Map(completionForPass(before, content).map((item) => [item.id, item.completed]));
  beforeSections.set('grammar', before.grammar.studied);
  beforeSections.set('about', before.about.completedQuestionIds.length > 0);
  const afterSections = new Map(completionForPass(after, content).map((item) => [item.id, item.completed]));
  afterSections.set('grammar', after.grammar.studied);
  afterSections.set('about', after.about.completedQuestionIds.length > 0);
  for (const [section, completed] of afterSections) {
    if (section !== 'review' && !beforeSections.get(section) && completed)
      events.push({ eventName: 'section_completed', ...context, section });
  }
  if (!hasCompletedReview(before.review) && hasCompletedReview(after.review)) events.push({ eventName: 'review_completed', ...context, section: 'review', practiceMode: 'chapter-review' });
  if (!before.completedAt && after.completedAt) events.push({ eventName: 'chapter_completed', ...context });
  return events;
}

export function usageEventsForTransition(previous: AppProgress, next: AppProgress, action: AppAction): UsageEventInput[] {
  if (previous === next) return [];
  return [...learningStart(previous, next), ...ratingEvents(previous, action), ...completionEvents(previous, next)];
}
