import { grammarExplanations, grammarPairs } from './data/grammar';
import type { GrammarProgress } from './writingProgress';
import './writing.css';

export function GrammarScreen({ progress, onChange, onOverview }: { progress: GrammarProgress; onChange: (next: GrammarProgress) => void; onOverview: () => void }) {
  return <section className="writing-screen" aria-labelledby="grammar-title"><header className="writing-heading"><p className="eyebrow">CHAPTER 3 / OPTIONAL</p><h1 id="grammar-title" tabIndex={-1}>Grammar Focus</h1><p>I’m interested vs It’s interesting</p></header><div className="writing-card">
    <div className="grammar-columns"><div><h2>-ed</h2><p lang="ko">{grammarExplanations.ed}</p></div><div><h2>-ing</h2><p lang="ko">{grammarExplanations.ing}</p></div></div>
    <div className="grammar-pairs">{grammarPairs.map(pair => <div className="grammar-columns grammar-pair" key={pair.id}><div><span className="grammar-form">-ed</span><p lang="en">{pair.ed}</p><small lang="ko">{pair.edKorean}</small></div><div><span className="grammar-form">-ing</span><p lang="en">{pair.ing}</p><small lang="ko">{pair.ingKorean}</small></div></div>)}</div>
    <p className="grammar-note" lang="ko">{grammarExplanations.people}</p><p className="writing-source">Source · Main textbook · Grammar Focus · pp.54–55</p>
    <div className="writing-actions"><button className="secondary" onClick={onOverview}>Overview</button><button className="primary" disabled={progress.studied} onClick={() => onChange({ studied: true })}>{progress.studied ? 'Studied ✓' : 'Mark studied'}</button></div><p className="writing-status" role="status">Optional for Pass 1</p>
  </div></section>;
}
