
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types';

interface ProfileStatsProps {
  profile: UserProfile | null;
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const isCompanion = profile?.user_role === 'girlfriend';

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Estadísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-2xl font-bold text-pink-400">
              {profile?.favorite_characters?.length || 0}
            </p>
            <p className="text-sm text-white/70">Personajes Favoritos</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-2xl font-bold text-purple-400">
              {profile?.created_at ? 
                Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
                : 0
              }
            </p>
            <p className="text-sm text-white/70">Días como miembro</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-2xl font-bold text-blue-400">0</p>
            <p className="text-sm text-white/70">
              {isCompanion ? 'Clientes atendidos' : 'Citas realizadas'}
            </p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-2xl font-bold text-green-400">0</p>
            <p className="text-sm text-white/70">Reseñas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
