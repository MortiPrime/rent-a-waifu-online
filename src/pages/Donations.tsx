import { useEffect, useState } from 'react';
import { Heart, Coffee, Star, Gift, Copy, Landmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/layout/PageShell';
import SectionHeading from '@/components/layout/SectionHeading';
import { BentoGrid, BentoTile } from '@/components/layout/BentoGrid';
import AnnouncementBanner from '@/components/AnnouncementBanner';

interface DonationInfo {
  bank_name: string;
  clabe: string;
  account_holder: string | null;
  extra_note: string | null;
}

const Donations = () => {
  const { toast } = useToast();
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('donation_settings')
        .select('bank_name, clabe, account_holder, extra_note')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (data) setDonationInfo(data);
    };
    load();
  }, []);

  const copyClabe = async () => {
    if (!donationInfo?.clabe) return;
    await navigator.clipboard.writeText(donationInfo.clabe);
    toast({ title: 'CLABE copiada', description: 'Ya puedes pegarla en tu app bancaria.' });
  };

  const donationOptions = [
    { amount: 50, icon: Coffee, label: 'Un café' },
    { amount: 100, icon: Heart, label: 'Apoyo básico' },
    { amount: 250, icon: Star, label: 'Apoyo premium' },
    { amount: 500, icon: Gift, label: 'Super apoyo' },
  ];

  return (
    <PageShell>
      <SectionHeading
        title="Apoya la"
        highlight="plataforma"
        align="left"
        subtitle="Esta plataforma es completamente gratuita. Si te gusta lo que hacemos, considera apoyarnos con una donación voluntaria para seguir mejorando."
      />

      <AnnouncementBanner location="donations" />

      <BentoGrid className="mt-8">
        {donationInfo && (
          <BentoTile size="md" tone="gold" className="flex flex-col justify-between gap-6 p-8">
            <div>
              <Landmark className="mb-4 h-8 w-8 text-gold" />
              <h2 className="editorial-title text-3xl">Transferencia bancaria</h2>
              <p className="mt-2 text-sm text-surface-foreground/70">
                La forma más directa de apoyarnos, sin comisiones.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-border/20 bg-surface/10 p-5">
              <p className="text-lg font-semibold text-surface-foreground">{donationInfo.bank_name}</p>
              <p className="mt-1 break-all font-mono text-sm text-surface-foreground/80">
                CLABE: {donationInfo.clabe}
              </p>
              {donationInfo.account_holder && (
                <p className="mt-1 text-sm text-surface-foreground/60">Titular: {donationInfo.account_holder}</p>
              )}
              <Button onClick={copyClabe} className="brand-button mt-4 w-full">
                <Copy className="mr-2 h-4 w-4" /> Copiar CLABE
              </Button>
            </div>
            <p className="text-sm text-surface-foreground/60">
              {donationInfo.extra_note || '¡Cada aportación nos ayuda a mantener la plataforma gratuita para todos!'}
            </p>
          </BentoTile>
        )}

        <BentoTile size="md" className="flex flex-col gap-4 p-8">
          <div>
            <h2 className="editorial-title text-3xl">Elige tu aportación</h2>
            <p className="mt-2 text-sm text-surface-foreground/70">
              Cualquier cantidad ayuda a pagar el servidor y seguir mejorando.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {donationOptions.map(({ icon: Icon, ...option }) => (
              <div
                key={option.amount}
                className="rounded-2xl border border-surface-border/15 bg-surface/[0.07] p-5 text-center transition-colors hover:border-brand/40"
              >
                <Icon className="mx-auto mb-3 h-6 w-6 text-brand" />
                <p className="text-sm text-surface-foreground/70">{option.label}</p>
                <p className="editorial-title mt-1 text-3xl">${option.amount}</p>
                <p className="text-xs text-surface-foreground/50">MXN</p>
              </div>
            ))}
          </div>
        </BentoTile>

        <BentoTile size="full" className="text-center">
          <Heart className="mx-auto mb-3 h-7 w-7 text-brand" />
          <p className="text-surface-foreground/75">
            Gracias por apoyar un espacio seguro, verificado y gratuito para todos.
          </p>
        </BentoTile>
      </BentoGrid>
    </PageShell>
  );
};

export default Donations;
