import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChapterContentProvider } from "../src/ChapterContentContext";
import { QuestionPicker } from "../src/WritingScreen";
import { chapter12Content } from "../src/data/chapter12";
import { chapterContentById } from "../src/data/chapterContent";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 12 source content", () => {
  it("registers the complete source bundle", () => {
    expect(chapterContentById[12]).toBe(chapter12Content);
    expect(chapter12Content.chunks).toHaveLength(6);
    expect(chapter12Content.conversations).toHaveLength(8);
    expect(chapter12Content.exercises.variation).toHaveLength(6);
    expect(chapter12Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter12Content.writing.questions).toHaveLength(15);
    expect(chapter12Content.writing.templates).toHaveLength(9);
  });

  it("uses supplied Chapter 12 sources", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 12 — My Story.pdf", "Week 12 — Real Conversations.pdf"]);
    expect(chapter12Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("shows the selected question's exact source", () => {
    const first = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter12Content }, createElement(QuestionPicker, { selectedId: "ch12-question-1", onSelect: () => undefined })));
    const third = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter12Content }, createElement(QuestionPicker, { selectedId: "ch12-question-3", onSelect: () => undefined })));
    expect(first).toContain("What About You? · p.246");
    expect(third).toContain("Let’s Have a Talk · p.248");
  });

  it("keeps progress independent", () => {
    const reduce = progressReducerFor(chapter12Content);
    let progress = initialProgress(chapter12Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(12);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch12-question-1");
  });
});
