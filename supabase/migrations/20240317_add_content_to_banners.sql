-- Add content column to banners table
ALTER TABLE public.banners
ADD COLUMN IF NOT EXISTS content TEXT; 