import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, DollarSign, Shield, Users, Crown, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CompanionProfileForm from '@/components/CompanionProfileForm';

const BecomeCompanion = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // Verificar si el usuario es companion y mostrar formulario automáticamente
  useEffect(() => {
    if (profile?.user_role === 'girlfriend') {
      setShowForm(true);
    }
  }, [profile]);

  const handleBecomeCompanion = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Si ya es companion, mostrar formulario
    if (profile?.user_role === 'girlfriend') {
      setShowForm(true);
      return;
    }

    // Si no es companion, redirigir al perfil para convertirse
    navigate('/profile');
  };

  // Si ya es companion o debe mostrar el formulario, mostrarlo
  if (profile?.user_role === 'girlfriend' || showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
                Completa tu
                <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Perfil de Companion
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Configura tu perfil profesional y comienza a recibir solicitudes de clientes.
              </p>
            </div>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Información del Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <CompanionProfileForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Conviértete en
              <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
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
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <CardTitle className="text-white">Ingresos Flexibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Establece tus propios precios y horarios. Gana entre $150-$500 MXN por hora.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardHeader>
                <Phone className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <CardTitle className="text-white">Contacto Directo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Los usuarios suscritos podrán ver tu número de contacto para comunicarse contigo.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <CardTitle className="text-white">Búsqueda Local</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Los clientes pueden encontrarte fácilmente por tu ubicación geográfica.
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
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-white">Básico</CardTitle>
                  <div className="text-2xl font-bold text-pink-400">$99/mes</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">✓ Perfil visible en búsquedas</div>
                  <div className="text-gray-300">✓ Hasta 5 fotos</div>
                  <div className="text-gray-300">✓ Chat básico</div>
                  <div className="text-gray-300">✓ Soporte estándar</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-2 border-pink-500">
                <CardHeader className="text-center">
                  <Badge className="bg-pink-500 text-white mb-2">Más Popular</Badge>
                  <CardTitle className="text-white">Premium</CardTitle>
                  <div className="text-2xl font-bold text-pink-400">$199/mes</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">✓ Todo del plan Básico</div>
                  <div className="text-gray-300">✓ Hasta 15 fotos</div>
                  <div className="text-gray-300">✓ Prioridad en búsquedas</div>
                  <div className="text-gray-300">✓ Video llamadas</div>
                  <div className="text-gray-300">✓ Soporte prioritario</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center">
                  <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <CardTitle className="text-white">VIP</CardTitle>
                  <div className="text-2xl font-bold text-pink-400">$399/mes</div>
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
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
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
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¿Lista para comenzar tu nueva aventura?
                </h3>
                <p className="text-gray-300 mb-6">
                  {profile?.user_role === 'girlfriend' 
                    ? 'Completa tu perfil de companion para comenzar a recibir solicitudes.'
                    : 'Primero necesitas convertir tu cuenta a companion desde tu perfil.'}
                </p>
                <Button 
                  onClick={handleBecomeCompanion}
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg transition-all duration-300"
                >
                  <Star className="w-5 h-5 mr-2" />
                  {profile?.user_role === 'girlfriend' 
                    ? 'Completar Perfil' 
                    : 'Ir a Mi Perfil'}
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
