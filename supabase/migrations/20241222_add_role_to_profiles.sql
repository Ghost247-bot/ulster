-- Add role column to profiles table
-- This column will be used to distinguish between regular users and admins
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('user', 'admin')) NOT NULL DEFAULT 'user';

-- Add index for better performance when querying by role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Add comment to document the field purpose
COMMENT ON COLUMN public.profiles.role IS 'User role: user (default) or admin';

-- Update any existing profiles to have the default 'user' role
UPDATE public.profiles 
SET role = 'user' 
WHERE role IS NULL;
