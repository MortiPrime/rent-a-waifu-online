
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import CompanionDashboard from '@/components/CompanionDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Users, 
  Video, 
  MapPin, 
  Calendar,
  Shield,
  Clock,
  Crown,
  Sparkles,
  Phone,
  Camera,
  Gift,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  // Ejecutar todos los hooks PRIMERO, antes de cualquier retorno condicional
  const { user, profile, isGirlfriend } = useAuth();

  // Ahora podemos hacer retornos condicionales después de que todos los hooks se hayan ejecutado
  if (isGirlfriend) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
        <Navbar />
        <div className="pt-16">
          <CompanionDashboard />
        </div>
      </div>
    );
  }

  // Para clientes, mostrar la página principal completa
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Plataforma Premium
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
            Rent a Waifu
            <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Online
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            La plataforma más exclusiva para conectar con companions virtuales auténticas. 
            Experimenta conversaciones reales, citas virtuales y momentos únicos con personalidades increíbles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-4 transition-all duration-300 hover:scale-105">
                <Heart className="w-5 h-5 mr-2" />
                Explorar Waifus
              </Button>
            </Link>
            <Link to="/become-companion">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300">
                <Crown className="w-5 h-5 mr-2" />
                Ser Companion
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-white mb-4">
              Servicios Disponibles
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Descubre todas las formas de conectar con nuestras companions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <CardTitle className="text-white">Chat Básico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Conversaciones por texto en tiempo real</p>
                <div className="text-2xl font-bold text-pink-400">$150/hr</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Video className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white">Video Llamadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Videollamadas en vivo cara a cara</p>
                <div className="text-2xl font-bold text-purple-400">$500/hr</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-white">Citas Virtuales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Experiencias de cita personalizadas</p>
                <div className="text-2xl font-bold text-blue-400">$800/sesión</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <CardTitle className="text-white">Citas Presenciales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Encuentros reales en tu ciudad</p>
                <div className="text-2xl font-bold text-green-400">$1500+</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-playfair font-bold text-white text-center mb-12">
            Características Únicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-pink-500/50 transition-all duration-300">
              <CardHeader>
                <Shield className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <CardTitle className="text-white text-center">Verificación Real</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-4">
                  Todas nuestras companions están verificadas con documentos oficiales
                </p>
                <Badge className="bg-green-500/20 text-green-300">100% Verificado</Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white text-center">Disponibilidad 24/7</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-4">
                  Encuentra companions disponibles en cualquier momento del día
                </p>
                <Badge className="bg-purple-500/20 text-purple-300">Siempre Activo</Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-white text-center">Conexión Instantánea</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-4">
                  Sistema de matching inteligente para conexiones perfectas
                </p>
                <Badge className="bg-blue-500/20 text-blue-300">IA Avanzada</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-white mb-4">
              Funciones Premium
            </h2>
            <p className="text-gray-300 text-lg">
              Desbloquea experiencias exclusivas con nuestra suscripción premium
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-md border border-pink-500/30 rounded-lg p-6">
              <Phone className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Contacto Directo</h3>
              <p className="text-gray-300 text-sm">Accede al número personal de tus companions favoritas</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-lg p-6">
              <Camera className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Fotos Exclusivas</h3>
              <p className="text-gray-300 text-sm">Recibe contenido visual personalizado y exclusivo</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-green-600/20 backdrop-blur-md border border-blue-500/30 rounded-lg p-6">
              <Gift className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Regalos Virtuales</h3>
              <p className="text-gray-300 text-sm">Envía regalos digitales para mostrar tu aprecio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-pink-400 mb-2">500+</h3>
              <p className="text-white/80">Companions Activas</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-purple-400 mb-2">15K+</h3>
              <p className="text-white/80">Usuarios Premium</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-blue-400 mb-2">100K+</h3>
              <p className="text-white/80">Sesiones Completadas</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-green-400 mb-2">98%</h3>
              <p className="text-white/80">Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-playfair font-bold text-white text-center mb-12">
            ¿Cómo Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-4">Explora el Catálogo</h3>
              <p className="text-gray-300">
                Navega por cientos de perfiles verificados y encuentra tu companion ideal
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-4">Conecta y Chatea</h3>
              <p className="text-gray-300">
                Inicia conversaciones y construye una conexión auténtica
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-4">Disfruta la Experiencia</h3>
              <p className="text-gray-300">
                Desde chats hasta citas, vive momentos únicos y memorables
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-md border-pink-500/30">
            <CardContent className="p-8">
              <h2 className="text-4xl font-playfair font-bold text-white mb-6">
                ¿Listo para tu primera conexión?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Únete a la plataforma más exclusiva de companions virtuales y descubre un mundo de posibilidades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link to="/catalog">
                    <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-4">
                      Ver Companions
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-4">
                        Registrarse Gratis
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/catalog">
                      <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
                        Ver Demo
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              {!user && (
                <p className="text-gray-400 text-sm mt-4">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Sin tarjeta de crédito requerida para registrarse
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
