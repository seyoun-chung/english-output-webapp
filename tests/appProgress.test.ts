import { describe, expect, it } from "vitest";
import { initialAppProgress, parseAppProgress, updateAppProgress } from "../src/appProgress";
import { initialProgress } from "../src/progress";

describe("version 5 app progress", () => {
  it("migrates the existing Chapter 3 record without losing it", () => {
    const legacy = initialProgress();
    legacy.passes[1].chunkRatings[1] = "effort";

    const migrated = parseAppProgress(JSON.stringify(legacy));

    expect(migrated.version).toBe(5);
    expect(migrated.activeChapterId).toBe(3);
    expect(migrated.chapters[3]?.passes[1].chunkRatings[1]).toBe("effort");
  });

  it("keeps unavailable chapters locked", () => {
    const current = initialAppProgress();
    expect(updateAppProgress(current, { type: "selectChapter", chapterId: 7 })).toBe(current);
  });

  it("opens the library without changing chapter progress", () => {
    const current = initialAppProgress();
    const next = updateAppProgress(current, { type: "showLibrary" });
    expect(next.view).toBe("library");
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
