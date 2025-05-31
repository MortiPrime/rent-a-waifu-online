
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { CompanionProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Crown, Star, DollarSign } from 'lucide-react';
import { Badge } from "@/components/ui/badge"

const CompanionProfileForm = () => {
  const { user } = useAuth();
  const { profile, createOrUpdateProfile, loading, loadCompanionProfile } = useCompanionProfile();
  const { toast } = useToast();

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

  useEffect(() => {
    if (profile) {
      setFormData({
        stage_name: profile.stage_name,
        real_name: profile.real_name,
        age: profile.age,
        description: profile.description,
        state: profile.state || '',
        city: profile.city || '',
        municipality: profile.municipality || '',
        contact_number: profile.contact_number || '',
        pricing: profile.pricing,
        availability: profile.availability,
        promotion_plan: profile.promotion_plan,
        is_active: profile.is_active ?? false,
      });
    } else {
      loadCompanionProfile();
    }
  }, [profile]);

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

    await createOrUpdateProfile(formData);
  };

  const promotionPlans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 99,
      features: ['Perfil visible', 'Hasta 5 fotos', 'Chat básico'],
      icon: <User className="w-5 h-5" />
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 199,
      features: ['Todo del básico', 'Hasta 15 fotos', 'Prioridad en búsquedas', 'Video llamadas'],
      icon: <Star className="w-5 h-5" />,
      popular: true
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 399,
      features: ['Todo del premium', 'Fotos ilimitadas', 'Destacado especial', 'Manager personal'],
      icon: <Crown className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-2xl">
            <User className="w-6 h-6" />
            Perfil de Companion
          </CardTitle>
          <CardDescription className="text-white/80">
            Completa tu información para crear tu perfil público
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Básica *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stage_name" className="text-white font-medium">Nombre Artístico *</Label>
                  <Input
                    id="stage_name"
                    value={formData.stage_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, stage_name: e.target.value }))}
                    placeholder="ej. LunaDelMar"
                    required
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="real_name" className="text-white font-medium">Nombre Real *</Label>
                  <Input
                    id="real_name"
                    value={formData.real_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, real_name: e.target.value }))}
                    placeholder="ej. María López"
                    required
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-white font-medium">Edad *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    placeholder="ej. 25"
                    required
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_number" className="text-white font-medium">Número de Contacto *</Label>
                  <Input
                    id="contact_number"
                    value={formData.contact_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                    placeholder="ej. +52 55 1234 5678"
                    required
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Descripción *</h3>
              <Label htmlFor="description" className="text-white/80">
                Cuéntales a tus clientes sobre ti
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="ej. Soy una persona apasionada por..."
                rows={4}
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
              />
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Ubicación *</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="state" className="text-white font-medium">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="ej. Ciudad de México"
                    required
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-white font-medium">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="ej. CDMX"
                    required
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="municipality" className="text-white font-medium">Municipio/Delegación</Label>
                  <Input
                    id="municipality"
                    value={formData.municipality}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                    placeholder="ej. Coyoacán"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
              </div>
              <p className="text-sm text-white/60">
                Esta información ayudará a los clientes a encontrarte en tu área. 
                Solo usuarios con suscripción podrán ver tu número de contacto.
              </p>
            </div>

            {/* Plan de Promoción Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Plan de Promoción *
              </h3>
              <p className="text-white/80">Selecciona cómo quieres promocionar tu perfil</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {promotionPlans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      formData.promotion_plan === plan.id 
                        ? 'ring-2 ring-pink-500 bg-white/20' 
                        : 'bg-white/10 hover:bg-white/15'
                    } ${plan.popular ? 'border-2 border-pink-500' : 'border-white/20'}`}
                    onClick={() => setFormData(prev => ({ ...prev, promotion_plan: plan.id as 'basic' | 'premium' | 'vip' }))}
                  >
                    <CardHeader className="text-center pb-2">
                      {plan.popular && (
                        <Badge className="bg-pink-500 text-white mb-2 mx-auto">
                          Más Popular
                        </Badge>
                      )}
                      <div className="flex items-center justify-center gap-2 text-white">
                        {plan.icon}
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                      </div>
                      <div className="text-2xl font-bold text-pink-400">
                        ${plan.price}/mes
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="text-white/80 text-sm">
                          ✓ {feature}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Precios (MXN)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="basic_chat" className="text-white font-medium">Chat Básico</Label>
                  <Input
                    id="basic_chat"
                    type="number"
                    value={formData.pricing.basic_chat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, basic_chat: parseInt(e.target.value) }
                    }))}
                    placeholder="ej. 150"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="premium_chat" className="text-white font-medium">Chat Premium</Label>
                  <Input
                    id="premium_chat"
                    type="number"
                    value={formData.pricing.premium_chat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, premium_chat: parseInt(e.target.value) }
                    }))}
                    placeholder="ej. 300"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="video_call" className="text-white font-medium">Video Llamada</Label>
                  <Input
                    id="video_call"
                    type="number"
                    value={formData.pricing.video_call}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, video_call: parseInt(e.target.value) }
                    }))}
                    placeholder="ej. 500"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Disponibilidad</h3>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.availability.days.includes(day)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => {
                          let newDays = [...prev.availability.days];
                          if (checked) {
                            newDays.push(day);
                          } else {
                            newDays = newDays.filter(d => d !== day);
                          }
                          return { ...prev, availability: { ...prev.availability, days: newDays } };
                        });
                      }}
                      className="border-white/30"
                    />
                    <Label htmlFor={day} className="text-white text-sm">{day.slice(0, 3)}</Label>
                  </div>
                ))}
              </div>
              <div>
                <Label htmlFor="hours" className="text-white font-medium">Horario</Label>
                <Select
                  value={formData.availability.hours}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, hours: value }
                  }))}
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Flexible" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="flexible" className="text-white">Flexible</SelectItem>
                    <SelectItem value="morning" className="text-white">Mañana (6AM-12PM)</SelectItem>
                    <SelectItem value="afternoon" className="text-white">Tarde (12PM-6PM)</SelectItem>
                    <SelectItem value="evening" className="text-white">Noche (6PM-12AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Status Section */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))}
                className="border-white/30"
              />
              <Label htmlFor="is_active" className="text-white">Activar Perfil (tu perfil será visible tras aprobación)</Label>
            </div>

            {/* Submit Section */}
            <Button 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 text-lg transition-all duration-300"
            >
              {loading ? 'Guardando...' : 'Guardar Perfil'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanionProfileForm;
