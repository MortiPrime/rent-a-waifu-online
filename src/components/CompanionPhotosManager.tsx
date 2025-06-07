
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Camera, Upload, X, Star, ImageIcon, Plus } from 'lucide-react';
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

    try {
      await addPhoto(newPhotoUrl, caption, photos.length === 0);
      setNewPhotoUrl('');
      setCaption('');
      toast({
        title: "Foto agregada",
        description: "Tu foto ha sido agregada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar la foto",
        variant: "destructive",
      });
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
      const imageUrl = await convertFileToBase64(file);
      await addPhoto(imageUrl, caption || `Foto ${photos.length + 1}`, photos.length === 0);
      setCaption('');
      
      toast({
        title: "Foto subida",
        description: "Tu foto ha sido agregada exitosamente",
      });
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

  const handleRemovePhoto = async (photoId: string) => {
    try {
      await removePhoto(photoId);
      toast({
        title: "Foto eliminada",
        description: "La foto ha sido eliminada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la foto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-pink-400" />
            Agregar Nueva Foto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload - Primary Method */}
          <div className="space-y-4 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg">
            <div className="text-center">
              <Camera className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold text-lg mb-2">Subir desde tu Dispositivo</h4>
              <p className="text-white/70 mb-4">Sube fotos directamente desde tu celular o computadora</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="caption" className="text-white font-medium">Descripción (opcional)</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Descripción de la foto..."
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400"
                />
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="w-full">
                  <Button 
                    type="button"
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 cursor-pointer text-lg py-6"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Subiendo foto...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-3" />
                          Seleccionar Foto
                        </>
                      )}
                    </span>
                  </Button>
                </label>
                <p className="text-white/60 text-sm text-center">
                  Formatos: JPG, PNG, GIF • Máximo 5MB
                </p>
              </div>
            </div>
          </div>

          {/* URL Upload - Secondary Method */}
          <div className="space-y-4 p-4 bg-white/5 border border-white/20 rounded-lg">
            <h4 className="text-white font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              O agregar por URL
            </h4>
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div>
                <Input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700" 
                disabled={loading || !newPhotoUrl.trim()}
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
            <Camera className="w-5 h-5 text-pink-400" />
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
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/20 hover:border-pink-400/50 transition-all duration-300">
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
                      onClick={() => handleRemovePhoto(photo.id)}
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
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Principal
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
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          📸 Consejos para Fotos Perfectas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-white/80 text-sm space-y-2">
            <li>• Usa fotos de alta calidad y bien iluminadas</li>
            <li>• Incluye al menos 3-5 fotos diferentes</li>
            <li>• La primera foto será tu foto principal</li>
            <li>• Sonríe y muestra tu personalidad</li>
          </ul>
          <ul className="text-white/80 text-sm space-y-2">
            <li>• Evita contenido inapropiado</li>
            <li>• Usa fotos recientes y auténticas</li>
            <li>• Máximo 5MB por foto</li>
            <li>• Formatos: JPG, PNG, GIF</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanionPhotosManager;
