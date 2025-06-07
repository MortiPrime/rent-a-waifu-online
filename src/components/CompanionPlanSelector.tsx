
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Users, Check } from 'lucide-react';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { useToast } from '@/hooks/use-toast';

const CompanionPlanSelector = () => {
  const { profile, updateProfile, loading } = useCompanionProfile();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(profile?.promotion_plan || 'basic');

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-500/30',
      features: [
        'Perfil visible en búsquedas',
        'Hasta 5 fotos',
        'Chat básico con clientes',
        'Soporte estándar',
        'Estadísticas básicas'
      ],
      description: 'Perfecto para comenzar tu carrera como companion'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Star,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/30',
      popular: true,
      features: [
        'Todo del plan Básico',
        'Hasta 15 fotos',
        'Prioridad en búsquedas',
        'Video llamadas disponibles',
        'Soporte prioritario',
        'Estadísticas avanzadas',
        'Badge Premium en tu perfil'
      ],
      description: 'Ideal para companions que buscan mayor visibilidad'
    },
    {
      id: 'vip',
      name: 'VIP',
      icon: Crown,
      color: 'from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-500/30',
      features: [
        'Todo del plan Premium',
        'Fotos ilimitadas',
        'Destacado especial en búsquedas',
        'Manager personal asignado',
        'Promoción en redes sociales',
        'Comisiones reducidas',
        'Badge VIP dorado',
        'Acceso a eventos exclusivos'
      ],
      description: 'El plan más exclusivo para companions profesionales'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    try {
      await updateProfile({ promotion_plan: planId as 'basic' | 'premium' | 'vip' });
      setSelectedPlan(planId);
      
      toast({
        title: "Plan actualizado",
        description: `Has seleccionado el plan ${plans.find(p => p.id === planId)?.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el plan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-center">
            <Crown className="w-6 h-6 text-yellow-400 inline mr-2" />
            Elige tu Plan Promocional
          </CardTitle>
          <p className="text-white/80 text-center">
            Como companion, puedes elegir el plan que mejor se adapte a tus objetivos. 
            ¡Todos los planes son gratuitos para ti!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          const isCurrentPlan = profile?.promotion_plan === plan.id;
          
          return (
            <Card 
              key={plan.id} 
              className={`bg-white/10 backdrop-blur-md border-2 transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? plan.borderColor 
                  : isCurrentPlan 
                    ? 'border-green-500/50' 
                    : 'border-white/20'
              }`}
            >
              <CardHeader className="text-center relative">
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    Más Popular
                  </Badge>
                )}
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                    Plan Actual
                  </Badge>
                )}
                
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-white mb-2">
                  GRATIS
                </div>
                <p className="text-white/70 text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/90">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading || isCurrentPlan}
                  className={`w-full ${
                    isCurrentPlan
                      ? 'bg-green-500 hover:bg-green-600'
                      : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                  } text-white font-semibold py-3 transition-all duration-300`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : isCurrentPlan ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Plan Actual
                    </>
                  ) : (
                    `Seleccionar ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-6">
        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-400" />
          ¡Todos los planes son gratuitos para companions!
        </h4>
        <p className="text-white/80 text-sm">
          Como companion, no pagas por tu plan promocional. Puedes cambiar de plan cuando quieras 
          según tus necesidades y objetivos profesionales. Los clientes pagan las suscripciones 
          para acceder a tus servicios.
        </p>
      </div>
    </div>
  );
};

export default CompanionPlanSelector;
