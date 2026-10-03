import { ExerciseCard } from './ExerciseCard';
import type { ExerciseItem } from './data/outputPractice';
import type { Rating } from './progress';
import { difficultReviewItems, hasCompletedReview, rateReview, startReview, type ReviewProgress } from './exerciseProgress';
import { ActionFooter } from './ActionFooter';
import { chapterLabel } from './data/chapters';
import { useChapterContent } from './ChapterContentContext';
import './exercises.css';

export function ReviewScreen({ pass = 1, progress, onChange, onOverview, onNext, eligibleItems, learnedRatings = {} }: {
  pass?: 1 | 2 | 3; progress: ReviewProgress; onChange: (next: ReviewProgress) => void;
  onOverview: () => void; onNext: () => void; eligibleItems: ExerciseItem[]; learnedRatings?: Record<string, Rating>;
}) {
  const { metadata, exercises } = useChapterContent();
  // Preserve access to legacy fixed sessions and their actual self-ratings.
  const byId = new Map(exercises.review.map(item => [item.id, item]));
  const pool = exercises.review.filter(item => eligibleItems.some(learned => learned.id === item.id)
    || progress.latestRatings?.[item.id] || progress.ratings[item.id]);
  const difficult = difficultReviewItems(pool, learnedRatings, progress);
  const validQueue = progress.queue.length > 0 && progress.queue.every(id => pool.some(item => item.id === id));
  const item = validQueue ? byId.get(progress.queue[progress.index]) : undefined;
  const start = (items: ExerciseItem[]) => onChange(startReview(progress, items.map(item => item.id), exercises));
  const choose = () => onChange({ ...progress, latestRatings: { ...progress.ratings, ...progress.latestRatings },
    hasCompletedSet: hasCompletedReview(progress), queue: [], index: 0, ratings: {}, completed: false });
  return <div className="exercise-screen">
    <header className="page-heading">
      <p className="eyebrow">{chapterLabel(metadata)} · PASS {pass} · REVIEW</p>
      <h1 tabIndex={-1}>Chapter Review</h1>
      <p>Review all questions you practiced in this pass, or just the difficult ones.</p>
    </header>
    <p role="status">{pool.length} questions total · {difficult.length} still difficult</p>
    {pool.length > 0 && difficult.length === 0 && <p className="is-complete">No difficult questions left! ✓</p>}
    {!validQueue || progress.completed ? <section className="panel exercise-summary">
      {progress.completed ? <>
        <p className="eyebrow">SESSION COMPLETE</p><h2>Review complete</h2>
        <p>{progress.queue.length} {progress.queue.length === 1 ? 'question' : 'questions'} reviewed</p>
        <p>{Object.values(progress.ratings).filter(value => value === 'immediate').length} recalled easily · {Object.values(progress.ratings).filter(value => value !== 'immediate').length} to review</p>
      </> : <h2>Choose your review</h2>}
      <p>Rate every question to finish. Practice again anytime.</p>
      {!pool.length && <p>No practiced items yet. Add a self-check in My Story, Real Conversations, or Output Practice first.</p>}
      <div className="exercise-tabs">
        <button className="secondary" disabled={!pool.length} onClick={() => start(pool)}>Practice all ({pool.length})</button>
        <button className="primary" disabled={!difficult.length} onClick={() => start(difficult)}>Practice difficult ones ({difficult.length})</button>
      </div>
      <p className="muted">Easy answers leave the difficult list. Your study ratings stay saved.</p>
      <ActionFooter back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        forward={hasCompletedReview(progress) ? <button className="primary" onClick={onNext}>Next: {pass === 2 ? 'Weekly Writing' : 'Chapter progress'} <span aria-hidden="true">→</span></button> : undefined} />
    </section> : item && <ExerciseCard key={item.id} item={item} position={progress.index + 1} total={progress.queue.length}
      onRate={value => onChange(rateReview(progress, value))}
      footer={<ActionFooter back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={progress.index > 0 && <button className="secondary" onClick={() => onChange({ ...progress, index: progress.index - 1 })}>Previous</button>}
        forward={<button className="secondary" onClick={choose}>Review options</button>} />} />}
  </div>;
}
