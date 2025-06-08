
import { supabase } from '@/integrations/supabase/client';
import { CompanionProfile, CompanionRule } from '@/types';

export const useCompanionRules = (
  profile: CompanionProfile | null,
  rules: CompanionRule[],
  setRules: (rules: CompanionRule[]) => void
) => {
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
      setRules([...rules, typedRule]);
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
      setRules(rules.filter(rule => rule.id !== ruleId));
    } catch (error: any) {
      console.error('Error removing rule:', error);
      throw error;
    }
  };

  return { addRule, removeRule };
};
