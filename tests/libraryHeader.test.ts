import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('chapter library sticky navigation', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  const css = readFileSync('src/library-skin.css', 'utf8');

  it('limits the new sticky header class to the chapter library', () => {
    expect(app.match(/className="topbar library-topbar"/g)).toHaveLength(1);
    expect(app).toMatch(/<div className="library-shell">\s+<header className="topbar library-topbar">/);
  });

  it('pins navigation without taking it out of document flow', () => {
    expect(css).toMatch(/\.library-shell > \.library-topbar\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;[^}]*z-index:\s*10;/);
  });

  it('reserves keyboard scroll clearance at desktop and mobile header sizes', () => {
    expect(css).toContain('html:has(.library-topbar) { scroll-padding-top: 100px; }');
    expect(css).toMatch(/@media \(max-width: 700px\)\s*\{\s*html:has\(\.library-topbar\) \{ scroll-padding-top: 82px; \}/);
  });
});
