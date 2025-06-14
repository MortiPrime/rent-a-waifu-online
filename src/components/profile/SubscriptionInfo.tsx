
import { Crown, CreditCard, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionInfoProps {
  profile: UserProfile | null;
}

interface PaymentProof {
  id: string;
  subscription_type: string;
  payment_method: string;
  payment_month: string;
  status: string;
  created_at: string;
  message?: string;
  admin_notes?: string;
}

export const SubscriptionInfo = ({ profile }: SubscriptionInfoProps) => {
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isCompanion = profile?.user_role === 'girlfriend';

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 199,
      features: [
        'Acceso a companions básicas',
        'Chat ilimitado',
        'Perfil personalizable',
        '5 favorites máximo'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 399,
      popular: true,
      features: [
        'Todo lo del plan Básico',
        'Acceso a companions premium',
        'Contenido exclusivo premium',
        'Favorites ilimitados',
        'Sin anuncios'
      ]
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 799,
      features: [
        'Todo lo del plan Premium',
        'Acceso completo a companions VIP',
        'Contenido ultra exclusivo',
        'Videollamadas virtuales',
        'Soporte VIP 24/7'
      ]
    }
  ];

  useEffect(() => {
    if (!isCompanion) {
      fetchPaymentProofs();
    }
  }, [isCompanion]);

  const fetchPaymentProofs = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentProofs(data || []);
    } catch (error) {
      console.error('Error fetching payment proofs:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los comprobantes de pago",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  if (isCompanion) return null;

  return (
    <div className="space-y-6">
      {/* Planes de Suscripción */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Planes de Suscripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  plan.popular 
                    ? 'border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-purple-500/10' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                {plan.popular && (
                  <Badge className="mb-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    Más Popular
                  </Badge>
                )}
                <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                <div className="text-2xl font-bold text-white mb-3">
                  ${plan.price}
                  <span className="text-sm text-white/70"> MXN/mes</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-white/80 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">¿Cómo realizar el pago?</h4>
            <ol className="text-white/80 text-sm space-y-1 list-decimal list-inside">
              <li>Realiza tu pago por transferencia bancaria o depósito</li>
              <li>Sube tu comprobante de pago en la sección de abajo</li>
              <li>Espera la validación de nuestro equipo (24-48 horas)</li>
              <li>¡Disfruta de tu suscripción activada!</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Estado Actual */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Estado Actual de Suscripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-white/70">Plan actual</label>
              <p className="text-white text-lg capitalize">{profile?.subscription_type || 'básico'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-white/70">Expira el</label>
              <p className="text-white text-lg">
                {profile?.subscription_expires_at 
                  ? new Date(profile.subscription_expires_at).toLocaleDateString('es-ES')
                  : 'No aplica'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Comprobantes */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Historial de Comprobantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-white/70 text-center py-4">Cargando...</div>
          ) : paymentProofs.length === 0 ? (
            <div className="text-white/70 text-center py-4">
              No has enviado comprobantes de pago aún
            </div>
          ) : (
            <div className="space-y-3">
              {paymentProofs.map((proof) => (
                <div 
                  key={proof.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-medium capitalize">
                        Plan {proof.subscription_type}
                      </span>
                      {getStatusBadge(proof.status)}
                    </div>
                    <div className="text-white/70 text-sm">
                      {proof.payment_month} - {proof.payment_method}
                    </div>
                    {proof.admin_notes && proof.status === 'rejected' && (
                      <div className="text-red-300 text-sm mt-1">
                        Motivo: {proof.admin_notes}
                      </div>
                    )}
                  </div>
                  <div className="text-white/50 text-sm">
                    {new Date(proof.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
