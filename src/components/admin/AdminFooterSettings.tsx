import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { DEFAULT_FOOTER, type FooterConfig, type FooterLink } from '@/components/Footer';

export const AdminFooterSettings = () => {
  const { toast } = useToast();
  const [id, setId] = useState<string | null>(null);
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        toast({ title: 'Error', description: 'No se pudo cargar el pie de página', variant: 'destructive' });
      } else if (data) {
        setId(data.id);
        setConfig({
          brand_name: data.brand_name ?? '',
          tagline: data.tagline ?? '',
          contact_email: data.contact_email,
          terms_text: data.terms_text,
          privacy_text: data.privacy_text,
          copyright_text: data.copyright_text,
          links: Array.isArray(data.links) ? (data.links as unknown as FooterLink[]) : [],
        });
      }
      setLoading(false);
    };
    load();
  }, [toast]);

  const updateLink = (index: number, patch: Partial<FooterLink>) =>
    setConfig((prev) => ({
      ...prev,
      links: prev.links.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    }));

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      brand_name: config.brand_name.trim() || DEFAULT_FOOTER.brand_name,
      tagline: config.tagline.trim() || DEFAULT_FOOTER.tagline,
      contact_email: config.contact_email?.trim() || null,
      terms_text: config.terms_text?.trim() || null,
      privacy_text: config.privacy_text?.trim() || null,
      copyright_text: config.copyright_text?.trim() || null,
      links: config.links
        .filter((link) => link.label.trim() && link.url.trim())
        .map((link) => ({ label: link.label.trim(), url: link.url.trim() })),
    };

    const { data, error } = id
      ? await supabase.from('footer_settings').update(payload).eq('id', id).select().maybeSingle()
      : await supabase.from('footer_settings').insert(payload).select().maybeSingle();

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    if (data?.id) setId(data.id);
    toast({ title: 'Guardado', description: 'El pie de página se actualizó.' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle>Pie de página</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Nombre de la marca</Label>
            <Input
              id="brand"
              value={config.brand_name}
              onChange={(e) => setConfig({ ...config, brand_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo de contacto</Label>
            <Input
              id="email"
              value={config.contact_email ?? ''}
              onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
              placeholder="soporte@animedating.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Descripción</Label>
          <Textarea
            id="tagline"
            rows={2}
            value={config.tagline}
            onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="terms">Texto de términos</Label>
            <Input
              id="terms"
              value={config.terms_text ?? ''}
              onChange={(e) => setConfig({ ...config, terms_text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="privacy">Texto de privacidad</Label>
            <Input
              id="privacy"
              value={config.privacy_text ?? ''}
              onChange={(e) => setConfig({ ...config, privacy_text: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="copyright">Aviso de derechos (después del año)</Label>
          <Input
            id="copyright"
            value={config.copyright_text ?? ''}
            onChange={(e) => setConfig({ ...config, copyright_text: e.target.value })}
            placeholder="AnimeDating. Todos los derechos reservados."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Enlaces de navegación</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfig({ ...config, links: [...config.links, { label: '', url: '' }] })}
            >
              <Plus className="mr-1 h-4 w-4" /> Agregar
            </Button>
          </div>

          {config.links.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin enlaces. Agrega el primero.</p>
          )}

          {config.links.map((link, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-lg border border-surface-border/20 p-3 sm:flex-row">
              <Input
                value={link.label}
                onChange={(e) => updateLink(index, { label: e.target.value })}
                placeholder="Texto (Catálogo)"
              />
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, { url: e.target.value })}
                placeholder="/catalog o https://..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setConfig({ ...config, links: config.links.filter((_, i) => i !== index) })}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={saving} className="brand-button">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar cambios
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminFooterSettings;
