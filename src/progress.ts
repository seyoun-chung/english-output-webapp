import { chunkIds } from "./data/chapter3";
import { initialConversationProgress, parseConversationProgress, updateConversationProgress, type ConversationProgress, type ConversationAction } from "./conversationProgress";
import { initialPracticeProgress, parsePracticeProgress, initialReviewProgress, parseReviewProgress, type PracticeProgress, type ReviewProgress } from "./exerciseProgress";
import { initialWritingProgress, parseWritingProgress, initialAboutProgress, parseAboutProgress, initialGrammarProgress, parseGrammarProgress, type WritingProgress, type AboutProgress, type GrammarProgress } from "./writingProgress";
import { isPassReady } from "./chapterCompletion";

export type Rating = "immediate" | "effort" | "review";
export type Section = "myStory" | "conversation" | "output" | "review" | "writing" | "about" | "grammar";
export type Screen = "overview" | "read" | "recall" | "full" | Exclude<Section, "myStory"> | "complete";
export type ReadMode = "korean" | "english" | "together";
export type Progress = {
  version: 2;
  chapterId: 3;
  pass: 1;
  currentScreen: Screen;
  resumeScreen: "read" | "recall" | "full";
  lastSection: Section;
  conversation: ConversationProgress;
  output: PracticeProgress;
  review: ReviewProgress;
  writing: WritingProgress;
  about: AboutProgress;
  grammar: GrammarProgress;
  pass1CompletedAt: string | null;
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
    version: 2,
    chapterId: 3,
    pass: 1,
    currentScreen: "overview",
    resumeScreen: "read",
    lastSection: "myStory",
    conversation: initialConversationProgress(),
    output: initialPracticeProgress(),
    review: initialReviewProgress(),
    writing: initialWritingProgress(),
    about: initialAboutProgress(),
    grammar: initialGrammarProgress(),
    pass1CompletedAt: null,
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
    if (!isRecord(p) || ![1, 2].includes(p.version as number) || p.chapterId !== 3 || p.pass !== 1) return initialProgress();
    const parsedConversation = p.version === 2 ? parseConversationProgress(p.conversation) : null;
    const conversation = parsedConversation ?? initialConversationProgress();
    const parsed = {
      conversation: parsedConversation,
      output: p.version === 2 ? parsePracticeProgress(p.output) : null,
      review: p.version === 2 ? parseReviewProgress(p.review) : null,
      writing: p.version === 2 ? parseWritingProgress(p.writing) : null,
      about: p.version === 2 ? parseAboutProgress(p.about) : null,
      grammar: p.version === 2 ? parseGrammarProgress(p.grammar) : null,
    };
    const lastSection: Section = typeof p.lastSection === "string" && Object.hasOwn(parsed, p.lastSection)
      && parsed[p.lastSection as keyof typeof parsed] ? p.lastSection as Section : "myStory";
    const sections = {
      conversation,
      output: parsed.output ?? initialPracticeProgress(),
      review: parsed.review ?? initialReviewProgress(),
      writing: parsed.writing ?? initialWritingProgress(),
      about: parsed.about ?? initialAboutProgress(),
      grammar: parsed.grammar ?? initialGrammarProgress(),
      pass1CompletedAt: p.version === 2 && typeof p.pass1CompletedAt === "string" && Number.isFinite(Date.parse(p.pass1CompletedAt)) ? p.pass1CompletedAt : null,
    };
    const recovered = { ...initialProgress(), ...sections, lastSection };
    if (
      typeof p.currentScreen !== "string" ||
      !["overview", "read", "recall", "full", ...(p.version === 2 ? [...Object.keys(parsed), "complete"] : [])].includes(
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
      return recovered;
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
      return recovered;
    // Construct a whitelist, never re-save arbitrary stored fields (audio, tokens, etc.).
    const currentScreen = Object.hasOwn(parsed, p.currentScreen) && !parsed[p.currentScreen as keyof typeof parsed] ? "overview" : p.currentScreen as Screen;
    return {
      version: 2, chapterId: 3, pass: 1,
      currentScreen, resumeScreen: p.resumeScreen as Progress["resumeScreen"],
      lastSection: Object.hasOwn(parsed, currentScreen) ? currentScreen as Section : ["read", "recall", "full"].includes(currentScreen) ? "myStory" : lastSection,
      ...sections, readMode: p.readMode as ReadMode,
      queue: [...p.queue] as number[], queueIndex: p.queueIndex,
      chunkRatings: Object.fromEntries(chunkIds.map((id) => [id, ratings[id] as Rating | null])),
      hintUsage: Object.fromEntries(chunkIds.map((id) => [id, hints[id] as 0 | 1 | 2])),
      fullRecallCompleted: p.fullRecallCompleted, lastStudiedAt: p.lastStudiedAt as string | null,
    };
  } catch {
    return initialProgress();
  }
}

export const weakIds = (p: Progress) =>
  chunkIds.filter(
    (id) => p.chunkRatings[id] === "effort" || p.chunkRatings[id] === "review",
  );
export type Action =
  | { type: "output"; value: PracticeProgress }
  | { type: "review"; value: ReviewProgress }
  | { type: "writing"; value: WritingProgress }
  | { type: "about"; value: AboutProgress }
  | { type: "grammar"; value: GrammarProgress }
  | { type: "finishPass" }
  | { type: "conversation"; action: ConversationAction }
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
    case "output": case "review": case "writing": case "about": case "grammar":
      next = { ...p, [action.type]: action.value, currentScreen: action.type, lastSection: action.type };
      break;
    case "finishPass":
      if (!isPassReady(p)) return p;
      next = { ...p, currentScreen: "complete", pass1CompletedAt: p.pass1CompletedAt ?? new Date().toISOString() };
      break;
    case "conversation": {
      const conversation = updateConversationProgress(p.conversation, action.action);
      if (conversation === p.conversation) return p;
      next = { ...p, conversation, currentScreen: "conversation", lastSection: "conversation" };
      break;
    }
    case "navigate":
      next = {
        ...p,
        currentScreen: action.screen,
        resumeScreen:
          action.screen === "read" || action.screen === "recall" || action.screen === "full" ? action.screen : p.resumeScreen,
        lastSection: action.screen === "overview" || action.screen === "complete" ? p.lastSection
          : action.screen === "read" || action.screen === "recall" || action.screen === "full" ? "myStory" : action.screen,
      };
      break;
    case "resume":
      next = { ...p, currentScreen: p.lastSection === "myStory" ? p.resumeScreen : p.lastSection };
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
        lastSection: "myStory",
        queue,
        queueIndex: 0,
      };
      break;
    }
    case "hint": {
      if (p.currentScreen !== "recall") return p;
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
      if (p.currentScreen !== "recall") return p;
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
        lastSection: "myStory",
      };
      break;
    }
    case "previous":
      if (p.currentScreen !== "recall") return p;
      next = { ...p, queueIndex: Math.max(0, p.queueIndex - 1) };
      break;
    case "complete":
      if (p.currentScreen !== "full") return p;
      next = { ...p, fullRecallCompleted: true };
      break;
  }
  return { ...next, lastStudiedAt: new Date().toISOString() };
}
