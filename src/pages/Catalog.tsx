
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCompanionListings } from '@/hooks/useCompanionListings';
import { CompanionListing } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Crown, Star, DollarSign, Heart, Users } from 'lucide-react';
import { MEXICO_STATES, getMunicipalitiesByState } from '@/data/mexicoStates';
import Navbar from '@/components/Navbar';

const Catalog = () => {
  const { user, profile } = useAuth();
  const { listings, loading, loadListings, loadAllListings } = useCompanionListings();
  const [searchFilters, setSearchFilters] = useState({
    state: '',
    municipality: '',
    phoneNumber: ''
  });

  // Cargar todas las companions al inicio
  useEffect(() => {
    console.log('Componente montado, cargando companions...');
    loadAllListings();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (searchFilters.state || searchFilters.municipality || searchFilters.phoneNumber) {
      console.log('Aplicando filtros:', searchFilters);
      loadListings(searchFilters);
    } else {
      console.log('Sin filtros, cargando todas las companions...');
      loadAllListings();
    }
  }, [searchFilters]);

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

  const isVipSubscription = hasSubscription && 
    (profile?.subscription_type === 'premium' || profile?.subscription_type === 'vip');

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'basic':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      default:
        return null;
    }
  };

  const availableMunicipalities = searchFilters.state ? getMunicipalitiesByState(searchFilters.state) : [];

  console.log('Renderizando catálogo con', listings.length, 'companions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Catálogo de
              <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Companions
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre companions increíbles en tu área. Conecta con personalidades únicas.
            </p>
          </div>

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
                    <SelectContent className="bg-gray-900 border-gray-700">
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
                    <SelectContent className="bg-gray-900 border-gray-700">
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

          {!hasSubscription && (
            <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30 mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  ¡Suscríbete para ver números de contacto!
                </h3>
                <p className="text-white/80 mb-4">
                  Con una suscripción Premium o VIP podrás acceder a los números de contacto de las companions.
                </p>
                <Button 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => window.location.href = '/subscription'}
                >
                  Ver Planes de Suscripción
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-blue-500/20 border-blue-500/30 mb-8">
              <CardContent className="p-4">
                <p className="text-blue-300 text-sm">
                  Debug: {listings.length} companions encontradas | Loading: {loading.toString()}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4">Cargando companions...</p>
            </div>
          ) : listings.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron companions</h3>
                <p className="text-gray-300 mb-4">
                  {searchFilters.state || searchFilters.municipality || searchFilters.phoneNumber 
                    ? 'Intenta ajustar tus filtros de búsqueda.' 
                    : 'No hay companions registradas en este momento.'}
                </p>
                {(searchFilters.state || searchFilters.municipality || searchFilters.phoneNumber) && (
                  <Button 
                    onClick={clearFilters}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Ver Todas las Companions
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((companion) => (
                <Card key={companion.id} className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
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

                    {/* Contact */}
                    <div className="space-y-2">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        Contacto
                      </h4>
                      {isVipSubscription ? (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3">
                          <p className="text-green-300 font-medium text-sm">
                            📞 {companion.contact_number}
                          </p>
                        </div>
                      ) : hasSubscription ? (
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-md p-3">
                          <p className="text-yellow-300 text-sm">
                            Número disponible con suscripción Premium/VIP
                          </p>
                        </div>
                      ) : (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3">
                          <p className="text-red-300 text-sm">
                            Suscríbete para ver el número de contacto
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
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
