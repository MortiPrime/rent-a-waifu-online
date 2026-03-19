import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Crown, Star, DollarSign, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CompanionListingWithPhotos } from '@/hooks/useCompanionListings';
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

  if (!companion) return null;

  const photos = companion.photos || [];
  const hasPhotos = photos.length > 0;

  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Básico</Badge>;
    }
  };

  return (
    <>
      {/* Fullscreen photo overlay */}
      {fullscreenPhoto && hasPhotos && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setFullscreenPhoto(false)}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
            onClick={() => setFullscreenPhoto(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/10 z-10"
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/10 z-10"
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}
          <img
            src={photos[currentPhotoIndex].photo_url}
            alt={photos[currentPhotoIndex].caption || companion.stage_name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white/70 text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              {companion.stage_name}
              {getPlanBadge(companion.promotion_plan || 'basic')}
              {companion.is_featured && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  <Star className="w-3 h-3 mr-1" />Destacado
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Photo Gallery */}
          {hasPhotos ? (
            <div className="space-y-3">
              {/* Main photo */}
              <div
                className="relative w-full h-80 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setFullscreenPhoto(true)}
              >
                <img
                  src={photos[currentPhotoIndex].photo_url}
                  alt={photos[currentPhotoIndex].caption || companion.stage_name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-black/50 px-3 py-1 rounded-full">
                    Click para ampliar
                  </span>
                </div>
                {photos.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
                      onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
                      onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {currentPhotoIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        index === currentPhotoIndex
                          ? 'border-pink-500 ring-2 ring-pink-500/30'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <Heart className="w-16 h-16 text-pink-400/40" />
            </div>
          )}

          {/* Profile Info */}
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4" />
              {companion.municipality}, {companion.state}
            </div>

            <div>
              <p className="text-white/90"><span className="font-semibold">Edad:</span> {companion.age} años</p>
              <p className="text-white/80 mt-2">{companion.description}</p>
            </div>

            {/* Pricing */}
            {companion.pricing && (
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Precios
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-white/5 rounded-md p-2 text-center">
                    <p className="text-white/60 text-xs">Chat Básico</p>
                    <p className="text-white font-semibold">${(companion.pricing as any).basic_chat} MXN</p>
                  </div>
                  <div className="bg-white/5 rounded-md p-2 text-center">
                    <p className="text-white/60 text-xs">Chat Premium</p>
                    <p className="text-white font-semibold">${(companion.pricing as any).premium_chat} MXN</p>
                  </div>
                  <div className="bg-white/5 rounded-md p-2 text-center">
                    <p className="text-white/60 text-xs">Video Llamada</p>
                    <p className="text-white font-semibold">${(companion.pricing as any).video_call} MXN</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            {canSeeContact ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-300 font-medium">📞 {companion.contact_number}</p>
              </div>
            ) : (
              <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-4">
                <p className="text-pink-300 text-sm">Inicia sesión para ver información de contacto</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanionProfileModal;
