import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const linkClass = 'text-surface-foreground/60 transition-colors hover:text-brand';

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterConfig {
  brand_name: string;
  tagline: string;
  contact_email: string | null;
  terms_text: string | null;
  privacy_text: string | null;
  copyright_text: string | null;
  links: FooterLink[];
}

export const DEFAULT_FOOTER: FooterConfig = {
  brand_name: 'AnimeDating',
  tagline: 'Conecta con personas reales y auténticas en un ambiente seguro y respetuoso.',
  contact_email: 'soporte@animedating.com',
  terms_text: 'Términos y Condiciones',
  privacy_text: 'Política de Privacidad',
  copyright_text: 'AnimeDating. Todos los derechos reservados.',
  links: [
    { label: 'Catálogo', url: '/catalog' },
    { label: 'Ser Companion', url: '/become-companion' },
    { label: 'Donaciones', url: '/donations' },
  ],
};

const Footer = () => {
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from('footer_settings')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!active || !data) return;
      setConfig({
        brand_name: data.brand_name || DEFAULT_FOOTER.brand_name,
        tagline: data.tagline || DEFAULT_FOOTER.tagline,
        contact_email: data.contact_email,
        terms_text: data.terms_text,
        privacy_text: data.privacy_text,
        copyright_text: data.copyright_text,
        links: Array.isArray(data.links) ? (data.links as unknown as FooterLink[]) : [],
      });
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const legalItems = [config.terms_text, config.privacy_text].filter(Boolean) as string[];

  return (
    <footer className="mt-16 border-t border-surface-border/10 bg-surface/[0.04] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-6 w-6 text-brand" />
              <span className="editorial-title text-2xl">{config.brand_name}</span>
            </div>
            <p className="max-w-xs text-sm text-surface-foreground/60">{config.tagline}</p>
          </div>

          {config.links.length > 0 && (
            <div>
              <h4 className="mb-3 text-xs uppercase tracking-[0.22em] text-surface-foreground/50">Navegación</h4>
              <ul className="space-y-2 text-sm">
                {config.links.map((link) => (
                  <li key={`${link.label}-${link.url}`}>
                    {link.url.startsWith('http') ? (
                      <a href={link.url} target="_blank" rel="noreferrer" className={linkClass}>
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.url} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(legalItems.length > 0 || config.contact_email) && (
            <div>
              <h4 className="mb-3 text-xs uppercase tracking-[0.22em] text-surface-foreground/50">Legal</h4>
              <ul className="space-y-2 text-sm text-surface-foreground/60">
                {legalItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                {config.contact_email && <li>Contacto: {config.contact_email}</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-surface-border/10 pt-6 text-center">
          <p className="text-sm text-surface-foreground/40">
            © {new Date().getFullYear()} {config.copyright_text || DEFAULT_FOOTER.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
