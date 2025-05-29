
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { MessageCircle, Clock, DollarSign, User } from 'lucide-react';
import { ChatSession } from '@/types';

const CompanionChatHistory = () => {
  const { chatSessions, loading } = useCompanionProfile();

  const getSessionTypeLabel = (type: ChatSession['session_type']) => {
    switch (type) {
      case 'basic_chat': return 'Chat Básico';
      case 'premium_chat': return 'Chat Premium';
      case 'video_call': return 'Video Llamada';
      default: return type;
    }
  };

  const getSessionTypeColor = (type: ChatSession['session_type']) => {
    switch (type) {
      case 'basic_chat': return 'bg-gray-500';
      case 'premium_chat': return 'bg-blue-500';
      case 'video_call': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: ChatSession['payment_status']) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusLabel = (status: ChatSession['payment_status']) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'En curso';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalEarnings = chatSessions
    .filter(session => session.payment_status === 'paid')
    .reduce((sum, session) => sum + (session.total_cost || 0), 0);

  const completedSessions = chatSessions.filter(session => session.ended_at).length;
  const activeSessions = chatSessions.filter(session => !session.ended_at).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-300">Sesiones Completadas</span>
            </div>
            <p className="text-2xl font-bold text-white">{completedSessions}</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-300">Sesiones Activas</span>
            </div>
            <p className="text-2xl font-bold text-white">{activeSessions}</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-300">Ingresos Totales</span>
            </div>
            <p className="text-2xl font-bold text-white">${totalEarnings}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chat Sessions List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Historial de Conversaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chatSessions.map((session) => (
              <Card key={session.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">
                          Cliente #{session.client_id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-400">
                          Iniciado: {new Date(session.started_at).toLocaleString()}
                        </p>
                        {session.ended_at && (
                          <p className="text-sm text-gray-400">
                            Finalizado: {new Date(session.ended_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSessionTypeColor(session.session_type)} text-white`}>
                        {getSessionTypeLabel(session.session_type)}
                      </Badge>
                      <Badge className={`${getPaymentStatusColor(session.payment_status)} text-white`}>
                        {getPaymentStatusLabel(session.payment_status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-300">
                      <span>Duración: {formatDuration(session.duration_minutes)}</span>
                      {session.total_cost && (
                        <span>Costo: ${session.total_cost}</span>
                      )}
                    </div>
                    
                    {!session.ended_at && (
                      <Badge className="bg-green-500 text-white animate-pulse">
                        En vivo
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {chatSessions.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No tienes conversaciones aún
              </h3>
              <p className="text-gray-300">
                Cuando los clientes inicien conversaciones contigo, aparecerán aquí.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanionChatHistory;
