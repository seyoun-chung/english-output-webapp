import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { completionForPass, isPassReady } from "../src/chapterCompletion";
import { exactExercises, outputExercises, pass2ReviewExercises, variationExercises } from "../src/data/outputPractice";
import { rateReview, startReview } from "../src/exerciseProgress";
import { activePassProgress, initialPassProgress, initialProgress, parseProgress, updateProgress, type PassProgress, type Progress } from "../src/progress";
import { completeAboutAnswer, completeWriting, editAboutAnswer, editWritingDraft } from "../src/writingProgress";

afterEach(() => vi.unstubAllGlobals());

function readyPass(passNumber: 1 | 2): PassProgress {
  const pass = initialPassProgress(passNumber);
  pass.fullRecallCompleted = true;
  pass.conversation.fullRecallCompleted = true;
  for (const id of Object.keys(pass.conversation.ratings)) pass.conversation.ratings[Number(id)] = "effort";
  for (const item of passNumber === 1 ? exactExercises : variationExercises) pass.output.ratings[item.id] = "review";
  pass.writing = completeWriting(editWritingDraft(pass.writing, `My Pass ${passNumber} story.`));
  if (passNumber === 2) {
    let review = startReview(pass.review, pass2ReviewExercises.map(item => item.id));
    for (const _item of pass2ReviewExercises) review = rateReview(review, "effort");
    pass.review = review;
  }
  return pass;
}

function completedThroughPass2(): Progress {
  let chapter = initialProgress();
  chapter.passes[1] = readyPass(1);
  chapter = updateProgress(chapter, { type: "finishPass" });
  chapter = updateProgress(chapter, { type: "startPass2" });
  chapter.passes[2] = readyPass(2);
  return updateProgress(chapter, { type: "finishPass" });
}

function readyPass3(): PassProgress {
  const pass = initialPassProgress(3);
  pass.fullRecallCompleted = true;
  pass.conversation.fullRecallCompleted = true;
  for (const id of Object.keys(pass.conversation.ratings)) pass.conversation.ratings[Number(id)] = "effort";
  for (const item of outputExercises) pass.output.ratings[item.id] = "review";
  pass.output.finished["no-hint"] = true;
  pass.grammar.studied = true;
  pass.about = completeAboutAnswer(editAboutAnswer(pass.about, "My own answer."));
  pass.writing = completeWriting(editWritingDraft(pass.writing, "My new Pass 3 story."));
  let review = startReview(pass.review, pass2ReviewExercises.map(item => item.id));
  for (const _item of pass2ReviewExercises) review = rateReview(review, "effort");
  pass.review = review;
  return pass;
}

function render(progress: Progress) {
  vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(progress) });
  return renderToStaticMarkup(createElement(App));
}

describe("version 4 and Pass 3 isolation", () => {
  it("migrates version 3 while preserving Pass 1 and Pass 2", () => {
    const original = completedThroughPass2();
    const legacy = { ...original, version: 3, passes: { 1: original.passes[1], 2: original.passes[2] } };
    const migrated = parseProgress(JSON.stringify(legacy));
    expect(migrated.version).toBe(4);
    expect(migrated.passes[1]).toEqual(original.passes[1]);
    expect(migrated.passes[2]).toEqual(original.passes[2]);
    expect(migrated.passes[3]).toBeNull();
  });

  it("requires an explicitly completed Pass 2 before creating Pass 3", () => {
    const initial = initialProgress();
    expect(updateProgress(initial, { type: "startPass3" })).toBe(initial);
    const completed = completedThroughPass2();
    const snapshots = JSON.stringify(completed.passes);
    const started = updateProgress(completed, { type: "startPass3" });
    expect(started.activePass).toBe(3);
    expect(started.passes[3]).toEqual(initialPassProgress(3));
    expect(started.passes[3]?.resumeScreen).toBe("full");
    expect(started.passes[3]?.output.mode).toBe("no-hint");
    expect(JSON.stringify({ 1: started.passes[1], 2: started.passes[2], 3: null })).toBe(snapshots);
  });

  it("requires all seven Pass 3 areas and preserves prior passes", () => {
    let chapter = updateProgress(completedThroughPass2(), { type: "startPass3" });
    const prior = JSON.stringify({ 1: chapter.passes[1], 2: chapter.passes[2] });
    chapter = { ...chapter, passes: { ...chapter.passes, 3: readyPass3() } };
    expect(completionForPass(activePassProgress(chapter)).map(item => item.id)).toEqual(["myStory", "conversation", "output", "grammar", "about", "writing", "review"]);
    expect(isPassReady(activePassProgress(chapter))).toBe(true);
    const completed = updateProgress(chapter, { type: "finishPass" });
    expect(activePassProgress(completed).currentScreen).toBe("complete");
    expect(JSON.stringify({ 1: completed.passes[1], 2: completed.passes[2] })).toBe(prior);
    expect(parseProgress(JSON.stringify(completed))).toEqual(completed);
  });

  it.each(["myStory", "conversation", "output", "grammar", "about", "writing", "review"] as const)("does not finish Pass 3 without %s", section => {
    const pass = readyPass3();
    if (section === "myStory") pass.fullRecallCompleted = false;
    if (section === "conversation") pass.conversation.ratings[1] = null;
    if (section === "output") delete pass.output.ratings[outputExercises[0].id];
    if (section === "grammar") pass.grammar.studied = false;
    if (section === "about") pass.about.completedQuestionIds = [];
    if (section === "writing") pass.writing.completed = false;
    if (section === "review") pass.review.completed = false;
    expect(isPassReady(pass)).toBe(false);
  });
});

describe("Pass 3 Complete UI", () => {
  it("shows every required area and explicit no-hint focus", () => {
    const html = render(updateProgress(completedThroughPass2(), { type: "startPass3" }));
    expect(html).toContain("PASS 3 · COMPLETE");
    expect(html).toContain("7 Required areas");
    expect(html).toContain("Output No Hint");
    expect(html).toContain("Grammar Focus");
    expect(html).toContain("What About You?");
    expect(html).toContain("Chapter Review");
  });

  it("renders the final Chapter 3 completion after explicit finish", () => {
    let chapter = updateProgress(completedThroughPass2(), { type: "startPass3" });
    chapter = { ...chapter, passes: { ...chapter.passes, 3: readyPass3() } };
    chapter = updateProgress(chapter, { type: "finishPass" });
    const html = render(chapter);
    expect(html).toContain("Chapter 3 · Pass 3 complete");
    expect(html).toContain("All seven required areas are complete");
    expect(html).toContain("Back to Chapter 3 overview");
  });
});
