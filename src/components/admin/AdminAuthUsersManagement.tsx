
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Shield, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProfileUser {
  id: string;
  full_name: string | null;
  username: string | null;
  user_role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AdminAuthUsersManagementProps {
  onDataChange: () => void;
}

export const AdminAuthUsersManagement = ({ onDataChange }: AdminAuthUsersManagementProps) => {
  const { toast } = useToast();
  const [profileUsers, setProfileUsers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfileUsers(data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId);
      const { error } = await supabase
        .from('profiles')
        .update({ user_role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Rol actualizado",
        description: `El rol se cambió a ${newRole}`,
      });

      await loadUsers();
      onDataChange();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el rol",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-white mt-2">Cargando usuarios...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Gestión de Usuarios
        </CardTitle>
        <p className="text-white/70 text-sm">
          Administra los perfiles de usuarios registrados.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/20">
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Usuario</TableHead>
                <TableHead className="text-white">Rol</TableHead>
                <TableHead className="text-white">Fecha Registro</TableHead>
                <TableHead className="text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profileUsers.map((user) => (
                <TableRow key={user.id} className="border-b border-white/10">
                  <TableCell className="text-white">
                    {user.full_name || 'Sin nombre'}
                  </TableCell>
                  <TableCell className="text-white/70">
                    @{user.username || 'sin-usuario'}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      user.user_role === 'admin' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      user.user_role === 'girlfriend' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                      'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }>
                      {user.user_role || 'client'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/70">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.user_role !== 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserRole(user.id, 'admin')}
                          disabled={updating === user.id}
                          className="border-white/30 text-white hover:bg-white/10 text-xs"
                        >
                          Hacer Admin
                        </Button>
                      )}
                      {user.user_role !== 'client' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserRole(user.id, 'client')}
                          disabled={updating === user.id}
                          className="border-white/30 text-white hover:bg-white/10 text-xs"
                        >
                          Hacer Cliente
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {profileUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No hay usuarios registrados</h3>
            <p className="text-gray-300">Los usuarios registrados aparecerán aquí.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
