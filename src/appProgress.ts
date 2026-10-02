import { chapter3Content, chapterContentById, type ChapterContent } from "./data/chapterContent";
import type { ChapterId } from "./data/chapters";
import { initialProgress, parseProgress, progressReducerFor, type Action, type Progress } from "./progress";
import {
  collectLearnedItems,
  initialAutomaticProgress,
  parseAutomaticProgress,
  updateAutomaticProgress,
  type AutomaticAction,
  type AutomaticProgress,
} from "./automaticProgress";

export type AppView = "library" | "chapter" | "automatic";
export type AppProgress = {
  version: 6;
  view: AppView;
  activeChapterId: ChapterId;
  chapters: Partial<Record<ChapterId, Progress>>;
  automatic: AutomaticProgress;
};

export type AppAction =
  | { type: "showLibrary" }
  | { type: "showAutomatic" }
  | { type: "selectChapter"; chapterId: ChapterId }
  | { type: "chapter"; action: Action }
  | { type: "automatic"; action: AutomaticAction };

type ContentRegistry = Partial<Record<ChapterId, ChapterContent>>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const availableIds = (registry: ContentRegistry): ChapterId[] =>
  Object.keys(registry).map(Number).filter((id): id is ChapterId => registry[id as ChapterId] !== undefined);

export function initialAppProgress(): AppProgress {
  return {
    version: 6,
    view: "chapter",
    activeChapterId: 3,
    chapters: { 3: initialProgress(chapter3Content) },
    automatic: initialAutomaticProgress(),
  };
}

export function parseAppProgress(
  raw: string | null,
  registry: ContentRegistry = chapterContentById,
): AppProgress {
  const ids = availableIds(registry);
  const fallbackId = ids.includes(3) ? 3 : ids[0];
  if (!fallbackId) throw new Error("At least one verified chapter is required.");
  const fallbackContent = registry[fallbackId]!;
  if (!raw) {
    return {
      version: 6,
      view: "chapter",
      activeChapterId: fallbackId,
      chapters: { [fallbackId]: initialProgress(fallbackContent) },
      automatic: initialAutomaticProgress(),
    };
  }
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) throw new Error("Invalid stored progress");

    if (value.version !== 5 && value.version !== 6) {
      const legacy = parseProgress(raw, chapter3Content);
      return {
        version: 6,
        view: "chapter",
        activeChapterId: 3,
        chapters: { 3: legacy },
        automatic: initialAutomaticProgress(),
      };
    }

    const storedChapters = isRecord(value.chapters) ? value.chapters : {};
    const chapters: Partial<Record<ChapterId, Progress>> = {};
    for (const id of ids) {
      const content = registry[id]!;
      if (isRecord(storedChapters[id])) {
        chapters[id] = parseProgress(JSON.stringify(storedChapters[id]), content);
      }
    }
    const requestedId = Number(value.activeChapterId) as ChapterId;
    const activeChapterId = ids.includes(requestedId) ? requestedId : fallbackId;
    chapters[activeChapterId] ??= initialProgress(registry[activeChapterId]!);
    return {
      version: 6,
      view: value.view === "library" || value.view === "automatic" ? value.view : "chapter",
      activeChapterId,
      chapters,
      automatic: parseAutomaticProgress(
        value.version === 6 ? value.automatic : null,
        collectLearnedItems(chapters, registry).map((item) => item.key),
        ids,
      ),
    };
  } catch {
    return {
      version: 6,
      view: "chapter",
      activeChapterId: fallbackId,
      chapters: { [fallbackId]: initialProgress(fallbackContent) },
      automatic: initialAutomaticProgress(),
    };
  }
}

export function updateAppProgress(
  progress: AppProgress,
  action: AppAction,
  registry: ContentRegistry = chapterContentById,
): AppProgress {
  if (action.type === "showLibrary") {
    return progress.view === "library" ? progress : { ...progress, view: "library" };
  }
  if (action.type === "showAutomatic") {
    return progress.view === "automatic" ? progress : { ...progress, view: "automatic" };
  }
  if (action.type === "selectChapter") {
    const content = registry[action.chapterId];
    if (!content) return progress;
    return {
      ...progress,
      view: "chapter",
      activeChapterId: action.chapterId,
      chapters: {
        ...progress.chapters,
        [action.chapterId]: progress.chapters[action.chapterId] ?? initialProgress(content),
      },
    };
  }
  if (action.type === "automatic") {
    const next = updateAutomaticProgress(
      progress.automatic,
      action.action,
    );
    return next === progress.automatic ? progress : { ...progress, automatic: next };
  }
  const content = registry[progress.activeChapterId];
  const current = progress.chapters[progress.activeChapterId];
  if (!content || !current) return progress;
  const next = progressReducerFor(content)(current, action.action);
  if (next === current) return progress;
  return { ...progress, chapters: { ...progress.chapters, [progress.activeChapterId]: next } };
}
