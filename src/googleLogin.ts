import type { SupabaseClient } from '@supabase/supabase-js';
import type { AccountConfig } from './supabaseAccount';

export const loginFailure = 'Google sign-in did not finish. Please try again.';
export async function googleLoginUrl(client: SupabaseClient, config: AccountConfig, origin: string) {
  const destination = new URL('/', origin);
  if (destination.protocol !== 'https:' && !(destination.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(destination.hostname))) throw new Error(loginFailure);
  const { data, error } = await client.auth.signInWithOAuth({ provider: 'google', options: {
    redirectTo: destination.href, skipBrowserRedirect: true, scopes: 'openid email profile',
    queryParams: { prompt: 'select_account' },
  } });
  if (error || !data.url) throw new Error(loginFailure);
  const url = new URL(data.url);
  if (url.origin !== config.url || url.pathname !== '/auth/v1/authorize' || url.username || url.password || url.searchParams.get('provider') !== 'google') throw new Error(loginFailure);
  return url.href;
}

// Called once per page load, outside React StrictMode. Never render provider errors or codes.
export async function finishGoogleLogin(client: SupabaseClient, href: string, cleanUrl: (url: string) => void): Promise<string> {
  const url = new URL(href), hash = new URLSearchParams(url.hash.slice(1));
  const code = url.searchParams.get('code');
  const failed = url.searchParams.has('error') || hash.has('error');
  if (!code && !failed) return '';
  for (const key of ['code', 'error', 'error_code', 'error_description']) url.searchParams.delete(key);
  url.hash = '';
  cleanUrl(url.pathname + url.search);
  if (failed) return loginFailure;
  try {
    const { error } = await client.auth.exchangeCodeForSession(code!);
    return error ? loginFailure : '';
  } catch { return loginFailure; }
}
