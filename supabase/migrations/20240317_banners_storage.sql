-- Create storage bucket for banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the banners bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Authenticated users can upload banner images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'banners'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update banner images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'banners'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete banner images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'banners'
    AND auth.role() = 'authenticated'
); 
 