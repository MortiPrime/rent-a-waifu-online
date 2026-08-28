import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DonationSettings {
  id?: string;
  bank_name: string;
  clabe: string;
  account_holder: string | null;
  extra_note: string | null;
  is_active: boolean;
}

const EMPTY: DonationSettings = {
  bank_name: '',
  clabe: '',
  account_holder: '',
  extra_note: '',
  is_active: true,
};

export const AdminDonationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<DonationSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('donation_settings')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        toast({ title: 'Error', description: 'No se pudo cargar la configuración', variant: 'destructive' });
      } else if (data) {
        setSettings({
          id: data.id,
          bank_name: data.bank_name ?? '',
          clabe: data.clabe ?? '',
          account_holder: data.account_holder ?? '',
          extra_note: data.extra_note ?? '',
          is_active: data.is_active,
        });
      }
      setLoading(false);
    };
    load();
  }, [toast]);

  const handleSave = async () => {
    if (!/^\d{18}$/.test(settings.clabe.trim())) {
      toast({ title: 'CLABE inválida', description: 'La CLABE debe tener 18 dígitos.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const payload = {
      bank_name: settings.bank_name.trim() || 'Banco',
      clabe: settings.clabe.trim(),
      account_holder: settings.account_holder?.trim() || null,
      extra_note: settings.extra_note?.trim() || null,
      is_active: settings.is_active,
    };

    const { data, error } = settings.id
      ? await supabase.from('donation_settings').update(payload).eq('id', settings.id).select().maybeSingle()
      : await supabase.from('donation_settings').insert(payload).select().maybeSingle();

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    if (data?.id) setSettings((prev) => ({ ...prev, id: data.id }));
    toast({ title: 'Guardado', description: 'La información de donación se actualizó.' });
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
        <CardTitle>Datos de donación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bank">Banco</Label>
            <Input
              id="bank"
              value={settings.bank_name}
              onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
              placeholder="Nu Bank"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clabe">CLABE (18 dígitos)</Label>
            <Input
              id="clabe"
              inputMode="numeric"
              maxLength={18}
              value={settings.clabe}
              onChange={(e) => setSettings({ ...settings, clabe: e.target.value.replace(/\D/g, '') })}
              placeholder="638180000192603131"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="holder">Titular de la cuenta</Label>
          <Input
            id="holder"
            value={settings.account_holder ?? ''}
            onChange={(e) => setSettings({ ...settings, account_holder: e.target.value })}
            placeholder="Nombre del titular"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Nota adicional</Label>
          <Textarea
            id="note"
            rows={3}
            value={settings.extra_note ?? ''}
            onChange={(e) => setSettings({ ...settings, extra_note: e.target.value })}
            placeholder="Mensaje que verán los usuarios en la página de donaciones"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-surface-border/20 p-3">
          <div>
            <p className="font-medium">Mostrar en la página de donaciones</p>
            <p className="text-sm text-muted-foreground">Si se desactiva, no se muestra la CLABE.</p>
          </div>
          <Switch
            checked={settings.is_active}
            onCheckedChange={(v) => setSettings({ ...settings, is_active: v })}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="brand-button">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar cambios
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminDonationSettings;
