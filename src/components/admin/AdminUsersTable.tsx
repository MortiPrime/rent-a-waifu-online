import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Users } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import AdminToolbar from './AdminToolbar';
import { PlanBadge, RoleBadge } from './AdminBadges';
import type { AdminProfile } from '@/hooks/useAdminData';

interface Props {
  users: AdminProfile[];
  onDataChange: () => void;
}

/** Tabla única de usuarios: perfil, rol y suscripción en un solo lugar. */
export const AdminUsersTable = ({ users, onDataChange }: Props) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [plan, setPlan] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<Record<string, string>>({});
  const [pendingAdmin, setPendingAdmin] = useState<AdminProfile | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesTerm =
        !term ||
        (u.full_name || '').toLowerCase().includes(term) ||
        (u.username || '').toLowerCase().includes(term);
      const userRole = u.user_role || 'client';
      const userPlan = u.subscription_type || 'basic';
      return matchesTerm && (role === 'all' || userRole === role) && (plan === 'all' || userPlan === plan);
    });
  }, [users, search, role, plan]);

  const patchProfile = async (id: string, values: Record<string, unknown>, message: string) => {
    try {
      setUpdating(id);
      const { error } = await supabase.from('profiles').update(values).eq('id', id);
      if (error) throw error;
      toast({ title: 'Listo', description: message });
      onDataChange();
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'No se pudo actualizar', variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  const setRoleFor = (user: AdminProfile, newRole: string) =>
    patchProfile(user.id, { user_role: newRole }, `Rol cambiado a ${newRole}`);

  const setPlanFor = (user: AdminProfile, newPlan: string) => {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    return patchProfile(
      user.id,
      { subscription_type: newPlan, subscription_expires_at: expires.toISOString() },
      'Suscripción actualizada (vence en 1 mes)',
    );
  };

  const setExpiryFor = (user: AdminProfile) => {
    const value = expiry[user.id];
    if (!value) return;
    setExpiry((prev) => ({ ...prev, [user.id]: '' }));
    return patchProfile(user.id, { subscription_expires_at: new Date(value).toISOString() }, 'Fecha de vencimiento actualizada');
  };

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-surface-foreground">
          <Users className="h-5 w-5 text-brand" />
          Usuarios
        </CardTitle>
        <CardDescription className="text-surface-foreground/60">
          Rol, suscripción y vencimiento de todas las cuentas registradas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por nombre o usuario"
          count={filtered.length}
          total={users.length}
          filters={[
            {
              value: role,
              onChange: setRole,
              placeholder: 'Rol',
              options: [
                { value: 'all', label: 'Todos los roles' },
                { value: 'client', label: 'Clientes' },
                { value: 'girlfriend', label: 'Companions' },
                { value: 'admin', label: 'Administradores' },
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
          <EmptyState
            icon={Users}
            title="Sin resultados"
            description="Ajusta la búsqueda o los filtros para ver usuarios."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-surface-border/20 hover:bg-transparent">
                  <TableHead className="text-surface-foreground/70">Usuario</TableHead>
                  <TableHead className="text-surface-foreground/70">Rol</TableHead>
                  <TableHead className="text-surface-foreground/70">Suscripción</TableHead>
                  <TableHead className="text-surface-foreground/70">Vence</TableHead>
                  <TableHead className="text-surface-foreground/70">Registro</TableHead>
                  <TableHead className="text-right text-surface-foreground/70">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} className="border-surface-border/10">
                    <TableCell>
                      <p className="font-medium text-surface-foreground">{user.full_name || 'Sin nombre'}</p>
                      <p className="text-xs text-surface-foreground/60">@{user.username || 'sin-usuario'}</p>
                    </TableCell>
                    <TableCell><RoleBadge role={user.user_role} /></TableCell>
                    <TableCell><PlanBadge plan={user.subscription_type} /></TableCell>
                    <TableCell className="text-sm text-surface-foreground/70">
                      {user.subscription_expires_at
                        ? new Date(user.subscription_expires_at).toLocaleDateString('es-MX')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-surface-foreground/70">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('es-MX') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={updating === user.id}
                            className="text-surface-foreground hover:bg-surface/10"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50 w-56 bg-popover">
                          <DropdownMenuLabel>Rol</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setRoleFor(user, 'client')}>Hacer cliente</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setRoleFor(user, 'girlfriend')}>Hacer companion</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPendingAdmin(user)}>Hacer administrador</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Suscripción</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setPlanFor(user, 'basic')}>Plan básico</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPlanFor(user, 'premium')}>Plan premium</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPlanFor(user, 'vip')}>Plan VIP</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Vencimiento manual</DropdownMenuLabel>
                          <div
                            className="flex items-center gap-2 px-2 pb-2"
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            <Input
                              type="date"
                              value={expiry[user.id] || ''}
                              onChange={(e) => setExpiry((prev) => ({ ...prev, [user.id]: e.target.value }))}
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 text-xs"
                            />
                            <Button
                              size="sm"
                              className="brand-button h-8"
                              disabled={!expiry[user.id]}
                              onClick={() => setExpiryFor(user)}
                            >
                              OK
                            </Button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!pendingAdmin} onOpenChange={(open) => !open && setPendingAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Dar acceso de administrador?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAdmin?.full_name || pendingAdmin?.username || 'Este usuario'} podrá gestionar usuarios, pagos y
              contenido del sitio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingAdmin) setRoleFor(pendingAdmin, 'admin');
                setPendingAdmin(null);
              }}
            >
              Sí, hacer admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default AdminUsersTable;
