
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { MessageCircle, Clock, DollarSign, User, TrendingUp, Calendar } from 'lucide-react';
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
      case 'paid': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'cancelled': return 'bg-gradient-to-r from-red-500 to-rose-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
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
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white font-semibold">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-b border-white/20">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-pink-500/30 rounded-lg">
              <MessageCircle className="w-6 h-6 text-pink-300" />
            </div>
            Historial de Chats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-3">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {chatSessions.length}
              </h3>
              <p className="text-white/80 font-medium">Total de Sesiones</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-3">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {chatSessions.reduce((total, session) => total + (session.duration_minutes || 0), 0)}
              </h3>
              <p className="text-white/80 font-medium">Minutos Totales</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                ${chatSessions.reduce((total, session) => total + (session.total_cost || 0), 0)}
              </h3>
              <p className="text-white/80 font-medium">Ingresos Totales</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {chatSessions.map((session) => (
          <Card key={session.id} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 font-semibold">
                      {getSessionTypeLabel(session.session_type)}
                    </Badge>
                    <Badge className={`${getStatusColor(session.payment_status)} text-white px-3 py-1 font-semibold border-0 shadow-lg`}>
                      {getStatusLabel(session.payment_status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-3 text-white/90 bg-white/5 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white">Inicio</p>
                        <p className="text-white/70">
                          {session.started_at && format(new Date(session.started_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </p>
                      </div>
                    </div>
                    
                    {session.duration_minutes && (
                      <div className="flex items-center gap-3 text-white/90 bg-white/5 p-3 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">Duración</p>
                          <p className="text-white/70">{session.duration_minutes} minutos</p>
                        </div>
                      </div>
                    )}
                    
                    {session.total_cost && (
                      <div className="flex items-center gap-3 text-white/90 bg-white/5 p-3 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">Costo</p>
                          <p className="text-white/70">${session.total_cost}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-white/90 bg-white/5 p-3 rounded-lg">
                      <User className="w-5 h-5 text-pink-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white">Cliente</p>
                        <p className="text-white/70">{session.client_id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </div>
                  
                  {session.ended_at && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-white/70">
                        <span className="font-semibold text-white">Finalizado:</span> {format(new Date(session.ended_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chatSessions.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <MessageCircle className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No tienes chats aún
            </h3>
            <p className="text-white/80 text-lg max-w-md mx-auto">
              Una vez que los clientes inicien conversaciones contigo, aparecerán aquí.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanionChatHistory;
