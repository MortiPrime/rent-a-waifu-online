
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Calendar } from 'lucide-react';

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
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Admin</Badge>;
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
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">VIP</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{type}</Badge>;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gestión de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-3">Usuario</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3">Suscripción</th>
                <th className="text-left p-3">Expira</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/10">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{user.full_name || 'Sin nombre'}</p>
                      <p className="text-sm text-white/70">{user.username}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {getRoleBadge(user.user_role)}
                  </td>
                  <td className="p-3">
                    {getSubscriptionBadge(user.subscription_type)}
                  </td>
                  <td className="p-3">
                    <p className="text-sm">
                      {user.subscription_expires_at 
                        ? new Date(user.subscription_expires_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </td>
                  <td className="p-3">
                    <div className="space-y-2">
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
      </CardContent>
    </Card>
  );
};
