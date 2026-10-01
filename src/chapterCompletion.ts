import type { PassProgress } from "./progress";
import { isConversationComplete } from "./conversationProgress";
import { isOutputComplete, isVariationComplete } from "./exerciseProgress";

export type CoreCompletion = {
  id: "myStory" | "conversation" | "output" | "review" | "writing";
  label: string;
  completed: boolean;
};

// Pass 1 requires the four core areas. Recommended sections never block it.
export function coreCompletion(p: PassProgress): CoreCompletion[] {
  return [
    { id: "myStory", label: "My Story", completed: p.fullRecallCompleted },
    { id: "conversation", label: "Real Conversations", completed: isConversationComplete(p.conversation) },
    { id: "output", label: "Output Practice", completed: isOutputComplete(p.output) },
    { id: "writing", label: "Weekly Writing", completed: p.writing.completed },
  ];
}

export function pass2CoreCompletion(p: PassProgress): CoreCompletion[] {
  return [
    { id: "myStory", label: "My Story Full Recall", completed: p.fullRecallCompleted },
    { id: "conversation", label: "Real Conversations", completed: isConversationComplete(p.conversation) },
    { id: "output", label: "Output Variation", completed: isVariationComplete(p.output) },
    { id: "review", label: "Chapter Review", completed: p.review.completed },
    { id: "writing", label: "Weekly Writing", completed: p.writing.completed },
  ];
}

export const completionForPass = (p: PassProgress) => p.pass === 2 ? pass2CoreCompletion(p) : coreCompletion(p);
export const isPassReady = (p: PassProgress) => completionForPass(p).every((section) => section.completed);
