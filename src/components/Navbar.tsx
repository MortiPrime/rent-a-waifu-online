import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, User, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, profile, isClient, isGirlfriend } = useAuth();

  const clientNavItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalog' },
    { name: 'Suscripciones', href: '/subscription' },
    { name: 'Perfil', href: '/profile' },
  ];

  const girlfriendNavItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Mi Perfil', href: '/profile' },
    { name: 'Registro Companion', href: '/become-companion' },
  ];

  const navItems = isGirlfriend ? girlfriendNavItems : clientNavItems;

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-playfair text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AnimeDating
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-all duration-300 hover:text-primary ${
                      isActive(item.href)
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Hola, {profile?.full_name || profile?.username || 'Usuario'}
                    {isGirlfriend && (
                      <span className="ml-2 px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                        Companion
                      </span>
                    )}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="anime-button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <Button className="anime-button">
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md rounded-b-lg">
              {user ? (
                <>
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Hola, {profile?.full_name || profile?.username || 'Usuario'}
                    {isGirlfriend && (
                      <span className="ml-2 px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                        Companion
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="anime-button w-full mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="anime-button w-full mt-2">
                    <User className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
