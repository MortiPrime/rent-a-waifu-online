
import { Check, Heart, Crown, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Subscription = () => {
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 0,
      icon: Heart,
      color: 'from-gray-400 to-gray-600',
      features: [
        'Acceso a todas las companions',
        'Chat ilimitado',
        'Perfil personalizable',
        'Favorites ilimitados',
        'Soporte por email'
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 0,
      icon: Star,
      color: 'from-pink-400 to-purple-600',
      popular: true,
      features: [
        'Todo lo del plan Básico',
        'Contenido exclusivo premium',
        'Chat con personalidades avanzadas',
        'Fotos y videos exclusivos',
        'Sin anuncios',
        'Soporte prioritario'
      ],
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 0,
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      features: [
        'Todo lo del plan Premium',
        'Acceso completo a companions VIP',
        'Contenido ultra exclusivo',
        'Videollamadas virtuales',
        'Contenido personalizado',
        'Soporte VIP 24/7',
        'Eventos exclusivos'
      ],
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                ¡Todo es Gratis! 🎉
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Por tiempo limitado, todas las funciones de la plataforma son completamente gratuitas. 
              ¡Disfruta de todo el contenido sin costo alguno!
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-300 px-6 py-3 rounded-full border border-green-500/30">
              <Check className="w-5 h-5" />
              <span className="font-semibold">Acceso completo sin costo</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card 
                  key={plan.id} 
                  className={`relative bg-white/10 backdrop-blur-md border-white/20 transition-all duration-300 hover:scale-105 ${
                    plan.popular ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1">
                        Más Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-green-400">GRATIS</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Badge className="w-full justify-center py-2 bg-green-500/20 text-green-300 border-green-500/30 text-base">
                      ✅ Incluido gratis
                    </Badge>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Donation CTA */}
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 mb-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">¿Te gusta la plataforma?</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Toda la plataforma es gratuita. Si quieres apoyarnos para seguir mejorando, 
                puedes hacerlo con una donación voluntaria.
              </p>
              <Link to="/donations">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-lg px-8">
                  💛 Apoyar con una donación
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
