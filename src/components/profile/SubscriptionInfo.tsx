
import { Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { UserProfile } from '@/types';

interface SubscriptionInfoProps {
  profile: UserProfile | null;
}

export const SubscriptionInfo = ({ profile }: SubscriptionInfoProps) => {
  const isCompanion = profile?.user_role === 'girlfriend';

  if (isCompanion) return null;

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Información de Suscripción
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-white/70">Plan actual</Label>
            <p className="text-white text-lg capitalize">{profile?.subscription_type || 'básico'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-white/70">Expira el</Label>
            <p className="text-white text-lg">
              {profile?.subscription_expires_at 
                ? new Date(profile.subscription_expires_at).toLocaleDateString('es-ES')
                : 'No aplica'
              }
            </p>
          </div>
        </div>
        
        {(!profile?.subscription_type || profile.subscription_type === 'basic') && (
          <div className="mt-4 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg">
            <h4 className="text-white font-semibold mb-2">¡Mejora tu experiencia!</h4>
            <p className="text-white/80 text-sm mb-3">
              Con una suscripción Premium o VIP tendrás acceso a números de contacto de companions.
            </p>
            <Link to="/subscription">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Ver Planes
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
