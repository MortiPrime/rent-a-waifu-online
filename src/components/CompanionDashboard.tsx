import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, MessageSquare, DollarSign, Settings, Calendar, Heart, Users, Star, Crown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompanionProfileForm from './CompanionProfileForm';
import CompanionPhotosManager from './CompanionPhotosManager';
import CompanionRulesAndPricing from './CompanionRulesAndPricing';
import CompanionChatHistory from './CompanionChatHistory';
import CompanionPlanSelector from './CompanionPlanSelector';

const CompanionDashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, photos, rules, chatSessions, loading } = useCompanionProfile();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendiente</Badge>,
      approved: <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Aprobado</Badge>,
      rejected: <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">Rechazado</Badge>,
      suspended: <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/30">Suspendido</Badge>
    };
    return badges[status as keyof typeof badges] || badges.approved;
  };

  const getPlanBadge = (plan: string) => {
    const badges = {
      basic: <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 flex items-center gap-1"><Users className="w-3 h-3" />Básico</Badge>,
      premium: <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1"><Star className="w-3 h-3" />Premium</Badge>,
      vip: <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 flex items-center gap-1"><Crown className="w-3 h-3" />VIP</Badge>
    };
    return badges[plan as keyof typeof badges] || badges.basic;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Sign Out Button */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
                Dashboard de
                <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Companion
                </span>
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Gestiona tu perfil, fotos, precios y conecta con tus clientes
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Estado</p>
                    <div className="mt-2">
                      {getStatusBadge(profile?.status || 'approved')}
                    </div>
                  </div>
                  <Settings className="w-8 h-8 text-pink-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Plan</p>
                    <div className="mt-2">
                      {getPlanBadge(profile?.promotion_plan || 'basic')}
                    </div>
                  </div>
                  <Crown className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Fotos</p>
                    <p className="text-2xl font-bold text-white">{photos?.length || 0}</p>
                  </div>
                  <Camera className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Chats</p>
                    <p className="text-2xl font-bold text-white">{chatSessions?.length || 0}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-md border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="photos" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Camera className="w-4 h-4 mr-2" />
                Fotos
              </TabsTrigger>
              <TabsTrigger value="plans" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Crown className="w-4 h-4 mr-2" />
                Planes
              </TabsTrigger>
              <TabsTrigger value="pricing" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Precios
              </TabsTrigger>
              <TabsTrigger value="chats" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-400" />
                      Resumen del Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-white/70 text-sm">Nombre Artístico</p>
                      <p className="text-white font-semibold text-lg">{profile?.stage_name || 'No configurado'}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Ubicación</p>
                      <p className="text-white">{profile?.city ? `${profile.city}, ${profile.state}` : 'No configurada'}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Edad</p>
                      <p className="text-white">{profile?.age || 'No especificada'} años</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Estado</p>
                      {getStatusBadge(profile?.status || 'approved')}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      Precios Configurados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile?.pricing ? (
                      <>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Chat Básico:</span>
                          <span className="text-white font-semibold text-lg">${profile.pricing.basic_chat} MXN</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Chat Premium:</span>
                          <span className="text-white font-semibold text-lg">${profile.pricing.premium_chat} MXN</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Video Llamada:</span>
                          <span className="text-white font-semibold text-lg">${profile.pricing.video_call} MXN</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-white/70 text-center py-4">No hay precios configurados</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Configuración del Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompanionProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos">
              <CompanionPhotosManager />
            </TabsContent>

            <TabsContent value="plans">
              <CompanionPlanSelector />
            </TabsContent>

            <TabsContent value="pricing">
              <CompanionRulesAndPricing />
            </TabsContent>

            <TabsContent value="chats">
              <CompanionChatHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanionDashboard;
