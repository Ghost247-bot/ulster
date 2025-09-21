-- Fix accounts_account_type_check constraint
-- This migration ensures the constraint allows the expected account types

-- First, let's see what the current constraint looks like
-- (This is just for documentation - we'll drop and recreate it)

-- Drop the existing constraint if it exists
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_account_type_check;

-- Add the correct constraint that allows the expected account types
ALTER TABLE accounts ADD CONSTRAINT accounts_account_type_check 
CHECK (account_type IN ('checking', 'savings', 'investment', 'escrow'));

-- Add a comment to document the constraint
COMMENT ON CONSTRAINT accounts_account_type_check ON accounts IS 
'Ensures account_type is one of: checking, savings, investment, escrow';

-- Verify the constraint was created correctly
-- (This will show in the logs when the migration runs)
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'accounts_account_type_check';
