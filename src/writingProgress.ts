import { writingQuestions, writingTemplates } from './data/writing';

export type WritingMode = 'free' | 'guided' | 'template';
export type WritingProgress = { mode: WritingMode; selectedQuestionId: string; selectedTemplateId: string; drafts: Record<string, string>; completed: boolean; completedDraftKey: string | null; completedText: string | null };
export type AboutProgress = { selectedQuestionId: string; answers: Record<string, string>; completedQuestionIds: string[] };
export type GrammarProgress = { studied: boolean };
const questionIds = writingQuestions.map(item => item.id);
const templateIds = writingTemplates.map(item => item.id);
const draftKeys = ['free', ...questionIds.map(id => `guided:${id}`), ...templateIds.map(id => `template:${id}`)];
export const initialWritingProgress = (): WritingProgress => ({ mode: 'free', selectedQuestionId: questionIds[0], selectedTemplateId: templateIds[0], drafts: {}, completed: false, completedDraftKey: null, completedText: null });
export const initialAboutProgress = (): AboutProgress => ({ selectedQuestionId: questionIds[0], answers: {}, completedQuestionIds: [] });
export const initialGrammarProgress = (): GrammarProgress => ({ studied: false });
export function writingDraftKey(progress: WritingProgress): string {
  return progress.mode === 'free' ? 'free' : `${progress.mode}:${progress.mode === 'guided' ? progress.selectedQuestionId : progress.selectedTemplateId}`;
}
export function hasOwnDraft(text: string): boolean {
  return /[\p{L}\p{N}]/u.test(text) && !writingTemplates.some(item => item.english.trim() === text.trim());
}
export function editWritingDraft(progress: WritingProgress, text: string): WritingProgress {
  const key = writingDraftKey(progress);
  const changedSubmission = key === progress.completedDraftKey && text !== progress.completedText;
  return { ...progress, drafts: { ...progress.drafts, [key]: text }, ...(changedSubmission ? { completed: false, completedDraftKey: null, completedText: null } : {}) };
}
export function completeWriting(progress: WritingProgress): WritingProgress {
  const key = writingDraftKey(progress), text = progress.drafts[key] ?? '';
  return hasOwnDraft(text) ? { ...progress, completed: true, completedDraftKey: key, completedText: text } : progress;
}
export function editAboutAnswer(progress: AboutProgress, text: string): AboutProgress {
  const id = progress.selectedQuestionId;
  return { ...progress, answers: { ...progress.answers, [id]: text }, completedQuestionIds: text === progress.answers[id] ? progress.completedQuestionIds : progress.completedQuestionIds.filter(value => value !== id) };
}
export function completeAboutAnswer(progress: AboutProgress): AboutProgress {
  return hasOwnDraft(progress.answers[progress.selectedQuestionId] ?? '') ? { ...progress, completedQuestionIds: [...new Set([...progress.completedQuestionIds, progress.selectedQuestionId])] } : progress;
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
export function parseWritingProgress(value: unknown): WritingProgress | null {
  if (!record(value) || !['free', 'guided', 'template'].includes(value.mode as string) || !questionIds.includes(value.selectedQuestionId as string) || !templateIds.includes(value.selectedTemplateId as string) || typeof value.completed !== 'boolean') return null;
  const drafts = textRecord(value.drafts, draftKeys);
  if (!drafts) return null;
  const key = value.completedDraftKey, text = value.completedText;
  const completed = value.completed && typeof key === 'string' && draftKeys.includes(key) && typeof text === 'string' && drafts[key] === text && hasOwnDraft(text);
  return { mode: value.mode as WritingMode, selectedQuestionId: value.selectedQuestionId as string, selectedTemplateId: value.selectedTemplateId as string, drafts, completed, completedDraftKey: completed ? key as string : null, completedText: completed ? text as string : null };
}
export function parseAboutProgress(value: unknown): AboutProgress | null {
  if (!record(value) || !questionIds.includes(value.selectedQuestionId as string) || !Array.isArray(value.completedQuestionIds)) return null;
  const answers = textRecord(value.answers, questionIds);
  if (!answers) return null;
  return { selectedQuestionId: value.selectedQuestionId as string, answers, completedQuestionIds: questionIds.filter(id => value.completedQuestionIds instanceof Array && value.completedQuestionIds.includes(id) && hasOwnDraft(answers[id] ?? '')) };
}
export function parseGrammarProgress(value: unknown): GrammarProgress | null {
  return record(value) && typeof value.studied === 'boolean' ? { studied: value.studied } : null;
}
