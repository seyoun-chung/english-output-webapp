import { ExerciseCard } from './ExerciseCard';
import { isNoHintComplete, isOutputComplete, isVariationComplete, practiceItems, practiceModes, ratePractice, restartPractice, type PracticeMode, type PracticeProgress } from './exerciseProgress';
import { ActionFooter } from './ActionFooter';
import { chapterLabel, chapterName } from './data/chapters';
import { useChapterContent } from './ChapterContentContext';
import './exercises.css';
const modeLabels: Record<PracticeMode, string> = { exact: 'Exact recall', variation: 'Variation', 'no-hint': 'No hint' };
export function OutputPractice({ pass = 1, progress, onChange, onOverview, onNext }: { pass?: 1 | 2 | 3; progress: PracticeProgress; onChange: (next: PracticeProgress) => void; onOverview: () => void; onNext: () => void }) {
  const { metadata, exercises } = useChapterContent();
  const finished = progress.finished[progress.mode];
  const items = practiceItems(progress.mode, exercises);
  const index = progress.cursors[progress.mode];
  const rated = items.filter(item => progress.ratings[item.id]).length;
  const basicComplete = isOutputComplete(progress, exercises);
  const variationComplete = isVariationComplete(progress, exercises);
  const noHintComplete = isNoHintComplete(progress, exercises);
  const coreComplete = pass === 3 ? noHintComplete : pass === 2 ? variationComplete : basicComplete;
  const chooseMode = (mode: PracticeMode) => onChange({ ...progress, mode });
  const nextMode = practiceModes[practiceModes.indexOf(progress.mode) + 1];
  return <div className="exercise-screen">
    <header className="page-heading"><p className="eyebrow">{chapterLabel(metadata)} · {pass > 1 ? `PASS ${pass} · CORE` : 'REQUIRED'}</p><h1 tabIndex={-1}>Output Practice</h1><p>{pass === 3 ? `Recall the ${chapterName(metadata)} source set without hints. Earlier modes remain available as support.` : pass === 2 ? 'Start with the six source variations. Exact recall and No hint are optional support.' : 'Recall source sentences. Try the variations when you’re ready.'}</p></header>
    <div className="exercise-tabs" role="group" aria-label="Output practice mode">{practiceModes.map(mode => <button key={mode} className={mode === progress.mode ? 'primary' : 'secondary'} aria-pressed={mode === progress.mode} onClick={() => chooseMode(mode)}>{modeLabels[mode]}</button>)}</div>
    <p className="muted">{rated} / {items.length} rated · {pass === 3 ? noHintComplete ? 'No hint completed ✓' : `${exercises.output.length} source items in the no-hint core set` : pass === 2 ? variationComplete ? 'Variation completed ✓' : `${exercises.variation.length} source variations in the core set` : basicComplete ? 'Basic output completed ✓' : `${exercises.exact.length} exact items in the basic set`}</p>
    {finished ? <section className="panel exercise-summary">
      <p className="eyebrow">SELF CHECK</p><h2>Practice complete</h2>
      <p>{items.filter(item => progress.ratings[item.id] === 'immediate').length} recalled easily · {items.filter(item => ['effort', 'review'].includes(progress.ratings[item.id])).length} to review</p>
      <button className="secondary exercise-retry" onClick={() => onChange(restartPractice(progress))}>Practice again</button>
      <ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={pass === 2 && progress.mode === 'variation' ? <button className="secondary" onClick={() => chooseMode('no-hint')}>No hint · Optional</button> : pass === 1 && coreComplete && nextMode ? <button className="secondary" onClick={onNext}>Continue to Weekly Writing</button> : undefined}
        forward={pass === 3
          ? progress.mode === 'no-hint'
            ? <button className="primary" onClick={onNext}>Next: Grammar Focus <span aria-hidden="true">→</span></button>
            : <button className="primary" onClick={() => chooseMode('no-hint')}>Next: No hint <span aria-hidden="true">→</span></button>
          : pass === 2
          ? progress.mode === 'exact'
            ? <button className="primary" onClick={() => chooseMode('variation')}>Next: Variation <span aria-hidden="true">→</span></button>
            : progress.mode === 'variation'
              ? <button className="primary" onClick={onNext}>Next: Chapter Review <span aria-hidden="true">→</span></button>
              : variationComplete ? <button className="primary" onClick={onNext}>Next: Chapter Review <span aria-hidden="true">→</span></button> : <button className="primary" onClick={() => chooseMode('variation')}>Complete Variation <span aria-hidden="true">→</span></button>
          : <button className="primary" onClick={nextMode ? () => chooseMode(nextMode) : coreComplete ? onNext : () => chooseMode('exact')}>Next: {nextMode ? modeLabels[nextMode] : coreComplete ? 'Weekly Writing' : modeLabels.exact} <span aria-hidden="true">→</span></button>}
      />
    </section> : <ExerciseCard
      key={`${progress.mode}-${items[index].id}`}
      item={items[index]}
      noHints={progress.mode === 'no-hint'}
      position={index + 1}
      total={items.length}
      onRate={value => onChange(ratePractice(progress, value, exercises))}
      footer={<ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={index > 0 && <button className="secondary" onClick={() => onChange({ ...progress, cursors: { ...progress.cursors, [progress.mode]: index - 1 } })}>Previous</button>}
      />}
    />}
  </div>;
}
