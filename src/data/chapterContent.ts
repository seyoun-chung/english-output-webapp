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
import { chapter1Content } from "./chapter1";
import { chapter2Content } from "./chapter2";
import { chapter4Content } from "./chapter4";

export type ChapterContent = {
  id: ChapterId;
  metadata: ChapterMetadata;
  chunks: Chunk[];
  conversations: ConversationTurn[];
  exercises: ExerciseCatalog;
  pass2ReviewExercises: typeof pass2ReviewExercises;
  writing: WritingSource;
  grammar: {
    title: string;
    subtitle: string;
    sections: {
      heading: string;
      description: string;
      examples: { id: string; english: string; korean: string }[];
    }[];
    note?: string;
    sourcePages: number[];
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
    title: "I’m interested vs It’s interesting",
    subtitle: `${grammarPairs.length} example pairs`,
    sections: [
      {
        heading: "-ed",
        description: grammarExplanations.ed,
        examples: grammarPairs.map((pair) => ({ id: `${pair.id}-ed`, english: pair.ed, korean: pair.edKorean })),
      },
      {
        heading: "-ing",
        description: grammarExplanations.ing,
        examples: grammarPairs.map((pair) => ({ id: `${pair.id}-ing`, english: pair.ing, korean: pair.ingKorean })),
      },
    ],
    note: grammarExplanations.people,
    sourcePages: [54, 55],
  },
};

export const chapterContentById: Partial<Record<ChapterId, ChapterContent>> = {
  1: chapter1Content,
  2: chapter2Content,
  3: chapter3Content,
  4: chapter4Content,
};

export function requireChapterContent(chapterId: ChapterId): ChapterContent {
  const content = chapterContentById[chapterId];
  if (!content) throw new Error(`Chapter ${chapterId} content is not available.`);
  return content;
}
