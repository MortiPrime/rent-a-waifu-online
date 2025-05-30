
import { useState } from 'react';
import { Check, Heart, Crown, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import { useMercadoPago } from '@/hooks/useMercadoPago';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number>(1);
  const { loading, redirectToCheckout } = useMercadoPago();

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 199,
      period: '/mes',
      icon: Heart,
      color: 'from-gray-400 to-gray-600',
      features: [
        'Acceso a companions básicas',
        'Chat ilimitado',
        'Perfil personalizable',
        '5 favorites máximo',
        'Soporte por email'
      ],
      limitations: [
        'Sin acceso a contenido premium',
        'Sin companions VIP',
        'Funciones limitadas'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 399,
      period: '/mes',
      icon: Star,
      color: 'from-primary-400 to-primary-600',
      popular: true,
      features: [
        'Todo lo del plan Básico',
        'Acceso a companions premium',
        'Contenido exclusivo premium',
        'Favorites ilimitados',
        'Chat con personalidades avanzadas',
        'Fotos y videos exclusivos',
        'Sin anuncios',
        'Soporte prioritario'
      ],
      limitations: [
        'Sin companions VIP exclusivas'
      ]
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 799,
      period: '/mes',
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      features: [
        'Todo lo del plan Premium',
        'Acceso completo a companions VIP',
        'Contenido ultra exclusivo',
        'Personalidades más avanzadas',
        'Videollamadas virtuales',
        'Contenido personalizado',
        'Beta de nuevas funciones',
        'Soporte VIP 24/7',
        'Eventos exclusivos',
        'Merchandise gratuito'
      ],
      limitations: []
    }
  ];

  const monthOptions = [
    { value: 1, label: '1 mes', discount: 0 },
    { value: 3, label: '3 meses', discount: 10 },
    { value: 6, label: '6 meses', discount: 15 },
    { value: 12, label: '12 meses', discount: 20 },
  ];

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    
    // Redirigir automáticamente a MercadoPago
    await redirectToCheckout({
      plan: planId as 'basic' | 'premium' | 'vip',
      months: selectedMonths
    });
  };

  const calculatePrice = (basePrice: number, months: number) => {
    const monthOption = monthOptions.find(option => option.value === months);
    const discount = monthOption?.discount || 0;
    const totalBeforeDiscount = basePrice * months;
    const discountAmount = totalBeforeDiscount * (discount / 100);
    return totalBeforeDiscount - discountAmount;
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Planes de Suscripción
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Elige el plan perfecto para tu experiencia. Todos los planes incluyen acceso completo a la plataforma.
            </p>
            
            {/* Duration Selector */}
            <div className="mb-8">
              <label className="block text-white mb-4 text-lg">Duración de la suscripción:</label>
              <Select value={selectedMonths.toString()} onValueChange={(value) => setSelectedMonths(parseInt(value))}>
                <SelectTrigger className="w-64 mx-auto bg-white/10 text-white border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label} {option.discount > 0 && `(${option.discount}% descuento)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Money-back guarantee */}
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <Check className="w-5 h-5" />
              <span className="font-medium">Pagos seguros con MercadoPago</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              const isSelected = selectedPlan === plan.id;
              const finalPrice = calculatePrice(plan.price, selectedMonths);
              const originalPrice = plan.price * selectedMonths;
              const hasDiscount = finalPrice < originalPrice;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative transition-all duration-300 hover:scale-105 cursor-pointer ${
                    plan.popular 
                      ? 'ring-2 ring-primary shadow-premium' 
                      : 'hover:shadow-card-hover'
                  } ${isSelected ? 'ring-2 ring-primary scale-105' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-primary text-white px-4 py-1 text-sm font-semibold">
                        Más Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="space-y-1">
                      {hasDiscount && (
                        <div className="text-sm text-gray-500 line-through">
                          ${originalPrice.toLocaleString()} MXN
                        </div>
                      )}
                      <div className="text-4xl font-bold text-gray-900">
                        ${finalPrice.toLocaleString()}
                        <span className="text-lg font-normal text-gray-600"> MXN</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedMonths === 1 ? 'por mes' : `por ${selectedMonths} meses`}
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-gray-200">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'anime-button' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan.id);
                      }}
                      disabled={loading}
                    >
                      {loading && isSelected ? 'Procesando...' : 'Seleccionar Plan'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="glass-card p-8 rounded-2xl mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Comparación Detallada
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2">Característica</th>
                    <th className="text-center py-4 px-2">Básico</th>
                    <th className="text-center py-4 px-2">Premium</th>
                    <th className="text-center py-4 px-2">VIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-2 font-medium">Companions disponibles</td>
                    <td className="text-center py-4 px-2">20+</td>
                    <td className="text-center py-4 px-2">40+</td>
                    <td className="text-center py-4 px-2">50+</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2 font-medium">Chat diario</td>
                    <td className="text-center py-4 px-2">Ilimitado</td>
                    <td className="text-center py-4 px-2">Ilimitado</td>
                    <td className="text-center py-4 px-2">Ilimitado</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2 font-medium">Contenido premium</td>
                    <td className="text-center py-4 px-2">❌</td>
                    <td className="text-center py-4 px-2">✅</td>
                    <td className="text-center py-4 px-2">✅</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2 font-medium">Videollamadas virtuales</td>
                    <td className="text-center py-4 px-2">❌</td>
                    <td className="text-center py-4 px-2">❌</td>
                    <td className="text-center py-4 px-2">✅</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2 font-medium">Soporte</td>
                    <td className="text-center py-4 px-2">Email</td>
                    <td className="text-center py-4 px-2">Prioritario</td>
                    <td className="text-center py-4 px-2">VIP 24/7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">
              Preguntas Frecuentes
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="glass-card p-6 text-left rounded-xl">
                <h3 className="font-semibold text-lg mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
                <p className="text-gray-600">
                  Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu perfil.
                </p>
              </div>
              
              <div className="glass-card p-6 text-left rounded-xl">
                <h3 className="font-semibold text-lg mb-2">¿Qué métodos de pago aceptan?</h3>
                <p className="text-gray-600">
                  Aceptamos tarjetas de crédito, débito y otros métodos a través de Mercado Pago.
                </p>
              </div>
              
              <div className="glass-card p-6 text-left rounded-xl">
                <h3 className="font-semibold text-lg mb-2">¿Hay permanencia mínima?</h3>
                <p className="text-gray-600">
                  No, todos nuestros planes son mensuales sin permanencia mínima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
