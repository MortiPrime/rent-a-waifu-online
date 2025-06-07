
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

      setProfile(profileData);

      if (profileData) {
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

        // Cargar reglas
        const { data: rulesData, error: rulesError } = await supabase
          .from('companion_rules')
          .select('*')
          .eq('companion_id', profileData.id)
          .eq('is_active', true);

        if (rulesError) {
          console.error('Error loading rules:', rulesError);
        } else {
          setRules(rulesData || []);
        }

        // Cargar sesiones de chat
        const { data: chatData, error: chatError } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('companion_id', profileData.id)
          .order('created_at', { ascending: false });

        if (chatError) {
          console.error('Error loading chat sessions:', chatError);
        } else {
          setChatSessions(chatData || []);
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
        const { data, error } = await supabase
          .from('companion_profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id)
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
      } else {
        // Crear nuevo perfil
        const { data, error } = await supabase
          .from('companion_profiles')
          .insert({
            ...profileData,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addPhoto = async (photoData: { photo_url: string; caption?: string; is_primary?: boolean }) => {
    if (!profile) throw new Error('Perfil no encontrado');

    try {
      const { data, error } = await supabase
        .from('companion_photos')
        .insert({
          companion_id: profile.id,
          photo_url: photoData.photo_url,
          caption: photoData.caption,
          is_primary: photoData.is_primary || false,
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

  const addRule = async (ruleData: { rule_type: string; rule_text: string }) => {
    if (!profile) throw new Error('Perfil no encontrado');

    try {
      const { data, error } = await supabase
        .from('companion_rules')
        .insert({
          companion_id: profile.id,
          rule_type: ruleData.rule_type,
          rule_text: ruleData.rule_text
        })
        .select()
        .single();

      if (error) throw error;
      setRules(prev => [...prev, data]);
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
