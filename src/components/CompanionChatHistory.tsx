
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { MessageCircle, Clock, DollarSign, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const CompanionChatHistory = () => {
  const { chatSessions, loading } = useCompanionProfile();

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'basic_chat': return 'Chat Básico';
      case 'premium_chat': return 'Chat Premium';
      case 'video_call': return 'Video Llamada';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Historial de Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <h3 className="text-2xl font-bold text-white">
                {chatSessions.length}
              </h3>
              <p className="text-gray-300">Total de Sesiones</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <h3 className="text-2xl font-bold text-white">
                {chatSessions.reduce((total, session) => total + (session.duration_minutes || 0), 0)}
              </h3>
              <p className="text-gray-300">Minutos Totales</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <h3 className="text-2xl font-bold text-white">
                ${chatSessions.reduce((total, session) => total + (session.total_cost || 0), 0)}
              </h3>
              <p className="text-gray-300">Ingresos Totales</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {chatSessions.map((session) => (
          <Card key={session.id} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-white">
                      {getSessionTypeLabel(session.session_type)}
                    </Badge>
                    <Badge className={`${getStatusColor(session.payment_status)} text-white`}>
                      {getStatusLabel(session.payment_status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>
                        {session.started_at && format(new Date(session.started_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </span>
                    </div>
                    
                    {session.duration_minutes && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <MessageCircle className="w-4 h-4" />
                        <span>{session.duration_minutes} minutos</span>
                      </div>
                    )}
                    
                    {session.total_cost && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <DollarSign className="w-4 h-4" />
                        <span>${session.total_cost}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-4 h-4" />
                      <span>Cliente: {session.client_id.substring(0, 8)}...</span>
                    </div>
                  </div>
                  
                  {session.ended_at && (
                    <div className="mt-2 text-xs text-gray-400">
                      Finalizado: {format(new Date(session.ended_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chatSessions.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No tienes chats aún
            </h3>
            <p className="text-gray-300">
              Una vez que los clientes inicien conversaciones contigo, aparecerán aquí.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanionChatHistory;
