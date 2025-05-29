
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Plus, Trash2, Star, Image } from 'lucide-react';

const CompanionPhotosManager = () => {
  const { photos, addPhoto, removePhoto, loading } = useCompanionProfile();
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim()) return;

    setIsAddingPhoto(true);
    try {
      await addPhoto(newPhotoUrl, newPhotoCaption || undefined, photos.length === 0);
      setNewPhotoUrl('');
      setNewPhotoCaption('');
    } catch (error) {
      console.error('Error adding photo:', error);
    } finally {
      setIsAddingPhoto(false);
    }
  };

  const handleRemovePhoto = async (photoId: string) => {
    if (window.confirm('¿Estás segura de que quieres eliminar esta foto?')) {
      await removePhoto(photoId);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Image className="w-5 h-5" />
            Gestión de Fotos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="URL de la foto"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="bg-white/10 text-white"
            />
            <Textarea
              placeholder="Descripción de la foto (opcional)"
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              rows={2}
              className="bg-white/10 text-white"
            />
            <Button 
              onClick={handleAddPhoto} 
              disabled={isAddingPhoto || !newPhotoUrl.trim()}
              className="anime-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAddingPhoto ? 'Agregando...' : 'Agregar Foto'}
            </Button>
          </div>

          <div className="text-sm text-gray-300">
            <p>• La primera foto que agregues será tu foto principal</p>
            <p>• Usa URLs válidas de imágenes (jpg, png, gif)</p>
            <p>• Recomendamos fotos de alta calidad para mejor presentación</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <Card key={photo.id} className="glass-card overflow-hidden">
            <div className="relative">
              <img
                src={photo.photo_url}
                alt={photo.caption || `Foto ${index + 1}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face';
                }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {photo.is_primary && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Principal
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              {photo.caption && (
                <p className="text-sm text-gray-300">{photo.caption}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Orden: {photo.display_order + 1}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {photos.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No tienes fotos aún
            </h3>
            <p className="text-gray-300">
              Agrega algunas fotos para mostrar tu personalidad y atraer más clientes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanionPhotosManager;
