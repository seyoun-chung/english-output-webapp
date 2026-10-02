import type { Progress, Rating } from "./progress";
import type { ChapterId } from "./data/chapters";
import type { ChapterContent } from "./data/chapterContent";
import { exerciseGroup, type ExerciseItem } from "./data/outputPractice";

export type AutomaticMode = "mixed" | "smart" | "all-random";
export type AutomaticScreen = "hub" | "setup" | "session" | "complete" | "writing";
export type AutomaticHistory = { rating: Rating; lastReviewedAt: string };
export type AutomaticProgress = {
  screen: AutomaticScreen;
  mode: AutomaticMode;
  selectedChapterIds: ChapterId[];
  queue: string[];
  index: number;
  ratings: Record<string, Rating>;
  completed: boolean;
  history: Record<string, AutomaticHistory>;
  writingDraft: string;
  writingCompletedAt: string | null;
};

export type LearnedItem = {
  key: string;
  chapterId: ChapterId;
  item: ExerciseItem;
  rating: Rating;
  hintUsage: 0 | 1 | 2;
  lastStudiedAt: string | null;
  sourcePass: 1 | 2 | 3;
};

type ContentRegistry = Partial<Record<ChapterId, ChapterContent>>;
const ratings: Rating[] = ["immediate", "effort", "review"];
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isRating = (value: unknown): value is Rating => ratings.includes(value as Rating);
const isDate = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));

export const initialAutomaticProgress = (): AutomaticProgress => ({
  screen: "hub",
  mode: "mixed",
  selectedChapterIds: [],
  queue: [],
  index: 0,
  ratings: {},
  completed: false,
  history: {},
  writingDraft: "",
  writingCompletedAt: null,
});

function ratingForItem(progress: Progress, item: ExerciseItem) {
  for (const passNumber of [3, 2, 1] as const) {
    const pass = progress.passes[passNumber];
    if (!pass) continue;
    const group = exerciseGroup(item.id);
    const rating = group === "story"
      ? pass.chunkRatings[Number(item.id.slice("story-".length))]
      : group === "conversation"
        ? pass.conversation.ratings[Number(item.id.slice("conversation-".length))]
        : pass.output.ratings[item.id];
    if (isRating(rating)) return { rating, pass };
  }
  return null;
}

export function collectLearnedItems(
  chapters: Partial<Record<ChapterId, Progress>>,
  registry: ContentRegistry,
): LearnedItem[] {
  const learned: LearnedItem[] = [];
  for (const chapterId of Object.keys(registry).map(Number) as ChapterId[]) {
    const content = registry[chapterId];
    const progress = chapters[chapterId];
    if (!content || !progress) continue;
    for (const item of content.exercises.review) {
      const found = ratingForItem(progress, item);
      if (!found) continue;
      const storyId = exerciseGroup(item.id) === "story" ? Number(item.id.slice("story-".length)) : null;
      const hintUsage = storyId === null
        ? 0
        : Math.max(...([1, 2, 3] as const).map((pass) => progress.passes[pass]?.hintUsage[storyId] ?? 0)) as 0 | 1 | 2;
      learned.push({
        key: `${chapterId}:${item.id}`,
        chapterId,
        item,
        rating: found.rating,
        hintUsage,
        lastStudiedAt: found.pass.lastStudiedAt,
        sourcePass: found.pass.pass,
      });
    }
  }
  return learned;
}

const ratingRank = (rating: Rating) => rating === "review" ? 0 : rating === "effort" ? 3 : 4;
export function smartReviewOrder(items: LearnedItem[], history: Record<string, AutomaticHistory>): string[] {
  return [...items].sort((a, b) => {
    const aRating = history[a.key]?.rating ?? a.rating;
    const bRating = history[b.key]?.rating ?? b.rating;
    const aRank = aRating === "review" ? 0 : a.hintUsage === 2 ? 1 : a.hintUsage === 1 ? 2 : ratingRank(aRating);
    const bRank = bRating === "review" ? 0 : b.hintUsage === 2 ? 1 : b.hintUsage === 1 ? 2 : ratingRank(bRating);
    if (aRank !== bRank) return aRank - bRank;
    const aDate = history[a.key]?.lastReviewedAt ?? a.lastStudiedAt ?? "";
    const bDate = history[b.key]?.lastReviewedAt ?? b.lastStudiedAt ?? "";
    return aDate.localeCompare(bDate) || a.key.localeCompare(b.key);
  }).map((item) => item.key);
}

export function shuffledKeys(items: LearnedItem[], random = Math.random): string[] {
  const keys = items.map((item) => item.key);
  for (let index = keys.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [keys[index], keys[target]] = [keys[target], keys[index]];
  }
  return keys;
}

export function parseAutomaticProgress(raw: unknown, validKeys: string[], availableIds: ChapterId[]): AutomaticProgress {
  const initial = initialAutomaticProgress();
  if (!isRecord(raw)) return initial;
  const validKeySet = new Set(validKeys);
  const selectedChapterIds = Array.isArray(raw.selectedChapterIds)
    ? [...new Set(raw.selectedChapterIds.filter((id): id is ChapterId => typeof id === "number" && availableIds.includes(id as ChapterId)))]
    : [];
  const queue = Array.isArray(raw.queue) && raw.queue.every((key) => typeof key === "string" && validKeySet.has(key))
    ? [...new Set(raw.queue as string[])] : [];
  const storedRatings = isRecord(raw.ratings) ? raw.ratings : {};
  const parsedRatings = Object.fromEntries(
    queue.filter((key) => isRating(storedRatings[key])).map((key) => [key, storedRatings[key] as Rating]),
  );
  const storedHistory = isRecord(raw.history) ? raw.history : {};
  const history = Object.fromEntries(validKeys.flatMap((key) => {
    const value = storedHistory[key];
    return isRecord(value) && isRating(value.rating) && isDate(value.lastReviewedAt)
      ? [[key, { rating: value.rating, lastReviewedAt: value.lastReviewedAt } as AutomaticHistory]] : [];
  }));
  const mode = ["mixed", "smart", "all-random"].includes(raw.mode as string) ? raw.mode as AutomaticMode : "mixed";
  const screen = ["hub", "setup", "session", "complete", "writing"].includes(raw.screen as string)
    ? raw.screen as AutomaticScreen : "hub";
  const index = typeof raw.index === "number" && Number.isInteger(raw.index) && raw.index >= 0 && raw.index < Math.max(1, queue.length)
    ? raw.index : 0;
  const completed = raw.completed === true && queue.length > 0 && queue.every((key) => isRating(parsedRatings[key]));
  return {
    screen: (screen === "session" || screen === "complete") && !queue.length ? "hub" : screen,
    mode,
    selectedChapterIds,
    queue,
    index,
    ratings: parsedRatings,
    completed,
    history,
    writingDraft: typeof raw.writingDraft === "string" ? raw.writingDraft.slice(0, 20000) : "",
    writingCompletedAt: isDate(raw.writingCompletedAt) ? raw.writingCompletedAt : null,
  };
}

export type AutomaticAction =
  | { type: "home" }
  | { type: "choose"; mode: AutomaticMode }
  | { type: "toggleChapter"; chapterId: ChapterId }
  | { type: "start"; learned: LearnedItem[] }
  | { type: "rate"; rating: Rating; now?: string }
  | { type: "restart"; learned: LearnedItem[] }
  | { type: "openWriting" }
  | { type: "writingDraft"; value: string }
  | { type: "completeWriting"; now?: string };

export function updateAutomaticProgress(progress: AutomaticProgress, action: AutomaticAction): AutomaticProgress {
  if (action.type === "home") return { ...progress, screen: "hub", queue: [], index: 0, ratings: {}, completed: false };
  if (action.type === "choose") return { ...progress, screen: "setup", mode: action.mode, queue: [], index: 0, ratings: {}, completed: false };
  if (action.type === "toggleChapter") {
    const selectedChapterIds = progress.selectedChapterIds.includes(action.chapterId)
      ? progress.selectedChapterIds.filter((id) => id !== action.chapterId)
      : [...progress.selectedChapterIds, action.chapterId].sort((a, b) => a - b);
    return { ...progress, selectedChapterIds };
  }
  if (action.type === "openWriting") return { ...progress, screen: "writing" };
  if (action.type === "writingDraft") return { ...progress, writingDraft: action.value.slice(0, 20000), writingCompletedAt: null };
  if (action.type === "completeWriting") {
    if (!progress.writingDraft.trim() || progress.selectedChapterIds.length < 2) return progress;
    return { ...progress, writingCompletedAt: progress.writingCompletedAt ?? action.now ?? new Date().toISOString() };
  }
  if (action.type === "start" || action.type === "restart") {
    const candidates = progress.mode === "mixed"
      ? action.learned.filter((item) => progress.selectedChapterIds.includes(item.chapterId))
      : action.learned;
    if (!candidates.length || (progress.mode === "mixed" && progress.selectedChapterIds.length < 2)) return progress;
    const queue = progress.mode === "smart"
      ? smartReviewOrder(candidates, progress.history)
      : progress.mode === "all-random" ? shuffledKeys(candidates) : candidates.map((item) => item.key);
    return { ...progress, screen: "session", queue, index: 0, ratings: {}, completed: false };
  }
  if (action.type === "rate") {
    if (progress.screen !== "session" || !progress.queue.length || progress.completed) return progress;
    const key = progress.queue[progress.index];
    const now = action.now ?? new Date().toISOString();
    const nextRatings = { ...progress.ratings, [key]: action.rating };
    const last = progress.index === progress.queue.length - 1;
    return {
      ...progress,
      screen: last ? "complete" : "session",
      index: last ? progress.index : progress.index + 1,
      ratings: nextRatings,
      completed: last,
      history: { ...progress.history, [key]: { rating: action.rating, lastReviewedAt: now } },
    };
  }
  return progress;
}
