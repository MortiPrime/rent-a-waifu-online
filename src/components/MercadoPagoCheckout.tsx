
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, Shield, Star } from 'lucide-react';

interface MercadoPagoCheckoutProps {
  amount: number;
  title: string;
  description: string;
  onSuccess?: () => void;
}

const MercadoPagoCheckout = ({ amount, title, description, onSuccess }: MercadoPagoCheckoutProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para realizar un pago",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate MercadoPago checkout creation
      // In a real implementation, you would call your backend to create a MercadoPago preference
      const preference = {
        id: 'preference_' + Date.now(),
        init_point: `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=preference_${Date.now()}`,
      };

      // Open MercadoPago checkout in a new window
      const checkout = window.open(preference.init_point, '_blank', 'width=800,height=600');
      
      // Listen for payment completion (in a real app, you'd use webhooks)
      const checkPaymentStatus = setInterval(() => {
        if (checkout?.closed) {
          clearInterval(checkPaymentStatus);
          // Simulate successful payment
          toast({
            title: "¡Pago exitoso!",
            description: "Tu pago ha sido procesado correctamente",
          });
          onSuccess?.();
        }
      }, 1000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al procesar el pago",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5" />
          Checkout
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        <div className="bg-gradient-primary text-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">${amount.toLocaleString()} MXN</div>
          <div className="text-sm opacity-90">Precio total</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            Pago seguro con MercadoPago
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4" />
            Acceso inmediato después del pago
          </div>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full anime-button"
        >
          {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Al hacer clic en "Pagar", serás redirigido a MercadoPago para completar tu pago de forma segura.
        </div>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoCheckout;
