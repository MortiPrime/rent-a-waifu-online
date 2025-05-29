
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Star, DollarSign, Shield, Users, Crown } from 'lucide-react';
import Navbar from '@/components/Navbar';

const BecomeCompanion = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already a girlfriend, redirect to dashboard
    if (profile?.user_role === 'girlfriend') {
      navigate('/');
    }
  }, [profile, navigate]);

  const handleBecomeCompanion = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await updateProfile({ user_role: 'girlfriend' });
      navigate('/');
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Conviértete en
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Companion Profesional
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Únete a nuestra plataforma exclusiva y comienza a generar ingresos 
              compartiendo tu personalidad única con personas increíbles.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="glass-card text-center">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Ingresos Flexibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Establece tus propios precios y horarios. Gana entre $150-$500 MXN por hora.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Ambiente Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Plataforma verificada con políticas estrictas de respeto y seguridad.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Comunidad Activa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Conecta con clientes genuinos buscando companía y conversaciones auténticas.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans */}
          <div className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-white text-center mb-8">
              Planes de Promoción
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-white">Básico</CardTitle>
                  <div className="text-2xl font-bold text-primary">$99/mes</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">✓ Perfil visible en búsquedas</div>
                  <div className="text-gray-300">✓ Hasta 5 fotos</div>
                  <div className="text-gray-300">✓ Chat básico</div>
                  <div className="text-gray-300">✓ Soporte estándar</div>
                </CardContent>
              </Card>

              <Card className="glass-card border-2 border-primary">
                <CardHeader className="text-center">
                  <Badge className="bg-primary text-white mb-2">Más Popular</Badge>
                  <CardTitle className="text-white">Premium</CardTitle>
                  <div className="text-2xl font-bold text-primary">$199/mes</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">✓ Todo del plan Básico</div>
                  <div className="text-gray-300">✓ Hasta 15 fotos</div>
                  <div className="text-gray-300">✓ Prioridad en búsquedas</div>
                  <div className="text-gray-300">✓ Video llamadas</div>
                  <div className="text-gray-300">✓ Soporte prioritario</div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="text-center">
                  <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <CardTitle className="text-white">VIP</CardTitle>
                  <div className="text-2xl font-bold text-primary">$399/mes</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">✓ Todo del plan Premium</div>
                  <div className="text-gray-300">✓ Fotos ilimitadas</div>
                  <div className="text-gray-300">✓ Destacado especial</div>
                  <div className="text-gray-300">✓ Manager personal</div>
                  <div className="text-gray-300">✓ Comisiones reducidas</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Requirements */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-white text-center">Requisitos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Requisitos Básicos:</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Mayor de 18 años</li>
                    <li>• Identificación oficial válida</li>
                    <li>• Buena conexión a internet</li>
                    <li>• Disponibilidad mínima de 10 horas/semana</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Habilidades Deseadas:</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Excelentes habilidades de comunicación</li>
                    <li>• Personalidad carismática y empática</li>
                    <li>• Paciencia y profesionalismo</li>
                    <li>• Respeto por los límites personales</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¿Lista para comenzar tu nueva aventura?
                </h3>
                <p className="text-gray-300 mb-6">
                  Únete a nuestra comunidad de companions exitosas y comienza a generar ingresos hoy mismo.
                </p>
                <Button 
                  onClick={handleBecomeCompanion}
                  size="lg" 
                  className="anime-button text-lg px-8 py-4"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Convertirme en Companion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeCompanion;
