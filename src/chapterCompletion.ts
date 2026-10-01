import type { PassProgress } from "./progress";
import { isConversationComplete } from "./conversationProgress";
import { isOutputComplete } from "./exerciseProgress";

export type CoreCompletion = {
  id: "myStory" | "conversation" | "output" | "writing";
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

export const isPassReady = (p: PassProgress) => coreCompletion(p).every((section) => section.completed);
