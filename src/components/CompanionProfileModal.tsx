import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Crown, Star, DollarSign, Heart, ChevronLeft, ChevronRight, X, Phone, Maximize2 } from 'lucide-react';
import { CompanionListingWithPhotos } from '@/hooks/useCompanionListings';
import { useFavorites } from '@/hooks/useFavorites';
import ReviewSection from '@/components/reviews/ReviewSection';

interface CompanionProfileModalProps {
  companion: CompanionListingWithPhotos | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canSeeContact: boolean;
}

const CompanionProfileModal = ({ companion, open, onOpenChange, canSeeContact }: CompanionProfileModalProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [fullscreenPhoto, setFullscreenPhoto] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const photos = companion?.photos || [];
  const hasPhotos = photos.length > 0;

  const nextPhoto = useCallback(
    () => setCurrentPhotoIndex((prev) => (photos.length ? (prev + 1) % photos.length : 0)),
    [photos.length],
  );
  const prevPhoto = useCallback(
    () => setCurrentPhotoIndex((prev) => (photos.length ? (prev - 1 + photos.length) % photos.length : 0)),
    [photos.length],
  );

  // Reinicia la galería al abrir otra companion
  useEffect(() => {
    setCurrentPhotoIndex(0);
    setFullscreenPhoto(false);
  }, [companion?.id]);

  // Navegación con teclado
  useEffect(() => {
    if (!open || photos.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, photos.length, nextPhoto, prevPhoto]);

  if (!companion) return null;

  const planBadge = () => {
    switch (companion.promotion_plan) {
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

  const favorite = isFavorite(companion.id);

  return (
    <>
      {/* Vista a pantalla completa */}
      {fullscreenPhoto && hasPhotos && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setFullscreenPhoto(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 text-surface-foreground hover:bg-surface/10"
            onClick={() => setFullscreenPhoto(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Foto anterior"
                className="absolute left-4 z-10 text-surface-foreground hover:bg-surface/10"
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Foto siguiente"
                className="absolute right-4 z-10 text-surface-foreground hover:bg-surface/10"
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
          <img
            src={photos[currentPhotoIndex].photo_url}
            alt={photos[currentPhotoIndex].caption || companion.stage_name}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-sm text-surface-foreground/70">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border-surface-border/20 bg-gradient-app p-0 text-surface-foreground backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* Columna galería */}
            <div className="bg-black/30 p-4 md:sticky md:top-0 md:self-start">
              {hasPhotos ? (
                <div className="space-y-3">
                  <div
                    className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setFullscreenPhoto(true)}
                  >
                    <img
                      src={photos[currentPhotoIndex].photo_url}
                      alt={photos[currentPhotoIndex].caption || companion.stage_name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-sm opacity-0 transition-opacity group-hover:opacity-100">
                        <Maximize2 className="h-3.5 w-3.5" />Ampliar
                      </span>
                    </div>
                    {photos.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Foto anterior"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-surface-foreground hover:bg-black/60"
                          onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Foto siguiente"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-surface-foreground hover:bg-black/60"
                          onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                        <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs">
                          {currentPhotoIndex + 1} / {photos.length}
                        </div>
                      </>
                    )}
                  </div>

                  {photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {photos.map((photo, index) => (
                        <button
                          key={photo.id}
                          type="button"
                          aria-label={`Ver foto ${index + 1}`}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                            index === currentPhotoIndex
                              ? 'border-brand ring-2 ring-brand/30'
                              : 'border-surface-border/20 hover:border-surface-border/40'
                          }`}
                        >
                          <img src={photo.photo_url} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center rounded-lg bg-gradient-brand/20">
                  <Heart className="h-16 w-16 text-brand/40" />
                </div>
              )}
            </div>

            {/* Columna información */}
            <div className="flex flex-col p-5">
              <DialogHeader className="text-left">
                <DialogTitle className="flex flex-wrap items-center gap-3 font-playfair text-2xl font-bold">
                  {companion.stage_name}
                  {planBadge()}
                  {companion.is_featured && (
                    <Badge className="border-gold/40 bg-gold/20 text-gold">
                      <Star className="mr-1 h-3 w-3" />Destacado
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-3 space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-sm text-surface-foreground/75">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />{companion.municipality}, {companion.state}
                  </span>
                  <span>{companion.age} años</span>
                </div>

                <section>
                  <h4 className="mb-1.5 font-semibold">Sobre mí</h4>
                  <p className="text-sm leading-relaxed text-surface-foreground/75">{companion.description}</p>
                </section>

                {companion.pricing && (
                  <section className="rounded-lg bg-surface/5 p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold">
                      <DollarSign className="h-4 w-4" />Precios
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      {[
                        ['Chat Básico', (companion.pricing as any).basic_chat],
                        ['Chat Premium', (companion.pricing as any).premium_chat],
                        ['Video Llamada', (companion.pricing as any).video_call],
                      ].map(([label, price]) => (
                        <div key={label as string} className="rounded-md bg-surface/5 p-2">
                          <p className="text-xs text-surface-foreground/55">{label}</p>
                          <p className="font-semibold">${price} MXN</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <h4 className="mb-2 font-semibold">Contacto</h4>
                  {canSeeContact ? (
                    <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/15 p-4">
                      <Phone className="h-4 w-4 text-success" />
                      <span className="font-medium">{companion.contact_number}</span>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-brand/30 bg-brand/15 p-4 text-sm text-surface-foreground/80">
                      Inicia sesión para ver la información de contacto.
                    </div>
                  )}
                </section>

                {canSeeContact && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => toggleFavorite(companion.id)}
                      className={`flex-1 border-surface-border/30 hover:bg-surface/10 ${
                        favorite ? 'border-brand/50 bg-brand/10 text-brand' : 'text-surface-foreground'
                      }`}
                    >
                      <Heart className={`mr-2 h-4 w-4 ${favorite ? 'fill-brand' : ''}`} />
                      {favorite ? 'En favoritas' : 'Añadir a favoritas'}
                    </Button>
                    <Button asChild className="brand-button flex-1">
                      <a href={`https://wa.me/${(companion.contact_number || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <Phone className="mr-2 h-4 w-4" />Contactar
                      </a>
                    </Button>
                  </div>
                )}

                <ReviewSection companionListingId={companion.id} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanionProfileModal;
