
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import Navbar from '@/components/Navbar';

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
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
