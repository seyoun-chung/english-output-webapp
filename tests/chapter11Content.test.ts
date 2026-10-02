import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChapterContentProvider } from "../src/ChapterContentContext";
import { QuestionPicker } from "../src/WritingScreen";
import { chapter11Content } from "../src/data/chapter11";
import { chapterContentById } from "../src/data/chapterContent";
import { initialProgress, progressReducerFor } from "../src/progress";

describe("Chapter 11 source content", () => {
  it("registers the complete source bundle", () => {
    expect(chapterContentById[11]).toBe(chapter11Content);
    expect(chapter11Content.chunks).toHaveLength(6);
    expect(chapter11Content.conversations).toHaveLength(9);
    expect(chapter11Content.exercises.variation).toHaveLength(6);
    expect(chapter11Content.pass2ReviewExercises).toHaveLength(12);
    expect(chapter11Content.writing.questions).toHaveLength(12);
    expect(chapter11Content.writing.templates).toHaveLength(6);
    expect(chapter11Content.metadata.pages.conversationKorean).toBe(220);
    expect(chapter11Content.metadata.pages.conversationEnglish).toBe(221);
  });

  it("uses supplied Chapter 11 sources", () => {
    const files = new Set(["eBook_Bookcamp_Oct8.pdf", "Week 11 — My Story.pdf", "Week 11 — Real Conversations.pdf"]);
    expect(chapter11Content.exercises.review.every((item) => files.has(item.source.file))).toBe(true);
  });

  it("shows the selected question's exact source", () => {
    const first = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter11Content }, createElement(QuestionPicker, { selectedId: "ch11-question-1", onSelect: () => undefined })));
    const second = renderToStaticMarkup(createElement(ChapterContentProvider, { content: chapter11Content }, createElement(QuestionPicker, { selectedId: "ch11-question-2", onSelect: () => undefined })));
    expect(first).toContain("What About You? · p.226");
    expect(second).toContain("Let’s Have a Talk · p.228");
  });

  it("keeps progress independent", () => {
    const reduce = progressReducerFor(chapter11Content);
    let progress = initialProgress(chapter11Content);
    progress = reduce(progress, { type: "practice" });
    progress = reduce(progress, { type: "rate", rating: "effort" });
    expect(progress.chapterId).toBe(11);
    expect(progress.passes[1].chunkRatings[1]).toBe("effort");
    expect(progress.passes[1].writing.selectedQuestionId).toBe("ch11-question-1");
  });
});
