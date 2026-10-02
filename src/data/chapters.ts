export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type ChapterMetadata = {
  id: ChapterId;
  week: number;
  title: string;
  sourceFile: string;
  pages: {
    myStoryKorean: number;
    myStoryEnglish: number;
    grammar: number;
    conversationKorean: number;
    conversationEnglish: number;
    whatAboutYou: number;
  };
};

const sourceFile = "eBook_Bookcamp_Oct8.pdf";

// Titles and section starts are transcribed from the main textbook table of contents.
// This catalog is navigation/provenance metadata only; it does not create learning content.
export const chapterCatalog: readonly ChapterMetadata[] = [
  { id: 1, week: 1, title: "Work, English, and Dreams", sourceFile, pages: { myStoryKorean: 6, myStoryEnglish: 7, grammar: 11, conversationKorean: 16, conversationEnglish: 17, whatAboutYou: 22 } },
  { id: 2, week: 2, title: "Introducing Yourself", sourceFile, pages: { myStoryKorean: 28, myStoryEnglish: 29, grammar: 33, conversationKorean: 36, conversationEnglish: 37, whatAboutYou: 43 } },
  { id: 3, week: 3, title: "Personality Traits", sourceFile, pages: { myStoryKorean: 50, myStoryEnglish: 51, grammar: 54, conversationKorean: 56, conversationEnglish: 57, whatAboutYou: 63 } },
  { id: 4, week: 4, title: "How Was Your Day?", sourceFile, pages: { myStoryKorean: 70, myStoryEnglish: 71, grammar: 75, conversationKorean: 80, conversationEnglish: 81, whatAboutYou: 88 } },
  { id: 5, week: 5, title: "Catching up With Friends", sourceFile, pages: { myStoryKorean: 94, myStoryEnglish: 95, grammar: 99, conversationKorean: 104, conversationEnglish: 105, whatAboutYou: 110 } },
  { id: 6, week: 6, title: "Giving Directions", sourceFile, pages: { myStoryKorean: 116, myStoryEnglish: 117, grammar: 122, conversationKorean: 126, conversationEnglish: 127, whatAboutYou: 133 } },
  { id: 7, week: 7, title: "Dating", sourceFile, pages: { myStoryKorean: 140, myStoryEnglish: 141, grammar: 145, conversationKorean: 148, conversationEnglish: 149, whatAboutYou: 152 } },
  { id: 8, week: 8, title: "Health and Resolutions", sourceFile, pages: { myStoryKorean: 158, myStoryEnglish: 159, grammar: 163, conversationKorean: 166, conversationEnglish: 167, whatAboutYou: 170 } },
  { id: 9, week: 9, title: "My Favorite Food", sourceFile, pages: { myStoryKorean: 176, myStoryEnglish: 177, grammar: 181, conversationKorean: 184, conversationEnglish: 185, whatAboutYou: 189 } },
  { id: 10, week: 10, title: "Travel", sourceFile, pages: { myStoryKorean: 196, myStoryEnglish: 197, grammar: 201, conversationKorean: 204, conversationEnglish: 205, whatAboutYou: 208 } },
  { id: 11, week: 11, title: "Boot camp", sourceFile, pages: { myStoryKorean: 214, myStoryEnglish: 215, grammar: 218, conversationKorean: 220, conversationEnglish: 221, whatAboutYou: 226 } },
  { id: 12, week: 12, title: "Beautiful Memories", sourceFile, pages: { myStoryKorean: 232, myStoryEnglish: 233, grammar: 237, conversationKorean: 240, conversationEnglish: 241, whatAboutYou: 246 } },
] as const;

export function chapterById(id: ChapterId): ChapterMetadata {
  const chapter = chapterCatalog.find(item => item.id === id);
  if (!chapter) throw new Error(`Unknown chapter: ${id}`);
  return chapter;
}

export const chapter3 = chapterById(3);
export const chapterName = (chapter: ChapterMetadata) => `Chapter ${chapter.id}`;
export const chapterLabel = (chapter: ChapterMetadata) => `CHAPTER ${chapter.id}`;
export const chapterCode = (chapter: ChapterMetadata) => `CHAPTER ${String(chapter.id).padStart(2, "0")}`;
