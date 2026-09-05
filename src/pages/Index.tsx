import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import CompanionDashboard from '@/components/CompanionDashboard';
import PageShell from '@/components/layout/PageShell';
import SectionHeading from '@/components/layout/SectionHeading';
import { BentoGrid, BentoTile } from '@/components/layout/BentoGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
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
      <div className="space-y-20 px-4 pb-16">
        {/* Hero bento */}
        <section>
          <BentoGrid className="lg:grid-rows-2">
            <BentoTile size="lg" tone="accent" className="flex flex-col justify-between gap-8 p-8 md:p-12 lg:row-span-2">
              <div>
                <span className="eyebrow mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  Acceso gratuito por tiempo limitado
                </span>
                <h1 className="editorial-title mt-6 text-5xl md:text-7xl">
                  Encuentra tu
                  <span className="block editorial-accent">companion perfecta</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg text-surface-foreground/70">
                  La plataforma más exclusiva para conectar con companions verificadas en México. Conversaciones
                  reales, citas y momentos únicos.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/catalog">
                  <Button size="lg" className="brand-button w-full px-8 py-6 text-base sm:w-auto">
                    <Heart className="mr-2 h-5 w-5" />
                    Explorar companions
                  </Button>
                </Link>
                <Link to="/become-companion">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-surface-border/30 bg-surface/10 px-8 py-6 text-base text-surface-foreground hover:bg-surface/20 sm:w-auto"
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    Ser companion
                  </Button>
                </Link>
              </div>
            </BentoTile>

            <BentoTile size="sm" className="flex flex-col justify-center">
              <Shield className="mb-4 h-8 w-8 text-brand" />
              <h3 className="editorial-title text-2xl">Perfiles verificados</h3>
              <p className="mt-2 text-sm text-surface-foreground/70">
                Cada companion se valida con documentos oficiales antes de aparecer.
              </p>
              <Badge className="mt-4 w-fit border border-success/30 bg-success/15 text-success">100% verificado</Badge>
            </BentoTile>

            <BentoTile size="sm" tone="gold" className="flex flex-col justify-center">
              <Clock className="mb-4 h-8 w-8 text-gold" />
              <h3 className="editorial-title text-2xl">Disponible 24/7</h3>
              <p className="mt-2 text-sm text-surface-foreground/70">
                Encuentra companions activas a cualquier hora del día.
              </p>
            </BentoTile>

            <BentoTile size="sm" className="flex flex-col justify-center">
              <Zap className="mb-4 h-8 w-8 text-brand" />
              <h3 className="editorial-title text-2xl">Conexión instantánea</h3>
              <p className="mt-2 text-sm text-surface-foreground/70">
                Filtra por ciudad, edad y plan y contacta en segundos.
              </p>
            </BentoTile>

            <BentoTile size="sm" className="grid grid-cols-2 gap-4">
              {stats.slice(0, 4).map((s) => (
                <div key={s.label}>
                  <p className="editorial-title text-3xl brand-gradient-text">{s.value}</p>
                  <p className="text-xs text-surface-foreground/60">{s.label}</p>
                </div>
              ))}
            </BentoTile>
          </BentoGrid>
        </section>

        {/* Servicios */}
        <section>
          <SectionHeading
            title="Servicios"
            highlight="disponibles"
            subtitle="Descubre todas las formas de conectar con nuestras companions."
          />
          <BentoGrid>
            {services.map(({ icon: Icon, ...s }, i) => (
              <BentoTile key={s.title} size={i === 0 ? 'md' : i === 1 ? 'md' : 'md'} tone={i === 0 ? 'accent' : 'default'}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-glow">
                    <Icon className="h-6 w-6 text-brand-foreground" />
                  </div>
                  <div>
                    <h3 className="editorial-title text-2xl">{s.title}</h3>
                    <p className="mt-1 text-sm text-surface-foreground/70">{s.desc}</p>
                    <p className="mt-3 text-xl font-semibold text-gold">{s.price}</p>
                  </div>
                </div>
              </BentoTile>
            ))}
          </BentoGrid>
        </section>

        {/* Incluye tu cuenta */}
        <section>
          <SectionHeading
            title="Lo que incluye"
            highlight="tu cuenta"
            subtitle="Todo desbloqueado mientras la plataforma sea gratuita."
          />
          <BentoGrid>
            {premium.map(({ icon: Icon, ...p }) => (
              <BentoTile key={p.title} size="sm">
                <Icon className="mb-4 h-7 w-7 text-brand" />
                <h3 className="editorial-title text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm text-surface-foreground/70">{p.desc}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </section>

        {/* Cómo funciona */}
        <section>
          <SectionHeading title="¿Cómo" highlight="funciona?" />
          <BentoGrid>
            {steps.map((s) => (
              <BentoTile key={s.n} size="sm">
                <span className="editorial-title text-5xl text-brand/70">0{s.n}</span>
                <h3 className="editorial-title mt-3 text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-surface-foreground/70">{s.desc}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </section>

        {/* CTA */}
        <section>
          <BentoGrid>
            <BentoTile size="full" tone="accent" className="p-10 text-center md:p-14">
              <h2 className="editorial-title text-4xl md:text-5xl">
                ¿Listo para tu <span className="editorial-accent">primera conexión</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-surface-foreground/70">
                Únete a la plataforma más exclusiva de companions y descubre un mundo de posibilidades.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                {user ? (
                  <Link to="/catalog">
                    <Button size="lg" className="brand-button px-8 py-6 text-base">
                      Ver companions
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button size="lg" className="brand-button px-8 py-6 text-base">
                        Registrarse gratis
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/catalog">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-surface-border/30 bg-surface/10 px-8 py-6 text-base text-surface-foreground hover:bg-surface/20"
                      >
                        Ver catálogo
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              {!user && (
                <p className="mt-5 text-sm text-surface-foreground/60">
                  <CheckCircle className="mr-1 inline h-4 w-4" />
                  Sin tarjeta de crédito requerida
                </p>
              )}
            </BentoTile>
          </BentoGrid>
        </section>
      </div>
    </PageShell>
  );
};

export default Index;
