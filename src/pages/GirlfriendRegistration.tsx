
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign } from 'lucide-react';
import { MEXICO_STATES, getMunicipalitiesByState } from '@/data/mexicoStates';
import Navbar from '@/components/Navbar';

const GirlfriendRegistration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    stage_name: '',
    real_name: '',
    age: '',
    description: '',
    state: '',
    municipality: '',
    contact_number: '',
    pricing: {
      basic_chat: '',
      premium_chat: '',
      video_call: ''
    },
    availability: {
      days: [] as string[],
      hours: ''
    }
  });

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const availableMunicipalities = formData.state ? getMunicipalitiesByState(formData.state) : [];

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

  const handleStateChange = (state: string) => {
    setFormData(prev => ({
      ...prev,
      state,
      municipality: '' // Reset municipality when state changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!formData.state || !formData.municipality) {
      toast({
        title: "Error",
        description: "Por favor selecciona tu estado y municipio",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate saving to temporary storage until database is ready
      console.log('Girlfriend profile data:', {
        user_id: user.id,
        stage_name: formData.stage_name,
        real_name: formData.real_name,
        age: parseInt(formData.age),
        description: formData.description,
        state: formData.state,
        municipality: formData.municipality,
        contact_number: formData.contact_number,
        images: [],
        pricing: {
          basic_chat: parseFloat(formData.pricing.basic_chat),
          premium_chat: parseFloat(formData.pricing.premium_chat),
          video_call: parseFloat(formData.pricing.video_call)
        },
        availability: formData.availability,
        status: 'pending',
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      toast({
        title: "¡Registro exitoso!",
        description: "Tu perfil ha sido enviado para revisión. Te notificaremos cuando sea aprobado.",
      });

      // Reset form
      setFormData({
        stage_name: '',
        real_name: '',
        age: '',
        description: '',
        state: '',
        municipality: '',
        contact_number: '',
        pricing: {
          basic_chat: '',
          premium_chat: '',
          video_call: ''
        },
        availability: {
          days: [],
          hours: ''
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al registrar perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Únete como Companion
            </h1>
            <p className="text-gray-600 text-lg">
              Comparte tu personalidad única y conecta con personas increíbles
            </p>
          </div>

          <Card className="anime-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-500" />
                Registro de Companion
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stage_name">Nombre Artístico *</Label>
                      <Input
                        id="stage_name"
                        value={formData.stage_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, stage_name: e.target.value }))}
                        placeholder="Ej: Sakura-chan"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="real_name">Nombre Real *</Label>
                      <Input
                        id="real_name"
                        value={formData.real_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, real_name: e.target.value }))}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="age">Edad *</Label>
                      <Input
                        id="age"
                        type="number"
                        min="18"
                        max="50"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Debe ser mayor de 18"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact_number">Número de Contacto *</Label>
                      <Input
                        id="contact_number"
                        type="tel"
                        value={formData.contact_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                        placeholder="Ej: +52 55 1234 5678"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Descripción Personal *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Cuéntanos sobre tu personalidad, hobbies e intereses..."
                        rows={6}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Select value={formData.state} onValueChange={handleStateChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(MEXICO_STATES).map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="municipality">Municipio *</Label>
                    <Select 
                      value={formData.municipality} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, municipality: value }))}
                      disabled={!formData.state}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMunicipalities.map(municipality => (
                          <SelectItem key={municipality} value={municipality}>{municipality}</SelectItem>
                        ))}
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Precios por Servicio (MXN)
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="basic_chat">Chat Básico (por hora)</Label>
                      <Input
                        id="basic_chat"
                        type="number"
                        min="50"
                        value={formData.pricing.basic_chat}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, basic_chat: e.target.value }
                        }))}
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <Label htmlFor="premium_chat">Chat Premium (por hora)</Label>
                      <Input
                        id="premium_chat"
                        type="number"
                        min="100"
                        value={formData.pricing.premium_chat}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, premium_chat: e.target.value }
                        }))}
                        placeholder="300"
                      />
                    </div>

                    <div>
                      <Label htmlFor="video_call">Video Llamada (por hora)</Label>
                      <Input
                        id="video_call"
                        type="number"
                        min="200"
                        value={formData.pricing.video_call}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, video_call: e.target.value }
                        }))}
                        placeholder="500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Disponibilidad</h3>
                  
                  <div>
                    <Label>Días Disponibles</Label>
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
                    <Label htmlFor="hours">Horario Disponible</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      availability: { ...prev.availability, hours: value }
                    }))}>
                      <SelectTrigger>
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
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Proceso de Aprobación</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Tu perfil será revisado por nuestro equipo en 24-48 horas</li>
                    <li>• Verificaremos tu identidad y documentación</li>
                    <li>• Una vez aprobado, podrás comenzar a recibir solicitudes</li>
                    <li>• Los pagos se procesan semanalmente a tu cuenta</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full anime-button" 
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Enviar Solicitud'}
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
