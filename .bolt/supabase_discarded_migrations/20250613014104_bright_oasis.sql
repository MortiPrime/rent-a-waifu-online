/*
  # Analytics and Reporting Tables

  1. New Tables
    - `user_activity_logs` - Track user actions
    - `companion_analytics` - Companion performance metrics
    - `platform_metrics` - Overall platform statistics
    
  2. Security
    - RLS policies for data privacy
    - Admin-only access to sensitive metrics
    
  3. Features
    - User behavior tracking
    - Companion performance analytics
    - Revenue tracking
*/

-- User activity logs
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'login', 'chat_start', 'subscription_purchase', etc.
  activity_data JSONB, -- Additional data about the activity
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Companion analytics
CREATE TABLE IF NOT EXISTS public.companion_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  companion_id UUID REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  profile_views INTEGER DEFAULT 0,
  chat_sessions_started INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  average_session_duration INTEGER DEFAULT 0, -- in minutes
  client_satisfaction_rating DECIMAL(3,2), -- 1.00 to 5.00
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(companion_id, date)
);

-- Platform metrics
CREATE TABLE IF NOT EXISTS public.platform_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  new_registrations INTEGER DEFAULT 0,
  total_companions INTEGER DEFAULT 0,
  active_companions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  subscription_revenue DECIMAL(10,2) DEFAULT 0,
  chat_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companion_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activity_logs
CREATE POLICY "Users can view their own activity logs" 
  ON public.user_activity_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs" 
  ON public.user_activity_logs 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view all activity logs" 
  ON public.user_activity_logs 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- RLS Policies for companion_analytics
CREATE POLICY "Companions can view their own analytics" 
  ON public.companion_analytics 
  FOR SELECT 
  USING (
    companion_id IN (
      SELECT id FROM public.companion_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all companion analytics" 
  ON public.companion_analytics 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- RLS Policies for platform_metrics
CREATE POLICY "Only admins can view platform metrics" 
  ON public.platform_metrics 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_companion_analytics_updated_at
  BEFORE UPDATE ON public.companion_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  activity_type TEXT,
  activity_data JSONB DEFAULT NULL,
  target_user_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_activity_logs (
    user_id,
    activity_type,
    activity_data
  ) VALUES (
    COALESCE(target_user_id, auth.uid()),
    activity_type,
    activity_data
  );
END;
$$;