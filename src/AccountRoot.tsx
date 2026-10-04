import { useEffect, useMemo, useRef, useState } from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import App from './App';
import { accountStorage } from './accountStorage';
import { accountConfig, makeAccountClient, supabaseSyncTransport, type AccountConfig } from './supabaseAccount';
import './account.css';
import { finishGoogleLogin, googleLoginUrl, loginFailure } from './googleLogin';

const loginVerificationFailure = '로그인 상태를 확인하지 못했어요. 인터넷 연결 후 다시 시도해 주세요.';

export function AccountShell({ client, config, initialMessage = '' }: { client: SupabaseClient; config: AccountConfig; initialMessage?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(initialMessage);
  const [retry, setRetry] = useState(0);
  const verifiedUser = useRef<string | null>(null);
  const flush = useRef<(() => Promise<boolean>) | null>(null);
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
        setMessage(result.error ? loginVerificationFailure : '');
      }).catch(() => {
        if (alive && generation === captured) { setUser(null); setChecking(false); setMessage(loginVerificationFailure); }
      });
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [client, retry]);
  const account = useMemo(() => {
    if (!user) return null;
    try { return { storage: accountStorage(localStorage, config.url, user.id), transport: supabaseSyncTransport(client, config, user.id) }; }
    catch { return null; }
  }, [client, config, user?.id]);
  if (checking) return <main className="account-card"><p role="status">로그인 상태를 확인하고 있어요…</p></main>;
  if (user) return <>
    <header className="account-bar">
      {message && <p role="status">{message}</p>}
      <button className="account-signout" disabled={busy} onClick={async () => {
        setBusy(true);
        try {
          if (!flush.current || !(await flush.current())) {
            setMessage('계정에 기록을 저장하지 못했어요. 인터넷 연결을 확인하고 다시 로그아웃해 주세요. 이 기기의 기록은 남아 있어요.');
            return;
          }
          setChecking(true);
          const { error } = await client.auth.signOut({ scope: 'local' });
          if (error) { setMessage('Sign out failed. Reconnect and retry before sharing this device.'); }
          else { setUser(null); setMessage(''); }
        } catch { setMessage('Sign out failed. Reconnect and retry before sharing this device.'); }
        finally { setChecking(false); setBusy(false); }
      }}>로그아웃</button>
    </header>
    {account ? <App key={user.id} storage={account.storage} syncTransport={account.transport} registerFlush={value => { flush.current = value; }} /> : <p role="alert">Browser storage is unavailable. Allow storage and reload.</p>}
  </>;
  return <main className="account-card">
    <h1>어디서든 학습하세요</h1>
    <p>Google 계정으로 로그인 하기</p>
    <button className="primary" disabled={busy} onClick={async () => {
      if (busy) return; setBusy(true); setMessage('');
      try {
        window.location.assign(await googleLoginUrl(client, config, window.location.origin));
      } catch { setMessage(loginFailure); }
      finally { setBusy(false); }
    }}>{busy ? 'Google로 연결 중…' : 'Google로 계속하기'}</button>
    {message && <p className="account-feedback" role="alert">{message}</p>}
    {(message === loginFailure || message === loginVerificationFailure) &&
      <button className="secondary" onClick={() => { setChecking(true); setRetry(n => n + 1); }}>로그인 상태 다시 확인</button>}
    <p className="account-help">공용 기기에서는 사용 후 로그아웃 하세요.</p>
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
  if (setup.error || !('client' in setup)) return <main className="account-card"><h1>로그인 연결을 설정해 주세요</h1><p role="alert">연결하지 못했어요. 승인된 계정 연결 설정을 확인해 주세요.</p></main>;
  if (result === null) return <main className="account-card"><p role="status">로그인을 마무리하고 있어요…</p></main>;
  return <AccountShell client={setup.client} config={setup.config} initialMessage={result} />;
}
