-- First, drop the existing foreign key constraint to auth.users
ALTER TABLE public.banner_user_relationship
    DROP CONSTRAINT IF EXISTS banner_user_relationship_user_id_fkey;

-- Add the new foreign key constraint to profiles
ALTER TABLE public.banner_user_relationship
    ADD CONSTRAINT banner_user_relationship_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;

-- Ensure profiles exist for all users in banner_user_relationship
INSERT INTO public.profiles (id)
SELECT DISTINCT user_id
FROM public.banner_user_relationship
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = banner_user_relationship.user_id
)
ON CONFLICT (id) DO NOTHING; 