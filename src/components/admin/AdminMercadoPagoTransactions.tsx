
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Check, X, Clock, DollarSign } from 'lucide-react';

interface MercadoPagoTransaction {
  id: string;
  user_id: string;
  preference_id: string;
  payment_id?: string;
  external_reference?: string;
  status: string;
  amount: number;
  currency: string;
  subscription_type: string;
  subscription_months: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    username: string;
  };
}

interface AdminMercadoPagoTransactionsProps {
  transactions: MercadoPagoTransaction[];
  onDataChange: () => void;
}

export const AdminMercadoPagoTransactions = ({ transactions, onDataChange }: AdminMercadoPagoTransactionsProps) => {
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30"><Check className="w-3 h-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><X className="w-3 h-3 mr-1" />Rechazado</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30"><X className="w-3 h-3 mr-1" />Cancelado</Badge>;
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

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'MXN'
    }).format(amount);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Transacciones MercadoPago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-white/70">No hay transacciones de MercadoPago</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-white/70 text-sm">Usuario</p>
                      <p className="text-white font-medium">
                        {transaction.profiles?.full_name || 'Sin nombre'}
                      </p>
                      <p className="text-white/60 text-xs">
                        {transaction.profiles?.username}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-white/70 text-sm">Plan y Duración</p>
                      <div className="space-y-1">
                        {getSubscriptionBadge(transaction.subscription_type)}
                        <p className="text-white/80 text-sm">
                          {transaction.subscription_months} {transaction.subscription_months === 1 ? 'mes' : 'meses'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white/70 text-sm">Monto y Estado</p>
                      <p className="text-white font-bold flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatAmount(transaction.amount, transaction.currency)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                    
                    <div>
                      <p className="text-white/70 text-sm">Fecha</p>
                      <p className="text-white">
                        {new Date(transaction.created_at).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-white/60 text-xs">
                        {new Date(transaction.created_at).toLocaleTimeString('es-ES')}
                      </p>
                    </div>
                  </div>
                  
                  {transaction.payment_id && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/70">ID de Pago:</p>
                          <p className="text-white/90 font-mono text-xs">{transaction.payment_id}</p>
                        </div>
                        {transaction.external_reference && (
                          <div>
                            <p className="text-white/70">Referencia:</p>
                            <p className="text-white/90 font-mono text-xs">{transaction.external_reference}</p>
                          </div>
                        )}
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
