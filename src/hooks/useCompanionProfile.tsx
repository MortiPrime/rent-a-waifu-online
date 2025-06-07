import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CompanionProfile, CompanionPhoto, CompanionRule, ChatSession } from '@/types';

export const useCompanionProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CompanionProfile | null>(null);
  const [photos, setPhotos] = useState<CompanionPhoto[]>([]);
  const [rules, setRules] = useState<CompanionRule[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCompanionProfile();
    }
  }, [user]);

  const loadCompanionProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Cargar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('companion_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        // Convertir pricing y availability de JSON a objeto tipado
        const typedProfile: CompanionProfile = {
          ...profileData,
          pricing: typeof profileData.pricing === 'string' 
            ? JSON.parse(profileData.pricing) 
            : profileData.pricing || {
                basic_chat: 150,
                premium_chat: 300,
                video_call: 500,
                date_cost: 500
              },
          availability: typeof profileData.availability === 'string'
            ? JSON.parse(profileData.availability)
            : profileData.availability || {
                days: [],
                hours: "flexible"
              }
        };
        setProfile(typedProfile);

        // Cargar fotos
        const { data: photosData, error: photosError } = await supabase
          .from('companion_photos')
          .select('*')
          .eq('companion_id', profileData.id)
          .order('display_order');

        if (photosError) {
          console.error('Error loading photos:', photosError);
        } else {
          setPhotos(photosData || []);
        }

        // Cargar reglas con type assertion
        const { data: rulesData, error: rulesError } = await supabase
          .from('companion_rules')
          .select('*')
          .eq('companion_id', profileData.id)
          .eq('is_active', true);

        if (rulesError) {
          console.error('Error loading rules:', rulesError);
        } else {
          const typedRules: CompanionRule[] = (rulesData || []).map(rule => ({
            ...rule,
            rule_type: rule.rule_type as 'boundary' | 'availability' | 'pricing' | 'behavior'
          }));
          setRules(typedRules);
        }

        // Cargar sesiones de chat con type assertion
        const { data: chatData, error: chatError } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('companion_id', profileData.id)
          .order('created_at', { ascending: false });

        if (chatError) {
          console.error('Error loading chat sessions:', chatError);
        } else {
          const typedSessions: ChatSession[] = (chatData || []).map(session => ({
            ...session,
            session_type: session.session_type as 'basic_chat' | 'premium_chat' | 'video_call',
            payment_status: session.payment_status as 'pending' | 'paid' | 'cancelled'
          }));
          setChatSessions(typedSessions);
        }
      }
    } catch (error: any) {
      console.error('Error loading companion profile:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          ...profileData,
          user_id: user.id,
          status: 'approved', // Auto-aprobar companions
          is_active: true,
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
      setPhotos(prev => [...prev, data]);
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
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (error: any) {
      console.error('Error removing photo:', error);
      throw error;
    }
  };

  const addRule = async (ruleType: 'boundary' | 'availability' | 'pricing' | 'behavior', ruleText: string) => {
    if (!profile) throw new Error('Perfil no encontrado');

    try {
      const { data, error } = await supabase
        .from('companion_rules')
        .insert({
          companion_id: profile.id,
          rule_type: ruleType,
          rule_text: ruleText
        })
        .select()
        .single();

      if (error) throw error;
      
      const typedRule: CompanionRule = {
        ...data,
        rule_type: data.rule_type as 'boundary' | 'availability' | 'pricing' | 'behavior'
      };
      setRules(prev => [...prev, typedRule]);
      return data;
    } catch (error: any) {
      console.error('Error adding rule:', error);
      throw error;
    }
  };

  const removeRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('companion_rules')
        .update({ is_active: false })
        .eq('id', ruleId);

      if (error) throw error;
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
    } catch (error: any) {
      console.error('Error removing rule:', error);
      throw error;
    }
  };

  return {
    profile,
    photos,
    rules,
    chatSessions,
    loading,
    updateProfile,
    addPhoto,
    removePhoto,
    addRule,
    removeRule,
    loadCompanionProfile,
  };
};
