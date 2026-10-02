import { describe, expect, it } from "vitest";
import { chapterById, chapterCatalog } from "../src/data/chapters";

describe("chapter source catalog", () => {
  it("lists all twelve unique textbook chapters in order", () => {
    expect(chapterCatalog.map(chapter => chapter.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(new Set(chapterCatalog.map(chapter => chapter.title)).size).toBe(12);
  });

  it("keeps every section page within its chapter and points to the main source", () => {
    for (const chapter of chapterCatalog) {
      const pages = Object.values(chapter.pages);
      expect(pages).toEqual([...pages].sort((a, b) => a - b));
      expect(chapter.sourceFile).toBe("eBook_Bookcamp_Oct8.pdf");
      expect(chapter.week).toBe(chapter.id);
    }
  });

  it("returns verified Chapter 3 metadata", () => {
    expect(chapterById(3)).toMatchObject({ title: "Personality Traits", pages: { myStoryKorean: 50, conversationEnglish: 57 } });
  });
});
