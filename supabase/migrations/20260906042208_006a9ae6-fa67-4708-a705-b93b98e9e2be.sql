CREATE TABLE public.footer_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL DEFAULT 'AnimeDating',
  tagline text NOT NULL DEFAULT 'Conecta con personas reales y auténticas en un ambiente seguro y respetuoso.',
  contact_email text,
  terms_text text,
  privacy_text text,
  copyright_text text,
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.footer_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.footer_settings TO authenticated;
GRANT ALL ON public.footer_settings TO service_role;

ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view footer settings" ON public.footer_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert footer settings" ON public.footer_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update footer settings" ON public.footer_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete footer settings" ON public.footer_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_footer_settings_updated_at BEFORE UPDATE ON public.footer_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.footer_settings (contact_email, terms_text, privacy_text, copyright_text, links)
VALUES ('soporte@animedating.com', 'Términos y Condiciones', 'Política de Privacidad', 'AnimeDating. Todos los derechos reservados.',
'[{"label":"Catálogo","url":"/catalog"},{"label":"Ser Companion","url":"/become-companion"},{"label":"Donaciones","url":"/donations"}]'::jsonb);