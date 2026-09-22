import { allReviewExercises, exactExercises, outputExercises, variationExercises, type ExerciseGroup } from './data/outputPractice';
import type { Rating } from './progress';
export { buildReviewItems } from './data/outputPractice';
export type PracticeMode = 'exact' | 'variation' | 'no-hint';
export type PracticeProgress = { mode: PracticeMode; cursors: Record<PracticeMode, number>; finished: Record<PracticeMode, boolean>; ratings: Record<string, Rating> };
export type ReviewProgress = { selectedGroups: ExerciseGroup[]; queue: string[]; index: number; ratings: Record<string, Rating>; completed: boolean };
export const practiceModes: PracticeMode[] = ['exact', 'variation', 'no-hint'];
export const practiceItems = (mode: PracticeMode) => mode === 'exact' ? exactExercises : mode === 'variation' ? variationExercises : outputExercises;
export const initialPracticeProgress = (): PracticeProgress => ({ mode: 'exact', cursors: { exact: 0, variation: 0, 'no-hint': 0 }, finished: { exact: false, variation: false, 'no-hint': false }, ratings: {} });
export const initialReviewProgress = (): ReviewProgress => ({ selectedGroups: ['story', 'conversation', 'output'], queue: [], index: 0, ratings: {}, completed: false });
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const rating = (value: unknown): value is Rating => ['immediate', 'effort', 'review'].includes(value as string);
const cleanRatings = (value: unknown, ids: string[]) => record(value) ? Object.fromEntries(ids.filter(id => rating(value[id])).map(id => [id, value[id] as Rating])) : {};
export function parsePracticeProgress(raw: unknown): PracticeProgress | null {
  const next = initialPracticeProgress();
  if (!record(raw) || !practiceModes.includes(raw.mode as PracticeMode) || !record(raw.cursors) || !record(raw.ratings)) return null;
  if (practiceModes.includes(raw.mode as PracticeMode)) next.mode = raw.mode as PracticeMode;
  for (const mode of practiceModes) {
    const value = record(raw.cursors) ? raw.cursors[mode] : undefined;
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value >= practiceItems(mode).length) return null;
    next.cursors[mode] = value;
  }
  next.ratings = cleanRatings(raw.ratings, outputExercises.map(item => item.id));
  for (const mode of practiceModes) {
    // Older stored sessions have no view flag and safely reopen their question.
    // A saved completion cannot claim unassessed items were practiced.
    next.finished[mode] = record(raw.finished) && raw.finished[mode] === true && practiceItems(mode).every(item => rating(next.ratings[item.id]));
  }
  return next;
}
// Pilot completion means every default Exact item has a self-check, not mastery.
// Variation / No hint are extra practice, and no rating or pronunciation is a failure.
export const isOutputComplete = (p: PracticeProgress) => exactExercises.every(item => rating(p.ratings[item.id]));
export function ratePractice(p: PracticeProgress, value: Rating): PracticeProgress {
  const items = practiceItems(p.mode);
  const ratings = { ...p.ratings, [items[p.cursors[p.mode]].id]: value };
  return { ...p, ratings, finished: { ...p.finished, [p.mode]: p.cursors[p.mode] === items.length - 1 && items.every(item => rating(ratings[item.id])) }, cursors: { ...p.cursors, [p.mode]: Math.min(p.cursors[p.mode] + 1, items.length - 1) } };
}
export function restartPractice(p: PracticeProgress): PracticeProgress {
  return { ...p, cursors: { ...p.cursors, [p.mode]: 0 }, finished: { ...p.finished, [p.mode]: false } };
}
export function parseReviewProgress(raw: unknown): ReviewProgress | null {
  const next = initialReviewProgress();
  if (!record(raw) || !Array.isArray(raw.selectedGroups) || !Array.isArray(raw.queue) || !record(raw.ratings) || typeof raw.completed !== 'boolean') return null;
  if (Array.isArray(raw.selectedGroups)) next.selectedGroups = [...new Set(raw.selectedGroups.filter((g): g is ExerciseGroup => ['story', 'conversation', 'output'].includes(g)))];
  const ids = new Set(allReviewExercises.map(item => item.id));
  if (!raw.queue.every(id => typeof id === 'string' && ids.has(id)) || new Set(raw.queue).size !== raw.queue.length) return null;
  next.queue = [...raw.queue];
  if (typeof raw.index !== 'number' || !Number.isInteger(raw.index) || raw.index < 0 || raw.index >= Math.max(1, next.queue.length)) return null;
  next.index = raw.index;
  next.ratings = cleanRatings(raw.ratings, next.queue);
  next.completed = raw.completed === true && next.queue.length > 0 && next.queue.every(id => rating(next.ratings[id]));
  return next;
}
export function startReview(p: ReviewProgress, ids: string[]): ReviewProgress {
  return parseReviewProgress({ ...p, queue: [...new Set(ids)], index: 0, ratings: {}, completed: false }) ?? initialReviewProgress();
}
export function rateReview(p: ReviewProgress, value: Rating): ReviewProgress {
  if (!p.queue.length || p.completed) return p;
  const ratings = { ...p.ratings, [p.queue[p.index]]: value };
  return { ...p, ratings, index: Math.min(p.index + 1, p.queue.length - 1), completed: p.index === p.queue.length - 1 && p.queue.every(id => rating(ratings[id])) };
}
