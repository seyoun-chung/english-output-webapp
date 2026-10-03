import { describe, expect, it } from 'vitest';
import { accountStorage } from '../src/accountStorage';
import { STORAGE_KEY } from '../src/progress';
import { accountConfig } from '../src/supabaseAccount';
import { decideSync } from '../src/syncProtocol';
import { initialAppProgress } from '../src/appProgress';

const memory = (): Storage => {
  const map = new Map<string,string>();
  return { get length() { return map.size; }, key: i => [...map.keys()][i] ?? null, getItem: k => map.get(k) ?? null,
    setItem: (k,v) => { map.set(k,v); }, removeItem: k => { map.delete(k); }, clear: () => { map.clear(); } };
};
describe('account record scope and connection configuration', () => {
  it('keeps guest, account A, account B and different projects separate including recovery copies', () => {
    const storage = memory(); storage.setItem(STORAGE_KEY,'legacy guest');
    const a = accountStorage(storage,'project','a'), b = accountStorage(storage,'project','b');
    a.setItem(STORAGE_KEY,'A'); a.setItem(STORAGE_KEY+':before-restore:one','old A');
    b.setItem(STORAGE_KEY,'B');
    expect(storage.getItem(STORAGE_KEY)).toBe('legacy guest');
    expect(a.length).toBe(2); expect(b.length).toBe(1);
    expect(b.getItem(STORAGE_KEY+':before-restore:one')).toBeNull();
    expect(accountStorage(storage,'other','a').getItem(STORAGE_KEY)).toBeNull();
    expect(() => a.clear()).toThrow(); expect(() => a.getItem('auth-token')).toThrow();
  });
  it('does not connect when disabled and rejects secret keys or unsafe URLs', () => {
    expect(accountConfig({})).toBeNull();
    const config = { VITE_ACCOUNT_SYNC_ENABLED:'1',VITE_SUPABASE_URL:'https://example.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_localtest' };
    expect(accountConfig(config)?.url).toBe('https://example.supabase.co');
    const credentialFixture = new URL(config.VITE_SUPABASE_URL);
    credentialFixture.username = 'test-user';
    for (const url of ['http://example.supabase.co','https://evil.example','https://example.supabase.co/path',credentialFixture.href]) {
      expect(() => accountConfig({...config,VITE_SUPABASE_URL:url})).toThrow();
    }
    expect(() => accountConfig({...config,VITE_SUPABASE_PUBLISHABLE_KEY:'sb_secret_notallowed'})).toThrow();
  });
  it('treats reordered database JSON keys as the same progress', () => {
    const progress = initialAppProgress();
    const reordered = Object.fromEntries(Object.entries(progress).reverse()) as typeof progress;
    expect(decideSync(progress,null,reordered)).toBe('same');
  });
});
