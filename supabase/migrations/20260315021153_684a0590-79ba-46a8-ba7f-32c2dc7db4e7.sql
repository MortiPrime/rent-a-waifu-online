-- Create storage bucket for companion photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('companion-photos', 'companion-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to companion-photos bucket
CREATE POLICY "Authenticated users can upload companion photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'companion-photos');

-- Allow public read access
CREATE POLICY "Public can view companion photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'companion-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own companion photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'companion-photos' AND (storage.foldername(name))[1] = auth.uid()::text);