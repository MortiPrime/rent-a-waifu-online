
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCompanionListings } from '@/hooks/useCompanionListings';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { CompanionListing } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Crown, Star, DollarSign, Users, Settings, Heart } from 'lucide-react';
import { MEXICO_STATES, getMunicipalitiesByState } from '@/data/mexicoStates';

const CompanionCatalogView = () => {
  const { user, profile: userProfile } = useAuth();
  const { profile: companionProfile, loading: profileLoading } = useCompanionProfile();
  const { listings, loading, loadListings, loadAllListings } = useCompanionListings();
  const [searchFilters, setSearchFilters] = useState({
    state: '',
    municipality: '',
    phoneNumber: ''
  });

  useEffect(() => {
    console.log('Companion viewing catalog...');
    loadAllListings();
  }, [loadAllListings]);

  useEffect(() => {
    if (searchFilters.state || searchFilters.municipality || searchFilters.phoneNumber) {
      console.log('Aplicando filtros como companion:', searchFilters);
      loadListings(searchFilters);
    } else {
      loadAllListings();
    }
  }, [searchFilters, loadListings, loadAllListings]);

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value,
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

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendiente</Badge>,
      approved: <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Aprobado</Badge>,
      rejected: <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">Rechazado</Badge>,
      suspended: <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/30">Suspendido</Badge>
    };
    return badges[status as keyof typeof badges] || badges.approved;
  };

  // Filtrar companions excluyendo la propia
  const visibleCompanions = listings.filter(companion => companion.user_id !== user?.id);

  const availableMunicipalities = searchFilters.state ? getMunicipalitiesByState(searchFilters.state) : [];

  if (loading || profileLoading) {
    return (
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4">Cargando companions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
          Otras
          <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Companions
          </span>
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Ve como otros perciben los perfiles de companions en la plataforma.
        </p>
      </div>

      {/* Mi Perfil como Companion */}
      {companionProfile && (
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Tu Perfil como Companion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-white/70 text-sm">Nombre Artístico</p>
                <p className="text-white font-semibold text-lg">{companionProfile.stage_name}</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm">Estado</p>
                <div className="flex justify-center mt-1">
                  {getStatusBadge(companionProfile.status || 'approved')}
                </div>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm">Plan</p>
                <div className="flex justify-center mt-1">
                  {getPlanBadge(companionProfile.promotion_plan || 'basic')}
                </div>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm">Ubicación</p>
                <p className="text-white text-sm">{companionProfile.city}, {companionProfile.state}</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button 
                onClick={() => window.location.href = '/profile'}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Ir a Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
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

      {/* Notice for companions */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Vista de Companion
          </h3>
          <p className="text-white/80">
            Estás viendo los perfiles como los ve cualquier usuario. No puedes ver información de contacto de otras companions.
          </p>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {visibleCompanions.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron otras companions</h3>
            <p className="text-gray-300 mb-4">
              No hay otras companions registradas en este momento o no coinciden con los filtros aplicados.
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

                {/* Contact info - companions can't see other companions' contact */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    Contacto
                  </h4>
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-md p-3">
                    <p className="text-orange-300 text-sm">
                      Solo clientes pueden ver información de contacto
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 border-white/30 text-white hover:bg-white/10"
                    disabled
                  >
                    Vista de Companion
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanionCatalogView;
