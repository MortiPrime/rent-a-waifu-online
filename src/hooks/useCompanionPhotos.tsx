
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
      setPhotos(photos.filter(p => p.id !== photoId));
    } catch (error: any) {
      console.error('Error removing photo:', error);
      throw error;
    }
  };

  const setPrimaryPhoto = async (photoId: string) => {
    if (!profile) throw new Error('Perfil no encontrado');

    try {
      // Remove primary from all photos of this companion
      const { error: resetError } = await supabase
        .from('companion_photos')
        .update({ is_primary: false })
        .eq('companion_id', profile.id);

      if (resetError) throw resetError;

      // Set the selected photo as primary
      const { error: setError } = await supabase
        .from('companion_photos')
        .update({ is_primary: true })
        .eq('id', photoId);

      if (setError) throw setError;

      setPhotos(
        photos.map(p => ({ ...p, is_primary: p.id === photoId }))
      );
    } catch (error: any) {
      console.error('Error setting primary photo:', error);
      throw error;
    }
  };

  const reorderPhotos = async (reorderedPhotos: CompanionPhoto[]) => {
    try {
      // Update display_order for each photo
      const updates = reorderedPhotos.map((photo, index) =>
        supabase
          .from('companion_photos')
          .update({ display_order: index })
          .eq('id', photo.id)
      );

      await Promise.all(updates);

      setPhotos(reorderedPhotos.map((p, i) => ({ ...p, display_order: i })));
    } catch (error: any) {
      console.error('Error reordering photos:', error);
      throw error;
    }
  };

  return { addPhoto, removePhoto, uploadToStorage, setPrimaryPhoto, reorderPhotos };
};
