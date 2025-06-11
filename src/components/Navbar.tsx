
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, User, LogOut, Crown, Settings, Home } from 'lucide-react';

const Navbar = () => {
  const { user, signOut, isGirlfriend, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <span className="text-xl font-bold text-white">AnimeDating</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-pink-400 transition-colors">
              Catálogo
            </Link>
            <Link to="/home" className="text-white hover:text-pink-400 transition-colors">
              Inicio
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-white hover:text-pink-400 transition-colors">
                  Mi Perfil
                </Link>
                {!isGirlfriend && (
                  <Link to="/subscription" className="text-white hover:text-pink-400 transition-colors">
                    Suscripción
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="text-white hover:text-pink-400 transition-colors flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link to="/become-companion" className="text-white hover:text-pink-400 transition-colors">
                  Ser Companion
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Iniciar Sesión
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-white hover:text-pink-400 transition-colors px-3 py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Catálogo
              </Link>
              <Link 
                to="/home" 
                className="text-white hover:text-pink-400 transition-colors px-3 py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                Inicio
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-white hover:text-pink-400 transition-colors px-3 py-2 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </Link>
                  {!isGirlfriend && (
                    <Link 
                      to="/subscription" 
                      className="text-white hover:text-pink-400 transition-colors px-3 py-2 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Crown className="w-4 h-4" />
                      Suscripción
                    </Link>
                  )}
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-white hover:text-pink-400 transition-colors px-3 py-2 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Panel Admin
                    </Link>
                  )}
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20 mx-3"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/become-companion" 
                    className="text-white hover:text-pink-400 transition-colors px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ser Companion
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 mx-3">
                      Iniciar Sesión
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
