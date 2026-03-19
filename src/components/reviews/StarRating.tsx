
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};

const StarRating = ({ rating, maxStars = 5, size = 'md', interactive = false, onRatingChange }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= rating;
        const half = !filled && starValue - 0.5 <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starValue)}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? 'fill-yellow-400 text-yellow-400'
                  : half
                    ? 'fill-yellow-400/50 text-yellow-400'
                    : 'fill-transparent text-white/30'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
