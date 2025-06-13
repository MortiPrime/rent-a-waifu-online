/*
  # Enhanced Platform Features

  1. New Tables
    - `companion_availability_slots` - Detailed availability scheduling
    - `booking_requests` - Client booking requests
    - `platform_settings` - Configurable platform settings
    
  2. Security
    - RLS policies for all new tables
    - Secure booking system
    
  3. Features
    - Advanced scheduling system
    - Booking management
    - Platform configuration
*/

-- Companion availability slots
CREATE TABLE IF NOT EXISTS public.companion_availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  companion_id UUID NOT NULL REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  service_types TEXT[] DEFAULT ARRAY['basic_chat', 'premium_chat', 'video_call'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(companion_id, day_of_week, start_time)
);

-- Booking requests
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('basic_chat', 'premium_chat', 'video_call')),
  requested_date DATE NOT NULL,
  requested_start_time TIME NOT NULL,
  requested_duration INTEGER NOT NULL, -- in minutes
  estimated_cost DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  client_message TEXT,
  companion_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Platform settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Whether setting can be read by non-admins
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companion_availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companion_availability_slots
CREATE POLICY "Anyone can view availability slots" 
  ON public.companion_availability_slots 
  FOR SELECT 
  USING (true);

CREATE POLICY "Companions can manage their own availability" 
  ON public.companion_availability_slots 
  FOR ALL
  USING (
    companion_id IN (
      SELECT id FROM public.companion_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for booking_requests
CREATE POLICY "Clients can view their own booking requests" 
  ON public.booking_requests 
  FOR SELECT 
  USING (auth.uid() = client_id);

CREATE POLICY "Companions can view booking requests for them" 
  ON public.booking_requests 
  FOR SELECT 
  USING (
    companion_id IN (
      SELECT id FROM public.companion_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create booking requests" 
  ON public.booking_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own pending requests" 
  ON public.booking_requests 
  FOR UPDATE 
  USING (auth.uid() = client_id AND status = 'pending');

CREATE POLICY "Companions can update requests for them" 
  ON public.booking_requests 
  FOR UPDATE 
  USING (
    companion_id IN (
      SELECT id FROM public.companion_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for platform_settings
CREATE POLICY "Anyone can view public settings" 
  ON public.platform_settings 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Admins can manage all settings" 
  ON public.platform_settings 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_companion_availability_slots_updated_at
  BEFORE UPDATE ON public.companion_availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', '"AnimeDating"', 'string', 'Platform name', true),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', true),
('registration_enabled', 'true', 'boolean', 'Allow new user registrations', true),
('min_companion_age', '18', 'number', 'Minimum age for companions', false),
('max_companion_age', '65', 'number', 'Maximum age for companions', false),
('default_session_duration', '60', 'number', 'Default session duration in minutes', false),
('platform_commission_rate', '0.15', 'number', 'Platform commission rate (0.15 = 15%)', false),
('support_email', '"support@animedating.com"', 'string', 'Support email address', true),
('terms_version', '"1.0"', 'string', 'Current terms of service version', true),
('privacy_version', '"1.0"', 'string', 'Current privacy policy version', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Function to get platform setting
CREATE OR REPLACE FUNCTION public.get_platform_setting(key TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT setting_value
  FROM public.platform_settings
  WHERE setting_key = key AND (
    is_public = true OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );
$$;