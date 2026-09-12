CREATE TABLE public.promotion_plans_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_visible boolean NOT NULL DEFAULT false,
  title text NOT NULL DEFAULT 'Planes de Promoción',
  plans jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.promotion_plans_settings TO anon;
GRANT SELECT ON public.promotion_plans_settings TO authenticated;
GRANT ALL ON public.promotion_plans_settings TO service_role;

ALTER TABLE public.promotion_plans_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read promotion plans settings"
ON public.promotion_plans_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can update promotion plans settings"
ON public.promotion_plans_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert promotion plans settings"
ON public.promotion_plans_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_promotion_plans_settings_updated_at
BEFORE UPDATE ON public.promotion_plans_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO public.promotion_plans_settings (is_visible, title, plans)
VALUES (
  false,
  'Planes de Promoción',
  '[
    {"id": "basic", "name": "Básico", "price": 99, "popular": false, "features": ["Perfil visible en búsquedas", "Hasta 5 fotos", "Chat básico", "Soporte estándar"]},
    {"id": "premium", "name": "Premium", "price": 199, "popular": true, "features": ["Todo del plan Básico", "Hasta 15 fotos", "Prioridad en búsquedas", "Video llamadas", "Soporte prioritario"]},
    {"id": "vip", "name": "VIP", "price": 399, "popular": false, "features": ["Todo del plan Premium", "Fotos ilimitadas", "Destacado especial", "Manager personal", "Comisiones reducidas"]}
  ]'::jsonb
);