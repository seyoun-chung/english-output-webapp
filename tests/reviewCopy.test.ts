import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReviewScreen } from '../src/ReviewScreen';
import { chapter3Content } from '../src/data/chapterContent';
import { initialReviewProgress, rateReview, startReview } from '../src/exerciseProgress';

describe('simple English review copy', () => {
  it.each([1, 2, 3] as const)('uses English in empty, choice and completed Pass %s screens', pass => {
    const item = chapter3Content.exercises.review[0];
    const initial = initialReviewProgress();
    const completed = rateReview(startReview(initial, [item.id]), 'immediate');
    for (const state of ['empty', 'choice', 'complete'] as const) {
      const html = renderToStaticMarkup(createElement(ReviewScreen, {
        pass, progress: state === 'complete' ? completed : initial,
        eligibleItems: state === 'empty' ? [] : [item],
        learnedRatings: { [item.id]: 'review' },
        onChange: () => {}, onOverview: () => {}, onNext: () => {},
      }));
      expect(html).not.toMatch(/[가-힣]/);
      expect(html).toContain('Practice all');
      expect(html).toContain('Practice difficult ones');
      expect(html).toContain('Rate every question to finish. Practice again anytime.');
      if (state === 'complete') {
        expect(html).toContain('1 question reviewed');
        expect(html).toContain('No difficult questions left!');
      }
    }
  });
});
