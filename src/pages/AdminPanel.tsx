import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageShell from '@/components/layout/PageShell';
import SectionHeading from '@/components/layout/SectionHeading';
import useAdminData from '@/hooks/useAdminData';

import AdminOverview from '@/components/admin/AdminOverview';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminCompanionManagement from '@/components/admin/AdminCompanionManagement';
import AdminPaymentProofs from '@/components/admin/AdminPaymentProofs';
import AdminMercadoPagoTransactions from '@/components/admin/AdminMercadoPagoTransactions';
import { AdminAnnouncements } from '@/components/admin/AdminAnnouncements';
import AdminDonationSettings from '@/components/admin/AdminDonationSettings';

const tabTrigger =
  'data-[state=active]:bg-surface/15 data-[state=active]:text-surface-foreground text-surface-foreground/70 rounded-md px-3 py-2 text-sm transition-colors';

const AdminPanel = () => {
  const { profiles, companions, paymentProofs, transactions, loading, reload, nameFor } = useAdminData();
  const [tab, setTab] = useState('overview');
  const [paymentsTab, setPaymentsTab] = useState('proofs');
  const [contentTab, setContentTab] = useState('announcements');

  return (
    <PageShell>
      <SectionHeading
        title="Panel de"
        highlight="Administración"
        subtitle="Todo lo que necesitas para operar la plataforma, organizado por tarea."
        align="left"
      />

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-brand" />
        </div>
      ) : (
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 border border-surface-border/20 bg-surface/5 p-1">
            <TabsTrigger value="overview" className={tabTrigger}>Resumen</TabsTrigger>
            <TabsTrigger value="users" className={tabTrigger}>Usuarios</TabsTrigger>
            <TabsTrigger value="companions" className={tabTrigger}>Companions</TabsTrigger>
            <TabsTrigger value="payments" className={tabTrigger}>Pagos</TabsTrigger>
            <TabsTrigger value="content" className={tabTrigger}>Contenido</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview
              profiles={profiles}
              companions={companions}
              paymentProofs={paymentProofs}
              transactions={transactions}
              onNavigate={setTab}
            />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTable users={profiles} onDataChange={reload} />
          </TabsContent>

          <TabsContent value="companions">
            <AdminCompanionManagement companions={companions} onDataChange={reload} />
          </TabsContent>

          <TabsContent value="payments">
            <Tabs value={paymentsTab} onValueChange={setPaymentsTab} className="space-y-4">
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 border border-surface-border/20 bg-surface/5 p-1">
                <TabsTrigger value="proofs" className={tabTrigger}>Comprobantes manuales</TabsTrigger>
                <TabsTrigger value="mercadopago" className={tabTrigger}>Mercado Pago</TabsTrigger>
              </TabsList>
              <TabsContent value="proofs">
                <AdminPaymentProofs paymentProofs={paymentProofs} onDataChange={reload} nameFor={nameFor} />
              </TabsContent>
              <TabsContent value="mercadopago">
                <AdminMercadoPagoTransactions transactions={transactions} nameFor={nameFor} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="content">
            <Tabs value={contentTab} onValueChange={setContentTab} className="space-y-4">
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 border border-surface-border/20 bg-surface/5 p-1">
                <TabsTrigger value="announcements" className={tabTrigger}>Anuncios</TabsTrigger>
                <TabsTrigger value="donations" className={tabTrigger}>Donaciones</TabsTrigger>
              </TabsList>
              <TabsContent value="announcements">
                <AdminAnnouncements />
              </TabsContent>
              <TabsContent value="donations">
                <AdminDonationSettings />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      )}
    </PageShell>
  );
};

export default AdminPanel;
