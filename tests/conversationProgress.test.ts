import { describe, expect, it } from "vitest";
import { initialConversationProgress, updateConversationProgress, parseConversationProgress, isRoleComplete, isConversationComplete, type ConversationAction } from "../src/conversationProgress";
import { activePassProgress, initialPassProgress, initialProgress, parseProgress, updateProgress, STORAGE_KEY } from "../src/progress";

describe("Real Conversations progress", () => {
  it("rates each role independently and completes only after both roles and Full Dialogue", () => {
    let p = updateConversationProgress(initialConversationProgress(), { type: "role", role: "A" });
    for (let i = 0; i < 4; i++) p = updateConversationProgress(p, { type: "rate", rating: "effort" });
    expect(p.view).toBe("role-summary");
    expect(isRoleComplete(p, "A")).toBe(true);
    expect(isRoleComplete(p, "B")).toBe(false);
    expect(isConversationComplete(p)).toBe(false);
    p = updateConversationProgress(p, { type: "role", role: "B" });
    for (let i = 0; i < 3; i++) p = updateConversationProgress(p, { type: "rate", rating: "review" });
    expect(isRoleComplete(p, "B")).toBe(true);
    expect(isConversationComplete(p)).toBe(false);
    p = updateConversationProgress(p, { type: "view", view: "full" });
    p = updateConversationProgress(p, { type: "complete" });
    expect(isConversationComplete(p)).toBe(true);
    expect(p.ratings).toEqual({ 1: "effort", 2: "review", 3: "effort", 4: "review", 5: "effort", 6: "review", 7: "effort" });
  });

  it("allows Full Dialogue first without declaring section completion or forcing role access", () => {
    let p = updateConversationProgress(initialConversationProgress(), { type: "view", view: "full" });
    p = updateConversationProgress(p, { type: "complete" });
    expect(p.fullRecallCompleted).toBe(true);
    expect(isConversationComplete(p)).toBe(false);
    expect(updateConversationProgress(p, { type: "role", role: "B" }).view).toBe("role");
  });

  it("restores independent role positions, read mode and maximum hints", () => {
    let p = updateConversationProgress(initialConversationProgress(), { type: "role", role: "A" });
    p = updateConversationProgress(p, { type: "hint", level: 2 });
    p = updateConversationProgress(p, { type: "hint", level: 1 });
    p = updateConversationProgress(p, { type: "rate", rating: "immediate" });
    p = updateConversationProgress(p, { type: "role", role: "B" });
    p = updateConversationProgress(p, { type: "rate", rating: "review" });
    p = updateConversationProgress(p, { type: "role", role: "A" });
    p = updateConversationProgress(p, { type: "readMode", mode: "together" });
    expect(p.positions).toEqual({ A: 1, B: 1 });
    expect(p.hintUsage[1]).toBe(2);
    expect(parseConversationProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
    p = updateConversationProgress(p, { type: "role", role: "A", restart: true });
    expect(p.positions).toEqual({ A: 0, B: 1 });
    expect(p.ratings[1]).toBe("immediate");
    expect(updateConversationProgress(p, { type: "previous" }).positions.A).toBe(0);
  });

  it.each(["read", "full", "role-summary"] as const)("ignores role-only actions from %s", (view) => {
    const p = { ...initialConversationProgress(), view };
    const actions: ConversationAction[] = [{ type: "hint", level: 2 }, { type: "rate", rating: "review" }, { type: "previous" }];
    for (const action of actions) expect(updateConversationProgress(p, action)).toBe(p);
    if (view !== "full") expect(updateConversationProgress(p, { type: "complete" })).toBe(p);
  });

  it("does not allow role mode to mark Full Dialogue complete", () => {
    const p = updateConversationProgress(initialConversationProgress(), { type: "role", role: "A" });
    expect(updateConversationProgress(p, { type: "complete" })).toBe(p);
  });

  it.each([
    null, [], {},
    { ...initialConversationProgress(), role: "C" },
    { ...initialConversationProgress(), positions: { A: 4, B: 0 } },
    { ...initialConversationProgress(), positions: { A: 0, B: -1 } },
    { ...initialConversationProgress(), positions: { A: 0.5, B: 0 } },
    { ...initialConversationProgress(), ratings: {} },
    { ...initialConversationProgress(), hintUsage: {} },
    { ...initialConversationProgress(), fullRecallCompleted: "true" },
  ])("rejects malformed conversation state %#", (raw) => {
    expect(parseConversationProgress(raw)).toBeNull();
  });

  it("strips unknown fields and recovers inconsistent summary views", () => {
    const p = initialConversationProgress();
    expect(parseConversationProgress({ ...p, recording: "blob:test", transcript: "private", ratings: { ...p.ratings, 999: "review" } })).toEqual(p);
    expect(parseConversationProgress({ ...p, view: "role-summary" })?.view).toBe("role");
  });
});

describe("versioned combined storage", () => {
  const legacy = {
    version: 1, chapterId: 3, pass: 1, currentScreen: "overview", resumeScreen: "recall", readMode: "together",
    queue: [2, 4], queueIndex: 1,
    chunkRatings: { 1: "immediate", 2: "effort", 3: null, 4: "review", 5: null, 6: "immediate" },
    hintUsage: { 1: 0, 2: 2, 3: 0, 4: 1, 5: 0, 6: 0 }, fullRecallCompleted: true,
    lastStudiedAt: "2026-09-22T12:00:00.000Z",
  };
  it("migrates a real version 1 shape without dropping any My Story fields", () => {
    const progress = parseProgress(JSON.stringify(legacy));
    const pass = progress.passes[1];
    expect(progress.version).toBe(4);
    expect(progress.activePass).toBe(1);
    expect(pass.queue).toEqual(legacy.queue);
    expect(pass.queueIndex).toBe(legacy.queueIndex);
    expect(pass.chunkRatings).toEqual(legacy.chunkRatings);
    expect(pass.hintUsage).toEqual(legacy.hintUsage);
    expect(pass.fullRecallCompleted).toBe(true);
    expect(pass.readMode).toBe("together");
    expect(pass.resumeScreen).toBe("recall");
    expect(pass.lastStudiedAt).toBe(legacy.lastStudiedAt);
    expect(pass.conversation).toEqual(initialConversationProgress());
    expect(progress.passes[2]).toBeNull();
    expect(STORAGE_KEY).toBe("english-output-webapp:progress");
    expect(activePassProgress(updateProgress(progress, { type: "resume" })).currentScreen).toBe("recall");
  });

  it("round-trips both sections in one structure and resumes the last section", () => {
    let progress = parseProgress(JSON.stringify(legacy));
    progress = updateProgress(progress, { type: "conversation", action: { type: "role", role: "B" } });
    progress = updateProgress(progress, { type: "conversation", action: { type: "rate", rating: "effort" } });
    progress = updateProgress(progress, { type: "navigate", screen: "overview" });
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
    expect(activePassProgress(updateProgress(parseProgress(JSON.stringify(progress)), { type: "resume" })).currentScreen).toBe("conversation");
    expect(activePassProgress(progress).resumeScreen).toBe("recall");
    expect(activePassProgress(progress).queue).toEqual(legacy.queue);
    expect(activePassProgress(progress).chunkRatings).toEqual(legacy.chunkRatings);
    progress = updateProgress(progress, { type: "navigate", screen: "read" });
    expect(activePassProgress(progress).lastSection).toBe("myStory");
    expect(activePassProgress(progress).conversation.ratings[2]).toBe("effort");
  });

  it("navigation to conversation preserves story resume location", () => {
    const progress = updateProgress(parseProgress(JSON.stringify(legacy)), { type: "navigate", screen: "conversation" });
    expect(activePassProgress(progress).lastSection).toBe("conversation");
    expect(activePassProgress(progress).resumeScreen).toBe("recall");
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
  });

  it("keeps valid story data when conversation storage is damaged", () => {
    const pass = parseProgress(JSON.stringify({ ...legacy, version: 2, conversation: { role: "bad" }, lastSection: "conversation" })).passes[1];
    expect(pass.chunkRatings).toEqual(legacy.chunkRatings);
    expect(pass.queue).toEqual([2, 4]);
    expect(pass.conversation).toEqual(initialConversationProgress());
    expect(pass.lastSection).toBe("myStory");
  });

  it("keeps valid conversation data when story storage is damaged", () => {
    let conversation = updateConversationProgress(initialConversationProgress(), { type: "role", role: "B" });
    conversation = updateConversationProgress(conversation, { type: "rate", rating: "review" });
    const legacyPass = initialPassProgress(1);
    const { completedAt: _completedAt, ...fields } = legacyPass;
    const progress = parseProgress(JSON.stringify({ version: 2, chapterId: 3, ...fields, queue: [], conversation, lastSection: "conversation", pass1CompletedAt: null }));
    expect(progress.passes[1].conversation).toEqual(conversation);
    expect(progress.passes[1].chunkRatings).toEqual(initialPassProgress(1).chunkRatings);
    expect(activePassProgress(updateProgress(progress, { type: "resume" })).currentScreen).toBe("conversation");
  });

  it("does not retain injected recording/transcript fields in parsed storage", () => {
    const progress = initialProgress();
    const injected = { ...progress, audio: "private", transcript: "private", passes: { ...progress.passes, 1: { ...progress.passes[1], conversation: { ...progress.passes[1].conversation, audio: "private" } } } };
    expect(parseProgress(JSON.stringify(injected))).toEqual(progress);
  });

  it("does not let stale My Story controls alter state on a conversation screen", () => {
    const progress = updateProgress(initialProgress(), { type: "navigate", screen: "conversation" });
    expect(updateProgress(progress, { type: "rate", rating: "review" })).toBe(progress);
    expect(updateProgress(progress, { type: "hint", level: 2 })).toBe(progress);
    expect(updateProgress(progress, { type: "previous" })).toBe(progress);
    expect(updateProgress(progress, { type: "complete" })).toBe(progress);
  });
});
