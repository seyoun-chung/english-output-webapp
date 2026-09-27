import { useState } from 'react';
import type { ReactNode } from 'react';
import { VoicePractice } from './VoicePractice';
import { RecallRatingButtons } from './RecallRatingButtons';
import type { Rating } from './progress';
import type { ExerciseItem } from './data/outputPractice';
import './exercises.css';

export function ExerciseCard({ item, noHints = false, position, total, onRate, footer }: { item: ExerciseItem; noHints?: boolean; position: number; total: number; onRate: (rating: Rating) => void; footer?: ReactNode }) {
  const [hint, setHint] = useState<0 | 1 | 2>(0);
  const [answer, setAnswer] = useState(false);
  return <section className="panel exercise-card">
    <div className="recall-top"><span>{item.source.section}</span><strong>{position} <span>/ {total}</span></strong></div>
    <progress value={position} max={total} aria-label="Practice position" />
    <div className="prompt-block"><span className="eyebrow">Korean</span><p className="exercise-prompt" lang="ko">{item.korean}</p></div>
    <VoicePractice />
    <div className="hint-actions">
      {!noHints && <><button className="secondary" aria-pressed={hint === 1} onClick={() => setHint(1)}>Hint 1</button><button className="secondary" aria-pressed={hint === 2} onClick={() => setHint(2)}>Hint 2</button></>}
      <button className="primary" aria-expanded={answer} onClick={() => setAnswer(!answer)}>{answer ? 'Hide answer' : 'Show answer'}</button>
    </div>
    <div aria-live="polite">
      {hint > 0 && !answer && <div className="hint-box"><span className="eyebrow">Hint {hint}</span>{(hint === 1 ? item.hint1 : item.hint2).map((line, i) => <p lang="en" key={i}>{line}</p>)}</div>}
      {answer && <div className="hint-box"><span className="eyebrow">English</span>{item.english.map((line, i) => <p lang="en" key={i}>{line}</p>)}</div>}
    </div>
    {answer && <div className="rating-area"><h2>어땠나요?</h2><p>선택하면 저장하고 다음으로 진행해요.</p><RecallRatingButtons onRate={onRate} /></div>}
    <p className="source-note">Source · {item.source.file} · {item.source.page ? `p.${item.source.page}` : `Korean p.${item.source.koreanPage} / English p.${item.source.englishPage}`}</p>
    {footer}
  </section>;
}
