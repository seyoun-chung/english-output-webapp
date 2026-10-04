import { useEffect, useRef, useState } from 'react';
import type { AppProgress } from './appProgress';
import { createProgressBackup, validateCurrentProgress } from './progressBackup';
import { STORAGE_KEY } from './progress';
import { SyncConflict, SyncSession, type SyncTransport } from './syncClient';
import type { SyncSnapshot } from './syncProtocol';

const preferenceKey = `${STORAGE_KEY}:sync-preference`;

export function AccountSyncPanel({ progress, transport, disabled, onRestore, storage, onReady, registerFlush }: {
  progress: AppProgress; transport: SyncTransport; disabled: boolean;
  storage?: Storage;
  onRestore: (text: string, expected: string) => Promise<void>;
  onReady: () => void;
  registerFlush: (flush: (() => Promise<boolean>) | null) => void;
}) {
  const [session] = useState(() => {
    try {
      const value = JSON.parse(storage?.getItem(preferenceKey) ?? 'null');
      return new SyncSession(transport, value?.baseline ? validateCurrentProgress(value.baseline) : null);
    } catch { return new SyncSession(transport); }
  });
  const [message, setMessage] = useState('');
  const [conflict, setConflict] = useState<SyncSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef<Promise<boolean> | null>(null);
  const mounted = useRef(true);
  const ready = useRef(false);
  const latest = useRef({ progress, disabled, onRestore, conflict, onReady });
  latest.current = { progress, disabled, onRestore, conflict, onReady };
  const markReady = () => {
    if (!ready.current) { ready.current = true; latest.current.onReady(); }
  };
  const remember = () => {
    try { storage?.setItem(preferenceKey, JSON.stringify({ baseline: session.getBaseline() })); }
    catch { setMessage('계정에는 저장했지만 이 브라우저의 동기화 정보를 저장하지 못했어요.'); }
  };
  const sync = (choice: 'check' | 'local' | 'remote' = 'check'): Promise<boolean> => {
    if (pending.current) return pending.current;
    const state = latest.current;
    if (!mounted.current || state.disabled || (choice === 'check' && state.conflict)) return Promise.resolve(false);
    const task = (async () => {
      setBusy(true);
      const expected = JSON.stringify(state.progress);
      try {
        if (choice === 'remote') {
          if (!state.conflict?.progress) return false;
          await state.onRestore(createProgressBackup(state.conflict.progress), expected);
          if (!mounted.current) return false;
          session.accept(state.conflict);
        } else if (choice === 'local') {
          if (!state.conflict) return false;
          await session.chooseLocal(state.progress, state.conflict);
        } else {
          const result = await session.check(state.progress);
          if (!mounted.current) return false;
          if (result.action === 'download') {
            await latest.current.onRestore(createProgressBackup(result.snapshot.progress!), expected);
            if (!mounted.current) return false;
            session.accept(result.snapshot);
          }
        }
        remember();
        if (mounted.current) { setConflict(null); setMessage(''); markReady(); }
        return true;
      } catch (error) {
        if (!mounted.current) return false;
        if (error instanceof SyncConflict) {
          setConflict(error.snapshot);
          setMessage('이 기기와 계정의 학습 기록이 달라요. 사용할 기록을 선택해 주세요.');
        } else {
          setMessage('계정 저장을 확인하지 못했어요. 이 기기의 기록은 보존됩니다.');
          markReady();
        }
        return false;
      } finally { if (mounted.current) setBusy(false); }
    })();
    pending.current = task;
    void task.finally(() => { if (pending.current === task) pending.current = null; });
    return task;
  };
  const run = useRef(sync); run.current = sync;
  useEffect(() => {
    mounted.current = true;
    if (latest.current.disabled) markReady();
    else void (async () => {
      if (pending.current) await pending.current;
      if (mounted.current && !ready.current && !latest.current.conflict) await run.current();
    })();
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    if (!ready.current || disabled || conflict) return;
    const timer = window.setTimeout(() => void run.current(), 1200);
    return () => window.clearTimeout(timer);
  }, [progress, disabled, conflict]);
  useEffect(() => {
    const check = () => { if (document.visibilityState === 'visible' && navigator.onLine) void run.current(); };
    window.addEventListener('online', check); window.addEventListener('focus', check);
    const timer = window.setInterval(check, 30000);
    return () => { window.removeEventListener('online', check); window.removeEventListener('focus', check); window.clearInterval(timer); };
  }, []);
  useEffect(() => {
    registerFlush(async () => {
      if (pending.current) await pending.current;
      // A remote restore updates App through React. Wait for that render before
      // comparing the final record, so a stale first-render snapshot cannot upload.
      await new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
      return run.current();
    });
    return () => registerFlush(null);
  }, [registerFlush]);
  if (!conflict && !message && !disabled) return null;
  return <aside className="backup-bar" aria-label="계정 저장 상태"><div className="backup-panel">
    {disabled && <p role="alert">브라우저 저장 문제를 먼저 해결해 주세요.</p>}
    {message && <p role="alert">{message}</p>}
    {conflict ? <section aria-label="학습 기록 선택">
      <p>두 기록 모두 보존됩니다. 이어서 사용할 기록을 선택해 주세요.</p>
      <div className="backup-actions">
        <button className="secondary" disabled={busy || disabled} onClick={() => void sync('local')}>이 기기 기록 사용</button>
        {conflict.progress && <button className="secondary" disabled={busy || disabled} onClick={() => void sync('remote')}>계정 기록 사용</button>}
      </div>
    </section> : !disabled && <button className="secondary" disabled={busy} onClick={() => void sync()}>다시 확인</button>}
  </div></aside>;
}
