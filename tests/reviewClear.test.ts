import { describe, it, expect } from "vitest";
import { buildReviewItems, difficultReviewItems, hasCompletedReview, initialReviewProgress, parseReviewProgress, rateReview, startReview, studyRatings } from "../src/exerciseProgress";
import { initialProgress, initialPassProgress, parseProgress, updateProgress } from "../src/progress";
import { chapter3Content } from "../src/data/chapterContent";

describe("chapter review clearing", () => {
  it.each([1, 2, 3] as const)("clears only difficult items in Pass %s and preserves other passes", pass => {
    let chapter = initialProgress();
    chapter.activePass = pass;
    chapter.passes[pass] = initialPassProgress(pass);
    const p = chapter.passes[pass]!;
    p.chunkRatings[1] = "effort";
    p.chunkRatings[2] = "review";
    p.chunkRatings[3] = "immediate";
    const before = JSON.stringify(p.chunkRatings);
    const learned = studyRatings(p);
    const pool = buildReviewItems({ chunkRatings: p.chunkRatings, conversationRatings: p.conversation.ratings, outputRatings: p.output.ratings });
    expect(pool.map(item => item.id)).toEqual(["story-1", "story-2", "story-3"]);
    let review = startReview(p.review, difficultReviewItems(pool, learned, p.review).map(item => item.id));
    expect(review.queue).toEqual(["story-1", "story-2"]);
    review = rateReview(review, "immediate");
    expect(difficultReviewItems(pool, learned, review)).toHaveLength(1);
    review = rateReview(review, "effort");
    expect(review.completed).toBe(true);
    review = startReview(review, difficultReviewItems(pool, learned, review).map(item => item.id));
    expect(hasCompletedReview(review)).toBe(true);
    expect(review.queue).toEqual(["story-2"]);
    review = rateReview(review, "immediate");
    chapter = updateProgress(chapter, { type: "review", value: review });
    const restored = parseProgress(JSON.stringify(chapter)).passes[pass]!;
    expect(difficultReviewItems(pool, learned, restored.review)).toHaveLength(0);
    expect(JSON.stringify(restored.chunkRatings)).toBe(before);
    expect(restored.review.latestRatings?.["story-1"]).toBe("immediate");
    const again = startReview(restored.review, pool.map(item => item.id));
    expect(again.queue).toHaveLength(3);
    expect(again.ratings).toEqual({});
    expect(difficultReviewItems(pool, learned, again)).toHaveLength(0);
    expect(hasCompletedReview(again)).toBe(true);
  });
  it("preserves legacy fixed-set clears across starting another session", () => {
    const legacy = { ...initialReviewProgress(), queue: ["story-1"], ratings: { "story-1": "immediate" as const }, completed: true };
    const restored = parseReviewProgress(legacy)!;
    const next = startReview(restored, ["story-2"]);
    expect(next.latestRatings?.["story-1"]).toBe("immediate");
    expect(hasCompletedReview(next)).toBe(true);
  });
  it("a new study rating can put a cleared problem back in the difficult pool", () => {
    let chapter = initialProgress();
    chapter.passes[1].chunkRatings[1] = "effort";
    chapter.passes[1].review.latestRatings = { "story-1": "immediate" };
    chapter = updateProgress(chapter, { type: "practice" });
    chapter = updateProgress(chapter, { type: "rate", rating: "effort" });
    const p = chapter.passes[1];
    expect(difficultReviewItems(chapter3Content.exercises.review, studyRatings(p), p.review).map(item => item.id)).toEqual(["story-1"]);
  });
});
