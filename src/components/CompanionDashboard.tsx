import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { AlertCircle, User, Users, MessageCircle, DollarSign, Star, Crown, Settings, Calendar, CreditCard } from 'lucide-react';
import { CompanionChatHistory } from './companion/CompanionChatHistory';
import { CompanionPhotosManager } from './companion/CompanionPhotosManager';
import { CompanionRulesManager } from './companion/CompanionRulesManager';

interface Stats {
  totalClients: number;
  activeChats: number;
  monthlyEarnings: number;
  rating: number;
}

interface CompanionProfile {
  id: string;
  user_id: string;
  stage_name: string;
  real_name: string;
  promotion_plan: string;
  status: string;
  created_at: string;
  is_active: boolean;
}

const CompanionDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeChats: 0,
    monthlyEarnings: 0,
    rating: 0,
  });
  const [profileData, setProfileData] = useState<CompanionProfile | null>(null);
  const [hasCompanionProfile, setHasCompanionProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch companion profile
      const { data: profile, error: profileError } = await supabase
        .from('companion_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching companion profile:", profileError);
      }

      setProfileData(profile);
      setHasCompanionProfile(!!profile);

      // Fetch stats (mock data for now)
      setStats({
        totalClients: 50,
        activeChats: 15,
        monthlyEarnings: 1200,
        rating: 4.8,
      });

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendiente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rechazado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'basic':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">VIP</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{plan}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4">
          Dashboard de
          <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Companion
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Gestiona tu perfil, configura tus servicios y mantén contacto con tus clientes.
        </p>
      </div>

      {/* Estado del perfil */}
      {!hasCompanionProfile ? (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Completa tu perfil de Companion
            </h3>
            <p className="text-gray-300 mb-6">
              Para comenzar a recibir clientes, necesitas completar tu perfil de companion.
            </p>
            <Link to="/become-companion">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <User className="w-5 h-5 mr-2" />
                Crear Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{stats.totalClients}</h3>
                <p className="text-white/70">Clientes Totales</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{stats.activeChats}</h3>
                <p className="text-white/70">Chats Activos</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">${stats.monthlyEarnings}</h3>
                <p className="text-white/70">Ingresos del Mes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{stats.rating}</h3>
                <p className="text-white/70">Calificación</p>
              </CardContent>
            </Card>
          </div>

          {/* Estado del perfil y acciones rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Estado del Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Estado:</span>
                  <Badge className={getStatusBadge(profileData?.status || 'pending').props.className}>
                    {getStatusBadge(profileData?.status || 'pending').props.children}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Plan:</span>
                  <Badge className={getPlanBadge(profileData?.promotion_plan || 'basic').props.className}>
                    {getPlanBadge(profileData?.promotion_plan || 'basic').props.children}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Visibilidad:</span>
                  <Badge className={profileData?.is_active ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}>
                    {profileData?.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/become-companion" className="block">
                  <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <User className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ver Planes de Suscripción
                  </Button>
                </Link>
                <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Calendar className="w-4 h-4 mr-2" />
                  Gestionar Horarios
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Historial de chats */}
          <CompanionChatHistory />

          {/* Gestión de fotos */}
          <CompanionPhotosManager />

          {/* Reglas personalizadas */}
          <CompanionRulesManager />
        </>
      )}
    </div>
  );
};

export default CompanionDashboard;
