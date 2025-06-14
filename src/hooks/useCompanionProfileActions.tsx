
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CompanionProfile } from '@/types';

export const useCompanionProfileActions = (
  profile: CompanionProfile | null,
  setProfile: (profile: CompanionProfile) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const updateProfile = async (profileData: Partial<CompanionProfile>) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      console.log('Actualizando perfil de companion:', profileData);

      if (profile) {
        // Actualizar perfil existente
        const updateData = {
          ...profileData,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('companion_profiles')
          .update(updateData)
          .eq('id', profile.id)
          .select()
          .single();

        if (error) throw error;
        
        const typedProfile: CompanionProfile = {
          ...data,
          promotion_plan: (data.promotion_plan as 'basic' | 'premium' | 'vip') || 'basic',
          status: (data.status as 'pending' | 'approved' | 'rejected' | 'suspended') || 'approved',
          pricing: typeof data.pricing === 'string' 
            ? JSON.parse(data.pricing) 
            : data.pricing || {
                basic_chat: 150,
                premium_chat: 300,
                video_call: 500,
                date_cost: 500
              },
          availability: typeof data.availability === 'string'
            ? JSON.parse(data.availability)
            : data.availability || {
                days: [],
                hours: "flexible"
              }
        };
        setProfile(typedProfile);

        // Sincronizar con companion_listings
        await syncCompanionListing(typedProfile);

        toast({
          title: "Perfil actualizado",
          description: "Los cambios se han guardado correctamente.",
        });

      } else {
        // Crear nuevo perfil - auto-aprobar para companions
        const newProfileData = {
          user_id: user.id,
          stage_name: profileData.stage_name || '',
          real_name: profileData.real_name || '',
          age: profileData.age || 18,
          description: profileData.description || '',
          status: 'approved' as const,
          is_active: true,
          promotion_plan: profileData.promotion_plan || 'basic',
          state: profileData.state,
          city: profileData.city,
          municipality: profileData.municipality,
          contact_number: profileData.contact_number,
          pricing: profileData.pricing || {
            basic_chat: 150,
            premium_chat: 300,
            video_call: 500,
            date_cost: 500
          },
          availability: profileData.availability || {
            days: [],
            hours: "flexible"
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('Creando nuevo perfil de companion:', newProfileData);

        const { data, error } = await supabase
          .from('companion_profiles')
          .insert(newProfileData)
          .select()
          .single();

        if (error) {
          console.error('Error al crear perfil:', error);
          throw error;
        }
        
        const typedProfile: CompanionProfile = {
          ...data,
          promotion_plan: (data.promotion_plan as 'basic' | 'premium' | 'vip') || 'basic',
          status: (data.status as 'pending' | 'approved' | 'rejected' | 'suspended') || 'approved',
          pricing: typeof data.pricing === 'string' 
            ? JSON.parse(data.pricing) 
            : data.pricing || {
                basic_chat: 150,
                premium_chat: 300,
                video_call: 500,
                date_cost: 500
              },
          availability: typeof data.availability === 'string'
            ? JSON.parse(data.availability)
            : data.availability || {
                days: [],
                hours: "flexible"
              }
        };
        setProfile(typedProfile);

        // Crear listing
        await syncCompanionListing(typedProfile);

        toast({
          title: "¡Perfil creado!",
          description: "Tu perfil de companion ha sido creado y está activo.",
        });

        console.log('Perfil de companion creado exitosamente:', typedProfile);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil",
        variant: "destructive",
      });
      throw error;
    }
  };

  const syncCompanionListing = async (profileData: CompanionProfile) => {
    try {
      console.log('Sincronizando companion_listing para perfil:', profileData.id);
      
      const listingData = {
        companion_id: profileData.id,
        user_id: profileData.user_id,
        stage_name: profileData.stage_name,
        description: profileData.description,
        age: profileData.age,
        state: profileData.state,
        city: profileData.city,
        municipality: profileData.municipality,
        contact_number: profileData.contact_number,
        pricing: profileData.pricing,
        promotion_plan: profileData.promotion_plan,
        is_active: profileData.is_active && profileData.status === 'approved',
        updated_at: new Date().toISOString()
      };

      const { error: listingError } = await supabase
        .from('companion_listings')
        .upsert(listingData, { 
          onConflict: 'companion_id',
          ignoreDuplicates: false 
        });

      if (listingError) {
        console.error('Error sincronizando listing:', listingError);
        throw listingError;
      }

      console.log('Listing sincronizado exitosamente');
    } catch (error: any) {
      console.error('Error en syncCompanionListing:', error);
      // No re-throw para no interrumpir el flujo principal
    }
  };

  return { updateProfile };
};
