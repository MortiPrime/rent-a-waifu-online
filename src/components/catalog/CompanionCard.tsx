import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MapPin, Crown, Star, LogIn, Images, Phone } from 'lucide-react';
import { CompanionListingWithPhotos } from '@/hooks/useCompanionListings';
import StarRating from '@/components/reviews/StarRating';

export const PlanBadge = ({ plan }: { plan?: string | null }) => {
  switch (plan) {
    case 'premium':
      return <Badge className="border-brand-glow/40 bg-brand-glow/20 text-surface-foreground">Premium</Badge>;
    case 'vip':
      return (
        <Badge className="border-gold/40 bg-gold/20 text-gold">
          <Crown className="mr-1 h-3 w-3" />VIP
        </Badge>
      );
    default:
      return <Badge className="border-info/40 bg-info/20 text-surface-foreground">Básico</Badge>;
  }
};

interface CompanionCardProps {
  companion: CompanionListingWithPhotos;
  index?: number;
  rating?: { average: number; count: number };
  isAuthenticated: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewProfile: (companion: CompanionListingWithPhotos) => void;
}

const CompanionCard = ({
  companion,
  index = 0,
  rating,
  isAuthenticated,
  isFavorite,
  onToggleFavorite,
  onViewProfile,
}: CompanionCardProps) => {
  const photoCount = companion.photos?.length ?? 0;

  return (
    <Card
      className="surface-card surface-card-hover group flex animate-fade-up flex-col overflow-hidden"
      style={{ animationDelay: `${Math.min(index, 11) * 60}ms` }}
    >
      {/* Media */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {companion.primary_photo_url ? (
          <img
            src={companion.primary_photo_url}
            alt={`Foto de ${companion.stage_name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-brand/20">
            <Heart className="h-14 w-14 text-brand/40" />
          </div>
        )}

        {/* Degradado inferior para legibilidad */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Badges superiores */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <PlanBadge plan={companion.promotion_plan} />
          {companion.is_featured && (
            <Badge className="border-gold/40 bg-gold/20 text-gold">
              <Star className="mr-1 h-3 w-3" />Destacado
            </Badge>
          )}
        </div>

        {/* Favorito */}
        {isAuthenticated && (
          <button
            type="button"
            aria-label={isFavorite ? 'Quitar de favoritas' : 'Añadir a favoritas'}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(companion.id)}
            className="absolute right-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-brand text-brand' : 'text-surface-foreground'}`}
            />
          </button>
        )}

        {photoCount > 1 && (
          <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-surface-foreground">
            <Images className="h-3 w-3" />{photoCount}
          </span>
        )}

        {/* Identidad sobre la foto */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-playfair text-xl font-bold text-surface-foreground">
            {companion.stage_name}
            <span className="ml-2 text-sm font-normal text-surface-foreground/70">{companion.age} años</span>
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-surface-foreground/75">
            <MapPin className="h-3.5 w-3.5" />
            {companion.municipality}, {companion.state}
          </p>
          {rating && rating.count > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <StarRating rating={Math.round(rating.average)} size="sm" />
              <span className="text-xs text-surface-foreground/60">({rating.count})</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-4">
        <p className="line-clamp-3 text-sm text-surface-foreground/70">{companion.description}</p>

        {companion.pricing && (
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Chat', (companion.pricing as any).basic_chat],
              ['Premium', (companion.pricing as any).premium_chat],
              ['Video', (companion.pricing as any).video_call],
            ].map(([label, price]) => (
              <div key={label as string} className="rounded-md bg-surface/5 p-2">
                <p className="text-[11px] text-surface-foreground/50">{label}</p>
                <p className="text-sm font-semibold text-surface-foreground">${price} MXN</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/15 p-2.5">
              <Phone className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-surface-foreground">{companion.contact_number}</span>
            </div>
          ) : (
            <Link to="/auth" className="block">
              <Button
                variant="outline"
                className="w-full border-surface-border/30 bg-surface/5 text-surface-foreground hover:bg-surface/15"
              >
                <LogIn className="mr-2 h-4 w-4" />Iniciar sesión para contactar
              </Button>
            </Link>
          )}
          <Button className="brand-button w-full" onClick={() => onViewProfile(companion)}>
            Ver Perfil
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};

export default CompanionCard;
