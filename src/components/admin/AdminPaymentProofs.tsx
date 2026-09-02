import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check, ExternalLink, FileText, X } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import AdminToolbar from './AdminToolbar';
import { PlanBadge, StatusBadge } from './AdminBadges';
import type { AdminPaymentProof } from '@/hooks/useAdminData';

interface Props {
  paymentProofs: AdminPaymentProof[];
  onDataChange: () => void;
  nameFor: (userId: string) => string;
}

export const AdminPaymentProofs = ({ paymentProofs, onDataChange, nameFor }: Props) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('pending');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return paymentProofs.filter((proof) => {
      const matchesTerm =
        !term ||
        nameFor(proof.user_id).toLowerCase().includes(term) ||
        (proof.payment_month || '').toLowerCase().includes(term);
      const pStatus = proof.status || 'pending';
      return matchesTerm && (status === 'all' || pStatus === status);
    });
  }, [paymentProofs, search, status, nameFor]);

  const updateStatus = async (proofId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setUpdating(proofId);
      const { error } = await supabase
        .from('payment_proofs')
        .update({
          status: newStatus,
          admin_notes: notes[proofId] || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', proofId);
      if (error) throw error;
      toast({
        title: newStatus === 'approved' ? 'Comprobante aprobado' : 'Comprobante rechazado',
        description: 'El estado se actualizó correctamente.',
      });
      setNotes((prev) => ({ ...prev, [proofId]: '' }));
      onDataChange();
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'No se pudo actualizar', variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-surface-foreground">
          <FileText className="h-5 w-5 text-gold" />
          Comprobantes manuales
        </CardTitle>
        <CardDescription className="text-surface-foreground/60">
          Transferencias y depósitos enviados por los usuarios para validación manual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por usuario o mes"
          count={filtered.length}
          total={paymentProofs.length}
          filters={[
            {
              value: status,
              onChange: setStatus,
              placeholder: 'Estado',
              options: [
                { value: 'pending', label: 'Pendientes' },
                { value: 'approved', label: 'Aprobados' },
                { value: 'rejected', label: 'Rechazados' },
                { value: 'all', label: 'Todos' },
              ],
            },
          ]}
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Sin comprobantes"
            description="No hay comprobantes que coincidan con este filtro."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((proof) => (
              <div key={proof.id} className="rounded-xl border border-surface-border/15 bg-surface/5 p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-surface-foreground/50">Usuario</p>
                    <p className="font-medium text-surface-foreground">{nameFor(proof.user_id)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-surface-foreground/50">Plan y método</p>
                    <div className="mt-1 space-y-1">
                      <PlanBadge plan={proof.subscription_type} />
                      <p className="text-sm capitalize text-surface-foreground/75">
                        {(proof.payment_method || '').replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-surface-foreground/50">Mes de pago</p>
                    <p className="text-surface-foreground">{proof.payment_month}</p>
                    <p className="text-xs text-surface-foreground/55">
                      {new Date(proof.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-surface-foreground/50">Estado</p>
                    <div className="mt-1"><StatusBadge status={proof.status} /></div>
                  </div>
                </div>

                {proof.message && (
                  <p className="mt-3 rounded-lg bg-surface/5 p-3 text-sm text-surface-foreground/85">{proof.message}</p>
                )}

                {proof.proof_image_url && (
                  <a
                    href={proof.proof_image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-brand hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />Ver comprobante
                  </a>
                )}

                {proof.admin_notes && (
                  <p className="mt-3 text-sm text-surface-foreground/60">Nota: {proof.admin_notes}</p>
                )}

                {(proof.status || 'pending') === 'pending' && (
                  <div className="mt-4 space-y-3">
                    <Textarea
                      value={notes[proof.id] || ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [proof.id]: e.target.value }))}
                      placeholder="Nota interna (opcional)"
                      className="field-dark"
                      disabled={updating === proof.id}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={updating === proof.id}
                        onClick={() => updateStatus(proof.id, 'approved')}
                        className="border border-success/30 bg-success/20 text-success hover:bg-success/30"
                      >
                        <Check className="mr-1 h-4 w-4" />Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updating === proof.id}
                        onClick={() => updateStatus(proof.id, 'rejected')}
                        className="border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <X className="mr-1 h-4 w-4" />Rechazar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPaymentProofs;
