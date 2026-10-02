import { ExerciseCard } from './ExerciseCard';
import { exerciseGroup, type ExerciseGroup, type ExerciseItem } from './data/outputPractice';
import { rateReview, startReview, type ReviewProgress } from './exerciseProgress';
import { ActionFooter } from './ActionFooter';
import { chapter3, chapterLabel, chapterName } from './data/chapters';
import './exercises.css';
const groups: Record<ExerciseGroup, string> = { story: 'My Story', conversation: 'Real Conversations', output: 'Output Practice' };
export function ReviewScreen({ pass = 1, progress, onChange, onOverview, onNext, eligibleItems }: { pass?: 1 | 2 | 3; progress: ReviewProgress; onChange: (next: ReviewProgress) => void; onOverview: () => void; onNext: () => void; eligibleItems: ExerciseItem[] }) {
  const byId = new Map(eligibleItems.map(item => [item.id, item]));
  const selected = eligibleItems.filter(item => progress.selectedGroups.includes(exerciseGroup(item.id)));
  const validQueue = progress.queue.length > 0 && progress.queue.every(id => byId.has(id));
  const item = validQueue ? byId.get(progress.queue[progress.index]) : undefined;
  const reset = () => onChange({ ...progress, queue: [], index: 0, ratings: {}, completed: false });
  const startFixedReview = () => onChange(startReview(progress, eligibleItems.map(reviewItem => reviewItem.id)));
  const fixed = pass > 1;
  return <div className="exercise-screen"><header className="page-heading"><p className="eyebrow">{chapterLabel(chapter3)} · {fixed ? `PASS ${pass} · CORE` : 'REVIEW'}</p><h1 tabIndex={-1}>Chapter Review</h1><p>{fixed ? `Recall and Output are balanced in this ${chapterName(chapter3)} set.` : 'Review the items you’ve already practiced.'}</p></header>
    {!validQueue ? <section className="panel exercise-summary">
      <h2>{fixed ? 'Balanced Chapter Review' : 'Choose your review'}</h2>
      {fixed
        ? <><p><strong>12 items</strong> · 6 Recall + 6 Output</p><p className="muted">This fixed pilot set uses only {chapterName(chapter3)} textbook and supplement content. Go at your own pace.</p></>
        : eligibleItems.length ? <><div className="review-groups">{(Object.keys(groups) as ExerciseGroup[]).map(group => <label key={group}><input type="checkbox" checked={progress.selectedGroups.includes(group)} onChange={event => onChange({ ...progress, selectedGroups: event.target.checked ? [...progress.selectedGroups, group] : progress.selectedGroups.filter(g => g !== group) })} />{groups[group]}<span>{eligibleItems.filter(item => exerciseGroup(item.id) === group).length}</span></label>)}</div><p>{selected.length} items · Go at your own pace.</p></> : <p>No practiced items yet. Add a self-check in My Story, Real Conversations, or Output Practice first.</p>}
      <ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        forward={fixed
          ? <button className="primary" disabled={!eligibleItems.length} onClick={startFixedReview}>Start review <span aria-hidden="true">→</span></button>
          : <button className="primary" disabled={!selected.length} onClick={() => onChange(startReview(progress, selected.map(item => item.id)))}>Start review <span aria-hidden="true">→</span></button>}
      />
    </section> : progress.completed ? <section className="panel exercise-summary">
      <p className="eyebrow">SESSION COMPLETE</p><h2>Review complete</h2>
      <p>{Object.values(progress.ratings).filter(value => value === 'immediate').length} recalled easily · {Object.values(progress.ratings).filter(value => value !== 'immediate').length} to review</p>
      <p className="muted">This session’s self-checks are kept separate from your study record.</p>
      <ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={<button className="secondary" onClick={reset}>{fixed ? 'Practice again' : 'Choose another set'}</button>}
        forward={<button className="primary" onClick={onNext}>Next: {pass === 2 ? 'Weekly Writing' : 'Chapter progress'} <span aria-hidden="true">→</span></button>}
      />
    </section> : item && <ExerciseCard
      key={`review-${item.id}`}
      item={item}
      position={progress.index + 1}
      total={progress.queue.length}
      onRate={value => onChange(rateReview(progress, value))}
      footer={<ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={progress.index > 0 && <button className="secondary" onClick={() => onChange({ ...progress, index: progress.index - 1 })}>Previous</button>}
        forward={<button className="secondary" onClick={reset}>{fixed ? 'Restart set' : 'Choose another set'}</button>}
      />}
    />}
  </div>;
}
