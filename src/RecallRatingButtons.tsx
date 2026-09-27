import type { Rating } from './progress';
import { ratingLabels } from './learningLabels';

const ratingOrder: Rating[] = ['immediate', 'effort', 'review'];
const ratingIcons: Record<Rating, string> = {
  immediate: '✓',
  effort: '≈',
  review: '↻',
};

export function RecallRatingButtons({ onRate }: { onRate: (rating: Rating) => void }) {
  return <div className="rating-buttons">
    {ratingOrder.map(rating => <button key={rating} className={`rating ${rating}`} onClick={() => onRate(rating)}>
      <span aria-hidden="true">{ratingIcons[rating]}</span>
      {ratingLabels[rating]}
    </button>)}
  </div>;
}
