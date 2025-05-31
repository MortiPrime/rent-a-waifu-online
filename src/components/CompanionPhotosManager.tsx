
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Camera, Upload, X, Star, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CompanionPhotosManager = () => {
  const { photos, addPhoto, removePhoto, loading } = useCompanionProfile();
  const { toast } = useToast();
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    await addPhoto(newPhotoUrl, caption, photos.length === 0);
    setNewPhotoUrl('');
    setCaption('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona solo archivos de imagen",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      // Convertir archivo a base64 para mostrar preview
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string;
        await addPhoto(imageUrl, caption || `Foto ${photos.length + 1}`, photos.length === 0);
        setCaption('');
        
        toast({
          title: "Foto subida",
          description: "Tu foto ha sido agregada exitosamente",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir la foto",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Agregar Nueva Foto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-semibold">Subir desde Dispositivo</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="caption" className="text-white">Descripción (opcional)</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Descripción de la foto..."
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button 
                    type="button"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 cursor-pointer"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Seleccionar Foto
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* URL Upload */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-semibold">O agregar por URL</h4>
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div>
                <Label htmlFor="photo_url" className="text-white">URL de la Foto</Label>
                <Input
                  id="photo_url"
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700" 
                disabled={loading}
              >
                {loading ? 'Agregando...' : 'Agregar por URL'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Photos Gallery */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Mis Fotos ({photos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No tienes fotos aún
              </h3>
              <p className="text-gray-300 mb-4">
                Agrega fotos para hacer tu perfil más atractivo.
              </p>
              <p className="text-sm text-gray-400">
                Puedes subir fotos desde tu dispositivo o agregar por URL
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/20">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || `Foto ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-2">
                    {photo.is_primary && (
                      <div className="bg-yellow-500 text-white p-1.5 rounded-full shadow-lg">
                        <Star className="w-4 h-4" />
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500/90 hover:bg-red-500 shadow-lg"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-3 text-sm rounded-b-lg">
                      {photo.caption}
                    </div>
                  )}

                  {photo.is_primary && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Foto Principal
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-2">📸 Consejos para Fotos</h4>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Usa fotos de alta calidad y bien iluminadas</li>
          <li>• Incluye al menos 3-5 fotos diferentes</li>
          <li>• La primera foto será tu foto principal automáticamente</li>
          <li>• Evita contenido inapropiado o explícito</li>
          <li>• Usa fotos recientes que te representen bien</li>
          <li>• Máximo 5MB por foto</li>
        </ul>
      </div>
    </div>
  );
};

export default CompanionPhotosManager;
