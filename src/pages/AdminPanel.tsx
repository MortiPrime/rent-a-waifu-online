
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Crown, Users, Settings, Calendar, DollarSign } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface User {
  id: string;
  full_name: string;
  username: string;
  user_role: string;
  subscription_type: string;
  subscription_expires_at: string;
  created_at: string;
}

interface CompanionProfile {
  id: string;
  user_id: string;
  stage_name: string;
  real_name: string;
  promotion_plan: string;
  status: string;
  created_at: string;
}

interface AdminResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [companions, setCompanions] = useState<CompanionProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar usuarios
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Cargar companions
      const { data: companionsData, error: companionsError } = await supabase
        .from('companion_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (companionsError) throw companionsError;
      setCompanions(companionsData || []);

    } catch (error: any) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

      // Recargar datos
      loadData();

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

  const updateCompanionPlan = async (companionId: string, promotionPlan: string) => {
    try {
      setUpdating(companionId);
      
      const { data, error } = await supabase
        .rpc('admin_update_companion_plan', {
          companion_profile_id: companionId,
          new_promotion_plan: promotionPlan,
          reason: 'Actualización manual por admin'
        });

      if (error) throw error;
      
      const response = data as AdminResponse;
      
      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Plan actualizado",
        description: response?.message || "El plan se actualizó correctamente",
      });

      // Recargar datos
      loadData();

    } catch (error: any) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el plan",
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

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'basic':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{plan}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Panel de
              <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Administración
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Gestiona usuarios, suscripciones y planes de companions desde aquí.
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{users.length}</h3>
                <p className="text-white/70">Usuarios Total</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Crown className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{companions.length}</h3>
                <p className="text-white/70">Companions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {users.filter(u => u.subscription_type !== 'basic').length}
                </h3>
                <p className="text-white/70">Suscripciones Premium</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {companions.filter(c => c.status === 'approved').length}
                </h3>
                <p className="text-white/70">Companions Activas</p>
              </CardContent>
            </Card>
          </div>

          {/* Gestión de Usuarios */}
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Gestión de Companions */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Gestión de Companions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-3">Companion</th>
                      <th className="text-left p-3">Nombre Real</th>
                      <th className="text-left p-3">Plan</th>
                      <th className="text-left p-3">Estado</th>
                      <th className="text-left p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companions.map((companion) => (
                      <tr key={companion.id} className="border-b border-white/10">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{companion.stage_name}</p>
                            <p className="text-sm text-white/70">{companion.user_id}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="text-sm">{companion.real_name}</p>
                        </td>
                        <td className="p-3">
                          {getPlanBadge(companion.promotion_plan)}
                        </td>
                        <td className="p-3">
                          <Badge className={`${
                            companion.status === 'approved' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          }`}>
                            {companion.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Select
                              value={companion.promotion_plan}
                              onValueChange={(value) => updateCompanionPlan(companion.id, value)}
                              disabled={updating === companion.id}
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
