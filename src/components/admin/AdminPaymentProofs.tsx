
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileText, Check, X, Clock } from 'lucide-react';

interface PaymentProof {
  id: string;
  user_id: string;
  subscription_type: string;
  payment_method: string;
  payment_month: string;
  message: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
    username: string;
  };
}

interface AdminPaymentProofsProps {
  paymentProofs: PaymentProof[];
  onDataChange: () => void;
}

export const AdminPaymentProofs = ({ paymentProofs, onDataChange }: AdminPaymentProofsProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  const updateProofStatus = async (proofId: string, status: 'approved' | 'rejected') => {
    try {
      setUpdating(proofId);
      
      const { error } = await supabase
        .from('payment_proofs')
        .update({ 
          status, 
          admin_notes: adminNotes[proofId] || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', proofId);

      if (error) throw error;

      toast({
        title: status === 'approved' ? "Comprobante aprobado" : "Comprobante rechazado",
        description: `El comprobante ha sido ${status === 'approved' ? 'aprobado' : 'rechazado'} correctamente`,
      });

      setAdminNotes(prev => ({ ...prev, [proofId]: '' }));
      onDataChange();

    } catch (error: any) {
      console.error('Error updating proof status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del comprobante",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
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

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'basic':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">VIP</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{type}</Badge>;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Comprobantes de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentProofs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-white/70">No hay comprobantes de pago</p>
            </div>
          ) : (
            paymentProofs.map((proof) => (
              <Card key={proof.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-white/70 text-sm">Usuario</p>
                      <p className="text-white font-medium">
                        {proof.profiles?.full_name || 'Sin nombre'}
                      </p>
                      <p className="text-white/60 text-xs">
                        {proof.profiles?.username}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-white/70 text-sm">Plan y Método</p>
                      <div className="space-y-1">
                        {getSubscriptionBadge(proof.subscription_type)}
                        <p className="text-white/80 text-sm capitalize">
                          {proof.payment_method.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white/70 text-sm">Mes de Pago</p>
                      <p className="text-white">{proof.payment_month}</p>
                      <p className="text-white/60 text-xs">
                        {new Date(proof.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-white/70 text-sm">Estado</p>
                      {getStatusBadge(proof.status)}
                    </div>
                  </div>
                  
                  {proof.message && (
                    <div className="mt-4">
                      <p className="text-white/70 text-sm">Mensaje del usuario:</p>
                      <p className="text-white/90 text-sm bg-white/5 p-2 rounded mt-1">
                        {proof.message}
                      </p>
                    </div>
                  )}
                  
                  {proof.status === 'pending' && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-white/70 text-sm">Notas del administrador (opcional):</label>
                        <Textarea
                          value={adminNotes[proof.id] || ''}
                          onChange={(e) => setAdminNotes(prev => ({ ...prev, [proof.id]: e.target.value }))}
                          placeholder="Agregar notas sobre este comprobante..."
                          className="bg-white/10 border-white/30 text-white mt-1"
                          disabled={updating === proof.id}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateProofStatus(proof.id, 'approved')}
                          disabled={updating === proof.id}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProofStatus(proof.id, 'rejected')}
                          disabled={updating === proof.id}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
