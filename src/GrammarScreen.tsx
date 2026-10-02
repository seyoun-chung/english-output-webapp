import type { GrammarProgress } from './writingProgress';
import { ActionFooter } from './ActionFooter';
import { chapterLabel } from './data/chapters';
import { useChapterContent } from './ChapterContentContext';
import './writing.css';

export function GrammarScreen({ pass = 1, progress, onChange, onOverview, onNext }: { pass?: 1 | 2 | 3; progress: GrammarProgress; onChange: (next: GrammarProgress) => void; onOverview: () => void; onNext: () => void }) {
  const { metadata, grammar } = useChapterContent();
  const required = pass === 3;
  const exampleRows = Array.from({ length: Math.max(...grammar.sections.map((section) => section.examples.length)) });
  return <section className="writing-screen" aria-labelledby="grammar-title"><header className="writing-heading"><p className="eyebrow">{chapterLabel(metadata)} · {required ? 'PASS 3 · REQUIRED' : 'OPTIONAL'}</p><h1 id="grammar-title" tabIndex={-1}>Grammar Focus</h1><span className="badge">{required ? 'Required' : 'Optional'}</span><p>{grammar.title} · {grammar.subtitle}</p></header><div className="writing-card">
    <div className="grammar-columns">{grammar.sections.map((section) => <div key={section.heading}><h2>{section.heading}</h2><p lang="ko">{section.description}</p></div>)}</div>
    <div className="grammar-pairs">{exampleRows.map((_, index) => <div className="grammar-columns grammar-pair" key={index}>{grammar.sections.map((section) => { const example = section.examples[index]; return <div key={section.heading}>{example && <><span className="grammar-form">{section.heading}</span><p lang="en">{example.english}</p><small lang="ko">{example.korean}</small></>}</div>; })}</div>)}</div>
    {grammar.note && <p className="grammar-note" lang="ko">{grammar.note}</p>}<p className="writing-source">Source · Main textbook · Grammar Focus · pp.{grammar.sourcePages.join('–')}</p>
    <ActionFooter
      back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
      middle={<button className="secondary" disabled={progress.studied} onClick={() => onChange({ studied: true })}>{progress.studied ? 'Studied ✓' : 'Mark studied'}</button>}
      forward={<button className="primary" onClick={onNext}>Next: What About You? <span aria-hidden="true">→</span></button>}
    />
  </div></section>;
}
