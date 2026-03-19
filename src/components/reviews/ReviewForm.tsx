
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from './StarRating';
import { Send } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<boolean>;
  disabled?: boolean;
}

const ReviewForm = ({ onSubmit, disabled }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    const success = await onSubmit(rating, comment);
    if (success) {
      setRating(0);
      setComment('');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-white/10">
      <h4 className="text-white font-medium text-sm">Deja tu reseña</h4>
      <div className="flex items-center gap-2">
        <StarRating rating={rating} interactive onRatingChange={setRating} />
        {rating > 0 && <span className="text-white/60 text-sm">{rating}/5</span>}
      </div>
      <Textarea
        placeholder="Escribe tu comentario (opcional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 500))}
        className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[60px] resize-none"
        maxLength={500}
      />
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs">{comment.length}/500</span>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={rating === 0 || submitting || disabled}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          {submitting ? 'Enviando...' : 'Enviar Reseña'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
