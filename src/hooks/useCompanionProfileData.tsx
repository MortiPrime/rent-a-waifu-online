
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CompanionProfile, CompanionPhoto, CompanionRule, ChatSession } from '@/types';

export const useCompanionProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CompanionProfile | null>(null);
  const [photos, setPhotos] = useState<CompanionPhoto[]>([]);
  const [rules, setRules] = useState<CompanionRule[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Convertir pricing y availability de JSON a objeto tipado con type assertion
        const typedProfile: CompanionProfile = {
          ...profileData,
          promotion_plan: (profileData.promotion_plan as 'basic' | 'premium' | 'vip') || 'basic',
          status: (profileData.status as 'pending' | 'approved' | 'rejected' | 'suspended') || 'approved',
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

  useEffect(() => {
    if (user) {
      loadCompanionProfile();
    }
  }, [user]);

  return {
    profile,
    photos,
    rules,
    chatSessions,
    loading,
    setProfile,
    setPhotos,
    setRules,
    loadCompanionProfile
  };
};
