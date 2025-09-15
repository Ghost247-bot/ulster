-- Fix Financial Goals Database Issue
-- This script restores the user_financial_goals table and is_admin column
-- Run this script on your Supabase database to fix the "Database table not found" error

-- 1. Add is_admin column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Add comment to document the column
COMMENT ON COLUMN public.profiles.is_admin IS 'Indicates if the user has admin privileges';

-- 2. Create user_financial_goals table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_financial_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  deadline DATE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  icon_name TEXT NOT NULL DEFAULT 'Target',
  color TEXT NOT NULL DEFAULT 'green',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_financial_goals_user_id ON user_financial_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_financial_goals_active ON user_financial_goals(is_active);
CREATE INDEX IF NOT EXISTS idx_user_financial_goals_deadline ON user_financial_goals(deadline);

-- Enable RLS
ALTER TABLE user_financial_goals ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own financial goals" ON user_financial_goals;
DROP POLICY IF EXISTS "Users can insert their own financial goals" ON user_financial_goals;
DROP POLICY IF EXISTS "Users can update their own financial goals" ON user_financial_goals;
DROP POLICY IF EXISTS "Users can delete their own financial goals" ON user_financial_goals;
DROP POLICY IF EXISTS "Admins can view all financial goals" ON user_financial_goals;
DROP POLICY IF EXISTS "Admins can insert financial goals" ON user_financial_goals;
DROP POLICY IF EXISTS "Admins can update financial goals" ON user_financial_goals;
DROP POLICY IF EXISTS "Admins can delete financial goals" ON user_financial_goals;

-- 4. Create RLS policies for users
CREATE POLICY "Users can view their own financial goals" ON user_financial_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial goals" ON user_financial_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial goals" ON user_financial_goals
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial goals" ON user_financial_goals
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Create admin policies
CREATE POLICY "Admins can view all financial goals" ON user_financial_goals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert financial goals" ON user_financial_goals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update financial goals" ON user_financial_goals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete financial goals" ON user_financial_goals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_financial_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_financial_goals_updated_at ON user_financial_goals;
CREATE TRIGGER update_user_financial_goals_updated_at
  BEFORE UPDATE ON user_financial_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_user_financial_goals_updated_at();

-- 8. Insert default financial goals for existing users (only if they don't exist)
INSERT INTO user_financial_goals (user_id, title, target_amount, current_amount, deadline, category, icon_name, color, display_order)
SELECT 
  u.id,
  'Emergency Fund',
  10000.00,
  7500.00,
  '2024-12-31',
  'Emergency',
  'Target',
  'green',
  1
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_financial_goals ufg WHERE ufg.user_id = u.id AND ufg.title = 'Emergency Fund'
);

INSERT INTO user_financial_goals (user_id, title, target_amount, current_amount, deadline, category, icon_name, color, display_order)
SELECT 
  u.id,
  'New Car',
  25000.00,
  15000.00,
  '2025-06-30',
  'Transportation',
  'Car',
  'blue',
  2
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_financial_goals ufg WHERE ufg.user_id = u.id AND ufg.title = 'New Car'
);

INSERT INTO user_financial_goals (user_id, title, target_amount, current_amount, deadline, category, icon_name, color, display_order)
SELECT 
  u.id,
  'Home Down Payment',
  50000.00,
  12000.00,
  '2025-12-31',
  'Housing',
  'Home',
  'purple',
  3
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_financial_goals ufg WHERE ufg.user_id = u.id AND ufg.title = 'Home Down Payment'
);

INSERT INTO user_financial_goals (user_id, title, target_amount, current_amount, deadline, category, icon_name, color, display_order)
SELECT 
  u.id,
  'Vacation Fund',
  5000.00,
  2000.00,
  '2024-08-15',
  'Travel',
  'Plane',
  'orange',
  4
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_financial_goals ufg WHERE ufg.user_id = u.id AND ufg.title = 'Vacation Fund'
);

-- 9. Set admin privileges for specific users (customize as needed)
-- Update this section with your admin user emails
UPDATE public.profiles 
SET is_admin = true 
WHERE email IN ('admin@ulsterdelt.com')
AND is_admin = false;

-- 10. Add comments to document the restoration
COMMENT ON TABLE user_financial_goals IS 'User financial goals table - restored after rollback';
COMMENT ON TABLE public.profiles IS 'User profiles table - is_admin column restored after rollback';

-- Success message
SELECT 'Financial goals table and admin column have been successfully restored!' as status;
