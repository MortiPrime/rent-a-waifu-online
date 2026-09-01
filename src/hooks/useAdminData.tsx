import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  user_role: string | null;
  subscription_type: string | null;
  subscription_expires_at: string | null;
  created_at: string | null;
}

export interface AdminCompanion {
  id: string;
  user_id: string;
  stage_name: string;
  real_name: string;
  promotion_plan: string | null;
  status: string | null;
  city: string | null;
  state: string | null;
  created_at: string | null;
}

export interface AdminPaymentProof {
  id: string;
  user_id: string;
  subscription_type: string;
  payment_method: string;
  payment_month: string;
  message: string | null;
  status: string | null;
  admin_notes: string | null;
  proof_image_url: string | null;
  created_at: string;
}

export interface AdminTransaction {
  id: string;
  user_id: string;
  preference_id: string;
  payment_id: string | null;
  status: string | null;
  amount: number;
  currency: string | null;
  subscription_type: string;
  subscription_months: number | null;
  created_at: string | null;
}

/** Carga centralizada de todos los datos del panel de administración. */
export const useAdminData = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [companions, setCompanions] = useState<AdminCompanion[]>([]);
  const [paymentProofs, setPaymentProofs] = useState<AdminPaymentProof[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const [p, c, pr, tx] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('companion_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('payment_proofs').select('*').order('created_at', { ascending: false }),
        supabase.from('mercadopago_transactions').select('*').order('created_at', { ascending: false }),
      ]);

      const firstError = p.error || c.error || pr.error || tx.error;
      if (firstError) throw firstError;

      setProfiles((p.data as AdminProfile[]) || []);
      setCompanions((c.data as AdminCompanion[]) || []);
      setPaymentProofs((pr.data as AdminPaymentProof[]) || []);
      setTransactions((tx.data as AdminTransaction[]) || []);
    } catch (error: any) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudieron cargar los datos del panel',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    reload();
  }, [reload]);

  /** Nombre legible a partir del user_id, usando los perfiles ya cargados. */
  const nameFor = useCallback(
    (userId: string) => {
      const profile = profiles.find((p) => p.id === userId);
      if (!profile) return 'Usuario desconocido';
      return profile.full_name || (profile.username ? `@${profile.username}` : 'Sin nombre');
    },
    [profiles],
  );

  return { profiles, companions, paymentProofs, transactions, loading, reload, nameFor };
};

export default useAdminData;
