import { ArrowLeft, Camera, Crown, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types';
import { useNavigate } from 'react-router-dom';
interface RoleConverterProps {
  profile: UserProfile | null;
  updateProfile: (updates: any) => Promise<void>;
}
export const RoleConverter = ({
  profile,
  updateProfile
}: RoleConverterProps) => {
  const navigate = useNavigate();
  const isCompanion = profile?.user_role === 'girlfriend';
  const handleBecomeCompanion = async () => {
    try {
      await updateProfile({
        user_role: 'girlfriend'
      });
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error converting to companion:', error);
    }
  };
  const handleBecomeClient = async () => {
    try {
      await updateProfile({
        user_role: 'client'
      });
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error converting to client:', error);
    }
  };
  if (!isCompanion) {
    return <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            ¿Quieres ser Companion?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/80 mb-4">
            Convierte tu cuenta en una cuenta de Companion y comienza a ofrecer tus servicios.
            Podrás gestionar tu perfil, fotos, precios y reglas de manera profesional.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Ingresos</h4>
              <p className="text-white/70 text-sm">Genera ingresos con tus servicios</p>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Fotos</h4>
              <p className="text-white/70 text-sm">Sube fotos profesionales</p>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Planes</h4>
              <p className="text-white/70 text-sm">Elige tu plan promocional</p>
            </div>
          </div>
          <Button onClick={handleBecomeCompanion} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg py-6">
            <Users className="w-5 h-5 mr-2" />
            Convertir a Companion Ahora
          </Button>
        </CardContent>
      </Card>;
  }
  return <Card className="bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30">
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
        <Button onClick={handleBecomeClient} variant="outline" className="w-full border-white/30 text-white bg-zinc-950 hover:bg-zinc-800">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Convertir a Cliente
        </Button>
      </CardContent>
    </Card>;
};