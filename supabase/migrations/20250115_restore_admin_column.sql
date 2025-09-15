-- Restore is_admin column to profiles table after rollback
-- This migration adds back the is_admin column that was removed in the rollback

-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Add comment to document the column
COMMENT ON COLUMN public.profiles.is_admin IS 'Indicates if the user has admin privileges';

-- Update existing admin users (if any exist with specific emails)
-- You can customize this based on your admin user emails
UPDATE public.profiles 
SET is_admin = true 
WHERE email IN ('admin@ulsterdelt.com', 'admin@ulsterdelt.com')
AND is_admin = false;

-- Add comment to document the restoration
COMMENT ON TABLE public.profiles IS 'User profiles table - is_admin column restored after rollback';
