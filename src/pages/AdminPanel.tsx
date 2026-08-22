import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Crown, Users, Settings, DollarSign, Clock, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminAuthUsersManagement } from '@/components/admin/AdminAuthUsersManagement';
import { AdminCompanionManagement } from '@/components/admin/AdminCompanionManagement';
import { AdminPaymentProofs } from '@/components/admin/AdminPaymentProofs';
import { AdminMercadoPagoTransactions } from '@/components/admin/AdminMercadoPagoTransactions';
import { AdminAnnouncements } from '@/components/admin/AdminAnnouncements';

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

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [companions, setCompanions] = useState<CompanionProfile[]>([]);
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [mercadoPagoTransactions, setMercadoPagoTransactions] = useState<MercadoPagoTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar usuarios de profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const usersWithEmails = usersData?.map(user => ({
        ...user,
        email: 'Ver en perfil'
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
        .select('*')
        .order('created_at', { ascending: false });

      if (proofsError) throw proofsError;
      
      const formattedProofs = proofsData?.map(proof => ({
        ...proof,
        profiles: { full_name: 'Sin nombre', username: 'Sin usuario' }
      })) || [];
      
      setPaymentProofs(formattedProofs);

      // Cargar transacciones de MercadoPago
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('mercadopago_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      const formattedTransactions = transactionsData?.map(transaction => ({
        ...transaction,
        profiles: { full_name: 'Sin nombre', username: 'Sin usuario' }
      })) || [];

      setMercadoPagoTransactions(formattedTransactions);

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

  const stats = [
    { icon: Users, tone: 'text-info', value: users.length, label: 'Usuarios' },
    { icon: Crown, tone: 'text-brand', value: companions.length, label: 'Companions' },
    {
      icon: DollarSign,
      tone: 'text-success',
      value: users.filter((u) => u.subscription_type && u.subscription_type !== 'basic').length,
      label: 'Suscripciones Premium',
    },
    {
      icon: Clock,
      tone: 'text-gold',
      value: paymentProofs.filter((p) => p.status === 'pending').length,
      label: 'Comprobantes Pendientes',
    },
    {
      icon: CreditCard,
      tone: 'text-success',
      value: mercadoPagoTransactions.filter((t) => t.status === 'approved').length,
      label: 'Pagos MercadoPago',
    },
  ];

  const tabTrigger =
    'data-[state=active]:bg-surface/15 data-[state=active]:text-surface-foreground text-surface-foreground/70 rounded-md px-3 py-2 text-sm transition-colors';

  return (
    <PageShell maxWidth="max-w-7xl">
      <SectionHeading title="Panel de" highlight="Administración" align="left" />

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-brand" />
        </div>
      ) : (
        <>
          {/* Estadísticas */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {stats.map(({ icon: Icon, tone, value, label }) => (
              <Card key={label} className="surface-card">
                <CardContent className="p-5 text-center">
                  <Icon className={`mx-auto mb-2 h-7 w-7 ${tone}`} />
                  <h3 className="text-2xl font-bold text-surface-foreground">{value}</h3>
                  <p className="text-xs text-surface-foreground/65">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="announcements" className="space-y-6">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 border border-surface-border/20 bg-surface/5 p-1">
              <TabsTrigger value="announcements" className={tabTrigger}>Anuncios</TabsTrigger>
              <TabsTrigger value="auth" className={tabTrigger}>Cuentas</TabsTrigger>
              <TabsTrigger value="users" className={tabTrigger}>Usuarios</TabsTrigger>
              <TabsTrigger value="companions" className={tabTrigger}>Companions</TabsTrigger>
              <TabsTrigger value="payments" className={tabTrigger}>Pagos</TabsTrigger>
            </TabsList>

            <TabsContent value="announcements">
              <AdminAnnouncements />
            </TabsContent>
            <TabsContent value="auth">
              <AdminAuthUsersManagement onDataChange={loadData} />
            </TabsContent>
            <TabsContent value="users">
              <AdminUserManagement users={users} onDataChange={loadData} />
            </TabsContent>
            <TabsContent value="companions">
              <AdminCompanionManagement companions={companions} onDataChange={loadData} />
            </TabsContent>
            <TabsContent value="payments" className="space-y-6">
              <AdminMercadoPagoTransactions transactions={mercadoPagoTransactions} onDataChange={loadData} />
              <AdminPaymentProofs paymentProofs={paymentProofs} onDataChange={loadData} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </PageShell>
  );
};


export default AdminPanel;
