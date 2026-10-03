import { useEffect, useMemo, useRef, useState } from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import App from './App';
import { accountStorage } from './accountStorage';
import { accountConfig, makeAccountClient, supabaseSyncTransport, type AccountConfig } from './supabaseAccount';
import './account.css';
import { finishGoogleLogin, googleLoginUrl, loginFailure } from './googleLogin';

export function AccountShell({ client, config, initialMessage = '' }: { client: SupabaseClient; config: AccountConfig; initialMessage?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(initialMessage);
  const [retry, setRetry] = useState(0);
  const verifiedUser = useRef<string | null>(null);
  useEffect(() => {
    let alive = true, generation = 0;
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      const captured = ++generation;
      if (!alive) return;
      if (!session) { verifiedUser.current = null; setUser(null); setChecking(false); return; }
      if (session.user.id !== verifiedUser.current) { setUser(null); setChecking(true); }
      // Validate with Auth before displaying private cached progress. Do not trust
      // the user object from browser storage alone. Explicit JWT avoids auth-lock reentry.
      void client.auth.getUser(session.access_token).then(result => {
        if (!alive || generation !== captured) return;
        verifiedUser.current = result.error ? null : result.data.user?.id ?? null;
        setUser(result.error ? null : result.data.user); setChecking(false);
        setMessage(result.error ? 'Could not verify your login. Reconnect and try again.' : '');
      }).catch(() => {
        if (alive && generation === captured) { setUser(null); setChecking(false); setMessage('Could not verify your login. Reconnect and try again.'); }
      });
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [client, retry]);
  const account = useMemo(() => {
    if (!user) return null;
    try { return { storage: accountStorage(localStorage, config.url, user.id), transport: supabaseSyncTransport(client, config, user.id) }; }
    catch { return null; }
  }, [client, config, user?.id]);
  if (checking) return <main className="account-card"><p role="status">Checking your account…</p></main>;
  if (user) return <>
    <header className="account-bar"><span>Signed in as {user.email ?? 'your account'}</span>
      <button className="secondary" disabled={busy} onClick={async () => {
        setBusy(true); setChecking(true);
        try {
          const { error } = await client.auth.signOut({ scope: 'local' });
          if (error) { setMessage('Sign out failed. Reconnect and retry before sharing this device.'); }
          else { setUser(null); setMessage('Signed out. Local account copies remain on this browser.'); }
        } catch { setMessage('Sign out failed. Reconnect and retry before sharing this device.'); }
        finally { setChecking(false); setBusy(false); }
      }}>Sign out</button>
      {message && <p role="status">{message}</p>}
    </header>
    {account ? <App key={user.id} storage={account.storage} syncTransport={account.transport} /> : <p role="alert">Browser storage is unavailable. Allow storage and reload.</p>}
  </>;
  return <main className="account-card">
    <h1>Your learning, anywhere</h1>
    <p>Use the same Google account on each device.</p>
    <p>Your progress and writing stay separate from other accounts. Audio is not uploaded.</p>
    <button className="primary" disabled={busy} onClick={async () => {
      if (busy) return; setBusy(true); setMessage('');
      try {
        window.location.assign(await googleLoginUrl(client, config, window.location.origin));
      } catch { setMessage(loginFailure); }
      finally { setBusy(false); }
    }}>{busy ? 'Opening Google…' : 'Continue with Google'}</button>
    {message && <p role="alert">{message}</p>}
    <button className="secondary" onClick={() => { setChecking(true); setRetry(n => n + 1); }}>Check login again</button>
    <p>On a shared device, sign out when finished. Browser copies are not encrypted.</p>
  </main>;
}

// One auth client per module, not per render/StrictMode initializer invocation.
const setup = (() => {
    try { const config = accountConfig(import.meta.env); return config ? { config, client: makeAccountClient(config), error: false } : null; }
    catch { return { error: true } as const; }
})();
const callback = setup && !setup.error && 'client' in setup
  ? finishGoogleLogin(setup.client, window.location.href, url => window.history.replaceState(null, '', url))
  : Promise.resolve('');

export default function AccountRoot() {
  const [result, setResult] = useState<string | null>(null);
  useEffect(() => { let active = true; void callback.then(message => { if (active) setResult(message); }); return () => { active = false; }; }, []);
  if (!setup) return <App />;
  if (setup.error || !('client' in setup)) return <main className="account-card"><h1>Account setup unavailable</h1><p role="alert">No connection was made. Check the approved account configuration.</p></main>;
  if (result === null) return <main className="account-card"><p role="status">Finishing sign-in…</p></main>;
  return <AccountShell client={setup.client} config={setup.config} initialMessage={result} />;
}
