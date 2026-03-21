import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!user) { setFavoriteIds(new Set()); return; }
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('companion_listing_id')
        .eq('user_id', user.id);
      if (error) throw error;
      setFavoriteIds(new Set(data?.map(f => f.companion_listing_id) || []));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, [user]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const toggleFavorite = useCallback(async (listingId: string) => {
    if (!user) {
      toast({ title: "Inicia sesión", description: "Necesitas una cuenta para guardar favoritas", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const isFav = favoriteIds.has(listingId);
      if (isFav) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('companion_listing_id', listingId);
        if (error) throw error;
        setFavoriteIds(prev => { const next = new Set(prev); next.delete(listingId); return next; });
        toast({ title: "Eliminada de favoritas" });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, companion_listing_id: listingId });
        if (error) throw error;
        setFavoriteIds(prev => new Set(prev).add(listingId));
        toast({ title: "💖 Agregada a favoritas" });
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({ title: "Error", description: "No se pudo actualizar favoritas", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, favoriteIds, toast]);

  const isFavorite = useCallback((listingId: string) => favoriteIds.has(listingId), [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite, loading, favoriteCount: favoriteIds.size };
};
