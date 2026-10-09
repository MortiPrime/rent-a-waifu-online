import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MessageCircle, Tag } from 'lucide-react';
import type { CompanionService } from './CompanionServicesManager';

interface Props {
  companionUserId: string;
  companionName: string;
  canMessage: boolean;
}

const CompanionServicesList = ({ companionUserId, companionName, canMessage }: Props) => {
  const [services, setServices] = useState<CompanionService[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from('companion_services')
      .select('*')
      .eq('user_id', companionUserId)
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => setServices((data as CompanionService[]) || []));
  }, [companionUserId]);

  if (services.length === 0) return null;

  const ask = (title: string) =>
    navigate(`/messages?to=${companionUserId}&name=${encodeURIComponent(companionName)}&service=${encodeURIComponent(title)}`);

  return (
    <section className="space-y-2">
      <h4 className="flex items-center gap-2 font-semibold"><Tag className="h-4 w-4" />Servicios</h4>
      {services.map((s) => (
        <div key={s.id} className="rounded-lg border border-surface-border/20 bg-surface/5 p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">{s.title}</p>
            <span className="whitespace-nowrap rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">
              ${Number(s.price).toLocaleString('es-MX')} MXN · {s.price_unit}
            </span>
          </div>
          {s.description && <p className="mt-1 text-sm text-surface-foreground/70">{s.description}</p>}
          {canMessage && (
            <Button size="sm" variant="ghost" className="mt-2 h-7 px-2 text-brand" onClick={() => ask(s.title)}>
              <MessageCircle className="mr-1 h-3.5 w-3.5" />Consultar este servicio
            </Button>
          )}
        </div>
      ))}
    </section>
  );
};

export default CompanionServicesList;
