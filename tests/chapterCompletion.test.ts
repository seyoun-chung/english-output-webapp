import { describe, expect, it } from "vitest";
import { initialProgress, parseProgress, updateProgress, type Progress } from "../src/progress";
import { coreCompletion, isPassReady } from "../src/chapterCompletion";
import { exactExercises, buildReviewItems, allReviewExercises } from "../src/data/outputPractice";
import { completeWriting, editWritingDraft } from "../src/writingProgress";

function readyProgress(): Progress {
  const p = initialProgress();
  p.fullRecallCompleted = true;
  p.conversation.fullRecallCompleted = true;
  for (const id of Object.keys(p.conversation.ratings)) p.conversation.ratings[Number(id)] = "effort";
  for (const item of exactExercises) p.output.ratings[item.id] = "review";
  p.writing = completeWriting(editWritingDraft(p.writing, "My own learning reflection."));
  return p;
}

describe("Chapter 3 Pass 1 completion", () => {
  it("uses four core sections, not optional areas or review, and is not a mastery grade", () => {
    const p = readyProgress();
    expect(coreCompletion(p).map(({ id }) => id)).toEqual(["myStory", "conversation", "output", "writing"]);
    expect(p.grammar.studied).toBe(false);
    expect(p.about.completedQuestionIds).toEqual([]);
    expect(p.review.completed).toBe(false);
    expect(isPassReady(p)).toBe(true);
  });
  it.each(["myStory", "conversation", "output", "writing"] as const)("requires %s", (section) => {
    const p = readyProgress();
    if (section === "myStory") p.fullRecallCompleted = false;
    if (section === "conversation") p.conversation.ratings[2] = null;
    if (section === "output") p.output.ratings = {};
    if (section === "writing") p.writing.completed = false;
    expect(isPassReady(p)).toBe(false);
    expect(updateProgress(p, { type: "finishPass" })).toBe(p);
  });
  it("requires explicit completion, records a date, preserves section and never advances pass", () => {
    const p = readyProgress();
    expect(p.pass1CompletedAt).toBeNull();
    const completed = updateProgress(p, { type: "finishPass" });
    expect(completed.currentScreen).toBe("complete");
    expect(completed.lastSection).toBe(p.lastSection);
    expect(Number.isFinite(Date.parse(completed.pass1CompletedAt!))).toBe(true);
    expect(completed.pass).toBe(1);
    expect(updateProgress(completed, { type: "finishPass" }).pass1CompletedAt).toBe(completed.pass1CompletedAt);
    expect(parseProgress(JSON.stringify(completed))).toEqual(completed);
  });
  it("historical completion never overrides current readiness after a draft changes", () => {
    const p = updateProgress(readyProgress(), { type: "finishPass" });
    const changed = updateProgress(p, { type: "writing", value: { ...p.writing, completed: false } });
    expect(changed.pass1CompletedAt).toBe(p.pass1CompletedAt);
    expect(isPassReady(changed)).toBe(false);
  });
  it("never hard locks learning screens before completion", () => {
    for (const screen of ["output", "review", "writing", "about", "grammar", "complete"] as const) {
      expect(updateProgress(initialProgress(), { type: "navigate", screen }).currentScreen).toBe(screen);
    }
  });
});

describe("independent section storage", () => {
  it("accepts provisional version 2 without newly added fields", () => {
    const initial = initialProgress();
    const { output, review, writing, about, grammar, pass1CompletedAt, ...oldV2 } = initial;
    oldV2.chunkRatings[1] = "effort";
    oldV2.conversation.ratings[2] = "review";
    const p = parseProgress(JSON.stringify(oldV2));
    expect(p.chunkRatings[1]).toBe("effort");
    expect(p.conversation.ratings[2]).toBe("review");
    expect(p.output).toEqual(output);
    expect(p.review).toEqual(review);
    expect(p.writing).toEqual(writing);
    expect(p.about).toEqual(about);
    expect(p.grammar).toEqual(grammar);
    expect(p.pass1CompletedAt).toBe(pass1CompletedAt);
  });
  it.each(["output", "review", "writing", "about", "grammar"] as const)("recovers only damaged %s and preserves both earlier sections", (key) => {
    const original = initialProgress();
    original.chunkRatings[1] = "immediate";
    original.conversation.ratings[2] = "review";
    original.pass1CompletedAt = "2026-09-23T00:00:00.000Z";
    const p = parseProgress(JSON.stringify({ ...original, [key]: "broken" }));
    expect(p.chunkRatings).toEqual(original.chunkRatings);
    expect(p.conversation).toEqual(original.conversation);
    expect(p[key]).toEqual(initialProgress()[key]);
    expect(p.pass1CompletedAt).toBe(original.pass1CompletedAt);
  });
  it.each(["output", "review", "writing", "about", "grammar"] as const)("routes and resumes %s without overwriting My Story position", (key) => {
    const initial = updateProgress(initialProgress(), { type: "practice" });
    const p = updateProgress(initial, { type: "navigate", screen: key });
    const overview = updateProgress(p, { type: "navigate", screen: "overview" });
    const restored = parseProgress(JSON.stringify(overview));
    expect(restored.resumeScreen).toBe("recall");
    expect(restored.lastSection).toBe(key);
    expect(updateProgress(restored, { type: "resume" }).currentScreen).toBe(key);
    expect(updateProgress(p, { type: "navigate", screen: "complete" }).lastSection).toBe(key);
  });
  it("replaces a section without erasing other sections and safely parses historical timestamp", () => {
    const original = initialProgress();
    const p = updateProgress(original, { type: "grammar", value: { studied: true } });
    expect(p.grammar.studied).toBe(true);
    expect(p.currentScreen).toBe("grammar");
    expect(p.output).toBe(original.output);
    expect(p.writing).toBe(original.writing);
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
    expect(parseProgress(JSON.stringify({ ...p, pass1CompletedAt: "invalid" })).pass1CompletedAt).toBeNull();
  });
  it("keeps learner writing private to its section, never making it a review target", () => {
    const p = readyProgress();
    const pool = buildReviewItems({ chunkRatings: p.chunkRatings, conversationRatings: p.conversation.ratings, outputRatings: p.output.ratings });
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every(item => allReviewExercises.some(source => source.id === item.id))).toBe(true);
    expect(JSON.stringify(pool)).not.toContain(p.writing.completedText!);
  });
});
