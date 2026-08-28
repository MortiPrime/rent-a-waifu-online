CREATE TABLE public.donation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL DEFAULT 'Nu Bank',
  clabe text NOT NULL DEFAULT '',
  account_holder text,
  extra_note text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.donation_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.donation_settings TO authenticated;
GRANT ALL ON public.donation_settings TO service_role;

ALTER TABLE public.donation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view donation settings"
ON public.donation_settings FOR SELECT USING (true);

CREATE POLICY "Admins can insert donation settings"
ON public.donation_settings FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update donation settings"
ON public.donation_settings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete donation settings"
ON public.donation_settings FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_donation_settings_updated_at
BEFORE UPDATE ON public.donation_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.donation_settings (bank_name, clabe, account_holder)
VALUES ('Nu Bank', '638180000192603131', NULL);