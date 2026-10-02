import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChapterContentProvider } from "../src/ChapterContentContext";
import { QuestionPicker } from "../src/WritingScreen";
import { chapter10Content } from "../src/data/chapter10";
import { chapterContentById } from "../src/data/chapterContent";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 10 source content", () => {
  it("registers the complete source bundle", () => {
    expect(chapterContentById[10]).toBe(chapter10Content);
    expect(chapter10Content.chunks).toHaveLength(6);
    expect(chapter10Content.conversations).toHaveLength(8);
    expect(chapter10Content.exercises.variation).toHaveLength(6);
    expect(chapter10Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter10Content.writing.questions).toHaveLength(12);
    expect(chapter10Content.writing.templates).toHaveLength(7);
  });

  it("uses supplied Chapter 10 sources", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 10 — My Story.pdf", "Week 10 — Real Conversations.pdf"]);
    expect(chapter10Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("shows the selected question's exact source", () => {
    const first = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter10Content }, createElement(QuestionPicker, { selectedId: "ch10-question-1", onSelect: () => undefined })));
    const second = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter10Content }, createElement(QuestionPicker, { selectedId: "ch10-question-2", onSelect: () => undefined })));
    expect(first).toContain("What About You? · p.208");
    expect(second).toContain("Let’s Have a Talk · p.210");
  });

  it("keeps progress independent", () => {
    const reduce = progressReducerFor(chapter10Content);
    let progress = initialProgress(chapter10Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(10);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch10-question-1");
  });
});
