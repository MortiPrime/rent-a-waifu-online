
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, DollarSign, Shield, Users, Crown, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CompanionProfileForm from '@/components/CompanionProfileForm';
import { supabase } from '@/integrations/supabase/client';

interface PromotionPlan {
  id: string;
  name: string;
  price: number;
  popular: boolean;
  features: string[];
}

const BecomeCompanion = () => {
  const { user, profile, isGirlfriend } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plansVisible, setPlansVisible] = useState(false);
  const [plansTitle, setPlansTitle] = useState('Planes de Promoción');
  const [promotionPlans, setPromotionPlans] = useState<PromotionPlan[]>([]);

  // Cargar configuración de planes de promoción (visible solo si el admin la activa)
  useEffect(() => {
    const loadPlans = async () => {
      const { data } = await supabase
        .from('promotion_plans_settings')
        .select('is_visible, title, plans')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (data?.is_visible) {
        setPlansVisible(true);
        setPlansTitle(data.title || 'Planes de Promoción');
        setPromotionPlans(Array.isArray(data.plans) ? (data.plans as unknown as PromotionPlan[]) : []);
      }
    };
    loadPlans();
  }, []);

  // Verificar si el usuario es companion y mostrar formulario automáticamente
  useEffect(() => {
    if (isGirlfriend) {
      setShowForm(true);
    }
  }, [isGirlfriend]);

  const handleBecomeCompanion = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    
    // Si ya es companion, mostrar formulario
    if (isGirlfriend) {
      setShowForm(true);
      setIsLoading(false);
      return;
    }

    // Si no es companion, redirigir al perfil para convertirse
    setTimeout(() => {
      navigate('/profile');
      setIsLoading(false);
    }, 500);
  };

  // Si ya es companion o debe mostrar el formulario, mostrarlo
  if (isGirlfriend || showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Companion Activa
                </Badge>
              </div>
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
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Información del Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CompanionProfileForm />
              </CardContent>
            </Card>

            {/* Información adicional para companions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">📈 Maximiza tus Ingresos</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>✓ Completa todas las secciones de tu perfil</p>
                  <p>✓ Sube fotos de alta calidad</p>
                  <p>✓ Establece precios competitivos</p>
                  <p>✓ Mantén tu disponibilidad actualizada</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">🛡️ Seguridad y Privacidad</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>✓ Tus datos están protegidos</p>
                  <p>✓ Control total sobre tu información</p>
                  <p>✓ Puedes pausar tu perfil cuando quieras</p>
                  <p>✓ Soporte 24/7 disponible</p>
                </CardContent>
              </Card>
            </div>
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
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Únete a nuestra plataforma exclusiva y comienza a generar ingresos 
              compartiendo tu personalidad única con personas increíbles.
            </p>
            {!user && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-8">
                <p className="text-blue-200">
                  <Shield className="w-5 h-5 inline mr-2" />
                  Necesitas crear una cuenta para continuar
                </p>
              </div>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <CardTitle className="text-white">Ingresos Flexibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Establece tus propios precios y horarios. Gana entre $150-$500 MXN por hora.
                </p>
                <div className="text-2xl font-bold text-pink-400">$150-500/hr</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <Phone className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white">Contacto Directo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Los usuarios suscritos podrán ver tu número de contacto para comunicarse contigo.
                </p>
                <Badge className="bg-purple-500/20 text-purple-300">Premium Feature</Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-white">Búsqueda Local</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Los clientes pueden encontrarte fácilmente por tu ubicación geográfica.
                </p>
                <Badge className="bg-blue-500/20 text-blue-300">Geo-targeting</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans — visible solo si el admin la activa */}
          {plansVisible && promotionPlans.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-playfair font-bold text-white text-center mb-8">
                {plansTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {promotionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={
                      plan.popular
                        ? 'bg-white/10 backdrop-blur-md border-2 border-pink-500 relative overflow-hidden'
                        : 'bg-white/10 backdrop-blur-md border-white/20 hover:border-white/30 transition-all duration-300'
                    }
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 p-2 text-center">
                        <Badge className="bg-white text-pink-600 font-semibold">Más Popular</Badge>
                      </div>
                    )}
                    <CardHeader className={plan.popular ? 'text-center pt-12' : 'text-center'}>
                      {plan.id === 'vip' && <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />}
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-pink-400">
                        ${plan.price}<span className="text-lg text-gray-400">/mes</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="text-gray-300 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                <Shield className="w-6 h-6" />
                Requisitos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Requisitos Básicos:
                  </h4>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      Mayor de 18 años
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      Identificación oficial válida
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      Buena conexión a internet
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      Disponibilidad mínima de 10 horas/semana
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Habilidades Deseadas:
                  </h4>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Excelentes habilidades de comunicación
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Personalidad carismática y empática
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Paciencia y profesionalismo
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Respeto por los límites personales
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-md border-pink-500/30">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  ¿Lista para comenzar tu nueva aventura?
                </h3>
                <p className="text-gray-300 mb-6 text-lg">
                  {isGirlfriend 
                    ? 'Completa tu perfil de companion para comenzar a recibir solicitudes.'
                    : 'Primero necesitas convertir tu cuenta a companion desde tu perfil.'}
                </p>
                <Button 
                  onClick={handleBecomeCompanion}
                  disabled={isLoading}
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Procesando...
                    </div>
                  ) : (
                    <>
                      <Star className="w-5 h-5 mr-2" />
                      {isGirlfriend 
                        ? 'Completar Perfil' 
                        : 'Ir a Mi Perfil'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                {!user && (
                  <div className="mt-4">
                    <Link to="/auth">
                      <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                        Crear Cuenta Gratis
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeCompanion;
