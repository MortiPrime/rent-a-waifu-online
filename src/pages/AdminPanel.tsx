
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Crown, Users, Settings, DollarSign, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminCompanionManagement } from '@/components/admin/AdminCompanionManagement';
import { AdminPaymentProofs } from '@/components/admin/AdminPaymentProofs';

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

interface CompanionProfile {
  id: string;
  user_id: string;
  stage_name: string;
  real_name: string;
  promotion_plan: string;
  status: string;
  created_at: string;
}

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

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [companions, setCompanions] = useState<CompanionProfile[]>([]);
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar usuarios (simplificado - sin emails por el momento)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Por ahora mostramos sin emails hasta resolver el tema de auth.users
      const usersWithEmails = usersData?.map(user => ({
        ...user,
        email: 'Email no disponible'
      })) || [];

      setUsers(usersWithEmails);

      // Cargar companions
      const { data: companionsData, error: companionsError } = await supabase
        .from('companion_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (companionsError) throw companionsError;
      setCompanions(companionsData || []);

      // Cargar comprobantes de pago
      const { data: proofsData, error: proofsError } = await supabase
        .from('payment_proofs')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (proofsError) throw proofsError;
      setPaymentProofs(proofsData || []);

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
              Gestiona usuarios, suscripciones, companions y comprobantes de pago desde aquí.
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {paymentProofs.filter(p => p.status === 'pending').length}
                </h3>
                <p className="text-white/70">Comprobantes Pendientes</p>
              </CardContent>
            </Card>
          </div>

          {/* Gestión de Usuarios */}
          <AdminUserManagement users={users} onDataChange={loadData} />

          {/* Gestión de Companions */}
          <AdminCompanionManagement companions={companions} onDataChange={loadData} />

          {/* Gestión de Comprobantes de Pago */}
          <AdminPaymentProofs paymentProofs={paymentProofs} onDataChange={loadData} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
