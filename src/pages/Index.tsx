
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import CompanionDashboard from '@/components/CompanionDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, profile, isGirlfriend } = useAuth();

  // Si es una companion/girlfriend, mostrar su dashboard
  if (isGirlfriend) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Navbar />
        <div className="pt-16">
          <CompanionDashboard />
        </div>
      </div>
    );
  }

  // Para clientes, mostrar la página principal normal
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
            Encuentra tu
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Companion Perfecta
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Conecta con personas reales y auténticas en un ambiente seguro y respetuoso. 
            Descubre conversaciones significativas y experiencias únicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" className="anime-button text-lg px-8 py-4">
                <Heart className="w-5 h-5 mr-2" />
                Explorar Companions
              </Button>
            </Link>
            <Link to="/become-companion">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Star className="w-5 h-5 mr-2" />
                Ser Companion
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-playfair font-bold text-white text-center mb-12">
            ¿Por qué elegir AnimeDating?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card text-center">
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Conexiones Auténticas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Conoce a personas reales con personalidades únicas y genuinas.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Conversaciones Seguras</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Plataforma segura con verificación de identidad y moderation 24/7.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Comunidad Respetuosa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Ambiente libre de toxicidad donde todos son tratados con respeto.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
              <p className="text-gray-300">Companions Verificadas</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">10K+</h3>
              <p className="text-gray-300">Usuarios Activos</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">50K+</h3>
              <p className="text-gray-300">Conversaciones Diarias</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">99%</h3>
              <p className="text-gray-300">Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-playfair font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de personas que ya están disfrutando de conexiones auténticas.
          </p>
          <Link to="/catalog">
            <Button size="lg" className="anime-button text-lg px-8 py-4">
              Empezar Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
