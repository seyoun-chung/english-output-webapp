import { useRef, useState } from 'react';
import type { AppProgress } from './appProgress';
import { createProgressBackup } from './progressBackup';
import { localSyncTransport, SyncConflict, SyncSession } from './syncClient';
import type { SyncSnapshot } from './syncProtocol';

export function LocalSyncPanel({ progress, disabled, onRestore }: {
  progress: AppProgress; disabled: boolean;
  onRestore: (text: string, expected: string) => Promise<void>;
}) {
  const session = useRef(new SyncSession(localSyncTransport));
  const latest = useRef(progress); latest.current = progress;
  const [busy, setBusy] = useState(false);
  const [connected, setConnected] = useState(false);
  const [conflict, setConflict] = useState<SyncSnapshot | null>(null);
  const [message, setMessage] = useState('Not connected. Nothing is uploaded automatically.');
  const run = async (action: 'check' | 'local' | 'remote') => {
    if (busy || disabled) return;
    setBusy(true);
    const captured = progress, expected = JSON.stringify(captured);
    try {
      let snapshot: SyncSnapshot;
      if (action === 'remote') {
        if (!conflict?.progress) return;
        snapshot = conflict;
        await onRestore(createProgressBackup(snapshot.progress!), expected);
        session.current.accept(snapshot);
      } else if (action === 'local') {
        if (!conflict) return;
        snapshot = await session.current.chooseLocal(captured, conflict);
      } else {
        const result = await session.current.check(captured); snapshot = result.snapshot;
        if (result.action === 'download') {
          await onRestore(createProgressBackup(snapshot.progress!), expected);
          session.current.accept(snapshot);
        }
      }
      setConflict(null); setConnected(true);
      setMessage(JSON.stringify(latest.current) === expected || action === 'remote'
        ? `Synced · revision ${snapshot.revision}. This is a local test, not cross-computer sync.`
        : 'Your latest changes are still in this browser. Sync again to send them.');
    } catch (error) {
      if (error instanceof SyncConflict) setConflict(error.snapshot);
      setMessage(error instanceof Error ? error.message : 'Sync failed. Your browser record is safe.');
    } finally { setBusy(false); }
  };
  return <aside className="backup-bar" aria-label="Local sync test">
    <details><summary>Local sync test</summary><div className="backup-panel">
      <h2>Test sync on this computer</h2>
      <p>Stores progress and writing on this computer only. No audio. This does not connect home and STA Track yet.</p>
      <p>Sync is manual in this test. Both copies are kept when records conflict.</p>
      <div className="backup-actions">
        <button className="secondary" disabled={busy || disabled} onClick={() => void run('check')}>{connected ? 'Sync now' : 'Connect local test sync'}</button>
        {connected && <button className="secondary" disabled={busy} onClick={() => {
          session.current = new SyncSession(localSyncTransport); setConnected(false); setConflict(null); setMessage('Disconnected. Both stored copies are kept.');
        }}>Disconnect</button>}
      </div>
      {conflict && <section aria-label="Sync conflict">
        <h3>Choose a copy</h3>
        <p>Nothing was replaced. The older server copy is kept. Using the server copy first saves a recovery copy in this browser.</p>
        <div className="backup-actions">
          <button className="secondary" disabled={busy || disabled} onClick={() => void run('local')}>Use this browser</button>
          {conflict.progress && <button className="secondary" disabled={busy || disabled} onClick={() => void run('remote')}>Use server copy</button>}
          <button className="secondary" disabled={busy} onClick={() => { setConflict(null); setMessage('No changes made. Download a backup before deciding.'); }}>Cancel sync</button>
        </div>
      </section>}
      {disabled && <p role="alert">Resolve the storage warning before syncing.</p>}
      <p role="status">{message}</p>
    </div></details>
  </aside>;
}
