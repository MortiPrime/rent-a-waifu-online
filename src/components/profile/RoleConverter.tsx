
import { ArrowLeft, Camera, Crown, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface RoleConverterProps {
  profile: UserProfile | null;
  updateProfile: (updates: any) => Promise<void>;
}

export const RoleConverter = ({
  profile,
  updateProfile
}: RoleConverterProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);
  const isCompanion = profile?.user_role === 'girlfriend';

  const handleBecomeCompanion = async () => {
    setIsConverting(true);
    try {
      console.log('Iniciando conversión a companion...');
      
      // Actualizar el rol del usuario en profiles
      await updateProfile({
        user_role: 'girlfriend'
      });

      toast({
        title: "¡Conversión exitosa!",
        description: "Ahora eres una companion. Redirigiendo para completar tu perfil...",
      });

      // Esperar un momento para que se actualice el estado
      setTimeout(() => {
        navigate('/become-companion');
      }, 1000);

    } catch (error) {
      console.error('Error converting to companion:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la conversión. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleBecomeClient = async () => {
    setIsConverting(true);
    try {
      console.log('Iniciando conversión a cliente...');
      
      await updateProfile({
        user_role: 'client'
      });

      toast({
        title: "Conversión exitosa",
        description: "Ahora eres un cliente.",
      });

      navigate('/');

    } catch (error) {
      console.error('Error converting to client:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la conversión. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  if (!isCompanion) {
    return (
      <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-950">
            <Users className="w-5 h-5" />
            ¿Quieres ser Companion?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-violet-950">
            Convierte tu cuenta en una cuenta de Companion y comienza a ofrecer tus servicios.
            Podrás gestionar tu perfil, fotos, precios y reglas de manera profesional.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-indigo-500">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Ingresos</h4>
              <p className="text-white/70 text-sm">Genera ingresos con tus servicios</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-indigo-500">
              <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Fotos</h4>
              <p className="text-white/70 text-sm">Sube fotos profesionales</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-indigo-500">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Planes</h4>
              <p className="text-white/70 text-sm">Elige tu plan promocional</p>
            </div>
          </div>
          <Button 
            onClick={handleBecomeCompanion} 
            disabled={isConverting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg py-6"
          >
            <Users className="w-5 h-5 mr-2" />
            {isConverting ? 'Convirtiendo...' : 'Convertir a Companion Ahora'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-950">
          <ArrowLeft className="w-5 h-5" />
          ¿Quieres volver a ser Cliente?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-zinc-950">
          Puedes convertir tu cuenta de vuelta a una cuenta de cliente. Esto desactivará 
          tu perfil de companion pero conservará toda tu información.
        </p>
        <Button 
          onClick={handleBecomeClient} 
          disabled={isConverting}
          variant="outline" 
          className="w-full border-white/30 text-white bg-zinc-950 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {isConverting ? 'Convirtiendo...' : 'Convertir a Cliente'}
        </Button>
      </CardContent>
    </Card>
  );
};
