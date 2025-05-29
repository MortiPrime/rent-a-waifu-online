
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Save } from 'lucide-react';

const companionSchema = z.object({
  stage_name: z.string().min(2, 'El nombre artístico debe tener al menos 2 caracteres'),
  real_name: z.string().min(2, 'El nombre real debe tener al menos 2 caracteres'),
  age: z.number().min(18, 'Debes ser mayor de 18 años').max(65, 'Edad máxima 65 años'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  basic_chat: z.number().min(50, 'Precio mínimo $50'),
  premium_chat: z.number().min(100, 'Precio mínimo $100'),
  video_call: z.number().min(200, 'Precio mínimo $200'),
  promotion_plan: z.enum(['basic', 'premium', 'vip']),
  availability_days: z.array(z.string()).min(1, 'Selecciona al menos un día'),
  availability_hours: z.string().min(1, 'Especifica tus horarios'),
});

type CompanionFormData = z.infer<typeof companionSchema>;

const CompanionProfileForm = () => {
  const { profile, createOrUpdateProfile, loading } = useCompanionProfile();
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  const form = useForm<CompanionFormData>({
    resolver: zodResolver(companionSchema),
    defaultValues: {
      stage_name: '',
      real_name: '',
      age: 18,
      description: '',
      basic_chat: 150,
      premium_chat: 300,
      video_call: 500,
      promotion_plan: 'basic',
      availability_days: [],
      availability_hours: 'flexible',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        stage_name: profile.stage_name,
        real_name: profile.real_name,
        age: profile.age,
        description: profile.description,
        basic_chat: profile.pricing.basic_chat,
        premium_chat: profile.pricing.premium_chat,
        video_call: profile.pricing.video_call,
        promotion_plan: profile.promotion_plan,
        availability_days: profile.availability.days,
        availability_hours: profile.availability.hours,
      });
      setAvailableDays(profile.availability.days);
    }
  }, [profile, form]);

  const onSubmit = async (data: CompanionFormData) => {
    const profileData = {
      stage_name: data.stage_name,
      real_name: data.real_name,
      age: data.age,
      description: data.description,
      pricing: {
        basic_chat: data.basic_chat,
        premium_chat: data.premium_chat,
        video_call: data.video_call,
      },
      availability: {
        days: data.availability_days,
        hours: data.availability_hours,
      },
      promotion_plan: data.promotion_plan,
    };

    await createOrUpdateProfile(profileData);
  };

  const weekDays = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  const handleDayToggle = (day: string, checked: boolean) => {
    const newDays = checked 
      ? [...availableDays, day]
      : availableDays.filter(d => d !== day);
    
    setAvailableDays(newDays);
    form.setValue('availability_days', newDays);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Perfil de Companion</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stage_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nombre Artístico</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/10 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="real_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nombre Real</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/10 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Edad</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="bg-white/10 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promotion_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Plan de Promoción</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 text-white">
                          <SelectValue placeholder="Selecciona un plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Básico ($49/mes)</SelectItem>
                        <SelectItem value="premium">Premium ($99/mes)</SelectItem>
                        <SelectItem value="vip">VIP ($199/mes)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={4}
                      className="bg-white/10 text-white"
                      placeholder="Describe tu personalidad, intereses y qué tipo de conversaciones disfrutas..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Precios por Servicio</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="basic_chat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Chat Básico (por hora)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="bg-white/10 text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="premium_chat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Chat Premium (por hora)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="bg-white/10 text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="video_call"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Video Llamada (por hora)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="bg-white/10 text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Disponibilidad</h3>
              <div className="space-y-3">
                <label className="text-white text-sm">Días disponibles:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={availableDays.includes(day)}
                        onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                      />
                      <label htmlFor={day} className="text-white text-sm">{day}</label>
                    </div>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="availability_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Horarios</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/10 text-white"
                        placeholder="Ej: 9:00 AM - 11:00 PM"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full anime-button">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Perfil'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompanionProfileForm;
