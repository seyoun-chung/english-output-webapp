import type { Chunk } from "./chapter3";
import { chunks } from "./chapter3";
import { chapter3, type ChapterId, type ChapterMetadata } from "./chapters";
import { conversationTurns, type ConversationTurn } from "./conversations";
import { grammarExplanations, grammarPairs } from "./grammar";
import {
  allReviewExercises,
  exactExercises,
  outputExercises,
  pass2ReviewExercises,
  variationExercises,
} from "./outputPractice";
import { writingQuestions, writingTemplates } from "./writing";
import type { ExerciseCatalog } from "../exerciseProgress";
import type { WritingSource } from "../writingProgress";

export type ChapterContent = {
  id: ChapterId;
  metadata: ChapterMetadata;
  chunks: Chunk[];
  conversations: ConversationTurn[];
  exercises: ExerciseCatalog;
  pass2ReviewExercises: typeof pass2ReviewExercises;
  writing: WritingSource;
  grammar: {
    explanations: typeof grammarExplanations;
    pairs: typeof grammarPairs;
  };
};

export const chapter3Content: ChapterContent = {
  id: 3,
  metadata: chapter3,
  chunks,
  conversations: conversationTurns,
  exercises: {
    exact: exactExercises,
    variation: variationExercises,
    output: outputExercises,
    review: allReviewExercises,
  },
  pass2ReviewExercises,
  writing: {
    questions: writingQuestions,
    templates: writingTemplates,
  },
  grammar: {
    explanations: grammarExplanations,
    pairs: grammarPairs,
  },
};

export const chapterContentById: Partial<Record<ChapterId, ChapterContent>> = {
  3: chapter3Content,
};

export function requireChapterContent(chapterId: ChapterId): ChapterContent {
  const content = chapterContentById[chapterId];
  if (!content) throw new Error(`Chapter ${chapterId} content is not available.`);
  return content;
}
