import {describe,expect,it} from "vitest";
import {chapter6Content} from "../src/data/chapter6";
import {chapterContentById} from "../src/data/chapterContent";
import {initialProgress,progressReducerFor} from "../src/progress";
describe("Chapter 6 source content",()=>{
 it("registers the complete source bundle",()=>{expect(chapterContentById[6]).toBe(chapter6Content);expect(chapter6Content.chunks).toHaveLength(6);expect(chapter6Content.conversations).toHaveLength(10);expect(chapter6Content.exercises.variation).toHaveLength(6);expect(chapter6Content.pass2ReviewExercises).toHaveLength(12);expect(chapter6Content.writing.questions).toHaveLength(13);expect(chapter6Content.writing.templates).toHaveLength(6)});
 it("uses supplied Chapter 6 sources",()=>{const files=new Set(["eBook_Bookcamp_Oct8.pdf","Week 6 — My Story 강의노트.pdf","Week 6 — Real Conversations.pdf"]);expect(chapter6Content.exercises.review.every(x=>files.has(x.source.file))).toBe(true)});
 it("keeps progress independent",()=>{const reduce=progressReducerFor(chapter6Content);let p=initialProgress(chapter6Content);p=reduce(p,{type:"practice"});p=reduce(p,{type:"rate",rating:"effort"});expect(p.chapterId).toBe(6);expect(p.passes[1].chunkRatings[1]).toBe("effort");expect(p.passes[1].writing.selectedQuestionId).toBe("ch6-question-1")});
});
