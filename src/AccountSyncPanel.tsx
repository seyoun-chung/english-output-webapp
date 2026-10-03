import { useEffect, useRef, useState } from 'react';
import type { AppProgress } from './appProgress';
import { createProgressBackup, validateCurrentProgress } from './progressBackup';
import { STORAGE_KEY } from './progress';
import { SyncConflict, SyncSession, type SyncTransport } from './syncClient';
import type { SyncSnapshot } from './syncProtocol';

const preferenceKey = `${STORAGE_KEY}:sync-preference`;
export function AccountSyncPanel({ progress, transport, disabled, onRestore, storage }: {
  progress: AppProgress; transport: SyncTransport; disabled: boolean;
  storage?: Storage;
  onRestore: (text: string, expected: string) => Promise<void>;
}) {
  const [preference] = useState(() => {
    try {
      const value = JSON.parse(storage?.getItem(preferenceKey) ?? 'null');
      return { enabled: value?.enabled === true, baseline: value?.baseline ? validateCurrentProgress(value.baseline) : null };
    } catch { return { enabled: false, baseline: null }; }
  });
  const [session] = useState(() => new SyncSession(transport, preference.baseline));
  const [enabled, setEnabled] = useState(preference.enabled);
  const [message, setMessage] = useState('Saved on this browser. Enable sync to save to your account.');
  const [conflict, setConflict] = useState<SyncSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const working = useRef(false), mounted = useRef(true);
  const latest = useRef({ progress, disabled, onRestore, enabled, conflict });
  latest.current = { progress, disabled, onRestore, enabled, conflict };
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const remember = (value: boolean) => {
    try { storage?.setItem(preferenceKey, JSON.stringify({ enabled: value, baseline: session.getBaseline() })); return true; }
    catch { return false; }
  };
  const sync = async (choice: 'check' | 'local' | 'remote' = 'check') => {
    const state = latest.current;
    if (!mounted.current || working.current || state.disabled) return;
    if (choice === 'check' && state.conflict) return;
    working.current = true; setBusy(true);
    const expected = JSON.stringify(state.progress);
    try {
      if (choice === 'remote') {
        if (!state.conflict?.progress) return;
        await state.onRestore(createProgressBackup(state.conflict.progress), expected);
        if (!mounted.current) return;
        session.accept(state.conflict);
      } else if (choice === 'local') {
        if (!state.conflict) return;
        await session.chooseLocal(state.progress, state.conflict);
      } else {
        const result = await session.check(state.progress);
        if (!mounted.current) return;
        if (result.action === 'download') {
          await latest.current.onRestore(createProgressBackup(result.snapshot.progress!), expected);
          if (!mounted.current) return;
          session.accept(result.snapshot);
        }
      }
      if (mounted.current) {
        setConflict(null);
        setMessage(remember(latest.current.enabled) ? 'Synced to your account.' : 'Synced. Browser storage is full; download a backup and enable sync again next time.');
      }
    } catch (error) {
      if (!mounted.current) return;
      if (error instanceof SyncConflict) setConflict(error.snapshot);
      setMessage(error instanceof Error ? error.message : 'Sync failed. Your local record is safe.');
    } finally { working.current = false; if (mounted.current) setBusy(false); }
  };
  const run = useRef(sync); run.current = sync;
  useEffect(() => {
    if (!enabled || disabled || conflict) return;
    const timer = window.setTimeout(() => void run.current(), 1200);
    return () => window.clearTimeout(timer);
  }, [progress, enabled, disabled, conflict]);
  useEffect(() => {
    if (!enabled) return;
    const check = () => { if (document.visibilityState === 'visible' && navigator.onLine) void run.current(); };
    window.addEventListener('online', check); window.addEventListener('focus', check);
    const timer = window.setInterval(check, 30000);
    return () => { window.removeEventListener('online', check); window.removeEventListener('focus', check); window.clearInterval(timer); };
  }, [enabled]);
  return <aside className="backup-bar" aria-label="Account sync"><details>
    <summary>Account sync</summary><div className="backup-panel">
      <p>Sync progress, ratings and writing across your devices. Audio is not uploaded.</p>
      <div className="backup-actions">
        <button className="secondary" disabled={busy || disabled || Boolean(conflict)} onClick={() => { setEnabled(true); remember(true); void sync(); }}>{enabled ? 'Sync now' : 'Enable sync'}</button>
        {enabled && <button className="secondary" disabled={busy} onClick={() => { setEnabled(false); remember(false); setMessage('Automatic sync paused. Local saving continues.'); }}>Pause sync</button>}
      </div>
      {conflict && <section aria-label="Sync conflict"><h3>Choose a copy</h3>
        <p>Both copies are kept. Choose which progress to continue with.</p>
        <div className="backup-actions">
          <button className="secondary" disabled={busy || disabled} onClick={() => void sync('local')}>Use this device</button>
          {conflict.progress && <button className="secondary" disabled={busy || disabled} onClick={() => void sync('remote')}>Use account copy</button>}
          <button className="secondary" disabled={busy} onClick={() => { setEnabled(false); remember(false); setConflict(null); setMessage('Sync paused. No copies were replaced.'); }}>Decide later</button>
        </div></section>}
      {disabled && <p role="alert">Resolve the storage warning before syncing.</p>}
      <p role="status">{busy ? 'Syncing…' : message}</p>
    </div></details></aside>;
}
