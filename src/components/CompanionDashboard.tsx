
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Camera, MessageCircle, DollarSign, Shield, Star } from 'lucide-react';
import CompanionProfileForm from './CompanionProfileForm';
import CompanionPhotosManager from './CompanionPhotosManager';
import CompanionRulesManager from './CompanionRulesManager';
import CompanionChatHistory from './CompanionChatHistory';

const CompanionDashboard = () => {
  const { profile, photos, rules, chatSessions, loading } = useCompanionProfile();
  const [activeTab, setActiveTab] = useState('profile');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'suspended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'vip': return 'bg-purple-500';
      case 'premium': return 'bg-blue-500';
      case 'basic': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard de Companion
          </h1>
          {profile && (
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(profile.status)} text-white`}>
                {profile.status === 'approved' ? 'Aprobado' : 
                 profile.status === 'pending' ? 'Pendiente' : 
                 profile.status === 'rejected' ? 'Rechazado' : 'Suspendido'}
              </Badge>
              <Badge className={`${getPlanColor(profile.promotion_plan)} text-white`}>
                Plan {profile.promotion_plan.toUpperCase()}
              </Badge>
              <Badge className={profile.is_active ? 'bg-green-500' : 'bg-red-500'}>
                {profile.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-600">Fotos</span>
              </div>
              <p className="text-2xl font-bold text-white">{photos.length}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-600">Chats</span>
              </div>
              <p className="text-2xl font-bold text-white">{chatSessions.length}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-600">Ingresos</span>
              </div>
              <p className="text-2xl font-bold text-white">
                ${chatSessions.reduce((sum, session) => sum + (session.total_cost || 0), 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-600">Reglas</span>
              </div>
              <p className="text-2xl font-bold text-white">{rules.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="rules">Reglas</TabsTrigger>
            <TabsTrigger value="chats">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <CompanionProfileForm />
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <CompanionPhotosManager />
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <CompanionRulesManager />
          </TabsContent>

          <TabsContent value="chats" className="mt-6">
            <CompanionChatHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanionDashboard;
