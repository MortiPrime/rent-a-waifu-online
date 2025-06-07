
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Camera, MessageCircle, DollarSign, Shield, Star, Crown, Heart, TrendingUp } from 'lucide-react';
import CompanionProfileForm from './CompanionProfileForm';
import CompanionPhotosManager from './CompanionPhotosManager';
import CompanionRulesManager from './CompanionRulesManager';
import CompanionChatHistory from './CompanionChatHistory';

const CompanionDashboard = () => {
  const { profile, photos, rules, chatSessions, loading } = useCompanionProfile();
  const [activeTab, setActiveTab] = useState('profile');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'rejected': return 'bg-gradient-to-r from-red-500 to-rose-600';
      case 'suspended': return 'bg-gradient-to-r from-gray-500 to-slate-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'vip': return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'basic': return 'bg-gradient-to-r from-gray-500 to-slate-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazado';
      case 'suspended': return 'Suspendido';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Dashboard de Companion
            </h1>
          </div>
          
          {profile && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Badge className={`${getStatusColor(profile.status)} text-white px-4 py-2 text-sm font-semibold shadow-lg border-0`}>
                <Star className="w-4 h-4 mr-2" />
                {getStatusText(profile.status)}
              </Badge>
              <Badge className={`${getPlanColor(profile.promotion_plan)} text-white px-4 py-2 text-sm font-semibold shadow-lg border-0`}>
                <Crown className="w-4 h-4 mr-2" />
                Plan {profile.promotion_plan.toUpperCase()}
              </Badge>
              <Badge className={profile.is_active ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-semibold shadow-lg border-0' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 text-sm font-semibold shadow-lg border-0'}>
                <div className={`w-2 h-2 rounded-full mr-2 ${profile.is_active ? 'bg-white' : 'bg-white/70'} animate-pulse`}></div>
                {profile.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          )}
        </div>

        {/* Stats Cards mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-5 h-5 text-pink-400" />
                    <span className="text-sm font-medium text-white/90">Fotos</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{photos.length}</p>
                  <p className="text-xs text-white/60 mt-1">Total subidas</p>
                </div>
                <div className="p-3 bg-pink-500/20 rounded-full">
                  <Camera className="w-6 h-6 text-pink-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-white/90">Chats</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{chatSessions.length}</p>
                  <p className="text-xs text-white/60 mt-1">Conversaciones</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-white/90">Ingresos</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    ${chatSessions.reduce((sum, session) => sum + (session.total_cost || 0), 0)}
                  </p>
                  <p className="text-xs text-white/60 mt-1">Total ganado</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-medium text-white/90">Reglas</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{rules.length}</p>
                  <p className="text-xs text-white/60 mt-1">Configuradas</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs mejoradas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-1 rounded-xl">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/70 font-semibold transition-all duration-300 rounded-lg"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/70 font-semibold transition-all duration-300 rounded-lg"
            >
              <Camera className="w-4 h-4 mr-2" />
              Fotos
            </TabsTrigger>
            <TabsTrigger 
              value="rules" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/70 font-semibold transition-all duration-300 rounded-lg"
            >
              <Shield className="w-4 h-4 mr-2" />
              Reglas
            </TabsTrigger>
            <TabsTrigger 
              value="chats" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/70 font-semibold transition-all duration-300 rounded-lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-8">
            <CompanionProfileForm />
          </TabsContent>

          <TabsContent value="photos" className="mt-8">
            <CompanionPhotosManager />
          </TabsContent>

          <TabsContent value="rules" className="mt-8">
            <CompanionRulesManager />
          </TabsContent>

          <TabsContent value="chats" className="mt-8">
            <CompanionChatHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanionDashboard;
