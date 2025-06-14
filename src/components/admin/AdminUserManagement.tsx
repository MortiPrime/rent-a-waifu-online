import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Calendar, Crown, Settings } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  user_role: string;
  subscription_type: string;
  subscription_expires_at: string;
  created_at: string;
}

interface AdminResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

interface AdminUserManagementProps {
  users: User[];
  onDataChange: () => void;
}

export const AdminUserManagement = ({ users, onDataChange }: AdminUserManagementProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [expiryDates, setExpiryDates] = useState<{ [key: string]: string }>({});

  const updateUserSubscription = async (userId: string, subscriptionType: string) => {
    try {
      setUpdating(userId);
      
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mes desde ahora

      const { data, error } = await supabase
        .rpc('admin_update_user_subscription', {
          target_user_id: userId,
          new_subscription_type: subscriptionType,
          new_expires_at: expiresAt.toISOString(),
          reason: 'Actualización manual por admin'
        });

      if (error) throw error;
      
      const response = data as AdminResponse;
      
      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Suscripción actualizada",
        description: response?.message || "La suscripción se actualizó correctamente",
      });

      onDataChange();

    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la suscripción",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const updateExpiryDate = async (userId: string) => {
    if (!expiryDates[userId]) {
      toast({
        title: "Error",
        description: "Por favor selecciona una fecha",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(userId);
      
      const { data, error } = await supabase
        .rpc('admin_update_subscription_expiry', {
          target_user_id: userId,
          new_expires_at: new Date(expiryDates[userId]).toISOString(),
          reason: 'Actualización manual de fecha por admin'
        });

      if (error) throw error;
      
      const response = data as AdminResponse;
      
      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Fecha actualizada",
        description: response?.message || "La fecha de expiración se actualizó correctamente",
      });

      setExpiryDates(prev => ({ ...prev, [userId]: '' }));
      onDataChange();

    } catch (error: any) {
      console.error('Error updating expiry date:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la fecha",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><Settings className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'girlfriend':
        return <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Companion</Badge>;
      case 'client':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Cliente</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{role}</Badge>;
    }
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'basic':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{type}</Badge>;
    }
  };

  // Filtrar solo clientes para gestión de suscripciones
  const clientUsers = users.filter(user => user.user_role === 'client');

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gestión de Clientes y Suscripciones
        </CardTitle>
        <p className="text-white/70 text-sm">
          Administra las suscripciones de los clientes. Solo se muestran usuarios con rol de cliente.
        </p>
      </CardHeader>
      <CardContent>
        {clientUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No hay clientes registrados
            </h3>
            <p className="text-gray-300">
              Los usuarios con rol de cliente aparecerán aquí para gestionar sus suscripciones.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-3">Cliente</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Suscripción Actual</th>
                  <th className="text-left p-3">Expira</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/10">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{user.full_name || 'Sin nombre'}</p>
                        <p className="text-sm text-white/70">@{user.username || 'sin-usuario'}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {getSubscriptionBadge(user.subscription_type)}
                    </td>
                    <td className="p-3">
                      <p className="text-sm">
                        {user.subscription_expires_at 
                          ? new Date(user.subscription_expires_at).toLocaleDateString()
                          : 'Sin fecha'
                        }
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="space-y-2">
                        {/* Selector de plan de suscripción */}
                        <div className="flex gap-2">
                          <Select
                            value={user.subscription_type}
                            onValueChange={(value) => updateUserSubscription(user.id, value)}
                            disabled={updating === user.id}
                          >
                            <SelectTrigger className="w-32 bg-white/10 border-white/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="basic" className="text-white">Básico</SelectItem>
                              <SelectItem value="premium" className="text-white">Premium</SelectItem>
                              <SelectItem value="vip" className="text-white">VIP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Selector de fecha de expiración */}
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={expiryDates[user.id] || ''}
                            onChange={(e) => setExpiryDates(prev => ({ ...prev, [user.id]: e.target.value }))}
                            className="w-32 bg-white/10 border-white/30 text-white text-xs"
                            disabled={updating === user.id}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateExpiryDate(user.id)}
                            disabled={updating === user.id || !expiryDates[user.id]}
                            className="border-white/30 text-white hover:bg-white/10"
                          >
                            <Calendar className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Información sobre Suscripciones
          </h4>
          <div className="text-white/80 text-sm space-y-1">
            <p>• <strong>Básico:</strong> Acceso limitado, sin números de contacto</p>
            <p>• <strong>Premium:</strong> Acceso a números de contacto de todas las companions</p>
            <p>• <strong>VIP:</strong> Acceso completo + funciones exclusivas</p>
            <p>• Al cambiar el plan, se extiende automáticamente por 1 mes desde hoy</p>
            <p>• Puedes establecer fechas de expiración personalizadas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};