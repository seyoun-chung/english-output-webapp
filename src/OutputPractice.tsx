import { ExerciseCard } from './ExerciseCard';
import { isOutputComplete, practiceItems, practiceModes, ratePractice, restartPractice, type PracticeMode, type PracticeProgress } from './exerciseProgress';
import { exactExercises } from './data/outputPractice';
import { ActionFooter } from './ActionFooter';
import './exercises.css';
const modeLabels: Record<PracticeMode, string> = { exact: 'Exact recall', variation: 'Variation', 'no-hint': 'No hint' };
export function OutputPractice({ progress, onChange, onOverview, onNext }: { progress: PracticeProgress; onChange: (next: PracticeProgress) => void; onOverview: () => void; onNext: () => void }) {
  const finished = progress.finished[progress.mode];
  const items = practiceItems(progress.mode);
  const index = progress.cursors[progress.mode];
  const rated = items.filter(item => progress.ratings[item.id]).length;
  const basicComplete = isOutputComplete(progress);
  const chooseMode = (mode: PracticeMode) => onChange({ ...progress, mode });
  const nextMode = practiceModes[practiceModes.indexOf(progress.mode) + 1];
  return <div className="exercise-screen">
    <header className="page-heading"><p className="eyebrow">CHAPTER 3 · REQUIRED</p><h1 tabIndex={-1}>Output Practice</h1><p>Recall source sentences. Try the variations when you’re ready.</p></header>
    <div className="exercise-tabs" role="group" aria-label="Output practice mode">{practiceModes.map(mode => <button key={mode} className={mode === progress.mode ? 'primary' : 'secondary'} aria-pressed={mode === progress.mode} onClick={() => chooseMode(mode)}>{modeLabels[mode]}</button>)}</div>
    <p className="muted">{rated} / {items.length} rated · {basicComplete ? 'Basic output completed ✓' : `${exactExercises.length} exact items in the basic set`}</p>
    {finished ? <section className="panel exercise-summary">
      <p className="eyebrow">SELF CHECK</p><h2>Practice complete</h2>
      <p>{items.filter(item => progress.ratings[item.id] === 'immediate').length} recalled easily · {items.filter(item => ['effort', 'review'].includes(progress.ratings[item.id])).length} to review</p>
      <button className="secondary exercise-retry" onClick={() => onChange(restartPractice(progress))}>Practice again</button>
      <ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={basicComplete && nextMode && <button className="secondary" onClick={onNext}>Continue to Weekly Writing</button>}
        forward={<button className="primary" onClick={nextMode ? () => chooseMode(nextMode) : basicComplete ? onNext : () => chooseMode('exact')}>Next: {nextMode ? modeLabels[nextMode] : basicComplete ? 'Weekly Writing' : modeLabels.exact} <span aria-hidden="true">→</span></button>}
      />
    </section> : <ExerciseCard
      key={`${progress.mode}-${items[index].id}`}
      item={items[index]}
      noHints={progress.mode === 'no-hint'}
      position={index + 1}
      total={items.length}
      onRate={value => onChange(ratePractice(progress, value))}
      footer={<ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={index > 0 && <button className="secondary" onClick={() => onChange({ ...progress, cursors: { ...progress.cursors, [progress.mode]: index - 1 } })}>Previous</button>}
      />}
    />}
  </div>;
}
