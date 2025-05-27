
import { useState } from 'react';
import { Heart, User, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CharacterCardProps {
  id: number;
  name: string;
  age: number;
  occupation: string;
  personality: string[];
  image: string;
  isPremium?: boolean;
  isVip?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: number) => void;
}

const CharacterCard = ({
  id,
  name,
  age,
  occupation,
  personality,
  image,
  isPremium = false,
  isVip = false,
  isFavorite = false,
  onFavoriteToggle
}: CharacterCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <div className="character-card">
      {/* Premium/VIP Badge */}
      {(isPremium || isVip) && (
        <div className="absolute top-4 right-4 z-10">
          <Badge 
            className={`${
              isVip 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                : 'bg-gradient-primary text-white'
            } font-semibold`}
          >
            {isVip ? 'VIP' : 'PREMIUM'}
          </Badge>
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110"
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
          }`} 
        />
      </button>

      {/* Character Image */}
      <div className="relative overflow-hidden">
        <div className="aspect-[3/4] bg-gradient-secondary">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400 animate-pulse" />
            </div>
          )}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Character Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {age} años
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3">{occupation}</p>

        {/* Personality Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {personality.slice(0, 3).map((trait, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              {trait}
            </Badge>
          ))}
          {personality.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{personality.length - 3}
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <Button className="anime-button w-full">
          {isPremium || isVip ? 'Ver Perfil Premium' : 'Conocer Más'}
        </Button>
      </div>
    </div>
  );
};

export default CharacterCard;
