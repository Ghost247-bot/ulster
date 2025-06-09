-- Make image_url column nullable
ALTER TABLE public.banners ALTER COLUMN image_url DROP NOT NULL; 