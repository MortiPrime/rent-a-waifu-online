
import { Review } from '@/hooks/useReviews';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Trash2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  onDelete?: (reviewId: string) => void;
}

const ReviewList = ({ reviews, currentUserId, onDelete }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <p className="text-white/40 text-sm text-center py-4">
        Aún no hay reseñas. ¡Sé el primero!
      </p>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white/5 rounded-lg p-3 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white/60" />
              </div>
              <span className="text-white/80 text-sm font-medium">{review.reviewer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              {currentUserId === review.reviewer_id && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => onDelete(review.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
          {review.comment && (
            <p className="text-white/70 text-sm">{review.comment}</p>
          )}
          <p className="text-white/30 text-xs">
            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
