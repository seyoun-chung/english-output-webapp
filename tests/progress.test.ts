import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { chunks } from "../src/data/chapter3";
import {
  initialProgress,
  parseProgress,
  updateProgress,
  weakIds,
} from "../src/progress";

describe("My Story progress", () => {
  it("starts at Overview and resumes into Read", () => {
    const initial = initialProgress();
    expect(initial.currentScreen).toBe("overview");
    expect(updateProgress(initial, { type: "resume" }).currentScreen).toBe(
      "read",
    );
    expect(Object.values(initial.chunkRatings)).toEqual(Array(6).fill(null));
  });

  it("advances all six chunks, saves ratings and enters Full Recall", () => {
    let p = updateProgress(initialProgress(), { type: "practice" });
    for (let id = 1; id <= 6; id++) {
      expect(p.queue[p.queueIndex]).toBe(id);
      p = updateProgress(p, {
        type: "rate",
        rating: id % 2 ? "immediate" : "review",
      });
    }
    expect(p.currentScreen).toBe("full");
    expect(p.fullRecallCompleted).toBe(false);
    expect(weakIds(p)).toEqual([2, 4, 6]);
    expect(updateProgress(p, { type: "complete" }).fullRecallCompleted).toBe(
      true,
    );
    expect(p.lastStudiedAt).not.toBeNull();
  });

  it("includes effort and review, excludes immediate and unrated, and keeps the queue stable", () => {
    let p = initialProgress();
    p.chunkRatings = {
      1: "effort",
      2: "review",
      3: "immediate",
      4: "review",
      5: null,
      6: null,
    };
    p = updateProgress(p, { type: "practice", weakOnly: true });
    expect(p.queue).toEqual([1, 2, 4]);
    p = updateProgress(p, { type: "rate", rating: "immediate" });
    expect(weakIds(p)).toEqual([2, 4]);
    expect(p.queue[p.queueIndex]).toBe(2);
    p = updateProgress(p, { type: "rate", rating: "effort" });
    expect(weakIds(p)).toEqual([2, 4]);
    expect(p.queue[p.queueIndex]).toBe(4);
    p = updateProgress(p, { type: "rate", rating: "immediate" });
    expect(p.currentScreen).toBe("full");
    expect(weakIds(p)).toEqual([2]);
    p = parseProgress(JSON.stringify(p));
    p = updateProgress(p, { type: "practice", weakOnly: true });
    expect(p.queue).toEqual([2]);
    p = updateProgress(p, { type: "rate", rating: "immediate" });
    expect(weakIds(p)).toEqual([]);
    expect(updateProgress(p, { type: "practice", weakOnly: true })).toBe(p);
  });

  it("includes all six chunks when none of their ratings is immediate", () => {
    let p = updateProgress(initialProgress(), { type: "practice" });
    for (let id = 1; id <= 6; id++) {
      p = updateProgress(p, { type: "rate", rating: id % 2 ? "effort" : "review" });
    }
    expect(weakIds(p)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(updateProgress(p, { type: "practice", weakOnly: true }).queue).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("persists position, language, maximum hint usage, ratings and completion together", () => {
    let p = updateProgress(initialProgress(), {
      type: "readMode",
      mode: "together",
    });
    p = updateProgress(p, { type: "practice" });
    p = updateProgress(p, { type: "hint", level: 2 });
    p = updateProgress(p, { type: "hint", level: 1 });
    p = updateProgress(p, { type: "rate", rating: "effort" });
    expect(p.hintUsage[1]).toBe(2);
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
    p = updateProgress(p, { type: "navigate", screen: "overview" });
    p = parseProgress(JSON.stringify(p));
    p = updateProgress(p, { type: "resume" });
    expect(p.currentScreen).toBe("recall");
    expect(p.queueIndex).toBe(1);
    expect(p.readMode).toBe("together");
  });

  it("allows backward movement without erasing ratings or restarting the course", () => {
    let p = updateProgress(initialProgress(), { type: "practice" });
    p = updateProgress(p, { type: "rate", rating: "review" });
    p = updateProgress(p, { type: "previous" });
    expect(p.queueIndex).toBe(0);
    expect(p.chunkRatings[1]).toBe("review");
    expect(updateProgress(p, { type: "previous" }).queueIndex).toBe(0);
  });

  it.each([
    null,
    "not-json",
    "null",
    "{}",
    JSON.stringify({ ...initialProgress(), version: 99 }),
    JSON.stringify({ ...initialProgress(), queue: [] }),
    JSON.stringify({ ...initialProgress(), queue: [1, 1] }),
    JSON.stringify({ ...initialProgress(), queue: [99] }),
    JSON.stringify({ ...initialProgress(), queueIndex: 9 }),
    JSON.stringify({ ...initialProgress(), currentScreen: "payments" }),
    JSON.stringify({ ...initialProgress(), currentScreen: ["read"] }),
    JSON.stringify({ ...initialProgress(), chunkRatings: { 1: "wrong" } }),
    JSON.stringify({ ...initialProgress(), hintUsage: {} }),
    JSON.stringify({ ...initialProgress(), lastStudiedAt: "invalid" }),
  ])(
    "recovers safely from missing, invalid or unsupported storage: %s",
    (raw) => {
      expect(parseProgress(raw)).toEqual(initialProgress());
    },
  );
});

describe("Source locked content", () => {
  const task = readFileSync(
    new URL("../docs/current_task.md", import.meta.url),
    "utf8",
  ).replace(/\r\n/g, "\n");
  it("uses exactly the six Korean and English chunks approved in current_task.md", () => {
    const approved = [
      ...task.matchAll(
        /### Chunk (\d)\s+Korean:\s+```text\n([\s\S]*?)\n```\s+Target:\s+```text\n([\s\S]*?)\n```/g,
      ),
    ];
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
        expect(line.startsWith(chunk.hint1[index].replace(/…$/, ""))).toBe(
          true,
        );
        const pattern = chunk.hint2[index]
          .split("______")
          .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("[A-Za-z’]+");
        expect(line).toMatch(new RegExp(`^${pattern}$`));
        expect(chunk.hint2[index]).toContain("______");
      });
      expect(chunk.source.file).toBe("eBook_Bookcamp_Oct8.pdf");
      expect(chunk.source.koreanPage).toBe(50);
      expect(chunk.source.englishPage).toBe(51);
    }
  });
});
