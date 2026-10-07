import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { headerVisibility } from '../src/ScrollAwareHeader';

describe('scroll-aware shared navigation', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  const css = readFileSync('src/scroll-aware-header.css', 'utf8');

  it('shares behavior across library, learning and automatic screens', () => {
    expect(app.match(/<ScrollAwareHeader /g)).toHaveLength(2);
    expect(app).toContain('header-section');
    expect(readFileSync('src/AutomaticScreen.tsx', 'utf8')).toContain('<ScrollAwareHeader');
  });

  it('shows at the top and hides only after deliberate down-scroll', () => {
    expect(headerVisibility(0, 200, false, 88).visible).toBe(true);
    expect(headerVisibility(95, 0, true, 88).visible).toBe(true);
    expect(headerVisibility(180, 95, true, 88).visible).toBe(false);
  });

  it('reveals on up-scroll and ignores small scroll jitter', () => {
    expect(headerVisibility(160, 180, false, 88).visible).toBe(true);
    expect(headerVisibility(175, 180, false, 88)).toEqual({ visible: false, anchor: 180 });
  });

  it('reserves clearance, restores keyboard access and respects reduced motion', () => {
    expect(css).toContain('position: fixed');
    expect(css).toContain('padding-top: var(--navigation-height)');
    expect(css).toContain(':has(:focus-visible)');
    expect(css).toContain('prefers-reduced-motion');
  });

  it('keeps the unfocused skip link clipped and outside pointer hit testing', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    const hidden = styles.match(/\.skip-link\s*\{([^}]+)\}/)?.[1] ?? '';
    const focused = styles.match(/\.skip-link:focus\s*\{([^}]+)\}/)?.[1] ?? '';
    // CSS contract guard; actual clipping/stacking is verified in the rendered browser.
    expect(hidden).toMatch(/clip-path:\s*inset\(50%\)/);
    expect(hidden).toMatch(/pointer-events:\s*none/);
    expect(focused).toMatch(/clip-path:\s*none/);
    expect(focused).toMatch(/pointer-events:\s*auto/);
  });

  it('provides a programmatically focusable native skip destination', () => {
    expect(app).toMatch(/<main\s+id="main-content"[^>]*tabIndex=\{-1\}/);
    expect(app).toContain('href="#main-content"');
  });
});
