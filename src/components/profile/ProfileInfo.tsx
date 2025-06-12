import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types';
import { User } from '@supabase/supabase-js';
interface ProfileInfoProps {
  user: User | null;
  profile: UserProfile | null;
  updateProfile: (updates: any) => Promise<void>;
}
export const ProfileInfo = ({
  user,
  profile,
  updateProfile
}: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || ''
  });
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  return <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Información Personal</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="border-white/30 text-white bg-zinc-950 hover:bg-zinc-800">
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-medium">Nombre completo</Label>
                <Input value={formData.full_name} onChange={e => setFormData({
              ...formData,
              full_name: e.target.value
            })} placeholder="Tu nombre completo" className="bg-white/10 border-white/30 text-white placeholder:text-white/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-white font-medium">Nombre de usuario</Label>
                <Input value={formData.username} onChange={e => setFormData({
              ...formData,
              username: e.target.value
            })} placeholder="Tu nombre de usuario" className="bg-white/10 border-white/30 text-white placeholder:text-white/60" />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Guardar Cambios
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="border-white/30 text-white hover:bg-white/10">
                Cancelar
              </Button>
            </div>
          </form> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-white/70">Email</Label>
                <p className="text-white text-lg">{user?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-white/70">Nombre completo</Label>
                <p className="text-white text-lg">{profile?.full_name || 'No especificado'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-white/70">Nombre de usuario</Label>
                <p className="text-white text-lg">@{profile?.username || 'No especificado'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-white/70">Tipo de cuenta</Label>
                <p className="text-white text-lg capitalize">
                  {profile?.user_role === 'girlfriend' ? 'Companion' : 'Cliente'}
                </p>
              </div>
            </div>
          </div>}
      </CardContent>
    </Card>;
};