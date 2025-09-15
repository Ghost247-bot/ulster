-- Fix profiles table structure to include missing fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Update existing profiles with data from auth.users
UPDATE public.profiles 
SET 
  email = au.email,
  first_name = COALESCE(au.raw_user_meta_data->>'first_name', ''),
  last_name = COALESCE(au.raw_user_meta_data->>'last_name', '')
FROM auth.users au 
WHERE profiles.id = au.id;

-- Fix incomplete RLS policy for user_financial_goals delete
DROP POLICY IF EXISTS "Admins can delete financial goals" ON user_financial_goals;

CREATE POLICY "Admins can delete financial goals" ON user_financial_goals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Fix inconsistent admin field references in other tables
-- Update user_upcoming_bills policies
DROP POLICY IF EXISTS "Admins can view all upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can insert upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can update upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can delete upcoming bills" ON user_upcoming_bills;

CREATE POLICY "Admins can view all upcoming bills" ON user_upcoming_bills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert upcoming bills" ON user_upcoming_bills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update upcoming bills" ON user_upcoming_bills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete upcoming bills" ON user_upcoming_bills
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Update user_statistics_cards policies
DROP POLICY IF EXISTS "Admins can view all statistics cards" ON user_statistics_cards;
DROP POLICY IF EXISTS "Admins can insert statistics cards" ON user_statistics_cards;
DROP POLICY IF EXISTS "Admins can update statistics cards" ON user_statistics_cards;
DROP POLICY IF EXISTS "Admins can delete statistics cards" ON user_statistics_cards;

CREATE POLICY "Admins can view all statistics cards" ON user_statistics_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert statistics cards" ON user_statistics_cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update statistics cards" ON user_statistics_cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete statistics cards" ON user_statistics_cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Add comment to document the changes
COMMENT ON COLUMN public.profiles.first_name IS 'User first name';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name';
COMMENT ON COLUMN public.profiles.email IS 'User email address';
COMMENT ON COLUMN public.profiles.is_admin IS 'Indicates if the user has admin privileges';
