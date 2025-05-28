
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Heart, Camera, DollarSign, Calendar, Shield } from 'lucide-react';

const girlfriendSchema = z.object({
  stageName: z.string().min(2, 'El nombre artístico debe tener al menos 2 caracteres'),
  realName: z.string().min(2, 'El nombre real debe tener al menos 2 caracteres'),
  age: z.number().min(18, 'Debes ser mayor de 18 años').max(35, 'Edad máxima 35 años'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  basicChatPrice: z.number().min(100, 'Precio mínimo $100'),
  premiumChatPrice: z.number().min(200, 'Precio mínimo $200'),
  videoCallPrice: z.number().min(500, 'Precio mínimo $500'),
  availabilityDays: z.array(z.string()).min(1, 'Selecciona al menos un día'),
  availabilityHours: z.string().min(1, 'Especifica tus horarios'),
  terms: z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
});

type GirlfriendFormData = z.infer<typeof girlfriendSchema>;

const GirlfriendRegistration = () => {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<GirlfriendFormData>({
    resolver: zodResolver(girlfriendSchema),
    defaultValues: {
      stageName: '',
      realName: '',
      age: 18,
      description: '',
      basicChatPrice: 100,
      premiumChatPrice: 200,
      videoCallPrice: 500,
      availabilityDays: [],
      availabilityHours: '',
      terms: false,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: "Límite excedido",
        description: "Máximo 5 imágenes permitidas",
        variant: "destructive",
      });
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: GirlfriendFormData) => {
    if (!user) return;

    if (images.length < 3) {
      toast({
        title: "Imágenes insuficientes",
        description: "Debes subir al menos 3 imágenes",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload images to Supabase Storage (simulated for now)
      const imageUrls = images.map((_, index) => 
        `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=600&fit=crop&crop=face`
      );

      // Insert girlfriend profile
      const { error } = await supabase
        .from('girlfriend_profiles')
        .insert({
          user_id: user.id,
          stage_name: data.stageName,
          real_name: data.realName,
          age: data.age,
          description: data.description,
          images: imageUrls,
          pricing: {
            basic_chat: data.basicChatPrice,
            premium_chat: data.premiumChatPrice,
            video_call: data.videoCallPrice,
          },
          availability: {
            days: data.availabilityDays,
            hours: data.availabilityHours,
          },
          status: 'pending',
          is_active: false,
        });

      if (error) throw error;

      toast({
        title: "¡Solicitud enviada!",
        description: "Tu perfil está en revisión. Te notificaremos cuando sea aprobado.",
      });

      form.reset();
      setImages([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la solicitud",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const weekDays = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Conviértete en Companion
            </h1>
            <p className="text-white/80 text-lg">
              Únete a nuestra plataforma y conecta con usuarios especiales
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-primary text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Formulario de Registro
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="stageName">Nombre Artístico *</Label>
                    <Input
                      id="stageName"
                      {...form.register('stageName')}
                      placeholder="Tu nombre en la plataforma"
                    />
                    {form.formState.errors.stageName && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.stageName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="realName">Nombre Real *</Label>
                    <Input
                      id="realName"
                      {...form.register('realName')}
                      placeholder="Tu nombre completo"
                    />
                    {form.formState.errors.realName && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.realName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="age">Edad *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="35"
                    {...form.register('age', { valueAsNumber: true })}
                  />
                  {form.formState.errors.age && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descripción Personal *</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Cuéntanos sobre ti, tus intereses, personalidad..."
                    rows={4}
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                {/* Images */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4" />
                    Fotos (mínimo 3, máximo 5) *
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mb-2"
                  />
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 w-6 h-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div>
                  <Label className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-4 h-4" />
                    Precios por Servicio (MXN) *
                  </Label>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="basicChatPrice">Chat Básico</Label>
                      <Input
                        id="basicChatPrice"
                        type="number"
                        min="100"
                        {...form.register('basicChatPrice', { valueAsNumber: true })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="premiumChatPrice">Chat Premium</Label>
                      <Input
                        id="premiumChatPrice"
                        type="number"
                        min="200"
                        {...form.register('premiumChatPrice', { valueAsNumber: true })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="videoCallPrice">Video Llamada</Label>
                      <Input
                        id="videoCallPrice"
                        type="number"
                        min="500"
                        {...form.register('videoCallPrice', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <Label className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4" />
                    Disponibilidad *
                  </Label>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Días disponibles:</Label>
                      <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mt-2">
                        {weekDays.map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={day}
                              {...form.register('availabilityDays')}
                              value={day}
                            />
                            <Label htmlFor={day} className="text-sm">{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="availabilityHours">Horarios disponibles</Label>
                      <Input
                        id="availabilityHours"
                        {...form.register('availabilityHours')}
                        placeholder="Ej: 10:00 AM - 6:00 PM"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    {...form.register('terms')}
                  />
                  <Label htmlFor="terms" className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Acepto los términos y condiciones, políticas de privacidad y me comprometo a mantener un comportamiento profesional
                  </Label>
                </div>
                {form.formState.errors.terms && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.terms.message}
                  </p>
                )}

                <Button 
                  type="submit" 
                  className="w-full anime-button" 
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitud de Registro'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GirlfriendRegistration;
