
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CompanionProfile } from '@/types';

export const useCompanionProfileActions = (
  profile: CompanionProfile | null,
  setProfile: (profile: CompanionProfile) => void
) => {
  const { user } = useAuth();

  const updateProfile = async (profileData: Partial<CompanionProfile>) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
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
      } else {
        // Crear nuevo perfil - auto-aprobar para companions
        const newProfileData = {
          user_id: user.id,
          stage_name: profileData.stage_name || '',
          real_name: profileData.real_name || '',
          age: profileData.age || 18,
          description: profileData.description || '',
          status: 'approved', // Auto-aprobar companions
          is_active: true,
          promotion_plan: profileData.promotion_plan || 'basic',
          state: profileData.state,
          city: profileData.city,
          municipality: profileData.municipality,
          contact_number: profileData.contact_number,
          pricing: profileData.pricing,
          availability: profileData.availability,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('companion_profiles')
          .insert(newProfileData)
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

        // Actualizar el rol del usuario
        await supabase
          .from('profiles')
          .update({ user_role: 'girlfriend' })
          .eq('id', user.id);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return { updateProfile };
};
