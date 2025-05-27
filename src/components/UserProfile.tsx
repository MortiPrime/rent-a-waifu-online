
import { useState } from 'react';
import { User, Edit, Camera, Crown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
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

  const getSubscriptionBadge = () => {
    const type = profile?.subscription_type || 'basic';
    const badges = {
      basic: { icon: User, color: 'text-gray-500', bg: 'bg-gray-100', text: 'Básico' },
      premium: { icon: Heart, color: 'text-primary', bg: 'bg-primary/10', text: 'Premium' },
      vip: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-100', text: 'VIP' },
    };
    
    const badge = badges[type as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.color}`}>
        <Icon className="w-4 h-4" />
        <span>{badge.text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cambiar Avatar</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="URL de la imagen"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      />
                      <Button onClick={() => updateProfile({ avatar_url: formData.avatar_url })}>
                        Actualizar Avatar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="text-center">
                <CardTitle className="text-2xl">
                  {profile?.full_name || 'Usuario Anónimo'}
                </CardTitle>
                <p className="text-gray-600">@{profile?.username || 'usuario'}</p>
                <div className="mt-2">
                  {getSubscriptionBadge()}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Información Personal</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre completo</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nombre de usuario</label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Tu nombre de usuario"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="anime-button">
                    Guardar Cambios
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre completo</label>
                  <p className="text-gray-900">{profile?.full_name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre de usuario</label>
                  <p className="text-gray-900">@{profile?.username || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Suscripción</label>
                  <p className="text-gray-900 capitalize">{profile?.subscription_type || 'básica'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {profile?.favorite_characters?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Personajes Favoritos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {profile?.created_at ? 
                    Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
                    : 0
                  }
                </p>
                <p className="text-sm text-gray-600">Días como miembro</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
