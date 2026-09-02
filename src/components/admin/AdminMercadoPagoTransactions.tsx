import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import AdminToolbar from './AdminToolbar';
import { PlanBadge, StatusBadge } from './AdminBadges';
import type { AdminTransaction } from '@/hooks/useAdminData';

interface Props {
  transactions: AdminTransaction[];
  nameFor: (userId: string) => string;
}

const formatAmount = (amount: number, currency?: string | null) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: currency || 'MXN' }).format(amount);

export const AdminMercadoPagoTransactions = ({ transactions, nameFor }: Props) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return transactions.filter((t) => {
      const matchesTerm =
        !term ||
        nameFor(t.user_id).toLowerCase().includes(term) ||
        (t.payment_id || '').toLowerCase().includes(term);
      return matchesTerm && (status === 'all' || (t.status || 'pending') === status);
    });
  }, [transactions, search, status, nameFor]);

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-surface-foreground">
          <CreditCard className="h-5 w-5 text-success" />
          Pagos con Mercado Pago
        </CardTitle>
        <CardDescription className="text-surface-foreground/60">
          Historial automático de las transacciones registradas por la pasarela.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por usuario o ID de pago"
          count={filtered.length}
          total={transactions.length}
          filters={[
            {
              value: status,
              onChange: setStatus,
              placeholder: 'Estado',
              options: [
                { value: 'all', label: 'Todos' },
                { value: 'pending', label: 'Pendientes' },
                { value: 'approved', label: 'Aprobados' },
                { value: 'rejected', label: 'Rechazados' },
                { value: 'cancelled', label: 'Cancelados' },
              ],
            },
          ]}
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Sin transacciones"
            description="Aún no hay pagos registrados con esta combinación de filtros."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-surface-border/20 hover:bg-transparent">
                  <TableHead className="text-surface-foreground/70">Usuario</TableHead>
                  <TableHead className="text-surface-foreground/70">Plan</TableHead>
                  <TableHead className="text-surface-foreground/70">Monto</TableHead>
                  <TableHead className="text-surface-foreground/70">Estado</TableHead>
                  <TableHead className="text-surface-foreground/70">Fecha</TableHead>
                  <TableHead className="text-surface-foreground/70">ID de pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id} className="border-surface-border/10">
                    <TableCell className="text-surface-foreground">{nameFor(t.user_id)}</TableCell>
                    <TableCell>
                      <PlanBadge plan={t.subscription_type} />
                      <p className="mt-1 text-xs text-surface-foreground/60">
                        {t.subscription_months || 1} {(t.subscription_months || 1) === 1 ? 'mes' : 'meses'}
                      </p>
                    </TableCell>
                    <TableCell className="font-semibold text-surface-foreground">
                      {formatAmount(Number(t.amount), t.currency)}
                    </TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-sm text-surface-foreground/70">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString('es-MX') : '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-surface-foreground/60">
                      {t.payment_id || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMercadoPagoTransactions;
