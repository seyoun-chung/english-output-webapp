import { ExerciseCard } from './ExerciseCard';
import { isOutputComplete, practiceItems, practiceModes, ratePractice, restartPractice, type PracticeMode, type PracticeProgress } from './exerciseProgress';
import { exactExercises } from './data/outputPractice';
import './exercises.css';
const modeLabels: Record<PracticeMode, string> = { exact: 'Exact recall', variation: 'Variation', 'no-hint': 'No hint' };
export function OutputPractice({ progress, onChange, onOverview }: { progress: PracticeProgress; onChange: (next: PracticeProgress) => void; onOverview: () => void }) {
  const finished = progress.finished[progress.mode];
  const items = practiceItems(progress.mode);
  const index = progress.cursors[progress.mode];
  const rated = items.filter(item => progress.ratings[item.id]).length;
  const chooseMode = (mode: PracticeMode) => onChange({ ...progress, mode });
  return <div className="exercise-screen">
    <header className="page-heading"><p className="eyebrow">CHAPTER 3 / OUTPUT PRACTICE</p><h1 tabIndex={-1}>Put it into words</h1><p>Recall source sentences. Try the variations when you’re ready.</p></header>
    <div className="exercise-tabs" role="group" aria-label="Output practice mode">{practiceModes.map(mode => <button key={mode} className={mode === progress.mode ? 'primary' : 'secondary'} aria-pressed={mode === progress.mode} onClick={() => chooseMode(mode)}>{modeLabels[mode]}</button>)}</div>
    <p className="muted">{rated} / {items.length} rated · {isOutputComplete(progress) ? 'Basic output completed ✓' : `${exactExercises.length} exact items in the basic set`}</p>
    {finished ? <section className="panel exercise-summary"><p className="eyebrow">SELF CHECK</p><h2>Practice complete</h2><p>{items.filter(item => progress.ratings[item.id] === 'immediate').length} recalled easily · {items.filter(item => ['effort', 'review'].includes(progress.ratings[item.id])).length} to review</p><button className="primary" onClick={() => onChange(restartPractice(progress))}>Practice again</button><button className="secondary" onClick={onOverview}>Back to overview</button></section> : <>
      <ExerciseCard key={`${progress.mode}-${items[index].id}`} item={items[index]} noHints={progress.mode === 'no-hint'} position={index + 1} total={items.length} onRate={value => onChange(ratePractice(progress, value))} />
      <div className="exercise-navigation"><button className="secondary" disabled={index === 0} onClick={() => onChange({ ...progress, cursors: { ...progress.cursors, [progress.mode]: Math.max(0, index - 1) } })}>Previous</button><button className="text-button" onClick={onOverview}>Back to overview</button></div>
    </>}
  </div>;
}
