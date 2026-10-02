import { describe, expect, it } from "vitest";
import { chapter1Content } from "../src/data/chapter1";
import { chapter3Content } from "../src/data/chapterContent";
import { initialProgress } from "../src/progress";
import {
  collectLearnedItems,
  initialAutomaticProgress,
  parseAutomaticProgress,
  shuffledKeys,
  smartReviewOrder,
  updateAutomaticProgress,
  type LearnedItem,
} from "../src/automaticProgress";

function learnedItem(overrides: Partial<LearnedItem> & Pick<LearnedItem, "key">): LearnedItem {
  return {
    chapterId: 3,
    item: chapter3Content.exercises.review[0],
    rating: "immediate",
    hintUsage: 0,
    lastStudiedAt: "2026-10-01T00:00:00.000Z",
    sourcePass: 1,
    ...overrides,
  };
}

describe("Pass 4+ Automatic progress", () => {
  it("includes only source items that the learner has self-rated", () => {
    const chapter1 = initialProgress(chapter1Content);
    const chapter3 = initialProgress(chapter3Content);
    chapter1.passes[1].chunkRatings[1] = "effort";
    chapter3.passes[1].chunkRatings[1] = "review";

    const items = collectLearnedItems(
      { 1: chapter1, 3: chapter3 },
      { 1: chapter1Content, 3: chapter3Content },
    );

    expect(items.map((item) => item.key)).toEqual(["1:story-1", "3:story-1"]);
    expect(items.map((item) => item.item)).toEqual([
      chapter1Content.exercises.review[0],
      chapter3Content.exercises.review[0],
    ]);
  });

  it("prioritizes review, heavy hints, light hints, effort, then immediate", () => {
    const items = [
      learnedItem({ key: "3:immediate", rating: "immediate" }),
      learnedItem({ key: "3:effort", rating: "effort" }),
      learnedItem({ key: "3:hint1", hintUsage: 1 }),
      learnedItem({ key: "3:hint2", hintUsage: 2 }),
      learnedItem({ key: "3:review", rating: "review" }),
    ];
    expect(smartReviewOrder(items, {})).toEqual([
      "3:review", "3:hint2", "3:hint1", "3:effort", "3:immediate",
    ]);
  });

  it("keeps random review source keys unique", () => {
    const items = [learnedItem({ key: "1:story-1", chapterId: 1 }), learnedItem({ key: "3:story-1" })];
    expect(shuffledKeys(items, () => 0)).toEqual(["3:story-1", "1:story-1"]);
  });

  it("requires two selected chapters for Mixed Chapters", () => {
    const items = [learnedItem({ key: "1:story-1", chapterId: 1 }), learnedItem({ key: "3:story-1" })];
    let progress = updateAutomaticProgress(initialAutomaticProgress(), { type: "choose", mode: "mixed" });
    progress = updateAutomaticProgress(progress, { type: "toggleChapter", chapterId: 1 });
    expect(updateAutomaticProgress(progress, { type: "start", learned: items }).screen).toBe("setup");
    progress = updateAutomaticProgress(progress, { type: "toggleChapter", chapterId: 3 });
    expect(updateAutomaticProgress(progress, { type: "start", learned: items }).queue).toEqual(["1:story-1", "3:story-1"]);
  });

  it("persists ratings and completes a review queue", () => {
    const items = [learnedItem({ key: "3:story-1" })];
    let progress = updateAutomaticProgress(initialAutomaticProgress(), { type: "choose", mode: "smart" });
    progress = updateAutomaticProgress(progress, { type: "start", learned: items });
    progress = updateAutomaticProgress(progress, { type: "rate", rating: "effort", now: "2026-10-02T00:00:00.000Z" });
    expect(progress.screen).toBe("complete");
    expect(progress.ratings["3:story-1"]).toBe("effort");
    expect(progress.history["3:story-1"]).toEqual({ rating: "effort", lastReviewedAt: "2026-10-02T00:00:00.000Z" });
  });

  it("requires two chapters and learner text before completing writing", () => {
    let progress = updateAutomaticProgress(initialAutomaticProgress(), { type: "openWriting" });
    progress = updateAutomaticProgress(progress, { type: "writingDraft", value: "My own story." });
    progress = updateAutomaticProgress(progress, { type: "completeWriting", now: "2026-10-02T00:00:00.000Z" });
    expect(progress.writingCompletedAt).toBeNull();
    progress = updateAutomaticProgress(progress, { type: "toggleChapter", chapterId: 1 });
    progress = updateAutomaticProgress(progress, { type: "toggleChapter", chapterId: 3 });
    progress = updateAutomaticProgress(progress, { type: "completeWriting", now: "2026-10-02T00:00:00.000Z" });
    expect(progress.writingCompletedAt).toBe("2026-10-02T00:00:00.000Z");
  });

  it("drops stale queues but preserves valid review history", () => {
    const parsed = parseAutomaticProgress({
      screen: "session",
      queue: ["3:missing"],
      history: { "3:story-1": { rating: "review", lastReviewedAt: "2026-10-02T00:00:00.000Z" } },
    }, ["3:story-1"], [3]);
    expect(parsed.screen).toBe("hub");
    expect(parsed.queue).toEqual([]);
    expect(parsed.history["3:story-1"]?.rating).toBe("review");
  });
});
