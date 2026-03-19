
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Review {
  id: string;
  reviewer_id: string;
  companion_listing_id: string;
  rating: number;
  comment: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  reviewer_name?: string;
}

export interface ReviewStats {
  average: number;
  count: number;
  distribution: number[]; // index 0 = 1 star, index 4 = 5 stars
}

export const useReviews = (companionListingId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ average: 0, count: 0, distribution: [0, 0, 0, 0, 0] });
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReviews = useCallback(async () => {
    if (!companionListingId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('companion_listing_id', companionListingId)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reviewsData = (data || []) as Review[];

      // Fetch reviewer names
      const reviewerIds = [...new Set(reviewsData.map(r => r.reviewer_id))];
      if (reviewerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', reviewerIds);

        const profileMap = new Map(
          (profiles || []).map(p => [p.id, p.full_name || p.username || 'Anónimo'])
        );

        reviewsData.forEach(r => {
          r.reviewer_name = profileMap.get(r.reviewer_id) || 'Anónimo';
        });
      }

      setReviews(reviewsData);

      // Calculate stats
      const count = reviewsData.length;
      const distribution = [0, 0, 0, 0, 0];
      let sum = 0;
      reviewsData.forEach(r => {
        sum += r.rating;
        distribution[r.rating - 1]++;
      });
      setStats({
        average: count > 0 ? sum / count : 0,
        count,
        distribution,
      });

      // Find user's own review
      if (user) {
        const own = reviewsData.find(r => r.reviewer_id === user.id);
        setUserReview(own || null);
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [companionListingId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (rating: number, comment: string) => {
    if (!user || !companionListingId) {
      toast({ title: 'Error', description: 'Debes iniciar sesión para dejar una reseña', variant: 'destructive' });
      return false;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: user.id,
          companion_listing_id: companionListingId,
          rating,
          comment: comment.trim() || null,
          status: 'published',
        } as any);

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'Ya reseñaste', description: 'Solo puedes dejar una reseña por companion', variant: 'destructive' });
        } else {
          throw error;
        }
        return false;
      }

      toast({ title: '¡Gracias!', description: 'Tu reseña ha sido publicada' });
      await fetchReviews();
      return true;
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({ title: 'Error', description: 'No se pudo enviar la reseña', variant: 'destructive' });
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({ title: 'Eliminada', description: 'Tu reseña ha sido eliminada' });
      await fetchReviews();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({ title: 'Error', description: 'No se pudo eliminar la reseña', variant: 'destructive' });
    }
  };

  return { reviews, stats, userReview, loading, submitReview, deleteReview, fetchReviews };
};

// Hook to fetch average ratings for multiple listings at once
export const useListingRatings = () => {
  const [ratings, setRatings] = useState<Map<string, { average: number; count: number }>>(new Map());

  const fetchRatings = useCallback(async (listingIds: string[]) => {
    if (listingIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('companion_listing_id, rating')
        .in('companion_listing_id', listingIds)
        .eq('status', 'published');

      if (error) throw error;

      const map = new Map<string, { sum: number; count: number }>();
      (data || []).forEach((r: any) => {
        const existing = map.get(r.companion_listing_id) || { sum: 0, count: 0 };
        existing.sum += r.rating;
        existing.count++;
        map.set(r.companion_listing_id, existing);
      });

      const result = new Map<string, { average: number; count: number }>();
      map.forEach((val, key) => {
        result.set(key, { average: val.sum / val.count, count: val.count });
      });
      setRatings(result);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }, []);

  return { ratings, fetchRatings };
};
