
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Star, Crown, MapPin, Filter, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import { useCompanionListings } from '@/hooks/useCompanionListings';
import { useAuth } from '@/hooks/useAuth';
import { LocationFilter } from '@/types';

const Catalog = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const { profile } = useAuth();
  const { listings, loading, states, cities, municipalities, loadListings } = useCompanionListings();

  useEffect(() => {
    loadListings(locationFilter);
  }, [locationFilter]);

  const canAccessCompanion = (companion: any) => {
    if (companion.promotion_plan === 'basic') return true;
    if (companion.promotion_plan === 'premium' && (profile?.subscription_type === 'premium' || profile?.subscription_type === 'vip')) return true;
    if (companion.promotion_plan === 'vip' && profile?.subscription_type === 'vip') return true;
    return false;
  };

  const canSeeContactInfo = () => {
    return profile?.subscription_type && profile.subscription_type !== 'basic';
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.promotion_plan === filter;
  });

  const handleLocationFilterChange = (type: keyof LocationFilter, value: string) => {
    const newFilter = { ...locationFilter };
    
    if (value === 'all') {
      delete newFilter[type];
      if (type === 'state') {
        delete newFilter.city;
        delete newFilter.municipality;
      }
      if (type === 'city') {
        delete newFilter.municipality;
      }
    } else {
      newFilter[type] = value;
    }
    
    setLocationFilter(newFilter);
  };

  if (selectedCharacter) {
    return (
      <ChatInterface
        characterId={selectedCharacter.id}
        characterName={selectedCharacter.stage_name}
        characterImage="/placeholder.svg"
        onBack={() => setSelectedCharacter(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Catálogo de Companions
          </h1>
          <p className="text-white/80 text-lg mb-6">
            Descubre y conecta con companions increíbles cerca de ti
          </p>
          
          {/* Subscription Status */}
          {!canSeeContactInfo() && (
            <div className="mb-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-300 text-sm">
                <Lock className="w-4 h-4 inline mr-2" />
                Suscríbete a un plan Premium o VIP para ver información de contacto
              </p>
            </div>
          )}
          
          {/* Filters */}
          <div className="flex flex-col space-y-4">
            {/* Plan Filters */}
            <div className="flex justify-center space-x-4">
              {[
                { key: 'all', label: 'Todos', icon: Star },
                { key: 'basic', label: 'Básico', icon: Star },
                { key: 'premium', label: 'Premium', icon: Heart },
                { key: 'vip', label: 'VIP', icon: Crown },
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={filter === key ? 'default' : 'outline'}
                  onClick={() => setFilter(key)}
                  className={filter === key ? 'anime-button' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Location Filters */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros de Ubicación
                <MapPin className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap justify-center gap-4 bg-white/10 p-4 rounded-lg">
                <div className="min-w-[150px]">
                  <Select onValueChange={(value) => handleLocationFilterChange('state', value)}>
                    <SelectTrigger className="bg-white/20 text-white border-white/30">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <Select onValueChange={(value) => handleLocationFilterChange('city', value)}>
                    <SelectTrigger className="bg-white/20 text-white border-white/30">
                      <SelectValue placeholder="Ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las ciudades</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <Select onValueChange={(value) => handleLocationFilterChange('municipality', value)}>
                    <SelectTrigger className="bg-white/20 text-white border-white/30">
                      <SelectValue placeholder="Municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los municipios</SelectItem>
                      {municipalities.map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>{municipality}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">Cargando companions...</p>
          </div>
        ) : (
          <>
            {/* Companions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => {
                const hasAccess = canAccessCompanion(listing);
                
                return (
                  <Card key={listing.id} className="character-card relative group">
                    <div className="relative overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt={listing.stage_name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      
                      {/* Tier Badge */}
                      <Badge
                        className={`absolute top-3 right-3 ${
                          listing.promotion_plan === 'basic' ? 'bg-gray-500' :
                          listing.promotion_plan === 'premium' ? 'bg-primary' :
                          'bg-yellow-500'
                        }`}
                      >
                        {listing.promotion_plan === 'basic' && <Star className="w-3 h-3 mr-1" />}
                        {listing.promotion_plan === 'premium' && <Heart className="w-3 h-3 mr-1" />}
                        {listing.promotion_plan === 'vip' && <Crown className="w-3 h-3 mr-1" />}
                        {listing.promotion_plan.toUpperCase()}
                      </Badge>

                      {/* Featured Badge */}
                      {listing.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500">
                          ⭐ Destacada
                        </Badge>
                      )}

                      {/* Overlay for locked companions */}
                      {!hasAccess && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Crown className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm font-semibold">Suscripción Requerida</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{listing.stage_name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                      
                      {/* Location */}
                      {(listing.city || listing.state) && (
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <MapPin className="w-3 h-3 mr-1" />
                          {listing.city && listing.state ? `${listing.city}, ${listing.state}` : listing.city || listing.state}
                        </div>
                      )}

                      {/* Contact Info - Only for subscribed users */}
                      {canSeeContactInfo() && listing.contact_number && (
                        <div className="flex items-center text-green-600 text-sm mb-3">
                          <Phone className="w-3 h-3 mr-1" />
                          {listing.contact_number}
                        </div>
                      )}

                      {/* Pricing */}
                      {listing.pricing && (
                        <div className="text-sm text-gray-600 mb-4">
                          Desde ${listing.pricing.basic_chat}/hora
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => hasAccess ? setSelectedCharacter(listing) : null}
                          disabled={!hasAccess}
                          className={hasAccess ? 'anime-button flex-1' : 'flex-1 opacity-50 cursor-not-allowed'}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {hasAccess ? 'Chatear' : 'Bloqueado'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 text-lg">No se encontraron companions en esta área</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Catalog;
