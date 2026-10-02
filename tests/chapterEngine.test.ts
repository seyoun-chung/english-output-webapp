import { describe, expect, it } from "vitest";
import { chapter3Content, type ChapterContent } from "../src/data/chapterContent";
import { chapterById } from "../src/data/chapters";
import { initialProgress, parseProgress, progressReducerFor } from "../src/progress";

const chapter1Content: ChapterContent = {
  ...chapter3Content,
  id: 1,
  metadata: chapterById(1),
  chunks: chapter3Content.chunks.slice(0, 2).map((chunk, index) => ({
    ...chunk,
    id: index + 101,
  })),
  conversations: chapter3Content.conversations.slice(0, 2).map((turn, index) => ({
    ...turn,
    id: index + 201,
    role: index === 0 ? "A" : "B",
  })),
  exercises: {
    exact: chapter3Content.exercises.exact.slice(0, 1).map((item) => ({ ...item, id: "ch1-exact-1" })),
    variation: chapter3Content.exercises.variation.slice(0, 1).map((item) => ({ ...item, id: "ch1-variation-1" })),
    output: chapter3Content.exercises.output.slice(0, 2).map((item, index) => ({ ...item, id: `ch1-output-${index + 1}` })),
    review: chapter3Content.exercises.review.slice(0, 2).map((item, index) => ({ ...item, id: `ch1-review-${index + 1}` })),
  },
  pass2ReviewExercises: [],
  writing: {
    questions: [{ id: "ch1-question-1", english: "Source question", section: "What About You?", sourcePage: 1 }],
    templates: [{ id: "ch1-template-1", english: "Source template", section: "Beginner Template", sourcePage: 2 }],
  },
};

describe("chapter-aware learning engine", () => {
  it("initializes every content-bound collection from the selected chapter", () => {
    const progress = initialProgress(chapter1Content);
    const pass1 = progress.passes[1];

    expect(progress.chapterId).toBe(1);
    expect(pass1.queue).toEqual([101, 102]);
    expect(Object.keys(pass1.chunkRatings)).toEqual(["101", "102"]);
    expect(Object.keys(pass1.conversation.ratings)).toEqual(["201", "202"]);
    expect(pass1.writing.selectedQuestionId).toBe("ch1-question-1");
    expect(pass1.writing.selectedTemplateId).toBe("ch1-template-1");
  });

  it("does not import another chapter's saved progress", () => {
    const chapter3Raw = JSON.stringify(initialProgress());
    expect(parseProgress(chapter3Raw, chapter1Content)).toEqual(initialProgress(chapter1Content));
  });

  it("updates recall using the selected chapter chunk IDs", () => {
    const reduce = progressReducerFor(chapter1Content);
    let progress = initialProgress(chapter1Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "immediate" });

    expect(progress.passes[1].chunkRatings[101]).toBe("immediate");
    expect(progress.passes[1].queueIndex).toBe(1);
    expect(progress.passes[1].chunkRatings[1]).toBeUndefined();
  });
});
