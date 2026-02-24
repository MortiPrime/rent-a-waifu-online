
-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  user_role TEXT DEFAULT 'client',
  subscription_type TEXT,
  subscription_expires_at TIMESTAMPTZ,
  favorite_characters INTEGER[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_role = 'admin')
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Companion profiles
CREATE TABLE public.companion_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stage_name TEXT NOT NULL,
  real_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  description TEXT NOT NULL,
  state TEXT,
  city TEXT,
  municipality TEXT,
  contact_number TEXT,
  pricing JSONB,
  availability JSONB,
  promotion_plan TEXT DEFAULT 'basic',
  exit_rules TEXT[],
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.companion_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own companion profile" ON public.companion_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own companion profile" ON public.companion_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own companion profile" ON public.companion_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view approved companion profiles" ON public.companion_profiles FOR SELECT USING (status = 'approved' AND is_active = true);

-- Companion photos
CREATE TABLE public.companion_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  companion_id UUID NOT NULL REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.companion_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view companion photos" ON public.companion_photos FOR SELECT USING (true);
CREATE POLICY "Owners can manage their photos" ON public.companion_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companion_profiles cp WHERE cp.id = companion_id AND cp.user_id = auth.uid())
);

-- Companion rules
CREATE TABLE public.companion_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  companion_id UUID NOT NULL REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL,
  rule_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.companion_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active rules" ON public.companion_rules FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage their rules" ON public.companion_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.companion_profiles cp WHERE cp.id = companion_id AND cp.user_id = auth.uid())
);

-- Companion listings (denormalized for catalog)
CREATE TABLE public.companion_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  companion_id UUID REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  stage_name TEXT NOT NULL,
  description TEXT,
  age INTEGER,
  state TEXT,
  city TEXT,
  municipality TEXT,
  contact_number TEXT,
  pricing JSONB,
  promotion_plan TEXT DEFAULT 'basic',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(companion_id)
);

ALTER TABLE public.companion_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active listings" ON public.companion_listings FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage their listings" ON public.companion_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update their listings" ON public.companion_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their listings" ON public.companion_listings FOR DELETE USING (auth.uid() = user_id);

-- Conversations
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  character_id INTEGER NOT NULL,
  character_name TEXT NOT NULL,
  messages JSONB,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);

-- Chat sessions
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  companion_id UUID NOT NULL REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  session_type TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  total_cost NUMERIC,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.companion_profiles WHERE id = companion_id));
CREATE POLICY "Users can create chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = client_id);

-- MercadoPago transactions
CREATE TABLE public.mercadopago_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  preference_id TEXT NOT NULL,
  payment_id TEXT,
  external_reference TEXT,
  status TEXT DEFAULT 'pending',
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'MXN',
  subscription_type TEXT NOT NULL,
  subscription_months INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mercadopago_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their transactions" ON public.mercadopago_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create transactions" ON public.mercadopago_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscription history
CREATE TABLE public.subscription_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_type TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'MXN',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscription history" ON public.subscription_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create subscription records" ON public.subscription_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payment proofs
CREATE TABLE public.payment_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  payment_method TEXT NOT NULL,
  payment_month TEXT NOT NULL,
  subscription_type TEXT NOT NULL,
  proof_image_url TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their payment proofs" ON public.payment_proofs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payment proofs" ON public.payment_proofs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin actions log
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin actions" ON public.admin_actions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_role = 'admin')
);
CREATE POLICY "Admins can create admin actions" ON public.admin_actions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_role = 'admin')
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companion_profiles_updated_at BEFORE UPDATE ON public.companion_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companion_listings_updated_at BEFORE UPDATE ON public.companion_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mercadopago_transactions_updated_at BEFORE UPDATE ON public.mercadopago_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_proofs_updated_at BEFORE UPDATE ON public.payment_proofs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
