import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChapterContentProvider } from "../src/ChapterContentContext";
import { QuestionPicker } from "../src/WritingScreen";
import { chapterContentById } from "../src/data/chapterContent";
import { chapter9Content } from "../src/data/chapter9";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 9 source content", () => {
  it("registers the complete source bundle", () => {
    expect(chapterContentById[9]).toBe(chapter9Content);
    expect(chapter9Content.chunks).toHaveLength(6);
    expect(chapter9Content.conversations).toHaveLength(11);
    expect(chapter9Content.exercises.variation).toHaveLength(6);
    expect(chapter9Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter9Content.writing.questions).toHaveLength(15);
    expect(chapter9Content.writing.templates).toHaveLength(6);
  });

  it("uses supplied Chapter 9 sources", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 9 — My Story.pdf", "Week 9 — Real Conversations.pdf"]);
    expect(chapter9Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("shows the selected question's exact source", () => {
    const first = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter9Content }, createElement(QuestionPicker, { selectedId: "ch9-question-1", onSelect: () => undefined })));
    const second = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter9Content }, createElement(QuestionPicker, { selectedId: "ch9-question-2", onSelect: () => undefined })));
    expect(first).toContain("What About You? · p.189");
    expect(second).toContain("Let’s Have a Talk · p.191");
  });

  it("keeps progress independent", () => {
    const reduce = progressReducerFor(chapter9Content);
    let progress = initialProgress(chapter9Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(9);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch9-question-1");
  });
});
