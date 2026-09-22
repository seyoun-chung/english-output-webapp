import { chunkIds } from "./data/chapter3";

export type Rating = "immediate" | "effort" | "review";
export type Screen = "overview" | "read" | "recall" | "full";
export type ReadMode = "korean" | "english" | "together";
export type Progress = {
  version: 1;
  chapterId: 3;
  pass: 1;
  currentScreen: Screen;
  resumeScreen: Exclude<Screen, "overview">;
  readMode: ReadMode;
  // Keep the practice queue stable even when a weak chunk is re-rated.
  queue: number[];
  queueIndex: number;
  chunkRatings: Record<number, Rating | null>;
  hintUsage: Record<number, 0 | 1 | 2>;
  fullRecallCompleted: boolean;
  lastStudiedAt: string | null;
};

export const STORAGE_KEY = "english-output-webapp:progress";
export function initialProgress(): Progress {
  return {
    version: 1,
    chapterId: 3,
    pass: 1,
    currentScreen: "overview",
    resumeScreen: "read",
    readMode: "korean",
    queue: [...chunkIds],
    queueIndex: 0,
    chunkRatings: Object.fromEntries(chunkIds.map((id) => [id, null])),
    hintUsage: Object.fromEntries(chunkIds.map((id) => [id, 0])),
    fullRecallCompleted: false,
    lastStudiedAt: null,
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
export function parseProgress(raw: string | null): Progress {
  if (!raw) return initialProgress();
  try {
    const p: unknown = JSON.parse(raw);
    if (
      !isRecord(p) ||
      p.version !== 1 ||
      p.chapterId !== 3 ||
      p.pass !== 1 ||
      typeof p.currentScreen !== "string" ||
      !["overview", "read", "recall", "full"].includes(
        String(p.currentScreen),
      ) ||
      typeof p.resumeScreen !== "string" ||
      !["read", "recall", "full"].includes(p.resumeScreen) ||
      typeof p.readMode !== "string" ||
      !["korean", "english", "together"].includes(p.readMode) ||
      !Array.isArray(p.queue) ||
      !p.queue.length ||
      !p.queue.every((id) => chunkIds.includes(id)) ||
      new Set(p.queue).size !== p.queue.length ||
      !Number.isInteger(p.queueIndex) ||
      typeof p.queueIndex !== "number" ||
      p.queueIndex < 0 ||
      p.queueIndex >= p.queue.length ||
      !isRecord(p.chunkRatings) ||
      !isRecord(p.hintUsage) ||
      typeof p.fullRecallCompleted !== "boolean" ||
      !(
        p.lastStudiedAt === null ||
        (typeof p.lastStudiedAt === "string" &&
          Number.isFinite(Date.parse(p.lastStudiedAt)))
      )
    )
      return initialProgress();
    const ratings = p.chunkRatings;
    const hints = p.hintUsage;
    if (
      !chunkIds.every(
        (id) =>
          [null, "immediate", "effort", "review"].includes(
            ratings[id] as Rating | null,
          ) && [0, 1, 2].includes(hints[id] as number),
      )
    )
      return initialProgress();
    return p as unknown as Progress;
  } catch {
    return initialProgress();
  }
}

export const weakIds = (p: Progress) =>
  chunkIds.filter(
    (id) => p.chunkRatings[id] === "effort" || p.chunkRatings[id] === "review",
  );
export type Action =
  | { type: "navigate"; screen: Screen }
  | { type: "resume" }
  | { type: "readMode"; mode: ReadMode }
  | { type: "practice"; weakOnly?: boolean }
  | { type: "hint"; level: 1 | 2 }
  | { type: "rate"; rating: Rating }
  | { type: "previous" }
  | { type: "complete" };

export function updateProgress(p: Progress, action: Action): Progress {
  let next = p;
  switch (action.type) {
    case "navigate":
      next = {
        ...p,
        currentScreen: action.screen,
        resumeScreen:
          action.screen === "overview" ? p.resumeScreen : action.screen,
      };
      break;
    case "resume":
      next = { ...p, currentScreen: p.resumeScreen };
      break;
    case "readMode":
      next = { ...p, readMode: action.mode };
      break;
    case "practice": {
      const queue = action.weakOnly ? weakIds(p) : [...chunkIds];
      if (!queue.length) return p;
      next = {
        ...p,
        currentScreen: "recall",
        resumeScreen: "recall",
        queue,
        queueIndex: 0,
      };
      break;
    }
    case "hint": {
      const id = p.queue[p.queueIndex];
      next = {
        ...p,
        hintUsage: {
          ...p.hintUsage,
          [id]: Math.max(p.hintUsage[id], action.level) as 1 | 2,
        },
      };
      break;
    }
    case "rate": {
      const last = p.queueIndex === p.queue.length - 1;
      next = {
        ...p,
        chunkRatings: {
          ...p.chunkRatings,
          [p.queue[p.queueIndex]]: action.rating,
        },
        queueIndex: last ? p.queueIndex : p.queueIndex + 1,
        currentScreen: last ? "full" : "recall",
        resumeScreen: last ? "full" : "recall",
      };
      break;
    }
    case "previous":
      next = { ...p, queueIndex: Math.max(0, p.queueIndex - 1) };
      break;
    case "complete":
      next = { ...p, fullRecallCompleted: true };
      break;
  }
  return { ...next, lastStudiedAt: new Date().toISOString() };
}
