import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { ActionFooter } from '../src/ActionFooter';
import { RecallRatingButtons } from '../src/RecallRatingButtons';
import { ExerciseCard } from '../src/ExerciseCard';
import { exactExercises } from '../src/data/outputPractice';
import { coreCompletion, isPassReady } from '../src/chapterCompletion';
import { initialProgress } from '../src/progress';
import App from '../src/App';
import { ConversationScreen } from '../src/ConversationScreen';
import { initialConversationProgress } from '../src/conversationProgress';
import { OutputPractice } from '../src/OutputPractice';
import { isOutputComplete, initialPracticeProgress, practiceItems, ratePractice, type PracticeMode } from '../src/exerciseProgress';
import { WritingScreen } from '../src/WritingScreen';
import { completeWriting, editWritingDraft, initialWritingProgress, isWritingModeComplete, parseWritingProgress, type WritingMode } from '../src/writingProgress';

const noop = () => {};
const button = (label: string) => createElement('button', { type: 'button' }, label);
const markup = (element: ReturnType<typeof createElement>) => renderToStaticMarkup(element);
afterEach(() => vi.unstubAllGlobals());

describe('UX flow footer contract', () => {
  it.each([
    [{ back: button('Overview') }, 1, 'back'],
    [{ back: button('Overview'), middle: button('Practice') }, 2, 'back-middle'],
    [{ back: button('Overview'), forward: button('Next') }, 2, 'back-forward'],
    [{ middle: button('Practice'), forward: button('Next') }, 2, 'middle-forward'],
    [{ back: button('Overview'), middle: button('Practice'), forward: button('Next') }, 3, 'back-middle-forward'],
  ] as const)('exposes the correct action count and semantic layout %#', (actions, count, layout) => {
    const html = markup(createElement(ActionFooter, actions));
    expect(html).toContain(`data-actions="${count}"`);
    expect(html).toContain(`data-layout="${layout}"`);
    expect((html.match(/<button\b/g) ?? [])).toHaveLength(count);
    for (const slot of ['back', 'middle', 'forward'] as const) {
      expect(html.includes(`class="action-footer-${slot}"`)).toBe(Object.hasOwn(actions, slot));
    }
  });

  it('keeps each action in its semantic slot, left to right', () => {
    const html = markup(createElement(ActionFooter, { back: button('Overview'), middle: button('Practice'), forward: button('Next') }));
    expect(html.indexOf('action-footer-back')).toBeLessThan(html.indexOf('action-footer-middle'));
    expect(html.indexOf('action-footer-middle')).toBeLessThan(html.indexOf('action-footer-forward'));
  });

  it('has desktop rules for two actions and a single-column mobile fallback', () => {
    const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
    expect(css).toMatch(/\.action-footer\[data-actions="2"\]\[data-layout="back-middle"\][^}]*grid-column:\s*3/);
    expect(css).toMatch(/\.action-footer\[data-actions="2"\]\[data-layout="middle-forward"\][^}]*grid-column:\s*1/);
    expect(/@media\s*\(max-width:\s*(?:700|900)px\)\s*\{\s*\.action-footer\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(css)).toBe(true);
  });
});

describe('shared self-check controls', () => {
  it('pairs the three approved ratings with visible icons and accessible labels', () => {
    const html = markup(createElement(RecallRatingButtons, { onRate: noop }));
    expect((html.match(/class="rating /g) ?? [])).toHaveLength(3);
    for (const [rating, icon, label] of [
      ['immediate', '✓', '바로 나왔어요'],
      ['effort', '≈', '생각해서 나왔어요'],
      ['review', '↻', '다시 봐야 해요'],
    ]) {
      expect(html).toMatch(new RegExp(`class="rating ${rating}"[^>]*><span aria-hidden="true">${icon}</span>${label}</button>`));
    }
  });

  it('does not expose rating choices before the source answer is shown', () => {
    const html = markup(createElement(ExerciseCard, { item: exactExercises[0], position: 1, total: 1, onRate: noop }));
    expect(html).not.toContain('class="rating-buttons"');
    expect(html).toContain('Show answer');
  });
});

describe('local navigation labels', () => {
  it('keeps Read story on the right without a competing back arrow', () => {
    const progress = { ...initialProgress(), currentScreen: 'recall' as const };
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(progress) });
    const html = markup(createElement(App));
    expect(html).toContain('data-layout="back-middle"');
    expect(html).toMatch(/action-footer-middle[\s\S]*?<button[^>]*>Read story<\/button>/);
    expect(html).not.toContain('← Read story');
  });

  it('keeps Read dialogue and Previous turn arrow-free inside the role view', () => {
    const progress = { ...initialConversationProgress(), view: 'role' as const, role: 'A' as const };
    for (const index of [0, 1]) {
      const state = { ...progress, positions: { ...progress.positions, A: index } };
      const html = markup(createElement(ConversationScreen, { progress: state, dispatch: noop, onOverview: noop, onNext: noop }));
      expect(html).toContain('data-layout="back-middle"');
      expect(html).toMatch(new RegExp(`action-footer-middle[\\s\\S]*?<button[^>]*>${index ? 'Previous turn' : 'Read dialogue'}<\\/button>`));
      expect(html).not.toContain(index ? '← Previous turn' : '← Read dialogue');
    }
  });
});

describe('core completion boundary', () => {
  it('never treats optional sections or extra practice modes as Pass 1 requirements', () => {
    const progress = initialProgress();
    const ids = coreCompletion(progress).map(section => section.id);
    expect(ids).toEqual(['myStory', 'conversation', 'output', 'writing']);
    progress.grammar.studied = true;
    progress.about.completedQuestionIds.push(progress.about.selectedQuestionId);
    progress.output.finished.variation = true;
    progress.output.finished['no-hint'] = true;
    expect(isPassReady(progress)).toBe(false);
  });
});

function finishOutputMode(mode: PracticeMode, withExact = false) {
  let progress = initialPracticeProgress();
  if (withExact) {
    for (const _item of practiceItems('exact')) progress = ratePractice(progress, 'effort');
  }
  progress = { ...progress, mode };
  for (const _item of practiceItems(mode)) progress = ratePractice(progress, 'effort');
  return progress;
}

describe('sequential practice modes without a forced pace', () => {
  it.each([
    ['exact', 'Next: Variation'],
    ['variation', 'Next: No hint'],
    ['no-hint', 'Next: Weekly Writing'],
  ] as const)('offers the next step after completing %s', (mode, nextLabel) => {
    const progress = finishOutputMode(mode, mode !== 'exact');
    const html = markup(createElement(OutputPractice, { progress, onChange: noop, onOverview: noop, onNext: noop }));
    expect(html).toContain(nextLabel);
    expect(html).toContain('Practice again');
    expect(html).toContain('Back to overview');
    expect(html).toContain(`data-actions="${mode === 'no-hint' ? 2 : 3}"`);
  });

  it('makes Weekly Writing reachable once core Exact is complete, without extra modes', () => {
    const progress = finishOutputMode('exact');
    expect(isOutputComplete(progress)).toBe(true);
    expect(progress.finished.variation).toBe(false);
    expect(progress.finished['no-hint']).toBe(false);
    const html = markup(createElement(OutputPractice, { progress, onChange: noop, onOverview: noop, onNext: noop }));
    expect(html).toContain('Next: Variation');
    expect(html).toMatch(/action-footer-middle[\s\S]*?Weekly Writing/);
  });

  it.each([
    ['free', 'Next: Guided'],
    ['guided', 'Next: Template'],
    ['template', 'Next: Chapter Review'],
  ] as const)('offers the next writing step after completing %s', (mode, nextLabel) => {
    const progress = completeWriting(editWritingDraft({ ...initialWritingProgress(), mode }, 'My own draft.'));
    const html = markup(createElement(WritingScreen, { progress, onChange: noop, onOverview: noop, onNext: noop }));
    expect(html).toContain(nextLabel);
    expect(html).toContain('Back to overview');
    expect(isWritingModeComplete(progress, mode as WritingMode)).toBe(true);
    expect(progress.completed).toBe(true);
    if (mode !== 'template') expect(html).toMatch(/action-footer-middle[\s\S]*?Chapter Review/);
  });

  it('preserves one completed draft while practicing later modes and migrating old progress', () => {
    const free = completeWriting(editWritingDraft(initialWritingProgress(), 'My own draft.'));
    const guided = completeWriting(editWritingDraft({ ...free, mode: 'guided' }, 'A different draft.'));
    const changed = editWritingDraft({ ...guided, mode: 'guided' }, 'Changed draft.');
    expect(isWritingModeComplete(changed, 'free')).toBe(true);
    expect(isWritingModeComplete(changed, 'guided')).toBe(false);
    expect(changed.completed).toBe(true);
    const { completedDrafts: _newField, ...legacy } = free;
    const restored = parseWritingProgress(legacy);
    expect(restored?.completed).toBe(true);
    expect(restored && isWritingModeComplete(restored, 'free')).toBe(true);
  });
});
