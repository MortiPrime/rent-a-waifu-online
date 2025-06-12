
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, ExternalLink, Copy, CreditCard, Clock, Check, X } from 'lucide-react';

interface PaymentProof {
  id: string;
  subscription_type: string;
  payment_method: string;
  payment_month: string;
  message: string;
  status: string;
  created_at: string;
  admin_notes: string;
}

export const PaymentProofSubmission = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [loadingProofs, setLoadingProofs] = useState(true);
  
  const [formData, setFormData] = useState({
    subscription_type: 'basic',
    payment_method: 'transferencia',
    payment_month: '',
    message: ''
  });

  const paymentInfo = {
    clave_interbancaria: '638180000192603131',
    banco: 'Nu Bank',
    links: {
      basic: 'https://mpago.la/341oxM9',
      premium: 'https://mpago.la/26cBx3Z',
      vip: 'https://mpago.la/2Eda28H'
    }
  };

  React.useEffect(() => {
    if (user && profile?.user_role === 'client') {
      loadPaymentProofs();
    }
  }, [user, profile]);

  const loadPaymentProofs = async () => {
    try {
      setLoadingProofs(true);
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentProofs(data || []);
    } catch (error: any) {
      console.error('Error loading payment proofs:', error);
    } finally {
      setLoadingProofs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payment_month) {
      toast({
        title: "Error",
        description: "Por favor selecciona el mes de pago",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('payment_proofs')
        .insert({
          user_id: user?.id,
          subscription_type: formData.subscription_type,
          payment_method: formData.payment_method,
          payment_month: formData.payment_month,
          message: formData.message || null
        });

      if (error) throw error;

      toast({
        title: "Comprobante enviado",
        description: "Tu comprobante de pago ha sido enviado para revisión",
      });

      setFormData({
        subscription_type: 'basic',
        payment_method: 'transferencia',
        payment_month: '',
        message: ''
      });

      loadPaymentProofs();

    } catch (error: any) {
      console.error('Error submitting payment proof:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el comprobante",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Información copiada al portapapeles",
    });
  };

  const openPaymentLink = (plan: string) => {
    const link = paymentInfo.links[plan as keyof typeof paymentInfo.links];
    if (link) {
      window.open(link, '_blank');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30"><Check className="w-3 h-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><X className="w-3 h-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };

  // Solo mostrar para clientes
  if (profile?.user_role !== 'client') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Información de Pago */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Información de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Transferencia Bancaria</h4>
              <div className="bg-white/5 p-3 rounded">
                <p className="text-white/70 text-sm">Banco: {paymentInfo.banco}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-white font-mono text-sm">{paymentInfo.clave_interbancaria}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(paymentInfo.clave_interbancaria)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Liga de Cobro (MercadoPago)</h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPaymentLink('basic')}
                  className="w-full justify-between border-white/30 text-white hover:bg-white/10"
                >
                  Plan Básico
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPaymentLink('premium')}
                  className="w-full justify-between border-white/30 text-white hover:bg-white/10"
                >
                  Plan Premium
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPaymentLink('vip')}
                  className="w-full justify-between border-white/30 text-white hover:bg-white/10"
                >
                  Plan VIP
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario para Enviar Comprobante */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Enviar Comprobante de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subscription_type" className="text-white">Tipo de Suscripción</Label>
                <Select
                  value={formData.subscription_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_type: value }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="basic" className="text-white">Básico</SelectItem>
                    <SelectItem value="premium" className="text-white">Premium</SelectItem>
                    <SelectItem value="vip" className="text-white">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment_method" className="text-white">Método de Pago</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="transferencia" className="text-white">Transferencia Bancaria</SelectItem>
                    <SelectItem value="liga_cobro" className="text-white">Liga de Cobro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="payment_month" className="text-white">Mes de Pago</Label>
              <Input
                id="payment_month"
                type="month"
                value={formData.payment_month}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_month: e.target.value }))}
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-white">Mensaje (Opcional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Puedes agregar información adicional sobre tu pago..."
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {loading ? 'Enviando...' : 'Enviar Comprobante'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Historial de Comprobantes */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Mis Comprobantes</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingProofs ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            </div>
          ) : paymentProofs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-white/70">No has enviado comprobantes aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentProofs.map((proof) => (
                <div key={proof.id} className="bg-white/5 p-4 rounded border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">
                        Plan {proof.subscription_type.charAt(0).toUpperCase() + proof.subscription_type.slice(1)} - {proof.payment_month}
                      </p>
                      <p className="text-white/70 text-sm capitalize">
                        {proof.payment_method.replace('_', ' ')}
                      </p>
                    </div>
                    {getStatusBadge(proof.status)}
                  </div>
                  
                  {proof.message && (
                    <p className="text-white/80 text-sm mb-2">{proof.message}</p>
                  )}
                  
                  {proof.admin_notes && (
                    <div className="bg-blue-500/10 border border-blue-500/30 p-2 rounded mt-2">
                      <p className="text-blue-300 text-sm font-medium">Notas del administrador:</p>
                      <p className="text-blue-200 text-sm">{proof.admin_notes}</p>
                    </div>
                  )}
                  
                  <p className="text-white/60 text-xs mt-2">
                    Enviado: {new Date(proof.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
