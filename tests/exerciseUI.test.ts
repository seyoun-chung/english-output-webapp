import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ExerciseCard } from '../src/ExerciseCard';
import { OutputPractice } from '../src/OutputPractice';
import { ReviewScreen } from '../src/ReviewScreen';
import { exactExercises, variationExercises } from '../src/data/outputPractice';
import { initialPracticeProgress, initialReviewProgress, parsePracticeProgress, practiceModes, ratePractice, rateReview, startReview } from '../src/exerciseProgress';
const noop = () => {};
describe('exercise screen boundaries', () => {
  it('initial practice hides target English and self-check until answer reveal', () => {
    const html = renderToStaticMarkup(createElement(ExerciseCard, { item: variationExercises[0], position: 1, total: 6, onRate: noop }));
    expect(html).toContain('나는 밤에 샤워하는걸 선호해.');
    expect(html).not.toContain('I prefer to shower at night.');
    expect(html).toContain('Show answer');
    expect(html).not.toContain('어땠나요?');
  });
  it('no-hint mode omits both hints but preserves answer reveal', () => {
    const html = renderToStaticMarkup(createElement(ExerciseCard, { item: variationExercises[0], noHints: true, position: 1, total: 6, onRate: noop }));
    expect(html).not.toContain('Hint 1'); expect(html).not.toContain('Hint 2');
    expect(html).toContain('Show answer');
  });
  it('output offers all three modes without requiring any previous section', () => {
    const html = renderToStaticMarkup(createElement(OutputPractice, { progress: initialPracticeProgress(), onChange: noop, onOverview: noop, onNext: noop }));
    for (const label of ['Exact recall', 'Variation', 'No hint', 'Show answer']) expect(html).toContain(label);
  });
  it.each(practiceModes)('omits Previous on the first %s item and shows it after moving forward', (mode) => {
    const initial = { ...initialPracticeProgress(), mode };
    const first = renderToStaticMarkup(createElement(OutputPractice, { progress: initial, onChange: noop, onOverview: noop, onNext: noop }));
    expect(first).not.toMatch(/<button[^>]*>Previous<\/button>/);
    expect(first).toContain('Back to overview');
    const next = { ...initial, cursors: { ...initial.cursors, [mode]: 1 } };
    const second = renderToStaticMarkup(createElement(OutputPractice, { progress: next, onChange: noop, onOverview: noop, onNext: noop }));
    expect(second).toMatch(/<button[^>]*>Previous<\/button>/);
  });
  it('restored completed output renders the summary and restart without re-rating', () => {
    let progress = initialPracticeProgress();
    for (let i = 0; i < exactExercises.length; i++) progress = ratePractice(progress, 'effort');
    const restored = parsePracticeProgress(JSON.parse(JSON.stringify(progress)))!;
    const html = renderToStaticMarkup(createElement(OutputPractice, { progress: restored, onChange: noop, onOverview: noop, onNext: noop }));
    expect(html).toContain('Practice complete'); expect(html).toContain('Practice again'); expect(html).toContain('Next: Variation');
    expect(html).toContain('Weekly Writing');
    expect(html).not.toContain('Skip to Weekly Writing');
    expect(html).not.toContain('Next: Grammar Focus');
    expect(html).not.toContain('Show answer'); expect(html).not.toContain('Record');
  });
  it('review has an empty state and does not introduce unstudied questions', () => {
    const html = renderToStaticMarkup(createElement(ReviewScreen, { progress: initialReviewProgress(), onChange: noop, onOverview: noop, onNext: noop, eligibleItems: [] }));
    expect(html).toContain('No practiced items yet.'); expect(html).not.toContain('Show answer'); expect(html).not.toContain('Record');
  });
  it('does not strand a disabled Previous control on the first review item', () => {
    const progress = startReview(initialReviewProgress(), [exactExercises[0].id, exactExercises[1].id]);
    const first = renderToStaticMarkup(createElement(ReviewScreen, { progress, onChange: noop, onOverview: noop, onNext: noop, eligibleItems: exactExercises.slice(0, 2) }));
    expect(first).not.toMatch(/<button[^>]*>Previous<\/button>/);
    const second = renderToStaticMarkup(createElement(ReviewScreen, { progress: { ...progress, index: 1 }, onChange: noop, onOverview: noop, onNext: noop, eligibleItems: exactExercises.slice(0, 2) }));
    expect(second).toMatch(/<button[^>]*>Previous<\/button>/);
  });
  it('completed review shows session summary without a microphone or question', () => {
    const progress = rateReview(startReview(initialReviewProgress(), [exactExercises[0].id]), 'effort');
    const html = renderToStaticMarkup(createElement(ReviewScreen, { progress, onChange: noop, onOverview: noop, onNext: noop, eligibleItems: [exactExercises[0]] }));
    expect(html).toContain('Review complete'); expect(html).toContain('1 to review'); expect(html).toContain('Next: Chapter progress'); expect(html).not.toContain('Record');
  });
  it('invalidated eligibility shows selection instead of exposing an unstudied item', () => {
    const progress = startReview(initialReviewProgress(), [exactExercises[0].id]);
    const html = renderToStaticMarkup(createElement(ReviewScreen, { progress, onChange: noop, onOverview: noop, onNext: noop, eligibleItems: [] }));
    expect(html).toContain('No practiced items yet.'); expect(html).not.toContain('Show answer');
  });
});
