import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChapterContentProvider } from "../src/ChapterContentContext";
import { QuestionPicker } from "../src/WritingScreen";
import { chapterContentById } from "../src/data/chapterContent";
import { chapter8Content } from "../src/data/chapter8";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 8 source content", () => {
  it("registers the complete source bundle", () => {
    expect(chapterContentById[8]).toBe(chapter8Content);
    expect(chapter8Content.chunks).toHaveLength(6);
    expect(chapter8Content.conversations).toHaveLength(10);
    expect(chapter8Content.exercises.variation).toHaveLength(6);
    expect(chapter8Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter8Content.writing.questions).toHaveLength(14);
    expect(chapter8Content.writing.templates).toHaveLength(6);
  });

  it("uses supplied Chapter 8 sources", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 8 — My Story.pdf", "Week 8 — Real Conversations.pdf"]);
    expect(chapter8Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("shows the selected question's exact source", () => {
    const first = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter8Content }, createElement(QuestionPicker, { selectedId: "ch8-question-1", onSelect: () => undefined })));
    const second = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter8Content }, createElement(QuestionPicker, { selectedId: "ch8-question-2", onSelect: () => undefined })));
    expect(first).toContain("What About You? · p.170");
    expect(second).toContain("Let’s Have a Talk · p.172");
  });

  it("keeps progress independent", () => {
    const reduce = progressReducerFor(chapter8Content);
    let progress = initialProgress(chapter8Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(8);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch8-question-1");
  });
});
