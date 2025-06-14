
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Calendar, Shield, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  raw_user_meta_data: any;
  is_super_admin: boolean;
  phone: string | null;
  phone_confirmed_at: string | null;
  banned_until: string | null;
  deleted_at: string | null;
}

interface AdminResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

interface AdminAuthUsersManagementProps {
  onDataChange: () => void;
}

export const AdminAuthUsersManagement = ({ onDataChange }: AdminAuthUsersManagementProps) => {
  const { toast } = useToast();
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    email: '',
    banUntil: '',
  });

  useEffect(() => {
    loadAuthUsers();
  }, []);

  const loadAuthUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('admin_get_auth_users');

      if (error) throw error;
      
      setAuthUsers(data || []);
    } catch (error: any) {
      console.error('Error loading auth users:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAuthUser = async (userId: string, updates: any, reason: string) => {
    try {
      setUpdating(userId);
      
      const { data, error } = await supabase.rpc('admin_update_auth_user', {
        target_user_id: userId,
        ...updates,
        reason
      });

      if (error) throw error;
      
      const response = data as AdminResponse;
      
      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Usuario actualizado",
        description: response?.message || "El usuario se actualizó correctamente",
      });

      await loadAuthUsers();
      onDataChange();
      setEditingUser(null);

    } catch (error: any) {
      console.error('Error updating auth user:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const confirmEmail = (userId: string) => {
    updateAuthUser(userId, { new_email_confirmed: true }, 'Confirmación manual de email por admin');
  };

  const banUser = (userId: string) => {
    const banUntil = new Date();
    banUntil.setFullYear(banUntil.getFullYear() + 1); // Ban por 1 año
    updateAuthUser(userId, { new_banned_until: banUntil.toISOString() }, 'Usuario baneado por admin');
  };

  const unbanUser = (userId: string) => {
    updateAuthUser(userId, { new_banned_until: null }, 'Usuario desbaneado por admin');
  };

  const startEdit = (user: AuthUser) => {
    setEditingUser(user.id);
    setEditForm({
      email: user.email,
      banUntil: user.banned_until ? new Date(user.banned_until).toISOString().split('T')[0] : '',
    });
  };

  const saveEdit = () => {
    if (!editingUser) return;
    
    const updates: any = {};
    const user = authUsers.find(u => u.id === editingUser);
    
    if (editForm.email !== user?.email) {
      updates.new_email = editForm.email;
    }
    
    if (editForm.banUntil) {
      updates.new_banned_until = new Date(editForm.banUntil).toISOString();
    } else if (user?.banned_until) {
      updates.new_banned_until = null;
    }

    updateAuthUser(editingUser, updates, 'Actualización manual por admin');
  };

  const getStatusBadge = (user: AuthUser) => {
    if (user.deleted_at) {
      return <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30">Eliminado</Badge>;
    }
    if (user.banned_until && new Date(user.banned_until) > new Date()) {
      return <Badge variant="destructive" className="bg-orange-500/20 text-orange-300 border-orange-500/30">Baneado</Badge>;
    }
    if (!user.email_confirmed_at) {
      return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Sin confirmar</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Activo</Badge>;
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
          Gestión de Usuarios Auth
        </CardTitle>
        <p className="text-white/70 text-sm">
          Administra usuarios directamente desde auth.users con acceso completo a emails y estados.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/20">
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Estado</TableHead>
                <TableHead className="text-white">Último Acceso</TableHead>
                <TableHead className="text-white">Fecha Registro</TableHead>
                <TableHead className="text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authUsers.map((user) => (
                <TableRow key={user.id} className="border-b border-white/10">
                  <TableCell className="text-white">
                    {editingUser === user.id ? (
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white/10 border-white/30 text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span>{user.email}</span>
                        {!user.email_confirmed_at && (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user)}
                  </TableCell>
                  <TableCell className="text-white/70">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Nunca'
                    }
                  </TableCell>
                  <TableCell className="text-white/70">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {editingUser === user.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={saveEdit}
                          disabled={updating === user.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(null)}
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(user)}
                          disabled={updating === user.id}
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          Editar
                        </Button>
                        
                        {!user.email_confirmed_at && (
                          <Button
                            size="sm"
                            onClick={() => confirmEmail(user.id)}
                            disabled={updating === user.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                        
                        {user.banned_until && new Date(user.banned_until) > new Date() ? (
                          <Button
                            size="sm"
                            onClick={() => unbanUser(user.id)}
                            disabled={updating === user.id}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Desbanear
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => banUser(user.id)}
                            disabled={updating === user.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Ban className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {authUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No hay usuarios registrados
            </h3>
            <p className="text-gray-300">
              Los usuarios registrados aparecerán aquí.
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Información sobre Gestión de Auth Users
          </h4>
          <div className="text-white/80 text-sm space-y-1">
            <p>• <strong>Email:</strong> Dirección de correo del usuario y estado de confirmación</p>
            <p>• <strong>Confirmar Email:</strong> Marca el email como verificado manualmente</p>
            <p>• <strong>Banear:</strong> Bloquea el acceso del usuario por 1 año</p>
            <p>• <strong>Desbanear:</strong> Restaura el acceso del usuario</p>
            <p>• Todas las acciones quedan registradas en el log de administrador</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
