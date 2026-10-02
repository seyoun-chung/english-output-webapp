import { describe, expect, it } from "vitest";
import { chapter5Content } from "../src/data/chapter5";
import { chapterContentById } from "../src/data/chapterContent";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 5 source content", () => {
  it("registers the complete Chapter 5 source bundle", () => {
    expect(chapterContentById[5]).toBe(chapter5Content);
    expect(chapter5Content.metadata.title).toBe("Catching up With Friends");
    expect(chapter5Content.chunks).toHaveLength(6);
    expect(chapter5Content.conversations).toHaveLength(9);
    expect(chapter5Content.exercises.exact).toHaveLength(6);
    expect(chapter5Content.exercises.variation).toHaveLength(6);
    expect(chapter5Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter5Content.writing.questions).toHaveLength(12);
    expect(chapter5Content.writing.templates).toHaveLength(8);
  });

  it("uses only the supplied textbook and Week 5 files as provenance", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 5 — My Story 강의노트.pdf", "Week 5 — Real Conversations 강의노트.pdf"]);
    expect(chapter5Content.chunks.every((item) => files.has(item.source.file))).toBe(true);
    expect(chapter5Content.conversations.every((item) => files.has(item.source.file))).toBe(true);
    expect(chapter5Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("keeps Chapter 5 progress independent", () => {
    const reduce = progressReducerFor(chapter5Content);
    let progress = initialProgress(chapter5Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(5);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch5-question-1");
  });
});
