import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Star, X } from 'lucide-react';

interface PromotionPlan {
  id: string;
  name: string;
  price: number;
  popular: boolean;
  features: string[];
}

interface PromotionPlansSettings {
  id?: string;
  is_visible: boolean;
  title: string;
  plans: PromotionPlan[];
}

const EMPTY: PromotionPlansSettings = {
  is_visible: false,
  title: 'Planes de Promoción',
  plans: [],
};

export const AdminPromotionPlansSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PromotionPlansSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('promotion_plans_settings')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        toast({ title: 'Error', description: 'No se pudo cargar la configuración', variant: 'destructive' });
      } else if (data) {
        setSettings({
          id: data.id,
          is_visible: data.is_visible,
          title: data.title ?? 'Planes de Promoción',
          plans: Array.isArray(data.plans) ? (data.plans as unknown as PromotionPlan[]) : [],
        });
      }
      setLoading(false);
    };
    load();
  }, [toast]);

  const updatePlan = (planId: string, patch: Partial<PromotionPlan>) => {
    setSettings((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, ...patch } : p)),
    }));
  };

  const addFeature = (planId: string) => {
    const text = (newFeature[planId] ?? '').trim();
    if (!text) return;
    const plan = settings.plans.find((p) => p.id === planId);
    if (!plan) return;
    updatePlan(planId, { features: [...plan.features, text] });
    setNewFeature((prev) => ({ ...prev, [planId]: '' }));
  };

  const removeFeature = (planId: string, index: number) => {
    const plan = settings.plans.find((p) => p.id === planId);
    if (!plan) return;
    updatePlan(planId, { features: plan.features.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    for (const plan of settings.plans) {
      if (!plan.name.trim()) {
        toast({ title: 'Nombre faltante', description: 'Cada plan necesita un nombre.', variant: 'destructive' });
        return;
      }
      if (plan.price < 0) {
        toast({ title: 'Precio inválido', description: 'El precio no puede ser negativo.', variant: 'destructive' });
        return;
      }
    }

    setSaving(true);
    const payload = {
      is_visible: settings.is_visible,
      title: settings.title.trim() || 'Planes de Promoción',
      plans: settings.plans.map((p) => ({
        id: p.id,
        name: p.name.trim(),
        price: p.price,
        popular: p.popular,
        features: p.features.map((f) => f.trim()).filter(Boolean),
      })),
    };

    const { data, error } = settings.id
      ? await supabase.from('promotion_plans_settings').update(payload).eq('id', settings.id).select().maybeSingle()
      : await supabase.from('promotion_plans_settings').insert(payload).select().maybeSingle();

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    if (data?.id) setSettings((prev) => ({ ...prev, id: data.id }));
    toast({ title: 'Guardado', description: 'Los planes de promoción se actualizaron.' });
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
        <CardTitle>Planes de promoción</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-surface-border/20 p-3">
          <div>
            <p className="font-medium">Mostrar sección en la página</p>
            <p className="text-sm text-muted-foreground">
              Mientras esté desactivada, la página "Conviértete en Companion" no muestra los planes.
            </p>
          </div>
          <Switch
            checked={settings.is_visible}
            onCheckedChange={(v) => setSettings({ ...settings, is_visible: v })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plans-title">Título de la sección</Label>
          <Input
            id="plans-title"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            placeholder="Planes de Promoción"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {settings.plans.map((plan) => (
            <div key={plan.id} className="space-y-3 rounded-lg border border-surface-border/20 p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="uppercase">{plan.id}</Badge>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  Popular
                  <Switch
                    checked={plan.popular}
                    onCheckedChange={(v) => updatePlan(plan.id, { popular: v })}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={plan.name}
                  onChange={(e) => updatePlan(plan.id, { name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Precio mensual (MXN)</Label>
                <Input
                  type="number"
                  min={0}
                  value={plan.price}
                  onChange={(e) => updatePlan(plan.id, { price: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label>Beneficios</Label>
                <ul className="space-y-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 rounded border border-surface-border/20 px-2 py-1 text-sm">
                      <span className="truncate">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(plan.id, i)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Quitar beneficio"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    value={newFeature[plan.id] ?? ''}
                    onChange={(e) => setNewFeature((prev) => ({ ...prev, [plan.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature(plan.id))}
                    placeholder="Nuevo beneficio"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => addFeature(plan.id)} aria-label="Agregar beneficio">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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

export default AdminPromotionPlansSettings;
