
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { MessageSquare } from 'lucide-react';

interface ReviewSectionProps {
  companionListingId: string;
}

const ReviewSection = ({ companionListingId }: ReviewSectionProps) => {
  const { reviews, stats, userReview, loading, submitReview, deleteReview } = useReviews(companionListingId);
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="h-16 bg-white/10 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Reseñas ({stats.count})
        </h4>
        {stats.count > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(stats.average)} size="sm" />
            <span className="text-white/70 text-sm">{stats.average.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Rating distribution bar */}
      {stats.count > 0 && (
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star - 1];
            const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-white/50 w-3">{star}</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-white/40 w-5 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Review form - only show if user is logged in and hasn't reviewed yet */}
      {user && !userReview && (
        <ReviewForm onSubmit={submitReview} />
      )}

      {userReview && (
        <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
          <p className="text-pink-300 text-xs mb-1">Tu reseña</p>
          <div className="flex items-center gap-2">
            <StarRating rating={userReview.rating} size="sm" />
            {userReview.comment && <span className="text-white/70 text-sm">{userReview.comment}</span>}
          </div>
        </div>
      )}

      <ReviewList reviews={reviews} currentUserId={user?.id} onDelete={deleteReview} />
    </div>
  );
};

export default ReviewSection;
