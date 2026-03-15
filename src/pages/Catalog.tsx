
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCompanionListings, CompanionListingWithPhotos } from '@/hooks/useCompanionListings';
import { CompanionListing } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Crown, Star, DollarSign, Heart, Users, LogIn, UserPlus } from 'lucide-react';
import { MEXICO_STATES, getMunicipalitiesByState } from '@/data/mexicoStates';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CompanionCatalogView from '@/components/CompanionCatalogView';
import AnnouncementBanner from '@/components/AnnouncementBanner';

const Catalog = () => {
  const { user, profile } = useAuth();
  const { listings, loading, loadListings, loadAllListings } = useCompanionListings();
  const [searchFilters, setSearchFilters] = useState({
    state: '',
    municipality: '',
    phoneNumber: ''
  });

  // Cargar companions al montar el componente
  useEffect(() => {
    if (!(user && profile?.user_role === 'girlfriend')) {
      console.log('Componente montado, cargando companions...');
      loadAllListings();
    }
  }, [user, profile]);

  // Aplicar filtros cuando cambien (con debounce para evitar muchas llamadas)
  useEffect(() => {
    const hasFilters = searchFilters.state || searchFilters.municipality || searchFilters.phoneNumber;
    
    if (hasFilters) {
      console.log('Aplicando filtros:', searchFilters);
      const timeoutId = setTimeout(() => {
        loadListings(searchFilters);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log('Sin filtros, mostrando todas las companions');
      loadAllListings();
    }
  }, [searchFilters.state, searchFilters.municipality, searchFilters.phoneNumber]);

  // Si el usuario es companion, mostrar vista específica
  if (user && profile?.user_role === 'girlfriend') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <CompanionCatalogView />
          </div>
        </div>
      </div>
    );
  }

  const handleFilterChange = (key: string, value: string) => {
    console.log('Cambiando filtro:', key, value);
    setSearchFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset municipality when state changes
      ...(key === 'state' && { municipality: '' })
    }));
  };

  const handlePhoneNumberChange = (value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      phoneNumber: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      state: '',
      municipality: '',
      phoneNumber: ''
    });
  };

  const hasSubscription = profile?.subscription_type && 
    profile?.subscription_expires_at && 
    new Date(profile.subscription_expires_at) > new Date();

  const isPremiumOrVip = hasSubscription && 
    (profile?.subscription_type === 'premium' || profile?.subscription_type === 'vip');

  const visibleCompanions = listings || [];

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'basic':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Básico</Badge>;
    }
  };

          const canSeeContactInfo = (companion: CompanionListing) => {
    if (!user) return false;
    return true; // Todo es gratis por ahora
  };

  const availableMunicipalities = searchFilters.state ? getMunicipalitiesByState(searchFilters.state) : [];

  console.log('Renderizando catálogo con', listings.length, 'companions totales y', visibleCompanions.length, 'visibles');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Encuentra tu
              <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Companion Perfecta
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Conecta con personas reales y auténticas en un ambiente seguro y respetuoso. 
              Descubre conversaciones significativas y experiencias únicas.
            </p>
            
            {/* Auth buttons for non-logged users */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-4">
                    <LogIn className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <AnnouncementBanner location="catalog" />

          {/* Filters */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="state-filter" className="text-white font-medium">Estado</Label>
                  <Select value={searchFilters.state} onValueChange={(value) => handleFilterChange('state', value === 'all' ? '' : value)}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      <SelectItem value="all" className="text-white">Todos los estados</SelectItem>
                      {Object.keys(MEXICO_STATES).map(state => (
                        <SelectItem key={state} value={state} className="text-white">{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="municipality-filter" className="text-white font-medium">Municipio</Label>
                  <Select 
                    value={searchFilters.municipality} 
                    onValueChange={(value) => handleFilterChange('municipality', value === 'all' ? '' : value)}
                    disabled={!searchFilters.state}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Todos los municipios" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      <SelectItem value="all" className="text-white">Todos los municipios</SelectItem>
                      {availableMunicipalities.map(municipality => (
                        <SelectItem key={municipality} value={municipality} className="text-white">{municipality}</SelectItem>
                      ))}
                      <SelectItem value="Otro" className="text-white">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone-filter" className="text-white font-medium">Número de Teléfono</Label>
                  <Input
                    id="phone-filter"
                    type="text"
                    placeholder="Buscar por teléfono..."
                    value={searchFilters.phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info for logged users */}
          {user && profile?.user_role === 'client' && (
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  🎉 ¡Acceso completo y gratuito!
                </h3>
                <p className="text-white/80">
                  Puedes ver todos los perfiles y la información de contacto de todas las companions sin costo alguno.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Registration CTA for non-logged users */}
          {!user && (
            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  ¿Quieres ser Companion?
                </h3>
                <p className="text-white/80 mb-4">
                  Únete a nuestra plataforma y comienza a generar ingresos conectando con personas increíbles.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/become-companion">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <Star className="w-4 h-4 mr-2" />
                      Ser Companion
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      Crear Cuenta
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4">Cargando companions...</p>
            </div>
          ) : visibleCompanions.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron companions</h3>
                <p className="text-gray-300 mb-4">
                  No hay companions registradas en este momento o no coinciden con los filtros aplicados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCompanions.map((companion) => (
                <Card 
                  key={companion.id} 
                  className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-xl mb-1">
                          {companion.stage_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <MapPin className="w-4 h-4" />
                          {companion.municipality}, {companion.state}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {getPlanBadge(companion.promotion_plan || 'basic')}
                        {companion.is_featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            <Star className="w-3 h-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-white/90 text-sm">
                        <span className="font-semibold">Edad:</span> {companion.age} años
                      </p>
                      <p className="text-white/80 text-sm mt-2 line-clamp-3">
                        {companion.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    {companion.pricing && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Precios
                        </h4>
                        <div className="grid grid-cols-1 gap-1 text-sm">
                          <div className="text-white/80">
                            Chat Básico: ${(companion.pricing as any).basic_chat} MXN
                          </div>
                          <div className="text-white/80">
                            Chat Premium: ${(companion.pricing as any).premium_chat} MXN
                          </div>
                          <div className="text-white/80">
                            Video Llamada: ${(companion.pricing as any).video_call} MXN
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact info */}
                    <div className="space-y-2">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        Contacto
                      </h4>
                      {!user ? (
                        <div className="bg-pink-500/20 border border-pink-500/30 rounded-md p-3">
                          <p className="text-pink-300 text-sm">
                            Inicia sesión para ver información de contacto
                          </p>
                        </div>
                      ) : canSeeContactInfo(companion) ? (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3">
                          <p className="text-green-300 font-medium text-sm">
                            📞 {companion.contact_number}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-orange-500/20 border border-orange-500/30 rounded-md p-3">
                          <p className="text-orange-300 text-sm">
                            Suscríbete Premium/VIP para ver el número de contacto
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {user ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-white/30 text-white hover:bg-white/10"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            Me gusta
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          >
                            Ver Perfil
                          </Button>
                        </>
                      ) : (
                        <Link to="/auth" className="w-full">
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          >
                            <LogIn className="w-4 h-4 mr-2" />
                            Iniciar Sesión para Contactar
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
