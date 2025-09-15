-- Rollback recent database changes to restore Table Editor functionality
-- This migration undoes changes made in recent migrations

-- 1. Drop the frozen_by_admin column from accounts table
ALTER TABLE accounts DROP COLUMN IF EXISTS frozen_by_admin;
DROP INDEX IF EXISTS idx_accounts_frozen_by_admin;

-- 2. Restore the original accounts update policy
DROP POLICY IF EXISTS "Users can update their own accounts with freeze restrictions" ON accounts;
CREATE POLICY "Users can update their own accounts" ON accounts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Drop the user_financial_goals table and related functions
DROP TRIGGER IF EXISTS update_user_financial_goals_updated_at ON user_financial_goals;
DROP FUNCTION IF EXISTS update_user_financial_goals_updated_at();
DROP TABLE IF EXISTS user_financial_goals CASCADE;

-- 4. Remove the role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
DROP INDEX IF EXISTS idx_profiles_role;

-- 5. Remove the is_admin column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;

-- 6. Drop all admin-related policies that depend on is_admin
-- Drop policies from user_statistics_cards
DROP POLICY IF EXISTS "Admins can view all statistics cards" ON user_statistics_cards;
DROP POLICY IF EXISTS "Admins can insert statistics cards" ON user_statistics_cards;
DROP POLICY IF EXISTS "Admins can update statistics cards" ON user_statistics_cards;
DROP POLICY IF EXISTS "Admins can delete statistics cards" ON user_statistics_cards;

-- Drop policies from user_upcoming_bills
DROP POLICY IF EXISTS "Admins can view all upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can insert upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can update upcoming bills" ON user_upcoming_bills;
DROP POLICY IF EXISTS "Admins can delete upcoming bills" ON user_upcoming_bills;

-- Drop policies from notifications
DROP POLICY IF EXISTS "Admin users have full access to notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- 7. Restore simple user-only policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 8. Drop the table editor functions that may be causing issues
DROP FUNCTION IF EXISTS get_table_info();
DROP FUNCTION IF EXISTS get_table_row_counts();
DROP FUNCTION IF EXISTS get_comprehensive_table_info();
DROP FUNCTION IF EXISTS execute_safe_sql(TEXT);

-- 9. Drop the RLS policy for SQL execution
DROP POLICY IF EXISTS "Only admins can execute SQL" ON profiles;

-- 10. Clean up any remaining admin-related policies
DROP POLICY IF EXISTS "Admins can delete financial goals" ON user_financial_goals;

-- 11. Ensure basic RLS policies are in place for user_statistics_cards
CREATE POLICY "Users can view their own statistics cards" ON user_statistics_cards
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own statistics cards" ON user_statistics_cards
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own statistics cards" ON user_statistics_cards
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own statistics cards" ON user_statistics_cards
  FOR DELETE USING (user_id = auth.uid());

-- 12. Ensure basic RLS policies are in place for user_upcoming_bills
CREATE POLICY "Users can view their own upcoming bills" ON user_upcoming_bills
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own upcoming bills" ON user_upcoming_bills
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own upcoming bills" ON user_upcoming_bills
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own upcoming bills" ON user_upcoming_bills
  FOR DELETE USING (user_id = auth.uid());

-- 13. Add comment to document the rollback
COMMENT ON TABLE accounts IS 'User accounts table - rolled back to basic functionality';
COMMENT ON TABLE profiles IS 'User profiles table - rolled back to basic structure';
