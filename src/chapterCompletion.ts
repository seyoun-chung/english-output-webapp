import type { PassProgress } from "./progress";
import { isConversationComplete } from "./conversationProgress";
import { isNoHintComplete, isOutputComplete, isVariationComplete, chapter3ExerciseCatalog, type ExerciseCatalog } from "./exerciseProgress";
import { conversationTurns, type ConversationTurn } from "./data/conversations";

export type CoreCompletion = {
  id: "myStory" | "conversation" | "output" | "review" | "writing" | "grammar" | "about";
  label: string;
  completed: boolean;
};
export type CompletionSources = {
  conversations: ConversationTurn[];
  exercises: ExerciseCatalog;
};
export const chapter3CompletionSources: CompletionSources = {
  conversations: conversationTurns,
  exercises: chapter3ExerciseCatalog,
};

// Pass 1 requires the four core areas. Recommended sections never block it.
export function coreCompletion(p: PassProgress, sources: CompletionSources = chapter3CompletionSources): CoreCompletion[] {
  return [
    { id: "myStory", label: "My Story", completed: p.fullRecallCompleted },
    { id: "conversation", label: "Real Conversations", completed: isConversationComplete(p.conversation, sources.conversations) },
    { id: "output", label: "Output Practice", completed: isOutputComplete(p.output, sources.exercises) },
    { id: "writing", label: "Weekly Writing", completed: p.writing.completed },
  ];
}

export function pass2CoreCompletion(p: PassProgress, sources: CompletionSources = chapter3CompletionSources): CoreCompletion[] {
  return [
    { id: "myStory", label: "My Story Full Recall", completed: p.fullRecallCompleted },
    { id: "conversation", label: "Real Conversations", completed: isConversationComplete(p.conversation, sources.conversations) },
    { id: "output", label: "Output Variation", completed: isVariationComplete(p.output, sources.exercises) },
    { id: "review", label: "Chapter Review", completed: p.review.completed },
    { id: "writing", label: "Weekly Writing", completed: p.writing.completed },
  ];
}

export function pass3CoreCompletion(p: PassProgress, sources: CompletionSources = chapter3CompletionSources): CoreCompletion[] {
  return [
    { id: "myStory", label: "My Story Full Recall", completed: p.fullRecallCompleted },
    { id: "conversation", label: "Real Conversations", completed: isConversationComplete(p.conversation, sources.conversations) },
    { id: "output", label: "Output No Hint", completed: isNoHintComplete(p.output, sources.exercises) },
    { id: "grammar", label: "Grammar Focus", completed: p.grammar.studied },
    { id: "about", label: "What About You?", completed: p.about.completedQuestionIds.length > 0 },
    { id: "writing", label: "Weekly Writing", completed: p.writing.completed },
    { id: "review", label: "Chapter Review", completed: p.review.completed },
  ];
}

export const completionForPass = (p: PassProgress, sources: CompletionSources = chapter3CompletionSources) => p.pass === 3 ? pass3CoreCompletion(p, sources) : p.pass === 2 ? pass2CoreCompletion(p, sources) : coreCompletion(p, sources);
export const isPassReady = (p: PassProgress, sources: CompletionSources = chapter3CompletionSources) => completionForPass(p, sources).every((section) => section.completed);
