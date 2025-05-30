
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Star, DollarSign, Shield, Users, Crown, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { useToast } from '@/hooks/use-toast';

const BecomeCompanion = () => {
  const { user, profile, updateProfile } = useAuth();
  const { createOrUpdateProfile, loading } = useCompanionProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    stage_name: '',
    real_name: '',
    age: 18,
    description: '',
    state: '',
    city: '',
    municipality: '',
    contact_number: '',
    pricing: {
      basic_chat: 150,
      premium_chat: 300,
      video_call: 500
    },
    availability: {
      days: [] as string[],
      hours: 'flexible'
    },
    promotion_plan: 'basic' as 'basic' | 'premium' | 'vip',
    is_active: false
  });

  // Si ya es companion, redirigir al dashboard
  if (profile?.user_role === 'girlfriend') {
    navigate('/');
    return null;
  }

  const handleBecomeCompanion = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.stage_name || !formData.real_name || !formData.description) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!formData.state || !formData.city || !formData.contact_number) {
      toast({
        title: "Error",
        description: "Por favor proporciona tu ubicación y número de contacto",
        variant: "destructive",
      });
      return;
    }

    try {
      // Primero cambiar el rol del usuario
      await updateProfile({ user_role: 'girlfriend' });
      
      // Luego crear el perfil de companion
      await createOrUpdateProfile(formData);
      
      toast({
        title: "¡Éxito!",
        description: "Tu perfil de companion ha sido creado. Está pendiente de aprobación.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error creating companion profile:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Crear Perfil de Companion
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información Básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Información Básica *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stage_name" className="text-white">Nombre Artístico *</Label>
                        <Input
                          id="stage_name"
                          value={formData.stage_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, stage_name: e.target.value }))}
                          placeholder="ej. LunaDelMar"
                          required
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="real_name" className="text-white">Nombre Real *</Label>
                        <Input
                          id="real_name"
                          value={formData.real_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, real_name: e.target.value }))}
                          placeholder="ej. María López"
                          required
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="age" className="text-white">Edad *</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                          placeholder="ej. 25"
                          required
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_number" className="text-white">Número de Contacto *</Label>
                        <Input
                          id="contact_number"
                          value={formData.contact_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                          placeholder="ej. +52 55 1234 5678"
                          required
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Ubicación *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="state" className="text-white">Estado *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="ej. Ciudad de México"
                          required
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-white">Ciudad *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="ej. CDMX"
                          required
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="municipality" className="text-white">Municipio/Delegación</Label>
                        <Input
                          id="municipality"
                          value={formData.municipality}
                          onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                          placeholder="ej. Coyoacán"
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Descripción *</h3>
                    <Label htmlFor="description" className="text-white">
                      Cuéntales a tus clientes sobre ti
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="ej. Soy una persona apasionada por..."
                      rows={4}
                      required
                      className="bg-white/10 text-white border-white/20"
                    />
                  </div>

                  {/* Precios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Precios (MXN)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="basic_chat" className="text-white">Chat Básico</Label>
                        <Input
                          id="basic_chat"
                          type="number"
                          value={formData.pricing.basic_chat}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, basic_chat: parseInt(e.target.value) }
                          }))}
                          placeholder="ej. 150"
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="premium_chat" className="text-white">Chat Premium</Label>
                        <Input
                          id="premium_chat"
                          type="number"
                          value={formData.pricing.premium_chat}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, premium_chat: parseInt(e.target.value) }
                          }))}
                          placeholder="ej. 300"
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="video_call" className="text-white">Video Llamada</Label>
                        <Input
                          id="video_call"
                          type="number"
                          value={formData.pricing.video_call}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, video_call: parseInt(e.target.value) }
                          }))}
                          placeholder="ej. 500"
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="anime-button flex-1"
                    >
                      {loading ? 'Creando perfil...' : 'Crear Perfil'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Conviértete en
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Companion Profesional
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Únete a nuestra plataforma exclusiva y comienza a generar ingresos 
              compartiendo tu personalidad única con personas increíbles.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="glass-card text-center">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Ingresos Flexibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Establece tus propios precios y horarios. Gana entre $150-$500 MXN por hora.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardHeader>
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Contacto Directo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Los usuarios suscritos podrán ver tu número de contacto para comunicarse contigo.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-white">Búsqueda Local</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Los clientes pueden encontrarte fácilmente por tu ubicación geográfica.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans */}
          <div className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-white text-center mb-8">
              Planes de Promoción
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-white">Básico</CardTitle>
                  <div className="text-2xl font-bold text-primary">$99/mes</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">✓ Perfil visible en búsquedas</div>
                  <div className="text-gray-300">✓ Hasta 5 fotos</div>
                  <div className="text-gray-300">✓ Chat básico</div>
                  <div className="text-gray-300">✓ Soporte estándar</div>
                </CardContent>
              </Card>

              <Card className="glass-card border-2 border-primary">
                <CardHeader className="text-center">
                  <Badge className="bg-primary text-white mb-2">Más Popular</Badge>
                  <CardTitle className="text-white">Premium</CardTitle>
                  <div className="text-2xl font-bold text-primary">$199/mes</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">✓ Todo del plan Básico</div>
                  <div className="text-gray-300">✓ Hasta 15 fotos</div>
                  <div className="text-gray-300">✓ Prioridad en búsquedas</div>
                  <div className="text-gray-300">✓ Video llamadas</div>
                  <div className="text-gray-300">✓ Soporte prioritario</div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="text-center">
                  <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <CardTitle className="text-white">VIP</CardTitle>
                  <div className="text-2xl font-bold text-primary">$399/mes</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">✓ Todo del plan Premium</div>
                  <div className="text-gray-300">✓ Fotos ilimitadas</div>
                  <div className="text-gray-300">✓ Destacado especial</div>
                  <div className="text-gray-300">✓ Manager personal</div>
                  <div className="text-gray-300">✓ Comisiones reducidas</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Requirements */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-white text-center">Requisitos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Requisitos Básicos:</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Mayor de 18 años</li>
                    <li>• Identificación oficial válida</li>
                    <li>• Buena conexión a internet</li>
                    <li>• Disponibilidad mínima de 10 horas/semana</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Habilidades Deseadas:</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Excelentes habilidades de comunicación</li>
                    <li>• Personalidad carismática y empática</li>
                    <li>• Paciencia y profesionalismo</li>
                    <li>• Respeto por los límites personales</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¿Lista para comenzar tu nueva aventura?
                </h3>
                <p className="text-gray-300 mb-6">
                  Únete a nuestra comunidad de companions exitosas y comienza a generar ingresos hoy mismo.
                </p>
                <Button 
                  onClick={handleBecomeCompanion}
                  size="lg" 
                  className="anime-button text-lg px-8 py-4"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Convertirme en Companion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeCompanion;
