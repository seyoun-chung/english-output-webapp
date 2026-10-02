import { describe, expect, it } from "vitest";
import { initialAppProgress, parseAppProgress, updateAppProgress } from "../src/appProgress";
import { initialProgress } from "../src/progress";

describe("version 6 app progress", () => {
  it("migrates the existing Chapter 3 record without losing it", () => {
    const legacy = initialProgress();
    legacy.passes[1].chunkRatings[1] = "effort";

    const migrated = parseAppProgress(JSON.stringify(legacy));

    expect(migrated.version).toBe(6);
    expect(migrated.activeChapterId).toBe(3);
    expect(migrated.chapters[3]?.passes[1].chunkRatings[1]).toBe("effort");
  });

  it("migrates version 5 chapter data and starts Pass 4+ safely", () => {
    const previous = {
      version: 5,
      view: "library",
      activeChapterId: 3,
      chapters: { 3: initialProgress() },
    };
    previous.chapters[3].passes[1].chunkRatings[1] = "review";

    const migrated = parseAppProgress(JSON.stringify(previous));

    expect(migrated.version).toBe(6);
    expect(migrated.chapters[3]?.passes[1].chunkRatings[1]).toBe("review");
    expect(migrated.automatic.screen).toBe("hub");
    expect(migrated.automatic.history).toEqual({});
  });

  it("opens the final source-backed chapter", () => {
    const current = initialAppProgress();
    const next = updateAppProgress(current, { type: "selectChapter", chapterId: 12 });
    expect(next.activeChapterId).toBe(12);
    expect(next.chapters[12]?.chapterId).toBe(12);
  });

  it("opens the library without changing chapter progress", () => {
    const current = initialAppProgress();
    const next = updateAppProgress(current, { type: "showLibrary" });
    expect(next.view).toBe("library");
    expect(next.chapters).toBe(current.chapters);
  });

  it("opens Pass 4+ without changing chapter progress", () => {
    const current = initialAppProgress();
    const next = updateAppProgress(current, { type: "showAutomatic" });
    expect(next.view).toBe("automatic");
    expect(next.chapters).toBe(current.chapters);
  });

  it("routes chapter actions to the active chapter", () => {
    const current = initialAppProgress();
    const next = updateAppProgress(current, { type: "chapter", action: { type: "navigate", screen: "read" } });
    expect(next.chapters[3]?.passes[1].currentScreen).toBe("read");
  });

  it("starts Chapter 1 independently and preserves Chapter 3", () => {
    const current = initialAppProgress();
    const next = updateAppProgress(current, { type: "selectChapter", chapterId: 1 });

    expect(next.activeChapterId).toBe(1);
    expect(next.chapters[1]?.chapterId).toBe(1);
    expect(next.chapters[3]).toBe(current.chapters[3]);
  });
});
