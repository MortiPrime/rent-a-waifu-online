
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Camera, Upload, X, Star, ImageIcon, Plus, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CompanionPhoto } from '@/types';

interface SortablePhotoProps {
  photo: CompanionPhoto;
  index: number;
  onRemove: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

const SortablePhoto = ({ photo, index, onRemove, onSetPrimary }: SortablePhotoProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className={`aspect-square rounded-lg overflow-hidden bg-white/5 border-2 transition-all duration-300 ${
        photo.is_primary ? 'border-yellow-400/70 shadow-lg shadow-yellow-400/20' : 'border-white/20 hover:border-pink-400/50'
      }`}>
        <img
          src={photo.photo_url}
          alt={photo.caption || `Foto ${index + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
        />
      </div>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        title="Arrastra para reordenar"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {!photo.is_primary && (
          <Button
            size="sm"
            className="bg-yellow-500/90 hover:bg-yellow-500 shadow-lg h-8 w-8 p-0"
            onClick={() => onSetPrimary(photo.id)}
            title="Establecer como principal"
          >
            <Star className="w-3.5 h-3.5" />
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          className="bg-red-500/90 hover:bg-red-500 shadow-lg h-8 w-8 p-0"
          onClick={() => onRemove(photo.id)}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Primary badge */}
      {photo.is_primary && (
        <div className="absolute top-2 left-2 group-hover:left-10">
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3" />Principal
          </span>
        </div>
      )}

      {/* Caption */}
      {photo.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2.5 text-sm rounded-b-lg truncate">
          {photo.caption}
        </div>
      )}
    </div>
  );
};

const CompanionPhotosManager = () => {
  const { photos, addPhoto, removePhoto, setPrimaryPhoto, reorderPhotos, loading } = useCompanionProfile();
  const { toast } = useToast();
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sortedPhotos = [...photos].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedPhotos.findIndex(p => p.id === active.id);
    const newIndex = sortedPhotos.findIndex(p => p.id === over.id);
    const reordered = arrayMove(sortedPhotos, oldIndex, newIndex);

    try {
      await reorderPhotos(reordered);
      toast({ title: "Fotos reordenadas", description: "El orden de tus fotos ha sido actualizado" });
    } catch {
      toast({ title: "Error", description: "No se pudo reordenar las fotos", variant: "destructive" });
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    try {
      await setPrimaryPhoto(photoId);
      toast({ title: "Foto principal actualizada", description: "Se ha cambiado tu foto principal" });
    } catch {
      toast({ title: "Error", description: "No se pudo cambiar la foto principal", variant: "destructive" });
    }
  };

  const MAX_PHOTOS = 10;
  const canAddMore = photos.length < MAX_PHOTOS;

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    if (!canAddMore) {
      toast({ title: "Límite alcanzado", description: `Máximo ${MAX_PHOTOS} fotos permitidas`, variant: "destructive" });
      return;
    }
    try {
      await addPhoto(newPhotoUrl, caption, photos.length === 0);
      setNewPhotoUrl('');
      setCaption('');
      toast({ title: "Foto agregada", description: "Tu foto ha sido agregada exitosamente" });
    } catch {
      toast({ title: "Error", description: "No se pudo agregar la foto", variant: "destructive" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Por favor selecciona solo archivos de imagen", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "La imagen debe ser menor a 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      await addPhoto(file, caption || `Foto ${photos.length + 1}`, photos.length === 0);
      setCaption('');
      toast({ title: "Foto subida", description: "Tu foto ha sido subida exitosamente al servidor" });
    } catch {
      toast({ title: "Error", description: "No se pudo subir la foto", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async (photoId: string) => {
    try {
      await removePhoto(photoId);
      toast({ title: "Foto eliminada", description: "La foto ha sido eliminada exitosamente" });
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar la foto", variant: "destructive" });
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
          {/* File Upload */}
          <div className="space-y-4 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg">
            <div className="text-center">
              <Camera className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold text-lg mb-2">Subir desde tu Dispositivo</h4>
              <p className="text-white/70 mb-4">Sube fotos directamente desde tu celular o computadora</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="caption" className="text-white font-medium">Descripción (opcional)</Label>
                <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)}
                  placeholder="Descripción de la foto..."
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400" />
              </div>
              <div className="flex flex-col items-center gap-4">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="w-full">
                  <Button type="button" size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 cursor-pointer text-lg py-6"
                    disabled={uploading} asChild>
                    <span>
                      {uploading ? (
                        <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Subiendo foto...</>
                      ) : (
                        <><Plus className="w-5 h-5 mr-3" />Seleccionar Foto</>
                      )}
                    </span>
                  </Button>
                </label>
                <p className="text-white/60 text-sm text-center">Formatos: JPG, PNG, GIF • Máximo 5MB</p>
              </div>
            </div>
          </div>

          {/* URL Upload */}
          <div className="space-y-4 p-4 bg-white/5 border border-white/20 rounded-lg">
            <h4 className="text-white font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />O agregar por URL
            </h4>
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <Input type="url" value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-pink-400" />
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                disabled={loading || !newPhotoUrl.trim()}>
                {loading ? 'Agregando...' : 'Agregar por URL'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Photos Gallery with Drag & Drop */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-pink-400" />Mis Fotos ({photos.length})
          </CardTitle>
          {photos.length > 1 && (
            <p className="text-white/60 text-sm mt-1">
              <GripVertical className="w-3.5 h-3.5 inline-block mr-1" />
              Arrastra las fotos para reordenarlas • Haz clic en <Star className="w-3.5 h-3.5 inline-block mx-0.5 text-yellow-400" /> para cambiar la foto principal
            </p>
          )}
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No tienes fotos aún</h3>
              <p className="text-gray-300 mb-4">Agrega fotos para hacer tu perfil más atractivo.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sortedPhotos.map(p => p.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedPhotos.map((photo, index) => (
                    <SortablePhoto
                      key={photo.id}
                      photo={photo}
                      index={index}
                      onRemove={handleRemovePhoto}
                      onSetPrimary={handleSetPrimary}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />📸 Consejos para Fotos Perfectas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-white/80 text-sm space-y-2">
            <li>• Usa fotos de alta calidad y bien iluminadas</li>
            <li>• Incluye al menos 3-5 fotos diferentes</li>
            <li>• Arrastra las fotos para ordenarlas a tu gusto</li>
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
