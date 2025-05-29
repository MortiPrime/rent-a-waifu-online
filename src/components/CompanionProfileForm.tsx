
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { User, DollarSign, Clock, Star } from 'lucide-react';

const CompanionProfileForm = () => {
  const { profile, createOrUpdateProfile, loading } = useCompanionProfile();
  
  const [formData, setFormData] = useState({
    stage_name: '',
    real_name: '',
    age: 18,
    description: '',
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

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    if (profile) {
      setFormData({
        stage_name: profile.stage_name || '',
        real_name: profile.real_name || '',
        age: profile.age || 18,
        description: profile.description || '',
        pricing: profile.pricing || {
          basic_chat: 150,
          premium_chat: 300,
          video_call: 500
        },
        availability: profile.availability || {
          days: [],
          hours: 'flexible'
        },
        promotion_plan: profile.promotion_plan || 'basic',
        is_active: profile.is_active || false
      });
    }
  }, [profile]);

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrUpdateProfile(formData);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stage_name" className="text-white">Nombre Artístico *</Label>
                  <Input
                    id="stage_name"
                    value={formData.stage_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, stage_name: e.target.value }))}
                    placeholder="Ej: Sakura-chan"
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
                    placeholder="Tu nombre completo"
                    required
                    className="bg-white/10 text-white border-white/20"
                  />
                </div>

                <div>
                  <Label htmlFor="age" className="text-white">Edad *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="50"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    required
                    className="bg-white/10 text-white border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Descripción Personal *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Cuéntanos sobre tu personalidad, hobbies e intereses..."
                  rows={8}
                  required
                  className="bg-white/10 text-white border-white/20"
                />
              </div>
            </div>

            <Card className="bg-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Precios por Servicio (MXN)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Chat Básico (por hora)</Label>
                    <Input
                      type="number"
                      min="50"
                      value={formData.pricing.basic_chat}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, basic_chat: parseInt(e.target.value) }
                      }))}
                      className="bg-white/10 text-white border-white/20"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Chat Premium (por hora)</Label>
                    <Input
                      type="number"
                      min="100"
                      value={formData.pricing.premium_chat}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, premium_chat: parseInt(e.target.value) }
                      }))}
                      className="bg-white/10 text-white border-white/20"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Video Llamada (por hora)</Label>
                    <Input
                      type="number"
                      min="200"
                      value={formData.pricing.video_call}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, video_call: parseInt(e.target.value) }
                      }))}
                      className="bg-white/10 text-white border-white/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Disponibilidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Días Disponibles</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {days.map(day => (
                      <Badge
                        key={day}
                        variant={formData.availability.days.includes(day) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleDayToggle(day)}
                      >
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white">Horario Disponible</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, hours: value }
                  }))}>
                    <SelectTrigger className="bg-white/10 text-white border-white/20">
                      <SelectValue placeholder="Selecciona tu horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Matutino (8:00 - 14:00)</SelectItem>
                      <SelectItem value="afternoon">Vespertino (14:00 - 20:00)</SelectItem>
                      <SelectItem value="evening">Nocturno (20:00 - 02:00)</SelectItem>
                      <SelectItem value="flexible">Horario Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Plan de Promoción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={(value: 'basic' | 'premium' | 'vip') => setFormData(prev => ({
                  ...prev,
                  promotion_plan: value
                }))}>
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue placeholder="Selecciona tu plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico - $99/mes</SelectItem>
                    <SelectItem value="premium">Premium - $199/mes</SelectItem>
                    <SelectItem value="vip">VIP - $399/mes</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active" className="text-white">
                    Perfil activo (visible para clientes)
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full anime-button" 
              disabled={loading}
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
