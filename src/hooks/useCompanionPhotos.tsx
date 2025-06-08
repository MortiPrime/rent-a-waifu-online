
import { supabase } from '@/integrations/supabase/client';
import { CompanionProfile, CompanionPhoto } from '@/types';

export const useCompanionPhotos = (
  profile: CompanionProfile | null,
  photos: CompanionPhoto[],
  setPhotos: (photos: CompanionPhoto[]) => void
) => {
  const addPhoto = async (photoUrl: string, caption?: string, isPrimary?: boolean) => {
    if (!profile) throw new Error('Perfil no encontrado');

    try {
      const { data, error } = await supabase
        .from('companion_photos')
        .insert({
          companion_id: profile.id,
          photo_url: photoUrl,
          caption: caption,
          is_primary: isPrimary || false,
          display_order: photos.length
        })
        .select()
        .single();

      if (error) throw error;
      setPhotos([...photos, data]);
      return data;
    } catch (error: any) {
      console.error('Error adding photo:', error);
      throw error;
    }
  };

  const removePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('companion_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      setPhotos(photos.filter(photo => photo.id !== photoId));
    } catch (error: any) {
      console.error('Error removing photo:', error);
      throw error;
    }
  };

  return { addPhoto, removePhoto };
};
