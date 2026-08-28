import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import PageShell from '@/components/layout/PageShell';

const Profile = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-playfair text-3xl font-bold text-surface-foreground">Mi Perfil</h1>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-surface-border/20 bg-surface/10 text-surface-foreground hover:bg-surface/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
        <UserProfile />
      </div>
    </PageShell>
  );
};

export default Profile;
