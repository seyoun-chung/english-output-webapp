import { describe, expect, it } from 'vitest';
import { grammarExplanations, grammarPairs } from '../src/data/grammar';
import { initialGrammarProgress, parseGrammarProgress } from '../src/writingProgress';

describe('optional source grammar', () => {
  it('has five exact paired source examples', () => {
    expect(grammarPairs).toHaveLength(5);
    expect(grammarPairs.map(pair => [pair.ed, pair.ing])).toEqual([
      ['I’m interested in English.', 'The English book is interesting.'],
      ['She’s bored in class.', 'That class is boring.'],
      ['I am tired and overwhelmed.', 'The project was tiring and overwhelming.'],
      ['I was so frustrated.', 'It was so frustrating.'],
      ['I am annoyed.', 'It is annoying.'],
    ]);
    expect(grammarPairs.every(pair => pair.sourcePages.join(',') === '54,55' && !pair.reviewEligibility)).toBe(true);
    expect(grammarExplanations.people).toContain('그 사람의 특징');
  });
  it('tracks only study status without a recall score', () => {
    expect(initialGrammarProgress()).toEqual({ studied: false });
    expect(parseGrammarProgress({ studied: true, score: 100 })).toEqual({ studied: true });
    expect(parseGrammarProgress({ studied: 'yes' })).toBeNull();
    expect(parseGrammarProgress(null)).toBeNull();
  });
});
