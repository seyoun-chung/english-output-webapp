import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { finishGoogleLogin, googleLoginUrl, loginFailure } from '../src/googleLogin';
const config = {url:'https://example.supabase.co',key:'sb_publishable_localtest'};
describe('Google PKCE login boundary', () => {
  it('uses only Google basic identity scopes and a fixed same-origin return URL', async () => {
    const signInWithOAuth = vi.fn().mockResolvedValue({data:{url:config.url+'/auth/v1/authorize?provider=google'},error:null});
    const client = {auth:{signInWithOAuth}} as unknown as SupabaseClient;
    await googleLoginUrl(client,config,'https://app.example.test');
    expect(signInWithOAuth).toHaveBeenCalledWith({provider:'google',options:{redirectTo:'https://app.example.test/',skipBrowserRedirect:true,scopes:'openid email profile',queryParams:{prompt:'select_account'}}});
    signInWithOAuth.mockResolvedValue({data:{url:'https://evil.example/auth/v1/authorize?provider=google'},error:null});
    await expect(googleLoginUrl(client,config,'https://app.example.test')).rejects.toThrow(loginFailure);
  });
  it('cleans callback codes before exchanging and hides provider errors', async () => {
    const clean = vi.fn(), exchangeCodeForSession = vi.fn().mockImplementation(async()=> {
      expect(clean).toHaveBeenCalledWith('/?keep=yes'); return {error:{message:'private provider details'}};
    });
    const client = {auth:{exchangeCodeForSession}} as unknown as SupabaseClient;
    expect(await finishGoogleLogin(client,'https://app.example.test/?code=test-code&keep=yes',clean)).toBe(loginFailure);
    expect(exchangeCodeForSession).toHaveBeenCalledWith('test-code');
  });
  it('handles cancel, ordinary reload and successful exchange without altering stored records', async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({error:null}), clean=vi.fn();
    const client = {auth:{exchangeCodeForSession}} as unknown as SupabaseClient;
    expect(await finishGoogleLogin(client,'https://app.example.test/#error=access_denied',clean)).toBe(loginFailure);
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
    expect(await finishGoogleLogin(client,'https://app.example.test/',clean)).toBe('');
    expect(await finishGoogleLogin(client,'https://app.example.test/?code=test-code',clean)).toBe('');
    expect(exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });
});
