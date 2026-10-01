import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { exactExercises } from "../src/data/outputPractice";
import { completeWriting, editWritingDraft } from "../src/writingProgress";
import { activePassProgress, initialPassProgress, initialProgress, parseProgress, updateProgress, type PassProgress, type Progress } from "../src/progress";

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

    expect(migrated).toEqual({ version: 3, chapterId: 3, activePass: 1, passes: { 1: original, 2: null } });
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

  it("keeps Increment 2 screens unavailable while preserving My Story support paths", () => {
    let progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    expect(activePassProgress(updateProgress(progress, { type: "navigate", screen: "conversation" })).currentScreen).toBe("overview");
    for (const screen of ["read", "recall", "full"] as const) {
      progress = updateProgress(progress, { type: "navigate", screen });
      expect(activePassProgress(progress).currentScreen).toBe(screen);
    }
  });
});

describe("Pass 2 Increment 1 UI", () => {
  it("offers an explicit Pass 2 entry only after Pass 1 completion", () => {
    expect(render(initialProgress())).not.toContain("Start Pass 2");
    const html = render(completedPass1Chapter());
    expect(html).toContain("Start Pass 2");
    expect(html).toContain("Review Pass 1");
    expect(html).toContain("Your Pass 1 progress is saved.");
  });

  it("shows a dedicated Reinforce overview with Full Recall as the only active core flow", () => {
    const progress = updateProgress(completedPass1Chapter(), { type: "startPass2" });
    const html = render(progress);
    expect(html).toContain("PASS 2 · REINFORCE");
    expect(html).toContain("Pass 2 focus");
    expect(html).toContain("Start with Full Recall");
    expect(html).toContain("Start Full Recall");
    expect(html).toContain("Review Pass 1");
    expect(html).toContain("Next increment");
    expect(html).toMatch(/<button class="section-row" disabled="">[^]*?Real Conversations[^]*?Coming later/);
  });

  it("centers Pass 2 on Full Recall and stops at the Increment 1 boundary", () => {
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
    expect(reflection).not.toContain("Next: Real Conversations");
  });
});
