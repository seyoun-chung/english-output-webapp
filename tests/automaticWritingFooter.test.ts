import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AutomaticScreen } from '../src/AutomaticScreen';
import { initialAppProgress, parseAppProgress } from '../src/appProgress';
import { updateAutomaticProgress } from '../src/automaticProgress';
import { initialProgress } from '../src/progress';
import { chapterContentById } from '../src/data/chapterContent';

describe('automatic writing return footer', () => {
  it.each(['empty', 'draft', 'complete'])('keeps return enabled and preserves %s writing on return/reentry', (state) => {
    const progress = initialAppProgress();
    for (const id of [1, 3] as const) {
      progress.chapters[id] = initialProgress(chapterContentById[id]);
      progress.chapters[id]!.passes[1].chunkRatings[1] = 'effort';
    }
    progress.automatic = {
      ...progress.automatic, screen: 'writing', selectedChapterIds: [1, 3],
      writingDraft: state === 'empty' ? '' : '사용자가 작성한 검증용 초안',
      writingCompletedAt: state === 'complete' ? '2026-10-07T00:00:00.000Z' : null,
    };
    const html = renderToStaticMarkup(createElement(AutomaticScreen, { progress, dispatch: () => {} }));
    expect(html).toContain('data-layout="back-forward"');
    expect(html).toMatch(/action-footer-back"><button class="secondary">/);
    expect(html).toContain('Pass 4+ 홈으로 돌아가기');
    expect(html.indexOf('action-footer-back')).toBeLessThan(html.indexOf('action-footer-forward'));
    expect(html.includes('disabled=""')).toBe(state === 'empty');
    const home = updateAutomaticProgress(progress.automatic, { type: 'home' });
    expect(home.screen).toBe('hub');
    const restored = parseAppProgress(JSON.stringify({ ...progress, automatic: home }));
    const reopened = updateAutomaticProgress(restored.automatic, { type: 'openWriting' });
    expect(reopened.writingDraft).toBe(progress.automatic.writingDraft);
    expect(reopened.writingCompletedAt).toBe(progress.automatic.writingCompletedAt);
    expect(reopened.selectedChapterIds).toEqual([1, 3]);
  });
});
