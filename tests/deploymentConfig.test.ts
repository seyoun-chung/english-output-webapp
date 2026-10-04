import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Header = { key: string; value: string };
type VercelConfig = { headers: Array<{ source: string; headers: Header[] }> };

describe('deployment safety configuration', () => {
  it('keeps the browser protections required by the hosted app', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as VercelConfig;
    const catchAll = config.headers.find(rule => rule.source === '/(.*)');
    const headers = Object.fromEntries(catchAll?.headers.map(header => [header.key, header.value]) ?? []);

    expect(headers).toMatchObject({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), geolocation=(), microphone=(self)',
    });
  });

  it('keeps private development and source-reference files out of Vercel uploads', () => {
    const ignored = new Set(readFileSync('.vercelignore', 'utf8').split(/\r?\n/).filter(Boolean));

    const requiredEntries = [
      '.git/', '.githooks/', '.vercel/', '.env*', 'docs/', 'tests/', 'scripts/',
      'supabase/', 'skills/', 'tmp/', 'node_modules/', '*.pdf', '*.docx', '*.mp3',
      '*.wav', '*.m4a', '*.mp4', '*.log',
    ];
    requiredEntries.forEach(entry => expect(ignored).toContain(entry));
    expect(ignored).not.toContain('src/');
    expect(ignored).not.toContain('index.html');
    expect(ignored).not.toContain('package.json');
  });
});
