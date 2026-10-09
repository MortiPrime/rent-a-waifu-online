import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles as Gem, Plus, Trash2, Save } from 'lucide-react';

export interface CompanionService {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  price_unit: string;
  is_active: boolean;
  display_order: number;
}

export const PRICE_UNITS = ['por sesión', 'por hora', 'por medio día', 'por día', 'por evento', 'por mensaje'];

const CompanionServicesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<CompanionService[]>([]);
  const [draft, setDraft] = useState({ title: '', description: '', price: '', price_unit: 'por hora' });

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('companion_services')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order');
    setServices((data as CompanionService[]) || []);
  };

  useEffect(() => { load(); }, [user?.id]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !draft.title.trim()) return;
    const { error } = await supabase.from('companion_services').insert({
      user_id: user.id,
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      price: Number(draft.price) || 0,
      price_unit: draft.price_unit,
      display_order: services.length,
    });
    if (error) return toast({ title: 'No se pudo guardar', description: error.message, variant: 'destructive' });
    setDraft({ title: '', description: '', price: '', price_unit: 'por hora' });
    toast({ title: 'Servicio agregado' });
    load();
  };

  const update = (id: string, patch: Partial<CompanionService>) =>
    setServices((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const save = async (svc: CompanionService) => {
    const { error } = await supabase
      .from('companion_services')
      .update({ title: svc.title, description: svc.description, price: Number(svc.price) || 0, price_unit: svc.price_unit, is_active: svc.is_active })
      .eq('id', svc.id);
    toast(error ? { title: 'Error', description: error.message, variant: 'destructive' } : { title: 'Cambios guardados' });
  };

  const remove = async (id: string) => {
    await supabase.from('companion_services').delete().eq('id', id);
    load();
  };

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Gem className="h-5 w-5 text-brand" />Mis servicios y precios</CardTitle>
        <p className="text-sm text-surface-foreground/65">Sé creativa: por ejemplo "1 hora de café y charla" o "Medio día de compañía en convención".</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={add} className="grid gap-3 rounded-lg border border-surface-border/20 p-4 md:grid-cols-2">
          <Input placeholder="Título del servicio" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={80} className="field-dark md:col-span-2" />
          <Textarea placeholder="¿Qué incluye?" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={500} className="field-dark md:col-span-2" />
          <Input type="number" min={0} placeholder="Precio MXN" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className="field-dark" />
          <Select value={draft.price_unit} onValueChange={(v) => setDraft({ ...draft, price_unit: v })}>
            <SelectTrigger className="field-dark"><SelectValue /></SelectTrigger>
            <SelectContent>{PRICE_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
          <Button type="submit" className="brand-button md:col-span-2"><Plus className="mr-2 h-4 w-4" />Agregar servicio</Button>
        </form>

        {services.length === 0 && <p className="text-center text-sm text-surface-foreground/55">Aún no tienes servicios.</p>}
        {services.map((svc) => (
          <div key={svc.id} className="grid gap-2 rounded-lg bg-surface/5 p-4 md:grid-cols-2">
            <Input value={svc.title} onChange={(e) => update(svc.id, { title: e.target.value })} className="field-dark md:col-span-2" />
            <Textarea value={svc.description || ''} onChange={(e) => update(svc.id, { description: e.target.value })} className="field-dark md:col-span-2" />
            <Input type="number" value={svc.price} onChange={(e) => update(svc.id, { price: Number(e.target.value) })} className="field-dark" />
            <Select value={svc.price_unit} onValueChange={(v) => update(svc.id, { price_unit: v })}>
              <SelectTrigger className="field-dark"><SelectValue /></SelectTrigger>
              <SelectContent>{PRICE_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex items-center justify-between md:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={svc.is_active} onCheckedChange={(v) => update(svc.id, { is_active: v })} />
                {svc.is_active ? 'Visible' : 'Pausado'}
              </label>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => remove(svc.id)}><Trash2 className="h-4 w-4" /></Button>
                <Button size="sm" className="brand-button" onClick={() => save(svc)}><Save className="mr-1 h-4 w-4" />Guardar</Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CompanionServicesManager;
