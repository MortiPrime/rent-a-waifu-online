
import { useState } from 'react';
import { Heart, MessageCircle, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import { characters } from '@/data/characters';
import { useAuth } from '@/hooks/useAuth';

const Catalog = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const { profile } = useAuth();

  const canAccessCharacter = (character: any) => {
    if (character.tier === 'basic') return true;
    if (character.tier === 'premium' && (profile?.subscription_type === 'premium' || profile?.subscription_type === 'vip')) return true;
    if (character.tier === 'vip' && profile?.subscription_type === 'vip') return true;
    return false;
  };

  const filteredCharacters = characters.filter(character => {
    if (filter === 'all') return true;
    return character.tier === filter;
  });

  if (selectedCharacter) {
    return (
      <ChatInterface
        characterId={selectedCharacter.id}
        characterName={selectedCharacter.name}
        characterImage={selectedCharacter.image}
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
            Descubre y conecta con companions increíbles
          </p>
          
          {/* Filters */}
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
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => {
            const hasAccess = canAccessCharacter(character);
            
            return (
              <Card key={character.id} className="character-card relative group">
                <div className="relative overflow-hidden">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Tier Badge */}
                  <Badge
                    className={`absolute top-3 right-3 ${
                      character.tier === 'basic' ? 'bg-gray-500' :
                      character.tier === 'premium' ? 'bg-primary' :
                      'bg-yellow-500'
                    }`}
                  >
                    {character.tier === 'basic' && <Star className="w-3 h-3 mr-1" />}
                    {character.tier === 'premium' && <Heart className="w-3 h-3 mr-1" />}
                    {character.tier === 'vip' && <Crown className="w-3 h-3 mr-1" />}
                    {character.tier.toUpperCase()}
                  </Badge>

                  {/* Overlay for locked characters */}
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
                  <h3 className="font-bold text-lg mb-2">{character.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {character.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {character.traits.slice(0, 3).map((trait, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => hasAccess ? setSelectedCharacter(character) : null}
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

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No se encontraron companions en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
