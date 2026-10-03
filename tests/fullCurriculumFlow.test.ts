import { describe, expect, it } from "vitest";
import { chapterContentById, type ChapterContent } from "../src/data/chapterContent";
import { chapterCatalog } from "../src/data/chapters";
import { rateReview, startReview } from "../src/exerciseProgress";
import { isPassReady } from "../src/chapterCompletion";
import { initialPassProgress, initialProgress, progressReducerFor, type PassProgress, type Progress } from "../src/progress";
import { completeAboutAnswer, completeWriting, editAboutAnswer, editWritingDraft } from "../src/writingProgress";
import { collectLearnedItems, initialAutomaticProgress, updateAutomaticProgress } from "../src/automaticProgress";
import { initialAppProgress } from '../src/appProgress';
import { createProgressBackup, readProgressBackup } from '../src/progressBackup';

function readyPass(content: ChapterContent, passNumber: 1 | 2 | 3): PassProgress {
  const pass = initialPassProgress(passNumber, content);
  pass.fullRecallCompleted = true;
  pass.conversation.fullRecallCompleted = true;
  for (const turn of content.conversations) pass.conversation.ratings[turn.id] = "effort";
  const outputItems = passNumber === 1
    ? content.exercises.exact
    : passNumber === 2 ? content.exercises.variation : content.exercises.output;
  for (const item of outputItems) pass.output.ratings[item.id] = "effort";
  if (passNumber === 3) pass.output.finished["no-hint"] = true;
  pass.writing = completeWriting(editWritingDraft(pass.writing, `My Chapter ${content.id} Pass ${passNumber} story.`));
  if (passNumber > 1) {
    let review = startReview(pass.review, content.pass2ReviewExercises.map((item) => item.id), content.exercises);
    for (const _item of content.pass2ReviewExercises) review = rateReview(review, "effort");
    pass.review = review;
  }
  if (passNumber === 3) {
    pass.grammar.studied = true;
    pass.about = completeAboutAnswer(editAboutAnswer(pass.about, "My own answer."));
  }
  return pass;
}

function completeChapter(content: ChapterContent): Progress {
  const reduce = progressReducerFor(content);
  let chapter = initialProgress(content);
  chapter.passes[1] = readyPass(content, 1);
  chapter = reduce(chapter, { type: "finishPass" });
  chapter = reduce(chapter, { type: "startPass2" });
  chapter.passes[2] = readyPass(content, 2);
  chapter = reduce(chapter, { type: "finishPass" });
  chapter = reduce(chapter, { type: "startPass3" });
  chapter.passes[3] = readyPass(content, 3);
  return reduce(chapter, { type: "finishPass" });
}

describe("full curriculum completion flow", () => {
  it("completes Pass 1, Pass 2, and Pass 3 independently for every source-backed chapter", () => {
    for (const metadata of chapterCatalog) {
      const content = chapterContentById[metadata.id];
      expect(content, `Chapter ${metadata.id} content`).toBeDefined();
      const completed = completeChapter(content!);
      expect(completed.chapterId).toBe(metadata.id);
      expect(completed.activePass).toBe(3);
      expect(completed.passes[1].completedAt).not.toBeNull();
      expect(completed.passes[2]?.completedAt).not.toBeNull();
      expect(completed.passes[3]?.completedAt).not.toBeNull();
      expect(isPassReady(completed.passes[1], content)).toBe(true);
      expect(isPassReady(completed.passes[2]!, content)).toBe(true);
      expect(isPassReady(completed.passes[3]!, content)).toBe(true);
      const app = initialAppProgress();
      app.activeChapterId = metadata.id;
      app.chapters[metadata.id] = completed;
      expect(readProgressBackup(createProgressBackup(app)).progress).toEqual(app);
    }
  });

  it("feeds all completed chapters into the global Pass 4+ source-only review", () => {
    const chapters = Object.fromEntries(chapterCatalog.map((metadata) => {
      const content = chapterContentById[metadata.id]!;
      return [metadata.id, completeChapter(content)];
    }));
    const learned = collectLearnedItems(chapters, chapterContentById);
    expect(new Set(learned.map((item) => item.chapterId))).toEqual(new Set(chapterCatalog.map((chapter) => chapter.id)));
    expect(learned.length).toBeGreaterThan(0);
    expect(learned.every((item) => chapterContentById[item.chapterId]?.exercises.review.includes(item.item))).toBe(true);

    let automatic = updateAutomaticProgress(initialAutomaticProgress(), { type: "choose", mode: "mixed" });
    automatic = updateAutomaticProgress(automatic, { type: "toggleChapter", chapterId: 1 });
    automatic = updateAutomaticProgress(automatic, { type: "toggleChapter", chapterId: 12 });
    automatic = updateAutomaticProgress(automatic, { type: "start", learned });
    expect(automatic.screen).toBe("session");
    expect(automatic.queue.length).toBeGreaterThan(0);
    expect(automatic.queue.every((key) => key.startsWith("1:") || key.startsWith("12:"))).toBe(true);
  });
});
