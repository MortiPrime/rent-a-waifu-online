
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Heart, MessageCircle, User, Crown, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut, isClient, isGirlfriend, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getNavLinks = () => {
    if (isGirlfriend) {
      return [
        { to: '/', label: 'Dashboard', icon: Settings },
        { to: '/profile', label: 'Mi Perfil', icon: User },
      ];
    }

    if (isClient) {
      return [
        { to: '/catalog', label: 'Companions', icon: Heart },
        { to: '/subscription', label: 'Suscripción', icon: Crown },
        { to: '/profile', label: 'Mi Perfil', icon: User },
      ];
    }

    return [];
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-playfair font-bold text-white">
              AnimeDating
            </span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              {getNavLinks().map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <User className="w-5 h-5 mr-2" />
                    {user.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-gray-900/95 border-gray-700 backdrop-blur-sm"
                >
                  {/* Mobile Navigation */}
                  <div className="md:hidden">
                    {getNavLinks().map((link) => {
                      const Icon = link.icon;
                      return (
                        <DropdownMenuItem key={link.to} asChild>
                          <Link
                            to={link.to}
                            className="flex items-center space-x-2 text-white cursor-pointer"
                          >
                            <Icon className="w-4 h-4" />
                            <span>{link.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator className="bg-gray-700" />
                  </div>

                  {/* Role-specific actions */}
                  {isClient && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/become-companion"
                        className="flex items-center space-x-2 text-white cursor-pointer"
                      >
                        <Crown className="w-4 h-4" />
                        <span>Ser Companion</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 text-white cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-400 cursor-pointer hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                  <Link to="/auth">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="anime-button">
                  <Link to="/auth">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
