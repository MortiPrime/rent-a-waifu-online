
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Camera, Upload, X, Star } from 'lucide-react';

const CompanionPhotosManager = () => {
  const { photos, addPhoto, removePhoto, loading } = useCompanionProfile();
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    await addPhoto(newPhotoUrl, caption, photos.length === 0);
    setNewPhotoUrl('');
    setCaption('');
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Agregar Nueva Foto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPhoto} className="space-y-4">
            <div>
              <Label htmlFor="photo_url" className="text-white">URL de la Foto *</Label>
              <Input
                id="photo_url"
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="caption" className="text-white">Descripción (opcional)</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Descripción de la foto..."
                className="bg-white/10 text-white border-white/20"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full anime-button" 
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar Foto'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Mis Fotos ({photos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No tienes fotos aún
              </h3>
              <p className="text-gray-300">
                Agrega fotos para hacer tu perfil más atractivo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || 'Foto de perfil'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-2">
                    {photo.is_primary && (
                      <div className="bg-yellow-500 text-white p-1 rounded-full">
                        <Star className="w-4 h-4" />
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500/80 hover:bg-red-500"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Consejos para Fotos</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Usa fotos de alta calidad y bien iluminadas</li>
          <li>• Incluye al menos 3-5 fotos diferentes</li>
          <li>• La primera foto será tu foto principal</li>
          <li>• Evita contenido inapropiado o explícito</li>
          <li>• Usa fotos recientes que te representen bien</li>
        </ul>
      </div>
    </div>
  );
};

export default CompanionPhotosManager;
