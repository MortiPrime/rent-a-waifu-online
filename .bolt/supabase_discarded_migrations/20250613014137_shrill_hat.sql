/*
  # Review and Rating System

  1. New Tables
    - `reviews` - User reviews for companions
    - `review_responses` - Companion responses to reviews
    
  2. Security
    - RLS policies for review privacy
    - Moderation controls
    
  3. Features
    - 5-star rating system
    - Review moderation
    - Response system
    - Analytics integration
*/

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  chat_session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false, -- Verified purchase/session
  status TEXT DEFAULT 'published' CHECK (status IN ('pending', 'published', 'hidden', 'flagged')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reviewer_id, companion_id) -- One review per user per companion
);

-- Review responses table
CREATE TABLE IF NOT EXISTS public.review_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.companion_profiles(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(review_id) -- One response per review
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Anyone can view published reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Users can create reviews for sessions they participated in" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = chat_session_id AND client_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Companions can view reviews about them" 
  ON public.reviews 
  FOR SELECT 
  USING (
    companion_id IN (
      SELECT id FROM public.companion_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all reviews" 
  ON public.reviews 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- RLS Policies for review_responses
CREATE POLICY "Anyone can view public review responses" 
  ON public.review_responses 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Companions can manage responses to their reviews" 
  ON public.review_responses 
  FOR ALL
  USING (
    companion_id IN (
      SELECT id FROM public.companion_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all review responses" 
  ON public.review_responses 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_review_responses_updated_at
  BEFORE UPDATE ON public.review_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate companion average rating
CREATE OR REPLACE FUNCTION public.get_companion_average_rating(companion_uuid UUID)
RETURNS DECIMAL(3,2)
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(AVG(rating), 0)::DECIMAL(3,2)
  FROM public.reviews
  WHERE companion_id = companion_uuid AND status = 'published';
$$;

-- Function to get companion review count
CREATE OR REPLACE FUNCTION public.get_companion_review_count(companion_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.reviews
  WHERE companion_id = companion_uuid AND status = 'published';
$$;