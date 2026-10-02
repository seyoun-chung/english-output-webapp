import { writingQuestions, writingTemplates } from './data/writing';

export type WritingMode = 'free' | 'guided' | 'template';
export type WritingProgress = { mode: WritingMode; selectedQuestionId: string; selectedTemplateId: string; drafts: Record<string, string>; completed: boolean; completedDrafts: Record<string, string>; completedDraftKey: string | null; completedText: string | null };
export type AboutProgress = { selectedQuestionId: string; answers: Record<string, string>; completedQuestionIds: string[] };
export type GrammarProgress = { studied: boolean };
export type WritingSourceItem = { id: string; english: string };
export type WritingSource = { questions: WritingSourceItem[]; templates: WritingSourceItem[] };
export const chapter3WritingSource: WritingSource = { questions: writingQuestions, templates: writingTemplates };
const sourceKeys = (source: WritingSource) => {
  const questionIds = source.questions.map(item => item.id);
  const templateIds = source.templates.map(item => item.id);
  return { questionIds, templateIds, draftKeys: ['free', ...questionIds.map(id => `guided:${id}`), ...templateIds.map(id => `template:${id}`)] };
};
export const initialWritingProgress = (source: WritingSource = chapter3WritingSource): WritingProgress => {
  const { questionIds, templateIds } = sourceKeys(source);
  return { mode: 'free', selectedQuestionId: questionIds[0], selectedTemplateId: templateIds[0], drafts: {}, completed: false, completedDrafts: {}, completedDraftKey: null, completedText: null };
};
export const initialAboutProgress = (source: WritingSource = chapter3WritingSource): AboutProgress => ({ selectedQuestionId: source.questions[0].id, answers: {}, completedQuestionIds: [] });
export const initialGrammarProgress = (): GrammarProgress => ({ studied: false });
export function writingDraftKey(progress: WritingProgress): string {
  return progress.mode === 'free' ? 'free' : `${progress.mode}:${progress.mode === 'guided' ? progress.selectedQuestionId : progress.selectedTemplateId}`;
}
export function hasOwnDraft(text: string, source: WritingSource = chapter3WritingSource): boolean {
  return /[\p{L}\p{N}]/u.test(text) && !source.templates.some(item => item.english.trim() === text.trim());
}
export function isWritingModeComplete(progress: WritingProgress, mode: WritingMode): boolean {
  return Object.keys(progress.completedDrafts).some(key => key === mode || key.startsWith(`${mode}:`));
}
function withCompletedDrafts(progress: WritingProgress, completedDrafts: Record<string, string>, preferredKey: string | null): WritingProgress {
  const completedDraftKey = preferredKey && Object.hasOwn(completedDrafts, preferredKey)
    ? preferredKey : Object.keys(completedDrafts)[0] ?? null;
  return {
    ...progress, completed: completedDraftKey !== null, completedDrafts,
    completedDraftKey, completedText: completedDraftKey ? completedDrafts[completedDraftKey] : null,
  };
}
export function editWritingDraft(progress: WritingProgress, text: string): WritingProgress {
  const key = writingDraftKey(progress);
  const next = { ...progress, drafts: { ...progress.drafts, [key]: text } };
  if (!Object.hasOwn(progress.completedDrafts, key) || progress.completedDrafts[key] === text) return next;
  const completedDrafts = { ...progress.completedDrafts };
  delete completedDrafts[key];
  return withCompletedDrafts(next, completedDrafts, progress.completedDraftKey);
}
export function completeWriting(progress: WritingProgress, source: WritingSource = chapter3WritingSource): WritingProgress {
  const key = writingDraftKey(progress), text = progress.drafts[key] ?? '';
  return hasOwnDraft(text, source) ? withCompletedDrafts(progress, { ...progress.completedDrafts, [key]: text }, key) : progress;
}
export function editAboutAnswer(progress: AboutProgress, text: string): AboutProgress {
  const id = progress.selectedQuestionId;
  return { ...progress, answers: { ...progress.answers, [id]: text }, completedQuestionIds: text === progress.answers[id] ? progress.completedQuestionIds : progress.completedQuestionIds.filter(value => value !== id) };
}
export function completeAboutAnswer(progress: AboutProgress, source: WritingSource = chapter3WritingSource): AboutProgress {
  return hasOwnDraft(progress.answers[progress.selectedQuestionId] ?? '', source) ? { ...progress, completedQuestionIds: [...new Set([...progress.completedQuestionIds, progress.selectedQuestionId])] } : progress;
}
function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function textRecord(value: unknown, keys: string[]): Record<string, string> | null {
  if (!record(value)) return null;
  const result: Record<string, string> = {};
  for (const key of keys) {
    if (Object.hasOwn(value, key)) { if (typeof value[key] !== 'string') return null; result[key] = value[key]; }
  }
  return result;
}
export function parseWritingProgress(value: unknown, source: WritingSource = chapter3WritingSource): WritingProgress | null {
  const { questionIds, templateIds, draftKeys } = sourceKeys(source);
  if (!record(value) || !['free', 'guided', 'template'].includes(value.mode as string) || !questionIds.includes(value.selectedQuestionId as string) || !templateIds.includes(value.selectedTemplateId as string) || typeof value.completed !== 'boolean') return null;
  const drafts = textRecord(value.drafts, draftKeys);
  if (!drafts) return null;
  const key = value.completedDraftKey, text = value.completedText;
  // Migrate existing version-2 sessions with one submitted draft without clearing their progress.
  const saved = value.completedDrafts === undefined
    ? value.completed && typeof key === 'string' && draftKeys.includes(key) && typeof text === 'string' && drafts[key] === text && hasOwnDraft(text, source)
      ? { [key]: text } : {}
    : textRecord(value.completedDrafts, draftKeys);
  if (!saved) return null;
  const completedDrafts = Object.fromEntries(Object.entries(saved).filter(([draftKey, savedText]) => drafts[draftKey] === savedText && hasOwnDraft(savedText, source)));
  return withCompletedDrafts({ mode: value.mode as WritingMode, selectedQuestionId: value.selectedQuestionId as string, selectedTemplateId: value.selectedTemplateId as string, drafts, completed: false, completedDrafts: {}, completedDraftKey: null, completedText: null }, completedDrafts, typeof key === 'string' ? key : null);
}
export function parseAboutProgress(value: unknown, source: WritingSource = chapter3WritingSource): AboutProgress | null {
  const { questionIds } = sourceKeys(source);
  if (!record(value) || !questionIds.includes(value.selectedQuestionId as string) || !Array.isArray(value.completedQuestionIds)) return null;
  const answers = textRecord(value.answers, questionIds);
  if (!answers) return null;
  return { selectedQuestionId: value.selectedQuestionId as string, answers, completedQuestionIds: questionIds.filter(id => value.completedQuestionIds instanceof Array && value.completedQuestionIds.includes(id) && hasOwnDraft(answers[id] ?? '', source)) };
}
export function parseGrammarProgress(value: unknown): GrammarProgress | null {
  return record(value) && typeof value.studied === 'boolean' ? { studied: value.studied } : null;
}
