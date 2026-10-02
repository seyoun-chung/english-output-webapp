import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chapter7Content } from "../src/data/chapter7";
import { chapterContentById } from "../src/data/chapterContent";
import { initialProgress, progressReducerFor } from "../src/progress";
import { ChapterContentProvider } from "../src/ChapterContentContext";
import { QuestionPicker } from "../src/WritingScreen";

describe("Chapter 7 source content", () => {
  it("registers the complete source bundle", () => {
    expect(chapterContentById[7]).toBe(chapter7Content);
    expect(chapter7Content.chunks).toHaveLength(6);
    expect(chapter7Content.conversations).toHaveLength(9);
    expect(chapter7Content.exercises.variation).toHaveLength(6);
    expect(chapter7Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter7Content.writing.questions).toHaveLength(13);
    expect(chapter7Content.writing.templates).toHaveLength(9);
  });

  it("uses supplied Chapter 7 sources", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 7 — My Story.pdf", "Week 7 — Real Conversations.pdf"]);
    expect(chapter7Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("shows the selected question's exact source", () => {
    const first = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter7Content }, createElement(QuestionPicker, { selectedId: "ch7-question-1", onSelect: () => undefined })));
    const second = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter7Content }, createElement(QuestionPicker, { selectedId: "ch7-question-2", onSelect: () => undefined })));
    expect(first).toContain("What About You? · p.152");
    expect(second).toContain("Let’s Have a Talk · p.154");
  });

  it("keeps progress independent", () => {
    const reduce = progressReducerFor(chapter7Content);
    let progress = initialProgress(chapter7Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(7);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch7-question-1");
  });
});
