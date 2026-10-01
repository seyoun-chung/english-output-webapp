import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { chunks } from "../src/data/chapter3";
import {
  activePassProgress,
  initialProgress,
  parseProgress,
  updateProgress,
  weakIds,
  type Progress,
} from "../src/progress";

const current = (progress: Progress) => activePassProgress(progress);

describe("My Story progress", () => {
  it("starts at Overview and resumes into Read", () => {
    const initial = initialProgress();
    expect(current(initial).currentScreen).toBe("overview");
    expect(current(updateProgress(initial, { type: "resume" })).currentScreen).toBe("read");
    expect(Object.values(current(initial).chunkRatings)).toEqual(Array(6).fill(null));
  });

  it("advances all six chunks, saves ratings and enters Full Recall", () => {
    let progress = updateProgress(initialProgress(), { type: "practice" });
    for (let id = 1; id <= 6; id++) {
      expect(current(progress).queue[current(progress).queueIndex]).toBe(id);
      progress = updateProgress(progress, { type: "rate", rating: id % 2 ? "immediate" : "review" });
    }
    expect(current(progress).currentScreen).toBe("full");
    expect(current(progress).fullRecallCompleted).toBe(false);
    expect(weakIds(current(progress))).toEqual([2, 4, 6]);
    expect(current(updateProgress(progress, { type: "complete" })).fullRecallCompleted).toBe(true);
    expect(current(progress).lastStudiedAt).not.toBeNull();
  });

  it("includes effort and review, excludes immediate and unrated, and keeps the queue stable", () => {
    let progress = initialProgress();
    progress.passes[1].chunkRatings = { 1: "effort", 2: "review", 3: "immediate", 4: "review", 5: null, 6: null };
    progress = updateProgress(progress, { type: "practice", weakOnly: true });
    expect(current(progress).queue).toEqual([1, 2, 4]);
    progress = updateProgress(progress, { type: "rate", rating: "immediate" });
    expect(weakIds(current(progress))).toEqual([2, 4]);
    expect(current(progress).queue[current(progress).queueIndex]).toBe(2);
    progress = updateProgress(progress, { type: "rate", rating: "effort" });
    expect(current(progress).queue[current(progress).queueIndex]).toBe(4);
    progress = updateProgress(progress, { type: "rate", rating: "immediate" });
    expect(current(progress).currentScreen).toBe("full");
    expect(weakIds(current(progress))).toEqual([2]);
    progress = parseProgress(JSON.stringify(progress));
    progress = updateProgress(progress, { type: "practice", weakOnly: true });
    expect(current(progress).queue).toEqual([2]);
    progress = updateProgress(progress, { type: "rate", rating: "immediate" });
    expect(weakIds(current(progress))).toEqual([]);
    expect(updateProgress(progress, { type: "practice", weakOnly: true })).toBe(progress);
  });

  it("includes all six chunks when none of their ratings is immediate", () => {
    let progress = updateProgress(initialProgress(), { type: "practice" });
    for (let id = 1; id <= 6; id++) progress = updateProgress(progress, { type: "rate", rating: id % 2 ? "effort" : "review" });
    expect(weakIds(current(progress))).toEqual([1, 2, 3, 4, 5, 6]);
    expect(current(updateProgress(progress, { type: "practice", weakOnly: true })).queue).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("persists position, language, maximum hint usage, ratings and completion together", () => {
    let progress = updateProgress(initialProgress(), { type: "readMode", mode: "together" });
    progress = updateProgress(progress, { type: "practice" });
    progress = updateProgress(progress, { type: "hint", level: 2 });
    progress = updateProgress(progress, { type: "hint", level: 1 });
    progress = updateProgress(progress, { type: "rate", rating: "effort" });
    expect(current(progress).hintUsage[1]).toBe(2);
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
    progress = updateProgress(progress, { type: "navigate", screen: "overview" });
    progress = parseProgress(JSON.stringify(progress));
    progress = updateProgress(progress, { type: "resume" });
    expect(current(progress).currentScreen).toBe("recall");
    expect(current(progress).queueIndex).toBe(1);
    expect(current(progress).readMode).toBe("together");
  });

  it("allows backward movement without erasing ratings or restarting the course", () => {
    let progress = updateProgress(initialProgress(), { type: "practice" });
    progress = updateProgress(progress, { type: "rate", rating: "review" });
    progress = updateProgress(progress, { type: "previous" });
    expect(current(progress).queueIndex).toBe(0);
    expect(current(progress).chunkRatings[1]).toBe("review");
    expect(current(updateProgress(progress, { type: "previous" })).queueIndex).toBe(0);
  });

  const invalidPass = (overrides: Record<string, unknown>) => {
    const initial = initialProgress();
    return JSON.stringify({ ...initial, passes: { ...initial.passes, 1: { ...initial.passes[1], ...overrides } } });
  };
  it.each([
    null, "not-json", "null", "{}",
    JSON.stringify({ ...initialProgress(), version: 99 }),
    invalidPass({ queue: [] }), invalidPass({ queue: [1, 1] }), invalidPass({ queue: [99] }),
    invalidPass({ queueIndex: 9 }), invalidPass({ currentScreen: "payments" }), invalidPass({ currentScreen: ["read"] }),
    invalidPass({ chunkRatings: { 1: "wrong" } }), invalidPass({ hintUsage: {} }), invalidPass({ lastStudiedAt: "invalid" }),
  ])("recovers safely from missing, invalid or unsupported storage: %s", (raw) => {
    const parsed = parseProgress(raw);
    if (raw && raw.includes('"version":3') && !raw.includes('"version":99')) {
      expect(parsed.passes[1]).toEqual(initialProgress().passes[1]);
    } else {
      expect(parsed).toEqual(initialProgress());
    }
  });
});

describe("Source locked content", () => {
  const task = readFileSync(new URL("../docs/current_task.md", import.meta.url), "utf8").replace(/\r\n/g, "\n");
  it("uses exactly the six Korean and English chunks approved in current_task.md", () => {
    const approved = [...task.matchAll(/### Chunk (\d)\s+Korean:\s+```text\n([\s\S]*?)\n```\s+Target:\s+```text\n([\s\S]*?)\n```/g)];
    expect(approved).toHaveLength(6);
    expect(chunks).toHaveLength(6);
    for (const [index, match] of approved.entries()) {
      expect(chunks[index].id).toBe(Number(match[1]));
      expect(chunks[index].korean.join("\n")).toBe(match[2]);
      expect(chunks[index].english.join("\n")).toBe(match[3]);
    }
  });

  it("uses only exact source prefixes for hint 1 and masked source words for hint 2", () => {
    for (const chunk of chunks) {
      expect(chunk.hint1).toHaveLength(chunk.english.length);
      expect(chunk.hint2).toHaveLength(chunk.english.length);
      chunk.english.forEach((line, index) => {
        expect(line.startsWith(chunk.hint1[index].replace(/…$/, ""))).toBe(true);
        const pattern = chunk.hint2[index].split("______").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[A-Za-z’]+");
        expect(line).toMatch(new RegExp(`^${pattern}$`));
        expect(chunk.hint2[index]).toContain("______");
      });
      expect(chunk.source.file).toBe("eBook_Bookcamp_Oct8.pdf");
      expect(chunk.source.koreanPage).toBe(50);
      expect(chunk.source.englishPage).toBe(51);
    }
  });
});
