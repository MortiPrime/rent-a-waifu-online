import { Check, Heart, Crown, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/layout/PageShell';
import SectionHeading from '@/components/layout/SectionHeading';

const Subscription = () => {
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      icon: Heart,
      features: [
        'Acceso a todas las companions',
        'Chat ilimitado',
        'Perfil personalizable',
        'Favoritos ilimitados',
        'Soporte por email',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Star,
      popular: true,
      features: [
        'Todo lo del plan Básico',
        'Contenido exclusivo premium',
        'Chat con personalidades avanzadas',
        'Fotos y videos exclusivos',
        'Sin anuncios',
        'Soporte prioritario',
      ],
    },
    {
      id: 'vip',
      name: 'VIP',
      icon: Crown,
      features: [
        'Todo lo del plan Premium',
        'Acceso completo a companions VIP',
        'Contenido ultra exclusivo',
        'Videollamadas virtuales',
        'Contenido personalizado',
        'Soporte VIP 24/7',
        'Eventos exclusivos',
      ],
    },
  ];

  return (
    <PageShell>
      <SectionHeading
        title={<span className="brand-gradient-text">¡Todo es gratis!</span>}
        subtitle="Por tiempo limitado, todas las funciones de la plataforma son completamente gratuitas. Disfruta de todo el contenido sin costo alguno."
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/15 px-6 py-3 text-success">
          <Check className="w-5 h-5" />
          <span className="font-semibold">Acceso completo sin costo</span>
        </div>
      </SectionHeading>

      <div className="grid md:grid-cols-3 gap-8 mb-14">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <Card
              key={plan.id}
              className={`relative surface-card surface-card-hover rounded-2xl ${
                plan.popular ? 'ring-2 ring-brand' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="brand-button px-4 py-1">Más popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand to-brand-glow flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-brand-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-surface-foreground">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-success">GRATIS</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-surface-foreground/80">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Badge className="w-full justify-center py-2 bg-success/15 text-success border border-success/30 text-base">
                  Incluido gratis
                </Badge>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Card className="surface-card rounded-2xl border-gold/30">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-surface-foreground mb-3">¿Te gusta la plataforma?</h2>
          <p className="text-surface-foreground/70 mb-6 max-w-xl mx-auto">
            Toda la plataforma es gratuita. Si quieres apoyarnos para seguir mejorando, puedes hacerlo con una donación
            voluntaria.
          </p>
          <Link to="/donations">
            <Button size="lg" className="brand-button text-lg px-8">
              Apoyar con una donación
            </Button>
          </Link>
        </CardContent>
      </Card>
    </PageShell>
  );
};

export default Subscription;
