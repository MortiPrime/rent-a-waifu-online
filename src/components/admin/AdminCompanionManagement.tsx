import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Check, Crown, X } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import AdminToolbar from './AdminToolbar';
import { PlanBadge, StatusBadge } from './AdminBadges';
import type { AdminCompanion } from '@/hooks/useAdminData';

interface Props {
  companions: AdminCompanion[];
  onDataChange: () => void;
}

export const AdminCompanionManagement = ({ companions, onDataChange }: Props) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [plan, setPlan] = useState('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return companions.filter((c) => {
      const matchesTerm =
        !term ||
        c.stage_name.toLowerCase().includes(term) ||
        (c.real_name || '').toLowerCase().includes(term) ||
        (c.city || '').toLowerCase().includes(term);
      const cStatus = c.status || 'pending';
      const cPlan = c.promotion_plan || 'basic';
      return matchesTerm && (status === 'all' || cStatus === status) && (plan === 'all' || cPlan === plan);
    });
  }, [companions, search, status, plan]);

  const patch = async (id: string, values: Record<string, unknown>, message: string) => {
    try {
      setUpdating(id);
      const { error } = await supabase.from('companion_profiles').update(values).eq('id', id);
      if (error) throw error;
      toast({ title: 'Listo', description: message });
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
          <Crown className="h-5 w-5 text-brand" />
          Companions
        </CardTitle>
        <CardDescription className="text-surface-foreground/60">
          Aprueba perfiles y define el plan de promoción con el que aparecen en el catálogo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por nombre o ciudad"
          count={filtered.length}
          total={companions.length}
          filters={[
            {
              value: status,
              onChange: setStatus,
              placeholder: 'Estado',
              options: [
                { value: 'all', label: 'Todos los estados' },
                { value: 'pending', label: 'Pendientes' },
                { value: 'approved', label: 'Aprobadas' },
                { value: 'rejected', label: 'Rechazadas' },
              ],
            },
            {
              value: plan,
              onChange: setPlan,
              placeholder: 'Plan',
              options: [
                { value: 'all', label: 'Todos los planes' },
                { value: 'basic', label: 'Básico' },
                { value: 'premium', label: 'Premium' },
                { value: 'vip', label: 'VIP' },
              ],
            },
          ]}
        />

        {filtered.length === 0 ? (
          <EmptyState icon={Crown} title="Sin companions" description="No hay perfiles que coincidan con los filtros." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-surface-border/20 hover:bg-transparent">
                  <TableHead className="text-surface-foreground/70">Companion</TableHead>
                  <TableHead className="text-surface-foreground/70">Ubicación</TableHead>
                  <TableHead className="text-surface-foreground/70">Estado</TableHead>
                  <TableHead className="text-surface-foreground/70">Plan</TableHead>
                  <TableHead className="text-right text-surface-foreground/70">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((companion) => {
                  const cStatus = companion.status || 'pending';
                  return (
                    <TableRow key={companion.id} className="border-surface-border/10">
                      <TableCell>
                        <p className="font-medium text-surface-foreground">{companion.stage_name}</p>
                        <p className="text-xs text-surface-foreground/60">{companion.real_name}</p>
                      </TableCell>
                      <TableCell className="text-sm text-surface-foreground/70">
                        {[companion.city, companion.state].filter(Boolean).join(', ') || '—'}
                      </TableCell>
                      <TableCell><StatusBadge status={cStatus} /></TableCell>
                      <TableCell><PlanBadge plan={companion.promotion_plan} /></TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Select
                            value={companion.promotion_plan || 'basic'}
                            onValueChange={(value) =>
                              patch(companion.id, { promotion_plan: value }, 'Plan actualizado')
                            }
                            disabled={updating === companion.id}
                          >
                            <SelectTrigger className="field-dark w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 bg-popover">
                              <SelectItem value="basic">Básico</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                            </SelectContent>
                          </Select>

                          {cStatus !== 'approved' && (
                            <Button
                              size="sm"
                              disabled={updating === companion.id}
                              onClick={() => patch(companion.id, { status: 'approved' }, 'Companion aprobada')}
                              className="bg-success/20 text-success hover:bg-success/30 border border-success/30"
                            >
                              <Check className="mr-1 h-4 w-4" />Aprobar
                            </Button>
                          )}
                          {cStatus !== 'rejected' && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === companion.id}
                              onClick={() => patch(companion.id, { status: 'rejected' }, 'Companion rechazada')}
                              className="border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                            >
                              <X className="mr-1 h-4 w-4" />Rechazar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCompanionManagement;
