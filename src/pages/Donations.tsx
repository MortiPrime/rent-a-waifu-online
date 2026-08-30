import { useEffect, useState } from 'react';
import { Heart, Coffee, Star, Gift, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageShell from '@/components/layout/PageShell';
import SectionHeading from '@/components/layout/SectionHeading';
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
    <PageShell width="narrow">
      <SectionHeading
        title="Apoya la"
        highlight="Plataforma"
        subtitle="Esta plataforma es completamente gratuita. Si te gusta lo que hacemos, considera apoyarnos con una donación voluntaria para seguir mejorando."
      />

      <AnnouncementBanner location="donations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10">
        {donationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.amount} className="surface-card surface-card-hover rounded-2xl">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-brand to-brand-glow flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-7 h-7 text-brand-foreground" />
                </div>
                <CardTitle className="text-surface-foreground text-lg">{option.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-surface-foreground mb-4">${option.amount} MXN</p>
                <Button className="w-full brand-button">Donar ${option.amount}</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {donationInfo && (
        <Card className="surface-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-surface-foreground text-center">Donación por transferencia</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-surface-foreground/70">
              También puedes apoyarnos directamente por transferencia bancaria:
            </p>
            <div className="surface-card rounded-xl p-5 inline-block text-left">
              <p className="text-surface-foreground font-semibold text-lg">{donationInfo.bank_name}</p>
              <p className="text-surface-foreground/80 text-sm font-mono mt-1">CLABE: {donationInfo.clabe}</p>
              {donationInfo.account_holder && (
                <p className="text-surface-foreground/60 text-sm mt-1">Titular: {donationInfo.account_holder}</p>
              )}
              <Button variant="ghost" size="sm" onClick={copyClabe} className="mt-3 text-surface-foreground hover:!bg-surface/20">
                <Copy className="w-4 h-4 mr-2" /> Copiar CLABE
              </Button>
            </div>
            <p className="text-surface-foreground/60 text-sm">
              {donationInfo.extra_note || '¡Cada aportación nos ayuda a mantener la plataforma gratuita para todos!'}
            </p>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
};

export default Donations;
