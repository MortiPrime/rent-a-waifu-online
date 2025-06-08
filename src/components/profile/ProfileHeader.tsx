
import { useState } from 'react';
import { Camera, Crown, Heart, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserProfile } from '@/types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface ProfileHeaderProps {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  updateProfile: (updates: any) => Promise<void>;
}

export const ProfileHeader = ({ user, profile, updateProfile }: ProfileHeaderProps) => {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const getSubscriptionBadge = () => {
    const type = profile?.subscription_type || 'basic';
    const badges = {
      basic: { icon: User, color: 'text-gray-400', bg: 'bg-gray-500/20', text: 'Básico' },
      premium: { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/20', text: 'Premium' },
      vip: { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20', text: 'VIP' },
    };
    
    const badge = badges[type as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.color} border border-white/20`}>
        <Icon className="w-4 h-4" />
        <span>{badge.text}</span>
      </div>
    );
  };

  const isCompanion = profile?.user_role === 'girlfriend';

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-2 border-white/20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-pink-500 hover:bg-pink-600"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Cambiar Avatar</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="URL de la imagen"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  />
                  <Button 
                    onClick={() => updateProfile({ avatar_url: avatarUrl })}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                  >
                    Actualizar Avatar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="text-center">
            <CardTitle className="text-2xl text-white">
              {profile?.full_name || 'Usuario Anónimo'}
            </CardTitle>
            <p className="text-white/70">@{profile?.username || 'usuario'}</p>
            <div className="mt-2 flex flex-col items-center gap-2">
              {!isCompanion && getSubscriptionBadge()}
              {isCompanion && (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  <Users className="w-4 h-4" />
                  <span>Companion</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
