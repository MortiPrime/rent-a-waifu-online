
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CompanionProfile, CompanionPhoto, CompanionRule, ChatSession } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useCompanionProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CompanionProfile | null>(null);
  const [photos, setPhotos] = useState<CompanionPhoto[]>([]);
  const [rules, setRules] = useState<CompanionRule[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCompanionProfile();
    }
  }, [user]);

  const loadCompanionProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companion_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading companion profile:', error);
        return;
      }

      if (data) {
        setProfile(data as CompanionProfile);
        await loadPhotos(data.id);
        await loadRules(data.id);
        await loadChatSessions(data.id);
      }
    } catch (error) {
      console.error('Error in loadCompanionProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async (companionId: string) => {
    try {
      const { data, error } = await supabase
        .from('companion_photos')
        .select('*')
        .eq('companion_id', companionId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPhotos(data as CompanionPhoto[]);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const loadRules = async (companionId: string) => {
    try {
      const { data, error } = await supabase
        .from('companion_rules')
        .select('*')
        .eq('companion_id', companionId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data as CompanionRule[]);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

  const loadChatSessions = async (companionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('companion_id', companionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChatSessions(data as ChatSession[]);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const createOrUpdateProfile = async (profileData: Partial<CompanionProfile>) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Ensure required fields are present for database operations
      const requiredData = {
        user_id: user.id,
        stage_name: profileData.stage_name || '',
        real_name: profileData.real_name || '',
        age: profileData.age || 18,
        description: profileData.description || '',
        pricing: profileData.pricing || {
          basic_chat: 150,
          premium_chat: 300,
          video_call: 500
        },
        availability: profileData.availability || {
          days: [],
          hours: 'flexible'
        },
        promotion_plan: profileData.promotion_plan || 'basic',
        exit_rules: profileData.exit_rules || [],
        is_active: profileData.is_active ?? false,
        status: profileData.status || 'pending'
      };

      if (profile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('companion_profiles')
          .update(requiredData)
          .eq('id', profile.id)
          .select()
          .single();

        if (error) throw error;
        setProfile(data as CompanionProfile);
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('companion_profiles')
          .insert(requiredData)
          .select()
          .single();

        if (error) throw error;
        setProfile(data as CompanionProfile);
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil de companion ha sido actualizado exitosamente.",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPhoto = async (photoUrl: string, caption?: string, isPrimary = false) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('companion_photos')
        .insert({
          companion_id: profile.id,
          photo_url: photoUrl,
          caption,
          is_primary: isPrimary,
          display_order: photos.length,
        })
        .select()
        .single();

      if (error) throw error;
      setPhotos(prev => [...prev, data as CompanionPhoto]);

      toast({
        title: "Foto agregada",
        description: "La foto ha sido agregada a tu perfil.",
      });
    } catch (error: any) {
      console.error('Error adding photo:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la foto",
        variant: "destructive",
      });
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

      toast({
        title: "Foto eliminada",
        description: "La foto ha sido eliminada de tu perfil.",
      });
    } catch (error: any) {
      console.error('Error removing photo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la foto",
        variant: "destructive",
      });
    }
  };

  const addRule = async (ruleType: CompanionRule['rule_type'], ruleText: string) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('companion_rules')
        .insert({
          companion_id: profile.id,
          rule_type: ruleType,
          rule_text: ruleText,
        })
        .select()
        .single();

      if (error) throw error;
      setRules(prev => [...prev, data as CompanionRule]);

      toast({
        title: "Regla agregada",
        description: "La regla ha sido agregada a tu perfil.",
      });
    } catch (error: any) {
      console.error('Error adding rule:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la regla",
        variant: "destructive",
      });
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

      toast({
        title: "Regla eliminada",
        description: "La regla ha sido desactivada.",
      });
    } catch (error: any) {
      console.error('Error removing rule:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la regla",
        variant: "destructive",
      });
    }
  };

  return {
    profile,
    photos,
    rules,
    chatSessions,
    loading,
    createOrUpdateProfile,
    addPhoto,
    removePhoto,
    addRule,
    removeRule,
    loadCompanionProfile,
  };
};
