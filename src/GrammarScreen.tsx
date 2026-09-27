import { grammarExplanations, grammarPairs } from './data/grammar';
import type { GrammarProgress } from './writingProgress';
import { ActionFooter } from './ActionFooter';
import './writing.css';

export function GrammarScreen({ progress, onChange, onOverview, onNext }: { progress: GrammarProgress; onChange: (next: GrammarProgress) => void; onOverview: () => void; onNext: () => void }) {
  return <section className="writing-screen" aria-labelledby="grammar-title"><header className="writing-heading"><p className="eyebrow">CHAPTER 3 · OPTIONAL</p><h1 id="grammar-title" tabIndex={-1}>Grammar Focus</h1><span className="badge">Optional</span><p>I’m interested vs It’s interesting · {grammarPairs.length} example pairs</p></header><div className="writing-card">
    <div className="grammar-columns"><div><h2>-ed</h2><p lang="ko">{grammarExplanations.ed}</p></div><div><h2>-ing</h2><p lang="ko">{grammarExplanations.ing}</p></div></div>
    <div className="grammar-pairs">{grammarPairs.map(pair => <div className="grammar-columns grammar-pair" key={pair.id}><div><span className="grammar-form">-ed</span><p lang="en">{pair.ed}</p><small lang="ko">{pair.edKorean}</small></div><div><span className="grammar-form">-ing</span><p lang="en">{pair.ing}</p><small lang="ko">{pair.ingKorean}</small></div></div>)}</div>
    <p className="grammar-note" lang="ko">{grammarExplanations.people}</p><p className="writing-source">Source · Main textbook · Grammar Focus · pp.54–55</p>
    <ActionFooter
      back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
      middle={<button className="secondary" disabled={progress.studied} onClick={() => onChange({ studied: true })}>{progress.studied ? 'Studied ✓' : 'Mark studied'}</button>}
      forward={<button className="primary" onClick={onNext}>Next: What About You? <span aria-hidden="true">→</span></button>}
    />
  </div></section>;
}
