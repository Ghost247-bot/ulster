-- Update RLS policies to enforce admin freeze restrictions
-- This policy prevents users from unfreezing accounts that were frozen by admins

-- Drop the existing update policy for regular users
DROP POLICY IF EXISTS "Users can update their own accounts" ON accounts;

-- Create a new policy that allows users to update their accounts
-- but prevents unfreezing accounts that were frozen by admins
CREATE POLICY "Users can update their own accounts with freeze restrictions"
ON accounts
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND NOT (
    -- Prevent unfreezing accounts that were frozen by admin
    is_frozen = false 
    AND frozen_by_admin = true
  )
)
WITH CHECK (
  user_id = auth.uid()
  AND NOT (
    -- Prevent unfreezing accounts that were frozen by admin
    is_frozen = false 
    AND frozen_by_admin = true
  )
);

-- Add a comment to document the policy
COMMENT ON POLICY "Users can update their own accounts with freeze restrictions" ON accounts IS 
'Allows users to update their own accounts but prevents unfreezing accounts that were frozen by administrators.';
