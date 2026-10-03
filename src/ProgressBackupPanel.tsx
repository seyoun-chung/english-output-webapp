import { useRef, useState } from 'react';
import type { AppProgress } from './appProgress';
import { createProgressBackup, listRecoveryRecords, MAX_BACKUP_BYTES, prepareStoredRecord, readProgressBackup, type ProgressBackup } from './progressBackup';
import './backup.css';

function download(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ProgressBackupPanel({ progress, original, warning, onRestore, storage }: {
  progress: AppProgress; original: string | null; warning: string | null;
  storage?: Storage;
  onRestore: (text: string) => Promise<void>;
}) {
  const [preview, setPreview] = useState<{ text: string; backup: ProgressBackup } | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [recoveryRecords, setRecoveryRecords] = useState<{ key: string; raw: string }[]>([]);
  const request = useRef(0);
  const previewRecord = (raw: string) => {
    ++request.current; setPreview(null); setMessage('');
    try {
      const text = createProgressBackup(prepareStoredRecord(raw));
      setPreview({ text, backup: readProgressBackup(text) });
    } catch { setMessage('This original record needs manual recovery. Download it to keep it safe. Nothing was replaced.'); }
  };
  const exportFile = () => {
    try {
      download(createProgressBackup(progress), `english-output-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
      setMessage('Backup downloaded. Keep it in a private place.');
    } catch { setMessage('A normal backup could not be created. Download the original record to keep it safe.'); }
  };
  return <aside className="backup-bar" aria-label="Progress storage">
    {warning && <p role="alert" className="storage-warning">{warning}</p>}
    <details>
      <summary>Backup &amp; restore</summary>
      <div className="backup-panel">
        <h2>Your progress</h2>
        <p>Back up all chapters, ratings and writing. Audio is not included. Files stay on your device.</p>
        <p>Backups contain your personal writing. Keep them private.</p>
        <div className="backup-actions">
          <button className="secondary" onClick={exportFile}>Download backup</button>
          {original !== null && <button className="secondary" onClick={() => download(original, 'english-output-original-record.json')}>Download original record</button>}
          {warning && original !== null && <button className="secondary" disabled={busy} onClick={() => previewRecord(original)}>Preview saved record</button>}
          <label className="backup-file">Choose backup
            <input type="file" accept=".json,application/json" disabled={busy} onChange={async event => {
              const file = event.currentTarget.files?.[0]; event.currentTarget.value = '';
              const id = ++request.current; setPreview(null); setMessage('');
              if (!file) return;
              if (file.size > MAX_BACKUP_BYTES) { setMessage('Choose a backup smaller than 8 MB.'); return; }
              try {
                let text = await file.text();
                let value: unknown;
                try { value = JSON.parse(text); } catch { throw new Error('This is not a valid JSON backup.'); }
                if (value && typeof value === 'object' && !('format' in value)) text = createProgressBackup(prepareStoredRecord(text));
                const backup = readProgressBackup(text);
                if (id === request.current) setPreview({ text, backup });
              } catch (error) { if (id === request.current) setMessage(error instanceof Error ? error.message : 'Could not read this file.'); }
            }} />
          </label>
        </div>
        <button className="secondary" disabled={busy} onClick={() => {
          try { const records = listRecoveryRecords(storage ?? localStorage); setRecoveryRecords(records); setMessage(records.length ? 'Recovery copies stay on this browser. Choose one to preview.' : 'No recovery copies yet.'); }
          catch { setMessage('Recovery copies could not be read. Browser storage may be unavailable.'); }
        }}>Show recovery copies</button>
        {recoveryRecords.length > 0 && <ul aria-label="Recovery copies">
          {recoveryRecords.map((entry, index) => <li key={entry.key}>
            <p>Recovery copy {index + 1}</p>
            <div className="backup-actions">
              <button className="secondary" disabled={busy} onClick={() => previewRecord(entry.raw)}>Preview copy {index + 1}</button>
              <button className="secondary" onClick={() => download(entry.raw, `english-output-recovery-${index + 1}.json`)}>Download copy {index + 1}</button>
            </div>
          </li>)}
        </ul>}
        {preview && <section aria-label="Restore preview">
          <h3>Check before restoring</h3>
          <p>Backup prepared: {preview.backup.savedAt} · {Object.keys(preview.backup.progress.chapters).length} chapters</p>
          <p>This replaces progress in this browser. A recovery copy of the current record will be kept first.</p>
          <div className="backup-actions">
            <button className="secondary" disabled={busy} onClick={() => { ++request.current; setPreview(null); }}>Cancel</button>
            <button className="primary" disabled={busy} onClick={async () => {
              setBusy(true);
              try { await onRestore(preview.text); setPreview(null); setMessage('Progress restored. Your previous record was kept as a recovery copy.'); }
              catch (error) { setMessage(error instanceof Error ? error.message : 'Restore failed. Your previous record is unchanged.'); }
              finally { setBusy(false); }
            }}>Restore this backup</button>
          </div>
        </section>}
        <p role="status">{message}</p>
      </div>
    </details>
  </aside>;
}
