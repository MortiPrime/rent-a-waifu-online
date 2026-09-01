import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock, CreditCard, Crown, FileText, Users } from 'lucide-react';
import type { AdminCompanion, AdminPaymentProof, AdminProfile, AdminTransaction } from '@/hooks/useAdminData';

interface Props {
  profiles: AdminProfile[];
  companions: AdminCompanion[];
  paymentProofs: AdminPaymentProof[];
  transactions: AdminTransaction[];
  onNavigate: (tab: string) => void;
}

const AdminOverview = ({ profiles, companions, paymentProofs, transactions, onNavigate }: Props) => {
  const pendingCompanions = companions.filter((c) => (c.status || 'pending') === 'pending').length;
  const pendingProofs = paymentProofs.filter((p) => (p.status || 'pending') === 'pending').length;

  const stats = [
    { icon: Users, tone: 'text-info', value: profiles.length, label: 'Usuarios registrados', tab: 'users' },
    { icon: Crown, tone: 'text-brand', value: companions.length, label: 'Companions', tab: 'companions' },
    {
      icon: CheckCircle2,
      tone: 'text-success',
      value: companions.filter((c) => c.status === 'approved').length,
      label: 'Companions aprobadas',
      tab: 'companions',
    },
    {
      icon: FileText,
      tone: 'text-gold',
      value: paymentProofs.length,
      label: 'Comprobantes recibidos',
      tab: 'payments',
    },
    {
      icon: CreditCard,
      tone: 'text-success',
      value: transactions.filter((t) => t.status === 'approved').length,
      label: 'Pagos aprobados',
      tab: 'payments',
    },
  ];

  const todo = [
    {
      label: 'Companions esperando aprobación',
      count: pendingCompanions,
      tab: 'companions',
      action: 'Revisar companions',
    },
    {
      label: 'Comprobantes de pago por revisar',
      count: pendingProofs,
      tab: 'payments',
      action: 'Revisar comprobantes',
    },
  ].filter((item) => item.count > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ icon: Icon, tone, value, label, tab }) => (
          <button key={label} type="button" onClick={() => onNavigate(tab)} className="text-left">
            <Card className="surface-card surface-card-hover h-full">
              <CardContent className="p-5 text-center">
                <Icon className={`mx-auto mb-2 h-7 w-7 ${tone}`} />
                <h3 className="text-2xl font-bold text-surface-foreground">{value}</h3>
                <p className="text-xs text-surface-foreground/65">{label}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Card className="surface-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-surface-foreground">
            <Clock className="h-5 w-5 text-gold" />
            Pendientes de tu atención
          </CardTitle>
          <CardDescription className="text-surface-foreground/60">
            Tareas que requieren una decisión del administrador.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {todo.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg border border-surface-border/15 bg-surface/5 p-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <p className="text-surface-foreground/80">Todo al día. No hay tareas pendientes.</p>
            </div>
          ) : (
            todo.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-3 rounded-lg border border-surface-border/15 bg-surface/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-surface-foreground">{item.label}</p>
                  <p className="text-sm text-surface-foreground/60">{item.count} pendiente(s)</p>
                </div>
                <Button size="sm" className="brand-button" onClick={() => onNavigate(item.tab)}>
                  {item.action}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
