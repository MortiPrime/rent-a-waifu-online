
import { useState } from 'react';
import { User, Edit, Camera, Crown, Heart, MapPin, Phone, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
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

  const handleBecomeCompanion = async () => {
    try {
      // Actualizar el rol del usuario a companion
      await updateProfile({ user_role: 'girlfriend' });
      
      // Navegar al dashboard de companion
      navigate('/');
      
      // Recargar la página para que se actualice el contexto
      window.location.reload();
    } catch (error) {
      console.error('Error converting to companion:', error);
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

  const isCompanion = profile?.user_role === 'girlfriend';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-pink-500 hover:bg-pink-600"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Cambiar Avatar</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="URL de la imagen"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                      />
                      <Button 
                        onClick={() => updateProfile({ avatar_url: formData.avatar_url })}
                        className="w-full bg-pink-500 hover:bg-pink-600"
                      >
                        Actualizar Avatar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="text-center">
                <CardTitle className="text-2xl text-white">
                  {profile?.full_name || 'Usuario Anónimo'}
                </CardTitle>
                <p className="text-gray-300">@{profile?.username || 'usuario'}</p>
                <div className="mt-2 flex flex-col items-center gap-2">
                  {!isCompanion && getSubscriptionBadge()}
                  {isCompanion && (
                    <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-pink-500 text-white">
                      <Users className="w-4 h-4" />
                      <span>Companion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Type Conversion */}
        {!isCompanion && (
          <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                ¿Quieres ser Companion?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Convierte tu cuenta en una cuenta de Companion y comienza a ofrecer tus servicios.
                Podrás gestionar tu perfil, fotos, precios y reglas de manera profesional.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">Ingresos</h4>
                  <p className="text-white/70 text-sm">Genera ingresos con tus servicios</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">Fotos</h4>
                  <p className="text-white/70 text-sm">Sube fotos profesionales</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">Planes</h4>
                  <p className="text-white/70 text-sm">Elige tu plan promocional</p>
                </div>
              </div>
              <Button 
                onClick={handleBecomeCompanion}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg py-6"
              >
                <Users className="w-5 h-5 mr-2" />
                Convertir a Companion Ahora
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Details */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Información Personal</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Nombre completo</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Tu nombre completo"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Nombre de usuario</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Tu nombre de usuario"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Guardar Cambios
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Email</Label>
                    <p className="text-white text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Nombre completo</Label>
                    <p className="text-white text-lg">{profile?.full_name || 'No especificado'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Nombre de usuario</Label>
                    <p className="text-white text-lg">@{profile?.username || 'No especificado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Tipo de cuenta</Label>
                    <p className="text-white text-lg capitalize">
                      {profile?.user_role === 'girlfriend' ? 'Companion' : 'Cliente'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Info - Solo para clientes */}
        {!isCompanion && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Información de Suscripción
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Plan actual</Label>
                  <p className="text-white text-lg capitalize">{profile?.subscription_type || 'básico'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Expira el</Label>
                  <p className="text-white text-lg">
                    {profile?.subscription_expires_at 
                      ? new Date(profile.subscription_expires_at).toLocaleDateString('es-ES')
                      : 'No aplica'
                    }
                  </p>
                </div>
              </div>
              
              {(!profile?.subscription_type || profile.subscription_type === 'basic') && (
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">¡Mejora tu experiencia!</h4>
                  <p className="text-white/80 text-sm mb-3">
                    Con una suscripción Premium o VIP tendrás acceso a números de contacto de companions.
                  </p>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Ver Planes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-pink-400">
                  {profile?.favorite_characters?.length || 0}
                </p>
                <p className="text-sm text-gray-300">Personajes Favoritos</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-purple-400">
                  {profile?.created_at ? 
                    Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
                    : 0
                  }
                </p>
                <p className="text-sm text-gray-300">Días como miembro</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-blue-400">0</p>
                <p className="text-sm text-gray-300">
                  {isCompanion ? 'Clientes atendidos' : 'Citas realizadas'}
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-green-400">0</p>
                <p className="text-sm text-gray-300">Reseñas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
