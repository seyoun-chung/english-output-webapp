import { describe, expect, it } from "vitest";
import { activePassProgress, initialPassProgress, initialProgress, parseProgress, updateProgress, type PassProgress, type Progress } from "../src/progress";
import { coreCompletion, isPassReady } from "../src/chapterCompletion";
import { exactExercises, buildReviewItems, allReviewExercises } from "../src/data/outputPractice";
import { completeWriting, editWritingDraft } from "../src/writingProgress";

function readyPass(): PassProgress {
  const pass = initialPassProgress(1);
  pass.fullRecallCompleted = true;
  pass.conversation.fullRecallCompleted = true;
  for (const id of Object.keys(pass.conversation.ratings)) pass.conversation.ratings[Number(id)] = "effort";
  for (const item of exactExercises) pass.output.ratings[item.id] = "review";
  pass.writing = completeWriting(editWritingDraft(pass.writing, "My own learning reflection."));
  return pass;
}

function chapterWith(pass: PassProgress): Progress {
  const progress = initialProgress();
  progress.passes[1] = pass;
  return progress;
}

function legacyV2(pass: PassProgress) {
  const { completedAt, ...fields } = pass;
  return { version: 2, chapterId: 3, ...fields, pass1CompletedAt: completedAt };
}

describe("Chapter 3 Pass 1 completion", () => {
  it("uses four core sections, not optional areas or review, and is not a mastery grade", () => {
    const pass = readyPass();
    expect(coreCompletion(pass).map(({ id }) => id)).toEqual(["myStory", "conversation", "output", "writing"]);
    expect(pass.grammar.studied).toBe(false);
    expect(pass.about.completedQuestionIds).toEqual([]);
    expect(pass.review.completed).toBe(false);
    expect(isPassReady(pass)).toBe(true);
  });
  it.each(["myStory", "conversation", "output", "writing"] as const)("requires %s", (section) => {
    const pass = readyPass();
    if (section === "myStory") pass.fullRecallCompleted = false;
    if (section === "conversation") pass.conversation.ratings[2] = null;
    if (section === "output") pass.output.ratings = {};
    if (section === "writing") pass.writing.completed = false;
    expect(isPassReady(pass)).toBe(false);
    const progress = chapterWith(pass);
    expect(updateProgress(progress, { type: "finishPass" })).toBe(progress);
  });
  it("requires explicit completion, records a date, preserves section and never advances pass", () => {
    const pass = readyPass();
    const progress = chapterWith(pass);
    expect(pass.completedAt).toBeNull();
    const completed = updateProgress(progress, { type: "finishPass" });
    const completedPass = activePassProgress(completed);
    expect(completedPass.currentScreen).toBe("complete");
    expect(completedPass.lastSection).toBe(pass.lastSection);
    expect(Number.isFinite(Date.parse(completedPass.completedAt!))).toBe(true);
    expect(completedPass.pass).toBe(1);
    expect(activePassProgress(updateProgress(completed, { type: "finishPass" })).completedAt).toBe(completedPass.completedAt);
    expect(parseProgress(JSON.stringify(completed))).toEqual(completed);
  });
  it("historical completion never overrides current readiness after a draft changes", () => {
    const completed = updateProgress(chapterWith(readyPass()), { type: "finishPass" });
    const pass = activePassProgress(completed);
    const changed = updateProgress(completed, { type: "writing", value: { ...pass.writing, completed: false } });
    expect(activePassProgress(changed).completedAt).toBe(pass.completedAt);
    expect(isPassReady(activePassProgress(changed))).toBe(false);
  });
  it("never hard locks Pass 1 learning screens before completion", () => {
    for (const screen of ["output", "review", "writing", "about", "grammar", "complete"] as const) {
      expect(activePassProgress(updateProgress(initialProgress(), { type: "navigate", screen })).currentScreen).toBe(screen);
    }
  });
});

describe("independent section storage", () => {
  it("accepts provisional version 2 without newly added fields", () => {
    const initial = initialPassProgress(1);
    const raw = legacyV2(initial) as Record<string, unknown>;
    for (const key of ["output", "review", "writing", "about", "grammar", "pass1CompletedAt"]) delete raw[key];
    (raw.chunkRatings as Record<number, string | null>)[1] = "effort";
    (raw.conversation as PassProgress["conversation"]).ratings[2] = "review";
    const pass = parseProgress(JSON.stringify(raw)).passes[1];
    expect(pass.chunkRatings[1]).toBe("effort");
    expect(pass.conversation.ratings[2]).toBe("review");
    expect(pass.output).toEqual(initial.output);
    expect(pass.review).toEqual(initial.review);
    expect(pass.writing).toEqual(initial.writing);
    expect(pass.about).toEqual(initial.about);
    expect(pass.grammar).toEqual(initial.grammar);
    expect(pass.completedAt).toBeNull();
  });
  it.each(["output", "review", "writing", "about", "grammar"] as const)("recovers only damaged %s and preserves both earlier sections", (key) => {
    const original = initialPassProgress(1);
    original.chunkRatings[1] = "immediate";
    original.conversation.ratings[2] = "review";
    original.completedAt = "2026-09-23T00:00:00.000Z";
    const raw = { ...legacyV2(original), [key]: "broken" };
    const pass = parseProgress(JSON.stringify(raw)).passes[1];
    expect(pass.chunkRatings).toEqual(original.chunkRatings);
    expect(pass.conversation).toEqual(original.conversation);
    expect(pass[key]).toEqual(initialPassProgress(1)[key]);
    expect(pass.completedAt).toBe(original.completedAt);
  });
  it.each(["output", "review", "writing", "about", "grammar"] as const)("routes and resumes %s without overwriting My Story position", (key) => {
    let progress = updateProgress(initialProgress(), { type: "practice" });
    progress = updateProgress(progress, { type: "navigate", screen: key });
    const overview = updateProgress(progress, { type: "navigate", screen: "overview" });
    const restored = parseProgress(JSON.stringify(overview));
    expect(activePassProgress(restored).resumeScreen).toBe("recall");
    expect(activePassProgress(restored).lastSection).toBe(key);
    expect(activePassProgress(updateProgress(restored, { type: "resume" })).currentScreen).toBe(key);
    expect(activePassProgress(updateProgress(progress, { type: "navigate", screen: "complete" })).lastSection).toBe(key);
  });
  it("replaces a section without erasing other sections and safely parses historical timestamp", () => {
    const original = initialProgress();
    const changed = updateProgress(original, { type: "grammar", value: { studied: true } });
    expect(activePassProgress(changed).grammar.studied).toBe(true);
    expect(activePassProgress(changed).currentScreen).toBe("grammar");
    expect(activePassProgress(changed).output).toBe(activePassProgress(original).output);
    expect(parseProgress(JSON.stringify(changed))).toEqual(changed);
    const damaged = { ...changed, passes: { ...changed.passes, 1: { ...changed.passes[1], completedAt: "invalid" } } };
    expect(parseProgress(JSON.stringify(damaged)).passes[1].completedAt).toBeNull();
  });
  it("keeps learner writing private to its section, never making it a review target", () => {
    const pass = readyPass();
    const pool = buildReviewItems({ chunkRatings: pass.chunkRatings, conversationRatings: pass.conversation.ratings, outputRatings: pass.output.ratings });
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every(item => allReviewExercises.some(source => source.id === item.id))).toBe(true);
    expect(JSON.stringify(pool)).not.toContain(pass.writing.completedText!);
  });
});
