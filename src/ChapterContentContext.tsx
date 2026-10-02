import { createContext, useContext, type ReactNode } from "react";
import { chapter3Content, type ChapterContent } from "./data/chapterContent";

const ChapterContentContext = createContext<ChapterContent>(chapter3Content);

export function ChapterContentProvider({ content, children }: { content: ChapterContent; children: ReactNode }) {
  return <ChapterContentContext.Provider value={content}>{children}</ChapterContentContext.Provider>;
}

export const useChapterContent = () => useContext(ChapterContentContext);
