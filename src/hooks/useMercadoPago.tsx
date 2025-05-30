
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CreatePreferenceParams {
  plan: 'basic' | 'premium' | 'vip';
  months: number;
}

export const useMercadoPago = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createPreference = async ({ plan, months }: CreatePreferenceParams) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para realizar un pago",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('create-mercadopago-preference', {
        body: { plan, months },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error creating preference:', error);
      toast({
        title: "Error",
        description: error.message || "Error al crear la preferencia de pago",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async (params: CreatePreferenceParams) => {
    const preference = await createPreference(params);
    
    if (preference?.init_point) {
      // Redirigir a MercadoPago
      window.location.href = preference.init_point;
    }
  };

  return {
    loading,
    createPreference,
    redirectToCheckout,
  };
};
