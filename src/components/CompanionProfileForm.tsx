
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { CompanionProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
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
import { User } from 'lucide-react';

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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Perfil de Companion
        </CardTitle>
        <CardDescription>
          Completa tu información para crear tu perfil público
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stage_name">Nombre Artístico *</Label>
                <Input
                  id="stage_name"
                  value={formData.stage_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, stage_name: e.target.value }))}
                  placeholder="ej. LunaDelMar"
                  required
                />
              </div>
              <div>
                <Label htmlFor="real_name">Nombre Real *</Label>
                <Input
                  id="real_name"
                  value={formData.real_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, real_name: e.target.value }))}
                  placeholder="ej. María López"
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Edad *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  placeholder="ej. 25"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_number">Número de Contacto *</Label>
                <Input
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                  placeholder="ej. +52 55 1234 5678"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Descripción *</h3>
            <Label htmlFor="description">
              Cuéntales a tus clientes sobre ti
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="ej. Soy una persona apasionada por..."
              rows={4}
              required
            />
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ubicación *</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="ej. Ciudad de México"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="ej. CDMX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="municipality">Municipio/Delegación</Label>
                <Input
                  id="municipality"
                  value={formData.municipality}
                  onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                  placeholder="ej. Coyoacán"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Esta información ayudará a los clientes a encontrarte en tu área. 
              Solo usuarios con suscripción podrán ver tu número de contacto.
            </p>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Precios (MXN)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="basic_chat">Chat Básico</Label>
                <Input
                  id="basic_chat"
                  type="number"
                  value={formData.pricing.basic_chat}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, basic_chat: parseInt(e.target.value) }
                  }))}
                  placeholder="ej. 150"
                />
              </div>
              <div>
                <Label htmlFor="premium_chat">Chat Premium</Label>
                <Input
                  id="premium_chat"
                  type="number"
                  value={formData.pricing.premium_chat}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, premium_chat: parseInt(e.target.value) }
                  }))}
                  placeholder="ej. 300"
                />
              </div>
              <div>
                <Label htmlFor="video_call">Video Llamada</Label>
                <Input
                  id="video_call"
                  type="number"
                  value={formData.pricing.video_call}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, video_call: parseInt(e.target.value) }
                  }))}
                  placeholder="ej. 500"
                />
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Disponibilidad</h3>
            <div className="grid grid-cols-3 gap-2">
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
                  />
                  <Label htmlFor={day}>{day}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="hours">Horario</Label>
              <Select
                value={formData.availability.hours}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  availability: { ...prev.availability, hours: value }
                }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Flexible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="morning">Mañana</SelectItem>
                  <SelectItem value="afternoon">Tarde</SelectItem>
                  <SelectItem value="evening">Noche</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Promotion Plan Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Plan de Promoción</h3>
            <Label htmlFor="promotion_plan">Selecciona tu plan</Label>
            <Select
              value={formData.promotion_plan}
              onValueChange={(value) => setFormData(prev => ({ ...prev, promotion_plan: value as 'basic' | 'premium' | 'vip' }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Básico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Status Section */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))}
            />
            <Label htmlFor="is_active">Activar Perfil</Label>
          </div>

          {/* Submit Section */}
          <Button disabled={loading} className="w-full anime-button">
            {loading ? 'Guardando...' : 'Guardar Perfil'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanionProfileForm;
