
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { useToast } from '@/hooks/use-toast';
import { User, Heart, DollarSign, Save, Loader2 } from 'lucide-react';

const CompanionProfileForm = () => {
  const { profile, updateProfile, loading } = useCompanionProfile();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    stage_name: profile?.stage_name || '',
    real_name: profile?.real_name || '',
    age: profile?.age || '',
    description: profile?.description || '',
    pricing: {
      basic_chat: profile?.pricing?.basic_chat || 0,
      premium_chat: profile?.pricing?.premium_chat || 0,
      video_call: profile?.pricing?.video_call || 0,
      date_cost: profile?.pricing?.date_cost || 0,
      date_packages: profile?.pricing?.date_packages || {
        coffee_date: {
          price: 500,
          duration: '2 horas',
          includes: ['Café o bebida', 'Conversación agradable', 'Compañía en café']
        },
        dinner_date: {
          price: 1200,
          duration: '3 horas',
          includes: ['Cena en restaurante', 'Conversación', 'Acompañamiento a restaurante']
        },
        event_companion: {
          price: 2000,
          duration: '4-6 horas',
          includes: ['Acompañamiento a eventos', 'Vestimenta apropiada', 'Conversación inteligente']
        },
        weekend_companion: {
          price: 5000,
          duration: '24 horas',
          includes: ['Compañía de fin de semana', 'Actividades variadas', 'Experiencia completa']
        }
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Actualizando perfil con datos:', formData);
      
      await updateProfile({
        stage_name: formData.stage_name,
        real_name: formData.real_name,
        age: parseInt(formData.age.toString()),
        description: formData.description,
        pricing: {
          basic_chat: formData.pricing.basic_chat,
          premium_chat: formData.pricing.premium_chat,
          video_call: formData.pricing.video_call,
          date_cost: formData.pricing.date_cost,
          date_packages: formData.pricing.date_packages
        }
      });
      
      toast({
        title: "✅ Perfil actualizado",
        description: "Tu información ha sido guardada y sincronizada exitosamente.",
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar el perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar formData cuando cambie el profile
  useState(() => {
    if (profile) {
      setFormData({
        stage_name: profile.stage_name || '',
        real_name: profile.real_name || '',
        age: profile.age || '',
        description: profile.description || '',
        pricing: {
          basic_chat: profile.pricing?.basic_chat || 0,
          premium_chat: profile.pricing?.premium_chat || 0,
          video_call: profile.pricing?.video_call || 0,
          date_cost: profile.pricing?.date_cost || 0,
          date_packages: profile.pricing?.date_packages || {
            coffee_date: {
              price: 500,
              duration: '2 horas',
              includes: ['Café o bebida', 'Conversación agradable', 'Compañía en café']
            },
            dinner_date: {
              price: 1200,
              duration: '3 horas',
              includes: ['Cena en restaurante', 'Conversación', 'Acompañamiento a restaurante']
            },
            event_companion: {
              price: 2000,
              duration: '4-6 horas',
              includes: ['Acompañamiento a eventos', 'Vestimenta apropiada', 'Conversación inteligente']
            },
            weekend_companion: {
              price: 5000,
              duration: '24 horas',
              includes: ['Compañía de fin de semana', 'Actividades variadas', 'Experiencia completa']
            }
          }
        }
      });
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white font-semibold text-sm">Nombre Artístico *</Label>
            <Input
              value={formData.stage_name}
              onChange={(e) => setFormData(prev => ({ ...prev, stage_name: e.target.value }))}
              placeholder="Tu nombre artístico"
              required
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400 focus:ring-pink-400/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white font-semibold text-sm">Nombre Real *</Label>
            <Input
              value={formData.real_name}
              onChange={(e) => setFormData(prev => ({ ...prev, real_name: e.target.value }))}
              placeholder="Tu nombre real"
              required
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400 focus:ring-pink-400/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white font-semibold text-sm">Edad *</Label>
            <Input
              type="number"
              min="18"
              max="65"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Tu edad"
              required
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400 focus:ring-pink-400/20"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white font-semibold text-sm">Descripción *</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Cuéntanos sobre ti..."
            required
            rows={4}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400 focus:ring-pink-400/20 resize-none"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar y Sincronizar
            </>
          )}
        </Button>
      </form>

      {/* Estado del perfil */}
      {profile && (
        <div className="bg-white/5 border border-white/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Estado del Perfil</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">Estado:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                profile.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                profile.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {profile.status === 'approved' ? 'Aprobado' : 
                 profile.status === 'pending' ? 'Pendiente' : 'Rechazado'}
              </span>
            </div>
            <div>
              <span className="text-white/70">Activo:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                profile.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {profile.is_active ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanionProfileForm;
