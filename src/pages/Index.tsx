import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import CompanionDashboard from '@/components/CompanionDashboard';
import PageShell from '@/components/layout/PageShell';
import SectionHeading from '@/components/layout/SectionHeading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
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
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  { icon: MessageCircle, title: 'Chat básico', desc: 'Conversaciones por texto en tiempo real', price: '$150/hr' },
  { icon: Video, title: 'Video llamadas', desc: 'Videollamadas en vivo cara a cara', price: '$500/hr' },
  { icon: Calendar, title: 'Citas virtuales', desc: 'Experiencias de cita personalizadas', price: '$800/sesión' },
  { icon: MapPin, title: 'Citas presenciales', desc: 'Encuentros reales en tu ciudad', price: '$1500+' },
];

const features = [
  { icon: Shield, title: 'Verificación real', desc: 'Todas nuestras companions están verificadas con documentos oficiales', badge: '100% verificado' },
  { icon: Clock, title: 'Disponibilidad 24/7', desc: 'Encuentra companions disponibles en cualquier momento del día', badge: 'Siempre activo' },
  { icon: Zap, title: 'Conexión instantánea', desc: 'Sistema de matching inteligente para conexiones perfectas', badge: 'Rápido y simple' },
];

const premium = [
  { icon: Phone, title: 'Contacto directo', desc: 'Accede al contacto de tus companions favoritas' },
  { icon: Camera, title: 'Galerías completas', desc: 'Explora todas las fotos verificadas de cada perfil' },
  { icon: Gift, title: 'Detalles y regalos', desc: 'Envía detalles digitales para mostrar tu aprecio' },
];

const stats = [
  { value: '500+', label: 'Companions activas' },
  { value: '15K+', label: 'Usuarios registrados' },
  { value: '100K+', label: 'Sesiones completadas' },
  { value: '98%', label: 'Satisfacción' },
];

const steps = [
  { n: 1, title: 'Explora el catálogo', desc: 'Navega por perfiles verificados y encuentra tu companion ideal' },
  { n: 2, title: 'Conecta y chatea', desc: 'Inicia conversaciones y construye una conexión auténtica' },
  { n: 3, title: 'Disfruta la experiencia', desc: 'Desde chats hasta citas, vive momentos únicos y memorables' },
];

const Index = () => {
  const { user, isGirlfriend } = useAuth();

  if (isGirlfriend) {
    return (
      <div className="min-h-screen bg-gradient-app">
        <Navbar />
        <div className="pt-16">
          <CompanionDashboard />
        </div>
      </div>
    );
  }

  return (
    <PageShell width="wide" className="pt-24 pb-0 px-0">
      <div className="px-4 space-y-24 pb-16">
        {/* Hero */}
        <section className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 border border-brand/30 bg-brand/15 text-surface-foreground">
            <Sparkles className="w-4 h-4 mr-2" />
            Acceso gratuito por tiempo limitado
          </Badge>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-surface-foreground mb-6">
            Rent a Waifu
            <span className="block brand-gradient-text">Online</span>
          </h1>
          <p className="text-xl text-surface-foreground/70 mb-8 max-w-3xl mx-auto">
            La plataforma más exclusiva para conectar con companions verificadas. Conversaciones reales, citas y
            momentos únicos con personalidades increíbles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" className="brand-button text-lg px-8 py-6 transition-transform hover:scale-105">
                <Heart className="w-5 h-5 mr-2" />
                Explorar companions
              </Button>
            </Link>
            <Link to="/become-companion">
              <Button size="lg" variant="outline" className="surface-card text-lg px-8 py-6 hover:!bg-surface/20">
                <Crown className="w-5 h-5 mr-2" />
                Ser companion
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="surface-card rounded-2xl p-6 text-center">
                <h3 className="text-3xl md:text-4xl font-bold brand-gradient-text mb-1">{s.value}</h3>
                <p className="text-surface-foreground/70 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Servicios */}
        <section className="max-w-6xl mx-auto">
          <SectionHeading
            title="Servicios disponibles"
            subtitle="Descubre todas las formas de conectar con nuestras companions"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, ...s }) => (
              <Card key={s.title} className="surface-card surface-card-hover rounded-2xl text-center">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-brand to-brand-glow flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-7 h-7 text-brand-foreground" />
                  </div>
                  <CardTitle className="text-surface-foreground">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-surface-foreground/70 mb-4 text-sm">{s.desc}</p>
                  <div className="text-2xl font-bold brand-gradient-text">{s.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Características */}
        <section className="max-w-6xl mx-auto">
          <SectionHeading title="Características únicas" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, ...f }) => (
              <Card key={f.title} className="surface-card surface-card-hover rounded-2xl">
                <CardHeader>
                  <Icon className="w-12 h-12 text-brand mx-auto mb-4" />
                  <CardTitle className="text-surface-foreground text-center">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-surface-foreground/70 mb-4">{f.desc}</p>
                  <Badge className="bg-success/15 text-success border border-success/30">{f.badge}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Extras */}
        <section className="max-w-6xl mx-auto">
          <SectionHeading title="Lo que incluye tu cuenta" subtitle="Todo desbloqueado mientras la plataforma sea gratuita" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premium.map(({ icon: Icon, ...p }) => (
              <div key={p.title} className="surface-card surface-card-hover rounded-2xl p-6">
                <Icon className="w-8 h-8 text-brand mb-4" />
                <h3 className="text-surface-foreground font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-surface-foreground/70 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="max-w-6xl mx-auto">
          <SectionHeading title="¿Cómo funciona?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="surface-card rounded-2xl p-8 text-center">
                <div className="bg-gradient-to-r from-brand to-brand-glow w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-brand-foreground font-bold text-xl">{s.n}</span>
                </div>
                <h3 className="text-surface-foreground font-semibold text-xl mb-3">{s.title}</h3>
                <p className="text-surface-foreground/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto">
          <Card className="surface-card rounded-3xl">
            <CardContent className="p-10 text-center">
              <Users className="w-10 h-10 text-brand mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-surface-foreground mb-4">
                ¿Listo para tu primera conexión?
              </h2>
              <p className="text-lg text-surface-foreground/70 mb-8">
                Únete a la plataforma más exclusiva de companions y descubre un mundo de posibilidades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link to="/catalog">
                    <Button size="lg" className="brand-button text-lg px-8 py-6">
                      Ver companions
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button size="lg" className="brand-button text-lg px-8 py-6">
                        Registrarse gratis
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/catalog">
                      <Button size="lg" variant="outline" className="surface-card text-lg px-8 py-6 hover:!bg-surface/20">
                        Ver catálogo
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              {!user && (
                <p className="text-surface-foreground/60 text-sm mt-5">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Sin tarjeta de crédito requerida
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  );
};

export default Index;
