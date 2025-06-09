-- Create banner_user_relationship table
CREATE TABLE IF NOT EXISTS public.banner_user_relationship (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    banner_id UUID NOT NULL REFERENCES public.banners(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(banner_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.banner_user_relationship ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.banner_user_relationship
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.banner_user_relationship
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.banner_user_relationship
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.banner_user_relationship
    FOR DELETE USING (auth.role() = 'authenticated'); 