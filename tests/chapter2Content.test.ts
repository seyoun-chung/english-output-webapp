import { describe, expect, it } from "vitest";
import { chapter2Content } from "../src/data/chapter2";
import { chapterContentById } from "../src/data/chapterContent";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 2 source content", () => {
  it("registers the complete Chapter 2 source bundle", () => {
    expect(chapterContentById[2]).toBe(chapter2Content);
    expect(chapter2Content.metadata.title).toBe("Introducing Yourself");
    expect(chapter2Content.chunks).toHaveLength(6);
    expect(chapter2Content.conversations).toHaveLength(9);
    expect(chapter2Content.exercises.exact).toHaveLength(6);
    expect(chapter2Content.exercises.variation).toHaveLength(6);
    expect(chapter2Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter2Content.writing.questions).toHaveLength(11);
    expect(chapter2Content.writing.templates).toHaveLength(6);
  });

  it("uses only the supplied textbook and Week 2 files as provenance", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 2 — My Story 강의노트.pdf", "Week 2 — Real Conversations 라이브노트.pdf"]);
    expect(chapter2Content.chunks.every((item) => files.has(item.source.file))).toBe(true);
    expect(chapter2Content.conversations.every((item) => files.has(item.source.file))).toBe(true);
    expect(chapter2Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("keeps Chapter 2 progress independent", () => {
    const reduce = progressReducerFor(chapter2Content);
    let progress = initialProgress(chapter2Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(2);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch2-question-1");
  });
});
