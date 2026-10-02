import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { exactExercises, exerciseGroup, pass2ReviewExercises, variationExercises } from "../src/data/outputPractice";
import { ratePractice, rateReview, startReview } from "../src/exerciseProgress";
import { completeWriting, editWritingDraft } from "../src/writingProgress";
import { activePassProgress, initialPassProgress, initialProgress, parseProgress, updateProgress, type PassProgress, type Progress } from "../src/progress";
import { completionForPass, isPassReady } from "../src/chapterCompletion";

afterEach(() => vi.unstubAllGlobals());

function readyPass1(): PassProgress {
  const pass = initialPassProgress(1);
  pass.fullRecallCompleted = true;
  pass.conversation.fullRecallCompleted = true;
  for (const id of Object.keys(pass.conversation.ratings)) pass.conversation.ratings[Number(id)] = "effort";
  for (const item of exactExercises) pass.output.ratings[item.id] = "review";
  pass.writing = completeWriting(editWritingDraft(pass.writing, "My Pass 1 story."));
  return pass;
}

function completedPass1Chapter(): Progress {
  const progress = initialProgress();
  progress.passes[1] = readyPass1();
  return updateProgress(progress, { type: "finishPass" });
}

function readyPass2(): PassProgress {
  const pass = initialPassProgress(2);
  pass.fullRecallCompleted = true;
  pass.conversation.fullRecallCompleted = true;
  for (const id of Object.keys(pass.conversation.ratings)) pass.conversation.ratings[Number(id)] = "effort";
  for (const item of variationExercises) pass.output.ratings[item.id] = "review";
  let review = startReview(pass.review, pass2ReviewExercises.map(item => item.id));
  for (const _item of pass2ReviewExercises) review = rateReview(review, "effort");
  pass.review = review;
  pass.writing = completeWriting(editWritingDraft(pass.writing, "My new Pass 2 story."));
  return pass;
}

function render(progress: Progress) {
  vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(progress) });
  return renderToStaticMarkup(createElement(App));
}

describe("version 3 migration and pass isolation", () => {
  it("migrates every valid version 2 Pass 1 field without creating Pass 2", () => {
    const original = readyPass1();
    original.completedAt = "2026-09-30T12:00:00.000Z";
    original.currentScreen = "review";
    original.lastSection = "review";
    original.queue = [2, 4, 6];
    original.queueIndex = 1;
    original.hintUsage[2] = 2;
    const { completedAt, ...fields } = original;
    const legacy = { version: 2, chapterId: 3, ...fields, pass1CompletedAt: completedAt };

    const migrated = parseProgress(JSON.stringify(legacy));

    expect(migrated).toEqual({ version: 4, chapterId: 3, activePass: 1, passes: { 1: original, 2: null, 3: null } });
  });

  it("requires explicit completed Pass 1 before creating Pass 2", () => {
    const initial = initialProgress();
    expect(updateProgress(initial, { type: "startPass2" })).toBe(initial);

    const completed = completedPass1Chapter();
    const pass1Snapshot = JSON.stringify(completed.passes[1]);
    const started = updateProgress(completed, { type: "startPass2" });

    expect(started.activePass).toBe(2);
    expect(JSON.stringify(started.passes[1])).toBe(pass1Snapshot);
    expect(started.passes[2]).toEqual(initialPassProgress(2));
    expect(started.passes[2]?.resumeScreen).toBe("full");
    expect(started.passes[2]?.output.mode).toBe("variation");
  });

  it("stores Pass 2 My Story separately and restores both passes after reload", () => {
    let progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    const pass1Snapshot = JSON.stringify(progress.passes[1]);
    progress = updateProgress(progress, { type: "navigate", screen: "full" });
    progress = updateProgress(progress, { type: "complete" });

    expect(activePassProgress(progress).fullRecallCompleted).toBe(true);
    expect(JSON.stringify(progress.passes[1])).toBe(pass1Snapshot);
    expect(progress.passes[1].fullRecallCompleted).toBe(true);

    const restored = parseProgress(JSON.stringify(progress));
    expect(restored).toEqual(progress);
    const pass1 = updateProgress(restored, { type: "selectPass", pass: 1 });
    expect(pass1.activePass).toBe(1);
    expect(pass1.passes[2]?.fullRecallCompleted).toBe(true);
  });

  it("opens all Increment 3 core screens while keeping later optional screens unavailable", () => {
    let progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    for (const screen of ["read", "recall", "full", "conversation", "output"] as const) {
      progress = updateProgress(progress, { type: "navigate", screen });
      expect(activePassProgress(progress).currentScreen).toBe(screen);
    }
    for (const screen of ["writing", "review", "complete"] as const) {
      progress = updateProgress(progress, { type: "navigate", screen });
      expect(activePassProgress(progress).currentScreen).toBe(screen);
    }
    for (const screen of ["grammar", "about"] as const) {
      expect(activePassProgress(updateProgress(progress, { type: "navigate", screen })).currentScreen).toBe("complete");
    }
  });

  it("stores Pass 2 conversation and variation ratings without changing Pass 1", () => {
    let progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    const pass1Snapshot = JSON.stringify(progress.passes[1]);
    progress = updateProgress(progress, { type: "navigate", screen: "conversation" });
    progress = updateProgress(progress, { type: "conversation", action: { type: "role", role: "A" } });
    progress = updateProgress(progress, { type: "conversation", action: { type: "rate", rating: "effort" } });
    progress = updateProgress(progress, { type: "navigate", screen: "output" });
    progress = updateProgress(progress, { type: "output", value: ratePractice(activePassProgress(progress).output, "review") });

    const restored = parseProgress(JSON.stringify(progress));
    expect(JSON.stringify(restored.passes[1])).toBe(pass1Snapshot);
    expect(restored.passes[2]?.conversation.ratings[1]).toBe("effort");
    expect(restored.passes[2]?.output.ratings[variationExercises[0].id]).toBe("review");
    expect(restored.passes[2]?.output.mode).toBe("variation");
  });
});

describe("Pass 2 Increment 3 UI", () => {
  it("offers an explicit Pass 2 entry only after Pass 1 completion", () => {
    expect(render(initialProgress())).not.toContain("Start Pass 2");
    const html = render(completedPass1Chapter());
    expect(html).toContain("Start Pass 2");
    expect(html).toContain("Review Pass 1");
    expect(html).toContain("Your Pass 1 progress is saved.");
  });

  it("shows five active core flows and keeps later optional areas non-blocking", () => {
    const progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    const html = render(progress);
    expect(html).toContain("PASS 2 · REINFORCE");
    expect(html).toContain("Pass 2 focus");
    expect(html).toContain("Start with Full Recall");
    expect(html).toContain("Start Full Recall");
    expect(html).toContain("Review Pass 1");
    expect(html).toContain("5 Core areas");
    expect(html).toContain("6 Recall + 6 Output");
    expect(html).toContain("Complete one new draft");
    expect(html).toContain("Play A · Play B · Full Dialogue");
    expect(html).toContain("Start with 6 source variations");
    expect(html).toMatch(/<button class="section-row available">[^]*?Real Conversations/);
    expect(html).toMatch(/<button class="section-row available">[^]*?Output Practice/);
    expect(html).toMatch(/<button class="section-row available">[^]*?Weekly Writing/);
    expect(html).toMatch(/<button class="section-row available">[^]*?Chapter Review/);
    expect(html).toMatch(/<button class="section-row" disabled="">[^]*?Grammar Focus[^]*?Next pass/);
  });

  it("moves from Pass 2 Full Recall to Real Conversations", () => {
    let progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    progress = updateProgress(progress, { type: "navigate", screen: "full" });
    const before = render(progress);
    expect(before).toContain("CHAPTER 3 · PASS 2 · CORE");
    expect(before).toContain("My Story · Korean");
    expect(before).toContain("Done speaking");

    progress = updateProgress(progress, { type: "complete" });
    const completed = render(progress);
    expect(completed).toContain("My Story reinforced");
    expect(completed).toContain("Back to overview");
    const reflection = completed.match(/<section class="panel reflection">[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(reflection).toContain("Next: Real Conversations");
  });

  it("opens Pass 2 Output Practice in Variation and hands off to Chapter Review", () => {
    let progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    progress = updateProgress(progress, { type: "navigate", screen: "output" });
    const before = render(progress);
    expect(before).toContain("6 source variations in the core set");
    expect(before).toContain(variationExercises[0].korean);
    let output = activePassProgress(progress).output;
    for (const _item of variationExercises) output = ratePractice(output, "effort");
    progress = updateProgress(progress, { type: "output", value: output });
    const html = render(progress);
    expect(html).toContain("CHAPTER 3 · PASS 2 · CORE");
    expect(html).toContain("Variation completed ✓");
    expect(html).toContain('class="primary" aria-pressed="true">Variation</button>');
    expect(html).toContain("Next: Chapter Review");
  });

  it("uses a fixed source-locked 6 Recall + 6 Output review set", () => {
    expect(pass2ReviewExercises).toHaveLength(12);
    expect(pass2ReviewExercises.filter(item => exerciseGroup(item.id) === "output")).toHaveLength(6);
    expect(pass2ReviewExercises.filter(item => exerciseGroup(item.id) !== "output")).toHaveLength(6);
    expect(new Set(pass2ReviewExercises.map(item => item.id)).size).toBe(12);
    expect(pass2ReviewExercises.every(item => item.source.file && item.english.length > 0)).toBe(true);
    let progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    progress = updateProgress(progress, { type: "navigate", screen: "review" });
    const html = render(progress);
    expect(html).toContain("Balanced Chapter Review");
    expect(html).toContain("12 items");
    expect(html).toContain("6 Recall + 6 Output");
  });

  it("requires all five core areas, finishes explicitly, restores after reload, and preserves Pass 1", () => {
    let chapter = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    const pass1Snapshot = JSON.stringify(chapter.passes[1]);
    chapter = { ...chapter, passes: { ...chapter.passes, 2: readyPass2() } };
    expect(completionForPass(activePassProgress(chapter)).map(item => item.id)).toEqual(["myStory", "conversation", "output", "review", "writing"]);
    expect(isPassReady(activePassProgress(chapter))).toBe(true);
    expect(activePassProgress(chapter).completedAt).toBeNull();
    const completed = updateProgress(chapter, { type: "finishPass" });
    expect(activePassProgress(completed).currentScreen).toBe("complete");
    expect(Number.isFinite(Date.parse(activePassProgress(completed).completedAt!))).toBe(true);
    expect(JSON.stringify(completed.passes[1])).toBe(pass1Snapshot);
    expect(parseProgress(JSON.stringify(completed))).toEqual(completed);
    expect(render(completed)).toContain("Chapter 3 · Pass 2 complete");
  });

  it.each(["myStory", "conversation", "output", "review", "writing"] as const)("does not finish Pass 2 without %s", section => {
    const pass = readyPass2();
    if (section === "myStory") pass.fullRecallCompleted = false;
    if (section === "conversation") pass.conversation.ratings[1] = null;
    if (section === "output") delete pass.output.ratings[variationExercises[0].id];
    if (section === "review") pass.review.completed = false;
    if (section === "writing") pass.writing.completed = false;
    const chapter = { ...completedPass1Chapter(), activePass: 2 as const, passes: { 1: completedPass1Chapter().passes[1], 2: pass } };
    expect(isPassReady(pass)).toBe(false);
    expect(updateProgress(chapter, { type: "finishPass" })).toBe(chapter);
  });
});
