
import { supabase } from '@/integrations/supabase/client';
import { CompanionProfile, CompanionPhoto } from '@/types';

export const useCompanionPhotos = (
  profile: CompanionProfile | null,
  photos: CompanionPhoto[],
  setPhotos: (photos: CompanionPhoto[]) => void
) => {
  const uploadToStorage = async (file: File): Promise<string> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('No autenticado');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('companion-photos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('companion-photos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const addPhoto = async (photoUrlOrFile: string | File, caption?: string, isPrimary?: boolean) => {
    if (!profile) throw new Error('Perfil no encontrado');

    let photoUrl: string;
    if (photoUrlOrFile instanceof File) {
      photoUrl = await uploadToStorage(photoUrlOrFile);
    } else {
      photoUrl = photoUrlOrFile;
    }

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
      const photo = photos.find(p => p.id === photoId);
      
      // Try to delete from storage if it's a storage URL
      if (photo?.photo_url?.includes('companion-photos')) {
        const urlParts = photo.photo_url.split('companion-photos/');
        if (urlParts[1]) {
          await supabase.storage.from('companion-photos').remove([urlParts[1]]);
        }
      }

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

  return { addPhoto, removePhoto, uploadToStorage };
};
