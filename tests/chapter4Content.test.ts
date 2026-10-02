import { describe, expect, it } from "vitest";
import { chapter4Content } from "../src/data/chapter4";
import { chapterContentById } from "../src/data/chapterContent";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 4 source content", () => {
  it("registers the complete Chapter 4 source bundle", () => {
    expect(chapterContentById[4]).toBe(chapter4Content);
    expect(chapter4Content.metadata.title).toBe("How Was Your Day?");
    expect(chapter4Content.chunks).toHaveLength(6);
    expect(chapter4Content.conversations).toHaveLength(10);
    expect(chapter4Content.exercises.exact).toHaveLength(6);
    expect(chapter4Content.exercises.variation).toHaveLength(6);
    expect(chapter4Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter4Content.writing.questions).toHaveLength(13);
    expect(chapter4Content.writing.templates).toHaveLength(6);
  });

  it("uses only the supplied textbook and Week 4 files as provenance", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 4 — My Story 강의노트.pdf", "Week 4 — Real Conversations 강의노트.pdf"]);
    expect(chapter4Content.chunks.every((item) => files.has(item.source.file))).toBe(true);
    expect(chapter4Content.conversations.every((item) => files.has(item.source.file))).toBe(true);
    expect(chapter4Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("keeps Chapter 4 progress independent", () => {
    const reduce = progressReducerFor(chapter4Content);
    let progress = initialProgress(chapter4Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(4);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch4-question-1");
  });
});
