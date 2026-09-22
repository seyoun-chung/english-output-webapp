import { describe, expect, it } from 'vitest';
import { writingQuestions, writingTemplates } from '../src/data/writing';
import { completeAboutAnswer, completeWriting, editAboutAnswer, editWritingDraft, hasOwnDraft, initialAboutProgress, initialWritingProgress, parseAboutProgress, parseWritingProgress, writingDraftKey } from '../src/writingProgress';

describe('learner writing drafts', () => {
  it('starts fresh and round-trips without localStorage side effects', () => {
    const initial = initialWritingProgress();
    expect(parseWritingProgress(JSON.parse(JSON.stringify(initial)))).toEqual(initial);
    initial.drafts.free = 'personal draft';
    expect(initialWritingProgress().drafts).toEqual({});
  });
  it('keeps free, guided questions and templates independent', () => {
    let state = editWritingDraft(initialWritingProgress(), 'free draft');
    state = editWritingDraft({ ...state, mode: 'guided' }, 'first answer');
    state = editWritingDraft({ ...state, selectedQuestionId: writingQuestions[1].id }, 'second answer');
    state = editWritingDraft({ ...state, mode: 'template' }, 'template draft');
    expect(Object.values(state.drafts)).toEqual(['free draft', 'first answer', 'second answer', 'template draft']);
    expect(writingDraftKey({ ...state, mode: 'free' })).toBe('free');
  });
  it('does not complete blank, punctuation-only or unchanged template scaffolds', () => {
    for (const text of ['', ' \n\t ', '___ ...', ...writingTemplates.map(item => item.english)]) {
      expect(hasOwnDraft(text)).toBe(false);
      expect(completeWriting(editWritingDraft(initialWritingProgress(), text)).completed).toBe(false);
    }
  });
  it('allows a short learner draft without an invented word minimum', () => {
    expect(completeWriting(editWritingDraft(initialWritingProgress(), 'Hi')).completed).toBe(true);
  });
  it('preserves completion when navigating or editing another draft', () => {
    const done = completeWriting(editWritingDraft(initialWritingProgress(), 'my draft'));
    const next = editWritingDraft({ ...done, mode: 'guided' }, 'another draft');
    expect(next.completed).toBe(true);
    expect(parseWritingProgress(next)).toEqual(next);
  });
  it('invalidates completion only when submitted text changes', () => {
    const done = completeWriting(editWritingDraft(initialWritingProgress(), 'my draft'));
    expect(editWritingDraft(done, 'my draft').completed).toBe(true);
    expect(editWritingDraft(done, 'changed draft')).toMatchObject({ completed: false, completedText: null, completedDraftKey: null });
  });
  it('rejects invalid structure, strips unknown content and repairs inconsistent completion', () => {
    expect(parseWritingProgress(null)).toBeNull();
    expect(parseWritingProgress({ ...initialWritingProgress(), mode: 'ai' })).toBeNull();
    expect(parseWritingProgress({ ...initialWritingProgress(), drafts: { free: 123 } })).toBeNull();
    const parsed = parseWritingProgress({ ...initialWritingProgress(), drafts: { free: 'kept', unknown: 'removed' }, completed: true, completedDraftKey: 'free', completedText: 'not kept' });
    expect(parsed?.drafts).toEqual({ free: 'kept' });
    expect(parsed?.completed).toBe(false);
  });
  it('does not truncate drafts during parse', () => {
    const draft = 'learner output '.repeat(3000);
    expect(parseWritingProgress(editWritingDraft(initialWritingProgress(), draft))?.drafts.free).toBe(draft);
  });
});

describe('optional personal answers', () => {
  it('tracks answers individually and ignores empty completion', () => {
    const initial = initialAboutProgress();
    expect(completeAboutAnswer(initial)).toEqual(initial);
    const answered = completeAboutAnswer(editAboutAnswer(initial, 'my answer'));
    expect(answered.completedQuestionIds).toEqual([initial.selectedQuestionId]);
    const next = editAboutAnswer({ ...answered, selectedQuestionId: writingQuestions[1].id }, 'another answer');
    expect(next.answers[initial.selectedQuestionId]).toBe('my answer');
    expect(next.completedQuestionIds).toEqual(answered.completedQuestionIds);
    expect(editAboutAnswer(answered, 'edited').completedQuestionIds).toEqual([]);
  });
  it('canonicalizes completed ids and rejects malformed drafts', () => {
    const initial = initialAboutProgress(), id = initial.selectedQuestionId;
    expect(parseAboutProgress({ ...initial, answers: { [id]: 'answer' }, completedQuestionIds: [id, id, 'unknown'] })?.completedQuestionIds).toEqual([id]);
    expect(parseAboutProgress({ ...initial, completedQuestionIds: [id] })?.completedQuestionIds).toEqual([]);
    expect(parseAboutProgress({ ...initial, answers: null })).toBeNull();
  });
});
