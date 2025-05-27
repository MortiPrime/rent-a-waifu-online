
import { useState } from 'react';
import { Search, Filter, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import CharacterCard from '@/components/CharacterCard';
import { characters } from '@/data/characters';

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const handleFavoriteToggle = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.personality.some(trait => trait.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAge = ageFilter === 'all' || 
                      (ageFilter === '18-22' && character.age >= 18 && character.age <= 22) ||
                      (ageFilter === '23-25' && character.age >= 23 && character.age <= 25) ||
                      (ageFilter === '26+' && character.age >= 26);

    const matchesType = typeFilter === 'all' ||
                       (typeFilter === 'free' && !character.isPremium && !character.isVip) ||
                       (typeFilter === 'premium' && character.isPremium) ||
                       (typeFilter === 'vip' && character.isVip);

    const matchesFavorites = !showFavoritesOnly || favorites.includes(character.id);

    return matchesSearch && matchesAge && matchesType && matchesFavorites;
  });

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Catálogo de Companions
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre tu companion perfecta entre nuestra selección premium
            </p>
          </div>

          {/* Filters */}
          <div className="glass-card p-6 rounded-2xl mb-8">
            <div className="grid md:grid-cols-4 gap-4 items-end">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Nombre, ocupación, personalidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Age Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Edad</label>
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Todas las edades</SelectItem>
                    <SelectItem value="18-22">18-22 años</SelectItem>
                    <SelectItem value="23-25">23-25 años</SelectItem>
                    <SelectItem value="26+">26+ años</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="free">Gratis</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Favorites Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Filtros especiales</label>
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className="w-full"
                >
                  <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  Solo Favoritas ({favorites.length})
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Búsqueda: {searchTerm}
                </Badge>
              )}
              {ageFilter !== 'all' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Edad: {ageFilter}
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Tipo: {typeFilter}
                </Badge>
              )}
              {showFavoritesOnly && (
                <Badge variant="secondary" className="bg-red-100 text-red-600">
                  Solo favoritas
                </Badge>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando {filteredCharacters.length} de {characters.length} companions
            </p>
          </div>

          {/* Character Grid */}
          {filteredCharacters.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCharacters.map((character, index) => (
                <div key={character.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CharacterCard
                    {...character}
                    isFavorite={favorites.includes(character.id)}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                No se encontraron companions
              </h3>
              <p className="text-gray-500 mb-6">
                Prueba ajustando los filtros de búsqueda
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setAgeFilter('all');
                  setTypeFilter('all');
                  setShowFavoritesOnly(false);
                }}
                variant="outline"
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Load More (placeholder for future pagination) */}
          {filteredCharacters.length >= 12 && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="animate-pulse">
                Cargar más companions
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
