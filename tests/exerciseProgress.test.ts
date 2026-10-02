import { describe, expect, it } from 'vitest';
import { allReviewExercises, buildReviewItems, exactExercises, outputExercises, variationExercises } from '../src/data/outputPractice';
import { initialPracticeProgress, initialReviewProgress, isNoHintComplete, isOutputComplete, parsePracticeProgress, parseReviewProgress, practiceItems, ratePractice, rateReview, restartPractice, startReview } from '../src/exerciseProgress';

describe('source-backed exercises', () => {
  it('has six exact and six supplemental pairs with unique IDs and provenance', () => {
    expect(exactExercises).toHaveLength(6); expect(variationExercises).toHaveLength(6);
    expect(new Set(allReviewExercises.map(item => item.id)).size).toBe(allReviewExercises.length);
    for (const item of allReviewExercises) {
      expect(item.korean).not.toBe(''); expect(item.english.length).toBeGreaterThan(0);
      expect(item.source.file.endsWith('.pdf')).toBe(true);
      expect(item.source.page ?? item.source.englishPage).toBeGreaterThan(0);
    }
  });
  it('uses only existing source prefixes and masked words for hints', () => {
    for (const item of allReviewExercises) {
      item.hint1.forEach((line, i) => expect(item.english[i].startsWith(line.replace(/…$/, ''))).toBe(true));
      item.hint2.forEach((line, i) => {
        const pattern = line.split('______').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\S+');
        expect(item.english[i]).toMatch(new RegExp(`^${pattern}$`));
      });
    }
  });
  it('no-hint mode reuses the source set rather than generating situations', () => expect(practiceItems('no-hint')).toEqual(outputExercises));
  it('review contains only source items previously rated in selected study records', () => {
    const items = buildReviewItems({ chunkRatings: { 1: 'effort', 2: null }, conversationRatings: { 3: 'review' }, outputRatings: { 'output-variation-2': 'immediate', invented: 'review' } });
    expect(items.map(item => item.id)).toEqual(['story-1', 'conversation-3', 'output-variation-2']);
    expect(buildReviewItems({ chunkRatings: {}, conversationRatings: {}, outputRatings: {} })).toEqual([]);
  });
});
describe('output state', () => {
  it('records each rating and advances while retaining earlier modes', () => {
    const first = ratePractice(initialPracticeProgress(), 'effort');
    const next = ratePractice({ ...first, mode: 'variation' }, 'review');
    expect(next.cursors).toEqual({ exact: 1, variation: 1, 'no-hint': 0 });
    expect(next.ratings['output-story-1']).toBe('effort');
    expect(next.ratings['output-variation-1']).toBe('review');
    expect(parsePracticeProgress(next)).toEqual(next);
  });
  it('basic completion counts any self-check, not pronunciation or an immediate rating', () => {
    let p = initialPracticeProgress();
    expect(isOutputComplete(p)).toBe(false);
    for (let i = 0; i < exactExercises.length; i++) p = ratePractice(p, 'review');
    expect(isOutputComplete(p)).toBe(true);
    expect(p.cursors.exact).toBe(5);
  });
  it('persists each completed mode view across refresh, mode changes, and restart', () => {
    let p = initialPracticeProgress();
    for (let i = 0; i < exactExercises.length; i++) p = ratePractice(p, 'effort');
    expect(p.finished.exact).toBe(true);
    const restored = parsePracticeProgress(JSON.parse(JSON.stringify(p)))!;
    expect(restored.finished.exact).toBe(true);
    const variation = ratePractice({ ...restored, mode: 'variation' }, 'review');
    expect(variation.finished).toEqual({ exact: true, variation: false, 'no-hint': false });
    const restarted = restartPractice({ ...variation, mode: 'exact' });
    expect(restarted.finished.exact).toBe(false); expect(restarted.cursors.exact).toBe(0);
    expect(restarted.ratings).toEqual(variation.ratings);
    expect(restarted.cursors.variation).toBe(1);
  });
  it('does not count earlier exact ratings as completed no-hint practice', () => {
    let p = initialPracticeProgress();
    for (let i = 0; i < exactExercises.length; i++) p = ratePractice(p, 'effort');
    expect(isNoHintComplete(p)).toBe(false);
    p = { ...p, mode: 'no-hint' };
    for (let i = 0; i < outputExercises.length; i++) p = ratePractice(p, 'effort');
    expect(isNoHintComplete(p)).toBe(true);
  });
  it('migrates absent completion views and rejects fake finished flags', () => {
    const old = { ...initialPracticeProgress(), finished: undefined };
    expect(parsePracticeProgress(old)?.finished).toEqual({ exact: false, variation: false, 'no-hint': false });
    expect(parsePracticeProgress({ ...old, finished: { exact: true } })?.finished.exact).toBe(false);
  });
  it('rejects invalid state and strips unknown data', () => {
    expect(parsePracticeProgress(null)).toBeNull();
    expect(parsePracticeProgress({ ...initialPracticeProgress(), mode: 'invented' })).toBeNull();
    expect(parsePracticeProgress({ ...initialPracticeProgress(), cursors: { exact: 99 } })).toBeNull();
    expect(parsePracticeProgress({ ...initialPracticeProgress(), audio: 'private', ratings: { invented: 'review' } })).toEqual(initialPracticeProgress());
  });
});
describe('review session state', () => {
  it('snapshots IDs and keeps review self-checks independent from original ratings', () => {
    const ids = ['story-1', 'conversation-2'];
    const p = startReview(initialReviewProgress(), ids); ids.push('story-2');
    const next = rateReview(p, 'review');
    expect(next.queue).toEqual(['story-1', 'conversation-2']);
    expect(next.ratings).toEqual({ 'story-1': 'review' });
    expect(next.index).toBe(1); expect(next.completed).toBe(false);
    expect(rateReview(next, 'effort').completed).toBe(true);
  });
  it('cannot complete an empty session or fake an unrated completion', () => {
    expect(rateReview(initialReviewProgress(), 'immediate')).toEqual(initialReviewProgress());
    expect(parseReviewProgress({ ...startReview(initialReviewProgress(), ['story-1']), completed: true })?.completed).toBe(false);
  });
  it('validates saved queue and strips non-source/private data', () => {
    expect(parseReviewProgress({})).toBeNull();
    expect(parseReviewProgress({ ...initialReviewProgress(), queue: ['future-chapter'] })).toBeNull();
    expect(parseReviewProgress({ ...initialReviewProgress(), queue: ['story-1', 'story-1'] })).toBeNull();
    expect(parseReviewProgress({ ...initialReviewProgress(), index: -1 })).toBeNull();
    expect(parseReviewProgress({ ...initialReviewProgress(), draft: 'learner output' })).toEqual(initialReviewProgress());
  });
  it('retains a finished session across refresh and can start a new snapshot', () => {
    const p = rateReview(startReview(initialReviewProgress(), ['story-1']), 'immediate');
    expect(parseReviewProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
    expect(startReview(p, ['conversation-1']).ratings).toEqual({});
  });
});
