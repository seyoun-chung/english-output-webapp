import { describe, expect, it } from 'vitest';
import { writingQuestions, writingTemplates } from '../src/data/writing';
import { readFileSync } from 'node:fs';

describe('source-locked writing', () => {
  it('retains all ten questions with source provenance and no review eligibility', () => {
    expect(writingQuestions).toHaveLength(10);
    expect(new Set(writingQuestions.map(item => item.id)).size).toBe(10);
    expect(writingQuestions.every(item => item.sourcePage === 65 && item.chapterId === 3 && !item.reviewEligibility)).toBe(true);
    expect(writingQuestions[1].english).toBe('In your opinion, what are some of your best personality traits?');
    expect(writingQuestions[3].english).toBe('What personality traits do you admire in other people?');
    expect(writingQuestions[5].english).toBe('Are you more of a leader or a follower? Why?');
  });
  it('keeps seven textbook template starters with printed blank representation', () => {
    expect(writingTemplates).toHaveLength(7);
    expect(writingTemplates.every(item => item.sourcePage === 64 && item.english.includes('___'))).toBe(true);
    expect(writingTemplates[4].english).toBe('I used to be more ___, but I’ve grown more ___');
  });
  it('uses shared editor and controlled callbacks, never external persistence or AI', () => {
    const writing = readFileSync(new URL('../src/WritingScreen.tsx', import.meta.url), 'utf8');
    const about = readFileSync(new URL('../src/AboutScreen.tsx', import.meta.url), 'utf8');
    expect(about).toContain('WritingEditor');
    expect(writing).toContain('Drafts are saved with your learning progress');
    expect(writing).not.toContain('Drafts stay in this browser');
    expect(writing + about).not.toMatch(/localStorage|fetch\(|dangerouslySetInnerHTML|XMLHttpRequest/);
  });
});
