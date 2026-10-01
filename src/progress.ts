import { chunkIds } from "./data/chapter3";
import { initialConversationProgress, parseConversationProgress, updateConversationProgress, type ConversationProgress, type ConversationAction } from "./conversationProgress";
import { initialPracticeProgress, parsePracticeProgress, initialReviewProgress, parseReviewProgress, type PracticeProgress, type ReviewProgress } from "./exerciseProgress";
import { initialWritingProgress, parseWritingProgress, initialAboutProgress, parseAboutProgress, initialGrammarProgress, parseGrammarProgress, type WritingProgress, type AboutProgress, type GrammarProgress } from "./writingProgress";
import { isPassReady } from "./chapterCompletion";

export type Rating = "immediate" | "effort" | "review";
export type PassNumber = 1 | 2;
export type Section = "myStory" | "conversation" | "output" | "review" | "writing" | "about" | "grammar";
export type Screen = "overview" | "read" | "recall" | "full" | Exclude<Section, "myStory"> | "complete";
export type ReadMode = "korean" | "english" | "together";

export type PassProgress = {
  pass: PassNumber;
  currentScreen: Screen;
  resumeScreen: "read" | "recall" | "full";
  lastSection: Section;
  conversation: ConversationProgress;
  output: PracticeProgress;
  review: ReviewProgress;
  writing: WritingProgress;
  about: AboutProgress;
  grammar: GrammarProgress;
  completedAt: string | null;
  readMode: ReadMode;
  // Keep the practice queue stable even when a weak chunk is re-rated.
  queue: number[];
  queueIndex: number;
  chunkRatings: Record<number, Rating | null>;
  hintUsage: Record<number, 0 | 1 | 2>;
  fullRecallCompleted: boolean;
  lastStudiedAt: string | null;
};

export type Progress = {
  version: 3;
  chapterId: 3;
  activePass: PassNumber;
  passes: { 1: PassProgress; 2: PassProgress | null };
};

export const STORAGE_KEY = "english-output-webapp:progress";

export function initialPassProgress(pass: PassNumber): PassProgress {
  const output = initialPracticeProgress();
  if (pass === 2) output.mode = "variation";
  return {
    pass,
    currentScreen: "overview",
    resumeScreen: pass === 2 ? "full" : "read",
    lastSection: "myStory",
    conversation: initialConversationProgress(),
    output,
    review: initialReviewProgress(),
    writing: initialWritingProgress(),
    about: initialAboutProgress(),
    grammar: initialGrammarProgress(),
    completedAt: null,
    readMode: "korean",
    queue: [...chunkIds],
    queueIndex: 0,
    chunkRatings: Object.fromEntries(chunkIds.map((id) => [id, null])),
    hintUsage: Object.fromEntries(chunkIds.map((id) => [id, 0])),
    fullRecallCompleted: false,
    lastStudiedAt: null,
  };
}

export function initialProgress(): Progress {
  return { version: 3, chapterId: 3, activePass: 1, passes: { 1: initialPassProgress(1), 2: null } };
}

export const activePassProgress = (progress: Progress): PassProgress =>
  progress.passes[progress.activePass] ?? progress.passes[1];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const validDate = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value));

function parsePassProgress(raw: unknown, pass: PassNumber, legacyVersion?: 1 | 2): PassProgress {
  const initial = initialPassProgress(pass);
  if (!isRecord(raw)) return initial;

  const parsedConversation = legacyVersion === 1 ? null : parseConversationProgress(raw.conversation);
  const parsed = {
    conversation: parsedConversation,
    output: legacyVersion === 1 ? null : parsePracticeProgress(raw.output),
    review: legacyVersion === 1 ? null : parseReviewProgress(raw.review),
    writing: legacyVersion === 1 ? null : parseWritingProgress(raw.writing),
    about: legacyVersion === 1 ? null : parseAboutProgress(raw.about),
    grammar: legacyVersion === 1 ? null : parseGrammarProgress(raw.grammar),
  };
  const lastSection: Section = typeof raw.lastSection === "string" && Object.hasOwn(parsed, raw.lastSection)
    && parsed[raw.lastSection as keyof typeof parsed] ? raw.lastSection as Section : "myStory";
  const completedValue = legacyVersion ? raw.pass1CompletedAt : raw.completedAt;
  const sections = {
    conversation: parsedConversation ?? initial.conversation,
    output: parsed.output ?? initial.output,
    review: parsed.review ?? initial.review,
    writing: parsed.writing ?? initial.writing,
    about: parsed.about ?? initial.about,
    grammar: parsed.grammar ?? initial.grammar,
    completedAt: validDate(completedValue) ? completedValue : null,
  };
  const recovered = { ...initial, ...sections, lastSection };
  const availableScreens = pass === 2
    ? ["overview", "read", "recall", "full", "conversation", "output", "review", "writing", "complete"]
    : ["overview", "read", "recall", "full", ...Object.keys(parsed), "complete"];
  if (
    typeof raw.currentScreen !== "string" || !availableScreens.includes(raw.currentScreen) ||
    typeof raw.resumeScreen !== "string" || !["read", "recall", "full"].includes(raw.resumeScreen) ||
    typeof raw.readMode !== "string" || !["korean", "english", "together"].includes(raw.readMode) ||
    !Array.isArray(raw.queue) || !raw.queue.length || !raw.queue.every((id) => chunkIds.includes(id)) ||
    new Set(raw.queue).size !== raw.queue.length || !Number.isInteger(raw.queueIndex) ||
    typeof raw.queueIndex !== "number" || raw.queueIndex < 0 || raw.queueIndex >= raw.queue.length ||
    !isRecord(raw.chunkRatings) || !isRecord(raw.hintUsage) ||
    typeof raw.fullRecallCompleted !== "boolean" ||
    !(raw.lastStudiedAt === null || validDate(raw.lastStudiedAt))
  ) return recovered;

  const ratings = raw.chunkRatings;
  const hints = raw.hintUsage;
  if (!chunkIds.every((id) =>
    [null, "immediate", "effort", "review"].includes(ratings[id] as Rating | null)
    && [0, 1, 2].includes(hints[id] as number),
  )) return recovered;

  // Construct a whitelist, never re-save arbitrary stored fields (audio, tokens, etc.).
  const currentScreen = Object.hasOwn(parsed, raw.currentScreen) && !parsed[raw.currentScreen as keyof typeof parsed]
    ? "overview" : raw.currentScreen as Screen;
  return {
    pass,
    currentScreen,
    resumeScreen: raw.resumeScreen as PassProgress["resumeScreen"],
    lastSection: Object.hasOwn(parsed, currentScreen) ? currentScreen as Section
      : ["read", "recall", "full"].includes(currentScreen) ? "myStory" : lastSection,
    ...sections,
    readMode: raw.readMode as ReadMode,
    queue: [...raw.queue] as number[],
    queueIndex: raw.queueIndex,
    chunkRatings: Object.fromEntries(chunkIds.map((id) => [id, ratings[id] as Rating | null])),
    hintUsage: Object.fromEntries(chunkIds.map((id) => [id, hints[id] as 0 | 1 | 2])),
    fullRecallCompleted: raw.fullRecallCompleted,
    lastStudiedAt: raw.lastStudiedAt as string | null,
  };
}

export function parseProgress(raw: string | null): Progress {
  if (!raw) return initialProgress();
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.chapterId !== 3) return initialProgress();
    if (value.version === 1 || value.version === 2) {
      if (value.pass !== 1) return initialProgress();
      return {
        version: 3,
        chapterId: 3,
        activePass: 1,
        passes: { 1: parsePassProgress(value, 1, value.version), 2: null },
      };
    }
    if (value.version !== 3 || !isRecord(value.passes)) return initialProgress();
    const pass1 = parsePassProgress(value.passes[1], 1);
    const pass2 = isRecord(value.passes[2]) && value.passes[2].pass === 2
      ? parsePassProgress(value.passes[2], 2) : null;
    const activePass = value.activePass === 2 && pass2 ? 2 : 1;
    return { version: 3, chapterId: 3, activePass, passes: { 1: pass1, 2: pass2 } };
  } catch {
    return initialProgress();
  }
}

export const weakIds = (progress: PassProgress) =>
  chunkIds.filter((id) => progress.chunkRatings[id] === "effort" || progress.chunkRatings[id] === "review");

export type Action =
  | { type: "startPass2" }
  | { type: "selectPass"; pass: PassNumber }
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

type PassAction = Exclude<Action, { type: "startPass2" } | { type: "selectPass" }>;
function updatePassProgress(progress: PassProgress, action: PassAction): PassProgress {
  let next = progress;
  switch (action.type) {
    case "output": case "review": case "writing": case "about": case "grammar":
      next = { ...progress, [action.type]: action.value, currentScreen: action.type, lastSection: action.type };
      break;
    case "finishPass":
      if (!isPassReady(progress)) return progress;
      next = { ...progress, currentScreen: "complete", completedAt: progress.completedAt ?? new Date().toISOString() };
      break;
    case "conversation": {
      const conversation = updateConversationProgress(progress.conversation, action.action);
      if (conversation === progress.conversation) return progress;
      next = { ...progress, conversation, currentScreen: "conversation", lastSection: "conversation" };
      break;
    }
    case "navigate":
      if (progress.pass === 2 && !["overview", "read", "recall", "full", "conversation", "output", "review", "writing", "complete"].includes(action.screen)) return progress;
      next = {
        ...progress,
        currentScreen: action.screen,
        resumeScreen: ["read", "recall", "full"].includes(action.screen)
          ? action.screen as PassProgress["resumeScreen"] : progress.resumeScreen,
        lastSection: action.screen === "overview" || action.screen === "complete" ? progress.lastSection
          : ["read", "recall", "full"].includes(action.screen) ? "myStory" : action.screen as Section,
      };
      break;
    case "resume":
      next = { ...progress, currentScreen: progress.lastSection === "myStory" ? progress.resumeScreen : progress.lastSection };
      break;
    case "readMode":
      next = { ...progress, readMode: action.mode };
      break;
    case "practice": {
      const queue = action.weakOnly ? weakIds(progress) : [...chunkIds];
      if (!queue.length) return progress;
      next = { ...progress, currentScreen: "recall", resumeScreen: "recall", lastSection: "myStory", queue, queueIndex: 0 };
      break;
    }
    case "hint": {
      if (progress.currentScreen !== "recall") return progress;
      const id = progress.queue[progress.queueIndex];
      next = { ...progress, hintUsage: { ...progress.hintUsage, [id]: Math.max(progress.hintUsage[id], action.level) as 1 | 2 } };
      break;
    }
    case "rate": {
      if (progress.currentScreen !== "recall") return progress;
      const last = progress.queueIndex === progress.queue.length - 1;
      next = {
        ...progress,
        chunkRatings: { ...progress.chunkRatings, [progress.queue[progress.queueIndex]]: action.rating },
        queueIndex: last ? progress.queueIndex : progress.queueIndex + 1,
        currentScreen: last ? "full" : "recall",
        resumeScreen: last ? "full" : "recall",
        lastSection: "myStory",
      };
      break;
    }
    case "previous":
      if (progress.currentScreen !== "recall") return progress;
      next = { ...progress, queueIndex: Math.max(0, progress.queueIndex - 1) };
      break;
    case "complete":
      if (progress.currentScreen !== "full") return progress;
      next = { ...progress, fullRecallCompleted: true };
      break;
  }
  return { ...next, lastStudiedAt: new Date().toISOString() };
}

export function updateProgress(progress: Progress, action: Action): Progress {
  if (action.type === "startPass2") {
    if (!progress.passes[1].completedAt || !isPassReady(progress.passes[1])) return progress;
    const pass2 = progress.passes[2] ?? initialPassProgress(2);
    return { ...progress, activePass: 2, passes: { ...progress.passes, 2: pass2 } };
  }
  if (action.type === "selectPass") {
    if (action.pass === 2 && !progress.passes[2]) return progress;
    return action.pass === progress.activePass ? progress : { ...progress, activePass: action.pass };
  }
  const current = activePassProgress(progress);
  const next = updatePassProgress(current, action);
  if (next === current) return progress;
  return { ...progress, passes: { ...progress.passes, [progress.activePass]: next } };
}
