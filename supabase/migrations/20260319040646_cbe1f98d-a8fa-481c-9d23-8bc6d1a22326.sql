
-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_listing_id UUID NOT NULL REFERENCES public.companion_listings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reviewer_id, companion_listing_id)
);

-- Validation trigger instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_review_rating()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  IF NEW.status NOT IN ('pending', 'published', 'hidden', 'flagged') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_review_before_insert_update
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_review_rating();

-- Updated_at trigger
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published reviews"
  ON public.reviews
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Admins can manage all reviews"
  ON public.reviews
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
