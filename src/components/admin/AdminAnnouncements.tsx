
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  display_location: string;
  created_at: string;
}

export const AdminAnnouncements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('all');

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    setAnnouncements((data as any[]) || []);
    setLoading(false);
  };

  const createAnnouncement = async () => {
    if (!title.trim() || !content.trim() || !user) return;

    const { error } = await supabase.from('announcements').insert({
      title: title.trim(),
      content: content.trim(),
      display_location: location,
      created_by: user.id,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Anuncio creado', description: 'El anuncio se publicó correctamente' });
    setTitle('');
    setContent('');
    setLocation('all');
    loadAnnouncements();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('announcements').update({ is_active: !current }).eq('id', id);
    loadAnnouncements();
  };

  const deleteAnnouncement = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    loadAnnouncements();
  };

  const locationLabel = (loc: string) => {
    const map: Record<string, string> = {
      all: 'Todas las páginas',
      catalog: 'Catálogo',
      donations: 'Donaciones',
      profiles: 'Perfiles',
    };
    return map[loc] || loc;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          Gestión de Anuncios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create form */}
        <div className="bg-white/5 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-medium">Nuevo Anuncio</h4>
          <Input
            placeholder="Título del anuncio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
          />
          <Textarea
            placeholder="Contenido del anuncio..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
          />
          <div className="flex gap-3">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white">Todas las páginas</SelectItem>
                <SelectItem value="catalog" className="text-white">Catálogo</SelectItem>
                <SelectItem value="donations" className="text-white">Donaciones</SelectItem>
                <SelectItem value="profiles" className="text-white">Perfiles</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={createAnnouncement} className="bg-gradient-to-r from-yellow-500 to-orange-500">
              <Plus className="w-4 h-4 mr-1" /> Publicar
            </Button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-white/60 text-center">Cargando...</p>
        ) : announcements.length === 0 ? (
          <p className="text-white/60 text-center">No hay anuncios creados</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium truncate">{a.title}</p>
                    <Badge className={a.is_active ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}>
                      {a.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {locationLabel(a.display_location)}
                    </Badge>
                  </div>
                  <p className="text-white/60 text-sm truncate">{a.content}</p>
                </div>
                <div className="flex gap-2 ml-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(a.id, a.is_active)}
                    className="text-white/70 hover:text-white"
                  >
                    {a.is_active ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAnnouncement(a.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
