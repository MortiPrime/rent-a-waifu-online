import { Check, Heart, Crown, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/layout/PageShell';
import SectionHeading from '@/components/layout/SectionHeading';
import { BentoGrid, BentoTile } from '@/components/layout/BentoGrid';

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

const Subscription = () => (
  <PageShell>
    <SectionHeading
      title="Todo es"
      highlight="gratis"
      align="left"
      subtitle="Por tiempo limitado, todas las funciones de la plataforma son completamente gratuitas. Disfruta de todo el contenido sin costo alguno."
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/15 px-6 py-3 text-success">
        <Check className="h-5 w-5" />
        <span className="font-semibold">Acceso completo sin costo</span>
      </div>
    </SectionHeading>

    <BentoGrid>
      {plans.map(({ icon: Icon, ...plan }) => (
        <BentoTile
          key={plan.id}
          size="sm"
          tone={plan.popular ? 'accent' : 'default'}
          className="flex flex-col gap-4 p-8"
        >
          {plan.popular && (
            <Badge className="absolute right-5 top-5 brand-button px-3 py-1 text-xs">Más popular</Badge>
          )}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-glow">
            <Icon className="h-7 w-7 text-brand-foreground" />
          </div>
          <div>
            <h2 className="editorial-title text-3xl">{plan.name}</h2>
            <p className="text-2xl font-semibold text-success">Gratis</p>
          </div>
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-surface-foreground/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {feature}
              </li>
            ))}
          </ul>
          <Badge className="mt-auto w-full justify-center border border-success/30 bg-success/15 py-2 text-success">
            Incluido gratis
          </Badge>
        </BentoTile>
      ))}

      <BentoTile size="full" tone="gold" className="p-10 text-center">
        <h2 className="editorial-title text-3xl md:text-4xl">¿Te gusta la plataforma?</h2>
        <p className="mx-auto mt-3 max-w-xl text-surface-foreground/70">
          Toda la plataforma es gratuita. Si quieres apoyarnos para seguir mejorando, puedes hacerlo con una donación
          voluntaria.
        </p>
        <Link to="/donations">
          <Button size="lg" className="brand-button mt-6 px-8 text-base">
            Apoyar con una donación
          </Button>
        </Link>
      </BentoTile>
    </BentoGrid>
  </PageShell>
);

export default Subscription;
