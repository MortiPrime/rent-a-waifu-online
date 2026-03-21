
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCompanionListings, CompanionListingWithPhotos } from '@/hooks/useCompanionListings';
import { useListingRatings } from '@/hooks/useReviews';
import { useFavorites } from '@/hooks/useFavorites';
import { CompanionListing } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin, Crown, Star, DollarSign, Heart, Users, LogIn, UserPlus, Search, SlidersHorizontal } from 'lucide-react';
import { MEXICO_STATES, getMunicipalitiesByState } from '@/data/mexicoStates';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CompanionCatalogView from '@/components/CompanionCatalogView';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import CompanionProfileModal from '@/components/CompanionProfileModal';
import StarRating from '@/components/reviews/StarRating';
import { CatalogSkeletonGrid } from '@/components/CatalogCardSkeleton';

const Catalog = () => {
  const { user, profile } = useAuth();
  const { listings, loading, loadListings, loadAllListings } = useCompanionListings();
  const { ratings, fetchRatings } = useListingRatings();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionListingWithPhotos | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    state: '',
    municipality: '',
    phoneNumber: ''
  });
  const [nameSearch, setNameSearch] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [planFilter, setPlanFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!(user && profile?.user_role === 'girlfriend')) {
      loadAllListings();
    }
  }, [user, profile]);

  useEffect(() => {
    if (listings.length > 0) {
      fetchRatings(listings.map(l => l.id));
    }
  }, [listings]);

  useEffect(() => {
    const hasFilters = searchFilters.state || searchFilters.municipality || searchFilters.phoneNumber;
    if (hasFilters) {
      const timeoutId = setTimeout(() => { loadListings(searchFilters); }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      loadAllListings();
    }
  }, [searchFilters.state, searchFilters.municipality, searchFilters.phoneNumber]);

  if (user && profile?.user_role === 'girlfriend') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto"><CompanionCatalogView /></div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'state' && { municipality: '' })
    }));
  };

  const clearFilters = () => {
    setSearchFilters({ state: '', municipality: '', phoneNumber: '' });
    setNameSearch('');
    setAgeRange([18, 60]);
    setPlanFilter('');
    setSortBy('newest');
  };

  const hasSubscription = profile?.subscription_type && 
    profile?.subscription_expires_at && 
    new Date(profile.subscription_expires_at) > new Date();

  // Apply client-side filters and sorting
  let visibleCompanions = [...(listings || [])];
  
  if (nameSearch.trim()) {
    visibleCompanions = visibleCompanions.filter(c => 
      c.stage_name.toLowerCase().includes(nameSearch.toLowerCase())
    );
  }
  if (ageRange[0] > 18 || ageRange[1] < 60) {
    visibleCompanions = visibleCompanions.filter(c => c.age >= ageRange[0] && c.age <= ageRange[1]);
  }
  if (planFilter && planFilter !== 'all') {
    visibleCompanions = visibleCompanions.filter(c => c.promotion_plan === planFilter);
  }

  // Sort
  if (sortBy === 'best_rated') {
    visibleCompanions.sort((a, b) => {
      const ra = ratings.get(a.id)?.average || 0;
      const rb = ratings.get(b.id)?.average || 0;
      return rb - ra;
    });
  }
  // 'newest' is already default from DB

  const canSeeContactInfo = (companion: CompanionListing) => {
    if (!user) return false;
    return true;
  };

  const availableMunicipalities = searchFilters.state ? getMunicipalitiesByState(searchFilters.state) : [];

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'basic': return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Básico</Badge>;
      case 'premium': return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip': return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      default: return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Básico</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
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
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-4">
                    <LogIn className="w-5 h-5 mr-2" />Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <UserPlus className="w-5 h-5 mr-2" />Registrarse
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
                <SlidersHorizontal className="w-5 h-5" />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  placeholder="Buscar por nombre..."
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-white font-medium">Estado</Label>
                  <Select value={searchFilters.state} onValueChange={(v) => handleFilterChange('state', v === 'all' ? '' : v)}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      <SelectItem value="all" className="text-white">Todos los estados</SelectItem>
                      {Object.keys(MEXICO_STATES).map(state => (
                        <SelectItem key={state} value={state} className="text-white">{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white font-medium">Municipio</Label>
                  <Select value={searchFilters.municipality} onValueChange={(v) => handleFilterChange('municipality', v === 'all' ? '' : v)} disabled={!searchFilters.state}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      <SelectItem value="all" className="text-white">Todos</SelectItem>
                      {availableMunicipalities.map(m => (
                        <SelectItem key={m} value={m} className="text-white">{m}</SelectItem>
                      ))}
                      <SelectItem value="Otro" className="text-white">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white font-medium">Plan</Label>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      <SelectItem value="all" className="text-white">Todos los planes</SelectItem>
                      <SelectItem value="basic" className="text-white">Básico</SelectItem>
                      <SelectItem value="premium" className="text-white">Premium</SelectItem>
                      <SelectItem value="vip" className="text-white">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white font-medium">Ordenar por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      <SelectItem value="newest" className="text-white">Más recientes</SelectItem>
                      <SelectItem value="best_rated" className="text-white">Mejor valoradas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Age range slider */}
              <div>
                <Label className="text-white font-medium">Rango de edad: {ageRange[0]} - {ageRange[1]} años</Label>
                <div className="px-2 pt-2">
                  <Slider
                    min={18}
                    max={60}
                    step={1}
                    value={ageRange}
                    onValueChange={(v) => setAgeRange(v as [number, number])}
                    className="w-full"
                  />
                </div>
              </div>

              <Button onClick={clearFilters} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>

          {/* Info cards */}
          {user && profile?.user_role === 'client' && (
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">🎉 ¡Acceso completo y gratuito!</h3>
                <p className="text-white/80">Puedes ver todos los perfiles y la información de contacto de todas las companions sin costo alguno.</p>
              </CardContent>
            </Card>
          )}

          {!user && (
            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">¿Quieres ser Companion?</h3>
                <p className="text-white/80 mb-4">Únete a nuestra plataforma y comienza a generar ingresos conectando con personas increíbles.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/become-companion">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <Star className="w-4 h-4 mr-2" />Ser Companion
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">Crear Cuenta</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results count */}
          {!loading && visibleCompanions.length > 0 && (
            <p className="text-white/60 text-sm mb-4">{visibleCompanions.length} companion{visibleCompanions.length !== 1 ? 's' : ''} encontrada{visibleCompanions.length !== 1 ? 's' : ''}</p>
          )}

          {/* Listings Grid */}
          {loading ? (
            <CatalogSkeletonGrid />
          ) : visibleCompanions.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron companions</h3>
                <p className="text-gray-300 mb-4">No hay companions que coincidan con los filtros aplicados.</p>
                <Button onClick={clearFilters} variant="outline" className="border-white/30 text-white hover:bg-white/10">Limpiar Filtros</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCompanions.map((companion) => (
                <Card 
                  key={companion.id} 
                  className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
                >
                  {companion.primary_photo_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <img src={companion.primary_photo_url} alt={companion.stage_name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      {companion.photos && companion.photos.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">📷 {companion.photos.length} fotos</div>
                      )}
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-pink-400/40" />
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-xl mb-1">{companion.stage_name}</CardTitle>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <MapPin className="w-4 h-4" />{companion.municipality}, {companion.state}
                        </div>
                        {ratings.get(companion.id) && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <StarRating rating={Math.round(ratings.get(companion.id)!.average)} size="sm" />
                            <span className="text-white/50 text-xs">({ratings.get(companion.id)!.count})</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {getPlanBadge(companion.promotion_plan || 'basic')}
                        {companion.is_featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Star className="w-3 h-3 mr-1" />Destacado</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-white/90 text-sm"><span className="font-semibold">Edad:</span> {companion.age} años</p>
                      <p className="text-white/80 text-sm mt-2 line-clamp-3">{companion.description}</p>
                    </div>

                    {companion.pricing && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium flex items-center gap-2"><DollarSign className="w-4 h-4" />Precios</h4>
                        <div className="grid grid-cols-1 gap-1 text-sm">
                          <div className="text-white/80">Chat Básico: ${(companion.pricing as any).basic_chat} MXN</div>
                          <div className="text-white/80">Chat Premium: ${(companion.pricing as any).premium_chat} MXN</div>
                          <div className="text-white/80">Video Llamada: ${(companion.pricing as any).video_call} MXN</div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-white font-medium flex items-center gap-2">Contacto</h4>
                      {!user ? (
                        <div className="bg-pink-500/20 border border-pink-500/30 rounded-md p-3">
                          <p className="text-pink-300 text-sm">Inicia sesión para ver información de contacto</p>
                        </div>
                      ) : canSeeContactInfo(companion) ? (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3">
                          <p className="text-green-300 font-medium text-sm">📞 {companion.contact_number}</p>
                        </div>
                      ) : (
                        <div className="bg-orange-500/20 border border-orange-500/30 rounded-md p-3">
                          <p className="text-orange-300 text-sm">Suscríbete Premium/VIP para ver el número de contacto</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {user ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`flex-1 border-white/30 hover:bg-white/10 transition-all ${isFavorite(companion.id) ? 'text-pink-400 border-pink-400/50 bg-pink-500/10' : 'text-white'}`}
                            onClick={() => toggleFavorite(companion.id)}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${isFavorite(companion.id) ? 'fill-pink-400' : ''}`} />
                            {isFavorite(companion.id) ? 'Favorita' : 'Me gusta'}
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                            onClick={() => { setSelectedCompanion(companion); setProfileModalOpen(true); }}
                          >
                            Ver Perfil
                          </Button>
                        </>
                      ) : (
                        <Link to="/auth" className="w-full">
                          <Button size="sm" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                            <LogIn className="w-4 h-4 mr-2" />Iniciar Sesión para Contactar
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

      <Footer />

      <CompanionProfileModal
        companion={selectedCompanion}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        canSeeContact={!!user}
      />
    </div>
  );
};

export default Catalog;
