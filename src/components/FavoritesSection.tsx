import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Trash2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteListing {
  id: string;
  stage_name: string;
  state: string;
  municipality: string;
  age: number;
}

const FavoritesSection = () => {
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || favoriteIds.size === 0) { setFavorites([]); return; }
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('companion_listings')
        .select('id, stage_name, state, municipality, age')
        .in('id', Array.from(favoriteIds))
        .eq('is_active', true);
      setFavorites((data || []) as FavoriteListing[]);
      setLoading(false);
    };
    load();
  }, [user, favoriteIds]);

  if (!user || favoriteIds.size === 0) return null;

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          Mis Favoritas ({favoriteIds.size})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-white/60">Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map(fav => (
              <div key={fav.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                <div>
                  <p className="text-white font-medium">{fav.stage_name}</p>
                  <p className="text-white/60 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {fav.municipality}, {fav.state}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => toggleFavorite(fav.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesSection;
