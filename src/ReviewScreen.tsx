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
      <p>이 Chapter의 이번 회독에서 학습한 문제를 전체 또는 어려운 문제만 복습해요.</p>
    </header>
    <p role="status">전체 복습 대상 {pool.length}개 · 남은 어려운 문제 {difficult.length}개</p>
    {pool.length > 0 && difficult.length === 0 && <p className="is-complete">어려운 문제 모두 클리어 ✓</p>}
    {!validQueue || progress.completed ? <section className="panel exercise-summary">
      {progress.completed ? <>
        <p className="eyebrow">SESSION COMPLETE</p><h2>Review complete</h2>
        <p>이번 세트 {progress.queue.length}개 자기평가 완료</p>
        <p>{Object.values(progress.ratings).filter(value => value === 'immediate').length} recalled easily · {Object.values(progress.ratings).filter(value => value !== 'immediate').length} to review</p>
      </> : <h2>Choose your review</h2>}
      <p>모든 문제에 자기평가를 남기면 한 세트 완료예요. 어려운 문제를 모두 클리어하는 연습은 원하는 만큼 할 수 있어요.</p>
      {!pool.length && <p>No practiced items yet. Add a self-check in My Story, Real Conversations, or Output Practice first.</p>}
      <div className="exercise-tabs">
        <button className="secondary" disabled={!pool.length} onClick={() => start(pool)}>{progress.completed ? 'Practice again · 전체 다시 연습' : '전체 복습 시작'} ({pool.length})</button>
        <button className="primary" disabled={!difficult.length} onClick={() => start(difficult)}>어려운 문제만 복습 ({difficult.length})</button>
      </div>
      <p className="muted">최초 학습 평가는 보존됩니다. 복습의 최신 평가가 어려운 문제 목록에 반영되며, ‘바로 나왔어요’로 평가하면 목록에서 빠져요.</p>
      <ActionFooter back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        forward={hasCompletedReview(progress) ? <button className="primary" onClick={onNext}>Next: {pass === 2 ? 'Weekly Writing' : 'Chapter progress'} <span aria-hidden="true">→</span></button> : undefined} />
    </section> : item && <ExerciseCard key={item.id} item={item} position={progress.index + 1} total={progress.queue.length}
      onRate={value => onChange(rateReview(progress, value))}
      footer={<ActionFooter back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={progress.index > 0 && <button className="secondary" onClick={() => onChange({ ...progress, index: progress.index - 1 })}>Previous</button>}
        forward={<button className="secondary" onClick={choose}>복습 선택으로</button>} />} />}
  </div>;
}
