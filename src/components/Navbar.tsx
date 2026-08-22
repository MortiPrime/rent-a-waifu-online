import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, Menu, X, User, LogOut, Crown, Settings, Home, Gift, Star } from 'lucide-react';

const Navbar = () => {
  const { user, signOut, isGirlfriend, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string, accent: 'brand' | 'gold' = 'brand') =>
    cn(
      'relative text-surface-foreground/80 transition-colors',
      accent === 'brand' ? 'hover:text-brand' : 'hover:text-gold',
      isActive(path) &&
        cn(
          'font-medium text-surface-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full',
          accent === 'brand' ? 'after:bg-brand' : 'after:bg-gold',
        ),
    );

  const mobileLinkClass = (path: string) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 transition-colors',
      isActive(path)
        ? 'bg-surface/10 font-medium text-surface-foreground'
        : 'text-surface-foreground/80 hover:bg-surface/5 hover:text-brand',
    );

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-surface-border/15 bg-black/55 backdrop-blur-xl shadow-glass'
          : 'border-surface-border/10 bg-black/20 backdrop-blur-md',
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-brand" />
            <span className="font-playfair text-xl font-bold text-surface-foreground">AnimeDating</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center space-x-6 md:flex">
            <Link to="/" className={linkClass('/')}>Catálogo</Link>
            <Link to="/home" className={linkClass('/home')}>Inicio</Link>
            {user ? (
              <>
                <Link to="/profile" className={linkClass('/profile')}>Mi Perfil</Link>
                {!isGirlfriend && (
                  <Link to="/subscription" className={linkClass('/subscription')}>Planes</Link>
                )}
                <Link to="/donations" className={linkClass('/donations', 'gold')}>💛 Donar</Link>
                {isAdmin && (
                  <Link to="/admin" className={cn(linkClass('/admin'), 'flex items-center gap-1')}>
                    <Settings className="h-4 w-4" />Admin
                  </Link>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-surface-border/20 bg-surface/10 text-surface-foreground hover:bg-surface/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />Salir
                </Button>
              </>
            ) : (
              <>
                <Link to="/become-companion" className={linkClass('/become-companion')}>Ser Companion</Link>
                <Link to="/donations" className={linkClass('/donations', 'gold')}>💛 Donar</Link>
                <Link to="/auth">
                  <Button className="brand-button">Iniciar Sesión</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-surface-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="border-t border-surface-border/10 py-4 md:hidden">
            <div className="flex flex-col space-y-1">
              <Link to="/" className={mobileLinkClass('/')}>
                <Heart className="h-4 w-4" />Catálogo
              </Link>
              <Link to="/home" className={mobileLinkClass('/home')}>
                <Home className="h-4 w-4" />Inicio
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className={mobileLinkClass('/profile')}>
                    <User className="h-4 w-4" />Mi Perfil
                  </Link>
                  {!isGirlfriend && (
                    <Link to="/subscription" className={mobileLinkClass('/subscription')}>
                      <Crown className="h-4 w-4" />Suscripción
                    </Link>
                  )}
                  <Link to="/donations" className={mobileLinkClass('/donations')}>
                    <Gift className="h-4 w-4" />💛 Donar
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className={mobileLinkClass('/admin')}>
                      <Settings className="h-4 w-4" />Panel Admin
                    </Link>
                  )}
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="mx-3 mt-2 border-surface-border/20 bg-surface/10 text-surface-foreground hover:bg-surface/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />Salir
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/become-companion" className={mobileLinkClass('/become-companion')}>
                    <Star className="h-4 w-4" />Ser Companion
                  </Link>
                  <Link to="/donations" className={mobileLinkClass('/donations')}>
                    <Gift className="h-4 w-4" />💛 Donar
                  </Link>
                  <Link to="/auth" className="px-3 pt-2">
                    <Button className="brand-button w-full">Iniciar Sesión</Button>
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
