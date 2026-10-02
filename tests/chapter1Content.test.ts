import { describe, expect, it } from "vitest";
import { chapter1Content } from "../src/data/chapter1";
import { chapterContentById } from "../src/data/chapterContent";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 1 source content", () => {
  it("registers one complete reusable content bundle", () => {
    expect(chapterContentById[1]).toBe(chapter1Content);
    expect(chapter1Content.metadata.title).toBe("Work, English, and Dreams");
    expect(chapter1Content.chunks).toHaveLength(6);
    expect(chapter1Content.conversations).toHaveLength(8);
    expect(chapter1Content.exercises.exact).toHaveLength(6);
    expect(chapter1Content.exercises.variation).toHaveLength(6);
    expect(chapter1Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter1Content.writing.questions).toHaveLength(11);
    expect(chapter1Content.writing.templates).toHaveLength(8);
  });

  it("keeps every learning item tied to the supplied main or Week 1 source", () => {
    const sourceFiles = new Set([
      "eBook_Bookcamp_Oct8.pdf",
      "Week 1 — My Story 강의노트.pdf",
      "Week 1 — Real Conversations.pdf",
    ]);
    const exercises = chapter1Content.exercises.review;

    expect(chapter1Content.chunks.every((item) => sourceFiles.has(item.source.file))).toBe(true);
    expect(chapter1Content.conversations.every((item) => sourceFiles.has(item.source.file))).toBe(true);
    expect(exercises.every((item) => sourceFiles.has(item.source.file))).toBe(true);
    expect(exercises.every((item) => item.english.length > 0 && item.korean.length > 0)).toBe(true);
  });

  it("runs Chapter 1 progress without writing into Chapter 3 IDs", () => {
    const reduce = progressReducerFor(chapter1Content);
    let progress = initialProgress(chapter1Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "immediate" });

    expect(progress.chapterId).toBe(1);
    expect(progress.passes[1].chunkRatings[1]).toBe("immediate");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch1-question-1");
  });
});
