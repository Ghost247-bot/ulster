-- Fix user_upcoming_bills policies to ensure admin access works
-- Run this directly in the Supabase SQL editor

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Users can insert their own upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Users can update their own upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Users can delete their own upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can view all upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can insert upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can update upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can delete upcoming bills" ON user_upcoming_bills;

-- Create user policies
CREATE POLICY "Users can view their own upcoming bills" ON user_upcoming_bills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own upcoming bills" ON user_upcoming_bills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own upcoming bills" ON user_upcoming_bills
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upcoming bills" ON user_upcoming_bills
  FOR DELETE USING (auth.uid() = user_id);

-- Create admin policies (assuming profiles table has is_admin column)
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
  )
  WITH CHECK (
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
